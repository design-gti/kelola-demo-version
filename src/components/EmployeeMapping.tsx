"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Tabs } from "@mantine/core";
import { cellsFrom, pointsFrom, withAlpha, Z_ALPHA, type EmployeeMetrics, type TMConfig, type TMPoint, type ZRing } from "@/data/talentMappingShared";
import TMTRBox from "@/components/talent/TMTRBox";
import { BUILT_IN_TABS, getCustomTabs, getEffectiveConfig, TM_CONFIG_EVENT, TM_TABS_EVENT, type CustomTab } from "@/data/talentMappingConfig";
import { IconChevronLeft } from "@tabler/icons-react";
import TextButton from "@/components/ui/TextButton";

const avOverlay = "https://www.figma.com/api/mcp/asset/2719dfbb-ac03-4588-a503-9dbbccb2baa9";

export interface CellData {
  count: number;
  label: string;
  countColor: string;
  bg: string;
  avatars: string[];
  names: string[];
  /** Nomor box — ada pada sel hasil hitungan, dipakai untuk menaut ke detailnya. */
  order?: number;
  /** Cincin sumbu Z per avatar, sejajar indeks dengan `avatars`. */
  rings?: (ZRing | null)[];
}

/**
 * Cincin penanda sumbu Z di sekeliling avatar.
 *
 * Sengaja `box-shadow` + `outline`, bukan `border`: border memakan ruang di
 * dalam kotak 22px sehingga fotonya menyusut, sedangkan bayangan digambar di
 * luar dan ukuran wajahnya tetap. Tebal dan warnanya dari zRingFor di
 * talentMappingShared — sumber yang sama dengan 9-box di halaman penuh, supaya
 * tingkat Z yang sama tidak tergambar berbeda di dua tempat.
 */
function ringStyle(ring: ZRing | null | undefined): React.CSSProperties {
  if (!ring) return {};
  return {
    boxShadow: `0 0 0 ${ring.thickness}px ${withAlpha(ring.color, Z_ALPHA)}`,
    outline: "1.5px solid #fff",
    outlineOffset: `${ring.thickness}px`,
  };
}

function AvatarStack({ avatars, names, count, rings }: { avatars: string[]; names: string[]; count: number; rings?: (ZRing | null)[] }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const extra = count - avatars.length;

  return (
    <>
      <div
        ref={ref}
        className="flex items-center"
        onMouseEnter={() => {
          if (ref.current) {
            const r = ref.current.getBoundingClientRect();
            setPos({ x: r.left + r.width / 2, y: r.top });
          }
        }}
        onMouseLeave={() => setPos(null)}
      >
        {avatars.map((src, i) => (
          <div key={i} className="w-[22px] h-[22px] rounded-full overflow-hidden border-2 border-white flex-shrink-0 bg-[#e6f3f8]"
            style={{
              // Avatar bercincin tidak boleh saling menindih: pita warnanya
              // digambar di luar kotak 22px, jadi tumpang tindih -4px yang
              // biasa akan menutupi cincin tetangganya.
              marginRight: rings?.[i] ? `${rings[i]!.thickness + 2}px` : "-4px",
              zIndex: avatars.length - i,
              ...ringStyle(rings?.[i]),
            }}>
            <img src={src} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>
        ))}
        {extra > 0 && (
          <div className="w-[22px] h-[22px] rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ backgroundImage: `url(${avOverlay})`, backgroundSize: "cover", zIndex: 0, marginLeft: "4px" }}>
            <span className="text-white text-[12px]" style={{ fontFamily: "'Open Sans', sans-serif" }}>+{extra}</span>
          </div>
        )}
      </div>

      {pos && typeof document !== "undefined" && createPortal(
        <div style={{
          position: "fixed",
          left: pos.x,
          top: pos.y - 8,
          transform: "translate(-50%, -100%)",
          background: "#1e293b",
          color: "#fff",
          borderRadius: 8,
          padding: "8px 12px",
          zIndex: 9999,
          pointerEvents: "none",
          minWidth: 140,
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          fontFamily: "'Open Sans', sans-serif",
          fontSize: 11,
          lineHeight: "1.6",
        }}>
          {names.map((name, i) => (
            <div key={i} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#94a3b8", display: "inline-block", flexShrink: 0 }} />
              {name}
            </div>
          ))}
          {/* Arrow */}
          <div style={{
            position: "absolute", top: "100%", left: "50%",
            transform: "translateX(-50%)",
            border: "5px solid transparent",
            borderTopColor: "#1e293b",
            width: 0, height: 0,
          }} />
        </div>,
        document.body
      )}
    </>
  );
}

/**
 * Sudut membulat hanya di keempat pojok grid, dihitung dari UKURAN grid.
 *
 * Dulu dipetakan ke koordinat "0-0".."2-2" alias 3x3 mati. Kartu ini kini
 * mengikuti layout yang dipilih user di Talent Mapping — termasuk 12-box — dan
 * peta mati itu akan membulatkan sel di tengah grid sambil meninggalkan pojok
 * aslinya bersudut.
 */
function GridCell({ cell, rowIdx, colIdx, rows, cols, onOpen }: { cell: CellData; rowIdx: number; colIdx: number; rows: number; cols: number; onOpen?: () => void }) {
  const corner = [
    rowIdx === 0 && colIdx === 0 ? "rounded-tl-[8px]" : "",
    rowIdx === 0 && colIdx === cols - 1 ? "rounded-tr-[8px]" : "",
    rowIdx === rows - 1 && colIdx === 0 ? "rounded-bl-[8px]" : "",
    rowIdx === rows - 1 && colIdx === cols - 1 ? "rounded-br-[8px]" : "",
  ].filter(Boolean).join(" ");
  return (
    <div
      className={`relative overflow-hidden ${corner} ${onOpen ? "cursor-pointer" : ""}`}
      style={{ background: cell.bg }}
      onClick={onOpen}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      title={onOpen ? `Lihat detail ${cell.label}` : undefined}
      onKeyDown={onOpen ? e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } } : undefined}
    >
      <span className="absolute top-[6px] left-[6px] text-[14px] leading-none"
        style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: cell.countColor }}>
        {cell.count}
      </span>
      <span className="absolute inset-0 flex items-center justify-center text-[#495057] text-[9px] text-center px-1 pt-2"
        style={{ fontFamily: "'Open Sans', sans-serif" }}>
        {cell.label}
      </span>
      <div className="absolute bottom-[6px] left-0 right-0 flex justify-center">
        <AvatarStack avatars={cell.avatars} names={cell.names} count={cell.count} rings={cell.rings} />
      </div>
    </div>
  );
}

/**
 * Lebar grafik 9-box di mode fokus, dalam px.
 *
 * TMTRBox memakai ukuran mati (ia menempatkan titik dalam persen dari ukuran
 * itu, dan memutar blok sumbu Y dengan titik putar yang dihitung darinya).
 * Nilainya dipilih supaya grafik + blok sumbunya masuk ke lebar kartu Beranda
 * yang tersempit tanpa memaksa scroll horizontal.
 */
const FOCUS_CHART_SIZE = 290;

/**
 * Satu box dibuka utuh DI DALAM kartu ini — memakai TMTRBox, grafik yang sama
 * dengan halaman Talent Mapping.
 *
 * Sengaja bukan daftar nama: yang dilihat user adalah SEBARAN, jadi box yang
 * dibuka harus memetakan penghuninya pada koordinat sebenarnya di dalam pita
 * skornya, persis seperti mode zoom di halaman penuh. Memakai komponen yang
 * sama juga berarti keduanya tidak bisa berbeda perilaku — termasuk cincin
 * sumbu Z, peleburan titik yang bertumpuk, dan popover isi satu titik.
 *
 * Grid ringkas di kartu ini TETAP tampilan sendiri (jumlah + label + dua
 * avatar); yang berganti hanya saat satu box difokuskan.
 */
function FocusedBox({ config, points, order, onBack }: {
  config: TMConfig;
  points: TMPoint[];
  order: number;
  onBack: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col gap-[8px] min-h-0">
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          aria-label="Kembali ke semua box"
          className="flex items-center gap-[2px] text-[#495057] text-[11px] hover:text-[#1971c2]"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          <IconChevronLeft size={14} />
          Semua box
        </button>
      </div>
      {/* Grafiknya berukuran mati, jadi diletakkan di tengah lebar kartu. */}
      <div className="flex justify-center">
        <TMTRBox
          config={config}
          points={points}
          size={FOCUS_CHART_SIZE}
          selectedBox={order}
          /* Klik latar box yang di-zoom = keluar dari fokus, sama seperti di
             halaman penuh. */
          onBoxClick={o => { if (o == null) onBack(); }}
        />
      </div>
    </div>
  );
}

export default function EmployeeMapping({
  title = "Talent Mapping",
  cells: cellData,
  metrics,
  axisX = "Performance",
  axisY = "Potency",
}: {
  title?: string;
  /**
   * Sel siap pakai. Dipakai apa adanya saat `metrics` tidak diberikan — yaitu
   * tampilan manager, yang punya kumpulan karyawan sendiri dan tidak mengikuti
   * konfigurasi box mapping tingkat organisasi.
   */
  cells: CellData[];
  /**
   * Tabel metrik per karyawan. Kalau ada, kartu ini menghitung selnya SENDIRI
   * dari tab box mapping yang aktif, jadi ia menampilkan hal yang sama dengan
   * halaman Talent Mapping — termasuk tab buatan user.
   *
   * Perhitungannya harus di klien: konfigurasi dan daftar tab hidup di memori
   * sesi (lihat talentMappingConfig), yang tidak bisa dibaca server. Yang
   * dikirim ke sini cuma empat angka per orang, bukan fixture-nya.
   */
  metrics?: EmployeeMetrics[];
  axisX?: string;
  axisY?: string;
}) {
  const router = useRouter();
  const synced = !!metrics;
  /** Nomor box yang sedang dilihat utuh; null = grid penuh. */
  const [focusOrder, setFocusOrder] = useState<number | null>(null);

  const [tab, setTab] = useState<string>("TI");
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([]);
  /**
   * Konfigurasi dan daftar tab dibaca setelah mount lewat langganan peristiwa:
   * server merender keadaan bawaan, lalu klien menyusul dengan yang sebenarnya.
   * Tanpa langganan ini, menyimpan pengaturan di halaman Talent Mapping tidak
   * terlihat di Beranda sampai halaman dimuat ulang — dan memuat ulang justru
   * mengosongkan simpanan sesinya.
   */
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const read = () => { setCustomTabs(getCustomTabs()); setVersion(v => v + 1); };
    read();
    window.addEventListener(TM_TABS_EVENT, read);
    window.addEventListener(TM_CONFIG_EVENT, read);
    return () => {
      window.removeEventListener(TM_TABS_EVENT, read);
      window.removeEventListener(TM_CONFIG_EVENT, read);
    };
  }, []);

  const tabs = synced ? [...BUILT_IN_TABS, ...customTabs.map(t => ({ id: t.id, label: t.name }))] : [];
  const changeTab = (v: string | null) => {
    // Nomor box terikat ke layout tab-nya, jadi fokus dilepas saat berpindah —
    // kalau tidak, nomor yang sama akan menunjuk box yang berbeda artinya.
    setFocusOrder(null);
    setTab(v ?? "TI");
  };
  const activeTab = tabs.some(t => t.id === tab) ? tab : "TI";

  const config = useMemo(
    () => (synced ? getEffectiveConfig(activeTab) : null),
    // version sengaja jadi pemicu: simpanannya di luar React.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [synced, activeTab, version],
  );

  const points = useMemo(
    () => (config && metrics ? pointsFrom(config, metrics) : []),
    [config, metrics],
  );

  const cells = useMemo(
    () => (config && metrics ? cellsFrom(config, points) : cellData),
    [config, metrics, points, cellData],
  );

  const focused = focusOrder != null ? cells.find(c => c.order === focusOrder) ?? null : null;

  const xLabel = config ? config.sumbuX : axisX;
  const yLabel = config ? config.sumbuY : axisY;
  // Kolom & baris dari layout yang aktif; tampilan manager tetap 3x3.
  const cols = config ? config.ordering[0].length : 3;
  const rows = config ? config.ordering.length : 3;
  return (
    <div className="bg-white rounded-[8px] p-[16px] flex flex-col gap-[16px] w-full h-full"
      style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[#495057] text-[12px]"
          style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700 }}>
          {title}
        </p>
        {/* Ikut tab yang sedang dilihat di sini, supaya berpindah ke halaman
            penuh tidak melempar user kembali ke tab pertama. */}
        <TextButton onClick={() => router.push(synced ? `/talent-mapping?tab=${encodeURIComponent(activeTab)}` : "/talent-mapping")}>See Detail</TextButton>
      </div>

      {/* Baris tab box mapping — hanya saat kartu ini tersinkron. Tampilan
          manager memakai kumpulan karyawannya sendiri, jadi tidak punya tab. */}
      {synced && tabs.length > 1 && (
        <Tabs value={activeTab} onChange={changeTab} variant="default">
          <Tabs.List style={{ borderBottom: "none" }}>
            {tabs.map(t => (
              <Tabs.Tab
                key={t.id}
                value={t.id}
                styles={{ tab: { fontFamily: "'Open Sans', sans-serif", fontSize: 11, padding: "4px 8px" } }}
              >
                {t.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      )}

      {/* Satu box utuh, atau seluruh matriksnya */}
      {focused && config ? (
        <FocusedBox config={config} points={points} order={focused.order!} onBack={() => setFocusOrder(null)} />
      ) : (
      <div className="flex-1 flex gap-[4px] min-h-[260px]">
        {/* Y-axis label */}
        <div className="flex items-center justify-center w-[18px] flex-shrink-0">
          <div className="text-[#58595b] text-[12px] whitespace-nowrap"
            style={{ fontFamily: "'Open Sans', sans-serif", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            {yLabel}
          </div>
        </div>

        {/* Grid + X-axis */}
        <div className="flex flex-col flex-1 gap-[2px]">
          <div
            className="flex-1 grid gap-[2px]"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
          >
            {cells.map((cell, idx) => (
              <GridCell
                key={idx}
                cell={cell}
                rowIdx={Math.floor(idx / cols)}
                colIdx={idx % cols}
                rows={rows}
                cols={cols}
                /* Klik satu box membukanya utuh di kartu ini juga — tidak
                   berpindah halaman. Hanya saat tersinkron: tampilan manager
                   tidak punya box bernomor di konfigurasi. */
                onOpen={
                  synced && cell.order != null ? () => setFocusOrder(cell.order!) : undefined
                }
              />
            ))}
          </div>
          <div className="h-px bg-[#adb5bd] mt-[2px]" />
          <p className="text-[#58595b] text-[12px] text-center mt-[2px]" style={{ fontFamily: "'Open Sans', sans-serif" }}>
            {xLabel}
          </p>
        </div>
      </div>
      )}
    </div>
  );
}
