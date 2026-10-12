// @ts-nocheck -- bekerja di atas ColumnConfig port TDP (tak pernah lolos typecheck)
import { KLASTER_BAWAAN_TIPE, klasterEfektif, type Klaster } from '@/lib/klasterVisibilitas';

/**
 * Cluster ASAL sebuah kolom TDP, dan cluster EFEKTIFnya setelah pilihan pengguna.
 *
 * Satu fungsi untuk dialog Data Visibility DAN tampilan yang menggambar hasilnya (kartu Compare),
 * supaya variabel yang dipindah/dicentang di dialog muncul di tempat yang sama di layar. Dulu kartu
 * Compare mengelompokkan menurut cluster CSV aslinya sendiri — hasilnya bagian "Other" yang tak ada di
 * dialog, dan perpindahan cluster tak pernah terlihat di kartu.
 */

const TYPED_POTENCY_KEYS = new Set(['potentialRating']);
const TYPED_READINESS_KEYS = new Set(['readinessHAV', 'usia', 'readinessRiskHeat']);
const TYPED_BASIC_KEYS = new Set(['name', 'role', 'department', 'level']);
// (competencyMatch, engagementScore, performanceRating bukan di sini: mereka isi bawaan cluster 3C —
//  lihat `KLASTER_BAWAAN_TIPE`.)
const TYPED_SCORE_KEYS = new Set([
  'iqScore', 'readinessLevel',
  'assessmentScore',
  'competencyScore', 'commitmentScore', 'contributionScore', 'aspectScore',
  'leadershipType', 'personality', 'flightRisk', 'promotionReadiness',
  'timeInRole', 'salary',
  'criticalRole', 'successorIdentified', 'manager', 'skills', 'certifications',
]);

export function cocokKlaster(col, klaster: string): boolean {
  const k = String(col.key);
  const c = col.cluster as string | undefined;
  const isCsv = k.startsWith('csv:');
  switch (klaster) {
    case 'basic':
      return TYPED_BASIC_KEYS.has(k) || TYPED_SCORE_KEYS.has(k) || (isCsv && !c);
    case 'capability':
      // Isi bawaan: Competency Score untuk jabatan saat ini (`competencyMatch`) + kolom CSV bertanda aspek.
      return KLASTER_BAWAAN_TIPE[k] === 'capability' || (isCsv && (c === 'aspect' || c === 'competency'));
    // Competency Score — SATU grup berisi dua kategori (General dan Technical).
    case 'competencyScore':
      return isCsv && (c === 'competencyGeneral' || c === 'competencyTechnical');
    case 'commitment':
      return KLASTER_BAWAAN_TIPE[k] === 'commitment' || (isCsv && c === 'commitment');
    case 'contribution':
      return KLASTER_BAWAAN_TIPE[k] === 'contribution' || (isCsv && c === 'contribution');
    case 'potency':
      return TYPED_POTENCY_KEYS.has(k) || (isCsv && c === 'potency');
    case 'readiness':
      return TYPED_READINESS_KEYS.has(k) || (isCsv && c === 'readiness');
    case 'leadershipStyle':
      return isCsv && c === 'leadershipStyle';
    case 'careerHistory':
      return c === 'careerHistory';
    case 'additional':
      // Data tambahan dari Profile Data — bukan kolom custom lokal.
      return !!col.dariProfileData;
    default:
      return false;
  }
}

const URUTAN_ASAL = [
  'basic', 'capability', 'competencyScore', 'commitment', 'contribution',
  'leadershipStyle', 'careerHistory', 'potency', 'readiness', 'additional',
];

/** Cluster bawaan sebuah kolom, tanpa pilihan pengguna. */
export function klasterAsalKolom(col): string {
  for (const k of URUTAN_ASAL) if (cocokKlaster(col, k)) return k;
  return 'custom';
}

/** Cluster yang berlaku: pilihan pengguna bila ada (Basic Information terkunci), selain itu bawaannya. */
export function klasterEfektifKolom(col, override: Record<string, string>, klasterPengguna: Klaster[]): string {
  const asal = klasterAsalKolom(col);
  if (asal === 'basic') return 'basic';
  return klasterEfektif(String(col.key), asal, override, klasterPengguna);
}
