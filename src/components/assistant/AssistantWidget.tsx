"use client";
import { useEffect, useMemo, useState } from "react";
import { useAssistantPanel } from "@/hooks/useAssistantPanel";
import { useProactiveInsights } from "@/hooks/useProactiveInsights";
import type { Insight } from "@/lib/agent/insights";
import AssistantLauncher from "./AssistantLauncher";
import AssistantPanel from "./AssistantPanel";
import InsightToast from "./InsightToast";

const SEEN_KEY = "kelola-assistant-seen-insights";
const TOASTED_KEY = "kelola-assistant-toasted-insights";

function readIdSet(key: string): Set<string> {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeIdSet(key: string, ids: Set<string>) {
  try {
    sessionStorage.setItem(key, JSON.stringify(Array.from(ids)));
  } catch {}
}

export default function AssistantWidget() {
  const { open, toggle, setOpen } = useAssistantPanel();
  const { insights } = useProactiveInsights();
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [toastInsight, setToastInsight] = useState<Insight | null>(null);

  useEffect(() => {
    setSeenIds(readIdSet(SEEN_KEY));
  }, []);

  const unseenCount = useMemo(() => insights.filter(i => !seenIds.has(i.id)).length, [insights, seenIds]);

  // Tier 2: at most one critical toast per insight id per browser session,
  // and only while the panel itself isn't already open (no point toasting
  // something the user would see in the Insights tab anyway).
  useEffect(() => {
    if (open) return;
    const toasted = readIdSet(TOASTED_KEY);
    const nextCritical = insights.find(i => i.severity === "critical" && !toasted.has(i.id));
    if (nextCritical) {
      setToastInsight(nextCritical);
      const next = new Set(toasted);
      next.add(nextCritical.id);
      writeIdSet(TOASTED_KEY, next);
    }
  }, [insights, open]);

  const markAllSeen = () => {
    setSeenIds(prev => {
      const next = new Set(prev);
      insights.forEach(i => next.add(i.id));
      writeIdSet(SEEN_KEY, next);
      return next;
    });
  };

  return (
    <>
      <AssistantPanel open={open} insights={insights} onOpenInsightsTab={markAllSeen} />
      <AssistantLauncher open={open} onClick={toggle} badgeCount={unseenCount} />
      {toastInsight && (
        <InsightToast
          insight={toastInsight}
          onDismiss={() => setToastInsight(null)}
          onOpen={() => {
            setToastInsight(null);
            setOpen(true);
          }}
        />
      )}
    </>
  );
}
