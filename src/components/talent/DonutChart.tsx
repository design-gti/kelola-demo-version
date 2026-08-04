"use client";
import React from "react";
import { resolveColor } from "@/data/talentMappingShared";

const FONT = "'Open Sans', sans-serif";

export interface DonutSegment { name: string; value: number; color: string }

// Simple SVG donut with a center label; mirrors kelola-app ChartDonut look.
export default function DonutChart({ data, centerLabel, size = 220, thickness = 26 }: {
  data: DonutSegment[];
  centerLabel: string;
  size?: number;
  thickness?: number;
}) {
  const r = (size - thickness) / 2;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.value, 0);

  let offset = 0;
  const segs = total > 0
    ? data.filter(d => d.value > 0).map(d => {
        const len = (d.value / total) * circ;
        const seg = { color: resolveColor(d.color), dash: len, gap: circ - len, off: offset };
        offset -= len;
        return seg;
      })
    : [];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="#f1f3f5" strokeWidth={thickness} />
      {segs.map((s, i) => (
        <circle key={i} cx={c} cy={c} r={r} fill="none" stroke={s.color} strokeWidth={thickness}
          strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={s.off}
          transform={`rotate(-90 ${c} ${c})`} />
      ))}
      <text x={c} y={c} textAnchor="middle" dominantBaseline="central" fontFamily={FONT} fontWeight={700} fontSize={size * 0.11} fill="#343a40">{centerLabel}</text>
    </svg>
  );
}
