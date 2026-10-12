import type { DataTambahan } from '@/lib/dataTambahan';

/**
 * Data tambahan (Profile Data) untuk pulau TDP.
 *
 * Disuntikkan `/tdp-view` SEBELUM App-nya diimpor, sama dengan `setRawCsv`: pulau TDP membaca
 * datanya saat modul dimuat, dan tidak punya jalur props dari halaman.
 */
let isi: DataTambahan = { kolom: [], nilai: {} };

export const setDataTambahan = (d: DataTambahan) => {
  isi = d;
};

export const ambilDataTambahan = (): DataTambahan => isi;
