import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

/**
 * @copilotkit/react-ui's CopilotChat `instructions` prop (AssistantPanel.tsx)
 * does nothing in this exact package version (1.63.3-canary.rc-1): it's
 * stored into a React context field (`chatInstructions`) that is set but
 * never read anywhere in the @copilotkit dependency tree (confirmed by
 * grepping every @copilotkit package for that field name). Middleware
 * (`middleware.onBeforeRequest`) is also unusable — defining it at all
 * crashes this version's internal "runtime info" discovery request.
 *
 * Verified directly (route.ts, CopilotRuntime.handleServiceAdapter): with no
 * explicit `agents` map configured, CopilotRuntime builds a BuiltInAgent from
 * `serviceAdapter.getLanguageModel()` — NOT from the adapter's own
 * hand-rolled `.process()` method (that method exists but is dead code for
 * this exact no-agents-configured path). getLanguageModel() constructs a
 * brand-new Vercel AI SDK model via @ai-sdk/openai's/@ai-sdk/anthropic's
 * createOpenAI()/createAnthropic(), reusing only baseURL/apiKey/headers/fetch
 * from the SDK client instance — so wrapping the client's own `.chat.
 * completions.stream`/`.messages.create` methods (an earlier attempt at this
 * fix) never gets invoked; the AI SDK's own HTTP layer is what actually
 * fires. The one thing that DOES carry through is a custom `fetch` function
 * passed to the client constructor (@copilotkit/runtime's
 * getSdkClientOptions reads it off the client and forwards it into
 * createOpenAI/createAnthropic) — so intercepting fetch is the correct,
 * verified injection point. Confirmed live by logging the raw outgoing body:
 * OpenAI's default model here calls the Responses API (fields model/input/
 * tools/tool_choice/stream — no `messages` array), so the injection target
 * is the top-level `instructions` field, not a leading system message.
 */

function injectOpenAISystemMessage(rawBody: string, systemPrompt: string): string {
  const body = JSON.parse(rawBody);
  // Responses API shape (what createOpenAI()'s default model uses).
  if ("input" in body) {
    if (typeof body.instructions !== "string" || !body.instructions.length) body.instructions = systemPrompt;
    return JSON.stringify(body);
  }
  // Classic Chat Completions shape, kept as a fallback in case a future
  // @ai-sdk/openai version (or a different model config) routes here instead.
  if (Array.isArray(body.messages)) {
    const hasLeading = body.messages[0]?.role === "system" || body.messages[0]?.role === "developer";
    if (!hasLeading) body.messages = [{ role: "system", content: systemPrompt }, ...body.messages];
    return JSON.stringify(body);
  }
  return rawBody;
}

function injectAnthropicSystemMessage(rawBody: string, systemPrompt: string): string {
  const body = JSON.parse(rawBody);
  body.system = systemPrompt;
  return JSON.stringify(body);
}

export function openAIWithSystemPrompt(systemPrompt: string): OpenAI {
  const customFetch: typeof fetch = async (input, init) => {
    if (init?.body && typeof init.body === "string") {
      init = { ...init, body: injectOpenAISystemMessage(init.body, systemPrompt) };
    }
    return fetch(input, init);
  };
  return new OpenAI({ fetch: customFetch });
}

export function anthropicWithSystemPrompt(systemPrompt: string): Anthropic {
  const customFetch: typeof fetch = async (input, init) => {
    if (init?.body && typeof init.body === "string") {
      init = { ...init, body: injectAnthropicSystemMessage(init.body, systemPrompt) };
    }
    return fetch(input, init);
  };
  return new Anthropic({ fetch: customFetch });
}
