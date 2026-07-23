"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function IDPFrame() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "monitoring-admin.html";
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const from = searchParams.get("from");

  const query = new URLSearchParams();
  if (id) query.set("id", id);
  if (name) query.set("name", name);
  if (from) query.set("from", from);
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
