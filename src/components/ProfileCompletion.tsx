"use client";
import { useState } from "react";
import { Progress } from "@mantine/core";
import { candidates, Candidate } from "@/data/dummyData";
import TextButton from "@/components/ui/TextButton";

const FIELDS = [
  { key: "behavioral_score",  label: "Behavioral score"  },
  { key: "technical_score",   label: "Technical score"   },
  { key: "performance_score", label: "Performance score" },
  { key: "photo",             label: "Foto profil"       },
] as const;

const TODAY = new Date("2026-07-02");
const ONE_YEAR_AGO = new Date(TODAY);
ONE_YEAR_AGO.setFullYear(TODAY.getFullYear() - 1);

function isStale(date?: string) {
  if (!date) return false;
  return new Date(date) < ONE_YEAR_AGO;
}

interface GroupedEntry { fieldLabel: string; count: number; names: string[] }

function buildSections(pool: Candidate[]) {
  const noDataMap   = new Map<string, GroupedEntry>();
  const staleMap    = new Map<string, GroupedEntry>();

  pool.forEach(c => {
    FIELDS.forEach(({ key, label }) => {
      const val = c[key as keyof typeof c];
      const missing = val === null || val === undefined || val === false;

      if (missing) {
        const e = noDataMap.get(key) ?? { fieldLabel: label, count: 0, names: [] };
        e.count++; e.names.push(c.name);
        noDataMap.set(key, e);
      } else if (isStale(c.dataLastUpdated)) {
        const e = staleMap.get(key) ?? { fieldLabel: label, count: 0, names: [] };
        e.count++; e.names.push(c.name);
        staleMap.set(key, e);
      }
    });
  });

  return {
    noData: Array.from(noDataMap.values()),
    stale:  Array.from(staleMap.values()),
  };
}

function calcPct(pool: Candidate[]): number {
  if (pool.length === 0) return 0;
  const keys = FIELDS.map(f => f.key);
  const filled = pool.reduce((sum, c) => sum + keys.filter(k => {
    const v = c[k as keyof typeof c];
    return v !== null && v !== undefined && v !== false;
  }).length, 0);
  return Math.round((filled / (pool.length * keys.length)) * 100);
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{
      fontSize: 9, fontFamily: "'Open Sans', sans-serif", fontWeight: 700,
      color: "#adb5bd", textTransform: "uppercase", letterSpacing: "0.5px",
      padding: "4px 0 2px",
    }}>
      {children}
    </div>
  );
}

function AlertRow({ entry }: { entry: GroupedEntry }) {
  return (
    <div style={{ padding: "8px 10px", borderRadius: 8, background: "#f8f9fa" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#495057" }}>
          {entry.fieldLabel}
        </span>
        <span style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#6c757d" }}>
          {entry.count} org
        </span>
      </div>
      <div style={{ fontSize: 10, color: "#adb5bd", fontFamily: "Open Sans, sans-serif", marginTop: 3 }}>
        {entry.names.slice(0, 3).join(", ")}{entry.names.length > 3 ? ` +${entry.names.length - 3} lainnya` : ""}
      </div>
    </div>
  );
}

export default function ProfileCompletion({ employees }: { employees?: Candidate[] } = {}) {
  const [open, setOpen] = useState(false);
  const pool   = employees ?? candidates;
  const pct    = employees ? calcPct(pool) : 78;
  const { noData, stale } = buildSections(pool);

  return (
    <div className="bg-white w-full card-pulse-alert"
      style={{ borderRadius: open ? "8px 8px 12px 12px" : 8, overflow: "hidden" }}
    >
      {/* Header */}
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          padding: "0 16px", height: 40,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <p className="text-[#495057] text-[12px]"
          style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, margin: 0 }}>
          Profile Data Completion
        </p>
        <div className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[3px]">
            <Progress value={pct} color="primary" size={8} radius={4} w={71} />
            <span className="text-[#495057] text-[10px] whitespace-nowrap"
              style={{ fontFamily: "'Open Sans', sans-serif" }}>
              {pct}%
            </span>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
            style={{ transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
            <path d="M5 7.5l5 5 5-5" stroke="#495057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Accordion body */}
      <div style={{ maxHeight: open ? 600 : 0, overflow: "hidden", transition: "max-height 0.28s ease" }}>
        <div style={{ padding: "4px 16px 16px", borderTop: "1px solid #f0f0f0" }}>
          <div className="card-scroll" style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 300, overflowY: "auto" }}>

            {noData.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <SectionLabel>No Data</SectionLabel>
                  <TextButton onClick={() => { window.location.href = "/tdp-view?tab=table"; }}>
                    Lihat Semua
                  </TextButton>
                </div>
                {noData.map((e, i) => <AlertRow key={`nd-${i}`} entry={e} />)}
              </>
            )}

            {stale.length > 0 && (
              <>
                <SectionLabel>Data is not relevant enough</SectionLabel>
                {stale.map((e, i) => <AlertRow key={`st-${i}`} entry={e} />)}
              </>
            )}

            {noData.length === 0 && stale.length === 0 && (
              <div style={{ fontSize: 10, color: "#adb5bd", textAlign: "center", padding: "16px 0", fontFamily: "Open Sans, sans-serif" }}>
                Semua data lengkap dan relevan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
