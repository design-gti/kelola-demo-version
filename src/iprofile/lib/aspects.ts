import type { AspectItem } from "./ProfileContext";
import {
  ASPECT_CATALOG,
  ASPECTS_BY_POSITION,
  JOB_BY_POSITION,
  KB_BY_PARTICIPANT,
  SCORES_BY_PARTICIPANT,
  STANDARDS_BY_JOB,
} from "@/data/model/aspects.generated";

/**
 * Aspek kompetensi seseorang untuk kartu Score Aspect.
 *
 * Tiga sumber bertemu di sini, sesuai model yang berlaku sekarang:
 *   - POSISI menentukan aspek mana yang dinilai (maks 12),
 *   - JOB (departemen) menentukan standar tiap aspek — aspek yang sama bisa
 *     punya standar berbeda antar Job,
 *   - PARTISIPAN membawa skor dan breakdown Key Behaviour-nya.
 *
 * Tidak ada lagi pemisahan soft/hard: "General" dan "Technical" cuma kategori,
 * dan aspek dari kategori mana pun berbaur dalam satu daftar.
 */

const catalogByLabel = new Map(ASPECT_CATALOG.map((a) => [a.label, a]));

export function aspectsFor(position: string, employeeId: string): AspectItem[] {
  const labels = ASPECTS_BY_POSITION[position] ?? [];
  const job = JOB_BY_POSITION[position] ?? "";
  const standards = STANDARDS_BY_JOB[job] ?? {};
  const scores = SCORES_BY_PARTICIPANT[employeeId] ?? {};
  const kb = KB_BY_PARTICIPANT[employeeId] ?? {};

  return labels.map((label) => {
    const entry = catalogByLabel.get(label);
    // Skor/standar yang belum ada ditampilkan apa adanya sebagai 0 daripada
    // ditebak — supaya lubang datanya kelihatan, bukan tersamarkan.
    const score = scores[label] ?? 0;
    const standardScore = standards[label] ?? 0;
    return {
      label,
      category: entry?.category ?? "Uncategorized",
      score,
      standardScore,
      dev: score < standardScore,
      keyBehaviours: kb[label],
    };
  });
}

/** Deskripsi aspek dari katalog; string kosong kalau aspeknya tidak dikenal. */
export function descriptionOfAspect(label: string): string {
  return catalogByLabel.get(label)?.description ?? "";
}
