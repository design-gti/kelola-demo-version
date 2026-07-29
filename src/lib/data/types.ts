/**
 * Canonical shapes returned by src/lib/data/*. This is the only surface the
 * (future) agent tools and proactive-insights engine are meant to read from —
 * never src/data/* directly — so a return shape here is a stable contract,
 * not an implementation detail.
 */

export type DataProvenance = "fixture" | "csv" | "synthetic";

export interface PersonRef {
  candidateId: string;
  name: string;
  position: string;
  department: string;
}

export type SuccessionStatus = "no-candidate" | "weak" | "ready";

export interface SuccessionRiskPosition {
  positionId: string;
  title: string;
  department: string;
  status: SuccessionStatus;
  successors: { person: PersonRef; readinessGap: number }[];
}

export interface SuccessionRiskSummary {
  positionsAtRisk: number;
  positionsTotal: number;
  atRisk: SuccessionRiskPosition[];
  asOf: string;
}

export interface EmployeeDevelopmentSummary {
  needingDevelopment: PersonRef[];
  total: number;
  asOf: string;
}

export interface GroupedFieldEntry {
  fieldLabel: string;
  count: number;
  names: string[];
}

export interface ProfileCompletionSummary {
  pct: number;
  noData: GroupedFieldEntry[];
  stale: GroupedFieldEntry[];
  asOf: string;
}

export type AlertUrgency = "Critical" | "High" | "Normal";

export interface DataQualityAlert {
  field: string;
  fieldLabel: string;
  urgency: AlertUrgency;
  count: number;
  names: string[];
}

export interface PositionHolderResult {
  query: string;
  matches: PersonRef[];
}

// Re-exported from the canonical model rather than redefined here — all 7
// kinds exist in the underlying data (behavioral/technical/performance/
// leadership on Candidate directly; competency/prediction/engagement only
// via scoreOf()). See getRankedEmployees()'s own comment for why ranking
// needs all 7, not just the 4 Candidate happens to expose.
import type { ScoreKind } from "@/data/model/types";
export type { ScoreKind };

export interface RankedEmployee {
  rank: number;
  person: PersonRef;
}

export interface RankedEmployeesResult {
  metric: ScoreKind;
  direction: "top" | "bottom";
  total: number;
  ranked: RankedEmployee[];
  excludedNoData: number;
  asOf: string;
}

export interface EmployeeRankResult {
  person: PersonRef;
  rank: number;
  total: number;
  metric: ScoreKind;
  asOf: string;
}
