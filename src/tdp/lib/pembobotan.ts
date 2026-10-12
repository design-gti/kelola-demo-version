/**
 * Pembobotan ranking Talent Decision (Table).
 *
 * Model (murni, tanpa React, supaya bisa dites):
 *
 *   1. KONVERSI ke satu skala. Setiap variabel diubah ke 0–100 SEBELUM dibobot — tanpa itu butir
 *      berskala 1–5 dan Performance 0–100 tidak sebanding. Lihat `csvKe100`.
 *   2. BOBOT untuk variabel DAN untuk cluster. Semuanya bawaannya 1; angkanya boleh dinaikkan
 *      dalam kelipatan 0,5 (1,5 / 2 / …) dan tidak boleh 0 (variabel yang tak diinginkan cukup tidak
 *      dicentang di Data Visibility). Bobot 2 = variabel itu dihitung dua kali lebih berpengaruh.
 *      Tak ada keharusan total 100%.
 *   3. SKOR CLUSTER = rata-rata tertimbang variabel di dalamnya (tetap 0–100), jadi cluster berisi 40
 *      butir tak otomatis mengalahkan cluster berisi satu butir.
 *   4. SKOR AKHIR (ranking) = rata-rata tertimbang skor cluster yang punya data, sudah skala 100.
 *      Cluster juga punya bobot (bawaan 1, aturan yang sama dengan bobot variabel).
 *   5. DATA KOSONG dilewati: orang tanpa satu butir tidak dihukum nol — skornya dihitung dari yang ADA.
 */

/** Skala asli sebuah butir CSV: 1–5 (butir aspek) atau sudah 0–100. */
export function skalaCsv(header: string): 5 | 100 {
  // Butir aspek berawalan kurung siku: [GENERAL], [TECHNICAL], [POTENSI], [KOMPETENSI], [ENGAGEMENT], …
  // (kecuali tipe teks seperti [LEADERSHIP STYLE], yang bukan skor dan tak pernah dibobot).
  if (/^\[(GENERAL|TECHNICAL|POTENSI|KOMPETENSI|ENGAGEMENT|LEADERSHIP PROFILE)\]/.test(header)) return 5;
  // Kolom polos (Performance, Engagement, Potensi, Capability, …) sudah 0–100.
  return 100;
}

const batas = (n: number) => Math.max(0, Math.min(100, n));

/** Nilai mentah satu butir CSV → skor 0–100, atau `null` bila kosong/bukan angka. */
export function csvKe100(header: string, mentah: unknown): number | null {
  if (mentah === undefined || mentah === null) return null;
  const teks = String(mentah).trim().replace(/%$/, '');
  if (teks === '' || teks === '#N/A' || teks === 'N/A') return null;
  const n = parseFloat(teks);
  if (Number.isNaN(n)) return null;
  return batas(skalaCsv(header) === 5 ? n * 20 : n);
}

export type Bobot = Record<string, number>;

/** Bobot bawaan setiap variabel. */
export const BOBOT_BAWAAN = 1;
/** Bobot terkecil yang boleh (bukan 0) dan kelipatannya. */
export const BOBOT_MIN = 0.5;
export const BOBOT_LANGKAH = 0.5;
export const BOBOT_MAKS = 10;

/** Bobot yang diketik → bobot sah: kelipatan 0,5, antara 0,5 dan 10. Bukan angka → bobot bawaan. */
export function rapikanBobot(mentah: number): number {
  if (!Number.isFinite(mentah)) return BOBOT_BAWAAN;
  const bulat = Math.round(mentah / BOBOT_LANGKAH) * BOBOT_LANGKAH;
  return Math.max(BOBOT_MIN, Math.min(BOBOT_MAKS, bulat));
}

export interface ButirBerbobot {
  /** Nilai 0–100, atau null bila datanya kosong (dilewati). */
  nilai: number | null;
  bobot: number;
}

/** Skor cluster: rata-rata tertimbang butir yang ADA; null bila tak satu pun punya nilai. */
export function skorCluster(butir: ButirBerbobot[]): number | null {
  let jumlah = 0;
  let total = 0;
  for (const b of butir) {
    if (b.nilai === null || !(b.bobot > 0)) continue;
    jumlah += b.nilai * b.bobot;
    total += b.bobot;
  }
  return total > 0 ? jumlah / total : null;
}

/**
 * Skor akhir 0–100: rata-rata (tertimbang bila ada bobot cluster) skor cluster yang punya data; tanpa
 * cluster berdata → 0. `bobot` sejajar dengan `skorPerCluster`; tanpa itu semua cluster bobot 1.
 */
export function skorAkhir(skorPerCluster: (number | null)[], bobot?: number[]): number {
  return skorCluster(skorPerCluster.map((nilai, i) => ({ nilai, bobot: bobot?.[i] ?? BOBOT_BAWAAN }))) ?? 0;
}
