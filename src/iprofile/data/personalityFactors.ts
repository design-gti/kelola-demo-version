/**
 * 16 Personality Factors (16PF) — daftar faktor dan skor STEN per karyawan.
 *
 * Skala STEN berjalan 1–10, dan yang dibaca bukan "tinggi = baik" melainkan KE
 * ARAH MANA seseorang cenderung: tiap faktor punya dua kutub yang sama-sama sah.
 * Karena itu setiap faktor membawa dua keterangan kutub, bukan satu label nilai.
 *
 * Tafsir bakunya membagi rentang jadi tiga: 1–3 condong ke kutub kiri, 8–10 ke
 * kutub kanan, dan 4–7 dianggap rata-rata. Kartu di iProfile mengikuti pembagian
 * ini — lihat POLE_LOW_MAX / POLE_HIGH_MIN.
 */

export interface PersonalityFactor {
  /** Kode baku 16PF: A, B, C, E, F, G, H, I, L, M, N, O, Q1..Q4. */
  code: string;
  /** Nama faktornya, dipakai sebagai judul baris. */
  name: string;
  /** Keterangan kutub kiri (skor rendah) dan kutub kanan (skor tinggi). */
  low: string;
  high: string;
}

/** Batas atas kutub kiri, dan batas bawah kutub kanan. Di antaranya: rata-rata. */
export const POLE_LOW_MAX = 3;
export const POLE_HIGH_MIN = 8;
export const STEN_MIN = 1;
export const STEN_MAX = 10;

/**
 * Keterangan kutub ditulis singkat — tiga sampai lima kata.
 *
 * Laporan cetak 16PF memuat kalimat penuh di kedua sisi setiap baris; di kartu
 * selebar 336px kalimat sepanjang itu terpangkas jadi setengah dan justru tidak
 * terbaca. Yang dipertahankan intinya, dan kalimat panjangnya tetap dibaca di
 * laporan aslinya.
 */
export const PERSONALITY_FACTORS: PersonalityFactor[] = [
  { code: "A",  name: "Warmth",             low: "Menjaga jarak, objektif",        high: "Hangat, mudah akrab" },
  { code: "B",  name: "Reasoning",          low: "Berpikir konkret",               high: "Cepat menangkap abstraksi" },
  { code: "C",  name: "Emotional Stability", low: "Mudah terpengaruh perasaan",    high: "Tenang, stabil emosinya" },
  { code: "E",  name: "Dominance",          low: "Mengalah, kooperatif",           high: "Tegas, suka memimpin" },
  { code: "F",  name: "Liveliness",         low: "Serius, hati-hati",              high: "Ekspresif, spontan" },
  { code: "G",  name: "Rule-Consciousness", low: "Lentur pada aturan",             high: "Taat aturan, teliti" },
  { code: "H",  name: "Social Boldness",    low: "Pemalu, hati-hati",              high: "Berani tampil, inisiatif sosial" },
  { code: "I",  name: "Sensitivity",        low: "Keras hati, realistik",          high: "Lembut hati, peka" },
  { code: "L",  name: "Vigilance",          low: "Menaruh percaya pada orang",     high: "Skeptis, waspada" },
  { code: "M",  name: "Abstractedness",     low: "Praktis, membumi",               high: "Imajinatif, penuh gagasan" },
  { code: "N",  name: "Privateness",        low: "Terus terang, blak-blakan",      high: "Menjaga diri, berhati-hati bicara" },
  { code: "O",  name: "Apprehension",       low: "Yakin akan dirinya, tenang",     high: "Khawatir, mudah gelisah" },
  { code: "Q1", name: "Openness to Change", low: "Konservatif, memegang cara lama", high: "Terbuka pada hal baru" },
  { code: "Q2", name: "Self-Reliance",      low: "Bergantung pada kelompok",       high: "Mandiri, memutuskan sendiri" },
  { code: "Q3", name: "Perfectionism",      low: "Longgar, permisif",              high: "Terorganisasi, disiplin" },
  { code: "Q4", name: "Tension",            low: "Santai, tidak mudah frustrasi",  high: "Tegang, mudah tersinggung" },
];

/**
 * Angka STEN semu untuk satu karyawan.
 *
 * Sengaja diturunkan dari id-nya, bukan diacak: halaman ini dipakai untuk demo,
 * dan angka acak akan berubah tiap render — profil yang sama akan menunjukkan
 * kepribadian berbeda setiap kali dibuka, dan tidak ada yang bisa dibandingkan
 * antar layar. Dengan turunan id, satu orang selalu punya angka yang sama.
 */
export function stenScoresFor(employeeId: string): Record<string, number> {
  const out: Record<string, number> = {};
  PERSONALITY_FACTORS.forEach((f, i) => {
    let h = 2166136261 ^ i;
    for (const ch of `${employeeId}:${f.code}`) {
      h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    }
    // >>> 0 menjadikannya bilangan tak bertanda; tanpa itu sisa baginya bisa
    // negatif dan STEN-nya keluar dari rentang 1–10.
    out[f.code] = ((h >>> 0) % (STEN_MAX - STEN_MIN + 1)) + STEN_MIN;
  });
  return out;
}

/** Keterangan yang berlaku untuk satu skor: kutub kiri, kanan, atau rata-rata. */
export function poleFor(factor: PersonalityFactor, sten: number): { text: string; muted: boolean } {
  if (sten <= POLE_LOW_MAX) return { text: factor.low, muted: false };
  if (sten >= POLE_HIGH_MIN) return { text: factor.high, muted: false };
  return { text: "Rata-rata — kedua kutub seimbang", muted: true };
}
