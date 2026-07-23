import { CanonicalData } from "./types";

// Runtime referential-integrity check (AC-5874) — pengganti FK di app tanpa DB.
// Dipanggil sekali saat store di-load; throw kalau ada relasi orphan.
export function assertReferentialIntegrity(d: CanonicalData): void {
  const pIds = new Set(d.participants.map(p => p.id));
  const tIds = new Set(d.teams.map(t => t.id));
  const posIds = new Set(d.positions.map(p => p.id));
  const errors: string[] = [];

  for (const p of d.participants) {
    if (!posIds.has(p.positionId)) errors.push(`participant ${p.id}: unknown positionId ${p.positionId}`);
    if (p.teamId && !tIds.has(p.teamId)) errors.push(`participant ${p.id}: unknown teamId ${p.teamId}`);
    if (p.managerId && !pIds.has(p.managerId)) errors.push(`participant ${p.id}: unknown managerId ${p.managerId}`);
    if (p.successorForId && !pIds.has(p.successorForId)) errors.push(`participant ${p.id}: unknown successorForId ${p.successorForId}`);
  }
  for (const t of d.teams) {
    if (t.leaderId && !pIds.has(t.leaderId)) errors.push(`team ${t.id}: unknown leaderId ${t.leaderId}`);
    if (t.reportToId && !pIds.has(t.reportToId)) errors.push(`team ${t.id}: unknown reportToId ${t.reportToId}`);
  }
  for (const a of d.assignments) {
    if (!pIds.has(a.participantId)) errors.push(`assignment ${a.id}: unknown participantId ${a.participantId}`);
  }
  if (errors.length) throw new Error("Canonical data referential-integrity failed:\n  " + errors.join("\n  "));
}
