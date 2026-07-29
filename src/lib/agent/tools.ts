import type { SessionContext } from "@/lib/session";
import { logAgentEvent } from "./auditLog";
import {
  getAgentDataQualityView,
  getAgentDevelopmentView,
  getAgentEmployeeRankView,
  getAgentIdpStatusView,
  getAgentOrgHierarchyView,
  getAgentPersonalityView,
  getAgentPositionHolderView,
  getAgentProfileCompletionView,
  getAgentRankedEmployeesView,
  getAgentSuccessionRiskView,
  getAgentTalentMappingView,
  getAgentTeamOverviewView,
} from "./mediation";

export const VALID_SCORE_METRICS = ["behavioral", "technical", "performance", "leadership", "competency", "prediction", "engagement"] as const;
export type ScoreMetricParam = (typeof VALID_SCORE_METRICS)[number];
export function toScoreMetric(value: string | undefined): ScoreMetricParam {
  return (VALID_SCORE_METRICS as readonly string[]).includes(value ?? "") ? (value as ScoreMetricParam) : "performance";
}

export interface BackendActionParam {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface BackendAction {
  name: string;
  description: string;
  parameters: readonly BackendActionParam[];
  // Each action's handler has its own independently-shaped args shape (see
  // route.ts's comment on the equivalent Action<any> cast for the same
  // underlying limitation) — TS's contravariant parameter checking rejects
  // any single non-`any` signature here, since every handler below narrows
  // this to its own specific shape.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (args: any) => Promise<unknown>;
}

/**
 * Backend (data-reading) action definitions — shared by the real
 * /api/copilotkit route and scripts/eval, so the eval harness exercises the
 * exact tools/descriptions actually shipped, never a copy that can drift.
 * Each runs server-side and goes through the mediation layer, never
 * returning raw src/data/* fixtures. Navigation actions live client-side in
 * CopilotProvider.tsx instead, since only the browser has a router/DOM —
 * out of scope for this factory and for the eval harness.
 */
export function buildBackendActions(session: SessionContext): BackendAction[] {
  return [
    {
      name: "getSuccessionRiskSummary",
      description: "Summarize which critical positions lack a ready, tracked successor.",
      parameters: [],
      handler: async () => {
        logAgentEvent({ sessionRole: session.role, action: "getSuccessionRiskSummary" });
        return getAgentSuccessionRiskView(session);
      },
    },
    {
      name: "getEmployeesNeedingDevelopment",
      description: "Count and list (by name only, no raw scores) employees needing development within the caller's scope.",
      parameters: [],
      handler: async () => {
        logAgentEvent({ sessionRole: session.role, action: "getEmployeesNeedingDevelopment" });
        return getAgentDevelopmentView(session);
      },
    },
    {
      name: "getProfileCompletionSummary",
      description: "Get the profile data completion percentage and which fields are missing or stale, scoped to the caller's role.",
      parameters: [],
      handler: async () => {
        logAgentEvent({ sessionRole: session.role, action: "getProfileCompletionSummary" });
        return getAgentProfileCompletionView(session);
      },
    },
    {
      name: "getEmployeePersonality",
      description: "Get one employee's dominant DISC personality type and interaction guidance text (never raw axis scores). Requires the employee's candidate id.",
      parameters: [
        { name: "candidateId", type: "string", description: "The candidate id, e.g. \"p01\"", required: true },
      ] as const,
      handler: async (args: { candidateId: string }) => {
        logAgentEvent({ sessionRole: session.role, action: "getEmployeePersonality", detail: { candidateId: args.candidateId } });
        return getAgentPersonalityView(session, args.candidateId) ?? { visible: false, reason: "Employee not found." };
      },
    },
    {
      name: "getPositionHolder",
      description: "Find who currently holds a position/role by title, e.g. \"who is the CEO now\" or \"who is Head of Engineering\". Matches full titles, partial titles, and acronyms (\"CEO\"). This is about who's in the seat today — not succession/future-successor data, which getSuccessionRiskSummary already covers.",
      parameters: [
        { name: "query", type: "string", description: "Position title or acronym, e.g. \"CEO\" or \"Head of Engineering\"", required: true },
      ] as const,
      handler: async (args: { query: string }) => {
        logAgentEvent({ sessionRole: session.role, action: "getPositionHolder", detail: { query: args.query } });
        return getAgentPositionHolderView(session, args.query);
      },
    },
    {
      name: "getIdpStatus",
      description: "Summarize Individual Development Plan (IDP) status across employees: counts by status (In Progress/Expired/Need Review/Completed) and who's overdue.",
      parameters: [],
      handler: async () => {
        logAgentEvent({ sessionRole: session.role, action: "getIdpStatus" });
        return getAgentIdpStatusView(session);
      },
    },
    {
      name: "getTalentMapping",
      description: "Get the Talent Mapping 9-box distribution (Performance × Potency) — how many employees fall into each box, e.g. Star, Rising Star, Under Performer.",
      parameters: [],
      handler: async () => {
        logAgentEvent({ sessionRole: session.role, action: "getTalentMapping" });
        return getAgentTalentMappingView(session);
      },
    },
    {
      name: "getTeamOverview",
      description: "Get one team's roster size, leader, who they report to, banded performance/engagement averages, and DISC personality mix. Requires the team name (full or partial), e.g. \"Engineering\" or \"Finance Team\".",
      parameters: [
        { name: "query", type: "string", description: "Team name or partial name, e.g. \"Engineering\"", required: true },
      ] as const,
      handler: async (args: { query: string }) => {
        logAgentEvent({ sessionRole: session.role, action: "getTeamOverview", detail: { query: args.query } });
        return getAgentTeamOverviewView(session, args.query) ?? { visible: false, reason: "Team not found." };
      },
    },
    {
      name: "getDataQualityAlerts",
      description: "Get which profile fields are missing, grouped by urgency (Critical/High/Normal) and how many employees are affected.",
      parameters: [],
      handler: async () => {
        logAgentEvent({ sessionRole: session.role, action: "getDataQualityAlerts" });
        return getAgentDataQualityView(session);
      },
    },
    {
      name: "getRankedEmployees",
      description: "Rank employees by a score metric — e.g. \"who are the 5 employees with the highest performance\" or \"who has the lowest technical score\". IMPORTANT: \"performance\" and \"competency\" are different metrics that can rank people very differently (e.g. TDP's Ranking/screener columns are usually built from competency, not performance) — pick the metric that actually matches what the user asked, and if it's ambiguous, say in your answer which metric you used. Returns rank + name + position only, never the raw score. Employees with no measured value for the metric are excluded from the ranking. This only returns a top/bottom slice — if the user then asks about one specific named person (e.g. \"why isn't X in the bottom 5\"), call getEmployeeRank for that person instead of estimating their rank yourself.",
      parameters: [
        { name: "metric", type: "string", description: "One of: behavioral, technical, performance, leadership, competency, prediction, engagement", required: true },
        { name: "direction", type: "string", description: "\"top\" (highest first) or \"bottom\" (lowest first); defaults to \"top\"", required: false },
        { name: "count", type: "number", description: "How many to return; defaults to 5", required: false },
      ] as const,
      handler: async (args: { metric: string; direction?: string; count?: number }) => {
        logAgentEvent({ sessionRole: session.role, action: "getRankedEmployees", detail: args });
        const metric = toScoreMetric(args.metric);
        const direction = args.direction === "bottom" ? "bottom" : "top";
        return getAgentRankedEmployeesView(session, metric, direction, args.count ?? 5);
      },
    },
    {
      name: "getOrgHierarchy",
      description: "Find who an employee's manager is, and who reports to them — the current org-chart/reporting line. Requires the employee's name (full or partial). This is about current management structure, not succession/future-successor data.",
      parameters: [
        { name: "query", type: "string", description: "Employee name or partial name, e.g. \"Kylian Mbappe\"", required: true },
      ] as const,
      handler: async (args: { query: string }) => {
        logAgentEvent({ sessionRole: session.role, action: "getOrgHierarchy", detail: { query: args.query } });
        return getAgentOrgHierarchyView(session, args.query);
      },
    },
    {
      name: "getEmployeeRank",
      description: "Find exactly where ONE named employee ranks on a score metric among all employees, e.g. \"where does Son Heung-min rank on performance?\" or \"why isn't X in the bottom 5?\". ALWAYS call this for a question about a specific named person's standing/rank — NEVER state a rank number for a specific person without calling this first, even if you think you can estimate it from a previous getRankedEmployees result. Same rank numbering as getRankedEmployees (1 = highest score). Returns rank + total only, never the raw score.",
      parameters: [
        { name: "name", type: "string", description: "Employee name or partial name, e.g. \"Son Heung-min\"", required: true },
        { name: "metric", type: "string", description: "One of: behavioral, technical, performance, leadership, competency, prediction, engagement", required: true },
      ] as const,
      handler: async (args: { name: string; metric: string }) => {
        logAgentEvent({ sessionRole: session.role, action: "getEmployeeRank", detail: args });
        const metric = toScoreMetric(args.metric);
        return getAgentEmployeeRankView(session, args.name, metric) ?? { visible: false, reason: "Employee not found, or no measured value for that metric." };
      },
    },
  ];
}
