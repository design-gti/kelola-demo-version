"use client";
import { useState } from "react";
import { activityLog } from "@/data/dummyData";
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

export default function ActivityLogCard() {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const filtered = activityLog.filter(e => activeFilter === null || e.type === activeFilter);

  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057", marginBottom: 10 }}>
        Activity Log
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {FILTERS.map(f => (
          <button
            key={String(f.value)}
            onClick={() => setActiveFilter(f.value)}
            style={{
              fontSize: 10, padding: "3px 10px", borderRadius: 20, cursor: "pointer", fontFamily: "Open Sans, sans-serif",
              background: activeFilter === f.value ? "#016699" : "#f0f0f0",
              color: activeFilter === f.value ? "#fff" : "#495057",
              border: "none",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="card-scroll" style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
        {filtered.map(entry => (
          <div key={entry.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%", background: TYPE_COLORS[entry.type],
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              fontSize: 10, color: "#fff", fontWeight: 700, fontFamily: "'Open Sans', sans-serif",
            }}>
              {TYPE_ICONS[entry.type]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#495057", lineHeight: 1.4 }}>{entry.description}</div>
              <div style={{ fontSize: 10, color: "#adb5bd", fontFamily: "Open Sans, sans-serif", marginTop: 2 }}>
                {entry.actor} · {timeAgo(entry.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
