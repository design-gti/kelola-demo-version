import { candidates, criticalPositions, type Candidate } from "@/data/dummyData";
import { scoreOf } from "@/data/model/selectors";
import type { ScoreKind } from "@/data/model/types";
import { getToday } from "./clock";
import { matchesFuzzy } from "./textMatch";
import type {
  AlertUrgency,
  DataQualityAlert,
  EmployeeDevelopmentSummary,
  EmployeeRankResult,
  GroupedFieldEntry,
  PersonRef,
  ProfileCompletionSummary,
  RankedEmployeesResult,
  SuccessionRiskPosition,
  SuccessionRiskSummary,
  SuccessionStatus,
} from "./types";

const byId = new Map(candidates.map(c => [c.id, c]));

function personRef(c: Candidate): PersonRef {
  return { candidateId: c.id, name: c.name, position: c.position, department: c.department };
}

// Same threshold CriticalPositionRiskCard.tsx already uses — kept as a single
// named constant so the agent's answer and that card can never drift apart.
const WEAK_READINESS_GAP_THRESHOLD = 25;

/**
 * The canonical source for "who succeeds whom, and are they ready" is
 * dummyData.ts's `criticalPositions` — NOT OverallScoreCard.tsx's local
 * CRITICAL_POSITIONS/ALL_POSITIONS (that's a separate, exploratory "Position
 * Fit Simulator" scoring tool with hand-tuned demo scores; see the comment
 * added there). Reading from anywhere else here would let the agent give a
 * different answer than the succession-risk dashboard card.
 */
export function getCriticalPositions(): SuccessionRiskPosition[] {
  return criticalPositions.map(pos => {
    let status: SuccessionStatus;
    if (pos.successors.length === 0) {
      status = "no-candidate";
    } else if (pos.successors.some(s => s.readiness_gap > WEAK_READINESS_GAP_THRESHOLD)) {
      status = "weak";
    } else {
      status = "ready";
    }
    return {
      positionId: pos.id,
      title: pos.title,
      department: pos.department,
      status,
      successors: pos.successors
        .map(s => {
          const c = byId.get(s.candidateId);
          return c ? { person: personRef(c), readinessGap: s.readiness_gap } : null;
        })
        .filter((s): s is { person: PersonRef; readinessGap: number } => s !== null),
    };
  });
}

export function getSuccessionRiskSummary(): SuccessionRiskSummary {
  const positions = getCriticalPositions();
  const atRisk = positions.filter(p => p.status !== "ready");
  return {
    positionsAtRisk: atRisk.length,
    positionsTotal: positions.length,
    atRisk,
    asOf: getToday().toISOString(),
  };
}

/**
 * "Needs development" = low potential rating, or a measured performance
 * score below 60. Candidates form a 20-record fixture, so this will never
 * produce anything resembling the old hardcoded "43/97" — that number was
 * never computed from anything. Needs HR/product sign-off before shipping
 * this replacement somewhere it'll be compared against the old figure.
 */
export function getEmployeesNeedingDevelopment(pool: Candidate[] = candidates): EmployeeDevelopmentSummary {
  const needing = pool.filter(
    c => c.potential === "low" || (c.performance_score !== null && c.performance_score < 60)
  );
  return {
    needingDevelopment: needing.map(personRef),
    total: pool.length,
    asOf: getToday().toISOString(),
  };
}

const COMPLETION_FIELDS = [
  { key: "behavioral_score", label: "Behavioral score" },
  { key: "technical_score", label: "Technical score" },
  { key: "performance_score", label: "Performance score" },
  { key: "photo", label: "Foto profil" },
] as const;

function isStale(dataLastUpdated: string | undefined, today: Date): boolean {
  if (!dataLastUpdated) return false;
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  return new Date(dataLastUpdated) < oneYearAgo;
}

/**
 * Ports ProfileCompletion.tsx's calcPct()/buildSections() logic (already
 * correct) so both that card and the agent compute the same number, using a
 * real clock instead of a hardcoded TODAY.
 */
export function getProfileCompletion(pool: Candidate[] = candidates): ProfileCompletionSummary {
  const today = getToday();
  const keys = COMPLETION_FIELDS.map(f => f.key);
  const filled = pool.reduce(
    (sum, c) => sum + keys.filter(k => {
      const v = c[k as keyof Candidate];
      return v !== null && v !== undefined && v !== false;
    }).length,
    0
  );
  const pct = pool.length === 0 ? 0 : Math.round((filled / (pool.length * keys.length)) * 100);

  const noDataMap = new Map<string, GroupedFieldEntry>();
  const staleMap = new Map<string, GroupedFieldEntry>();

  pool.forEach(c => {
    COMPLETION_FIELDS.forEach(({ key, label }) => {
      const val = c[key as keyof Candidate];
      const missing = val === null || val === undefined || val === false;
      if (missing) {
        const e = noDataMap.get(key) ?? { fieldLabel: label, count: 0, names: [] };
        e.count++;
        e.names.push(c.name);
        noDataMap.set(key, e);
      } else if (isStale(c.dataLastUpdated, today)) {
        const e = staleMap.get(key) ?? { fieldLabel: label, count: 0, names: [] };
        e.count++;
        e.names.push(c.name);
        staleMap.set(key, e);
      }
    });
  });

  return {
    pct,
    noData: Array.from(noDataMap.values()),
    stale: Array.from(staleMap.values()),
    asOf: today.toISOString(),
  };
}

/**
 * Ports DataMissingAlertCard.tsx's logic — that component computes correct
 * aggregates from `candidates` but is dead code (never rendered anywhere).
 * Its logic lives on here as an agent-facing tool regardless of whether the
 * UI card itself ever gets wired back in.
 */
export function getDataQualityAlerts(): DataQualityAlert[] {
  const alertMap = new Map<string, DataQualityAlert>();

  candidates.forEach(c => {
    (["behavioral_score", "technical_score", "performance_score", "photo"] as const).forEach(field => {
      if (c[field] === null) {
        const urgency: AlertUrgency = c.isSuccession || c.isPGS ? "Critical" : c.isTalentPool ? "High" : "Normal";
        const fieldLabel = COMPLETION_FIELDS.find(f => f.key === field)?.label ?? field;
        const key = `${field}__${urgency}`;
        const existing = alertMap.get(key);
        if (existing) {
          existing.count++;
          existing.names.push(c.name);
        } else {
          alertMap.set(key, { field, fieldLabel, urgency, count: 1, names: [c.name] });
        }
      }
    });
  });

  const order: Record<AlertUrgency, number> = { Critical: 0, High: 1, Normal: 2 };
  return Array.from(alertMap.values()).sort((a, b) => order[a.urgency] - order[b.urgency]);
}

function scoredPool(metric: ScoreKind, pool: Candidate[]): { c: Candidate; score: number }[] {
  return pool
    .map(c => ({ c, score: scoreOf(c.id, metric) }))
    .filter((e): e is { c: Candidate; score: number } => e.score !== null);
}

// Rank is always "1 = highest score", regardless of whether the caller asked
// for "top" or "bottom" — a person's rank must mean the same thing no matter
// which tool call produced it. This isn't cosmetic: the assistant previously
// reported a specific person's rank number from a context where "rank 1"
// meant the *lowest* scorer, then couldn't reconcile it against a later
// question about the same person — mixing two incompatible numbering
// schemes under the same field name. See getEmployeeRank, which shares this
// exact convention.
function absoluteRanks(byScoreDesc: { c: Candidate; score: number }[]): Map<string, number> {
  return new Map(byScoreDesc.map((e, i) => [e.c.id, i + 1]));
}

/**
 * "Top/bottom N employees by <metric>" — e.g. "5 karyawan dengan performa
 * tertinggi". Reads via scoreOf(), not Candidate's own 4 score fields,
 * because "performance" and "competency" are genuinely different metrics
 * that can rank people very differently (e.g. TDP's screener composes its
 * "Ranking" column from competency-derived dimensions, not performance) —
 * restricting this to Candidate's 4 fields would silently exclude
 * competency/prediction/engagement, the exact gap that caused a wrong
 * "top 5 performers" answer to look like it disagreed with TDP's own
 * ranking when the two were actually just measuring different things.
 * Candidates with no measured value for the metric are excluded from the
 * ranking (not ranked last), and counted separately.
 */
export function getRankedEmployees(
  metric: ScoreKind,
  direction: "top" | "bottom" = "top",
  count: number = 5,
  pool: Candidate[] = candidates
): RankedEmployeesResult {
  const withScore = scoredPool(metric, pool);
  const byScoreDesc = [...withScore].sort((a, b) => b.score - a.score);
  const rankOf = absoluteRanks(byScoreDesc);

  const selected = direction === "top"
    ? byScoreDesc.slice(0, count)
    : [...byScoreDesc].reverse().slice(0, count);

  return {
    metric,
    direction,
    total: withScore.length,
    ranked: selected.map(e => ({ rank: rankOf.get(e.c.id)!, person: personRef(e.c) })),
    excludedNoData: pool.length - withScore.length,
    asOf: getToday().toISOString(),
  };
}

/**
 * "Where does <person> rank on <metric>" — e.g. "kenapa Son Heung-min tidak
 * masuk 5 terendah performance?". Exists specifically so the assistant never
 * has to guess a specific person's standing: getRankedEmployees only returns
 * a top/bottom slice, so a question about one named person outside that
 * slice had no tool to answer it — and produced a fabricated rank number in
 * practice. Same "1 = highest" convention as getRankedEmployees, so the two
 * tools' rank numbers for the same person always agree.
 */
export function getEmployeeRank(
  nameQuery: string,
  metric: ScoreKind,
  pool: Candidate[] = candidates
): EmployeeRankResult | null {
  const withScore = scoredPool(metric, pool).sort((a, b) => b.score - a.score);
  const idx = withScore.findIndex(e => matchesFuzzy(e.c.name, nameQuery));
  if (idx === -1) return null;

  return {
    person: personRef(withScore[idx].c),
    rank: idx + 1,
    total: withScore.length,
    metric,
    asOf: getToday().toISOString(),
  };
}
