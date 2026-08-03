"use client";
import { managerTeam } from "@/data/managerTeamData";

type SupportCategory = "skill-gap" | "workload" | "career";

interface SupportEntry {
  name: string;
  role: string;
  category: SupportCategory;
  signal: string;
}

// name/role from canonical team; category/signal are demo.
const SUPPORT: SupportEntry[] = [
  {
    name: managerTeam[2].name,
    role: managerTeam[2].position,
    category: "workload",
    signal: "Pola kerja menunjukkan deviasi beban tinggi selama 3 minggu berturut-turut",
  },
  {
    name: managerTeam[3].name,
    role: managerTeam[3].position,
    category: "career",
    signal: "Momentum performa menurun dan skor mood turun — mungkin perlu diskusi arah karier",
  },
];

const CAT_CONFIG: Record<SupportCategory, { label: string; desc: string; color: string; bg: string }> = {
  "skill-gap": {
    label: "Skill Gap",
    desc: "Perlu training atau mentoring",
    color: "#016699",
    bg: "#e8f4fb",
  },
  "workload": {
    label: "Beban / Personal",
    desc: "Perlu keringanan tugas",
    color: "#fd9f28",
    bg: "#fff8e6",
  },
  "career": {
    label: "Career Stuck",
    desc: "Perlu diskusi pengembangan karier",
    color: "#6f42c1",
    bg: "#f3eeff",
  },
};

export default function SupportNeedsCard() {
  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057" }}>
          Kebutuhan Support
        </span>
        <span style={{ fontSize: 12, fontFamily: "Open Sans, sans-serif", color: "#adb5bd" }}>
          {SUPPORT.length} anggota
        </span>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 12, fontFamily: "Open Sans, sans-serif", color: "#adb5bd", lineHeight: 1.5 }}>
        Sinyal awal — konfirmasi melalui percakapan langsung
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SUPPORT.map(e => {
          const cfg = CAT_CONFIG[e.category];
          return (
            <div key={e.name} style={{
              border: `1px solid ${cfg.color}30`,
              borderRadius: 10,
              overflow: "hidden",
            }}>
              <div style={{
                background: cfg.bg,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: cfg.color + "25", color: cfg.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12,
                }}>
                  {e.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#495057" }}>
                    {e.name}
                  </div>
                  <div style={{ fontSize: 9, color: "#adb5bd", fontFamily: "Open Sans, sans-serif" }}>{e.role}</div>
                </div>
                <span style={{
                  fontSize: 9, padding: "2px 8px", borderRadius: 9999,
                  background: cfg.color + "20", color: cfg.color,
                  fontFamily: "Open Sans, sans-serif", fontWeight: 600, whiteSpace: "nowrap",
                }}>
                  {cfg.label}
                </span>
              </div>
              <div style={{ padding: "8px 12px", background: "#fff" }}>
                <div style={{ fontSize: 9, color: "#6c757d", fontFamily: "Open Sans, sans-serif", lineHeight: 1.5 }}>
                  {e.signal}
                </div>
                <div style={{ fontSize: 9, color: cfg.color, fontFamily: "Open Sans, sans-serif", marginTop: 4, fontWeight: 600 }}>
                  → {cfg.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
