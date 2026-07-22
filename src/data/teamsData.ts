import { candidates } from "./dummyData";

export type Personality = "Driver" | "Persuader" | "Mediator" | "Analyzer";
export type TeamType = "FUNCTIONAL" | "STRUCTURAL";

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  personality: Personality | null;
  disc: string;                   // discrete DISC blend code (D, DS, DIC, ...) for wheel placement
  competencyMatch: number;        // 0..100
  predictionScore: number;        // 0..100 → recommendation label via predictionLabel()
  latestPerformance: number | null;
  latestEngagement: number | null;
}

// Kriteria Rekomendasi (Prediction Competency): label by score threshold.
export function predictionLabel(score: number): { label: string; color: string } {
  if (score > 90) return { label: "Direkomendasikan", color: "#28a745" };
  if (score > 70) return { label: "Disarankan", color: "#fd9f28" };
  return { label: "Belum Disarankan", color: "#dc3545" };
}

export interface Team {
  id: string;
  name: string;
  type: TeamType;
  leaderId: string | null;
  reportTo: string | null;
  memberIds: string[];
}

const byId = Object.fromEntries(candidates.map(c => [c.id, c]));

// Per-member team-view dummy (filled so charts/tables look alive).
// perf === null / prediction === "" left blank on purpose to show mixed states.
const M: Record<string, Omit<TeamMember, "id" | "name" | "position">> = {
  c1:  { personality: "Driver",    disc: "DS",  competencyMatch: 78,  predictionScore: 82, latestPerformance: 75, latestEngagement: 80 },
  c2:  { personality: "Analyzer",  disc: "CS",  competencyMatch: 96,  predictionScore: 95, latestPerformance: 90, latestEngagement: 88 },
  c3:  { personality: "Analyzer",  disc: "CD",  competencyMatch: 100, predictionScore: 98, latestPerformance: 88, latestEngagement: 79 },
  c4:  { personality: "Mediator",  disc: "SD",  competencyMatch: 72,  predictionScore: 68, latestPerformance: 69, latestEngagement: 74 },
  c5:  { personality: "Persuader", disc: "IS",  competencyMatch: 66,  predictionScore: 55, latestPerformance: null, latestEngagement: 63 },
  c6:  { personality: "Analyzer",  disc: "CI",  competencyMatch: 85,  predictionScore: 84, latestPerformance: 82, latestEngagement: 77 },
  c7:  { personality: "Driver",    disc: "DI",  competencyMatch: 71,  predictionScore: 73, latestPerformance: 71, latestEngagement: 70 },
  c8:  { personality: "Mediator",  disc: "SC",  competencyMatch: 79,  predictionScore: 79, latestPerformance: 74, latestEngagement: 76 },
  c9:  { personality: "Mediator",  disc: "SI",  competencyMatch: 57,  predictionScore: 52, latestPerformance: 60, latestEngagement: 58 },
  c10: { personality: "Analyzer",  disc: "C",   competencyMatch: 92,  predictionScore: 91, latestPerformance: 86, latestEngagement: 84 },
  c11: { personality: "Analyzer",  disc: "CDS", competencyMatch: 83,  predictionScore: 83, latestPerformance: null, latestEngagement: 73 },
  c12: { personality: "Persuader", disc: "IC",  competencyMatch: 74,  predictionScore: 74, latestPerformance: 72, latestEngagement: 79 },
  c13: { personality: "Driver",    disc: "DC",  competencyMatch: 88,  predictionScore: 88, latestPerformance: 85, latestEngagement: 86 },
  c14: { personality: "Persuader", disc: "ID",  competencyMatch: 68,  predictionScore: 65, latestPerformance: 68, latestEngagement: 74 },
  c15: { personality: "Analyzer",  disc: "CIS", competencyMatch: 55,  predictionScore: 48, latestPerformance: 55, latestEngagement: 60 },
  c16: { personality: "Mediator",  disc: "S",   competencyMatch: 80,  predictionScore: 80, latestPerformance: 76, latestEngagement: 78 },
  c17: { personality: "Driver",    disc: "D",   competencyMatch: 90,  predictionScore: 92, latestPerformance: 81, latestEngagement: 85 },
  c18: { personality: "Analyzer",  disc: "CD",  competencyMatch: 76,  predictionScore: 76, latestPerformance: 73, latestEngagement: 71 },
  c19: { personality: "Driver",    disc: "DCS", competencyMatch: 87,  predictionScore: 90, latestPerformance: 80, latestEngagement: 86 },
  c20: { personality: "Persuader", disc: "I",   competencyMatch: 94,  predictionScore: 96, latestPerformance: 88, latestEngagement: 92 },
};

export function teamMember(id: string): TeamMember {
  const c = byId[id];
  return { id, name: c.name, position: c.position, ...M[id] };
}

export const teams: Team[] = [
  { id: "t1", name: "Engineering Team",       type: "FUNCTIONAL", leaderId: "c19", reportTo: "Sri Mulyani",  memberIds: ["c19", "c3", "c6", "c11", "c17"] },
  { id: "t2", name: "Executive Office Team",  type: "FUNCTIONAL", leaderId: "c20", reportTo: null,           memberIds: ["c20", "c7", "c8", "c15", "c16"] },
  { id: "t3", name: "Finance Team",           type: "FUNCTIONAL", leaderId: "c2",  reportTo: "Sri Mulyani",  memberIds: ["c2", "c10", "c18"] },
  { id: "t4", name: "Human Resources Team",   type: "FUNCTIONAL", leaderId: "c12", reportTo: "Sri Mulyani",  memberIds: ["c12", "c4"] },
  { id: "t5", name: "Operations Team",        type: "STRUCTURAL", leaderId: "c13", reportTo: "Sri Mulyani",  memberIds: ["c13", "c1", "c9"] },
  { id: "t6", name: "Sales & Marketing Team", type: "FUNCTIONAL", leaderId: "c5",  reportTo: "Sri Mulyani",  memberIds: ["c5", "c14"] },
];

export function teamMembers(team: Team): TeamMember[] {
  return team.memberIds.map(teamMember);
}

// ── DISC personality (Interaction tab) ───────────────────────────────────────
export type DiscScores = Record<Personality, number>; // 0..100 per axis

// Deterministic per-member profile; dominant axis = member.personality.
export function discProfile(m: TeamMember): DiscScores {
  const seed = m.competencyMatch;
  const v = (k: number) => Math.min(72, Math.max(28, 45 + ((seed * (k + 3)) % 25) - 12));
  const scores: DiscScores = { Driver: v(1), Persuader: v(2), Mediator: v(3), Analyzer: v(4) };
  if (m.personality) scores[m.personality] = Math.min(98, 80 + (seed % 16));
  return scores;
}

export interface Guidance {
  relationship: string;
  communicate: string;
  avoid: string;
}

// Guidance keyed by dominant DISC type (type-based, like real DISC advice).
export const DISC_GUIDANCE: Record<Personality, Guidance> = {
  Driver: {
    relationship: "Hubungan cenderung langsung dan berorientasi hasil. Menghargai rekan yang kompeten dan to-the-point, tetapi bisa terkesan mendominasi saat tertekan.",
    communicate: "Bicara singkat dan fokus pada tujuan serta hasil. Berikan beberapa opsi lalu biarkan mereka memutuskan. Hormati waktu mereka.",
    avoid: "Hindari basa-basi berlebihan, detail tak relevan, dan sikap ragu-ragu. Jangan menantang otoritas mereka di depan umum.",
  },
  Persuader: {
    relationship: "Membangun hubungan lewat interaksi hangat dan optimisme. Energik dan kolaboratif, namun bisa kurang fokus pada detail.",
    communicate: "Beri ruang berdiskusi dan berbagi ide. Tunjukkan antusiasme, gunakan cerita, dan akui kontribusi mereka.",
    avoid: "Hindari komunikasi yang dingin atau terlalu teknis, dan jangan membatasi ekspresi mereka atau mengabaikan sisi personal.",
  },
  Mediator: {
    relationship: "Menjaga keharmonisan dan loyal. Pendengar yang baik dan stabil, tetapi enggan pada perubahan mendadak atau konflik.",
    communicate: "Gunakan pendekatan tenang dan personal. Jelaskan perubahan secara bertahap serta beri kepastian dan rasa aman.",
    avoid: "Hindari tekanan mendadak, konfrontasi, dan perubahan tiba-tiba tanpa penjelasan.",
  },
  Analyzer: {
    relationship: "Mengutamakan akurasi dan standar. Mandiri dan analitis, namun bisa terlalu kritis atau perfeksionis.",
    communicate: "Sajikan data, fakta, dan detail yang akurat. Beri waktu untuk menganalisis sebelum memutuskan.",
    avoid: "Hindari klaim tanpa bukti, keputusan terburu-buru, dan pendekatan yang terlalu emosional.",
  },
};

export function teamAverages(team: Team) {
  const ms = teamMembers(team);
  const avg = (nums: (number | null)[]) => {
    const vals = nums.filter((n): n is number => n != null);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  };
  return {
    performance: avg(ms.map(m => m.latestPerformance)),
    engagement: avg(ms.map(m => m.latestEngagement)),
  };
}
