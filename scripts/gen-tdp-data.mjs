// Generate public/data/tdp-employees.csv from the canonical participants.csv so the
// TDP app (embedded at /tdp/) shows the SAME people as the rest of the demo. The TDP
// app fetches this file at runtime, so editing participants.csv + re-running seed is
// enough — no TDP rebuild needed for data changes.
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
const n = (v) => (v === "" || v == null ? "" : Number(v));
const to5 = (v) => { const x = Number(v); return Number.isFinite(x) ? Math.max(1, Math.min(5, Math.round(x / 20))) : ""; };

// Deterministic bio-data (kept in sync with scripts/gen-iprofile.mjs so the same
// person shows the same education/etc across TDP and iProfile).
const EDU = ["S1 Teknik Informatika", "S1 Manajemen", "S2 Business Administration", "S1 Psikologi", "S2 Data Science", "S1 Akuntansi"];
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

const HEADERS = [
  "Shown in TDP", "Employee ID", "Name", "Position", "Department", "Level", "Years In Company", "Years In Role",
  "Manager", "Photo URL", "Skills (comma separated)", "Certifications (comma separated)", "Education",
  "Salary", "Successor Identified",
  "Last Promotion Date", "Personality (DISC)", "Leadership Type", "Email", "Critical Position", "IQ",
  "[Performance] Score", "[Potensi] Score", "[Engagement] Score", "[CAPABILITY] Competency Match",
  "[CAPABILITY] Analytical Thinking", "[CAPABILITY] Collaboration", "[CAPABILITY] Decision Making",
  "[CAPABILITY] Developing Others", "[CAPABILITY] Influencing", "[CAPABILITY] Integrity",
  "[CAPABILITY] Leadership", "[CAPABILITY] Planning", "[CAPABILITY] Relationship Building",
  "[CAPABILITY] Strategic Thinking",
];

const out = [HEADERS.join(",")];
rows.forEach((r, i) => {
  const perf = n(r.performance), pot = n(r.leadership), comp = n(r.competency), eng = n(r.engagement);
  const tech = r.technical === "" ? comp : n(r.technical);
  const beh = r.behavioral === "" ? comp : n(r.behavioral);
  const rec = {
    "Shown in TDP": "TRUE",
    "Employee ID": r.id,
    "Name": r.name,
    "Position": r.position,
    "Department": r.department,
    "Level": "",
    "Years In Company": 3 + (i % 12),
    "Years In Role": 1 + (i % 5),
    "Manager": r.manager_id ? (nameById[r.manager_id] ?? "") : "",
    "Photo URL": "",
    "Skills (comma separated)": (SKILLS_BY_DISC[(r.disc || "S")[0]] || SKILLS_BY_DISC.S).join(", "),
    "Certifications (comma separated)": r.potential === "high" ? (CERTS_BY_DEPT[r.department] ?? "") : "",
    "Education": EDU[i % EDU.length],
    // deterministic promotion date (valid ISO): more recent for higher performers
    "Salary": 9000000 + (comp === "" ? 0 : comp * 120000) + i * 250000,
    "Successor Identified": r.potential === "high" ? "Yes" : "No",
    "Last Promotion Date": `202${3 + (i % 3)}-${String((i % 12) + 1).padStart(2, "0")}-15`,
    "Personality (DISC)": r.disc,
    "Leadership Type": "",
    "Email": "",
    "Critical Position": r.potential === "high" ? "Yes" : "No",
    "IQ": comp === "" ? "" : 100 + Math.round(comp / 4),
    "[Performance] Score": perf,
    "[Potensi] Score": pot,
    "[Engagement] Score": eng,
    "[CAPABILITY] Competency Match": comp,
    "[CAPABILITY] Analytical Thinking": to5(tech),
    "[CAPABILITY] Collaboration": to5(eng),
    "[CAPABILITY] Decision Making": to5(perf),
    "[CAPABILITY] Developing Others": to5(pot),
    "[CAPABILITY] Influencing": to5((eng + perf) / 2),
    "[CAPABILITY] Integrity": to5(beh),
    "[CAPABILITY] Leadership": to5(pot),
    "[CAPABILITY] Planning": to5(comp),
    "[CAPABILITY] Relationship Building": to5(eng),
    "[CAPABILITY] Strategic Thinking": to5(comp),
  };
  out.push(HEADERS.map(h => { const v = String(rec[h] ?? ""); return /[",]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; }).join(","));
});

writeFileSync(OUT, out.join("\n") + "\n");
console.log(`tdp-employees.csv: ${rows.length} employees → public/data/tdp-employees.csv`);
