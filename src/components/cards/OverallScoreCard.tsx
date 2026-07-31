"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Paper, Badge, Progress, TextInput } from "@mantine/core";
import { candidates } from "@/data/dummyData";
import { loadEmployeesFromCanonical } from "../../vismap/data/canonicalAdapter";
import type { Employee as CsvEmployee } from "../../vismap/data/orgChartData";

// ponytail: dropped hardcoded successorIds/scoreOverride (used dead "cNN" ids that never matched
// canonical "pNN"). Successors are now the top matches by computed score — always canonical-derived.
const SUCCESSOR_COUNT = 4;

type Weights = { behavioral: number; performance: number; leadership: number; technical: number };
const W = (behavioral: number, performance: number, leadership: number, technical: number): Weights =>
  ({ behavioral, performance, leadership, technical });

// Weight profile derived from a CANONICAL position title (dropdown positions vary per seed,
// so we key on the title's keywords instead of a fixed label table that never matches).
function weightsFor(label: string): Weights {
  const l = label.toLowerCase();
  if (l.includes("chief executive") || l === "ceo") return W(0.20, 0.25, 0.45, 0.10);
  if (l.includes("chief") || l.includes("director") || l.startsWith("vp") || l.includes("head of") || l.includes("president")) return W(0.20, 0.30, 0.30, 0.20);
  if (l.includes("hr") || l.includes("people") || l.includes("recruit") || l.includes("talent")) return W(0.40, 0.25, 0.25, 0.10);
  if (l.includes("sales") || l.includes("marketing") || l.includes("brand") || l.includes("growth")) return W(0.30, 0.40, 0.20, 0.10);
  if (l.includes("engineer") || l.includes("developer") || l.includes("technical") || l.includes("data") || l.includes("architect")) return W(0.15, 0.25, 0.20, 0.40);
  if (l.includes("finance") || l.includes("controller") || l.includes("account") || l.includes("analyst")) return W(0.15, 0.35, 0.20, 0.30);
  if (l.includes("lead") || l.includes("manager") || l.includes("principal") || l.includes("senior")) return W(0.20, 0.30, 0.30, 0.20);
  return W(0.25, 0.30, 0.25, 0.20);
}

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
  if (l === 'ceo' || l.includes('chief executive')) return 1;
  if (l.startsWith('chief') || l.startsWith('vp') || l.includes('director') || l.includes('head of')) return 2;
  if (l.includes('lead') || l.includes('manager') || l.includes('principal') || l.includes('senior')) return 3;
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
    <Badge
      variant="light"
      radius={4}
      style={{ fontSize: 8, background: bg, color, padding: "1px 5px", fontWeight: 700, flexShrink: 0, textTransform: "none", height: "auto", lineHeight: 1.4 }}
    >
      {label}
    </Badge>
  );
}

export default function OverallScoreCard() {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [open, setOpen]               = useState(false);
  const [search, setSearch]           = useState("");
  const [csvEmployees, setCsvEmployees] = useState<CsvEmployee[]>([]);
  const dropdownRef                   = useRef<HTMLDivElement>(null);

  // Default target = the canonical CEO-ish position (falls back to the first loaded one).
  const defaultLabel =
    csvEmployees.find(e => e.position.toLowerCase().includes("chief executive"))?.position ??
    csvEmployees[0]?.position ?? "CEO";
  const posLabel = selectedLabel ?? defaultLabel;
  const pos = { label: posLabel, weights: weightsFor(posLabel) };

  useEffect(() => {
    loadEmployeesFromCanonical().then(setCsvEmployees).catch(() => {});
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

  // Scoring logic — match computed from canonical scores × position weights
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
    return { ...c, match, incomplete };
  }).sort((a, b) => b.match - a.match);

  const targetLevel = getTargetLevel(pos.label);

  // Top matches become the successor shortlist; the rest are grouped by level.
  const successorCands = scored.slice(0, SUCCESSOR_COUNT);
  const successorIds = new Set(successorCands.map(c => c.id));
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
    setSelectedLabel(label);
    setOpen(false);
    setSearch("");
  };

  return (
    <Paper radius={12} p={16} w="100%" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
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
              const tags = csvEmp ? positionTags(csvEmp, csvEmployees) : { critical: false, vacant: false, risk: false };
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
                <TextInput
                  data-autofocus
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.currentTarget.value)}
                  placeholder="Cari posisi..."
                  radius="xl"
                  size="xs"
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
    </Paper>
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
          <Link href={`/iprofile?id=${c.id}`} style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: "#016699", textDecoration: "none", cursor: "pointer" }}>{c.name}</Link>
          {c.incomplete && <span style={{ fontSize: 9, color: "#fd9f28" }}>data tidak lengkap</span>}
        </div>
        <div style={{ fontSize: 9, fontFamily: "'Open Sans', sans-serif", color: "#adb5bd" }}>{c.position}</div>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
          <span style={{ fontSize: 10, color: "#adb5bd", fontFamily: "'Open Sans', sans-serif" }}>Kecocokan</span>
          <span style={{ fontSize: 10, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: barColor }}>{c.match}%</span>
        </div>
        <Progress value={c.match} size={4} radius={2} styles={{ section: { background: barColor } }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <Badge
          variant="light"
          radius="xl"
          style={{
            fontSize: 10, padding: "3px 8px", fontFamily: "'Open Sans', sans-serif", textTransform: "none", fontWeight: 400,
            background: recommended ? "rgba(1,102,153,0.12)" : "rgba(173,181,189,0.15)",
            color: recommended ? "#016699" : "#6c757d",
          }}
        >
          {recommended ? "Disarankan" : "Perlu Evaluasi"}
        </Badge>
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
