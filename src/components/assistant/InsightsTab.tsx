"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Insight } from "@/lib/agent/insights";

const SEVERITY_COLOR: Record<Insight["severity"], string> = {
  critical: "#dc3545",
  warning: "#fd9f28",
  info: "#016699",
};

function InsightCard({ insight }: { insight: Insight }) {
  const router = useRouter();
  const [showEvidence, setShowEvidence] = useState(false);
  const color = SEVERITY_COLOR[insight.severity];

  return (
    <div
      style={{
        border: `1px solid ${color}33`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: "#495057" }}>{insight.title}</div>
        <button
          onClick={() => setShowEvidence(v => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#adb5bd", fontSize: 12, flexShrink: 0 }}
          aria-label="Kenapa saya lihat ini?"
          title="Kenapa saya lihat ini?"
        >
          ⓘ
        </button>
      </div>
      <div style={{ fontSize: 11, color: "#6c757d", marginTop: 4, lineHeight: 1.5 }}>{insight.message}</div>

      {showEvidence && (
        <div style={{ fontSize: 10, color: "#adb5bd", marginTop: 6, padding: 8, background: "#f8f9fa", borderRadius: 6, lineHeight: 1.5 }}>
          <div>Dasar: {insight.evidence.basis}</div>
          <div>Dihitung: {new Date(insight.evidence.computedAt).toLocaleString("id-ID")}</div>
        </div>
      )}

      {insight.navigationTarget && (
        <button
          onClick={() => router.push(insight.navigationTarget!.href)}
          style={{
            marginTop: 8,
            background: "#016699",
            color: "#fff",
            border: "none",
            borderRadius: 9999,
            padding: "6px 14px",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {insight.navigationTarget.label}
        </button>
      )}
    </div>
  );
}

export default function InsightsTab({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#adb5bd", fontSize: 12, fontFamily: "'Open Sans', sans-serif" }}>
        Tidak ada insight saat ini.
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      {insights.map(insight => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  );
}
