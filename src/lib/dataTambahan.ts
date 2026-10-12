/**
 * Data TAMBAHAN: kolom data extension buatan perusahaan di Profile Data (Height, Medical Checkup, dan
 * apa pun yang ditambah admin), diperlakukan sebagai variabel di Data Visibility Talent Decision dan
 * Vismap — satu gerbang untuk menambah data, yaitu Profile Data.
 *
 * Berkas ini murni (tanpa server/klien) supaya server yang membangun daftarnya dan kedua layar yang
 * membacanya memakai aturan yang SAMA.
 *
 * Aturan tampil dan aturan bobot sengaja dipisah:
 *   • SEMUA tipe boleh tampil (di TDP maupun Vismap), termasuk tanggal dan attachment.
 *   • Hanya yang punya makna angka yang boleh DIBOBOT di tabel TDP:
 *       integer, decimal, yes/no           selalu
 *       text / long text                   hanya bila seluruh nilai yang terisi berupa angka
 *       date, attachment                   tidak pernah
 *     Nilai dikonversi ke skala 100 supaya sebanding dengan variabel lain (lihat `ke100`).
 */

/** Cluster tempat data tambahan berada secara bawaan; muncul hanya bila ada minimal satu. */
export const KLASTER_DATA_TAMBAHAN = { key: 'additional', label: 'Additional Data' } as const;

/** Data extension yang BUKAN data tambahan: sudah punya tempat sendiri (sumbu, asesmen, kompetensi). */
export const EKSTENSI_BUKAN_TAMBAHAN: ReadonlySet<string> = new Set([
  'de-performance',
  'de-engagement',
  'de-kompetensi',
  'de-potensi',
  'de-iq',
  'de-gtq',
  'de-disc',
  'de-16pf',
]);

export type TipeTambahan =
  | 'string'
  | 'longtext'
  | 'integer'
  | 'decimal'
  | 'date'
  | 'boolean'
  | 'attachment';

export interface KolomTambahan {
  /** `ext:<idEkstensi>:<namaKolom>` — kunci yang sama di TDP, Vismap, dan pemindahan cluster. */
  id: string;
  label: string;
  tipe: TipeTambahan;
}

export interface DataTambahan {
  kolom: KolomTambahan[];
  /** idKaryawan (UUID) → idKolom → nilai (string; null = belum diisi). */
  nilai: Record<string, Record<string, string | null>>;
}

export const kunciKolomTambahan = (idEkstensi: string, namaKolom: string) => `ext:${idEkstensi}:${namaKolom}`;

export const adalahKunciTambahan = (kunci: string) => kunci.startsWith('ext:');

const TIPE_DIKENAL = new Set<string>(['string', 'longtext', 'integer', 'decimal', 'date', 'boolean', 'attachment']);
export const sebagaiTipeTambahan = (t: string): TipeTambahan =>
  (TIPE_DIKENAL.has(t) ? t : 'string') as TipeTambahan;

const YA = new Set(['yes', 'ya', 'true', '1', 'y']);
const TIDAK = new Set(['no', 'tidak', 'false', '0', 'n']);

/** Teks yang terisi? (null/kosong = belum diisi, dilewati — bukan nol.) */
export const terisi = (v: string | null | undefined): v is string => v != null && String(v).trim() !== '';

/** Angka dari teks, atau null. Koma desimal gaya Indonesia diterima. */
export function keAngka(v: string | null | undefined): number | null {
  if (!terisi(v)) return null;
  const n = Number(String(v).trim().replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/** Yes/No dari teks, atau null bila bukan salah satunya. */
export function keYaTidak(v: string | null | undefined): boolean | null {
  if (!terisi(v)) return null;
  const s = String(v).trim().toLowerCase();
  if (YA.has(s)) return true;
  if (TIDAK.has(s)) return false;
  return null;
}

/**
 * Bolehkah kolom ini diberi bobot? `alasan` dipakai sebagai tooltip saat pilihannya dinonaktifkan.
 * `nilai` = seluruh nilai kolom itu (dipakai hanya untuk tipe text).
 */
export function bisaDibobotTambahan(
  tipe: TipeTambahan,
  nilai: ReadonlyArray<string | null | undefined>,
): { bisa: boolean; alasan?: string } {
  switch (tipe) {
    case 'integer':
    case 'decimal':
    case 'boolean':
      return { bisa: true };
    case 'string':
    case 'longtext': {
      const isi = nilai.filter(terisi);
      if (isi.length > 0 && isi.every((v) => keAngka(v) != null)) return { bisa: true };
      return { bisa: false, alasan: 'Weighting is only available for text that contains numbers.' };
    }
    case 'date':
      return { bisa: false, alasan: 'Date data cannot be weighted.' };
    case 'attachment':
      return { bisa: false, alasan: 'Attachment data cannot be weighted.' };
  }
}

/**
 * Nilai satu orang pada skala 0–100, atau null (dilewati, bobotnya dihitung ulang).
 *
 *   yes/no      Yes = 100, No = 0
 *   angka       min–max terhadap seluruh karyawan: terendah 0, tertinggi 100
 *               (jika semuanya sama, 100 — tak ada yang lebih rendah dari yang lain)
 *
 * `semua` = seluruh nilai kolom itu (untuk min–max).
 */
export function ke100Tambahan(
  tipe: TipeTambahan,
  nilai: string | null | undefined,
  semua: ReadonlyArray<string | null | undefined>,
): number | null {
  if (!terisi(nilai)) return null;
  if (tipe === 'boolean') {
    const b = keYaTidak(nilai);
    return b == null ? null : b ? 100 : 0;
  }
  const n = keAngka(nilai);
  if (n == null) return null;
  const angka = semua.map(keAngka).filter((x): x is number => x != null);
  const min = Math.min(...angka);
  const maks = Math.max(...angka);
  if (maks === min) return 100;
  return ((n - min) / (maks - min)) * 100;
}

/** Teks tampilan sebuah nilai data tambahan: yes/no jadi Yes/No, selebihnya apa adanya. "-" bila kosong. */
export function formatTambahan(tipe: TipeTambahan | string, nilai: string | null | undefined): string {
  if (!terisi(nilai)) return '-';
  if (tipe === 'boolean') {
    const b = keYaTidak(nilai);
    return b == null ? String(nilai) : b ? 'Yes' : 'No';
  }
  return String(nilai);
}
