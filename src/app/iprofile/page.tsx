"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const IProfileApp = dynamic(() => import("@/iprofile/imports/Frame45227"), { ssr: false });

export default function IProfilePage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Breadcrumb */}
      <div style={{ padding: "10px 16px 0", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Open Sans', sans-serif", fontSize: 12 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 4, color: "#016699", fontWeight: 600, textDecoration: "none" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="#016699" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Home
        </Link>
        <span style={{ color: "#adb5bd" }}>/</span>
        {from === "tdp" && (
          <>
            <Link href="/tdp" style={{ color: "#016699", fontWeight: 600, textDecoration: "none" }}>TDP</Link>
            <span style={{ color: "#adb5bd" }}>/</span>
          </>
        )}
        {from === "vismap" && (
          <>
            <Link href="/vismap" style={{ color: "#016699", fontWeight: 600, textDecoration: "none" }}>Vismap</Link>
            <span style={{ color: "#adb5bd" }}>/</span>
          </>
        )}
        <span style={{ color: "#495057", fontWeight: 600 }}>iProfile</span>
      </div>
      <div style={{ padding: "12px 16px 40px" }}>
        <IProfileApp />
      </div>
    </div>
  );
}
