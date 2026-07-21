"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { candidates } from "@/data/dummyData";
import { loadEmployeesFromCSV } from "../../vismap/data/csvLoader";
import type { Employee as CsvEmployee } from "../../vismap/data/orgChartData";

interface TargetPosition {
  label: string;
  critical?: boolean;
  successorIds: string[];
  successorScoreOverride?: Record<string, number>;
  weights: { behavioral: number; performance: number; leadership: number; technical: number };
}

const CRITICAL_POSITIONS: TargetPosition[] = [
  { label: "CEO",                  critical: true, successorIds: ["c20","c13","c19","c2","c17"],
    successorScoreOverride: { c20: 55, c13: 52, c19: 48, c2: 44, c17: 41 },
    weights: { behavioral: 0.20, performance: 0.25, leadership: 0.45, technical: 0.10 } },
  { label: "Chief People Officer", critical: true, successorIds: ["c12","c4","c16","c8"],
    successorScoreOverride: { c12: 57, c4: 53, c16: 48, c8: 42 },
    weights: { behavioral: 0.40, performance: 0.25, leadership: 0.25, technical: 0.10 } },
  { label: "HR Operations Lead",   critical: true, successorIds: ["c4","c12","c16"],
    successorScoreOverride: { c4: 59, c12: 54, c16: 47 },
    weights: { behavioral: 0.40, performance: 0.25, leadership: 0.25, technical: 0.10 } },
  { label: "Product Manager Lead", critical: true, successorIds: ["c7","c17","c19","c5"],
    successorScoreOverride: { c7: 56, c17: 51, c19: 46, c5: 40 },
    weights: { behavioral: 0.20, performance: 0.30, leadership: 0.25, technical: 0.25 } },
  { label: "Research Lead",        critical: true, successorIds: ["c17","c6","c3","c11"],
    successorScoreOverride: { c17: 58, c6: 52, c3: 47, c11: 43 },
    weights: { behavioral: 0.15, performance: 0.25, leadership: 0.20, technical: 0.40 } },
];

const ALL_POSITIONS: TargetPosition[] = [
  { label: "Chief Technology Officer",   successorIds: ["c19","c17","c11","c3"],    weights: { behavioral: 0.15, performance: 0.30, leadership: 0.25, technical: 0.30 } },
  { label: "Chief Marketing Officer",    successorIds: ["c5","c14","c7","c20"],     weights: { behavioral: 0.25, performance: 0.35, leadership: 0.30, technical: 0.10 } },
  { label: "Chief Product Officer",      successorIds: ["c7","c17","c20","c13"],    weights: { behavioral: 0.20, performance: 0.30, leadership: 0.30, technical: 0.20 } },
  { label: "Product Manager",            successorIds: ["c5","c15","c7","c1"],      weights: { behavioral: 0.20, performance: 0.35, leadership: 0.20, technical: 0.25 } },
  { label: "Product Designer Lead",      successorIds: ["c6","c14","c5","c3"],      weights: { behavioral: 0.25, performance: 0.30, leadership: 0.20, technical: 0.25 } },
  { label: "Product Designer",           successorIds: ["c6","c3","c14","c15"],     weights: { behavioral: 0.25, performance: 0.30, leadership: 0.10, technical: 0.35 } },
  { label: "Frontend Lead",              successorIds: ["c3","c11","c19","c6"],     weights: { behavioral: 0.15, performance: 0.25, leadership: 0.20, technical: 0.40 } },
  { label: "Frontend Developer",         successorIds: ["c3","c11","c6","c15"],     weights: { behavioral: 0.15, performance: 0.20, leadership: 0.10, technical: 0.55 } },
  { label: "Backend Lead",               successorIds: ["c19","c11","c3","c17"],    weights: { behavioral: 0.15, performance: 0.25, leadership: 0.20, technical: 0.40 } },
  { label: "Backend Developer",          successorIds: ["c11","c3","c19","c6"],     weights: { behavioral: 0.15, performance: 0.20, leadership: 0.10, technical: 0.55 } },
  { label: "UX Researcher",              successorIds: ["c6","c14","c4","c15"],     weights: { behavioral: 0.30, performance: 0.25, leadership: 0.10, technical: 0.35 } },
  { label: "QA Lead",                    successorIds: ["c11","c3","c6","c15"],     weights: { behavioral: 0.20, performance: 0.25, leadership: 0.20, technical: 0.35 } },
  { label: "Sales Lead",                 successorIds: ["c5","c14","c1","c13"],     weights: { behavioral: 0.30, performance: 0.40, leadership: 0.20, technical: 0.10 } },
  { label: "Sales Executive",            successorIds: ["c5","c14","c15","c1"],     weights: { behavioral: 0.30, performance: 0.40, leadership: 0.15, technical: 0.15 } },
  { label: "Digital Marketing Lead",     successorIds: ["c14","c5","c6","c20"],     weights: { behavioral: 0.25, performance: 0.35, leadership: 0.25, technical: 0.15 } },
  { label: "Digital Marketing Specialist", successorIds: ["c14","c5","c15","c6"], weights: { behavioral: 0.25, performance: 0.35, leadership: 0.10, technical: 0.30 } },
  { label: "Partnership Lead",           successorIds: ["c7","c20","c13","c2"],     weights: { behavioral: 0.30, performance: 0.30, leadership: 0.30, technical: 0.10 } },
  { label: "Partnership Executive",      successorIds: ["c5","c14","c7","c15"],     weights: { behavioral: 0.30, performance: 0.35, leadership: 0.20, technical: 0.15 } },
  { label: "Recruiter",                  successorIds: ["c4","c12","c16","c8"],     weights: { behavioral: 0.45, performance: 0.25, leadership: 0.15, technical: 0.15 } },
  { label: "Recruitment Lead",           successorIds: ["c12","c4","c16","c8"],     weights: { behavioral: 0.40, performance: 0.25, leadership: 0.25, technical: 0.10 } },
  { label: "People Development Lead",    successorIds: ["c4","c12","c16","c20"],    weights: { behavioral: 0.40, performance: 0.25, leadership: 0.25, technical: 0.10 } },
  { label: "HR Staff",                   successorIds: ["c4","c12","c16"],          weights: { behavioral: 0.40, performance: 0.25, leadership: 0.15, technical: 0.20 } },
];

const ALL_FLAT = [...CRITICAL_POSITIONS, ...ALL_POSITIONS];

// Compute tags from CSV employee data (same logic as SimulationPanel)
function positionTags(emp: CsvEmployee, allEmployees: CsvEmployee[]) {
  const vacant = emp.name === '(Vacant)';
  const critical = !!emp.criticalPosition;
  const directReports = allEmployees.filter(e => e.managerId === emp.id);
  const hasReadySuccessors = directReports.some(r => (r.readinessScore ?? 0) >= 81);
  const risk = directReports.length > 0 && !hasReadySuccessors;
  return { critical, vacant, risk };
}

// Sort weight: Vacant=0, Risk=1, Critical=2, Others=3
function tagSortWeight(tags: { vacant?: boolean; risk?: boolean; critical?: boolean }): number {
  if (tags.vacant) return 0;
  if (tags.risk) return 1;
  if (tags.critical) return 2;
  return 3;
}

// Level of a target position label (for filtering candidates)
function getTargetLevel(label: string): number {
  const l = label.toLowerCase();
  if (l === 'ceo') return 1;
  if (l.startsWith('chief')) return 2;
  if (l.includes('lead') || l.includes('director')) return 3;
  return 4;
}

// Level of a candidate based on their position title
function getCandidateLevel(position: string): number {
  const p = position.toLowerCase();
  if (p.includes('direktur') || p.startsWith('vp ') || p === 'vp' || p.includes('kepala divisi')) return 2;
  if (p.includes('kepala') || p.includes('manajer') || p.includes('manager') || p.includes('lead') || p.includes('senior') || p.includes('controller') || p.includes('vp')) return 3;
  return 4;
}

function levelSectionLabel(level: number, targetLevel: number): string {
  if (level === targetLevel) return 'Same Level';
  return `L${level}`;
}

function ChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="#495057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TagBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ fontSize: 8, background: bg, color, borderRadius: 4, padding: '1px 5px', fontWeight: 700, flexShrink: 0 }}>
      {label}
    </span>
  );
}

export default function OverallScoreCard() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [open, setOpen]               = useState(false);
  const [search, setSearch]           = useState("");
  const [csvEmployees, setCsvEmployees] = useState<CsvEmployee[]>([]);
  const dropdownRef                   = useRef<HTMLDivElement>(null);

  const pos = ALL_FLAT[selectedIdx];

  useEffect(() => {
    loadEmployeesFromCSV().then(setCsvEmployees).catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Build sorted position list from CSV with tags
  const positionsWithTags = csvEmployees.map(emp => ({
    emp,
    tags: positionTags(emp, csvEmployees),
  }));

  const q = search.toLowerCase();
  const filteredPositions = positionsWithTags
    .filter(({ emp }) =>
      emp.position.toLowerCase().includes(q) || emp.name.toLowerCase().includes(q)
    )
    .sort((a, b) => tagSortWeight(a.tags) - tagSortWeight(b.tags));

  // Scoring logic (unchanged)
  const successorIds = new Set(pos.successorIds);
  const override = pos.successorScoreOverride ?? {};
  const scored = candidates.map(c => {
    const beh  = c.behavioral_score  ?? 0;
    const perf = c.performance_score ?? 0;
    const lead = c.leadership_score  ?? 0;
    const tech = c.technical_score   ?? 0;
    const match = Math.round(
      beh  * pos.weights.behavioral  +
      perf * pos.weights.performance +
      lead * pos.weights.leadership  +
      tech * pos.weights.technical
    );
    const incomplete = c.behavioral_score === null || c.performance_score === null;
    const finalMatch = override[c.id] !== undefined ? override[c.id] : match;
    return { ...c, match: finalMatch, incomplete };
  }).sort((a, b) => b.match - a.match);

  const targetLevel = getTargetLevel(pos.label);

  const successorCands = scored.filter(c => successorIds.has(c.id));
  const otherCands = scored.filter(c => !successorIds.has(c.id) && getCandidateLevel(c.position) >= targetLevel);

  // Group others by level
  const levelGroups = new Map<number, typeof otherCands>();
  otherCands.forEach(c => {
    const lvl = getCandidateLevel(c.position);
    if (!levelGroups.has(lvl)) levelGroups.set(lvl, []);
    levelGroups.get(lvl)!.push(c);
  });
  const sortedLevels = Array.from(levelGroups.keys()).sort((a, b) => a - b);

  const selectPos = (label: string) => {
    const idx = ALL_FLAT.findIndex(p => p.label === label);
    if (idx !== -1) setSelectedIdx(idx);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="bg-white rounded-[12px] p-[16px] w-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      {/* Header */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "#495057" }}>
            Position Fit Simulator
          </div>
        </div>

        {/* Posisi dropdown + vismap button sejajar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={() => { setOpen(v => !v); setSearch(""); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#fff", border: "1px solid #dee2e6",
              borderRadius: 9999, height: 32, padding: "0 12px",
              cursor: "pointer", fontSize: 10,
              fontFamily: "'Open Sans', sans-serif", color: "#495057",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#adb5bd", marginRight: 2 }}>Posisi:</span>
            <span style={{ fontWeight: 600, color: "#016699" }}>{pos.label}</span>
            {(() => {
              const csvEmp = csvEmployees.find(e => e.position === pos.label);
              const tags = csvEmp ? positionTags(csvEmp, csvEmployees) : { critical: pos.critical, vacant: false, risk: false };
              return (
                <>
                  {tags.vacant && <TagBadge label="Vacant" color="#6c757d" bg="rgba(108,117,125,0.12)" />}
                  {tags.risk && <TagBadge label="Risk" color="#f59e0b" bg="rgba(245,158,11,0.12)" />}
                  {tags.critical && <TagBadge label="Critical" color="#dc3545" bg="rgba(220,53,69,0.1)" />}
                </>
              );
            })()}
            <ChevronDown />
          </button>

          {open && (
            <div style={{
              position: "absolute", top: 36, left: 0, zIndex: 50,
              background: "#fff", border: "1px solid #dee2e6",
              borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              width: 240, overflow: "hidden",
            }}>
              {/* Search */}
              <div style={{ padding: "8px 10px", borderBottom: "1px solid #f0f0f0" }}>
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari posisi..."
                  style={{
                    width: "100%", border: "1px solid #dee2e6", borderRadius: 9999,
                    height: 28, padding: "0 10px", fontSize: 10,
                    fontFamily: "'Open Sans', sans-serif", color: "#495057",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              <div className="card-scroll" style={{ maxHeight: 240, overflowY: "auto" }}>
                {filteredPositions.length === 0 && (
                  <div style={{ padding: "12px 14px", fontSize: 10, color: "#adb5bd", fontFamily: "'Open Sans', sans-serif", textAlign: "center" }}>
                    Posisi tidak ditemukan
                  </div>
                )}
                {filteredPositions.map(({ emp, tags }) => (
                  <div
                    key={emp.id}
                    onMouseDown={() => selectPos(emp.position)}
                    style={{
                      padding: "8px 10px", cursor: "pointer",
                      borderBottom: "1px solid #f8f9fa",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6,
                      background: emp.position === pos.label ? "rgba(1,102,153,0.05)" : "transparent",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "#f8f9fa"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = emp.position === pos.label ? "rgba(1,102,153,0.05)" : "transparent"; }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "#495057", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {emp.position}
                      </div>
                      <div style={{ fontSize: 9, color: "#adb5bd", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {emp.name}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                      {tags.vacant && <TagBadge label="Vacant" color="#6c757d" bg="rgba(108,117,125,0.12)" />}
                      {tags.risk && <TagBadge label="Risk" color="#f59e0b" bg="rgba(245,158,11,0.12)" />}
                      {tags.critical && <TagBadge label="Critical" color="#dc3545" bg="rgba(220,53,69,0.1)" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

          {/* Vismap icon button sejajar dropdown */}
          <VismapButton positionLabel={pos.label} />
        </div>
      </div>

      {/* Candidate rows */}
      <div className="card-scroll" style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 360, overflowY: "auto" }}>

        {/* Successors section */}
        {successorCands.length > 0 && (
          <>
            <div style={{ fontSize: 9, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#016699", letterSpacing: "0.04em", textTransform: "uppercase", padding: "2px 2px 0" }}>
              Successors
            </div>
            {successorCands.map(c => <CandidateRow key={c.id} c={c} isSuccessor />)}
          </>
        )}

        {/* Level sections */}
        {sortedLevels.map(lvl => (
          <div key={lvl} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 9, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#adb5bd", letterSpacing: "0.04em", textTransform: "uppercase", padding: "2px 2px 0", borderTop: "1px solid #f0f0f0", paddingTop: 8, marginTop: 4 }}>
              {levelSectionLabel(lvl, targetLevel)}
            </div>
            {levelGroups.get(lvl)!.map(c => <CandidateRow key={c.id} c={c} />)}
          </div>
        ))}

        {successorCands.length === 0 && sortedLevels.length === 0 && (
          <div style={{ padding: "12px", textAlign: "center", fontSize: 10, color: "#adb5bd", fontFamily: "'Open Sans', sans-serif" }}>
            Tidak ada kandidat untuk posisi ini
          </div>
        )}
      </div>
    </div>
  );
}

function CandidateRow({ c, isSuccessor }: { c: { id: string; name: string; position: string; match: number; incomplete: boolean }; isSuccessor?: boolean }) {
  const recommended = c.match >= 70;
  const barColor = c.match >= 80 ? "#016699" : c.match >= 60 ? "#fd9f28" : "#adb5bd";
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 120px 100px", gap: 12,
      alignItems: "center", padding: "8px 10px", borderRadius: 8,
      background: isSuccessor ? "rgba(1,102,153,0.04)" : "#f8f9fa",
      border: isSuccessor ? "1px solid rgba(1,102,153,0.12)" : "none",
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Link href="/iprofile" style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#016699", textDecoration: "none", cursor: "pointer" }}>{c.name}</Link>
          {c.incomplete && <span style={{ fontSize: 9, color: "#fd9f28" }}>data tidak lengkap</span>}
        </div>
        <div style={{ fontSize: 9, fontFamily: "'Open Sans', sans-serif", color: "#adb5bd" }}>{c.position}</div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
          <span style={{ fontSize: 10, color: "#adb5bd", fontFamily: "'Open Sans', sans-serif" }}>Kecocokan</span>
          <span style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: barColor }}>{c.match}%</span>
        </div>
        <div style={{ height: 4, background: "#e0e0e0", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${c.match}%`, background: barColor, borderRadius: 2 }} />
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <span style={{
          fontSize: 10, padding: "3px 8px", borderRadius: 10, fontFamily: "'Open Sans', sans-serif",
          background: recommended ? "rgba(1,102,153,0.12)" : "rgba(173,181,189,0.15)",
          color: recommended ? "#016699" : "#6c757d",
        }}>
          {recommended ? "Disarankan" : "Perlu Evaluasi"}
        </span>
      </div>
    </div>
  );
}

function VismapButton({ positionLabel }: { positionLabel: string }) {
  const [hovered, setHovered] = useState(false);
  const href = `/vismap?simulate=true&targetPosition=${encodeURIComponent(positionLabel)}`;
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <Link
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 28, height: 28, borderRadius: 8,
          color: "#016699",
          background: hovered ? "rgba(1,102,153,0.16)" : "rgba(1,102,153,0.08)",
          border: "1px solid rgba(1,102,153,0.2)",
          textDecoration: "none", cursor: "pointer", flexShrink: 0,
          transition: "background 0.15s",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#016699" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="4" rx="1"/>
          <rect x="2" y="16" width="6" height="4" rx="1"/>
          <rect x="16" y="16" width="6" height="4" rx="1"/>
          <line x1="12" y1="6" x2="12" y2="12"/>
          <line x1="12" y1="12" x2="5" y2="12"/>
          <line x1="12" y1="12" x2="19" y2="12"/>
          <line x1="5" y1="12" x2="5" y2="16"/>
          <line x1="19" y1="12" x2="19" y2="16"/>
        </svg>
      </Link>
    </div>
  );
}
