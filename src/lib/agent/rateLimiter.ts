/**
 * In-memory sliding-window rate limiter, keyed by session/IP. Per-process
 * only — Vercel runs multiple concurrent function instances, so this is
 * best-effort per instance, not a real global limit. This is the honest
 * floor for local dev and early internal testing; upgrade to Upstash
 * Redis/Vercel KV before this route handles real external traffic (the
 * same store is worth reusing for auditLog.ts's durable sink).
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;

const hits = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
  const timestamps = (hits.get(key) ?? []).filter(t => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, timestamps);
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - timestamps.length };
}
