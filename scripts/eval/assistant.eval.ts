import { describe, expect, it } from "vitest";
import { buildBackendActions } from "@/lib/agent/tools";
import type { SessionContext } from "@/lib/session";
import { EVAL_CASES } from "./cases";
import { runAssistantTurn } from "./runner";

// Role/scope restriction is intentionally disabled in mediation.ts (every
// session sees the full pool) — see that file's module comment. "hr" here
// is just a valid, unscoped session shape, not a meaningful choice.
const evalSession: SessionContext = { role: "hr", scopeIds: null, issuedAt: 0 };
const actions = buildBackendActions(evalSession);

describe("assistant eval", () => {
  for (const evalCase of EVAL_CASES) {
    it(`${evalCase.id} — ${evalCase.question}`, async () => {
      const { trace, finalText } = await runAssistantTurn(evalCase.question, actions);
      const result = evalCase.check(trace, finalText);

      if (!result.pass) {
        const toolLog = trace.map(t => `${t.name}(${JSON.stringify(t.input)})`).join(", ") || "(none)";
        console.error(
          `\n[${evalCase.id}] FAILED: ${result.reason}\n` +
            `  Question: ${evalCase.question}\n` +
            `  Tools called: ${toolLog}\n` +
            `  Final text: ${finalText}\n`
        );
      }

      expect(result.pass, result.reason).toBe(true);
    });
  }
});
