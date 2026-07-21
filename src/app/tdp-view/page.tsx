"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TDPFrame() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const from = searchParams.get("from");

  const query = new URLSearchParams();
  if (tab) query.set("tab", tab);
  if (from) query.set("from", from);
  const qs = query.toString();

  const src = `/tdp/${qs ? `?${qs}` : ""}`;

  return (
    <iframe
      src={src}
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
      title="TDP"
    />
  );
}

export default function TDPPage() {
  return (
    <Suspense>
      <TDPFrame />
    </Suspense>
  );
}
