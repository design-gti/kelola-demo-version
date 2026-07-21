"use client";
import { useState } from "react";
import { CardConfig } from "@/hooks/useDashboardConfig";

interface Props {
  open: boolean;
  onClose: () => void;
  cards: CardConfig[];
  onToggle: (id: string) => void;
  renderCard: (id: string) => React.ReactNode;
}

const PANEL_WIDTH = 380;
const PREVIEW_WIDTH = 268;
const CARD_RENDER_WIDTH = 420;
const BANNER_RENDER_WIDTH = 860;

function previewZoom(id: string) {
  return id === "banner"
    ? PREVIEW_WIDTH / BANNER_RENDER_WIDTH
    : PREVIEW_WIDTH / CARD_RENDER_WIDTH;
}

export default function SettingsPanel({ open, onClose, cards, onToggle, renderCard }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewTop, setPreviewTop] = useState(0);

  const handleRowEnter = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredId(id);
    // Center preview vertically on the hovered row, clamped to viewport
    const rowMid = rect.top + rect.height / 2;
    setPreviewTop(Math.max(8, Math.min(window.innerHeight - 8, rowMid)));
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }}
        />
      )}

      {/* Preview panel */}
      {open && hoveredId && (
        <div
          style={{
            position: "fixed",
            right: PANEL_WIDTH + 12,
            top: previewTop,
            transform: "translateY(-50%)",
            zIndex: 55,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            padding: 12,
            width: PREVIEW_WIDTH + 24,
            pointerEvents: "none",
          }}
        >
          <p style={{
            fontFamily: "'Open Sans', sans-serif", fontWeight: 700,
            fontSize: 11, color: "#adb5bd", marginBottom: 8,
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            Preview
          </p>
          {/* Scaled card */}
          <div style={{ overflow: "hidden", borderRadius: 8 }}>
            <div style={{
              width: hoveredId === "banner" ? BANNER_RENDER_WIDTH : CARD_RENDER_WIDTH,
              // @ts-ignore — zoom is valid CSS, TS doesn't know it
              zoom: previewZoom(hoveredId),
              pointerEvents: "none",
            }}>
              {renderCard(hoveredId)}
            </div>
          </div>
        </div>
      )}

      {/* Settings panel */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100%",
          width: PANEL_WIDTH,
          background: "#fff",
          zIndex: 50,
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#495057" }}>
              Konfigurasi Dashboard
            </span>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#adb5bd", fontSize: 20, lineHeight: 1 }}
            >
              ✕
            </button>
          </div>
          <p style={{ fontFamily: "Open Sans, sans-serif", fontSize: 12, color: "#adb5bd", marginTop: 6 }}>
            Aktifkan card yang ingin ditampilkan di dashboard
          </p>
        </div>

        <div
          style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Pinned cards — always on, shown at top */}
          {["banner", "profile-completion"].map(pinnedId => {
            const card = cards.find(c => c.id === pinnedId);
            if (!card) return null;
            return (
              <div
                key={card.id}
                onMouseEnter={e => handleRowEnter(card.id, e)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 20px", borderBottom: "1px solid #f8f9fa",
                  background: hoveredId === card.id ? "#f8f9fa" : "transparent",
                  transition: "background 0.15s", cursor: "default",
                }}
              >
                <div style={{ flex: 1, marginRight: 12 }}>
                  <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#495057" }}>
                    {card.label}
                  </div>
                  <div style={{ fontFamily: "Open Sans, sans-serif", fontSize: 11, color: "#adb5bd", marginTop: 2 }}>
                    {card.description}
                  </div>
                </div>
                <button
                  disabled
                  style={{
                    width: 44, height: 24, borderRadius: 12,
                    background: "#016699", border: "none",
                    position: "relative", flexShrink: 0,
                    opacity: 0.4, cursor: "not-allowed",
                  }}
                >
                  <span style={{
                    position: "absolute", top: 2, left: 22,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }} />
                </button>
              </div>
            );
          })}

          {/* Separator */}
          <div style={{ height: 1, background: "#e9ecef", margin: "4px 0" }} />

          {/* Toggleable cards */}
          {cards.filter(c => c.id !== "banner" && c.id !== "profile-completion").map(card => (
            <div
              key={card.id}
              onMouseEnter={e => handleRowEnter(card.id, e)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 20px", borderBottom: "1px solid #f8f9fa",
                background: hoveredId === card.id ? "#f8f9fa" : "transparent",
                transition: "background 0.15s", cursor: "default",
              }}
            >
              <div style={{ flex: 1, marginRight: 12 }}>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#495057" }}>
                  {card.label}
                </div>
                <div style={{ fontFamily: "Open Sans, sans-serif", fontSize: 11, color: "#adb5bd", marginTop: 2 }}>
                  {card.description}
                </div>
              </div>
              <button
                onClick={() => onToggle(card.id)}
                style={{
                  width: 44, height: 24, borderRadius: 12,
                  background: card.enabled ? "#016699" : "#dee2e6",
                  border: "none", cursor: "pointer",
                  position: "relative", transition: "background 0.2s", flexShrink: 0,
                }}
              >
                <span style={{
                  position: "absolute", top: 2,
                  left: card.enabled ? 22 : 2,
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#fff", transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
