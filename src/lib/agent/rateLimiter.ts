/**
 * In-memory sliding-window rate limiter, keyed by session/IP. Per-process
 * only — Vercel runs multiple concurrent function instances, so this is
 * best-effort per instance, not a real global limit. This is the honest
 * floor for local dev and early internal testing; upgrade to Upstash
 * Redis/Vercel KV before this route handles real external traffic (the
 * same store is worth reusing for auditLog.ts's durable sink).
 *
 * Two tiers, checked independently: a short burst window (catches a runaway
 * client/loop) and a daily ceiling (a real cost cap — internal testing has
 * no per-user token budget yet, so total *request count* per day is the
 * cheapest available proxy for total LLM spend per session).
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;

const DAY_MS = 24 * 60 * 60_000;
const MAX_REQUESTS_PER_DAY = 300;

const burstHits = new Map<string, number[]>();
const dailyHits = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reason?: "burst" | "daily";
}

export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
  const burstTimestamps = (burstHits.get(key) ?? []).filter(t => now - t < WINDOW_MS);
  if (burstTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    burstHits.set(key, burstTimestamps);
    return { allowed: false, remaining: 0, reason: "burst" };
  }

  const dailyTimestamps = (dailyHits.get(key) ?? []).filter(t => now - t < DAY_MS);
  if (dailyTimestamps.length >= MAX_REQUESTS_PER_DAY) {
    dailyHits.set(key, dailyTimestamps);
    return { allowed: false, remaining: 0, reason: "daily" };
  }

  burstTimestamps.push(now);
  burstHits.set(key, burstTimestamps);
  dailyTimestamps.push(now);
  dailyHits.set(key, dailyTimestamps);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - burstTimestamps.length };
}
