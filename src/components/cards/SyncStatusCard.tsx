"use client";
import { Paper, Badge, Button, Text } from "@mantine/core";
import type { SyncSystem } from "@/data/dummyData";
import { timeAgo } from "@/utils/timeAgo";

export default function SyncStatusCard({ syncSystems }: { syncSystems: SyncSystem[] }) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    success: { label: "Terhubung", color: "#28a745" },
    warning: { label: "Stale", color: "#fd9f28" },
    failed: { label: "Gagal", color: "#dc3545" },
  };

  return (
    <Paper radius={12} p={16} w="100%" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <Text fw={700} size="sm" c="#495057" mb={12} style={{ fontFamily: "'Open Sans', sans-serif" }}>
        Sync Status
      </Text>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {syncSystems.map(sys => {
          const cfg = statusConfig[sys.status];
          return (
            <div key={sys.id} style={{ padding: "8px 10px", borderRadius: 8, background: "#f8f9fa" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#495057" }}>{sys.name}</div>
                  <div style={{ fontSize: 12, fontFamily: "Open Sans, sans-serif", color: "#adb5bd" }}>{sys.dataType} · {timeAgo(sys.lastSync)}</div>
                </div>
                <Badge
                  variant="light"
                  radius="xl"
                  size="sm"
                  style={{ background: cfg.color + "20", color: cfg.color, textTransform: "none", fontWeight: 400 }}
                >
                  {cfg.label}
                </Badge>
              </div>
              {sys.status === "failed" && sys.errorMsg && (
                <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#dc3545", fontFamily: "Open Sans, sans-serif" }}>{sys.errorMsg}</span>
                  <Button variant="outline" color="primary" size="compact-xs" radius={4} style={{ fontFamily: "Open Sans, sans-serif" }}>
                    Coba Lagi
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Paper>
  );
}
