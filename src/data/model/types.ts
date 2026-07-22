// Canonical shared data model (PGS-1133 / E1).
// Single source of truth for participants/teams/positions/assignments/scores.
// All modules read via selectors — never raw files.

export type TeamType = "FUNCTIONAL" | "STRUCTURAL";
export type Potential = "low" | "medium" | "high";

// DISC blend code (D, DI, DSC, ...) — dominant = first char (D/I/S/C).
export type DiscCode = string;

export type ScoreKind =
  | "behavioral"
  | "technical"
  | "performance"
  | "leadership"   // dipakai sbg "Potency"
  | "competency"   // competency match %
  | "prediction"   // prediction competency score
  | "engagement";

export type AssignmentStatus = "todo" | "in_progress" | "waiting_review" | "completed";

export interface Position {
  id: string;
  title: string;
  department: string;
}

export interface Team {
  id: string;
  name: string;
  type: TeamType;
  leaderId: string | null;
  reportToId: string | null;
}

export interface Participant {
  id: string;
  name: string;
  positionId: string;
  teamId: string | null;
  managerId: string | null;
  successorForId: string | null;
  disc: DiscCode;
  potential: Potential;
  photoUrl: string | null;
}

export interface Score {
  participantId: string;
  kind: ScoreKind;
  value: number | null;
}

export interface Assignment {
  id: string;
  participantId: string;
  type: string;
  status: AssignmentStatus;
  dueDate: string | null;
}

export interface CanonicalData {
  positions: Position[];
  teams: Team[];
  participants: Participant[];
  scores: Score[];
  assignments: Assignment[];
}
