'use client';

import { Kerangka, KerangkaAlat, KerangkaKanvas, KerangkaPetak, KerangkaRemah, KerangkaTab, KerangkaTabel } from './KerangkaHalaman';

/**
 * Kerangka SATU layar, satu per menu — dan `kerangkaUntuk` yang memilihnya dari URL.
 *
 * ── Kenapa bentuknya tinggal di sini, bukan di tiap `loading.tsx` ──
 *
 * Bentuk yang sama dibutuhkan DUA kali untuk satu penantian:
 *
 *   1. `loading.tsx` — dipakai App Router saat kerangka rutenya sudah ada di peramban
 *      (build produksi, sesudah prefetch).
 *   2. `kerangkaUntuk` — dipakai `PindahRute` saat kerangka itu BELUM ada, yaitu di
 *      `pnpm dev` (prefetch Next mati di sana) dan pada klik pertama sebelum prefetch
 *      sempat jalan.
 *
 * Kalau keduanya menggambar bentuknya sendiri-sendiri, satu layar bisa berpindah bentuk
 * di tengah penantian — dan yang satu pasti tertinggal saat layarnya berubah. Di sini
 * keduanya membaca sumber yang sama.
 */

export function KerangkaHome() {
  return (
    <Kerangka padding="16px">
      <KerangkaKanvas tinggi={220} />
      <KerangkaPetak jumlah={6} tinggi={260} minLebar={320} />
    </Kerangka>
  );
}

/** Layar daftar: remah roti, bilah alat, tabel. Dipakai iProfile dan seluruh Admin Settings. */
export function KerangkaDaftar({ baris = 9, kolom = 5, tombol = 2 }: { baris?: number; kolom?: number; tombol?: number }) {
  return (
    <Kerangka>
      <KerangkaRemah />
      <KerangkaAlat tombol={tombol} />
      <KerangkaTabel baris={baris} kolom={kolom} />
    </Kerangka>
  );
}

export function KerangkaVismap() {
  return (
    <Kerangka padding="16px">
      <KerangkaTab jumlah={3} />
      <div style={{ display: 'flex', gap: 16, minHeight: 'calc(100vh - 160px)' }}>
        <KerangkaKanvas />
        {/* Panel layer di kanan — lebarnya tetap, sama seperti panel sungguhannya. */}
        <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <KerangkaKanvas tinggi={180} />
          <KerangkaKanvas tinggi={240} />
        </div>
      </div>
    </Kerangka>
  );
}

export function KerangkaTdp() {
  return (
    <Kerangka padding="16px">
      <KerangkaTab jumlah={4} />
      <KerangkaKanvas tinggi={120} />
      <div style={{ minHeight: 'calc(100vh - 280px)', display: 'flex' }}>
        <KerangkaKanvas />
      </div>
    </Kerangka>
  );
}

export function KerangkaPeta() {
  return (
    <Kerangka padding="16px">
      <KerangkaTab jumlah={3} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16 }}>
        <KerangkaKanvas tinggi={320} />
        <KerangkaKanvas tinggi={320} />
      </div>
      <KerangkaTabel baris={6} kolom={6} />
    </Kerangka>
  );
}

export function KerangkaTim() {
  return (
    <Kerangka padding="16px">
      <KerangkaTab jumlah={2} />
      <KerangkaAlat />
      <KerangkaPetak jumlah={6} tinggi={150} minLebar={260} />
    </Kerangka>
  );
}

/**
 * Kerangka Create IDP dan Detail Review IDP — satu tabel formulir, tanpa bilah alat.
 *
 * Dibedakan dari `KerangkaIdp` (Monitoring) karena keduanya memang beda bentuk: Monitoring
 * membuka dengan pencarian dan pita ringkasan, formulir langsung dengan tabelnya. Kerangka
 * yang salah bentuk membuat isinya melompat begitu datang — persis yang ingin dihindari.
 */
export function KerangkaFormulirIdp() {
  return (
    <Kerangka padding="24px">
      <KerangkaRemah />
      <KerangkaAlat tombol={2} />
      <KerangkaTabel baris={3} kolom={7} />
    </Kerangka>
  );
}

/** Kerangka antrean Review IDP: kotak cari lalu tabel permintaan. */
export function KerangkaReviewIdp() {
  return (
    <Kerangka padding="24px">
      <KerangkaRemah />
      <KerangkaAlat tombol={0} />
      <KerangkaTabel baris={5} kolom={6} />
    </Kerangka>
  );
}

/**
 * Kerangka layar impor: remah lalu SATU kartu tinggi.
 *
 * Bukan `KerangkaDaftar` yang jadi bawaan `/admin`: layar impor tidak punya tabel, dan
 * kerangka bertabel yang berubah jadi kartu begitu isinya datang membuat halamannya
 * tampak melompat.
 */
export function KerangkaImpor() {
  return (
    <Kerangka padding="24px">
      <KerangkaRemah />
      <KerangkaKanvas tinggi={420} />
    </Kerangka>
  );
}

export function KerangkaIdp() {
  return (
    <Kerangka padding="24px">
      <KerangkaAlat />
      <KerangkaKanvas tinggi={72} />
      <KerangkaTabel baris={8} kolom={4} />
    </Kerangka>
  );
}

export function KerangkaPengembangan() {
  return (
    <Kerangka padding="24px">
      <KerangkaKanvas tinggi={96} />
      <KerangkaPetak jumlah={4} tinggi={200} minLebar={300} />
    </Kerangka>
  );
}

/**
 * Kerangka yang cocok untuk sebuah URL.
 *
 * ⚠️ Dicocokkan dari yang PALING PANJANG, sama seperti `menuTitle` di `lib/nav.ts`:
 * `/idp/program-library` harus menang atas `/idp`, dan `/` — yang cocok dengan segalanya
 * kalau dipakai `startsWith` — hanya boleh menang saat URL-nya memang persis `/`.
 *
 * Yang tak dikenali jatuh ke `KerangkaDaftar`: susunan remah-alat-tabel adalah bentuk yang
 * paling sering benar di aplikasi ini, dan tebakan yang meleset sedikit tetap jauh lebih
 * baik daripada layar kosong.
 */
const PETA_KERANGKA: readonly (readonly [string, () => React.ReactElement])[] = [
  ['/iprofile', () => <KerangkaDaftar baris={10} tombol={1} />],
  ['/vismap', KerangkaVismap],
  ['/tdp-view', KerangkaTdp],
  ['/talent-mapping', KerangkaPeta],
  ['/team-profile', KerangkaTim],
  ['/my-development', KerangkaPengembangan],
  /*
    ⚠️ Yang LEBIH PANJANG harus lebih dulu — `kerangkaUntuk` mengurutkan panjang awalan,
    jadi urutan di larik ini tidak menentukan. Disebut di sini supaya yang menambah baris
    berikutnya tidak mengandalkan urutan penulisan.
  */
  ['/idp/new', KerangkaFormulirIdp],
  ['/idp/reviews', KerangkaReviewIdp],
  ['/idp', KerangkaIdp],
  ['/admin/employee/import', KerangkaImpor],
  ['/admin/job-position/import', KerangkaImpor],
  ['/admin', () => <KerangkaDaftar />],
  ['/internal', () => <KerangkaDaftar kolom={4} tombol={1} />],
];

export function kerangkaUntuk(pathname: string): React.ReactElement {
  if (pathname === '/') return <KerangkaHome />;
  const hit = [...PETA_KERANGKA].sort((a, b) => b[0].length - a[0].length).find(([awalan]) => pathname.startsWith(awalan));
  const Bentuk = hit?.[1];
  return Bentuk ? <Bentuk /> : <KerangkaDaftar />;
}
