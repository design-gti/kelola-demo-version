"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ONBOARDING_PAGE_INTROS, resolvePageKey } from "./onboardingContent";

export default function PageIntroBanner({
  pagesIntroduced,
  onIntroduced,
}: {
  pagesIntroduced: string[];
  onIntroduced: (pageKey: string) => void;
}) {
  const pathname = usePathname();
  const pageKey = resolvePageKey(pathname);
  const [dismissedThisView, setDismissedThisView] = useState(false);

  useEffect(() => {
    setDismissedThisView(false);
  }, [pathname]);

  if (!pageKey || pagesIntroduced.includes(pageKey) || dismissedThisView) return null;
  const intro = ONBOARDING_PAGE_INTROS[pageKey];

  return (
    <div style={{ margin: "0 16px 12px", padding: 12, background: "#e7f5ff", borderRadius: 8, fontFamily: "'Open Sans', sans-serif", flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 12, color: "#016699", marginBottom: 4 }}>{intro.title}</div>
          <div style={{ fontSize: 12, color: "#495057", lineHeight: 1.5 }}>{intro.body}</div>
        </div>
        <button
          onClick={() => {
            setDismissedThisView(true);
            onIntroduced(pageKey);
          }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#adb5bd", fontSize: 14, flexShrink: 0, lineHeight: 1 }}
          aria-label="Tutup"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
