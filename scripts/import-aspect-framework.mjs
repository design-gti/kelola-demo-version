// Menyusun tiga berkas data aspek dari framework kompetensi milik klien.
// Jalankan manual: node scripts/import-aspect-framework.mjs
//
// Sumber:
//   data-sources/Framework_Kompetensi_Sales_Hunter_Farmer.xlsx  (Hunter & Farmer)
//   scripts/data/extraAspects.mjs                                (6 Job lainnya)
//
// Keluaran:
//   public/data/aspects.csv                 aspect,category,description
//   public/data/aspect_key_behaviours.csv   aspect,level,key_behaviour
//   public/data/job_aspects.csv             job,aspect,standard
//
// SENGAJA TIDAK ikut `npm run seed`: ketiga CSV itu berkedudukan sebagai data
// yang boleh disunting tangan, dan kalau ikut predev suntingannya tertimpa
// diam-diam tiap dev server start. Sama seperti gen-participants.mjs.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import XLSX from "xlsx";
import { EXTRA_ASPECTS, JOB_ASPECTS } from "./data/extraAspects.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = "data-sources/Framework_Kompetensi_Sales_Hunter_Farmer.xlsx";

/** Taraf penilaian 1..5; tiap taraf punya beberapa Key Behaviour. */
const LEVELS = [1, 2, 3, 4, 5];
/** Batas aspek per Job — angka dari klien, sama dengan jumlah aspek Farmer. */
const MAX_ASPECTS_PER_JOB = 13;

const csv = (v) => {
  const s = String(v ?? "").trim();
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// ── Baca berkas klien ────────────────────────────────────────────────────────
const wb = XLSX.read(readFileSync(join(ROOT, SOURCE)));
const libRows = XLSX.utils.sheet_to_json(wb.Sheets["Library Aspek"], { defval: "" });
const kbRows = XLSX.utils.sheet_to_json(wb.Sheets["Key Behavior"], { defval: "" });

const yes = (v) => String(v).trim().toLowerCase() === "ya";
/** "L3" maupun 3 sama-sama berarti taraf 3. */
const levelOf = (v) => Number(String(v).replace(/\D/g, ""));

const clientAspects = libRows.map((r) => ({
  aspect: String(r["Nama Aspek (ID)"]).trim(),
  category: String(r["Kategori Aspek"]).trim(),
  description: String(r["Definisi"]).trim(),
  hunter: yes(r["Dipakai Hunter"]),
  farmer: yes(r["Dipakai Farmer"]),
}));

// ── Aspek ────────────────────────────────────────────────────────────────────
const aspects = [
  ...clientAspects.map((a) => ({ aspect: a.aspect, category: a.category, description: a.description })),
  ...EXTRA_ASPECTS.map((a) => ({ aspect: a.aspect, category: "Technical", description: a.description })),
];

const dupes = aspects.map((a) => a.aspect).filter((n, i, arr) => arr.indexOf(n) !== i);
if (dupes.length) throw new Error(`Aspek kembar: ${[...new Set(dupes)].join(", ")}`);

// ── Key Behaviour ────────────────────────────────────────────────────────────
/** @type {{aspect: string, level: number, label: string}[]} */
const keyBehaviours = [];
for (const r of kbRows) {
  keyBehaviours.push({
    aspect: String(r["Nama Aspek"]).trim(),
    level: levelOf(r["Level"]),
    label: String(r["Key Behavior"]).trim(),
  });
}
for (const a of EXTRA_ASPECTS) {
  a.kb.forEach((butir, i) => butir.forEach((label) => keyBehaviours.push({ aspect: a.aspect, level: i + 1, label })));
}

// Tiap aspek harus punya KB di SEMUA taraf: kolom taraf 1-5 di halaman Aspect
// mengambil pilihannya dari sini, jadi taraf yang kosong berarti ada kolom yang
// tidak punya satu pun pilihan.
for (const a of aspects) {
  const punya = new Set(keyBehaviours.filter((k) => k.aspect === a.aspect).map((k) => k.level));
  const kurang = LEVELS.filter((l) => !punya.has(l));
  if (kurang.length) throw new Error(`Aspek "${a.aspect}" tidak punya KB di taraf ${kurang.join(", ")}`);
}

// ── Aspek & standar per Job ──────────────────────────────────────────────────
/**
 * Standar sebuah aspek untuk sebuah Job = taraf TERTINGGI yang ditandai "Ya" di
 * kolom Target. Kolom itu menandai sampai taraf mana perilaku diharapkan
 * muncul, jadi taraf tertingginya adalah standar yang dituntut Job tersebut.
 */
const standardFromTarget = (aspect, kolom) => {
  const tercapai = kbRows
    .filter((r) => String(r["Nama Aspek"]).trim() === aspect && yes(r[kolom]))
    .map((r) => levelOf(r["Level"]));
  return tercapai.length ? Math.max(...tercapai) : null;
};

/** @type {{job: string, aspect: string, standard: number}[]} */
const jobAspects = [];

for (const [job, kolom, pakai] of [
  ["Hunter", "Target Hunter", (a) => a.hunter],
  ["Farmer", "Target Farmer", (a) => a.farmer],
]) {
  for (const a of clientAspects.filter(pakai)) {
    const standard = standardFromTarget(a.aspect, kolom);
    if (standard === null) throw new Error(`${job}: aspek "${a.aspect}" dipakai tapi tidak punya target taraf`);
    jobAspects.push({ job, aspect: a.aspect, standard });
  }
}

// Job di luar penjualan: standarnya belum berasal dari klien, jadi diturunkan
// dari kategori — Technical dituntut lebih tinggi karena itu inti pekerjaannya.
for (const [job, { general, technical }] of Object.entries(JOB_ASPECTS)) {
  for (const aspect of [...general, ...technical]) {
    if (!aspects.some((a) => a.aspect === aspect)) throw new Error(`${job}: aspek "${aspect}" tidak ada di library`);
    jobAspects.push({ job, aspect, standard: technical.includes(aspect) ? 4 : 3 });
  }
}

const perJob = jobAspects.reduce((acc, r) => ((acc[r.job] = (acc[r.job] ?? 0) + 1), acc), {});
const kebanyakan = Object.entries(perJob).filter(([, n]) => n > MAX_ASPECTS_PER_JOB);
if (kebanyakan.length) {
  throw new Error(
    `Job melebihi ${MAX_ASPECTS_PER_JOB} aspek: ${kebanyakan.map(([j, n]) => `${j} (${n})`).join(", ")}`,
  );
}

// ── Tulis ────────────────────────────────────────────────────────────────────
const write = (path, header, rows) =>
  writeFileSync(join(ROOT, path), [header, ...rows].join("\n") + "\n", "utf8");

write(
  "public/data/aspects.csv",
  "aspect,category,description",
  aspects.map((a) => [a.aspect, a.category, a.description].map(csv).join(",")),
);
write(
  "public/data/aspect_key_behaviours.csv",
  "aspect,level,key_behaviour",
  keyBehaviours.map((k) => [k.aspect, k.level, k.label].map(csv).join(",")),
);
write(
  "public/data/job_aspects.csv",
  "job,aspect,standard",
  jobAspects.map((r) => [r.job, r.aspect, r.standard].map(csv).join(",")),
);

console.log(
  `aspects.csv: ${aspects.length} aspek ` +
    `(${aspects.filter((a) => a.category === "General").length} General, ` +
    `${aspects.filter((a) => a.category === "Technical").length} Technical)`,
);
console.log(`aspect_key_behaviours.csv: ${keyBehaviours.length} KB`);
console.log("job_aspects.csv:", Object.entries(perJob).map(([j, n]) => `${j} ${n}`).join(", "));
