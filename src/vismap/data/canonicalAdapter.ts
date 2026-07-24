// Vismap now reads the CANONICAL store (PGS-1133/E1) instead of its own CSV —
// so orang/tim di Vismap konsisten dengan Home/Team Profile/Talent Mapping.
import { Employee } from "./orgChartData";
import { generateDevelopmentData } from "./developmentData";
import { store } from "@/data/model/store";

export function buildCanonicalEmployees(): Employee[] {
  const parts = store.participants;

  // successorIds[X] = peserta yang menjadi suksesor UNTUK X
  const succ = new Map<string, string[]>();
  for (const p of parts) {
    if (p.successorForId) {
      const arr = succ.get(p.successorForId) ?? succ.set(p.successorForId, []).get(p.successorForId)!;
      arr.push(p.id);
    }
  }

  // rank by competency desc
  const ranked = [...parts].sort((a, b) => (store.score(b.id, "competency") ?? 0) - (store.score(a.id, "competency") ?? 0));
  const rankMap = new Map(ranked.map((p, i) => [p.id, i + 1]));

  return parts.map(p => {
    const pos = store.position(p.positionId);
    const comp = store.score(p.id, "competency") ?? 0;
    const perf = store.score(p.id, "performance") ?? undefined;
    const readiness = store.score(p.id, "prediction") ?? undefined;
    const engagement = store.score(p.id, "engagement") ?? undefined;
    const sIds = succ.get(p.id) ?? [];
    const numeric = p.id.replace(/\D/g, "") || "0";
    const dev = generateDevelopmentData(numeric, readiness ?? comp);

    return {
      id: p.id,
      displayId: `EMP${numeric.padStart(3, "0")}`,
      rank: rankMap.get(p.id) ?? 0,
      name: p.name,
      position: pos?.title ?? "",
      jobTitle: pos?.department ?? "",
      department: pos?.department,
      competencyScore: comp,
      successors: sIds.length,
      successorIds: sIds.length ? sIds : undefined,
      managerId: p.managerId ?? undefined,
      imageUrl: p.photoUrl ?? `/avatars/photo_wc2026/${p.id}.png`,
      performanceRating: perf ? Math.max(1, Math.min(5, Math.round(perf / 20))) : 3,
      readinessScore: readiness,
      criticalPosition: p.potential === "high",
      performance: perf,
      capabilityScore: comp,
      commitmentScore: engagement,
      contributionScore: perf,
      competencyDetails: dev.competencyDetails,
      idpRecommendations: dev.idpRecommendations,
    } satisfies Employee;
  });
}

// drop-in async pengganti loadEmployeesFromCSV (App.tsx & OverallScoreCard pakai .then)
export function loadEmployeesFromCanonical(): Promise<Employee[]> {
  return Promise.resolve(buildCanonicalEmployees());
}
