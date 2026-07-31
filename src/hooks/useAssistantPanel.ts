"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "kelola-assistant-open";

/**
 * Open/closed state persisted across client-side route changes, mirroring
 * Sidebar.tsx's own localStorage-backed collapsed-state pattern — the
 * widget is mounted once at root (layout.tsx) so this survives navigation
 * without remounting.
 */
export function useAssistantPanel() {
  const [open, setOpenState] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "true") setOpenState(true);
    } catch {}
  }, []);

  const setOpen = (next: boolean) => {
    setOpenState(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {}
  };

  return { open, setOpen, toggle: () => setOpen(!open) };
}
