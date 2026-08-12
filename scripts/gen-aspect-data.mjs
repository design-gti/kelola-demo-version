// Vismap V2 "standar aspek kompetensi": setiap posisi punya standar 1-5 per aspek,
// setiap orang punya skor 1-5 per aspek. % Ready to Promote & Need Development
// dihitung dengan mencocokkan skor orang vs standar KURSI (bukan lagi angka
// tunggal yang nempel di orang) — supaya reaktif saat simulasi menukar orang
// antar kursi. Lihat diskusi di src/vismap/v2/layers.ts.
//
// Sumber: public/data/participants.csv (untuk daftar posisi & id partisipan).
// Output (source of truth, boleh diedit tangan lalu re-run script ini):
//   - public/data/position_competency_standards.csv
//   - public/data/participant_aspect_scores.csv
// Lalu dikompilasi ke src/vismap/v2/aspectData.generated.ts supaya bisa
// diimport langsung (sinkron) oleh Vismap V2, sama seperti pola seed.mjs.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8").replace(/^﻿/, "");

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const vals = line.split(",");
    return headers.reduce((o, h, i) => ((o[h] = (vals[i] ?? "").trim()), o), {});
  });
}

// 13 aspek — sama persis dengan STANDARD_COMPETENCIES di developmentData.ts,
// supaya IDP recommendations (yang sudah dipetakan per aspek ini) tetap relevan.
const ASPECTS = [
  "Orientasi Hasil", "Kerjasama", "Komunikasi", "Daya Analisis", "Adaptabilitas",
  "Inisiatif", "Pelayanan Pelanggan", "Integritas", "Pengembangan Diri",
  "Pengambilan Keputusan", "Manajemen Waktu", "Disiplin", "Keterampilan Interpersonal",
];

// Deterministik, bukan Math.random(), supaya hasilnya stabil antar-run (sama
// prinsipnya dengan seededRandom di developmentData.ts).
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function seeded01(seedStr) {
  const x = Math.sin(hash(seedStr)) * 10000;
  return x - Math.floor(x);
}
const clamp15 = (n) => Math.max(1, Math.min(5, Math.round(n)));

const pRows = parseCSV(read("public/data/participants.csv"));

// --- Tier standar per posisi (1-5, level jabatan) ---
const TIER5 = new Set(["Chief Executive Officer", "Chief Strategy Officer", "Chief Revenue Officer"]);
const TIER4 = new Set([
  "VP Corporate Strategy", "VP Operations", "Head of Engineering",
  "Head of Finance", "Head of Governance", "Head of Marketing",
]);
const TIER2 = new Set(["Finance Analyst", "Operations Analyst", "People Ops Specialist", "Digital Content Specialist"]);
// Semua posisi lain (Lead/Manager/Principal/Senior IC/Director/dst) = tier 3.

function tierOf(position) {
  if (TIER5.has(position)) return 5;
  if (TIER4.has(position)) return 4;
  if (TIER2.has(position)) return 2;
  return 3;
}

// --- Beberapa orang sengaja dijadikan top talent (hampir semua aspek standar
// atas), dan beberapa sengaja dibuat lebih rendah/berlubang supaya heatmap
// punya dinamika (bukan semua orang hijau). Selebihnya skor mengikuti
// competency score existing di participants.csv + jitter per aspek.
const TOP_TALENT_IDS = new Set(["p05", "p07", "p17", "p25", "p12", "p31"]); // Mbappe, Rodri, Lautaro, Messi, Griezmann, Kane
const STRUGGLING_IDS = new Set(["p11", "p15", "p22", "p24", "p02"]); // Enzo, Cody, Rafael, Nico, Musiala

const positions = [...new Map(pRows.map((r) => [r.position, r])).values()].map((r) => ({
  position: r.position,
  department: r.department,
}));

const positionStandards = positions.map(({ position, department }) => {
  const tier = tierOf(position);
  const values = ASPECTS.map((aspect, i) => {
    // ±1 jitter deterministik di sekitar tier, supaya standarnya tidak flat rata.
    const jitter = seeded01(`std:${position}:${aspect}:${i}`) > 0.7 ? 1 : seeded01(`std2:${position}:${aspect}`) < 0.15 ? -1 : 0;
    return clamp15(tier + jitter);
  });
  return { position, department, values };
});

// Skor tiap orang sengaja dikalibrasi ke TIER POSISINYA SENDIRI (bukan lagi ke
// competency score global) — supaya "need development" (dicocokkan ke standar
// kursi SENDIRI) masuk akal, sementara "ready to promote" (dicocokkan ke
// standar kursi ATASAN, biasanya 1 tier lebih tinggi) menghasilkan gap yang
// nyata: mayoritas jatuh ke oranye, sebagian ke merah, hanya talent yang
// konsisten hijau. Ini yang membuat heatmap "Succession Risk" (dihitung dari
// ready-to-promote para bawahan) punya dinamika, bukan hijau semua.
const participantScores = pRows.map((r) => {
  const tier = tierOf(r.position);
  const values = ASPECTS.map((aspect, i) => {
    if (TOP_TALENT_IDS.has(r.id)) {
      // Top talent: konsisten di atas tier sendiri (+1/+2), tapi tetap dibatasi
      // skala 5 — jadi tidak semua aspek otomatis maксimal.
      const roll = seeded01(`talent:${r.id}:${aspect}`);
      return clamp15(tier + (roll < 0.7 ? 2 : 1));
    }
    if (STRUGGLING_IDS.has(r.id)) {
      // Sengaja berlubang: di bawah tier sendiri (-1/-2).
      const roll = seeded01(`struggle:${r.id}:${aspect}:${i}`);
      return clamp15(tier - (roll < 0.6 ? 2 : 1));
    }
    // Selebihnya: berkisar DI SEKITAR tier sendiri, condong ke bawah/rata
    // (40% -1, 40% rata, 20% +1) — cukup buat "need development" di kursi
    // sendiri masih wajar, tapi begitu dicocokkan ke standar kursi atasan
    // (1 tier lebih tinggi) mayoritas jatuh ke oranye/merah, bukan hijau.
    const roll = seeded01(`sc:${r.id}:${aspect}:${i}`);
    const delta = roll < 0.4 ? -1 : roll < 0.8 ? 0 : 1;
    return clamp15(tier + delta);
  });
  return { id: r.id, name: r.name, values };
});

// --- Tulis CSV (wide format: 1 kolom per aspek, biar gampang dibaca/diedit manual) ---
const header = (cols) => cols.join(",");
const posCsv = [
  header(["position", "department", ...ASPECTS]),
  ...positionStandards.map((p) => [p.position, p.department, ...p.values].join(",")),
].join("\n");
writeFileSync(join(ROOT, "public/data/position_competency_standards.csv"), posCsv + "\n", "utf8");

const scoreCsv = [
  header(["id", "name", ...ASPECTS]),
  ...participantScores.map((p) => [p.id, p.name, ...p.values].join(",")),
].join("\n");
writeFileSync(join(ROOT, "public/data/participant_aspect_scores.csv"), scoreCsv + "\n", "utf8");

// --- Kompilasi ke TS supaya bisa diimport sinkron oleh Vismap V2 ---
const posStdRows = parseCSV(read("public/data/position_competency_standards.csv"));
const scoreRows = parseCSV(read("public/data/participant_aspect_scores.csv"));

const positionStandardsObj = {};
for (const row of posStdRows) {
  positionStandardsObj[row.position] = Object.fromEntries(ASPECTS.map((a) => [a, Number(row[a])]));
}
const participantScoresObj = {};
for (const row of scoreRows) {
  participantScoresObj[row.id] = Object.fromEntries(ASPECTS.map((a) => [a, Number(row[a])]));
}

const ts = `// AUTO-GENERATED oleh scripts/gen-aspect-data.mjs — jangan edit manual.
// Sumber: public/data/position_competency_standards.csv + public/data/participant_aspect_scores.csv
// Regenerate: node scripts/gen-aspect-data.mjs (atau npm run seed, sudah dihook di sana).

export const ASPECTS = ${JSON.stringify(ASPECTS, null, 2)} as const;
export type Aspect = (typeof ASPECTS)[number];

/** Standar tiap aspek (skala 1-5) per judul posisi. */
export const POSITION_STANDARDS: Record<string, Record<Aspect, number>> = ${JSON.stringify(positionStandardsObj, null, 2)};

/** Skor tiap aspek (skala 1-5) per id partisipan. */
export const PARTICIPANT_ASPECT_SCORES: Record<string, Record<Aspect, number>> = ${JSON.stringify(participantScoresObj, null, 2)};
`;
writeFileSync(join(ROOT, "src/vismap/v2/aspectData.generated.ts"), ts, "utf8");

console.log(`gen-aspect-data: ${positionStandards.length} posisi, ${participantScores.length} partisipan → aspectData.generated.ts`);
