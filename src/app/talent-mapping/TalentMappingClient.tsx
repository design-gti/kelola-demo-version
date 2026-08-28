"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionIcon, Paper, Badge, Avatar as MantineAvatar, Select, TextInput, Pagination, Table, Text, Button, Modal, Checkbox, ScrollArea, Tabs } from "@mantine/core";
import { IconArrowUpRight, IconSettings, IconPlus, IconSparkles } from "@tabler/icons-react";
import AppBreadcrumb from "@/components/Breadcrumb";
import TMTRBox from "@/components/talent/TMTRBox";
import DistributionSummary from "@/components/talent/DistributionSummary";
import MappingSidePanel from "@/components/talent/MappingSidePanel";
import MappingOverview from "@/components/talent/MappingOverview";
import AllMappingTable from "@/components/talent/AllMappingTable";
import { buildMappingViews } from "@/components/talent/mappingViews";
import { mantineColor } from "@/components/team/mantineColor";
import { matchesFuzzy } from "@/lib/data/textMatch";
import { donutTags, boxByOrder, pointsFrom, usesCompetency, defaultShade, COMPETENCY_KEY, METRICS,
  applyFilter, axesOf, emptyFilter, filterCount, picksFor,
  type TMConfig, type TMPoint, type MetricKey, type EmployeeMetrics, type TMFilter } from "@/data/talentMappingShared";
import { BUILT_IN_TABS, getCustomTabs, addCustomTab,
  getEffectiveConfig, TM_CONFIG_EVENT, TM_TABS_EVENT, type CustomTab } from "@/data/talentMappingConfig";

/** How long the deep-link highlight (colored outline + auto-scroll) stays visible before fading — mirrors Vismap's OrgChartCard highlight timing. */
const HIGHLIGHT_DURATION_MS = 3000;

const FONT = "'Open Sans', sans-serif";
const ACCENT = "#016699";

/**
 * Latar panel kendali — neutral.1 dari palet design system.
 *
 * Kartu ini memuat dua hal yang berbeda sifatnya: alat untuk menyaring dan
 * memilih di kiri, dan bacaan datanya di kanan. Bidang abu muda memisahkan
 * keduanya lebih jelas daripada garis tipis, tanpa memecahnya kembali jadi dua
 * kartu.
 */
const PANEL_BG = mantineColor.neutral[1];

/**
 * 9-box adalah kartu utama halaman, jadi digambar jauh lebih besar dari bawaan
 * komponennya (360). Batas atasnya bukan selera: grid ditambah blok sumbu 50px,
 * lalu jarak 24px, lalu lebar minimum kolom ringkasan, semuanya harus tetap muat
 * di kartu — begitu tidak muat, ringkasannya turun ke bawah grid. Pada lebar
 * kartu sekarang, 520 sudah melewati batas itu dan ringkasannya jatuh ke bawah.
 */
const BOX_SIZE = 500;

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
}
/**
 * Warna pil di tabel, diambil dari warna kotaknya.
 *
 * Dulu ada peta warna lokal di berkas ini. Dua masalahnya: ia harus dijaga tetap
 * sama dengan palet di modul bersama, dan ia tidak mengenal warna buatan user —
 * warna hex dari color picker jatuh ke abu-abu bawaan, jadi pil di tabel
 * kehilangan kaitannya dengan kotak di grid persis pada kasus yang paling
 * membutuhkannya.
 */
const pillColor = (token: string) => defaultShade(token);

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
 *
 * Tanda "%" hanya dipasang pada sumbu yang memang dibaca relatif terhadap
 * jabatan target. Kalau dipaku, kolom Competency tetap bertanda persen padahal
 * targetnya belum dipilih dan angkanya masih skor mentah.
 */
const axisHead = (label: string, key: MetricKey, axis: string, relative: boolean) =>
  label + " (" + axis + ")" + (relative && key === COMPETENCY_KEY ? "%" : "");
/**
 * Kolom terakhir sebelum Action bernama "Tag" di KEDUA mode, karena isinya sama:
 * tag yang disetel per kotak di halaman Setting. Dulu ia "HAV status" di TI —
 * berisi Talent/Non Talent yang ditulis tetap dan tidak ikut tag yang disetel
 * user — dan "Readiness" di TR, padahal keduanya membaca medan yang sama.
 */
const tableHeaders = (cfg: TMConfig, rel: boolean) => ["Employee", "Position", axisHead(cfg.sumbuX, cfg.sumbuXKey, "X", rel), axisHead(cfg.sumbuY, cfg.sumbuYKey, "Y", rel), "Box Category", "Tag", "Action"];

function Cell({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: muted ? "#ced4da" : "#495057" }}>{children}</span>;
}

function TablePanel({ config, points, highlightId, relativeToTarget = false, emptyMessage = "No data." }: { config: TMConfig; points: TMPoint[]; highlightId?: string | null; relativeToTarget?: boolean; emptyMessage?: string }) {
  const router = useRouter();
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
            {tableHeaders(config, relativeToTarget).map((h) => (
              <Table.Th key={h}>{h}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {pageRows.map((p, i) => {
            const box = boxByOrder(config, p.order);
            const boxColor = box ? pillColor(box.color) : "#adb5bd";
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
                {/* Employee kolom pertama: baris tabel ini bercerita tentang
                    ORANG, dan jabatan cuma salah satu keterangannya. Kolom
                    pertama adalah yang dipakai mata menelusuri tabel ke bawah. */}
                <Table.Td>{person}</Table.Td>
                <Table.Td>
                  <Cell>{p.positionTitle}</Cell>
                </Table.Td>
                <Table.Td>
                  <Cell muted={p.rawX == null}>{p.rawX ?? "{No data}"}</Cell>
                </Table.Td>
                <Table.Td>
                  <Cell muted={p.rawY == null}>{p.rawY ?? "{No data}"}</Cell>
                </Table.Td>
                <Table.Td>{box ? <OutlinePill color={boxColor}>{box.label}</OutlinePill> : <Cell muted>-</Cell>}</Table.Td>
                {/* Tag kotaknya apa adanya. Sebelumnya kolom ini memaksa setiap
                    orang jadi Talent atau Non Talent — dua nilai yang ditulis
                    tetap di sini, jadi tag apa pun yang disetel user di halaman
                    Setting tidak pernah terlihat, dan kotak yang tagnya sengaja
                    dikosongkan tetap terbaca "Non Talent". */}
                <Table.Td>
                  {box?.readiness
                    ? <OutlinePill color={boxColor}>{box.readiness}</OutlinePill>
                    : <Cell muted>-</Cell>}
                </Table.Td>
                <Table.Td>{action}</Table.Td>
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
  jobTargets = [],
  metrics,
  initialBox = null,
  initialHighlight = null,
  onSettings,
  tabBar,
  filter,
  onFilterChange,
}: {
  config: TMConfig;
  jobTargets?: { id: string; title: string }[];
  metrics: EmployeeMetrics[];
  initialBox?: number | null;
  initialHighlight?: string | null;
  onSettings?: () => void;
  /** Baris tab box mapping, dirender induk dan ditaruh di kepala kartu ini. */
  tabBar?: React.ReactNode;
  /**
   * Saringan tab ini. Dipegang induk, bukan komponen ini, karena dua hal:
   * saringannya harus bertahan saat user berpindah tab lalu kembali (komponen
   * ini di-remount tiap pindah tab), dan tampilan Semua Mapping harus bisa
   * membaca saringan SETIAP tab sekaligus.
   */
  filter: TMFilter;
  onFilterChange: (next: TMFilter) => void;
}) {
  /**
   * Pemilih jabatan target muncul mengikuti SUMBU, bukan nama tab: tab apa pun
   * yang memakai data Competency menawarkannya, dan tab yang tidak memakainya
   * tidak menampilkannya sama sekali.
   */
  const needsTarget = usesCompetency(config);
  const jobTarget = filter.jobTarget;
  const setJobTarget = (v: string | null) => onFilterChange({ ...filter, jobTarget: v });
  const relativeToTarget = needsTarget && !!jobTarget;
  const basePoints = useMemo(
    () => pointsFrom(config, metrics, needsTarget ? jobTarget : null),
    [jobTarget, needsTarget, config, metrics],
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
  /**
   * Karyawan yang disorot dari panel kiri. Berbeda dari highlightId di bawah:
   * yang itu sorotan sekali-pakai dari tautan luar dan memudar sendiri,
   * sedangkan ini dikendalikan user dan menetap sampai ia melepasnya.
   */
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  // Saringan terpakai datang dari induk; draft modal tetap milik komponen ini.
  const [filterOpen, setFilterOpen] = useState(false);
  const { teams, jobs, axisPicks } = filter;
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

  const axes = useMemo(() => axesOf(config), [config]);
  const activeCount = filterCount(config, filter);

  // Satu jalur penyaringan, dipakai bersama tampilan Semua Mapping.
  const banded = useMemo(() => applyFilter(config, basePoints, filter), [config, basePoints, filter]);

  /**
   * Ringkasan ikut apa yang sedang dilihat. Saat satu kotak difokuskan, yang
   * dipertanyakan bukan lagi sebaran antar tag melainkan "kotak ini isinya
   * berapa dari keseluruhan" — jadi barnya tinggal satu, memakai nama dan warna
   * kotak itu sendiri.
   *
   * Pembaginya tetap SELURUH orang yang lolos saringan, bukan isi kotaknya,
   * supaya persentasenya menjawab pertanyaan itu dan tidak selalu 100%.
   */
  const focusedBox = selectedBox != null ? boxByOrder(config, selectedBox) : null;
  const tags = useMemo(
    () => (focusedBox
      ? [{ name: focusedBox.label, value: banded.filter(p => p.order === selectedBox).length, color: focusedBox.color }]
      : donutTags(config, banded)),
    [focusedBox, selectedBox, config, banded],
  );
  const tableRows = selectedBox != null ? banded.filter(p => p.order === selectedBox) : banded;
  // Panel kiri mengikuti kotak yang sedang dipilih, sama seperti tabel.
  const panelRows = tableRows;

  const openFilter = () => { setDraftTeams(teams); setDraftJobs(jobs); setDraftAxisPicks(axisPicks); setFilterOpen(true); };
  const submitFilter = () => {
    onFilterChange({ ...filter, teams: draftTeams, jobs: draftJobs, axisPicks: draftAxisPicks });
    setSelectedBox(null);
    setFilterOpen(false);
  };
  const toggle = (arr: string[], v: string) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
  /** Berapa centang yang sedang dipasang DI MODAL; menyalakan tombol Clear All. */
  const draftCount = draftTeams.length + draftJobs.length + axes.reduce((n, a) => n + picksFor(a, draftAxisPicks).length, 0);

  const toggleAxis = (axisId: string, v: string) =>
    setDraftAxisPicks(prev => ({ ...prev, [axisId]: toggle(prev[axisId] ?? [], v) }));
  /*
   * Saringan yang sedang aktif TIDAK dijabarkan di luar modal.
   *
   * Dulu tiap saringan jadi satu chip di kepala kartu; begitu beberapa saringan
   * dipasang, barisnya membungkus dan mendorong seluruh grafik ke bawah — dan
   * itu terjadi tepat saat user sedang membandingkan sebaran. Yang tersisa di
   * luar cuma angka pada tombol Filter (activeCount): cukup untuk menjawab
   * "sedang tersaring atau tidak", dan rinciannya ada di modalnya sendiri.
   */

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Baris tab di LUAR kartu.
          Tab memilih mapping mana yang sedang dilihat, jadi ia berdiri di atas
          seluruh kartu — bukan di dalamnya seperti sebuah kendali kartu. Kartu
          di bawahnya adalah isi tab yang sedang aktif. */}
      {tabBar}

      {/*
       * SATU kartu untuk panel kiri, 9-box, dan ringkasannya.
       *
       * Ketiganya menceritakan hal yang sama: daftar di kiri adalah orang-orang
       * yang sedang diplot di grid, dan ringkasan di kanan menghitung mereka.
       * Dulu panelnya kartu tersendiri, dan dua kartu bersebelahan terbaca
       * seperti dua bacaan yang kebetulan berdampingan.
       */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "#fff", borderRadius: 12, boxShadow: "2px 4px 10px rgba(0,0,0,0.07)", padding: 16 }}>
        {/* Kepala kartu — melintang selebar kartu, bukan milik kolom kanan saja.
            Dengan begitu panel kiri dan 9-box berangkat dari garis atas yang
            sama; waktu kepala ini tinggal di kolom kanan, grid selalu turun
            setinggi baris ini sementara panel di kiri tidak. */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          {/* Pintu ke halaman Setting. Diberi tulisan, bukan ikon telanjang:
              ikon roda gigi sendirian bisa berarti apa saja, dan ini satu-satunya
              jalan menuju pengaturan mapping. */}
          <span
            role="button"
            onClick={onSettings}
            title={`Setting ${config.name}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: ACCENT, cursor: onSettings ? "pointer" : undefined, fontFamily: FONT, fontSize: 13, fontWeight: 700 }}
          >
            <IconSettings size={16} />
            Configuration
          </span>
        </div>

        <div style={{ display: "flex", gap: 0, alignItems: "stretch", flexWrap: "wrap" }}>
        {/* Panel kendali — menyaring, mengurutkan, memilih untuk dibandingkan.
            Pemisahnya garis, bukan jarak antar kartu: keduanya kini satu bidang.
            Garis dimatikan saat barisnya membungkus (layar sempit), karena di
            sana panel duduk DI ATAS grid, bukan di sebelahnya. */}
        <div style={{ flex: "0 1 300px", minWidth: 280, background: PANEL_BG, borderRadius: 12, padding: 12 }}>
          <MappingSidePanel
            config={config}
            points={panelRows}
            jobTargets={needsTarget ? jobTargets : undefined}
            jobTarget={needsTarget ? jobTarget : undefined}
            onJobTargetChange={needsTarget ? (v => { setJobTarget(v); setSelectedBox(null); }) : undefined}
            onOpenFilter={openFilter}
            activeFilterCount={activeCount}
            spotlightId={spotlightId}
            /* Tidak perlu ikut memindahkan box yang difokuskan: daftar di panel
               ini sudah menyempit ke box yang sedang di-zoom, jadi orang yang
               bisa disorot dari sana pasti ada di dalam box itu. */
            onSpotlight={setSpotlightId}
          />
        </div>

        {/* Sisi kanan: 9-box beserta ringkasannya. */}
        {/* paddingTop menyamai padding dalam panel kiri: isi kedua sisi harus
            berangkat dari garis yang sama, dan panel kini punya bidang sendiri
            yang mendorong isinya masuk 12px. */}
        <div style={{ flex: "1 1 520px", paddingLeft: 16, paddingTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Ringkasan sebaran, di atas 9-box */}

          {/* 9-box dan ringkasannya bersebelahan. Ringkasan dipindah ke samping
              karena di atas ia memakan tinggi yang lebih berguna untuk grid, dan
              berdampingan begini ia terbaca sebagai keterangan grid di
              sebelahnya — bukan sesuatu yang berdiri sendiri.
              flex-wrap dibiarkan menyala: di layar sempit ringkasan turun ke
              bawah grid daripada menghimpitnya. */}
          {/* Tanpa padding atas: grid harus berangkat dari garis yang sama dengan
              panel di kiri, dan 4px di sini cukup untuk membuat keduanya terbaca
              tidak sejajar. */}
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            <TMTRBox config={config} points={banded} selectedBox={selectedBox} onBoxClick={setSelectedBox} spotlightId={spotlightId} size={BOX_SIZE} />
            {/* Tanpa batas lebar: ringkasan mengisi sisa ruang di kanan 9-box.
                9-box lebarnya tetap (BOX_SIZE), jadi kalau ringkasannya juga
                dibatasi, sisa ruang kartu tertinggal kosong. */}
            {/* flex-basis DAN minWidth dibuat sama. Keputusan membungkus baris
                diambil dari basis, bukan dari minWidth — basis 220 dengan minWidth
                190 membuat kolom ini terlempar ke bawah grid meski ruang tersisa
                masih 243px, karena 550 + 24 + 220 lewat 1px dari lebar barisnya. */}
            <div style={{ flex: "1 1 190px", minWidth: 190, display: "flex", flexDirection: "column", gap: 20 }}>
              <DistributionSummary data={tags} total={banded.length} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#495057", textDecoration: "underline", textUnderlineOffset: 3 }}>
                    INSIGHT
                  </span>
                  <IconSparkles size={14} stroke={1.7} style={{ color: ACCENT }} />
                </div>
                {/* Isinya masih penanda tempat; logikanya menyusul. Ditulis apa
                    adanya, bukan kalimat contoh yang bisa terbaca seolah
                    kesimpulan sungguhan tentang data di sebelahnya. */}
                <p style={{ fontSize: 12, color: "#adb5bd", margin: 0 }}>Ringkasan Data</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <TablePanel
        config={config}
        points={tableRows}
        highlightId={highlightId}
        relativeToTarget={relativeToTarget}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginTop: 20 }}>
          {/* Mengosongkan seluruh centang di modal ini, BUKAN saringan yang
              sedang berlaku — seperti centangnya sendiri, ia baru berlaku
              setelah Save. Jadi "Clear All" lalu Cancel meninggalkan saringan
              lama utuh, sama seperti mencentang lalu Cancel.
              Ditaruh di sisi kiri, jauh dari Save: ia membuang seluruh pilihan,
              dan aksi seperti itu tidak boleh bersebelahan dengan aksi yang
              paling sering ditekan. Redup saat memang belum ada yang dicentang. */}
          <Button
            variant="subtle" color="primary" radius="xl"
            disabled={draftCount === 0}
            onClick={() => { setDraftTeams([]); setDraftJobs([]); setDraftAxisPicks({}); }}
          >
            Clear All
          </Button>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="outline" color="primary" radius="xl" onClick={() => setFilterOpen(false)}>Cancel</Button>
            <Button color="primary" radius="xl" onClick={submitFilter}>Save</Button>
          </div>
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
  initialTab = null,
  initialBox,
  initialHighlight,
}: {
  jobTargets: { id: string; title: string }[];
  metrics: EmployeeMetrics[];
  /**
   * Tab yang dibuka dari tautan — kartu Employee Mapping di Beranda mengirim
   * tab yang sedang dilihatnya, supaya berpindah ke halaman penuh tidak
   * melempar user kembali ke Talent Identification.
   */
  initialTab?: string | null;
  initialBox: number | null;
  initialHighlight: string | null;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<string>(initialTab ?? "TI");

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
    () => getEffectiveConfig(tab === "ALL" ? "TI" : tab),
    // configVersion sengaja jadi pemicu: isinya di luar React.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tab, configVersion],
  );

  /**
   * Saringan tiap tab, dikunci id tab.
   *
   * Ditaruh di sini karena dua alasan: Panel di-remount tiap ganti tab (key={tab}),
   * jadi saringan yang tinggal di dalamnya akan hilang tiap kali user berpindah
   * lalu kembali; dan tampilan Semua Mapping harus membaca saringan SETIAP tab
   * sekaligus, bukan hanya tab yang sedang terbuka.
   */
  const [filters, setFilters] = useState<Record<string, TMFilter>>({});
  const filterFor = (id: string, cfg: TMConfig) => filters[id] ?? emptyFilter(cfg);
  const setFilterFor = (id: string, next: TMFilter) => setFilters(prev => ({ ...prev, [id]: next }));

  /**
   * Tab semu berisi SELURUH mapping sekaligus.
   *
   * Id-nya tidak boleh bertabrakan dengan id tab sungguhan; tab buatan user
   * dibuat dengan awalan "TC" + waktu, jadi "ALL" aman.
   */
  const ALL_TAB = { id: "ALL", label: "All Box Mapping" };
  const showingAll = tab === ALL_TAB.id;

  const allTabs = [...BUILT_IN_TABS, ...customTabs.map(t => ({ id: t.id, label: t.name }))];
  /** Kunci sederhana untuk daftar tab; array-nya sendiri dibuat baru tiap render. */
  const tabIds = allTabs.map(t => t.id).join(",");

  /**
   * Isi tiap mapping untuk tab All — dihitung SEKALI, dipakai grafik dan
   * tabelnya. Kalau keduanya menghitung sendiri, tabel bisa menyebut orang yang
   * tidak tergambar di grafik tepat di atasnya.
   */
  const mappingViews = useMemo(
    () => (showingAll ? buildMappingViews(allTabs, metrics, filterFor) : []),
    // configVersion sengaja jadi pemicu: konfigurasi tab hidup di luar React.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showingAll, tabIds, metrics, filters, configVersion],
  );

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
          {/* Paling kanan, setelah mapping yang sungguhan: ia bacaan turunan
              dari tab-tab di kirinya, bukan salah satu di antaranya. Baru
              berarti kalau mappingnya lebih dari satu. */}
          {allTabs.length > 1 && (
            <Tabs.Tab value={ALL_TAB.id} styles={{ tab: { fontFamily: FONT, fontSize: 12 } }}>{ALL_TAB.label}</Tabs.Tab>
          )}
        </Tabs.List>
      </Tabs>
      <ActionIcon variant="subtle" color="primary" size="sm" title="Tambah tab" aria-label="Tambah tab" onClick={() => setAddOpen(true)}>
        <IconPlus size={16} />
      </ActionIcon>

      {/* Ubah nama dan hapus tab TIDAK di sini lagi, melainkan di halaman
          Setting tab itu. Dulu keduanya ikon di baris ini dan memakai
          window.prompt/window.confirm — dialog bawaan browser yang tidak
          mengikuti design system, tidak bisa dibatalkan dengan rapi, dan
          menempatkan aksi merusak tepat di sebelah aksi berpindah tab. */}
    </div>
  );

  return (
    <div style={{ fontFamily: FONT }}>
      <AppBreadcrumb items={[{ label: "Talent Mapping" }]} />
      <div style={{ padding: "12px 16px 40px" }}>
      {showingAll ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {tabBar}
          <MappingOverview views={mappingViews} />
          <AllMappingTable views={mappingViews} metrics={metrics} />
        </div>
      ) : (
      <Panel
        key={tab}
        config={config}
        jobTargets={jobTargets}
        metrics={metrics}
        /* Hanya untuk tab yang memang dituju tautannya; pindah tab setelah itu
           mulai tanpa box terpilih, bukan mengulang fokus dari URL lama. */
        initialBox={tab === (initialTab ?? "TI") ? initialBox : null}
        initialHighlight={initialHighlight}
        tabBar={tabBar}
        filter={filterFor(tab, config)}
        onFilterChange={next => setFilterFor(tab, next)}
        onSettings={() => router.push(`/talent-mapping/config?config=${encodeURIComponent(tab)}`)}
      />
      )}
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
