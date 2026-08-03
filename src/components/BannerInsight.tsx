"use client";

import { useEffect, useRef, useState } from "react";
import { Paper, ActionIcon } from "@mantine/core";
import { useRouter } from "next/navigation";

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4" y="5"  width="12" height="1.5" rx="0.75" fill="#495057" />
      <rect x="4" y="9"  width="12" height="1.5" rx="0.75" fill="#495057" />
      <rect x="4" y="13" width="12" height="1.5" rx="0.75" fill="#495057" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3"  y="3"  width="6" height="6" rx="1" stroke="#495057" strokeWidth="1.2" fill="none" />
      <rect x="11" y="3"  width="6" height="6" rx="1" stroke="#495057" strokeWidth="1.2" fill="none" />
      <rect x="3"  y="11" width="6" height="6" rx="1" stroke="#495057" strokeWidth="1.2" fill="none" />
      <rect x="11" y="11" width="6" height="6" rx="1" stroke="#495057" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function SuccessionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function DevelopmentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}

function InsightCard({ title, main, sub, extra, accent, icon, buttons, onClick }: {
  title: string; main: string; sub: string; extra: string;
  accent: string; icon: React.ReactNode; buttons: React.ReactNode; onClick?: () => void;
}) {
  return (
    <Paper radius={8} p={14} onClick={onClick}
      style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", display: "flex", gap: 12, alignItems: "center", cursor: onClick ? "pointer" : undefined }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: accent }}>
        {icon}
      </div>
      <div className="flex flex-col flex-1 min-w-0 gap-[2px]">
        <p style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#6c757d" }}>{title}</p>
        <div className="flex items-end gap-[2px]">
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 22, color: "#016699", lineHeight: 1 }}>{main}</span>
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: "#adb5bd", marginBottom: 2 }}>{sub}</span>
        </div>
        <p style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: "#adb5bd" }}>{extra}</p>
      </div>
      <div className="flex-shrink-0">{buttons}</div>
    </Paper>
  );
}

const DEFAULT_LAYERS = [
  { src: "/banner-layer-1.svg", depth: 8  },
  { src: "/banner-layer-2.svg", depth: 16 },
  { src: "/banner-layer-3.svg", depth: 26 },
];

interface BannerInsightProps {
  layers?: { src: string; depth: number }[];
  hideSuccession?: boolean;
  /** Always compute via src/lib/data — never hardcode. */
  successionRisk: { atRisk: number; total: number };
  needDevelopment: { count: number; total: number };
}

export default function BannerInsight({
  layers = DEFAULT_LAYERS,
  hideSuccession = false,
  successionRisk,
  needDevelopment,
}: BannerInsightProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove  = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setOffset({ x: (e.clientX - rect.left) / rect.width - 0.5, y: (e.clientY - rect.top) / rect.height - 0.5 });
    };
    const onLeave = () => setOffset({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full rounded-[8px] overflow-hidden" style={{ aspectRatio: "472 / 142" }}>
      {layers.map((l, i) => (
        <img key={i} src={l.src} alt="" className="absolute inset-0 w-full h-full"
          style={{ objectFit: "fill", transform: `translate(${offset.x * l.depth}px, ${offset.y * l.depth * 0.6}px)`, transition: "transform 0.15s ease-out", willChange: "transform" }}
        />
      ))}

      <p className="absolute left-[12px] top-[8px] text-[#016699] text-[12px] z-10" style={{ fontFamily: "'Open Sans', sans-serif" }}>Hello,</p>
      <p className="absolute left-[12px] top-[27px] text-[#016699] text-[12px] z-10" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700 }}>PT Company Name</p>

      {/* HR: kedua card vertikal center di kanan */}
      {!hideSuccession && (
        <div className="absolute right-0 top-0 h-full flex flex-col justify-center gap-[10px] z-20 pr-[4px]" style={{ width: 293 }}>
          <InsightCard
            title="Succession Risk" main={String(successionRisk.atRisk)} sub={`/${successionRisk.total}`} extra="Position need successor"
            accent="#016699" icon={<SuccessionIcon />}
            onClick={() => router.push("/vismap?tab=succession-risk")}
            buttons={
              <ActionIcon variant="white" radius="xl" size={28} aria-label="Lihat daftar" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
                <ListIcon />
              </ActionIcon>
            }
          />
          <InsightCard
            title="Need Development" main={String(needDevelopment.count)} sub={`/${needDevelopment.total}`} extra="Employees need development"
            accent="#e07b00" icon={<DevelopmentIcon />}
            onClick={() => router.push("/vismap?tab=need-develop")}
            buttons={
              <div className="flex flex-col gap-2">
                <ActionIcon variant="white" radius="xl" size={28} aria-label="Lihat daftar" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}><ListIcon /></ActionIcon>
                <ActionIcon variant="white" radius="xl" size={28} aria-label="Lihat tabel" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}><TableIcon /></ActionIcon>
              </div>
            }
          />
        </div>
      )}

      {/* Manager: Need Development pojok kanan bawah */}
      {hideSuccession && (
        <div className="absolute z-20" style={{ bottom: 16, right: 16, width: 289 }}>
          <InsightCard
            title="Need Development" main={String(needDevelopment.count)} sub={`/${needDevelopment.total}`} extra="Employees need development"
            accent="#e07b00" icon={<DevelopmentIcon />}
            onClick={() => router.push("/vismap?tab=need-develop")}
            buttons={
              <div className="flex flex-col gap-2">
                <ActionIcon variant="white" radius="xl" size={28} aria-label="Lihat daftar" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}><ListIcon /></ActionIcon>
                <ActionIcon variant="white" radius="xl" size={28} aria-label="Lihat tabel" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}><TableIcon /></ActionIcon>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
