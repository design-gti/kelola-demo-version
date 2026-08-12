"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionIcon, Paper, Badge, Avatar as MantineAvatar, Select, Pagination, Table, Text, Button, Modal, Checkbox, ScrollArea, Tabs } from "@mantine/core";
import { IconArrowUpRight, IconSettings, IconFilter } from "@tabler/icons-react";
import AppBreadcrumb from "@/components/Breadcrumb";
import TMTRBox from "@/components/talent/TMTRBox";
import DonutChart from "@/components/talent/DonutChart";
import { matchesFuzzy } from "@/lib/data/textMatch";
import { donutTags, boxByOrder, resolveColor, TMConfig, TMPoint } from "@/data/talentMappingShared";

/** How long the deep-link highlight (colored outline + auto-scroll) stays visible before fading — mirrors Vismap's OrgChartCard highlight timing. */
const HIGHLIGHT_DURATION_MS = 3000;

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
}
function darker(token: string) {
  const shades: Record<string, string> = { error: "#DE350B", secondary: "#F28700", primary: "#016699", success: "#00875A", neutral: "#868E96" };
  return shades[token.split(".")[0]] ?? "#495057";
}

function OutlinePill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <Badge
      variant="outline"
      radius="xl"
      style={{ fontSize: 9, fontFamily: FONT, color, borderColor: color, background: "#fff", whiteSpace: "nowrap" }}
    >
      {children}
    </Badge>
  );
}

function Avatar({ name, employeeId }: { name: string; employeeId?: string }) {
  return (
    <MantineAvatar
      radius="xl"
      size={28}
      src={employeeId ? `/avatars/photo_wc2026/${employeeId}.png` : null}
      style={{ flexShrink: 0, background: "#e6f3f8" }}
    >
      <span style={{ color: ACCENT, fontFamily: FONT, fontWeight: 700, fontSize: 10 }}>{initials(name)}</span>
    </MantineAvatar>
  );
}

/** Judul kolom per mode; urutannya sama dengan urutan sel di badan tabel. */
const TI_HEADERS = ["Position", "Employee", "Performance (X)", "Potency (Y)", "Box Category", "HAV status", "Action"];
const TR_HEADERS = ["Employee", "Position", "Competency (X)%", "Potency (Y)", "Box Category", "Readiness", "Action"];

function Cell({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: muted ? "#ced4da" : "#495057" }}>{children}</span>;
}

function TablePanel({ config, points, highlightId, emptyMessage = "No data." }: { config: TMConfig; points: TMPoint[]; highlightId?: string | null; emptyMessage?: string }) {
  const router = useRouter();
  const isTI = config.id === "TI";
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(points.length / limit));
  // Derived, not stateful: while a highlight is active, force whichever page
  // actually contains it — otherwise a deep link to someone past the first
  // page's `limit` rows would never scroll into view. Falls back to normal
  // pagination once the highlight clears (or never matched anyone).
  const highlightGlobalIndex = highlightId ? points.findIndex(p => p.employeeId === highlightId) : -1;
  const curPage = highlightGlobalIndex !== -1 ? Math.floor(highlightGlobalIndex / limit) + 1 : Math.min(page, pageCount);
  const pageRows = points.slice((curPage - 1) * limit, curPage * limit);
  // curPage clamps to pageCount, so a shrinking filter can't strand you on an empty page

  const highlightIndex = highlightId ? pageRows.findIndex(p => p.employeeId === highlightId) : -1;
  // Baris kini <tr>, bukan <div> — tipe ref-nya ikut menyesuaikan.
  const rowRef = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    if (highlightIndex === -1) return;
    rowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightIndex]);

  return (
    <Paper radius={12} style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", padding: "16px 8px", fontFamily: FONT, fontSize: 12 }}>
      <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {(isTI ? TI_HEADERS : TR_HEADERS).map((h) => (
              <Table.Th key={h}>{h}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {pageRows.map((p, i) => {
            const box = boxByOrder(config, p.order);
            const boxColor = box ? darker(box.color) : "#adb5bd";
            const isHighlighted = i === highlightIndex;
            const openProfile = () => router.push(`/iprofile?id=${encodeURIComponent(p.employeeId)}&from=talent-mapping`);
            const person = (
              <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <Avatar name={p.name} employeeId={p.employeeId} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
              </span>
            );
            const action = (
              <ActionIcon variant="subtle" color="primary" onClick={openProfile} aria-label={`Buka iProfile ${p.name}`}>
                <IconArrowUpRight size={16} />
              </ActionIcon>
            );
            return (
              <Table.Tr
                key={p.employeeId}
                ref={isHighlighted ? rowRef : undefined}
                // Sorotan deep-link: kotaknya dipasang di sel, bukan baris —
                // <tr> tidak bisa membawa border-radius maupun box-shadow.
                style={isHighlighted ? { background: "#e6f3f8", transition: "background 0.3s" } : undefined}
              >
                {isTI ? (
                  <>
                    <Table.Td>
                      <Cell>{p.positionTitle}</Cell>
                    </Table.Td>
                    <Table.Td>{person}</Table.Td>
                    <Table.Td>
                      <Cell muted={p.rawX == null}>{p.rawX ?? "{No data}"}</Cell>
                    </Table.Td>
                    <Table.Td>
                      <Cell muted={p.rawY == null}>{p.rawY ?? "{No data}"}</Cell>
                    </Table.Td>
                    <Table.Td>{box ? <OutlinePill color={boxColor}>{box.label}</OutlinePill> : <Cell muted>-</Cell>}</Table.Td>
                    <Table.Td>
                      {box?.tag === "talent" ? <OutlinePill color="#00875A">Talent</OutlinePill> : <OutlinePill color="#F28700">Non Talent</OutlinePill>}
                    </Table.Td>
                    <Table.Td>{action}</Table.Td>
                  </>
                ) : (
                  <>
                    <Table.Td>{person}</Table.Td>
                    <Table.Td>
                      <Cell>{p.positionTitle}</Cell>
                    </Table.Td>
                    <Table.Td>
                      <Cell muted={p.rawX == null}>{p.rawX != null ? `${p.rawX}%` : "{No data}"}</Cell>
                    </Table.Td>
                    <Table.Td>
                      <Cell muted={p.rawY == null}>{p.rawY ?? "{No data}"}</Cell>
                    </Table.Td>
                    <Table.Td>{box ? <OutlinePill color={boxColor}>{box.label}</OutlinePill> : <Cell muted>-</Cell>}</Table.Td>
                    <Table.Td>
                      <Cell muted={!box?.readiness}>{box?.readiness || "{No data}"}</Cell>
                    </Table.Td>
                    <Table.Td>{action}</Table.Td>
                  </>
                )}
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      {points.length === 0 && (
        <Text ta="center" py={40} c="#adb5bd">
          {emptyMessage}
        </Text>
      )}

      {points.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 12px 4px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6c757d" }}>
            <Text size="sm" c="#6c757d">Limit :</Text>
            <Select
              data={["10", "25", "50"]}
              value={String(limit)}
              onChange={(v) => { if (v) { setLimit(Number(v)); setPage(1); } }}
              radius="xl"
              size="xs"
              w={72}
              allowDeselect={false}
              comboboxProps={{ withinPortal: true }}
            />
          </div>
          <Pagination value={curPage} onChange={setPage} total={pageCount} color="primary" radius="xl" size="sm" />
          <Text c="#adb5bd" ml="auto">Total Data : {points.length}</Text>
        </div>
      )}
    </Paper>
  );
}

function Panel({
  config,
  points,
  jobTargets = [],
  trByTarget = {},
  initialBox = null,
  initialHighlight = null,
  onSettings,
}: {
  config: TMConfig;
  points: TMPoint[];
  jobTargets?: { id: string; title: string }[];
  trByTarget?: Record<string, TMPoint[]>;
  initialBox?: number | null;
  initialHighlight?: string | null;
  onSettings?: () => void;
}) {
  const isTR = config.id === "TR";
  // TR: employees are benchmarked against the picked Job Target. Empty until picked.
  const [jobTarget, setJobTarget] = useState<string | null>(null);
  const basePoints = useMemo(
    () => (isTR ? (jobTarget ? trByTarget[jobTarget] ?? [] : []) : points),
    [isTR, jobTarget, trByTarget, points],
  );
  // Deep-link highlight: resolve the name/id once against the initial data
  // (lazy useState initializers, computed only on mount — not an effect,
  // since deriving state from a prop synchronously in an effect body is a
  // React anti-pattern/lint error). Auto-selects that employee's box so the
  // row is actually visible; the highlight itself fades after a few seconds
  // via the timer effect below — same convention as Vismap's OrgChartCard
  // highlight ring.
  const resolveHighlightMatch = () =>
    initialHighlight ? basePoints.find(p => p.employeeId === initialHighlight || matchesFuzzy(p.name, initialHighlight)) : undefined;
  const [selectedBox, setSelectedBox] = useState<number | null>(() => initialBox ?? resolveHighlightMatch()?.order ?? null);
  // Filter (by team & job) — applied values + modal draft.
  const [filterOpen, setFilterOpen] = useState(false);
  const [teams, setTeams] = useState<string[]>([]);
  const [jobs, setJobs] = useState<string[]>([]);
  const [draftTeams, setDraftTeams] = useState<string[]>([]);
  const [draftJobs, setDraftJobs] = useState<string[]>([]);

  const [highlightId, setHighlightId] = useState<string | null>(() => resolveHighlightMatch()?.employeeId ?? null);
  useEffect(() => {
    if (!highlightId) return;
    const timer = setTimeout(() => setHighlightId(null), HIGHLIGHT_DURATION_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fade whichever highlight resolved at mount; not meant to restart on every re-render
  }, []);

  const allTeams = useMemo(() => Array.from(new Set(basePoints.map(p => p.team).filter(Boolean))).sort(), [basePoints]);
  const allJobs = useMemo(() => Array.from(new Set(basePoints.map(p => p.positionTitle).filter(Boolean))).sort(), [basePoints]);

  const filtered = useMemo(() => basePoints.filter(p =>
    (teams.length === 0 || teams.includes(p.team)) &&
    (jobs.length === 0 || jobs.includes(p.positionTitle))
  ), [basePoints, teams, jobs]);
  const activeCount = teams.length + jobs.length;

  const tags = useMemo(() => donutTags(config, filtered), [config, filtered]);
  const tableRows = selectedBox != null ? filtered.filter(p => p.order === selectedBox) : filtered;

  const openFilter = () => { setDraftTeams(teams); setDraftJobs(jobs); setFilterOpen(true); };
  const applyFilter = () => { setTeams(draftTeams); setJobs(draftJobs); setSelectedBox(null); setFilterOpen(false); };
  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
  const clearAll = () => { setTeams([]); setJobs([]); setSelectedBox(null); };

  // Active-filter chips: >3 of a kind collapses to a single "N Team/Job" chip (mirrors kelola-app).
  const chips: { label: string; onRemove: () => void }[] = [];
  if (teams.length > 3) chips.push({ label: `${teams.length} Team`, onRemove: () => setTeams([]) });
  else teams.forEach(t => chips.push({ label: `Team: ${t}`, onRemove: () => setTeams(prev => prev.filter(x => x !== t)) }));
  if (jobs.length > 3) chips.push({ label: `${jobs.length} Job`, onRemove: () => setJobs([]) });
  else jobs.forEach(j => chips.push({ label: `Job: ${j}`, onRemove: () => setJobs(prev => prev.filter(x => x !== j)) }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "stretch", flexWrap: "wrap" }}>
        {/* Grid card */}
        <div style={{ flex: "1 1 420px", background: "#fff", borderRadius: 12, boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
            {isTR ? (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#adb5bd", marginBottom: 4 }}>Job Target</div>
                  <select
                    value={jobTarget ?? ""}
                    onChange={e => { setJobTarget(e.currentTarget.value || null); setSelectedBox(null); }}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e9ecef", fontFamily: FONT, fontSize: 12, color: jobTarget ? "#495057" : "#adb5bd", minWidth: 200, background: "#fff" }}
                  >
                    <option value="" disabled>Select job target</option>
                    {jobTargets.map(t => <option key={t.id} value={t.id} style={{ color: "#495057" }}>{t.title}</option>)}
                  </select>
                </div>
                <span role="button" title="Filter" onClick={openFilter} style={{ position: "relative", cursor: "pointer", color: ACCENT, display: "inline-flex", paddingBottom: 8 }}>
                  <IconFilter size={18} />
                  {activeCount > 0 && (
                    <Badge size="xs" circle color="primary" style={{ position: "absolute", top: -4, right: -8 }}>{activeCount}</Badge>
                  )}
                </span>
              </div>
            ) : (
              <Button
                variant="subtle"
                color="primary"
                size="compact-sm"
                onClick={openFilter}
                leftSection={<IconFilter size={14} />}
                rightSection={activeCount > 0 ? <Badge size="xs" circle color="primary">{activeCount}</Badge> : null}
                styles={{ root: { fontFamily: FONT, fontSize: 12, fontWeight: 600, color: ACCENT, paddingLeft: 0 } }}
              >
                Filter
              </Button>
            )}
            <IconSettings onClick={onSettings} title={`Setting ${config.name}`} size={16} style={{ color: "#adb5bd", cursor: onSettings ? "pointer" : undefined }} />
          </div>
          {chips.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 8 }}>
              {chips.map((c, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#e6f3f8", color: ACCENT, borderRadius: 999, padding: "3px 10px", fontSize: 11, fontFamily: FONT }}>
                  {c.label}
                  <span role="button" title="Remove filter" onClick={c.onRemove} style={{ cursor: "pointer", display: "inline-flex", opacity: 0.7 }}>✕</span>
                </span>
              ))}
              <span role="button" onClick={clearAll} style={{ color: ACCENT, fontSize: 11, fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}>Clear All</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
            <TMTRBox config={config} points={filtered} selectedBox={selectedBox} onBoxClick={setSelectedBox} />
          </div>
        </div>

        {/* Donut card */}
        <div style={{ flex: "1 1 320px", background: "#fff", borderRadius: 12, boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 13, color: "#495057", textAlign: "center" }}>{config.name} Distribution</div>
          <DonutChart data={tags} centerLabel={`${filtered.length} ${config.unit}`} />
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", maxWidth: 250 }}>
            {tags.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontSize: 12, color: "#495057" }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: resolveColor(t.color), flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{t.name}</span>
                <span>({t.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TablePanel
        config={config}
        points={tableRows}
        highlightId={highlightId}
        emptyMessage={isTR && !jobTarget ? "No job target selected yet, please choose one first" : "No data."}
      />

      {/* Judul & radius datang dari tema — cukup oper string. */}
      <Modal opened={filterOpen} onClose={() => setFilterOpen(false)} title="Filter" size="lg">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, fontFamily: FONT }}>
          <div>
            <Text fw={700} size="sm" c="#495057" mb={10}>Teams</Text>
            <ScrollArea.Autosize mah={260}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {allTeams.map(t => (
                  <Checkbox key={t} label={t} checked={draftTeams.includes(t)} onChange={() => setDraftTeams(prev => toggle(prev, t))} color="primary" size="sm" />
                ))}
                {allTeams.length === 0 && <Text size="xs" c="#adb5bd">No teams.</Text>}
              </div>
            </ScrollArea.Autosize>
          </div>
          <div>
            <Text fw={700} size="sm" c="#495057" mb={10}>Jobs</Text>
            <ScrollArea.Autosize mah={260}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {allJobs.map(j => (
                  <Checkbox key={j} label={j} checked={draftJobs.includes(j)} onChange={() => setDraftJobs(prev => toggle(prev, j))} color="primary" size="sm" />
                ))}
              </div>
            </ScrollArea.Autosize>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <Button variant="outline" color="primary" radius="xl" onClick={() => setFilterOpen(false)}>Cancel</Button>
          <Button color="primary" radius="xl" onClick={applyFilter}>Save</Button>
        </div>
      </Modal>
    </div>
  );
}

export default function TalentMappingClient({
  tiConfig,
  tiPoints,
  trConfig,
  jobTargets,
  trByTarget,
  initialBox,
  initialHighlight,
}: {
  tiConfig: TMConfig;
  tiPoints: TMPoint[];
  trConfig: TMConfig;
  jobTargets: { id: string; title: string }[];
  trByTarget: Record<string, TMPoint[]>;
  initialBox: number | null;
  initialHighlight: string | null;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"TI" | "TR">("TI");
  const config = tab === "TI" ? tiConfig : trConfig;
  const points = tab === "TI" ? tiPoints : [];

  return (
    <div style={{ fontFamily: FONT }}>
      <AppBreadcrumb items={[{ label: "Talent Mapping" }]} />
      <div style={{ padding: "12px 16px 40px" }}>
      {/* Tab memakai komponen design system; gayanya datang dari tema
          (lihat blok .mantine-Tabs-* di globals.css), bukan ditulis di sini. */}
      <Tabs value={tab} onChange={(v) => setTab((v as "TI" | "TR") ?? "TI")} mb={16}>
        <Tabs.List>
          <Tabs.Tab value="TI">Human Asset Value</Tabs.Tab>
          <Tabs.Tab value="TR">Talent Readiness</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Panel
        key={tab}
        config={config}
        points={points}
        jobTargets={jobTargets}
        trByTarget={trByTarget}
        initialBox={initialBox}
        initialHighlight={initialHighlight}
        onSettings={() => router.push(tab === "TI" ? "/talent-mapping/config" : "/talent-mapping/config?config=TR")}
      />
      </div>
    </div>
  );
}
