"use client";
import { useEffect, useState, type ComponentType } from "react";

// Native TDP island (ported from tdp-prototype). We fetch the WC employee CSV,
// inject it into csvSource, THEN dynamically import the TDP App so its module-load
// column-defs read the data — same bootstrap the old Vite main.tsx used. Client-only
// (TDP is heavily interactive), so no SSR of its internals.
export default function TDPPage() {
  const [App, setApp] = useState<ComponentType | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/data/tdp-employees.csv");
        const { setRawCsv } = await import("@/tdp/data/csvSource");
        setRawCsv(res.ok ? await res.text() : "");
      } catch {
        /* fall through — App renders with empty data */
      }
      const mod = await import("@/tdp/App");
      if (alive) setApp(() => mod.default);
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="tdp-root" style={{ minHeight: "100vh", background: "var(--background)" }}>
      {App ? <App /> : <div style={{ padding: 24, fontFamily: "'Open Sans', sans-serif", color: "#868e96" }}>Loading TDP…</div>}
    </div>
  );
}
