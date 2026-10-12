// Menyusun ulang JABATAN dan garis atasan di public/data/participants.csv.
// Jalankan manual: node scripts/gen-participants.mjs
//
// IDENTITAS ORANG TIDAK DISENTUH. Nama, gender, dan seluruh skor dibaca dari
// participants.csv yang sudah ada, lalu ditulis kembali apa adanya menurut id.
// Yang disusun ulang hanya position, department, team, manager_id, dan
// successor_for — orangnya berpindah kursi, datanya tetap. Foto ikut aman
// karena berkas foto dinamai menurut id.
//
// SENGAJA TIDAK ikut `npm run seed`: participants.csv tetap berkedudukan
// sebagai data yang boleh disunting tangan, dan kalau ikut predev suntingan itu
// tertimpa diam-diam tiap dev server start.
//
// Kerangkanya 5 lapis:
//   1 CEO
//   2 lima Chief (COO, CFO, CTO, CPO, CMO)
//   3 Head tiap bidang — di bawah CMO ada dua: Marketing dan Sales
//   4 unit kerja — di bawah Sales hanya ada dua: Hunter dan Farmer
//   5 staf, dinamai "<unit> #n"
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSV_PATH = "public/data/participants.csv";

/**
 * Satu unit = satu jabatan beserta jumlah pemegangnya.
 *
 * `ids` mengunci kursi ke orang tertentu supaya yang sekarang menjabat Chief
 * atau Head tidak mendadak tertukar dengan stafnya. Kursi selebihnya diisi
 * berurutan dari id yang belum terpakai.
 *
 * `staff` menyalakan penamaan bernomor: unit "Backend" dengan staff 4 melahirkan
 * Backend #1 sampai #4.
 */
const UNITS = [
  // ── Lapis 1 ────────────────────────────────────────────────────────────────
  { key: "CEO", position: "Chief Executive Officer", job: "Operasional", team: "EXE", ids: ["p05"], reportTo: null },

  // ── Lapis 2: lima Chief ────────────────────────────────────────────────────
  { key: "COO", position: "Chief Operating Officer", job: "Operasional", team: "OPS", ids: ["p36"], reportTo: "CEO" },
  { key: "CFO", position: "Chief Financial Officer", job: "Keuangan", team: "FIN", ids: ["p35"], reportTo: "CEO" },
  { key: "CTO", position: "Chief Technology Officer", job: "Teknologi", team: "ENG", ids: ["p34"], reportTo: "CEO" },
  { key: "CPO", position: "Chief Product Officer", job: "Produk", team: "PRD", ids: ["p06"], reportTo: "CEO" },
  { key: "CMO", position: "Chief Marketing Officer", job: "Marketing", team: "MKT", ids: ["p26"], reportTo: "CEO" },

  // ── Operasional (15 termasuk CEO & COO) ────────────────────────────────────
  { key: "OPS_HEAD", position: "Head of Operations", job: "Operasional", team: "OPS", ids: ["p66"], reportTo: "COO" },
  { key: "OPS", position: "Operations Lead", job: "Operasional", team: "OPS", reportTo: "OPS_HEAD", staff: { name: "Operations", count: 3 } },
  { key: "LOG", position: "Logistics Lead", job: "Operasional", team: "OPS", reportTo: "OPS_HEAD", staff: { name: "Logistics", count: 3 } },
  { key: "QLT", position: "Quality Lead", job: "Operasional", team: "OPS", reportTo: "OPS_HEAD", staff: { name: "Quality", count: 3 } },

  // ── SDM (10) ───────────────────────────────────────────────────────────────
  { key: "HR_HEAD", position: "Head of People", job: "SDM", team: "HR", ids: ["p37"], reportTo: "COO" },
  { key: "REC", position: "Recruitment Lead", job: "SDM", team: "HR", reportTo: "HR_HEAD", staff: { name: "Recruitment", count: 4 } },
  { key: "PDV", position: "People Development Lead", job: "SDM", team: "HR", reportTo: "HR_HEAD", staff: { name: "People Development", count: 3 } },

  // ── Keuangan (13 termasuk CFO) ─────────────────────────────────────────────
  { key: "FIN_HEAD", position: "Head of Finance", job: "Keuangan", team: "FIN", ids: ["p09"], reportTo: "CFO" },
  { key: "ACC", position: "Accounting Lead", job: "Keuangan", team: "FIN", reportTo: "FIN_HEAD", staff: { name: "Accounting", count: 3 } },
  { key: "TRS", position: "Treasury Lead", job: "Keuangan", team: "FIN", reportTo: "FIN_HEAD", staff: { name: "Treasury", count: 2 } },
  { key: "TAX", position: "Tax Lead", job: "Keuangan", team: "FIN", reportTo: "FIN_HEAD", staff: { name: "Tax", count: 3 } },

  // ── Teknologi (26 termasuk CTO) ────────────────────────────────────────────
  { key: "ENG_HEAD", position: "Head of Engineering", job: "Teknologi", team: "ENG", ids: ["p01"], reportTo: "CTO" },
  { key: "INF_HEAD", position: "Head of Infrastructure", job: "Teknologi", team: "ENG", ids: ["p42"], reportTo: "CTO" },
  { key: "BE", position: "Backend Lead", job: "Teknologi", team: "ENG", reportTo: "ENG_HEAD", staff: { name: "Backend", count: 4 } },
  { key: "FE", position: "Frontend Lead", job: "Teknologi", team: "ENG", reportTo: "ENG_HEAD", staff: { name: "Frontend", count: 3 } },
  { key: "QA", position: "QA Lead", job: "Teknologi", team: "ENG", reportTo: "ENG_HEAD", staff: { name: "QA", count: 3 } },
  { key: "DEVOPS", position: "DevOps Lead", job: "Teknologi", team: "ENG", reportTo: "INF_HEAD", staff: { name: "DevOps", count: 3 } },
  { key: "SEC", position: "Security Lead", job: "Teknologi", team: "ENG", reportTo: "INF_HEAD", staff: { name: "Security", count: 2 } },
  { key: "DATA", position: "Data Lead", job: "Teknologi", team: "ENG", reportTo: "INF_HEAD", staff: { name: "Data", count: 2 } },

  // ── Produk (13 termasuk CPO) ───────────────────────────────────────────────
  { key: "PRD_HEAD", position: "Head of Product", job: "Produk", team: "PRD", ids: ["p08"], reportTo: "CPO" },
  { key: "PM", position: "Product Management Lead", job: "Produk", team: "PRD", reportTo: "PRD_HEAD", staff: { name: "Product Management", count: 3 } },
  { key: "PD", position: "Product Design Lead", job: "Produk", team: "PRD", reportTo: "PRD_HEAD", staff: { name: "Product Design", count: 3 } },
  { key: "PA", position: "Product Analytics Lead", job: "Produk", team: "PRD", reportTo: "PRD_HEAD", staff: { name: "Product Analytics", count: 2 } },

  // ── Marketing (23 termasuk CMO) ────────────────────────────────────────────
  { key: "MKT_HEAD", position: "Head of Marketing", job: "Marketing", team: "MKT", ids: ["p21"], reportTo: "CMO" },
  { key: "DGM", position: "Digital Marketing Lead", job: "Marketing", team: "MKT", reportTo: "MKT_HEAD", staff: { name: "Digital Marketing", count: 7 } },
  { key: "BRC", position: "Brand & Content Lead", job: "Marketing", team: "MKT", reportTo: "MKT_HEAD", staff: { name: "Brand & Content", count: 6 } },
  { key: "MRS", position: "Market Research Lead", job: "Marketing", team: "MKT", reportTo: "MKT_HEAD", staff: { name: "Market Research", count: 4 } },

  // ── Sales: HANYA Hunter & Farmer di lapis 4, masing-masing 5 staf ──────────
  { key: "SLS_HEAD", position: "Head of Sales", job: "Marketing", team: "MKT", ids: ["p78"], reportTo: "CMO" },
  { key: "HUNTER", position: "Hunter", job: "Hunter", team: "HUN", reportTo: "SLS_HEAD", staff: { name: "Hunter", count: 5 } },
  { key: "FARMER", position: "Farmer", job: "Farmer", team: "FAR", reportTo: "SLS_HEAD", staff: { name: "Farmer", count: 5 } },
];

// ── Identitas orang: dibaca, tidak dibuat ───────────────────────────────────
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

const existingText = readFileSync(join(ROOT, CSV_PATH), "utf8").replace(/^﻿/, "");
const existingLines = existingText.split(/\r?\n/).filter((l) => l.trim());
const existingHeaders = parseCSVLine(existingLines[0]).map((h) => h.trim());
const existing = existingLines.slice(1).map((line) => {
  const vals = parseCSVLine(line);
  return existingHeaders.reduce((o, h, i) => ((o[h] = (vals[i] ?? "").trim()), o), {});
});
const byId = new Map(existing.map((r) => [r.id, r]));

/** Kolom yang datang apa adanya dari berkas lama — tidak boleh disusun ulang. */
const KEPT = [
  "name", "gender", "disc", "potential", "behavioral", "technical",
  "performance", "leadership", "competency", "prediction", "engagement",
];

// ── Rakit ────────────────────────────────────────────────────────────────────
const build = () => {
  const byKey = new Map(UNITS.map((u) => [u.key, u]));

  // Lapis dihitung dari rantai reportTo, bukan ditulis tangan — kalau atasan
  // suatu unit diubah, lapisnya ikut menyesuaikan sendiri.
  const levelOf = (key, guard = 0) => {
    const u = byKey.get(key);
    if (!u || !u.reportTo) return 1;
    if (guard > 10) throw new Error(`Rantai atasan berputar di unit ${key}`);
    return levelOf(u.reportTo, guard + 1) + 1;
  };

  const locked = new Set(UNITS.flatMap((u) => u.ids ?? []));
  const pool = existing.map((r) => r.id).filter((id) => !locked.has(id));
  let cursor = 0;
  const takeId = () => {
    if (cursor >= pool.length) throw new Error("Kursi lebih banyak daripada orang yang tersedia");
    return pool[cursor++];
  };

  const rows = [];
  const firstIdOf = new Map();

  const seat = ({ id, position, job, team, level, unitKey }) => {
    const src = byId.get(id);
    if (!src) throw new Error(`Id ${id} tidak ada di ${CSV_PATH}`);
    const row = { id, position, department: job, team, level, unitKey, manager_id: "", successor_for: "" };
    for (const k of KEPT) row[k] = src[k] ?? "";
    rows.push(row);
    return row;
  };

  for (const unit of UNITS) {
    const level = levelOf(unit.key);
    const heads = unit.ids?.length ?? 1;
    for (let i = 0; i < heads; i++) {
      const id = unit.ids?.[i] ?? takeId();
      const row = seat({ id, position: unit.position, job: unit.job, team: unit.team, level, unitKey: unit.key });
      if (i === 0) firstIdOf.set(unit.key, id);
      row.managerUnit = unit.reportTo;
    }
    // Staf unit: satu lapis di bawah pemimpin unitnya, dinamai bernomor.
    for (let n = 1; n <= (unit.staff?.count ?? 0); n++) {
      const row = seat({
        id: takeId(),
        position: `${unit.staff.name} #${n}`,
        job: unit.job,
        team: unit.team,
        level: level + 1,
        unitKey: unit.key + "_STAFF",
      });
      row.managerUnit = unit.key;
    }
  }

  if (cursor < pool.length) {
    throw new Error(`${pool.length - cursor} orang tidak kebagian kursi — jumlah di blueprint kurang`);
  }

  for (const r of rows) r.manager_id = r.managerUnit ? firstIdOf.get(r.managerUnit) : "";

  // Successor: bawahan langsung dengan competency tertinggi ditandai sebagai
  // calon pengganti atasannya. Talent Mapping & iProfile ikut hidup dari sini.
  const byManager = new Map();
  for (const r of rows) {
    if (!r.manager_id) continue;
    const list = byManager.get(r.manager_id) ?? [];
    list.push(r);
    byManager.set(r.manager_id, list);
  }
  for (const [managerId, list] of byManager) {
    const best = [...list].sort((a, b) => Number(b.competency) - Number(a.competency))[0];
    if (best && Number(best.competency) >= 80) best.successor_for = managerId;
  }

  return rows;
};

const rows = build();

// Identitas wajib utuh: kalau ada id yang hilang atau nama yang bergeser, seluruh
// foto dan riwayat yang menempel pada id itu jadi salah orang.
const hilang = existing.map((r) => r.id).filter((id) => !rows.some((r) => r.id === id));
if (hilang.length) throw new Error(`Id hilang dari hasil: ${hilang.join(", ")}`);
const bergeser = rows.filter((r) => r.name !== byId.get(r.id).name || r.gender !== byId.get(r.id).gender);
if (bergeser.length) throw new Error(`Nama/gender bergeser di: ${bergeser.map((r) => r.id).join(", ")}`);

const HEADERS = [
  "id", "name", "gender", "position", "department", "team", "disc", "potential",
  "manager_id", "successor_for", "behavioral", "technical", "performance",
  "leadership", "competency", "prediction", "engagement",
];

const csv = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const sorted = [...rows].sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
const lines = [HEADERS.join(",")];
for (const r of sorted) lines.push(HEADERS.map((h) => csv(r[h] ?? "")).join(","));
writeFileSync(join(ROOT, CSV_PATH), lines.join("\n") + "\n", "utf8");

const perLevel = {};
const perJob = {};
for (const r of rows) {
  perLevel[r.level] = (perLevel[r.level] ?? 0) + 1;
  perJob[r.department] = (perJob[r.department] ?? 0) + 1;
}
console.log(`participants.csv: ${rows.length} employee, ${new Set(rows.map((r) => r.position)).size} posisi unik`);
console.log("per lapis:", perLevel);
console.log("per Job:", perJob);
console.log("identitas (nama, gender, skor) dipertahankan dari berkas sebelumnya");
