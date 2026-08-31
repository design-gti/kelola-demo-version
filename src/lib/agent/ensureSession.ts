"use client";
import type { SessionRole } from "@/lib/session";

export async function postSession(role: SessionRole): Promise<boolean> {
  // Testing override: the assistant's session always resolves as HR
  // (unrestricted in the mediation layer) regardless of the onboarding
  // choice, per explicit request to remove data restrictions while testing.
  // The onboarding picker above still records `role` for its own UI state.
  void role;
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "hr" satisfies SessionRole }),
  });
  return res.ok;
}

/**
 * Guarantees a server-verified session exists before CopilotKit mounts,
 * because CopilotKit's runtime-info handshake only runs once on mount and
 * does not retry if it fails unauthenticated. Whether the user has actually
 * been ASKED their role is a separate concern owned by useOnboarding's own
 * localStorage flag, not by whether a session happens to exist yet.
 *
 * Returns whether a session now exists, rather than throwing: the caller
 * decides whether to mount the assistant, and a dead backend must never
 * take the rest of the app down with it. `fetch` resolves (not rejects) on
 * 4xx/5xx, and a 500 from `next dev` answers with an HTML error page — so
 * checking `res.ok` before parsing is what separates "no session" from
 * "the endpoint is broken", and both from a real session.
 */
export async function ensureSession(): Promise<boolean> {
  const res = await fetch("/api/session");
  if (!res.ok) return false;
  let session: unknown;
  try {
    ({ session } = await res.json());
  } catch {
    return false;
  }
  if (session) return true;
  return postSession("hr");
}
