"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionIcon, Paper, Badge, Avatar as MantineAvatar, Select, TextInput, Pagination, Table, Text, Button, Modal, Checkbox, ScrollArea, Tabs } from "@mantine/core";
import { IconArrowUpRight, IconSettings, IconPlus, IconPencil, IconTrash } from "@tabler/icons-react";
import AppBreadcrumb from "@/components/Breadcrumb";
import TMTRBox from "@/components/talent/TMTRBox";
import DistributionBar from "@/components/talent/DistributionBar";
import MappingSidePanel from "@/components/talent/MappingSidePanel";
import { matchesFuzzy } from "@/lib/data/textMatch";
import { donutTags, boxByOrder, bandIndex, pointsFrom, readinessPointsFrom, METRICS,
  type TMConfig, type TMPoint, type MetricKey, type EmployeeMetrics, type AxisBand } from "@/data/talentMappingShared";
import { BUILT_IN_TABS, getCustomTabs, addCustomTab, renameCustomTab, removeCustomTab,
  getEffectiveConfig, TM_CONFIG_EVENT, TM_TABS_EVENT, type CustomTab } from "@/data/talentMappingConfig";

/** How long the deep-link highlight (colored outline + auto-scroll) stays visible before fading — mirrors Vismap's OrgChartCard highlight timing. */
const HIGHLIGHT_DURATION_MS = 3000;

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

/** 9-box kini kartu utama halaman, jadi digambar lebih besar dari bawaannya (360). */
const BOX_SIZE = 460;

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
      src={employeeId ? `/avatars/employee/${employeeId}.png` : null}
      style={{ flexShrink: 0, background: "#e6f3f8" }}
    >
      <span style={{ color: ACCENT, fontFamily: FONT, fontWeight: 700, fontSize: 10 }}>{initials(name)}</span>
    </MantineAvatar>
  );
}

/**
 * Judul kolom per mode; urutannya sama dengan urutan sel di badan tabel.
 * Nama sumbu diambil dari konfigurasi, bukan ditulis tetap — tab buatan user
 * bisa memakai kombinasi metrik apa pun.
 */
const tiHeaders = (cfg: TMConfig) => ["Position", "Employee", cfg.sumbuX + " (X)", cfg.sumbuY + " (Y)", "Box Category", "HAV status", "Action"];
const trHeaders = (cfg: TMConfig) => ["Employee", "Position", cfg.sumbuX + " (X)%", cfg.sumbuY + " (Y)", "Box Category", "Readiness", "Action"];

function Cell({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: muted ? "#ced4da" : "#495057" }}>{children}</span>;
}

function TablePanel({ config, points, highlightId, emptyMessage = "No data." }: { config: TMConfig; points: TMPoint[]; highlightId?: string | null; emptyMessage?: string }) {
  const router = useRouter();
  // Tab buatan user memakai bentuk yang sama dengan TI.
  const isTI = config.id !== "TR";
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
            {(isTI ? tiHeaders(config) : trHeaders(config)).map((h) => (
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
  tabBar,
}: {
  config: TMConfig;
  points: TMPoint[];
  jobTargets?: { id: string; title: string }[];
  trByTarget?: Record<string, TMPoint[]>;
  initialBox?: number | null;
  initialHighlight?: string | null;
  onSettings?: () => void;
  /** Baris tab box mapping, dirender induk dan ditaruh di kepala kartu ini. */
  tabBar?: React.ReactNode;
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
  // Filter (team, job, kriteria per sumbu) — nilai terpakai + draft modal.
  const [filterOpen, setFilterOpen] = useState(false);
  const [teams, setTeams] = useState<string[]>([]);
  const [jobs, setJobs] = useState<string[]>([]);
  /**
   * Kriteria per sumbu: { X: ["2"], Y: ["0","1"] } — nilainya INDEKS pita
   * sebagai string, bukan nama pitanya, supaya mengganti nama pita di Setting
   * tidak membatalkan saringan yang sedang aktif. Kosong = semua lolos.
   */
  const [axisPicks, setAxisPicks] = useState<Record<string, string[]>>({});
  const [draftTeams, setDraftTeams] = useState<string[]>([]);
  const [draftJobs, setDraftJobs] = useState<string[]>([]);
  const [draftAxisPicks, setDraftAxisPicks] = useState<Record<string, string[]>>({});

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
  /**
   * Sumbu yang sedang dipakai tab ini, lengkap dengan pita dan cara mengambil
   * nilainya dari sebuah titik. Ini yang membuat modal Filter kontekstual:
   * dulu kolomnya dipaku ke sumbu Y dan berjudul "Potency" apa pun metriknya,
   * jadi mengganti sumbu di Setting menghasilkan saringan yang menyaring hal
   * lain dari yang tertulis. Sumbu Z hanya ikut kalau memang dinyalakan.
   */
  const axes = useMemo(() => {
    const list: { id: string; label: string; bands: AxisBand[]; valueOf: (p: TMPoint) => number | null }[] = [
      { id: "X", label: config.sumbuX, bands: config.rangesX, valueOf: p => p.rawX },
      { id: "Y", label: config.sumbuY, bands: config.rangesY, valueOf: p => p.rawY },
    ];
    if (config.useZ && config.sumbuZ && config.rangesZ?.length) {
      list.push({ id: "Z", label: config.sumbuZ, bands: config.rangesZ, valueOf: p => p.rawZ ?? null });
    }
    return list;
  }, [config]);

  /**
   * Pilihan yang masih sah untuk sebuah sumbu. Jumlah pita bisa berubah di
   * Setting (ganti layout, misalnya) tanpa membongkar state ini, dan indeks
   * yang sudah tidak ada akan menyaring habis semua orang tanpa penjelasan —
   * jadi indeks basi dibuang, bukan dipakai.
   */
  const picksFor = (a: { id: string; bands: AxisBand[] }, source: Record<string, string[]>) =>
    (source[a.id] ?? []).filter(v => Number(v) < a.bands.length);

  const activeCount = teams.length + jobs.length + axes.reduce((n, a) => n + picksFor(a, axisPicks).length, 0);

  // Centang dalam satu sumbu bersifat "atau", antar sumbu bersifat "dan".
  const banded = useMemo(
    () => filtered.filter(p => axes.every(a => {
      const picked = picksFor(a, axisPicks);
      if (picked.length === 0) return true;
      const v = a.valueOf(p);
      return v != null && picked.includes(String(bandIndex(v, a.bands)));
    })),
    [filtered, axes, axisPicks],
  );

  /**
   * Talent Readiness mengukur orang TERHADAP satu jabatan target, jadi sumbu X
   * baru punya nilai setelah targetnya dipilih — gridnya kosong karena menunggu
   * pilihan, bukan karena datanya tidak ada. Keterangannya dipakai di grafik
   * DAN di tabel dari satu sumber supaya keduanya tidak pernah berbeda kata.
   */
  const awaitingTarget = isTR && !jobTarget;
  const AWAITING_TARGET_NOTICE = "No job target selected yet, please choose one first";

  const tags = useMemo(() => donutTags(config, banded), [config, banded]);
  const tableRows = selectedBox != null ? banded.filter(p => p.order === selectedBox) : banded;
  // Panel kiri mengikuti kotak yang sedang dipilih, sama seperti tabel.
  const panelRows = tableRows;

  const openFilter = () => { setDraftTeams(teams); setDraftJobs(jobs); setDraftAxisPicks(axisPicks); setFilterOpen(true); };
  const applyFilter = () => { setTeams(draftTeams); setJobs(draftJobs); setAxisPicks(draftAxisPicks); setSelectedBox(null); setFilterOpen(false); };
  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
  const toggleAxis = (axisId: string, v: string) =>
    setDraftAxisPicks(prev => ({ ...prev, [axisId]: toggle(prev[axisId] ?? [], v) }));
  const clearAll = () => { setTeams([]); setJobs([]); setAxisPicks({}); setSelectedBox(null); };

  // Active-filter chips: >3 of a kind collapses to a single "N Team/Job" chip (mirrors kelola-app).
  const chips: { label: string; onRemove: () => void }[] = [];
  if (teams.length > 3) chips.push({ label: `${teams.length} Team`, onRemove: () => setTeams([]) });
  else teams.forEach(t => chips.push({ label: `Team: ${t}`, onRemove: () => setTeams(prev => prev.filter(x => x !== t)) }));
  if (jobs.length > 3) chips.push({ label: `${jobs.length} Job`, onRemove: () => setJobs([]) });
  else jobs.forEach(j => chips.push({ label: `Job: ${j}`, onRemove: () => setJobs(prev => prev.filter(x => x !== j)) }));
  axes.forEach(a => {
    picksFor(a, axisPicks).forEach(v => {
      const band = a.bands[Number(v)];
      if (!band) return;
      chips.push({
        label: `${a.label}: ${band.label}`,
        onRemove: () => setAxisPicks(prev => ({ ...prev, [a.id]: (prev[a.id] ?? []).filter(x => x !== v) })),
      });
    });
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 16, alignItems: "stretch", flexWrap: "wrap" }}>
        {/* Panel kendali — menyaring, mengurutkan, memilih untuk dibandingkan */}
        <div style={{ flex: "0 1 260px", minWidth: 240, background: "#fff", borderRadius: 12, boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", padding: 16 }}>
          <MappingSidePanel
            config={config}
            points={panelRows}
            jobTargets={isTR ? jobTargets : undefined}
            jobTarget={isTR ? jobTarget : undefined}
            onJobTargetChange={isTR ? (v => { setJobTarget(v); setSelectedBox(null); }) : undefined}
            onOpenFilter={openFilter}
            activeFilterCount={activeCount}
          />
        </div>

        {/* Kartu 9-box — sekarang mengambil sisa lebar, bukan separuh */}
        <div style={{ flex: "1 1 520px", background: "#fff", borderRadius: 12, boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {/* Baris tab box mapping — dioper dari induk, karena tab menentukan
                konfigurasi mana yang dipakai Panel ini. */}
            {tabBar}
            <IconSettings onClick={onSettings} title={`Setting ${config.name}`} size={16} style={{ color: ACCENT, cursor: onSettings ? "pointer" : undefined }} />
          </div>

          {chips.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
              {chips.map((c, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#e6f3f8", color: ACCENT, borderRadius: 999, padding: "3px 10px", fontSize: 11, fontFamily: FONT }}>
                  {c.label}
                  <span role="button" title="Remove filter" onClick={c.onRemove} style={{ cursor: "pointer", display: "inline-flex", opacity: 0.7 }}>✕</span>
                </span>
              ))}
              <span role="button" onClick={clearAll} style={{ color: ACCENT, fontSize: 11, fontWeight: 700, fontFamily: FONT, cursor: "pointer" }}>Clear All</span>
            </div>
          )}

          {/* Ringkasan sebaran, di atas 9-box */}
          <DistributionBar data={tags} />

          <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
            <TMTRBox config={config} points={banded} selectedBox={selectedBox} onBoxClick={setSelectedBox} size={BOX_SIZE} emptyNotice={awaitingTarget ? AWAITING_TARGET_NOTICE : undefined} />
          </div>
        </div>
      </div>

      <TablePanel
        config={config}
        points={tableRows}
        highlightId={highlightId}
        emptyMessage={awaitingTarget ? AWAITING_TARGET_NOTICE : "No data."}
      />

      {/* Judul & radius datang dari tema — cukup oper string. */}
      <Modal opened={filterOpen} onClose={() => setFilterOpen(false)} title="Filter" size="lg">
        {/* Sumbu sebaris sendiri di atas: jumlahnya ikut tab (dua, atau tiga
            kalau sumbu Z menyala), dan menyejajarkannya dengan Teams/Jobs
            membuat kolomnya terlalu sempit begitu sumbu Z ikut muncul. */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${axes.length}, 1fr)`, gap: 24, fontFamily: FONT, marginBottom: 24 }}>
          {axes.map(a => (
            <div key={a.id}>
              {/* Sumbunya disebut supaya kolom ini bisa dicocokkan dengan
                  grafik: nama metrik saja tidak memberi tahu yang mana yang
                  mendatar, tegak, atau digambar sebagai cincin. */}
              <Text fw={700} size="sm" c="#495057" mb={10}>{a.label} ({a.id} Axis)</Text>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Pita tertinggi di atas — urutan yang sama dengan sumbunya di grafik. */}
                {a.bands.map((b, i) => ({ value: String(i), label: b.label })).reverse().map(o => (
                  <Checkbox key={o.value} label={o.label}
                    checked={(draftAxisPicks[a.id] ?? []).includes(o.value)}
                    onChange={() => toggleAxis(a.id, o.value)}
                    color="primary" size="sm" />
                ))}
              </div>
            </div>
          ))}
        </div>
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

/**
 * Modal pembuat tab box mapping.
 *
 * Hanya menanyakan yang membedakan sebuah tab: namanya dan kombinasi
 * sumbunya. Sisanya (layout, kriteria, nama box, tag) mewarisi bawaan 9-box
 * dan disunting lewat ikon setting, sama seperti dua tab bawaan — jadi user
 * bisa langsung melihat hasilnya tanpa mengisi formulir panjang.
 */
function AddTabModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (t: { name: string; sumbuXKey: MetricKey; sumbuYKey: MetricKey; sumbuZKey?: MetricKey }) => void;
}) {
  const [name, setName] = useState("");
  const [xKey, setXKey] = useState<MetricKey>("performance_score");
  const [yKey, setYKey] = useState<MetricKey>("leadership_score");
  const [zKey, setZKey] = useState<MetricKey | null>(null);
  const [touched, setTouched] = useState(false);

  const trimmed = name.trim();
  const sameAxis = xKey === yKey;
  const options = METRICS.map(m => ({ value: m.key, label: m.label }));

  const submit = () => {
    setTouched(true);
    if (!trimmed || sameAxis) return;
    onCreate({ name: trimmed, sumbuXKey: xKey, sumbuYKey: yKey, ...(zKey ? { sumbuZKey: zKey } : {}) });
  };

  return (
    <Modal opened onClose={onClose} title="New Box Mapping Tab" size="sm">
      <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: FONT }}>
        <TextInput
          label="Tab Name"
          placeholder="e.g. Performance vs Behavioral"
          value={name}
          onChange={e => setName(e.currentTarget.value)}
          onKeyDown={e => { if (e.key === "Enter") submit(); }}
          error={touched && !trimmed ? "Nama tab wajib diisi" : null}
          size="sm" radius="xl"
          styles={{ label: { fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#495057", marginBottom: 4 }, input: { fontFamily: FONT } }}
        />
        <Select label="X Axis (Horizontal)" data={options} value={xKey} onChange={v => v && setXKey(v as MetricKey)}
          allowDeselect={false} size="sm" radius="xl"
          styles={{ label: { fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#495057", marginBottom: 4 }, input: { fontFamily: FONT } }} />
        <Select label="Y Axis (Vertical)" data={options} value={yKey} onChange={v => v && setYKey(v as MetricKey)}
          allowDeselect={false} size="sm" radius="xl"
          error={sameAxis ? "Sumbu X dan Y harus metrik berbeda" : null}
          styles={{ label: { fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#495057", marginBottom: 4 }, input: { fontFamily: FONT } }} />
        <Select label="Z Axis (Radius) — opsional" data={options} value={zKey} onChange={v => setZKey((v as MetricKey) ?? null)}
          placeholder="Tanpa sumbu Z" clearable size="sm" radius="xl"
          styles={{ label: { fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#495057", marginBottom: 4 }, input: { fontFamily: FONT } }} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <Button variant="outline" color="primary" radius="xl" onClick={onClose}>Cancel</Button>
        <Button color="primary" radius="xl" onClick={submit}>Create Tab</Button>
      </div>
    </Modal>
  );
}

export default function TalentMappingClient({
  jobTargets,
  metrics,
  initialBox,
  initialHighlight,
}: {
  jobTargets: { id: string; title: string }[];
  metrics: EmployeeMetrics[];
  initialBox: number | null;
  initialHighlight: string | null;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<string>("TI");

  // Registry tab custom hidup di memori sesi; dibaca setelah mount supaya
  // server merender daftar kosong dan klien daftar sebenarnya tanpa render
  // tambahan — pola yang sama dengan useIProfileConfig.
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([]);
  useEffect(() => {
    const read = () => setCustomTabs(getCustomTabs());
    read();
    window.addEventListener(TM_TABS_EVENT, read);
    return () => window.removeEventListener(TM_TABS_EVENT, read);
  }, []);

  const [addOpen, setAddOpen] = useState(false);

  const activeCustom = customTabs.find(t => t.id === tab);

  /**
   * Konfigurasi tab aktif, dibaca dari simpanan sesi. Ditaruh di state dan
   * disegarkan lewat TM_CONFIG_EVENT: halaman Setting menyimpan lalu kembali ke
   * sini dengan navigasi klien, jadi tanpa langganan ini komponen akan memakai
   * konfigurasi lama sampai halaman dimuat ulang — dan memuat ulang justru yang
   * mengosongkan simpanannya.
   *
   * Nilai awalnya sengaja bawaan layout, bukan hasil bacaan: server merender
   * lebih dulu dan tidak punya akses ke simpanan sesi, jadi membacanya saat
   * render pertama akan menimbulkan beda hidrasi.
   */
  const [configVersion, setConfigVersion] = useState(0);
  useEffect(() => {
    const bump = () => setConfigVersion(v => v + 1);
    bump();
    window.addEventListener(TM_CONFIG_EVENT, bump);
    return () => window.removeEventListener(TM_CONFIG_EVENT, bump);
  }, []);
  const config = useMemo(
    () => getEffectiveConfig(tab),
    // configVersion sengaja jadi pemicu: isinya di luar React.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tab, configVersion],
  );

  // Titik dihitung di klien untuk SEMUA tab — server tidak tahu konfigurasinya.
  const points = useMemo(() => (tab === "TR" ? [] : pointsFrom(config, metrics)), [tab, config, metrics]);
  const trByTarget = useMemo(() => {
    if (tab !== "TR") return {};
    return Object.fromEntries(jobTargets.map(t => [t.id, readinessPointsFrom(config, t.id, metrics)]));
  }, [tab, config, jobTargets, metrics]);

  const tabBar = (
    <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
      <Tabs value={tab} onChange={v => setTab(v ?? "TI")} variant="default">
        <Tabs.List style={{ borderBottom: "none" }}>
          {BUILT_IN_TABS.map(t => (
            <Tabs.Tab key={t.id} value={t.id} styles={{ tab: { fontFamily: FONT, fontSize: 12 } }}>{t.label}</Tabs.Tab>
          ))}
          {customTabs.map(t => (
            <Tabs.Tab key={t.id} value={t.id} styles={{ tab: { fontFamily: FONT, fontSize: 12 } }}>{t.name}</Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>
      <ActionIcon variant="subtle" color="primary" size="sm" title="Tambah tab" aria-label="Tambah tab" onClick={() => setAddOpen(true)}>
        <IconPlus size={16} />
      </ActionIcon>
      {/* Ubah nama & hapus hanya untuk tab custom — halaman ini kehilangan
          artinya tanpa dua tab bawaannya. */}
      {activeCustom && (
        <>
          <ActionIcon variant="subtle" color="gray" size="sm" title="Ubah nama tab" aria-label="Ubah nama tab"
            onClick={() => {
              const name = window.prompt("Nama tab", activeCustom.name)?.trim();
              if (name) renameCustomTab(activeCustom.id, name);
            }}>
            <IconPencil size={15} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" size="sm" title="Hapus tab" aria-label="Hapus tab"
            onClick={() => {
              if (!window.confirm(`Hapus tab "${activeCustom.name}" beserta pengaturannya?`)) return;
              removeCustomTab(activeCustom.id);
              setTab("TI");
            }}>
            <IconTrash size={15} />
          </ActionIcon>
        </>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily: FONT }}>
      <AppBreadcrumb items={[{ label: "Talent Mapping" }]} />
      <div style={{ padding: "12px 16px 40px" }}>
      <Panel
        key={tab}
        config={config}
        points={points}
        jobTargets={jobTargets}
        trByTarget={trByTarget}
        initialBox={initialBox}
        initialHighlight={initialHighlight}
        tabBar={tabBar}
        onSettings={() => router.push(`/talent-mapping/config?config=${encodeURIComponent(tab)}`)}
      />
      {/* Dirender hanya saat terbuka, jadi tiap kali dibuka isinya segar —
          tanpa perlu effect yang mengosongkan state. */}
      {addOpen && (
        <AddTabModal
          onClose={() => setAddOpen(false)}
          onCreate={t => { const created = addCustomTab(t); setTab(created.id); setAddOpen(false); }}
        />
      )}
      </div>
    </div>
  );
}
