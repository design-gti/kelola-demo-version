"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { archetypeIconSrc, discProfile, predictionLabel, DISC_GUIDANCE, type Personality, type StructuralTeamRecommendation, type Team, type TeamArchetype, type TeamMember } from "@/data/teamsData";
import DiscRadar, { DISCTypes } from "@/components/team/DiscRadar";
import TeamTypeDetail from "@/components/team/TeamTypeDetail";
import AppBreadcrumb from "@/components/Breadcrumb";
import { matchesFuzzy } from "@/lib/data/textMatch";
import { ActionIcon, Button, Checkbox, Modal, TextInput, Tooltip } from "@talentlytica/prodigy";
// Prodigy ships no layout primitives, so Group (which its Button docs tell us to
// use for spacing instead of manual margins) comes straight from Mantine.
import { Group, Table, Tabs } from "@mantine/core";
import { IconFileSearch, IconSearch, IconSparkles } from "@tabler/icons-react";

/** How long the deep-link highlight (colored outline + auto-scroll) stays visible before fading — mirrors Vismap's OrgChartCard highlight timing. */
const HIGHLIGHT_DURATION_MS = 3000;

/** A team with its member/leader/average data already resolved server-side. */
export interface ResolvedTeam {
  team: Team;
  members: TeamMember[];
  leader: TeamMember | null;
  avg: { performance: number | null; engagement: number | null };
  /** DISC blend of this team's members → named team type. Null when the team has no members. */
  archetype: TeamArchetype | null;
}

const DISC_AXES: Personality[] = ["Driver", "Persuader", "Mediator", "Analyzer"];

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

/** Tab yang ditampilkan. "my" sengaja tidak diikutkan — lihat catatan di render tabs. */
const VISIBLE_TABS = ["all"] as const;

// ── helpers ──────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function Avatar({ name, size = 32, id }: { name: string; size?: number; id?: string }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "#e6f3f8", color: ACCENT, fontFamily: FONT, fontWeight: 700,
      fontSize: size * 0.36, display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
    }}>
      <span>{initials(name)}</span>
      {id && (
        <img
          src={`/avatars/photo_wc2026/${id}.png`}
          alt=""
          onError={(e) => { e.currentTarget.style.display = "none"; }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
        />
      )}
    </div>
  );
}

function matchBadge(pct: number) {
  if (pct >= 90) return { label: "HIGH", bg: "#28a745" };
  if (pct >= 70) return { label: "MID", bg: "#fd9f28" };
  return { label: "LOW", bg: "#dc3545" };
}

function Pill({ bg, color = "#fff", children }: { bg: string; color?: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: FONT, fontWeight: 700, color, background: bg,
      padding: "2px 8px", borderRadius: 9999, whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function TypeBadge({ type }: { type: ResolvedTeam["team"]["type"] }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: FONT, fontWeight: 700, letterSpacing: "0.5px",
      color: "#6c757d", textTransform: "uppercase",
    }}>
      {type}
    </span>
  );
}

/** One structural-team suggestion inside the "Rekomendasi Tim Struktural" modal. */
function RecommendationCard({ rec, checked, onToggle }: {
  rec: StructuralTeamRecommendation;
  checked: boolean;
  onToggle: () => void;
}) {
  const shownIds = rec.memberIds.slice(0, 4);
  const overflow = rec.memberIds.length - shownIds.length;
  return (
    <div style={{
      border: "1px solid #e9ecef", borderRadius: 12, padding: 16, background: "#fff",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <Checkbox
          checked={checked}
          onChange={onToggle}
          size="xs"
          label={<span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: ACCENT }}>{rec.name}</span>}
        />
        <TypeBadge type="STRUCTURAL" />
      </div>

      {rec.archetype && (
        <div style={{ background: "#f8f9fa", borderRadius: 8, padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <img src={archetypeIconSrc(rec.archetype.icon)} alt="" width={32} height={32} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#212529" }}>{rec.archetype.name}</div>
            <div style={{ fontSize: 11, color: "#6c757d", marginTop: 2 }}>{rec.archetype.traits}</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 11, color: "#adb5bd" }}>
          <span style={{ fontWeight: 700, color: "#495057" }}>{rec.leaderName}</span> + {rec.memberIds.length} members
        </span>
        <div style={{ display: "flex" }}>
          {shownIds.map((id, i) => (
            <div key={id} style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid #fff", borderRadius: "50%" }}>
              <Avatar name={rec.memberNames[i]} id={id} size={24} />
            </div>
          ))}
          {overflow > 0 && (
            <div style={{
              marginLeft: -8, width: 24, height: 24, borderRadius: "50%", border: "2px solid #fff",
              background: "#495057", color: "#fff", fontSize: 9, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              +{overflow}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── team card (All Teams grid) ───────────────────────────────────────────────
function TeamCard({ resolved, onOpen }: { resolved: ResolvedTeam; onOpen: () => void }) {
  const { team, members, archetype } = resolved;
  // Hover diurus lewat state, bukan :hover — style kartu ini inline semua.
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textAlign: "left", cursor: "pointer", width: "100%",
        border: `1px solid ${hovered ? "#cfe3ee" : "#e9ecef"}`,
        background: "#fff", borderRadius: 12, padding: 16,
        boxShadow: hovered ? "2px 6px 16px rgba(0,0,0,0.10)" : "2px 4px 10px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "box-shadow 0.15s, transform 0.15s, border-color 0.15s",
        fontFamily: FONT,
        display: "flex", flexDirection: "column", gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: ACCENT }}>{team.name}</span>
        <TypeBadge type={team.type} />
      </div>

      {/* Team type (DISC blend of the members), not the leader. */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8f9fa", borderRadius: 8, padding: "8px 10px" }}>
        {archetype ? (
          <>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#fff", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <img src={archetypeIconSrc(archetype.icon)} alt="" width={22} height={22} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#212529" }}>{archetype.name}</div>
              <div style={{ fontSize: 11, color: "#6c757d", marginTop: 2 }}>{archetype.traits}</div>
            </div>
          </>
        ) : (
          <>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#e9ecef", color: "#adb5bd", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
            }}>?</div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#adb5bd" }}>Tipe belum tersedia</span>
          </>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "#adb5bd" }}>{members.length} members</span>
        <div style={{ display: "flex" }}>
          {members.slice(0, 4).map((m, i) => (
            <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid #fff", borderRadius: "50%" }}>
              <Avatar name={m.name} id={m.id} size={24} />
            </div>
          ))}
          {members.length > 4 && (
            <div style={{
              marginLeft: -8, width: 24, height: 24, borderRadius: "50%", border: "2px solid #fff",
              background: "#495057", color: "#fff", fontSize: 9, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              +{members.length - 4}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// ── team detail (Overview) ───────────────────────────────────────────────────
/** Judul kolom tabel anggota; urutannya sama dengan urutan sel di MemberRow. */
const MEMBER_HEADERS = [
  "Member",
  "Position",
  "Personality",
  "Competency Match",
  "Prediction Competency",
  "Latest Performance",
  "Latest Engagement",
];

function MemberRow({ m, highlighted, rowRef }: { m: TeamMember; highlighted?: boolean; rowRef?: React.RefObject<HTMLTableRowElement | null> }) {
  const badge = matchBadge(m.competencyMatch);
  const prediction = predictionLabel(m.predictionScore);
  return (
    <Table.Tr
      ref={rowRef}
      // Sorotan deep-link dipasang sebagai latar saja — <tr> tidak bisa
      // membawa border-radius maupun box-shadow.
      style={highlighted ? { background: "#e6f3f8", transition: "background 0.3s" } : undefined}
    >
      <Table.Td>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <Avatar name={m.name} id={m.id} size={30} />
          <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</span>
        </div>
      </Table.Td>
      <Table.Td c="#6c757d">{m.position}</Table.Td>
      <Table.Td>{m.personality ?? <span style={{ color: "#ced4da" }}>N/A</span>}</Table.Td>
      <Table.Td>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {m.competencyMatch.toFixed(2)}%
          <Pill bg={badge.bg}>{badge.label}</Pill>
        </span>
      </Table.Td>
      <Table.Td>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {m.predictionScore.toFixed(2)}%
          <Pill bg={prediction.color}>{prediction.label.toUpperCase()}</Pill>
        </span>
      </Table.Td>
      <Table.Td>{m.latestPerformance != null ? m.latestPerformance : <span style={{ color: "#ced4da" }}>N/A</span>}</Table.Td>
      <Table.Td>{m.latestEngagement != null ? m.latestEngagement : <span style={{ color: "#ced4da" }}>N/A</span>}</Table.Td>
    </Table.Tr>
  );
}

function Accordion({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: "1px solid #e9ecef", borderRadius: 8, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={() => setOpen(v => !v)} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 8, background: "#fff",
        border: "none", cursor: "pointer", padding: "12px 14px", fontFamily: FONT,
        fontSize: 12, fontWeight: 700, color: "#495057",
      }}>
        <span style={{ color: ACCENT, display: "flex" }}>{icon}</span>
        <span style={{ flex: 1, textAlign: "left" }}>{title}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }}>
          <path d="M3 5l4 4 4-4" stroke="#adb5bd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.28s ease" }}>
        <div style={{ padding: "0 14px 14px", fontSize: 12, color: "#6c757d", lineHeight: 1.6, fontFamily: FONT }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const AXIS_TINT: Record<Personality, string> = {
  Driver: "#fff0f0", Persuader: "#fff8e6", Mediator: "#eef8f0", Analyzer: "#eef4f8",
};
const AXIS_COLOR: Record<Personality, string> = {
  Driver: "#dc3545", Persuader: "#fd9f28", Mediator: "#28a745", Analyzer: ACCENT,
};

function InteractionPanel({ members }: { members: TeamMember[] }) {
  const [selectedId, setSelectedId] = useState(members[0]?.id ?? "");
  const member = members.find(m => m.id === selectedId) ?? members[0];
  if (!member) return null;
  const scores = discProfile(member);
  const dominant = member.personality ?? "Driver";
  const g = DISC_GUIDANCE[dominant];

  return (
    <div style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
      {/* Left: guidance-for + DISC axis rows */}
      <div style={{ flex: "1 1 320px", minWidth: 300 }}>
        <div style={{ fontSize: 11, color: "#adb5bd", marginBottom: 6 }}>Guidance for</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={{
            flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid #e9ecef",
            fontFamily: FONT, fontSize: 12, color: "#495057", background: "#fff", cursor: "pointer",
          }}>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <Pill bg="#e6f3f8" color={ACCENT}>{dominant.toUpperCase()}</Pill>
        </div>
        {DISC_AXES.map(ax => (
          <div key={ax} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 14px", marginBottom: 4, borderRadius: 6,
            background: ax === dominant ? AXIS_TINT[ax] : "#f8f9fa",
            borderLeft: ax === dominant ? `3px solid ${AXIS_COLOR[ax]}` : "3px solid transparent",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: ax === dominant ? AXIS_COLOR[ax] : "#6c757d" }}>{ax}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#495057" }}>{scores[ax]}</span>
          </div>
        ))}
      </div>

      {/* Right: interaction guidance accordions */}
      <div style={{ flex: "1 1 380px", minWidth: 320 }}>
        <div style={{ fontSize: 11, color: "#adb5bd", marginBottom: 10 }}>Interact to</div>
        <Accordion defaultOpen title="What will happen in relationship?" icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        }>{g.relationship}</Accordion>
        <Accordion title="How to communicate effectively?" icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        }>{g.communicate}</Accordion>
        <Accordion title="What to avoid in communication?" icon={
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
        }>{g.avoid}</Accordion>
      </div>
    </div>
  );
}

function TeamDetail({
  resolved,
  onBack,
  initialTab = "overview",
  initialHighlight = null,
}: {
  resolved: ResolvedTeam;
  onBack: () => void;
  initialTab?: "overview" | "interaction";
  initialHighlight?: string | null;
}) {
  const { team, members, leader, avg, archetype } = resolved;
  const [typeOpen, setTypeOpen] = useState(false);
  // A highlight target only makes sense on the Overview member list — force
  // that tab regardless of initialTab when one is given.
  const [tab, setTab] = useState<"overview" | "interaction">(initialHighlight ? "overview" : initialTab);

  // Lazy initializer (computed once on mount), not an effect — deriving state
  // from a prop synchronously inside an effect body is a React lint error.
  const [highlightId, setHighlightId] = useState<string | null>(() =>
    initialHighlight ? members.find(m => m.id === initialHighlight || matchesFuzzy(m.name, initialHighlight))?.id ?? null : null
  );
  useEffect(() => {
    if (!highlightId) return;
    const timer = setTimeout(() => setHighlightId(null), HIGHLIGHT_DURATION_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fade whichever highlight resolved at mount; not meant to restart on every re-render
  }, []);

  // Baris kini <tr>, bukan <div> — tipe ref-nya ikut menyesuaikan.
  const highlightRowRef = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    if (!highlightId) return;
    highlightRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightId]);

  return (
    <div style={{ padding: "16px 16px 40px", fontFamily: FONT }}>
      <div style={{ marginBottom: 12 }}>
        <AppBreadcrumb
          noPadding
          items={[
            { label: "List Team", onClick: onBack },
            { label: "Team Profile" },
          ]}
        />
      </div>

      {/* Header card */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
        {/* DISC wheel (team-level, shown on both tabs) — ported from kelola-app */}
        <div style={{ flexShrink: 0, width: 236, paddingRight: 16, borderRight: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <DiscRadar
            size={220}
            dimmed
            horizontalText
            colors={["primary", "primary", "primary", "primary"]}
            datas={members.map(m => ({ name: m.name, DISC: m.disc as DISCTypes, photo: `/avatars/photo_wc2026/${m.id}.png` }))}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#495057" }}>{team.name}</span>
          <TypeBadge type={team.type} />
        </div>
        <div style={{ display: "flex", gap: 40, background: "#f8f9fa", borderRadius: 8, padding: "12px 16px", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: "#adb5bd", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Leader</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: leader ? "#495057" : "#adb5bd" }}>{leader ? leader.name : "-"}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#adb5bd", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Report to</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: team.reportTo ? "#495057" : "#adb5bd" }}>{team.reportTo ?? "-"}</div>
          </div>
        </div>
        {/* Team type — DISC blend of the members (see teamsData's ARCHETYPES). */}
        {archetype && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            background: "#f8f9fa", borderRadius: 8, padding: "12px 16px", marginBottom: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: "#fff", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img src={archetypeIconSrc(archetype.icon)} alt="" width={22} height={22} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#212529" }}>{archetype.name}</div>
                <div style={{ fontSize: 11, color: "#6c757d", marginTop: 2 }}>{archetype.traits}</div>
              </div>
            </div>
            <Tooltip label="Detail Tipe Team" withArrow>
              <ActionIcon
                variant="filled"
                radius="xl"
                size={32}
                aria-label="Detail Tipe Team"
                onClick={() => setTypeOpen(true)}
              >
                <IconFileSearch size={16} />
              </ActionIcon>
            </Tooltip>

            <Modal
              opened={typeOpen}
              onClose={() => setTypeOpen(false)}
              size="820px"
              title="Detail Tipe Team"
            >
              <TeamTypeDetail archetype={archetype} />
            </Modal>
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 8, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, color: "#adb5bd", fontWeight: 600 }}>Avg. Member&apos;s Performance</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: ACCENT }}>{avg.performance ?? 0}<span style={{ fontSize: 11, color: "#adb5bd", fontWeight: 400 }}> /{members.length} person</span></div>
          </div>
          <div style={{ flex: 1, background: "#f8f9fa", borderRadius: 8, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, color: "#adb5bd", fontWeight: 600 }}>Avg. Member&apos;s Engagement</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#fd9f28" }}>{avg.engagement ?? 0}<span style={{ fontSize: 11, color: "#adb5bd", fontWeight: 400 }}> /{members.length} person</span></div>
          </div>
        </div>
        </div>
        </div>
      </div>

      {/* Tabs + content */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
        {/* Tab memakai komponen design system; gayanya dari tema, lihat
            blok .mantine-Tabs-* di globals.css. */}
        <Tabs value={tab} onChange={(v) => setTab((v as "overview" | "interaction") ?? "overview")} mb={16}>
          <Tabs.List>
            <Tabs.Tab value="overview">Overview</Tabs.Tab>
            <Tabs.Tab value="interaction">Interaction</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {tab === "overview" ? (
          <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {MEMBER_HEADERS.map((h) => (
                  <Table.Th key={h}>{h}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {members.map(m => (
                <MemberRow
                  key={m.id}
                  m={m}
                  highlighted={m.id === highlightId}
                  rowRef={m.id === highlightId ? highlightRowRef : undefined}
                />
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <InteractionPanel members={members} />
        )}
      </div>
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function TeamProfileClient({
  resolvedTeams,
  initialSelectedTeamId,
  initialTab,
  initialHighlight,
  recommendations,
}: {
  resolvedTeams: ResolvedTeam[];
  initialSelectedTeamId: string | null;
  initialTab: "overview" | "interaction";
  initialHighlight: string | null;
  recommendations: StructuralTeamRecommendation[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"my" | "all">("all");
  const [selected, setSelected] = useState<ResolvedTeam | null>(
    initialSelectedTeamId ? resolvedTeams.find(rt => rt.team.id === initialSelectedTeamId) ?? null : null
  );
  const [query, setQuery] = useState("");
  const [recOpen, setRecOpen] = useState(false);
  const [pickedRecs, setPickedRecs] = useState<Set<string>>(new Set());
  /**
   * Tim hasil "Create Team" dari modal rekomendasi. Sengaja hanya state di memori
   * (kebutuhan demo): begitu browser di-refresh semuanya kembali ke semula — timnya
   * hilang dari daftar dan rekomendasinya muncul lagi.
   */
  const [createdTeams, setCreatedTeams] = useState<ResolvedTeam[]>([]);

  function toggleRec(leaderId: string) {
    setPickedRecs(prev => {
      const next = new Set(prev);
      if (next.has(leaderId)) next.delete(leaderId);
      else next.add(leaderId);
      return next;
    });
  }

  function createPickedTeams() {
    const picked = recommendations.filter(r => pickedRecs.has(r.leaderId));
    if (picked.length === 0) return;
    setCreatedTeams(prev => [
      ...prev,
      ...picked.map(r => ({ team: r.team, members: r.members, leader: r.leader, avg: r.avg, archetype: r.archetype })),
    ]);
    setPickedRecs(new Set());
    setRecOpen(false);
  }

  if (selected) {
    return (
      <TeamDetail
        resolved={selected}
        onBack={() => setSelected(null)}
        initialTab={initialTab}
        initialHighlight={initialHighlight}
      />
    );
  }

  const shown = [...resolvedTeams, ...createdTeams]
    .filter(rt => rt.team.name.toLowerCase().includes(query.toLowerCase()));
  // Rekomendasi yang sudah dibuat jadi tim tidak perlu ditawarkan lagi.
  const createdLeaderIds = new Set(createdTeams.map(rt => rt.team.leaderId));
  const openRecommendations = recommendations.filter(r => !createdLeaderIds.has(r.leaderId));

  return (
    <div style={{ fontFamily: FONT }}>
      <AppBreadcrumb items={[{ label: "Team Profile" }]} />
      <div style={{ padding: "12px 16px 40px" }}>
      {/* Tabs — "my" disembunyikan: belum ada pemetaan akun ke employee, jadi isinya
          selalu empty state. Masukkan kembali ke VISIBLE_TABS kalau sudah tersedia. */}
      <Tabs value={tab} onChange={(v) => setTab((v as "my" | "all") ?? "all")} mb={16}>
        <Tabs.List>
          {VISIBLE_TABS.map((t) => (
            <Tabs.Tab key={t} value={t}>
              All Teams
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {tab === "my" ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "80px 0", textAlign: "center" }}>
          <div style={{ fontSize: 28 }}>⚠️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#495057" }}>Your account not registered</div>
          <div style={{ fontSize: 12, color: "#adb5bd" }}>Your account not registered as employee for this corporate. Invite your email in employee page.</div>
        </div>
      ) : (
        <>
          <Group justify="space-between" gap={12} mb={16}>
            <TextInput
              value={query}
              onChange={e => setQuery(e.currentTarget.value)}
              placeholder="Search Team"
              radius="xl"
              size="xs"
              leftSection={<IconSearch size={14} />}
              style={{ width: 260, maxWidth: "100%" }}
            />
            <Group gap={16}>
              <Button
                variant="subtle"
                size="xs"
                radius="xl"
                rightSection={<IconSparkles size={14} />}
                onClick={() => setRecOpen(true)}
              >
                Recommended Team
              </Button>
              <Button variant="outline" size="xs" radius="xl" onClick={() => router.push("/team-profile/team-type")}>
                Team Type
              </Button>
              <Button size="xs" radius="xl" onClick={() => router.push("/team-profile/create")}>
                Create Team
              </Button>
            </Group>
          </Group>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {shown.map(rt => <TeamCard key={rt.team.id} resolved={rt} onOpen={() => setSelected(rt)} />)}
          </div>
          {shown.length === 0 && (
            <div style={{ padding: "60px 0", textAlign: "center", color: "#adb5bd", fontSize: 13 }}>Tidak ada tim yang cocok.</div>
          )}
        </>
      )}
      </div>

      {/* Structural team recommendations — derived from the Job & Position
          "position" → "report to" mapping that Visibility Map also draws. */}
      <Modal
        opened={recOpen}
        onClose={() => setRecOpen(false)}
        size="1100px"
        title="Rekomendasi Tim Struktural"
      >
        <div style={{ fontFamily: FONT }}>
          <p style={{ margin: "0 0 16px", fontSize: 12, color: "#6c757d" }}>
            Rekomendasi Tim ini dihasilkan dari Struktural yang sudah Anda mapping antara &ldquo;posisi&rdquo; dan &ldquo;report to&rdquo; di Job &amp; Position
          </p>

          {openRecommendations.length === 0 ? (
            <div style={{ padding: "48px 0", textAlign: "center", fontSize: 12, color: "#adb5bd", lineHeight: 1.7 }}>
              Belum ada rekomendasi tim baru.<br />
              Setiap atasan pada struktur Job &amp; Position sudah memimpin tim yang terdaftar.
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {openRecommendations.map(rec => (
                  <RecommendationCard
                    key={rec.leaderId}
                    rec={rec}
                    checked={pickedRecs.has(rec.leaderId)}
                    onToggle={() => toggleRec(rec.leaderId)}
                  />
                ))}
              </div>
              <Group justify="flex-end" mt={20}>
                <Button size="xs" radius="xl" disabled={pickedRecs.size === 0} onClick={createPickedTeams}>
                  Create Team
                </Button>
              </Group>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
