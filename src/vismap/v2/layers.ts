import type { Employee } from "../data/orgChartData";
import type { HeatmapConfig, HeatmapRange } from "../components/HeatmapSettings";
import { ASPECTS, POSITION_STANDARDS, PARTICIPANT_ASPECT_SCORES } from "./aspectData.generated";

/**
 * Vismap V2 memisahkan sinyal heatmap jadi dua "layer" yang bisa aktif bersamaan:
 *
 *  - POSITION (kursi): succession-risk, critical-position  -> digambar di frame kartu
 *  - PERSON  (orang) : need-development, talent, ready-to-promote -> digambar di blok orang
 *
 * Karena dua kelompok itu menempati area visual yang berbeda pada kartu yang sama,
 * user bisa mencentang "Succession Risk" + "Ready to Promote" sekaligus tanpa
 * sinyalnya saling menimpa (beda dengan V1 yang single-select lewat tab).
 */
export type LayerId =
  | "succession-risk"
  | "need-development"
  | "critical-position"
  | "talent"
  | "ready-to-promote"
  | "initiatives";

export type LayerScope = "position" | "person";

export const LAYERS: { id: LayerId; label: string; scope: LayerScope; hint: string }[] = [
  { id: "succession-risk", label: "Succession Risk", scope: "position", hint: "Card frame colour" },
  { id: "critical-position", label: "Critical Position", scope: "position", hint: "Badge on position row" },
  { id: "need-development", label: "Need Development", scope: "person", hint: "Photo ring" },
  { id: "talent", label: "Talent", scope: "person", hint: "Star on photo" },
  { id: "ready-to-promote", label: "% Ready to Promote", scope: "person", hint: "Tag above card + connector" },
  { id: "initiatives", label: "Initiatives", scope: "person", hint: "Success % tag in card" },
];

export const NEUTRAL_BORDER = "#dee2e6";

function colorFromRanges(value: number, ranges: HeatmapRange[]): string | null {
  for (const r of ranges) {
    if (value >= r.min && value <= r.max) return r.color;
  }
  return null;
}

/**
 * Cocokkan skor 13 aspek kompetensi seorang partisipan terhadap standar aspek
 * suatu posisi (skala 1-5 masing-masing) → persentase kecocokan 0-100.
 * Tiap aspek dibatasi maksimum 100% (skor melebihi standar tidak menambah rata-
 * rata di atas 100) lalu dirata-rata across 13 aspek.
 *
 * Return null kalau data aspeknya tidak ada (fallback ke formula lama).
 */
export function matchPercent(participantId: string, positionTitle: string): number | null {
  const scores = PARTICIPANT_ASPECT_SCORES[participantId];
  const standards = POSITION_STANDARDS[positionTitle];
  if (!scores || !standards) return null;

  const ratios = ASPECTS.map((a) => Math.min(100, (scores[a] / standards[a]) * 100));
  const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  // Dibatasi 99: sekecil apa pun gap-nya, tidak ada yang benar-benar "100% siap"
  // — selalu ada ruang untuk berkembang.
  return Math.min(99, Math.round(avg));
}

/**
 * Readiness dari data. Kalau `targetPositionTitle` diberikan (kursi yang mau
 * dituju — biasanya posisi atasannya) dan data aspeknya tersedia, dihitung dari
 * kecocokan aspek terhadap standar kursi TARGET itu — sehingga bereaksi
 * terhadap simulasi tukar-posisi. Kalau tidak, jatuh ke angka lama yang nempel
 * di orang (readinessScore/competencyScore).
 */
export function readinessOf(emp: Employee, targetPositionTitle?: string): number {
  if (targetPositionTitle) {
    const matched = matchPercent(emp.id, targetPositionTitle);
    if (matched != null) return matched;
  }
  if (emp.readinessScore != null) return emp.readinessScore;
  const s = emp.competencyScore;
  if (s >= 91) return Math.round(s * 0.92);
  if (s >= 76) return Math.round(s * 0.88);
  if (s >= 66) return Math.round(s * 0.8);
  return Math.round(s * 0.72);
}

/**
 * Succession risk = sifat KURSI, dinilai dari kesiapan para calon penerusnya.
 * Logikanya disamakan dengan V1 (getNeedSuccessorsColor) supaya angka V1 & V2 konsisten.
 *
 * `scores` sengaja dikirim dari luar (bukan dibaca dari node.reports) supaya di mode
 * simulasi yang dinilai adalah orang yang SEDANG menempati kursi bawahannya, bukan
 * occupant aslinya.
 */
export function successionRiskColorFromScores(scores: number[], config: HeatmapConfig): string | null {
  if (scores.length === 0) return null;

  const sorted = [...config.readinessScore].sort((a, b) => a.min - b.min);
  const red = sorted[0];
  const green = sorted[sorted.length - 1];

  const greenCount = scores.filter((s) => s >= green.min && s <= green.max).length;
  const redCount = scores.filter((s) => s >= red.min && s <= red.max).length;
  const greenPct = (greenCount / scores.length) * 100;

  if (greenPct >= 50 || greenCount >= 2) return "#88E113";
  if (greenCount === 0 && redCount > 0) return "#FE0D00";
  return "#F59E02";
}

/**
 * Need development: cocokkan skor aspek orang terhadap standar kursi yang
 * SEDANG dia tempati (`currentPositionTitle`). Match rendah -> gap besar ->
 * merah. Jatuh ke competencyScore lama kalau data aspeknya tidak ada.
 */
export function needDevelopmentColor(emp: Employee, currentPositionTitle: string, config: HeatmapConfig): string | null {
  const matched = matchPercent(emp.id, currentPositionTitle);
  return colorFromRanges(matched ?? emp.competencyScore, config.needDevelop);
}

export function readinessColor(emp: Employee, config: HeatmapConfig, targetPositionTitle?: string): string {
  return colorFromRanges(readinessOf(emp, targetPositionTitle), config.readinessScore) ?? NEUTRAL_BORDER;
}

/**
 * Talent = sifat ORANG: performa tinggi DAN kesiapan tinggi.
 * Ambang hijau diambil dari range teratas readinessScore supaya ikut Setting Heatmap.
 */
export function isTalent(emp: Employee, config: HeatmapConfig): boolean {
  const sorted = [...config.readinessScore].sort((a, b) => a.min - b.min);
  const green = sorted[sorted.length - 1];
  return readinessOf(emp) >= green.min && (emp.performanceRating ?? 0) >= 4;
}

export function isVacant(emp: Employee): boolean {
  return emp.name === "(Vacant)";
}
