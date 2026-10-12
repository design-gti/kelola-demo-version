// Vismap now reads the CANONICAL store (PGS-1133/E1) instead of its own CSV —
// so orang/tim di Vismap konsisten dengan Home/Team Profile/Talent Mapping.
import { Employee } from "./orgChartData";
import { generateDevelopmentData } from "./developmentData";
import { store } from "@/data/model/store";

// Demografi (gender/city/marital status) dan IQ TIDAK ada di store kanonik —
// Participant hanya menyimpan posisi, atasan, DISC, potential dan foto. Tanpa ini
// kolom "Basic Information" di Data Visibility diam-diam tidak pernah muncul di
// kartu org chart, karena OrgChartCard baru merender field itu kalau nilainya ada
// (beda dari kolom skor yang jatuh ke '-'). Jadi kita turunkan seperti jalur CSV
// lama Vismap (lihat generateDummyData di dataManager.ts): deterministik dari nama,
// supaya nilainya stabil antar-render dan antar-reload.
const CITIES = [
  "Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Semarang",
  "Medan", "Denpasar", "Makassar", "Palembang", "Tangerang",
  "Bekasi", "Bogor", "Depok", "Malang", "Solo",
];

const FEMALE_NAME_HINTS = [
  "Dian", "Yolanda", "Chelsea", "Novaria", "Angela", "Shani",
  "Liliana", "Aurora", "Vicky", "Shifa", "Diana", "Siti",
  "Clarissa", "Putri", "Nana", "Jesslyn", "Devi", "Gilda",
  "Ami", "Hilda", "Wirda", "Tira", "Zamira", "Susanti",
  "Mulyani", "Rahmawati", "Widiastuti", "Shania", "Hastuti",
];

function nameHash(name: string): number {
  return name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function demographics(name: string) {
  const hash = nameHash(name);
  const isFemale = FEMALE_NAME_HINTS.some(hint => name.includes(hint));
  return {
    gender: (isFemale ? "Female" : "Male") as "Male" | "Female",
    city: CITIES[hash % CITIES.length],
    maritalStatus: (hash % 2 === 0 ? "Menikah" : "Belum Menikah") as "Menikah" | "Belum Menikah",
    iq: 105 + (hash % 26),
  };
}

export function buildCanonicalEmployees(): Employee[] {
  const parts = store.participants;

  // successorIds[X] = suksesor UNTUK posisi X. Seed successorForId terlalu jarang
  // (hanya 3 total), jadi pool suksesi = bawahan langsung (managerId) — konsisten
  // dengan node yang tersorot di bawah tiap manajer. Suksesor eksplisit tetap
  // dipakai kalau ada, digabung tanpa duplikat.
  const succ = new Map<string, string[]>();
  const addSucc = (forId: string, id: string) => {
    const arr = succ.get(forId) ?? succ.set(forId, []).get(forId)!;
    if (!arr.includes(id)) arr.push(id);
  };
  for (const p of parts) {
    if (p.successorForId) addSucc(p.successorForId, p.id);
    if (p.managerId) addSucc(p.managerId, p.id);
  }
  // urutkan suksesor tiap posisi berdasarkan readiness (prediction) desc
  const readinessOf = (id: string) => store.score(id, "prediction") ?? store.score(id, "competency") ?? 0;
  for (const [, ids] of succ) ids.sort((a, b) => readinessOf(b) - readinessOf(a));

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
    const demo = demographics(p.name);

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
      imageUrl: p.photoUrl ?? `/avatars/employee/${p.id}.png`,
      performanceRating: perf ? Math.max(1, Math.min(5, Math.round(perf / 20))) : 3,
      readinessScore: readiness,
      criticalPosition: p.potential === "high",
      gender: demo.gender,
      city: demo.city,
      maritalStatus: demo.maritalStatus,
      iq: demo.iq,
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
