"use client";
import { managerTeam } from "@/data/managerTeamData";

interface MomentumEntry {
  name: string;
  role: string;
  trend: number; // positive = up, negative = down
  weeks: number[]; // last 4 weeks completion rate %
}

// name/role from canonical team members; trend/weeks are demo values.
const RISING: MomentumEntry[] = [
  { name: managerTeam[1].name, role: managerTeam[1].position, trend: 12, weeks: [74, 80, 85, 89] },
  { name: managerTeam[4].name, role: managerTeam[4].position, trend: 8,  weeks: [70, 74, 77, 80] },
];

const DECLINING: MomentumEntry[] = [
  { name: managerTeam[3].name, role: managerTeam[3].position, trend: -15, weeks: [85, 80, 73, 68] },
];

function MiniSparkline({ weeks, color }: { weeks: number[]; color: string }) {
  const min = Math.min(...weeks);
  const max = Math.max(...weeks);
  const range = max - min || 1;
  const h = 22;
  const w = 56;
  const step = w / (weeks.length - 1);
  const pts = weeks.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {weeks.map((v, i) => (
        <circle key={i} cx={i * step} cy={h - ((v - min) / range) * h} r="2" fill={color} />
      ))}
    </svg>
  );
}

function Section({ title, entries, up }: { title: string; entries: MomentumEntry[]; up: boolean }) {
  const color = up ? "#28a745" : "#dc3545";
  const bg    = up ? "#e9f7ef" : "#fff0f0";
  const arrow = up ? "↑" : "↓";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{ width: 4, height: 14, borderRadius: 2, background: color }} />
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color }}>
          {title}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {entries.map(e => (
          <div key={e.name} style={{
            background: bg,
            borderRadius: 8,
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: color + "25", color,
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
            <MiniSparkline weeks={e.weeks} color={color} />
            <div style={{
              fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 13, color,
              minWidth: 36, textAlign: "right",
            }}>
              {arrow}{Math.abs(e.trend)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PerformanceMomentumCard() {
  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057" }}>
          Momentum Performa
        </span>
        <span style={{ fontSize: 9, fontFamily: "Open Sans, sans-serif", color: "#adb5bd" }}>
          vs. 4 minggu lalu
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Section title="Momentum Naik" entries={RISING}   up={true} />
        <Section title="Momentum Turun" entries={DECLINING} up={false} />
      </div>
    </div>
  );
}
