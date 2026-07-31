import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { CopilotRuntime, AnthropicAdapter, OpenAIAdapter, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import type { Action } from "@copilotkit/shared";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { checkRateLimit } from "@/lib/agent/rateLimiter";
import { logAgentEvent } from "@/lib/agent/auditLog";
import { buildBackendActions } from "@/lib/agent/tools";
import { ASSISTANT_INSTRUCTIONS } from "@/lib/agent/instructions";
import { openAIWithSystemPrompt, anthropicWithSystemPrompt } from "@/lib/agent/llmClients";

// Explicit Node runtime: the Google Generative AI SDK and CopilotRuntime assume Node APIs.
export const runtime = "nodejs";
// Bound the tool-call loop's wall-clock; check this against the actual Vercel
// plan's function-duration ceiling before deploying (varies by plan).
export const maxDuration = 30;

const MAX_BODY_BYTES = 100_000;

export async function POST(req: NextRequest) {
  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }

  const rawCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(rawCookie);
  if (!session) {
    return NextResponse.json({ error: "No session — POST /api/session first" }, { status: 401 });
  }

  const { allowed, reason } = checkRateLimit(rawCookie!);
  if (!allowed) {
    const message = reason === "daily" ? "Daily usage limit reached, try again tomorrow" : "Rate limit exceeded, try again shortly";
    return NextResponse.json({ error: message }, { status: 429 });
  }

  // Correlates this request's "question" audit event with every tool-call
  // audit event it triggers — see scripts/harvest-questions.mjs, which groups
  // by this id to reconstruct "which questions led to which tool calls" from
  // the raw audit log.
  const requestId = randomUUID();

  // Capture the user's question text for scripts/harvest-questions.mjs.
  // Deliberately NOT using CopilotRuntime's middleware.onBeforeRequest for
  // this — verified directly that defining `middleware` at all (regardless
  // of what the callback does) crashes this exact @copilotkit/runtime
  // version's internal "runtime info" discovery request and takes down the
  // whole endpoint. Parsing the raw body instead is empirically confirmed
  // safe: a real turn's body is JSON shaped as
  // { body: { messages: [{ id, content, role }, ...] } } (checked via a live
  // request, not the older GraphQL protocol this package's dist/graphql/
  // folder might suggest). req.clone() so handleRequest below still gets an
  // unconsumed body; wrapped defensively since other request shapes (like
  // the discovery call) won't match and must never break the real request.
  try {
    const parsedBody = await req.clone().json();
    const messages = parsedBody?.body?.messages;
    const lastUserMessage = Array.isArray(messages) ? [...messages].reverse().find(m => m?.role === "user") : undefined;
    if (typeof lastUserMessage?.content === "string") {
      logAgentEvent({ sessionRole: session.role, action: "question", detail: { text: lastUserMessage.content }, requestId });
    }
  } catch {
    // Best-effort only — question capture must never break the real request.
  }

  // Backend (data-reading) actions only — these run server-side and go
  // through the mediation layer, never returning raw src/data/* fixtures.
  // Navigation actions live client-side in CopilotProvider.tsx instead, since
  // only the browser has a router/DOM.
  const actions = buildBackendActions(session, requestId);

  // CopilotRuntime's Action<T> generic can't cleanly express "these four
  // actions each have their own independent parameter list" in one array
  // literal — T collapses to a union handler signature that rejects the
  // one action with a required parameter. The cast is a type-system
  // limitation workaround, not a runtime behavior change: CopilotRuntime
  // dispatches each tool call to the matching action by name and invokes
  // that action's own handler with that action's own declared parameters.
  const copilotRuntime = new CopilotRuntime({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actions: actions as unknown as Action<any>[],
  });

  // Ruled out for this exact @copilotkit/runtime version: GoogleGenerativeAIAdapter's
  // tool-result event doesn't carry the tool's actual return content (Gemini errors on
  // any turn after a tool call). Both OpenAI and Anthropic are paid (no free tier) —
  // set LLM_PROVIDER to whichever key is available.
  //
  // IMPORTANT — this route has NO explicit `agents` map, so CopilotRuntime.
  // handleServiceAdapter() (node_modules/@copilotkit/runtime/dist/lib/runtime/
  // copilot-runtime.mjs) builds its default agent from serviceAdapter.getLanguageModel()
  // — NOT from the adapter's own hand-rolled .process() method (dead code on this exact
  // path; a `.process()`-reading earlier version of this comment was wrong about which
  // code actually runs). getLanguageModel() constructs a fresh Vercel AI SDK model via
  // @ai-sdk/openai's createOpenAI(), which — confirmed by directly inspecting the raw
  // outgoing HTTP body — calls OpenAI's Responses API (fields: model/input/tools/
  // tool_choice/stream, no `messages` array, no `instructions` field unless supplied).
  //
  // The client passed in is NOT a plain `new OpenAI()`/`new Anthropic()` — see
  // src/lib/agent/llmClients.ts. CopilotChat's `instructions` prop (AssistantPanel.tsx)
  // does nothing in this exact package version (verified: dead context field, never read
  // anywhere in @copilotkit), so ASSISTANT_INSTRUCTIONS is injected by wrapping the
  // client's `fetch` — the one option getLanguageModel() actually forwards into
  // createOpenAI()/createAnthropic() — to set the Responses API's `instructions` field
  // (OpenAI) or the top-level `system` field (Anthropic) directly on the outgoing
  // request. Verified live via curl: identical question, zero tool calls, correct
  // refusal text, after this fix (previously reproduced 100% of the time before it).
  const serviceAdapter =
    process.env.LLM_PROVIDER === "openai"
      ? new OpenAIAdapter({ openai: openAIWithSystemPrompt(ASSISTANT_INSTRUCTIONS), model: "gpt-5.6-luna", keepSystemRole: true })
      : new AnthropicAdapter({ anthropic: anthropicWithSystemPrompt(ASSISTANT_INSTRUCTIONS), model: "claude-sonnet-5" });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: copilotRuntime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
}
