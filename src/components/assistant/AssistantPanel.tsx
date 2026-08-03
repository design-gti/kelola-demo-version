"use client";
import { useRef, useState } from "react";
import type { Message } from "@copilotkit/shared";
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useOnboarding } from "@/hooks/useOnboarding";
import { ASSISTANT_INSTRUCTIONS } from "@/lib/agent/instructions";
import type { Insight } from "@/lib/agent/insights";
import ChatErrorBoundary from "./ChatErrorBoundary";
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
  // Tracks the most recent question the user actually typed, for pairing with
  // whichever answer gets rated below. Deliberately NOT sourced from
  // useCopilotChat()'s `visibleMessages` — verified live that it's undefined
  // at runtime in this exact @copilotkit package version (another of this
  // version's OSS hooks that's declared in its types but not actually wired
  // up under the hood; see llmClients.ts and CopilotChat's `instructions`
  // prop for the same class of issue found earlier). onSubmitMessage gives
  // the raw text directly and is confirmed to actually fire.
  const lastQuestionRef = useRef<string | null>(null);
  // Bumped only by the crash-recovery path below (ChatErrorBoundary's
  // onRetry) — NOT exposed as a user-facing "clear chat" button. Verified
  // live that remounting <CopilotChat/> via a key change does NOT give a
  // clean slate in this exact package version: the message history lives in
  // the CopilotKit provider above it, and remounting duplicates the last
  // exchange's text instead of clearing it (reproduced reliably, unrelated
  // to any other state). The one API that does expose a real setMessages(),
  // useCopilotChatHeadless_c(), is gated behind a CopilotKit Cloud license
  // key — it renders a license-nag banner instead of working, confirmed
  // live. No working "clear chat" mechanism exists in this package version;
  // remounting is kept only as a last-resort crash escape, where a duplicated
  // exchange is still strictly better than a permanently crashed panel.
  const [chatKey, setChatKey] = useState(0);
  const recoverFromCrash = () => {
    lastQuestionRef.current = null;
    setChatKey(k => k + 1);
  };

  const selectTab = (t: "chat" | "insights") => {
    setTab(t);
    if (t === "insights") onOpenInsightsTab();
  };

  // CopilotChat's own onThumbsUp/onThumbsDown only update local React state
  // (see the library's handleThumbsUp/handleThumbsDown) — nothing survives a
  // reload unless something actually persists it. Pairs the rated answer with
  // whatever question preceded it and logs both server-side via /api/feedback,
  // so a thumbs-up/down becomes a real, durable signal (see route.ts's
  // comment) instead of a click that quietly does nothing. Best-effort: if the
  // user rates an older message after asking something new in between, this
  // pairs it with the wrong (more recent) question — acceptable for how this
  // feature is actually used (rating the reply you just got), not worth the
  // extra complexity of tracking per-message question history for the rare
  // out-of-order case.
  const sendFeedback = (rating: "up" | "down", message: Message) => {
    const answer = typeof message.content === "string" ? message.content : "";

    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: lastQuestionRef.current, answer, rating }),
    }).catch(() => {
      // Best-effort only — a failed feedback log must never surface as a user-facing error.
    });
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
            <ChatErrorBoundary resetKey={chatKey} onRetry={recoverFromCrash}>
              <CopilotChat
                key={chatKey}
                className="kelola-assistant-chat"
                instructions={ASSISTANT_INSTRUCTIONS}
                onSubmitMessage={text => { lastQuestionRef.current = text; }}
                onThumbsUp={message => sendFeedback("up", message)}
                onThumbsDown={message => sendFeedback("down", message)}
                labels={{
                  initial: "Halo! Saya asisten Kelola. Ada yang bisa saya bantu?",
                  title: "Asisten Kelola",
                  placeholder: "Tanya sesuatu...",
                  error: "Maaf, terjadi kesalahan. Coba lagi.",
                }}
              />
            </ChatErrorBoundary>
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
