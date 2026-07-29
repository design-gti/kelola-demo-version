import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { ASSISTANT_INSTRUCTIONS } from "@/lib/agent/instructions";
import type { BackendAction, BackendActionParam } from "@/lib/agent/tools";
import type { ToolTrace } from "./cases";

const MAX_TOOL_ITERATIONS = 6;

function toInputSchema(params: readonly BackendActionParam[]) {
  const properties: Record<string, { type: string; description: string }> = {};
  const required: string[] = [];
  for (const p of params) {
    properties[p.name] = { type: p.type, description: p.description };
    if (p.required) required.push(p.name);
  }
  return { type: "object" as const, properties, required };
}

async function runOpenAITurn(question: string, actions: BackendAction[]) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const actionByName = new Map(actions.map(a => [a.name, a]));
  const tools: OpenAI.Chat.ChatCompletionTool[] = actions.map(a => ({
    type: "function",
    function: { name: a.name, description: a.description, parameters: toInputSchema(a.parameters) },
  }));

  const trace: ToolTrace[] = [];
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: ASSISTANT_INSTRUCTIONS },
    { role: "user", content: question },
  ];

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    // gpt-5.6-luna rejects function tools over /v1/chat/completions unless
    // reasoning_effort is explicitly turned off (400: "Function tools with
    // reasoning_effort are not supported ... set reasoning_effort to 'none'").
    const response = await client.chat.completions.create({
      model: "gpt-5.6-luna",
      messages,
      tools,
      reasoning_effort: "none",
    });
    const choice = response.choices[0];
    messages.push(choice.message);

    const toolCalls = choice.message.tool_calls;
    if (!toolCalls?.length) {
      return { trace, finalText: choice.message.content ?? "" };
    }

    for (const call of toolCalls) {
      if (call.type !== "function") continue; // this app never defines custom (non-function) tools
      const action = actionByName.get(call.function.name);
      const input = JSON.parse(call.function.arguments || "{}");
      const output = action ? await action.handler(input) : { error: `Unknown tool: ${call.function.name}` };
      trace.push({ name: call.function.name, input, output });
      messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(output) });
    }
  }

  return { trace, finalText: "[max tool-call iterations reached without a final answer]" };
}

async function runAnthropicTurn(question: string, actions: BackendAction[]) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const actionByName = new Map(actions.map(a => [a.name, a]));
  const tools = actions.map(a => ({
    name: a.name,
    description: a.description,
    input_schema: toInputSchema(a.parameters),
  }));

  const trace: ToolTrace[] = [];
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: question }];

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      system: ASSISTANT_INSTRUCTIONS,
      tools,
      messages,
    });

    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason !== "tool_use") {
      const finalText = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map(b => b.text)
        .join("\n");
      return { trace, finalText };
    }

    const toolUseBlocks = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of toolUseBlocks) {
      const action = actionByName.get(block.name);
      const output = action ? await action.handler(block.input) : { error: `Unknown tool: ${block.name}` };
      trace.push({ name: block.name, input: block.input as Record<string, unknown>, output });
      toolResults.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(output) });
    }
    messages.push({ role: "user", content: toolResults });
  }

  return { trace, finalText: "[max tool-call iterations reached without a final answer]" };
}

/**
 * Runs one user question through the real tool-calling loop — same system
 * instructions, same backend action handlers, and same provider branching
 * (LLM_PROVIDER env var) as production (/api/copilotkit), just driven
 * directly via the provider SDK instead of CopilotRuntime's wire protocol,
 * so this can run headless in a script instead of needing a browser. Always
 * mirrors route.ts's own condition — if that ever changes, update both.
 */
export async function runAssistantTurn(
  question: string,
  actions: BackendAction[]
): Promise<{ trace: ToolTrace[]; finalText: string }> {
  return process.env.LLM_PROVIDER === "openai" ? runOpenAITurn(question, actions) : runAnthropicTurn(question, actions);
}
