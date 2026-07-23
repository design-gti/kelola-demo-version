"use client";
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { candidates } from "@/data/dummyData";

const aspects = [
  { label: "Kreativitas",              below: 0,   meet: 276, exceed: 63  },
  { label: "Leadership",               below: 166, meet: 109, exceed: 64  },
  { label: "Kemampuan Membaca Akhlak", below: 79,  meet: 176, exceed: 84  },
  { label: "Analytical Thinking",      below: 52,  meet: 152, exceed: 155 },
  { label: "Logika berpikir",          below: 100, meet: 159, exceed: 85  },
  { label: "Problem Solving",          below: 202, meet: 101, exceed: 36  },
];

// Employee pool = canonical candidates (single source of truth).
const POOL = candidates.map((c, i) => ({ id: i + 1, name: c.name, position: c.position, dept: c.department }));
const TOTAL_EMP = POOL.length;

function generateEmployee(seed: number): { id: number; name: string; position: string; dept: string } {
  return POOL[(seed - 1) % POOL.length];
}

// Build employee list per aspect per segment
function buildEmployeeData() {
  // One entry per canonical participant
  const allEmployees = Array.from({ length: TOTAL_EMP }, (_, i) => generateEmployee(i + 1));

  const result: Record<string, Record<string, typeof allEmployees>> = {};

  for (const a of aspects) {
    const total = a.below + a.meet + a.exceed || 339;
    const belowN  = Math.round((a.below  / total) * TOTAL_EMP);
    const exceedN = Math.round((a.exceed / total) * TOTAL_EMP);
    const meetN   = TOTAL_EMP - belowN - exceedN;

    // Each aspect shuffles the pool differently using a simple rotation
    const offset = aspects.indexOf(a) * 37;
    const rotated = [...allEmployees.slice(offset % TOTAL_EMP), ...allEmployees.slice(0, offset % TOTAL_EMP)];

    result[a.label] = {};
    if (belowN > 0)  result[a.label]["Below Standard"]  = rotated.slice(0, belowN);
    if (meetN > 0)   result[a.label]["Meet Standard"]   = rotated.slice(belowN, belowN + meetN);
    if (exceedN > 0) result[a.label]["Exceed Standard"] = rotated.slice(belowN + meetN, belowN + meetN + exceedN);
  }
  return result;
}

const employeeData = buildEmployeeData();

function getColor(label: string) {
  if (label === "Below Standard")  return { bg: "#fff3cd", text: "#856404", dot: "#c1d8fc" };
  if (label === "Meet Standard")   return { bg: "#e7f5ff", text: "#0c6192", dot: "#68b1ff" };
  return                                   { bg: "#e6f4ea", text: "#1a7c3e", dot: "#016699" };
}

interface TooltipState { rowLabel: string; label: string; pct: number; x: number; y: number; }
interface Employee { id: number; name: string; position: string; dept: string; }
interface ModalState { rowLabel: string; label: string; employees: Employee[]; }

function ChevronDown({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 6l4 4 4-4" stroke="#495057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface BarSegmentProps {
  pct: number; background: string; label: string; rowLabel: string;
  onEnter: (rowLabel: string, label: string, pct: number, e: React.MouseEvent) => void;
  onLeave: () => void;
  onClick: (rowLabel: string, label: string) => void;
}

function BarSegment({ pct, background, label, rowLabel, onEnter, onLeave, onClick }: BarSegmentProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="h-full rounded-sm"
      style={{ width: `${pct}%`, background, transition: "filter 0.15s, transform 0.15s", filter: hovered ? "brightness(1.15)" : "brightness(1)", transform: hovered ? "scaleY(1.5)" : "scaleY(1)", transformOrigin: "center", cursor: "pointer" }}
      onMouseEnter={e => { setHovered(true); onEnter(rowLabel, label, pct, e); }}
      onMouseLeave={() => { setHovered(false); onLeave(); }}
      onClick={() => onClick(rowLabel, label)}
    />
  );
}

function IDPModal({ modal, onClose }: { modal: ModalState; onClose: () => void }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const color = getColor(modal.label);

  const filtered = useMemo(() =>
    modal.employees.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase()) ||
      e.dept.toLowerCase().includes(search.toLowerCase())
    ), [modal.employees, search]);

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(e => e.id)));
  };

  const toggle = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const allSelected = filtered.length > 0 && filtered.every(e => selected.has(e.id));
  const someSelected = filtered.some(e => selected.has(e.id)) && !allSelected;

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#fff", borderRadius: 12, width: 520, maxWidth: "92vw", maxHeight: "82vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid #e9ecef" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#212529", marginBottom: 6 }}>{modal.rowLabel}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: color.bg, borderRadius: 20, padding: "3px 10px" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color.dot }} />
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, fontWeight: 600, color: color.text }}>{modal.label}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#adb5bd" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
          {/* Search + bulk button row */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#adb5bd" }}>
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search employee..."
                style={{ width: "100%", paddingLeft: 28, paddingRight: 10, height: 32, borderRadius: 9999, border: "1px solid #dee2e6", fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: "#495057", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: "#6c757d", flexShrink: 0 }}>
              {filtered.length} employees
            </span>
            {selected.size > 1 && (
              <button
                onClick={() => router.push('/idp?page=create-idp-admin.html')}
                style={{ background: "#016699", color: "#fff", border: "none", borderRadius: 9999, padding: "6px 14px", fontFamily: "'Open Sans', sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                Create IDP ({selected.size})
              </button>
            )}
          </div>
        </div>

        {/* Select all */}
        <div style={{ padding: "10px 20px", borderBottom: "1px solid #f1f3f5", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={toggleAll}>
          <Checkbox checked={allSelected} indeterminate={someSelected} />
          <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: "#495057", fontWeight: 600 }}>Select all</span>
        </div>

        {/* Employee list */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {filtered.length === 0 && (
            <div style={{ padding: "24px 0", textAlign: "center", fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: "#adb5bd" }}>No employees found</div>
          )}
          {filtered.map(emp => (
            <div
              key={emp.id}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 20px", cursor: "pointer", background: selected.has(emp.id) ? "#f0f9ff" : "transparent", borderBottom: "1px solid #f8f9fa" }}
              onClick={() => toggle(emp.id)}
            >
              <Checkbox checked={selected.has(emp.id)} />
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#e7f5ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#016699" }}>
                {emp.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#212529", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{emp.name}</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 10, color: "#6c757d" }}>{emp.position} · {emp.dept}</div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); router.push('/idp?page=create-idp-admin.html'); }}
                style={{ background: "none", border: "1px solid #016699", borderRadius: 9999, padding: "4px 12px", fontFamily: "'Open Sans', sans-serif", fontSize: 10, fontWeight: 700, color: "#016699", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
              >
                Create IDP
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

function Checkbox({ checked, indeterminate }: { checked: boolean; indeterminate?: boolean }) {
  return (
    <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${checked || indeterminate ? "#016699" : "#dee2e6"}`, background: checked ? "#016699" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )}
      {indeterminate && !checked && (
        <div style={{ width: 8, height: 2, background: "#016699", borderRadius: 1 }} />
      )}
    </div>
  );
}

interface AspectScoreCardProps {
  title?: string;
  hideDeptFilter?: boolean;
  customAspects?: { label: string; below: number; meet: number; exceed: number }[];
}

export default function AspectScoreCard({ title = "Percentage of Aspect Score", hideDeptFilter, customAspects }: AspectScoreCardProps = {}) {
  const aspectData = customAspects ?? aspects;
  const totalEmp = customAspects ? customAspects[0].below + customAspects[0].meet + customAspects[0].exceed : TOTAL_EMP;
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  const showTooltip = (rowLabel: string, label: string, pct: number, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const parent = (e.target as HTMLElement).closest(".aspect-bar-wrap");
    const parentRect = parent?.getBoundingClientRect();
    setTooltip({ rowLabel, label, pct: Math.round(pct), x: rect.left + rect.width / 2 - (parentRect?.left ?? 0), y: -22 });
  };

  const openModal = (rowLabel: string, label: string) => {
    const employees = employeeData[rowLabel]?.[label] ?? [];
    setModal({ rowLabel, label, employees });
  };

  return (
    <div className="bg-white rounded-[8px] p-[16px] flex flex-col gap-[8px] w-full h-full" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[#495057] text-[12px] flex-1 min-w-0" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700 }}>
          {title}
        </p>
        {!hideDeptFilter && (
          <div className="bg-white flex items-center gap-[8px] px-[12px] flex-shrink-0 w-[141px]" style={{ borderRadius: 9999, height: 32, border: "1px solid #dee2e6" }}>
            <span className="flex-1 text-[#495057] text-[12px] truncate" style={{ fontFamily: "'Open Sans', sans-serif" }}>All Department</span>
            <ChevronDown size={16} />
          </div>
        )}
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-[12px]">
        {aspectData.map((a) => {
          const total = a.below + a.meet + a.exceed || 339;
          const belowPct  = (a.below  / total) * 100;
          const meetPct   = (a.meet   / total) * 100;
          const exceedPct = (a.exceed / total) * 100;
          return (
            <div key={a.label} className="flex flex-col gap-[2px]">
              <span className="text-[#495057] text-[10px]" style={{ fontFamily: "'Open Sans', sans-serif" }}>{a.label}</span>
              <div className="aspect-bar-wrap relative flex h-[6px] gap-[4px] w-full" style={{ overflow: "visible" }}>
                {belowPct > 0 && (
                  <BarSegment pct={belowPct} background="linear-gradient(to right, #e8f1ff, #c1d8fc)" label="Below Standard" rowLabel={a.label} onEnter={showTooltip} onLeave={() => setTooltip(null)} onClick={openModal} />
                )}
                {meetPct > 0 && (
                  <BarSegment pct={meetPct} background="linear-gradient(to right, #aaceff, #68b1ff)" label="Meet Standard" rowLabel={a.label} onEnter={showTooltip} onLeave={() => setTooltip(null)} onClick={openModal} />
                )}
                {exceedPct > 0 && (
                  <BarSegment pct={exceedPct} background="linear-gradient(to right, #5baae2, #016699)" label="Exceed Standard" rowLabel={a.label} onEnter={showTooltip} onLeave={() => setTooltip(null)} onClick={openModal} />
                )}
                {tooltip && tooltip.rowLabel === a.label && (
                  <div style={{ position: "absolute", left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)", background: "#333", color: "#fff", fontSize: 10, fontFamily: "'Open Sans', sans-serif", padding: "3px 7px", borderRadius: 4, whiteSpace: "nowrap", pointerEvents: "none", zIndex: 20, boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
                    {tooltip.label} · {tooltip.pct}%
                    <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "4px solid #333" }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis */}
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="w-px h-[6px] bg-[#adb5bd]" />
          <div className="flex-1 h-px bg-[#adb5bd]" />
          <div className="w-px h-[6px] bg-[#adb5bd]" />
        </div>
        <div className="flex items-center justify-between text-[#adb5bd] text-[10px]" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          <span>0%</span><span>100%</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-[16px] gap-y-[8px] items-center">
        {[{ color: "#c1d8fc", label: "Below Standard" }, { color: "#68b1ff", label: "Meet Standard" }, { color: "#016699", label: "Exceed Standard" }].map((l) => (
          <div key={l.label} className="flex items-center gap-[4px]">
            <div className="w-[12px] h-[12px] rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
            <span className="text-[#495057] text-[10px] whitespace-nowrap" style={{ fontFamily: "'Open Sans', sans-serif" }}>{l.label}</span>
          </div>
        ))}
      </div>

      {modal && <IDPModal modal={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
