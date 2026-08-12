// Aspek kompetensi — satu model untuk seluruh aplikasi.
//
// MODEL:
//   Aspek       katalog tunggal (public/data/aspects.csv). Tidak ada lagi
//               pemisahan struktural soft/hard; "General" dan "Technical"
//               cuma dua kategori bawaan, sejajar dengan kategori lain yang
//               nanti dibuat user.
//   Posisi      menentukan aspek MANA yang dinilai untuk orang di posisi itu
//               (maksimal 12, campuran General + Technical).
//   Job         (= departemen) menentukan STANDAR tiap aspek. Aspek yang sama
//               boleh punya standar berbeda antar Job — diatur di halaman
//               Admin Settings ▸ Job Profile ▸ tab Standard.
//
// Sumber (boleh diedit tangan, lalu jalankan ulang script ini):
//   - public/data/aspects.csv                 (aspect, category, description, kb_family)
//   - public/data/participants.csv            (daftar posisi & partisipan)
//   - tabel POSITION_ASPECTS di bawah         (aspek per posisi)
//
// Output:
//   - public/data/position_aspects.csv           (position, aspect)
//   - public/data/job_aspect_standards.csv       (job, aspect, standard)
//   - public/data/participant_competency_scores.csv (id, name, aspect, score)
//   - public/data/participant_aspect_kb_scores.csv  (id, aspect, key_behaviour, score)
//   - src/data/model/aspects.generated.ts        (dipakai UI, import sinkron)
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8").replace(/^﻿/, "");

/** Pembaca CSV yang mengerti tanda kutip — deskripsi aspek mengandung koma. */
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
  return out.map((v) => v.trim());
}
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const vals = parseCSVLine(line);
    return headers.reduce((o, h, i) => ((o[h] = vals[i] ?? ""), o), {});
  });
}
const csv = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const clamp15 = (n) => Math.max(1, Math.min(5, n));
const hash = (s) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);

/** Batas aspek yang dinilai per posisi — radar iProfile masih terbaca sampai segini. */
const MAX_ASPECTS_PER_POSITION = 12;

// ── Aspek General per rumpun peran ───────────────────────────────────────────
// Dikelompokkan jadi beberapa paket, bukan ditulis ulang 33 kali: peran dengan
// tuntutan serupa memang dinilai pada aspek yang sama, dan kalau ditulis satu
// per satu perbedaannya jadi tidak sengaja alih-alih disengaja.
const GENERAL_BUNDLES = {
  /** Pemimpin unit: mengarahkan orang, memutuskan, merencanakan. */
  leader: ["Leadership", "Kemampuan Perencanaan", "Daya Analisa", "Keterampilan Interpersonal", "Kemampuan verbal", "Kerjasama"],
  /** Peran analitis: bekerja dengan data dan penalaran. */
  analyst: ["Logika Berpikir", "Daya Analisa", "Kemampuan Numerikal", "Kemampuan verbal", "Kerjasama", "Fleksibilitas"],
  /** Peran teknis pelaksana: memecahkan masalah dan beradaptasi dengan perubahan. */
  builder: ["Logika Berpikir", "Daya Analisa", "Kerjasama", "Fleksibilitas", "Kemampuan Perencanaan", "Kemampuan verbal"],
  /** Peran yang berporos pada orang. */
  people: ["Keterampilan Interpersonal", "Kerjasama", "Kemampuan verbal", "Fleksibilitas", "Kemampuan Perencanaan", "Daya Analisa"],
  /** Peran komunikasi & kreatif. */
  creative: ["Kemampuan verbal", "Fleksibilitas", "Daya Analisa", "Kerjasama", "Keterampilan Interpersonal", "Kemampuan Perencanaan"],
};

/** Aspek teknis per posisi — lanjutan tabel lama, kini tanpa kolom kategori. */
const TECHNICAL_BY_POSITION = {
  "Head of Engineering": ["Arsitektur Sistem", "Code Review", "Keamanan Aplikasi", "CI/CD", "Cloud Infrastructure", "Observability"],
  "Principal Engineer": ["Arsitektur Sistem", "Desain Terdistribusi", "Technical Roadmap", "Cloud Infrastructure", "Observability"],
  "Backend Lead": ["Desain API", "Basis Data", "Optimasi Query", "Message Queue", "Containerization"],
  "Frontend Lead": ["Arsitektur Komponen", "State Management", "Aksesibilitas", "Performa Web", "Design System"],
  "Senior Engineer": ["Kualitas Kode", "Pengujian Otomatis", "Debugging", "Version Control"],
  "Head of Finance": ["Pelaporan Keuangan", "Analisis Anggaran", "Manajemen Risiko", "Kepatuhan Pajak", "Standar Akuntansi"],
  "Senior Finance Manager": ["Pelaporan Keuangan", "Analisis Anggaran", "Manajemen Kas", "Standar Akuntansi"],
  "Senior Finance Analyst": ["Pemodelan Keuangan", "Analisis Varians", "Rekonsiliasi", "Spreadsheet Lanjutan", "Standar Akuntansi"],
  "Finance Analyst": ["Pemodelan Keuangan", "Rekonsiliasi", "Analisis Varians", "Spreadsheet Lanjutan", "Standar Akuntansi"],
  Controller: ["Pengendalian Internal", "Pelaporan Keuangan", "Audit Kepatuhan", "Standar Akuntansi"],
  "HR Business Partner": ["Manajemen Talenta", "Perencanaan SDM", "Hubungan Industrial", "HRIS"],
  "HR Manager": ["Manajemen Kinerja", "Remunerasi", "Hubungan Industrial", "HRIS"],
  "Talent Acquisition Lead": ["Sourcing Kandidat", "Teknik Wawancara", "Employer Branding", "ATS"],
  "People Ops Specialist": ["Administrasi Personalia", "Onboarding", "Kepatuhan Ketenagakerjaan", "HRIS"],
  "VP Operations": ["Perencanaan Kapasitas", "Manajemen Rantai Pasok", "Kendali Mutu", "Analitik Operasional", "Keselamatan Kerja"],
  "Operations Manager": ["Perencanaan Produksi", "Kendali Mutu", "Efisiensi Proses", "Keselamatan Kerja"],
  "Operations Analyst": ["Analitik Operasional", "Pemetaan Proses", "Spreadsheet Lanjutan"],
  "Operations Strategist": ["Perencanaan Strategis", "Analitik Operasional", "Pemodelan Skenario"],
  "Supply Chain Lead": ["Manajemen Rantai Pasok", "Manajemen Vendor", "Perencanaan Inventori", "Sistem ERP"],
  "Supply Chain Manager": ["Manajemen Rantai Pasok", "Negosiasi Pengadaan", "Perencanaan Inventori", "Sistem ERP"],
  "Head of Marketing": ["Strategi Kampanye", "Riset Pasar", "Manajemen Brand", "Analitik Digital", "Otomasi Pemasaran"],
  "Senior Marketing Manager": ["Strategi Kampanye", "Riset Pasar", "Analitik Digital"],
  "Growth Marketing Manager": ["Eksperimen Pertumbuhan", "Analitik Digital", "Optimasi Konversi", "Otomasi Pemasaran"],
  "Growth Marketing Lead": ["Eksperimen Pertumbuhan", "Optimasi Konversi", "Analitik Digital"],
  "Brand Manager": ["Manajemen Brand", "Strategi Kampanye", "Riset Pasar"],
  "Senior Brand Strategist": ["Strategi Brand", "Riset Pasar", "Narasi & Positioning"],
  "Creative Director": ["Arahan Kreatif", "Storytelling Visual", "Manajemen Produksi"],
  "Digital Content Specialist": ["Penulisan Konten", "Produksi Visual", "SEO", "Analitik Digital"],
  "Chief Executive Officer": ["Strategi Korporat", "Alokasi Modal", "Tata Kelola"],
  "Chief Strategy Officer": ["Strategi Korporat", "Analisis Kompetitif", "Pemodelan Skenario"],
  "Chief Revenue Officer": ["Strategi Pendapatan", "Manajemen Pipeline", "Penetapan Harga"],
  "VP Corporate Strategy": ["Strategi Korporat", "Analisis Kompetitif", "Pemodelan Skenario"],
  "Head of Governance": ["Manajemen Risiko", "Kepatuhan Regulasi", "Audit Internal"],

  // ── C-level yang menyusul struktur 5 lapis ─────────────────────────────────
  "Chief Technology Officer": ["Technical Roadmap", "Arsitektur Sistem", "Cloud Infrastructure", "Keamanan Aplikasi"],
  "Chief Financial Officer": ["Pelaporan Keuangan", "Alokasi Modal", "Manajemen Risiko", "Kepatuhan Regulasi"],
  "Chief Operating Officer": ["Perencanaan Kapasitas", "Efisiensi Proses", "Manajemen Rantai Pasok", "Kendali Mutu"],
  "Chief Human Resources Officer": ["Manajemen Talenta", "Perencanaan SDM", "Manajemen Kinerja", "Remunerasi"],

  // ── Strategi ───────────────────────────────────────────────────────────────
  "Strategy Manager": ["Perencanaan Strategis", "Analisis Kompetitif", "Pemodelan Skenario", "Spreadsheet Lanjutan"],
  "Governance Manager": ["Tata Kelola", "Kepatuhan Regulasi", "Audit Internal", "Manajemen Risiko"],
  "Strategy Analyst": ["Analisis Kompetitif", "Pemodelan Skenario", "Spreadsheet Lanjutan", "Riset Pasar"],

  // ── Teknologi ──────────────────────────────────────────────────────────────
  "Head of Infrastructure & Security": ["Cloud Infrastructure", "Keamanan Aplikasi", "Observability", "CI/CD"],
  "QA Lead": ["Pengujian Otomatis", "Kualitas Kode", "Debugging", "Kendali Mutu"],
  "DevOps Lead": ["CI/CD", "Containerization", "Cloud Infrastructure", "Observability"],
  "Security Lead": ["Keamanan Aplikasi", "Kepatuhan Regulasi", "Observability", "Audit Internal"],
  "Backend Engineer": ["Desain API", "Basis Data", "Optimasi Query", "Kualitas Kode"],
  "Frontend Engineer": ["Arsitektur Komponen", "State Management", "Performa Web", "Aksesibilitas"],
  "Software Engineer": ["Kualitas Kode", "Pengujian Otomatis", "Debugging", "Version Control"],
  "QA Engineer": ["Pengujian Otomatis", "Debugging", "Kendali Mutu", "Version Control"],
  "DevOps Engineer": ["CI/CD", "Containerization", "Observability", "Cloud Infrastructure"],
  "Security Analyst": ["Keamanan Aplikasi", "Observability", "Kepatuhan Regulasi", "Debugging"],

  // ── Keuangan ───────────────────────────────────────────────────────────────
  "Head of Accounting": ["Standar Akuntansi", "Pelaporan Keuangan", "Pengendalian Internal", "Kepatuhan Pajak"],
  "Accounting Manager": ["Standar Akuntansi", "Rekonsiliasi", "Pelaporan Keuangan", "Pengendalian Internal"],
  "Internal Auditor": ["Audit Internal", "Pengendalian Internal", "Audit Kepatuhan", "Manajemen Risiko"],
  "Accounting Staff": ["Rekonsiliasi", "Standar Akuntansi", "Spreadsheet Lanjutan", "Sistem ERP"],
  "Tax Staff": ["Kepatuhan Pajak", "Standar Akuntansi", "Rekonsiliasi", "Audit Kepatuhan"],

  // ── Operasional ────────────────────────────────────────────────────────────
  "Head of Supply Chain": ["Manajemen Rantai Pasok", "Perencanaan Inventori", "Manajemen Vendor", "Perencanaan Kapasitas"],
  "Service Quality Manager": ["Kendali Mutu", "Pemetaan Proses", "Efisiensi Proses", "Analitik Operasional"],
  "Operations Staff": ["Pemetaan Proses", "Sistem ERP", "Kendali Mutu", "Keselamatan Kerja"],
  "Service Quality Officer": ["Kendali Mutu", "Pemetaan Proses", "Analitik Operasional", "Keselamatan Kerja"],
  "Logistics Staff": ["Manajemen Rantai Pasok", "Perencanaan Inventori", "Sistem ERP", "Keselamatan Kerja"],
  "Procurement Staff": ["Manajemen Vendor", "Negosiasi Pengadaan", "Perencanaan Inventori", "Kepatuhan Regulasi"],

  // ── SDM ────────────────────────────────────────────────────────────────────
  "People Development Manager": ["Manajemen Talenta", "Manajemen Kinerja", "Perencanaan SDM", "HRIS"],
  "HR Operations Staff": ["Administrasi Personalia", "HRIS", "Onboarding", "Kepatuhan Ketenagakerjaan"],
  Recruiter: ["Sourcing Kandidat", "Teknik Wawancara", "ATS", "Employer Branding"],
  "Learning & Development Specialist": ["Manajemen Talenta", "Manajemen Kinerja", "Onboarding", "HRIS"],

  // ── Pemasaran ──────────────────────────────────────────────────────────────
  "Head of Sales": ["Strategi Pendapatan", "Manajemen Pipeline", "Penetapan Harga", "CRM"],
  "Graphic Designer": ["Produksi Visual", "Storytelling Visual", "Arahan Kreatif", "Design System"],
  "Digital Marketing Executive": ["Analitik Digital", "Otomasi Pemasaran", "SEO", "Optimasi Konversi"],
  "Market Research Analyst": ["Riset Pasar", "Analisis Kompetitif", "Analitik Digital", "Spreadsheet Lanjutan"],

  // ── Hunter — mengejar pelanggan baru ───────────────────────────────────────
  "Hunting Manager Enterprise": ["Manajemen Pipeline", "Negosiasi Kontrak", "Presentasi Solusi", "CRM", "Penetapan Harga"],
  "Hunting Manager SMB": ["Manajemen Pipeline", "Kualifikasi Lead", "Prospecting", "CRM", "Penetapan Harga"],
  "Hunting Manager Government": ["Manajemen Tender", "Negosiasi Kontrak", "Kepatuhan Regulasi", "Manajemen Pipeline", "CRM"],
  "Account Executive Enterprise": ["Presentasi Solusi", "Negosiasi Kontrak", "Manajemen Pipeline", "CRM"],
  "Account Executive SMB": ["Prospecting", "Kualifikasi Lead", "Presentasi Solusi", "CRM"],
  "Business Development Representative": ["Prospecting", "Kualifikasi Lead", "CRM", "Riset Pasar"],
  "Sales Development Representative": ["Prospecting", "Kualifikasi Lead", "CRM", "Manajemen Pipeline"],
  "Government Relations Specialist": ["Manajemen Tender", "Kepatuhan Regulasi", "Negosiasi Kontrak", "CRM"],

  // ── Farmer — menggarap pelanggan yang sudah ada ────────────────────────────
  "Farming Manager Enterprise": ["Manajemen Akun", "Retensi & Renewal", "Upselling & Cross-selling", "CRM", "Penetapan Harga"],
  "Farming Manager SMB": ["Manajemen Akun", "Retensi & Renewal", "Customer Success", "CRM", "Manajemen Pipeline"],
  "Account Manager Enterprise": ["Manajemen Akun", "Upselling & Cross-selling", "Negosiasi Kontrak", "CRM"],
  "Account Manager SMB": ["Manajemen Akun", "Customer Success", "Upselling & Cross-selling", "CRM"],
  "Customer Success Officer": ["Customer Success", "Manajemen Akun", "Retensi & Renewal", "CRM"],
  "Renewal Specialist": ["Retensi & Renewal", "Manajemen Akun", "Negosiasi Kontrak", "CRM"],
};

/** Paket aspek General untuk tiap posisi. */
const BUNDLE_BY_POSITION = {
  "Head of Engineering": "leader",
  "Principal Engineer": "builder",
  "Backend Lead": "builder",
  "Frontend Lead": "builder",
  "Senior Engineer": "builder",
  "Head of Finance": "leader",
  "Senior Finance Manager": "leader",
  "Senior Finance Analyst": "analyst",
  "Finance Analyst": "analyst",
  Controller: "analyst",
  "HR Business Partner": "people",
  "HR Manager": "people",
  "Talent Acquisition Lead": "people",
  "People Ops Specialist": "people",
  "VP Operations": "leader",
  "Operations Manager": "leader",
  "Operations Analyst": "analyst",
  "Operations Strategist": "analyst",
  "Supply Chain Lead": "leader",
  "Supply Chain Manager": "leader",
  "Head of Marketing": "leader",
  "Senior Marketing Manager": "creative",
  "Growth Marketing Manager": "analyst",
  "Growth Marketing Lead": "analyst",
  "Brand Manager": "creative",
  "Senior Brand Strategist": "creative",
  "Creative Director": "creative",
  "Digital Content Specialist": "creative",
  "Chief Executive Officer": "leader",
  "Chief Strategy Officer": "leader",
  "Chief Revenue Officer": "leader",
  "VP Corporate Strategy": "leader",
  "Head of Governance": "leader",

  // C-level & Head: paket kepemimpinan.
  "Chief Technology Officer": "leader",
  "Chief Financial Officer": "leader",
  "Chief Operating Officer": "leader",
  "Chief Human Resources Officer": "leader",
  "Head of Infrastructure & Security": "leader",
  "Head of Accounting": "leader",
  "Head of Supply Chain": "leader",
  "Head of Sales": "leader",

  // Manager & Lead.
  "Strategy Manager": "analyst",
  "Governance Manager": "analyst",
  "QA Lead": "builder",
  "DevOps Lead": "builder",
  "Security Lead": "builder",
  "Accounting Manager": "analyst",
  "Service Quality Manager": "leader",
  "People Development Manager": "people",
  "Hunting Manager Enterprise": "leader",
  "Hunting Manager SMB": "leader",
  "Hunting Manager Government": "leader",
  "Farming Manager Enterprise": "leader",
  "Farming Manager SMB": "leader",

  // Staf.
  "Strategy Analyst": "analyst",
  "Backend Engineer": "builder",
  "Frontend Engineer": "builder",
  "Software Engineer": "builder",
  "QA Engineer": "builder",
  "DevOps Engineer": "builder",
  "Security Analyst": "builder",
  "Internal Auditor": "analyst",
  "Accounting Staff": "analyst",
  "Tax Staff": "analyst",
  "Operations Staff": "analyst",
  "Service Quality Officer": "analyst",
  "Logistics Staff": "analyst",
  "Procurement Staff": "analyst",
  "HR Operations Staff": "people",
  Recruiter: "people",
  "Learning & Development Specialist": "people",
  "Graphic Designer": "creative",
  "Digital Marketing Executive": "creative",
  "Market Research Analyst": "analyst",
  // Penjualan memakai paket "people": pekerjaannya bertumpu pada hubungan,
  // komunikasi, dan kerja sama — bukan analisis maupun eksekusi teknis.
  "Account Executive Enterprise": "people",
  "Account Executive SMB": "people",
  "Business Development Representative": "people",
  "Sales Development Representative": "people",
  "Government Relations Specialist": "people",
  "Account Manager Enterprise": "people",
  "Account Manager SMB": "people",
  "Customer Success Officer": "people",
  "Renewal Specialist": "people",
};

/** Dipakai posisi yang belum terdaftar di dua tabel di atas. */
// Isinya harus benar-benar ada di aspects.csv — sebelumnya menyebut aspek yang
// tidak pernah ada di katalog, dan itu baru ketahuan saat ada posisi yang
// jatuh ke sini.
const DEFAULT_TECHNICAL = ["Efisiensi Proses", "Kendali Mutu", "Pemetaan Proses", "Analitik Operasional", "Manajemen Vendor"];
const DEFAULT_BUNDLE = "builder";

// ── Key Behaviour ────────────────────────────────────────────────────────────
/**
 * KB aspek General — indikator perilaku spesifik per aspek.
 *
 * Tiap aspek punya tepat KB_PER_ASPECT butir: skala penilaiannya 1-5, jadi satu
 * KB per taraf membuat pemetaan taraf → KB di halaman Aspect selalu penuh.
 */
const KB_GENERAL = {
  "Logika Berpikir": ["Berpikir Sistematis", "Berpikir Kritis", "Pemecahan Masalah", "Pengambilan Kesimpulan Logis", "Pengujian Asumsi"],
  "Kemampuan Numerikal": ["Ketepatan Hitung", "Interpretasi Data Angka", "Estimasi Cepat", "Pembacaan Tabel & Grafik", "Ketelitian Angka"],
  "Kemampuan verbal": ["Pemahaman Bacaan", "Kejelasan Ekspresi Lisan", "Kosakata & Tata Bahasa", "Penyusunan Tulisan Kerja", "Penyesuaian Gaya Bahasa"],
  "Daya Analisa": ["Identifikasi Pola", "Analisis Sebab-Akibat", "Sintesis Informasi", "Evaluasi Alternatif", "Penyederhanaan Masalah"],
  Fleksibilitas: ["Adaptasi Perubahan", "Keterbukaan pada Ide Baru", "Toleransi Ambiguitas", "Penyesuaian Prioritas", "Pemulihan Setelah Hambatan"],
  Leadership: ["Pengambilan Keputusan", "Memotivasi Tim", "Delegasi Tugas", "Tanggung Jawab atas Hasil", "Pengembangan Anggota Tim"],
  "Keterampilan Interpersonal": ["Mendengarkan Aktif", "Empati", "Membangun Hubungan Kerja", "Membaca Situasi Sosial", "Penyampaian Umpan Balik"],
  Kerjasama: ["Kontribusi dalam Tim", "Resolusi Konflik", "Berbagi Informasi", "Dukungan ke Rekan Kerja", "Menjaga Komitmen Bersama"],
  "Kemampuan Perencanaan": ["Penetapan Prioritas", "Manajemen Waktu", "Antisipasi Risiko", "Penyusunan Langkah Kerja", "Pemantauan Pelaksanaan"],
};

/**
 * KB aspek Technical memakai tangga penguasaan. Bentuknya beda-beda menurut
 * `kb_family` di katalog (sisa pengelompokan teknis lama) — kolom itu tidak
 * ditampilkan di UI, semata supaya KB aspek regulasi tidak berbunyi seperti KB
 * aspek perkakas.
 */
const KB_BY_FAMILY = {
  "Technical Core": ["Penguasaan Konsep Dasar", "Penerapan pada Pekerjaan Harian", "Penanganan Kasus Kompleks", "Perbaikan Cara Kerja", "Berbagi Pengetahuan ke Tim"],
  "Tools & Platform": ["Penguasaan Fitur Inti", "Pemakaian dalam Alur Kerja", "Troubleshooting Mandiri", "Optimasi & Otomasi", "Pendampingan Pengguna Lain"],
  Regulasi: ["Pemahaman Ketentuan", "Penerapan pada Proses Kerja", "Identifikasi Risiko Kepatuhan", "Dokumentasi & Pelaporan", "Pembaruan atas Perubahan Aturan"],
};

/** Tiap aspek wajib punya sebanyak ini KB — dijaga oleh pemeriksaan di bawah. */
const KB_PER_ASPECT = 5;

// ── Rakit ────────────────────────────────────────────────────────────────────
const catalog = parseCSV(read("public/data/aspects.csv"));
const byLabel = Object.fromEntries(catalog.map((a) => [a.aspect, a]));
const participants = parseCSV(read("public/data/participants.csv"));

const positions = [...new Set(participants.map((p) => p.position))];
const jobOfPosition = Object.fromEntries(participants.map((p) => [p.position, p.department]));

/** Aspek yang dinilai untuk sebuah posisi: General sesuai paket + Technical-nya. */
function aspectsOf(position) {
  const general = GENERAL_BUNDLES[BUNDLE_BY_POSITION[position] ?? DEFAULT_BUNDLE];
  const technical = TECHNICAL_BY_POSITION[position] ?? DEFAULT_TECHNICAL;
  return [...general, ...technical].slice(0, MAX_ASPECTS_PER_POSITION);
}

// Semua aspek yang dipakai harus ada di katalog — kalau tidak, UI akan
// menampilkan baris tanpa deskripsi tanpa ada yang menyadari.
const unknown = positions.flatMap((p) => aspectsOf(p)).filter((a) => !byLabel[a]);
if (unknown.length) throw new Error(`Aspek tidak ada di aspects.csv: ${[...new Set(unknown)].join(", ")}`);

const tooMany = positions.filter((p) => aspectsOf(p).length > MAX_ASPECTS_PER_POSITION);
if (tooMany.length) throw new Error(`Posisi melebihi ${MAX_ASPECTS_PER_POSITION} aspek: ${tooMany.join(", ")}`);

// --- position_aspects.csv ---
const posLines = ["position,aspect"];
positions.forEach((p) => aspectsOf(p).forEach((a) => posLines.push([p, a].map(csv).join(","))));
writeFileSync(join(ROOT, "public/data/position_aspects.csv"), posLines.join("\n") + "\n", "utf8");

// --- job_aspect_standards.csv ---
// Standar ditetapkan per Job, bukan per posisi: aspek yang sama boleh berbeda
// tuntutannya antar departemen. Nilainya deterministik — dasar 3, naik untuk
// Job yang memuat posisi paling senior, plus variasi kecil per aspek.
const levelOf = (title) => {
  const t = title.toLowerCase();
  if (/^(chief|ceo|cto|cfo)|(^| )vp( |$)|president/.test(t)) return 1;
  if (/head of|director|lead\b|principal/.test(t)) return 2;
  if (/manager|controller|business partner|strategist/.test(t)) return 3;
  return 4;
};
const jobs = [...new Set(participants.map((p) => p.department))];
const topLevelOfJob = Object.fromEntries(
  jobs.map((j) => [j, Math.min(...participants.filter((p) => p.department === j).map((p) => levelOf(p.position)))]),
);
/** Aspek yang dipakai sebuah Job = gabungan aspek seluruh posisinya. */
const aspectsOfJob = Object.fromEntries(
  jobs.map((j) => [
    j,
    [...new Set(positions.filter((p) => jobOfPosition[p] === j).flatMap(aspectsOf))],
  ]),
);
const standardOf = (job, aspect) =>
  clamp15(3 + (topLevelOfJob[job] <= 1 ? 1 : 0) + (hash(job + aspect) % 2));

const stdLines = ["job,aspect,standard"];
jobs.forEach((j) => aspectsOfJob[j].forEach((a) => stdLines.push([j, a, standardOf(j, a)].map(csv).join(","))));
writeFileSync(join(ROOT, "public/data/job_aspect_standards.csv"), stdLines.join("\n") + "\n", "utf8");

// --- participant_competency_scores.csv ---
// Skor disebar di sekitar standar Job-nya supaya sebagian orang di bawah
// standar dan sebagian di atas — bukan acak lepas dari tuntutan posisinya.
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

// --- participant_aspect_kb_scores.csv ---
const KB_DELTAS = [0, 1, -1, 1, 0, -1];
const kbLabelsOf = (aspect) => {
  const entry = byLabel[aspect];
  if (entry?.category === "General") return KB_GENERAL[aspect] ?? [];
  return KB_BY_FAMILY[entry?.kb_family] ?? KB_BY_FAMILY["Technical Core"];
};
// Aspek yang KB-nya kurang dari lima akan tampil sebagai baris dengan taraf
// kosong di halaman Aspect — dihentikan di sini, bukan dibiarkan lolos.
const kbShort = catalog.map((a) => a.aspect).filter((a) => kbLabelsOf(a).length !== KB_PER_ASPECT);
if (kbShort.length) {
  throw new Error(`Aspek dengan KB ≠ ${KB_PER_ASPECT}: ${kbShort.join(", ")}`);
}

const kbLines = ["id,aspect,key_behaviour,score"];
participants.forEach((p) =>
  aspectsOf(p.position).forEach((a) => {
    const base = scoreOf(p.id, p.department, a);
    kbLabelsOf(a).forEach((kb) =>
      kbLines.push([p.id, a, kb, clamp15(base + KB_DELTAS[hash(p.id + a + kb) % KB_DELTAS.length])].map(csv).join(",")),
    );
  }),
);
writeFileSync(join(ROOT, "public/data/participant_aspect_kb_scores.csv"), kbLines.join("\n") + "\n", "utf8");

// --- modul TS ---
const catalogOut = catalog.map((a) => ({
  label: a.aspect,
  category: a.category,
  description: a.description,
  keyBehaviours: kbLabelsOf(a.aspect),
}));
const aspectsByPosition = Object.fromEntries(positions.map((p) => [p, aspectsOf(p)]));
const standardsByJob = Object.fromEntries(
  jobs.map((j) => [j, Object.fromEntries(aspectsOfJob[j].map((a) => [a, standardOf(j, a)]))]),
);
const scoresByParticipant = Object.fromEntries(
  participants.map((p) => [p.id, Object.fromEntries(aspectsOf(p.position).map((a) => [a, scoreOf(p.id, p.department, a)]))]),
);
const kbByParticipant = Object.fromEntries(
  participants.map((p) => [
    p.id,
    Object.fromEntries(
      aspectsOf(p.position).map((a) => {
        const base = scoreOf(p.id, p.department, a);
        return [a, kbLabelsOf(a).map((kb) => ({ label: kb, score: clamp15(base + KB_DELTAS[hash(p.id + a + kb) % KB_DELTAS.length]) }))];
      }),
    ),
  ]),
);

const ts = `// AUTO-GENERATED oleh scripts/gen-aspects.mjs — jangan edit manual.
// Sumber: public/data/aspects.csv + participants.csv + tabel di generator.
// Regenerate: node scripts/gen-aspects.mjs (sudah dihook di npm run seed).

export type AspectCategory = string;
export type AspectKeyBehaviour = { label: string; score: number };
export type CatalogAspect = { label: string; category: AspectCategory; description: string; keyBehaviours: string[] };

/** Semua aspek yang dikenal aplikasi, apa pun kategorinya. */
export const ASPECT_CATALOG: CatalogAspect[] = ${JSON.stringify(catalogOut, null, 2)};

/** Aspek yang dinilai untuk tiap posisi (maks ${MAX_ASPECTS_PER_POSITION}). */
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

const perPos = positions.map((p) => aspectsOf(p).length);
console.log(
  `gen-aspects: ${catalog.length} aspek katalog, ${positions.length} posisi ` +
    `(aspek/posisi ${Math.min(...perPos)}-${Math.max(...perPos)}), ${jobs.length} job, ` +
    `${stdLines.length - 1} baris standar, ${scoreLines.length - 1} baris skor, ${kbLines.length - 1} baris KB`,
);
