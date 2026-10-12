/**
 * Pengelompokan (cluster) variabel di modal "Data Visibility" — SATU sumber untuk Talent Decision (TDP)
 * dan Vismap.
 *
 * Kedua modal membaca dan menulis simpanan yang SAMA, jadi memindahkan sebuah variabel ke cluster lain di
 * satu layar langsung terbaca di layar yang lain (diminta langsung). Yang dibagi:
 *
 *   • cluster bawaan dan isi bawaannya (3C: Commitment, Contribution, Capability);
 *   • cluster buatan pengguna (`userClusters.v1`);
 *   • pemindahan variabel antar-cluster (`clusterOverrides.v1`), dikunci KUNCI KOLOM TDP
 *     (`engagementScore`, `csv:Gender`, …) — itu sebabnya variabel Vismap diberi padanan kuncinya di
 *     `VARIABEL_VISMAP`.
 *
 * ── Isi bawaan 3C (sementara — bisa dipindah pengguna) ──
 *
 *   Commitment    Engagement
 *   Contribution  Performance
 *   Capability    Competency Score untuk JABATAN SAAT INI (% kecocokan terhadap standar posisi orang itu,
 *                 angka yang sama dengan iProfile)
 */

export interface Klaster {
  key: string;
  label: string;
}

/** Cluster bawaan, dalam urutan tampil. */
export const KLASTER_BAWAAN: Klaster[] = [
  { key: 'basic', label: 'Basic Information' },
  { key: 'commitment', label: 'Commitment' },
  { key: 'contribution', label: 'Contribution' },
  { key: 'capability', label: 'Capability' },
  { key: 'competencyScore', label: 'Competency Score' },
  { key: 'potency', label: 'Potency' },
  { key: 'careerHistory', label: 'Career History' },
  // Data tambahan dari Profile Data (lihat `lib/dataTambahan`). Seperti cluster bawaan lain, tersembunyi
  // selama tak ada variabelnya — jadi muncul otomatis begitu ada minimal satu data tambahan.
  { key: 'additional', label: 'Additional Data' },
];

/** Cluster bawaan variabel BERTIPE (kunci kolom TDP) yang menjadi isi cluster 3C dan Potency. */
export const KLASTER_BAWAAN_TIPE: Record<string, string> = {
  engagementScore: 'commitment',
  performanceRating: 'contribution',
  competencyMatch: 'capability',
  potentialRating: 'potency',
};

export const KUNCI_KLASTER_PENGGUNA = 'userClusters.v1';
export const KUNCI_OVERRIDE_KLASTER = 'clusterOverrides.v1';

function baca<T>(kunci: string, bawaan: T): T {
  if (typeof window === 'undefined') return bawaan;
  try {
    const mentah = window.localStorage.getItem(kunci);
    return mentah ? (JSON.parse(mentah) as T) : bawaan;
  } catch {
    return bawaan;
  }
}

function tulis(kunci: string, nilai: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(kunci, JSON.stringify(nilai));
  } catch {
    /* Penyimpanan diblokir: pilihan tetap berlaku sampai halaman ditutup. */
  }
}

export const bacaKlasterPengguna = (): Klaster[] => {
  const v = baca<unknown>(KUNCI_KLASTER_PENGGUNA, []);
  return Array.isArray(v) ? (v as Klaster[]).filter((k) => k && typeof k.key === 'string') : [];
};

export const bacaOverrideKlaster = (): Record<string, string> => {
  const v = baca<unknown>(KUNCI_OVERRIDE_KLASTER, {});
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, string>) : {};
};

export const simpanKlasterPengguna = (daftar: Klaster[]) => tulis(KUNCI_KLASTER_PENGGUNA, daftar);
export const simpanOverrideKlaster = (peta: Record<string, string>) => tulis(KUNCI_OVERRIDE_KLASTER, peta);

/** Cluster efektif sebuah variabel: pilihan pengguna bila ada, kalau tidak cluster bawaannya. */
export function klasterEfektif(
  kunci: string,
  klasterAsal: string,
  override: Record<string, string>,
  klasterPengguna: Klaster[],
): string {
  const pilihan = override[kunci];
  if (!pilihan) return klasterAsal;
  // Cluster tujuan yang sudah dihapus: variabel kembali ke cluster asalnya.
  const ada = KLASTER_BAWAAN.some((k) => k.key === pilihan) || klasterPengguna.some((k) => k.key === pilihan);
  return ada ? pilihan : klasterAsal;
}

/** Buat cluster buatan baru; mengembalikan daftar terbaru. */
export function tambahKlasterPengguna(label: string): Klaster[] {
  const bersih = label.trim();
  const daftar = bacaKlasterPengguna();
  if (!bersih) return daftar;
  const baru = [...daftar, { key: `user_${Date.now()}`, label: bersih }];
  simpanKlasterPengguna(baru);
  return baru;
}

/** Hapus cluster buatan; variabel di dalamnya kembali ke cluster asalnya. */
export function hapusKlasterPengguna(kunci: string): { klaster: Klaster[]; override: Record<string, string> } {
  const klaster = bacaKlasterPengguna().filter((k) => k.key !== kunci);
  const override = { ...bacaOverrideKlaster() };
  for (const k of Object.keys(override)) if (override[k] === kunci) delete override[k];
  simpanKlasterPengguna(klaster);
  simpanOverrideKlaster(override);
  return { klaster, override };
}

/** Pindahkan variabel ke cluster lain. */
export function pindahkanVariabel(kunci: string, tujuan: string): Record<string, string> {
  const override = { ...bacaOverrideKlaster(), [kunci]: tujuan };
  simpanOverrideKlaster(override);
  return override;
}

/**
 * Variabel yang bisa dicetak di kartu Vismap, dengan padanan kunci kolom TDP-nya — kunci inilah yang
 * dipakai pemindahan cluster bersama. `id` = kunci keadaan di Vismap (lihat `VisibleColumnsState`).
 */
export interface VariabelVismap {
  /** Kunci keadaan di Vismap; untuk data tambahan, sama dengan kunci kolomnya (`ext:…`). */
  id: string;
  kunciTdp: string;
  label: string;
  klasterAsal: string;
}

export const VARIABEL_VISMAP: VariabelVismap[] = [
  { id: 'gender', kunciTdp: 'csv:Gender', label: 'Gender', klasterAsal: 'basic' },
  { id: 'city', kunciTdp: 'csv:City', label: 'City', klasterAsal: 'basic' },
  { id: 'maritalStatus', kunciTdp: 'csv:Marital Status', label: 'Marital Status', klasterAsal: 'basic' },
  { id: 'iq', kunciTdp: 'csv:IQ', label: 'IQ', klasterAsal: 'basic' },
  { id: 'commitment', kunciTdp: 'engagementScore', label: 'Engagement', klasterAsal: 'commitment' },
  { id: 'performance', kunciTdp: 'performanceRating', label: 'Performance', klasterAsal: 'contribution' },
  { id: 'capability', kunciTdp: 'competencyMatch', label: 'Competency Score (Current Job)', klasterAsal: 'capability' },
];
