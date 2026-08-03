"use client";
import type { Candidate, SyncSystem } from "@/data/dummyData";

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stddev(arr: number[], avg: number): number {
  return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / arr.length);
}

export default function DataHealthIndicatorCard({ employees, syncSystems }: { employees: Candidate[]; syncSystems: SyncSystem[] }) {
  const scores = employees.map(c => c.behavioral_score).filter((s): s is number => s !== null);
  const avg = mean(scores);
  const sd = stddev(scores, avg);
  const outliers = scores.filter(s => s > avg + 2 * sd || s < avg - 2 * sd).length;

  const normalDist = 72;
  const consistency = Math.max(0, Math.round(100 - (sd / avg) * 100));

  const statusConfig: Record<string, { label: string; color: string }> = {
    success: { label: "Terhubung", color: "#28a745" },
    warning: { label: "Stale", color: "#fd9f28" },
    failed: { label: "Gagal", color: "#dc3545" },
  };

  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057", marginBottom: 12 }}>
        Data Health Indicator
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Distribusi Normal", value: `${normalDist}%`, color: "#016699" },
          { label: "Konsistensi", value: `${consistency}%`, color: "#28a745" },
          { label: "Outlier", value: `${outliers} org`, color: outliers > 2 ? "#dc3545" : "#fd9f28" },
        ].map(m => (
          <div key={m.label} style={{ background: "#f8f9fa", borderRadius: 8, padding: "10px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: m.color, fontFamily: "'Open Sans', sans-serif" }}>{m.value}</div>
            <div style={{ fontSize: 9, color: "#adb5bd", fontFamily: "Open Sans, sans-serif", marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057", marginBottom: 8 }}>
        Status Sistem
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {syncSystems.map(sys => {
          const cfg = statusConfig[sys.status];
          return (
            <div key={sys.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontFamily: "Open Sans, sans-serif", color: "#495057" }}>{sys.name}</span>
              <span style={{ fontSize: 12, padding: "1px 8px", borderRadius: 10, background: cfg.color + "20", color: cfg.color, fontFamily: "Open Sans, sans-serif" }}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
