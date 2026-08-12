import { PARTICIPANT_ASPECT_SCORES, type Aspect } from "./aspectData.generated";

/** Satu syarat aspek hasil auto-mapping AI: aspek relevan + skor minimum yang dibutuhkan. */
export type InitiativeAspectRequirement = { aspect: Aspect; minScore: number };

export type Initiative = {
  id: string;
  /** Teks goal/inisiatif apa adanya seperti ditulis user. */
  text: string;
  status: "mapping" | "mapped" | "error";
  aspects?: InitiativeAspectRequirement[];
  /** % kemungkinan berhasil, dihitung dari skor aspek orang vs minScore-nya. null selama masih mapping/error. */
  successPercent: number | null;
  error?: string;
};

/**
 * % kemungkinan berhasil = rata-rata (skor aspek orang / minScore dibutuhkan),
 * tiap aspek dibatasi 100% (kelebihan skor tidak menaikkan rata-rata lewat situ).
 * Sama pola pembatasannya dengan matchPercent di layers.ts, supaya konsisten
 * dengan cara baca "kecocokan" yang sudah dipakai di tempat lain di Vismap V2.
 */
export function computeInitiativeSuccess(participantId: string, aspects: InitiativeAspectRequirement[]): number | null {
  const scores = PARTICIPANT_ASPECT_SCORES[participantId];
  if (!scores || aspects.length === 0) return null;

  const ratios = aspects.map(({ aspect, minScore }) => Math.min(100, (scores[aspect] / minScore) * 100));
  const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  return Math.min(99, Math.round(avg));
}

export function initiativeSuccessColor(percent: number): string {
  if (percent < 66) return "#DE350B";
  if (percent < 81) return "#FD9F28";
  return "#00875A";
}
