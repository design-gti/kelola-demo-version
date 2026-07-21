"use client";
import React from "react";
import { candidates } from "@/data/dummyData";

type PerfLevel = "low" | "med" | "high";
type PotLevel = "low" | "medium" | "high";

function getPerfLevel(score: number | null): PerfLevel {
  if (score === null || score < 40) return "low";
  if (score <= 70) return "med";
  return "high";
}

const CELL_COLORS: Record<string, string> = {
  "high-high": "#016699",
  "med-high": "#0288b0",
  "low-high": "#4da6c8",
  "high-med": "#2e7d32",
  "med-med": "#66bb6a",
  "low-med": "#a5d6a7",
  "high-low": "#e65100",
  "med-low": "#fb8c00",
  "low-low": "#ffcc80",
};

const CELL_LABELS: Record<string, string> = {
  "high-high": "Star",
  "med-high": "High Pot",
  "low-high": "Enigma",
  "high-med": "High Perf",
  "med-med": "Core",
  "low-med": "Developing",
  "high-low": "Solid Cont.",
  "med-low": "Low",
  "low-low": "Risk",
};

export default function TalentPoolSummaryCard() {
  const pool = candidates.filter(c => c.isTalentPool);

  const counts: Record<string, number> = {};
  pool.forEach(c => {
    const pk = `${getPerfLevel(c.performance_score)}-${c.potential}`;
    counts[pk] = (counts[pk] || 0) + 1;
  });

  const perfLevels: PerfLevel[] = ["high", "med", "low"];
  const potLevels: PotLevel[] = ["high", "medium", "low"];

  const summary = {
    Star: counts["high-high"] || 0,
    "High Potential": (counts["med-high"] || 0) + (counts["low-high"] || 0),
    "High Performer": (counts["high-med"] || 0) + (counts["high-low"] || 0),
    Core: counts["med-med"] || 0,
    Risk: counts["low-low"] || 0,
  };

  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057", marginBottom: 12 }}>
        Talent Pool Summary
      </div>
      <div style={{ fontSize: 10, color: "#adb5bd", fontFamily: "Open Sans, sans-serif", textAlign: "center", marginBottom: 4 }}>
        Potensi →
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 2, marginBottom: 12 }}>
        <div />
        {["Tinggi", "Sedang", "Rendah"].map(l => (
          <div key={l} style={{ fontSize: 9, color: "#adb5bd", textAlign: "center", fontFamily: "Open Sans, sans-serif" }}>{l}</div>
        ))}
        {perfLevels.map((perf) => (
          <React.Fragment key={perf}>
            <div style={{ fontSize: 9, color: "#adb5bd", display: "flex", alignItems: "center", fontFamily: "Open Sans, sans-serif", writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)", justifyContent: "center" }}>
              {perf === "high" ? "Tinggi" : perf === "med" ? "Sedang" : "Rendah"}
            </div>
            {potLevels.map(pot => {
              const ck = `${perf}-${pot}`;
              const cnt = counts[ck] || 0;
              const bg = CELL_COLORS[ck] || "#e0e0e0";
              return (
                <div key={ck} style={{ background: bg, borderRadius: 4, padding: "8px 4px", textAlign: "center", minHeight: 48, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: "'Open Sans', sans-serif" }}>{cnt}</div>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,0.8)", fontFamily: "Open Sans, sans-serif" }}>{CELL_LABELS[ck]}</div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {Object.entries(summary).map(([label, count]) => (
          <div key={label} style={{ background: "#f8f9fa", borderRadius: 6, padding: "4px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#016699", fontFamily: "'Open Sans', sans-serif" }}>{count}</div>
            <div style={{ fontSize: 9, color: "#adb5bd", fontFamily: "Open Sans, sans-serif" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
