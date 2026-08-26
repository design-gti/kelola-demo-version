// Fakta karyawan yang dibutuhkan overlay V3 tapi TIDAK ada di model Employee
// milik Vismap (src/vismap/data/orgChartData.ts). Semuanya diturunkan dari data
// kanonik yang sudah dipakai modul lain, bukan data baru — jadi angka di V3
// konsisten dengan Talent Mapping dan iProfile.
//
// id karyawan Vismap == id participant kanonik (lihat canonicalAdapter.ts),
// sehingga bisa dipakai langsung sebagai kunci ke `candidates`.
import { candidates } from "@/data/dummyData";
import { nineBoxIndex } from "@/data/managerTeamData";
import { iprofileEmployees } from "@/data/iprofileEmployees";
import { getToday } from "@/lib/data/clock";

/** Indeks kuadran "Star" pada 9-box (potential high × performance >= 85). */
const STAR_CELL_INDEX = 2;

const candidateById = new Map(candidates.map(c => [c.id, c]));
const joinDateById = new Map(iprofileEmployees.map(e => [e.id, e.joinDate]));

/**
 * Talent = kuadran Star pada 9-box Talent Mapping. Sengaja memakai
 * `nineBoxIndex` yang sama dengan modul Talent Mapping, bukan ambang sendiri,
 * supaya bintang di Vismap V3 tidak pernah berbeda dari grid 9-box.
 */
export function isTalent(employeeId?: string): boolean {
  if (!employeeId) return false;
  const c = candidateById.get(employeeId);
  return c ? nineBoxIndex(c) === STAR_CELL_INDEX : false;
}

/**
 * Chip "Teams" pada card position. Store kanonik hanya memodelkan SATU
 * department per posisi, jadi chip-nya satu — bukan dua seperti pada mockup.
 */
export function teamsOf(employeeId?: string, fallbackDepartment?: string): string[] {
  const dept = (employeeId ? candidateById.get(employeeId)?.department : undefined) ?? fallbackDepartment;
  return dept ? [dept] : [];
}

/**
 * Masa kerja, dihitung dari joinDate (DD/MM/YYYY) di iprofileEmployees terhadap
 * "hari ini" versi clock.ts — bukan `new Date()` langsung, supaya ikut terpaku
 * saat demo dipin lewat NEXT_PUBLIC_DEMO_TODAY.
 */
export function tenureOf(employeeId?: string): string | undefined {
  if (!employeeId) return undefined;
  const raw = joinDateById.get(employeeId);
  if (!raw) return undefined;

  const [dd, mm, yyyy] = raw.split('/').map(Number);
  if (!dd || !mm || !yyyy) return undefined;

  const today = getToday();
  let months = (today.getFullYear() - yyyy) * 12 + (today.getMonth() + 1 - mm);
  if (today.getDate() < dd) months -= 1;
  if (months < 0) return undefined;

  const years = Math.floor(months / 12);
  const restMonths = months % 12;
  if (years === 0) return `${restMonths} Bln`;
  if (restMonths === 0) return `${years} Thn`;
  return `${years} Thn ${restMonths} Bln`;
}
