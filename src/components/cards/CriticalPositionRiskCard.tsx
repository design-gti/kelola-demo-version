"use client";
import type { SuccessionRiskPosition, SuccessionStatus } from "@/lib/data/types";

export default function CriticalPositionRiskCard({ positions: rawPositions }: { positions: SuccessionRiskPosition[] }) {
  const positions = [...rawPositions].sort((a, b) => {
    const order: Record<SuccessionStatus, number> = { "no-candidate": 0, weak: 1, ready: 2 };
    return order[a.status] - order[b.status];
  });

  const statusConfig: Record<SuccessionStatus, { label: string; color: string; bg: string }> = {
    "no-candidate": { label: "Tanpa Kandidat", color: "#dc3545", bg: "#dc354520" },
    weak: { label: "Lemah", color: "#fd9f28", bg: "#fd9f2820" },
    ready: { label: "Siap", color: "#28a745", bg: "#28a74520" },
  };

  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057", marginBottom: 12 }}>
        Critical Position Risk
      </div>
      <div className="card-scroll" style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
        {positions.map(pos => {
          const cfg = statusConfig[pos.status];
          const maxGap = pos.successors.length > 0 ? Math.max(...pos.successors.map(s => s.readinessGap)) : null;
          return (
            <div key={pos.positionId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8, background: "#f8f9fa" }}>
              <div>
                <div style={{ fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#495057" }}>{pos.title}</div>
                <div style={{ fontSize: 12, fontFamily: "Open Sans, sans-serif", color: "#adb5bd" }}>{pos.department}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 10, background: cfg.bg, color: cfg.color, fontFamily: "Open Sans, sans-serif" }}>
                  {cfg.label}
                </span>
                {maxGap !== null && (
                  <span style={{ fontSize: 12, fontFamily: "Open Sans, sans-serif", color: "#adb5bd" }}>
                    Gap maks: {maxGap}
                  </span>
                )}
                {pos.successors.length > 0 && (
                  <span style={{ fontSize: 12, fontFamily: "Open Sans, sans-serif", color: "#adb5bd" }}>
                    {pos.successors.length} suksesor
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
