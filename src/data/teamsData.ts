// Derived from canonical store (PGS-1133 / E1). Public API dipertahankan agar
// Team Profile page tidak berubah.
import { allTeams, teamMembers as storeMembers, teamReportToName, positionOf, scoreOf, personalityFromDisc, getParticipant, Personality } from "./model/selectors";

export type { Personality };
export type TeamType = "FUNCTIONAL" | "STRUCTURAL";

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  personality: Personality | null;
  disc: string;
  competencyMatch: number;
  predictionScore: number;
  latestPerformance: number | null;
  latestEngagement: number | null;
}

export interface Team {
  id: string;
  name: string;
  type: TeamType;
  leaderId: string | null;
  reportTo: string | null;
  memberIds: string[];
}

export function teamMember(id: string): TeamMember {
  const perf = scoreOf(id, "performance");
  const p = getParticipant(id)!;
  return {
    id,
    name: p.name,
    position: positionOf(p).title,
    personality: personalityFromDisc(p.disc),
    disc: p.disc,
    competencyMatch: scoreOf(id, "competency") ?? 0,
    predictionScore: scoreOf(id, "prediction") ?? 0,
    latestPerformance: perf,
    latestEngagement: scoreOf(id, "engagement"),
  };
}

export const teams: Team[] = allTeams().map(t => ({
  id: t.id,
  name: t.name,
  type: t.type,
  leaderId: t.leaderId,
  reportTo: teamReportToName(t),
  memberIds: storeMembers(t.id).map(p => p.id),
}));

export function teamMembers(team: Team): TeamMember[] {
  return team.memberIds.map(teamMember);
}

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

// ── DISC (Interaction tab) ────────────────────────────────────────────────────
export type DiscScores = Record<Personality, number>;
const DISC_AXIS: Record<string, Personality> = { D: "Driver", I: "Persuader", S: "Mediator", C: "Analyzer" };

// profil 4-sumbu diturunkan dari kode DISC blend (dominan = huruf pertama).
export function discProfile(m: TeamMember): DiscScores {
  const scores: DiscScores = { Driver: 35, Persuader: 35, Mediator: 35, Analyzer: 35 };
  const weight = [50, 18, 10];
  [...m.disc].forEach((ch, i) => {
    const axis = DISC_AXIS[ch];
    if (axis) scores[axis] += weight[i] ?? 6;
  });
  (Object.keys(scores) as Personality[]).forEach(k => { scores[k] = Math.max(20, Math.min(98, scores[k])); });
  return scores;
}

export interface Guidance { relationship: string; communicate: string; avoid: string; }

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

// Kriteria Rekomendasi (Prediction Competency): label by score threshold.
export function predictionLabel(score: number): { label: string; color: string } {
  if (score > 90) return { label: "Direkomendasikan", color: "#28a745" };
  if (score > 70) return { label: "Disarankan", color: "#fd9f28" };
  return { label: "Belum Disarankan", color: "#dc3545" };
}
