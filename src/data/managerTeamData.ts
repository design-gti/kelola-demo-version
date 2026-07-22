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

// Employee mapping cells for 6-person team (9-box grid)
// Cell order matches EmployeeMapping: Need Coaching, Rising Star, Star,
// Questionable Fit, Contributor, Emerging Star, Under Performer, Specialist, Expert
export const managerMappingCells = [
  { count: 1, label: "Need Coaching",    countColor: "#bfd6ff",             bg: "#e8f1ff", avatars: [] as string[], names: ["Florian Wirtz"] },
  { count: 2, label: "Rising Star",      countColor: "#9abdfd",             bg: "#b1cfff", avatars: [] as string[], names: ["Jude Bellingham", "Phil Foden"] },
  { count: 1, label: "Star",             countColor: "#689eff",             bg: "#83b4ff", avatars: [] as string[], names: ["Rodri"] },
  { count: 0, label: "Questionable Fit", countColor: "rgba(222,53,11,0.2)", bg: "#ffe4e4", avatars: [] as string[], names: [] },
  { count: 2, label: "Contributor",      countColor: "#bfd6ff",             bg: "#e8f1ff", avatars: [] as string[], names: ["Jamal Musiala", "Erling Haaland"] },
  { count: 0, label: "Emerging Star",    countColor: "#9abdfd",             bg: "#b1cfff", avatars: [] as string[], names: [] },
  { count: 0, label: "Under Performer",  countColor: "rgba(222,53,11,0.4)", bg: "#ffb3b3", avatars: [] as string[], names: [] },
  { count: 0, label: "Specialist",       countColor: "rgba(222,53,11,0.2)", bg: "#ffe4e4", avatars: [] as string[], names: [] },
  { count: 0, label: "Expert",           countColor: "#bfd6ff",             bg: "#e8f1ff", avatars: [] as string[], names: [] },
];
