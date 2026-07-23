"use client";
import { candidates } from "@/data/dummyData";

// Committee event date (editable config). Countdown computes against the real current date.
const EVENT_DATE = "2026-08-15";

function daysRemaining(target: string): number {
  return Math.ceil((new Date(target).getTime() - Date.now()) / 86400000);
}

interface Dimension {
  key: string;
  label: string;
  filled: number;
  total: number;
  status: "missing" | "partial" | "complete";
}

export default function CommitteeReadinessCard() {
  const successionCandidates = candidates.filter(c => c.isSuccession);
  const total = successionCandidates.length;

  const getFieldCount = (field: keyof typeof successionCandidates[0]) =>
    successionCandidates.filter(c => c[field] !== null).length;

  const dimensions: Dimension[] = [
    { key: "behavioral", label: "Behavioral Score", filled: getFieldCount("behavioral_score"), total },
    { key: "technical", label: "Technical Score", filled: getFieldCount("technical_score"), total },
    { key: "performance", label: "Performance Score", filled: getFieldCount("performance_score"), total },
    { key: "photo", label: "Foto Profil", filled: 0, total },
  ].map(d => ({
    ...d,
    status: d.filled === 0 ? "missing" : d.filled === d.total ? "complete" : "partial",
  }));

  const sorted = [...dimensions].sort((a, b) => {
    const order = { missing: 0, partial: 1, complete: 2 };
    return order[a.status] - order[b.status];
  });

  const completeDimensions = dimensions.filter(d => d.status === "complete").length;
  const overallPct = Math.round((completeDimensions / 4) * 100);
  const days = daysRemaining(EVENT_DATE);

  const statusColor: Record<string, string> = { missing: "#dc3545", partial: "#fd9f28", complete: "#28a745" };
  const statusLabel: Record<string, string> = { missing: "Belum Ada", partial: "Parsial", complete: "Lengkap" };

  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057" }}>
          Committee Readiness
        </span>
        <span style={{ background: "#fff3cd", color: "#856404", fontSize: 10, fontFamily: "Open Sans, sans-serif", padding: "2px 8px", borderRadius: 6 }}>
          {days} hari lagi · {EVENT_DATE}
        </span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#495057" }}>Kesiapan Keseluruhan</span>
          <span style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#016699" }}>{overallPct}%</span>
        </div>
        <div style={{ height: 8, background: "#f0f0f0", borderRadius: 4 }}>
          <div style={{ height: "100%", width: `${overallPct}%`, background: "#016699", borderRadius: 4, transition: "width 0.3s" }} />
        </div>
        <div style={{ fontSize: 10, color: "#adb5bd", fontFamily: "Open Sans, sans-serif", marginTop: 4 }}>
          {successionCandidates.length} kandidat succession
        </div>
      </div>

      <div className="card-scroll" style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 280, overflowY: "auto" }}>
        {sorted.map(dim => (
          <div key={dim.key}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#495057" }}>{dim.label}</span>
              <span style={{
                fontSize: 10, padding: "1px 8px", borderRadius: 10, fontFamily: "Open Sans, sans-serif",
                background: statusColor[dim.status] + "20", color: statusColor[dim.status]
              }}>
                {statusLabel[dim.status]} {dim.status !== "missing" ? `(${dim.filled}/${dim.total})` : ""}
              </span>
            </div>
            {dim.status !== "missing" && (
              <div style={{ height: 4, background: "#f0f0f0", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${(dim.filled / dim.total) * 100}%`, background: statusColor[dim.status], borderRadius: 2 }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
