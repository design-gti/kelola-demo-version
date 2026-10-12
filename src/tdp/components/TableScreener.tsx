// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { ambilDataTambahan } from '../lib/dataTambahanTdp';
import { bisaDibobotTambahan, ke100Tambahan, keYaTidak, sebagaiTipeTambahan, terisi } from '@/lib/dataTambahan';
import React, { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router';
import { mockEmployees, Employee } from '../data/mockEmployees';
import { idKaryawanPenerus } from '../data/tautanPenerus';
import { tdpEmployees, CSV_RAW_HEADERS } from '../data/tdpEmployees';
import { getProfileUrl } from '../data/profileLinks';
import { hitungSkor3C } from '../lib/skor3C';
import {
  BOBOT_BAWAAN, BOBOT_LANGKAH, BOBOT_MAKS, BOBOT_MIN, csvKe100, rapikanBobot, skorAkhir, skorCluster,
} from '../lib/pembobotan';
/*
  Komponen design system. `Button` dan `TextInput` diberi awalan `DS` karena berkas
  ini MASIH memakai `Button`/`Input` shadcn lokal di dalam dialog-dialognya (filter,
  simpan preset, unggah) — 31 pemakaian yang belum dikonversi. Awalan itu membuat
  perbedaannya kelihatan di tempat pemakaian, bukan tersembunyi di baris import.
*/
import {
  ActionIcon as DSActionIcon,
  Anchor as DSAnchor,
  Button as DSButton,
  Checkbox as DSCheckbox,
  Modal,
  Popover,
  Select,
  TextInput as DSTextInput,
  Tooltip,
} from '@talentlytica/prodigy';
/*
  ⚠️ `Text` dari `@mantine/core`, BUKAN Prodigy — Prodigy tidak mengekspornya
  (begitu juga `Title` dan `Group`). Mengimpornya dari Prodigy membuat identifiernya
  jatuh ke konstruktor DOM global dan seluruh layar mati; berkas ini `@ts-nocheck`,
  jadi tak ada yang menahannya. Lihat catatan yang sama di `Comparison.tsx`.
*/
import { Group, Text } from '@mantine/core';
import { Tag } from '@/components/ui/Tag';
import { SelUser } from '@/components/ui/SelUser';
import * as XLSX from 'xlsx';
import {
  Filter,
  ArrowUpDown,
  Search,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
  Columns3,
  Save,
  Bookmark,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileCheck,
  Upload,
  Download,
  Table2,
  CreditCard,
  Award,
  Medal,
  Users,
  Info,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Check,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Layers,
  Pin,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { Label } from './ui/label';
import { filterFigmaProps } from './ui/utils';
import EmployeeDetailModal from './EmployeeDetailModal';
import VisibleColumnsDialog from './VisibleColumnsDialog';
import svgPaths from '../imports/svg-vfm09kdtkj';
import visibleColumnsSvgPaths from '../imports/svg-uatce53kpn';

// Bumped to v11: force reset to hardcoded mockEmployees with dummy Tim assignments.
const EMPLOYEE_UPLOAD_DRAFT_KEY = 'employeeUploadDraft.v11';
const EMPLOYEE_UPLOAD_FILE_NAME_KEY = 'employeeUploadDraftFileName.v10';
const VISIBLE_COLUMNS_STORAGE_KEY = 'visibleColumns.v8';
/*
  Versi bawaan kolom. `currentTableState` yang tersimpan hanya dipakai kalau versinya
  masih sama; begitu angka ini naik, pilihan kolom kembali ke bawaan.

  Dinaikkan ke `v7-position-title`: kolom `Position Title` kini tampil secara bawaan
  (menggantikan `role` yang isinya departemen), dan tanpa kenaikan ini ia tak akan pernah
  sampai ke orang yang sudah membuka TDP sesudah `v6`.

  Sebelumnya `v6-competency-score`: kolom `[GENERAL]` / `[TECHNICAL]` baru ada. Pemulihan
  `visibleColumns` dari `currentTableState` mengganti seluruh himpunan apa adanya — ia tak
  menggabungkan kolom ber-`defaultVisible` yang belum pernah dilihatnya. Tanpa kenaikan ini
  setiap orang yang pernah membuka TDP akan mendapati Competency Score tidak tercentang,
  tanpa petunjuk kenapa.

  Harganya: pilihan kolom yang pernah diatur sendiri ikut kembali ke bawaan. Filter, urutan,
  dan bobot tidak terpengaruh — dan preset yang tersimpan tetap utuh.
*/
const COLUMN_DEFAULTS_VERSION = 'v8-potensi-tanpa-kompetensi';

const LEGACY_DRAFT_KEYS = [
  'employeeUploadDraft', 'employeeUploadDraft.v2', 'employeeUploadDraft.v3', 'employeeUploadDraft.v4', 'employeeUploadDraft.v5', 'employeeUploadDraft.v6', 'employeeUploadDraft.v7', 'employeeUploadDraft.v8', 'employeeUploadDraft.v9', 'employeeUploadDraft.v10',
  'employeeUploadDraftFileName', 'employeeUploadDraftFileName.v2', 'employeeUploadDraftFileName.v3', 'employeeUploadDraftFileName.v4', 'employeeUploadDraftFileName.v5', 'employeeUploadDraftFileName.v6', 'employeeUploadDraftFileName.v7', 'employeeUploadDraftFileName.v8', 'employeeUploadDraftFileName.v9',
  'visibleColumns', 'visibleColumns.v2', 'visibleColumns.v3', 'visibleColumns.v4', 'visibleColumns.v5', 'visibleColumns.v6', 'visibleColumns.v7',
];

const purgeLegacyCache = (): void => {
  try { LEGACY_DRAFT_KEYS.forEach((k) => localStorage.removeItem(k)); } catch {}
};

const loadEmployeeDraft = (): Employee[] => {
  purgeLegacyCache();
  // Always use fresh data from CSV — bypass localStorage cache
  return tdpEmployees;
};

/**
 * Penanda "belum ada data" — `Tag`, komponen pil yang sama dengan Beranda, iProfile,
 * dan tampilan Compare.
 *
 * Dulu `<span>` yang dibentuk mirip pil sendiri: `borderRadius: 999`, padding
 * `2px 8px`, `fontSize: 10`, `#fff8f0`/`#FD9F28`. Enam nilai yang tak satu pun
 * token — dan 10px tidak ada di skala huruf theme sama sekali. Salinan yang sama
 * persis sudah diganti di `Comparison.tsx`; ini pasangannya.
 */
const NoDataChip = () => <Tag warnaDS="warning">No Data</Tag>;

// Safe div wrapper that filters Figma inspector props
const SafeDiv = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return <div ref={ref} {...filterFigmaProps(props)}>{children}</div>;
  }
);
SafeDiv.displayName = 'SafeDiv';

type SortField = keyof Employee | 'ranking' | 'competencyScore' | 'commitmentScore' | 'contributionScore' | 'aspectScore' | null;
type SortDirection = 'asc' | 'desc';
type DecisionStatus = 'promotion' | 'salary-review' | 'bonus' | 'layoff';
type FilterOperator = '>' | '>=' | '<' | '<=' | '=' | 'between' | null;

interface FilterCondition {
  operator: FilterOperator;
  value: number | null;
  value2?: number | null; // untuk operator 'between'
}

// New filter system types
type FilterFieldType = 'categorical' | 'numerical' | 'boolean' | 'employee-selector';
type MatchMode = 'all' | 'any';

interface ActiveFilterCondition {
  id: string;
  field: string | null;
  fieldType: FilterFieldType | null;
  // For categorical/boolean
  selectedValues?: string[];
  // For numerical
  operator?: FilterOperator;
  value?: number | null;
  value2?: number | null;
}

interface SavedFilter {
  id: string;
  name: string;
  conditions: ActiveFilterCondition[];
  matchMode: MatchMode;
  createdAt: string;
}

interface NumericRange {
  min: number;
  max: number;
}

// Map of numerical columns that can be used for ranking
const numericalColumns: { key: keyof Employee; label: string; max: number }[] = [
  { key: 'performanceRating', label: '[Performance] Score', max: 100 },
  { key: 'potentialRating', label: '[Potensi] Score', max: 100 },
  { key: 'engagementScore', label: '[Engagement] Score', max: 100 },
  // [CAPABILITY] aspects can also be used for ranking
  { key: 'leadership', label: '[CAPABILITY] Leadership', max: 5 },
  { key: 'communication', label: '[CAPABILITY] Influencing', max: 5 },
  { key: 'analyticalSkills', label: '[CAPABILITY] Analytical Thinking', max: 5 },
  { key: 'teamwork', label: '[CAPABILITY] Collaboration', max: 5 },
];

interface Filters {
  department: string[];
  level: string[];
  performanceRating: FilterCondition;
  potentialRating: FilterCondition;
  engagementScore: FilterCondition;
  searchTerm: string;
}

interface FilterPreset {
  id: string;
  name: string;
  filters: Filters;
  visibleColumns: Set<string>;
  /** Kolom variable yang menggantikan tampilan Total Score per cluster (nama kategori → key kolom) */
  clusterTotalSlotOverride?: Record<string, string>;
}

type ColumnKey = keyof Employee | 'competencyScore' | 'commitmentScore' | 'contributionScore' | 'aspectScore';

interface ColumnConfig {
  key: ColumnKey;
  label: string;
  sortable: boolean;
  defaultVisible: boolean;
  isCustom?: boolean;
  customType?: 'text' | 'numerical' | 'categorical' | 'attachment' | 'like-dislike';
  /** Kolom dari Profile Data (data tambahan): hanya-baca; tipe aslinya di `tipeData`. */
  dariProfileData?: boolean;
  tipeData?: string;
  categories?: string[]; // For categorical columns
  cluster?: 'competency' | 'commitment' | 'contribution' | 'aspect' | 'custom'; // For custom columns
  clusterName?: string; // Original cluster name from uploaded XLSX header
}

// ---------- Typed Employee-field columns (the 8 KOMPETENSI we already map + scores) ----------
// These have first-class fields on the Employee record; they are NOT auto-generated.
const typedColumnDefinitions: ColumnConfig[] = [
  // Basic Info (typed)
  { key: 'name', label: 'Employee', sortable: true, defaultVisible: true },
  /*
    ⚠️ `role` ISINYA DEPARTEMEN, bukan jabatan.

    Ia dibaca dari kolom CSV `Position`, yang `buildTdpCsv` isi dengan `r.job_name` —
    dan `job_name` di kelola adalah departemen ("Teknologi", "Operasional"): 8 nilai
    untuk 106 orang. Jabatan yang sesungguhnya ada di kolom `Position Title`
    ("Head of Engineering", …), 106 nilai.

    Dulu kolom ini berlabel "Position", jadi memfilter "Position" memberi daftar
    departemen — orang memilih "Teknologi" ketika yang dicarinya "Head of Engineering".
    Labelnya kini menyebut isinya yang sebenarnya, dan `Position Title` di bawah yang
    memakai nama "Position".

    Yang TIDAK diubah: sumber datanya. `role` dipakai `deriveLevel` dan beberapa tempat
    lain; menukar isinya berdampak jauh melewati satu label.

    Tidak lagi tampil secara bawaan: tempatnya di daftar medan filter digantikan
    `Position Title`. Yang dicari orang saat memfilter "Position" adalah jabatan, bukan
    delapan nama departemen. Kolomnya tetap ada dan bisa dinyalakan lagi lewat Data
    Visibility — `medanFilter` hanya menawarkan kolom yang sedang tampil, jadi
    menyalakannya membuatnya kembali bisa difilter.
  */
  { key: 'role', label: 'Department', sortable: true, defaultVisible: false },
  { key: 'department', label: 'Tim', sortable: true, defaultVisible: false },
  { key: 'level', label: 'Level', sortable: true, defaultVisible: false },
  // Delapan kolom KOMPETENSI yang dipatok DIBUANG.
  //
  // Di demo, kolom-kolom itu (Agility and Adaptability, Customer Focus, …) terisi karena
  // CSV-nya memang punya header dengan nama persis itu. Aspek tersebut TIDAK ADA di
  // kelola; yang ada adalah Collaboration, Commitment to Quality, Delegation, dan
  // seterusnya. Dipertahankan, kedelapannya hanya menghasilkan tabel penuh 'No Data'.
  //
  // Kolom aspek kini dihasilkan otomatis dari header CSV (autoCsvColumnDefinitions),
  // jadi tenant dengan daftar aspek berbeda pun langsung mendapat kolomnya sendiri —
  // sesuatu yang daftar yang dipatok tak akan pernah bisa lakukan.
  // Score fields (typed, derived in tdpEmployees.ts)
  // Capability = rata-rata butir General+Technical (rumus kartu Compare), BUKAN persen kecocokan terhadap
  // standar jabatan di iProfile — namanya dibedakan supaya dua ukuran itu tak tertukar.
  { key: 'competencyMatch', label: 'Competency Score (Current Job)', sortable: true, defaultVisible: true },
  { key: 'engagementScore', label: 'Engagement', sortable: true, defaultVisible: false },
  { key: 'performanceRating', label: 'Performance', sortable: true, defaultVisible: true },
  { key: 'potentialRating', label: 'Potensi', sortable: true, defaultVisible: false },
];

// CSV headers ALREADY represented by typedColumnDefinitions → skip when auto-generating.
const COVERED_CSV_HEADERS = new Set<string>([
  'Name', 'Position', 'Tim', 'Level',
  // (kolom [KOMPETENSI] tak lagi dicakup kolom bertipe — lihat catatan di atas)
  // Filter / rendering helpers — not user-facing columns
  'Shown in TDP', 'Photo URL',
  // Aggregate typed columns — superseded by cluster averages
  // 'IQ' TIDAK lagi di sini: Vismap menawarkannya sebagai variabel, jadi TDP juga harus.
  'Capability',
  // Performance / Engagement / Potensi sudah punya kolom bertipe (di bawah) dari sumber yang sama —
  // menawarkan keduanya membuat data yang sama bisa dipilih dua kali dan dibobot ganda.
  'Performance', 'Engagement', 'Potensi',
]);

// Map a raw CSV header → cluster used by VisibleColumnsDialog.
// Mirrors the CSV's own column-grouping:
//   [KOMPETENSI]  → aspect (sub-section under Capability)
//   [GENERAL]     → competencyGeneral   (sub-section under Competency Score)
//   [TECHNICAL]   → competencyTechnical (sub-section under Competency Score)
//   [ENGAGEMENT]      → commitment
//   [LEADERSHIP PROFILE] → contribution
//   Capability, IQ → capability (uses 'competency' cluster, main Capability section)
//   Commitment    → commitment (main section, not aspect)
//   Contribution, Performance → contribution
//   Score         → potency
//   Readiness     → readiness
//   everything else → basic
function clusterFromCsvHeader(h: string): ColumnConfig['cluster'] | undefined {
  if (h.startsWith('[KOMPETENSI]')) return 'aspect';
  /*
    Competency Score — aspek yang dibaca kartu Competency di iProfile. Harus sama persis
    dengan `clusterFromCsvHeader` di `Comparison.tsx`: dua berkas ini membangun definisi
    kolomnya sendiri-sendiri, dan kolom yang hanya dikenali salah satunya akan muncul di
    satu view saja.
  */
  if (h.startsWith('[GENERAL]')) return 'competencyGeneral' as ColumnConfig['cluster'];
  if (h.startsWith('[TECHNICAL]')) return 'competencyTechnical' as ColumnConfig['cluster'];
  // Aspek potensi per butir — harus sama persis dengan `Comparison.tsx`; lihat catatan
  // di sana. Kolom yang hanya dikenali salah satunya akan muncul di satu view saja.
  if (h.startsWith('[POTENSI]')) return 'potency' as ColumnConfig['cluster'];
  if (h.startsWith('[ENGAGEMENT]')) return 'commitment' as ColumnConfig['cluster'];
  if (h.startsWith('[LEADERSHIP PROFILE]')) return 'contribution' as ColumnConfig['cluster'];
  if (h === 'Capability') return 'competency' as ColumnConfig['cluster'];
  if (h === 'Commitment' || h === 'Engagement') return 'commitment' as ColumnConfig['cluster'];
  if (h === 'Contribution' || h === 'Performance') return 'contribution' as ColumnConfig['cluster'];
  if (h === 'Score' || h === 'Potensi') return 'potency' as ColumnConfig['cluster'];
  if (h === 'Readiness') return 'readiness' as ColumnConfig['cluster'];
  if (h.startsWith('[LEADERSHIP STYLE]')) return 'leadershipStyle' as ColumnConfig['cluster'];
  if (h === 'Years In Company' || h === 'Years In Role' || h === 'Last Promotion Date' || h === 'Education')
    return 'careerHistory' as ColumnConfig['cluster'];
  return undefined; // Basic Info
}

/*
  Label yang tidak mengikuti nama headernya.

  `Position Title` adalah jabatan yang sesungguhnya, dan sesudah kolom `role` berganti
  label jadi "Department", dialah yang pantas menyandang nama "Position" — itu yang
  dicari orang saat memfilter.
*/
const LABEL_KOLOM_CSV: Record<string, string> = {
  'Position Title': 'Position',
};

// Strip a leading [BRACKET] prefix for the user-facing label.
function labelFromCsvHeader(h: string): string {
  return LABEL_KOLOM_CSV[h] ?? (h.replace(/^\[[^\]]+\]\s*/, '').trim() || h);
}

// Auto-generated CSV-backed column definitions — one per CSV header.
const autoCsvColumnDefinitions: ColumnConfig[] = CSV_RAW_HEADERS
  .filter((h) => h && !COVERED_CSV_HEADERS.has(h))
  .map((h) => ({
    key: `csv:${h}` as ColumnKey,
    label: labelFromCsvHeader(h),
    sortable: true,
    // Aspek tampil secara BAWAAN: ia isi utama layar ini, dan sebelumnya peran itu
    // dipegang delapan kolom yang dipatok. Tanpa ini tabelnya terbuka tanpa satu pun
    // kolom kompetensi.
    defaultVisible:
      h.startsWith('[LEADERSHIP STYLE]') ||
      h.startsWith('[GENERAL]') ||
      h.startsWith('[TECHNICAL]') ||
      h.startsWith('[POTENSI]') ||
      h === 'Personality (DISC)' ||
      // Jabatan sesungguhnya. Harus tampil supaya ia masuk daftar medan filter —
      // `medanFilter` hanya menawarkan kolom yang sedang tampil.
      h === 'Position Title',
    cluster: clusterFromCsvHeader(h),
  }));

const columnDefinitions: ColumnConfig[] = [
  ...typedColumnDefinitions,
  ...autoCsvColumnDefinitions,
];

// Derive display names for internal cluster IDs from CSV bracket prefixes.
// e.g. { aspect: 'KOMPETENSI', commitment: 'HEROES', contribution: 'LEADERSHIP PROFILE' }
/**
 * Ubah label yang HURUF BESAR SEMUA jadi kapital di awal kata.
 *
 * Salinan yang sama dengan `Comparison.tsx` — nama grup di header CSV ditulis huruf
 * besar semua (`[KOMPETENSI] …`) sementara label yang tidak datang dari CSV ditulis
 * dengan kapital awal ("Basic Information", "Ranking"). Di baris judul yang sama:
 * "KOMPETENSI" dan "CONTRIBUTION" berteriak di sebelah dua yang tidak.
 *
 * Diubah hanya kalau string itu tak punya satu pun huruf kecil, jadi label
 * bercampur besar-kecil dibiarkan. Singkatan yang berdiri sendiri ikut terkena
 * ("IQ" jadi "Iq"); tak ada grup semacam itu sekarang.
 */
function keKapitalAwal(teks: string): string {
  if (/[a-z]/.test(teks)) return teks;
  return teks.toLowerCase().replace(/(^|\s)(\S)/g, (_, spasi, huruf) => spasi + huruf.toUpperCase());
}

const CSV_CLUSTER_NAMES: Record<string, string> = (() => {
  const names: Record<string, string> = {};
  CSV_RAW_HEADERS.forEach((h) => {
    const m = h.match(/^\[([^\]]+)\]/);
    if (!m) return;
    const bracketGroup = keKapitalAwal(m[1]);
    const cluster = clusterFromCsvHeader(h) as string | undefined;
    if (cluster && !names[cluster]) names[cluster] = bracketGroup;
  });
  return names;
})();

// Predefined Column Presets for different Job Criteria contexts
const defaultColumnPresets = {
  generalCriteria: new Set([
    'name', 'role', 'department', 'level',
    'performanceRating', 'potentialRating', 'engagementScore',
    'competencyMatch', 'readinessHAV', 'adaptability', 'communication', 'leadership',
  ]),
  productDesigner: new Set([
    'name', 'role', 'department', 'level',
    'performanceRating', 'potentialRating',
    'innovation', 'communication', 'problemSolving', 'analyticalSkills', 'adaptability',
  ]),
  engineer: new Set([
    'name', 'role', 'department', 'level',
    'performanceRating', 'potentialRating',
    'problemSolving', 'analyticalSkills', 'adaptability', 'innovation', 'decisionMaking',
  ]),
  sales: new Set([
    'name', 'role', 'department', 'level',
    'performanceRating', 'potentialRating', 'engagementScore',
    'communication', 'teamwork', 'adaptability', 'decisionMaking',
  ]),
  marketing: new Set([
    'name', 'role', 'department', 'level',
    'performanceRating', 'potentialRating',
    'communication', 'innovation', 'analyticalSkills', 'teamwork', 'adaptability',
  ]),
  operationsManager: new Set([
    'name', 'role', 'department', 'level',
    'performanceRating', 'potentialRating',
    'leadership', 'decisionMaking', 'problemSolving', 'teamwork', 'communication',
  ]),
  finance: new Set([
    'name', 'role', 'department', 'level',
    'performanceRating', 'potentialRating',
    'analyticalSkills', 'problemSolving', 'decisionMaking', 'competencyMatch',
  ]),
  hrPeopleOps: new Set([
    'name', 'role', 'department', 'level',
    'performanceRating', 'potentialRating', 'engagementScore',
    'communication', 'teamwork', 'leadership', 'adaptability',
  ]),
  businessAnalyst: new Set([
    'name', 'role', 'department', 'level',
    'performanceRating', 'potentialRating',
    'analyticalSkills', 'communication', 'problemSolving', 'adaptability', 'decisionMaking',
  ]),
  dataAnalyst: new Set([
    'name', 'role', 'department', 'level',
    'performanceRating', 'potentialRating',
    'analyticalSkills', 'problemSolving', 'innovation', 'adaptability', 'decisionMaking',
  ]),
};

// Cluster Category Definitions — category names derived from CSV bracket prefixes at runtime.
// CSV_CLUSTER_NAMES maps: aspect→'KOMPETENSI', commitment→'HEROES', contribution→'LEADERSHIP PROFILE', etc.
const CLUSTER_CATEGORIES = [
  {
    name: 'Basic Information',
    columns: ['name', 'role', 'department', 'level']
  },
  {
    // CSV bracket group: [KOMPETENSI] (or whatever bracket prefix maps to 'aspect')
    name: CSV_CLUSTER_NAMES['aspect'] ?? 'Capability',
    columns: [
      'adaptability', 'teamwork', 'decisionMaking', 'innovation', 'communication',
      'leadership', 'problemSolving', 'analyticalSkills', 'competencyMatch',
    ],
    totalScoreKey: 'competencyScore' as const,
  },
  /*
    Competency Score — dua kategori terpisah, sejajar dengan dua section di kartu Compare.
    Yang mengikat keduanya jadi satu grup adalah Data Visibility, bukan tabel ini.

    Tanpa `totalScoreKey`: skor total cluster dipakai untuk perangkingan, dan competency
    dari iProfile belum punya arti "total" yang disepakati. Menambahkannya berarti
    memunculkan angka yang tak seorang pun minta dan tak jelas dasar hitungnya.
  */
  {
    // CSV bracket group: [GENERAL]
    name: CSV_CLUSTER_NAMES['competencyGeneral'] ?? 'General',
    columns: [] as string[],
    totalScoreKey: 'generalScore' as const,
  },
  {
    // CSV bracket group: [TECHNICAL]
    name: CSV_CLUSTER_NAMES['competencyTechnical'] ?? 'Technical',
    columns: [] as string[],
    totalScoreKey: 'technicalScore' as const,
  },
  {
    // CSV bracket group: [ENGAGEMENT] (or whatever maps to 'commitment')
    name: CSV_CLUSTER_NAMES['commitment'] ?? 'Commitment',
    columns: ['engagementScore'],
    totalScoreKey: 'commitmentScore' as const
  },
  {
    // CSV bracket group: [LEADERSHIP PROFILE] (or whatever maps to 'contribution')
    name: CSV_CLUSTER_NAMES['contribution'] ?? 'Contribution',
    columns: ['performanceRating'],
    totalScoreKey: 'contributionScore' as const
  },
  {
    name: 'Potensi',
    columns: ['potentialRating'],
    totalScoreKey: 'aspectScore' as const
  },
  {
    name: CSV_CLUSTER_NAMES['leadershipStyle'] ?? 'Leadership Style',
    columns: [] as string[],
  }
];

// Field type mapping for new filter system
/*
  `fieldTypeMap` DIBUANG.

  Ia daftar 19 medan yang ditulis tangan, dipakai dropdown "Select field" lalu
  disaring `visibleColumns`. Penyaringnya benar niatnya tapi petanya salah isi: kolom
  yang benar-benar tampil hampir seluruhnya ber-kunci `csv:<header>` dan tak satu pun
  ada di peta itu, jadi dropdown-nya praktis kosong sementara tabelnya memajang
  puluhan kolom.

  Penggantinya `medanFilter` di dalam komponen — diturunkan dari kolom yang tampil,
  dengan tipe medan disimpulkan dari datanya.
*/

// Helper function to get column width
const getColumnWidth = (key: string): string => {
  const widthMap: Record<string, string> = {
    'name': 'min-w-[280px] w-[280px]',
    'role': 'min-w-[180px] w-[180px]',
    'department': 'min-w-[150px] w-[150px]',
    'level': 'min-w-[120px] w-[120px]',
    'performanceRating': 'min-w-[130px] w-[130px]',
    'potentialRating': 'min-w-[130px] w-[130px]',
    'engagementScore': 'min-w-[140px] w-[140px]',
    // [CAPABILITY] aspect columns
    'analyticalSkills': 'min-w-[150px] w-[150px]',
    'teamwork': 'min-w-[120px] w-[120px]',
    'decisionMaking': 'min-w-[150px] w-[150px]',
    'innovation': 'min-w-[120px] w-[120px]',
    'communication': 'min-w-[140px] w-[140px]',
    'leadership': 'min-w-[130px] w-[130px]',
    'problemSolving': 'min-w-[150px] w-[150px]',
    'adaptability': 'min-w-[130px] w-[130px]',
    'strategicThinking': 'min-w-[160px] w-[160px]',
    'competencyMatch': 'min-w-[140px] w-[140px]',
    'readinessHAV': 'min-w-[140px] w-[140px]',
    'usia': 'min-w-[100px] w-[100px]',
    'readinessRiskHeat': 'min-w-[130px] w-[130px]',
  };
  // Custom columns get default width of 160px (wider for editable input)
  return widthMap[key] || 'min-w-[160px] w-[160px]';
};

/** Nilai px konsisten dengan getColumnWidth — untuk grid header Basic Information tanpa bolong */
const getColumnWidthPx = (key: string): number => {
  const pxMap: Record<string, number> = {
    name: 280,
    role: 180,
    department: 150,
    level: 120,
    performanceRating: 130,
    potentialRating: 130,
    readinessLevel: 130,
    engagementScore: 140,
    flightRisk: 130,
    criticalRole: 120,
    timeInRole: 140,
    salary: 130,
    successorIdentified: 130,
    iqScore: 120,
    personality: 140,
    leadershipType: 160,
    leadership: 130,
    communication: 140,
    problemSolving: 150,
    teamwork: 120,
    adaptability: 130,
    strategicThinking: 160,
    decisionMaking: 150,
    innovation: 120,
    analyticalSkills: 150,
    accountability: 140,
    competencyScore: 120,
    commitmentScore: 120,
    contributionScore: 120,
    aspectScore: 120,
    generalScore: 120,
    technicalScore: 120,
    additionalScore: 120,
  };
  return pxMap[key] ?? 160;
};

const orderVisibleCategoryColumns = (
  category: { columns: string[] },
  visibleCols: ColumnConfig[]
): ColumnConfig[] =>
  category.columns
    .map((key) => visibleCols.find((col) => col.key === key))
    .filter((col): col is ColumnConfig => Boolean(col));

/** Nilai select "pakai skor cluster (default)" — bukan key kolom sungguhan */
const TOTAL_SCORE_SLOT_DEFAULT_VALUE = '__total_score_default__';

type CategoryWithClusterScore = {
  name: string;
  columns: string[];
  totalScoreKey?: string;
};

function getEffectiveTotalSlotColumnKey(
  category: CategoryWithClusterScore,
  slotOverride: Record<string, string | undefined>
): string | undefined {
  if (!category.totalScoreKey) return undefined;
  const sel = slotOverride[category.name];
  if (sel && category.columns.includes(sel)) return sel;
  return category.totalScoreKey;
}

function slotUsesAlternateColumn(
  category: CategoryWithClusterScore,
  slotOverride: Record<string, string | undefined>
): boolean {
  const slot = getEffectiveTotalSlotColumnKey(category, slotOverride);
  return Boolean(category.totalScoreKey && slot && slot !== category.totalScoreKey);
}

/** Kolom tengah cluster: menyembunyikan variable yang dipakai di slot Total Score agar tidak dobel */
const getGridColumnsForCategory = (
  category: CategoryWithClusterScore,
  visibleCols: ColumnConfig[],
  slotOverride: Record<string, string | undefined>
): ColumnConfig[] => {
  const base = orderVisibleCategoryColumns(category, visibleCols);
  if (!slotUsesAlternateColumn(category, slotOverride)) return base;
  const slot = getEffectiveTotalSlotColumnKey(category, slotOverride)!;
  return base.filter((col) => col.key !== slot);
};

interface TableScreenerProps {
  onToolbarRender?: (buttons: React.ReactNode) => void;
  onSharedToolbarRender?: (buttons: React.ReactNode) => void;
  /**
   * Id karyawan yang LOLOS filter, dikirim ke atas tiap kali berubah.
   *
   * ⚠️ Ada karena `localStorage` saja TIDAK cukup: menulis ke sana tidak memicu
   * render ulang di komponen lain. Tampilan Compare membacanya sekali saat dipasang
   * lalu tak pernah lagi — jadi memfilter di Table tidak pernah mengubah kartu di
   * Compare. Terukur: memilih dua karyawan membuat tabel jadi 2 baris sementara
   * Compare tetap 106 kartu.
   */
  onVisibleIdsChange?: (ids: string[]) => void;
  onSearchRender?: (search: React.ReactNode) => void;
  pinnedIds?: string[];
  onPinnedIdsChange?: (ids: string[]) => void;
}

const presetLabels: Record<keyof typeof defaultColumnPresets, string> = {
  generalCriteria: 'General',
  productDesigner: 'Product Designer',
  engineer: 'Engineer',
  sales: 'Sales',
  marketing: 'Marketing',
  operationsManager: 'Operations Manager',
  finance: 'Finance',
  hrPeopleOps: 'HR / People Ops',
  businessAnalyst: 'Business Analyst',
  dataAnalyst: 'Data Analyst',
};

export default function TableScreener({ onToolbarRender, onSharedToolbarRender, onSearchRender, onVisibleIdsChange, pinnedIds: pinnedIdsProp, onPinnedIdsChange }: TableScreenerProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sortField, setSortField] = useState<SortField>('performanceRating');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [hiddenEmployeeIds, setHiddenEmployeeIds] = useState<string[]>([]); // Hidden via "Hide" button
  const [showOnlyIds, setShowOnlyIds] = useState<string[] | null>(null);    // Show only via "Show Only" button
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]); // For employee filter
  // Use shared pin state from parent if provided, otherwise fall back to local state
  const [localPinnedIds, setLocalPinnedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('shared_pinned') || '[]'); } catch { return []; }
  });
  const pinnedTableIds = pinnedIdsProp ?? localPinnedIds;
  const setPinnedTableIds = (updater: string[] | ((prev: string[]) => string[])) => {
    const next = typeof updater === 'function' ? updater(pinnedTableIds) : updater;
    if (onPinnedIdsChange) onPinnedIdsChange(next);
    else setLocalPinnedIds(next);
  };
  const [isEmployeeSelectorOpen, setIsEmployeeSelectorOpen] = useState(false);
  const [employeeSelectorSearch, setEmployeeSelectorSearch] = useState(''); // Search in employee selector
  const [employeeFilterSearch, setEmployeeFilterSearch] = useState(''); // Search in filter dialog employee condition
  const [employeeDropdownOpenId, setEmployeeDropdownOpenId] = useState<string | null>(null); // Which condition's employee dropdown is open
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [employeeHeaderMenuOpen, setEmployeeHeaderMenuOpen] = useState(false);
  /** Nama kategori yang menu Total Score-nya terbuka; null berarti tak ada. */
  const [menuTotalScoreTerbuka, setMenuTotalScoreTerbuka] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('visibleColumns');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate: only include columns that exist in columnDefinitions
        // Exclude computed properties like 'score' and 'ranking'
        const validColumnsSet = new Set<string>(parsed.filter((key: string) =>
          key !== 'score' && key !== 'ranking' && columnDefinitions.some(col => col.key === key)
        ));
        // Merge in newly-added defaultVisible columns (e.g. LEADERSHIP STYLE) that weren't in old saved state
        const defaultVisible = new Set(columnDefinitions.filter(c => c.defaultVisible).map(c => c.key));
        defaultVisible.forEach(k => { if (!validColumnsSet.has(k)) validColumnsSet.add(k); });
        return validColumnsSet;
      } catch (e) {
        console.error('Failed to load visible columns', e);
      }
    }
    return new Set(columnDefinitions.filter(c => c.defaultVisible).map(c => c.key));
  });
  /** Variable kolom yang menggantikan tampilan Total Score per cluster (nama kategori → key kolom di cluster) */
  const [clusterTotalSlotOverride, setClusterTotalSlotOverride] = useState<Record<string, string>>({});
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [isPresetDialogOpen, setIsPresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [isPresetPopoverOpen, setIsPresetPopoverOpen] = useState(false);
  const [presetSearch, setPresetSearch] = useState('');
  /**
   * Nama preset yang sedang aktif; `null` berarti belum ada yang dipilih.
   *
   * Dipegang DI SINI, bukan dinaikkan ke `Screener`, karena yang menampilkannya
   * adalah tombol Presets di berkas ini. Sebelumnya nama itu dikirim ke atas lewat
   * `onPresetChange` untuk mengisi judul halaman "General" / "<nama> Criteria" —
   * satu baris judul tersendiri yang menyebut hal yang sama dengan tombolnya.
   */
  const [labelPresetAktif, setLabelPresetAktif] = useState<string | null>(() => {
    /*
      Ikut disimpan karena KOLOMNYA sudah disimpan (`visibleColumns` di localStorage).
      Tanpa ini, sesudah muat ulang kolomnya tetap kolom preset tadi sementara
      tombolnya kembali berbunyi "Presets" — tombol yang menyangkal keadaan yang
      sedang ditampilkannya sendiri.
    */
    try { return localStorage.getItem('tdpPresetAktif'); } catch { return null; }
  });

  const pilihPreset = (nama: string) => {
    setLabelPresetAktif(nama);
    try { localStorage.setItem('tdpPresetAktif', nama); } catch { /* mode privat */ }
  };
  
  // Add to Decision states
  const [isAddDecisionDialogOpen, setIsAddDecisionDialogOpen] = useState(false);
  const [decisionStatus, setDecisionStatus] = useState<DecisionStatus>('promotion');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionTimeline, setDecisionTimeline] = useState('');

  // Employee Detail Modal state
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<Employee | null>(null);
  const [isEmployeeDetailModalOpen, setIsEmployeeDetailModalOpen] = useState(false);

  // Refs for floating scrollbar
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const floatingScrollbarRef = useRef<HTMLDivElement>(null);
  const floatingScrollContentRef = useRef<HTMLDivElement>(null);

  /** Offset vertikal sticky baris ke-2 & ke-3 thead — dihitung dari tinggi baris riil (multi-row sticky) */
  const theadRow1Ref = useRef<HTMLTableRowElement>(null);
  const theadRow2Ref = useRef<HTMLTableRowElement>(null);
  const [theadStickyTops, setTheadStickyTops] = useState({ row2: 44, row3: 94 });

  // Column Weights for real-time editing
  const [columnWeights, setColumnWeights] = useState<Record<string, number>>({
    performanceRating: 1,
    potentialRating: 1,
    readinessLevel: 1,
    timeInRole: 1,
    engagementScore: 1,
    iqScore: 1,
    flightRisk: 1,
    salary: 1,
    criticalRole: 1,
    successorIdentified: 1,
    personality: 1,
    leadershipType: 1,
    // Aspect columns (10 aspects)
    leadership: 1,
    communication: 1,
    problemSolving: 1,
    teamwork: 1,
    adaptability: 1,
    strategicThinking: 1,
    decisionMaking: 1,
    innovation: 1,
    analyticalSkills: 1,
    accountability: 1,
    // Cluster Score Weights (Multipliers)
    competencyScore: 1,
    commitmentScore: 1,
    contributionScore: 1,
    aspectScore: 1,
  });

  /*
    Bobot per VARIABEL — lihat `lib/pembobotan`. Yang tersimpan hanya yang diubah dari bawaan (1); selebihnya 1.
    Bobot 1,5 / 2 / … (kelipatan 0,5, tak boleh 0) berarti variabel itu lebih berpengaruh di skor clusternya.
    Cluster sendiri tak punya bobot. Simpanan lama (persen, versi 2) diabaikan karena artinya berbeda.
  */
  const [bobotVar, setBobotVar] = useState<Record<string, number>>({});
  // Bobot tiap CLUSTER (kunci = nama cluster di tabel), aturan sama: bawaan 1, kelipatan 0,5.
  const [bobotCluster, setBobotCluster] = useState<Record<string, number>>({});



  // Cluster Score Display Settings - removed, now managed via visibleColumns

  const defaultFilters: Filters = {
    department: [],
    level: [],
    performanceRating: { operator: null, value: null },
    potentialRating: { operator: null, value: null },
    readinessLevel: { operator: null, value: null },
    timeInRole: { operator: null, value: null },
    engagementScore: { operator: null, value: null },
    salary: { operator: null, value: null },
    iqScore: { operator: null, value: null },
    flightRisk: [],
    criticalRole: null,
    successorIdentified: null,
    personality: [],
    leadershipType: [],
    searchTerm: '',
  };

  const [filters, setFilters] = useState<Filters>(defaultFilters);

  // Employee condition — always present, cannot be removed
  const EMPLOYEE_CONDITION_ID = 'filter-employee-permanent';
  /**
   * Calon penerus yang diminta tombol "Compare"/"Compare Successors" (Vismap V2 &
   * iProfile) — id versi TDP.
   *
   * Dihitung SEKALI: isinya hanya bergantung pada URL dan daftar karyawan, dan
   * keduanya tidak berubah selama layar ini hidup. Larik kosong = tak ada permintaan
   * (atau tak satu pun id ketemu), dan itu berarti "jangan pin siapa pun".
   *
   * ⚠️ TIDAK LAGI dipakai mengisi kondisi filter Employees (lihat `createEmployeeCondition`
   * di bawah) — dipakai men-PIN lewat efek sesudahnya. Alasan penuhnya di
   * `tautanPenerus.ts`.
   */
  const penerusDiminta = useMemo(() => idKaryawanPenerus(mockEmployees), []);

  const createEmployeeCondition = (): ActiveFilterCondition => ({
    id: EMPLOYEE_CONDITION_ID,
    field: 'employees',
    fieldType: 'employee-selector',
    selectedValues: [],
    operator: null,
    value: null,
    value2: null,
  });

  // New filter system state
  const [activeFilterConditions, setActiveFilterConditions] = useState<ActiveFilterCondition[]>([createEmployeeCondition()]);
  const [matchMode, setMatchMode] = useState<MatchMode>('all');

  /*
    Pin (bukan saring) para calon yang diminta tombol "Compare" — lihat catatan di
    `tautanPenerus.ts`. Sekali saja saat layar ini lahir: `penerusDiminta` sendiri tidak
    pernah berubah, dan pin sesudahnya adalah keadaan pemakai biasa yang bisa dilepas
    lewat tombol pin baris seperti pin manapun — tidak dipaksakan menyala lagi tiap render.

    ⚠️ MENGGANTI daftar pin, bukan menambahinya.

    Versi pertama menggabungkan (`[...penerusDiminta, ...prev]`), dan itu salah: `pin`
    tersimpan di `localStorage` dan bertahan antar kunjungan, jadi sisa pin dari sesi lama
    ikut terbawa. Terukur saat dicoba — datang dari panel berisi 3 calon, yang tersorot di
    TDP jadi 10 orang, 7 di antaranya tak ada hubungannya dengan kursi yang sedang dilihat.

    "Bandingkan calon-calon ini" adalah perintah tentang SIAPA yang mau dilihat sekarang,
    bukan tambahan untuk apa pun yang tersisa dari kemarin. Pin manual sesudahnya tetap
    bebas ditambah-kurangi seperti biasa.
  */
  useEffect(() => {
    if (penerusDiminta.length === 0) return;
    setPinnedTableIds(penerusDiminta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Saved filters state
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [isSaveFilterDialogOpen, setIsSaveFilterDialogOpen] = useState(false);
  const [filterNameToSave, setFilterNameToSave] = useState('');

  // Custom columns state
  const [customColumnsLokal, setCustomColumns] = useState<ColumnConfig[]>([]);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<'text' | 'numerical' | 'categorical' | 'attachment' | 'like-dislike'>('text');
  const [newColumnCategories, setNewColumnCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [newColumnCluster, setNewColumnCluster] = useState<string>('custom');

  // User-created clusters from Data Visibility modal (read from localStorage)
  const [userClusters, setUserClusters] = useState<{ key: string; label: string }[]>([]);

  // Refresh userClusters from localStorage every time Add Custom Data dialog opens
  useEffect(() => {
    if (!isAddColumnDialogOpen) return;
    try {
      const saved = localStorage.getItem('userClusters.v1');
      setUserClusters(saved ? JSON.parse(saved) : []);
    } catch { setUserClusters([]); }
  }, [isAddColumnDialogOpen]);

  // File upload state
  const [employees, setEmployees] = useState<Employee[]>(() => loadEmployeeDraft());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastUploadedFileName, setLastUploadedFileName] = useState<string | null>(
    () => localStorage.getItem(EMPLOYEE_UPLOAD_FILE_NAME_KEY)
  );
  const [customColumnDataLokal, setCustomColumnData] = useState<Record<string, Record<string, any>>>({});

  /*
    Data TAMBAHAN dari Profile Data (kolom data extension buatan perusahaan) — satu gerbang tambah data.
    Digabung ke kolom/nilai custom lokal SAAT RENDER dan tak pernah disimpan ke localStorage: sumbernya
    Profile Data, bukan tabel ini. Nilainya dikunci UUID karyawan; barisnya dicocokkan lewat kolom CSV
    "Referance ID".
  */
  const dataTambahan = useMemo(() => ambilDataTambahan(), []);
  const kolomTambahan = useMemo<ColumnConfig[]>(
    () =>
      dataTambahan.kolom.map((k) => ({
        key: k.id as ColumnKey,
        label: k.label,
        sortable: true,
        defaultVisible: false,
        isCustom: true,
        dariProfileData: true,
        tipeData: k.tipe,
        customType: k.tipe === 'integer' || k.tipe === 'decimal' ? 'numerical' : 'text',
        // Tabel mengelompokkan kolom custom lewat clusterName.
        cluster: 'custom',
        clusterName: 'Additional Data',
      })),
    [dataTambahan],
  );
  const customColumns = useMemo(() => [...customColumnsLokal, ...kolomTambahan], [customColumnsLokal, kolomTambahan]);
  const customColumnData = useMemo(() => {
    const out: Record<string, Record<string, any>> = { ...customColumnDataLokal };
    for (const emp of employees) {
      const uuid = (emp as { csvFields?: Record<string, string> }).csvFields?.['Referance ID'];
      const nilai = uuid ? dataTambahan.nilai[uuid] : undefined;
      if (nilai) out[emp.id] = { ...nilai, ...(customColumnDataLokal[emp.id] ?? {}) };
    }
    return out;
  }, [customColumnDataLokal, employees, dataTambahan]);
  
  // Delete confirmation state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);

  // Visible Columns Dialog state
  const [isVisibleColumnsDialogOpen, setIsVisibleColumnsDialogOpen] = useState(false);

  // Load decisions from localStorage to check which employees have decisions
  const [employeesWithDecisions, setEmployeesWithDecisions] = useState<Set<string>>(new Set());

  // Load custom columns from localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem('customColumns');
    const savedData = localStorage.getItem('customColumnData');
    
    if (savedColumns) {
      try {
        const loadedColumns = JSON.parse(savedColumns);
        // Ensure all custom columns have a cluster property (backward compatibility)
        const columnsWithCluster = loadedColumns.map((col: ColumnConfig) => ({
          ...col,
          cluster: col.cluster || 'custom' // Default to 'custom' if not set
        }));
        setCustomColumns(columnsWithCluster);
      } catch (e) {
        console.error('Failed to load custom columns', e);
      }
    }
    
    if (savedData) {
      try {
        setCustomColumnData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to load custom column data', e);
      }
    }
  }, []);

  useEffect(() => {
    const loadDecisions = () => {
      const saved = localStorage.getItem('talentDecisions');
      if (saved) {
        try {
          const decisions = JSON.parse(saved);
          const employeeIds = new Set(decisions.map((d: any) => d.employeeId));
          setEmployeesWithDecisions(employeeIds);
        } catch (e) {
          console.error('Failed to load decisions', e);
        }
      }
    };

    loadDecisions();
    
    // Listen for storage changes to update in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'talentDecisions') {
        loadDecisions();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Load presets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('talentScreenerPresets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPresets(parsed.map((p: any) => ({
          ...p,
          visibleColumns: new Set(p.visibleColumns),
          clusterTotalSlotOverride: p.clusterTotalSlotOverride,
        })));
      } catch (e) {
        console.error('Failed to load presets', e);
      }
    }
  }, []);

  // Load saved filters from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedFilters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedFilters(parsed);
      } catch (e) {
        console.error('Failed to load saved filters', e);
      }
    }
  }, []);

  // Load persisted table state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('currentTableState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);

        // Restore filters
        if (parsed.filters) {
          setFilters(parsed.filters);
        }

        // Restore sort field and direction
        if (parsed.sortField !== undefined) {
          setSortField(parsed.sortField);
        }
        if (parsed.sortDirection) {
          setSortDirection(parsed.sortDirection);
        }

        // Restore selected employee IDs (employee selector filter)
        if (parsed.selectedEmployeeIds) {
          setSelectedEmployeeIds(parsed.selectedEmployeeIds);
        }

        // Restore active filter conditions — employee condition always first and present
        if (parsed.activeFilterConditions) {
          const withoutEmployee = (parsed.activeFilterConditions as ActiveFilterCondition[])
            .filter((c: ActiveFilterCondition) => c.field !== 'employees');
          setActiveFilterConditions([createEmployeeCondition(), ...withoutEmployee]);
        }

        // Restore match mode
        if (parsed.matchMode) {
          setMatchMode(parsed.matchMode);
        }

        // Restore column weights
        if (parsed.columnWeights) {
          setColumnWeights(parsed.columnWeights);
        }

        // Bobot per variabel — hanya format baru (versi 3); simpanan lama (persen) berarti hal lain.
        if (parsed.bobotVar && parsed.bobotVersion === 3) {
          setBobotVar(parsed.bobotVar);
          if (parsed.bobotCluster) setBobotCluster(parsed.bobotCluster);
        }

        // Restore visible columns only if schema version matches; otherwise use new defaults
        if (parsed.visibleColumns && parsed.columnDefaultsVersion === COLUMN_DEFAULTS_VERSION) {
          setVisibleColumns(new Set(parsed.visibleColumns));
        }

        if (parsed.clusterTotalSlotOverride && typeof parsed.clusterTotalSlotOverride === 'object') {
          setClusterTotalSlotOverride(parsed.clusterTotalSlotOverride);
        }

        console.log('Loaded persisted table state from localStorage');
      } catch (e) {
        console.error('Failed to load persisted table state', e);
      }
    }
  }, []);

  // Handle imported columns from Import Review
  useEffect(() => {
    const state = location.state as { importedColumns?: string[]; message?: string } | null;
    if (state?.importedColumns && state.importedColumns.length > 0) {
      // Add imported columns to visibleColumns
      setVisibleColumns(prev => {
        const newSet = new Set(prev);
        state.importedColumns.forEach(col => newSet.add(col));
        return newSet;
      });
      
      // Clear the state after processing to prevent re-adding on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Sync floating scrollbar with table wrapper
  useEffect(() => {
    const tableWrapper = tableWrapperRef.current;
    const floatingScrollbar = floatingScrollbarRef.current;
    const floatingScrollContent = floatingScrollContentRef.current;

    if (!tableWrapper || !floatingScrollbar || !floatingScrollContent) return;

    // Sync width and visibility
    const syncWidth = () => {
      /*
        Area gulir = tabel DIKURANGI kolom mengambang (Employee di kiri, Ranking di kanan): batang gulirnya
        hanya sepanjang area yang benar-benar bergeser, dan tak lagi melintas di bawah kolom mengambang.
        Selisih lebar isi dan lebar batang tetap sama dengan tabel, jadi gesernya tetap 1:1.
      */
      const kotak = tableWrapper.getBoundingClientRect();
      const lebarMengambang = (sisi: 'left' | 'right') => {
        let maks = 0;
        tableWrapper.querySelectorAll('thead tr:first-child th, tbody tr:first-child td').forEach((el) => {
          const cs = getComputedStyle(el);
          if (cs.position !== 'sticky' || cs[sisi] === 'auto') return;
          const r = el.getBoundingClientRect();
          maks = Math.max(maks, sisi === 'left' ? r.right - kotak.left : kotak.right - r.left);
        });
        return maks;
      };
      const kiri = Math.min(lebarMengambang('left'), kotak.width / 2);
      const kanan = Math.min(lebarMengambang('right'), kotak.width / 2);
      floatingScrollContent.style.width = `${tableWrapper.scrollWidth - kiri - kanan}px`;
      floatingScrollbar.style.width = `${tableWrapper.clientWidth - kiri - kanan}px`;
      // Sejajar dengan area gulir tabel, bukan seluruh lebar layar: `fixed left-0` menembus ke bawah sidebar menu.
      floatingScrollbar.style.left = `${kotak.left + kiri}px`;
      floatingScrollbar.style.right = 'auto';
      
      // Hide scrollbar if table doesn't overflow horizontally
      if (tableWrapper.scrollWidth <= tableWrapper.clientWidth) {
        floatingScrollbar.style.display = 'none';
      } else {
        floatingScrollbar.style.display = 'block';
      }
    };

    // Sync scroll position from table to floating scrollbar
    const onTableScroll = () => {
      floatingScrollbar.scrollLeft = tableWrapper.scrollLeft;
    };

    // Sync scroll position from floating scrollbar to table
    const onFloatingScroll = () => {
      tableWrapper.scrollLeft = floatingScrollbar.scrollLeft;
    };

    // Enable horizontal scroll with trackpad (2-finger swipe) or Shift+Wheel
    const onWheel = (e: WheelEvent) => {
      // Check if there's horizontal scroll (2-finger horizontal swipe on trackpad)
      // or if Shift key is pressed with vertical scroll
      const hasHorizontalScroll = Math.abs(e.deltaX) > 0;
      const isShiftScroll = e.shiftKey && Math.abs(e.deltaY) > 0;
      
      if (hasHorizontalScroll || isShiftScroll) {
        // Prevent default vertical scroll
        e.preventDefault();
        
        // Apply horizontal scroll
        const scrollAmount = hasHorizontalScroll ? e.deltaX : e.deltaY;
        tableWrapper.scrollLeft += scrollAmount;
      }
    };

    syncWidth();
    tableWrapper.addEventListener('scroll', onTableScroll);
    floatingScrollbar.addEventListener('scroll', onFloatingScroll);
    tableWrapper.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', syncWidth);

    // Observe table size changes
    const resizeObserver = new ResizeObserver(syncWidth);
    resizeObserver.observe(tableWrapper);

    return () => {
      tableWrapper.removeEventListener('scroll', onTableScroll);
      floatingScrollbar.removeEventListener('scroll', onFloatingScroll);
      tableWrapper.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', syncWidth);
      resizeObserver.disconnect();
    };
  }, [visibleColumns]);

  // Extract unique values for filter options
  const departments = Array.from(new Set(mockEmployees.map((e) => e.department)));
  const levels = Array.from(new Set(mockEmployees.map((e) => e.level))).sort();
  const flightRisks: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
  const personalities = Array.from(new Set(mockEmployees.map((e) => e.personality).filter(Boolean))) as string[];
  const leadershipTypes = Array.from(new Set(mockEmployees.map((e) => e.leadershipType).filter(Boolean))) as string[];

  // Helper functions for new filter system
  /**
   * Pilihan nilai untuk medan kategorikal.
   *
   * Yang tidak punya daftar tetap dibaca DARI DATA — nilai unik yang benar-benar ada
   * di kolom itu. Sebelumnya cabang `default` memulangkan larik kosong, jadi setiap
   * kolom di luar lima nama yang dipatok membuka dropdown yang tak punya satu pun
   * pilihan: medannya bisa dipilih, nilainya tidak.
   */
  const getFieldOptions = (field: string): string[] => {
    switch (field) {
      case 'department':
        return departments;
      case 'level':
        return levels;
      case 'flightRisk':
        return flightRisks;
      case 'personality':
        return personalities;
      case 'leadershipType':
        return leadershipTypes;
      case 'criticalRole':
      case 'successorIdentified':
        return ['Yes', 'No'];
      default: {
        const set = new Set<string>();
        for (const e of employees) {
          const v = nilaiMedan(e, field);
          if (v === undefined || v === null || v === '' || v === '#N/A' || v === 'N/A') continue;
          set.add(String(v));
        }
        return [...set].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      }
    }
  };

  const addFilterCondition = () => {
    const newCondition: ActiveFilterCondition = {
      id: `filter-${Date.now()}`,
      field: null,
      fieldType: null,
      selectedValues: [],
      operator: null,
      value: null,
      value2: null,
    };
    setActiveFilterConditions([...activeFilterConditions, newCondition]);
  };

  const removeFilterCondition = (id: string) => {
    setActiveFilterConditions(activeFilterConditions.filter(c => c.id !== id));
  };

  const updateFilterCondition = (id: string, updates: Partial<ActiveFilterCondition>) => {
    setActiveFilterConditions(activeFilterConditions.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  // Save filter functions
  const saveCurrentFilter = () => {
    if (!filterNameToSave.trim()) return;
    
    const newFilter: SavedFilter = {
      id: `saved-filter-${Date.now()}`,
      name: filterNameToSave.trim(),
      conditions: activeFilterConditions,
      matchMode: matchMode,
      createdAt: new Date().toISOString(),
    };
    
    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));
    
    setFilterNameToSave('');
    setIsSaveFilterDialogOpen(false);
  };

  const loadSavedFilter = (filter: SavedFilter) => {
    setActiveFilterConditions(filter.conditions);
    setMatchMode(filter.matchMode);
  };

  const deleteSavedFilter = (id: string) => {
    const updatedFilters = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updatedFilters);
    localStorage.setItem('savedFilters', JSON.stringify(updatedFilters));
  };

  /**
   * Nilai sebuah medan filter untuk seorang karyawan.
   *
   * ⚠️ Kolom berawalan `csv:` TIDAK ada sebagai medan di objek `Employee` — isinya di
   * `csvFields[header]`, dan itulah yang digambar tabelnya. Tanpa cabang ini,
   * `employee[field]` memulangkan `undefined` untuk hampir SETIAP kolom yang
   * benar-benar tampil, jadi penyaringnya membandingkan ketiadaan dengan angka.
   */
  const nilaiMedan = (employee: Employee, field: string): unknown => {
    if (field.startsWith('csv:')) return employee.csvFields?.[field.slice(4)];
    return employee[field as keyof Employee];
  };

  /** Angka dari nilai medan, atau NaN. Teks CSV pun dibaca — "75" tetap 75. */
  const angkaMedan = (employee: Employee, field: string): number => {
    const v = nilaiMedan(employee, field);
    if (typeof v === 'number') return v;
    if (typeof v === 'string' && v.trim() !== '') return Number(v.replace(/,/g, ''));
    return Number.NaN;
  };

  // Check if condition matches employee
  const checkConditionMatch = (employee: Employee, condition: ActiveFilterCondition): boolean => {
    if (!condition.field || !condition.fieldType) return true;

    const field = condition.field;
    
    if (condition.fieldType === 'categorical') {
      if (!condition.selectedValues || condition.selectedValues.length === 0) return true;
      return condition.selectedValues.includes(String(nilaiMedan(employee, field)));
    }

    if (condition.fieldType === 'boolean') {
      if (!condition.selectedValues || condition.selectedValues.length === 0) return true;
      const boolValue = nilaiMedan(employee, field) ? 'Yes' : 'No';
      return condition.selectedValues.includes(boolValue);
    }

    if (condition.fieldType === 'employee-selector') {
      if (!condition.selectedValues || condition.selectedValues.length === 0) return true;
      return condition.selectedValues.includes(employee.id);
    }
    
    if (condition.fieldType === 'numerical') {
      if (!condition.operator || condition.value === null) return true;
      const empValue = angkaMedan(employee, field);
      /*
        Karyawan TANPA angka pada medan itu DILUARKAN, bukan diloloskan. Kalau
        `undefined` diloloskan, menyaring "Performance ≥ 80" tetap menampilkan orang
        yang performanya tak pernah diukur — dan itu jawaban yang salah, bukan cuma
        kurang lengkap.
      */
      if (!Number.isFinite(empValue)) return false;
      
      switch (condition.operator) {
        case '>':
          return empValue > condition.value;
        case '>=':
          return empValue >= condition.value;
        case '<':
          return empValue < condition.value;
        case '<=':
          return empValue <= condition.value;
        case '=':
          return empValue === condition.value;
        case 'between':
          return condition.value2 !== null && empValue >= condition.value && empValue <= condition.value2;
        default:
          return true;
      }
    }
    
    return true;
  };

  // Normalization functions - convert all variables to 0-100 scale
  const normalizeToScale100 = (employee: Employee, field: keyof Employee): number => {
    const value = employee[field];
    
    switch (field) {
      // Performance (0-100 percentage) → already normalized
      case 'performanceRating':
        return typeof value === 'number' ? value : 0;

      // Potential (0-100 percentage) → already normalized
      case 'potentialRating':
        return typeof value === 'number' ? value : 0;

      // Readiness Level - already 0-100
      case 'readinessLevel':
        return typeof value === 'number' ? value : 0;

      // Flight Risk (categorical) → lookup (Low is good, High is bad)
      case 'flightRisk':
        if (value === 'Low') return 90;
        if (value === 'Medium') return 60;
        if (value === 'High') return 10;
        return 0;
      
      // Time in Role (months) → percentile-based
      case 'timeInRole': {
        if (typeof value !== 'number') return 0;
        // Band-based approach: optimal time in role is 12-36 months
        // Too short (<6) or too long (>60) gets lower score
        if (value < 6) return 30;
        if (value >= 6 && value < 12) return 60;
        if (value >= 12 && value <= 36) return 100; // Sweet spot
        if (value > 36 && value <= 60) return 70;
        return 40; // > 60 months, possibly stagnant
      }
      
      // Engagement Score (0-100) → as-is
      case 'engagementScore':
        return typeof value === 'number' ? value : 0;

      // IQ Score → normalize from typical range (70-130, with 100 as average)
      case 'iqScore':
        if (typeof value !== 'number') return 0;
        // Map IQ 70-130 to 0-100 scale
        return Math.max(0, Math.min(100, ((value - 70) / 60) * 100));
      
      // Salary → percentile (inverse for cost efficiency)
      case 'salary': {
        if (typeof value !== 'number') return 0;
        // Calculate percentile rank (lower salary = higher score for cost efficiency)
        const allSalaries = mockEmployees.map(e => e.salary).sort((a, b) => a - b);
        const rank = allSalaries.filter(s => s < value).length;
        const percentile = (rank / allSalaries.length) * 100;
        return 100 - percentile; // Inverse: lower salary = higher score
      }
      
      // Critical Role (boolean) → lookup
      case 'criticalRole':
        return value === true ? 100 : 0;
      
      // Successor Identified (boolean) → lookup
      case 'successorIdentified':
        return value === true ? 100 : 20;
      
      // Personality (DISC) → for now, treat all equally or create custom scoring
      case 'personality':
        // Could map to specific scores if needed, for now return neutral
        return typeof value === 'string' && value ? 50 : 0;
      
      // Leadership Type → for now, treat all equally or create custom scoring
      case 'leadershipType':
        // Could map to specific scores if needed, for now return neutral
        return typeof value === 'string' && value ? 50 : 0;
      
      // Aspect fields (1-5) → linear 0-100
      case 'leadership':
      case 'communication':
      case 'problemSolving':
      case 'teamwork':
      case 'adaptability':
      case 'strategicThinking':
      case 'decisionMaking':
      case 'innovation':
      case 'analyticalSkills':
      case 'accountability':
        return typeof value === 'number' ? ((value - 1) / 4) * 100 : 0;
      
      default:
        return 0;
    }
  };

  // Helper function to normalize values to 0-100 scale for cluster scores
  const normalizeValue = (value: any, field: string, allEmployees: Employee[]): number => {
    if (value === null || value === undefined) return 0;

    // Performance and Potential are now percentages (0-100)
    if (field === 'performanceRating' || field === 'potentialRating') {
      return value;
    }

    // Aspect fields are still 1-5 scale
    if (field === 'leadership' || field === 'communication' || field === 'problemSolving' ||
        field === 'teamwork' || field === 'adaptability' || field === 'strategicThinking' ||
        field === 'decisionMaking' || field === 'innovation' || field === 'analyticalSkills' ||
        field === 'accountability') {
      return (value / 5) * 100;
    }

    // Already percentage/score 0-100
    if (field === 'engagementScore' || field === 'readinessLevel' || field === 'competencyMatch') {
      return value;
    }
    
    // Time in role (months, assume max 60 months)
    if (field === 'timeInRole') {
      return Math.min((value / 60) * 100, 100);
    }
    
    // Salary (normalize based on dataset range)
    if (field === 'salary') {
      const salaries = allEmployees.map(e => e.salary);
      const minSalary = Math.min(...salaries);
      const maxSalary = Math.max(...salaries);
      if (maxSalary === minSalary) return 50; // All same
      return ((value - minSalary) / (maxSalary - minSalary)) * 100;
    }
    
    // Boolean fields
    if (field === 'criticalRole' || field === 'successorIdentified') {
      return value ? 100 : 0;
    }

    // Categorical - flightRisk  
    if (field === 'flightRisk') {
      if (value === 'Low') return 100;
      if (value === 'Medium') return 50;
      return 0; // High
    }
    
    // Generic fallback for dynamic/custom columns:
    // - Numeric values are normalized by observed min-max range.
    // - Text/categorical values get a neutral non-zero score when filled.
    const numericValue = Number(value);
    if (!Number.isNaN(numericValue)) {
      const customNumericValues = allEmployees
        .map((emp) => customColumnData[emp.id]?.[field])
        .filter((v) => v !== null && v !== undefined && v !== '' && !Number.isNaN(Number(v)))
        .map((v) => Number(v));

      if (customNumericValues.length > 0) {
        const min = Math.min(...customNumericValues);
        const max = Math.max(...customNumericValues);
        if (max === min) return 50;
        return ((numericValue - min) / (max - min)) * 100;
      }
      return Math.max(0, Math.min(100, numericValue));
    }

    if (typeof value === 'string') return value.trim() ? 50 : 0;
    if (typeof value === 'boolean') return value ? 100 : 0;

    return 0;
  };

  // Merge custom columns with default columns
  const allColumnDefinitions = useMemo(() => {
    return [...columnDefinitions, ...customColumns];
  }, [customColumns]);

  /**
   * Medan yang bisa dipakai sebagai kondisi filter — SELURUH kolom yang sedang
   * tampil, ditambah "Employees" yang selalu ada.
   *
   * ── Kenapa diturunkan, bukan didaftar ──
   *
   * Diminta langsung: kondisi yang bisa ditambahkan adalah semua variabel yang tampil
   * di kolom karyawan, yaitu yang dipilih lewat Data Visibility.
   *
   * ⚠️ Sebelumnya daftarnya `fieldTypeMap` — 19 nama yang ditulis tangan — lalu
   * disaring `visibleColumns.has(key)`. Penyaring itu sudah benar niatnya, tapi
   * kolom yang benar-benar tampil hampir seluruhnya ber-kunci `csv:<header>` yang
   * TIDAK ADA di peta itu. Terukur: dari 19 nama, yang lolos cuma segelintir, jadi
   * dropdown "Select field" praktis kosong sementara tabelnya memajang puluhan kolom.
   *
   * ── Tipe medannya dibaca dari DATA ──
   *
   * Kolom `csv:` tak menyatakan tipenya di mana pun, jadi ia disimpulkan dari isinya:
   * kalau seluruh nilai yang terisi berupa angka, ia numerik; kalau tidak, kategorikal.
   * Menebaknya dari nama kolom akan salah pada kolom seperti "Level" yang berisi angka
   * maupun "Score" yang berisi teks.
   */
  const medanFilter = useMemo(() => {
    /** Tipe kolom kustom sudah dinyatakan pembuatnya; yang lain disimpulkan. */
    const tipeKustom = (col: ColumnConfig): FilterFieldType =>
      col.customType === 'numerical' ? 'numerical' : 'categorical';

    const tipeBawaan: Record<string, FilterFieldType> = {
      department: 'categorical',
      level: 'categorical',
      role: 'categorical',
      competencyMatch: 'numerical',
      engagementScore: 'numerical',
      performanceRating: 'numerical',
      potentialRating: 'numerical',
    };

    const simpulkan = (key: string): FilterFieldType => {
      let adaIsi = false;
      for (const e of employees) {
        const v = key.startsWith('csv:')
          ? e.csvFields?.[key.slice(4)]
          : (e as unknown as Record<string, unknown>)[key];
        if (v === undefined || v === null || v === '' || v === '#N/A' || v === 'N/A') continue;
        adaIsi = true;
        const n = typeof v === 'number' ? v : Number(String(v).replace(/,/g, ''));
        if (!Number.isFinite(n)) return 'categorical';
      }
      // Kolom yang seluruhnya kosong dianggap kategorikal — pilihannya memang nol,
      // dan itu lebih jujur daripada menawarkan pembanding angka untuk kolom hampa.
      return adaIsi ? 'numerical' : 'categorical';
    };

    const out: { key: string; label: string; type: FilterFieldType }[] = [
      { key: 'employees', label: 'Employees', type: 'employee-selector' },
    ];
    for (const col of allColumnDefinitions) {
      const key = String(col.key);
      // `name` sudah diwakili kondisi Employees yang permanen.
      if (key === 'name' || !visibleColumns.has(key)) continue;
      out.push({
        key,
        label: col.label,
        type: col.isCustom ? tipeKustom(col) : (tipeBawaan[key] ?? simpulkan(key)),
      });
    }
    return out;
  }, [allColumnDefinitions, visibleColumns, employees]);

  // Create dynamic categories that include custom columns and auto-generated CSV columns.
  const dynamicCategories = useMemo(() => {
    const baseCategories = CLUSTER_CATEGORIES.map(cat => ({
      ...cat,
      columns: [...cat.columns] // Create a copy
    }));

    // Helper: resolve internal cluster ID → category name (matching CLUSTER_CATEGORIES)
    const clusterToCategoryName = (cluster: string): string | undefined => {
      if (cluster === 'aspect' || cluster === 'competency')
        return CSV_CLUSTER_NAMES['aspect'] ?? 'CAPABILITY';
      if (cluster === 'competencyGeneral') return CSV_CLUSTER_NAMES['competencyGeneral'] ?? 'General';
      if (cluster === 'competencyTechnical') return CSV_CLUSTER_NAMES['competencyTechnical'] ?? 'Technical';
      if (cluster === 'commitment') return CSV_CLUSTER_NAMES['commitment'] ?? 'COMMITMENT';
      if (cluster === 'contribution') return CSV_CLUSTER_NAMES['contribution'] ?? 'CONTRIBUTION';
      if (cluster === 'potency') return 'POTENSI';
      if (cluster === 'readiness') return 'READINESS';
      if (cluster === 'leadershipStyle') return CSV_CLUSTER_NAMES['leadershipStyle'] ?? 'LEADERSHIP STYLE';
      return undefined;
    };

    // Assign auto-generated CSV columns to their cluster categories
    autoCsvColumnDefinitions.forEach((col) => {
      const cluster = col.cluster as string | undefined;
      if (!cluster) return; // no cluster = Basic Info; skip (not in a bracket group)
      const catName = clusterToCategoryName(cluster);
      if (!catName) return;
      // Tanpa beda huruf besar/kecil: kolom `[POTENSI]` bernama kategori 'POTENSI' sedangkan kategorinya 'Potensi';
      // dulu tak cocok, kolomnya jatuh tanpa header cluster dan menggeser kolom Ranking di header.
      const cat = baseCategories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
      if (cat && !cat.columns.includes(col.key)) {
        cat.columns.push(col.key);
      }
    });

    // Add custom columns to their respective clusters
    customColumns.forEach(customCol => {
      if (customCol.cluster && customCol.cluster !== 'custom') {
        // Find the matching category
        const category = baseCategories.find(cat =>
          cat.name.toLowerCase() === customCol.cluster?.toLowerCase()
        );
        if (category) {
          category.columns.push(customCol.key);
        }
      } else if (customCol.clusterName?.trim()) {
        const normalizedClusterName = customCol.clusterName.trim();
        const existingCategory = baseCategories.find(
          (cat) => cat.name.toLowerCase() === normalizedClusterName.toLowerCase()
        );

        if (existingCategory) {
          existingCategory.columns.push(customCol.key);
        } else {
          baseCategories.push({
            name: normalizedClusterName,
            columns: [customCol.key],
            // Data tambahan Profile Data: cluster ini punya Total Score seperti cluster lainnya.
            ...(customCol.dariProfileData ? { totalScoreKey: 'additionalScore' as const } : {}),
          });
        }
      }
    });

    return baseCategories;
  }, [customColumns]);

  // Buang override Total Score yang tidak lagi valid (kolom hilang dari cluster)
  useEffect(() => {
    setClusterTotalSlotOverride((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const name of Object.keys(next)) {
        const cat = dynamicCategories.find((c) => c.name === name);
        if (!cat?.totalScoreKey || !cat.columns.includes(next[name])) {
          delete next[name];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [dynamicCategories]);

  /** Checkbox + kolom Basic Information digabung di header cluster; dipakai untuk rowspan/colspan konsisten */
  const tableHeadBasicMerge = useMemo(() => {
    const visibleCols = allColumnDefinitions.filter((col) => visibleColumns.has(col.key));
    const basicCat = dynamicCategories.find((c) => c.name === 'Basic Information');
    const basicVisibleCols = basicCat ? orderVisibleCategoryColumns(basicCat, visibleCols) : [];
    const mergedBasicCluster = basicVisibleCols.length > 0;
    const basicGridTemplateColumns = mergedBasicCluster
      ? `50px ${basicVisibleCols.map((c) => `${getColumnWidthPx(String(c.key))}px`).join(' ')}`
      : '';
    return { basicVisibleCols, mergedBasicCluster, basicGridTemplateColumns };
  }, [allColumnDefinitions, dynamicCategories, visibleColumns]);

  useLayoutEffect(() => {
    const measure = () => {
      const h1 = theadRow1Ref.current?.getBoundingClientRect().height ?? 44;
      const h2 = theadRow2Ref.current?.getBoundingClientRect().height ?? 44;
      const row2 = Math.round(h1 * 100) / 100;
      const row3 = Math.round((h1 + h2) * 100) / 100;
      setTheadStickyTops((prev) =>
        prev.row2 === row2 && prev.row3 === row3 ? prev : { row2, row3 }
      );
    };

    measure();

    const tr1 = theadRow1Ref.current;
    const tr2 = theadRow2Ref.current;
    const ro = new ResizeObserver(measure);
    if (tr1) ro.observe(tr1);
    if (tr2) ro.observe(tr2);

    window.addEventListener('resize', measure);

    const raf = requestAnimationFrame(measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(raf);
    };
  }, [visibleColumns, customColumns, dynamicCategories, tableHeadBasicMerge.mergedBasicCluster, clusterTotalSlotOverride]);

  /*
    ── Variabel yang BISA dibobot, dan bagaimana tiap nilainya disamakan ke skala 0–100 ──

    Semua variabel berskor ikut: butir aspek General/Technical/Potensi, Performance, Engagement,
    Potensi, Competency Match, serta kolom custom numerik. Sebelum dibobot tiap nilai diubah ke
    0–100 (`nilaiSkala100`), supaya bobot 20% pada butir 1–5 dan 20% pada Performance 0–100 memang
    berpengaruh sama besar.

    Skor total kelompok (Total Score) TIDAK dibobot lagi: butir-butir di dalamnya sudah punya bobot
    sendiri, dan membobot keduanya akan menghitung ganda.
  */
  const KUNCI_TIPE_BERBOBOT = new Set([
    'performanceRating', 'potentialRating', 'readinessLevel', 'competencyMatch',
    'timeInRole', 'engagementScore', 'iqScore', 'salary',
    'leadership', 'communication', 'problemSolving', 'teamwork', 'adaptability',
    'strategicThinking', 'decisionMaking', 'innovation', 'analyticalSkills', 'accountability',
  ]);
  const KELOMPOK_CSV_BERBOBOT = new Set([
    'aspect', 'competencyGeneral', 'competencyTechnical', 'commitment', 'contribution', 'potency', 'readiness',
  ]);
  /**
   * Data tambahan: null = bisa dibobot, selain itu alasannya (untuk tooltip kotak bobot yang dinonaktifkan).
   * Tipe text hanya bisa bila seluruh nilai terisinya berupa angka, jadi nilainya ikut diperiksa.
   */
  const alasanTakBisaDibobot = (key: string): string | null => {
    const col = kolomTambahan.find((c) => String(c.key) === key);
    if (!col) return null;
    const nilai = employees.map((e) => customColumnData[e.id]?.[key]);
    const r = bisaDibobotTambahan(sebagaiTipeTambahan(col.tipeData ?? 'string'), nilai);
    return r.bisa ? null : r.alasan ?? 'This data cannot be weighted.';
  };

  const bisaDibobot = (key: string): boolean => {
    if (KUNCI_TIPE_BERBOBOT.has(key)) return true;
    if (key.startsWith('csv:')) {
      const colDef = allColumnDefinitions.find((c) => String(c.key) === key);
      return colDef ? KELOMPOK_CSV_BERBOBOT.has(colDef.cluster as string) : false;
    }
    const customCol = customColumns.find((col) => String(col.key) === key);
    if (customCol?.dariProfileData) return alasanTakBisaDibobot(String(customCol.key)) === null;
    if (customCol) {
      return customCol.customType === 'numerical' || (customCol.customType as string) === 'like-dislike';
    }
    return false;
  };

  /** Kolom yang sedang tampil DAN bisa dibobot — himpunan yang ikut ranking. */
  const kolomBerbobot = useMemo(
    () =>
      allColumnDefinitions
        .filter((c) => visibleColumns.has(c.key) && bisaDibobot(String(c.key)))
        .map((c) => ({
          key: String(c.key),
          // Cluster tempat variabel ini dihitung (kolom di tabel dikelompokkan per cluster).
          kelompok: dynamicCategories.find((cat) => cat.columns.includes(c.key))?.name ?? 'Lainnya',
        })),
    [allColumnDefinitions, visibleColumns, dynamicCategories, customColumns],
  );

  const kunciBerbobot = useMemo(() => kolomBerbobot.map((k) => k.key), [kolomBerbobot]);

  /** Bobot yang berlaku per variabel yang ikut ranking: yang diubah pengguna, selain itu 1. */
  const bobotEfektif = useMemo<Record<string, number>>(
    () => Object.fromEntries(kunciBerbobot.map((k) => [k, bobotVar[k] ?? BOBOT_BAWAAN])),
    [bobotVar, kunciBerbobot],
  );
  const bobotClusterDari = (nama: string) => bobotCluster[nama] ?? BOBOT_BAWAAN;
  /** Nama cluster yang punya variabel berbobot (hanya merekalah yang punya skor, jadi punya bobot). */
  const klasterBerbobot = useMemo(() => [...new Set(kolomBerbobot.map((k) => k.kelompok))], [kolomBerbobot]);
  const adaBobotDiubah =
    kunciBerbobot.some((k) => (bobotVar[k] ?? BOBOT_BAWAAN) !== BOBOT_BAWAAN) ||
    klasterBerbobot.some((n) => bobotClusterDari(n) !== BOBOT_BAWAAN);

  /**
   * Nilai satu variabel untuk satu orang, dalam skala 0–100; `null` bila tidak ada datanya.
   *
   * Tiga skor utama dibaca lewat RUMUS YANG SAMA dengan kartu Compare (`hitungSkor3C`), bukan dari
   * kolom bertipe yang dulu menjatuhkan nilai kosong jadi 0 — jadi angka di kedua tampilan tak bisa
   * menyimpang, dan orang tanpa data tidak dihukum nol.
   */
  const nilaiSkala100 = (employee: Employee, field: string): number | null => {
    const csv = (employee as any).csvFields as Record<string, string> | undefined;
    if (field.startsWith('csv:')) {
      return csvKe100(field.slice(4), csv?.[field.slice(4)]);
    }
    if (csv) {
      if (field === 'competencyMatch') {
        const s3 = hitungSkor3C(csv);
        return s3.adaCapability ? s3.capability : null;
      }
      if (field === 'engagementScore') {
        const s3 = hitungSkor3C(csv);
        return s3.adaCommitment ? s3.commitment : null;
      }
      if (field === 'performanceRating') return hitungSkor3C(csv).contribution;
      if (field === 'potentialRating') return csvKe100('Potensi', csv['Potensi']);
    }
    const kolomPh = kolomTambahan.find((col) => col.key === field);
    if (kolomPh) {
      return ke100Tambahan(
        sebagaiTipeTambahan(kolomPh.tipeData ?? 'string'),
        customColumnData[employee.id]?.[field],
        employees.map((e) => customColumnData[e.id]?.[field]),
      );
    }
    const isCustomColumn = customColumns.some((col) => col.key === field);
    const raw = isCustomColumn ? customColumnData[employee.id]?.[field] : employee[field as keyof Employee];
    if (raw === null || raw === undefined || raw === '') return null;
    return normalizeValue(raw, field, employees);
  };

  /**
   * Skor tiap cluster untuk satu orang: rata-rata tertimbang variabel yang tampil di cluster itu (0–100),
   * atau null bila tak ada datanya. Cluster tidak dibobot; bobot hanya milik variabel.
   */
  const skorPerCluster = (employee: Employee): Record<string, number | null> => {
    const hasil: Record<string, number | null> = {};
    for (const nama of new Set(kolomBerbobot.map((k) => k.kelompok))) {
      hasil[nama] = skorCluster(
        kolomBerbobot
          .filter((k) => k.kelompok === nama)
          .map((k) => ({ nilai: nilaiSkala100(employee, k.key), bobot: bobotEfektif[k.key] ?? BOBOT_BAWAAN })),
      );
    }
    return hasil;
  };

  // Skor akhir (ranking) 0–100: rata-rata tertimbang skor semua cluster yang punya data.
  const calculateRankingScore = (employee: Employee): number => {
    const per = skorPerCluster(employee);
    const nama = Object.keys(per);
    return skorAkhir(nama.map((n) => per[n]), nama.map(bobotClusterDari));
  };

  // Variabel BERBOBOT yang datanya kosong untuk seorang karyawan (penanda di kolom Ranking).
  const getMissingWeightedColumns = (employee: Employee): string[] =>
    kolomBerbobot
      .filter((k) => nilaiSkala100(employee, k.key) === null)
      .map((k) => allColumnDefinitions.find((c) => String(c.key) === k.key)?.label ?? k.key);


  // Apply filters and sorting
  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...employees];

    // Apply "Show Only" filter
    if (showOnlyIds !== null) {
      result = result.filter((e) => showOnlyIds.includes(e.id));
    }

    // Apply "Hide" filter
    if (hiddenEmployeeIds.length > 0) {
      result = result.filter((e) => !hiddenEmployeeIds.includes(e.id));
    }

    // Apply employee selection filter (if any employees are selected)
    if (selectedEmployeeIds.length > 0) {
      result = result.filter((e) => selectedEmployeeIds.includes(e.id));
    }

    // Apply search
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(term) ||
          e.role.toLowerCase().includes(term) ||
          e.skills.some((s) => s.toLowerCase().includes(term))
      );
    }

    // Apply new filter conditions if exists
    if (activeFilterConditions.length > 0) {
      const validConditions = activeFilterConditions.filter(c => c.field !== null);
      
      if (validConditions.length > 0) {
        result = result.filter(employee => {
          if (matchMode === 'all') {
            // All conditions must match
            return validConditions.every(condition => checkConditionMatch(employee, condition));
          } else {
            // Any condition must match
            return validConditions.some(condition => checkConditionMatch(employee, condition));
          }
        });
      }
    }

    // Apply category filters
    if (filters.department.length > 0) {
      result = result.filter((e) => filters.department.includes(e.department));
    }

    if (filters.level.length > 0) {
      result = result.filter((e) => filters.level.includes(e.level));
    }

    if (filters.flightRisk.length > 0) {
      result = result.filter((e) => filters.flightRisk.includes(e.flightRisk));
    }

    if (filters.criticalRole !== null) {
      result = result.filter((e) => e.criticalRole === filters.criticalRole);
    }

    if (filters.successorIdentified !== null) {
      result = result.filter((e) => e.successorIdentified === filters.successorIdentified);
    }

    if (filters.personality.length > 0) {
      result = result.filter((e) => e.personality && filters.personality.includes(e.personality));
    }

    if (filters.leadershipType.length > 0) {
      result = result.filter((e) => e.leadershipType && filters.leadershipType.includes(e.leadershipType));
    }

    // Helper function to check numeric filter condition
    const checkNumericCondition = (value: number, condition: FilterCondition): boolean => {
      if (!condition.operator || condition.value === null) return true;
      
      switch (condition.operator) {
        case '>':
          return value > condition.value;
        case '>=':
          return value >= condition.value;
        case '<':
          return value < condition.value;
        case '<=':
          return value <= condition.value;
        case '=':
          return value === condition.value;
        case 'between':
          return condition.value2 !== null && value >= condition.value && value <= condition.value2;
        default:
          return true;
      }
    };

    // Apply numeric condition filters
    result = result.filter((e) => checkNumericCondition(e.performanceRating, filters.performanceRating));
    result = result.filter((e) => checkNumericCondition(e.potentialRating, filters.potentialRating));
    result = result.filter((e) => checkNumericCondition(e.readinessLevel, filters.readinessLevel));
    result = result.filter((e) => checkNumericCondition(e.timeInRole, filters.timeInRole));
    result = result.filter((e) => checkNumericCondition(e.engagementScore, filters.engagementScore));
    result = result.filter((e) => checkNumericCondition(e.salary, filters.salary));
    result = result.filter((e) => !e.iqScore || checkNumericCondition(e.iqScore, filters.iqScore));

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
          return sortDirection === 'asc' 
            ? (aVal === bVal ? 0 : aVal ? 1 : -1)
            : (aVal === bVal ? 0 : aVal ? -1 : 1);
        }

        return 0;
      });
    }

    return result;
  }, [employees, filters, sortField, sortDirection, activeFilterConditions, matchMode, selectedEmployeeIds, hiddenEmployeeIds, showOnlyIds]);

  // Calculate employees with rankings
  const employeesWithRanking = useMemo(() => {
    // First, calculate scores and assign rankings based on score
    const withScores = filteredAndSortedEmployees.map(emp => ({
      employee: emp,
      score: calculateRankingScore(emp),
    }));

    // Create a sorted version just to determine rankings
    const sortedByScore = [...withScores].sort((a, b) => b.score - a.score);
    
    // Create a map of employee ID to ranking
    const rankingMap = new Map<string, number>();
    sortedByScore.forEach((item, index) => {
      rankingMap.set(item.employee.id, index + 1);
    });

    // Add ranking and score to employees
    let result = filteredAndSortedEmployees.map(emp => ({
      ...emp,
      ranking: rankingMap.get(emp.id) || 0,
      score: calculateRankingScore(emp),
    }));

    // If sorting by ranking, re-sort the result
    if (sortField === 'ranking') {
      result.sort((a, b) => {
        return sortDirection === 'asc' ? a.ranking - b.ranking : b.ranking - a.ranking;
      });
    }

    return result;
  }, [filteredAndSortedEmployees, columnWeights, bobotEfektif, bobotCluster, visibleColumns, sortField, sortDirection, customColumnData, dynamicCategories, allColumnDefinitions, customColumns, employees]);

  // Sync rankings to localStorage so Compare tab can read the same ranking
  useEffect(() => {
    const rankMap: Record<string, number> = {};
    employeesWithRanking.forEach(emp => { rankMap[emp.id] = emp.ranking; });
    try { localStorage.setItem('tableRankings', JSON.stringify(rankMap)); } catch {}
  }, [employeesWithRanking]);

  // Sync visible employee IDs so Compare tab mirrors Table's active filter
  useEffect(() => {
    const ids = filteredAndSortedEmployees.map(e => e.id);
    /*
      `localStorage` DIPERTAHANKAN: layar lain (Talent Mapping) masih membacanya, dan
      ia juga yang membuat keadaan filter bertahan melewati muat ulang halaman.
      Yang ditambahkan panggilan ke atas — itu yang benar-benar membuat Compare ikut
      berubah, karena menulis localStorage tidak memicu render ulang siapa pun.
    */
    try { localStorage.setItem('tableVisibleEmployeeIds', JSON.stringify(ids)); } catch {}
    onVisibleIdsChange?.(ids);
  }, [filteredAndSortedEmployees, onVisibleIdsChange]);

  // Add cluster scores to employees
  const employeesWithClusterScores = useMemo(() => {
    let result = employeesWithRanking.map(emp => {
      // Total Score tiap cluster = skor tertimbang variabel yang tampil di dalamnya — angka yang SAMA yang
      // dirata-ratakan jadi skor akhir/ranking. Tanpa data → 0 (kolom ini angka, bukan "No Data").
      const skor = skorPerCluster(emp);
      const totalCluster = (key: string) => {
        const nama = dynamicCategories.find((c) => c.totalScoreKey === key)?.name;
        const v = nama ? skor[nama] : null;
        return v === null || v === undefined ? 0 : Math.round(v);
      };
      return {
        ...emp,
        competencyScore: totalCluster('competencyScore'),
        commitmentScore: totalCluster('commitmentScore'),
        contributionScore: totalCluster('contributionScore'),
        aspectScore: totalCluster('aspectScore'),
        generalScore: totalCluster('generalScore'),
        technicalScore: totalCluster('technicalScore'),
        additionalScore: totalCluster('additionalScore'),
      };
    });

    // If sorting by cluster scores, re-sort the result
    if (['competencyScore', 'commitmentScore', 'contributionScore', 'aspectScore', 'generalScore', 'technicalScore', 'additionalScore'].includes(sortField as string)) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    // Pinned employees always float to top
    if (pinnedTableIds.length > 0) {
      const pinned = result.filter(e => pinnedTableIds.includes(e.id));
      const unpinned = result.filter(e => !pinnedTableIds.includes(e.id));
      // Maintain pin order
      pinned.sort((a, b) => pinnedTableIds.indexOf(a.id) - pinnedTableIds.indexOf(b.id));
      result = [...pinned, ...unpinned];
    }

    return result;
  }, [employeesWithRanking, sortField, sortDirection, visibleColumns, columnWeights, customColumnData, dynamicCategories, customColumns, pinnedTableIds]);

  // Save current table state to localStorage whenever it changes
  useEffect(() => {
    const tableState = {
      filters,
      sortField,
      sortDirection,
      visibleColumns: Array.from(visibleColumns),
      employeeIds: filteredAndSortedEmployees.map(e => e.id),
      selectedEmployeeIds,
      activeFilterConditions,
      matchMode,
      columnWeights,
      bobotVar,
      bobotCluster,
      bobotVersion: 3,
      clusterTotalSlotOverride,
      columnDefaultsVersion: COLUMN_DEFAULTS_VERSION,
    };
    localStorage.setItem('currentTableState', JSON.stringify(tableState));
  }, [filters, sortField, sortDirection, visibleColumns, filteredAndSortedEmployees, selectedEmployeeIds, activeFilterConditions, matchMode, columnWeights, bobotVar, bobotCluster, clusterTotalSlotOverride]);

  // Persist pinned IDs locally only when not managed by parent
  useEffect(() => {
    if (!onPinnedIdsChange) {
      localStorage.setItem('shared_pinned', JSON.stringify(pinnedTableIds));
    }
  }, [pinnedTableIds, onPinnedIdsChange]);

  const toggleTablePin = (id: string) => {
    setPinnedTableIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [id, ...prev]
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      // Ranking: klik pertama = peringkat teratas dulu (1, 2, 3, …); klik kedua = terbawah dulu. Kolom skor
      // lain: nilai tertinggi dulu.
      setSortDirection(field === 'ranking' ? 'asc' : 'desc');
    }
  };

  const toggleEmployeeSelection = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  // Handle add category
  const handleAddCategory = () => {
    if (!categoryInput.trim()) return;
    if (newColumnCategories.includes(categoryInput.trim())) return; // Avoid duplicates
    
    setNewColumnCategories(prev => [...prev, categoryInput.trim()]);
    setCategoryInput('');
  };

  // Handle remove category
  const handleRemoveCategory = (category: string) => {
    setNewColumnCategories(prev => prev.filter(c => c !== category));
  };

  // Handle save custom column
  const handleSaveCustomColumn = () => {
    if (!newColumnName.trim()) return;
    
    // Validate categories for categorical type
    if (newColumnType === 'categorical' && newColumnCategories.length === 0) {
      return; // Don't save if no categories defined
    }

    const columnKey = `custom_${Date.now()}`;
    const newColumn: ColumnConfig = {
      key: columnKey as ColumnKey,
      label: newColumnName,
      sortable: true,
      defaultVisible: true,
      isCustom: true,
      customType: newColumnType,
      cluster: newColumnCluster,
      ...(newColumnType === 'categorical' && { categories: newColumnCategories }),
    };

    const updatedColumns = [...customColumnsLokal, newColumn];
    setCustomColumns(updatedColumns);
    localStorage.setItem('customColumns', JSON.stringify(updatedColumns));

    // Add to visible columns
    setVisibleColumns(prev => new Set([...prev, columnKey]));

    // Add default weight for custom column
    setColumnWeights(prev => ({
      ...prev,
      [columnKey]: 1
    }));

    // Reset dialog
    setNewColumnName('');
    setNewColumnType('text');
    setNewColumnCategories([]);
    setCategoryInput('');
    setNewColumnCluster('custom');
    setIsAddColumnDialogOpen(false);
  };

  // Handle delete custom column
  const handleDeleteCustomColumn = (columnKey: string) => {
    // Show confirmation dialog
    setColumnToDelete(columnKey);
    setIsDeleteConfirmOpen(true);
  };

  // Confirm delete custom column
  const confirmDeleteCustomColumn = () => {
    if (!columnToDelete) return;

    // Remove from custom columns
    const updatedColumns = customColumnsLokal.filter(col => col.key !== columnToDelete);
    setCustomColumns(updatedColumns);
    localStorage.setItem('customColumns', JSON.stringify(updatedColumns));

    // Remove from visible columns
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      newSet.delete(columnToDelete);
      return newSet;
    });

    // Remove data for this column from all employees
    const updatedData = { ...customColumnDataLokal };
    Object.keys(updatedData).forEach(employeeId => {
      if (updatedData[employeeId][columnToDelete] !== undefined) {
        delete updatedData[employeeId][columnToDelete];
      }
    });
    setCustomColumnData(updatedData);
    localStorage.setItem('customColumnData', JSON.stringify(updatedData));

    // Remove from column weights
    setColumnWeights(prev => {
      const newWeights = { ...prev };
      delete newWeights[columnToDelete];
      return newWeights;
    });

    // Close dialog and reset state
    setIsDeleteConfirmOpen(false);
    setColumnToDelete(null);
  };

  // Handle update custom column data for employee
  const handleUpdateCustomData = (employeeId: string, columnKey: string, value: any) => {
    setCustomColumnData(prev => {
      const updated = {
        ...prev,
        [employeeId]: {
          ...(prev[employeeId] || {}),
          [columnKey]: value,
        },
      };
      localStorage.setItem('customColumnData', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCompare = () => {
    const ids = selectedEmployees.join(',');
    navigate(`/comparison?ids=${ids}`);
  };

  const handleAddToDecision = () => {
    if (!decisionStatus || !selectedEmployees.length) return;

    // Load existing decisions
    const saved = localStorage.getItem('talentDecisions');
    const existingDecisions = saved ? JSON.parse(saved) : [];

    // Create new decisions for each selected employee
    const newDecisions = selectedEmployees.map((employeeId) => {
      const employee = mockEmployees.find(e => e.id === employeeId);
      if (!employee) return null;

      return {
        employeeId,
        status: decisionStatus,
        notes: decisionNotes,
        followUpActions: [],
        timeline: decisionTimeline,
        decidedBy: 'Talent Committee',
        decidedDate: new Date().toISOString(),
      };
    }).filter(d => d !== null);

    // Merge with existing decisions (avoid duplicates by employeeId)
    const existingEmployeeIds = new Set(existingDecisions.map((d: any) => d.employeeId));
    const decisionsToAdd = newDecisions.filter(d => !existingEmployeeIds.has((d as any).employeeId));
    
    const updatedDecisions = [...existingDecisions, ...decisionsToAdd];
    localStorage.setItem('talentDecisions', JSON.stringify(updatedDecisions));

    // Update the employeesWithDecisions state immediately
    const allEmployeeIds = new Set(updatedDecisions.map((d: any) => d.employeeId));
    setEmployeesWithDecisions(allEmployeeIds);

    // Reset form and close dialog
    setDecisionStatus('promotion');
    setDecisionNotes('');
    setDecisionTimeline('');
    setIsAddDecisionDialogOpen(false);
    
    // Clear selection
    setSelectedEmployees([]);
    
    // Navigate to decisions page
    navigate(`/decisions`);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleAllClusterScores = () => {
    const clusterScoreKeys = ['competencyScore', 'commitmentScore', 'contributionScore'];
    const allVisible = clusterScoreKeys.every(key => visibleColumns.has(key));
    
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (allVisible) {
        // Hide all cluster scores
        clusterScoreKeys.forEach(key => newSet.delete(key));
      } else {
        // Show all cluster scores
        clusterScoreKeys.forEach(key => newSet.add(key));
      }
      return newSet;
    });
  };

  const areAllClusterScoresVisible = () => {
    const clusterScoreKeys = ['competencyScore', 'commitmentScore', 'contributionScore'];
    return clusterScoreKeys.every(key => visibleColumns.has(key));
  };

  // Visible Columns Dialog functions
  const handleApplyVisibleColumns = (columns: Set<string>) => {
    setVisibleColumns(columns);
    // Save to localStorage
    localStorage.setItem('visibleColumns', JSON.stringify(Array.from(columns)));
  };

  const savePreset = () => {
    if (!presetName.trim()) return;

    const newPreset: FilterPreset = {
      id: Date.now().toString(),
      name: presetName,
      filters: { ...filters },
      visibleColumns: new Set(visibleColumns),
      clusterTotalSlotOverride: { ...clusterTotalSlotOverride },
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    
    // Save to localStorage
    localStorage.setItem('talentScreenerPresets', JSON.stringify(
      updatedPresets.map(p => ({
        ...p,
        visibleColumns: Array.from(p.visibleColumns),
        clusterTotalSlotOverride: p.clusterTotalSlotOverride,
      }))
    ));

    setPresetName('');
    setIsPresetDialogOpen(false);
  };

  const loadPreset = (preset: FilterPreset) => {
    setFilters(preset.filters);
    setVisibleColumns(new Set(preset.visibleColumns));
    setClusterTotalSlotOverride(
      preset.clusterTotalSlotOverride ? { ...preset.clusterTotalSlotOverride } : {}
    );
    /*
      Preset simpanan JUGA mengubah label tombol. Dulu hanya preset bawaan yang
      mengabarkan namanya, dan itu tak kentara selama namanya cuma dipakai judul
      halaman yang jarang dilirik. Sejak nama itu jadi nama tombolnya sendiri,
      diamnya langsung terlihat salah: memilih preset simpanan akan meninggalkan
      tombol yang masih menyebut preset sebelumnya.
    */
    pilihPreset(preset.name);
  };

  const applyDefaultPreset = (presetType: keyof typeof defaultColumnPresets) => {
    const presetColumns = defaultColumnPresets[presetType];
    // Validate: only include columns that exist in columnDefinitions
    // Exclude computed properties like 'score' and 'ranking'
    const validColumns = Array.from(presetColumns).filter(colKey =>
      colKey !== 'score' && colKey !== 'ranking' && allColumnDefinitions.some(col => col.key === colKey)
    );
    setVisibleColumns(new Set(validColumns));
    // Save to localStorage
    localStorage.setItem('visibleColumns', JSON.stringify(validColumns));
    pilihPreset(presetLabels[presetType]);
  };

  const deletePreset = (id: string) => {
    const updatedPresets = presets.filter(p => p.id !== id);
    setPresets(updatedPresets);
    /*
      Kalau yang dihapus adalah preset yang sedang aktif, namanya ikut dilepas —
      kolomnya dibiarkan apa adanya (menghapus preset bukan permintaan mengubah
      tampilan), tapi tombolnya tak boleh terus menyebut preset yang sudah tak ada.
    */
    if (presets.find(p => p.id === id)?.name === labelPresetAktif) {
      setLabelPresetAktif(null);
      try { localStorage.removeItem('tdpPresetAktif'); } catch { /* mode privat */ }
    }
    localStorage.setItem('talentScreenerPresets', JSON.stringify(
      updatedPresets.map(p => ({
        ...p,
        visibleColumns: Array.from(p.visibleColumns),
        clusterTotalSlotOverride: p.clusterTotalSlotOverride,
      }))
    ));
  };

  // Download Excel Template
  const downloadTemplate = () => {
    // Define column structure grouped by cluster
    const competencyColumns = [
      { key: 'potentialRating', label: 'Potensi Rating' },
      { key: 'iqScore', label: 'IQ Score' },
      // Aspect sub-cluster
      { key: 'leadership', label: 'Leadership' },
      { key: 'communication', label: 'Communication' },
      { key: 'problemSolving', label: 'Problem Solving' },
      { key: 'teamwork', label: 'Teamwork' },
      { key: 'adaptability', label: 'Adaptability' },
      { key: 'strategicThinking', label: 'Strategic Thinking' },
      { key: 'decisionMaking', label: 'Decision Making' },
      { key: 'innovation', label: 'Innovation' },
      { key: 'analyticalSkills', label: 'Analytical Skills' },
      { key: 'readinessLevel', label: 'Readiness Level' },
    ];

    const commitmentColumns = [
      { key: 'engagementScore', label: 'Engagement Score' },
      { key: 'accountability', label: 'Accountability' },
      { key: 'flightRisk', label: 'Flight Risk' },
      { key: 'timeInRole', label: 'Tenure (months)' },
    ];

    const contributionColumns = [
      { key: 'performanceRating', label: 'Performance Rating' },
      { key: 'criticalRole', label: 'Critical Position' },
      { key: 'successorIdentified', label: 'Successor Identified' },
      { key: 'salary', label: 'Salary' },
    ];

    // Build header row with cluster grouping
    const headers = [
      'Employee ID',
      'Name',
      'Position',
      'Department',
      'Level',
      'Years In Company',
      'Years In Role',
      'Manager',
      'Photo URL',
      'Skills (comma separated)',
      'Certifications (comma separated)',
      'Education',
      'Last Promotion Date',
      'Personality (DISC)',
      'Leadership Type',
      ...competencyColumns.map(c => `[COMPETENCY] ${c.label}`),
      ...commitmentColumns.map(c => `[Commitment] ${c.label}`),
      ...contributionColumns.map(c => `[Contribution] ${c.label}`),
    ];

    // Create empty template row with sample data as guidance
    const sampleRow = [
      'EMP001',
      'John Doe',
      'Senior Software Engineer',
      'Engineering',
      'L5',
      '3.5',
      '2.0',
      'Manager Name',
      'https://example.com/photo.jpg',
      'React, TypeScript, Leadership',
      'AWS Solutions Architect, Scrum Master',
      'MS Computer Science - Stanford',
      '2023-01-15',
      'D',
      'Transformational',
      ...competencyColumns.map(() => ''),
      ...commitmentColumns.map(() => ''),
      ...contributionColumns.map(() => ''),
    ];

    const data = [headers, sampleRow];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    ws['!cols'] = headers.map(() => ({ wch: 20 }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Data');

    // Download file
    XLSX.writeFile(wb, `HR_Talent_Template_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Handle File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length < 2) {
          alert('Excel file is empty or has no data rows');
          return;
        }

        const headers = jsonData[0];
        const rows = jsonData.slice(1);

        // Ignore fully empty rows from Excel so they are not imported
        const nonEmptyRows = rows.filter((row) =>
          Array.isArray(row) &&
          row.some((cell) => {
            if (cell === null || cell === undefined) return false;
            if (typeof cell === 'string') return cell.trim() !== '';
            return true; // keep numbers (including 0), booleans, dates, etc.
          })
        );

        const normalizeHeader = (header: any) =>
          String(header ?? '').trim().toLowerCase();
        const parseBracketHeader = (header: any) => {
          const raw = String(header ?? '').trim();
          const match = raw.match(/^\[([^\]]+)\]\s*(.+)$/);
          if (!match) return null;
          return {
            cluster: match[1].trim().toLowerCase(),
            aspectName: match[2].trim(),
          };
        };

        const baseHeaderKeywords = [
          'employee id',
          'name',
          'position',
          'department',
          'level',
          'years in company',
          'years in role',
          'manager',
          'photo',
          'skills',
          'certifications',
          'education',
          'last promotion date',
          'personality',
          'leadership type',
        ];

        const knownClusterAspects: Record<string, string[]> = {
          competency: [
            'potensi',
            'iq score',
            'leadership',
            'communication',
            'problem solving',
            'teamwork',
            'adaptability',
            'strategic thinking',
            'decision making',
            'innovation',
            'analytical skills',
            'readiness level',
          ],
          commitment: ['tenure', 'engagement', 'flight risk', 'accountability'],
          contribution: ['performance', 'salary', 'critical position', 'successor'],
        };

        const isKnownHeader = (header: any) => {
          const normalized = normalizeHeader(header);
          if (!normalized) return true;
          const bracket = parseBracketHeader(header);
          if (bracket) {
            const knownAspects = knownClusterAspects[bracket.cluster] || [];
            const normalizedAspect = bracket.aspectName.toLowerCase();
            return knownAspects.some((aspect) => normalizedAspect.includes(aspect));
          }
          return baseHeaderKeywords.some((keyword) => normalized.includes(keyword));
        };

        const extraHeaders = headers
          .map((header: any, index: number) => ({ header, index }))
          .filter(({ header }) => !isKnownHeader(header));

        const toColumnKey = (headerLabel: string, cluster?: string) =>
          `custom_excel_${cluster ? `${cluster}_` : ''}${headerLabel
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '')}`;

        const normalizeCluster = (cluster?: string): ColumnConfig['cluster'] => {
          const c = (cluster || '').toLowerCase();
          if (c === 'competency' || c === 'commitment' || c === 'contribution' || c === 'aspect') {
            return c;
          }
          return 'custom';
        };

        const inferredCustomColumns: ColumnConfig[] = extraHeaders.map(({ header, index }) => {
          const parsed = parseBracketHeader(header);
          const label = parsed ? parsed.aspectName : String(header).trim();
          const cluster = normalizeCluster(parsed?.cluster);
          const clusterName =
            cluster === 'custom' && parsed?.cluster
              ? parsed.cluster
                  .split(/[\s_-]+/)
                  .filter(Boolean)
                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(' ')
              : undefined;
          const values = nonEmptyRows
            .map((row) => row[index])
            .filter((val) => val !== null && val !== undefined && String(val).trim() !== '');
          const isNumerical = values.length > 0 && values.every((val) => !Number.isNaN(Number(val)));

          return {
            key: toColumnKey(label, parsed?.cluster) as ColumnKey,
            label,
            sortable: true,
            defaultVisible: true,
            isCustom: true,
            customType: isNumerical ? 'numerical' : 'text',
            cluster,
            clusterName,
          };
        });

        const existingByKey = new Map(
          customColumnsLokal.map((col) => [String(col.key), col])
        );
        const newColumns = inferredCustomColumns.filter(
          (col) => !existingByKey.has(String(col.key))
        );
        const allCustomColumns = [...customColumnsLokal, ...newColumns];

        if (newColumns.length > 0) {
          setCustomColumns(allCustomColumns);
          localStorage.setItem('customColumns', JSON.stringify(allCustomColumns));

          setVisibleColumns((prev) => {
            const next = new Set(prev);
            inferredCustomColumns.forEach((col) => next.add(col.key));
            return next;
          });
        }

        // Parse employees
        const parsedEmployees: Employee[] = nonEmptyRows.map((row, index) => {
          const getCell = (label: string): any => {
            const colIndex = headers.findIndex((h: string) =>
              h?.toString().toLowerCase().includes(label.toLowerCase())
            );
            return colIndex >= 0 ? row[colIndex] : null;
          };

          const getCellByCluster = (cluster: string, label: string): any => {
            const colIndex = headers.findIndex((h: string) =>
              h?.toString().toLowerCase().includes(`[${cluster}]`) &&
              h?.toString().toLowerCase().includes(label.toLowerCase())
            );
            return colIndex >= 0 ? row[colIndex] : null;
          };

          // Helper to parse number or return null
          const parseNumber = (val: any): number | undefined => {
            if (val === null || val === undefined || val === '') return undefined;
            const num = Number(val);
            return isNaN(num) ? undefined : num;
          };

          // Helper to parse boolean
          const parseBoolean = (val: any): boolean => {
            if (typeof val === 'boolean') return val;
            const str = String(val).toLowerCase();
            return str === 'true' || str === 'yes' || str === '1';
          };

          return {
            id: getCell('employee id') || `EMP${String(index + 1).padStart(3, '0')}`,
            name: getCell('name') || 'No Data',
            role: getCell('position') || 'No Data',
            department: getCell('department') || 'No Data',
            level: getCell('level') || 'No Data',
            performanceRating: parseNumber(getCellByCluster('contribution', 'performance')) || 0,
            potentialRating: parseNumber(getCellByCluster('competency', 'potensi')) || 0,
            yearsInCompany: parseNumber(getCell('years in company')) || 0,
            yearsInRole: parseNumber(getCell('years in role')) || 0,
            timeInRole: parseNumber(getCellByCluster('commitment', 'tenure')) || 0,
            skills: getCell('skills')
              ? String(getCell('skills')).split(',').map(s => s.trim())
              : [],
            certifications: getCell('certifications')
              ? String(getCell('certifications')).split(',').map(s => s.trim())
              : [],
            education: getCell('education') || 'No Data',
            flightRisk: (getCellByCluster('commitment', 'flight risk') as 'Low' | 'Medium' | 'High') || 'Medium',
            promotionReadiness: 'Not Ready',
            readinessLevel: parseNumber(getCellByCluster('competency', 'readiness level')) || 0,
            engagementScore: parseNumber(getCellByCluster('commitment', 'engagement')) || 0,
            assessmentScore: 0,
            salary: parseNumber(getCellByCluster('contribution', 'salary')) || 0,
            lastPromotionDate: getCell('last promotion date') || 'No Data',
            criticalRole: parseBoolean(getCellByCluster('contribution', 'critical position')),
            successorIdentified: parseBoolean(getCellByCluster('contribution', 'successor')),
            manager: getCell('manager') || 'No Data',
            // Cadangan LOKAL. Sebelumnya foto orang asing dari Unsplash — diblokir CSP
            // (`img-src`), dan memakai wajah acak sebagai stand-in karyawan juga bukan
            // pilihan yang baik. Berkas yang sama dipakai iProfile untuk maksud yang sama.
            photo: getCell('photo') || '/iprofile-assets/profile-photo.png',
            iqScore: parseNumber(getCellByCluster('competency', 'iq score')),
            personality: getCell('personality'),
            leadershipType: getCell('leadership type'),
            leadership: parseNumber(getCellByCluster('competency', 'leadership')),
            communication: parseNumber(getCellByCluster('competency', 'communication')),
            problemSolving: parseNumber(getCellByCluster('competency', 'problem solving')),
            teamwork: parseNumber(getCellByCluster('competency', 'teamwork')),
            adaptability: parseNumber(getCellByCluster('competency', 'adaptability')),
            strategicThinking: parseNumber(getCellByCluster('competency', 'strategic thinking')),
            decisionMaking: parseNumber(getCellByCluster('competency', 'decision making')),
            innovation: parseNumber(getCellByCluster('competency', 'innovation')),
            analyticalSkills: parseNumber(getCellByCluster('competency', 'analytical skills')),
            accountability: parseNumber(getCellByCluster('commitment', 'accountability')),
          };
        });

        if (inferredCustomColumns.length > 0) {
          const mergedByKey = new Map<string, ColumnConfig>();
          allCustomColumns.forEach((col) => mergedByKey.set(String(col.key), col));

          setCustomColumnData((prev) => {
            const updated = { ...prev };

            nonEmptyRows.forEach((row, index) => {
              const employeeId = parsedEmployees[index]?.id;
              if (!employeeId) return;

              const employeeCustomData = { ...(updated[employeeId] || {}) };

              extraHeaders.forEach(({ header, index: colIndex }) => {
                const parsed = parseBracketHeader(header);
                const headerLabel = parsed ? parsed.aspectName : String(header).trim();
                const targetKey = toColumnKey(headerLabel, parsed?.cluster);
                const targetColumn = mergedByKey.get(targetKey);
                if (!targetColumn) return;

                const value = row[colIndex];
                const isEmpty =
                  value === null ||
                  value === undefined ||
                  (typeof value === 'string' && value.trim() === '');

                if (isEmpty) return;
                employeeCustomData[targetColumn.key] = value;
              });

              updated[employeeId] = employeeCustomData;
            });

            localStorage.setItem('customColumnData', JSON.stringify(updated));
            return updated;
          });
        }

        setEmployees(parsedEmployees);
        localStorage.setItem(EMPLOYEE_UPLOAD_DRAFT_KEY, JSON.stringify(parsedEmployees));
        localStorage.setItem(EMPLOYEE_UPLOAD_FILE_NAME_KEY, file.name);
        setLastUploadedFileName(file.name);
        alert(`Successfully imported ${parsedEmployees.length} employees`);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Failed to parse Excel file. Please check the file format.');
      }
    };

    reader.readAsBinaryString(file);
  };

  /**
   * BERAPA saringan yang sedang benar-benar menyaring.
   *
   * ── Kenapa dihitung, bukan sekadar ya/tidak ──
   *
   * Diminta langsung: penandanya menyebut jumlah, bukan kata "Active". Angka
   * mengatakan hal yang tak bisa dikatakan kata itu — bahwa ADA TIGA, jadi menghapus
   * satu belum membuka daftarnya.
   *
   * ⚠️ Dan yang lama BUKAN cuma kurang informatif, melainkan SELALU menyala.
   * Baris pertamanya `activeFilterConditions.length > 0`, padahal kondisi Employees
   * selalu ada di daftar itu — dibuat `createEmployeeCondition()` saat layar lahir dan
   * dipasang lagi tiap kali keadaan dipulihkan. Jadi panjangnya tak pernah nol, dan
   * lencana "Active" menyala pada halaman yang baru dibuka tanpa satu pun saringan.
   * Terukur: 106 dari 106 karyawan tampil, lencananya tetap menyala.
   *
   * Yang dihitung karena itu keberadaan ISI-nya, bukan keberadaan barisnya: kondisi
   * yang medannya belum dipilih, atau yang nilainya masih kosong, tidak menyaring
   * siapa pun dan tidak boleh ikut dihitung.
   */
  const jumlahFilterAktif =
    activeFilterConditions.filter((c) => {
      if (!c.field) return false;
      if (c.fieldType === 'numerical') return c.operator !== null && c.value !== null;
      return (c.selectedValues?.length ?? 0) > 0;
    }).length +
    // Penyaring lama di luar dialog Filter — masing-masing dihitung satu.
    [
      filters.department.length > 0,
      filters.level.length > 0,
      filters.performanceRating.operator !== null,
      filters.potentialRating.operator !== null,
      filters.readinessLevel.operator !== null,
      filters.timeInRole.operator !== null,
      filters.engagementScore.operator !== null,
      filters.salary.operator !== null,
      filters.iqScore.operator !== null,
      filters.flightRisk.length > 0,
      filters.criticalRole !== null,
      filters.successorIdentified !== null,
      filters.personality.length > 0,
      filters.leadershipType.length > 0,
      filters.searchTerm !== '',
    ].filter(Boolean).length;

  const hasActiveFilters = jumlahFilterAktif > 0;

  // Keep the latest upload as recoverable draft across tab close/navigation
  useEffect(() => {
    localStorage.setItem(EMPLOYEE_UPLOAD_DRAFT_KEY, JSON.stringify(employees));
  }, [employees]);

  // Send Columns button to parent (view-specific toolbar)
  useEffect(() => {
    if (onToolbarRender) {
      onToolbarRender(
        /*
          `size="compact-sm"` (26px) atas permintaan eksplisit. Aturan di
          `prodigyFoundation.ts` menuntut alasannya disebut di tempat pakainya:
          ketiga tombol toolbar ini penyetel TAMPILAN (kolom, saringan, preset),
          bukan aksi utama layar, dan barisnya juga menampung kotak pencarian
          setinggi 36px — dengan `sm` ketiganya tampak sederajat dengan medan isian
          itu. Berlaku untuk ketiganya di kedua tampilan, tidak untuk tombol lain.
        */
        /*
          Ketiga tombol toolbar (Data Visibility, Filters, Presets) kini tombol IKON dengan tooltip: baris ini
          sempit dan labelnya berulang di tiap layar. `aria-label` membawa nama untuk pembaca layar.
        */
        <Tooltip label="Data Visibility" withArrow>
          <DSActionIcon
            variant="subtle"
            color="primary"
            size="lg"
            radius="xl"
            aria-label="Data Visibility"
            onClick={() => setIsVisibleColumnsDialogOpen(true)}
          >
            <Columns3 className="w-4 h-4" />
          </DSActionIcon>
        </Tooltip>
      );
    }
    return () => onToolbarRender?.(null);
  }, [onToolbarRender, dynamicCategories, clusterTotalSlotOverride, allColumnDefinitions]);

  // Send Filter + Preset buttons to shared toolbar (always visible across tabs)
  useEffect(() => {
    if (!onSharedToolbarRender) return;
    const sharedButtons = (
      <div className="flex gap-3">
          {/*
            Filter Button.

            Lencananya memakai `Tag`, BUKAN `Badge size="xs"`. Skala `size` Badge
            berjalan sendiri — xs 9, sm 10, md 11, lg 13, xl 16 — dan tak satu pun ada
            di skala huruf theme; `size="xs"` menggambar 9px. `Tag` membaca ukurannya
            dari token theme, dan justru itu alasan ia dibuat.

            `bulat` + `padat` + `warnaDS="primary"`: gelembung angka biru padat.
            Ketiganya sudah ada artinya di `Tag` — `bulat` memang ditulis di sana
            untuk "gelembung ANGKA, misalnya jumlah filter aktif di dalam tombol
            Filter", dan `primary` adalah biru design system (#016699), biru yang sama
            dengan tombol Compare. Bukan `info` (#30e5fd, sian — teks putih di atasnya
            nyaris tak terbaca) dan bukan `blue` (palet bawaan Mantine, bukan token
            merek).

            Padat, bukan `light` yang jadi bawaan `Tag`: pil ini duduk DI DALAM sebuah
            tombol, dan latar pucat di situ lebur dengan latar tombolnya sendiri.
          */}
          <Tooltip label={hasActiveFilters ? `Filters (${jumlahFilterAktif} active)` : 'Filters'} withArrow>
            <div className="relative inline-flex">
              <DSActionIcon
                /* Ghost = variant="subtle" (tabel intent di dokumentasi Button design system). */
                variant="subtle"
                color="primary"
                size="lg"
                radius="xl"
                aria-label={hasActiveFilters ? `Filters, ${jumlahFilterAktif} active` : 'Filters'}
                onClick={() => setIsFilterDialogOpen(true)}
              >
                <Filter className="w-4 h-4" />
              </DSActionIcon>
              {hasActiveFilters && (
                // Gelembung jumlah filter aktif di sudut ikon (`Tag` bulat padat, lihat catatan di atas).
                <span className="absolute -top-1 -right-1 pointer-events-none">
                  <Tag warnaDS="primary" padat bulat label={`${jumlahFilterAktif} filter aktif`}>
                    {jumlahFilterAktif}
                  </Tag>
                </span>
              )}
            </div>
          </Tooltip>


          {/* Preset Manager */}
          <Popover
            opened={isPresetPopoverOpen}
            onChange={(open) => { setIsPresetPopoverOpen(open); if (!open) setPresetSearch(''); }}
            position="bottom-end"
            shadow="md"
          >
            <Popover.Target>
              {/*
                Nama tombol mengikuti preset yang aktif; "Presets" hanya dipakai saat
                belum ada yang dipilih. `title` membawa nama utuhnya karena nama preset
                simpanan diketik bebas dan bisa lebih panjang dari tombolnya.
              */}
              <Tooltip label={labelPresetAktif ?? 'Presets'} withArrow>
                <DSActionIcon
                  variant={labelPresetAktif ? 'light' : 'subtle'}
                  color="primary"
                  size="lg"
                  radius="xl"
                  aria-label={labelPresetAktif ?? 'Presets'}
                  onClick={() => setIsPresetPopoverOpen((o) => !o)}
                >
                  <Bookmark className="w-4 h-4" />
                </DSActionIcon>
              </Tooltip>
            </Popover.Target>
            <Popover.Dropdown w={220} p={0} style={{ overflow: 'hidden' }}>
              {/* Search */}
              <div className="px-3 py-2 border-b border-[#dee2e6]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={presetSearch}
                    onChange={(e) => setPresetSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#dee2e6] rounded-full bg-[#f8f9fa] outline-none placeholder-[#adb5bd]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                </div>
              </div>

              <div className="max-h-[320px] overflow-y-auto py-1">
                {/* General Criteria section */}
                {(!presetSearch || 'General'.toLowerCase().includes(presetSearch.toLowerCase())) && (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <Text span size="xs" fw={600} c="neutral.5" style={{ whiteSpace: 'nowrap' }}>General Criteria</Text>
                      <div className="flex-1 h-px bg-[#dee2e6]" />
                    </div>
                    <button
                      className="w-full text-left px-3 py-2 text-xs font-normal text-[#495057] hover:bg-[#f8f9fa] transition-colors"
                      style={{ fontFamily: 'var(--font-body)' }}
                      onClick={() => { applyDefaultPreset('generalCriteria'); setIsPresetPopoverOpen(false); setPresetSearch(''); }}
                    >
                      General
                    </button>
                  </>
                )}

                {/* Job Criteria section */}
                {[
                  { key: 'productDesigner' as const, label: 'Product Designer' },
                  { key: 'engineer' as const,        label: 'Engineer' },
                  { key: 'sales' as const,           label: 'Sales' },
                  { key: 'marketing' as const,       label: 'Marketing' },
                  { key: 'operationsManager' as const,label: 'Operations Manager' },
                  { key: 'finance' as const,         label: 'Finance' },
                  { key: 'hrPeopleOps' as const,     label: 'HR / People Ops' },
                  { key: 'businessAnalyst' as const, label: 'Business Analyst' },
                  { key: 'dataAnalyst' as const,     label: 'Data Analyst' },
                ].filter(({ label }) => !presetSearch || label.toLowerCase().includes(presetSearch.toLowerCase()))
                  .reduce<React.ReactElement[]>((acc, { key, label }, idx) => {
                    if (idx === 0) {
                      acc.push(
                        <div key="job-criteria-header" className="flex items-center gap-2 px-3 py-1.5 mt-1">
                          <Text span size="xs" fw={600} c="neutral.5" style={{ whiteSpace: 'nowrap' }}>Job Criteria</Text>
                          <div className="flex-1 h-px bg-[#dee2e6]" />
                        </div>
                      );
                    }
                    acc.push(
                      <button
                        key={key}
                        className="w-full text-left px-3 py-2 text-xs font-normal text-[#495057] hover:bg-[#f8f9fa] transition-colors"
                        style={{ fontFamily: 'var(--font-body)' }}
                        onClick={() => { applyDefaultPreset(key); setIsPresetPopoverOpen(false); setPresetSearch(''); }}
                      >
                        {label}
                      </button>
                    );
                    return acc;
                  }, [])}

                {/* Saved Presets section */}
                {presets.filter(p => !presetSearch || p.name.toLowerCase().includes(presetSearch.toLowerCase())).length > 0 && (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1.5 mt-1">
                      <Text span size="xs" fw={600} c="neutral.5" style={{ whiteSpace: 'nowrap' }}>Saved Presets</Text>
                      <div className="flex-1 h-px bg-[#dee2e6]" />
                    </div>
                    {presets
                      .filter(p => !presetSearch || p.name.toLowerCase().includes(presetSearch.toLowerCase()))
                      .map((preset) => (
                        <div key={preset.id} className="flex items-center justify-between px-3 py-2 hover:bg-[#f8f9fa] transition-colors group">
                          <button
                            className="flex-1 text-left text-xs font-normal text-[#495057]"
                            style={{ fontFamily: 'var(--font-body)' }}
                            onClick={() => { loadPreset(preset); setIsPresetPopoverOpen(false); setPresetSearch(''); }}
                          >
                            {preset.name}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deletePreset(preset.id); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                  </>
                )}
              </div>

              {/* Save Current as Preset */}
              <div className="border-t border-[#dee2e6]">
                <button
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-normal text-[#016699] hover:bg-[#f8f9fa] transition-colors"
                  style={{ fontFamily: 'var(--font-body)' }}
                  onClick={() => { setIsPresetDialogOpen(true); setIsPresetPopoverOpen(false); setPresetSearch(''); }}
                >
                  <Save className="w-4 h-4" />
                  Save Current as Preset
                </button>
              </div>
            </Popover.Dropdown>
          </Popover>

        </div>
      );
    onSharedToolbarRender(sharedButtons);
    return () => onSharedToolbarRender(null);
  }, [
    // Angkanya, bukan cuma ada-tidaknya: tanpa ini toolbar tidak dirender ulang saat
    // jumlahnya berubah dari 2 ke 3, dan gelembungnya menyebut angka yang basi.
    jumlahFilterAktif,
    hasActiveFilters,
    presets,
    presetSearch,
    isPresetPopoverOpen,
    // Nama tombol Presets dibaca dari sini; tanpa dependensi ini toolbar tak pernah
    // dirender ulang saat presetnya berganti, dan tombolnya tetap menyebut yang lama.
    labelPresetAktif,
    onSharedToolbarRender,
    navigate,
  ]);

  /*
    Kotak pencarian dititipkan ke `Screener` supaya ia menempati baris toolbar.

    `filters.searchTerm` ikut jadi dependensi: elemennya membawa `value`, jadi tanpa
    itu kotaknya membeku pada ketikan pertama. `filters` utuh sengaja TIDAK dipakai
    sebagai dependensi — ia berubah setiap kali filter mana pun disentuh, dan
    merender ulang kotak pencarian untuk itu hanya menambah kerja tanpa mengubah apa
    pun yang terlihat.
  */
  useEffect(() => {
    if (!onSearchRender) return;
    onSearchRender(
      /* `TextInput` design system — sama dengan yang dipakai `Comparison`. */
      <DSTextInput
        w={384}
        placeholder="Search by name, position, or team..."
        value={filters.searchTerm}
        /*
          ⚠️ Nilainya DIBACA DULU, baru dikirim ke penyetel.

          Sebelumnya isi baris ini `setFilters(f => ({ ...f, searchTerm:
          e.currentTarget.value }))` — dan itu melempar. Fungsi pemutakhir tidak
          dijalankan saat kejadiannya terjadi, melainkan nanti saat React merender;
          pada saat itu `e.currentTarget` sudah `null`. Gejalanya bukan sekadar
          filter yang tidak jalan: mengetik SATU huruf di kotak pencarian tabel
          menjatuhkan seluruh layar ke "Unexpected Application Error" dengan
          `Cannot read properties of null (reading 'value')`.

          Terukur, dan diperiksa pada kode SEBELUM perubahan hari ini juga — jadi ini
          kerusakan yang sudah ada, bukan yang baru dibuat di sini.

          `e.currentTarget`, bukan `e.target`, yang berperilaku begini: `target` tetap
          menunjuk elemen aslinya, sementara `currentTarget` hanya sahih selama
          kejadiannya sedang ditangani.
        */
        onChange={(e) => {
          const kata = e.currentTarget.value;
          setFilters(f => ({ ...f, searchTerm: kata }));
        }}
        leftSection={<Search className="w-4 h-4" />}
      />,
    );
    return () => onSearchRender(null);
  }, [onSearchRender, filters.searchTerm]);

  const getRiskColor = (risk: number) => {
    if (risk < 30) return 'text-green-700 bg-green-50';
    if (risk < 60) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-700 bg-red-50';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-50';
    if (score >= 60) return 'text-blue-700 bg-blue-50';
    return 'text-gray-700 bg-gray-50';
  };

  // Helper function to check if data is older than 1 year
  const isDataOld = (dateString: string | undefined): boolean => {
    if (!dateString) return false;
    const dataDate = new Date(dateString);
    const today = new Date('2026-04-16'); // Current date as per system context
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    return dataDate < oneYearAgo;
  };

  // Helper function to check if data is older than 1 year and format tooltip message
  const getDataFreshnessTooltip = (dateString: string | undefined): string | null => {
    if (!dateString) return null;

    const dataDate = new Date(dateString);
    const today = new Date('2026-04-16'); // Current date as per system context
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const isOld = dataDate < oneYearAgo;
    const formattedDate = dataDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (isOld) {
      return `Data taken at ${formattedDate}. Data is not relevant enough, you should re-score.`;
    } else {
      return `Data taken at ${formattedDate}`;
    }
  };

  const renderCellContent = (employee: Employee, key: ColumnKey) => {
    const hasDecision = employeesWithDecisions.has(employee.id);

    // CSV-backed column: render the raw CSV row value by header.
    if (typeof key === 'string' && key.startsWith('csv:')) {
      const header = key.slice(4);
      const raw = employee.csvFields?.[header];
      if (raw === undefined || raw === null || raw === '' || raw === '#N/A' || raw === 'N/A')
        return <NoDataChip />;
      return <Text span size="xs" c="neutral.7">{raw}</Text>;
    }

    switch (key) {
      case 'name': {
        const isPinned = pinnedTableIds.includes(employee.id);
        /*
          Tombol pin dipisah jadi variabel karena dipakai DUA cabang di bawah — baris
          "No Data" dan baris orang sungguhan. Menyalinnya dua kali berarti dua tempat
          yang bisa berbeda diam-diam.

          Kelas `group-hover/nameCell` tetap bergantung pada pembungkus bernama
          `group/nameCell` di kedua cabang; tanpa pembungkus itu tombolnya tak pernah
          muncul karena ia memang tersembunyi sampai barisnya disentuh.
        */
        const tombolPin = (
          <button
            onClick={() => toggleTablePin(employee.id)}
            title={isPinned ? 'Unpin' : 'Pin to top'}
            className={`transition-opacity shrink-0 ${isPinned ? 'opacity-100' : 'opacity-0 group-hover/nameCell:opacity-100'}`}
          >
            <Pin
              className="w-3 h-3"
              style={{ color: isPinned ? '#FD9F28' : '#495057' }}
              fill={isPinned ? '#FD9F28' : 'none'}
            />
          </button>
        );
        return (
          /*
            Pola "User cell" design system (section Display). Sebelumnya <img> MENTAH 40px
            dengan onError yang menukar foto gagal ke /avatars/male.jpg — foto orang lain
            untuk orang yang fotonya tidak ada. Avatar design system menggambar inisial
            orang ITU sendiri, jadi jatuhnya lebih jujur.

            Ukuran avatarnya TIDAK dioper: seluruh pemakai SelUser memakai bawaannya,
            "sm" (26px), turun dari 40px yang tadinya ada di sini. Lihat catatan pada
            prop `ukuran` di src/components/ui/SelUser.tsx.

            Baris "No Data" TIDAK memakai user cell: tidak ada orang untuk ditampilkan di
            sana, dan menaruh avatar untuk baris tanpa orang justru menyesatkan.
          */
          employee.name === 'No Data' ? (
            <div className="flex items-center gap-2 group/nameCell">
              <NoDataChip />
              {tombolPin}
            </div>
          ) : (
            <div className="group/nameCell">
              <SelUser
                nama={employee.name.toLowerCase().replace(/w/g, c => c.toUpperCase())}
                foto={employee.photo}
                keterangan={employee.id}
                {...(getProfileUrl(employee)
                  ? { href: getProfileUrl(employee), targetTautan: '_top' }
                  : { onKlikNama: () => { setSelectedEmployeeForDetail(employee); setIsEmployeeDetailModalOpen(true); } })}
                kanan={(
                  <>
                    {tombolPin}
                    {hasDecision && (
                      <Tag warnaDS="primary" kiri={<FileCheck className="w-3 h-3" />}>
                        In Decision
                      </Tag>
                    )}
                  </>
                )}
              />
            </div>
          )
        );
      }
      case 'role':
        if (employee.role === 'No Data') {
          return <NoDataChip />;
        }
        return <Text span size="xs" c="neutral.7">{employee.role.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</Text>;
      case 'department': {
        if (employee.department === 'No Data') {
          return <NoDataChip />;
        }
        const allTeams = employee.departments ?? [employee.department];
        const extraCount = allTeams.length - 1;
        return (
          <div className="flex items-center gap-1 flex-wrap">
            <Text span size="xs" c="neutral.7">{allTeams[0]}</Text>
            {extraCount > 0 && (
              <span
                className="text-[10px] font-semibold text-white bg-[#016699] rounded-full px-1.5 py-0.5 cursor-default"
                title={allTeams.slice(1).join(', ')}
              >
                +{extraCount}
              </span>
            )}
          </div>
        );
      }
      case 'level':
        if (employee.level === 'No Data') {
          return <NoDataChip />;
        }
        return <Tag warnaDS="gray">{employee.level}</Tag>;
      case 'performanceRating':
        if (!employee.performanceRating || employee.performanceRating === 0) {
          return <NoDataChip />;
        }
        const performanceTooltip = getDataFreshnessTooltip(employee.performanceRatingDate);
        const isPerformanceOld = isDataOld(employee.performanceRatingDate);
        if (performanceTooltip) {
          return (
            <Tooltip label={performanceTooltip}>
                <div className="flex items-center gap-1.5 cursor-help">
                  {isPerformanceOld && <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                  <Text span size="xs" fw={600} c="neutral.7">{employee.performanceRating}%</Text>
                </div>
            </Tooltip>
          );
        }
        return (
          <Text span size="xs" fw={600} c="neutral.7">{employee.performanceRating}%</Text>
        );
      case 'potentialRating':
        if (!employee.potentialRating || employee.potentialRating === 0) {
          return <NoDataChip />;
        }
        const potentialTooltip = getDataFreshnessTooltip(employee.potentialRatingDate);
        const isPotentialOld = isDataOld(employee.potentialRatingDate);
        if (potentialTooltip) {
          return (
            <Tooltip label={potentialTooltip}>
                <div className="flex items-center gap-1.5 cursor-help">
                  {isPotentialOld && <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                  <Text span size="xs" fw={600} c="neutral.7">{employee.potentialRating}%</Text>
                </div>
            </Tooltip>
          );
        }
        return (
          <Text span size="xs" fw={600} c="neutral.7">{employee.potentialRating}%</Text>
        );
      case 'readinessLevel':
        if (!employee.readinessLevel || employee.readinessLevel === 0) {
          return <NoDataChip />;
        }
        return (
          <Text span size="xs" fw={600} c="neutral.7">{employee.readinessLevel}%</Text>
        );
      case 'timeInRole':
        if (!employee.timeInRole || employee.timeInRole === 0) {
          return <NoDataChip />;
        }
        return <Text span size="xs" c="neutral.7">{employee.timeInRole}mo</Text>;
      case 'engagementScore':
        if (!employee.engagementScore || employee.engagementScore === 0) {
          return <NoDataChip />;
        }
        const engagementTooltip = getDataFreshnessTooltip(employee.engagementScoreDate);
        const isEngagementOld = isDataOld(employee.engagementScoreDate);
        if (engagementTooltip) {
          return (
            <Tooltip label={engagementTooltip}>
                <div className="flex items-center gap-1.5 cursor-help">
                  {isEngagementOld && <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                  <Text span size="xs" fw={600} c="neutral.7">{employee.engagementScore}%</Text>
                </div>
            </Tooltip>
          );
        }
        return (
          <Text span size="xs" fw={600} c="neutral.7">{employee.engagementScore}%</Text>
        );
      case 'flightRisk':
        return (
          <Text span size="xs" fw={600} c="neutral.7">
            {employee.flightRisk}
          </Text>
        );
      case 'salary':
        if (!employee.salary || employee.salary === 0) {
          return <NoDataChip />;
        }
        return <Text span size="xs" c="neutral.7">Rp {employee.salary.toLocaleString('id-ID')}</Text>;
      case 'criticalRole':
        return (
          <Text span size="xs" fw={600} c="neutral.7">
            {employee.criticalRole ? 'Yes' : 'No'}
          </Text>
        );
      case 'successorIdentified':
        return (
          <Text span size="xs" fw={600} c="neutral.7">
            {employee.successorIdentified ? 'Yes' : 'No'}
          </Text>
        );
      // Imported columns from AI Analysis
      case 'iqScore':
        if (!employee.iqScore || employee.iqScore === 0) {
          return <NoDataChip />;
        }
        return <Text span size="xs" fw={600} c="neutral.7">{employee.iqScore}</Text>;
      case 'personality':
        if (!employee.personality || employee.personality === 'No Data') {
          return <NoDataChip />;
        }
        return (
          <Text span size="xs" fw={600} c="neutral.7">{employee.personality}</Text>
        );
      case 'leadershipType':
        if (!employee.leadershipType || employee.leadershipType === 'No Data') {
          return <NoDataChip />;
        }
        return <Text span size="xs" c="neutral.7">{employee.leadershipType}</Text>;
      // Readiness columns
      case 'readinessHAV':
        return employee.readinessHAV
          ? <Text span size="xs" c="neutral.7">{employee.readinessHAV}</Text>
          : <NoDataChip />;
      case 'usia':
        return employee.usia != null
          ? <Text span size="xs" c="neutral.7">{employee.usia} thn</Text>
          : <NoDataChip />;
      case 'readinessRiskHeat': {
        const riskVal = customColumnData[employee.id]?.readinessRiskHeat ?? employee.readinessRiskHeat ?? '';
        return (
          <DSTextInput
            type="text"
            value={riskVal}
            onChange={(e) => handleUpdateCustomData(employee.id, 'readinessRiskHeat', e.target.value)}
            placeholder="Isi risk heat..."
            size="xs" className="w-full min-w-[110px]"
          />
        );
      }
      // Aspect columns (display 1-5 scale with normalized 0-100 score)
      case 'leadership':
      case 'communication':
      case 'problemSolving':
      case 'teamwork':
      case 'adaptability':
      case 'strategicThinking':
      case 'decisionMaking':
      case 'innovation':
      case 'analyticalSkills':
      case 'accountability':
      case 'competencyMatch':
        const aspectValue = employee[key];
        if (!aspectValue || aspectValue === 0) {
          return <NoDataChip />;
        }
        // competencyMatch is 0-100 scale, others are 1-5 scale
        return (
          <Text span size="xs" fw={600} c="neutral.7">
            {key === 'competencyMatch' ? aspectValue : `${aspectValue}/5`}
          </Text>
        );
      // Cluster Scores
      case 'competencyScore':
      case 'commitmentScore':
      case 'contributionScore':
      case 'aspectScore':
      case 'generalScore':
      case 'technicalScore':
      case 'additionalScore':
        const empWithScores = employee as Employee & {
          competencyScore?: number;
          commitmentScore?: number;
          contributionScore?: number;
          aspectScore?: number;
          generalScore?: number;
          technicalScore?: number;
          additionalScore?: number;
        };
        const scoreValue = empWithScores[key];
        if (scoreValue === undefined) return <NoDataChip />;
        return renderClusterScoreCell(scoreValue);
      default:
        // Check if this is a custom column
        const customCol = customColumns.find(col => col.key === key);
        if (customCol?.dariProfileData) {
          return renderSelProfileData(customColumnData[employee.id]?.[key], customCol.tipeData);
        }
        if (customCol) {
          const customValue = customColumnData[employee.id]?.[key];
          return renderCustomCell(employee.id, key, customValue, customCol.customType!, customCol.categories);
        }
        return null;
    }
  };

  /** Sel data tambahan dari Profile Data: hanya-baca, dalam bentuk yang pantas untuk tipenya. */
  const renderSelProfileData = (value: string | null | undefined, tipe?: string) => {
    if (!terisi(value)) return <NoDataChip />;
    const teks =
      tipe === 'boolean'
        ? (keYaTidak(value) == null ? String(value) : keYaTidak(value) ? 'Yes' : 'No')
        : String(value);
    return <Text span size="xs" c="neutral.7">{teks}</Text>;
  };

  // Render custom column cell (editable)
  const renderCustomCell = (
    employeeId: string, 
    columnKey: string, 
    value: any, 
    columnType: 'text' | 'numerical' | 'categorical' | 'attachment' | 'like-dislike',
    categories?: string[]
  ) => {
    // For categorical type, use Select dropdown with Badge display
    if (columnType === 'categorical' && categories && categories.length > 0) {
      return (
        /*
          ⚠️ Pil `Tag` di dalam pemicu HILANG di sini, dan itu konsekuensi yang
          dipilih sadar: Select design system menggambar nilainya sebagai teks, dan
          tidak punya jalan untuk menyisipkan elemen ke dalam medan isiannya.
          Menahannya berarti membangun Combobox sendiri — persis "buat sendiri" yang
          sedang dihapus. Pil tetap dipakai di tempat lain (status, No Data, Pinned).
        */
        <Select
          value={value || null}
          onChange={(newValue) => handleUpdateCustomData(employeeId, columnKey, newValue ?? null)}
          data={categories}
          placeholder="Select..."
          size="xs"
          variant="unstyled"
          w="100%"
        />
      );
    }

    // For attachment type, show file name with upload/clear buttons
    if (columnType === 'attachment') {
      return (
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <button
                className="flex items-center gap-1 text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                onClick={() => {
                  // Show file name in alert (in production, this would download or open the file)
                  alert(`File: ${value}\n\nNote: In production, this would open or download the actual file.`);
                }}
                title={`Click to view: ${value}`}
              >
                <Paperclip className="w-3 h-3" />
                <span className="truncate max-w-[100px]">{value}</span>
              </button>
              {/*
                ActionIcon DS untuk tombol khusus ikon. Ukuran `sm` (22px), BUKAN
                `input-sm` (36px) yang jadi padanan Button `sm` — 36px tak masuk di
                sel tabel sepadat ini. Aturan di `prodigyFoundation.ts` meminta
                penyimpangan disebut alasannya; ini alasannya.
              */}
              <DSActionIcon
                variant="subtle"
                color="error"
                size="sm"
                onClick={() => handleUpdateCustomData(employeeId, columnKey, null)}
                title="Remove attachment"
                aria-label="Remove attachment"
              >
                <X className="w-3 h-3" />
              </DSActionIcon>
            </>
          ) : (
            <DSButton
              variant="outline"
              color="primary"
              size="compact-sm"
              leftSection={<Upload className="w-3 h-3" />}
              onClick={() => {
                // Trigger file input click
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '*/*'; // Accept all file types
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    // Store file name (in production, you would upload to server/storage)
                    handleUpdateCustomData(employeeId, columnKey, file.name);
                  }
                };
                input.click();
              }}
            >
              Upload
            </DSButton>
          )}
        </div>
      );
    }

    // For like-dislike type, show thumbs up/down buttons
    if (columnType === 'like-dislike') {
      return (
        <div className="flex items-center gap-1">
          {/*
            Warna dari token `success`/`error`, bukan `bg-green-600`/`bg-red-600`
            yang ditulis langsung. `ActionIcon` dipakai karena keduanya tombol
            khusus ikon; ukuran `sm` (22px) dengan alasan yang sama seperti tombol
            hapus lampiran di atas.
          */}
          <DSActionIcon
            variant={value === 'like' ? 'filled' : 'outline'}
            color="success"
            size="sm"
            onClick={() => handleUpdateCustomData(employeeId, columnKey, value === 'like' ? null : 'like')}
            aria-label="Suka"
          >
            <ThumbsUp className="w-3 h-3" />
          </DSActionIcon>
          <DSActionIcon
            variant={value === 'dislike' ? 'filled' : 'outline'}
            color="error"
            size="sm"
            onClick={() => handleUpdateCustomData(employeeId, columnKey, value === 'dislike' ? null : 'dislike')}
            aria-label="Tidak suka"
          >
            <ThumbsDown className="w-3 h-3" />
          </DSActionIcon>
        </div>
      );
    }
    
    // For text and numerical types, use Input
    return (
      <DSTextInput
        type={columnType === 'numerical' ? 'number' : 'text'}
        value={value || ''}
        onChange={(e) => handleUpdateCustomData(employeeId, columnKey, e.target.value)}
        placeholder={columnType === 'numerical' ? '0' : 'Enter value'}
        size="xs" className="w-full min-w-[100px]"
      />
    );
  };

  // Helper function to get color based on cluster score
  const getClusterScoreColor = (score: number) => {
    if (score >= 80) return { bg: '#d1fae5', text: '#065f46' };
    if (score >= 60) return { bg: '#dbeafe', text: '#1e40af' };
    if (score >= 40) return { bg: '#fef3c7', text: '#92400e' };
    return { bg: '#fee2e2', text: '#991b1b' };
  };

  // Helper function to render cluster score cell
  const renderClusterScoreCell = (score: number) => {
    const colors = getClusterScoreColor(score);
    return (
      <div 
        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-bold text-xs"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {score}
      </div>
    );
  };

  return (
    <div className="flex flex-col" style={{ backgroundColor: '#F8F9FA' }}>
      {/*
        Baris pencarian yang dulu berdiri di sini dititipkan ke `Screener` lewat
        `onSearchRender`, supaya ia menempati baris toolbar dan pemilih tampilan turun
        ke bawahnya. Pembungkusnya dipertahankan karena dialog-dialog di bawah ini
        bersarang di dalamnya.
      */}
      <div className="bg-white shrink-0">

        {/* Dialogs */}
        {/* Visible Columns Dialog */}
        <VisibleColumnsDialog
          open={isVisibleColumnsDialogOpen}
          onOpenChange={setIsVisibleColumnsDialogOpen}
          visibleColumns={visibleColumns}
          onApply={handleApplyVisibleColumns}
          // Level dikecualikan: nilainya ditebak dari kata kunci nama departemen, jadi tidak bermakna.
          columnDefinitions={columnDefinitions.filter((c) => c.key !== 'level')}
          customColumns={customColumns}
          onDeleteCustomColumn={handleDeleteCustomColumn}
          onAddColumn={() => setIsAddColumnDialogOpen(true)}
        />

        {/* Employee Selector Dialog */}
        <Modal
          opened={isEmployeeSelectorOpen}
          onClose={() => {
            setIsEmployeeSelectorOpen(false);
            setEmployeeSelectorSearch('');
          }}
          title="Select Employees"
          size={672}
        >
            <Text size="xs" c="neutral.6" mb="md">
                Choose specific employees to display in the table. Leave all unchecked to show all employees.
            </Text>
            <div className="py-4">
              {/* Search Bar for Employee Selector */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <DSTextInput
                    type="text"
                    placeholder="Search employees..."
                    value={employeeSelectorSearch}
                    onChange={(e) => setEmployeeSelectorSearch(e.target.value)}
                    size="sm" className="w-full"
                  />
                </div>
              </div>

              {/* Select All / Deselect All */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <div className="flex items-center gap-2">
                  <DSCheckbox
                    id="select-all-employees"
                    checked={
                      (() => {
                        const filteredEmployees = employees.filter((employee) => {
                          if (!employeeSelectorSearch) return true;
                          const searchTerm = employeeSelectorSearch.toLowerCase();
                          return (
                            employee.name.toLowerCase().includes(searchTerm) ||
                            employee.id.toLowerCase().includes(searchTerm) ||
                            employee.role.toLowerCase().includes(searchTerm) ||
                            employee.department.toLowerCase().includes(searchTerm)
                          );
                        });
                        return filteredEmployees.length > 0 && filteredEmployees.every(e => selectedEmployeeIds.includes(e.id));
                      })()
                    }
                    onChange={(e) => {
                        const checked = e.currentTarget.checked;
                      const filteredEmployees = employees.filter((employee) => {
                        if (!employeeSelectorSearch) return true;
                        const searchTerm = employeeSelectorSearch.toLowerCase();
                        return (
                          employee.name.toLowerCase().includes(searchTerm) ||
                          employee.id.toLowerCase().includes(searchTerm) ||
                          employee.role.toLowerCase().includes(searchTerm) ||
                          employee.department.toLowerCase().includes(searchTerm)
                        );
                      });
                      
                      if (checked) {
                        // Add all filtered employees to selection
                        const newIds = [...new Set([...selectedEmployeeIds, ...filteredEmployees.map(e => e.id)])];
                        setSelectedEmployeeIds(newIds);
                      } else {
                        // Remove all filtered employees from selection
                        const filteredIds = filteredEmployees.map(e => e.id);
                        setSelectedEmployeeIds(selectedEmployeeIds.filter(id => !filteredIds.includes(id)));
                      }
                    }}
                  />
                  <Label 
                    htmlFor="select-all-employees" 
                    className="font-bold cursor-pointer"
                    style={{ textTransform: 'capitalize' }}
                  >
                    Select All {employeeSelectorSearch ? '(Filtered)' : `(${mockEmployees.length} Employees)`}
                  </Label>
                </div>
                <div className="text-sm text-gray-500">
                  {selectedEmployeeIds.length > 0 
                    ? `${selectedEmployeeIds.length} selected`
                    : 'All employees (no filter)'}
                </div>
              </div>

              {/* Employee List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {(() => {
                  const filteredEmployees = employees.filter((employee) => {
                    if (!employeeSelectorSearch) return true;
                    const searchTerm = employeeSelectorSearch.toLowerCase();
                    return (
                      employee.name.toLowerCase().includes(searchTerm) ||
                      employee.id.toLowerCase().includes(searchTerm) ||
                      employee.role.toLowerCase().includes(searchTerm) ||
                      employee.department.toLowerCase().includes(searchTerm)
                    );
                  });

                  if (filteredEmployees.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">
                          No employees found matching "{employeeSelectorSearch}"
                        </p>
                      </div>
                    );
                  }

                  return filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <DSCheckbox
                      id={`employee-${employee.id}`}
                      checked={selectedEmployeeIds.includes(employee.id)}
                      onChange={(e) => {
                        const checked = e.currentTarget.checked;
                        if (checked) {
                          setSelectedEmployeeIds([...selectedEmployeeIds, employee.id]);
                        } else {
                          setSelectedEmployeeIds(selectedEmployeeIds.filter(id => id !== employee.id));
                        }
                      }}
                    />
                    <Label 
                      htmlFor={`employee-${employee.id}`}
                      className="flex-1 cursor-pointer flex items-center gap-3"
                    >
                      <img
                        src={employee.photo}
                        alt={employee.name}
                        onError={(e) => { e.currentTarget.src = '/avatars/male.jpg'; e.currentTarget.onerror = null; }}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-bold" style={{ textTransform: 'capitalize' }}>
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.role} • {employee.department}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {employee.id}
                      </div>
                    </Label>
                  </div>
                ));
                })()}
              </div>
            </div>
            <Group justify="flex-end" mt="md">
              <DSButton
                variant="outline"
                color="gray"
                    onClick={() => {
                  setSelectedEmployeeIds([]);
                  setIsEmployeeSelectorOpen(false);
                }}
              >
                Clear & Close
              </DSButton>
              <DSButton
                color="primary"
                onClick={() => setIsEmployeeSelectorOpen(false)}
              >
                Apply Selection
              </DSButton>
            </Group>
          </Modal>

        <Modal
          opened={isPresetDialogOpen}
          onClose={() => setIsPresetDialogOpen(false)}
          title="Save as Preset"
        >
            <Text size="xs" c="neutral.6" mb="md">
                Save your current filter and column settings as a preset for quick access later.
            </Text>
            <div className="py-4">
              <Label htmlFor="preset-name" className="mb-2 block">Preset Name</Label>
              <DSTextInput
                id="preset-name"
                placeholder="e.g., High Performers Q1 2024"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    savePreset();
                  }
                }}
              />
            </div>
            <Group justify="flex-end" mt="md">
              <DSButton variant="outline" color="gray" onClick={() => {
                setIsPresetDialogOpen(false);
                setPresetName('');
              }}>
                Cancel
              </DSButton>
              <DSButton onClick={savePreset} disabled={!presetName.trim()}>
                <Save className="w-4 h-4 mr-2" />
                Save Preset
              </DSButton>
            </Group>
          </Modal>

        {/* Add Custom Column Dialog */}
        <Modal
          opened={isAddColumnDialogOpen}
          onClose={() => {
            setIsAddColumnDialogOpen(false);
            setNewColumnName('');
            setNewColumnType('text');
            setNewColumnCategories([]);
            setCategoryInput('');
            setNewColumnCluster('custom');
          }}
          title="Add Custom Data"
        >
                  <Text size="xs" c="neutral.6" mb="md">
                    Create a new custom column to track additional employee data.
                  </Text>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="column-name" className="mb-2 block">Data Name</Label>
                    <DSTextInput
                      id="column-name"
                      placeholder="e.g., Certifications, Language Skills"
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveCustomColumn();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="column-type" className="mb-2 block">Data Type</Label>
                    <Select
                      id="column-type"
                      value={newColumnType}
                      /* Penjaga null: `onChange` Mantine bisa memberi null, `newColumnType` tidak menerimanya. */
                      onChange={(value) => { if (value) setNewColumnType(value as typeof newColumnType); }}
                      data={[
                        { value: 'text', label: 'Text' },
                        { value: 'numerical', label: 'Numerical' },
                        { value: 'categorical', label: 'Categorical' },
                        { value: 'attachment', label: 'Attachment' },
                        { value: 'like-dislike', label: 'Like/Dislike' },
                      ]}
                      allowDeselect={false}
                    />
                  </div>
                  
                  {/* Categories Input - Only show for categorical type */}
                  {newColumnType === 'categorical' && (
                    <div>
                      <Label className="mb-2 block">Categories</Label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <DSTextInput
                            placeholder="Enter category (e.g., Junior, Senior)"
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCategory();
                              }
                            }}
                          />
                          <DSButton
                            type="button" 
                            variant="outline" 
                            onClick={handleAddCategory}
                            disabled={!categoryInput.trim()}
                          >
                            <Plus className="w-4 h-4" />
                          </DSButton>
                        </div>
                        
                        {/* Display added categories as chips */}
                        {newColumnCategories.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                            {newColumnCategories.map((category) => (
                              <Tag
                                key={category}
                                warnaDS="gray"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                              >
                                {category}
                                <X 
                                  className="w-3 h-3 cursor-pointer hover:text-red-600" 
                                  onClick={() => handleRemoveCategory(category)}
                                />
                              </Tag>
                            ))}
                          </div>
                        )}
                        
                        {newColumnCategories.length === 0 && (
                          <p className="text-sm text-gray-500 italic">No categories added yet</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cluster Selection */}
                  <div>
                    <Label htmlFor="column-cluster" className="mb-2 block">Cluster</Label>
                    {/*
                      Cluster milik pemakai dulu dipisah dengan `<div>` bergaris tipis
                      di dalam daftar. Mantine punya pengelompokan sungguhan lewat
                      `group`, yang memberi JUDUL bukan cuma garis — dan pembaca layar
                      ikut mendapatkannya.
                    */}
                    <Select
                      id="column-cluster"
                      value={newColumnCluster}
                      onChange={(value) => { if (value) setNewColumnCluster(value); }}
                      data={[
                        { value: 'competency', label: 'Competency' },
                        { value: 'commitment', label: 'Commitment' },
                        { value: 'contribution', label: 'Contribution' },
                        { value: 'aspect', label: 'Aspect' },
                        { value: 'custom', label: 'Others' },
                        ...(userClusters.length > 0
                          ? [{ group: 'Cluster Anda', items: userClusters.map(uc => ({ value: uc.key, label: uc.label })) }]
                          : []),
                      ]}
                      allowDeselect={false}
                    />
                  </div>
                </div>
                <Group justify="flex-end" mt="md">
                  <DSButton variant="outline" color="gray" onClick={() => {
                    setIsAddColumnDialogOpen(false);
                    setNewColumnName('');
                    setNewColumnType('text');
                    setNewColumnCategories([]);
                    setCategoryInput('');
                    setNewColumnCluster('custom');
                  }}>
                    Cancel
                  </DSButton>
                  <DSButton
                    onClick={handleSaveCustomColumn} 
                    disabled={
                      !newColumnName.trim() || 
                      (newColumnType === 'categorical' && newColumnCategories.length === 0)
                    }
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Column
                  </DSButton>
                </Group>
              </Modal>

            {/* Delete Custom Column Confirmation Dialog */}
            <Modal
              opened={isDeleteConfirmOpen}
              onClose={() => setIsDeleteConfirmOpen(false)}
              title="Delete Custom Column"
            >
                  <Text size="xs" c="neutral.6" mb="md">
                    Are you sure you want to delete this column? All data associated with this column will be permanently removed.
                  </Text>
                <Group justify="flex-end" mt="md">
                  <DSButton
                    variant="outline"
                    color="gray"
                    onClick={() => {
                      setIsDeleteConfirmOpen(false);
                      setColumnToDelete(null);
                    }}
                  >
                    Cancel
                  </DSButton>
                  <DSButton
                    color="error"
                    onClick={confirmDeleteCustomColumn}
                    leftSection={<Trash2 className="w-4 h-4" />}
                  >
                    Delete Column
                  </DSButton>
                </Group>
              </Modal>
      </div>

      {/* Floating Action Buttons - Bottom Center */}
      {selectedEmployees.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 px-2 py-2 flex items-center gap-3">
            <span className="font-medium text-gray-700 px-2" style={{ fontSize: 12 }}>
              {selectedEmployees.length} selected
            </span>
            <div className="w-px h-6 bg-gray-300" />
            {/* Hide Selected */}
            <DSButton
              variant="outline"
              color="gray"
              onClick={() => {
                setHiddenEmployeeIds(prev => [...new Set([...prev, ...selectedEmployees])]);
                setShowOnlyIds(null);
                setSelectedEmployees([]);
              }}
            >
              <X className="w-3.5 h-3.5" />
              Hide
            </DSButton>
            {/* Show Only Selected */}
            <DSButton
              color="primary"
              onClick={() => {
                setShowOnlyIds([...selectedEmployees]);
                setHiddenEmployeeIds([]);
                setSelectedEmployees([]);
              }}
            >
              <Users className="w-3.5 h-3.5" />
              Show Only
            </DSButton>
          </div>
        </div>
      )}

      {/* Reset bar — shown when Hide or Show Only is active */}
      {(hiddenEmployeeIds.length > 0 || showOnlyIds !== null) && selectedEmployees.length === 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 px-6 py-4 flex items-center gap-3">
            <Text span size="xs" c="neutral.6">
              {showOnlyIds !== null
                ? `Showing ${showOnlyIds.length} of ${employees.length} employees`
                : `${hiddenEmployeeIds.length} employee${hiddenEmployeeIds.length > 1 ? 's' : ''} hidden`}
            </Text>
            <div className="w-px h-5 bg-gray-300" />
            <button
              className="text-xs font-medium text-[#016699] hover:underline"
              onClick={() => {
                setHiddenEmployeeIds([]);
                setShowOnlyIds(null);
              }}
            >
              Show All
            </button>
          </div>
        </div>
      )}

      {/* Kartu tabel: scroll horizontal di sini; vertikal mengikuti halaman (sticky thead vs scroll Root) */}
      <div className="flex flex-col p-4">
        <div 
          ref={tableWrapperRef} 
          className="relative bg-white rounded-2xl border border-gray-200 overflow-x-auto overflow-y-clip"
        >
              <table className="w-full border-separate border-spacing-0">
                <thead className="bg-gray-50 border-b border-gray-200">
                  {/* Category Grouping Row */}
                  <tr ref={theadRow1Ref} className="border-b border-gray-300">
                    {(() => {
                      const categories = dynamicCategories;
                      const visibleCols = allColumnDefinitions.filter((col) => visibleColumns.has(col.key));
                      const result: JSX.Element[] = [];

                      const { mergedBasicCluster, basicVisibleCols, basicGridTemplateColumns } =
                        tableHeadBasicMerge;

                      if (mergedBasicCluster) {
                        result.push(
                          <th
                            key="basic-information-cluster"
                            colSpan={1 + basicVisibleCols.length}
                            className="bg-gray-50 p-0 border-r border-gray-300 sticky left-0 z-[64]"
                            style={{ top: 0 }}
                          >
                            <div className="flex items-center w-full min-h-[44px] box-border">
                              <div className="flex items-center justify-center border-r border-gray-200 bg-gray-50 box-border px-1 shrink-0 w-[50px]">
                                <DSCheckbox
                                  checked={
                                    selectedEmployees.length === employeesWithRanking.length &&
                                    employeesWithRanking.length > 0
                                  }
                                  onChange={(e) => {
                        const checked = e.currentTarget.checked;
                                    if (checked) {
                                      setSelectedEmployees(employeesWithRanking.map((e) => e.id));
                                    } else {
                                      setSelectedEmployees([]);
                                    }
                                  }}
                                />
                              </div>
                              <div className="flex items-center justify-center bg-gray-50 px-2 py-2 text-center flex-1 border-r border-gray-200">
                                <Text size="xs" fw={600} c="neutral.7" style={{ lineHeight: 1.25 }}>
                                Basic Information
                              </Text>
                              </div>
                            </div>
                          </th>
                        );
                      } else {
                        result.push(
                          <th
                            key="header-checkbox-only"
                            className="sticky left-0 z-[62] bg-gray-50 px-2 py-2 w-[50px]"
                            rowSpan={2}
                            style={{ top: 0 }}
                          >
                            <DSCheckbox
                              checked={
                                selectedEmployees.length === employeesWithRanking.length &&
                                employeesWithRanking.length > 0
                              }
                              onChange={(e) => {
                        const checked = e.currentTarget.checked;
                                if (checked) {
                                  setSelectedEmployees(employeesWithRanking.map((e) => e.id));
                                } else {
                                  setSelectedEmployees([]);
                                }
                              }}
                            />
                          </th>
                        );
                      }

                      // Add each category header
                      categories.forEach((category) => {
                        if (mergedBasicCluster && category.name === 'Basic Information') return;
                        const gridCols = getGridColumnsForCategory(category, visibleCols, clusterTotalSlotOverride);
                        if (gridCols.length > 0) {
                          // Count includes visible columns + 1 for Total Score (if cluster has totalScoreKey)
                          const hasScoreColumn = category.totalScoreKey !== undefined;
                          result.push(
                            <th
                              key={category.name}
                              colSpan={gridCols.length + (hasScoreColumn ? 1 : 0)}
                              className="px-4 py-2 text-center text-xs font-semibold text-gray-700 border-r border-gray-300 sticky z-[60] bg-gray-50"
                              style={{ top: 0 }}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <Text span size="xs" fw={600} c="neutral.7">{category.name}</Text>
                                {hasScoreColumn && (() => {
                                  const slotKeyEffective = getEffectiveTotalSlotColumnKey(category, clusterTotalSlotOverride);
                                  const usesAlternate = slotUsesAlternateColumn(category, clusterTotalSlotOverride);
                                  const selectVal = usesAlternate ? slotKeyEffective! : TOTAL_SCORE_SLOT_DEFAULT_VALUE;
                                  /*
                                    ⚠️ Popover ini dulu TANPA state: Radix mengurus
                                    buka-tutupnya sendiri. Mantine tidak, jadi state-nya
                                    harus ada — dan karena popover ini berada di dalam
                                    perulangan kategori, satu boolean tidak cukup: ia
                                    menyimpan NAMA kategori yang menunya terbuka, supaya
                                    mengklik satu ikon tidak membuka semuanya sekaligus.
                                  */
                                  return (
                                    <Popover
                                      opened={menuTotalScoreTerbuka === category.name}
                                      onChange={(open) => setMenuTotalScoreTerbuka(open ? category.name : null)}
                                      position="bottom"
                                      shadow="md"
                                    >
                                      <Popover.Target>
                                        <button
                                          className="inline-flex items-center justify-center w-5 h-5 p-0 hover:bg-gray-200 rounded transition-colors"
                                          type="button"
                                          title={`Configure ${category.name} total score`}
                                          onClick={() => setMenuTotalScoreTerbuka((k) => (k === category.name ? null : category.name))}
                                        >
                                          <Settings className="w-4 h-4 text-gray-600" />
                                        </button>
                                      </Popover.Target>
                                      <Popover.Dropdown w={340} p={16}>
                                        <div className="space-y-3">
                                          <p className="text-xs font-semibold text-gray-900">{category.name} - Total Score</p>
                                          <p className="text-xs text-gray-600 leading-relaxed">
                                            Pilih salah satu variable di dalam cluster untuk ditampilkan di posisi kolom Total Score (tanpa menduplikasi kolom di grid).
                                          </p>
                                          {/*
                                            Opsi dinamis: dulu dihasilkan `.map()`
                                            sebagai anak JSX, sekarang dibangun jadi
                                            array untuk prop `data`. Kolom tanpa
                                            definisi tetap disaring — dulu lewat
                                            `return null`, kini lewat `filter`.
                                          */}
                                          <Select
                                            value={selectVal}
                                            onChange={(val) => {
                                              if (!val) return;
                                              if (val === TOTAL_SCORE_SLOT_DEFAULT_VALUE) {
                                                setClusterTotalSlotOverride((prev) => {
                                                  const next = { ...prev };
                                                  delete next[category.name];
                                                  return next;
                                                });
                                              } else {
                                                setClusterTotalSlotOverride((prev) => ({
                                                  ...prev,
                                                  [category.name]: val,
                                                }));
                                                setVisibleColumns((prev) => new Set([...prev, val]));
                                              }
                                            }}
                                            data={[
                                              { value: TOTAL_SCORE_SLOT_DEFAULT_VALUE, label: 'Total Score (default)' },
                                              ...category.columns
                                                .map((colKey) => {
                                                  const def = allColumnDefinitions.find((c) => c.key === colKey);
                                                  return def ? { value: colKey, label: def.label } : null;
                                                })
                                                .filter((x): x is { value: string; label: string } => x !== null),
                                            ]}
                                            placeholder="Total Score (default)"
                                            allowDeselect={false}
                                            size="sm"
                                            comboboxProps={{ zIndex: 320 }}
                                          />
                                        </div>
                                      </Popover.Dropdown>
                                    </Popover>
                                  );
                                })()}
                              </div>
                            </th>
                          );
                        }
                      });

                      /*
                        Kolom yang tak masuk cluster mana pun tetap punya sel di baris judul — kalau tidak, jumlah
                        kolom baris ini kurang dari baris kolom di bawahnya, dan kolom Ranking (rowSpan 2) jatuh di
                        tengah tabel: saat digulir mentok ia menimpa kolom terakhir.
                      */
                      const semuaKolomCluster = categories.flatMap((c) => c.columns);
                      const kunciTotal = categories.map((c) => c.totalScoreKey).filter((k) => k !== undefined);
                      const kolomTanpaCluster = visibleCols.filter(
                        (col) => !semuaKolomCluster.includes(col.key) && !kunciTotal.includes(col.key),
                      );
                      if (kolomTanpaCluster.length > 0) {
                        result.push(
                          <th
                            key="kolom-tanpa-cluster"
                            colSpan={kolomTanpaCluster.length}
                            className="bg-gray-50 border-r border-gray-300 sticky z-[60]"
                            style={{ top: 0 }}
                          />,
                        );
                      }

                      return result;
                    })()}
                    
                    <th 
                      className="sticky right-0 z-[62] border-l border-gray-300 bg-gray-50 px-4 py-2 text-center min-w-[130px] w-[130px]"
                      rowSpan={2}
                      style={{ top: 0 }}
                    >
                        <div className="flex items-center justify-center gap-0.5">
                          <button
                            type="button"
                            className="flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                            onClick={() => handleSort('ranking')}
                            aria-label="Sort by ranking"
                          >
                            <Text span size="md" fw={600} c="neutral.7">Ranking</Text>
                            {sortField === 'ranking' ? (
                              sortDirection === 'asc' ? (
                                <ArrowUp className="w-4 h-4" aria-label="Sorted: top rank first" />
                              ) : (
                                <ArrowDown className="w-4 h-4" aria-label="Sorted: lowest rank first" />
                              )
                            ) : (
                              // Penanda bahwa kolom ini bisa diurutkan, sebelum diklik.
                              <ArrowUpDown className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
<Tooltip
                          position="left"
                          multiline
                          w={384}
                          label={
                          <div className="space-y-2">
                            <p className="font-semibold text-xs">Cara Kerja Ranking:</p>
                            <div className="text-xs space-y-2">
                              <p className="text-gray-300 leading-relaxed">
                                Ranking dihitung berdasarkan <strong className="text-white">weighted average</strong> dari semua variable yang memiliki weight.
                              </p>
                              
                              <div className="mt-3 pt-2 border-t border-gray-700">
                                <p className="font-medium text-white mb-1.5">Sistem Multiplier:</p>
                                <p className="text-gray-300 leading-relaxed">
                                  • Setiap cluster memiliki <strong className="text-white">Total Score</strong> sebagai multiplier
                                </p>
                                <p className="text-gray-300 leading-relaxed">
                                  • Multiplier ini mengalikan semua weight variable di cluster tersebut
                                </p>
                              </div>

                              <div className="mt-3 pt-2 border-t border-gray-700">
                                <p className="font-medium text-white mb-1.5">Contoh Sederhana:</p>
                                <p className="text-gray-300 text-[11px] leading-relaxed">
                                  Jika <strong className="text-white">Competency Score = 2</strong> (multiplier):
                                </p>
                                <p className="text-gray-300 text-[11px]">
                                  • Performance (weight 1) → efek final = 1 × 2 = 2
                                </p>
                                <p className="text-gray-300 text-[11px]">
                                  • Potential (weight 3) → efek final = 3 × 2 = 6
                                </p>
                                <p className="text-gray-300 text-[11px] mt-1.5 italic">
                                  Semakin besar multiplier, semakin besar pengaruh cluster tersebut terhadap ranking.
                                </p>
                              </div>

                              <div className="mt-2 pt-2 border-t border-gray-700">
                                <p className="text-gray-400 italic text-[11px]">Semua nilai dinormalisasi ke skala 0-100</p>
                              </div>
                            </div>
                          </div>
                          }
                        >
                          {/* Tooltip penjelasan HANYA di ikon info — di tombol urut tak boleh ada tooltip yang mengganggu klik. */}
                          <span className="inline-flex items-center cursor-help p-1" aria-label="How ranking works">
                            <Info className="w-3 h-3 text-[#016699] opacity-60" />
                          </span>
                        </Tooltip>
                        </div>
                    </th>
                  </tr>
                  {/* Column Headers Row */}
                  <tr ref={theadRow2Ref}>
                    {(() => {
                      const categories = dynamicCategories;

                      const visibleCols = allColumnDefinitions.filter((col) => visibleColumns.has(col.key));
                      const allCategoryColumns = categories.flatMap(c => c.columns);
                      const result: JSX.Element[] = [];

                      if (tableHeadBasicMerge.mergedBasicCluster) {
                        result.push(
                          <th
                            key="aspect-checkbox-spacer"
                            className="sticky left-0 z-[63] box-border w-[50px] min-w-[50px] max-w-[50px] border-r border-gray-200 bg-gray-50 p-0"
                            style={{ top: theadStickyTops.row2 }}
                            aria-hidden
                          />
                        );
                      }

                      // Render category columns with Total Score at the end of each category
                      categories.forEach((category) => {
                        const gridCols = getGridColumnsForCategory(category, visibleCols, clusterTotalSlotOverride);

                        if (gridCols.length > 0) {
                          // Render regular columns in category
                          gridCols.forEach((col, idx) => {
                            const isBasicInfo = category.name === 'Basic Information';
                            const isLastColInBasic = isBasicInfo && idx === gridCols.length - 1;

                            if (col.key === 'name') {
                              result.push(
                                <th
                                  key={col.key}
                                  className={`px-4 py-3 text-left text-xs font-medium text-gray-700 bg-gray-50 ${getColumnWidth(col.key)} group sticky left-[50px] ${isLastColInBasic ? 'z-[67]' : 'z-[62]'} ${isLastColInBasic ? 'border-r border-gray-300' : ''}`}
                                  style={{ top: theadStickyTops.row2 }}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-1">
                                      <Text span size="xs" fw={600} c="neutral.7">{col.label}</Text>
                                      {sortField === 'name' && (
                                        sortDirection === 'asc'
                                          ? <ArrowUp className="w-3 h-3 text-gray-500" />
                                          : <ArrowDown className="w-3 h-3 text-gray-500" />
                                      )}
                                    </div>
                                    <Popover
                                      opened={employeeHeaderMenuOpen}
                                      onChange={setEmployeeHeaderMenuOpen}
                                      position="bottom-start"
                                      shadow="md"
                                    >
                                      <Popover.Target>
                                        <button
                                          className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200"
                                          onClick={e => { e.stopPropagation(); setEmployeeHeaderMenuOpen((o) => !o); }}
                                        >
                                          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                        </button>
                                      </Popover.Target>
                                      <Popover.Dropdown
                                        className="w-[180px] p-1 rounded-[8px] shadow-md border border-gray-200 bg-white"
                                        align="start"
                                        side="bottom"
                                        style={{ zIndex: 9999 }}
                                      >
                                        <button
                                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-[6px] text-left"
                                          onClick={() => { setSortField('name'); setSortDirection('asc'); setEmployeeHeaderMenuOpen(false); }}
                                        >
                                          <ArrowUp className="w-3.5 h-3.5 text-gray-400" />
                                          Sort A → Z
                                        </button>
                                        <button
                                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-[6px] text-left"
                                          onClick={() => { setSortField('name'); setSortDirection('desc'); setEmployeeHeaderMenuOpen(false); }}
                                        >
                                          <ArrowDown className="w-3.5 h-3.5 text-gray-400" />
                                          Sort Z → A
                                        </button>
                                        <div className="h-px bg-gray-100 my-1" />
                                        <button
                                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-[6px] text-left"
                                          onClick={() => { setIsFilterDialogOpen(true); setEmployeeHeaderMenuOpen(false); }}
                                        >
                                          <Filter className="w-3.5 h-3.5 text-gray-400" />
                                          Filter
                                        </button>
                                      </Popover.Dropdown>
                                    </Popover>
                                  </div>
                                </th>
                              );
                            } else {
                              result.push(
                                <th
                                  key={col.key}
                                  className={`px-4 py-3 text-left text-xs font-medium text-gray-700 bg-gray-50 ${getColumnWidth(col.key)} ${
                                    col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                                  } sticky ${isLastColInBasic ? 'z-[61]' : 'z-[60]'} ${isLastColInBasic ? 'border-r border-gray-300' : ''}`}
                                  style={{ top: theadStickyTops.row2 }}
                                  onClick={() => col.sortable && handleSort(col.key)}
                                >
                                  <div className="flex items-center gap-2">
                                    <Text span size="xs" fw={600} c="neutral.7">{col.label}</Text>
                                    {col.sortable && sortField === col.key && (
                                      sortDirection === 'asc' ? (
                                        <ArrowUp className="w-4 h-4" />
                                      ) : (
                                        <ArrowDown className="w-4 h-4" />
                                      )
                                    )}
                                  </div>
                                </th>
                              );
                            }
                          });

                          // Slot Total Score / pengganti kolom variable
                          if (category.totalScoreKey) {
                            const slotKey = getEffectiveTotalSlotColumnKey(category, clusterTotalSlotOverride)!;
                            const slotUsesAlt = slotUsesAlternateColumn(category, clusterTotalSlotOverride);
                            const slotColDef = allColumnDefinitions.find((c) => c.key === slotKey);
                            const visibleVarsInCategory = category.columns.filter(col => visibleColumns.has(col));
                            const headerLabel = slotUsesAlt ? (slotColDef?.label ?? slotKey) : 'Total Score';

                            result.push(
                              <th
                                key={`${category.name}-total-slot`}
                                className={`px-4 py-3 text-left text-xs font-medium text-gray-700 bg-gray-50 ${getColumnWidth(slotKey)} sticky z-[60] border-r border-gray-300`}
                                style={{ top: theadStickyTops.row2 }}
                              >
                              <Tooltip
                          position="top"
                          multiline
                          w={320}
                          label={
                                  <div className="space-y-1.5">
                                    {slotUsesAlt ? (
                                      <>
                                        <p className="font-semibold text-xs">Mengganti Total Score cluster</p>
                                        <p className="text-xs text-gray-300 leading-relaxed">
                                          Kolom ini menampilkan nilai <strong className="text-white">{slotColDef?.label ?? slotKey}</strong> di posisi Total Score. Variable tersebut tidak diduplikasi di grid cluster. Multiplier ranking cluster tetap memakai bobot pada baris Weight untuk{' '}
                                          <strong className="text-white">
                                            {allColumnDefinitions.find((c) => c.key === category.totalScoreKey)?.label ?? category.totalScoreKey}
                                          </strong>.
                                        </p>
                                      </>
                                    ) : (
                                      <>
                                        <p className="font-semibold text-xs">{category.name} Total Score:</p>
                                        <p className="text-xs text-gray-300 leading-relaxed">
                                          Rata-rata tertimbang dari <strong className="text-white">{visibleVarsInCategory.length} variable</strong> yang terlihat:
                                        </p>
                                        <ul className="text-xs text-gray-300 list-disc pl-4 space-y-0.5 mt-1">
                                          {visibleVarsInCategory.map(varName => {
                                            const colDef = allColumnDefinitions.find(c => c.key === varName);
                                            return (
                                              <li key={varName}>{colDef?.label || varName}</li>
                                            );
                                          })}
                                        </ul>
                                        {visibleVarsInCategory.length === 0 && (
                                          <p className="text-xs text-yellow-400 italic">Tidak ada variable visible di cluster ini</p>
                                        )}
                                      </>
                                    )}
                                    <div className="mt-2 pt-1.5 border-t border-gray-700">
                                      <p className="text-gray-400 italic text-[11px]">
                                        Total Score berfungsi sebagai multiplier untuk ranking
                                      </p>
                                    </div>
                                  </div>
                          }
                        >
                                  <SafeDiv
                                    className="flex items-center justify-start gap-1 cursor-pointer hover:bg-gray-100 rounded px-0 py-1"
                                    onClick={() => handleSort(slotKey as SortField)}
                                  >
                                    <Text span size="xs" fw={600} c="neutral.7">{headerLabel}</Text>
                                    <Info className="w-3 h-3 text-[#016699] opacity-60" />
                                    {sortField === slotKey && (
                                      sortDirection === 'asc' ? (
                                        <ArrowUp className="w-4 h-4" />
                                      ) : (
                                        <ArrowDown className="w-4 h-4" />
                                      )
                                    )}
                                  </SafeDiv>
                        </Tooltip>
                            </th>
                          );
                          }
                        }
                      });

                      // Render post-category columns (excluding cluster score columns as they're already rendered as totalScoreKey)
                      const clusterScoreKeys = categories.map(c => c.totalScoreKey).filter(key => key !== undefined);
                      visibleCols.filter(col =>
                        !allCategoryColumns.includes(col.key) &&
                        !clusterScoreKeys.includes(col.key)
                      ).forEach(col => {
                        result.push(
                          <th
                            key={col.key}
                            className={`px-4 py-3 text-left text-xs font-medium text-gray-700 bg-gray-50 ${getColumnWidth(col.key)} ${
                              col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                            } sticky z-[60]`}
                            style={{ top: theadStickyTops.row2 }}
                            onClick={() => col.sortable && handleSort(col.key)}
                          >
                            <div className="flex items-center gap-2">
                              <Text span size="xs" fw={600} c="neutral.7">{col.label}</Text>
                              {col.sortable && sortField === col.key && (
                                sortDirection === 'asc' ? (
                                  <ArrowUp className="w-4 h-4" />
                                ) : (
                                  <ArrowDown className="w-4 h-4" />
                                )
                              )}
                            </div>
                          </th>
                        );
                      });

                      return result;
                    })()}
                  </tr>
                  {/* Weight Row — satu sel untuk checkbox + seluruh kolom Basic Information (label Weight) */}
                  <tr style={{ backgroundColor: '#F0F8FF' }}>
                    {(() => {
                      const categories = dynamicCategories;

                      const visibleCols = allColumnDefinitions.filter((col) => visibleColumns.has(col.key));
                      const allCategoryColumns = categories.flatMap(c => c.columns);
                      const result: JSX.Element[] = [];

                      const { mergedBasicCluster, basicVisibleCols } = tableHeadBasicMerge;

                      if (mergedBasicCluster) {
                        // Weight label cell — sticky left-0
                        result.push(
                          <th
                            key="weight-label"
                            className="sticky left-0 z-[100] px-2 py-2 text-left w-[50px] min-w-[50px] max-w-[50px]"
                            style={{ backgroundColor: '#F0F8FF', top: theadStickyTops.row3 }}
                          >
                            <Text span size="xs" fw={600} c="neutral.7">Weightage</Text>
                          </th>
                        );
                        // Individual cells for each Basic Info column — only name is sticky
                        basicVisibleCols.forEach((col, idx) => {
                          const isName = col.key === 'name';
                          const isLastBasicCol = idx === basicVisibleCols.length - 1;
                          result.push(
                            <th
                              key={`weight-basic-${col.key}`}
                              className={`px-4 py-2 ${getColumnWidth(col.key)} ${isName ? 'sticky left-[50px] z-[66]' : ''} ${isLastBasicCol ? 'border-r border-gray-300 z-[61]' : ''}`}
                              style={{ backgroundColor: '#F0F8FF', ...(isName ? { top: theadStickyTops.row3 } : {}) }}
                            >
                              <Text span size="xs" c="neutral.5">-</Text>
                            </th>
                          );
                        });
                      } else {
                        result.push(
                          <th
                            key="weight-checkbox-only"
                            className="sticky left-0 z-[100] px-4 py-2 text-left"
                            style={{ backgroundColor: '#F0F8FF', top: theadStickyTops.row3 }}
                          >
                            <Text span size="xs" fw={600} c="neutral.7">Weightage</Text>
                          </th>
                        );
                      }

                      // Kolom yang bisa dibobot: semua variabel berskor (lihat `bisaDibobot`).
                      const canHaveWeight = bisaDibobot;

                      // Kotak bobot variabel: bawaan 1, kelipatan 0,5, tidak boleh 0. Cluster tidak dibobot.
                      const kotakBobot = (key: string) =>
                        canHaveWeight(key) ? (
                          <DSTextInput
                            type="number"
                            min={String(BOBOT_MIN)}
                            max={String(BOBOT_MAKS)}
                            step={String(BOBOT_LANGKAH)}
                            aria-label={`Weight ${key}`}
                            value={bobotEfektif[key] ?? BOBOT_BAWAAN}
                            onChange={(e) => {
                              const v = rapikanBobot(parseFloat(e.target.value));
                              setBobotVar((prev) => ({ ...prev, [key]: v }));
                            }}
                            size="xs" w={64} styles={{ input: { textAlign: 'left' } }}
                            style={{ backgroundColor: 'white' }}
                          />
                        ) : (
                          (() => {
                            const kotakMati = (
                              <DSTextInput
                                type="number"
                                value={0}
                                disabled
                                size="xs" w={64} styles={{ input: { textAlign: 'left' } }}
                                style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', opacity: 0.4 }}
                              />
                            );
                            const alasan = alasanTakBisaDibobot(key);
                            // Tooltip hanya untuk data tambahan: alasannya spesifik tipe datanya.
                            return alasan ? (
                              <Tooltip label={alasan} withArrow>
                                <div style={{ display: 'inline-block' }}>{kotakMati}</div>
                              </Tooltip>
                            ) : kotakMati;
                          })()
                        );

                      const renderWeightCell = (col: ColumnConfig, isClusterScore = false) => {
                        return (
                          <th
                            key={`weight-${col.key}`}
                            className={`px-4 py-2 ${getColumnWidth(col.key)} ${
                              col.key === 'name'
                                    ? 'sticky left-[50px] z-[66]'
                                    : ''
                            }`}
                            style={{ backgroundColor: '#F0F8FF', ...(col.key === 'name' ? { top: theadStickyTops.row3 } : {}) }}
                          >
                            {kotakBobot(col.key)}
                          </th>
                        );
                      };

                      // Render category columns with Total Score weight
                      categories.forEach((category) => {
                        if (mergedBasicCluster && category.name === 'Basic Information') return;

                        const gridCols = getGridColumnsForCategory(category, visibleCols, clusterTotalSlotOverride);

                        if (gridCols.length > 0) {
                          // Render weights for regular columns
                          gridCols.forEach((col, idx) => {
                            const isBasicInfo = category.name === 'Basic Information';
                            const isLastColInBasic = isBasicInfo && idx === gridCols.length - 1;

                            const cellElement = renderWeightCell(col);
                            // Add border to the weight cell if it's the last column of Basic Information
                            if (isLastColInBasic) {
                              result.push(
                                <th
                                  key={`weight-${col.key}`}
                                  className={`px-4 py-2 ${getColumnWidth(col.key)} ${
                                    col.key === 'name'
                                          ? 'sticky left-[50px] z-[67]'
                                          : 'z-[67]'
                                  } border-r border-gray-300`}
                                  style={{ backgroundColor: '#F0F8FF', ...(col.key === 'name' ? { top: theadStickyTops.row3 } : {}) }}
                                >
                                  {kotakBobot(col.key)}
                                </th>
                              );
                            } else {
                              result.push(cellElement);
                            }
                          });

                          // Add weight input for Total Score (only if category has totalScoreKey)
                          if (category.totalScoreKey) {
                            result.push(
                              <th
                                key={`weight-${category.totalScoreKey}`}
                                className={`px-4 py-2 ${getColumnWidth(category.totalScoreKey)} border-r border-gray-300`}
                                style={{ backgroundColor: '#F0F8FF' }}
                              >
                                {klasterBerbobot.includes(category.name) ? (
                                  <Tooltip withArrow multiline w={240} label="Cluster weight: how much this cluster's Total Score counts in the final ranking (default 1, steps of 0.5).">
                                    <div style={{ display: 'inline-block' }}>
                                      <DSTextInput
                                        type="number"
                                        min={String(BOBOT_MIN)}
                                        max={String(BOBOT_MAKS)}
                                        step={String(BOBOT_LANGKAH)}
                                        aria-label={`Cluster weight ${category.name}`}
                                        value={bobotClusterDari(category.name)}
                                        onChange={(e) => {
                                          const v = rapikanBobot(parseFloat(e.target.value));
                                          setBobotCluster((prev) => ({ ...prev, [category.name]: v }));
                                        }}
                                        size="xs" w={64} styles={{ input: { textAlign: 'left' } }}
                                        style={{ backgroundColor: 'white' }}
                                      />
                                    </div>
                                  </Tooltip>
                                ) : (
                                  <Text span size="xs" c="neutral.5" title="No scored variables are visible in this cluster">—</Text>
                                )}
                              </th>
                            );
                          }
                        }
                      });

                      // Render post-category columns (excluding cluster score columns as they're already rendered as totalScoreKey)
                      const clusterScoreKeys = categories.map(c => c.totalScoreKey).filter(key => key !== undefined);
                      visibleCols.filter(col =>
                        !allCategoryColumns.includes(col.key) &&
                        !clusterScoreKeys.includes(col.key)
                      ).forEach(col => {
                        result.push(renderWeightCell(col));
                      });

                      return result;
                    })()}
                    
                    {/* Ranking: rata-rata skor semua cluster — tak ada total bobot yang harus dijaga */}
                    <th
                      className="sticky right-0 z-[66] border-l border-gray-300 px-4 py-2"
                      style={{ backgroundColor: '#F0F8FF', top: theadStickyTops.row3 }}
                    >
                      <Tooltip
                        withArrow
                        multiline
                        w={260}
                        label="Ranking = weighted average of all cluster scores. Each cluster score is the weighted average of its variables. Every variable and cluster has weight 1 by default; use steps of 0.5."
                      >
                        <Text span size="xs" fw={700} c="neutral.7">Weighted avg.</Text>
                      </Tooltip>
                      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                        <DSButton size="compact-xs" variant="subtle" disabled={!adaBobotDiubah} onClick={() => { setBobotVar({}); setBobotCluster({}); }}>
                          Reset to 1
                        </DSButton>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employeesWithClusterScores.map((employee) => {
                    const empWithAll = employee as Employee & { 
                      ranking: number; 
                      score: number;
                      competencyScore: number;
                      commitmentScore: number;
                      contributionScore: number;
                      aspectScore: number;
                    };
                    return (
                    <tr
                      key={empWithAll.id}
                      className={`hover:bg-gray-50 transition-colors ${pinnedTableIds.includes(empWithAll.id) ? 'bg-orange-50' : ''}`}
                    >
                      <td className="sticky left-0 z-[56] bg-white px-2 py-3 w-[50px]">
                        <DSCheckbox
                          checked={selectedEmployees.includes(empWithAll.id)}
                          onChange={() => toggleEmployeeSelection(empWithAll.id)}
                        />
                      </td>
                      {(() => {
                        const categories = dynamicCategories;

                        const visibleCols = allColumnDefinitions.filter((col) => visibleColumns.has(col.key));
                        const allCategoryColumns = categories.flatMap(c => c.columns);
                        const result: JSX.Element[] = [];

                        // Render category columns with Total Score at the end
                        categories.forEach((category) => {
                          const gridCols = getGridColumnsForCategory(category, visibleCols, clusterTotalSlotOverride);

                          if (gridCols.length > 0) {
                            // Render regular columns — tanpa garis vertikal dalam cluster
                            gridCols.forEach((col, idx) => {
                              const isBasicInfo = category.name === 'Basic Information';
                              const isLastColInBasic = isBasicInfo && idx === gridCols.length - 1;

                              result.push(
                                <td
                                  key={col.key}
                                  className={`px-4 py-3 ${getColumnWidth(col.key)} ${
                                    col.key === 'name'
                                      ? `sticky left-[50px] ${isLastColInBasic ? 'z-[57]' : 'z-[55]'} bg-white`
                                      : `${isLastColInBasic ? 'z-[56]' : ''}`
                                  } ${isLastColInBasic ? 'border-r border-gray-300' : ''}`}
                                >
                                  {renderCellContent(empWithAll, col.key)}
                                </td>
                              );
                            });

                            // Slot Total Score — garis tipis sebagai cluster separator (menembus header–body)
                            if (category.totalScoreKey) {
                              const slotKey = getEffectiveTotalSlotColumnKey(category, clusterTotalSlotOverride)!;
                              const slotUsesAlt = slotUsesAlternateColumn(category, clusterTotalSlotOverride);
                              result.push(
                                <td key={`${category.name}-total-slot-cell`} className={`px-4 py-3 text-left border-r border-gray-300 ${getColumnWidth(slotKey)}`}>
                                  {slotUsesAlt ? (
                                    renderCellContent(empWithAll, slotKey)
                                  ) : (
                                    <Text span size="xs" fw={700} c="neutral.7">
                                      {empWithAll[category.totalScoreKey as keyof typeof empWithAll]}
                                    </Text>
                                  )}
                                </td>
                              );
                            }
                          }
                        });

                        // Render post-category columns
                        const clusterScoreKeys = categories.map(c => c.totalScoreKey).filter(key => key !== undefined);
                        visibleCols.filter(col =>
                          !allCategoryColumns.includes(col.key) &&
                          !clusterScoreKeys.includes(col.key)
                        ).forEach(col => {
                          result.push(
                            <td key={col.key} className={`px-4 py-3 ${getColumnWidth(col.key)}`}>
                              {renderCellContent(empWithAll, col.key)}
                            </td>
                          );
                        });

                        return result;
                      })()}
                      
                      {/* Ranking Cell - Sticky Right */}
                      <td
                        className="sticky right-0 z-[56] border-l border-gray-300 bg-white px-4 py-3 min-w-[130px] w-[130px]"
                        style={{ top: theadStickyTops.row3 }}
                      >
                        {(() => {
                          const missingCols = getMissingWeightedColumns(empWithAll);
                          const hasIncomplete = missingCols.length > 0;
                          return (
                            <>
                              <div className="flex items-center justify-center gap-1.5">
                                <Text span size="md" fw={700} c="neutral.7">
                                  {empWithAll.score.toFixed(1)}
                                </Text>
                                {hasIncomplete && (
                                  <Tooltip
                          position="left"
                          multiline
                          w={320}
                          label={
                                    <>
                                      {/*
                                        Fragmen diperlukan: di Radix, `TooltipContent`
                                        sendiri yang jadi pembungkus keempat elemen ini.
                                        Prop `label` Mantine hanya menerima SATU induk.
                                      */}
                                      <p className="font-semibold mb-1">Data tidak lengkap</p>
                                      <p className="text-xs opacity-80 mb-1">Skor dihitung dari data yang tersedia. Kolom berikut tidak memiliki nilai:</p>
                                      <ul className="text-xs list-disc pl-3 space-y-0.5">
                                        {missingCols.slice(0, 8).map(col => (
                                          <li key={col}>{col}</li>
                                        ))}
                                        {missingCols.length > 8 && (
                                          <li className="opacity-60">+{missingCols.length - 8} lainnya</li>
                                        )}
                                      </ul>
                                    </>
                          }
                        >
                                      <span className="cursor-help flex items-center">
                                        <AlertCircle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                                      </span>
                        </Tooltip>
                                )}
                              </div>
                              <div className="text-center mt-1">
                                <Text span size="xs" c="neutral.6">
                                  Ranking: {empWithAll.ranking}
                                </Text>
                              </div>
                            </>
                          );
                        })()}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>

              {employeesWithRanking.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No employees match the selected filters.
                </div>
              )}
          </div>
        </div>

      {/* Floating Horizontal Scrollbar */}
      <div 
        ref={floatingScrollbarRef}
        className="fixed bottom-0 left-0 right-0 z-[80] overflow-x-auto overflow-y-hidden bg-gray-100 border-t border-gray-300"
        style={{ height: '16px' }}
      >
        <div 
          ref={floatingScrollContentRef}
          style={{ height: '1px' }}
        />
      </div>

      {/* Filter Modal Dialog */}
      <Modal
        opened={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        title="Filter"
        size={800}
      >
          
          <div className="space-y-4 py-4">

            {/* Match Mode Selector */}
            <div className="flex items-center gap-2 text-xs text-[#495057]">
              <span>Meeting</span>
              <Select
                value={matchMode}
                onChange={(value) => { if (value) setMatchMode(value as MatchMode); }}
                data={[
                  { value: 'all', label: 'All' },
                  { value: 'any', label: 'Any' },
                ]}
                allowDeselect={false}
                size="xs"
                w={92}
              />
              <span>of the condition</span>
            </div>

            {/* Filter Condition Rows */}
            {activeFilterConditions.map((condition) => (
              <div key={condition.id} className="flex gap-3 items-start w-full min-w-0">
                {/* Field Selector — locked for Employee condition */}
                <div className="w-[200px] shrink-0">
                  {condition.field === 'employees' ? (
                    <div className="w-full bg-white rounded-[16px] border border-[#dee2e6] px-3 py-2 text-xs flex items-center justify-between gap-2 h-9 cursor-not-allowed select-none">
                      <span>Employees</span>
                      <ChevronDown className="size-4 opacity-50 shrink-0" />
                    </div>
                  ) : (
                  <Select
                    value={condition.field || null}
                    onChange={(value) => {
                      if (!value) return;
                      const fieldInfo = medanFilter.find((m) => m.key === value);
                      if (!fieldInfo) return;
                      updateFilterCondition(condition.id, {
                        field: value,
                        fieldType: fieldInfo.type,
                        selectedValues: [],
                        operator: null,
                        value: null,
                        value2: null,
                      });
                    }}
                    data={medanFilter
                      // Yang sudah dipakai kondisi lain disembunyikan: dua kondisi atas
                      // medan yang sama saling menimpa tanpa ada yang tahu mana menang.
                      .filter((m) =>
                        !activeFilterConditions.some(
                          (c) => c.id !== condition.id && c.field === m.key,
                        ),
                      )
                      .map((m) => ({ value: m.key, label: m.label }))}
                    placeholder="Select field"
                    size="xs"
                    w="100%"
                    searchable
                    comboboxProps={{ zIndex: 320 }}
                  />
                  )}
                </div>

                {/* Conditional Value Input */}
                <div className="flex-1 min-w-0">
                  {condition.field && condition.fieldType === 'categorical' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full bg-white rounded-[16px] border border-[#dee2e6] px-3 py-2 flex items-center justify-between text-xs min-h-[36px]">
                          <div className="flex flex-wrap gap-1">
                            {condition.selectedValues && condition.selectedValues.length > 0 ? (
                              condition.selectedValues.map((val) => (
                                <div
                                  key={val}
                                  className="bg-[#e7f5ff] flex gap-1 items-center justify-center px-2 py-0.5 rounded-full"
                                >
                                  <Text span size="xs" fw={700} c="primary">
                                    {val}
                                  </Text>
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateFilterCondition(condition.id, {
                                        selectedValues: condition.selectedValues?.filter((v) => v !== val),
                                      });
                                    }}
                                    className="w-3.5 h-3.5 flex items-center justify-center cursor-pointer hover:opacity-60 transition-opacity"
                                  >
                                    <svg className="w-full h-full" fill="none" viewBox="0 0 8.5 8.5">
                                      <path d={svgPaths.p8acd700} stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                    </svg>
                                  </span>
                                </div>
                              ))
                            ) : (
                              <Text span c="neutral.5">Select values</Text>
                            )}
                          </div>
                          <svg className="w-4 h-4 shrink-0 ml-2" fill="none" viewBox="0 0 9.5 5.5">
                            <path d={svgPaths.p14416700} stroke="#495057" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </DropdownMenuTrigger>
                      {/*
                        z-index harus di atas Modal Mantine yang membungkus dialog Filters ini.

                        `DropdownMenuContent` bawaan ber-`z-[100]`, sementara Modal Mantine
                        berdiri di 200 — jadi daftar opsinya terender DI BELAKANG modal dan
                        muncul seolah-olah terbuka di luar panelnya. 320 angka yang sama yang
                        sudah dipakai `comboboxProps` di dialog ini untuk alasan yang sama.
                      */}
                      <DropdownMenuContent className="w-56 z-[320]">
                        {getFieldOptions(condition.field).map((option) => (
                          <DropdownMenuCheckboxItem
                            key={option}
                            checked={condition.selectedValues?.includes(option)}
                            /*
                              `onCheckedChange`, BUKAN `onChange`.

                              Ini komponen Radix, dan ia hanya membaca `onCheckedChange`; sisanya
                              disebar ke sebuah `<div role="menuitemcheckbox">`. React tidak pernah
                              memicu `onChange` pada div — jadi mengklik nilai di sini diam-diam tak
                              melakukan apa pun, `selectedValues` tetap kosong, dan predikat filternya
                              memulangkan `true` untuk semua orang. Filternya tampak ada dan tak
                              menyaring apa-apa, tanpa satu pun pesan galat.

                              Terbawa saat komponen dipindah ke design system: Mantine memakai
                              `onChange`, Radix `onCheckedChange`, dan dua tag ini ikut diubah padahal
                              belum ikut pindah.
                            */
                            onCheckedChange={(checked) => {
                              const currentValues = condition.selectedValues || [];
                              updateFilterCondition(condition.id, {
                                selectedValues: checked
                                  ? [...currentValues, option]
                                  : currentValues.filter((v) => v !== option),
                              });
                            }}
                            // Tanpa ini menunya menutup tiap kali satu nilai dicentang, padahal
                            // daftarnya memang untuk memilih beberapa sekaligus.
                            onSelect={(e) => e.preventDefault()}
                          >
                            {option}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {condition.field && condition.fieldType === 'boolean' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full bg-white rounded-[16px] border border-[#dee2e6] px-3 py-2 flex items-center justify-between text-xs min-h-[36px]">
                          <div className="flex flex-wrap gap-1">
                            {condition.selectedValues && condition.selectedValues.length > 0 ? (
                              condition.selectedValues.map((val) => (
                                <div
                                  key={val}
                                  className="bg-[#e7f5ff] flex gap-1 items-center justify-center px-2 py-0.5 rounded-full"
                                >
                                  <Text span size="xs" fw={700} c="primary">
                                    {val}
                                  </Text>
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateFilterCondition(condition.id, {
                                        selectedValues: condition.selectedValues?.filter((v) => v !== val),
                                      });
                                    }}
                                    className="w-3.5 h-3.5 flex items-center justify-center cursor-pointer hover:opacity-60 transition-opacity"
                                  >
                                    <svg className="w-full h-full" fill="none" viewBox="0 0 8.5 8.5">
                                      <path d={svgPaths.p8acd700} stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                    </svg>
                                  </span>
                                </div>
                              ))
                            ) : (
                              <Text span c="neutral.5">Select value</Text>
                            )}
                          </div>
                          <svg className="w-4 h-4 shrink-0 ml-2" fill="none" viewBox="0 0 9.5 5.5">
                            <path d={svgPaths.p14416700} stroke="#495057" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </DropdownMenuTrigger>
                      {/*
                        z-index harus di atas Modal Mantine yang membungkus dialog Filters ini.

                        `DropdownMenuContent` bawaan ber-`z-[100]`, sementara Modal Mantine
                        berdiri di 200 — jadi daftar opsinya terender DI BELAKANG modal dan
                        muncul seolah-olah terbuka di luar panelnya. 320 angka yang sama yang
                        sudah dipakai `comboboxProps` di dialog ini untuk alasan yang sama.
                      */}
                      <DropdownMenuContent className="w-56 z-[320]">
                        {['Yes', 'No'].map((option) => (
                          <DropdownMenuCheckboxItem
                            key={option}
                            checked={condition.selectedValues?.includes(option)}
                            /*
                              `onCheckedChange`, BUKAN `onChange`.

                              Ini komponen Radix, dan ia hanya membaca `onCheckedChange`; sisanya
                              disebar ke sebuah `<div role="menuitemcheckbox">`. React tidak pernah
                              memicu `onChange` pada div — jadi mengklik nilai di sini diam-diam tak
                              melakukan apa pun, `selectedValues` tetap kosong, dan predikat filternya
                              memulangkan `true` untuk semua orang. Filternya tampak ada dan tak
                              menyaring apa-apa, tanpa satu pun pesan galat.

                              Terbawa saat komponen dipindah ke design system: Mantine memakai
                              `onChange`, Radix `onCheckedChange`, dan dua tag ini ikut diubah padahal
                              belum ikut pindah.
                            */
                            onCheckedChange={(checked) => {
                              const currentValues = condition.selectedValues || [];
                              updateFilterCondition(condition.id, {
                                selectedValues: checked
                                  ? [...currentValues, option]
                                  : currentValues.filter((v) => v !== option),
                              });
                            }}
                            // Tanpa ini menunya menutup tiap kali satu nilai dicentang, padahal
                            // daftarnya memang untuk memilih beberapa sekaligus.
                            onSelect={(e) => e.preventDefault()}
                          >
                            {option}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {condition.field === 'employees' && condition.fieldType === 'employee-selector' && (
                    <Popover
                      opened={employeeDropdownOpenId === condition.id}
                      onChange={(open) => {
                        setEmployeeDropdownOpenId(open ? condition.id : null);
                        if (!open) setEmployeeFilterSearch('');
                      }}
                      position="bottom-start"
                      shadow="md"
                    >
                      <Popover.Target>
                        {/*
                          `onClick` WAJIB ditambahkan: Radix membuat PopoverTrigger
                          menoggle sendiri, Mantine tidak. Tanpa ini tombolnya
                          tergambar, bisa diklik, dan popovernya tak pernah muncul —
                          tanpa satu pun galat.
                        */}
                        <button
                          type="button"
                          onClick={() => setEmployeeDropdownOpenId((k) => (k === condition.id ? null : condition.id))}
                          className="w-full bg-white rounded-[16px] border border-[#dee2e6] px-3 py-2 flex items-center justify-between text-xs min-h-[36px]"
                        >
                          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                            {condition.selectedValues && condition.selectedValues.length > 0 ? (
                              mockEmployees
                                .filter((e) => condition.selectedValues!.includes(e.id))
                                .map((emp) => (
                                  <div
                                    key={emp.id}
                                    className="bg-[#e7f5ff] flex gap-1 items-center px-2 py-0.5 rounded-full"
                                  >
                                    <Text span size="xs" fw={700} c="primary" truncate maw={100}>
                                      {emp.name}
                                    </Text>
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateFilterCondition(condition.id, {
                                          selectedValues: condition.selectedValues?.filter((v) => v !== emp.id),
                                        });
                                      }}
                                      className="w-2 h-2 flex items-center justify-center cursor-pointer hover:opacity-60 transition-opacity"
                                    >
                                      <svg className="w-full h-full" fill="none" viewBox="0 0 8.5 8.5">
                                        <path d={svgPaths.p8acd700} stroke="#016699" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                      </svg>
                                    </span>
                                  </div>
                                ))
                            ) : (
                              <Text span size="xs" fw={700} c="primary">All Employee</Text>
                            )}
                          </div>
                          <svg className="w-4 h-4 shrink-0 ml-2" fill="none" viewBox="0 0 9.5 5.5">
                            <path d={svgPaths.p14416700} stroke="#495057" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </Popover.Target>
                      <Popover.Dropdown
                        className="w-[280px] p-0 rounded-[8px] overflow-hidden shadow-[2px_4px_20px_0px_#00000012] border border-[#dee2e6]"
                        align="start"
                      >
                        {/* Search */}
                        <div className="px-3 py-2 border-b border-[#dee2e6] bg-white">
                          <input
                            type="text"
                            placeholder="Search employees..."
                            value={employeeFilterSearch}
                            onChange={(e) => setEmployeeFilterSearch(e.target.value)}
                            className="w-full text-xs text-[#495057] outline-none placeholder-[#adb5bd] bg-transparent"
                          />
                        </div>
                        {/* Employee list */}
                        <div className="max-h-52 overflow-y-auto bg-white">
                          {/* All Employee — default option */}
                          {!employeeFilterSearch && (
                            <div
                              className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors ${
                                !condition.selectedValues || condition.selectedValues.length === 0
                                  ? 'bg-[#e7f5ff]'
                                  : 'hover:bg-[#f8f9fa]'
                              }`}
                              onClick={() => updateFilterCondition(condition.id, { selectedValues: [] })}
                            >
                              <DSCheckbox
                                checked={!condition.selectedValues || condition.selectedValues.length === 0}
                                className="pointer-events-none"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-[#495057]">All Employee</div>
                                <div className="text-[10px] font-normal text-[#868e96]">Show all employees</div>
                              </div>
                            </div>
                          )}
                          {mockEmployees
                            .filter((e) => {
                              if (!employeeFilterSearch) return true;
                              const term = employeeFilterSearch.toLowerCase();
                              return e.name.toLowerCase().includes(term) || e.department.toLowerCase().includes(term);
                            })
                            .map((emp) => {
                              const isSelected = condition.selectedValues?.includes(emp.id) ?? false;
                              return (
                                <div
                                  key={emp.id}
                                  className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors ${isSelected ? 'bg-[#e7f5ff]' : 'hover:bg-[#f8f9fa]'}`}
                                  onClick={() => {
                                    const current = condition.selectedValues || [];
                                    const newValues = isSelected
                                      ? current.filter((v) => v !== emp.id)
                                      : [...current, emp.id];
                                    updateFilterCondition(condition.id, { selectedValues: newValues });
                                  }}
                                >
                                  <DSCheckbox checked={isSelected} className="pointer-events-none" />
                                  <div className="flex-1 min-w-0">
                                    {/* font-subtitle: 12px/700, name as a label item */}
                                    <div className="text-xs font-bold text-[#495057] truncate">{emp.name}</div>
                                    {/* font-caption: 10px/400, department as helper text */}
                                    <div className="text-[10px] font-normal text-[#868e96] truncate">{emp.department}</div>
                                  </div>
                                </div>
                              );
                            })}
                          {mockEmployees.filter((e) => {
                            if (!employeeFilterSearch) return true;
                            const term = employeeFilterSearch.toLowerCase();
                            return e.name.toLowerCase().includes(term) || e.department.toLowerCase().includes(term);
                          }).length === 0 && (
                            <div className="px-3 py-3 text-xs text-[#adb5bd] text-center">No employees found</div>
                          )}
                        </div>
                        {/* Selected count + clear */}
                        {condition.selectedValues && condition.selectedValues.length > 0 && (
                          <div className="px-3 py-1.5 border-t border-[#dee2e6] flex items-center justify-between bg-[#f8f9fa]">
                            <Text span size="xs" fw={700} c="primary">
                              {condition.selectedValues.length} selected
                            </Text>
                            <button
                              onClick={() => updateFilterCondition(condition.id, { selectedValues: [] })}
                              className="text-xs text-[#de350b] hover:underline"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </Popover.Dropdown>
                    </Popover>
                  )}

                  {condition.field && condition.fieldType === 'numerical' && (
                    <div className="flex gap-2">
                      {/* Operator Selector */}
                      <div className="w-auto">
                        {/*
                          ⚠️ SVG tanda "=" yang dulu muncul di dalam pemicu HILANG.
                          Select design system menggambar nilainya sebagai teks dan
                          tidak punya jalan menyisipkan elemen ke medan isiannya.
                          Labelnya sendiri sudah membawa simbolnya (>, ≥, <, ≤, =),
                          jadi tidak ada informasi yang hilang — hanya ikonnya.
                        */}
                        <Select
                          value={condition.operator || null}
                          onChange={(value) => {
                            if (value) updateFilterCondition(condition.id, { operator: value as FilterOperator });
                          }}
                          data={[
                            { value: '>', label: '>' },
                            { value: '>=', label: '≥' },
                            { value: '<', label: '<' },
                            { value: '<=', label: '≤' },
                            { value: '=', label: '=' },
                            { value: 'between', label: 'Between' },
                          ]}
                          placeholder="≥"
                          allowDeselect={false}
                          size="sm"
                          w={96}
                          comboboxProps={{ zIndex: 320 }}
                        />
                      </div>

                      {/* Value Input */}
                      <DSTextInput
                        type="number"
                        placeholder="Value"
                        value={condition.value ?? ''}
                        onChange={(e) =>
                          updateFilterCondition(condition.id, {
                            value: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        size="sm" className="flex-1"
                      />

                      {/* Value 2 for Between */}
                      {condition.operator === 'between' && (
                        <DSTextInput
                          type="number"
                          placeholder="Value 2"
                          value={condition.value2 ?? ''}
                          onChange={(e) =>
                            updateFilterCondition(condition.id, {
                              value2: e.target.value ? Number(e.target.value) : null,
                            })
                          }
                          size="sm" className="flex-1"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Remove Button — disabled for Employee condition */}
                <button
                  onClick={() => removeFilterCondition(condition.id)}
                  disabled={condition.field === 'employees'}
                  className={`w-7 h-7 shrink-0 flex items-center justify-center mt-1.5 rounded-full transition-all ${
                    condition.field === 'employees'
                      ? 'opacity-25 cursor-not-allowed'
                      : 'hover:bg-gray-100'
                  }`}
                  title={condition.field === 'employees' ? 'Employee condition cannot be removed' : 'Remove condition'}
                >
                  <X className="w-5 h-5" style={{ color: 'var(--mantine-color-neutral-7)', strokeWidth: 2.5 }} />
                </button>
              </div>
            ))}

            {/* Add Condition Button */}
            <button
              onClick={addFilterCondition}
              className="flex items-center gap-2 px-3 py-2 text-[#016699] hover:bg-gray-50 rounded-[28px] transition-colors"
            >
              <Plus className="w-5 h-5" style={{ color: '#016699' }} />
              <Text span size="md" fw={700}>Add Condition</Text>
            </button>

            {/* Divider */}
            <div className="h-px bg-[#dee2e6] w-full" />

            {/* Footer — Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsFilterDialogOpen(false)}
                className="px-3 py-2 border border-[#016699] rounded-[28px] text-[#016699] text-sm font-bold w-[80px] hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFilterDialogOpen(false)}
                className="px-3 py-2 bg-[#016699] rounded-[28px] text-white text-sm font-bold w-[80px] hover:bg-[#014d73] transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Apply
              </button>
            </div>
          </div>
        </Modal>


      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployeeForDetail}
        isOpen={isEmployeeDetailModalOpen}
        onClose={() => {
          setIsEmployeeDetailModalOpen(false);
          setSelectedEmployeeForDetail(null);
        }}
      />
    </div>
  );
}