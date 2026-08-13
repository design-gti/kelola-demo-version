// Aspek kompetensi — satu model untuk seluruh aplikasi.
//
// MODEL:
//   Aspek       katalog tunggal (public/data/aspects.csv). "General" dan
//               "Technical" cuma dua kategori, sejajar dengan kategori lain
//               yang nanti dibuat user.
//   Key Behaviour  indikator perilaku, BERTARAF: tiap aspek punya beberapa KB
//               di tiap taraf 1-5. Kolom taraf di halaman Aspect mengambil
//               pilihannya dari taraf yang bersangkutan saja.
//   Job         menentukan aspek MANA yang dinilai (maks 13) sekaligus
//               STANDAR tiap aspeknya. Semua posisi dalam satu Job dinilai
//               dengan aspek yang sama.
//
// Sumber — ketiganya hasil `node scripts/import-aspect-framework.mjs`, boleh
// disunting tangan lalu jalankan ulang script ini:
//   - public/data/aspects.csv                (aspect, category, description)
//   - public/data/aspect_key_behaviours.csv  (aspect, level, key_behaviour)
//   - public/data/job_aspects.csv            (job, aspect, standard)
//   - public/data/participants.csv           (daftar posisi & partisipan)
//
// Output:
//   - public/data/position_aspects.csv              (position, aspect)
//   - public/data/job_aspect_standards.csv          (job, aspect, standard)
//   - public/data/participant_competency_scores.csv (id, name, aspect, score)
//   - public/data/participant_aspect_kb_scores.csv  (id, aspect, level, key_behaviour, score)
//   - src/data/model/aspects.generated.ts           (dipakai UI, import sinkron)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8").replace(/^﻿/, "");

/** Pembaca CSV yang mengerti tanda kutip — deskripsi & KB mengandung koma. */
function parseCSVLine(line) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else quoted = false;
      } else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const vals = parseCSVLine(line);
    return headers.reduce((o, h, i) => ((o[h] = (vals[i] ?? "").trim()), o), {});
  });
}

const csv = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** Hash kecil & stabil supaya angka yang keluar sama tiap kali dijalankan. */
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

const SCALE = 5;
const clamp15 = (n) => Math.max(1, Math.min(SCALE, n));
const MAX_ASPECTS_PER_JOB = 13;

// ── Baca sumber ──────────────────────────────────────────────────────────────
const catalog = parseCSV(read("public/data/aspects.csv"));
const kbRows = parseCSV(read("public/data/aspect_key_behaviours.csv")).map((r) => ({
  aspect: r.aspect,
  level: Number(r.level),
  label: r.key_behaviour,
}));
const jobAspectRows = parseCSV(read("public/data/job_aspects.csv")).map((r) => ({
  job: r.job,
  aspect: r.aspect,
  standard: Number(r.standard),
}));
const participants = parseCSV(read("public/data/participants.csv"));

const byLabel = Object.fromEntries(catalog.map((a) => [a.aspect, a]));
const positions = [...new Set(participants.map((p) => p.position))];
const jobOfPosition = Object.fromEntries(participants.map((p) => [p.position, p.department]));
const jobs = [...new Set(participants.map((p) => p.department))];

// ── Periksa keutuhan data ────────────────────────────────────────────────────
const unknown = jobAspectRows.map((r) => r.aspect).filter((a) => !byLabel[a]);
if (unknown.length) throw new Error(`Aspek tidak ada di aspects.csv: ${[...new Set(unknown)].join(", ")}`);

const jobsWithoutAspects = jobs.filter((j) => !jobAspectRows.some((r) => r.job === j));
if (jobsWithoutAspects.length) {
  throw new Error(`Job tanpa aspek di job_aspects.csv: ${jobsWithoutAspects.join(", ")}`);
}

/** Aspek + standar untuk sebuah Job. */
const aspectsOfJob = Object.fromEntries(
  jobs.map((j) => [j, jobAspectRows.filter((r) => r.job === j).map((r) => r.aspect)]),
);
const standardOf = (job, aspect) =>
  jobAspectRows.find((r) => r.job === job && r.aspect === aspect)?.standard ?? 3;

const tooMany = jobs.filter((j) => aspectsOfJob[j].length > MAX_ASPECTS_PER_JOB);
if (tooMany.length) throw new Error(`Job melebihi ${MAX_ASPECTS_PER_JOB} aspek: ${tooMany.join(", ")}`);

/** KB satu aspek, dikelompokkan menurut taraf. */
const kbOf = (aspect) => kbRows.filter((k) => k.aspect === aspect);

// Tiap aspek yang dipakai harus punya KB di semua taraf: kolom taraf 1-5 di
// halaman Aspect mengambil pilihannya dari sini, jadi taraf yang kosong berarti
// ada kolom tanpa satu pun pilihan.
const dipakai = [...new Set(jobAspectRows.map((r) => r.aspect))];
for (const a of dipakai) {
  const punya = new Set(kbOf(a).map((k) => k.level));
  const kurang = Array.from({ length: SCALE }, (_, i) => i + 1).filter((l) => !punya.has(l));
  if (kurang.length) throw new Error(`Aspek "${a}" tidak punya KB di taraf ${kurang.join(", ")}`);
}

/** Aspek yang dinilai untuk sebuah posisi = aspek Job-nya. */
const aspectsOf = (position) => aspectsOfJob[jobOfPosition[position]] ?? [];

// ── position_aspects.csv ─────────────────────────────────────────────────────
const posLines = ["position,aspect"];
positions.forEach((p) => aspectsOf(p).forEach((a) => posLines.push([p, a].map(csv).join(","))));
writeFileSync(join(ROOT, "public/data/position_aspects.csv"), posLines.join("\n") + "\n", "utf8");

// ── job_aspect_standards.csv ─────────────────────────────────────────────────
const stdLines = ["job,aspect,standard"];
jobs.forEach((j) => aspectsOfJob[j].forEach((a) => stdLines.push([j, a, standardOf(j, a)].map(csv).join(","))));
writeFileSync(join(ROOT, "public/data/job_aspect_standards.csv"), stdLines.join("\n") + "\n", "utf8");

// ── participant_competency_scores.csv ────────────────────────────────────────
// Skor disebar di sekitar standar Job-nya supaya sebagian orang di bawah
// standar dan sebagian di atas — bukan acak lepas dari tuntutan jabatannya.
const SCORE_DELTAS = [-2, -1, -1, 0, 0, 1, 1];
const scoreOf = (id, job, aspect) =>
  clamp15(standardOf(job, aspect) + SCORE_DELTAS[hash(id + aspect) % SCORE_DELTAS.length]);

const scoreLines = ["id,name,aspect,score"];
participants.forEach((p) =>
  aspectsOf(p.position).forEach((a) =>
    scoreLines.push([p.id, p.name, a, scoreOf(p.id, p.department, a)].map(csv).join(",")),
  ),
);
writeFileSync(join(ROOT, "public/data/participant_competency_scores.csv"), scoreLines.join("\n") + "\n", "utf8");

// ── participant_aspect_kb_scores.csv ─────────────────────────────────────────
// Satu skor per Key Behaviour. Taraf KB ikut ditulis supaya breakdown di
// iProfile bisa menunjukkan perilaku itu ada di taraf berapa.
const KB_DELTAS = [0, 1, -1, 1, 0, -1];

const kbLines = ["id,aspect,level,key_behaviour,score"];
participants.forEach((p) =>
  aspectsOf(p.position).forEach((a) => {
    const base = scoreOf(p.id, p.department, a);
    kbOf(a).forEach((kb) =>
      kbLines.push(
        [p.id, a, kb.level, kb.label, clamp15(base + KB_DELTAS[hash(p.id + a + kb.label) % KB_DELTAS.length])]
          .map(csv)
          .join(","),
      ),
    );
  }),
);
writeFileSync(join(ROOT, "public/data/participant_aspect_kb_scores.csv"), kbLines.join("\n") + "\n", "utf8");

// ── modul TS ─────────────────────────────────────────────────────────────────
const catalogOut = catalog.map((a) => ({
  label: a.aspect,
  category: a.category,
  description: a.description,
  keyBehaviours: kbOf(a.aspect).map((k) => ({ level: k.level, label: k.label })),
}));
const aspectsByPosition = Object.fromEntries(positions.map((p) => [p, aspectsOf(p)]));
const standardsByJob = Object.fromEntries(
  jobs.map((j) => [j, Object.fromEntries(aspectsOfJob[j].map((a) => [a, standardOf(j, a)]))]),
);
const scoresByParticipant = Object.fromEntries(
  participants.map((p) => [
    p.id,
    Object.fromEntries(aspectsOf(p.position).map((a) => [a, scoreOf(p.id, p.department, a)])),
  ]),
);
const kbByParticipant = Object.fromEntries(
  participants.map((p) => [
    p.id,
    Object.fromEntries(
      aspectsOf(p.position).map((a) => {
        const base = scoreOf(p.id, p.department, a);
        return [
          a,
          kbOf(a).map((kb) => ({
            label: kb.label,
            level: kb.level,
            score: clamp15(base + KB_DELTAS[hash(p.id + a + kb.label) % KB_DELTAS.length]),
          })),
        ];
      }),
    ),
  ]),
);

const ts = `// AUTO-GENERATED oleh scripts/gen-aspects.mjs — jangan edit manual.
// Sumber: public/data/aspects.csv + aspect_key_behaviours.csv + job_aspects.csv
// + participants.csv. Regenerate: node scripts/gen-aspects.mjs (dihook di npm run seed).

export type AspectCategory = string;
/** Key Behaviour beserta tarafnya; skor hanya ada pada breakdown per partisipan. */
export type KeyBehaviourRef = { level: number; label: string };
export type AspectKeyBehaviour = { label: string; level: number; score: number };
export type CatalogAspect = {
  label: string;
  category: AspectCategory;
  description: string;
  /** ${SCALE} taraf, beberapa butir per taraf. */
  keyBehaviours: KeyBehaviourRef[];
};

/** Semua aspek yang dikenal aplikasi, apa pun kategorinya. */
export const ASPECT_CATALOG: CatalogAspect[] = ${JSON.stringify(catalogOut, null, 2)};

/** Aspek yang dinilai untuk tiap posisi — sama untuk semua posisi dalam satu Job. */
export const ASPECTS_BY_POSITION: Record<string, string[]> = ${JSON.stringify(aspectsByPosition, null, 2)};

/** Job (departemen) tiap posisi — dipakai untuk menemukan standar aspeknya. */
export const JOB_BY_POSITION: Record<string, string> = ${JSON.stringify(jobOfPosition, null, 2)};

/** Standar tiap aspek per Job — aspek yang sama boleh beda antar Job. */
export const STANDARDS_BY_JOB: Record<string, Record<string, number>> = ${JSON.stringify(standardsByJob, null, 2)};

/** Skor tiap partisipan per aspek. */
export const SCORES_BY_PARTICIPANT: Record<string, Record<string, number>> = ${JSON.stringify(scoresByParticipant, null, 2)};

/** Breakdown Key Behaviour tiap partisipan per aspek. */
export const KB_BY_PARTICIPANT: Record<string, Record<string, AspectKeyBehaviour[]>> = ${JSON.stringify(kbByParticipant, null, 2)};
`;
writeFileSync(join(ROOT, "src/data/model/aspects.generated.ts"), ts, "utf8");

const perJob = jobs.map((j) => aspectsOfJob[j].length);
console.log(
  `gen-aspects: ${catalog.length} aspek katalog, ${kbRows.length} KB bertaraf, ` +
    `${jobs.length} job (aspek/job ${Math.min(...perJob)}-${Math.max(...perJob)}), ` +
    `${positions.length} posisi, ${stdLines.length - 1} baris standar, ` +
    `${scoreLines.length - 1} baris skor, ${kbLines.length - 1} baris KB`,
);
