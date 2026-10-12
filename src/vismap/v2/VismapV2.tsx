import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
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
import OrgCardV2, { type CardFieldVisibility } from "./OrgCardV2";
import { Paper, Group, Stack, Text, Badge, Button, Textarea } from "@mantine/core";
import {
  LAYERS,
  isVacant,
  isLayerLocked,
  readinessColor,
  readinessOf,
  successionRiskColorFromScores,
  type LayerId,
} from "./layers";
import { computeInitiativeSuccess, initiativeSuccessColor, type Initiative } from "./initiatives";
import { INITIATIVES_SEED } from "./initiativesSeed";
import HistoryTimeline from "./HistoryTimeline";
import { buildHistory } from "./orgHistory";
import DevelopmentPanelV3 from "../v3/components/DevelopmentPanelV3";

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
 * CardActionMenu).
 */
interface CardCtx {
  occupantOf: (seatId: string) => Employee | null;
  /** Penghuni kursi sebelum simulasi, menurut checkpoint riwayat yang aktif. */
  baseOccupantOf: (seatId: string) => Employee | null;
  /** Kursi yang sedang "diangkat" untuk ditukar (setelah pilih Simulate di menu). */
  pendingSwapSeatId: string | null;
  changedSeats: Set<string>;
  goalOf: (personId: string) => Initiative | undefined;
  onCardClick: (seatId: string, e: React.MouseEvent) => void;
  /** Mode pilih-untuk-Compare aktif — semua kartu berorang dapat checkbox. */
  compareMode: boolean;
  isSelectedForCompare: (personId: string) => boolean;
  /**
   * Tebal garis konektor DALAM KOORDINAT KANVAS (sebelum di-scale).
   * Garis 1px yang ikut di-scale akan hilang begitu zoom turun — di 7% tebalnya
   * jadi 0,07px. Angka ini dibalik terhadap zoom supaya tebal di layar tetap
   * sekitar 1px berapa pun zoom-nya.
   */
  lineW: number;
  /** Zoom kanvas saat ini (persen). Dipakai label LOD, lihat AreaLabel. */
  zoom: number;
  /** Kursi yang belum ada pada checkpoint riwayat yang sedang dilihat. */
  hiddenSeats: Set<string>;
  /** Data tambahan yang dipilih user lewat "Filter Card Data". */
  fields?: CardFieldVisibility;
  /** Kursi yang menu aksinya sedang terbuka. */
  menuSeatId: string | null;
}

/*
 * Label wilayah bergaya peta.
 *
 * Saat zoom jauh, kartu cuma jadi bintik dan tidak ada cara tahu bagian mana
 * yang sedang dilihat. Maka setiap kursi yang punya bawahan diberi label —
 * dan seperti peta yang memunculkan negara dulu, baru provinsi, baru jalan,
 * kedalaman kursi menentukan sejak zoom berapa labelnya ikut muncul.
 *
 * Indeks = kedalaman. Lebih dalam dari daftar ini tidak pernah diberi label:
 * pada zoom segitu strip posisi di kartunya sendiri sudah terbaca.
 */
const LABEL_FROM_ZOOM = [0, 9, 18, 30];
/** Di atas ini kartunya sudah terbaca sendiri, jadi semua label dilepas. */
const LABEL_UNTIL_ZOOM = 55;
/** Tinggi teks label di LAYAR (px) — konstan, tidak ikut ter-scale kanvas. */
const LABEL_SCREEN_SIZE = 10;

function AreaLabel({ text, depth, zoom }: { text: string; depth: number; zoom: number }) {
  const from = LABEL_FROM_ZOOM[depth];
  if (from === undefined || zoom < from || zoom >= LABEL_UNTIL_ZOOM) return null;

  // Semua ukuran dibalik terhadap zoom supaya label tampil sama besar di layar
  // berapa pun kanvasnya diperkecil — persis perilaku label peta.
  const k = 100 / zoom;
  // Yang lebih dangkal ditulis lebih besar, jadi hierarkinya kebaca sekilas.
  const emphasis = depth === 0 ? 1.35 : depth === 1 ? 1.15 : 1;
  const size = LABEL_SCREEN_SIZE * emphasis * k;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: 6 * k,
        padding: `${2 * k}px ${7 * k}px`,
        borderRadius: 999 * k,
        background: "rgba(255,255,255,0.92)",
        border: `${k}px solid #dee2e6`,
        boxShadow: `0 ${k}px ${3 * k}px rgba(0,0,0,0.10)`,
        fontSize: size,
        lineHeight: 1.25,
        fontWeight: 800,
        letterSpacing: 0.2 * k,
        color: "#016699",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      {text}
    </div>
  );
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
  depth = 0,
}: {
  node: OrgChartNode;
  layers: Set<LayerId>;
  heatmapConfig: HeatmapConfig;
  card: CardCtx;
  /** Kedalaman kursi ini di pohon — menentukan tingkat label LOD-nya. */
  depth?: number;
  /** Posisi atasan langsung kursi ini (untuk % Ready to Promote). undefined = root, tidak ada atasan. */
  promotionTarget?: string;
}) {
  const [expanded, setExpanded] = useState(true);
  // Cabang yang belum terbentuk pada tanggal ini tidak dirender sama sekali —
  // bukan disamarkan — supaya tata letaknya benar-benar menyempit dan pergeseran
  // kartu tetangganya terlihat saat timeline diputar.
  const reports = (node.reports ?? []).filter(r => !card.hiddenSeats.has(r.id));
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
        {hasReports && <AreaLabel text={node.position} depth={depth} zoom={card.zoom} />}
        <OrgCardV2
          seat={node}
          person={person}
          layers={layers}
          heatmapConfig={heatmapConfig}
          riskColor={riskColor}
          picked={card.pendingSwapSeatId === node.id}
          isSwapTarget={!!card.pendingSwapSeatId && card.pendingSwapSeatId !== node.id}
          changed={card.changedSeats.has(node.id)}
          // Occupant kursi ini sebelum simulasi — pada checkpoint lama bisa jadi
          // orang yang sekarang sudah tidak ada di struktur.
          previousPerson={card.changedSeats.has(node.id) ? card.baseOccupantOf(node.id) : null}
          goal={latestInitiative}
          selectable={card.compareMode}
          selected={!!person && card.isSelectedForCompare(person.id)}
          fields={card.fields}
          menuOpen={card.menuSeatId === node.id}
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

      {hasReports && expanded && <div style={{ width: card.lineW, height: 24, background: baseLine }} />}

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
                        className="absolute"
                        style={{
                          top: 0,
                          height: card.lineW,
                          left: 0,
                          right: "50%",
                          background: `linear-gradient(to right, ${baseLine}, ${stalkColor})`,
                        }}
                      />
                    )}
                    {!isLast && (
                      <div
                        className="absolute"
                        style={{
                          top: 0,
                          height: card.lineW,
                          left: "50%",
                          right: 0,
                          background: `linear-gradient(to right, ${stalkColor}, ${baseLine})`,
                        }}
                      />
                    )}
                  </>
                )}
                <div style={{ width: card.lineW, height: 24, background: stalkColor }} />
                <NodeV2
                  node={report}
                  layers={layers}
                  heatmapConfig={heatmapConfig}
                  card={card}
                  promotionTarget={node.position}
                  depth={depth + 1}
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
  activeLayers: Set<LayerId>;
  /**
   * Mode riwayat: timeline muncul dan kanvas mengambil seluruh layar.
   * Sidebar dan header ditutupi — memutar dua tahun perubahan struktur butuh
   * lebar sebanyak mungkin, dan menu navigasi tidak dipakai selama menonton.
   */
  historyMode?: boolean;
  /**
   * Data opsional yang dicetak di kartu — dipilih lewat modal "Filter Card Data"
   * yang sama dengan V1/V3, jadi pilihannya konsisten antar-versi.
   */
  visibleColumns?: CardFieldVisibility;
  onToggleLayer: (id: LayerId) => void;
  /** offset dari atas viewport (di bawah top bar Vismap) */
  top: number;
}

/**
 * Batas zoom kanvas V2. Batas bawahnya jauh di bawah V1 (25%): org chart penuh
 * saat ini ~19.400px lebar, jadi memuat semuanya di layar 1.5k butuh sekitar 8%.
 */
const MIN_ZOOM = 5;
const MAX_ZOOM = 200;

export default function VismapV2({
  orgChart,
  heatmapConfig,
  activeLayers,
  onToggleLayer,
  top,
  historyMode = false,
  visibleColumns,
}: Props) {
  // Pan/zoom: turunan dari V1 (App.tsx handleZoomIn/Out/ResetView/Wheel/DoubleClick),
  // zoom mengikuti titik kursor. Bedanya batas bawah: V1 berhenti di 25%, sementara
  // org chart V2 memakai kartu yang jauh lebih tinggi (foto persegi 1:1) sehingga
  // pada 25% pun barisan terbawah masih di luar layar. Batasnya diturunkan ke 10%
  // dan tombol "fit" menghitung sendiri skala yang memuat seluruh kartu.
  const INITIAL_ZOOM = 45;
  const INITIAL_POSITION = { x: 0, y: 150 };
  const containerRef = useRef<HTMLDivElement>(null);
  /** Isi kanvas yang belum ter-scale — dipakai mengukur ukuran asli org chart. */
  const contentRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [position, setPosition] = useState(INITIAL_POSITION);
  // Panel layer bisa dikuncupkan: ia menempati sudut kiri atas kanvas, dan pada
  // struktur selebar ini sudut itu sering berisi kartu yang ingin dilihat.
  const [layerPanelOpen, setLayerPanelOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  /*
   * Layer yang menyala apa adanya.
   *
   * Dulu ada tab Default yang memaksa daftar ini jadi kosong. Tab itu dibuang:
   * "tanpa layer" sudah bisa dicapai dengan mematikan semua layer di panel
   * kiri, jadi tab tersebut cuma cara kedua untuk keadaan yang sama — dan
   * selama ia aktif, panel layernya ikut disembunyikan sehingga jalan keluarnya
   * malah tidak terlihat.
   */
  const layers: Set<LayerId> = activeLayers;

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

  /** seatId -> seatId atasannya. Dipakai menebak target jabatan di panel Development. */
  const parentSeatOf = useMemo(() => {
    const m = new Map<string, string>();
    const walk = (n: OrgChartNode) => (n.reports ?? []).forEach(r => { m.set(r.id, n.id); walk(r); });
    orgChart.forEach(walk);
    return m;
  }, [orgChart]);

  /** seatId -> employeeId yang menempatinya. Hanya berisi kursi yang diubah simulasi. */
  const [occupancy, setOccupancy] = useState<Record<string, string>>({});
  const [pendingSwapSeatId, setPendingSwapSeatId] = useState<string | null>(null);

  // ---------- RIWAYAT / TIMELINE ----------
  const history = useMemo(() => buildHistory(orgChart), [orgChart]);
  const [cpIndex, setCpIndex] = useState(history.checkpoints.length - 1);
  const [playing, setPlaying] = useState(false);
  const checkpoint = history.checkpoints[Math.min(cpIndex, history.checkpoints.length - 1)];
  const hiddenSeats = useMemo(() => new Set(checkpoint.hiddenSeats), [checkpoint]);

  /** Data orang, termasuk yang sudah resign dan hanya ada di checkpoint lama. */
  const peopleById = useMemo(() => {
    const m = new Map<string, Employee>(seats.map(s => [s.id, s as Employee]));
    for (const [id, emp] of Object.entries(history.people)) if (!m.has(id)) m.set(id, emp);
    return m;
  }, [seats, history]);

  /**
   * Penghuni kursi menurut checkpoint aktif — yaitu sebelum simulasi ditumpuk.
   * Dipisah karena panel simulasi dan jejak "was here" perlu tahu siapa yang
   * digeser, dan di checkpoint lama orang itu bisa saja alumni, bukan penghuni
   * hari ini.
   */
  const baseOccupantOf = (seatId: string): Employee | null => {
    const seat = seatById.get(seatId);
    if (!seat) return null;
    const fromHistory = seatId in checkpoint.occupancy ? checkpoint.occupancy[seatId] : undefined;
    const holderId = fromHistory !== undefined ? fromHistory : isVacant(seat) ? null : seatId;
    if (!holderId) return null;
    const holder = peopleById.get(holderId);
    return holder && !isVacant(holder) ? holder : null;
  };

  const occupantOf = (seatId: string): Employee | null => {
    // Urutannya: simulasi (paling atas) → riwayat → data hari ini. Simulasi
    // memang harus menang, karena user menggesernya di atas kondisi yang tampil.
    const seat = seatById.get(seatId);
    if (!seat) return null;
    const fromHistory = seatId in checkpoint.occupancy ? checkpoint.occupancy[seatId] : undefined;
    const base = fromHistory !== undefined ? fromHistory : isVacant(seat) ? null : seatId;
    const holderId = occupancy[seatId] ?? base;
    if (!holderId) return null;
    const holder = peopleById.get(holderId);
    if (!holder || isVacant(holder)) return null;
    return holder;
  };

  /*
   * ANIMASI PERPINDAHAN ANTAR-CHECKPOINT (teknik FLIP)
   *
   * Posisi kartu ditentukan flex, bukan koordinat, jadi tidak ada properti yang
   * bisa di-transisikan langsung. Maka: ukur posisi semua kartu SEBELUM pindah
   * checkpoint, render struktur baru, lalu balikkan tiap kartu ke posisi lamanya
   * lewat transform dan animasikan kembali ke nol.
   *
   * Perpindahan ORANG antar-kursi tidak ikut terlihat dari FLIP — kartunya milik
   * kursi, dan kursinya diam. Untuk itu dibuat "ghost": foto orangnya terbang dari
   * kursi lama ke kursi baru di atas kanvas.
   */
  const rectsRef = useRef<Map<string, DOMRect>>(new Map());
  const animJob = useRef<{ from: number; to: number } | null>(null);
  /**
   * Gerak dan makna sengaja dipisah jadi dua sumbu.
   *
   * motion — bagaimana ia bergerak: "move" melintang ke kursi tujuan, "exit"
   *   jatuh ke bawah, "enter" naik dari bawah. Saat timeline diputar MUNDUR,
   *   motion-nya terbalik: resign jadi "enter", rekrutmen jadi "exit".
   * tone — apa artinya, dan itu yang menentukan warna: "leave" merah untuk
   *   resign, "join" hijau untuk rekrutan baru. Warnanya tidak ikut terbalik
   *   saat diputar mundur — orangnya tetap orang yang sama.
   */
  type Ghost = {
    key: string;
    name: string;
    img?: string;
    from: DOMRect;
    to?: DOMRect;
    motion: "move" | "exit" | "enter";
    tone: "leave" | "join";
    /** Jeda sebelum animasinya mulai (ms) — lihat GHOST_STAGGER. */
    delay: number;
  };
  const [ghosts, setGhosts] = useState<Ghost[]>([]);

  const cardRects = () => {
    const m = new Map<string, DOMRect>();
    document.querySelectorAll<HTMLElement>("[data-orgcard-v2]").forEach(el => {
      const id = el.getAttribute("data-orgcard-v2");
      if (id) m.set(id, el.getBoundingClientRect());
    });
    return m;
  };

  const gotoCheckpoint = (next: number) => {
    const clamped = Math.max(0, Math.min(history.checkpoints.length - 1, next));
    if (clamped === cpIndex) return;
    rectsRef.current = cardRects();
    animJob.current = { from: cpIndex, to: clamped };
    // Hasil simulasi dibuang: ia ditumpuk di atas kondisi hari ini, jadi tidak
    // punya arti di tanggal lain.
    setOccupancy({});
    setPendingSwapSeatId(null);
    setCardMenu(null);
    setCpIndex(clamped);
  };

  useLayoutEffect(() => {
    const job = animJob.current;
    animJob.current = null;
    if (!job) return;
    const prev = rectsRef.current;
    const DURATION = 620;
    const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

    document.querySelectorAll<HTMLElement>("[data-orgcard-v2]").forEach(el => {
      const id = el.getAttribute("data-orgcard-v2")!;
      const before = prev.get(id);
      const now = el.getBoundingClientRect();
      if (!before) {
        // Kursi yang baru muncul pada tanggal ini.
        el.animate([{ opacity: 0, transform: "scale(0.82)" }, { opacity: 1, transform: "none" }], { duration: DURATION, easing: EASE });
        return;
      }
      const dx = before.left - now.left;
      const dy = before.top - now.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: DURATION, easing: EASE });
    });

    // Ghost hanya untuk lompatan satu langkah; kalau user meloncat jauh di track,
    // menerbangkan puluhan foto sekaligus justru mengaburkan apa yang berubah.
    if (Math.abs(job.to - job.from) !== 1) return;
    const forward = job.to > job.from;
    const cp = history.checkpoints[forward ? job.to : job.from];
    const now = cardRects();
    const flying = cp.events
      .map((ev, i): Ghost | null => {
        const person = ev.personId ? peopleById.get(ev.personId) : undefined;
        const key = `${cp.id}-${i}-${job.to}`;

        if (ev.kind === "move" && ev.fromSeatId) {
          // Mundur = perpindahannya dibalik arah.
          const fromSeat = forward ? ev.fromSeatId : ev.seatId;
          const toSeat = forward ? ev.seatId : ev.fromSeatId;
          const a = prev.get(fromSeat);
          const b = now.get(toSeat);
          if (!a || !b) return null;
          return { key, name: person?.name ?? "", img: person?.imageUrl, from: a, to: b, motion: "move", tone: "join", delay: 0 };
        }

        // Resign dan rekrutmen adalah pasangan berlawanan: yang satu keluar dari
        // struktur, yang satu masuk. Keduanya dihitung dengan aturan yang sama —
        // kalau orangnya ADA di keadaan baru, kotak acuannya diambil dari
        // pengukuran sesudah render; kalau tidak, dari pengukuran sebelumnya.
        if (ev.kind === "resign" || ev.kind === "hire") {
          const presentAfter = forward ? ev.kind === "hire" : ev.kind === "resign";
          const box = (presentAfter ? now : prev).get(ev.seatId);
          if (!box) return null;
          return {
            key,
            name: person?.name ?? "",
            img: person?.imageUrl,
            from: box,
            motion: presentAfter ? "enter" : "exit",
            tone: ev.kind === "hire" ? "join" : "leave",
            delay: 0,
          };
        }

        return null;
      })
      .filter((g): g is Ghost => g !== null);

    /*
     * Ghost-nya dijalankan BERURUTAN, bukan serentak.
     *
     * Satu peristiwa adalah rantai sebab-akibat: ada yang resign, kursinya baru
     * kemudian diisi, dan kursi yang ditinggalkan si pengisi baru kemudian
     * direkrut. Kalau ketiganya bergerak bersamaan, urutan sebab-akibat itu
     * hilang dan yang terlihat cuma tiga foto melintas acak.
     *
     * Urutannya mengikuti urutan event di checkpoint; saat timeline diputar
     * mundur, rantainya dibalik — yang terakhir terjadi yang pertama dibatalkan.
     */
    const ordered = forward ? flying : [...flying].reverse();
    const staggered = ordered.map((g, i) => ({ ...g, delay: i * GHOST_STAGGER }));
    if (staggered.length) setGhosts(staggered);
    // Sengaja hanya bergantung pada cpIndex: efek ini harus jalan tepat sekali
    // per perpindahan checkpoint. Menambah dependensi lain membuatnya terpicu
    // ulang di tengah animasi dan kartunya tersentak balik.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpIndex]);

  // Ghost dilepas setelah rantai TERPANJANG selesai — bukan setelah durasi satu
  // ghost, karena yang terakhir baru mulai setelah semua jedanya lewat.
  useEffect(() => {
    if (ghosts.length === 0) return;
    const last = Math.max(...ghosts.map(g => g.delay));
    const t = setTimeout(() => setGhosts([]), last + GHOST_DURATION + 150);
    return () => clearTimeout(t);
  }, [ghosts]);

  /*
   * Masuk mode riwayat langsung memuat seluruh struktur ke layar.
   *
   * requestAnimationFrame-nya perlu: saat efek ini jalan, kanvas baru saja
   * melebar ke seluruh layar tapi browser belum menghitung ulang ukurannya, jadi
   * fit yang dihitung saat itu juga memakai lebar yang lama.
   */
  useEffect(() => {
    if (!historyMode) return;
    const id = requestAnimationFrame(() => handleFitToScreen());
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyMode]);

  // Meninggalkan mode riwayat selalu mengembalikan kanvas ke hari ini — kalau
  // tidak, mode biasa bisa menampilkan struktur dua tahun lalu tanpa satu pun
  // penanda bahwa yang dilihat bukan kondisi sekarang.
  useEffect(() => {
    if (historyMode) return;
    setPlaying(false);
    setCpIndex(history.checkpoints.length - 1);
  }, [historyMode, history.checkpoints.length]);

  // Pemutaran otomatis: satu checkpoint per jeda, berhenti sendiri di hari ini.
  useEffect(() => {
    if (!playing) return;
    if (cpIndex >= history.checkpoints.length - 1) {
      setPlaying(false);
      return;
    }
    // Jedanya harus lebih panjang dari rantai terpanjang (3 ghost berurutan),
    // kalau tidak checkpoint berikutnya memotong animasi yang belum selesai.
    const t = setTimeout(() => gotoCheckpoint(cpIndex + 1), 2 * GHOST_STAGGER + GHOST_DURATION + 400);
    return () => clearTimeout(t);
    // gotoCheckpoint dibuat ulang tiap render; memasukkannya ke dependensi akan
    // me-reset timer pemutaran terus-menerus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, cpIndex]);

  const changedSeats = useMemo(
    () => new Set(Object.entries(occupancy).filter(([seatId, empId]) => seatId !== empId).map(([seatId]) => seatId)),
    [occupancy],
  );

  /** Daftar perubahan untuk panel: kursi + siapa yang menempatinya sekarang. */
  const moves = [...changedSeats].map(seatId => ({
    seat: seatById.get(seatId)!,
    now: occupantOf(seatId),
    before: baseOccupantOf(seatId) ?? seatById.get(seatId)!,
  }));

  // ---------- INITIATIVES ----------
  // personId -> daftar inisiatif orang itu. State lokal murni (demo), tidak persisten.
  const [initiativesByPerson, setInitiativesByPerson] = useState<Record<string, Initiative[]>>(() => ({ ...INITIATIVES_SEED }));
  const [goalsPersonId, setGoalsPersonId] = useState<string | null>(null);
  /**
   * Kursi yang panel Development-nya sedang dibuka. Yang disimpan kursinya, bukan
   * orangnya: panel butuh jabatan kursi ini DAN jabatan atasannya sebagai target
   * pengembangan — keduanya sifat kursi, bukan sifat orang.
   */
  const [devSeatId, setDevSeatId] = useState<string | null>(null);

  /*
   * Klik di luar panel Development menutupnya.
   *
   * Dipasang pada fase CAPTURE dan memakai pointerdown: menu aksi kartu juga
   * menutup dirinya lewat listener serupa, dan tanpa capture urutan keduanya
   * bergantung pada urutan pemasangan listener — bukan sesuatu yang boleh
   * dijadikan sandaran.
   *
   * Kotak dialog Mantine (dropdown Select) di-portal ke luar panel, jadi
   * klik di dalamnya akan terbaca sebagai "di luar" kalau tidak dikecualikan.
   */
  useEffect(() => {
    if (!devSeatId) return;
    const onDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      if (el.closest('[data-name="Development Panel V3"]')) return;
      if (el.closest("[data-mantine-stop-propagation], .mantine-Popover-dropdown, [role='listbox']")) return;
      setDevSeatId(null);
    };
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
  }, [devSeatId]);

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
  // Posisinya dihitung dari
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
    baseOccupantOf,
    pendingSwapSeatId,
    changedSeats,
    goalOf: latestInitiativeOf,
    onCardClick,
    compareMode,
    isSelectedForCompare: (personId: string) => compareIds.includes(personId),
    lineW: Math.max(1, Math.round((100 / zoom) * 100) / 100),
    zoom,
    hiddenSeats,
    fields: visibleColumns,
    menuSeatId: cardMenu?.seatId ?? null,
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
    // Sama dengan V3: panel geser dari kanan, bukan pindah ke halaman IDP.
    // Membandingkan aspek sambil melihat org chart-nya jauh lebih berguna
    // daripada meninggalkan peta hanya untuk membaca daftar aspek.
    if (!cardMenu) return;
    setDevSeatId(cardMenu.seatId);
    setGoalsPersonId(null);
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
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
    if (newZoom === zoom) return;
    const zoomRatio = newZoom / zoom;
    setPosition(prev => ({
      x: centerX - (centerX - prev.x) * zoomRatio,
      y: centerY - (centerY - prev.y) * zoomRatio,
    }));
    setZoom(newZoom);
  };

  // Langkahnya mengecil di bawah 50% supaya lompatan 10% tidak terasa kasar
  // ketika satu langkah sudah berarti seperlima ukuran tampilan.
  const zoomStep = (from: number) => (from <= 25 ? 2 : from <= 50 ? 5 : 10);
  const handleZoomIn = () => zoomAtViewportCenter(zoom + zoomStep(zoom));
  const handleZoomOut = () => zoomAtViewportCenter(zoom - zoomStep(zoom - 1));

  /**
   * Zoom ke skala yang memuat SELURUH org chart, lalu diletakkan di tengah.
   * offsetWidth/offsetHeight tidak terpengaruh transform induknya, jadi angka
   * yang dibaca di sini adalah ukuran asli kanvas pada 100%.
   */
  const handleFitToScreen = () => {
    const box = containerRef.current;
    const content = contentRef.current;
    if (!box || !content) return;
    const rect = box.getBoundingClientRect();
    const w = content.offsetWidth;
    const h = content.offsetHeight;
    if (!w || !h) return;
    const FIT_MARGIN = 0.94;
    const raw = Math.min(rect.width / w, rect.height / h) * 100 * FIT_MARGIN;
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.floor(raw)));
    setZoom(next);
    // Kanvas sudah berada di left:50% dan isinya digeser -50% lebarnya sendiri,
    // jadi x = 0 berarti terpusat horizontal; tinggal menengahkan vertikalnya.
    setPosition({ x: 0, y: Math.max(0, (rect.height - (h * next) / 100) / 2) });
  };

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
    if (zoom >= MAX_ZOOM) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const newZoom = Math.min(zoom + 20, MAX_ZOOM);
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

    const zoomChange = -e.deltaY > 0 ? zoomStep(zoom) : -zoomStep(zoom - 1);
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + zoomChange));
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
          // Dikunci = sedang dinyalakan paksa oleh layer lain. Tetap tampil
          // tercentang, tapi tidak bisa dimatikan dari sini; keterangan kecil
          // di bawahnya menjelaskan siapa yang menahannya.
          const locked = isLayerLocked(l.id, activeLayers);
          return (
            <label
              key={l.id}
              title={locked ? "Dinyalakan oleh Succession Risk — matikan layer itu dulu" : undefined}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 7,
                cursor: locked ? "not-allowed" : "pointer",
                padding: "4px 6px",
                borderRadius: 6,
                background: on ? "rgba(1,102,153,0.07)" : "transparent",
              }}
            >
              <input
                type="checkbox"
                checked={on}
                disabled={locked}
                onChange={() => onToggleLayer(l.id)}
                style={{ accentColor: "#016699", marginTop: 2, cursor: locked ? "not-allowed" : "pointer" }}
              />
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 11, fontWeight: 700, color: locked ? "#495057" : "#212529" }}>{l.label}</span>
                <span style={{ display: "block", fontSize: 9, color: "#6c757d" }}>
                  {locked ? "Mengikuti Succession Risk" : l.hint}
                </span>
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
        // Mode riwayat menimpa sidebar (z-index 50) dan header (40), jadi
        // z-index-nya harus di atas keduanya.
        left: historyMode ? 0 : "var(--sidebar-w, 220px)",
        top: historyMode ? 0 : top,
        zIndex: historyMode ? 60 : 40,
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

      {/* Panel layer heatmap — floating sisi kiri. Disembunyikan di mode riwayat:
          di sana perhatiannya pada pergerakan kartu antar-tanggal, dan panel ini
          menutupi sudut kiri kanvas yang justru penuh terpakai setelah fit. */}
      {!historyMode && (
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
          {/* Seluruh baris judul jadi tombol kuncup/kembang — sasaran kliknya
              selebar panel, bukan cuma ikon kecil di ujung. */}
          <button
            onClick={() => setLayerPanelOpen(v => !v)}
            title={layerPanelOpen ? "Kuncupkan panel" : "Kembangkan panel"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              width: "100%",
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              marginBottom: layerPanelOpen ? 4 : 0,
            }}
          >
            <LayersIcon size={13} style={{ color: "#016699", flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: "#016699", flex: 1, textAlign: "left" }}>
              Heatmap Layer
            </span>
            {/* Saat kuncup, jumlah layer aktif tetap terlihat — kalau tidak, ada
                warna di kanvas tanpa petunjuk apa pun soal asalnya. */}
            {!layerPanelOpen && activeLayers.size > 0 && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: "white",
                  background: "#016699",
                  borderRadius: 20,
                  padding: "1px 6px",
                  flexShrink: 0,
                }}
              >
                {activeLayers.size}
              </span>
            )}
            {layerPanelOpen
              ? <ChevronUp size={14} style={{ color: "#868e96", flexShrink: 0 }} />
              : <ChevronDown size={14} style={{ color: "#868e96", flexShrink: 0 }} />}
          </button>

          {layerPanelOpen && (
          <>
          <div style={{ fontSize: 9, color: "#6c757d", marginBottom: 10, lineHeight: 1.4 }}>
            Can be switched on together — seat and people signals occupy different areas of the card.
          </div>

          {renderGroup("SEAT / POSITION", "Attached to the job", positionLayers)}
          <div style={{ height: 1, background: "#e9ecef", margin: "0 0 12px" }} />
          {renderGroup("PEOPLE", "Attached to the individual", personLayers)}

          {activeLayers.size > 0 && (
            <button
              // Succession Risk dimatikan lebih dulu supaya kuncian pada
              // % Ready ikut terlepas sebelum gilirannya tiba.
              onClick={() => [...LAYERS].sort((a, b) => (a.id === "succession-risk" ? -1 : b.id === "succession-risk" ? 1 : 0))
                .forEach((l) => activeLayers.has(l.id) && onToggleLayer(l.id))}
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
          </>
          )}
        </div>
      )}

      {/* Panel Development — komponen yang sama dengan V3 supaya perilakunya
          identik dan tidak ada versi kedua yang harus dirawat terpisah.

          Di-portal ke document.body seperti floating menu kartu. Kanvas ini
          punya z-index sendiri (40), dan itu membuat stacking context: selama
          panel dirender di dalamnya, z-index 100 miliknya hanya berlaku
          RELATIF terhadap kanvas — jadi ia tetap kalah dari bilah kendali di
          atas (z-index 50) dan tombol-tombolnya menembus panel. */}
      {devSeatId && typeof document !== "undefined" && (() => {
        const seat = seatById.get(devSeatId);
        const person = occupantOf(devSeatId);
        if (!seat || !person) return null;
        const parentId = parentSeatOf.get(devSeatId);
        return createPortal(
          <div data-no-drag>
            <DevelopmentPanelV3
              employeeId={person.id}
              employeeName={person.name}
              employeePosition={seat.position}
              managerPosition={parentId ? seatById.get(parentId)?.position ?? null : null}
              onClose={() => setDevSeatId(null)}
            />
          </div>,
          document.body,
        );
      })()}

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
        <button onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM} title="Zoom In" style={zoomBtn}>
          <ZoomIn size={15} />
        </button>
        <span style={{ fontSize: 11, color: "#495057" }}>{zoom}%</span>
        <button onClick={handleZoomOut} disabled={zoom <= MIN_ZOOM} title="Zoom Out" style={zoomBtn}>
          <ZoomOut size={15} />
        </button>
        <div style={{ width: "100%", height: 1, background: "#e9ecef" }} />
        <button onClick={handleFitToScreen} onDoubleClick={handleResetView} title="Fit to Screen (klik ganda: reset)" style={zoomBtn}>
          <Maximize2 size={15} />
        </button>
      </div>

      {/* Timeline riwayat struktur — hanya di mode riwayat. Di mode biasa kartu
          ini cuma memakan tinggi kanvas untuk kendali yang tidak sedang dipakai. */}
      {historyMode && (
      <HistoryTimeline
        checkpoints={history.checkpoints}
        index={cpIndex}
        playing={playing}
        onSelect={(i) => { setPlaying(false); gotoCheckpoint(i); }}
        onTogglePlay={() => {
          // Menekan play di ujung riwayat = putar ulang dari awal.
          if (!playing && cpIndex >= history.checkpoints.length - 1) gotoCheckpoint(0);
          setPlaying(!playing);
        }}
        onRestart={() => { setPlaying(false); gotoCheckpoint(0); }}
      />
      )}

      {/* Ghost: foto orang yang berpindah kursi, terbang di atas kanvas.
          Di-portal ke body supaya koordinat viewport-nya tidak kena transform pan/zoom. */}
      {ghosts.length > 0 && typeof document !== "undefined" && createPortal(
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 120 }}>
          {ghosts.map(g => (
            <GhostCard key={g.key} name={g.name} img={g.img} from={g.from} to={g.to} motion={g.motion} tone={g.tone} delay={g.delay} />
          ))}
        </div>,
        document.body,
      )}

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
        <div ref={contentRef} style={{ transform: "translateX(-50%)", padding: 24 }}>
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
            <CardMenuButton icon={<User size={13} />} label="iProfile" onClick={handleMenuIProfile} disabled={!menuPerson} />
            <CardMenuButton icon={<GraduationCap size={13} />} label="Development" onClick={handleMenuDevelopment} disabled={!menuPerson} />
            <CardMenuButton icon={<Columns3 size={13} />} label="Compare" onClick={handleMenuCompare} disabled={!menuPerson} />
            <CardMenuButton icon={<Target size={13} />} label="Initiatives" onClick={handleMenuInitiatives} disabled={!menuPerson} accent={GOAL_ACCENT} />
            <CardMenuButton icon={<Shuffle size={13} />} label="Simulate" onClick={handleMenuSimulate} isLast />
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

/** Jeda antar-ghost dalam satu rantai peristiwa (ms). */
const GHOST_STAGGER = 520;
/** Durasi satu ghost (ms) — dipakai juga untuk menghitung kapan rantai selesai. */
const GHOST_DURATION = 950;

const RESIGN_COLOR = "#e03131";
const HIRE_COLOR = "#2f9e44";
const MOVE_COLOR = "#016699";

/**
 * Foto seseorang yang sedang bergerak di atas kanvas.
 *
 * Tiga gerak dengan arti yang sengaja dibedakan tajam:
 *   - move  : melengkung MENDATAR ke kursi tujuan, biru — pindah kursi.
 *   - exit  : jatuh KE BAWAH sambil memudar — keluar dari struktur.
 *   - enter : naik DARI BAWAH — masuk ke struktur.
 * Sumbu mendatar khusus perpindahan antar-kursi dan sumbu tegak khusus
 * keluar/masuk organisasi, jadi keduanya tidak pernah tertukar walau terjadi
 * berbarengan dalam satu peristiwa. Warnanya membedakan sebabnya: merah resign,
 * hijau rekrutan baru.
 *
 * Ukurannya mengikuti kartu asal, jadi pada zoom jauh ghost-nya ikut kecil dan
 * tetap terbaca sebagai "kartu yang itu", bukan elemen asing di atas kanvas.
 */
function GhostCard({
  name,
  img,
  from,
  to,
  motion,
  tone,
  delay,
}: {
  name: string;
  img?: string;
  from: DOMRect;
  to?: DOMRect;
  motion: "move" | "exit" | "enter";
  tone: "leave" | "join";
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (motion === "move" && to) {
      const dx = to.left - from.left;
      const dy = to.top - from.top;
      el.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 0 },
          { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 18}px) scale(1.12)`, opacity: 1, offset: 0.45 },
          { transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 0 },
        ],
        // fill "both" menahan keyframe pertama selama jeda DAN mempertahankan
        // keyframe terakhir sesudahnya; tanpa itu ghost yang menunggu gilirannya
        // tampil utuh di posisi awal, dan yang sudah selesai melompat balik ke
        // kursinya dengan opacity penuh sampai dibersihkan.
        { duration: 850, delay, fill: "both", easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
      );
      return;
    }

    // Jarak jatuh diukur dari tinggi kartu, bukan angka piksel tetap: di zoom
    // jauh 300px berarti melintasi separuh layar, di zoom dekat nyaris tak
    // terlihat. Kelipatan tinggi kartu membuatnya terasa sama di mana pun.
    const drop = Math.max(90, from.height * 2.6);
    const fall: Keyframe[] = [
      { transform: "translateY(0) scale(1) rotate(0deg)", opacity: 1, offset: 0 },
      { transform: `translateY(${drop * 0.28}px) scale(0.96) rotate(4deg)`, opacity: 0.95, offset: 0.35 },
      { transform: `translateY(${drop}px) scale(0.72) rotate(10deg)`, opacity: 0, offset: 1 },
    ];
    const rise: Keyframe[] = [
      { transform: `translateY(${drop}px) scale(0.72) rotate(10deg)`, opacity: 0, offset: 0 },
      { transform: `translateY(${drop * 0.28}px) scale(0.96) rotate(4deg)`, opacity: 0.95, offset: 0.65 },
      { transform: "translateY(0) scale(1) rotate(0deg)", opacity: 1, offset: 1 },
    ];
    el.animate(motion === "exit" ? fall : rise, {
      duration: GHOST_DURATION,
      delay,
      fill: "both",
      // Turun dipercepat di akhir (seperti gravitasi); naik justru melambat saat
      // mendekati kursinya, sehingga terasa mendarat, bukan terlempar.
      easing: motion === "exit" ? "cubic-bezier(0.45, 0, 0.75, 0.35)" : "cubic-bezier(0.25, 0.65, 0.55, 1)",
    });
  }, [from, to, motion, delay]);

  const size = Math.max(18, Math.min(from.width, 120));
  const vertical = motion !== "move";
  const color = !vertical ? MOVE_COLOR : tone === "join" ? HIRE_COLOR : RESIGN_COLOR;
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: from.left + from.width / 2 - size / 2,
        top: from.top + from.height / 2 - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: `${vertical ? 3 : 2}px solid ${color}`,
        boxShadow: vertical ? `0 4px 16px ${color}66` : "0 4px 14px rgba(0,0,0,0.28)",
        background: "#e9ecef",
        opacity: vertical ? 1 : 0,
      }}
      title={vertical ? `${name} — ${tone === "join" ? "direkrut" : "resign"}` : name}
    >
      {img && <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      {/* Selubung berwarna: pada zoom jauh fotonya cuma beberapa piksel, warnanya
          yang harus menyampaikan keluar atau masuk, bukan bentuknya. */}
      {vertical && <div style={{ position: "absolute", inset: 0, background: `${color}45` }} />}
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
