"use client";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import AppBreadcrumb from "@/components/Breadcrumb";

const IProfileApp = dynamic(() => import("@/iprofile/imports/Frame45227"), { ssr: false });

export default function IProfilePage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const items = [{ label: "Home", href: "/" }];
  if (from === "tdp") items.push({ label: "TDP", href: "/tdp-view" });
  if (from === "vismap") items.push({ label: "Vismap", href: "/vismap" });
  items.push({ label: "iProfile" });

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f8f9fa" }}>
      <AppBreadcrumb items={items} />
      <div style={{ padding: "12px 16px 40px" }}>
        <IProfileApp />
      </div>
    </div>
  );
}
