import type { SessionContext } from "@/lib/session";
import { candidates, type Candidate } from "@/data/dummyData";
import { DISC_GUIDANCE, teamMember, teamMembers, teamAverages, teams, type Personality } from "@/data/teamsData";
import { TI_CONFIG, boxByOrder } from "@/data/talentMappingShared";
import {
  findOrgHierarchy,
  findPositionHolders,
  getCriticalPositions,
  getDataQualityAlerts,
  getEmployeeRank,
  getEmployeesNeedingDevelopment,
  getProfileCompletion,
  getRankedEmployees,
  getSuccessionRiskSummary,
  getToday,
  type ScoreKind,
} from "@/lib/data";
import { getIdpStatusSummary } from "@/lib/data/idp";
import { getTalentIdentificationPoints } from "@/lib/data/talentMapping";
import { matchesFuzzy } from "@/lib/data/textMatch";

/**
 * The mediation layer between src/lib/data (governed, but still raw/precise)
 * and anything that will reach an LLM. Everything a CopilotKit tool returns
 * should come from here, never straight from src/lib/data or src/data/*.
 *
 * Role/scope-based access restriction is intentionally disabled below (every
 * session sees the full pool, unconditionally) — every client using this
 * platform gets full access, per explicit request. What remains is data
 * *shaping*, not access control: aggregate/multi-person results are still
 * banded (no raw scores), and personality data still never exposes raw axis
 * numbers, only a label plus the existing hand-authored guidance text.
 */

export type PerformanceBand = "needs_review" | "meets" | "exceeds" | "not_assessed";

export function bandScore(score: number | null): PerformanceBand {
  if (score === null) return "not_assessed";
  if (score < 60) return "needs_review";
  if (score < 85) return "meets";
  return "exceeds";
}

export type ReadinessBand = "large_gap" | "moderate_gap" | "ready_soon";

export function bandReadinessGap(gap: number): ReadinessBand {
  if (gap > 25) return "large_gap";
  if (gap > 10) return "moderate_gap";
  return "ready_soon";
}

function poolForSession(_session: SessionContext): Candidate[] {
  // No access restriction — every session sees the full candidate pool.
  return candidates;
}

function canSeeCandidate(_session: SessionContext, _candidateId: string): boolean {
  // No access restriction — every session can see every candidate.
  return true;
}

export function getAgentSuccessionRiskView(_session: SessionContext) {
  const summary = getSuccessionRiskSummary();
  return {
    positionsAtRisk: summary.positionsAtRisk,
    positionsTotal: summary.positionsTotal,
    atRisk: summary.atRisk.map(p => ({
      title: p.title,
      department: p.department,
      status: p.status,
      successors: p.successors.map(s => ({
        name: s.person.name,
        readinessBand: bandReadinessGap(s.readinessGap),
      })),
    })),
    asOf: summary.asOf,
  };
}

export function getAgentDevelopmentView(session: SessionContext) {
  const pool = poolForSession(session);
  const summary = getEmployeesNeedingDevelopment(pool);
  return {
    total: summary.total,
    needingDevelopmentCount: summary.needingDevelopment.length,
    names: summary.needingDevelopment.map(p => p.name),
    asOf: summary.asOf,
  };
}

export function getAgentProfileCompletionView(session: SessionContext) {
  const pool = poolForSession(session);
  const result = getProfileCompletion(pool);
  return {
    pct: result.pct,
    noData: result.noData.map(e => ({ field: e.fieldLabel, count: e.count })),
    stale: result.stale.map(e => ({ field: e.fieldLabel, count: e.count })),
    asOf: result.asOf,
  };
}

/**
 * A single, already-authorized record may return precise fields — but
 * personality data is a deliberate exception even here: only the dominant
 * DISC type label plus the existing static guidance text, never raw axis
 * scores, so the model can't freestyle a psychological narrative about a
 * named person from four numbers.
 */
export function getAgentPersonalityView(session: SessionContext, candidateId: string) {
  if (!canSeeCandidate(session, candidateId)) return null;
  const candidate = candidates.find(c => c.id === candidateId);
  if (!candidate) return null;

  const member = teamMember(candidateId);
  if (!member.personality) return { candidateId, name: candidate.name, position: candidate.position, dominantType: null, guidance: null };

  return {
    candidateId,
    name: candidate.name,
    position: candidate.position,
    dominantType: member.personality,
    guidance: DISC_GUIDANCE[member.personality],
    // discProfile()'s raw per-axis numbers are deliberately never exposed here —
    // see this file's module comment.
    provenance: "synthetic" as const,
  };
}

export function getAgentCriticalPositionsCount(_session: SessionContext): number | null {
  return getCriticalPositions().length;
}

/**
 * "Who currently holds position X" — e.g. "siapa CEO sekarang?". Distinct
 * from getAgentSuccessionRiskView, which is about *future* successors for a
 * small hand-curated list of critical roles, not who's in the seat today.
 */
export function getAgentPositionHolderView(_session: SessionContext, query: string) {
  return findPositionHolders(query);
}

/**
 * IDP status/overdue — sourced from the same real public/data/idp-data.json
 * MonitoringIDPCard.tsx renders, not a separate hand-authored fixture.
 */
export async function getAgentIdpStatusView(_session: SessionContext) {
  return getIdpStatusSummary();
}

/**
 * Talent Mapping 9-box distribution — same Performance × Potency computation
 * as the /talent-mapping page (src/lib/data/talentMapping.ts), not a
 * re-derived or hand-authored count.
 */
export function getAgentTalentMappingView(session: SessionContext) {
  const pool = poolForSession(session);
  const points = getTalentIdentificationPoints(pool);
  const distribution = TI_CONFIG.boxes.map(box => ({
    order: box.order,
    label: box.label,
    count: points.filter(p => p.order === box.order).length,
  }));
  const noData = points.filter(p => p.order === null).length;
  return { distribution, total: points.length, noData, asOf: getToday().toISOString() };
}

/**
 * Team roster/averages/DISC mix for one team, matched by name/partial name —
 * same src/data/teamsData.ts the /team-profile page reads.
 */
export function getAgentTeamOverviewView(_session: SessionContext, query: string) {
  const team = teams.find(t => matchesFuzzy(t.name, query));
  if (!team) return null;

  const members = teamMembers(team);
  const avg = teamAverages(team);
  const discCounts: Record<Personality, number> = { Driver: 0, Persuader: 0, Mediator: 0, Analyzer: 0 };
  members.forEach(m => { if (m.personality) discCounts[m.personality]++; });

  return {
    teamId: team.id,
    teamName: team.name,
    leaderName: team.leaderId ? teamMember(team.leaderId).name : null,
    reportTo: team.reportTo,
    memberCount: members.length,
    avgPerformanceBand: avg.performance !== null ? bandScore(avg.performance) : null,
    avgEngagementBand: avg.engagement !== null ? bandScore(avg.engagement) : null,
    discCounts,
  };
}

/**
 * Which fields are missing/incomplete, grouped by urgency — same
 * getDataQualityAlerts() metrics.ts already computes for the (currently
 * unrendered) DataMissingAlertCard, now reachable directly via chat too.
 */
export function getAgentDataQualityView(_session: SessionContext) {
  return { alerts: getDataQualityAlerts(), asOf: getToday().toISOString() };
}

/**
 * "Top/bottom N employees by <metric>" — e.g. "5 karyawan dengan performa
 * tertinggi". Only rank + name + position + department, never the raw score
 * itself — consistent with this file's no-raw-scores rule for aggregate
 * results, and with getEmployeesNeedingDevelopment's name-only precedent.
 */
export function getAgentRankedEmployeesView(
  session: SessionContext,
  metric: ScoreKind,
  direction: "top" | "bottom" = "top",
  count: number = 5
) {
  const pool = poolForSession(session);
  return getRankedEmployees(metric, direction, count, pool);
}

/**
 * "Who is X's manager" / "who reports to X" — org-chart/reporting-line
 * lookup, matched by full/partial employee name. Distinct from succession
 * data: this is the current management hierarchy, not who might replace
 * whom.
 */
export function getAgentOrgHierarchyView(_session: SessionContext, query: string) {
  return findOrgHierarchy(query);
}

/**
 * "Where does <person> rank on <metric>" — e.g. "kenapa Son Heung-min tidak
 * masuk 5 terendah performance?". Exists so a question about one specific
 * named person's standing always goes through a real lookup instead of the
 * model estimating/guessing a rank number it has no way to verify.
 */
export function getAgentEmployeeRankView(session: SessionContext, nameQuery: string, metric: ScoreKind) {
  const pool = poolForSession(session);
  return getEmployeeRank(nameQuery, metric, pool);
}
