"use client";
import type { SessionRole } from "@/lib/session";

export async function postSession(role: SessionRole): Promise<void> {
  // Testing override: the assistant's session always resolves as HR
  // (unrestricted in the mediation layer) regardless of the onboarding
  // choice, per explicit request to remove data restrictions while testing.
  // The onboarding picker above still records `role` for its own UI state.
  void role;
  await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "hr" satisfies SessionRole }),
  });
}

/**
 * Guarantees a server-verified session exists before CopilotKit mounts,
 * because CopilotKit's runtime-info handshake only runs once on mount and
 * does not retry if it fails unauthenticated. Whether the user has actually
 * been ASKED their role is a separate concern owned by useOnboarding's own
 * localStorage flag, not by whether a session happens to exist yet.
 */
export async function ensureSession(): Promise<void> {
  const res = await fetch("/api/session");
  const { session } = await res.json();
  if (session) return;
  await postSession("hr");
}
