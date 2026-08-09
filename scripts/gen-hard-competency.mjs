// Hard competency (kompetensi teknis) untuk kartu Score Aspect di iProfile.
//
// Beda mendasar dengan aspek soft: daftar aspeknya SPESIFIK PER POSISI, bukan
// satu daftar universal. Karena itu CSV-nya pakai LONG format (satu baris per
// pasangan posisi-aspek), bukan wide seperti position_competency_standards.csv
// milik Vismap — kalau wide, kolomnya jadi gabungan semua aspek dari semua
// posisi dan mayoritas selnya kosong.
//
// Sumber: public/data/participants.csv (daftar posisi & id partisipan).
// Output (source of truth, boleh diedit tangan lalu re-run script ini):
//   - public/data/position_hard_competency_standards.csv  (position, aspect, category, standard)
//   - public/data/participant_hard_competency_scores.csv  (id, name, aspect, score)
// Lalu dikompilasi ke src/iprofile/lib/hardCompetency.generated.ts supaya bisa
// diimport sinkron, sama seperti pola gen-aspect-data.mjs.
//
// CATATAN: file ini TIDAK menyentuh participants.csv maupun file data modul
// lain — semuanya aditif, jadi Vismap/TDP/Team Profile/IDP tidak terpengaruh.
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

const clamp15 = (n) => Math.max(1, Math.min(5, n));

/**
 * Definisi aspek teknis per posisi. Ini bagian yang paling "domain" —
 * kalau nanti HR punya daftar resmi, cukup ganti isi tabel ini (atau edit
 * langsung CSV hasilnya dan hentikan pemakaian generator ini).
 */
const BY_POSITION = {
  "Head of Engineering": [
    ["Arsitektur Sistem", "Technical Core", 5],
    ["Code Review", "Technical Core", 4],
    ["Keamanan Aplikasi", "Technical Core", 4],
    ["CI/CD", "Tools & Platform", 4],
    ["Cloud Infrastructure", "Tools & Platform", 4],
    ["Observability", "Tools & Platform", 3],
  ],
  "Principal Engineer": [
    ["Arsitektur Sistem", "Technical Core", 5],
    ["Desain Terdistribusi", "Technical Core", 5],
    ["Technical Roadmap", "Technical Core", 4],
    ["Cloud Infrastructure", "Tools & Platform", 4],
    ["Observability", "Tools & Platform", 4],
  ],
  "Backend Lead": [
    ["Desain API", "Technical Core", 4],
    ["Basis Data", "Technical Core", 4],
    ["Optimasi Query", "Technical Core", 4],
    ["Message Queue", "Tools & Platform", 3],
    ["Containerization", "Tools & Platform", 3],
  ],
  "Frontend Lead": [
    ["Arsitektur Komponen", "Technical Core", 4],
    ["State Management", "Technical Core", 4],
    ["Aksesibilitas", "Technical Core", 3],
    ["Performa Web", "Tools & Platform", 4],
    ["Design System", "Tools & Platform", 4],
  ],
  "Senior Engineer": [
    ["Kualitas Kode", "Technical Core", 4],
    ["Pengujian Otomatis", "Technical Core", 3],
    ["Debugging", "Technical Core", 4],
    ["Version Control", "Tools & Platform", 4],
  ],
  "Head of Finance": [
    ["Pelaporan Keuangan", "Technical Core", 5],
    ["Analisis Anggaran", "Technical Core", 5],
    ["Manajemen Risiko", "Technical Core", 4],
    ["Kepatuhan Pajak", "Regulasi", 4],
    ["Standar Akuntansi", "Regulasi", 4],
  ],
  "Senior Finance Manager": [
    ["Pelaporan Keuangan", "Technical Core", 4],
    ["Analisis Anggaran", "Technical Core", 4],
    ["Manajemen Kas", "Technical Core", 4],
    ["Standar Akuntansi", "Regulasi", 4],
  ],
  "Senior Finance Analyst": [
    ["Pemodelan Keuangan", "Technical Core", 4],
    ["Analisis Varians", "Technical Core", 4],
    ["Rekonsiliasi", "Technical Core", 3],
    ["Spreadsheet Lanjutan", "Tools & Platform", 4],
    ["Standar Akuntansi", "Regulasi", 3],
  ],
  "Finance Analyst": [
    ["Pemodelan Keuangan", "Technical Core", 3],
    ["Rekonsiliasi", "Technical Core", 3],
    ["Analisis Varians", "Technical Core", 3],
    ["Spreadsheet Lanjutan", "Tools & Platform", 4],
    ["Standar Akuntansi", "Regulasi", 3],
  ],
  "Controller": [
    ["Pengendalian Internal", "Technical Core", 4],
    ["Pelaporan Keuangan", "Technical Core", 4],
    ["Audit Kepatuhan", "Regulasi", 4],
    ["Standar Akuntansi", "Regulasi", 4],
  ],
  "HR Business Partner": [
    ["Manajemen Talenta", "Technical Core", 4],
    ["Perencanaan SDM", "Technical Core", 4],
    ["Hubungan Industrial", "Regulasi", 4],
    ["HRIS", "Tools & Platform", 3],
  ],
  "HR Manager": [
    ["Manajemen Kinerja", "Technical Core", 4],
    ["Remunerasi", "Technical Core", 3],
    ["Hubungan Industrial", "Regulasi", 4],
    ["HRIS", "Tools & Platform", 3],
  ],
  "Talent Acquisition Lead": [
    ["Sourcing Kandidat", "Technical Core", 4],
    ["Teknik Wawancara", "Technical Core", 4],
    ["Employer Branding", "Technical Core", 3],
    ["ATS", "Tools & Platform", 4],
  ],
  "People Ops Specialist": [
    ["Administrasi Personalia", "Technical Core", 3],
    ["Onboarding", "Technical Core", 3],
    ["Kepatuhan Ketenagakerjaan", "Regulasi", 3],
    ["HRIS", "Tools & Platform", 3],
  ],
  "VP Operations": [
    ["Perencanaan Kapasitas", "Technical Core", 5],
    ["Manajemen Rantai Pasok", "Technical Core", 4],
    ["Kendali Mutu", "Technical Core", 4],
    ["Analitik Operasional", "Tools & Platform", 4],
    ["Keselamatan Kerja", "Regulasi", 4],
  ],
  "Operations Manager": [
    ["Perencanaan Produksi", "Technical Core", 4],
    ["Kendali Mutu", "Technical Core", 4],
    ["Efisiensi Proses", "Technical Core", 3],
    ["Keselamatan Kerja", "Regulasi", 4],
  ],
  "Operations Analyst": [
    ["Analitik Operasional", "Technical Core", 3],
    ["Pemetaan Proses", "Technical Core", 3],
    ["Spreadsheet Lanjutan", "Tools & Platform", 3],
  ],
  "Operations Strategist": [
    ["Perencanaan Strategis", "Technical Core", 4],
    ["Analitik Operasional", "Technical Core", 4],
    ["Pemodelan Skenario", "Tools & Platform", 4],
  ],
  "Supply Chain Lead": [
    ["Manajemen Rantai Pasok", "Technical Core", 4],
    ["Manajemen Vendor", "Technical Core", 4],
    ["Perencanaan Inventori", "Technical Core", 4],
    ["Sistem ERP", "Tools & Platform", 3],
  ],
  "Supply Chain Manager": [
    ["Manajemen Rantai Pasok", "Technical Core", 4],
    ["Negosiasi Pengadaan", "Technical Core", 4],
    ["Perencanaan Inventori", "Technical Core", 3],
    ["Sistem ERP", "Tools & Platform", 3],
  ],
  "Head of Marketing": [
    ["Strategi Kampanye", "Technical Core", 5],
    ["Riset Pasar", "Technical Core", 4],
    ["Manajemen Brand", "Technical Core", 5],
    ["Analitik Digital", "Tools & Platform", 4],
    ["Otomasi Pemasaran", "Tools & Platform", 3],
  ],
  "Senior Marketing Manager": [
    ["Strategi Kampanye", "Technical Core", 4],
    ["Riset Pasar", "Technical Core", 4],
    ["Analitik Digital", "Tools & Platform", 4],
  ],
  "Growth Marketing Manager": [
    ["Eksperimen Pertumbuhan", "Technical Core", 4],
    ["Analitik Digital", "Technical Core", 4],
    ["Optimasi Konversi", "Technical Core", 4],
    ["Otomasi Pemasaran", "Tools & Platform", 4],
  ],
  "Growth Marketing Lead": [
    ["Eksperimen Pertumbuhan", "Technical Core", 3],
    ["Optimasi Konversi", "Technical Core", 3],
    ["Analitik Digital", "Tools & Platform", 4],
  ],
  "Brand Manager": [
    ["Manajemen Brand", "Technical Core", 4],
    ["Strategi Kampanye", "Technical Core", 4],
    ["Riset Pasar", "Technical Core", 3],
  ],
  "Senior Brand Strategist": [
    ["Strategi Brand", "Technical Core", 4],
    ["Riset Pasar", "Technical Core", 4],
    ["Narasi & Positioning", "Technical Core", 4],
  ],
  "Creative Director": [
    ["Arahan Kreatif", "Technical Core", 5],
    ["Storytelling Visual", "Technical Core", 4],
    ["Manajemen Produksi", "Tools & Platform", 3],
  ],
  "Digital Content Specialist": [
    ["Penulisan Konten", "Technical Core", 3],
    ["Produksi Visual", "Technical Core", 3],
    ["SEO", "Tools & Platform", 3],
    ["Analitik Digital", "Tools & Platform", 3],
  ],
  "Chief Executive Officer": [
    ["Strategi Korporat", "Technical Core", 5],
    ["Alokasi Modal", "Technical Core", 5],
    ["Tata Kelola", "Regulasi", 5],
  ],
  "Chief Strategy Officer": [
    ["Strategi Korporat", "Technical Core", 5],
    ["Analisis Kompetitif", "Technical Core", 5],
    ["Pemodelan Skenario", "Tools & Platform", 4],
  ],
  "Chief Revenue Officer": [
    ["Strategi Pendapatan", "Technical Core", 5],
    ["Manajemen Pipeline", "Technical Core", 4],
    ["Penetapan Harga", "Technical Core", 4],
  ],
  "VP Corporate Strategy": [
    ["Strategi Korporat", "Technical Core", 4],
    ["Analisis Kompetitif", "Technical Core", 4],
    ["Pemodelan Skenario", "Tools & Platform", 4],
  ],
  "Head of Governance": [
    ["Manajemen Risiko", "Technical Core", 4],
    ["Kepatuhan Regulasi", "Regulasi", 5],
    ["Audit Internal", "Regulasi", 4],
  ],
};

/** Dipakai untuk posisi yang belum punya daftar aspek teknis sendiri. */
const DEFAULT_ASPECTS = [
  ["Penguasaan Alat Kerja", "Technical Core", 3],
  ["Kualitas Output", "Technical Core", 4],
  ["Dokumentasi", "Technical Core", 3],
  ["Analitik Data", "Tools & Platform", 3],
  ["Kepatuhan Prosedur", "Regulasi", 4],
];

/** Skor deterministik per (orang x aspek) — stabil antar-run, tersebar di sekitar standar. */
function scoreFor(participantId, aspect, standard) {
  const seed = [...(participantId + aspect)].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const delta = [-2, -1, -1, 0, 0, 1, 1][seed % 7];
  return clamp15(standard + delta);
}

const rows = parseCSV(read("public/data/participants.csv"));
const aspectsOf = (position) => BY_POSITION[position] ?? DEFAULT_ASPECTS;

// --- CSV standar per posisi (long format) ---
const positions = [...new Map(rows.map((r) => [r.position, r])).values()];
const stdLines = ["position,aspect,category,standard"];
positions.forEach(({ position }) => {
  aspectsOf(position).forEach(([aspect, category, standard]) => {
    stdLines.push([position, aspect, category, standard].join(","));
  });
});
writeFileSync(join(ROOT, "public/data/position_hard_competency_standards.csv"), stdLines.join("\n") + "\n", "utf8");

// --- CSV skor per partisipan (long format) ---
const scoreLines = ["id,name,aspect,score"];
rows.forEach((r) => {
  aspectsOf(r.position).forEach(([aspect, , standard]) => {
    scoreLines.push([r.id, r.name, aspect, scoreFor(r.id, aspect, standard)].join(","));
  });
});
writeFileSync(join(ROOT, "public/data/participant_hard_competency_scores.csv"), scoreLines.join("\n") + "\n", "utf8");

// --- Kompilasi ke TS supaya bisa diimport sinkron oleh kartu Score Aspect ---
const stdRows = parseCSV(read("public/data/position_hard_competency_standards.csv"));
const scoreRows = parseCSV(read("public/data/participant_hard_competency_scores.csv"));

/** position -> [{ label, category, standardScore }] (urutan mengikuti CSV) */
const standardsByPosition = {};
for (const row of stdRows) {
  (standardsByPosition[row.position] ??= []).push({
    label: row.aspect,
    category: row.category,
    standardScore: Number(row.standard),
  });
}

/** participantId -> { [aspect]: score } */
const scoresByParticipant = {};
for (const row of scoreRows) {
  (scoresByParticipant[row.id] ??= {})[row.aspect] = Number(row.score);
}

const ts = `// AUTO-GENERATED oleh scripts/gen-hard-competency.mjs — jangan edit manual.
// Sumber: public/data/position_hard_competency_standards.csv
//         public/data/participant_hard_competency_scores.csv
// Regenerate: node scripts/gen-hard-competency.mjs (sudah dihook di npm run seed).

export type HardAspectStandard = { label: string; category: string; standardScore: number };

/** Aspek teknis + standarnya per judul posisi. Daftarnya beda-beda tiap posisi. */
export const HARD_STANDARDS_BY_POSITION: Record<string, HardAspectStandard[]> = ${JSON.stringify(standardsByPosition, null, 2)};

/** Skor teknis tiap partisipan, dikunci per nama aspek. */
export const HARD_SCORES_BY_PARTICIPANT: Record<string, Record<string, number>> = ${JSON.stringify(scoresByParticipant, null, 2)};
`;
writeFileSync(join(ROOT, "src/iprofile/lib/hardCompetency.generated.ts"), ts, "utf8");

console.log(
  `gen-hard-competency: ${Object.keys(standardsByPosition).length} posisi, ` +
  `${Object.keys(scoresByParticipant).length} partisipan, ` +
  `${stdLines.length - 1} baris standar, ${scoreLines.length - 1} baris skor`,
);
