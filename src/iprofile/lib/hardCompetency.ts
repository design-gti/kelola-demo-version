import type { AspectItem } from "../components/ScoreAspectWithTabs";
import { HARD_STANDARDS_BY_POSITION, HARD_SCORES_BY_PARTICIPANT } from "./hardCompetency.generated";

/**
 * Aspek hard competency (kompetensi teknis) untuk kartu Score Aspect.
 *
 * Datanya datang dari dua CSV lewat scripts/gen-hard-competency.mjs:
 *   public/data/position_hard_competency_standards.csv  (position, aspect, category, standard)
 *   public/data/participant_hard_competency_scores.csv  (id, name, aspect, score)
 *
 * Beda mendasar dengan aspek soft: daftar aspeknya SPESIFIK PER POSISI, bukan
 * satu daftar universal — itu sebabnya standarnya dikunci ke judul posisi, dan
 * CSV-nya long format (bukan wide seperti punya Vismap).
 *
 * Bentuk keluarannya sengaja sama persis dengan aspek soft (`AspectItem[]`),
 * jadi komponen list & radar yang sudah ada bisa dipakai ulang tanpa diubah.
 */
/** Aspek hard competency untuk satu orang di posisinya saat ini. */
export function hardAspectsFor(position: string, employeeId: string): AspectItem[] {
  // Generator sudah menulis standar untuk semua posisi yang ada di
  // participants.csv (memakai daftar default untuk posisi yang belum
  // didefinisikan), jadi daftar kosong hanya terjadi kalau posisinya benar-benar
  // tidak dikenal — UI-nya sudah menangani kondisi kosong.
  const defs = HARD_STANDARDS_BY_POSITION[position] ?? [];
  const scores = HARD_SCORES_BY_PARTICIPANT[employeeId] ?? {};

  return defs.map(({ label, category, standardScore }) => {
    // Kalau skornya belum ada di data (mis. orang baru), tampilkan apa adanya
    // sebagai 0 daripada menebak — biar gap-nya jujur terlihat.
    const score = scores[label] ?? 0;
    return { label, category, score, standardScore, dev: score < standardScore };
  });
}
