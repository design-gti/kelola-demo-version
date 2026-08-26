// Perhitungan kecocokan kompetensi untuk panel Development V3.
//
// Tiga sumber yang sudah dipakai modul lain (iProfile & Admin Job Position),
// bukan data baru — jadi angka di V3 tidak pernah berbeda arti dari sana:
//   POSISI    → aspek apa saja yang dinilai   (ASPECTS_BY_POSITION)
//   JOB/dept  → standar taraf tiap aspek      (STANDARDS_BY_JOB)
//   PARTISIPAN→ skor aspek + breakdown KB-nya (SCORES_BY_PARTICIPANT, KB_BY_PARTICIPANT)
import { ASPECTS_BY_POSITION, JOB_BY_POSITION, KB_BY_PARTICIPANT } from "@/data/model/aspects.generated";
import { aspectsFor, descriptionOfAspect } from "@/iprofile/lib/aspects";

export interface DevKeyBehaviour {
  label: string;
  level: number;
  /** Skor KB partisipan (1-5); null kalau datanya belum ada. */
  score: number | null;
}

export interface DevAspect {
  label: string;
  description: string;
  /** Skor aspek partisipan, 1-5. */
  score: number;
  /** Standar taraf yang dituntut posisi yang sedang dibandingkan, 1-5. */
  standard: number;
  /** Selisih yang harus ditutup (standard - score), selalu > 0 di daftar ini. */
  gap: number;
  /** Key Behaviour yang belum memenuhi standar posisi tersebut. */
  keyBehaviours: DevKeyBehaviour[];
}

/** Semua posisi yang punya data aspek — isi dropdown Target Position. */
export function positionOptions(): string[] {
  return Object.keys(ASPECTS_BY_POSITION).sort((a, b) => a.localeCompare(b));
}

export function hasCompetencyData(position?: string | null): boolean {
  return !!position && !!ASPECTS_BY_POSITION[position];
}

export function jobOfPosition(position: string): string {
  return JOB_BY_POSITION[position] ?? "";
}

/**
 * Persentase kecocokan kompetensi seseorang terhadap standar sebuah posisi.
 *
 * Formulanya disamakan dengan `matchPercent` di src/vismap/v2/layers.ts —
 * rata-rata rasio skor/standar per aspek, tiap aspek dibatasi 100%, hasilnya
 * dibatasi 99 karena tidak ada yang benar-benar "100% siap". Bedanya hanya
 * sumber data: di sini aspek diambil per POSISI (maks 12 aspek, standar per
 * job), bukan 13 aspek tetap seperti dataset V2.
 *
 * null kalau posisinya tidak punya data aspek.
 */
export function matchPercentFor(employeeId: string, position: string): number | null {
  const items = aspectsFor(position, employeeId);
  if (items.length === 0) return null;

  const ratios = items
    .filter(a => a.standardScore > 0)
    .map(a => Math.min(100, (a.score / a.standardScore) * 100));
  if (ratios.length === 0) return null;

  const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  return Math.min(99, Math.round(avg));
}

/**
 * Aspek yang skornya di bawah standar posisi tersebut, beserta Key Behaviour
 * yang belum terpenuhi.
 *
 * KB dianggap "belum terpenuhi" bila tarafnya masih dalam jangkauan standar
 * (level <= standar) TAPI skornya belum mencapai standar itu — sejalan dengan
 * aturan tingkat aspek (`dev = score < standardScore`) yang dipakai iProfile,
 * jadi satu orang tidak bisa tampak "perlu develop" di satu tempat dan
 * "sudah memenuhi" di tempat lain.
 */
export function devAspectsFor(employeeId: string, position: string): DevAspect[] {
  return aspectsFor(position, employeeId)
    .filter(a => a.dev)
    .map(a => {
      // KB diambil langsung dari KB_BY_PARTICIPANT, bukan dari AspectItem:
      // tipe KeyBehaviour milik iProfile membuang field `level`, sementara di
      // sini taraf KB justru yang menentukan mana yang masih di bawah standar.
      const kbs = (KB_BY_PARTICIPANT[employeeId]?.[a.label] ?? [])
        .filter(kb => kb.level <= a.standardScore && kb.score < a.standardScore)
        .map(kb => ({ label: kb.label, level: kb.level, score: kb.score ?? null }));

      return {
        label: a.label,
        description: descriptionOfAspect(a.label),
        score: a.score,
        standard: a.standardScore,
        gap: a.standardScore - a.score,
        keyBehaviours: kbs,
      };
    })
    .sort((x, y) => y.gap - x.gap || x.label.localeCompare(y.label));
}
