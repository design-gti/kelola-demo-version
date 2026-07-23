// Canonical store (PGS-1133 / E1): indexes over the generated data + integrity check.
// Sumber of-record = public/data/participants.csv + assignments.csv → generated.ts (npm run seed).
// Swap CSV→API nanti: cukup ganti CANONICAL loader, index & selector tetap.
import { CANONICAL } from "./generated";
import { assertReferentialIntegrity } from "./validate";
import { Assignment, CanonicalData, Participant, Position, Score, ScoreKind, Team } from "./types";

assertReferentialIntegrity(CANONICAL); // runnable constraint check (AC-5874)

const data: CanonicalData = CANONICAL;

const participantById = new Map(data.participants.map(p => [p.id, p]));
const teamById = new Map(data.teams.map(t => [t.id, t]));
const positionById = new Map(data.positions.map(p => [p.id, p]));
const scoreByKey = new Map(data.scores.map(s => [`${s.participantId}:${s.kind}`, s]));

const membersByTeam = new Map<string, Participant[]>();
for (const p of data.participants) {
  if (!p.teamId) continue;
  (membersByTeam.get(p.teamId) ?? membersByTeam.set(p.teamId, []).get(p.teamId)!).push(p);
}
const assignmentsByParticipant = new Map<string, Assignment[]>();
for (const a of data.assignments) {
  (assignmentsByParticipant.get(a.participantId) ?? assignmentsByParticipant.set(a.participantId, []).get(a.participantId)!).push(a);
}

export const store = {
  data,
  participants: data.participants,
  teams: data.teams,
  assignments: data.assignments,
  participant: (id: string): Participant | undefined => participantById.get(id),
  team: (id: string): Team | undefined => teamById.get(id),
  position: (id: string): Position | undefined => positionById.get(id),
  score: (participantId: string, kind: ScoreKind): number | null => scoreByKey.get(`${participantId}:${kind}`)?.value ?? null,
  scoresOf: (participantId: string): Score[] => data.scores.filter(s => s.participantId === participantId),
  membersOf: (teamId: string): Participant[] => membersByTeam.get(teamId) ?? [],
  assignmentsOf: (participantId: string): Assignment[] => assignmentsByParticipant.get(participantId) ?? [],
};
