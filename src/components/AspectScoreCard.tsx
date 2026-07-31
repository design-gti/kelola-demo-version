"use client";
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Paper, Select, Button, TextInput, Avatar, Checkbox as MantineCheckbox, Text } from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { store } from "@/data/model/store";
import type { ScoreKind } from "@/data/model/types";

// 6 UI aspects → canonical score kinds (single source of truth = store).
const ASPECTS: { label: string; kind: ScoreKind }[] = [
  { label: "Kreativitas",              kind: "behavioral" },
  { label: "Leadership",               kind: "leadership" },
  { label: "Kemampuan Membaca Akhlak", kind: "engagement" },
  { label: "Analytical Thinking",      kind: "technical" },
  { label: "Logika berpikir",          kind: "competency" },
  { label: "Problem Solving",          kind: "performance" },
];

// Score band thresholds (0–100): <70 Below, 70–84 Meet, ≥85 Exceed.
function band(score: number): "Below Standard" | "Meet Standard" | "Exceed Standard" {
  if (score < 70) return "Below Standard";
  if (score < 85) return "Meet Standard";
  return "Exceed Standard";
}

type AspectRow = { label: string; below: number; meet: number; exceed: number };
type BandData = Record<string, Record<string, Employee[]>>;

// Team options for the filter (id null = all teams).
const TEAM_OPTIONS = [{ id: null as string | null, name: "All Team" }, ...store.teams.map(t => ({ id: t.id, name: t.name }))];

// Compute per-aspect band counts + per-band member lists for a team (null = all).
function computeAspects(teamId: string | null): { aspects: AspectRow[]; data: BandData } {
  const parts = teamId ? store.membersOf(teamId) : store.participants;
  const aspects: AspectRow[] = [];
  const data: BandData = {};
  for (const a of ASPECTS) {
    const counts = { "Below Standard": 0, "Meet Standard": 0, "Exceed Standard": 0 };
    const lists: Record<string, Employee[]> = {};
    for (const p of parts) {
      const s = store.score(p.id, a.kind);
      if (s == null) continue;
      const b = band(s);
      counts[b]++;
      const pos = store.position(p.positionId);
      (lists[b] ??= []).push({ id: Number(p.id.replace(/\D/g, "")) || 0, name: p.name, position: pos?.title ?? "", dept: pos?.department ?? "" });
    }
    aspects.push({ label: a.label, below: counts["Below Standard"], meet: counts["Meet Standard"], exceed: counts["Exceed Standard"] });
    data[a.label] = lists;
  }
  return { aspects, data };
}

// Custom (manager) aspects only carry counts — sample real members proportionally so the modal still works.
function sampleBands(rows: AspectRow[]): BandData {
  const pool: Employee[] = store.participants.map(p => {
    const pos = store.position(p.positionId);
    return { id: Number(p.id.replace(/\D/g, "")) || 0, name: p.name, position: pos?.title ?? "", dept: pos?.department ?? "" };
  });
  const data: BandData = {};
  rows.forEach((a, i) => {
    const total = a.below + a.meet + a.exceed || 1;
    const belowN = Math.round((a.below / total) * pool.length);
    const exceedN = Math.round((a.exceed / total) * pool.length);
    const rot = [...pool.slice((i * 37) % pool.length), ...pool.slice(0, (i * 37) % pool.length)];
    data[a.label] = {
      "Below Standard": rot.slice(0, belowN),
      "Meet Standard": rot.slice(belowN, pool.length - exceedN),
      "Exceed Standard": rot.slice(pool.length - exceedN),
    };
  });
  return data;
}

function getColor(label: string) {
  if (label === "Below Standard")  return { bg: "#fff3cd", text: "#856404", dot: "#c1d8fc" };
  if (label === "Meet Standard")   return { bg: "#e7f5ff", text: "#0c6192", dot: "#68b1ff" };
  return                                   { bg: "#e6f4ea", text: "#1a7c3e", dot: "#016699" };
}

interface TooltipState { rowLabel: string; label: string; pct: number; x: number; y: number; }
interface Employee { id: number; name: string; position: string; dept: string; }
interface ModalState { rowLabel: string; label: string; employees: Employee[]; }

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
            <TextInput
              value={search}
              onChange={e => setSearch(e.currentTarget.value)}
              placeholder="Search employee..."
              radius="xl"
              size="xs"
              leftSection={<IconSearch size={12} />}
              style={{ flex: 1 }}
            />
            <span style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: "#6c757d", flexShrink: 0 }}>
              {filtered.length} employees
            </span>
            {selected.size > 1 && (
              <Button
                onClick={() => router.push('/idp?page=create-idp-admin.html')}
                color="primary"
                radius="xl"
                size="compact-sm"
                leftSection={<IconPlus size={11} />}
                style={{ flexShrink: 0 }}
              >
                Create IDP ({selected.size})
              </Button>
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
              <Avatar size={30} radius="xl" style={{ flexShrink: 0, background: "#e7f5ff" }}>
                <span style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#016699" }}>
                  {emp.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                </span>
              </Avatar>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#212529", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{emp.name}</div>
                <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 10, color: "#6c757d" }}>{emp.position} · {emp.dept}</div>
              </div>
              <Button
                onClick={e => { e.stopPropagation(); router.push('/idp?page=create-idp-admin.html'); }}
                variant="outline"
                color="primary"
                radius="xl"
                size="compact-xs"
                style={{ flexShrink: 0, whiteSpace: "nowrap" }}
              >
                Create IDP
              </Button>
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
    <MantineCheckbox
      checked={checked}
      indeterminate={indeterminate}
      readOnly
      color="primary"
      size="xs"
      radius={4}
      style={{ flexShrink: 0, pointerEvents: "none" }}
    />
  );
}

interface AspectScoreCardProps {
  title?: string;
  hideDeptFilter?: boolean;
  customAspects?: { label: string; below: number; meet: number; exceed: number }[];
}

export default function AspectScoreCard({ title = "Percentage of Aspect Score", hideDeptFilter, customAspects }: AspectScoreCardProps = {}) {
  const [teamId, setTeamId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  const { aspects: aspectData, data: employeeData } = useMemo(
    () => customAspects ? { aspects: customAspects, data: sampleBands(customAspects) } : computeAspects(teamId),
    [customAspects, teamId],
  );

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
    <Paper radius={8} p={16} w="100%" h="100%" style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <Text c="#495057" size="sm" fw={700} style={{ flex: 1, minWidth: 0, fontFamily: "'Open Sans', sans-serif" }}>
          {title}
        </Text>
        {!hideDeptFilter && (
          <Select
            data={TEAM_OPTIONS.map(t => t.name)}
            value={TEAM_OPTIONS.find(t => t.id === teamId)!.name}
            onChange={(name) => setTeamId(TEAM_OPTIONS.find(t => t.name === name)?.id ?? null)}
            radius="xl"
            size="xs"
            w={160}
            allowDeselect={false}
            comboboxProps={{ withinPortal: true }}
            style={{ flexShrink: 0 }}
          />
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
    </Paper>
  );
}
