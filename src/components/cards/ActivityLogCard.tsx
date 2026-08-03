"use client";
import { useState } from "react";
import { Paper, Button, Avatar, Text } from "@mantine/core";
import type { ActivityEntry } from "@/data/dummyData";
import { timeAgo } from "@/utils/timeAgo";

type FilterType = null | "data_updated" | "assessment_completed" | "idp_action" | "sync_event" | "alert_triggered";

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "Semua", value: null },
  { label: "Data", value: "data_updated" },
  { label: "Assessment", value: "assessment_completed" },
  { label: "IDP", value: "idp_action" },
  { label: "Sync", value: "sync_event" },
  { label: "Alert", value: "alert_triggered" },
];

const TYPE_COLORS: Record<string, string> = {
  data_updated: "#016699",
  assessment_completed: "#28a745",
  idp_action: "#6f42c1",
  sync_event: "#fd9f28",
  alert_triggered: "#dc3545",
};

const TYPE_ICONS: Record<string, string> = {
  data_updated: "D",
  assessment_completed: "A",
  idp_action: "I",
  sync_event: "S",
  alert_triggered: "!",
};

export default function ActivityLogCard({ activityLog }: { activityLog: ActivityEntry[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const filtered = activityLog.filter(e => activeFilter === null || e.type === activeFilter);

  return (
    <Paper radius={12} p={16} w="100%" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <Text fw={700} size="sm" c="#495057" mb={10} style={{ fontFamily: "'Open Sans', sans-serif" }}>
        Activity Log
      </Text>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {FILTERS.map(f => (
          <Button
            key={String(f.value)}
            onClick={() => setActiveFilter(f.value)}
            variant={activeFilter === f.value ? "filled" : "subtle"}
            color="primary"
            size="compact-xs"
            radius="xl"
            styles={{ label: { fontFamily: "Open Sans, sans-serif" } }}
          >
            {f.label}
          </Button>
        ))}
      </div>
      <div className="card-scroll" style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
        {filtered.map(entry => (
          <div key={entry.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Avatar size={24} radius="xl" style={{ flexShrink: 0, background: TYPE_COLORS[entry.type] }}>
              <span style={{ fontSize: 12, color: "#fff", fontWeight: 700, fontFamily: "'Open Sans', sans-serif" }}>
                {TYPE_ICONS[entry.type]}
              </span>
            </Avatar>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontFamily: "Open Sans, sans-serif", color: "#495057", lineHeight: 1.4 }}>{entry.description}</div>
              <div style={{ fontSize: 12, color: "#adb5bd", fontFamily: "Open Sans, sans-serif", marginTop: 2 }}>
                {entry.actor} · {timeAgo(entry.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Paper>
  );
}
