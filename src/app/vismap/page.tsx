"use client";
import dynamic from "next/dynamic";

const VismapApp = dynamic(() => import("@/vismap/App"), { ssr: false });

export default function VismapPage() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <VismapApp />
    </div>
  );
}
