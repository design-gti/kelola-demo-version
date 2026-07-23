"use client";
import { managerTeam } from "@/data/managerTeamData";

interface WorkloadEntry {
  name: string;
  role: string;
  tasks: number;
  pct: number;
}

// name/role from canonical team; task counts & utilization % are demo values by seniority.
const DEMO = [
  { tasks: 11, pct: 124 }, { tasks: 8, pct: 95 }, { tasks: 7, pct: 88 },
  { tasks: 6, pct: 82 }, { tasks: 4, pct: 65 }, { tasks: 3, pct: 58 },
];
const WORKLOAD: WorkloadEntry[] = managerTeam.map((c, i) => ({
  name: c.name, role: c.position, ...DEMO[i % DEMO.length],
}));

function barColor(pct: number) {
  if (pct > 110) return "#dc3545";
  if (pct > 90)  return "#fd9f28";
  if (pct < 65)  return "#adb5bd";
  return "#016699";
}

function badge(pct: number): { label: string; bg: string; color: string } | null {
  if (pct > 110) return { label: "Overload",      bg: "#fff0f0", color: "#dc3545" };
  if (pct < 65)  return { label: "Underutilized", bg: "#f0f0f0", color: "#6c757d" };
  return null;
}

export default function WorkloadMapCard() {
  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057" }}>
          Peta Beban Kerja
        </span>
        <span style={{ fontSize: 9, fontFamily: "Open Sans, sans-serif", color: "#adb5bd" }}>
          % dari kapasitas standar
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {WORKLOAD.map(e => {
          const b = badge(e.pct);
          const bc = barColor(e.pct);
          return (
            <div key={e.name}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                    background: bc + "20", color: bc,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 9,
                  }}>
                    {e.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#495057" }}>
                      {e.name}
                    </span>
                    <span style={{ fontSize: 9, color: "#adb5bd", fontFamily: "Open Sans, sans-serif", marginLeft: 5 }}>
                      {e.tasks} task
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {b && (
                    <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 9999, background: b.bg, color: b.color, fontFamily: "Open Sans, sans-serif" }}>
                      {b.label}
                    </span>
                  )}
                  <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 11, color: bc, minWidth: 34, textAlign: "right" }}>
                    {e.pct}%
                  </span>
                </div>
              </div>
              <div style={{ height: 5, background: "#f0f0f0", borderRadius: 3 }}>
                <div style={{ height: "100%", width: `${Math.min(e.pct, 100)}%`, background: bc, borderRadius: 3, transition: "width 0.3s" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 14, paddingTop: 10, borderTop: "1px solid #f0f0f0" }}>
        {[
          { color: "#dc3545", label: "> 110% Overload" },
          { color: "#fd9f28", label: "90–110% Optimal" },
          { color: "#016699", label: "65–90% Normal" },
          { color: "#adb5bd", label: "< 65% Underutilized" },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontFamily: "Open Sans, sans-serif", color: "#adb5bd" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
