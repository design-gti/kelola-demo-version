// Pil persentase kesiapan promosi (succession readiness) — SATU elemen yang
// dipakai bersama oleh kanvas Vismap V3 (di garis struktur atas card position)
// dan panel Succession, supaya angka yang sama tidak tampil dengan dua gaya.
//
// Gayanya filled + teks putih. Warna latar diturunkan dari range readiness di
// Setting Heatmap Condition, tapi DIGELAPKAN dulu sampai teks putih benar-benar
// terbaca (lihat pillFillColor) — oranye range `#FD9F28` misalnya terlalu terang
// untuk teks putih, dan turun jadi oranye tua.
import { TrendingUp } from 'lucide-react';

/** Kontras WCAG minimal antara teks putih dan latar pil. */
const MIN_CONTRAST = 4.5;

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

function toHex([r, g, b]: [number, number, number]): string {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Rasio kontras terhadap putih. */
function contrastWithWhite(rgb: [number, number, number]): number {
  return 1.05 / (relativeLuminance(rgb) + 0.05);
}

/**
 * Gelapkan warna sampai teks putih di atasnya memenuhi kontras minimal. Warna
 * yang sudah cukup gelap (mis. hijau `#00875A`) dibiarkan apa adanya, jadi
 * palet range tetap terbaca sebagai warna yang sama — hanya yang terlalu terang
 * yang dikoreksi. Dibuat generik, bukan hardcode per warna, supaya tetap benar
 * kalau range di Setting Heatmap Condition diubah.
 */
export function pillFillColor(hex: string): string {
  let rgb = parseHex(hex);
  for (let i = 0; i < 24 && contrastWithWhite(rgb) < MIN_CONTRAST; i++) {
    rgb = [rgb[0] * 0.92, rgb[1] * 0.92, rgb[2] * 0.92] as [number, number, number];
  }
  return toHex(rgb);
}

interface ReadinessPillProps {
  /** null / undefined → tampil "-" (posisi kosong atau data kesiapan belum ada). */
  percentage?: number | null;
  /** Warna dari range readiness; akan digelapkan bila perlu. */
  color: string;
  /** Ikon roket kecil untuk karyawan yang sedang menjalankan IDP. */
  showIDPIcon?: boolean;
  /** `md` untuk kanvas org chart, `sm` untuk daftar di panel kanan. */
  size?: 'sm' | 'md';
  title?: string;
}

export default function ReadinessPill({ percentage, color, showIDPIcon, size = 'md', title }: ReadinessPillProps) {
  const hasValue = percentage !== null && percentage !== undefined;
  const fill = hasValue ? pillFillColor(color) : '#adb5bd';
  const dims = size === 'md'
    ? { pad: 'px-[10px] py-[3px]', text: 'text-[14px]', icon: 'w-[13px] h-[13px]' }
    : { pad: 'px-[8px] py-[2px]', text: 'text-[11px]', icon: 'w-[11px] h-[11px]' };

  return (
    <div
      className={`inline-flex items-center gap-[4px] rounded-full shadow-sm ${dims.pad}`}
      style={{ backgroundColor: fill, color: '#ffffff' }}
      title={title}
      data-name="Readiness Pill"
    >
      {showIDPIcon && hasValue && <TrendingUp className={dims.icon} strokeWidth={2.5} />}
      <span className={`font-['Open_Sans',_sans-serif] font-bold leading-none ${dims.text}`}>
        {hasValue ? `${percentage}%` : '-'}
      </span>
    </div>
  );
}
