'use client';

import { Skeleton } from '@talentlytica/prodigy';

/**
 * Kerangka halaman — bentuk kosong yang tergambar selagi sebuah layar belum tiba.
 *
 * ── Kenapa ini ada, dan kenapa ia dipakai lewat `loading.tsx` ──
 *
 * Sebelum ini, mengeklik menu berarti MENUNGGU DI HALAMAN LAMA. App Router menahan
 * perpindahan sampai Server Component tujuannya selesai — jadi selama 1,3–5,1 detik
 * (terukur di aplikasi yang jalan: Home 3.036 ms, iProfile 2.002 ms, Talent Decision
 * 5.115 ms) layar tidak berubah sama sekali dan menu yang baru diklik tampak tidak
 * bereaksi. Orang mengeklik dua kali, atau menyimpulkan aplikasinya menggantung.
 *
 * `loading.tsx` memasang batas Suspense di perbatasan rute, dan batas itulah yang
 * membuat perpindahannya SEGERA: URL dan menu aktif berganti saat itu juga, lalu
 * penantiannya berlangsung DI HALAMAN TUJUAN sebagai kerangka ini.
 *
 * ── Kenapa kerangka, bukan tulisan "Memuat…" atau pemutar ──
 *
 * Tulisan tidak mengatakan apa pun tentang apa yang akan datang, dan pemutar di tengah
 * layar kosong membuat tiap halaman terasa sama. Kerangka menempati BENTUK layar yang
 * sedang datang, jadi mata sudah menemukan tempat tabel, kartu, dan bilah alatnya sebelum
 * isinya ada — dan saat isinya tiba, tidak ada yang melompat.
 *
 * ⚠️ Bentuknya SENGAJA perkiraan, bukan salinan tepat. Jumlah baris tabel dan jumlah kartu
 * berbeda tiap tenant dan tiap pemakai; mengejar ketepatan di sini berarti kerangka yang
 * basi tiap kali layarnya berubah sedikit. Yang dijaga cuma susunan kasarnya.
 */

/** Warna tepi dan latar kartu, disamakan dengan kartu sungguhan di layar-layar ini. */
const KARTU: React.CSSProperties = {
  background: 'var(--mantine-color-white)',
  border: '1px solid var(--mantine-color-neutral-2)',
  borderRadius: 12,
  padding: 16,
};

/**
 * Pembungkus setiap kerangka.
 *
 * `role="status"` + `aria-busy` diberikan SEKALI di sini, bukan di tiap balok: pembaca
 * layar cukup diberi tahu "halaman ini sedang memuat", dan mengumumkan tiga puluh balok
 * kosong satu per satu justru membuat keadaan ini lebih berisik daripada isinya nanti.
 */
export function Kerangka({ children, padding = '12px 16px 40px' }: { children: React.ReactNode; padding?: string }) {
  return (
    <div role="status" aria-busy="true" aria-label="Loading" style={{ padding, minHeight: '100vh' }}>
      <div aria-hidden style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  );
}

/** Bilah remah roti — garis tipis di puncak halaman, sebelum isinya. */
export function KerangkaRemah() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Skeleton height={12} width={72} radius={6} />
      <Skeleton height={12} width={8} radius={6} />
      <Skeleton height={12} width={96} radius={6} />
    </div>
  );
}

/**
 * Bilah alat: kolom cari di kiri, tombol di kanan.
 *
 * Susunan ini berulang di hampir seluruh layar daftar (iProfile, Team Profile, IDP,
 * seluruh Admin Settings), jadi ia satu bentuk yang dipakai bersama — bukan digambar
 * ulang di tiap `loading.tsx` dengan angka yang perlahan menyimpang satu sama lain.
 */
export function KerangkaAlat({ tombol = 2 }: { tombol?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Skeleton height={36} width={280} radius={8} />
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        {Array.from({ length: tombol }, (_, i) => (
          <Skeleton key={i} height={36} width={i === tombol - 1 ? 116 : 140} radius={8} />
        ))}
      </div>
    </div>
  );
}

/** Deret tab — dipakai layar yang membuka dengan pilihan tampilan (Talent Mapping, Role Access). */
export function KerangkaTab({ jumlah = 3 }: { jumlah?: number }) {
  return (
    <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--mantine-color-neutral-2)', paddingBottom: 12 }}>
      {Array.from({ length: jumlah }, (_, i) => (
        <Skeleton key={i} height={14} width={[104, 132, 116, 96][i % 4]} radius={6} />
      ))}
    </div>
  );
}

/**
 * Tabel: baris kepala lalu baris isi.
 *
 * Lebar tiap kolom sengaja TIDAK sama rata — kolom pertama dibuat paling lebar karena di
 * semua tabel di aplikasi ini kolom pertama memang nama orang atau nama benda, dan kolom
 * yang rata lebar membuat kerangkanya terbaca sebagai kisi, bukan sebagai tabel.
 */
export function KerangkaTabel({ baris = 8, kolom = 5 }: { baris?: number; kolom?: number }) {
  const lebar = (i: number) => (i === 0 ? '28%' : `${Math.floor(72 / Math.max(kolom - 1, 1))}%`);
  return (
    <div style={{ ...KARTU, padding: 0, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          gap: 24,
          padding: '14px 16px',
          background: 'var(--mantine-color-neutral-0)',
          borderBottom: '1px solid var(--mantine-color-neutral-2)',
        }}
      >
        {Array.from({ length: kolom }, (_, i) => (
          <div key={i} style={{ width: lebar(i) }}>
            <Skeleton height={12} width="70%" radius={6} />
          </div>
        ))}
      </div>
      {Array.from({ length: baris }, (_, r) => (
        <div
          key={r}
          style={{
            display: 'flex',
            gap: 24,
            alignItems: 'center',
            padding: '16px',
            borderBottom: r === baris - 1 ? undefined : '1px solid var(--mantine-color-neutral-1)',
          }}
        >
          {Array.from({ length: kolom }, (_, i) => (
            <div key={i} style={{ width: lebar(i) }}>
              {i === 0 ? (
                /* Kolom pertama memuat avatar + dua baris teks — bentuk yang dipakai
                   seluruh tabel orang di aplikasi ini. */
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Skeleton height={32} circle />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Skeleton height={10} width="80%" radius={6} />
                    <Skeleton height={8} width="55%" radius={6} />
                  </div>
                </div>
              ) : (
                <Skeleton height={10} width={`${55 + ((r + i) % 4) * 10}%`} radius={6} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Petak kartu — Home, Team Profile, dan layar mana pun yang membuka dengan kisi kartu. */
export function KerangkaPetak({
  jumlah = 6,
  tinggi = 180,
  minLebar = 280,
}: {
  jumlah?: number;
  tinggi?: number;
  minLebar?: number;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${minLebar}px, 1fr))`, gap: 16 }}>
      {Array.from({ length: jumlah }, (_, i) => (
        <Skeleton key={i} height={tinggi} radius={12} />
      ))}
    </div>
  );
}

/**
 * Panel besar — bagan, peta, atau kanvas yang mengisi lebar penuh.
 *
 * `flex: 1` DIPAKAI, bukan tinggi tetap: layar seperti Visibility Map dan Talent Decision
 * memang mengisi sisa tinggi layar, dan kerangka setinggi angka tetap akan menyisakan
 * pita kosong di bawahnya yang justru menonjolkan bahwa ini bukan halaman sungguhan.
 */
export function KerangkaKanvas({ tinggi }: { tinggi?: number }) {
  return <Skeleton height={tinggi} radius={12} style={tinggi == null ? { flex: 1, minHeight: 320 } : undefined} />;
}
