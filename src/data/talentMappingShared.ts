// Client-safe half of the old talentMappingData.ts: box/axis/layout config and
// pure display-mapping logic (including the band placement engine below), none
// of which touches the candidates fixture. Safe to import directly from
// "use client" components. Per-employee plot points (which do read candidates)
// live in src/lib/data/talentMapping.ts (server-only).
import { mantineColor } from "@/components/team/mantineColor";

// Resolve a Mantine color token ("error.3") to hex, using the ported palette.
export function resolveColor(token: string): string {
  const [name, shade] = token.split(".");
  return mantineColor[name]?.[Number(shade)] ?? token;
}

/**
 * Shade DEFAULT (5) dari keluarga sebuah token warna.
 *
 * Dipakai penanda sumbu Z — cincin di 9-box maupun kotak warna di halaman
 * setting. Keduanya harus menunjuk warna yang sama, jadi aturannya tinggal di
 * satu tempat: kalau dihitung sendiri-sendiri, salah satu bisa bergeser tanpa
 * ada yang menyadari. Shade 3 (yang dipakai garis sumbu) terlalu pucat begitu
 * dibuat tembus.
 */
export function defaultShade(token: string): string {
  return resolveColor(`${token.split(".")[0]}.5`);
}

export interface BoxDef {
  order: number;
  label: string;
  color: string;      // mantine token
  tag: "talent" | null;
  // TR (Talent Readiness): the readiness bucket this box maps to
  // ("Ready Now" / "Ready under 1 year" / ...). Unused (undefined) for TI.
  readiness?: string | null;
}

// A criteria band on an axis. min is derived (prev band max + 0.01); max is editable.
export interface AxisBand { label: string; min: number; max: number; color: string }
// Back-compat alias — TMTRBox only reads {label,color}.
export type AxisRange = AxisBand;

// Which candidate metric feeds an axis.
export type MetricKey = "performance_score" | "leadership_score" | "technical_score" | "behavioral_score";
export const METRICS: { key: MetricKey; label: string }[] = [
  { key: "performance_score", label: "Performance" },
  { key: "leadership_score", label: "Potency" },
  { key: "technical_score", label: "Competency" },
  { key: "behavioral_score", label: "Behavioral" },
];
export const metricLabel = (k: MetricKey) => METRICS.find(m => m.key === k)?.label ?? k;

/** Persen dijaga di 0..100 dengan dua angka desimal. */
const clampPct = (v: number) => Math.min(100, Math.max(0, Math.round(v * 100) / 100));

export const READINESS_BUCKETS: string[] = [
  "Ready more than 2 year",
  "Ready between 1 and 2 year",
  "Ready under 1 year",
  "Ready Now",
];

/** Tag yang menandai sebuah box berisi talent — dibandingkan tanpa peduli huruf. */
export const TALENT_TAG = "Talent";
export const isTalentTag = (t?: string | null) => (t ?? "").trim().toLowerCase() === TALENT_TAG.toLowerCase();

/**
 * Daftar tag siap pakai untuk box, bisa disunting user di halaman setting.
 *
 * Satu kolam untuk kedua mode: "Talent" menandai box talent di Talent
 * Identification, sisanya menyatakan kesiapan di Talent Readiness. Menyatukan
 * keduanya membuat user bisa menambah tag sendiri tanpa perlu tahu mode mana
 * yang sedang dibuka.
 */
export const DEFAULT_TAG_OPTIONS: string[] = [TALENT_TAG, ...[...READINESS_BUCKETS].reverse()];

export interface TMConfig {
  /** "TI" / "TR" untuk dua tab bawaan; tab buatan user memakai id sendiri. */
  id: string;
  name: string;
  tabLabel: string;
  unit: string;
  layout: string;            // layout id (9box, 12box-3x4, ...)
  sumbuX: string;            // display label
  sumbuY: string;
  sumbuXKey: MetricKey;
  sumbuYKey: MetricKey;
  boxes: BoxDef[];
  ordering: number[][];      // rows top→bottom of box orders
  rangesX: AxisBand[];       // left→right (bands, ascending)
  rangesY: AxisBand[];       // bottom→top
  /** Tag siap pakai untuk box; bisa ditambah/disunting user. */
  tagOptions?: string[];
  /** Warna buatan user (hex) yang tersimpan di samping palet design system. */
  colorOptions?: string[];
  /** Sumbu ketiga, digambar sebagai tebal cincin — bukan posisi. Mati secara
   *  bawaan; grafik dua sumbu tetap bacaan yang paling mudah. */
  useZ?: boolean;
  sumbuZ?: string;
  sumbuZKey?: MetricKey;
  rangesZ?: AxisBand[];
}

export interface TMPoint {
  employeeId: string;
  name: string;
  positionTitle: string;
  team: string;
  rawX: number | null;
  rawY: number | null;
  /** Nilai sumbu Z; null kalau sumbu Z mati atau datanya tidak ada. */
  rawZ?: number | null;
  x: number | null;          // 0..100 plot position
  y: number | null;
  order: number | null;      // box order, null = no data
}

/**
 * Metrik mentah per karyawan — cukup untuk menghitung titik sumbu apa pun.
 *
 * Dikirim server sekali; klien memakainya untuk tab buatan user, yang
 * kombinasi sumbunya baru diketahui setelah halaman termuat.
 */
export type EmployeeMetrics = {
  employeeId: string;
  name: string;
  positionTitle: string;
  team: string;
} & Record<MetricKey, number | null>;

// ---------------------------------------------------------------------------
// Layout registry — the 4 matrix templates captured from kelola-app.
// ---------------------------------------------------------------------------
const RED = "error.2", ORG = "secondary.0", BLU = "primary.2", BLU3 = "primary.3";
const bandColor = (i: number, n: number) => (i === 0 ? "error.3" : i === n - 1 ? "success.3" : "secondary.3");

function mkBands(specs: { label: string; max: number }[]): AxisBand[] {
  return specs.map((s, i) => ({
    label: s.label,
    max: s.max,
    min: i === 0 ? 0 : specs[i - 1].max + 0.01,
    color: bandColor(i, specs.length),
  }));
}

const B3 = [{ label: "LOW", max: 70 }, { label: "MID", max: 90 }, { label: "HIGH", max: 100 }];
const B4_UNEVEN = [{ label: "LOW", max: 70 }, { label: "MIDLOW", max: 80 }, { label: "MIDHIGH", max: 90 }, { label: "HIGH", max: 100 }];
const B4_EVEN = [{ label: "LOW", max: 25 }, { label: "MIDLOW", max: 50 }, { label: "MIDHIGH", max: 75 }, { label: "HIGH", max: 100 }];

interface LayoutDef {
  id: string; label: string; recommended?: boolean;
  ordering: number[][];
  x: { label: string; max: number }[];
  y: { label: string; max: number }[];
  boxes: BoxDef[];
}

export const LAYOUTS: LayoutDef[] = [
  {
    id: "9box", label: "9Box(3x3)", recommended: true,
    ordering: [[6, 8, 9], [3, 5, 7], [1, 2, 4]], x: B3, y: B3,
    boxes: [
      { order: 1, label: "Under Performer", color: "error.3", tag: null },
      { order: 2, label: "Questionable Fit", color: "error.2", tag: null },
      { order: 3, label: "Specialist", color: "error.2", tag: null },
      { order: 4, label: "Needs Coaching", color: ORG, tag: null },
      { order: 5, label: "Contributor", color: ORG, tag: null },
      { order: 6, label: "Expert", color: ORG, tag: null },
      { order: 7, label: "Rising Star", color: BLU, tag: "talent" },
      { order: 8, label: "Emerging Star", color: BLU, tag: "talent" },
      { order: 9, label: "Star", color: BLU3, tag: "talent" },
    ],
  },
  {
    id: "12box-3x4", label: "12Box(3x4)",
    ordering: [[9, 11, 12], [6, 8, 10], [3, 5, 7], [1, 2, 4]], x: B3, y: B4_EVEN,
    boxes: box12_3x4(),
  },
  {
    id: "12box-3x4-asim", label: "12Box(3x4) asimetris",
    ordering: [[9, 11, 12], [6, 8, 10], [3, 5, 7], [1, 2, 4]], x: B3, y: B4_UNEVEN,
    boxes: box12_3x4(),
  },
  {
    id: "12box-4x3", label: "12Box(4x3)",
    ordering: [[6, 9, 11, 12], [3, 5, 8, 10], [1, 2, 4, 7]], x: B4_UNEVEN, y: B3,
    boxes: [
      { order: 1, label: "Dead Wood", color: RED, tag: null },
      { order: 2, label: "Minimal Contributor", color: RED, tag: null },
      { order: 3, label: "Unfit Employee", color: RED, tag: null },
      { order: 4, label: "Contributor", color: ORG, tag: null },
      { order: 5, label: "Candidate", color: ORG, tag: null },
      { order: 6, label: "Most UnFit Employee", color: ORG, tag: null },
      { order: 7, label: "Maximal Contributor", color: ORG, tag: null },
      { order: 8, label: "Potential Candidate", color: BLU, tag: "talent" },
      { order: 9, label: "Raw Diamond", color: BLU, tag: "talent" },
      { order: 10, label: "Rising Star", color: BLU, tag: "talent" },
      { order: 11, label: "Future Star", color: BLU, tag: "talent" },
      { order: 12, label: "Star", color: BLU3, tag: "talent" },
    ],
  },
];

function box12_3x4(): BoxDef[] {
  return [
    { order: 1, label: "Under performer", color: RED, tag: null },
    { order: 2, label: "Questionable Fit", color: RED, tag: null },
    { order: 3, label: "Problem Employee", color: RED, tag: null },
    { order: 4, label: "Needs Coaching", color: ORG, tag: null },
    { order: 5, label: "Contributor", color: ORG, tag: null },
    { order: 6, label: "Unfit Employee", color: ORG, tag: null },
    { order: 7, label: "Top Performer", color: ORG, tag: null },
    { order: 8, label: "Candidate", color: ORG, tag: null },
    { order: 9, label: "Most UnFit Employee", color: ORG, tag: null },
    { order: 10, label: "Rising Star", color: BLU, tag: "talent" },
    { order: 11, label: "Emerging Star", color: BLU, tag: "talent" },
    { order: 12, label: "Star", color: BLU3, tag: "talent" },
  ];
}

export const getLayout = (id: string) => LAYOUTS.find(l => l.id === id) ?? LAYOUTS[0];

// Build a TMConfig from a layout id (deep-copied so callers can freely mutate).
/**
 * Tag bawaan untuk box yang tidak bertanda talent, diturunkan dari posisinya.
 *
 * "Kekuatan" sebuah box = seberapa jauh ia ke kanan dan ke atas dalam grid.
 * Dipakai rumus ini, bukan daftar per nomor box, supaya aturannya berlaku untuk
 * layout apa pun — 9-box, 12-box, atau layout yang ditambahkan nanti.
 */
function tierTagFor(order: number, ordering: number[][]): string {
  let rowFromTop = 0;
  let col = 0;
  ordering.forEach((row, r) => {
    const c = row.indexOf(order);
    if (c !== -1) { rowFromTop = r; col = c; }
  });
  const strength = col + (ordering.length - 1 - rowFromTop);
  return READINESS_BUCKETS[Math.min(strength, READINESS_BUCKETS.length - 1)];
}

export function makeConfig(layoutId: string, overrides?: Partial<Pick<TMConfig, "sumbuXKey" | "sumbuYKey">>): TMConfig {
  const L = getLayout(layoutId);
  const xKey = overrides?.sumbuXKey ?? "technical_score";
  const yKey = overrides?.sumbuYKey ?? "performance_score";
  return {
    id: "TI", name: "Talent Identification", tabLabel: "Talent Identification", unit: "Positions",
    layout: L.id,
    sumbuX: metricLabel(xKey), sumbuY: metricLabel(yKey),
    sumbuXKey: xKey, sumbuYKey: yKey,
    ordering: L.ordering.map(r => [...r]),
    rangesX: mkBands(L.x), rangesY: mkBands(L.y),
    // Pita Z memakai skala yang sama dengan sumbu lain supaya angkanya
    // terbaca sama; metriknya baru dipilih user saat sumbu Z dinyalakan.
    useZ: false, sumbuZKey: undefined, sumbuZ: undefined, rangesZ: mkBands(B3),
    tagOptions: [...DEFAULT_TAG_OPTIONS],
    colorOptions: [],
    // readiness dipakai sebagai tag yang terlihat user di KEDUA mode.
    //
    // SETIAP box diberi tag bawaan, bukan hanya yang bertanda talent: bar
    // ringkasan di halaman Talent Mapping dihitung per tag, jadi box tanpa tag
    // membuat orang di dalamnya jatuh ke keranjang "Tanpa Tag" alih-alih
    // terbaca sebagai kategori yang berarti. Box bertanda talent tetap memakai
    // tag Talent supaya kolom HAV status dan hitungan talent tidak bergeser.
    boxes: L.boxes.map(b => ({
      ...b,
      readiness: b.readiness ?? (b.tag === "talent" ? TALENT_TAG : tierTagFor(b.order, L.ordering)),
    })),
  };
}

export function boxByOrder(cfg: TMConfig, order: number | null): BoxDef | null {
  return order == null ? null : cfg.boxes.find(b => b.order === order) ?? null;
}

// ---------------------------------------------------------------------------
// Placement engine — RAW value → band index → box order, using configured
// bands. Pure functions (numbers in, numbers out) — safe here since they
// never touch the candidates fixture. Exported for src/lib/data/talentMapping.ts
// (server-only), which supplies the actual per-employee raw values.
// ---------------------------------------------------------------------------
export function bandIndex(v: number, bands: AxisBand[]): number {
  for (let i = 0; i < bands.length; i++) if (v <= bands[i].max) return i;
  return bands.length - 1;
}
// plot position 0..100 within the (equal-width) cell for this band
export function plotPos(v: number, bands: AxisBand[]): number {
  const i = bandIndex(v, bands);
  const span = bands[i].max - bands[i].min;
  const frac = span > 0 ? Math.min(1, Math.max(0, (v - bands[i].min) / span)) : 0.5;
  return ((i + frac) / bands.length) * 100;
}

export function orderFor(cfg: TMConfig, rawX: number, rawY: number): number {
  const xi = bandIndex(rawX, cfg.rangesX);
  const yi = bandIndex(rawY, cfg.rangesY);
  const rowFromTop = cfg.rangesY.length - 1 - yi;   // ordering rows are top→bottom (highest Y first)
  return cfg.ordering[rowFromTop][xi];
}

/**
 * Titik 9-box untuk sebuah konfigurasi, dihitung dari tabel metrik.
 *
 * Kembaran klien dari getTalentIdentificationPoints di lib/data/talentMapping.ts.
 * Ada dua karena sumbernya berbeda — yang di server membaca fixture candidates,
 * yang ini membaca tabel metrik yang sudah dikirim — sedangkan rumus
 * penempatannya sama dan tinggal di berkas ini.
 */
/** Metrik yang dibaca relatif terhadap jabatan target, bukan apa adanya. */
export const COMPETENCY_KEY: MetricKey = "technical_score";

/**
 * Apakah salah satu sumbu box mapping ini memakai data Competency.
 *
 * Menentukan muncul-tidaknya pemilih jabatan target: angka Competency hanya
 * punya arti relatif — "cukup" atau "kurang" itu selalu terhadap tuntutan
 * sebuah jabatan. Sumbu lain (Performance, Potency, Behavioral) berdiri sendiri,
 * jadi tab yang tidak memakai Competency tidak perlu target sama sekali.
 */
export const usesCompetency = (cfg: TMConfig): boolean =>
  cfg.sumbuXKey === COMPETENCY_KEY ||
  cfg.sumbuYKey === COMPETENCY_KEY ||
  (!!cfg.useZ && cfg.sumbuZKey === COMPETENCY_KEY);

/**
 * Titik untuk sebuah konfigurasi.
 *
 * targetId mengubah pembacaan sumbu Competency — DI SUMBU MANA PUN ia
 * dipasang — dari skor mentah menjadi persen kecocokan terhadap syarat jabatan
 * itu. Dulu perubahan ini terkurung di jalur Talent Readiness dan hanya berlaku
 * untuk sumbu X, jadi tab lain yang memakai Competency tidak bisa dibandingkan
 * terhadap jabatan apa pun.
 *
 * Tanpa target, nilainya dipakai apa adanya — itulah kelakuan Talent
 * Identification selama ini, dan ia tetap berarti tanpa memilih jabatan.
 */
export function pointsFrom(cfg: TMConfig, rows: EmployeeMetrics[], targetId?: string | null): TMPoint[] {
  const req = targetId ? targetRequirement(targetId) : null;
  const read = (r: EmployeeMetrics, key: MetricKey): number | null => {
    const v = r[key];
    if (v == null) return null;
    return req != null && key === COMPETENCY_KEY ? clampPct((v / req) * 100) : v;
  };
  return rows.map(r => {
    const rawX = read(r, cfg.sumbuXKey);
    const rawY = read(r, cfg.sumbuYKey);
    const has = rawX != null && rawY != null;
    return {
      employeeId: r.employeeId,
      name: r.name,
      positionTitle: r.positionTitle,
      team: r.team,
      rawX, rawY,
      rawZ: cfg.useZ && cfg.sumbuZKey ? read(r, cfg.sumbuZKey) : null,
      x: has ? plotPos(rawX, cfg.rangesX) : null,
      y: has ? plotPos(rawY, cfg.rangesY) : null,
      order: has ? orderFor(cfg, rawX, rawY) : null,
    };
  });
}

// Default 9box config (client-safe — no per-employee data). Actual plot
// points for a config are computed server-side; see
// src/lib/data/talentMapping.ts's getTalentIdentificationPoints().
export const TI_CONFIG: TMConfig = makeConfigById("TI");

// TR (Talent Readiness): Competency × Potency, empty until a Job Target is picked.
// A box's label, color, and readiness bucket are all determined by its GRID POSITION
// — whether Competency (X) and/or Potency (Y) is in the TOP tier. Deriving them
// (rather than hardcoding the 9-box) makes TR work identically for ANY layout
// (9-box, 12-box, …), mirroring kelola-app's per-template readiness seeding.
export const TR_TIERS = [
  { readiness: "Ready more than 2 year", label: "Need Development", color: "error.2" },
  { readiness: "Ready between 1 and 2 year", label: "Solid Performer", color: ORG },
  { readiness: "Ready under 1 year", label: "Development Priority", color: BLU },
  { readiness: "Ready Now", label: "Ready for bigger role", color: BLU3 },
] as const;

function trTierFor(compTop: boolean, potTop: boolean) {
  const readiness = compTop && potTop ? "Ready Now"
    : potTop ? "Ready under 1 year"
      : compTop ? "Ready between 1 and 2 year"
        : "Ready more than 2 year";
  return TR_TIERS.find(t => t.readiness === readiness)!;
}

/** TR boxes for a layout ordering: label/color/readiness by grid tier
 *  (top competency column and/or top potency row ⇒ readier). */
export function trBoxesFor(ordering: number[][]): BoxDef[] {
  const boxes: BoxDef[] = [];
  ordering.forEach((row, rowFromTop) => {
    row.forEach((order, col) => {
      const tier = trTierFor(col === row.length - 1, rowFromTop === 0);
      boxes.push({ order, label: tier.label, color: tier.color, tag: null, readiness: tier.readiness });
    });
  });
  return boxes.sort((a, b) => a.order - b.order);
}

// Readiness buckets in display order (worst→best). Donut colors are NOT fixed
// here — donutTags() pulls each bucket's color from its box, so it always tracks
// the diagram (and any color edits made in Settings).

export const TR_CONFIG: TMConfig = makeConfigById("TR");

/** Base config for a box-mapping id: TI = plain layout; TR = same grid but with
 *  tier-derived readiness labels/colors/buckets (works for every layout). */
export function makeConfigById(
  id: string,
  layout = "9box",
  overrides?: Partial<Pick<TMConfig, "sumbuXKey" | "sumbuYKey">>,
): TMConfig {
  // Talent Identification bawaan memakai TIGA sumbu: Competency (X) lawan
  // Performance (Y), dengan Potency sebagai sumbu Z. Sumbu Z hanya dinyalakan
  // di sini, bukan di makeConfig, supaya tab buatan user tetap mulai dari dua
  // sumbu dan menyalakan Z hanya kalau pembuatnya memang memilih sumbu ketiga.
  if (id === "TI") {
    const zKey: MetricKey = "leadership_score";
    return { ...makeConfig(layout, overrides), id: "TI", useZ: true, sumbuZKey: zKey, sumbuZ: metricLabel(zKey) };
  }
  // Tab buatan user bertingkah seperti TI — dua metrik lawan dua metrik. Yang
  // membedakannya hanya id, nama, dan pilihan sumbunya; sisanya bawaan 9-box.
  if (id !== "TR") return { ...makeConfig(layout, overrides), id };
  const base = makeConfig(layout, {
    sumbuXKey: overrides?.sumbuXKey ?? "technical_score",
    sumbuYKey: overrides?.sumbuYKey ?? "leadership_score",
  });
  return {
    ...base,
    id: "TR", name: "Talent Readiness", tabLabel: "Talent Readiness", unit: "Employees",
    boxes: trBoxesFor(base.ordering),
  };
}

/**
 * Ringkasan sebaran per TAG — satu tag yang terpakai, satu batang.
 *
 * Dulu mode TI dipaku ke tiga kategori (Talent / Non Talent / No Data) dan hanya
 * TR yang menghitung per tag. Akibatnya tag yang disetel user di halaman Setting
 * tidak terlihat pengaruhnya di TI: memberi tag baru pada sebuah box tidak
 * mengubah apa pun di ringkasannya. Sekarang kedua mode memakai jalur yang sama,
 * jadi jumlah batang selalu sebanyak tag yang benar-benar dipakai box.
 *
 * Warna diambil dari box pemilik tag itu (token utuh, tanpa imbuhan ".5") supaya
 * warna batang, warna kotak di grid, dan warna di tabel selalu satu cerita.
 */
export function donutTags(cfg: TMConfig, points: TMPoint[]) {
  const tagOf = (p: TMPoint) => boxByOrder(cfg, p.order)?.readiness || null;
  const colorFor = (tag: string) => cfg.boxes.find(b => b.readiness === tag)?.color ?? "neutral.5";

  // Urutannya mengikuti daftar tag di halaman Setting, bukan urutan kemunculan
  // di grid: itu daftar yang sama yang dilihat user saat memilih tag, jadi
  // urutan batang di sini tidak mengejutkan. Tag buatan sendiri yang tidak ada
  // di daftar menyusul di belakang.
  const options = cfg.tagOptions ?? DEFAULT_TAG_OPTIONS;
  const used = cfg.boxes.map(b => b.readiness).filter((t): t is string => !!t);
  const ordered = [...options.filter(t => used.includes(t)), ...used.filter(t => !options.includes(t))]
    .filter((t, i, arr) => arr.indexOf(t) === i);

  const bars = ordered.map(tag => ({
    name: tag,
    value: points.filter(p => tagOf(p) === tag).length,
    color: colorFor(tag),
  }));

  // Dua keranjang terakhir hanya muncul kalau memang ada isinya. Satu tag satu
  // batang adalah aturan yang dibaca user; menambah batang yang bukan tag saat
  // isinya nol hanya mengaburkan hitungan itu — tapi menyembunyikannya saat
  // BERISI orang akan menghilangkan orang dari ringkasan.
  const untagged = points.filter(p => p.order != null && !tagOf(p)).length;
  const outside = points.filter(p => p.order == null).length;
  if (untagged > 0) bars.push({ name: "Tanpa Tag", value: untagged, color: "neutral.3" });
  if (outside > 0) bars.push({ name: "No Data", value: outside, color: "neutral.5" });
  return bars;
}

/**
 * Warna tulisan yang terbaca di atas `bg`.
 *
 * Warna box kini bisa ditentukan user lewat color picker, jadi tidak lagi
 * dijamin pucat seperti palet bawaan — teks gelap yang dulu dipaku jadi tak
 * terbaca begitu user memilih warna tua.
 */
export function textOn(bg: string): string {
  const hex = bg.replace("#", "");
  if (hex.length !== 6) return "#fff";
  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
  // Luminansi perseptual (Rec. 601) — cukup untuk memilih dua warna teks.
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#495057" : "#fff";
}

// ─── Talent Readiness di klien ───────────────────────────────────────────────
// Dulu hanya ada di src/lib/data/talentMapping.ts (server) karena titiknya
// dihitung dari fixture candidates. Sejak tabel `EmployeeMetrics` dikirim ke
// klien, klien punya semua angka yang dibutuhkan — dan konfigurasi Talent
// Mapping kini hidup di memori klien, jadi titiknya harus bisa dihitung ulang
// di sana setiap konfigurasi berubah.

/** Syarat kompetensi sebuah target jabatan, dari kata kunci senioritasnya. */
export function targetRequirement(title: string): number {
  const t = title.toLowerCase();
  if (/(chief|officer|\bceo\b|\bcxo\b)/.test(t)) return 95;
  if (/\bvp\b|vice president/.test(t)) return 92;
  if (/head|director/.test(t)) return 90;
  if (/lead|principal/.test(t)) return 87;
  if (/manager/.test(t)) return 84;
  if (/senior/.test(t)) return 81;
  return 78;
}

// Talent Readiness dulu punya fungsi titiknya sendiri di sini. Sekarang ia cuma
// pointsFrom() dengan target terpilih — perbedaannya hanya bahwa di TR target
// itu WAJIB, sementara di tab lain ia pilihan.
