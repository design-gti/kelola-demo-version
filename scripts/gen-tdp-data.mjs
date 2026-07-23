// Generate public/data/tdp-employees.csv from canonical participants.csv, in the
// FULL schema expected by the Prodigy-design TDP app (tdp-prototype feat/tdp-prodigy-wc,
// based on tdp-mvp) — including [KOMPETENSI] (18), [HEROES] (12), [LEADERSHIP PROFILE]
// (9) and [LEADERSHIP STYLE] groups — so the Compare cards show Heroes + Leadership
// Style and the Table shows all competency columns. Values are WC-derived (no IAS).
// The TDP app fetches this at runtime, so editing participants.csv + re-running seed
// is enough (no TDP rebuild for data changes).
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
// deterministic 1-5 around a base, varied per item/participant (no RNG)
const vary = (base, i, salt) => clamp(base + (((i * 7 + salt) % 3) - 1), 1, 5);

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

const KOMPETENSI = [
  "Agility and Adaptability", "Attention to Detail", "Building Strategic Partnership",
  "Business Perspective", "Conceptual Thinking", "Concern for Order and Accuracy",
  "Customer Focus", "Developing Organizational Capabilities", "Digital Leadership",
  "Driving Execution", "Driving Innovation", "Global Business Savvy",
  "Impact Through Influence", "Initiative", "Leading Change", "Managing Diversity",
  "Optimizing Work Process", "Strategic Orientation",
];
const HEROES = [
  "Customer Focus", "Kepercayaan Diri", "Sikap Asertif", "Interpersonal skills",
  "Kolaboratif", "Leadership", "Achievement Drive", "Kepatuhan Organisasi/Integritas",
  "Strategic Bussiness Acumen", "EAGER_TO_LEARN", "Entrepreneurship", "Resilience",
];
const LEAD_PROFILE = [
  "Pengambilan Keputusan", "Influencing Others", "Developing Others",
  "Monitoring & Controlling", "Inspiring Others", "Leading Change", "Empowerment",
  "Planning & Organizing", "Team Leadership",
];
const STYLES = ["Empowering Leadership", "Balanced Leadership", "Directive Leadership", "Coaching Leadership", "Visionary Leadership"];
const BELBIN = ["Coordinator", "Plant", "Implementer", "Resource Investigator", "Monitor Evaluator", "Teamworker", "Completer Finisher", "Shaper", "Specialist"];
const SUB_STYLE = ["Supporter", "Inspirational", "Pragmatist", "Quiet"];
const SOCIAL = ["Expressive", "Adaptive", "Amiable", "Analytical", "Driver"];

const HEADERS = [
  "Employee ID", "Successor For Employee ID", "Shown in TDP", "Vismap ID", "Name", "Email",
  "Department", "Position", "Level", "Manager", "Manager ID", "Report To", "Photo URL",
  "Gender", "City", "Marital Status", "Education", "Critical Position", "Years In Company",
  "Years In Role", "Last Promotion Date", "Skills (comma separated)", "Certifications (comma separated)",
  "Personality (DISC)", "Leadership Type", "Score", "Readiness", "IQ", "Capability",
  "Commitment", "Contribution", "Performance",
  ...KOMPETENSI.map(k => `[KOMPETENSI] ${k}`), "[KOMPETENSI] Persentase Kecocokan",
  ...HEROES.map(k => `[HEROES] ${k}`), "[HEROES] presen_kecocokan", "[HEROES] hasil_rekomendasi",
  ...LEAD_PROFILE.map(k => `[LEADERSHIP PROFILE] ${k}`),
  "[LEADERSHIP STYLE] Team Role 1", "[LEADERSHIP STYLE] Team Role 2", "[LEADERSHIP STYLE] Leadership Style",
  "[LEADERSHIP STYLE] Subordinate Style", "[LEADERSHIP STYLE] Social Style",
  "Referance ID", "Tim",
];

const slug = (name) => name.toLowerCase().normalize("NFD").replace(/[^\w\s]/g, "").trim().replace(/\s+/g, ".");
const discIdx = (disc) => ({ D: 0, I: 1, S: 2, C: 3 }[(disc || "S")[0]] ?? 2);

const out = [HEADERS.join(",")];
rows.forEach((r, i) => {
  const comp = num(r.competency);
  const kBase = to5(r.competency);
  const hBase = to5((num(r.behavioral || r.competency) + num(r.engagement) + num(r.leadership)) / 3);
  const lBase = to5(r.leadership);
  const rec = {
    "Employee ID": r.id,
    "Successor For Employee ID": r.successor_for || "",
    "Shown in TDP": "TRUE",
    "Vismap ID": "",
    "Name": r.name,
    "Email": `${slug(r.name)}@talentlytica.com`,
    "Department": r.department,
    "Position": r.position,
    "Level": "",
    "Manager": r.manager_id ? (nameById[r.manager_id] ?? "") : "",
    "Manager ID": r.manager_id || "",
    "Report To": r.manager_id ? (nameById[r.manager_id] ?? "") : "",
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
    "Leadership Type": STYLES[(discIdx(r.disc) + (i % 2)) % STYLES.length],
    "Score": comp,
    "Readiness": comp > 85 ? "Siap" : "Perlu Pengembangan",
    "IQ": comp ? 100 + Math.round(comp / 4) : "",
    "Capability": comp,
    "Commitment": num(r.engagement),
    "Contribution": num(r.engagement),
    "Performance": num(r.performance),
    "[KOMPETENSI] Persentase Kecocokan": `${comp}%`,
    "[HEROES] presen_kecocokan": (clamp(comp, 0, 100) / 100).toFixed(4),
    "[HEROES] hasil_rekomendasi": comp > 85 ? "Sangat Disarankan" : comp > 70 ? "Disarankan" : "Dipertimbangkan",
    "[LEADERSHIP STYLE] Team Role 1": BELBIN[i % BELBIN.length],
    "[LEADERSHIP STYLE] Team Role 2": BELBIN[(i + 3) % BELBIN.length],
    "[LEADERSHIP STYLE] Leadership Style": STYLES[(discIdx(r.disc) + Math.floor(comp / 25)) % STYLES.length],
    "[LEADERSHIP STYLE] Subordinate Style": SUB_STYLE[i % SUB_STYLE.length],
    "[LEADERSHIP STYLE] Social Style": SOCIAL[discIdx(r.disc) % SOCIAL.length],
    "Referance ID": "",
    "Tim": `Tim ${r.department}`,
  };
  KOMPETENSI.forEach((k, j) => { rec[`[KOMPETENSI] ${k}`] = vary(kBase, j, i); });
  HEROES.forEach((k, j) => { rec[`[HEROES] ${k}`] = vary(hBase, j, i + 2); });
  LEAD_PROFILE.forEach((k, j) => { rec[`[LEADERSHIP PROFILE] ${k}`] = vary(lBase, j, i + 5); });

  out.push(HEADERS.map(h => { const v = String(rec[h] ?? ""); return /[",]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; }).join(","));
});

writeFileSync(OUT, out.join("\n") + "\n");
console.log(`tdp-employees.csv: ${rows.length} employees → public/data/tdp-employees.csv (full tdp-mvp schema, WC data)`);
