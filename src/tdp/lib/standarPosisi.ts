/**
 * Standar aspek per JABATAN, untuk baris Competency Score di mode Target.
 *
 * Compare di kelola-web mengimpor `STANDARDS_BY_POSITION` dari berkas hasil-generate
 * `aspects.generated`. Generator di repo demo ini membuat peta yang lebih kasar —
 * standar per JOB (departemen), bukan per jabatan — jadi bentuk yang diharapkan
 * Compare diturunkan di sini dari dua peta yang memang ada.
 *
 * Sengaja berkas terpisah, bukan menambah ekspor ke `aspects.generated.ts`: berkas itu
 * ditimpa ulang oleh `scripts/gen-aspects.mjs` setiap `npm run seed`, dan tambahan
 * tangan di dalamnya akan hilang tanpa ada yang tahu. Letaknya juga di luar berkas-
 * berkas yang disalin dari kelola-web, supaya sinkronisasi berikutnya tidak menimpanya.
 *
 * Konsekuensinya: dua jabatan di satu departemen berbagi standar yang sama. Itu
 * cukup untuk demo, dan Compare hanya memakainya untuk memilih baris aspek mana yang
 * ditampilkan — kalau jabatannya tak ketemu, ia jatuh kembali ke skor polos.
 */
import { JOB_BY_POSITION, STANDARDS_BY_JOB } from '@/data/model/aspects.generated';

export const STANDARDS_BY_POSITION: Record<string, Record<string, number>> = Object.fromEntries(
  Object.entries(JOB_BY_POSITION).map(([posisi, job]) => [posisi, STANDARDS_BY_JOB[job] ?? {}]),
);
