"use client";
import { useState } from "react";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useOnboarding } from "@/hooks/useOnboarding";
import { ASSISTANT_INSTRUCTIONS } from "@/lib/agent/instructions";
import type { Insight } from "@/lib/agent/insights";
import InsightsTab from "./InsightsTab";
import OnboardingGate from "./OnboardingGate";
import PageIntroBanner from "./PageIntroBanner";

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

/**
 * Overlay slide-over — deliberately not a docked/push panel. The Home
 * dashboard scales its whole ~1440px canvas down via ScaleWrapper, and
 * /tdp-view + /idp are full-bleed iframes; shrinking <main>'s width the way
 * Sidebar does via --sidebar-w would shrink that scale factor further and
 * letterbox the iframes. No backdrop either — this is a companion surface,
 * the dashboard underneath should stay visible and usable.
 */
export default function AssistantPanel({
  open,
  insights,
  onOpenInsightsTab,
}: {
  open: boolean;
  insights: Insight[];
  onOpenInsightsTab: () => void;
}) {
  const [tab, setTab] = useState<"chat" | "insights">("chat");
  const { ready, needsRoleChoice, chooseRole, pagesIntroduced, markPageIntroduced } = useOnboarding();

  const selectTab = (t: "chat" | "insights") => {
    setTab(t);
    if (t === "insights") onOpenInsightsTab();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        width: 400,
        maxWidth: "100vw",
        background: "#fff",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        zIndex: 55,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.25s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "16px 16px 0", flexShrink: 0 }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 14, color: "#495057", marginBottom: 12 }}>
          Asisten Kelola
        </div>
        <div style={{ display: "flex", gap: 20, borderBottom: "1px solid #e9ecef" }}>
          {(["chat", "insights"] as const).map(t => (
            <button
              key={t}
              onClick={() => selectTab(t)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 600,
                padding: "0 0 10px",
                color: tab === t ? ACCENT : "#adb5bd",
                borderBottom: tab === t ? `2px solid ${ACCENT}` : "2px solid transparent",
              }}
            >
              {t === "chat" ? "Chat" : "Insights"}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          // Reserves space clear of AssistantLauncher's fixed circular
          // button (bottom:24, right:24, size 52) — otherwise, once the
          // chat fills the panel's full height, the input row's Send
          // button ends up underneath that higher-z-index launcher and
          // never receives the click.
          paddingBottom: 88,
          minHeight: 0,
          display: tab === "chat" ? "flex" : "none",
          flexDirection: "column",
        }}
      >
        {!ready ? null : needsRoleChoice ? (
          <OnboardingGate onChoose={chooseRole} />
        ) : (
          <>
            <PageIntroBanner pagesIntroduced={pagesIntroduced} onIntroduced={markPageIntroduced} />
            <CopilotChat
              className="kelola-assistant-chat"
              instructions={ASSISTANT_INSTRUCTIONS}
              labels={{
                initial: "Halo! Saya asisten Kelola. Ada yang bisa saya bantu?",
                title: "Asisten Kelola",
                placeholder: "Tanya sesuatu...",
                error: "Maaf, terjadi kesalahan. Coba lagi.",
              }}
            />
          </>
        )}
      </div>

      {tab === "insights" && (
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
          <InsightsTab insights={insights} />
        </div>
      )}
    </div>
  );
}
