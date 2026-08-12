// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
/**
 * Dataset karyawan TDP.
 *
 * CSV di-FETCH saat runtime dari `/data/tdp-employees.csv` (disajikan oleh
 * kelola-demo-version tempat TDP di-embed di `/tdp/`), lalu teksnya diinjeksikan
 * ke `csvSource` di bootstrap (main.tsx) SEBELUM modul ini di-import secara dinamis.
 * Jadi parsing tetap terjadi sekali saat module-load (seperti versi `?raw`),
 * dan `CSV_RAW_HEADERS` + kolom turunannya tetap valid — tanpa mengubah consumer.
 * Ganti data cukup edit CSV + reload (tanpa rebuild).
 */
import type { Employee } from './types';
import { rawCsv as csvText } from './csvSource';

// ---------------------------------------------------------------------------
// CSV column header → key konstanta
// (Ditulis eksplisit supaya parser tidak fragile terhadap perubahan urutan kolom)
// ---------------------------------------------------------------------------
const CSV_HEADERS = {
  employeeId: 'Employee ID',
  name: 'Name',
  position: 'Position',
  department: 'Department',
  level: 'Level',
  yearsInCompany: 'Years In Company',
  yearsInRole: 'Years In Role',
  manager: 'Manager',
  photoUrl: 'Photo URL',
  skills: 'Skills (comma separated)',
  certifications: 'Certifications (comma separated)',
  education: 'Education',
  lastPromotionDate: 'Last Promotion Date',
  personality: 'Personality (DISC)',
  leadershipType: 'Leadership Type',
  email: 'Email',
  criticalPosition: 'Critical Position',
  iq: 'IQ',
  capability: 'Capability',
  // Competency aspects — new CSV uses [KOMPETENSI], old used [CAPABILITY]
  // legacy fallbacks ensure both schemas work
  competencyAdaptability: { primary: '[KOMPETENSI] Agility and Adaptability', legacy: '[CAPABILITY] Adaptability' },
  competencyBuildingCustomerLoyalty: { primary: '[KOMPETENSI] Customer Focus', legacy: '[CAPABILITY] Building Customer Loyalty' },
  competencyBuildingPositiveWorkingRelationships: { primary: '[KOMPETENSI] Building Strategic Partnership', legacy: '[CAPABILITY] Building Positive Working Relationships' },
  competencyCoaching: { primary: '[KOMPETENSI] Developing Organizational Capabilities', legacy: '[CAPABILITY] Coaching' },
  competencyContinuousImprovement: { primary: '[KOMPETENSI] Optimizing Work Process', legacy: '[CAPABILITY] Continuous Improvement' },
  competencyDriveForResult: { primary: '[KOMPETENSI] Driving Execution', legacy: '[CAPABILITY] Drive For Result' },
  competencyLeadingTeams: { primary: '[KOMPETENSI] Leading Change', legacy: '[CAPABILITY] Leading Teams' },
  competencyPlanningAndOrganizing: { primary: '[KOMPETENSI] Strategic Orientation', legacy: '[CAPABILITY] Planning and Organizing' },
  // Score fields — new CSV uses short names, old used bracketed names
  readinessScore: 'Score',
  readinessHAV: 'Readiness',
  usia: '[Readiness] Usia',
  readinessRiskHeat: '[Readiness] Risk Heat',
  engagementScore: 'Commitment',
  performanceScore: 'Performance',
  potensiScore: '[Potensi] Score',
} as const;

type HeaderVariant = { primary: string; legacy?: string };

function readHeader(row: Record<string, string>, variant: HeaderVariant): string | undefined {
  const primary = row[variant.primary];
  if (primary !== undefined && primary !== '') return primary;
  if (variant.legacy) {
    const legacy = row[variant.legacy];
    if (legacy !== undefined && legacy !== '') return legacy;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Mapping 10 kompetensi CSV → 10 field aspect di interface `Employee`.
// CSV memakai taxonomy yang berbeda — pasangan dipilih berdasarkan kemiripan
// makna terdekat agar nilai numerik bisa langsung dipakai oleh UI yang ada
// tanpa mengubah skema kolom.
// ---------------------------------------------------------------------------
const COMPETENCY_TO_ASPECT_FIELD: Array<{ header: HeaderVariant; aspectKey: keyof Employee }> = [
  { header: CSV_HEADERS.competencyAdaptability, aspectKey: 'adaptability' },
  { header: CSV_HEADERS.competencyBuildingCustomerLoyalty, aspectKey: 'teamwork' },
  { header: CSV_HEADERS.competencyBuildingPositiveWorkingRelationships, aspectKey: 'decisionMaking' },
  { header: CSV_HEADERS.competencyCoaching, aspectKey: 'innovation' },
  { header: CSV_HEADERS.competencyContinuousImprovement, aspectKey: 'communication' },
  { header: CSV_HEADERS.competencyDriveForResult, aspectKey: 'leadership' },
  { header: CSV_HEADERS.competencyLeadingTeams, aspectKey: 'problemSolving' },
  { header: CSV_HEADERS.competencyPlanningAndOrganizing, aspectKey: 'analyticalSkills' },
  { header: CSV_HEADERS.capability, aspectKey: 'competencyMatch' },
];

// ---------------------------------------------------------------------------
// Util parser CSV minimal yang mendukung quoted fields & koma di dalam quote.
// Cukup untuk format spreadsheet umum; tidak ditujukan untuk semua edge case
// CSV (newline di dalam field, dsb.). Kalau dataset bertambah kompleks,
// pertimbangkan migrasi ke library seperti papaparse.
// ---------------------------------------------------------------------------
function splitCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        // escape: dua tanda kutip berurutan = literal "
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }
  fields.push(current);
  return fields;
}

function parseCsvRows(text: string): Record<string, string>[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  const headers = splitCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] ?? '').trim();
    });
    return row;
  });
}

// ---------------------------------------------------------------------------
// Helpers konversi tipe & turunan
// ---------------------------------------------------------------------------
function parseNumber(raw: string | undefined): number | undefined {
  if (raw === undefined || raw === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function deriveLevel(position: string): string {
  const p = position.toLowerCase();
  if (!position) return '';
  if (
    p === 'ceo' ||
    p.includes('chief') ||
    p.includes('director') ||
    p === 'cto' ||
    p === 'cfo' ||
    p === 'coo' ||
    p === 'cmo'
  ) {
    return 'C-Level';
  }
  if (p.startsWith('senior ') || p.includes(' senior ') || p.endsWith(' senior')) return 'Senior';
  if (p.startsWith('junior ') || p.includes(' junior ') || p.endsWith(' junior')) return 'Junior';
  if (p.includes('manager')) return 'Manager';
  if (
    p.includes('associate') ||
    p.includes('admin') ||
    p.includes('staff') ||
    p.includes('support')
  ) {
    return 'Junior';
  }
  return 'Mid';
}

function deriveFlightRisk(engagement: number | undefined): 'Low' | 'Medium' | 'High' {
  if (engagement === undefined) return 'Medium';
  if (engagement < 60) return 'High';
  if (engagement < 80) return 'Medium';
  return 'Low';
}

function deriveReadinessLevel(performance?: number, potential?: number): number {
  const values = [performance, potential].filter((v): v is number => typeof v === 'number');
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

function derivePromotionReadiness(
  performance?: number,
  potential?: number
): 'Not Ready' | 'Ready in 1-2 years' | 'Ready Now' {
  const score = deriveReadinessLevel(performance, potential);
  if (score >= 80) return 'Ready Now';
  if (score >= 60) return 'Ready in 1-2 years';
  return 'Not Ready';
}

function deriveAssessmentScore(competencies: number[]): number {
  if (competencies.length === 0) return 0;
  // 1–5 → 20–100 skala
  const avg = competencies.reduce((sum, v) => sum + v, 0) / competencies.length;
  return Math.round(avg * 20);
}

function generateEmployeeId(rawId: string): string {
  const numeric = rawId.replace(/[^0-9]/g, '');
  if (!numeric) return rawId;
  return `EMP${numeric.padStart(3, '0')}`;
}

const AVATAR_FEMALE = '/avatars/female.jpg';
const AVATAR_MALE   = '/avatars/male.jpg';

function buildPhotoUrl(name: string, fallback?: string, gender?: string, pid?: string): string {
  if (fallback && fallback.trim()) return fallback.trim();
  // Per-person WC photo keyed by canonical p-id (p01.png..p24.png).
  const id = (pid ?? '').trim();
  if (/^p\d+$/i.test(id)) return `/avatars/employee/${id.toLowerCase()}.png`;
  const g = (gender ?? '').trim().toLowerCase();
  if (g === 'perempuan') return AVATAR_FEMALE;
  if (g === 'laki-laki') return AVATAR_MALE;
  return AVATAR_MALE;
}

function splitCommaList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// ---------------------------------------------------------------------------
// CSV row → Employee
// ---------------------------------------------------------------------------
function rowToEmployee(row: Record<string, string>): Employee {
  const name = row[CSV_HEADERS.name] ?? '';
  const position = row[CSV_HEADERS.position] ?? '';
  const department = row[CSV_HEADERS.department] ?? '';
  // Field "Level" di CSV sebenarnya berisi atasan langsung (mis. "CEO",
  // "Chief Business Officer"). Kita pakai untuk `manager`, sementara `level`
  // (career grade) diturunkan dari posisi.
  const csvLevelAsManager = row[CSV_HEADERS.level] ?? '';
  const explicitManager = row[CSV_HEADERS.manager] ?? '';
  const manager = explicitManager || csvLevelAsManager || '';

  const performance = parseNumber(row[CSV_HEADERS.performanceScore]);
  const potential = parseNumber(row[CSV_HEADERS.potensiScore]);
  const engagement = parseNumber(row[CSV_HEADERS.engagementScore]);

  const aspectFields: Partial<
    Pick<
      Employee,
      | 'leadership'
      | 'communication'
      | 'problemSolving'
      | 'teamwork'
      | 'adaptability'
      | 'strategicThinking'
      | 'decisionMaking'
      | 'innovation'
      | 'analyticalSkills'
      | 'accountability'
    >
  > = {};
  const competencyValues: number[] = [];
  for (const { header, aspectKey } of COMPETENCY_TO_ASPECT_FIELD) {
    const raw = readHeader(row, header);
    const value = parseNumber(raw);
    if (value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (aspectFields as any)[aspectKey] = value;
      competencyValues.push(value);
    }
  }

  // --- Derive scores from grouped columns when direct columns are empty ---
  // The IASS CSV leaves Score/Capability/Commitment/Performance/Readiness empty
  // for most rows; the real signal is in [KOMPETENSI] / [ENGAGEMENT] / [LEADERSHIP PROFILE]
  // groups (1-5 scale per item) and [ENGAGEMENT] presen_kecocokan (0-1 fit ratio).
  // Columns to exclude from 1–5 scale averages (percentage/ratio columns)
  const EXCLUDE_FROM_AVG = new Set([
    '[KOMPETENSI] Persentase Kecocokan',
    '[ENGAGEMENT] presen_kecocokan',
    '[ENGAGEMENT] hasil_rekomendasi',
  ]);

  const groupAverage = (prefix: string): number | undefined => {
    const values = Object.keys(row)
      .filter((k) => k.startsWith(prefix) && !EXCLUDE_FROM_AVG.has(k))
      .map((k) => parseNumber(row[k]))
      .filter((v): v is number => typeof v === 'number' && v <= 5);
    if (values.length === 0) return undefined;
    return values.reduce((s, v) => s + v, 0) / values.length;
  };

  const kompetensiAvg = groupAverage('[KOMPETENSI]');         // 1-5
  const heroesAvg = groupAverage('[ENGAGEMENT]');                 // 1-5 (presen_kecocokan 0-1 also included; filtered below)
  // Recompute heroes avg excluding presen_kecocokan / hasil_rekomendasi (non 1-5 items)
  const heroesItems = Object.keys(row)
    .filter((k) => k.startsWith('[ENGAGEMENT]') && k !== '[ENGAGEMENT] presen_kecocokan' && k !== '[ENGAGEMENT] hasil_rekomendasi')
    .map((k) => parseNumber(row[k]))
    .filter((v): v is number => typeof v === 'number');
  const heroesCleanAvg = heroesItems.length > 0
    ? heroesItems.reduce((s, v) => s + v, 0) / heroesItems.length
    : heroesAvg;
  const leadershipAvg = groupAverage('[LEADERSHIP PROFILE]'); // 1-5
  const presenKecocokan = parseNumber(row['[ENGAGEMENT] presen_kecocokan']); // 0-1
  const hasilRekomendasi = (row['[ENGAGEMENT] hasil_rekomendasi'] || '').trim();

  // Convert 1-5 averages → 0-100 scores so the UI's percent-based widgets work.
  const to100 = (v: number | undefined) =>
    v === undefined ? undefined : Math.round(v * 20);

  // Direct columns first; fall back to derived values.
  const competencyMatch =
    parseNumber(row[CSV_HEADERS.capability]) ?? to100(kompetensiAvg);

  const yearsInCompany = parseNumber(row[CSV_HEADERS.yearsInCompany]) ?? 0;
  const yearsInRole = parseNumber(row[CSV_HEADERS.yearsInRole]) ?? 0;

  const criticalPositionRaw = row[CSV_HEADERS.criticalPosition] ?? '';
  const iq = parseNumber(row[CSV_HEADERS.iq]);

  // Readiness score: prefer direct "Score" column, else presen_kecocokan × 100.
  const readinessScore =
    parseNumber(row[CSV_HEADERS.readinessScore]) ??
    (presenKecocokan !== undefined ? Math.round(presenKecocokan * 100) : undefined);

  // Readiness HAV: prefer direct "Readiness" column, else hasil_rekomendasi.
  const readinessHAV =
    (row[CSV_HEADERS.readinessHAV] || '').trim() ||
    hasilRekomendasi ||
    undefined;
  const usia = parseNumber(row[CSV_HEADERS.usia]);
  const readinessRiskHeat = row[CSV_HEADERS.readinessRiskHeat] || undefined;

  // Override engagement/performance/potential when direct columns are empty.
  const engagementFinal =
    engagement ?? to100(heroesCleanAvg) ?? 0;
  const performanceFinal =
    performance ?? to100(leadershipAvg) ?? 0;
  const potentialFinal =
    potential ?? to100(kompetensiAvg) ?? 0;

  return {
    id: generateEmployeeId(row[CSV_HEADERS.employeeId] ?? name),
    name,
    role: position,
    department,
    level: deriveLevel(position),
    performanceRating: performanceFinal,
    potentialRating: potentialFinal,
    yearsInCompany,
    yearsInRole,
    timeInRole: Math.round(yearsInRole * 12),
    skills: splitCommaList(row[CSV_HEADERS.skills]),
    certifications: splitCommaList(row[CSV_HEADERS.certifications]),
    education: row[CSV_HEADERS.education] ?? '',
    flightRisk: deriveFlightRisk(engagementFinal),
    promotionReadiness: derivePromotionReadiness(performanceFinal, potentialFinal),
    readinessLevel: deriveReadinessLevel(performanceFinal, potentialFinal),
    engagementScore: engagementFinal,
    assessmentScore: deriveAssessmentScore(competencyValues),
    competencyMatch,
    salary: 0,
    lastPromotionDate: row[CSV_HEADERS.lastPromotionDate] ?? '',
    criticalRole: criticalPositionRaw.toLowerCase() === 'yes',
    successorIdentified: false,
    manager,
    photo: buildPhotoUrl(name, row[CSV_HEADERS.photoUrl], row['Gender'], row[CSV_HEADERS.employeeId]),
    performanceRatingDate: performanceFinal > 0 ? '2026-04-01' : undefined,
    potentialRatingDate: potentialFinal > 0 ? '2026-04-01' : undefined,
    engagementScoreDate: engagementFinal > 0 ? '2026-04-01' : undefined,
    personality: row[CSV_HEADERS.personality] || undefined,
    leadershipType: row[CSV_HEADERS.leadershipType] || undefined,
    iqScore: iq,
    readinessScore,
    readinessHAV,
    usia,
    readinessRiskHeat,
    csvFields: { ...row },
    ...aspectFields,
  };
}

// Parse the first line of the CSV once to expose the raw header list.
// This lets the UI auto-discover every column in the source data.
function parseCsvHeaders(text: string): string[] {
  const firstLine = text.split(/\r?\n/).find((l) => l.trim().length > 0);
  if (!firstLine) return [];
  return splitCsvLine(firstLine).map((h) => h.trim()).filter((h) => h.length > 0);
}

export const CSV_RAW_HEADERS: string[] = parseCsvHeaders(csvText);

// ---------------------------------------------------------------------------
// Eksekusi parsing sekali saat modul dimuat (data hardcoded efektif).
// Hanya baris dengan "Shown in TDP" = "TRUE" yang ditampilkan.
// ---------------------------------------------------------------------------

// Multi-team assignments: beberapa employee memiliki lebih dari 1 tim.
// Key = Employee ID (format EMP + nomor)
const MULTI_TEAM: Record<string, string[]> = {
  'EMP190701005433': ['Design', 'Research'],               // FITRIANI SIMATUPANG
  'EMP200901007440': ['Sales', 'Partnerships'],            // MAULANA ARIF H
  'EMP241001011401': ['Finance', 'Operations'],            // RADEN LUGINA
  'EMP241002007660': ['Engineering', 'Platform', 'DevOps'], // LIYAH SYARI KHALIFAH
  'EMP250302993168': ['HR', 'Talent Acquisition'],         // ADI MANDALA SUMINTERDJA
};

export const tdpEmployees: Employee[] = parseCsvRows(csvText)
  .filter((row) => row['Shown in TDP']?.trim().toUpperCase() === 'TRUE')
  .map(rowToEmployee)
  .map((emp) => {
    const teams = MULTI_TEAM[emp.id];
    if (teams) {
      return { ...emp, department: teams[0], departments: teams };
    }
    return emp;
  });
