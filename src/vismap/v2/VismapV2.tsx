import { useState, useRef, useEffect, useMemo } from "react";
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
} from "lucide-react";
import type { Employee, OrgChartNode } from "../data/orgChartData";
import type { HeatmapConfig } from "../components/HeatmapSettings";
import OrgCardV2 from "./OrgCardV2";
import { Paper, Group, Stack, Text, Badge, Button } from "@mantine/core";
import {
  LAYERS,
  isVacant,
  readinessColor,
  readinessOf,
  successionRiskColorFromScores,
  type LayerId,
} from "./layers";

/** Aksen mode simulasi = palet `secondary` Prodigy (bukan amber ad-hoc). */
const SIM_ACCENT = "var(--mantine-color-secondary-5)";
const SIM_ACCENT_SOFT = "var(--mantine-color-secondary-0)";
const SIM_ACCENT_DARK = "var(--mantine-color-secondary-9)";

/**
 * Mode simulasi V2: yang dipindah adalah ORANG-nya, kursinya tetap di tempat.
 * `occupancy` memetakan seatId -> employeeId, jadi struktur org chart (dan semua
 * sinyal kursi seperti critical position) tidak pernah berubah.
 */
interface SimCtx {
  active: boolean;
  occupantOf: (seatId: string) => Employee | null;
  pickedSeatId: string | null;
  changedSeats: Set<string>;
  onSeatClick: (seatId: string) => void;
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
  onEmployeeClick,
  sim,
  promotionTarget,
}: {
  node: OrgChartNode;
  layers: Set<LayerId>;
  heatmapConfig: HeatmapConfig;
  onEmployeeClick: (emp: Employee) => void;
  sim: SimCtx;
  /** Posisi atasan langsung kursi ini (untuk % Ready to Promote). undefined = root, tidak ada atasan. */
  promotionTarget?: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const reports = node.reports ?? [];
  const hasReports = reports.length > 0;
  const readyActive = layers.has("ready-to-promote");
  // Garis struktur: biru seperti biasa, tapi jadi abu saat layer % Ready aktif.
  const baseLine = readyActive ? LINE_MUTED : LINE;

  const person = sim.occupantOf(node.id);
  // Succession risk dihitung dari orang yang SEDANG menempati kursi bawahannya,
  // jadi hasil simulasi langsung kelihatan di frame kursi atasannya.
  const riskColor = layers.has("succession-risk")
    ? successionRiskColorFromScores(
        reports
          .map(r => sim.occupantOf(r.id))
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
          picked={sim.pickedSeatId === node.id}
          isSwapTarget={sim.active && !!sim.pickedSeatId && sim.pickedSeatId !== node.id}
          changed={sim.changedSeats.has(node.id)}
          // occupant asli kursi ini = data node itu sendiri (sebelum simulasi)
          previousPerson={sim.changedSeats.has(node.id) && !isVacant(node) ? node : null}
          onClick={() => {
            if (sim.active) sim.onSeatClick(node.id);
            else if (person) onEmployeeClick(person);
          }}
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
            const reportPerson = sim.occupantOf(report.id);
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
                  onEmployeeClick={onEmployeeClick}
                  sim={sim}
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
  onEmployeeClick: (emp: Employee) => void;
  /** offset dari atas viewport (di bawah top bar Vismap) */
  top: number;
  /** Mode simulasi pertukaran orang antar kursi. */
  simulationMode: boolean;
  onExitSimulation: () => void;
}

export default function VismapV2({
  orgChart,
  heatmapConfig,
  tab,
  activeLayers,
  onToggleLayer,
  onEmployeeClick,
  top,
  simulationMode,
  onExitSimulation,
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
  const [pickedSeatId, setPickedSeatId] = useState<string | null>(null);

  // Keluar dari mode simulasi = buang semua perubahan, balik ke data asli.
  useEffect(() => {
    if (!simulationMode) {
      setOccupancy({});
      setPickedSeatId(null);
    }
  }, [simulationMode]);

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

  const handleSeatClick = (seatId: string) => {
    if (!pickedSeatId) {
      // Kursi kosong tidak bisa jadi asal pertukaran — tidak ada orang untuk diangkat.
      if (!occupantOf(seatId)) return;
      setPickedSeatId(seatId);
      return;
    }
    if (pickedSeatId === seatId) {
      setPickedSeatId(null);
      return;
    }
    // Tukar occupant dua kursi. Kalau tujuannya kosong, efeknya jadi "pindah".
    setOccupancy(prev => {
      const a = prev[pickedSeatId] ?? pickedSeatId;
      const b = prev[seatId] ?? seatId;
      return { ...prev, [pickedSeatId]: b, [seatId]: a };
    });
    setPickedSeatId(null);
  };

  const sim: SimCtx = {
    active: simulationMode,
    occupantOf,
    pickedSeatId,
    changedSeats,
    onSeatClick: handleSeatClick,
  };

  /** Daftar perubahan untuk panel: kursi + siapa yang menempatinya sekarang. */
  const moves = [...changedSeats].map(seatId => ({
    seat: seatById.get(seatId)!,
    now: occupantOf(seatId),
    before: seatById.get(seatId)!,
  }));

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
      {/* Mode simulasi: seluruh area org chart dibingkai kuning */}
      {simulationMode && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 0 4px ${SIM_ACCENT}, inset 0 0 40px 8px rgba(245,158,11,0.15)`,
              zIndex: 30,
            }}
          />
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
              <Shuffle size={14} color={SIM_ACCENT_DARK} />
              <Text size="sm" fw={700} c={SIM_ACCENT_DARK}>
                Simulation mode
              </Text>
              {pickedSeatId ? (
                <Group gap={6} wrap="nowrap">
                  <ArrowRightLeft size={13} color={SIM_ACCENT_DARK} />
                  <Text size="sm" c={SIM_ACCENT_DARK}>
                    <b>{occupantOf(pickedSeatId)?.name}</b> picked up — click a seat to swap, or click the same card
                    again to cancel.
                  </Text>
                </Group>
              ) : (
                <Text size="sm" c={SIM_ACCENT_DARK}>
                  Click a person to pick them up, then click the seat you want to move them into.
                </Text>
              )}
              {moves.length > 0 && (
                <Badge ml="auto" color="secondary" radius="xl" size="sm" variant="filled">
                  {moves.length} seat{moves.length > 1 ? "s" : ""} changed
                </Badge>
              )}
            </Group>
          </Paper>
        </>
      )}

      {/* Panel daftar perubahan simulasi — sisi kanan */}
      {simulationMode && (
        <Paper
          data-no-drag
          radius={12}
          p={12}
          withBorder
          style={{
            position: "absolute",
            top: 56,
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
              No changes yet. Pick a person, then choose the target seat — the seat itself never moves, only the person
              in it.
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

          <Group gap={6} mt={14} grow>
            <Button
              variant="outline"
              color="neutral.6"
              size="compact-sm"
              radius="xl"
              leftSection={<RotateCcw size={12} />}
              disabled={moves.length === 0}
              onClick={() => {
                setOccupancy({});
                setPickedSeatId(null);
              }}
            >
              Reset
            </Button>
            <Button
              color="secondary"
              size="compact-sm"
              radius="xl"
              leftSection={<X size={12} />}
              onClick={onExitSimulation}
            >
              Exit
            </Button>
          </Group>
        </Paper>
      )}

      {/* Panel layer heatmap — floating sisi kiri, hanya di tab Heatmap */}
      {tab === "heatmap" && (
        <div
          data-no-drag
          style={{
            position: "absolute",
            // digeser turun kalau banner simulasi sedang tampil
            top: simulationMode ? 56 : 16,
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
                onEmployeeClick={onEmployeeClick}
                sim={sim}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
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
