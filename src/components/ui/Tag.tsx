"use client";
import { Badge } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";

/**
 * Tag/chip status. **Satu-satunya tempat pil status dibentuk** di SELURUH aplikasi.
 *
 * ── Kenapa ini ada ──
 *
 * Sebelumnya ada DUA cara membuat pil yang sama: empat `<Badge>` Mantine, dan
 * lima `<span>` yang dibentuk mirip pil dengan `background` + `borderRadius`
 * sendiri. Yang `<span>` bukan komponen, jadi ia tidak ikut satu pun ketetapan
 * design system.
 *
 * ── Dua cara memberi warna, dan yang mana yang benar ──
 *
 *   `warnaDS`        nama warna design system. INI yang dituju. Prodigy bilang
 *                    Badge adalah satu-satunya cara menampilkan status, dan
 *                    statusnya dipilih lewat `color` — netral `gray`, sukses
 *                    `success`, gagal `error`. Warnanya lalu datang dari theme,
 *                    bukan dari hex yang ditulis tangan.
 *
 *   `latar` + `warna`  jalan keluar untuk pil yang warnanya BELUM dipetakan ke
 *                    token. Beberapa kartu masih memakai hex di luar palet
 *                    (#dc3545, #28a745) — memetakannya menggeser warna secara
 *                    terlihat, jadi itu keputusan rancangan, bukan pembersihan.
 *
 * Tipenya memaksa pilih salah satu: memberi keduanya sekaligus tidak lolos
 * typecheck.
 *
 * ⚠️ Tidak ada `variant="draft"` di design system. Yang ada `color="gray"`, dan
 * "Draft" cuma LABEL di contohnya. Varian dikunci `light` di theme.
 *
 * ── Ukuran: `size="xs"`, dari sandbox design system ──
 *
 * Halaman "Sandbox & props" Badge di dokumentasi Prodigy menampilkan kombinasi
 * acuannya: `variant="light"` `color=<token>` `size="xs"` `radius="lg"`. Itu yang
 * dipakai di sini, dan `size` TIDAK diekspos sebagai prop supaya angka lain tidak
 * bisa masuk diam-diam dari tempat pemakaian — sama seperti `radius`.
 *
 * ⚠️ Skala `size` Badge memakai angkanya SENDIRI, terpisah dari skala huruf theme:
 *
 *     xs 9px    sm 10px    md 11px    lg 13px    xl 16px
 *
 * Jadi `xs` berarti 9px, dan pil di seluruh aplikasi ini kini 9px.
 *
 * Catatan di berkas ini sebelumnya memaksa 12px lewat `fontSize`, dengan alasan 9–11px
 * ada di bawah ambang 12px yang dipakai halaman lain. Ambang itu SENGAJA tidak lagi
 * berlaku untuk pil: acuannya sekarang sandbox design system, atas keputusan yang
 * diminta langsung. Kalau suatu saat 9px terbukti terlalu kecil untuk dibaca, yang
 * diubah satu baris di sini, bukan dua puluh tempat pemakaian.
 *
 * Keluarga hurufnya tetap tidak ditimpa — itu datang dari komponennya.
 *
 * ── Geometri dan bobot diserahkan ke komponennya ──
 *
 * Dulu tiap tempat pemakaian menulis paddingnya sendiri — `1px 6px`, `1px 8px`,
 * `2px 8px`, `3px 8px` — plus `height: "auto"` dan `lineHeight: 1.4`. Angka-angka
 * itu warisan dari zaman `<span>`, dipertahankan sebentar supaya konversi ke Badge
 * tidak menggeser piksel.
 *
 * Sekarang tidak ada lagi: padding, tinggi, line-height, dan bobot datang dari
 * Badge sendiri —
 *
 *     tinggi   `--badge-height-xs`
 *     padding  `--badge-padding-x-xs`
 *     lh       tinggi − 2px
 *     bobot    700       `--mantine-font-weight-bold`
 *
 * Yang paling terang menunjukkan kenapa ini perlu: pil status Monitoring IDP
 * TERLIHAT beda dari delapan pil lain di Beranda, dan ternyata justru karena ia
 * satu-satunya yang TIDAK menulis padding sendiri. Yang delapan itulah yang
 * menyimpang, bukan dia.
 *
 * ── Radius dikunci `lg`, dan propnya tidak ada ──
 *
 * Dulu tiap tempat pemakaian menentukan sendiri: 4, 6, 10, dan `xl`. Empat angka
 * untuk satu benda, dan tak satu pun punya alasan yang tertulis — dua di antaranya
 * (6 dan 10) bahkan bukan token radius mana pun.
 *
 * Sekarang `lg` untuk semuanya, tanpa jalan keluar: prop `radius` dibuang supaya
 * angka baru tidak bisa masuk diam-diam dari tempat pemakaian.

 */

/**
 * Warna yang benar-benar terdaftar di theme.
 *
 * ⚠️ Catatan lama di sini berbunyi "`info` dan `warning` yang disebut dokumen
 * Prodigy TIDAK ada — perannya dipegang `primary` dan `secondary`." Itu sudah
 * TIDAK berlaku: keduanya kini ada di `prodigyFoundation.ts` sebagai palet penuh
 * sepuluh langkah (`warning` #fff4e0…#b15200, `info` #e0ffff…#009db1). Tipe ini
 * yang ketinggalan, dan akibatnya pil oranye/biru-muda terpaksa lewat jalan
 * keluar `latar` + `warna` — hex tulis tangan — padahal tokennya sudah ada.
 */
export type WarnaDS =
  | "gray" | "primary" | "secondary" | "success" | "error" | "tertiary"
  | "warning" | "info";

/**
 * Tiga cara memberi warna, dan tipenya memaksa pilih SATU.
 *
 *   `warnaDS`         token design system. Ini yang dituju.
 *   `latar` + `warna`  jalan keluar untuk warna yang belum dipetakan ke token.
 *   `garis`           pil bergaya OUTLINE: satu warna untuk teks dan bordernya,
 *                     latar putih.
 *
 * `garis` ditambahkan supaya alasan terakhir untuk melewati `Tag` hilang. Pil taraf
 * di Talent Mapping bergaya outline dengan warna DINAMIS — token kotaknya, dan bisa
 * hex pilihan pengguna dari color picker — dan `latar`+`warna` tidak mengatur border,
 * jadi dulu pil itu memanggil `Badge` langsung. Sekarang tidak perlu lagi.
 */
type SumberWarna =
  | {
      warnaDS: WarnaDS;
      latar?: never;
      warna?: never;
      garis?: never;
      /**
       * Pil PADAT — latar penuh warna tokennya, teks putih (`variant="filled"`).
       *
       * Bawaannya `light` (latar pucat, teks berwarna) dan itu benar untuk STATUS:
       * pil status muncul berderet di dalam tabel dan kartu, dan latar penuh di sana
       * berteriak melebihi isinya.
       *
       * Yang padat dipakai untuk pil yang harus terbaca sebagai bagian dari sebuah
       * KONTROL, bukan keterangan di dalam isi — gelembung angka di dalam tombol
       * Filter, misalnya. Di sana pil pucat justru hilang di latar tombolnya sendiri.
       *
       * ⚠️ Hanya bersama `warnaDS`: kontras teks putihnya datang dari token theme.
       * Dengan hex tulis tangan (`latar`+`warna`) tak ada yang menjamin teksnya
       * terbaca, dan `garis` memang kebalikannya.
       */
      padat?: boolean;
    }
  | { warnaDS?: never; latar: string; warna: string; garis?: never; padat?: never }
  | { warnaDS?: never; latar?: never; warna?: never; garis: string; padat?: never };

export function Tag({
  children,
  kiri,
  kanan,
  bulat = false,
  style,
  onClick,
  judul,
  aktif = false,
  label,
  ...w
}: {
  children: ReactNode;
  /** Isi `leftSection`, misalnya titik penanda status. */
  kiri?: ReactNode;
  /**
   * Isi `rightSection` — dipakai pil yang bisa DIHAPUS (tombol × di kanannya),
   * misalnya daftar nama kategori di modal Buat Kategori.
   */
  kanan?: ReactNode;
  /**
   * Pil bundar tanpa label teks — untuk gelembung ANGKA, misalnya jumlah filter
   * aktif di dalam tombol Filter. Bentuknya beda karena perannya beda: ia
   * menghitung, bukan menyatakan status.
   */
  bulat?: boolean;
  /**
   * Pil yang bisa DITEKAN — dipakai chip penyaring status di Monitoring IDP.
   *
   * Diberikan di sini, bukan dengan membungkus `Tag` dalam `<button>` di tempat
   * pemakaian: pembungkus itu harus mematikan seluruh gaya tombol bawaan
   * (`all: unset`) dan yang pertama hilang adalah cincin fokusnya. Dengan
   * `component="button"`, Badge sendiri yang jadi tombolnya dan fokusnya utuh.
   */
  onClick?: () => void;
  /** Hanya berarti bersama `onClick`: menyala berarti penyaringnya aktif. */
  aktif?: boolean;
  /**
   * `aria-label` untuk pil yang bisa ditekan. Isi pilnya sering berupa singkatan
   * plus angka ("Need Review: 25") yang tak menyebut bahwa ia sebuah penyaring.
   */
  label?: string;
  /**
   * Atribut `title` — keterangan tambahan saat kursor berhenti di atas pil.
   *
   * Dipakai pil kategori IDP untuk menyebut nilai ASLI yang tersimpan: labelnya
   * dinormalkan untuk tampilan, dan normalisasi yang tak bisa diperiksa adalah
   * normalisasi yang tak bisa dipercaya.
   */
  judul?: string;
  /**
   * HANYA untuk urusan tata letak di sekitarnya — `flexShrink`, `width`. Bukan
   * untuk padding/tinggi/bobot: itu milik komponennya.
   */
  style?: CSSProperties;
} & SumberWarna) {
  const bisaDitekan = onClick != null;

  return (
    <Badge
      variant={w.garis ? "outline" : w.padat ? "filled" : "light"}
      color={w.warnaDS}
      size="xs"
      radius="lg"
      circle={bulat}
      leftSection={kiri}
      rightSection={kanan}
      title={judul}
      {...(bisaDitekan
        ? {
            component: "button" as const,
            type: "button" as const,
            onClick,
            "aria-pressed": aktif,
            "aria-label": label,
          }
        : null)}
      style={{
        ...(w.warnaDS
          ? null
          : w.garis
            ? { color: w.garis, borderColor: w.garis, background: "#fff" }
            : { background: w.latar, color: w.warna }),
        ...(bisaDitekan
          ? {
              cursor: "pointer",
              userSelect: "none",
              // Keadaan aktif ditandai garis luar, BUKAN dengan menggelapkan
              // latarnya: latar pil itu sudah membawa arti (warna statusnya), dan
              // menggantinya membuat pil yang menyala terbaca sebagai status lain.
              ...(aktif ? { outline: "2px solid currentColor", outlineOffset: 2 } : null),
            }
          : null),
        /*
          `textTransform` TIDAK diatur di sini lagi — dan itu justru perubahannya.

          Dulu baris ini menulis `kapital ? "uppercase" : "none"`, jadi bawaan Badge
          design system (`uppercase`) dimatikan dan harus diminta kembali per
          pemakaian lewat prop `kapital`. Hasilnya 28 dari 94 pil berkapital dan
          sisanya tidak: satu komponen dengan dua perilaku, dan yang mayoritas justru
          menyimpang dari design system-nya sendiri.

          Sekarang tidak ada yang menimpanya, jadi `text-transform: uppercase` dari
          komponennya berlaku di semua tempat.

          ⚠️ Konsekuensinya ditanggung sadar: label yang isinya DIKETIK pengguna
          (mis. nama kategori aspek) juga ikut tampil kapital, berbeda dari huruf yang
          ia simpan. Nilai aslinya tetap utuh di data dan di kotak suntingnya; yang
          berubah hanya tampilan pilnya.
        */
        ...style,
      }}
    >
      {children}
    </Badge>
  );
}
