// V3 mengganti model "3 tab view" milik V1 (Default / Succession Risk / Need
// Develop) dengan overlay yang bisa dinyalakan bebas dan bersamaan di atas SATU
// struktur organisasi. Tiap overlay menempel pada elemen yang berbeda, sehingga
// beberapa indikator bisa dibaca sekaligus tanpa berpindah tab.
//
// Lihat docs/vismap-v3.md §8 untuk PRD-nya.

export type OverlayId =
  | 'succession-risk'
  | 'need-development'
  | 'critical-position'
  | 'talent'
  | 'ready-to-promote';

/** Elemen yang disentuh sebuah overlay — dipakai untuk label bantuan di UI. */
export type OverlayTarget = 'position-card' | 'employee-card' | 'connector';

export interface OverlayMeta {
  id: OverlayId;
  label: string;
  target: OverlayTarget;
  /** Penjelasan singkat untuk tooltip toggle. */
  hint: string;
}

export const OVERLAYS: OverlayMeta[] = [
  {
    id: 'succession-risk',
    label: 'Succession Risk',
    target: 'position-card',
    hint: 'Heatmap pada card job position, berdasarkan kesiapan para calon suksesor posisi tersebut.',
  },
  {
    id: 'need-development',
    label: 'Need Development',
    target: 'employee-card',
    hint: 'Heatmap pada card employee, berdasarkan competency score karyawan yang mengisi posisi.',
  },
  {
    id: 'critical-position',
    label: 'Critical Position',
    target: 'position-card',
    hint: 'Ikon peringatan di samping card job position yang berstatus critical.',
  },
  {
    id: 'talent',
    label: 'Talent',
    target: 'employee-card',
    hint: 'Ikon bintang pada card employee yang masuk kuadran Star (9-box Talent Mapping).',
  },
  {
    id: 'ready-to-promote',
    label: '%Ready to Promote',
    target: 'connector',
    hint: 'Persentase kesiapan promosi pada garis struktur di atas card position.',
  },
];

export function toggleOverlay(current: Set<OverlayId>, id: OverlayId): Set<OverlayId> {
  const next = new Set(current);
  if (next.has(id)) next.delete(id); else next.add(id);
  return next;
}
