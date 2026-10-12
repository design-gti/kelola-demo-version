// Generate public/data/iprofile-data.json (per-participant profile detail) from the
// canonical participants.csv. Career plans + successors derived from team/manager/
// competency; employee bio-data, teams, extension metrics, IDP history and
// score-aspect breakdown are deterministic. Run: node scripts/gen-iprofile.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8").replace(/^﻿/, "");
/**
 * Pemisah baris CSV yang mengerti tanda kutip — perlu sejak
 * soft_competency_aspects.csv punya kolom `description` yang isinya
 * mengandung koma; `split(",")` polos akan memotongnya jadi kolom palsu.
 */
function parseCSVLine(line) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else quoted = false;
      } else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out.map(v => v.trim());
}

function parseCSV(t) {
  const lines = t.split(/\r?\n/).filter(l => l.trim());
  const h = parseCSVLine(lines[0]);
  return lines.slice(1).map(l => { const v = parseCSVLine(l); return h.reduce((o, k, i) => ((o[k] = v[i] ?? ""), o), {}); });
}
const rows = parseCSV(read("public/data/participants.csv"));
const byId = Object.fromEntries(rows.map(r => [r.id, r]));
const num = (v) => Number(v) || 0;
const comp = (r) => num(r.competency);
const status = (c) => (c > 85 ? "Ready" : "need dev.");
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const to5 = (v) => clamp(Math.round(num(v) / 20), 1, 5); // 0-100 → 1-5
const CITIES = [["Jakarta", "DKI Jakarta"], ["Surabaya", "Jawa Timur"], ["Bandung", "Jawa Barat"], ["Medan", "Sumatera Utara"], ["Semarang", "Jawa Tengah"], ["Makassar", "Sulawesi Selatan"]];
const EDU = ["S1 Teknik Informatika", "S1 Manajemen", "S2 Business Administration", "S1 Psikologi", "S2 Data Science", "S1 Akuntansi"];
const MON = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const BLOOD = ["A", "B", "AB", "O"];
// Aspek untuk tab Potensi. Sumbernya katalog tunggal aspects.csv, disaring ke
// kategori General — potensi memang diukur dengan aspek umum, bukan aspek teknis
// yang beda-beda tiap posisi. Aspek kompetensi sendiri sudah pindah ke
// scripts/gen-aspects.mjs (per posisi, standar per Job).
const ASPECTS = parseCSV(read("public/data/aspects.csv"))
  .filter((r) => r.category === "General")
  .map((r) => ({
    label: r.aspect,
    category: r.category,
    description: r.description || "",
  }));
const IDP_COMPS = ["Problem solving", "critical thinking", "strategic thinking", "communication", "leadership", "analytical thinking", "planning", "collaboration"];
// Key Behaviour (KB) — tiap aspek kompetensi/potensi dipecah jadi 3-4 indikator
// perilaku yang lebih spesifik, masing-masing dengan skornya sendiri (skala 5).
// Skor aspek (scoreAspects.*.score) adalah ringkasan dari KB-KB ini.
const KB_MAP = {
  "Logika Berpikir": ["Berpikir Sistematis", "Berpikir Kritis", "Pemecahan Masalah", "Pengambilan Kesimpulan Logis"],
  "Kemampuan Numerikal": ["Ketepatan Hitung", "Interpretasi Data Angka", "Estimasi Cepat"],
  "Kemampuan verbal": ["Pemahaman Bacaan", "Kejelasan Ekspresi Lisan", "Kosakata & Tata Bahasa"],
  "Daya Analisa": ["Identifikasi Pola", "Analisis Sebab-Akibat", "Sintesis Informasi", "Evaluasi Alternatif"],
  "Fleksibilitas": ["Adaptasi Perubahan", "Keterbukaan pada Ide Baru", "Toleransi Ambiguitas"],
  "Leadership": ["Pengambilan Keputusan", "Memotivasi Tim", "Delegasi Tugas", "Tanggung Jawab atas Hasil"],
  "Keterampilan Interpersonal": ["Mendengarkan Aktif", "Empati", "Membangun Hubungan Kerja"],
  "Kerjasama": ["Kontribusi dalam Tim", "Resolusi Konflik", "Berbagi Informasi", "Dukungan ke Rekan Kerja"],
  "Kemampuan Perencanaan": ["Penetapan Prioritas", "Manajemen Waktu", "Antisipasi Risiko"],
};
// Deterministik ±1 di sekitar skor aspek, supaya rata-rata KB dekat dengan skor
// aspek (bukan acak lepas) tapi tetap ada variasi antar-KB.
const KB_DELTAS = [0, 1, -1, 1, 0, -1]; // pola deterministik, dipilih via (seed + index KB)
function keyBehavioursFor(label, aspectScore, seed, isFirstEmployee, aspectIndex) {
  const names = KB_MAP[label] ?? [];
  return names.map((kbLabel, k) => {
    // Contoh KB tanpa data skor (ditampilkan "-" di UI) — deterministik pada
    // KB pertama, aspek pertama, partisipan pertama, supaya selalu ada satu
    // contoh nyata tanpa membuat data lain jadi berlubang acak.
    if (isFirstEmployee && aspectIndex === 0 && k === 0) {
      return { label: kbLabel, score: null };
    }
    const delta = KB_DELTAS[(seed + k) % KB_DELTAS.length];
    return { label: kbLabel, score: clamp(aspectScore + delta, 1, 5) };
  });
}

const out = {};
rows.forEach((r, idx) => {
  const teamMates = rows.filter(x => x.team === r.team && x.id !== r.id);
  const isLeader = rows.some(x => x.manager_id === r.id);
  // successors: same team, highest competency first (up to 3)
  const successors = teamMates
    .sort((a, b) => comp(b) - comp(a))
    .slice(0, 3)
    .map(s => ({ id: s.id, name: s.name, position: s.position, percentage: comp(s) + "%", status: status(comp(s)) }));
  // career plans: target = manager's role (move up), + a "Senior <role>" step
  const careerPlans = [];
  const mgr = r.manager_id ? byId[r.manager_id] : null;
  if (mgr) careerPlans.push({ position: mgr.position, name: mgr.name, percentage: comp(r) + "%", status: status(comp(r)) });
  const nextComp = Math.max(40, comp(r) - 12);
  careerPlans.push({ position: "Senior " + r.position, name: r.name, percentage: nextComp + "%", status: status(nextComp) });
  const [city, province] = CITIES[idx % CITIES.length];
  const startYear = 2026 - (2 + (idx % 12));
  const workStartDate = MON[idx % 12] + " " + startYear;
  // score-aspect breakdown — deterministic per participant × aspect
  const compBase = to5(r.competency);
  const potBase = to5(r.leadership);
  const scoreAspects = {
    competency: ASPECTS.map((a, i) => {
      const score = clamp(compBase + (((i * 7 + idx) % 3) - 1), 1, 5);
      const standardScore = 3 + (i % 2);
      return { ...a, score, standardScore, dev: score < standardScore, keyBehaviours: keyBehavioursFor(a.label, score, idx + i, idx === 0, i) };
    }),
    potency: ASPECTS.map((a, i) => {
      // Potency tidak punya breakdown Key Behaviour (fitur ini khusus Competency).
      const score = clamp(potBase + (((i * 5 + idx) % 3) - 1), 1, 5);
      const standardScore = 3 + ((i + 1) % 2);
      return { ...a, score, standardScore, dev: score < standardScore };
    }),
  };
  const teams = [
    { name: r.department + " Team", role: isLeader ? "as Team Leader" : "as Team member" },
    { name: "Pegasus Team", role: "as Team member" },
  ];
  if (r.potential === "high") teams.push({ name: "Rising Project Team", role: "as Team member" });
  out[r.id] = {
    careerPlans,
    successors,
    scoreAspects,
    teams,
    bloodType: BLOOD[idx % 4],
    extension: {
      performance: (num(r.performance) / 20).toFixed(1),
      engagement: (num(r.engagement) / 20).toFixed(1),
      potency: num(r.leadership) + "%",
      height: 165 + (idx % 20),
    },
    idpHistory: [
      { competencies: [IDP_COMPS[idx % IDP_COMPS.length], IDP_COMPS[(idx + 1) % IDP_COMPS.length]], pic: (teamMates[0] || mgr || r).name, dateRange: "Dec 5, 2024 - Mar 11, 2025", status: "in progress" },
      { competencies: [IDP_COMPS[(idx + 2) % IDP_COMPS.length]], pic: (mgr || teamMates[1] || r).name, dateRange: "Jul 1, 2024 - Nov 30, 2024", status: "done" },
    ],
    employee: {
      nik: "23497" + String(idx + 1).padStart(5, "0"),
      dob: (((idx % 28) + 1) + " ") + MON[idx % 12] + " 199" + (idx % 10),
      // Dibaca dari kolom `gender` di participants.csv, bukan diterka dari
      // nomor urut seperti sebelumnya — nama orangnya sekarang berjenis kelamin
      // jelas, jadi tebakan berdasarkan urutan akan langsung terlihat salah.
      gender: r.gender || "Laki-laki",
      lastEducation: EDU[idx % EDU.length],
      city, province,
      maritalStatus: idx % 2 === 0 ? "Menikah" : "Belum Menikah",
      reportTo: mgr ? mgr.name + " (" + mgr.position + ")" : "-",
      workStartDate,
      tenure: (2 + (idx % 12)) + " thn, " + (idx % 12) + " bln",
      careerHistory: [
        { title: r.position, period: "Jul " + (startYear + 2) + " - Current" },
        { title: "Junior " + r.position, period: workStartDate + " - Jul " + (startYear + 2) },
      ],
    },
  };
});
writeFileSync(join(ROOT, "public/data/iprofile-data.json"), JSON.stringify(out, null, 2) + "\n");

// Katalog aspek untuk halaman admin sekarang dihasilkan scripts/gen-aspects.mjs
// (src/data/model/aspects.generated.ts), jadi generator ini tidak lagi menulis
// katalog sendiri.

console.log("iprofile-data.json: " + Object.keys(out).length + " participants");
console.log("sample p05:", JSON.stringify(out.p05).slice(0, 240));
