import { Redis } from "@upstash/redis";
import type { AgentAuditEvent } from "./auditLog";

/**
 * Durable, entirely optional sink for every [agent-audit] event (question,
 * tool call, feedback) — the external store auditLog.ts's own comment says
 * this app needs before going beyond internal testing, and rateLimiter.ts's
 * comment names the same store as worth reusing. With no
 * UPSTASH_REDIS_REST_URL/TOKEN set (or the KV_REST_API_* names Vercel's
 * Upstash Marketplace integration uses instead), every function here is a
 * no-op and the app behaves exactly as before — console/Vercel Runtime Logs
 * only. See .env.example for how to provision the free tier.
 */

const LIST_KEY = "agent-audit-events";
const MAX_ENTRIES = 5000;

let client: Redis | null | undefined;

function getClient(): Redis | null {
  if (client !== undefined) return client;
  const hasUrl = !!(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL);
  const hasToken = !!(process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN);
  client = hasUrl && hasToken ? Redis.fromEnv() : null;
  return client;
}

export function isAuditStoreConfigured(): boolean {
  return getClient() !== null;
}

export async function persistAuditEvent(event: AgentAuditEvent): Promise<void> {
  const redis = getClient();
  if (!redis) return;
  await redis.rpush<string>(LIST_KEY, JSON.stringify(event));
  // Capped so an unattended demo instance can't grow this list forever.
  await redis.ltrim(LIST_KEY, -MAX_ENTRIES, -1);
}

export async function listAuditEvents(): Promise<AgentAuditEvent[]> {
  const redis = getClient();
  if (!redis) return [];
  // @upstash/redis auto-JSON-deserializes list members on read, so entries
  // already come back as objects, not strings — see rpush's JSON.stringify
  // above for the write side of that contract.
  const entries = await redis.lrange<AgentAuditEvent>(LIST_KEY, 0, -1);
  return entries.filter((e): e is AgentAuditEvent => !!e && typeof e === "object" && typeof e.action === "string");
}
