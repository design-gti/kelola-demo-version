// Client-safe half of the old talentMappingData.ts: box/axis config and pure
// display-mapping logic, none of which touches the candidates fixture. Safe
// to import directly from "use client" components. Per-employee plot points
// live in src/lib/data/talentMapping.ts (server-only).
import { mantineColor } from "@/components/team/mantineColor";

// Resolve a Mantine color token ("error.3") to hex, using the ported palette.
export function resolveColor(token: string): string {
  const [name, shade] = token.split(".");
  return mantineColor[name]?.[Number(shade)] ?? token;
}

export interface BoxDef {
  order: number;      // 1..9
  label: string;
  color: string;      // mantine token
  tag: "talent" | null;
}

export interface AxisRange { label: string; color: string } // LOW / MID / HIGH

export interface TMConfig {
  id: "TI" | "TR";
  name: string;         // tab name (donut uses "Distribusi {name}")
  tabLabel: string;     // shown in tab bar
  sumbuX: string;       // x axis label
  sumbuY: string;       // y axis label
  boxes: BoxDef[];      // order 1..9
  ordering: number[][]; // rows top→bottom of box orders
  rangesX: AxisRange[]; // left→right
  rangesY: AxisRange[]; // bottom→top
  unit: string;         // "Positions" | "Employees"
}

export interface TMPoint {
  employeeId: string;
  name: string;
  positionTitle: string;
  rawX: number | null;   // shown in table
  rawY: number | null;
  x: number | null;      // 0..100 plot position
  y: number | null;
  order: number | null;  // box order, null = no data
}

const RANGES: AxisRange[] = [
  { label: "LOW", color: "error.3" },
  { label: "MID", color: "secondary.3" },
  { label: "HIGH", color: "success.3" },
];

export const TI_CONFIG: TMConfig = {
  id: "TI",
  name: "Talent Identification",
  tabLabel: "Human Asset Value",
  sumbuX: "Performance",
  sumbuY: "Potency",
  unit: "Positions",
  ordering: [[6, 8, 9], [3, 5, 7], [1, 2, 4]],
  rangesX: RANGES,
  rangesY: RANGES,
  boxes: [
    { order: 1, label: "Under Performer", color: "error.3", tag: null },
    { order: 2, label: "Questionable Fit", color: "error.2", tag: null },
    { order: 3, label: "Specialist", color: "error.2", tag: null },
    { order: 4, label: "Needs Coaching", color: "secondary.0", tag: null },
    { order: 5, label: "Contributor", color: "secondary.0", tag: null },
    { order: 6, label: "Expert", color: "secondary.0", tag: null },
    { order: 7, label: "Rising Star", color: "primary.2", tag: "talent" },
    { order: 8, label: "Emerging Star", color: "primary.2", tag: "talent" },
    { order: 9, label: "Star", color: "primary.3", tag: "talent" },
  ],
};

export const TR_CONFIG: TMConfig = {
  id: "TR",
  name: "Talent Readiness",
  tabLabel: "Talent Readiness",
  sumbuX: "Competency",
  sumbuY: "Potency",
  unit: "Employees",
  ordering: [[6, 8, 9], [3, 5, 7], [1, 2, 4]],
  rangesX: RANGES,
  rangesY: RANGES,
  boxes: [
    { order: 1, label: "Need Development", color: "error.2", tag: null },
    { order: 2, label: "Need Development", color: "error.2", tag: null },
    { order: 3, label: "Need Development", color: "error.2", tag: null },
    { order: 4, label: "Solid Performer", color: "secondary.0", tag: null },
    { order: 5, label: "Need Development", color: "error.2", tag: null },
    { order: 6, label: "Development Priority", color: "primary.2", tag: null },
    { order: 7, label: "Solid Performer", color: "secondary.0", tag: null },
    { order: 8, label: "Development Priority", color: "primary.2", tag: null },
    { order: 9, label: "Ready for bigger role", color: "primary.3", tag: null },
  ],
};

export function boxByOrder(cfg: TMConfig, order: number | null): BoxDef | null {
  return order == null ? null : cfg.boxes.find(b => b.order === order) ?? null;
}

// Donut tags (kelola-app quirk: TI reuses tenure labels for talent/non/no-data counts).
export function donutTags(cfg: TMConfig, points: TMPoint[]) {
  const isTalent = (p: TMPoint) => {
    const b = boxByOrder(cfg, p.order);
    return b?.tag === "talent";
  };
  if (cfg.id === "TI") {
    return [
      { name: "<2 Years", value: points.filter(isTalent).length, color: "primary" },
      { name: "2 - 5 Years", value: points.filter(p => p.order != null && !isTalent(p)).length, color: "secondary" },
      { name: ">5 Years", value: points.filter(p => p.order == null).length, color: "neutral" },
    ];
  }
  return [
    { name: "Ready more than 2 year", value: 0, color: "error" },
    { name: "Ready between 1 and 2 year", value: 0, color: "secondary" },
    { name: "Ready under 1 year", value: 0, color: "primary" },
    { name: "Ready Now", value: 0, color: "success" },
    { name: "No Data", value: points.length, color: "neutral" },
  ];
}
