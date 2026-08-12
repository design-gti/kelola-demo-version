import { computeInitiativeSuccess, type Initiative, type InitiativeAspectRequirement } from "./initiatives";

/**
 * Data contoh (demo) — sengaja cuma diisi untuk sebagian kecil karyawan supaya
 * mayoritas kartu tampil "No initiatives" ketika layer Initiatives dinyalakan,
 * bukan semua orang punya goal. Aspek + minScore di sini meniru hasil auto-
 * mapping AI (lihat /api/vismap-initiative) — di dunia nyata baris-baris ini
 * datang dari pemetaan itu, bukan ditulis tangan selamanya.
 */
const SEED_INPUT: { personId: string; text: string; aspects: InitiativeAspectRequirement[] }[] = [
  {
    personId: "p01", // Intan Permatasari — Head of Engineering
    text: "Menurunkan insiden produksi sebesar 30% kuartal ini",
    aspects: [
      { aspect: "Orientasi Hasil", minScore: 4 },
      { aspect: "Pengambilan Keputusan", minScore: 4 },
      { aspect: "Daya Analisis", minScore: 3 },
    ],
  },
  {
    personId: "p09", // Teguh Firmansyah — Head of Finance
    text: "Memangkas waktu tutup buku bulanan dari 10 hari jadi 5 hari",
    aspects: [
      { aspect: "Manajemen Waktu", minScore: 4 },
      { aspect: "Orientasi Hasil", minScore: 4 },
    ],
  },
  {
    personId: "p17", // Lautaro Martinez — VP Operations
    text: "Meningkatkan tingkat pengiriman tepat waktu ke 95%",
    aspects: [
      { aspect: "Orientasi Hasil", minScore: 4 },
      { aspect: "Disiplin", minScore: 4 },
      { aspect: "Pengambilan Keputusan", minScore: 3 },
    ],
  },
  {
    personId: "p21", // Vinicius Junior — Head of Marketing
    text: "Menaikkan engagement media sosial 40% dalam 6 bulan",
    aspects: [
      { aspect: "Inisiatif", minScore: 4 },
      { aspect: "Adaptabilitas", minScore: 3 },
      { aspect: "Komunikasi", minScore: 4 },
    ],
  },
  {
    personId: "p25", // Sabrina Yulianti — Senior Brand Strategist (top talent)
    text: "Meluncurkan kampanye brand baru di 3 pasar sekaligus",
    aspects: [
      { aspect: "Komunikasi", minScore: 4 },
      { aspect: "Inisiatif", minScore: 4 },
      { aspect: "Adaptabilitas", minScore: 4 },
    ],
  },
  {
    personId: "p11", // Cindy Pratiwi — Finance Analyst (sengaja skor rendah, buat dinamika)
    text: "Mengotomasi laporan rekonsiliasi bulanan",
    aspects: [
      { aspect: "Inisiatif", minScore: 3 },
      { aspect: "Daya Analisis", minScore: 3 },
    ],
  },
];

function buildSeed(): Record<string, Initiative[]> {
  const out: Record<string, Initiative[]> = {};
  SEED_INPUT.forEach(({ personId, text, aspects }, i) => {
    const successPercent = computeInitiativeSuccess(personId, aspects);
    const initiative: Initiative = {
      id: `seed-${personId}-${i}`,
      text,
      status: "mapped",
      aspects,
      successPercent,
    };
    out[personId] = [...(out[personId] ?? []), initiative];
  });
  return out;
}

/** personId -> daftar inisiatif contoh. Dihitung sekali saat modul di-load. */
export const INITIATIVES_SEED: Record<string, Initiative[]> = buildSeed();
