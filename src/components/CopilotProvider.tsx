"use client";

import { useEffect, useState } from "react";
import { CopilotKit } from "@copilotkit/react-core";
import { useCopilotReadable, useFrontendTool, useRenderToolCall } from "@copilotkit/react-core";
import { usePathname, useRouter } from "next/navigation";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  employeeProfileUrl,
  idpUrl,
  talentMappingUrl,
  tdpUrl,
  teamProfileUrl,
  vismapUrl,
} from "@/lib/agent/navigation";
import { ensureSession } from "@/lib/agent/ensureSession";
import AssistantWidget from "@/components/assistant/AssistantWidget";

/**
 * Navigation (frontend) actions only — only the browser has a router. Data
 * (backend) actions are registered server-side in /api/copilotkit/route.ts
 * instead, going through the mediation layer. Each data action's result
 * already renders as a card with its own "go there" button (DataToolCards,
 * below) — these tools exist for the user to type an explicit navigation
 * request, not for the model to chain automatically after a data answer.
 * Every description below repeats that constraint deliberately: a single
 * system-prompt note wasn't enough to reliably stop the model from calling
 * these on its own after a data tool, so each tool restates it individually.
 */
function NavigationActions() {
  const router = useRouter();
  const pathname = usePathname();

  useCopilotReadable({
    description: "The page path the user is currently looking at",
    value: pathname,
  });

  useFrontendTool({
    name: "navigateHome",
    description: "Go to the Beranda (home) dashboard. Only call this when the user's own message explicitly asks to go home/to the dashboard — never automatically after answering a data question.",
    parameters: [],
    handler: async () => {
      router.push("/");
      return { navigated: "/" };
    },
  });

  useFrontendTool({
    name: "openVismap",
    description:
      "Open Vismap (org chart / succession planning). Optionally jump straight to the succession-risk or need-develop heatmap tab, highlight a specific person or position by exact name, or open the position-fit simulator for a position. Only call this when the user's own message explicitly asks to open/see Vismap — never automatically after getSuccessionRiskSummary or getEmployeesNeedingDevelopment, since that tool's result already renders its own \"go there\" button for the user to click.",
    parameters: [
      { name: "tab", type: "string", description: 'Either "succession-risk" or "need-develop"', required: false },
      { name: "highlight", type: "string", description: "Exact person name or position title to zoom to", required: false },
      { name: "simulateTargetPosition", type: "string", description: "Position label to open the fit simulator for", required: false },
    ] as const,
    handler: async (args) => {
      const href = vismapUrl({
        tab: args.tab === "succession-risk" || args.tab === "need-develop" ? args.tab : undefined,
        highlight: args.highlight,
        simulateTargetPosition: args.simulateTargetPosition,
      });
      router.push(href);
      return { navigated: href };
    },
  });

  useFrontendTool({
    name: "openTDP",
    description:
      'Open the TDP (Talent Data Platform) page, optionally jumping to the "table" or "review" tab. Only call this when the user\'s own message explicitly asks to open/see TDP — never automatically after answering a data question.',
    parameters: [
      { name: "tab", type: "string", description: 'Either "table" or "review"', required: false },
    ] as const,
    handler: async (args) => {
      const href = tdpUrl({ tab: args.tab === "table" || args.tab === "review" ? args.tab : undefined });
      router.push(href);
      return { navigated: href };
    },
  });

  useFrontendTool({
    name: "openIDP",
    description:
      "Open the IDP (Individual Development Plan) section. Most IDP pages only respect the `page` parameter (which static page to show); id/name are only honored by the detail-idp-* pages. Only call this when the user's own message explicitly asks to open/see IDP — never automatically after answering a data question.",
    parameters: [
      { name: "page", type: "string", description: "Static IDP page filename, e.g. \"detail-idp-manager.html\"", required: false },
      { name: "id", type: "string", description: "Candidate id, only honored by the detail-idp-* pages", required: false },
      { name: "name", type: "string", description: "Candidate name, only honored by detail-idp-admin.html", required: false },
    ] as const,
    handler: async (args) => {
      const href = idpUrl(args);
      router.push(href);
      return { navigated: href };
    },
  });

  useFrontendTool({
    name: "openEmployeeProfile",
    description:
      "Open a specific employee's iProfile page by their candidate id (get the id from a data tool first if you only know their name). Only call this when the user's own message explicitly asks to open/see that employee's profile — never automatically after getEmployeePersonality, since that tool's result already renders its own \"go there\" button.",
    parameters: [
      { name: "candidateId", type: "string", description: "The candidate id, e.g. \"p01\"", required: true },
    ] as const,
    handler: async (args) => {
      const href = employeeProfileUrl({ candidateId: args.candidateId });
      router.push(href);
      return { navigated: href };
    },
  });

  useFrontendTool({
    name: "openTalentMapping",
    description:
      "Open the Talent Mapping 9-box page, optionally pre-selecting a box (1-9) to filter the table to. Only call this when the user's own message explicitly asks to open/see Talent Mapping — never automatically after answering a data question.",
    parameters: [
      { name: "box", type: "number", description: "Box number 1-9 to pre-select", required: false },
    ] as const,
    handler: async (args) => {
      const href = talentMappingUrl({ box: args.box });
      router.push(href);
      return { navigated: href };
    },
  });

  useFrontendTool({
    name: "openTeamProfile",
    description:
      "Open a specific team's profile page, optionally jumping straight to its Interaction (DISC) tab. Only call this when the user's own message explicitly asks to open/see that team's profile — never automatically after answering a data question.",
    parameters: [
      { name: "teamId", type: "string", description: "Team id, e.g. \"t1\"", required: false },
      { name: "tab", type: "string", description: 'Either "overview" or "interaction"', required: false },
    ] as const,
    handler: async (args) => {
      const href = teamProfileUrl({
        teamId: args.teamId,
        tab: args.tab === "overview" || args.tab === "interaction" ? args.tab : undefined,
      });
      router.push(href);
      return { navigated: href };
    },
  });

  return null;
}

interface SuccessionRiskResult {
  positionsAtRisk: number;
  positionsTotal: number;
  atRisk: Array<{
    title: string;
    department: string;
    status: string;
    successors: Array<{ name: string; readinessBand: "large_gap" | "moderate_gap" | "ready_soon" }>;
  }>;
  asOf: string;
  visible?: false;
  reason?: string;
}

interface DevelopmentResult {
  total: number;
  needingDevelopmentCount: number;
  names: string[];
  asOf: string;
}

interface ProfileCompletionResult {
  pct: number;
  noData: Array<{ field: string; count: number }>;
  stale: Array<{ field: string; count: number }>;
  asOf: string;
}

interface PersonalityResult {
  candidateId: string;
  name: string;
  position: string;
  dominantType: string | null;
  guidance: { relationship: string; communicate: string; avoid: string } | null;
  visible?: false;
  reason?: string;
}

interface PositionHolderResult {
  query: string;
  matches: Array<{ candidateId: string; name: string; position: string; department: string }>;
}

interface IdpStatusResult {
  total: number;
  byStatus: Record<"In Progress" | "Expired" | "Need Review" | "Completed", number>;
  overdue: Array<{ id: number; name: string; position: string; aspect: string; dueDate: string }>;
  asOf: string;
}

interface TalentMappingResult {
  distribution: Array<{ order: number; label: string; count: number }>;
  total: number;
  noData: number;
  asOf: string;
}

interface TeamOverviewResult {
  teamId: string;
  teamName: string;
  leaderName: string | null;
  reportTo: string | null;
  memberCount: number;
  avgPerformanceBand: string | null;
  avgEngagementBand: string | null;
  discCounts: Record<"Driver" | "Persuader" | "Mediator" | "Analyzer", number>;
  visible?: false;
  reason?: string;
}

interface DataQualityResult {
  alerts: Array<{ field: string; fieldLabel: string; urgency: "Critical" | "High" | "Normal"; count: number; names: string[] }>;
  asOf: string;
}

const METRIC_LABEL: Record<string, string> = {
  behavioral: "Behavioral score",
  technical: "Technical score",
  performance: "Performance score",
  leadership: "Leadership score",
  competency: "Competency score",
  prediction: "Prediction score",
  engagement: "Engagement score",
};

interface PersonRefLike { candidateId: string; name: string; position: string; department: string }

interface RankedEmployeesResult {
  metric: string;
  direction: "top" | "bottom";
  total: number;
  ranked: Array<{ rank: number; person: PersonRefLike }>;
  excludedNoData: number;
  asOf: string;
}

interface OrgHierarchyResult {
  query: string;
  person: PersonRefLike | null;
  manager: PersonRefLike | null;
  directReports: PersonRefLike[];
}

interface EmployeeRankResult {
  person: PersonRefLike;
  rank: number;
  total: number;
  metric: string;
  asOf: string;
  visible?: false;
  reason?: string;
}

function parseToolResult<T>(result: unknown): T | null {
  if (result == null) return null;
  if (typeof result === "string") {
    try {
      return JSON.parse(result) as T;
    } catch {
      return null;
    }
  }
  return result as T;
}

const READINESS_LABEL: Record<string, { label: string; color: string }> = {
  large_gap: { label: "Gap besar", color: "#dc3545" },
  moderate_gap: { label: "Gap sedang", color: "#f59f00" },
  ready_soon: { label: "Siap segera", color: "#2f9e44" },
};

const DATA_CARD_STYLE: React.CSSProperties = {
  border: "1px solid #e9ecef",
  borderRadius: 10,
  padding: "12px 14px",
  marginTop: 6,
  fontFamily: "'Open Sans', sans-serif",
  fontSize: 13,
  color: "#495057",
  background: "#fff",
};

const DATA_CARD_BUTTON_STYLE: React.CSSProperties = {
  marginTop: 10,
  padding: "7px 14px",
  borderRadius: 8,
  border: "none",
  background: "#016699",
  color: "#fff",
  fontFamily: "'Open Sans', sans-serif",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

function AsOfCaption({ asOf }: { asOf?: string }) {
  if (!asOf) return null;
  return <div style={{ fontSize: 11, color: "#adb5bd", marginTop: 8 }}>Data per {asOf}</div>;
}

/** Small distribution chart shared by the card-render hooks below — the
 * chat panel is ~350px wide, so this stays compact (no axis labels beyond
 * short category names, fixed height) rather than a full dashboard chart. */
function MiniBarChart({ data, color = "#016699" }: { data: Array<{ label: string; value: number }>; color?: string }) {
  return (
    <div style={{ width: "100%", height: 140, marginTop: 8 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis dataKey="label" tick={{ fontSize: 9, fontFamily: "'Open Sans', sans-serif" }} interval={0} angle={-25} textAnchor="end" height={40} />
          <YAxis allowDecimals={false} tick={{ fontSize: 9, fontFamily: "'Open Sans', sans-serif" }} width={24} />
          <Tooltip contentStyle={{ fontSize: 11, fontFamily: "'Open Sans', sans-serif" }} />
          <Bar dataKey="value" fill={color} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Renders each data (backend) action's result as a card with an explicit
 * "go there" button, rather than only a chat reply — per the plan's
 * governance rule that navigation only fires from a button click, never
 * automatically from the model. Registered by name only (no handler), so
 * the backend action in /api/copilotkit/route.ts still owns execution;
 * this hook only controls how that tool call is displayed.
 */
function DataToolCards() {
  const router = useRouter();
  // Prefetches the route's JS as soon as the card renders (well before the
  // user clicks), then returns the click handler — cuts the multi-second
  // first-navigation delay Next.js dev mode otherwise shows on a cold route.
  const goTo = (href: string) => {
    router.prefetch(href);
    return () => router.push(href);
  };

  useRenderToolCall({
    name: "getSuccessionRiskSummary",
    description: "Summarize which critical positions lack a ready, tracked successor.",
    parameters: [],
    render: ({ status, result }) => {
      if (status !== "complete") {
        return <div style={DATA_CARD_STYLE}>Mengambil data succession risk…</div>;
      }
      const data = parseToolResult<SuccessionRiskResult>(result);
      if (!data || data.visible === false) {
        return <div style={DATA_CARD_STYLE}>{data?.reason ?? "Succession risk tidak tersedia."}</div>;
      }
      return (
        <div style={DATA_CARD_STYLE}>
          <strong>{data.positionsAtRisk} dari {data.positionsTotal} posisi kritis</strong> berisiko succession.
          <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
            {data.atRisk.map(p => (
              <li key={p.title} style={{ marginBottom: 4 }}>
                <strong>{p.title}</strong> ({p.department}) — {p.status}
                {p.successors.length > 0 && (
                  <div style={{ fontSize: 12, color: "#868e96" }}>
                    {p.successors.map(s => (
                      <span key={s.name} style={{ marginRight: 8 }}>
                        {s.name}{" "}
                        <span style={{ color: READINESS_LABEL[s.readinessBand]?.color }}>
                          ({READINESS_LABEL[s.readinessBand]?.label ?? s.readinessBand})
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <AsOfCaption asOf={data.asOf} />
          <button
            style={DATA_CARD_BUTTON_STYLE}
            onClick={goTo(vismapUrl({ tab: "succession-risk", highlight: data.atRisk[0]?.title }))}
          >
            Lihat di Vismap →
          </button>
        </div>
      );
    },
  });

  useRenderToolCall({
    name: "getEmployeesNeedingDevelopment",
    description: "Count and list employees needing development.",
    parameters: [],
    render: ({ status, result }) => {
      if (status !== "complete") {
        return <div style={DATA_CARD_STYLE}>Mengambil data kebutuhan development…</div>;
      }
      const data = parseToolResult<DevelopmentResult>(result);
      if (!data) return <div style={DATA_CARD_STYLE}>Data tidak tersedia.</div>;
      return (
        <div style={DATA_CARD_STYLE}>
          <strong>{data.needingDevelopmentCount} dari {data.total} karyawan</strong> butuh development.
          {data.names.length > 0 && <div style={{ marginTop: 6 }}>{data.names.join(", ")}</div>}
          <AsOfCaption asOf={data.asOf} />
          <button style={DATA_CARD_BUTTON_STYLE} onClick={goTo(vismapUrl({ tab: "need-develop" }))}>
            Lihat di Vismap →
          </button>
        </div>
      );
    },
  });

  useRenderToolCall({
    name: "getProfileCompletionSummary",
    description: "Profile data completion percentage and which fields are missing or stale.",
    parameters: [],
    render: ({ status, result }) => {
      if (status !== "complete") {
        return <div style={DATA_CARD_STYLE}>Mengambil data kelengkapan profil…</div>;
      }
      const data = parseToolResult<ProfileCompletionResult>(result);
      if (!data) return <div style={DATA_CARD_STYLE}>Data tidak tersedia.</div>;
      return (
        <div style={DATA_CARD_STYLE}>
          Kelengkapan profil tim: <strong>{data.pct}%</strong>
          {data.noData.length > 0 && (
            <div style={{ marginTop: 6 }}>Belum lengkap: {data.noData.map(d => `${d.field} (${d.count})`).join(", ")}</div>
          )}
          {data.stale.length > 0 && (
            <div style={{ marginTop: 4 }}>Perlu diperbarui: {data.stale.map(d => `${d.field} (${d.count})`).join(", ")}</div>
          )}
          <AsOfCaption asOf={data.asOf} />
          <button style={DATA_CARD_BUTTON_STYLE} onClick={goTo("/")}>
            Lihat di Dashboard →
          </button>
        </div>
      );
    },
  });

  useRenderToolCall({
    name: "getEmployeePersonality",
    description: "One employee's dominant DISC personality type and interaction guidance text.",
    parameters: [
      { name: "candidateId", type: "string", description: "The candidate id, e.g. \"p01\"", required: true },
    ] as const,
    render: ({ status, result, args }) => {
      if (status !== "complete") {
        return <div style={DATA_CARD_STYLE}>Mengambil profil personality…</div>;
      }
      const data = parseToolResult<PersonalityResult>(result);
      if (!data || data.visible === false) {
        return <div style={DATA_CARD_STYLE}>{data?.reason ?? "Data personality tidak tersedia."}</div>;
      }
      return (
        <div style={DATA_CARD_STYLE}>
          <strong>{data.name}</strong> ({data.position})
          {data.dominantType ? (
            <div style={{ marginTop: 6 }}>
              Tipe dominan: <strong>{data.dominantType}</strong>
              {data.guidance && (
                <div style={{ marginTop: 4, color: "#868e96" }}>
                  <div><strong>Hubungan:</strong> {data.guidance.relationship}</div>
                  <div style={{ marginTop: 4 }}><strong>Cara komunikasi:</strong> {data.guidance.communicate}</div>
                  <div style={{ marginTop: 4 }}><strong>Hindari:</strong> {data.guidance.avoid}</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginTop: 6, color: "#868e96" }}>Belum ada data personality.</div>
          )}
          <button
            style={DATA_CARD_BUTTON_STYLE}
            onClick={goTo(employeeProfileUrl({ candidateId: data.candidateId ?? args.candidateId }))}
          >
            Lihat Profil →
          </button>
        </div>
      );
    },
  });

  useRenderToolCall({
    name: "getPositionHolder",
    description: "Who currently holds a position/role by title or acronym.",
    parameters: [
      { name: "query", type: "string", description: "Position title or acronym, e.g. \"CEO\"", required: true },
    ] as const,
    render: ({ status, result, args }) => {
      if (status !== "complete") {
        return <div style={DATA_CARD_STYLE}>Mencari siapa yang menjabat…</div>;
      }
      const data = parseToolResult<PositionHolderResult>(result);
      if (!data || data.matches.length === 0) {
        return <div style={DATA_CARD_STYLE}>Tidak ada posisi yang cocok dengan &quot;{data?.query ?? args.query}&quot;.</div>;
      }
      return (
        <div style={DATA_CARD_STYLE}>
          {data.matches.map(m => (
            <div key={m.candidateId} style={{ marginBottom: 6 }}>
              <strong>{m.name}</strong> — {m.position} ({m.department})
            </div>
          ))}
          <button
            style={DATA_CARD_BUTTON_STYLE}
            onClick={goTo(vismapUrl({ highlight: data.matches[0].name }))}
          >
            Lihat di Vismap →
          </button>
        </div>
      );
    },
  });

  useRenderToolCall({
    name: "getIdpStatus",
    description: "IDP status counts and who's overdue.",
    parameters: [],
    render: ({ status, result }) => {
      if (status !== "complete") {
        return <div style={DATA_CARD_STYLE}>Mengambil status IDP…</div>;
      }
      const data = parseToolResult<IdpStatusResult>(result);
      if (!data) return <div style={DATA_CARD_STYLE}>Data tidak tersedia.</div>;
      const chartData = (Object.entries(data.byStatus) as Array<[string, number]>)
        .filter(([, count]) => count > 0)
        .map(([label, value]) => ({ label, value }));
      return (
        <div style={DATA_CARD_STYLE}>
          <strong>{data.total} IDP</strong> dilacak, <strong>{data.overdue.length} terlambat</strong>.
          {chartData.length > 0 && <MiniBarChart data={chartData} color="#fd9f28" />}
          {data.overdue.length > 0 && (
            <div style={{ marginTop: 6 }}>{data.overdue.slice(0, 3).map(o => o.name).join(", ")}{data.overdue.length > 3 ? ` dan ${data.overdue.length - 3} lainnya` : ""}</div>
          )}
          <AsOfCaption asOf={data.asOf} />
          <button
            style={DATA_CARD_BUTTON_STYLE}
            onClick={goTo(idpUrl(data.overdue.length > 0 ? { id: String(data.overdue[0].id) } : {}))}
          >
            Lihat Monitoring IDP →
          </button>
        </div>
      );
    },
  });

  useRenderToolCall({
    name: "getTalentMapping",
    description: "Talent Mapping 9-box distribution.",
    parameters: [],
    render: ({ status, result }) => {
      if (status !== "complete") {
        return <div style={DATA_CARD_STYLE}>Mengambil talent mapping…</div>;
      }
      const data = parseToolResult<TalentMappingResult>(result);
      if (!data) return <div style={DATA_CARD_STYLE}>Data tidak tersedia.</div>;
      const chartData = data.distribution.map(b => ({ label: b.label, value: b.count }));
      return (
        <div style={DATA_CARD_STYLE}>
          <strong>{data.total} karyawan</strong> dipetakan ke 9-box Talent Mapping.
          <MiniBarChart data={chartData} />
          {data.noData > 0 && <div style={{ marginTop: 6, color: "#868e96" }}>{data.noData} karyawan belum punya data lengkap untuk dipetakan.</div>}
          <AsOfCaption asOf={data.asOf} />
          <button style={DATA_CARD_BUTTON_STYLE} onClick={goTo(talentMappingUrl())}>
            Lihat di Talent Mapping →
          </button>
        </div>
      );
    },
  });

  useRenderToolCall({
    name: "getTeamOverview",
    description: "One team's roster, leader, averages, and DISC mix.",
    parameters: [
      { name: "query", type: "string", description: "Team name or partial name, e.g. \"Engineering\"", required: true },
    ] as const,
    render: ({ status, result, args }) => {
      if (status !== "complete") {
        return <div style={DATA_CARD_STYLE}>Mengambil profil tim…</div>;
      }
      const data = parseToolResult<TeamOverviewResult>(result);
      if (!data || data.visible === false) {
        return <div style={DATA_CARD_STYLE}>{data?.reason ?? `Tim "${args.query}" tidak ditemukan.`}</div>;
      }
      const chartData = (Object.entries(data.discCounts) as Array<[string, number]>)
        .filter(([, count]) => count > 0)
        .map(([label, value]) => ({ label, value }));
      return (
        <div style={DATA_CARD_STYLE}>
          <strong>{data.teamName}</strong> — {data.memberCount} anggota
          {data.leaderName && <div style={{ marginTop: 4 }}>Leader: {data.leaderName}</div>}
          {data.reportTo && <div style={{ marginTop: 2, color: "#868e96" }}>Lapor ke: {data.reportTo}</div>}
          <div style={{ marginTop: 6 }}>
            Performa: <strong>{data.avgPerformanceBand ?? "belum ada data"}</strong> · Engagement: <strong>{data.avgEngagementBand ?? "belum ada data"}</strong>
          </div>
          {chartData.length > 0 && <MiniBarChart data={chartData} color="#7048e8" />}
          <button
            style={DATA_CARD_BUTTON_STYLE}
            onClick={goTo(teamProfileUrl({ teamId: data.teamId, highlight: data.leaderName ?? undefined }))}
          >
            Lihat Team Profile →
          </button>
        </div>
      );
    },
  });

  useRenderToolCall({
    name: "getDataQualityAlerts",
    description: "Which fields are missing, by urgency.",
    parameters: [],
    render: ({ status, result }) => {
      if (status !== "complete") {
        return <div style={DATA_CARD_STYLE}>Mengambil data quality alerts…</div>;
      }
      const data = parseToolResult<DataQualityResult>(result);
      if (!data || data.alerts.length === 0) {
        return <div style={DATA_CARD_STYLE}>Tidak ada data yang hilang — semua field lengkap.</div>;
      }
      // The same field can appear once per urgency level (e.g. "photo" as
      // both Critical and Normal) — sum by field for the chart, one bar per
      // field, and keep the per-urgency breakdown in the list below.
      const byField = new Map<string, number>();
      data.alerts.forEach(a => byField.set(a.fieldLabel, (byField.get(a.fieldLabel) ?? 0) + a.count));
      const chartData = Array.from(byField, ([label, value]) => ({ label, value }));
      return (
        <div style={DATA_CARD_STYLE}>
          <strong>{data.alerts.length} jenis data</strong> perlu perhatian.
          <MiniBarChart data={chartData} color="#dc3545" />
          <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
            {data.alerts.map(a => (
              <li key={`${a.field}-${a.urgency}`} style={{ marginBottom: 4 }}>
                {a.fieldLabel} — <strong>{a.count}</strong> karyawan ({a.urgency})
              </li>
            ))}
          </ul>
          <AsOfCaption asOf={data.asOf} />
          <button style={DATA_CARD_BUTTON_STYLE} onClick={goTo("/")}>
            Lihat di Dashboard →
          </button>
        </div>
      );
    },
  });

  useRenderToolCall({
    name: "getRankedEmployees",
    description: "Rank employees by a score metric (top or bottom N).",
    parameters: [
      { name: "metric", type: "string", description: "One of: behavioral, technical, performance, leadership, competency, prediction, engagement", required: true },
      { name: "direction", type: "string", description: "\"top\" or \"bottom\"", required: false },
      { name: "count", type: "number", description: "How many to return", required: false },
    ] as const,
    render: ({ status, result }) => {
      if (status !== "complete") {
        return <div style={DATA_CARD_STYLE}>Mengurutkan karyawan…</div>;
      }
      const data = parseToolResult<RankedEmployeesResult>(result);
      if (!data || data.ranked.length === 0) {
        return <div style={DATA_CARD_STYLE}>Tidak ada data untuk diurutkan.</div>;
      }
      const metricLabel = METRIC_LABEL[data.metric] ?? data.metric;
      const directionLabel = data.direction === "top" ? "tertinggi" : "terendah";
      return (
        <div style={DATA_CARD_STYLE}>
          <strong>{data.ranked.length} karyawan dengan {metricLabel.toLowerCase()} {directionLabel}</strong> (dari {data.total} karyawan)
          <ul style={{ margin: "8px 0 0", paddingLeft: 20, listStyle: "none" }}>
            {data.ranked.map(r => (
              <li key={r.person.candidateId} style={{ marginBottom: 4 }}>
                <span style={{ color: "#868e96", marginRight: 6 }}>#{r.rank}</span>
                <strong>{r.person.name}</strong> — {r.person.position}
              </li>
            ))}
          </ul>
          {data.excludedNoData > 0 && (
            <div style={{ marginTop: 6, color: "#868e96" }}>{data.excludedNoData} karyawan dikecualikan karena belum ada data {metricLabel.toLowerCase()}.</div>
          )}
          <AsOfCaption asOf={data.asOf} />
          <button
            style={DATA_CARD_BUTTON_STYLE}
            onClick={goTo(vismapUrl({ highlight: data.ranked[0].person.name }))}
          >
            Lihat {data.ranked[0].person.name} di Vismap →
          </button>
        </div>
      );
    },
  });

  useRenderToolCall({
    name: "getOrgHierarchy",
    description: "An employee's manager and direct reports.",
    parameters: [
      { name: "query", type: "string", description: "Employee name or partial name", required: true },
    ] as const,
    render: ({ status, result, args }) => {
      if (status !== "complete") {
        return <div style={DATA_CARD_STYLE}>Mencari struktur organisasi…</div>;
      }
      const data = parseToolResult<OrgHierarchyResult>(result);
      if (!data || !data.person) {
        return <div style={DATA_CARD_STYLE}>Karyawan &quot;{data?.query ?? args.query}&quot; tidak ditemukan.</div>;
      }
      return (
        <div style={DATA_CARD_STYLE}>
          <strong>{data.person.name}</strong> — {data.person.position}
          <div style={{ marginTop: 6 }}>
            Manager: {data.manager ? <><strong>{data.manager.name}</strong> ({data.manager.position})</> : <span style={{ color: "#868e96" }}>tidak ada (posisi puncak)</span>}
          </div>
          <div style={{ marginTop: 6 }}>
            {data.directReports.length > 0 ? (
              <>
                <strong>{data.directReports.length} direct report{data.directReports.length > 1 ? "s" : ""}:</strong>
                <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                  {data.directReports.map(r => (
                    <li key={r.candidateId} style={{ marginBottom: 2 }}>{r.name} — {r.position}</li>
                  ))}
                </ul>
              </>
            ) : (
              <span style={{ color: "#868e96" }}>Tidak ada direct report.</span>
            )}
          </div>
          <button style={DATA_CARD_BUTTON_STYLE} onClick={goTo(vismapUrl({ highlight: data.person!.name }))}>
            Lihat di Vismap →
          </button>
        </div>
      );
    },
  });

  useRenderToolCall({
    name: "getEmployeeRank",
    description: "Where one named employee ranks on a score metric.",
    parameters: [
      { name: "name", type: "string", description: "Employee name or partial name", required: true },
      { name: "metric", type: "string", description: "One of: behavioral, technical, performance, leadership, competency, prediction, engagement", required: true },
    ] as const,
    render: ({ status, result, args }) => {
      if (status !== "complete") {
        return <div style={DATA_CARD_STYLE}>Mencari peringkat karyawan…</div>;
      }
      const data = parseToolResult<EmployeeRankResult>(result);
      if (!data || data.visible === false) {
        return <div style={DATA_CARD_STYLE}>{data?.reason ?? `Karyawan "${args.name}" tidak ditemukan.`}</div>;
      }
      const metricLabel = METRIC_LABEL[data.metric] ?? data.metric;
      return (
        <div style={DATA_CARD_STYLE}>
          <strong>{data.person.name}</strong> — {data.person.position}
          <div style={{ marginTop: 6 }}>
            Peringkat <strong>#{data.rank}</strong> dari {data.total} karyawan, berdasarkan {metricLabel.toLowerCase()}.
          </div>
          <AsOfCaption asOf={data.asOf} />
          <button style={DATA_CARD_BUTTON_STYLE} onClick={goTo(employeeProfileUrl({ candidateId: data.person.candidateId }))}>
            Lihat Profil →
          </button>
        </div>
      );
    },
  });

  return null;
}

export default function CopilotProvider({ children }: { children: React.ReactNode }) {
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureSession().finally(() => {
      if (!cancelled) setSessionReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {children}
      {/*
        CopilotKit's runtime-info handshake runs once on mount and does not
        retry if it fails unauthenticated — so <CopilotKit> (and anything
        using its hooks, like AssistantWidget) only mounts once a session is
        guaranteed to exist. Sidebar/main (children) render immediately and
        never wait on this.
      */}
      {sessionReady && (
        <CopilotKit runtimeUrl="/api/copilotkit">
          <NavigationActions />
          <DataToolCards />
          <AssistantWidget />
        </CopilotKit>
      )}
    </>
  );
}
