// Ekspor Vismap V2 ke SVG VEKTOR (bukan screenshot).
//
// Kenapa dibangun ulang dari CSV, bukan menyalin DOM lewat browser: kartu V2
// dibentuk oleh flex + box-shadow + aspect-ratio, dan tidak satu pun punya
// padanan langsung di SVG. Serialisasi DOM menghasilkan <foreignObject> yang
// isinya tetap HTML — di Illustrator/Figma ia jadi kotak kosong. Jadi tata
// letaknya dihitung sendiri di sini dan digambar sebagai elemen SVG asli:
// teks tetap teks yang bisa diseleksi, garis tetap path.
//
// Foto orang tentu tetap raster (tidak ada versi vektornya), tapi diperkecil
// dulu lewat sharp sebelum ditanam sebagai data URI — tanpa itu 112 avatar
// ukuran penuh membengkak jadi belasan MB.
//
// Sumber (sama dengan yang dipakai aplikasi):
//   public/data/participants.csv                  → struktur & nama
//   public/data/participant_aspect_scores.csv     → skor 13 aspek per orang
//   public/data/position_competency_standards.csv → standar aspek per jabatan
//
// Pakai:
//   node scripts/export-vismap-svg.mjs                 → kartu netral
//   node scripts/export-vismap-svg.mjs --need-dev      → + heatmap Need Development
//   node scripts/export-vismap-svg.mjs --out foo.svg
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8").replace(/^﻿/, "");

const args = process.argv.slice(2);
const NEED_DEV = args.includes("--need-dev");
const OUT = (() => {
  const i = args.indexOf("--out");
  return i >= 0 && args[i + 1] ? args[i + 1] : "public/exports/vismap-v2.svg";
})();

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const vals = line.split(",");
    return headers.reduce((o, h, i) => ((o[h] = (vals[i] ?? "").trim()), o), {});
  });
}

// ── ukuran, disamakan dengan OrgCardV2.tsx ──────────────────────────────────
const CARD_W = 208;
const PHOTO_GUTTER = 8;
const PHOTO = CARD_W - PHOTO_GUTTER * 2;   // persegi 1:1
const HEADER_H = 25;
const INFO_H = 40;
const CARD_H = HEADER_H + PHOTO + INFO_H;
const SIB_GAP = 32;      // jarak antar-kartu bersaudara (px-4 di kedua sisi)
const STALK = 24;        // batang konektor
const LEVEL_GAP = STALK * 2 + 16;
const MARGIN = 48;

const NEUTRAL_BORDER = "#dee2e6";
// Ambang & warna Need Development — sama dengan default heatmapConfig di App.tsx.
const DEV_RANGES = [
  { color: "#fe0d00", min: 0, max: 65 },
  { color: "#F59B02", min: 66, max: 75 },
  { color: "#f0dc02", min: 76, max: 85 },
  { color: "#9de20f", min: 86, max: 92 },
  { color: "#0de627", min: 93, max: 100 },
];
const devColor = (v) => DEV_RANGES.find((r) => v >= r.min && v <= r.max)?.color ?? null;

// ── data ────────────────────────────────────────────────────────────────────
const parts = parseCSV(read("public/data/participants.csv"));
const scoreRows = parseCSV(read("public/data/participant_aspect_scores.csv"));
const stdRows = parseCSV(read("public/data/position_competency_standards.csv"));
const ASPECTS = Object.keys(scoreRows[0]).filter((k) => k !== "id" && k !== "name");

const scoreById = Object.fromEntries(scoreRows.map((r) => [r.id, r]));
const stdByPos = Object.fromEntries(stdRows.map((r) => [r.position, r]));

/** Sama persis dengan matchPercent() di src/vismap/v2/layers.ts. */
function matchPercent(id, position) {
  const s = scoreById[id];
  const st = stdByPos[position];
  if (!s || !st) return null;
  const ratios = ASPECTS.map((a) => Math.min(100, (Number(s[a]) / Number(st[a])) * 100));
  return Math.min(99, Math.round(ratios.reduce((a, b) => a + b, 0) / ratios.length));
}

// ── pohon ───────────────────────────────────────────────────────────────────
const byId = new Map(parts.map((p) => [p.id, { ...p, reports: [] }]));
const roots = [];
for (const p of byId.values()) {
  const parent = p.manager_id ? byId.get(p.manager_id) : null;
  if (parent) parent.reports.push(p);
  else roots.push(p);
}

/** Lebar subtree: daun = lebar kartu, selainnya = jumlah lebar anak + jarak. */
function measure(node) {
  if (node.reports.length === 0) return (node.width = CARD_W);
  const kids = node.reports.reduce((sum, r) => sum + measure(r), 0);
  return (node.width = Math.max(CARD_W, kids + SIB_GAP * (node.reports.length - 1)));
}

/** Tempatkan: kartu selalu di TENGAH subtree-nya, seperti flex justify-center. */
function place(node, left, top) {
  node.x = left + node.width / 2 - CARD_W / 2;
  node.y = top;
  let cursor = left;
  for (const r of node.reports) {
    place(r, cursor, top + CARD_H + LEVEL_GAP);
    cursor += r.width + SIB_GAP;
  }
}

roots.forEach(measure);
let cursor = MARGIN;
for (const r of roots) {
  place(r, cursor, MARGIN);
  cursor += r.width + SIB_GAP;
}

const all = [];
(function walk(n) { all.push(n); n.reports.forEach(walk); })(roots[0]);
roots.slice(1).forEach((r) => (function walk(n) { all.push(n); n.reports.forEach(walk); })(r));

const W = cursor - SIB_GAP + MARGIN;
const H = Math.max(...all.map((n) => n.y)) + CARD_H + MARGIN;

// ── foto: diperkecil lalu ditanam sebagai data URI ──────────────────────────
const THUMB = 180;
const photos = new Map();
for (const p of all) {
  try {
    const buf = await sharp(join(ROOT, `public/avatars/employee/${p.id}.png`))
      .resize(THUMB, THUMB, { fit: "cover" })
      .webp({ quality: 78 })
      .toBuffer();
    photos.set(p.id, `data:image/webp;base64,${buf.toString("base64")}`);
  } catch {
    // Tidak semua id punya berkas foto; kartunya tetap digambar tanpa foto.
  }
}

// ── render ──────────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** Potong teks yang lebih lebar dari kartunya — SVG tidak punya text-overflow. */
const clip = (s, max) => (s.length > max ? s.slice(0, max - 1) + "…" : s);

const out = [];
out.push(
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
  `width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="'Open Sans', sans-serif">`,
);
out.push(`<defs>
  <linearGradient id="nameShade" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#000" stop-opacity="0.78"/>
    <stop offset="0.38" stop-color="#000" stop-opacity="0.35"/>
    <stop offset="0.62" stop-color="#000" stop-opacity="0"/>
  </linearGradient>
  <clipPath id="photoClip"><rect x="0" y="0" width="${PHOTO}" height="${PHOTO}" rx="8"/></clipPath>
</defs>`);
out.push(`<rect width="${W}" height="${H}" fill="#f1f3f5"/>`);

// Konektor digambar lebih dulu supaya selalu berada DI BAWAH kartu.
const LINE = "#016699";
for (const n of all) {
  if (n.reports.length === 0) continue;
  const cx = n.x + CARD_W / 2;
  const bottom = n.y + CARD_H;
  const busY = bottom + STALK;
  out.push(`<path d="M${cx} ${bottom} V${busY}" stroke="${LINE}" stroke-width="1" fill="none"/>`);
  if (n.reports.length > 1) {
    const first = n.reports[0].x + CARD_W / 2;
    const last = n.reports[n.reports.length - 1].x + CARD_W / 2;
    out.push(`<path d="M${first} ${busY} H${last}" stroke="${LINE}" stroke-width="1" fill="none"/>`);
  }
  for (const r of n.reports) {
    const rx = r.x + CARD_W / 2;
    out.push(`<path d="M${rx} ${busY} V${r.y}" stroke="${LINE}" stroke-width="1" fill="none"/>`);
  }
}

for (const n of all) {
  const match = matchPercent(n.id, n.position);
  const value = match ?? 0;
  const matchColor = value >= 80 ? "#2f9e44" : value >= 60 ? "#f08c00" : "#e03131";
  const ring = NEED_DEV && match != null ? devColor(match) : null;

  out.push(`<g transform="translate(${n.x} ${n.y})">`);
  out.push(
    `<rect width="${CARD_W}" height="${CARD_H}" rx="12" fill="#ffffff" ` +
    `stroke="${NEUTRAL_BORDER}" stroke-width="1"/>`,
  );

  // Baris posisi (sinyal KURSI)
  out.push(
    `<text x="10" y="16" font-size="10" font-weight="700" fill="#495057" letter-spacing="0.2">` +
    `${esc(clip(n.position.toUpperCase(), 28))}</text>`,
  );
  out.push(`<path d="M0 ${HEADER_H} H${CARD_W}" stroke="#e9ecef" stroke-width="1" stroke-dasharray="3 3"/>`);

  // Foto (raster, di-clip persegi membulat) + gradasi + nama di atasnya
  out.push(`<g transform="translate(${PHOTO_GUTTER} ${HEADER_H})">`);
  out.push(`<rect width="${PHOTO}" height="${PHOTO}" rx="8" fill="#d6e6ff"/>`);
  const photo = photos.get(n.id);
  if (photo) {
    out.push(
      `<image href="${photo}" width="${PHOTO}" height="${PHOTO}" ` +
      `preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip)"/>`,
    );
  }
  out.push(`<rect width="${PHOTO}" height="${PHOTO}" rx="8" fill="url(#nameShade)"/>`);
  if (ring) {
    out.push(
      `<rect x="1" y="1" width="${PHOTO - 2}" height="${PHOTO - 2}" rx="7" fill="none" ` +
      `stroke="${ring}" stroke-width="2"/>`,
    );
  }
  out.push(
    `<text x="10" y="${PHOTO - 10}" font-size="13" font-weight="700" fill="#ffffff">` +
    `${esc(clip(n.name, 24))}</text>`,
  );
  out.push(`</g>`);

  // Blok angka
  const infoY = HEADER_H + PHOTO;
  out.push(
    `<text x="10" y="${infoY + 16}" font-size="9" font-weight="700" fill="#868e96" letter-spacing="0.3">` +
    `% MATCH TO CURRENT POSITION</text>`,
  );
  out.push(
    `<text x="${CARD_W - 10}" y="${infoY + 16}" font-size="11" font-weight="800" ` +
    `fill="${matchColor}" text-anchor="end">${value}%</text>`,
  );
  out.push(`<rect x="10" y="${infoY + 22}" width="${CARD_W - 20}" height="4" rx="2" fill="#e9ecef"/>`);
  out.push(
    `<rect x="10" y="${infoY + 22}" width="${((CARD_W - 20) * value) / 100}" height="4" rx="2" ` +
    `fill="${matchColor}"/>`,
  );

  out.push(`</g>`);
}

out.push(`</svg>`);

mkdirSync(dirname(join(ROOT, OUT)), { recursive: true });
writeFileSync(join(ROOT, OUT), out.join("\n"), "utf8");
const kb = Math.round(Buffer.byteLength(out.join("\n")) / 1024);
console.log(`export-vismap-svg: ${all.length} kartu → ${OUT} (${W}×${H}px, ${kb} KB)`);
