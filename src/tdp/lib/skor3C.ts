/**
 * Skor 3C (Capability, Commitment, Contribution) seorang karyawan, dibaca dari kolom CSV Talent Decision.
 *
 * Satu fungsi untuk DUA tampilan: ubin di kartu Compare dan nilai "Total Score" per kelompok di Table.
 * Compare adalah acuannya (diminta langsung) — begitu rumus ini disalin ke dua tempat, angkanya akan
 * menyimpang tanpa ada yang menyadarinya, jadi keduanya memanggil fungsi ini.
 *
 * Aturannya (semua hasil dalam skala 0–100):
 *   Capability    Competency Score untuk JABATAN SAAT INI (% kecocokan terhadap standar posisinya, sama dengan
 *                 iProfile), dari kolom 'Capability'. Cadangan untuk CSV lama tanpa kolom itu: rata-rata butir
 *                 `[GENERAL]` + `[TECHNICAL]` (1–5) × 20.
 *   Commitment    rata-rata butir `[ENGAGEMENT]` × 20; bila tak ada, kolom `Engagement` polos (sudah 0–100);
 *                 0 bila keduanya tak ada.
 *   Contribution  kolom `Performance` (0–100), dibulatkan; `null` bila tak ada — dibedakan dari 0 supaya
 *                 layar menampilkan "tanpa data", bukan skor terburuk.
 */

export interface Skor3C {
  capability: number;
  commitment: number;
  contribution: number | null;
  character: string;
  /** Apakah angka Capability/Commitment benar-benar dihitung dari data (bukan 0 karena kosong). */
  adaCapability: boolean;
  adaCommitment: boolean;
}

const angka = (v: unknown): number => parseFloat(String(v ?? ''));

export function hitungSkor3C(csvFields: Record<string, string> | undefined | null): Skor3C {
  const fields = csvFields ?? {};

  /*
    Sumbernya `[GENERAL]` + `[TECHNICAL]` — kolom yang isinya SAMA dengan kartu Competency iProfile.
    Dulu `[KOMPETENSI]`, instrumen tabel `/talent-decision` yang kosakatanya berbeda.
  */
  const kompetensi = Object.entries(fields)
    .filter(([k]) => k.startsWith('[GENERAL]') || k.startsWith('[TECHNICAL]'))
    .map(([, v]) => angka(v))
    .filter((n) => !isNaN(n));
  /*
    Capability = Competency Score untuk JABATAN SAAT INI (% kecocokan terhadap standar posisinya), dari
    kolom 'Capability' CSV. Rata-rata General+Technical hanya cadangan untuk CSV lama tanpa kolom itu.
  */
  const adaKolomCapability = 'Capability' in fields;
  const capabilityJabatan = angka(fields['Capability']);
  const capability = adaKolomCapability
    ? Number.isNaN(capabilityJabatan) ? 0 : Math.round(capabilityJabatan)
    : kompetensi.length > 0
      ? Math.round((kompetensi.reduce((s, v) => s + v, 0) / kompetensi.length) * 20)
      : 0;

  // Commitment: rata-rata butir [ENGAGEMENT] (tanpa presen_kecocokan/hasil_rekomendasi).
  const butirEngagement = Object.entries(fields)
    .filter(
      ([k]) =>
        k.startsWith('[ENGAGEMENT]') &&
        k !== '[ENGAGEMENT] presen_kecocokan' &&
        k !== '[ENGAGEMENT] hasil_rekomendasi',
    )
    .map(([, v]) => angka(v))
    .filter((n) => !isNaN(n));
  /*
    Cadangan ke kolom `Engagement` polos: CSV yang dihasilkan `tdpCsv.ts` dari kelola tidak punya butir
    `[ENGAGEMENT] ...`, hanya SATU angka engagement berskala 0–100. Tanpa cadangan ini setiap orang
    terbaca "Engagement 0" — pernyataan yang jauh lebih kuat daripada "tidak diukur per butir".
  */
  const engagementPolos = angka(fields['Engagement']);
  const commitment = butirEngagement.length > 0
    ? Math.round((butirEngagement.reduce((s, v) => s + v, 0) / butirEngagement.length) * 20)
    : Number.isNaN(engagementPolos) ? 0 : Math.round(engagementPolos);

  const performancePolos = angka(fields['Performance']);
  const contribution = Number.isNaN(performancePolos) ? null : Math.round(performancePolos);

  const lsStyle = fields['[LEADERSHIP STYLE] Leadership Style']?.trim();
  const lsSocial = fields['[LEADERSHIP STYLE] Social Style']?.trim();
  const character =
    (lsStyle && lsStyle !== '#N/A' ? lsStyle : '') ||
    (lsSocial && lsSocial !== '#N/A' ? lsSocial : '') ||
    '—';

  return {
    capability,
    commitment,
    contribution,
    character,
    adaCapability: adaKolomCapability ? !Number.isNaN(capabilityJabatan) : kompetensi.length > 0,
    adaCommitment: butirEngagement.length > 0 || !Number.isNaN(engagementPolos),
  };
}
