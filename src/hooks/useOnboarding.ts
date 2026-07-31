"use client";
import { useEffect, useState } from "react";
import type { SessionRole } from "@/lib/session";
import { postSession } from "@/lib/agent/ensureSession";

const STORAGE_KEY = "kelola-onboarding-v1";

interface OnboardingState {
  role: SessionRole | null;
  pagesIntroduced: string[];
}

const EMPTY_STATE: OnboardingState = { role: null, pagesIntroduced: [] };

function loadState(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY_STATE, ...JSON.parse(raw) };
  } catch {}
  return EMPTY_STATE;
}

function saveState(state: OnboardingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

/**
 * Whether the role picker (OnboardingGate) shows is purely a function of
 * this localStorage flag — never of whether a session cookie exists.
 * CopilotProvider's ensureSession() guarantees a session exists (defaulting
 * to "hr") before the assistant ever mounts, so that a technical session
 * always being present doesn't skip actually asking the user once.
 */
export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  const chooseRole = async (role: SessionRole) => {
    await postSession(role);
    setState(prev => {
      const next = { ...prev, role };
      saveState(next);
      return next;
    });
  };

  const markPageIntroduced = (pageKey: string) => {
    setState(prev => {
      if (prev.pagesIntroduced.includes(pageKey)) return prev;
      const next = { ...prev, pagesIntroduced: [...prev.pagesIntroduced, pageKey] };
      saveState(next);
      return next;
    });
  };

  return {
    ready,
    needsRoleChoice: ready && state.role === null,
    role: state.role,
    pagesIntroduced: state.pagesIntroduced,
    chooseRole,
    markPageIntroduced,
  };
}
