import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers as LayersIcon,
  TrendingUp,
  Shuffle,
  RotateCcw,
  X,
  ArrowRightLeft,
  Target,
  Loader2,
  AlertCircle,
  User,
  GraduationCap,
  Columns3,
} from "lucide-react";
import type { Employee, OrgChartNode } from "../data/orgChartData";
import type { HeatmapConfig } from "../components/HeatmapSettings";
import OrgCardV2 from "./OrgCardV2";
import { Paper, Group, Stack, Text, Badge, Button, Textarea } from "@mantine/core";
import {
  LAYERS,
  isVacant,
  readinessColor,
  readinessOf,
  successionRiskColorFromScores,
  type LayerId,
} from "./layers";
import { computeInitiativeSuccess, initiativeSuccessColor, type Initiative } from "./initiatives";
import { INITIATIVES_SEED } from "./initiativesSeed";

/** Aksen mode Initiatives — ungu, beda dari simulasi (secondary) supaya dua
 *  jenis sinyal ini gampang dibedakan sekilas. */
const GOAL_ACCENT = "#7C3AED";

/** Aksen mode Compare — primary Prodigy. */
const COMPARE_ACCENT = "#016699";

/** Aksen mode simulasi = palet `secondary` Prodigy (bukan amber ad-hoc). */
const SIM_ACCENT = "var(--mantine-color-secondary-5)";
const SIM_ACCENT_SOFT = "var(--mantine-color-secondary-0)";
const SIM_ACCENT_DARK = "var(--mantine-color-secondary-9)";

/**
 * Satu context gabungan untuk semua interaksi kartu V2 — dulunya dua "mode"
 * terpisah (Simulate/Initiatives) yang di-toggle dari top bar, sekarang jadi
 * satu floating action menu yang muncul di sisi kartu yang diklik (lihat
 * CardActionMenu), berlaku sama di tab Default maupun Heatmap.
 */
interface CardCtx {
  occupantOf: (seatId: string) => Employee | null;
  /** Kursi yang sedang "diangkat" untuk ditukar (setelah pilih Simulate di menu). */
  pendingSwapSeatId: string | null;
  changedSeats: Set<string>;
  goalOf: (personId: string) => Initiative | undefined;
  onCardClick: (seatId: string, e: React.MouseEvent) => void;
  /** Mode pilih-untuk-Compare aktif — semua kartu berorang dapat checkbox. */
  compareMode: boolean;
  isSelectedForCompare: (personId: string) => boolean;
}

const LINE = "#016699";
/** Warna garis struktur saat layer % Ready to Promote aktif — diredam jadi abu
 *  supaya warna kesiapan yang jadi fokus, bukan garis org chart-nya. */
const LINE_MUTED = "#adb5bd";

/**
 * Tag "% Ready to Promote" — sengaja di LUAR kartu, persis di atasnya dan menempel
 * pada garis konektor, sama seperti V1. Tag ini sinyal ORANG, jadi dilewati kalau
 * kursinya kosong.
 */
function ReadyToPromoteTag({
  person,
  heatmapConfig,
  targetPosition,
}: {
  person: Employee | null;
  heatmapConfig: HeatmapConfig;
  /** Posisi atasan langsung kursi ini — dijadikan acuan pencocokan aspek. undefined di root (tidak ada atasan). */
  targetPosition?: string;
}) {
  if (!person) return null;
  const value = readinessOf(person, targetPosition);
  const color = readinessColor(person, heatmapConfig, targetPosition);
  return (
    <div
      title="Promotion readiness"
      style={{
        marginBottom: 4,
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: "white",
        border: `1.5px solid ${color}`,
        borderRadius: 20,
        padding: "1px 8px",
        position: "relative",
        zIndex: 20,
      }}
    >
      <TrendingUp size={10} style={{ color }} strokeWidth={2.5} />
      <span style={{ fontSize: 10, fontWeight: 800, color }}>{value}% Ready</span>
    </div>
  );
}

function NodeV2({
  node,
  layers,
  heatmapConfig,
  card,
  promotionTarget,
}: {
  node: OrgChartNode;
  layers: Set<LayerId>;
  heatmapConfig: HeatmapConfig;
  card: CardCtx;
  /** Posisi atasan langsung kursi ini (untuk % Ready to Promote). undefined = root, tidak ada atasan. */
  promotionTarget?: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const reports = node.reports ?? [];
  const hasReports = reports.length > 0;
  const readyActive = layers.has("ready-to-promote");
  // Garis struktur: biru seperti biasa, tapi jadi abu saat layer % Ready aktif.
  const baseLine = readyActive ? LINE_MUTED : LINE;

  const person = card.occupantOf(node.id);
  const latestInitiative = person ? card.goalOf(person.id) : undefined;
  // Succession risk dihitung dari orang yang SEDANG menempati kursi bawahannya,
  // jadi hasil simulasi langsung kelihatan di frame kursi atasannya.
  const riskColor = layers.has("succession-risk")
    ? successionRiskColorFromScores(
        reports
          .map(r => card.occupantOf(r.id))
          .filter((p): p is Employee => !!p)
          .map(p => readinessOf(p, node.position)),
        heatmapConfig,
      )
    : null;

  return (
    <div className="flex flex-col items-center">
      {readyActive && (
        <ReadyToPromoteTag person={person} heatmapConfig={heatmapConfig} targetPosition={promotionTarget} />
      )}
      <div className="relative">
        <OrgCardV2
          seat={node}
          person={person}
          layers={layers}
          heatmapConfig={heatmapConfig}
          riskColor={riskColor}
          picked={card.pendingSwapSeatId === node.id}
          isSwapTarget={!!card.pendingSwapSeatId && card.pendingSwapSeatId !== node.id}
          changed={card.changedSeats.has(node.id)}
          // occupant asli kursi ini = data node itu sendiri (sebelum simulasi)
          previousPerson={card.changedSeats.has(node.id) && !isVacant(node) ? node : null}
          goal={latestInitiative}
          selectable={card.compareMode}
          selected={!!person && card.isSelectedForCompare(person.id)}
          onClick={(e) => card.onCardClick(node.id, e)}
        />
        {hasReports && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[rgb(230,230,230)] border-2 border-[#016699] rounded-full p-1 hover:bg-blue-50 transition-colors z-10"
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3 text-[#016699]" />
            ) : (
              <ChevronRight className="w-3 h-3 text-[#016699]" />
            )}
          </button>
        )}
      </div>

      {hasReports && expanded && <div className="w-px h-6" style={{ background: baseLine }} />}

      {hasReports && expanded && (
        <div className="flex justify-center">
          {reports.map((report, index) => {
            const isOnly = reports.length === 1;
            const isFirst = index === 0;
            const isLast = index === reports.length - 1;
            // Garis vertikal yang menuju kartu anak ikut warna tag % Ready-nya,
            // supaya jalur ke kartu itu langsung kebaca tingkat kesiapannya.
            const reportPerson = card.occupantOf(report.id);
            // Target kecocokan bawahan = kursi node ini (atasannya langsung).
            const stalkColor =
              readyActive && reportPerson ? readinessColor(reportPerson, heatmapConfig, node.position) : baseLine;
            return (
              <div key={report.id} className="relative flex flex-col items-center px-4">
                {/* Bus horizontal: tiap kolom menggambar setengah segmennya sendiri,
                    jadi warnanya milik anak di kolom itu. Digradasi memudar ke warna
                    garis struktur di batas kolom supaya sambungan antar-saudara menyatu dan
                    tidak terbaca sebagai "garisnya berubah arti". */}
                {!isOnly && (
                  <>
                    {!isFirst && (
                      <div
                        className="absolute h-px"
                        style={{
                          top: 0,
                          left: 0,
                          right: "50%",
                          background: `linear-gradient(to right, ${baseLine}, ${stalkColor})`,
                        }}
                      />
                    )}
                    {!isLast && (
                      <div
                        className="absolute h-px"
                        style={{
                          top: 0,
                          left: "50%",
                          right: 0,
                          background: `linear-gradient(to right, ${stalkColor}, ${baseLine})`,
                        }}
                      />
                    )}
                  </>
                )}
                <div className="w-px h-6" style={{ background: stalkColor }} />
                <NodeV2
                  node={report}
                  layers={layers}
                  heatmapConfig={heatmapConfig}
                  card={card}
                  promotionTarget={node.position}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface Props {
  orgChart: OrgChartNode[];
  heatmapConfig: HeatmapConfig;
  /** 'default' = kartu bersih tanpa heatmap, 'heatmap' = layer-layer bisa dinyalakan */
  tab: "default" | "heatmap";
  activeLayers: Set<LayerId>;
  onToggleLayer: (id: LayerId) => void;
  /** offset dari atas viewport (di bawah top bar Vismap) */
  top: number;
}

export default function VismapV2({
  orgChart,
  heatmapConfig,
  tab,
  activeLayers,
  onToggleLayer,
  top,
}: Props) {
  // Pan/zoom: duplikat dari V1 (App.tsx handleZoomIn/Out/ResetView/Wheel/DoubleClick)
  // supaya perilakunya identik — step 10%, range 25-200%, zoom mengikuti titik kursor.
  const INITIAL_ZOOM = 45;
  const INITIAL_POSITION = { x: 0, y: 150 };
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Di tab Default semua layer dimatikan, jadi kartu tampil netral.
  const layers: Set<LayerId> = tab === "heatmap" ? activeLayers : new Set<LayerId>();

  // ---------- SIMULASI ----------
  // Semua kursi (node) di-flatten sekali; occupancy default = occupant aslinya.
  const seats = useMemo(() => {
    const out: OrgChartNode[] = [];
    const walk = (n: OrgChartNode) => {
      out.push(n);
      (n.reports ?? []).forEach(walk);
    };
    orgChart.forEach(walk);
    return out;
  }, [orgChart]);

  const seatById = useMemo(() => new Map(seats.map(s => [s.id, s])), [seats]);

  /** seatId -> employeeId yang menempatinya. Hanya berisi kursi yang diubah simulasi. */
  const [occupancy, setOccupancy] = useState<Record<string, string>>({});
  const [pendingSwapSeatId, setPendingSwapSeatId] = useState<string | null>(null);

  const occupantOf = (seatId: string): Employee | null => {
    const holderId = occupancy[seatId] ?? seatId;
    const holder = seatById.get(holderId);
    if (!holder || isVacant(holder)) return null;
    return holder;
  };

  const changedSeats = useMemo(
    () => new Set(Object.entries(occupancy).filter(([seatId, empId]) => seatId !== empId).map(([seatId]) => seatId)),
    [occupancy],
  );

  /** Daftar perubahan untuk panel: kursi + siapa yang menempatinya sekarang. */
  const moves = [...changedSeats].map(seatId => ({
    seat: seatById.get(seatId)!,
    now: occupantOf(seatId),
    before: seatById.get(seatId)!,
  }));

  // ---------- INITIATIVES ----------
  // personId -> daftar inisiatif orang itu. State lokal murni (demo), tidak persisten.
  const [initiativesByPerson, setInitiativesByPerson] = useState<Record<string, Initiative[]>>(() => ({ ...INITIATIVES_SEED }));
  const [goalsPersonId, setGoalsPersonId] = useState<string | null>(null);
  const [goalDraft, setGoalDraft] = useState("");

  const initiativesOf = (personId: string): Initiative[] => initiativesByPerson[personId] ?? [];
  const latestInitiativeOf = (personId: string): Initiative | undefined => {
    const list = initiativesByPerson[personId];
    return list && list[list.length - 1];
  };

  const addInitiative = async (personId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const id = `${personId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const draft: Initiative = { id, text: trimmed, status: "mapping", successPercent: null };
    setInitiativesByPerson(prev => ({ ...prev, [personId]: [...(prev[personId] ?? []), draft] }));

    try {
      const res = await fetch("/api/vismap-initiative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Mapping failed");

      const aspects = data.aspects as Initiative["aspects"];
      const successPercent = computeInitiativeSuccess(personId, aspects ?? []);
      setInitiativesByPerson(prev => ({
        ...prev,
        [personId]: (prev[personId] ?? []).map(it => it.id === id ? { ...it, status: "mapped", aspects, successPercent } : it),
      }));
    } catch (err) {
      setInitiativesByPerson(prev => ({
        ...prev,
        [personId]: (prev[personId] ?? []).map(it => it.id === id ? { ...it, status: "error", error: err instanceof Error ? err.message : "Mapping failed" } : it),
      }));
    }
  };

  // Cari data orang (nama/foto) dari personId yang panelnya sedang dibuka —
  // ditelusuri lewat occupancy kursi manapun, benar juga kalau orangnya sudah
  // dipindah lewat simulasi sebelumnya.
  const goalsPersonEmployee = (() => {
    if (!goalsPersonId) return null;
    for (const s of seats) {
      const occ = occupantOf(s.id);
      if (occ?.id === goalsPersonId) return occ;
    }
    return null;
  })();

  // ---------- FLOATING ACTION MENU ----------
  // Muncul di sisi (kanan, atau kiri kalau mepet tepi layar) kartu yang diklik,
  // berlaku sama di tab Default maupun Heatmap. Posisinya dihitung dari
  // getBoundingClientRect kartu (koordinat viewport asli), jadi tidak perlu
  // mem-balik matematika pan/zoom kanvas.
  const [cardMenu, setCardMenu] = useState<{ seatId: string; top: number; left: number } | null>(null);
  const cardMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardMenu) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (cardMenuRef.current && !cardMenuRef.current.contains(e.target as Node)) setCardMenu(null);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [cardMenu]);

  const MENU_W = 184;

  // ---------- COMPARE ----------
  // Pilih beberapa orang lewat checkbox di kartu, lalu lempar ke TDP tab Compare.
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const exitCompare = () => {
    setCompareMode(false);
    setCompareIds([]);
  };

  const goToCompare = () => {
    // TDP memakai id EMP0NN sementara canonical p-id pNN — konversi dulu, lalu
    // titipkan lewat `shared_pinned` (kontrak yang sama dipakai V1
    // SuccessionPanel.handleCompareClick dan dibaca TDP Screener/Comparison).
    const toTdpId = (id: string) => "EMP" + String(id).replace(/\D/g, "").padStart(3, "0");
    const ids = Array.from(new Set(compareIds.map(toTdpId)));
    try { localStorage.setItem("shared_pinned", JSON.stringify(ids)); } catch { /* ignore */ }
    (window.top ?? window).location.href = "/tdp-view";
  };

  const onCardClick = (seatId: string, e: React.MouseEvent) => {
    // Mode Compare menimpa semua interaksi lain: klik kartu = centang/hapus centang.
    if (compareMode) {
      const person = occupantOf(seatId);
      if (!person) return; // kursi kosong tidak bisa dibandingkan
      setCompareIds(prev =>
        prev.includes(person.id) ? prev.filter(id => id !== person.id) : [...prev, person.id],
      );
      return;
    }

    if (pendingSwapSeatId) {
      if (pendingSwapSeatId === seatId) {
        setPendingSwapSeatId(null); // klik kursi yang sama = batalkan
        return;
      }
      // Tukar occupant dua kursi. Kalau tujuannya kosong, efeknya jadi "pindah".
      setOccupancy(prev => {
        const a = prev[pendingSwapSeatId] ?? pendingSwapSeatId;
        const b = prev[seatId] ?? seatId;
        return { ...prev, [pendingSwapSeatId]: b, [seatId]: a };
      });
      setPendingSwapSeatId(null);
      setCardMenu(null);
      return;
    }

    if (cardMenu?.seatId === seatId) {
      setCardMenu(null); // klik kartu yang sama = tutup menu
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.right;
    const left = spaceRight >= MENU_W + 12 ? rect.right + 8 : rect.left - MENU_W - 8;
    setCardMenu({ seatId, top: rect.top, left });
  };

  const card: CardCtx = {
    occupantOf,
    pendingSwapSeatId,
    changedSeats,
    goalOf: latestInitiativeOf,
    onCardClick,
    compareMode,
    isSelectedForCompare: (personId: string) => compareIds.includes(personId),
  };

  const menuSeat = cardMenu ? seatById.get(cardMenu.seatId) ?? null : null;
  const menuPerson = cardMenu ? occupantOf(cardMenu.seatId) : null;

  const closeMenu = () => setCardMenu(null);

  const handleMenuSimulate = () => {
    if (!cardMenu) return;
    setPendingSwapSeatId(cardMenu.seatId);
    closeMenu();
  };
  const handleMenuInitiatives = () => {
    if (!menuPerson) return;
    setGoalsPersonId(menuPerson.id);
    closeMenu();
  };
  const handleMenuIProfile = () => {
    if (!menuPerson) return;
    const name = encodeURIComponent(menuPerson.name);
    (window.top ?? window).location.href = `/iprofile?id=${encodeURIComponent(menuPerson.id)}&name=${name}&from=vismap`;
    closeMenu();
  };
  const handleMenuDevelopment = () => {
    if (!menuPerson) return;
    const url = `/idp?page=create-idp-admin.html&participants=${encodeURIComponent(menuPerson.name)}`;
    (window.top ?? window).location.href = url;
    closeMenu();
  };
  const handleMenuCompare = () => {
    if (!menuPerson) return;
    // Orang yang menu-nya dibuka langsung jadi pilihan pertama.
    setCompareMode(true);
    setCompareIds([menuPerson.id]);
    setPendingSwapSeatId(null);
    setGoalsPersonId(null);
    closeMenu();
  };

  const zoomAtViewportCenter = (nextZoom: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const newZoom = Math.max(25, Math.min(200, nextZoom));
    if (newZoom === zoom) return;
    const zoomRatio = newZoom / zoom;
    setPosition(prev => ({
      x: centerX - (centerX - prev.x) * zoomRatio,
      y: centerY - (centerY - prev.y) * zoomRatio,
    }));
    setZoom(newZoom);
  };

  const handleZoomIn = () => zoomAtViewportCenter(zoom + 10);
  const handleZoomOut = () => zoomAtViewportCenter(zoom - 10);
  const handleResetView = () => {
    setZoom(INITIAL_ZOOM);
    setPosition(INITIAL_POSITION);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("[data-no-drag]")) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const stopDrag = () => setIsDragging(false);

  const handleDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("[data-no-drag]")) return;
    if (zoom >= 200) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const newZoom = Math.min(zoom + 20, 200);
    const zoomRatio = newZoom / zoom;
    setPosition(prev => ({
      x: clickX - (clickX - prev.x) * zoomRatio,
      y: clickY - (clickY - prev.y) * zoomRatio,
    }));
    setZoom(newZoom);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-no-drag]")) return;
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Canvas dipasang left:50% + transformOrigin '0 0', jadi titik acuannya
    // tengah horizontal & atas vertikal — sama seperti V1.
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top;

    const zoomChange = -e.deltaY > 0 ? 10 : -10;
    const newZoom = Math.max(25, Math.min(200, zoom + zoomChange));
    if (newZoom === zoom) return;

    const zoomRatio = newZoom / zoom;
    setPosition(prev => ({
      x: mouseX - (mouseX - prev.x) * zoomRatio,
      y: mouseY - (mouseY - prev.y) * zoomRatio,
    }));
    setZoom(newZoom);
  };

  const positionLayers = LAYERS.filter((l) => l.scope === "position");
  const personLayers = LAYERS.filter((l) => l.scope === "person");

  const renderGroup = (title: string, subtitle: string, items: typeof LAYERS) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 9, fontWeight: 800, color: "#016699", letterSpacing: 0.6, marginBottom: 1 }}>
        {title}
      </div>
      <div style={{ fontSize: 9, color: "#adb5bd", marginBottom: 6 }}>{subtitle}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((l) => {
          const on = activeLayers.has(l.id);
          return (
            <label
              key={l.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 7,
                cursor: "pointer",
                padding: "4px 6px",
                borderRadius: 6,
                background: on ? "rgba(1,102,153,0.07)" : "transparent",
              }}
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() => onToggleLayer(l.id)}
                style={{ accentColor: "#016699", marginTop: 2, cursor: "pointer" }}
              />
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#212529" }}>{l.label}</span>
                <span style={{ display: "block", fontSize: 9, color: "#6c757d" }}>{l.hint}</span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden select-none"
      style={{
        left: "var(--sidebar-w, 220px)",
        top,
        zIndex: 40,
        background: "#f1f3f5",
        fontFamily: "'Open Sans', sans-serif",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onDoubleClick={handleDoubleClick}
      onWheel={handleWheel}
    >
      {/* Hint mengambang saat ada kursi yang "diangkat" untuk ditukar (dipilih
          lewat Simulate di floating menu). Menggantikan banner mode lama —
          cuma tampil selagi benar-benar ada aksi yang menunggu diselesaikan. */}
      {pendingSwapSeatId && (
        <Paper
          data-no-drag
          radius={0}
          px={16}
          py={8}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 31,
            background: SIM_ACCENT_SOFT,
            borderBottom: `1px solid ${SIM_ACCENT}`,
          }}
        >
          <Group gap={8} wrap="nowrap">
            <ArrowRightLeft size={14} color={SIM_ACCENT_DARK} />
            <Text size="sm" c={SIM_ACCENT_DARK}>
              <b>{occupantOf(pendingSwapSeatId)?.name}</b> picked up — click a seat to swap, or click the same card
              again to cancel.
            </Text>
            {moves.length > 0 && (
              <Badge ml="auto" color="secondary" radius="xl" size="sm" variant="filled">
                {moves.length} seat{moves.length > 1 ? "s" : ""} changed
              </Badge>
            )}
          </Group>
        </Paper>
      )}

      {/* Panel daftar perubahan simulasi — sisi kanan. Prioritas lebih rendah
          dari panel Initiatives (satu slot kanan dipakai bergantian). */}
      {!goalsPersonId && (pendingSwapSeatId || changedSeats.size > 0) && (
        <Paper
          data-no-drag
          radius={12}
          p={12}
          withBorder
          style={{
            position: "absolute",
            top: pendingSwapSeatId ? 56 : 16,
            right: 16,
            width: 236,
            maxHeight: "calc(100% - 88px)",
            overflowY: "auto",
            borderColor: SIM_ACCENT,
            boxShadow: "2px 4px 10px rgba(0,0,0,0.07)",
            zIndex: 32,
          }}
        >
          <Group gap={6} mb={10} wrap="nowrap">
            <Shuffle size={14} color={SIM_ACCENT_DARK} />
            <Text size="sm" fw={700} c={SIM_ACCENT_DARK}>
              Simulated changes
            </Text>
          </Group>

          {moves.length === 0 ? (
            <Text size="xs" c="neutral.5">
              Pick a person, then choose the target seat — the seat itself never moves, only the person in it.
            </Text>
          ) : (
            <Stack gap={10}>
              {moves.map(m => (
                <div key={m.seat.id} style={{ borderLeft: `3px solid ${SIM_ACCENT}`, paddingLeft: 8 }}>
                  <Text size="xs" fw={700} c="neutral.7" tt="uppercase">
                    {m.seat.position}
                  </Text>
                  <Text size="xs" fw={700} c="neutral.9">
                    {m.now ? m.now.name : "Vacant"}
                  </Text>
                  <Text size="xs" c="neutral.5" td="line-through">
                    {isVacant(m.before) ? "Vacant" : m.before.name}
                  </Text>
                </div>
              ))}
            </Stack>
          )}

          <Button
            variant="outline"
            color="neutral.6"
            size="compact-sm"
            radius="xl"
            mt={14}
            fullWidth
            leftSection={<RotateCcw size={12} />}
            disabled={moves.length === 0 && !pendingSwapSeatId}
            onClick={() => {
              setOccupancy({});
              setPendingSwapSeatId(null);
            }}
          >
            Reset
          </Button>
        </Paper>
      )}

      {/* Panel Initiatives orang yang diklik — sisi kanan, dipicu dari floating menu kartu */}
      {goalsPersonId && (
        <Paper
          data-no-drag
          radius={12}
          p={12}
          withBorder
          style={{
            position: "absolute",
            top: 56,
            right: 16,
            width: 260,
            maxHeight: "calc(100% - 88px)",
            overflowY: "auto",
            borderColor: GOAL_ACCENT,
            boxShadow: "2px 4px 10px rgba(0,0,0,0.07)",
            zIndex: 32,
          }}
        >
          <Group gap={6} mb={2} wrap="nowrap" justify="space-between">
            <Group gap={6} wrap="nowrap">
              <Target size={14} color={GOAL_ACCENT} />
              <Text size="sm" fw={700} c={GOAL_ACCENT}>
                {goalsPersonEmployee?.name ?? "Vacant seat"}
              </Text>
            </Group>
            <Button
              variant="subtle"
              size="compact-xs"
              radius="xl"
              px={4}
              onClick={() => setGoalsPersonId(null)}
              styles={{ root: { color: "#6c757d" } }}
            >
              <X size={12} />
            </Button>
          </Group>
          <Text size="xs" c="neutral.5" mb={10}>
            {goalsPersonEmployee ? "Initiatives / goals" : "Kursi ini kosong — tidak bisa diberi inisiatif."}
          </Text>

          {goalsPersonEmployee && (
            <>
              <Stack gap={4} mb={10}>
                <Textarea
                  placeholder="mis. Meningkatkan kecepatan delivery tim sebesar 20% kuartal ini"
                  autosize
                  minRows={2}
                  maxRows={4}
                  value={goalDraft}
                  onChange={(e) => setGoalDraft(e.currentTarget.value)}
                  styles={{ input: { fontSize: 12 } }}
                />
                <Button
                  size="compact-sm"
                  radius="xl"
                  disabled={!goalDraft.trim()}
                  onClick={() => {
                    addInitiative(goalsPersonEmployee.id, goalDraft);
                    setGoalDraft("");
                  }}
                  styles={{ root: { backgroundColor: GOAL_ACCENT, border: "none" } }}
                >
                  Add initiative
                </Button>
              </Stack>

              {initiativesOf(goalsPersonEmployee.id).length > 0 && (
                <Stack gap={8}>
                  {[...initiativesOf(goalsPersonEmployee.id)].reverse().map(it => (
                    <div key={it.id} style={{ borderLeft: `3px solid ${GOAL_ACCENT}`, paddingLeft: 8 }}>
                      <Text size="xs" c="neutral.8" mb={2}>{it.text}</Text>
                      {it.status === "mapping" && (
                        <Group gap={4} wrap="nowrap">
                          <Loader2 size={11} className="animate-spin" color="#6c757d" />
                          <Text size="xs" c="neutral.5">Menganalisis…</Text>
                        </Group>
                      )}
                      {it.status === "error" && (
                        <Group gap={4} wrap="nowrap">
                          <AlertCircle size={11} color="#DE350B" />
                          <Text size="xs" c="red.7">{it.error ?? "Mapping gagal"}</Text>
                        </Group>
                      )}
                      {it.status === "mapped" && (
                        <>
                          <Badge
                            size="sm"
                            radius="xl"
                            variant="light"
                            mb={4}
                            styles={{
                              root: {
                                color: initiativeSuccessColor(it.successPercent ?? 0),
                                backgroundColor: initiativeSuccessColor(it.successPercent ?? 0) + "1a",
                              },
                            }}
                          >
                            {it.successPercent}% likely to succeed
                          </Badge>
                          <Group gap={4} wrap="wrap">
                            {it.aspects?.map(a => (
                              <span
                                key={a.aspect}
                                style={{ fontSize: 9, color: "#6c757d", background: "#f1f3f5", borderRadius: 20, padding: "1px 6px" }}
                              >
                                {a.aspect} ≥{a.minScore}
                              </span>
                            ))}
                          </Group>
                        </>
                      )}
                    </div>
                  ))}
                </Stack>
              )}
            </>
          )}
        </Paper>
      )}

      {/* Panel layer heatmap — floating sisi kiri, hanya di tab Heatmap */}
      {tab === "heatmap" && (
        <div
          data-no-drag
          style={{
            position: "absolute",
            // digeser turun kalau ada banner mode (pending-swap / compare) sedang tampil
            top: pendingSwapSeatId || compareMode ? 56 : 16,
            left: 16,
            width: 208,
            maxHeight: "calc(100% - 80px)",
            overflowY: "auto",
            background: "white",
            border: "1px solid #dee2e6",
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            padding: 12,
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <LayersIcon size={13} style={{ color: "#016699" }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: "#016699" }}>Heatmap Layer</span>
          </div>
          <div style={{ fontSize: 9, color: "#6c757d", marginBottom: 10, lineHeight: 1.4 }}>
            Can be switched on together — seat and people signals occupy different areas of the card.
          </div>

          {renderGroup("SEAT / POSITION", "Attached to the job", positionLayers)}
          <div style={{ height: 1, background: "#e9ecef", margin: "0 0 12px" }} />
          {renderGroup("PEOPLE", "Attached to the individual", personLayers)}

          {activeLayers.size > 0 && (
            <button
              onClick={() => LAYERS.forEach((l) => activeLayers.has(l.id) && onToggleLayer(l.id))}
              style={{
                width: "100%",
                marginTop: 2,
                padding: "5px 0",
                border: "1px solid #dee2e6",
                borderRadius: 20,
                background: "white",
                color: "#6c757d",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reset all layers
            </button>
          )}
        </div>
      )}

      {/* Mode Compare: hint di atas + action bar mengambang di bawah */}
      {compareMode && (
        <>
          <Paper
            data-no-drag
            radius={0}
            px={16}
            py={8}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 31,
              background: "#E7F5FF",
              borderBottom: `1px solid ${COMPARE_ACCENT}`,
            }}
          >
            <Group gap={8} wrap="nowrap">
              <Columns3 size={14} color={COMPARE_ACCENT} />
              <Text size="sm" fw={700} c={COMPARE_ACCENT}>
                Compare mode
              </Text>
              <Text size="sm" c={COMPARE_ACCENT}>
                Centang kartu employee yang mau dibandingkan, lalu klik Go to Compare.
              </Text>
            </Group>
          </Paper>

          <Paper
            data-no-drag
            radius="xl"
            px={12}
            py={8}
            withBorder
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 33,
              borderColor: COMPARE_ACCENT,
              boxShadow: "0 6px 20px rgba(0,0,0,0.14)",
            }}
          >
            <Group gap={10} wrap="nowrap">
              <Badge color="primary" radius="xl" size="sm" variant="light">
                {compareIds.length} selected
              </Badge>
              <Button variant="outline" color="neutral.6" size="compact-sm" radius="xl" onClick={exitCompare}>
                Cancel
              </Button>
              <Button
                color="primary"
                size="compact-sm"
                radius="xl"
                leftSection={<Columns3 size={13} />}
                disabled={compareIds.length < 2}
                onClick={goToCompare}
              >
                Go to Compare
              </Button>
            </Group>
          </Paper>
        </>
      )}

      {/* Zoom controls */}
      <div
        data-no-drag
        style={{
          position: "absolute",
          bottom: 16,
          // digeser dari tepi supaya tidak ketutup launcher asisten di pojok kanan bawah
          right: 76,
          zIndex: 20,
          background: "white",
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
          padding: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <button onClick={handleZoomIn} disabled={zoom >= 200} title="Zoom In" style={zoomBtn}>
          <ZoomIn size={15} />
        </button>
        <span style={{ fontSize: 11, color: "#495057" }}>{zoom}%</span>
        <button onClick={handleZoomOut} disabled={zoom <= 25} title="Zoom Out" style={zoomBtn}>
          <ZoomOut size={15} />
        </button>
        <div style={{ width: "100%", height: 1, background: "#e9ecef" }} />
        <button onClick={handleResetView} title="Reset View" style={zoomBtn}>
          <Maximize2 size={15} />
        </button>
      </div>

      {/* Canvas */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
          transformOrigin: "0 0",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
          willChange: "transform",
        }}
      >
        <div style={{ transform: "translateX(-50%)", padding: 24 }}>
          <div className="flex gap-16 justify-center items-start">
            {orgChart.map((root) => (
              <NodeV2
                key={root.id}
                node={root}
                layers={layers}
                heatmapConfig={heatmapConfig}
                card={card}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating action menu — muncul di sisi kartu yang diklik (Default maupun
          Heatmap). Di-portal ke document.body supaya posisinya viewport-fixed
          murni, tidak kena transform pan/zoom kanvas. */}
      {cardMenu && menuSeat &&
        createPortal(
          <div
            ref={cardMenuRef}
            data-no-drag
            style={{
              position: "fixed",
              top: cardMenu.top,
              left: cardMenu.left,
              width: MENU_W,
              zIndex: 1000,
              background: "white",
              borderRadius: 12,
              border: "1px solid #dee2e6",
              boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
              overflow: "hidden",
              fontFamily: "'Open Sans', sans-serif",
            }}
          >
            <CardMenuButton icon={<Shuffle size={13} />} label="Simulate" onClick={handleMenuSimulate} />
            <CardMenuButton icon={<Target size={13} />} label="Initiatives" onClick={handleMenuInitiatives} disabled={!menuPerson} accent={GOAL_ACCENT} />
            <CardMenuButton icon={<Columns3 size={13} />} label="Compare" onClick={handleMenuCompare} disabled={!menuPerson} />
            <CardMenuButton icon={<User size={13} />} label="iProfile" onClick={handleMenuIProfile} disabled={!menuPerson} />
            <CardMenuButton icon={<GraduationCap size={13} />} label="Development" onClick={handleMenuDevelopment} disabled={!menuPerson} isLast />
          </div>,
          document.body,
        )}
    </div>
  );
}

function CardMenuButton({
  icon,
  label,
  onClick,
  disabled,
  isLast,
  accent = "#016699",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isLast?: boolean;
  accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 12px",
        border: "none",
        borderBottom: isLast ? "none" : "1px solid #f1f3f5",
        background: "white",
        color: disabled ? "#ced4da" : "#495057",
        fontSize: 12,
        fontWeight: 600,
        cursor: disabled ? "default" : "pointer",
        textAlign: "left",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "#f8f9fa"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
    >
      <span style={{ color: disabled ? "#ced4da" : accent, display: "flex" }}>{icon}</span>
      {label}
    </button>
  );
}

const zoomBtn: React.CSSProperties = {
  border: "1px solid #dee2e6",
  borderRadius: 6,
  background: "white",
  color: "#016699",
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};
