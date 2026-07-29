"use client";
import type { CSSProperties } from "react";
import type { SessionRole } from "@/lib/session";
import { ROLE_GREETING } from "./onboardingContent";

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

const chipStyle: CSSProperties = {
  fontFamily: FONT,
  fontSize: 13,
  fontWeight: 600,
  color: "#fff",
  background: ACCENT,
  border: "none",
  borderRadius: 9999,
  padding: "10px 20px",
  cursor: "pointer",
};

export default function OnboardingGate({ onChoose }: { onChoose: (role: SessionRole) => void }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        gap: 16,
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: FONT, fontSize: 14, color: "#495057", lineHeight: 1.6, maxWidth: 280 }}>
        {ROLE_GREETING}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => onChoose("hr")} style={chipStyle}>
          Saya HR
        </button>
        <button onClick={() => onChoose("manager")} style={chipStyle}>
          Saya Manager
        </button>
      </div>
    </div>
  );
}
