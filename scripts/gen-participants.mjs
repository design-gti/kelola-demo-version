// Menyusun public/data/participants.csv dari kerangka organisasi di bawah.
// Jalankan manual: node scripts/gen-participants.mjs
//
// SENGAJA TIDAK ikut `npm run seed` / predev. participants.csv tetap berkedudukan
// sebagai sumber data yang boleh disunting tangan; script ini hanya alat untuk
// menyusun ulang kerangkanya kalau strukturnya berubah. Kalau ikut predev,
// suntingan manual bakal tertimpa diam-diam tiap dev server start.
//
// Kerangkanya 5 lapis: CEO → C-level → Head/VP → Manager & Lead → Staff.
// Hunter dan Farmer ada di lapis 4 sebagai unit tersendiri di bawah Head of
// Sales, masing-masing punya staf sendiri di lapis 5.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Satu unit = satu jabatan beserta jumlah pemegangnya.
 *
 * `ids` mengunci kursi tertentu ke id lama (p01-p33) supaya foto, assignment,
 * dan riwayat IDP yang sudah menempel di id itu tidak putus. Kursi selebihnya
 * dapat id berurutan mulai p34.
 *
 * `reportTo` menunjuk key unit atasan; yang dipakai sebagai atasan adalah orang
 * PERTAMA di unit itu — untuk unit berisi banyak orang, yang pertama memang
 * kepalanya.
 */
const UNITS = [
  // ── Lapis 1 ────────────────────────────────────────────────────────────────
  { key: "CEO", position: "Chief Executive Officer", job: "Strategi", team: "EXE", ids: ["p05"], reportTo: null },

  // ── Lapis 2: C-level ───────────────────────────────────────────────────────
  { key: "CSO", position: "Chief Strategy Officer", job: "Strategi", team: "EXE", ids: ["p06"], reportTo: "CEO" },
  { key: "CRO", position: "Chief Revenue Officer", job: "Pemasaran", team: "SNM", ids: ["p26"], reportTo: "CEO" },
  { key: "CTO", position: "Chief Technology Officer", job: "Teknologi", team: "ENG", reportTo: "CEO" },
  { key: "CFO", position: "Chief Financial Officer", job: "Keuangan", team: "FIN", reportTo: "CEO" },
  { key: "COO", position: "Chief Operating Officer", job: "Operasional", team: "OPS", reportTo: "CEO" },
  { key: "CHRO", position: "Chief Human Resources Officer", job: "SDM", team: "HR", reportTo: "CEO" },

  // ── Strategi (8) ───────────────────────────────────────────────────────────
  { key: "STR_VP", position: "VP Corporate Strategy", job: "Strategi", team: "EXE", ids: ["p07"], reportTo: "CSO" },
  { key: "STR_GOV", position: "Head of Governance", job: "Strategi", team: "EXE", ids: ["p08"], reportTo: "CSO" },
  { key: "STR_MGR", position: "Strategy Manager", job: "Strategi", team: "EXE", reportTo: "STR_VP" },
  { key: "STR_GOVMGR", position: "Governance Manager", job: "Strategi", team: "EXE", reportTo: "STR_GOV" },
  { key: "STR_ANL", position: "Strategy Analyst", job: "Strategi", team: "EXE", count: 2, reportTo: "STR_MGR" },

  // ── Teknologi (24) ─────────────────────────────────────────────────────────
  { key: "ENG_HEAD", position: "Head of Engineering", job: "Teknologi", team: "ENG", ids: ["p01"], reportTo: "CTO" },
  { key: "INF_HEAD", position: "Head of Infrastructure & Security", job: "Teknologi", team: "ENG", reportTo: "CTO" },
  { key: "BE_LEAD", position: "Backend Lead", job: "Teknologi", team: "ENG", ids: ["p04"], reportTo: "ENG_HEAD" },
  { key: "FE_LEAD", position: "Frontend Lead", job: "Teknologi", team: "ENG", ids: ["p03"], reportTo: "ENG_HEAD" },
  { key: "PRINC", position: "Principal Engineer", job: "Teknologi", team: "ENG", ids: ["p28"], reportTo: "ENG_HEAD" },
  { key: "QA_LEAD", position: "QA Lead", job: "Teknologi", team: "ENG", reportTo: "ENG_HEAD" },
  { key: "DEVOPS_LEAD", position: "DevOps Lead", job: "Teknologi", team: "ENG", reportTo: "INF_HEAD" },
  { key: "SEC_LEAD", position: "Security Lead", job: "Teknologi", team: "ENG", reportTo: "INF_HEAD" },
  { key: "BE_ENG", position: "Backend Engineer", job: "Teknologi", team: "ENG", count: 3, reportTo: "BE_LEAD" },
  { key: "FE_ENG", position: "Frontend Engineer", job: "Teknologi", team: "ENG", count: 3, reportTo: "FE_LEAD" },
  { key: "SR_ENG", position: "Senior Engineer", job: "Teknologi", team: "ENG", ids: ["p02"], reportTo: "PRINC" },
  { key: "SW_ENG", position: "Software Engineer", job: "Teknologi", team: "ENG", reportTo: "PRINC" },
  { key: "QA_ENG", position: "QA Engineer", job: "Teknologi", team: "ENG", count: 3, reportTo: "QA_LEAD" },
  { key: "DEVOPS_ENG", position: "DevOps Engineer", job: "Teknologi", team: "ENG", count: 2, reportTo: "DEVOPS_LEAD" },
  { key: "SEC_ANL", position: "Security Analyst", job: "Teknologi", team: "ENG", count: 2, reportTo: "SEC_LEAD" },

  // ── Keuangan (12) ──────────────────────────────────────────────────────────
  { key: "FIN_HEAD", position: "Head of Finance", job: "Keuangan", team: "FIN", ids: ["p09"], reportTo: "CFO" },
  { key: "ACC_HEAD", position: "Head of Accounting", job: "Keuangan", team: "FIN", reportTo: "CFO" },
  { key: "FIN_MGR", position: "Senior Finance Manager", job: "Keuangan", team: "FIN", ids: ["p31"], reportTo: "FIN_HEAD" },
  { key: "CTRL", position: "Controller", job: "Keuangan", team: "FIN", ids: ["p12"], reportTo: "FIN_HEAD" },
  { key: "ACC_MGR", position: "Accounting Manager", job: "Keuangan", team: "FIN", reportTo: "ACC_HEAD" },
  { key: "FIN_SRANL", position: "Senior Finance Analyst", job: "Keuangan", team: "FIN", ids: ["p10"], reportTo: "FIN_MGR" },
  { key: "FIN_ANL", position: "Finance Analyst", job: "Keuangan", team: "FIN", ids: ["p11"], count: 2, reportTo: "FIN_MGR" },
  { key: "AUDIT", position: "Internal Auditor", job: "Keuangan", team: "FIN", reportTo: "CTRL" },
  { key: "ACC_STAFF", position: "Accounting Staff", job: "Keuangan", team: "FIN", reportTo: "ACC_MGR" },
  { key: "TAX_STAFF", position: "Tax Staff", job: "Keuangan", team: "FIN", reportTo: "ACC_MGR" },

  // ── Operasional (14) ───────────────────────────────────────────────────────
  { key: "OPS_VP", position: "VP Operations", job: "Operasional", team: "OPS", ids: ["p17"], reportTo: "COO" },
  { key: "SC_HEAD", position: "Head of Supply Chain", job: "Operasional", team: "OPS", reportTo: "COO" },
  { key: "OPS_MGR", position: "Operations Manager", job: "Operasional", team: "OPS", ids: ["p18"], reportTo: "OPS_VP" },
  { key: "SQ_MGR", position: "Service Quality Manager", job: "Operasional", team: "OPS", reportTo: "OPS_VP" },
  { key: "SC_MGR", position: "Supply Chain Manager", job: "Operasional", team: "OPS", ids: ["p32"], reportTo: "SC_HEAD" },
  { key: "SC_LEAD", position: "Supply Chain Lead", job: "Operasional", team: "OPS", ids: ["p19"], reportTo: "SC_HEAD" },
  { key: "OPS_ANL", position: "Operations Analyst", job: "Operasional", team: "OPS", ids: ["p20"], reportTo: "OPS_MGR" },
  { key: "OPS_STRAT", position: "Operations Strategist", job: "Operasional", team: "OPS", ids: ["p29"], reportTo: "OPS_MGR" },
  { key: "OPS_STAFF", position: "Operations Staff", job: "Operasional", team: "OPS", reportTo: "OPS_MGR" },
  { key: "SQ_OFF", position: "Service Quality Officer", job: "Operasional", team: "OPS", reportTo: "SQ_MGR" },
  { key: "LOG_STAFF", position: "Logistics Staff", job: "Operasional", team: "OPS", count: 2, reportTo: "SC_MGR" },
  { key: "PROC_STAFF", position: "Procurement Staff", job: "Operasional", team: "OPS", reportTo: "SC_LEAD" },

  // ── SDM (10) ───────────────────────────────────────────────────────────────
  { key: "HR_BP", position: "HR Business Partner", job: "SDM", team: "HR", ids: ["p13"], reportTo: "CHRO" },
  { key: "HR_MGR", position: "HR Manager", job: "SDM", team: "HR", ids: ["p14"], reportTo: "HR_BP" },
  { key: "TA_LEAD", position: "Talent Acquisition Lead", job: "SDM", team: "HR", ids: ["p15"], reportTo: "HR_BP" },
  { key: "PD_MGR", position: "People Development Manager", job: "SDM", team: "HR", reportTo: "HR_BP" },
  { key: "PEOPLE_OPS", position: "People Ops Specialist", job: "SDM", team: "HR", ids: ["p16"], reportTo: "HR_MGR" },
  { key: "HR_STAFF", position: "HR Operations Staff", job: "SDM", team: "HR", reportTo: "HR_MGR" },
  { key: "RECRUITER", position: "Recruiter", job: "SDM", team: "HR", count: 2, reportTo: "TA_LEAD" },
  { key: "LND", position: "Learning & Development Specialist", job: "SDM", team: "HR", reportTo: "PD_MGR" },

  // ── Pemasaran (14) ─────────────────────────────────────────────────────────
  { key: "MKT_HEAD", position: "Head of Marketing", job: "Pemasaran", team: "SNM", ids: ["p21"], reportTo: "CRO" },
  { key: "SALES_HEAD", position: "Head of Sales", job: "Pemasaran", team: "SNM", reportTo: "CRO" },
  { key: "MKT_SRMGR", position: "Senior Marketing Manager", job: "Pemasaran", team: "SNM", ids: ["p22"], reportTo: "MKT_HEAD" },
  { key: "BRAND_MGR", position: "Brand Manager", job: "Pemasaran", team: "SNM", ids: ["p23"], reportTo: "MKT_HEAD" },
  { key: "GROWTH_LEAD", position: "Growth Marketing Lead", job: "Pemasaran", team: "SNM", ids: ["p24"], reportTo: "MKT_HEAD" },
  { key: "CREATIVE_DIR", position: "Creative Director", job: "Pemasaran", team: "SNM", ids: ["p27"], reportTo: "MKT_HEAD" },
  { key: "GROWTH_MGR", position: "Growth Marketing Manager", job: "Pemasaran", team: "SNM", ids: ["p30"], reportTo: "MKT_HEAD" },
  { key: "BRAND_STRAT", position: "Senior Brand Strategist", job: "Pemasaran", team: "SNM", ids: ["p25"], reportTo: "BRAND_MGR" },
  { key: "CONTENT_SPEC", position: "Digital Content Specialist", job: "Pemasaran", team: "SNM", ids: ["p33"], reportTo: "CREATIVE_DIR" },
  { key: "GRAPHIC", position: "Graphic Designer", job: "Pemasaran", team: "SNM", reportTo: "CREATIVE_DIR" },
  { key: "DIGITAL_EXEC", position: "Digital Marketing Executive", job: "Pemasaran", team: "SNM", count: 2, reportTo: "GROWTH_MGR" },
  { key: "RESEARCH_ANL", position: "Market Research Analyst", job: "Pemasaran", team: "SNM", reportTo: "MKT_SRMGR" },

  // ── Hunter (16) — lapis 4 & 5 di bawah Head of Sales ───────────────────────
  { key: "HUNT_ENT", position: "Hunting Manager Enterprise", job: "Hunter", team: "HUN", reportTo: "SALES_HEAD" },
  { key: "HUNT_SMB", position: "Hunting Manager SMB", job: "Hunter", team: "HUN", reportTo: "SALES_HEAD" },
  { key: "HUNT_GOV", position: "Hunting Manager Government", job: "Hunter", team: "HUN", reportTo: "SALES_HEAD" },
  { key: "AE_ENT", position: "Account Executive Enterprise", job: "Hunter", team: "HUN", count: 3, reportTo: "HUNT_ENT" },
  { key: "AE_SMB", position: "Account Executive SMB", job: "Hunter", team: "HUN", count: 2, reportTo: "HUNT_SMB" },
  { key: "BDR", position: "Business Development Representative", job: "Hunter", team: "HUN", count: 4, reportTo: "HUNT_SMB" },
  { key: "SDR", position: "Sales Development Representative", job: "Hunter", team: "HUN", count: 2, reportTo: "HUNT_ENT" },
  { key: "GOV_SPEC", position: "Government Relations Specialist", job: "Hunter", team: "HUN", count: 2, reportTo: "HUNT_GOV" },

  // ── Farmer (14) — lapis 4 & 5 di bawah Head of Sales ───────────────────────
  { key: "FARM_ENT", position: "Farming Manager Enterprise", job: "Farmer", team: "FAR", reportTo: "SALES_HEAD" },
  { key: "FARM_SMB", position: "Farming Manager SMB", job: "Farmer", team: "FAR", reportTo: "SALES_HEAD" },
  { key: "AM_ENT", position: "Account Manager Enterprise", job: "Farmer", team: "FAR", count: 3, reportTo: "FARM_ENT" },
  { key: "AM_SMB", position: "Account Manager SMB", job: "Farmer", team: "FAR", count: 2, reportTo: "FARM_SMB" },
  { key: "CS_OFF", position: "Customer Success Officer", job: "Farmer", team: "FAR", count: 4, reportTo: "FARM_ENT" },
  { key: "RENEWAL", position: "Renewal Specialist", job: "Farmer", team: "FAR", count: 3, reportTo: "FARM_SMB" },
];

// ── Nama ─────────────────────────────────────────────────────────────────────
// Dipakai berurutan, jadi susunannya sengaja diselang-seling supaya sebaran
// laki-laki/perempuan merata di semua unit, bukan menumpuk di satu departemen.
const MALE = [
  "Bagus Prakoso", "Rizky Ramadhan", "Andi Saputra", "Fajar Nugroho", "Dimas Prasetyo",
  "Yoga Pratama", "Bayu Setiawan", "Reza Mahendra", "Aditya Wibowo", "Galih Kusuma",
  "Hendra Gunawan", "Iqbal Maulana", "Krisna Wijaya", "Lukman Hakim", "Bimo Santoso",
  "Arif Budiman", "Panji Nugraha", "Rangga Aditama", "Satria Utomo", "Teguh Firmansyah",
  "Wisnu Baskoro", "Yudha Permana", "Ilham Rahmadi", "Gilang Saputro", "Damar Anggoro",
  "Bintang Mahesa", "Rafi Alfarizi", "Naufal Hidayat", "Zaki Ardiansyah", "Farhan Hakim",
  // Satu nama sengaja bertanda hubung: pencarian nama menormalkan hubung dan
  // spasi, dan tanpa contoh berhubung di data, uji regresinya kehilangan bahan.
  "Denny Kurniawan", "Ridho Setiadi", "Ahmad Al-Faruq", "Hafiz Ramadhan", "Bram Sitorus",
  "Josua Tampubolon", "Ruben Simanjuntak", "Kevin Napitupulu", "Marco Silalahi", "Gerry Panggabean",
  "Wayan Suardika", "Made Arsana", "Komang Aditya", "Putu Darmawan", "Rendra Pratama",
  "Doni Saputra", "Ferdi Ahmad", "Irfan Maulidin", "Yusuf Abdillah", "Adam Nurhakim",
  "Rio Sanjaya", "Tio Wicaksono", "Nanda Pribadi", "Angga Setyawan", "Dicky Ferdian",
  "Rahmat Fauzi", "Aldi Nurcahyo", "Bagas Winarno", "Fikri Ramadhan", "Sandi Kurnia",
];

const FEMALE = [
  "Ayu Lestari", "Siti Rahmawati", "Dewi Anggraini", "Putri Maharani", "Rina Kartika",
  "Nadia Safitri", "Intan Permatasari", "Citra Ayu Ningsih", "Fitri Handayani", "Laras Wulandari",
  "Maya Puspita", "Nur Aisyah", "Ratna Juwita", "Salma Nabila", "Tiara Ramadhani",
  "Vina Oktaviani", "Winda Sari", "Yulia Andini", "Zahra Amelia", "Anisa Rahmadani",
  "Bella Kusumawati", "Cindy Pratiwi", "Dinda Alifia", "Elsa Nuraini", "Farah Salsabila",
  "Gita Aprilia", "Hana Fadhilah", "Indah Purnama", "Jihan Azzahra", "Kirana Sekar",
  "Lidya Simatupang", "Meliana Sianturi", "Novita Hutagalung", "Olivia Manurung", "Priska Sihombing",
  "Ni Luh Ayu Savitri", "Ni Kadek Sriani", "Ni Made Wulandari", "Desak Putu Ariani", "Ida Ayu Prameswari",
  "Rani Oktarina", "Sabrina Yulianti", "Tania Kirana", "Ulfa Nabilah", "Vera Anggita",
  "Wulan Ramadhani", "Yasmin Khairunnisa", "Zulfa Amalia", "Amelia Rizki", "Bunga Lestari",
  "Chika Ardhana", "Diah Ayu Kusuma", "Erika Wijayanti", "Fani Nurhaliza", "Gina Puspasari",
  "Hesti Nuraini", "Ika Damayanti", "Jasmine Aulia", "Karina Dewanti", "Lita Puspaningrum",
  "Mira Anjani", "Nayla Hasanah", "Oktavia Rahayu", "Pipit Larasati", "Qonita Salsabil",
];

// ── Skor ─────────────────────────────────────────────────────────────────────
/** Hash kecil & stabil — dipakai supaya angka yang keluar sama tiap kali dijalankan. */
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

const DISC = ["D", "I", "S", "C", "DI", "CI", "SC", "DC"];

/**
 * Rentang skor per lapis. Makin tinggi jabatan makin tinggi dasarnya — tanpa ini
 * 9-box Talent Mapping jadi acak dan tidak ada pola yang bisa dibaca saat demo.
 */
const BASE_BY_LEVEL = { 1: 90, 2: 86, 3: 82, 4: 77, 5: 72 };

/**
 * Watak tiap orang, digeser dari dasar lapisnya.
 *
 * Tanpa ini semua staf berkerumun di satu kotak 9-box — pernah terjadi: 68 dari
 * 112 orang jatuh di kotak yang sama dan petanya tidak lagi bisa dibaca.
 * Performa dan potensi diberi watak yang BERBEDA supaya keduanya tidak bergerak
 * seiring; justru dari selisih itulah kotak seperti "Emerging Star" (potensi
 * tinggi, performa belum) dan "Expert" (sebaliknya) muncul.
 */
const TRAITS = [-16, -9, -3, 3, 9, 16];

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

  const taken = new Set(UNITS.flatMap((u) => u.ids ?? []));
  let next = 34;
  const nextId = () => {
    let id;
    do {
      id = "p" + String(next++).padStart(2, "0");
    } while (taken.has(id));
    taken.add(id);
    return id;
  };

  const rows = [];
  const firstIdOf = new Map();
  let mi = 0;
  let fi = 0;

  for (const unit of UNITS) {
    const count = unit.count ?? unit.ids?.length ?? 1;
    const level = levelOf(unit.key);
    for (let i = 0; i < count; i++) {
      const id = unit.ids?.[i] ?? nextId();
      // Gender berselang-seling menurut urutan kursi; nama diambil dari daftar
      // yang sesuai supaya nama dan gender tidak pernah bertentangan.
      const female = (rows.length + (unit.key.length % 2)) % 2 === 1;
      const name = female ? FEMALE[fi++ % FEMALE.length] : MALE[mi++ % MALE.length];
      const base = BASE_BY_LEVEL[level] ?? 72;
      const perfTrait = TRAITS[hash(id + "perf-trait") % TRAITS.length];
      const potTrait = TRAITS[hash(id + "pot-trait") % TRAITS.length];
      const score = (kind, spread = 12, trait = 0) => {
        const h = hash(id + kind);
        return Math.max(42, Math.min(99, base + trait - Math.floor(spread / 2) + (h % spread)));
      };
      const competency = score("competency", 14, Math.round((perfTrait + potTrait) / 2));
      const row = {
        id,
        name,
        gender: female ? "Perempuan" : "Laki-laki",
        position: unit.position,
        department: unit.job,
        team: unit.team,
        disc: DISC[hash(id + "disc") % DISC.length],
        potential: competency >= 88 ? "high" : competency >= 78 ? "medium" : "low",
        managerUnit: unit.reportTo,
        successor_for: "",
        behavioral: score("behavioral", 14, potTrait),
        technical: score("technical", 14, perfTrait),
        // performance = sumbu X di 9-box, leadership = sumbu Y (potensi).
        performance: score("performance", 10, perfTrait),
        leadership: score("leadership", 10, potTrait),
        competency,
        prediction: score("prediction", 18, potTrait),
        engagement: score("engagement", 18),
        level,
        unitKey: unit.key,
      };
      rows.push(row);
      if (i === 0) firstIdOf.set(unit.key, id);
    }
  }

  // Atasan = orang pertama di unit yang ditunjuk reportTo.
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
    const best = [...list].sort((a, b) => b.competency - a.competency)[0];
    if (best && best.competency >= 80) best.successor_for = managerId;
  }

  return rows;
};

const rows = build();

// Nama harus unik. Pencarian orang di aplikasi ini bertumpu pada nama — asisten
// dan Talent Mapping mencocokkan teks nama, bukan id — jadi dua orang bernama
// sama akan menunjuk orang yang keliru tanpa ada pesan galat. Pernah terjadi:
// daftar nama perempuan lebih pendek dari jumlah yang dibutuhkan, dan lima nama
// terakhir diam-diam mengulang dari awal.
const dupes = Object.entries(
  rows.reduce((acc, r) => ((acc[r.name] = (acc[r.name] ?? 0) + 1), acc), {}),
).filter(([, n]) => n > 1);
if (dupes.length) {
  throw new Error(
    `Nama kembar (tambah nama di daftar MALE/FEMALE): ${dupes.map(([n, c]) => `${n} ×${c}`).join(", ")}`,
  );
}

const HEADERS = [
  "id", "name", "gender", "position", "department", "team", "disc", "potential",
  "manager_id", "successor_for", "behavioral", "technical", "performance",
  "leadership", "competency", "prediction", "engagement",
];

// Diurutkan menurut id supaya berkasnya enak dibaca dan diff-nya stabil.
const sorted = [...rows].sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
const lines = [HEADERS.join(",")];
for (const r of sorted) lines.push(HEADERS.map((h) => r[h] ?? "").join(","));
writeFileSync(join(ROOT, "public/data/participants.csv"), lines.join("\n") + "\n", "utf8");

// Ringkasan supaya ketimpangan struktur langsung kelihatan tanpa buka CSV-nya.
const perLevel = {};
const perJob = {};
for (const r of rows) {
  perLevel[r.level] = (perLevel[r.level] ?? 0) + 1;
  perJob[r.department] = (perJob[r.department] ?? 0) + 1;
}
console.log(`participants.csv: ${rows.length} employee, ${new Set(rows.map((r) => r.position)).size} posisi unik`);
console.log("per lapis:", perLevel);
console.log("per Job:", perJob);
console.log("successor ditandai:", rows.filter((r) => r.successor_for).length);
