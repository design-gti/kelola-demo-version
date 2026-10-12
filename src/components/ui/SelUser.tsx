import type { ReactNode } from "react";
import { Group, Stack, Text } from "@mantine/core";
import { Avatar, Anchor } from "@talentlytica/prodigy";

/**
 * User cell — pola "Avatar + nama + keterangan dalam satu baris".
 *
 * ── Dari mana bentuknya ──
 *
 * Ini bukan bentuk karangan. Ia pola yang didokumentasikan design system Kelola di
 * section Display dengan nama "User cell", dan kodenya di dokumentasi itu persis:
 *
 *     <Group gap="sm">
 *       <Avatar src={PHOTO} name="Fira Utomo" size="md" />
 *       <Stack gap={0}>
 *         <Text fw={600} size="sm">Fira Utomo</Text>
 *         <Text size="xs" c="dimmed">CEO #1 · firuto@mail.com</Text>
 *       </Stack>
 *     </Group>
 *
 * Berkas ini menyalin komposisi itu, tidak menafsirkannya.
 *
 * ── Kenapa ada berkas lokal, bukan impor dari paket ──
 *
 * `@talentlytica/prodigy` 1.5.0 mengekspor 58 komponen dan TIDAK ADA satu pun bernama
 * UserCell / Cell / Person. Diperiksa langsung di `dist/components`. Sebabnya wajar:
 * User cell adalah POLA KOMPOSISI dari primitif (Group + Avatar + Stack + Text), bukan
 * komponen terpaket — jadi tidak ada yang bisa diimpor.
 *
 * Preseden untuk berkas seperti ini sudah ada di repo: `src/components/ui/Tag.tsx`,
 * yang dibuat justru karena skala `size` Badge tidak menutupi kebutuhan. Prinsipnya
 * sama — satu tempat memegang keputusan design system, supaya tempat kesembilan nanti
 * tidak melenceng lagi.
 *
 * ── Apa yang digantikannya ──
 *
 * Delapan tempat menampilkan orang dengan EMPAT implementasi avatar berbeda: Avatar DS
 * 28px, `<img>` mentah 40px, dan dua lingkaran buatan tangan (30px dan 32px). Ukuran
 * nama 12/13px/`sm`, bobot 600 dan 700, dan dua di antaranya masih membawa bug yang
 * sudah diperbaiki di tempat lain — font literal `'Open Sans'` (jatuh ke Arial) dan
 * `Avenir 13px` di luar skala.
 *
 * ⚠️ Inisial TIDAK dihitung di sini. `Avatar` mengerjakannya sendiri lewat prop `name`
 * + `color="initials"` — didokumentasikan di typing-nya: "When `src` is not set, used
 * to display initials and to generate color". Lima tempat sebelumnya menghitungnya
 * tangan, masing-masing dengan aturan potong nama sendiri.
 */
export function SelUser({
  nama,
  foto,
  keterangan,
  href,
  onKlikNama,
  ukuran = "sm",
  diLatarGelap = false,
  kanan,
  bawah,
  komponenTautan,
  targetTautan,
}: {
  nama: string;
  /** URL foto. `null`/`undefined` → Avatar menggambar inisial dari `nama`. */
  foto?: string | null;
  /** Baris kedua: jabatan, nomor karyawan, email, nama IDP. Pola menyebutnya "caption". */
  keterangan?: ReactNode;
  /** Kalau diisi, nama jadi tautan. */
  href?: string;
  /**
   * Komponen untuk tautannya, mis. Link dari next/link.
   *
   * Perlu ada karena tanpanya nama yang tadinya next/link turun jadi <a> biasa, dan
   * itu mengubah perpindahan halaman dari sisi-klien menjadi muat ulang penuh —
   * regresi yang tidak terlihat di tangkapan layar mana pun.
   */
  komponenTautan?: React.FunctionComponent<{ href: string; children?: ReactNode }>;
  /**
   * target untuk tautannya. Dipakai TDP dengan "_top", dan itu disengaja: TDP punya
   * router sendiri di dalam pulau vendornya, jadi tautan ke rute Next harus keluar
   * dari router itu alih-alih ditangkapnya.
   */
  targetTautan?: string;
  /**
   * Untuk nama yang bertindak sebagai tombol, bukan tautan.
   *
   * Menerima event-nya karena pemakainya butuh `stopPropagation()`: di Talent Mapping
   * seluruh barisnya sudah bisa diklik untuk menyorot orang di box mapping, dan nama
   * di dalamnya menuju iProfile — tanpa itu satu klik melakukan keduanya.
   */
  onKlikNama?: (e: React.MouseEvent) => void;
  /**
   * Token ukuran Avatar. Bawaannya "sm" (26px), dan SETIAP pemakai memakai bawaan itu.
   * Satu ukuran untuk semua tempat — tidak ada pertanyaan "tempat ini pakai yang mana".
   *
   * ⚠️ Dokumentasi pola menulis size="md" (38px), jadi ini penyimpangan sadar dari
   * contohnya — bukan dari skalanya. Alasannya dicoba di layar: "xs" (16px) terlalu
   * kecil untuk foto orang, "md" terasa berat di tabel padat, "sm" yang dipakai.
   *
   * Ketiganya diganti lewat SATU nilai bawaan di sini, bukan sebelas tempat — dan
   * itulah alasan prop ini dipertahankan meski tak ada yang mengoperkannya.
   *
   * Tetap dibatasi ke token, bukan angka. `size` Avatar memang menerima number, tapi
   * membukanya akan mengembalikan ukuran-ukuran lepas yang justru sedang dihapus:
   * xs 16 / sm 26 / md 38 / lg 56.
   */
  ukuran?: "xs" | "sm" | "md" | "lg";
  /**
   * Untuk User cell yang berdiri di atas latar GELAP — rail sidebar, misalnya.
   *
   * Perlu ada karena `keterangan` memakai `c="dimmed"`, warna yang DISEBUT eksplisit
   * dan karena itu tidak ikut mewarisi apa pun dari induknya: di atas biru rail ia
   * jadi kelabu di atas biru, dan terukur gagal ambang kontras. Nama pun begitu —
   * bawaannya warna teks gelap.
   *
   * ⚠️ Opt-in, bawaannya `false`. Sebelas pemakai lain berdiri di atas kartu putih
   * dan tidak boleh berubah sedikit pun karena penambahan ini.
   *
   * Nilainya mengikuti yang sudah dipakai rail: putih untuk nama, putih 60% untuk
   * keterangan — sama dengan nama corporate di rail yang sama.
   */
  diLatarGelap?: boolean;
  /** Slot kanan: tombol pin, pil status. Di luar pola, tapi dibutuhkan dua tempat. */
  kanan?: ReactNode;
  /**
   * Baris ketiga di bawah keterangan — mis. pil kategori box di Talent Mapping.
   *
   * Di luar pola juga: dokumentasi User cell hanya menyebut nama (title) dan satu
   * keterangan (caption). Dibiarkan sebagai slot, bukan dijejalkan ke `keterangan`,
   * supaya isinya boleh berupa komponen (Tag) dan bukan cuma teks.
   */
  bawah?: ReactNode;
}) {
  /*
    Nama yang bisa diklik — TAUTAN sungguhan (`href`) maupun tombol (`onKlikNama`) —
    tetap berwarna primary, dan itu penyimpangan yang dipilih sadar: pola tidak
    menyebut warna sama sekali (jadi bawaannya gelap), tapi di TDP, Successors, dan
    Talent Mapping nama ini satu-satunya jalan ke iProfile. Menghapus warnanya
    berarti menghapus satu-satunya petunjuk bahwa ia bisa diklik.

    ⚠️ Sebelumnya warna primary ini HANYA menyala di cabang `href` (lewat `Anchor`).
    Cabang `onKlikNama` (`isiNamaBukanTautan` di bawah) sudah `role="link"`, sudah
    `cursor: pointer`, sudah bisa dijalankan dari keyboard — tapi warnanya tetap abu
    gelap `neutral-7`, satu-satunya petunjuk visual yang hilang. Kolom Employee tabel
    "All Box Mapping" (`AllMappingTable.tsx`) dan panel kiri Talent Mapping
    (`MappingSidePanel.tsx`) sama-sama memakai `onKlikNama`, jadi keduanya sama-sama
    kena — bukan cuma satu tempat yang salah pakai prop.
  */
  const gayaNama = {
    size: "sm" as const,
    fw: 600,
    underline: "hover" as const,
    style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  };

  // Di latar gelap nama memakai putih penuh dan keterangan putih 60% — nilai yang
  // sudah dipakai rail sidebar untuk nama corporate, jadi keduanya sepadan. Di
  // latar terang, nama yang bisa diklik (`onKlikNama`, tanpa `href`) memakai
  // primary — sama seperti cabang `Anchor` di bawah, lihat catatan di atas.
  const warnaNama = diLatarGelap ? "var(--mantine-color-white)" : onKlikNama ? "primary" : undefined;
  const warnaKeterangan = diLatarGelap ? "rgba(255,255,255,0.6)" : "dimmed";

  /*
    Dua cabang tautan, bukan satu dengan prop opsional — dan itu tuntutan tipe, bukan
    selera: begitu `component` diberikan, Mantine mempersempit prop Anchor ke prop
    komponen itu, dan `target` tidak ada di sana. Keduanya memang tidak pernah
    dibutuhkan bersamaan: `komponenTautan` untuk navigasi sisi-klien di dalam aplikasi,
    `targetTautan` justru untuk KELUAR dari router pulau TDP.
  */
  const isiNama = !href ? null : komponenTautan ? (
    <Anchor component={komponenTautan} href={href} {...gayaNama}>
      {nama}
    </Anchor>
  ) : (
    <Anchor href={href} target={targetTautan} rel={targetTautan ? "noopener noreferrer" : undefined} {...gayaNama}>
      {nama}
    </Anchor>
  );

  const isiNamaBukanTautan = (
    <Text
      size="sm"
      fw={600}
      c={warnaNama}
      truncate
      role={onKlikNama ? "link" : undefined}
      tabIndex={onKlikNama ? 0 : undefined}
      onClick={onKlikNama}
      // Nama yang bisa diklik harus bisa dijalankan dari papan tuts, bukan cuma tetikus.
      onKeyDown={onKlikNama ? e => { if (e.key === "Enter") onKlikNama(e as unknown as React.MouseEvent); } : undefined}
      style={onKlikNama ? { cursor: "pointer", width: "fit-content", maxWidth: "100%" } : undefined}
    >
      {nama}
    </Text>
  );

  return (
    <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
      {/* `name` dipakai DUA hal: sumber inisial saat `src` kosong, dan teks alternatif. */}
      <Avatar src={foto ?? undefined} name={nama} color="initials" size={ukuran} style={{ flexShrink: 0 }} />
      {/* `flex: 1` saat ada slot kanan: kolom nama mengisi sisa lebar, jadi isi slot kanan
          menempel di tepi kanan — bukan tepat di belakang nama, yang membuat letaknya
          bergeser mengikuti panjang nama. */}
      <Stack gap={0} style={{ minWidth: 0, flex: kanan ? 1 : undefined }}>
        {isiNama ?? isiNamaBukanTautan}
        {keterangan != null && (
          <Text size="xs" c={warnaKeterangan} truncate>
            {keterangan}
          </Text>
        )}
        {bawah}
      </Stack>
      {kanan}
    </Group>
  );
}
