"use client";
import { syncSystems } from "@/data/dummyData";
import { timeAgo } from "@/utils/timeAgo";

export default function SyncStatusCard() {
  const statusConfig: Record<string, { label: string; color: string }> = {
    success: { label: "Terhubung", color: "#28a745" },
    warning: { label: "Stale", color: "#fd9f28" },
    failed: { label: "Gagal", color: "#dc3545" },
  };

  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057", marginBottom: 12 }}>
        Sync Status
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {syncSystems.map(sys => {
          const cfg = statusConfig[sys.status];
          return (
            <div key={sys.id} style={{ padding: "8px 10px", borderRadius: 8, background: "#f8f9fa" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#495057" }}>{sys.name}</div>
                  <div style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#adb5bd" }}>{sys.dataType} · {timeAgo(sys.lastSync)}</div>
                </div>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: cfg.color + "20", color: cfg.color, fontFamily: "Open Sans, sans-serif" }}>
                  {cfg.label}
                </span>
              </div>
              {sys.status === "failed" && sys.errorMsg && (
                <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 10, color: "#dc3545", fontFamily: "Open Sans, sans-serif" }}>{sys.errorMsg}</span>
                  <button style={{ fontSize: 10, color: "#016699", background: "none", border: "1px solid #016699", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontFamily: "Open Sans, sans-serif" }}>
                    Coba Lagi
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
