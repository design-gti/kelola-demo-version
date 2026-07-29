"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Insight } from "@/lib/agent/insights";

/**
 * Client-driven triggers only — no websocket/SSE infra exists in this app,
 * and HR metrics don't change at a frequency that would need it: refresh on
 * page-arrival (pathname changes), once on mount, and on tab refocus. Never
 * a blind interval that could interrupt mid-task.
 */
export function useProactiveInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const pathname = usePathname();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/insights");
      const data = await res.json();
      setInsights(data.insights ?? []);
    } catch {
      // Insights are a non-critical enhancement — fail silently.
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, pathname]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [refresh]);

  return { insights, refresh };
}
