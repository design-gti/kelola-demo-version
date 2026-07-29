import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Server-only. Never import this from a "use client" file or the src/lib/data
 * barrel — node:crypto can't be bundled for the browser (see vismapAdapter.ts
 * for the same class of mistake made and fixed elsewhere in this codebase).
 *
 * This is deliberately NOT a real auth system — there is no login, no
 * password, no identity provider anywhere in this app. It's the minimum
 * viable trust boundary: once a user picks a persona, the SERVER signs a
 * cookie naming that role, and every agent tool trusts only that signed
 * cookie — never a client-supplied field (e.g. the existing HR/Manager
 * SegmentedControl's React state, which is exactly as spoofable as editing
 * localStorage). Swapping this for real SSO later only requires changing
 * how the session payload is produced, not how every tool consumes it.
 */

export type SessionRole = "hr" | "manager";

export interface SessionContext {
  role: SessionRole;
  /** Candidate ids this session may see individual detail for; null = unrestricted (hr). */
  scopeIds: string[] | null;
  issuedAt: number;
}

export const SESSION_COOKIE_NAME = "kelola_session";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Add it to .env.local (see .env.example) — required before any session can be signed."
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(role: SessionRole, scopeIds: string[] | null): string {
  const payload: SessionContext = { role, scopeIds, issuedAt: Date.now() };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token: string | undefined | null): SessionContext | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as SessionContext;
  } catch {
    return null;
  }
}
