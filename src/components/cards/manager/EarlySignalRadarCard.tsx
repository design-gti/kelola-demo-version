"use client";
import { managerTeam } from "@/data/managerTeamData";

interface Signal {
  name: string;
  reason: string;
  severity: "high" | "medium";
}

// names from canonical team; reasons/severity are demo signals.
const SIGNALS: Signal[] = [
  {
    name: managerTeam[2].name,
    reason: "Jam kerja efektif naik 35% di atas rata-rata dirinya 4 minggu terakhir",
    severity: "high",
  },
  {
    name: managerTeam[3].name,
    reason: "Skor mood self-report turun signifikan dibanding 3 minggu sebelumnya",
    severity: "medium",
  },
];

const SAFE = [0, 1, 4, 5].map(i => managerTeam[i].name);

const SEV_COLOR: Record<Signal["severity"], { bg: string; text: string; dot: string; label: string }> = {
  high:   { bg: "#fff0f0", text: "#dc3545", dot: "#dc3545", label: "Perhatian tinggi" },
  medium: { bg: "#fff8e6", text: "#856404", dot: "#fd9f28", label: "Pantau" },
};

export default function EarlySignalRadarCard() {
  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057" }}>
          Radar Sinyal Dini
        </span>
        <span style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#adb5bd" }}>
          {SIGNALS.length} sinyal aktif
        </span>
      </div>

      {SIGNALS.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px 0", fontSize: 10, color: "#adb5bd", fontFamily: "Open Sans, sans-serif" }}>
          ✓ Semua anggota tim dalam kondisi normal
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {SIGNALS.map(s => {
            const cfg = SEV_COLOR[s.severity];
            return (
              <div key={s.name} style={{
                background: cfg.bg,
                borderRadius: 8,
                padding: "10px 12px",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  background: cfg.dot + "30", color: cfg.text,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 11,
                }}>
                  {s.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#495057" }}>
                      {s.name}
                    </span>
                    <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 9999, background: cfg.dot + "20", color: cfg.text, fontFamily: "Open Sans, sans-serif", whiteSpace: "nowrap" }}>
                      {cfg.label}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#6c757d", lineHeight: 1.5 }}>
                    {s.reason}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {SAFE.length > 0 && (
        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 10 }}>
          <span style={{ fontSize: 9, fontFamily: "Open Sans, sans-serif", color: "#adb5bd", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Normal
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
            {SAFE.map(name => (
              <span key={name} style={{
                fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#28a745",
                background: "#e9f7ef", padding: "2px 8px", borderRadius: 9999,
              }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
