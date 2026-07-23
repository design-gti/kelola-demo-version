// Generate public/data/tdp-employees.csv from canonical participants.csv, in the
// SCHEMA expected by the Prodigy-design TDP app (tdp-prototype feat/tdp-prodigy-wc,
// based on tdp-mvp): [KOMPETENSI] competency columns + Score/Capability/Commitment/
// Performance/[Potensi] Score. The TDP app fetches this file at runtime, so editing
// participants.csv + re-running seed is enough (no TDP rebuild for data changes).
// Run: node scripts/gen-tdp-data.mjs   (wired into `npm run seed`)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CANON = join(ROOT, "public/data/participants.csv");
const OUT = join(ROOT, "public/data/tdp-employees.csv");

function parseCSV(text) {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter(l => l.trim());
  const h = lines[0].split(",").map(s => s.trim());
  return lines.slice(1).map(l => { const v = l.split(","); return h.reduce((o, k, i) => ((o[k] = (v[i] ?? "").trim()), o), {}); });
}

const rows = parseCSV(readFileSync(CANON, "utf8"));
const nameById = Object.fromEntries(rows.map(r => [r.id, r.name]));
const num = (v) => (v === "" || v == null ? 0 : Number(v));
const has = (v) => v !== "" && v != null;
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const to5 = (v) => clamp(Math.round(num(v) / 20), 1, 5); // 0-100 → 1-5

// Deterministic bio (kept consistent with gen-iprofile.mjs).
const EDU = ["S1 Teknik Informatika", "S1 Manajemen", "S2 Business Administration", "S1 Psikologi", "S2 Data Science", "S1 Akuntansi"];
const CITIES = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar"];
const SKILLS_BY_DISC = {
  D: ["Leadership", "Decision Making", "Negotiation"],
  I: ["Communication", "Influencing", "Presentation"],
  S: ["Collaboration", "Mentoring", "Process Improvement"],
  C: ["Analytical Thinking", "Data Analysis", "Quality Control"],
};
const CERTS_BY_DEPT = {
  Teknologi: "AWS Solutions Architect", Keuangan: "Chartered Accountant (CA)",
  SDM: "SHRM-CP", Operasional: "Lean Six Sigma", Pemasaran: "HubSpot Inbound",
  Strategi: "Certified Strategy Professional",
};

// 8 [KOMPETENSI] columns the TDP app maps to radar/aspect fields → 1-5 scale.
const KOMPETENSI = [
  ["[KOMPETENSI] Agility and Adaptability", (r) => to5(has(r.behavioral) ? r.behavioral : r.competency)],
  ["[KOMPETENSI] Customer Focus", (r) => to5(r.engagement)],
  ["[KOMPETENSI] Building Strategic Partnership", (r) => to5((num(r.behavioral) + num(r.performance)) / 2)],
  ["[KOMPETENSI] Developing Organizational Capabilities", (r) => to5(r.leadership)],
  ["[KOMPETENSI] Optimizing Work Process", (r) => to5(has(r.technical) ? r.technical : r.competency)],
  ["[KOMPETENSI] Driving Execution", (r) => to5(r.performance)],
  ["[KOMPETENSI] Leading Change", (r) => to5(r.leadership)],
  ["[KOMPETENSI] Strategic Orientation", (r) => to5(r.competency)],
];

const HEADERS = [
  "Employee ID", "Shown in TDP", "Name", "Email", "Department", "Position", "Level", "Manager",
  "Photo URL", "Gender", "City", "Marital Status", "Education", "Critical Position",
  "Years In Company", "Years In Role", "Last Promotion Date", "Skills (comma separated)",
  "Certifications (comma separated)", "Personality (DISC)", "Leadership Type",
  "Score", "Readiness", "IQ", "Capability", "Commitment", "Contribution", "Performance", "[Potensi] Score",
  ...KOMPETENSI.map(([h]) => h),
];

const slug = (name) => name.toLowerCase().normalize("NFD").replace(/[^\w\s]/g, "").trim().replace(/\s+/g, ".");

const out = [HEADERS.join(",")];
rows.forEach((r, i) => {
  const comp = num(r.competency);
  const rec = {
    "Employee ID": r.id,
    "Shown in TDP": "TRUE",
    "Name": r.name,
    "Email": `${slug(r.name)}@talentlytica.com`,
    "Department": r.department,
    "Position": r.position,
    "Level": "", // career grade derived from position by the app
    "Manager": r.manager_id ? (nameById[r.manager_id] ?? "") : "",
    "Photo URL": "",
    "Gender": i % 3 === 0 ? "Perempuan" : "Laki-laki",
    "City": CITIES[i % CITIES.length],
    "Marital Status": i % 2 === 0 ? "Menikah" : "Belum Menikah",
    "Education": EDU[i % EDU.length],
    "Critical Position": r.potential === "high" ? "Yes" : "No",
    "Years In Company": 3 + (i % 12),
    "Years In Role": 1 + (i % 5),
    "Last Promotion Date": `202${3 + (i % 3)}-${String((i % 12) + 1).padStart(2, "0")}-15`,
    "Skills (comma separated)": (SKILLS_BY_DISC[(r.disc || "S")[0]] || SKILLS_BY_DISC.S).join(", "),
    "Certifications (comma separated)": r.potential === "high" ? (CERTS_BY_DEPT[r.department] ?? "") : "",
    "Personality (DISC)": r.disc,
    "Leadership Type": "",
    "Score": comp,                                  // readiness 0-100
    "Readiness": "",
    "IQ": comp ? 100 + Math.round(comp / 4) : "",
    "Capability": comp,                             // competency match 0-100
    "Commitment": num(r.engagement),               // engagement 0-100
    "Contribution": num(r.engagement),
    "Performance": num(r.performance),
    "[Potensi] Score": num(r.leadership),
    ...Object.fromEntries(KOMPETENSI.map(([h, fn]) => [h, fn(r)])),
  };
  out.push(HEADERS.map(h => { const v = String(rec[h] ?? ""); return /[",]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; }).join(","));
});

writeFileSync(OUT, out.join("\n") + "\n");
console.log(`tdp-employees.csv: ${rows.length} employees → public/data/tdp-employees.csv (tdp-mvp schema)`);
