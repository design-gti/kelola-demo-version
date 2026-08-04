import { describe, expect, it, vi } from "vitest";
import { logAgentEvent } from "./auditLog";

vi.mock("./auditStore", () => ({
  isAuditStoreConfigured: () => true,
  persistAuditEvent: vi.fn(),
}));

describe("logAgentEvent", () => {
  it("never throws even when the audit store is configured but there's no active request scope", () => {
    // Mirrors scripts/eval/assistant.eval.ts calling tools.ts's
    // buildBackendActions directly — next/server's after() throws when
    // called outside real request handling, and this must be swallowed,
    // not propagated up through every tool call.
    expect(() =>
      logAgentEvent({ sessionRole: "hr", action: "getSuccessionRiskSummary" })
    ).not.toThrow();
  });
});
