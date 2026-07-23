import { candidates, Candidate } from "./dummyData";

// The manager's 6 direct team members (canonical ids — Engineering + 2 Executive)
export const MANAGER_TEAM_IDS = ["p01", "p02", "p03", "p04", "p06", "p07"];

export const managerTeam: Candidate[] = candidates.filter(c =>
  MANAGER_TEAM_IDS.includes(c.id)
);

// Aspect score distributions for 6-person team
// { label, below, meet, exceed } — must sum to 6 per row
export const managerAspects = [
  { label: "Kreativitas",              below: 0, meet: 4, exceed: 2 },
  { label: "Leadership",               below: 1, meet: 3, exceed: 2 },
  { label: "Kemampuan Membaca Akhlak", below: 1, meet: 4, exceed: 1 },
  { label: "Analytical Thinking",      below: 0, meet: 3, exceed: 3 },
  { label: "Logika berpikir",          below: 1, meet: 4, exceed: 1 },
  { label: "Problem Solving",          below: 1, meet: 3, exceed: 2 },
];

// Employee mapping cells for the team (9-box grid). Labels/colors are layout config;
// membership is DERIVED from the team via potential (rows) × performance (cols).
// Cell order matches EmployeeMapping: Need Coaching, Rising Star, Star,
// Questionable Fit, Contributor, Emerging Star, Under Performer, Specialist, Expert
const CELL_META = [
  { label: "Need Coaching",    countColor: "#bfd6ff",             bg: "#e8f1ff" },
  { label: "Rising Star",      countColor: "#9abdfd",             bg: "#b1cfff" },
  { label: "Star",             countColor: "#689eff",             bg: "#83b4ff" },
  { label: "Questionable Fit", countColor: "rgba(222,53,11,0.2)", bg: "#ffe4e4" },
  { label: "Contributor",      countColor: "#bfd6ff",             bg: "#e8f1ff" },
  { label: "Emerging Star",    countColor: "#9abdfd",             bg: "#b1cfff" },
  { label: "Under Performer",  countColor: "rgba(222,53,11,0.4)", bg: "#ffb3b3" },
  { label: "Specialist",       countColor: "rgba(222,53,11,0.2)", bg: "#ffe4e4" },
  { label: "Expert",           countColor: "#bfd6ff",             bg: "#e8f1ff" },
];

// 9-box bucket index from potential (row: high=0,med=1,low=2) × performance (col: <70,<85,else)
export function nineBoxIndex(c: Candidate): number {
  const row = c.potential === "high" ? 0 : c.potential === "medium" ? 1 : 2;
  const perf = c.performance_score ?? 0;
  const col = perf < 70 ? 0 : perf < 85 ? 1 : 2;
  return row * 3 + col;
}

export function buildMappingCells(team: Candidate[]) {
  const buckets: string[][] = Array.from({ length: 9 }, () => []);
  team.forEach(c => buckets[nineBoxIndex(c)].push(c.name));
  return CELL_META.map((m, i) => ({ ...m, count: buckets[i].length, names: buckets[i], avatars: [] as string[] }));
}

export const managerMappingCells = buildMappingCells(managerTeam);
