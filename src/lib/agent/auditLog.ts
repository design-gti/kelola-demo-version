import type { SessionRole } from "@/lib/session";

export interface AgentAuditEvent {
  sessionRole: SessionRole;
  action: string;
  detail?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Floor implementation: structured console output, which Vercel captures as
 * Runtime Logs. Good enough for local debugging, but NOT a durable audit
 * trail — Vercel functions have an ephemeral filesystem and Runtime Logs
 * have a limited retention window. Before this goes beyond internal
 * testing, also ship these events to an external sink (Upstash Redis/Vercel
 * KV, or a free-tier Postgres) so "why did the assistant tell this manager
 * that" stays answerable long after the fact — this floor is what makes
 * that later backfill possible, since the raw events were captured from
 * day one.
 */
export function logAgentEvent(event: Omit<AgentAuditEvent, "timestamp">): void {
  const full: AgentAuditEvent = { ...event, timestamp: new Date().toISOString() };
  console.info("[agent-audit]", JSON.stringify(full));
}
