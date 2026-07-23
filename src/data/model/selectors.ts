// Read API atas canonical store. Consumer HANYA lewat sini (bukan file mentah).
import { store } from "./store";
import { Participant, ScoreKind, Team } from "./types";

export type Personality = "Driver" | "Persuader" | "Mediator" | "Analyzer";

export function personalityFromDisc(disc: string): Personality | null {
  switch (disc.charAt(0)) {
    case "D": return "Driver";
    case "I": return "Persuader";
    case "S": return "Mediator";
    case "C": return "Analyzer";
    default: return null;
  }
}

export const allParticipants = (): Participant[] => store.participants;
export const allTeams = (): Team[] => store.teams;
export const getParticipant = (id: string) => store.participant(id);
export const positionOf = (p: Participant) => store.position(p.positionId) ?? { id: "", title: "", department: "" };
export const nameOf = (id: string) => store.participant(id)?.name ?? "-";
export const scoreOf = (participantId: string, kind: ScoreKind) => store.score(participantId, kind);
export const teamMembers = (teamId: string) => store.membersOf(teamId);
export const assignmentsOf = (participantId: string) => store.assignmentsOf(participantId);
export const successorsOf = (participantId: string) =>
  store.participants.filter(p => p.successorForId === participantId);

export const teamLeaderName = (t: Team) => (t.leaderId ? nameOf(t.leaderId) : null);
export const teamReportToName = (t: Team) => (t.reportToId ? nameOf(t.reportToId) : null);
