import { NextRequest, NextResponse } from "next/server";
import { CopilotRuntime, AnthropicAdapter, OpenAIAdapter, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import type { Action } from "@copilotkit/shared";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";
import { checkRateLimit } from "@/lib/agent/rateLimiter";
import { buildBackendActions } from "@/lib/agent/tools";

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

  const { allowed } = checkRateLimit(rawCookie!);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded, try again shortly" }, { status: 429 });
  }

  // Backend (data-reading) actions only — these run server-side and go
  // through the mediation layer, never returning raw src/data/* fixtures.
  // Navigation actions live client-side in CopilotProvider.tsx instead, since
  // only the browser has a router/DOM.
  const actions = buildBackendActions(session);

  // CopilotRuntime's Action<T> generic can't cleanly express "these four
  // actions each have their own independent parameter list" in one array
  // literal — T collapses to a union handler signature that rejects the
  // one action with a required parameter. The cast is a type-system
  // limitation workaround, not a runtime behavior change: CopilotRuntime
  // dispatches each tool call to the matching action by name and invokes
  // that action's own handler with that action's own declared parameters.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const copilotRuntime = new CopilotRuntime({ actions: actions as unknown as Action<any>[] });

  // Ruled out for this exact @copilotkit/runtime version: GoogleGenerativeAIAdapter's
  // tool-result event doesn't carry the tool's actual return content (Gemini errors on
  // any turn after a tool call). Groq only works via a baseURL hack because
  // CopilotRuntime's default-agent resolution (handleServiceAdapter, in
  // lib/runtime/copilot-runtime.mjs) always drives requests through
  // serviceAdapter.getLanguageModel() when no explicit `agents` map is given — and for
  // Groq/OpenAI-shaped adapters that calls @ai-sdk/openai's Responses API, which
  // Groq's endpoint doesn't implement (only classic Chat Completions). Anthropic and
  // real OpenAI both hit zero bugs: Anthropic has its own getLanguageModel(), and
  // OpenAI's actual endpoint does implement the Responses API, so no mismatch occurs.
  // Both are paid (no free tier) — set LLM_PROVIDER to whichever key is available.
  const serviceAdapter =
    process.env.LLM_PROVIDER === "openai"
      ? new OpenAIAdapter({ model: "gpt-5.6-luna" })
      : new AnthropicAdapter({ model: "claude-sonnet-5" });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: copilotRuntime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
}
