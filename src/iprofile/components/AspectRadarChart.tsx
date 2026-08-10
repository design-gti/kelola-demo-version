"use client";
import { useState } from "react";
import { Radar, RadarChart, PolarAngleAxis, Tooltip } from "recharts";
import type { AspectItem } from "./ScoreAspectWithTabs";
import { KeyBehaviourBreakdown } from "./KeyBehaviourBreakdown";

/**
 * Tampilan spider/radar untuk kartu Score Aspect — alternatif dari tampilan
 * list, dipilih lewat toggle ikon di atas kartu.
 *
 * Dua lapis dibandingkan sekaligus: skor orangnya vs standar posisinya, jadi
 * gap-nya kebaca sebagai bentuk (area skor yang "masuk ke dalam" bentuk standar
 * = aspek yang masih kurang). Skalanya 1-5, sama dengan kotak skor di list.
 *
 * Kategori aspek — yang di tampilan list jadi section header — digambar sebagai
 * juring berwarna di belakang radar, jadi kelompoknya kelihatan sebagai area,
 * bukan cuma tulisan. Warna juring, label tick, dan chip legend sama.
 *
 * Bentuk area-nya sengaja digambar sendiri (spline Catmull-Rom + gradasi +
 * glow) alih-alih memakai `<Radar>` bawaan recharts yang selalu bersudut tajam.
 * Recharts tetap dipakai untuk grid, label sumbu, dan tooltip: `<Radar>`-nya
 * dibiarkan transparan supaya hit-test tooltip-nya tetap jalan.
 */
const SCORE_COLOR = "#016699"; // primary-5
const STANDARD_COLOR = "#FD9F28"; // secondary-5

/**
 * Kategori sengaja tidak diberi warna sama sekali — baik busur pembatas maupun
 * label aspeknya. Warna di chart ini dipesan khusus untuk dua hal yang memang
 * perlu dibandingkan (skor vs standar posisi); kalau kategori ikut berwarna,
 * matanya terpecah dan justru bukan ke angkanya. Kategori tetap terbaca lewat
 * posisi busurnya, dan namanya muncul saat busur itu di-hover.
 */
const ARC_COLOR = "#dee2e6";
const ARC_COLOR_HOVER = "#adb5bd";
const LABEL_COLOR = "#343a40";

// Ukuran tetap: kartu Score Aspect lebarnya pasti (368px - padding 16px*2),
// jadi cx/cy/radius bisa dipastikan dan lapisan gambar sendiri dijamin sejajar
// dengan radar recharts (tidak perlu menebak hasil hitung ResponsiveContainer).
const CHART_W = 336;
const CHART_H = 320;
const CX = CHART_W / 2;
const CY = 152;
/** Radius skor maksimum (=5). Sengaja disisakan ruang ke tepi buat label aspek. */
const OUTER_R = 82;
/** Juring digambar sedikit lebih luar dari area data, tapi masih di dalam label. */
const WEDGE_R = OUTER_R + 8;
const MAX_SCORE = 5;
/** Radius satu tingkat skor — dipakai bersama oleh grid & bentuk area, jadi skor 3 pasti mendarat di cincin ke-3. */
const radiusOf = (value: number) => (value / MAX_SCORE) * OUTER_R;

type Group = { category: string; start: number; end: number };
type Pt = { x: number; y: number };

/** Titik pada lingkaran; sudut dalam derajat matematis (0° = kanan, naik = berlawanan jarum jam). */
function polar(angleDeg: number, r: number): Pt {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) };
}

/** RadarChart recharts mulai di 90° lalu bergerak searah jarum jam. */
const angleAt = (i: number, n: number) => 90 - (360 / n) * i;

/**
 * Path tertutup yang melengkung mulus melewati semua titik (Catmull-Rom
 * dikonversi ke kurva Bezier kubik). Inilah yang bikin bentuknya "blob"
 * seperti referensi, bukan poligon bersudut.
 */
function smoothClosedPath(points: Pt[]): string {
  const n = points.length;
  if (n < 3) return "";
  const at = (i: number) => points[((i % n) + n) % n];
  let d = `M ${at(0).x.toFixed(2)} ${at(0).y.toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const cp1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const cp2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${cp1.x.toFixed(2)} ${cp1.y.toFixed(2)}, ${cp2.x.toFixed(2)} ${cp2.y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d + " Z";
}

/** Jeda sudut di tiap ujung busur kategori — bikin batas antar kategori kebaca. */
const ARC_PAD_DEG = 2.5;

/**
 * Busur di lingkar terluar untuk satu kategori. Ini penanda kategori yang
 * paling tegas: rentang sudutnya sama dengan juring, tapi digambar sebagai
 * garis tebal berwarna dengan jeda di tiap ujung, jadi pembagian kategorinya
 * terbaca langsung dari tepi chart tanpa harus mengandalkan warna label.
 */
function categoryArcPath(startIdx: number, endIdx: number, n: number): string {
  const step = 360 / n;
  const a0 = 90 - step * (startIdx - 0.5) - ARC_PAD_DEG;
  const a1 = 90 - step * (endIdx + 0.5) + ARC_PAD_DEG;
  const p0 = polar(a0, WEDGE_R);
  const p1 = polar(a1, WEDGE_R);
  const largeArc = Math.abs(a0 - a1) > 180 ? 1 : 0;
  return `M ${p0.x} ${p0.y} A ${WEDGE_R} ${WEDGE_R} 0 ${largeArc} 1 ${p1.x} ${p1.y}`;
}

/** Titik tengah busur kategori — tempat tooltip-nya muncul, sedikit di luar busur. */
function arcMidpoint(startIdx: number, endIdx: number, n: number): Pt {
  const step = 360 / n;
  // Didorong cukup jauh ke luar supaya tooltip-nya tidak menimpa area skor.
  return polar(90 - step * ((startIdx + endIdx) / 2), WEDGE_R + 38);
}

/**
 * Tick label yang dibungkus jadi maksimal 2 baris — nama aspek ditampilkan utuh
 * (tidak dipotong), tapi tetap muat di keliling radar yang sempit.
 *
 * Label ini sekaligus jadi TOMBOL pembuka breakdown Key Behaviour. Pemicunya
 * sengaja teksnya sendiri, bukan ikon info terpisah seperti di view list:
 * label terdekat cuma menyisakan 8px ke tepi area gambar, tidak cukup untuk
 * ikon 12px + jarak — dan hit area teks dua baris justru lebih besar.
 *
 * Props `selectable`/`selected`/`on*` diisi recharts lewat cloneElement dari
 * elemen yang dioper ke `tick`, digabung dengan payload/x/y miliknya.
 */
function WrappedTick({ payload, x, y, textAnchor, selectable, selected, hoveredLabel, onSelect, onHover }: {
  payload?: { value?: string };
  x?: number;
  y?: number;
  textAnchor?: "inherit" | "start" | "middle" | "end";
  selectable?: (label: string) => boolean;
  selected?: string | null;
  hoveredLabel?: string | null;
  onSelect?: (label: string) => void;
  onHover?: (v: { label: string; x: number; y: number } | null) => void;
}) {
    const label = String(payload?.value ?? "");
    const words = label.split(" ");
    let lines: string[] = [label];
    if (words.length > 1) {
      const mid = Math.ceil(words.length / 2);
      lines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
    }
    // Label didorong menjauh dari pusat sepanjang arah radialnya — tanpa ini
    // sisi atas teks (terutama label di bawah chart) masih masuk ke dalam
    // lingkaran terluar dan menutupi area skor.
    // Sekarang tepi terluar diisi busur kategori setebal 4px, jadi jaraknya
    // ditambah supaya teks tidak menempel ke busur itu.
    const RADIAL_GAP = 16;
    const dx = (x ?? 0) - CX;
    const dy = (y ?? 0) - CY;
    const len = Math.hypot(dx, dy) || 1;
    const px = (x ?? 0) + (dx / len) * RADIAL_GAP;
    const py = (y ?? 0) + (dy / len) * RADIAL_GAP;

    // Label di paruh atas ditumbuhkan ke ATAS, di paruh bawah ke bawah — kalau
    // selalu ke bawah, baris kedua label atas masuk menutupi chart.
    const LINE_H = 10;
    const growUp = py < CY;
    const firstY = py - (growUp && lines.length > 1 ? LINE_H : 0);

    const canOpen = selectable?.(label) ?? false;
    const isOpen = selected === label;
    return (
      <text
        x={px}
        y={firstY}
        textAnchor={textAnchor}
        fill={isOpen ? SCORE_COLOR : LABEL_COLOR}
        fontSize={9}
        fontWeight={isOpen || hoveredLabel === label ? 800 : 600}
        fontFamily="'Open Sans', sans-serif"
        style={canOpen ? { cursor: "pointer" } : undefined}
        onClick={canOpen ? () => onSelect?.(label) : undefined}
        onMouseEnter={canOpen ? () => onHover?.({ label, x: px, y: py }) : undefined}
        onMouseLeave={canOpen ? () => onHover?.(null) : undefined}
      >
        {lines.map((line, i) => (
          <tspan key={i} x={px} dy={i === 0 ? 0 : LINE_H}>
            {line}
          </tspan>
        ))}
      </text>
    );
}

export function AspectRadarChart({ items }: { items: AspectItem[] }) {
  const [hovered, setHovered] = useState<{ category: string; x: number; y: number } | null>(null);
  /** Aspek yang breakdown KB-nya sedang dibuka; satu saja pada satu waktu. */
  const [openAspect, setOpenAspect] = useState<string | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<{ label: string; x: number; y: number } | null>(null);

  if (items.length === 0) {
    return (
      <div className="w-full py-[24px] text-center text-[12px] text-[#adb5bd]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Belum ada data aspek.
      </div>
    );
  }

  // Aspek diurutkan per kategori supaya tiap kategori menempati satu juring
  // yang menyambung — kalau tercecer, juringnya tidak bisa digambar utuh.
  const categories = [...new Set(items.map((a) => a.category))];
  const ordered = categories.flatMap((c) => items.filter((a) => a.category === c));
  const n = ordered.length;

  const groups: Group[] = [];
  let cursor = 0;
  categories.forEach((category) => {
    const count = items.filter((a) => a.category === category).length;
    groups.push({ category, start: cursor, end: cursor + count - 1 });
    cursor += count;
  });

  const data = ordered.map((a) => ({ aspect: a.label, Skor: a.score, Standar: a.standardScore }));

  /** Cuma aspek yang punya KB yang bisa dibuka — Potency memang tidak punya. */
  const kbOf = (label: string) => ordered.find((a) => a.label === label)?.keyBehaviours;
  const hasKb = (label: string) => (kbOf(label)?.length ?? 0) > 0;
  const openItem = openAspect ? ordered.find((a) => a.label === openAspect) : undefined;
  const openIndex = openAspect ? ordered.findIndex((a) => a.label === openAspect) : -1;

  const toPoints = (pick: (a: AspectItem) => number): Pt[] =>
    ordered.map((a, i) => polar(angleAt(i, n), radiusOf(pick(a))));

  const scorePath = smoothClosedPath(toPoints((a) => a.score));
  const standardPath = smoothClosedPath(toPoints((a) => a.standardScore));
  /** Cincin skala 1..5 — dipakai sebagai grid, radiusnya dari rumus yang sama dengan bentuk area. */
  const levels = Array.from({ length: MAX_SCORE }, (_, k) => k + 1);

  return (
    <div className="w-full flex flex-col items-center">
      <div style={{ position: "relative", width: CHART_W, height: CHART_H }}>
        {/* Lapisan gambar sendiri: juring kategori + area melengkung. Ditaruh di
            bawah recharts supaya grid & label tetap terbaca di atasnya. */}
        <svg width={CHART_W} height={CHART_H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2F95DE" stopOpacity={0.34} />
              <stop offset="100%" stopColor={SCORE_COLOR} stopOpacity={0.14} />
            </linearGradient>
            {/* Fill standar dibuat sangat tipis: ia menumpuk di atas area skor,
                kalau terlalu pekat dua warnanya bercampur jadi keruh. Garis
                putus-putusnya yang jadi penanda utama. */}
            <linearGradient id="standardGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDA637" stopOpacity={0.10} />
              <stop offset="100%" stopColor="#F28700" stopOpacity={0.03} />
            </linearGradient>
            {/* Glow tipis saja — cukup untuk kesan lembut, tapi tidak sampai
                mengaburkan grid dan bentuk lapis satunya. */}
            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid digambar sendiri (bukan PolarGrid recharts) supaya radius tiap
              cincin memakai rumus yang sama persis dengan bentuk area —
              skor 3 dijamin mendarat tepat di cincin ke-3. */}
          {levels.map((lv) => (
            <circle
              key={lv}
              cx={CX}
              cy={CY}
              r={radiusOf(lv)}
              fill="none"
              stroke="#dee2e6"
              strokeOpacity={lv === MAX_SCORE ? 0.9 : 0.6}
            />
          ))}
          {ordered.map((_, i) => {
            const p = polar(angleAt(i, n), OUTER_R);
            // Spoke aspek yang breakdown-nya dibuka dibikin menyala — penanda
            // hubungan antara panel di bawah dengan sumbu mana yang dimaksud.
            const lit = i === openIndex;
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={p.x}
                y2={p.y}
                stroke={lit ? SCORE_COLOR : "#dee2e6"}
                strokeOpacity={lit ? 0.85 : 0.5}
                strokeWidth={lit ? 1.5 : 1}
              />
            );
          })}

          {/* Skor — lapis bawah, dengan glow lembut */}
          <g filter="url(#softGlow)">
            <path d={scorePath} fill="url(#scoreGrad)" stroke={SCORE_COLOR} strokeWidth={2} strokeLinejoin="round" />
          </g>

          {/* Standar posisi — sengaja di lapis atas: bentuknya biasanya lebih
              kecil dari skor, jadi kalau ditaruh di bawah garisnya ketutup. */}
          <path
            d={standardPath}
            fill="url(#standardGrad)"
            stroke={STANDARD_COLOR}
            strokeWidth={1.75}
            strokeLinejoin="round"
          />
        </svg>

        <RadarChart
          width={CHART_W}
          height={CHART_H}
          cx={CX}
          cy={CY}
          outerRadius={OUTER_R}
          data={data}
          style={{ position: "relative" }}
        >
          {/* Grid-nya digambar di lapisan SVG sendiri (lihat di atas) supaya
              skalanya sinkron dengan bentuk area; recharts di sini tinggal
              menyediakan label sumbu + tooltip. */}
          <PolarAngleAxis
            dataKey="aspect"
            tick={
              <WrappedTick
                selectable={hasKb}
                selected={openAspect}
                hoveredLabel={hoveredLabel?.label ?? null}
                onSelect={(label) => setOpenAspect((prev) => (prev === label ? null : label))}
                onHover={setHoveredLabel}
              />
            }
            domain={[0, MAX_SCORE]}
          />
          {/* Dua Radar ini sengaja transparan — bentuknya digambar di lapisan SVG
              di atas; ini cuma penyedia hit-test supaya tooltip tetap berfungsi. */}
          <Radar dataKey="Standar" name="Standar posisi" stroke="none" fill="none" isAnimationActive={false} />
          <Radar dataKey="Skor" name="Skor" stroke="none" fill="none" isAnimationActive={false} />
          <Tooltip
            // Tanpa ini tooltip-nya ketiban lapisan busur kategori — lapisan itu
            // sibling yang datang setelah RadarChart, jadi menang urutan cat.
            wrapperStyle={{ zIndex: 50 }}
            contentStyle={{ fontSize: 11, fontFamily: "'Open Sans', sans-serif", borderRadius: 8, border: "1px solid #dee2e6", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            formatter={(value, name) => [`${value}/5`, String(name)]}
          />
        </RadarChart>

        {/* Busur pembatas kategori — sengaja netral (abu muda) supaya tidak ikut
            bersaing dengan warna skor & standar; nama kategorinya muncul lewat
            tooltip saat busurnya di-hover. Lapisan ini ditaruh paling atas
            karena satu-satunya yang perlu menerima pointer event. */}
        <svg
          width={CHART_W}
          height={CHART_H}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {groups.map((g) => {
            const active = hovered?.category === g.category;
            return (
              <path
                key={`arc-${g.category}`}
                d={categoryArcPath(g.start, g.end, n)}
                fill="none"
                stroke={active ? ARC_COLOR_HOVER : ARC_COLOR}
                strokeWidth={active ? 5 : 4}
                strokeLinecap="round"
                style={{ pointerEvents: "stroke", cursor: "default", transition: "stroke 120ms, stroke-width 120ms" }}
                onMouseEnter={() => setHovered({ category: g.category, ...arcMidpoint(g.start, g.end, n) })}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>

        {hovered && (
          <div
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-[8px] border border-[#dee2e6] bg-white px-[8px] py-[3px] text-[11px] text-[#495057] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            style={{ left: hovered.x, top: hovered.y, transform: "translate(-50%, -50%)", fontFamily: "'Open Sans', sans-serif" }}
          >
            {hovered.category}
          </div>
        )}

        {/* Ajakan buka breakdown — muncul saat nama aspek di-hover, sekaligus
            yang membuat teks itu kebaca sebagai sesuatu yang bisa diklik. */}
        {hoveredLabel && hoveredLabel.label !== openAspect && (
          <div
            className="pointer-events-none absolute z-20 whitespace-nowrap rounded-[8px] border border-[#dee2e6] bg-white px-[8px] py-[3px] text-[11px] text-[#495057] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            style={{
              left: Math.max(52, Math.min(CHART_W - 52, hoveredLabel.x)),
              top: hoveredLabel.y,
              transform: "translate(-50%, -140%)",
              fontFamily: "'Open Sans', sans-serif",
            }}
          >
            Lihat breakdown KB
          </div>
        )}
      </div>

      {/* Legend manual — lebih ringkas dan konsisten ukurannya dengan kartu ini
          dibanding <Legend> bawaan recharts. */}
      <div className="flex items-center justify-center gap-[16px] mt-[2px]">
        <span className="flex items-center gap-[6px] text-[10px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <span style={{ width: 14, height: 3, borderRadius: 2, background: SCORE_COLOR, display: "inline-block" }} />
          Skor
        </span>
        <span className="flex items-center gap-[6px] text-[10px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <span style={{ width: 14, height: 3, borderRadius: 2, background: STANDARD_COLOR, display: "inline-block" }} />
          Standar posisi
        </span>
      </div>

      {/* Breakdown KB aspek terpilih — komponen yang sama persis dengan yang
          dipakai view list, jadi informasi yang sama tidak punya dua rupa. */}
      {openItem && openItem.keyBehaviours && (
        <div className="w-full mt-[8px] pt-[8px] border-t border-[#e9ecef]">
          <div className="flex items-start justify-between gap-[8px] w-full">
            <div className="flex flex-col">
              <p className="text-[12px] font-bold text-[#343a40] leading-[normal]" style={{ fontVariationSettings: "'wdth' 100" }}>
                {openItem.label}
              </p>
              <p className="text-[11px] text-[#6c757d] leading-[normal]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Skor {openItem.score}/5 · Standar {openItem.standardScore}/5
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpenAspect(null)}
              className="shrink-0 rounded-[6px] px-[6px] py-[2px] text-[11px] text-[#6c757d] hover:bg-[#f1f3f5]"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Tutup
            </button>
          </div>
          <KeyBehaviourBreakdown keyBehaviours={openItem.keyBehaviours} />
        </div>
      )}
    </div>
  );
}
