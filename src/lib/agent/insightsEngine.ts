import type { SessionContext } from "@/lib/session";
import { getToday } from "@/lib/data/clock";
import { getIdpStatusSummary } from "@/lib/data/idp";
import { idpUrl, tdpUrl, vismapUrl } from "./navigation";
import { getAgentProfileCompletionView, getAgentSuccessionRiskView } from "./mediation";
import type { Insight } from "./insights";

function dateKey(today: Date): string {
  return today.toISOString().slice(0, 10);
}

async function getIdpOverdueInsight(today: Date): Promise<Insight | null> {
  const summary = await getIdpStatusSummary();
  const overdue = summary.overdue;
  if (overdue.length === 0) return null;

  const names = overdue.map(e => e.name);
  return {
    id: `idp-overdue-${dateKey(today)}`,
    category: "idp-overdue",
    severity: overdue.length >= 5 ? "critical" : "warning",
    title: `${overdue.length} IDP terlambat direview`,
    message: `${names.slice(0, 3).join(", ")}${names.length > 3 ? ` dan ${names.length - 3} lainnya` : ""} punya IDP yang sudah melewati due date tapi belum ditandai selesai.`,
    evidence: {
      sourceIds: names,
      computedAt: summary.asOf,
      basis: 'IDP dengan status bukan "Expired" dan due date sudah lewat dari hari ini',
    },
    navigationTarget: { href: idpUrl({ id: String(overdue[0].id) }), label: "Lihat Monitoring IDP" },
  };
}

function getSuccessionRiskInsight(session: SessionContext, today: Date): Insight | null {
  const view = getAgentSuccessionRiskView(session);
  if (!view || view.positionsAtRisk === 0) return null;

  return {
    id: `succession-risk-${dateKey(today)}`,
    category: "succession-risk",
    severity: view.positionsAtRisk >= 3 ? "critical" : "warning",
    title: `${view.positionsAtRisk} posisi kritis butuh successor`,
    message: `${view.atRisk.map(p => p.title).join(", ")} belum punya successor yang siap.`,
    evidence: {
      sourceIds: view.atRisk.map(p => p.title),
      computedAt: view.asOf,
      basis: "posisi dengan status no-candidate, atau weak (readiness gap > 25)",
    },
    navigationTarget: { href: vismapUrl({ tab: "succession-risk" }), label: "Lihat di Vismap" },
  };
}

function getProfileCompletenessInsight(session: SessionContext, today: Date): Insight | null {
  const view = getAgentProfileCompletionView(session);
  if (view.pct >= 90) return null;

  const fields = view.noData.map(f => f.field);
  return {
    id: `profile-completeness-${dateKey(today)}`,
    category: "profile-completeness",
    severity: view.pct < 60 ? "critical" : "warning",
    title: `Kelengkapan data ${view.pct}%`,
    message: fields.length > 0
      ? `Field ${fields.join(", ")} masih kosong untuk sejumlah karyawan.`
      : "Beberapa data karyawan sudah lama tidak diperbarui.",
    evidence: {
      sourceIds: fields,
      computedAt: view.asOf,
      basis: "persentase field terisi (behavioral/technical/performance score, foto) dari total yang dilacak",
    },
    navigationTarget: { href: tdpUrl({ tab: "table" }), label: "Lihat di TDP" },
  };
}

const SEVERITY_ORDER: Record<Insight["severity"], number> = { critical: 0, warning: 1, info: 2 };

export async function getInsights(session: SessionContext): Promise<Insight[]> {
  const today = getToday();
  return [
    await getIdpOverdueInsight(today),
    getSuccessionRiskInsight(session, today),
    getProfileCompletenessInsight(session, today),
  ]
    .filter((i): i is Insight => i !== null)
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}
