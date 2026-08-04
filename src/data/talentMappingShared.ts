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

export interface TMConfig {
  id: "TI" | "TR";
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
}

export interface TMPoint {
  employeeId: string;
  name: string;
  positionTitle: string;
  team: string;
  rawX: number | null;
  rawY: number | null;
  x: number | null;          // 0..100 plot position
  y: number | null;
  order: number | null;      // box order, null = no data
}

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
export function makeConfig(layoutId: string, overrides?: Partial<Pick<TMConfig, "sumbuXKey" | "sumbuYKey">>): TMConfig {
  const L = getLayout(layoutId);
  const xKey = overrides?.sumbuXKey ?? "performance_score";
  const yKey = overrides?.sumbuYKey ?? "leadership_score";
  return {
    id: "TI", name: "Talent Identification", tabLabel: "Human Asset Value", unit: "Positions",
    layout: L.id,
    sumbuX: metricLabel(xKey), sumbuY: metricLabel(yKey),
    sumbuXKey: xKey, sumbuYKey: yKey,
    ordering: L.ordering.map(r => [...r]),
    rangesX: mkBands(L.x), rangesY: mkBands(L.y),
    boxes: L.boxes.map(b => ({ ...b })),
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

// Default 9box config (client-safe — no per-employee data). Actual plot
// points for a config are computed server-side; see
// src/lib/data/talentMapping.ts's getTalentIdentificationPoints().
export const TI_CONFIG: TMConfig = makeConfig("9box");

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
export const READINESS_BUCKETS: string[] = [
  "Ready more than 2 year",
  "Ready between 1 and 2 year",
  "Ready under 1 year",
  "Ready Now",
];

export const TR_CONFIG: TMConfig = makeConfigById("TR");

/** Base config for a box-mapping id: TI = plain layout; TR = same grid but with
 *  tier-derived readiness labels/colors/buckets (works for every layout). */
export function makeConfigById(
  id: "TI" | "TR",
  layout = "9box",
  overrides?: Partial<Pick<TMConfig, "sumbuXKey" | "sumbuYKey">>,
): TMConfig {
  if (id !== "TR") return makeConfig(layout, overrides);
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

// Donut tags. Colors are FULL tokens (no ".5" suffix appended downstream) so the
// TR legend mirrors the diagram box colors exactly — "Ready Now" is box 9's blue,
// never green — keeping donut ↔ 9-box ↔ table visually consistent. (TI keeps its
// tenure labels for talent/non/no-data counts.)
export function donutTags(cfg: TMConfig, points: TMPoint[]) {
  const isTalent = (p: TMPoint) => boxByOrder(cfg, p.order)?.tag === "talent";
  if (cfg.id === "TI") {
    return [
      { name: "<2 Years", value: points.filter(isTalent).length, color: "primary.5" },
      { name: "2 - 5 Years", value: points.filter(p => p.order != null && !isTalent(p)).length, color: "secondary.5" },
      { name: ">5 Years", value: points.filter(p => p.order == null).length, color: "neutral.5" },
    ];
  }
  // TR: one slice per readiness bucket present in this config's boxes, colored by
  // that box's own color (so the legend dot matches the cell), + a grey No Data slice.
  const readinessOf = (p: TMPoint) => boxByOrder(cfg, p.order)?.readiness || null;
  const boxColorFor = (name: string) => cfg.boxes.find(x => x.readiness === name)?.color ?? "neutral.5";
  const buckets = READINESS_BUCKETS.filter(name => cfg.boxes.some(x => x.readiness === name));
  return [
    ...buckets.map(name => ({ name, value: points.filter(p => readinessOf(p) === name).length, color: boxColorFor(name) })),
    { name: "No Data", value: points.filter(p => p.order == null).length, color: "neutral.5" },
  ];
}
