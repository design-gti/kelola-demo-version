"use client";
import { useState } from "react";

const WEEKLY = {
  completionRate: { thisWeek: 82, lastWeek: 74 },
  trendChanges: [
    { name: "Jamal Musiala", direction: "up" as const, note: "Naik signifikan, konsisten 3 hari terakhir" },
    { name: "Phil Foden", direction: "down" as const, note: "Turun dibanding minggu lalu" },
  ],
  workload: { overload: ["Florian Wirtz"], available: ["Jude Bellingham", "Erling Haaland"] },
  checkins: { done: 3, total: 6, missed: ["Phil Foden", "Christian Pulisic", "Bukayo Saka"] },
  highlight: { name: "Jamal Musiala", reason: "Menyelesaikan 2 deliverable lebih cepat dari jadwal" },
  urgent: "Lakukan cek-in dengan Phil Foden — tren menurun sudah 2 minggu berturut-turut.",
};

const MONTHLY = {
  healthScore: { label: "Perlu Perhatian", value: 62, color: "#fd9f28" },
  ready: [{ name: "Jamal Musiala", note: "Performa konsisten naik, kapasitas masih tersedia" }],
  intervention: [{ name: "Phil Foden", note: "Perlu pelibatan HR atau program pengembangan khusus" }],
  skillGap: "Analytical thinking dan problem solving konsisten di bawah rata-rata tim selama 3 minggu.",
  recommendation: "Redistribusi beban kerja antara Florian Wirtz dan Jude Bellingham, dan jadwalkan sesi coaching untuk Phil Foden.",
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>
      <path d="M3 5l4 4 4-4" stroke="#adb5bd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Badge({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 9, fontFamily: "Open Sans, sans-serif", fontWeight: 600, color, background: bg, padding: "2px 7px", borderRadius: 9999, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
      <span style={{ fontSize: 9, fontFamily: "Open Sans, sans-serif", fontWeight: 700, color: "#adb5bd", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      <div style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#495057", lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

export default function TeamSummaryCard() {
  const [tab, setTab] = useState<"weekly" | "monthly">("weekly");
  const [open, setOpen] = useState(false);
  const w = WEEKLY;
  const m = MONTHLY;
  const delta = w.completionRate.thisWeek - w.completionRate.lastWeek;

  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057" }}>
          Ringkasan Tim
        </span>
        <div style={{ display: "flex", background: "#f1f3f5", borderRadius: 8, padding: 2, gap: 2 }}>
          {(["weekly", "monthly"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setOpen(false); }} style={{
              fontSize: 10, fontFamily: "Open Sans, sans-serif", fontWeight: 600,
              padding: "3px 10px", borderRadius: 6, border: "none", cursor: "pointer",
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#016699" : "#adb5bd",
              boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}>
              {t === "weekly" ? "Mingguan" : "Bulanan"}
            </button>
          ))}
        </div>
      </div>

      {tab === "weekly" ? (
        <>
          {/* Weekly snapshot */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Open Sans', sans-serif", color: "#016699" }}>
                {w.completionRate.thisWeek}%
              </div>
              <div style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#495057", fontWeight: 600, marginTop: 1 }}>Completion Rate</div>
              <div style={{ fontSize: 9, fontFamily: "Open Sans, sans-serif", color: delta >= 0 ? "#28a745" : "#dc3545", marginTop: 2 }}>
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs minggu lalu
              </div>
            </div>
            <div style={{ flex: 1, background: w.checkins.done < w.checkins.total / 2 ? "#fff8e6" : "#f8f9fa", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Open Sans', sans-serif", color: w.checkins.done < w.checkins.total / 2 ? "#fd9f28" : "#495057" }}>
                {w.checkins.done}/{w.checkins.total}
              </div>
              <div style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#495057", fontWeight: 600, marginTop: 1 }}>Sesi Check-in</div>
              <div style={{ fontSize: 9, fontFamily: "Open Sans, sans-serif", color: "#adb5bd", marginTop: 2 }}>minggu ini</div>
            </div>
          </div>

          {/* Urgent */}
          <div style={{ background: "#fff8e6", borderRadius: 8, padding: "8px 10px", marginBottom: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fd9f28" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#856404", lineHeight: 1.5 }}>
              {w.urgent}
            </span>
          </div>

          <button onClick={() => setOpen(v => !v)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "none", border: "none", cursor: "pointer", padding: "4px 0",
          }}>
            <span style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#016699", fontWeight: 600 }}>
              {open ? "Tutup detail" : "Lihat lebih lanjut"}
            </span>
            <ChevronIcon open={open} />
          </button>

          <div style={{ maxHeight: open ? 500 : 0, overflow: "hidden", transition: "max-height 0.28s ease" }}>
            <div style={{ paddingTop: 8 }}>
              <Row label="Perubahan Tren">
                {w.trendChanges.map(t => (
                  <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                    <Badge color={t.direction === "up" ? "#28a745" : "#dc3545"} bg={t.direction === "up" ? "#e9f7ef" : "#fff0f0"}>
                      {t.direction === "up" ? "▲" : "▼"} {t.name}
                    </Badge>
                    <span style={{ fontSize: 10, color: "#6c757d", fontFamily: "Open Sans, sans-serif" }}>{t.note}</span>
                  </div>
                ))}
              </Row>
              <Row label="Distribusi Beban">
                {w.workload.overload.length > 0 && (
                  <div style={{ marginBottom: 2 }}>
                    <span style={{ color: "#dc3545", fontWeight: 600 }}>Overload: </span>{w.workload.overload.join(", ")}
                  </div>
                )}
                {w.workload.available.length > 0 && (
                  <div>
                    <span style={{ color: "#28a745", fontWeight: 600 }}>Kapasitas tersedia: </span>{w.workload.available.join(", ")}
                  </div>
                )}
              </Row>
              <Row label="Belum Check-in">
                {w.checkins.missed.join(", ")}
              </Row>
              <Row label="Apresiasi Minggu Ini">
                <span style={{ fontWeight: 600 }}>{w.highlight.name}</span> — {w.highlight.reason}
              </Row>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Monthly snapshot */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, background: "#fff8e6", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Open Sans', sans-serif", color: m.healthScore.color }}>
                {m.healthScore.value}
              </div>
              <div style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#495057", fontWeight: 600, marginTop: 1 }}>Health Score Tim</div>
              <div style={{ marginTop: 4 }}>
                <Badge color="#856404" bg="#fff3cd">{m.healthScore.label}</Badge>
              </div>
            </div>
            <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Open Sans', sans-serif", color: "#28a745" }}>
                {m.ready.length}
              </div>
              <div style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#495057", fontWeight: 600, marginTop: 1 }}>Siap Naik Level</div>
              <div style={{ fontSize: 9, fontFamily: "Open Sans, sans-serif", color: "#28a745", marginTop: 2 }}>
                {m.ready.map(r => r.name).join(", ")}
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div style={{ background: "#e6f3f8", borderRadius: 8, padding: "8px 10px", marginBottom: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#016699" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#016699", lineHeight: 1.5 }}>
              {m.recommendation}
            </span>
          </div>

          <button onClick={() => setOpen(v => !v)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "none", border: "none", cursor: "pointer", padding: "4px 0",
          }}>
            <span style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#016699", fontWeight: 600 }}>
              {open ? "Tutup detail" : "Lihat lebih lanjut"}
            </span>
            <ChevronIcon open={open} />
          </button>

          <div style={{ maxHeight: open ? 500 : 0, overflow: "hidden", transition: "max-height 0.28s ease" }}>
            <div style={{ paddingTop: 8 }}>
              <Row label="Siap Naik Tanggung Jawab">
                {m.ready.map(r => (
                  <div key={r.name} style={{ marginBottom: 2 }}>
                    <span style={{ fontWeight: 600 }}>{r.name}</span> — {r.note}
                  </div>
                ))}
              </Row>
              <Row label="Perlu Intervensi">
                {m.intervention.map(r => (
                  <div key={r.name} style={{ marginBottom: 2 }}>
                    <span style={{ fontWeight: 600 }}>{r.name}</span> — {r.note}
                  </div>
                ))}
              </Row>
              <Row label="Gap Skill Tim">
                {m.skillGap}
              </Row>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
