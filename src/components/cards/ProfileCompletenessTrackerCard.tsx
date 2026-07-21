"use client";
import { candidates, Candidate } from "@/data/dummyData";
import TextButton from "@/components/ui/TextButton";

const FIELDS = [
  { key: "photo", label: "Foto" },
  { key: "behavioral_score", label: "Behavioral" },
  { key: "technical_score", label: "Technical" },
  { key: "performance_score", label: "Performance" },
  { key: "hasIDP", label: "IDP" },
  { key: "hasHRIS", label: "HRIS" },
] as const;

export default function ProfileCompletenessTrackerCard({ title = "Profile Completeness Tracker", employees }: { title?: string; employees?: Candidate[] } = {}) {
  const pool = employees ?? candidates;

  const scored = pool.map(c => {
    const filledCount = FIELDS.filter(f => {
      const val = c[f.key as keyof typeof c];
      return val !== null && val !== false;
    }).length;
    const pct = Math.round((filledCount / FIELDS.length) * 100);
    const missing = FIELDS.filter(f => {
      const val = c[f.key as keyof typeof c];
      return val === null || val === false;
    }).map(f => f.label);
    return { ...c, pct, missing };
  }).sort((a, b) => a.pct - b.pct);

  const toShow = scored.filter(c => c.pct < 100);

  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057" }}>
          {title}
        </span>
        <TextButton onClick={() => window.open("/tdp", "_blank")}>
          Lihat Semua
        </TextButton>
      </div>
      <div className="card-scroll" style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 360, overflowY: "auto" }}>
        {toShow.map(c => (
          <div key={c.id}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <div>
                <span style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#495057" }}>{c.name}</span>
                <span style={{ fontSize: 10, fontFamily: "Open Sans, sans-serif", color: "#adb5bd", marginLeft: 6 }}>{c.position}</span>
              </div>
              <span style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: c.pct < 50 ? "#dc3545" : c.pct < 100 ? "#fd9f28" : "#28a745" }}>{c.pct}%</span>
            </div>
            <div style={{ height: 4, background: "#f0f0f0", borderRadius: 2, marginBottom: 4 }}>
              <div style={{ height: "100%", width: `${c.pct}%`, background: c.pct < 50 ? "#dc3545" : c.pct < 100 ? "#fd9f28" : "#28a745", borderRadius: 2 }} />
            </div>
            {c.missing.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {c.missing.map(m => (
                  <span key={m} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "#f0f0f0", color: "#adb5bd", fontFamily: "Open Sans, sans-serif" }}>{m}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {toShow.length === 0 && (
          <div style={{ fontSize: 10, color: "#adb5bd", fontFamily: "Open Sans, sans-serif", textAlign: "center", padding: "20px 0" }}>
            Semua profil lengkap
          </div>
        )}
      </div>
    </div>
  );
}
