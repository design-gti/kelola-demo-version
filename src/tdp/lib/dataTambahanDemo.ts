/**
 * Data tambahan TDP versi demo.
 *
 * Di kelola-web, `/api/data-tambahan` mengambil kolom data extension perusahaan dari
 * backend. Demo ini tidak punya backend, tetapi sudah punya padanannya: halaman Profile
 * Data (`admin/profile-data`) tempat admin membuat data extension. Berkas ini menerjemahkan
 * isi store itu ke bentuk `DataTambahan` yang dibaca TDP, sehingga satu gerbang untuk
 * menambah data tetap Profile Data — persis maksud rancangan aslinya.
 *
 * Konsekuensi yang disengaja: extension yang dibuat user di sesi ini langsung muncul
 * sebagai kolom di Data Visibility TDP, dan hilang lagi saat halaman dimuat ulang, sama
 * seperti perilaku store Profile Data itu sendiri.
 *
 * Letaknya di luar berkas-berkas yang disalin dari kelola-web, supaya sinkronisasi
 * berikutnya tidak menimpanya.
 */
import {
  allProfiles,
  fieldsOf,
  type ExtensionColumnType,
} from '@/app/admin/profile-data/profiles';
import {
  EKSTENSI_BUKAN_TAMBAHAN,
  kunciKolomTambahan,
  type DataTambahan,
  type KolomTambahan,
  type TipeTambahan,
} from '@/lib/dataTambahan';

/** Tipe kolom Profile Data → tipe data tambahan yang dikenal TDP. */
const TIPE: Record<ExtensionColumnType, TipeTambahan> = {
  Text: 'string',
  'Long Text': 'longtext',
  'Number (Whole)': 'integer',
  'Number (Decimal)': 'decimal',
  Date: 'date',
};

/**
 * @param idKaryawan id yang dipakai TDP untuk mencari nilai — kolom `Referance ID` di CSV,
 *   yang di demo diisi id karyawan (`p01`…). Lihat `scripts/gen-tdp-data.mjs`.
 */
export function bangunDataTambahan(idKaryawan: readonly string[]): DataTambahan {
  const kolom: KolomTambahan[] = [];
  const nilai: DataTambahan['nilai'] = {};

  for (const ekstensi of allProfiles()) {
    // Hanya extension buatan perusahaan yang aktif. Bidang bawaan sudah punya tempat
    // sendiri di TDP (sumbu, asesmen, kompetensi) dan tidak boleh muncul dua kali.
    if (ekstensi.kind !== 'extension' || !ekstensi.enabled) continue;
    if (EKSTENSI_BUKAN_TAMBAHAN.has(ekstensi.slug)) continue;

    const kolomEkstensi = ekstensi.columns ?? [];
    const bidang = fieldsOf(ekstensi.slug);

    bidang.forEach((b, i) => {
      const id = kunciKolomTambahan(ekstensi.slug, kolomEkstensi[i]?.label ?? b.label);
      kolom.push({ id, label: b.label, tipe: TIPE[kolomEkstensi[i]?.type ?? 'Text'] });

      for (const pid of idKaryawan) {
        const mentah = b.valueOf(pid);
        // `format` menulis nilainya sesuai tipe (angka dengan koma desimal, tanggal
        // Indonesia, teks contoh). Null berarti belum ada datanya — dibiarkan null,
        // bukan "-", supaya TDP bisa membedakan kosong dari terisi.
        const teks = mentah == null ? null : (b.format ? b.format(mentah) : String(mentah));
        (nilai[pid] ??= {})[id] = teks;
      }
    });
  }

  return { kolom, nilai };
}
