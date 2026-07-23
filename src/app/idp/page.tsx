"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Whitelist of embeddable IDP pages so a bad ?page= can't point the iframe elsewhere.
const IDP_PAGES = new Set([
  "monitoring-admin.html", "monitoring-manager.html",
  "detail-idp-admin.html", "detail-idp-manager.html", "detail-idp-employee.html",
  "review-idp-list.html", "detail-review-idp.html",
  "create-idp-admin.html", "create-idp-manager.html",
]);

function IDPFrame() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const page = pageParam && IDP_PAGES.has(pageParam) ? pageParam : "monitoring-admin.html";

  const query = new URLSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  if (id) query.set("id", id);
  if (name) query.set("name", name);
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
    <Suspense fallback={null}>
      <IDPFrame />
    </Suspense>
  );
}
