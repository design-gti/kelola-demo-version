"use client";
import { Radar, RadarChart, PolarAngleAxis, Tooltip } from "recharts";
import type { AspectItem } from "./ScoreAspectWithTabs";

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

/** Warna per kategori, dipakai berulang kalau kategorinya lebih banyak. */
const CATEGORY_COLORS = ["#016699", "#748094", "#00875A", "#CA6F00", "#7C3AED"];

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

type Group = { category: string; color: string; start: number; end: number };
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

/** Juring untuk satu kategori, dari setengah langkah sebelum titik pertama sampai setengah langkah sesudah titik terakhir. */
function wedgePath(startIdx: number, endIdx: number, n: number): string {
  const step = 360 / n;
  const a0 = 90 - step * (startIdx - 0.5);
  const a1 = 90 - step * (endIdx + 0.5);
  const p0 = polar(a0, WEDGE_R);
  const p1 = polar(a1, WEDGE_R);
  const largeArc = Math.abs(a0 - a1) > 180 ? 1 : 0;
  // sweep-flag 1 = searah jarum jam di layar (sudut mengecil).
  return `M ${CX} ${CY} L ${p0.x} ${p0.y} A ${WEDGE_R} ${WEDGE_R} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`;
}

/**
 * Tick label yang dibungkus jadi maksimal 2 baris — nama aspek ditampilkan utuh
 * (tidak dipotong), tapi tetap muat di keliling radar yang sempit. Warnanya
 * mengikuti kategori aspek tersebut.
 */
function makeWrappedTick(colorOf: (label: string) => string) {
  return function WrappedTick({ payload, x, y, textAnchor }: {
    payload?: { value?: string };
    x?: number;
    y?: number;
    textAnchor?: "inherit" | "start" | "middle" | "end";
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
    const RADIAL_GAP = 12;
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
    return (
      <text x={px} y={firstY} textAnchor={textAnchor} fill={colorOf(label)} fontSize={9} fontWeight={600} fontFamily="'Open Sans', sans-serif">
        {lines.map((line, i) => (
          <tspan key={i} x={px} dy={i === 0 ? 0 : LINE_H}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };
}

export function AspectRadarChart({ items }: { items: AspectItem[] }) {
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
  categories.forEach((category, i) => {
    const count = items.filter((a) => a.category === category).length;
    groups.push({
      category,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      start: cursor,
      end: cursor + count - 1,
    });
    cursor += count;
  });

  const colorByLabel = new Map<string, string>();
  groups.forEach((g) => {
    ordered.slice(g.start, g.end + 1).forEach((a) => colorByLabel.set(a.label, g.color));
  });

  const data = ordered.map((a) => ({ aspect: a.label, Skor: a.score, Standar: a.standardScore }));
  const Tick = makeWrappedTick((label) => colorByLabel.get(label) ?? "#495057");

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

          {/* Juring kategori */}
          {groups.map((g) => (
            <path
              key={g.category}
              d={wedgePath(g.start, g.end, n)}
              fill={g.color}
              fillOpacity={0.05}
              stroke={g.color}
              strokeOpacity={0.18}
              strokeWidth={1}
            />
          ))}

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
            return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#dee2e6" strokeOpacity={0.5} />;
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
          <PolarAngleAxis dataKey="aspect" tick={<Tick />} domain={[0, MAX_SCORE]} />
          {/* Dua Radar ini sengaja transparan — bentuknya digambar di lapisan SVG
              di atas; ini cuma penyedia hit-test supaya tooltip tetap berfungsi. */}
          <Radar dataKey="Standar" name="Standar posisi" stroke="none" fill="none" isAnimationActive={false} />
          <Radar dataKey="Skor" name="Skor" stroke="none" fill="none" isAnimationActive={false} />
          <Tooltip
            contentStyle={{ fontSize: 11, fontFamily: "'Open Sans', sans-serif", borderRadius: 8, border: "1px solid #dee2e6", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            formatter={(value, name) => [`${value}/5`, String(name)]}
          />
        </RadarChart>
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

      {/* Chip kategori — warnanya sama dengan juring & label tick-nya. */}
      <div className="flex flex-wrap items-center justify-center gap-[6px] mt-[8px] pt-[8px] border-t border-[#e9ecef] w-full">
        {groups.map((g) => (
          <span
            key={g.category}
            className="flex items-center gap-[5px] rounded-[800px] px-[8px] py-[2px] text-[10px] font-bold"
            style={{ color: g.color, background: g.color + "14", fontVariationSettings: "'wdth' 100" }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 2, background: g.color, display: "inline-block" }} />
            {g.category}
          </span>
        ))}
      </div>
    </div>
  );
}
