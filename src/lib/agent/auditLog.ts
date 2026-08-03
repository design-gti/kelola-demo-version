import { after } from "next/server";
import type { SessionRole } from "@/lib/session";
import { isAuditStoreConfigured, persistAuditEvent } from "./auditStore";

export interface AgentAuditEvent {
  sessionRole: SessionRole;
  action: string;
  detail?: Record<string, unknown>;
  /** Correlates a "question" event with the tool-call events triggered by the same request — see route.ts. */
  requestId?: string;
  timestamp: string;
}

/**
 * Floor: structured console output, which Vercel captures as Runtime Logs —
 * good enough for local debugging, but NOT a durable audit trail on its own
 * (ephemeral filesystem, limited log retention). When auditStore.ts's
 * optional Redis sink is configured, every event is also persisted there via
 * Next's after() so "why did the assistant tell this manager that" (and
 * GET /api/feedback/export's CSV recap) stay answerable long after the fact,
 * without adding Redis round-trip latency to the response the user is
 * waiting on.
 *
 * after() throws when called outside a real request scope — true for
 * scripts/eval/assistant.eval.ts, which calls tools.ts's buildBackendActions
 * directly, bypassing Next's request lifecycle entirely. Gate + swallow
 * rather than let that take down eval runs or any other non-request caller.
 */
export function logAgentEvent(event: Omit<AgentAuditEvent, "timestamp">): void {
  const full: AgentAuditEvent = { ...event, timestamp: new Date().toISOString() };
  console.info("[agent-audit]", JSON.stringify(full));
  if (isAuditStoreConfigured()) {
    try {
      after(() => persistAuditEvent(full).catch(() => {}));
    } catch {
      // No active request scope — persistence is best-effort only, never required.
    }
  }
}
