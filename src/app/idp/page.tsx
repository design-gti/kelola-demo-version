"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function IDPFrame() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "monitoring-admin.html";

  // Forward every query param except `page` itself straight through to the static
  // IDP HTML (id/name/from for context, participants/aspect for the create-IDP
  // prefill flow, etc.) — the static pages read whatever they need via location.search.
  const query = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== "page") query.set(key, value);
  });
  const qs = query.toString();

  const src = `/idp-app/${page}${qs ? `?${qs}` : ""}`;

  return (
    <iframe
      src={src}
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
      title="IDP"
    />
  );
}

export default function IDPPage() {
  return (
    <Suspense>
      <IDPFrame />
    </Suspense>
  );
}
