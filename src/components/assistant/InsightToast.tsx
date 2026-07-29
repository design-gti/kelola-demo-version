"use client";
import { useEffect } from "react";
import type { Insight } from "@/lib/agent/insights";

/**
 * Tier 2 surfacing: a single, non-stacking, critical-only toast — see
 * AssistantWidget.tsx for the once-per-id-per-session gating. No global
 * toast primitive exists at root today (sonner is mounted only inside the
 * isolated Vismap sub-app), hence this small hand-rolled one.
 */
export default function InsightToast({
  insight,
  onDismiss,
  onOpen,
}: {
  insight: Insight;
  onDismiss: () => void;
  onOpen: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 8000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      style={{
        position: "fixed",
        right: 24,
        bottom: 88,
        zIndex: 59,
        width: 320,
        maxWidth: "calc(100vw - 48px)",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
        borderLeft: "3px solid #dc3545",
        padding: 14,
        cursor: "pointer",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: "#495057" }}>{insight.title}</div>
        <button
          onClick={e => {
            e.stopPropagation();
            onDismiss();
          }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#adb5bd", fontSize: 13, lineHeight: 1, flexShrink: 0 }}
          aria-label="Tutup"
        >
          ✕
        </button>
      </div>
      <div style={{ fontSize: 11, color: "#6c757d", marginTop: 4, lineHeight: 1.5 }}>{insight.message}</div>
    </div>
  );
}
