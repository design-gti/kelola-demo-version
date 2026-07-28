"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const VismapApp = dynamic(() => import("@/vismap/App"), { ssr: false });

function VismapWithTab() {
  // Pass ?tab= as a prop so client-side query changes (e.g. from Home) update
  // the active tab via effect — App Router doesn't remount on query-only change.
  const tab = useSearchParams().get("tab") ?? "all";
  return <VismapApp initialTab={tab} />;
}

export default function VismapPage() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Suspense fallback={null}>
        <VismapWithTab />
      </Suspense>
    </div>
  );
}
