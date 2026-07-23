"use client";
import { useState } from "react";
import { teams, teamMembers, teamAverages, teamMember, discProfile, predictionLabel, DISC_GUIDANCE, Team, TeamMember, Personality } from "@/data/teamsData";
import DiscRadar, { DISCTypes } from "@/components/team/DiscRadar";
import AppBreadcrumb from "@/components/Breadcrumb";

const DISC_AXES: Personality[] = ["Driver", "Persuader", "Mediator", "Analyzer"];

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

// ── helpers ──────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "#e6f3f8", color: ACCENT, fontFamily: FONT, fontWeight: 700,
      fontSize: size * 0.36, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {initials(name)}
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

function TypeBadge({ type }: { type: Team["type"] }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: FONT, fontWeight: 700, letterSpacing: "0.5px",
      color: "#6c757d", textTransform: "uppercase",
    }}>
      {type}
    </span>
  );
}

// ── team card (All Teams grid) ───────────────────────────────────────────────
function TeamCard({ team, onOpen }: { team: Team; onOpen: () => void }) {
  const members = teamMembers(team);
  const leader = team.leaderId ? teamMember(team.leaderId) : null;
  return (
    <button
      onClick={onOpen}
      style={{
        textAlign: "left", cursor: "pointer", border: "1px solid #e9ecef",
        background: "#fff", borderRadius: 12, padding: 16, width: "100%",
        boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", fontFamily: FONT,
        display: "flex", flexDirection: "column", gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: ACCENT }}>{team.name}</span>
        <TypeBadge type={team.type} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8f9fa", borderRadius: 8, padding: "8px 10px" }}>
        {leader ? <Avatar name={leader.name} size={30} /> : (
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#e9ecef", color: "#adb5bd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>?</div>
        )}
        <span style={{ fontSize: 12, fontWeight: 600, color: leader ? "#495057" : "#adb5bd" }}>
          {leader ? leader.name : "[Unidentified]"}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "#adb5bd" }}>{members.length} members</span>
        <div style={{ display: "flex" }}>
          {members.slice(0, 4).map((m, i) => (
            <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid #fff", borderRadius: "50%" }}>
              <Avatar name={m.name} size={24} />
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
const COLS = "1.5fr 1.5fr 0.8fr 1.1fr 1.7fr 0.9fr 0.9fr";

function HeaderCell({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "center" }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: "#adb5bd", textTransform: "uppercase", letterSpacing: "0.3px", textAlign: align }}>
      {children}
    </span>
  );
}

function MemberRow({ m }: { m: TeamMember }) {
  const badge = matchBadge(m.competencyMatch);
  return (
    <div style={{
      display: "grid", gridTemplateColumns: COLS, alignItems: "center", gap: 12,
      padding: "12px 16px", borderBottom: "1px solid #f0f0f0", fontFamily: FONT, fontSize: 12, color: "#495057",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <Avatar name={m.name} size={30} />
        <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</span>
      </div>
      <span style={{ color: "#6c757d", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.position}</span>
      <span>{m.personality ?? <span style={{ color: "#ced4da" }}>N/A</span>}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {m.competencyMatch.toFixed(2)}%
        <Pill bg={badge.bg}>{badge.label}</Pill>
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {m.predictionScore.toFixed(2)}%
        {(() => { const p = predictionLabel(m.predictionScore); return <Pill bg={p.color}>{p.label.toUpperCase()}</Pill>; })()}
      </span>
      <span>{m.latestPerformance != null ? m.latestPerformance : <span style={{ color: "#ced4da" }}>N/A</span>}</span>
      <span>{m.latestEngagement != null ? m.latestEngagement : <span style={{ color: "#ced4da" }}>N/A</span>}</span>
    </div>
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

function TeamDetail({ team, onBack }: { team: Team; onBack: () => void }) {
  const [tab, setTab] = useState<"overview" | "interaction">("overview");
  const members = teamMembers(team);
  const leader = team.leaderId ? teamMember(team.leaderId) : null;
  const avg = teamAverages(team);

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
            datas={members.map(m => ({ name: m.name, DISC: m.disc as DISCTypes }))}
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
        <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #e9ecef", marginBottom: 16 }}>
          {(["overview", "interaction"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 600,
              padding: "0 0 10px", color: tab === t ? ACCENT : "#adb5bd",
              borderBottom: tab === t ? `2px solid ${ACCENT}` : "2px solid transparent",
            }}>
              {t === "overview" ? "Overview" : "Interaction"}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: COLS, gap: 12, padding: "0 16px 10px" }}>
              <HeaderCell>Member</HeaderCell>
              <HeaderCell>Position</HeaderCell>
              <HeaderCell>Personality</HeaderCell>
              <HeaderCell>Competency Match</HeaderCell>
              <HeaderCell>Prediction Competency</HeaderCell>
              <HeaderCell>Latest Performance</HeaderCell>
              <HeaderCell>Latest Engagement</HeaderCell>
            </div>
            {members.map(m => <MemberRow key={m.id} m={m} />)}
          </div>
        ) : (
          <InteractionPanel members={members} />
        )}
      </div>
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function TeamProfilePage() {
  const [tab, setTab] = useState<"my" | "all">("all");
  const [selected, setSelected] = useState<Team | null>(null);
  const [query, setQuery] = useState("");

  if (selected) return <TeamDetail team={selected} onBack={() => setSelected(null)} />;

  const shown = teams.filter(t => t.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ fontFamily: FONT }}>
      <AppBreadcrumb items={[{ label: "Team Profile" }]} />
      <div style={{ padding: "12px 16px 40px" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #e9ecef", marginBottom: 16 }}>
        {(["my", "all"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 600,
            padding: "0 0 10px", color: tab === t ? ACCENT : "#adb5bd",
            borderBottom: tab === t ? `2px solid ${ACCENT}` : "2px solid transparent",
          }}>
            {t === "my" ? "My Teams" : "All Teams"}
          </button>
        ))}
      </div>

      {tab === "my" ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "80px 0", textAlign: "center" }}>
          <div style={{ fontSize: 28 }}>⚠️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#495057" }}>Your account not registered</div>
          <div style={{ fontSize: 12, color: "#adb5bd" }}>Your account not registered as employee for this corporate. Invite your email in employee page.</div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search Team"
              style={{
                width: 260, maxWidth: "100%", padding: "8px 12px", borderRadius: 8,
                border: "1px solid #e9ecef", fontFamily: FONT, fontSize: 12, color: "#495057", outline: "none",
              }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {shown.map(t => <TeamCard key={t.id} team={t} onOpen={() => setSelected(t)} />)}
          </div>
          {shown.length === 0 && (
            <div style={{ padding: "60px 0", textAlign: "center", color: "#adb5bd", fontSize: 13 }}>Tidak ada tim yang cocok.</div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
