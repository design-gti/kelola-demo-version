// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { ambilDataTambahan } from '../lib/dataTambahanTdp';
import { formatTambahan, terisi } from '@/lib/dataTambahan';
import { KLASTER_BAWAAN, bacaKlasterPengguna, bacaOverrideKlaster } from '@/lib/klasterVisibilitas';
import { klasterEfektifKolom } from '../lib/klasterKolom';
import React, { useState, useEffect, useMemo, useRef, type ReactNode , useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { Employee } from '../data/mockEmployees';
import { posisiTargetPenerus } from '../data/tautanPenerus';
import { loadEmployeeDraftEmployees } from '../data/employeeDraft';
import { CSV_RAW_HEADERS } from '../data/tdpEmployees';
import { ColumnConfig } from '../data/columnDefinitions';
import { getProfileUrl } from '../data/profileLinks';
import { hitungSkor3C } from '../lib/skor3C';
import { matchPercent } from '@/vismap/v2/layers';
// kelola-web mengimpor ini dari aspects.generated; generator demo membuat bentuk lain, jadi dijembatani.
import { STANDARDS_BY_POSITION } from '../lib/standarPosisi';
import {
  X,
  Users,
  Search,
  GripVertical,
  Pin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ActionIcon, Button, Group, Select, TextInput, Tooltip } from '@talentlytica/prodigy';
/*
  ⚠️ `Text` diambil dari `@mantine/core`, BUKAN `@talentlytica/prodigy`.

  Prodigy mengekspor 50 komponen dan `Text` tidak termasuk (begitu juga `Title` dan
  `Group`) — ia membungkus komponen form dan tata letak, sisanya dipakai langsung
  dari Mantine dengan tema Prodigy yang sama. Pola ini sudah dipakai di Beranda,
  mis. `QuickProfileAccessCard`.

  Kesalahan mengimpornya dari Prodigy TIDAK ketahuan `tsc` (berkas ini
  `@ts-nocheck`) dan tidak ketahuan lint. Yang terjadi di peramban: identifiernya
  jatuh ke konstruktor DOM global `Text`, dan seluruh layar mati dengan
  "Failed to construct 'Text'".
*/
import { Text } from '@mantine/core';
import { Tag } from '@/components/ui/Tag';
import VisibleColumnsDialog from './VisibleColumnsDialog';
import { Columns3 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Shared visible-columns storage key (must match TableScreener)
// ---------------------------------------------------------------------------
const VISIBLE_COLUMNS_STORAGE_KEY = 'visibleColumns.v8';
/*
  Penanda "kolom bawaan sudah pernah disusulkan sampai versi ini".

  Dinaikkan saat ada kolom ber-`defaultVisible` BARU yang harus muncul sekali di layar
  orang yang sudah pernah memakai TDP. Lihat pemakaiannya di initializer `visibleColumns`.
*/
const COMPARE_DEFAULTS_VERSION_KEY = 'visibleColumns.v8.bawaan';
const COMPARE_DEFAULTS_VERSION = 'v7-potensi-tanpa-kompetensi';

// Basic-info column keys — always shown in the card header; skip in the aspect section.
const BASIC_KEYS = new Set(['name', 'role', 'department', 'level']);
/** Variabel DISC: digambar sebagai ubin di atas kartu, dan hanya tampil bila dicentang di Data Visibility. */
const KUNCI_DISC = 'csv:Personality (DISC)';

// ---------------------------------------------------------------------------
// Duplicate of TableScreener helpers (kept in sync) to avoid cross-component
// import cycles.  These derive column metadata from raw CSV headers.
// ---------------------------------------------------------------------------
const COVERED_CSV_HEADERS = new Set<string>([
  'Name', 'Position', 'Tim', 'Level',
  // (kolom [KOMPETENSI] tak lagi dicakup kolom bertipe — lihat catatan di atas)
  // Filter / rendering helpers — not user-facing columns
  'Shown in TDP', 'Photo URL',
  // Aggregate typed columns — superseded by cluster averages
  // 'IQ' TIDAK lagi di sini: Vismap menawarkannya sebagai variabel, jadi TDP juga harus.
  'Capability',
  // Performance / Engagement / Potensi punya kolom bertipe (di bawah) dari sumber yang sama.
  'Performance', 'Engagement', 'Potensi',
  // Career History — covered by typed columns above (yearsInCompany, yearsInRole, etc.)
  'Years In Company', 'Years In Role', 'Last Promotion Date', 'Education',
]);

function clusterFromCsvHeader(h: string): ColumnConfig['cluster'] | undefined {
  if (h.startsWith('[KOMPETENSI]')) return 'aspect';
  /*
    Competency Score — aspek yang dibaca kartu Competency di iProfile, dipancarkan
    `tdpCsv.ts` sebagai satu grup kurung per kategori.

    ⚠️ BUKAN cluster `competency`. Cluster itu dibuang dari kartu Compare di tempat
    pengelompokan ("Capability cluster excluded"), jadi kolom yang memakainya akan bisa
    dicentang di Data Visibility lalu tak pernah muncul di kartu.
  */
  if (h.startsWith('[GENERAL]')) return 'competencyGeneral' as ColumnConfig['cluster'];
  if (h.startsWith('[TECHNICAL]')) return 'competencyTechnical' as ColumnConfig['cluster'];
  /*
    Aspek potensi per butir — sumber yang sama dengan kartu Potency di iProfile. Satu
    section, bukan satu per kategori: yang dibandingkan orang di sini butirnya, dan empat
    section terpisah hanya memecah daftar yang pendek.
  */
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
  return undefined;
}

/*
  Label yang tidak mengikuti nama headernya. Harus sama dengan `LABEL_KOLOM_CSV` di
  `TableScreener.tsx`: dialog Data Visibility dipakai bersama kedua view, dan satu kolom
  yang bernama lain di tiap view membuat daftarnya tak bisa dipercaya.
*/
const LABEL_KOLOM_CSV: Record<string, string> = {
  'Position Title': 'Position',
};

function labelFromCsvHeader(h: string): string {
  return LABEL_KOLOM_CSV[h] ?? (h.replace(/^\[[^\]]+\]\s*/, '').trim() || h);
}

// Typed columns (mirrors TableScreener typedColumnDefinitions)
const typedColumnDefs: ColumnConfig[] = [
  { key: 'name',             label: 'Employee',                             sortable: true, defaultVisible: true },
  // ⚠️ Isinya DEPARTEMEN, bukan jabatan — lihat catatan panjang di `TableScreener.tsx`.
  { key: 'role',             label: 'Department',                           sortable: true, defaultVisible: true },
  { key: 'department',       label: 'Tim',                                  sortable: true, defaultVisible: false },
  { key: 'level',            label: 'Level',                                sortable: true, defaultVisible: false },
  /*
    ⚠️ Delapan kolom aspek yang DIPATOK dulu berdiri di sini:

        adaptability     'Agility and Adaptability'
        teamwork         'Customer Focus'
        decisionMaking   'Building Strategic Partnership'
        innovation       'Developing Organizational Capabilities'
        communication    'Optimizing Work Process'
        leadership       'Driving Execution'
        problemSolving   'Leading Change'
        analyticalSkills 'Strategic Orientation'

    Nama-nama itu milik dataset demo. Aspek yang benar-benar dinilai di kelola
    berbeda, dan `tdpCsv.ts` memancarkannya apa adanya dengan awalan `[KOMPETENSI] `
    — jadi tak satu pun dari delapan medan turunan di atas pernah terisi, dan
    kedelapan baris itu menampilkan "No Data" untuk SETIAP orang, selamanya.

    Yang menyembunyikannya: kolom `[KOMPETENSI]` yang sungguhan memang dibangun oleh
    `autoCsvColumnDefs` di bawah, tapi dulu tidak tampil secara bawaan. Jadi layar
    ini memperlihatkan delapan kolom yang tak bisa terisi sambil menyembunyikan yang
    bisa.

    `TableScreener.tsx` sudah dibetulkan begini sebelumnya; berkas ini — yang
    kepalanya mengaku "kept in sync" — tertinggal. Menambalnya dengan memetakan
    aspek yang namanya kebetulan mirip ditolak secara eksplisit di `tdpCsv.ts`.
  */
  { key: 'competencyMatch',  label: 'Competency Score (Current Job)',                           sortable: true, defaultVisible: true },
  // Tiga kolom bertipe ini menggantikan kolom CSV polos; clusternya ikut supaya tetap tampil di section yang benar.
  { key: 'engagementScore',  label: 'Engagement',                           sortable: true, defaultVisible: false, cluster: 'commitment' },
  { key: 'performanceRating',label: 'Performance',                          sortable: true, defaultVisible: true, cluster: 'contribution' },
  { key: 'potentialRating',  label: 'Potensi',                              sortable: true, defaultVisible: false, cluster: 'potency' },
  // Career History typed columns — data from employee fields, cluster: careerHistory
  { key: 'yearsInCompany',   label: 'Years In Company',  sortable: true, defaultVisible: false, cluster: 'careerHistory' as any },
  { key: 'yearsInRole',      label: 'Years In Role',     sortable: true, defaultVisible: false, cluster: 'careerHistory' as any },
  { key: 'lastPromotionDate',label: 'Last Promotion Date', sortable: true, defaultVisible: false, cluster: 'careerHistory' as any },
  { key: 'education',        label: 'Education',         sortable: true, defaultVisible: false, cluster: 'careerHistory' as any },
];

const autoCsvColumnDefs: ColumnConfig[] = CSV_RAW_HEADERS
  .filter((h) => h && !COVERED_CSV_HEADERS.has(h))
  .map((h) => ({
    key: `csv:${h}` as ColumnConfig['key'],
    label: labelFromCsvHeader(h),
    sortable: true,
    // Aspek tampil secara BAWAAN: ia isi utama layar ini, dan sebelumnya peran itu
    // dipegang delapan kolom yang dipatok. Sama dengan `TableScreener.tsx`.
    defaultVisible:
      h.startsWith('[LEADERSHIP STYLE]') ||
      h.startsWith('[GENERAL]') ||
      h.startsWith('[TECHNICAL]') ||
      h.startsWith('[POTENSI]') ||
      // Ubin DISC di kartu dulu selalu tampil; kini ia variabel yang bisa dicentang, bawaannya tampil.
      h === 'Personality (DISC)',
    cluster: clusterFromCsvHeader(h),
  }));

/** All column definitions available to both Table and Compare views. */
/*
  Data TAMBAHAN dari Profile Data — kolom data extension buatan perusahaan, disuntikkan `/tdp-view` sebelum modul
  ini dimuat. Semua tipe boleh tampil di kartu; yang bisa dibobot hanya soal tabel.
*/
const additionalColumnDefs: ColumnConfig[] = ambilDataTambahan().kolom.map((k) => ({
  key: k.id as ColumnConfig['key'],
  label: k.label,
  sortable: false,
  defaultVisible: false,
  dariProfileData: true,
  tipeData: k.tipe,
}));

const allCompareColumnDefs: ColumnConfig[] = [...typedColumnDefs, ...autoCsvColumnDefs, ...additionalColumnDefs];

/*
  ── Competency Score terhadap jabatan target ──

  Skor seseorang tidak berubah ketika jabatan target diganti; yang berubah STANDAR yang
  dipakai membandingkannya. `STANDARDS_BY_POSITION` menyimpan standar itu per judul
  jabatan — ruang kunci yang sama dengan pilihan di dropdown target, yang memang
  diturunkan dari kolom `Position Title`.

  ⚠️ Berkas itu data demo yang dibangkitkan saat build. Di `KELOLA_API_MODE=http`
  pencariannya meleset dan seluruh penanda di bawah diam — sama persis dengan keadaan
  ubin Capability dan baris Competency Match hari ini, yang juga membacanya lewat
  `matchPercent`. Jadi ini bukan kemunduran baru, tapi jangan dikira sudah jalan di
  produksi. Skornya sendiri TIDAK bergantung padanya: ia datang dari CSV, yang dibangun
  dari gateway dan hidup di kedua mode.
*/
const AWALAN_KATEGORI: Record<string, string> = {
  competencyGeneral: '[GENERAL] ',
  competencyTechnical: '[TECHNICAL] ',
};


/*
Jabatan seseorang untuk ditampilkan.

`employee.role` dibaca dari kolom CSV `Position`, yang isinya DEPARTEMEN ("Operasional")
— bukan jabatan. Di bawah nama seseorang, yang orang baca sebagai jabatannya justru baris
itu, jadi yang dipakai `Position Title` ("Operations Lead"). `role` tetap jadi cadangan
kalau kolomnya kosong, supaya barisnya tak pernah hampa.
*/
function jabatan(employee: Employee): string {
  return employee.csvFields?.['Position Title'] || employee.role || '';
}

/**
 * Ubah label yang HURUF BESAR SEMUA jadi kapital di awal kata.
 *
 * Nama grup di header CSV ditulis huruf besar semua (`[KOMPETENSI] …`), sementara
 * label yang tidak datang dari CSV ditulis tangan dengan kapital awal
 * ("Engagement", "Leadership Style", "Ranking"). Hasilnya di satu baris ubin yang
 * sama: "KOMPETENSI" berteriak di sebelah "Engagement" yang tidak.
 *
 * Diubah hanya kalau string itu memang tak punya satu pun huruf kecil. Label
 * bercampur besar-kecil dibiarkan apa adanya — kalau seseorang menulis "iProfile"
 * atau "GTQ Score", ia bermaksud begitu.
 *
 * ⚠️ Singkatan yang berdiri sendiri ikut terkena: grup bernama "IQ" akan jadi "Iq".
 * Tidak ada grup semacam itu sekarang (yang ada KOMPETENSI, ENGAGEMENT, LEADERSHIP
 * PROFILE, LEADERSHIP STYLE), dan menebak mana yang singkatan mana yang bukan lebih
 * berisiko daripada memperbaikinya kalau benar-benar muncul.
 */
function keKapitalAwal(teks: string): string {
  if (/[a-z]/.test(teks)) return teks;
  return teks.toLowerCase().replace(/(^|\s)(\S)/g, (_, spasi, huruf) => spasi + huruf.toUpperCase());
}

// Derive display names for internal cluster IDs from CSV bracket prefixes
// e.g. { aspect: 'Kompetensi', commitment: 'Engagement', contribution: 'Leadership Profile' }
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

// Friendly fallback labels for typed clusters not covered by CSV bracket prefixes
const CLUSTER_FALLBACK_LABELS: Record<string, string> = {
  aspect: 'Capability',
  competency: 'Capability',
  /*
    Dua section terpisah, bukan satu section bertab. Keduanya adalah Competency Score —
    yang mengikatnya jadi satu grup adalah Data Visibility, bukan kartu ini; di kartu
    masing-masing berdiri sendiri supaya bisa digeser dan dilipat terpisah.
  */
  competencyGeneral: 'General',
  competencyTechnical: 'Technical',
  commitment: 'Commitment',
  contribution: 'Contribution',
  potency: 'Potensi',
  readiness: 'Readiness',
  leadershipStyle: 'Leadership Style',
  careerHistory: 'Career History',
};

function clusterDisplayName(cluster: string): string {
  const idTerbaca = cluster.charAt(0).toUpperCase() + cluster.slice(1);
  return CLUSTER_FALLBACK_LABELS[cluster] ?? idTerbaca;
}

// Stable order for cluster sections in the Compare card
// Kuncinya = cluster di dialog Data Visibility (`lib/klasterKolom`); Competency Score dipecah jadi General dan Technical.
const CLUSTER_ORDER = ['basic', 'capability', 'competencyGeneral', 'competencyTechnical', 'commitment', 'contribution', 'potency', 'readiness', 'leadershipStyle', 'careerHistory', 'additional'];

// ---------------------------------------------------------------------------
// Helpers to read a column value from an Employee record
// ---------------------------------------------------------------------------
function getColValue(col: ColumnConfig, employee: Employee): number | string | null {
  const k = String(col.key);
  if (col.dariProfileData) {
    const uuid = (employee as any).csvFields?.['Referance ID'];
    const nilai = uuid ? ambilDataTambahan().nilai[uuid]?.[k] : undefined;
    // Teks apa adanya (yes/no jadi Yes/No); angka sengaja TIDAK dikembalikan sebagai number supaya tak
    // digambar sebagai kotak rating/bilah skor — itu bukan skor.
    return terisi(nilai) ? formatTambahan(col.tipeData ?? 'string', nilai) : null;
  }
  if (k.startsWith('csv:')) {
    const header = k.slice(4);
    const raw = (employee as any).csvFields?.[header];
    if (raw === undefined || raw === null || raw === '' || raw === '#N/A' || raw === 'N/A') return null;
    const num = parseFloat(raw);
    // Treat as string if: not a number, or is a large integer (>999999) which is likely an ID
    if (isNaN(num)) return String(raw);
    if (Number.isInteger(num) && num > 999999) return String(raw);
    return num;
  }
  const val = (employee as any)[k];
  if (val === undefined || val === null) return null;
  return val as number | string;
}

// ---------------------------------------------------------------------------
// 3C scores
// ---------------------------------------------------------------------------
function get3CScores(employee: Employee): {
  capability: number;
  commitment: number;
  contribution: number | null;
  character: string;
} {
  // Rumusnya hidup di `lib/skor3C` — dipakai bersama Table supaya angkanya tak bisa menyimpang.
  return hitungSkor3C((employee as any).csvFields);
}

/*
  Sel KERANGKA — wireframe untuk kolom yang isinya belum sempat digambar.

  Dipakai saat orang menggeser deret: kolom yang baru masuk layar muncul sebagai kotak
  abu-abu dulu, lalu terisi begitu geserannya berhenti. Alasan dan angkanya ada di catatan
  "Dua rentang" pada `rentangKolom`.

  ⚠️ Sengaja SEMURAH mungkin: satu `<div>`, tanpa teks, tanpa komponen design system, tanpa
  animasi. Begitu ia mulai memakai `Text`, `Tag`, atau animasi denyut, biaya render yang
  sedang dihindari justru kembali — dan kerangka yang mahal tak ada gunanya.

  `tinggi` diberikan pemanggilnya supaya barisnya tidak berubah tinggi saat kerangka
  bertukar dengan isi sebenarnya; kisi mengambil tinggi baris dari sel TERTINGGI, jadi
  selisih beberapa piksel saja sudah membuat seluruh deret bergeser naik-turun.
*/
function SelKerangka({ tinggi, lebar = '100%' }: { tinggi: number; lebar?: number | string }) {
  return (
    <div className="px-4" style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ height: tinggi, width: lebar, borderRadius: 6, background: '#f1f3f5' }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rating boxes: filled squares up to value (1-5 scale)
// ---------------------------------------------------------------------------
const RatingBoxes = ({
  score,
  maxScore = 5,
  accentColor = 'var(--mantine-color-primary-filled)',
}: {
  score: number;
  maxScore?: number;
  accentColor?: string;
}) => (
  <div className="flex gap-[2px]">
    {Array.from({ length: maxScore }, (_, i) => (
      <div
        key={i}
        style={{
          width: 10,
          height: 10,
          borderRadius: 2,
          background: i < score ? accentColor : '#e5e7eb',
        }}
      />
    ))}
  </div>
);

/**
 * Penanda "belum ada data".
 *
 * Dulu `<span>` yang dibentuk mirip pil sendiri: `borderRadius: 999`, padding
 * `2px 8px`, `background: '#fff8f0'`, `color/border: '#FD9F28'` — empat nilai yang
 * tak satu pun token, dan bukan komponen, jadi ia tidak ikut satu pun ketetapan
 * design system.
 *
 * Sekarang `Tag`, komponen pil yang sama dengan yang dipakai Beranda dan iProfile.
 * Oranyenya jadi token `warning` (paletnya #fff4e0…#b15200; #ff9836 di langkah 4
 * praktis warna yang sama dengan #FD9F28), jadi radius, padding, tinggi, dan bobot
 * datang dari Badge — bukan dari angka yang ditulis ulang di sini.
 */
const NoDataChip = () => <Tag warnaDS="warning">No Data</Tag>;

/**
 * Satu label + satu nilai di dalam ubin statistik.
 *
 * ── Kenapa labelnya `xs`, dan kenapa ubinnya dua kolom ──
 *
 * Label ini sempat 10px. Tak ada 10px di skala huruf theme — yang terkecil `xs` =
 * 12px — jadi angka itu tipografi di luar design system, sekalipun dibungkus
 * komponen `Text` milik DS.
 *
 * Yang menahannya bukan selera melainkan lebar, dan itu terukur: dengan TIGA ubin
 * sejajar tiap ubin cuma 77px, dan padding `px-3` menyisakan 53px ruang isi —
 * sementara "KOMPETENSI" perlu 74px pada 12px. Ia satu kata, jadi tak bisa
 * dibungkus; pada 10px pun ia sudah meluber 13px.
 *
 * Jawabannya bukan mengecilkan hurufnya melainkan melebarkan ubinnya. DUA kolom
 * memberi 120px per ubin, ruang isi 96px:
 *
 *     KOMPETENSI        74px   muat, sisa 22px
 *     Engagement        70px   muat
 *     Leadership Style  92px   muat
 *     Ranking           47px   muat
 *
 * Jumlah barisnya tetap dua, jadi tinggi kartunya praktis tak berubah.
 */
const StatUbin = ({ label, children, aksen = 'neutral.6' }: { label: string; children: ReactNode; aksen?: string }) => (
  <>
    <Text size="xs" c={aksen} mb={4} style={{ lineHeight: 1.4 }}>
      {label}
    </Text>
    <Text size="xs" fw={700} c="primary" style={{ lineHeight: 1.3 }}>
      {children}
    </Text>
  </>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface ComparisonProps {
  onToolbarRender?: (buttons: React.ReactNode) => void;
  onSearchRender?: (search: React.ReactNode) => void;
  /**
   * Id karyawan yang lolos filter tabel, dari `Screener`.
   *
   * `null` = tabelnya belum melaporkan apa pun (dipakai `localStorage` sebagai
   * cadangan). Larik KOSONG artinya lain: filternya menyisakan nol orang, dan itu
   * harus terlihat sebagai nol kartu — bukan diam-diam jatuh kembali ke 106.
   */
  visibleIds?: string[] | null;
  pinnedIds?: string[];
  onPinnedIdsChange?: (ids: string[]) => void;
}

// pid = canonical p-id from the raw CSV row, used to deep-link into /iprofile
const getIProfilePid = (emp: Employee) =>
  (emp.csvFields?.['Employee ID'] || '').trim()
    || ('p' + String(emp.id).replace(/\D/g, '').slice(-2).padStart(2, '0'));

export default function Comparison({ onToolbarRender, onSearchRender, visibleIds, pinnedIds: pinnedIdsProp, onPinnedIdsChange }: ComparisonProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [comparisonEmployees, setComparisonEmployees] = useState<Employee[]>([]);
  const [compareSearch, setCompareSearch] = useState('');
  const allEmployees = useMemo(() => loadEmployeeDraftEmployees(), []);

  /*
    Single-dropdown: value is 'current' | 'target:<role>'.

    Terpasang lebih dulu ke jabatan pemilik kartu kalau layar ini dibuka dari tombol
    "Compare Successors" di iProfile. Alasannya bukan kenyamanan: di mode "Current
    Position" setiap calon dinilai terhadap kursinya SENDIRI, sehingga angka di
    kartu-kartu itu tidak saling sebanding. Yang ditanyakan pemakai justru satu kursi
    untuk banyak orang — dan itu persis arti mode Target Position.

    Divalidasi terhadap data (`posisiTargetPenerus`), jadi jabatan yang tak dikenal
    jatuh ke 'current' alih-alih membuat dropdown tampil kosong.
  */
  const [dropdownValue, setDropdownValue] = useState<string>(() => {
    const target = posisiTargetPenerus(allEmployees);
    return target ? `target:${target}` : 'current';
  });

  // Derived state from dropdownValue
  const contextMode = dropdownValue === 'current' ? 'current' : 'target';
  const selectedRole = dropdownValue.startsWith('target:') ? dropdownValue.slice(7) : 'all';

  // Jabatan unik dari kolom "Position Title" di CSV — nama jabatan di org chart Vismap.
  // Bukan e.role (= departemen) melainkan csvFields['Position Title'] yang berisi
  // position_label dari kelola-api (mis. "Head of Engineering", "Frontend Lead").
  const uniqueRoles = useMemo(() => {
    const roles = new Set<string>();
    allEmployees.forEach(e => {
      const t = e.csvFields?.['Position Title'];
      if (t && t !== 'No Data') roles.add(t);
    });
    return Array.from(roles).sort();
  }, [allEmployees]);

  const combinedSelectData = useMemo(() => [
    { value: 'current', label: 'Current Position' },
    {
      group: 'Target Position',
      items: uniqueRoles.map(r => ({ value: `target:${r}`, label: r })),
    },
  ], [uniqueRoles]);

  // Pin state — use shared prop from parent if provided, otherwise fall back to local
  const [localPinnedIds, setLocalPinnedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('shared_pinned') || '[]'); } catch { return []; }
  });
  const pinnedIds = pinnedIdsProp ?? localPinnedIds;
  const setPinnedIds = (updater: string[] | ((prev: string[]) => string[])) => {
    const next = typeof updater === 'function' ? updater(pinnedIds) : updater;
    if (onPinnedIdsChange) onPinnedIdsChange(next);
    else setLocalPinnedIds(next);
  };

  // Card display order (unpinned cards)
  const [cardOrder, setCardOrder] = useState<string[]>([]);

  /*
    ── Lebar kolom TETAP, jumlah kartu mengikuti layar ──

    Sebelumnya layar ini dikunci empat kolom `minmax(0, 1fr)` dan sisanya dipindah ke
    halaman berikutnya. Akibatnya lebar kartu ikut lebar layar: terukur 398px di
    viewport 1912 dan sekitar 275px di 1200 — isi yang sama digambar dengan ukuran
    berbeda, sehingga dua orang tak pernah bisa dibandingkan secara adil antar layar.

    Sekarang kebalikannya: lebar kolom dipatok, dan BERAPA kartu yang terlihat
    ditentukan lebar layar. Sisanya digulir mendatar, bukan dipindah halaman.

    280px dipilih supaya di viewport lebar (1912) muat sekitar enam kartu, dan di 1200
    tetap muat tiga sampai empat — kira-kira sepadat tampilan lama pada layar kecil,
    tanpa pernah lebih sempit dari itu.
  */
  const LEBAR_KOLOM = 280;
  const JARAK_KOLOM = 10;

  // Penggulir utama, dan bilah nama lengket yang harus ikut bergeser bersamanya.
  const gulirRef = useRef<HTMLDivElement | null>(null);
  const gulirBilahRef = useRef<HTMLDivElement | null>(null);

  /*
    ── Virtualisasi kolom ──

    ⚠️ Layar ini merender SATU SEL PER KARYAWAN untuk SETIAP baris — header, tiap aspek,
    tiap label cluster, tombol aksi. Dengan 106 karyawan × 62 baris itu 6.572 sel berisi
    ~122.000 simpul DOM, dan terukur hanya 78 sel (1,2%) yang benar-benar terlihat.

    Akibatnya bukan sekadar boros memori: pada DOM sebesar itu SATU operasi tata letak
    (`getBoundingClientRect`) terukur 10-15 ms, sementara jatah satu bingkai 60fps cuma
    16,67 ms. Jadi setiap guliran melewati jatahnya dan bingkainya jatuh — itulah yang
    terasa sebagai "menggeser carousel pun berat".

    ── Kenapa kolom di luar layar TIDAK DIRENDER, bukan sekadar dikosongkan isinya ──

    Percobaan pertama menyisakan selnya (tetap N sel per baris) dan hanya mengosongkan
    isinya. DOM memang mengecil dan tata letak jadi 6,3x lebih murah — tapi terukur ada
    biaya baru: setiap kali rentangnya bergeser, satu render penuh makan ~580-700 ms.

    Yang menentukan: melompat 1 kolom (577 ms) dan 20 kolom (699 ms) berbiaya nyaris SAMA.
    Jadi ongkosnya bukan dari sel yang berubah, melainkan dari React yang tetap harus
    membuat dan merekonsiliasi 6.572 elemen — walau 98% di antaranya cuma `<div/>` kosong.
    Memperkecil langkah geser tak akan menolong; yang harus dipangkas jumlah ELEMENNYA.

    Karena itu yang dipakai IRISAN: `kartuDirender` hanya berisi kolom di sekitar layar,
    dan seluruh baris memetakan irisan itu — dari 6.572 elemen jadi ratusan.

    ── Bagaimana posisinya tetap benar ──

    Auto-placement tetap utuh karena tiap baris tetap memetakan larik yang sama, hanya
    lebih pendek: kisinya cukup diberi tahu jumlah kolom yang sebenarnya digambar. Lalu:

      `marginLeft`  menggeser kisi ke tempat kolom pertama seharusnya berada,
      `width` tetap pada pembungkus luar menjaga `scrollWidth` persis seperti semula —
                    jadi posisi guliran, sinkronisasi bilah nama, dan panah geser tidak
                    perlu tahu apa-apa soal virtualisasi ini.
  */
  const BUFFER_KOLOM = 4;

  /*
    ── Dua rentang, dan kenapa dua ──

    Virtualisasi memangkas jumlah elemen, tapi menyisakan satu masalah yang terukur: SETIAP
    kali rentangnya bergeser, satu render penuh makan ~600 ms. Selama orang menggeser terus,
    ongkos itu ditagih berkali-kali dan geserannya tersendat.

    Sebabnya bukan jumlah sel yang berubah — melompat 1 kolom (577 ms) dan 20 kolom (699 ms)
    berbiaya nyaris sama. Yang mahal MEMBANGUN ISI kartunya: ~62 baris berisi nama aspek,
    bilah nilai, lencana, dan tombol, dikali kolom yang digambar.

    Jadi yang digambar dipisah dua tingkat:

      `penuh`     kartu dengan isi sebenarnya. Sempit (selayar + sedikit), dan MAHAL.
      `kerangka`  kotak abu-abu berukuran sama — wireframe. Jauh lebih luas, dan murah
                  karena satu selnya cuma satu `<div>` tanpa teks, tanpa komponen.

    Keduanya hanya diperbarui saat geseran BERHENTI (`JEDA_GESER`). Selama jari masih
    menggeser tak ada satu pun `setState`, jadi tak ada render — peramban cuma menggeser
    piksel yang sudah ada, dan itulah yang membuatnya mulus.

    Yang terlihat orang: kartu yang sudah digambar tetap utuh, kartu yang belum sempat
    digambar muncul sebagai wireframe — penanda jujur bahwa isinya sedang disiapkan — lalu
    terisi begitu geserannya berhenti.
  */
  /*
    Selebar apa kerangkanya dibentang.

    Terukur: ia harus menutup jarak yang sempat digeser orang SEBELUM `JEDA_GESER` habis.
    Lemparan cepat sekalipun (~5000 px/detik) hanya menempuh ~700 px dalam 140 ms — sekitar
    dua setengah kolom. Angka 10 memberi kelonggaran berlipat tanpa memperbesar DOM
    berlebihan: dibentang 30 kolom, jumlah selnya melonjak 930 → 2.232 dan biaya LUKIS tiap
    bingkai ikut naik — persis yang sedang dihindari.
  */
  const BUFFER_KERANGKA = 10;
  const JEDA_GESER = 140;
  const [rentangKolom, setRentangKolom] = useState({ awal: 0, akhir: 20, kerangkaAwal: 0, kerangkaAkhir: 50 });
  const jedaGeserRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
    Rentang dihitung dari `scrollLeft` — aritmetika murni, tanpa `getBoundingClientRect`.
    Mengukur tiap sel justru memanggil kembali biaya tata letak yang sedang dihindari.
  */
  const hitungRentangKolom = (el: HTMLDivElement) => {
    const satuKolom = LEBAR_KOLOM + JARAK_KOLOM;
    const kolomPertama = Math.floor(el.scrollLeft / satuKolom);
    const muat = Math.ceil(el.clientWidth / satuKolom);
    const awal = Math.max(0, kolomPertama - BUFFER_KOLOM);
    const akhir = awal + muat + BUFFER_KOLOM * 2;
    const kerangkaAwal = Math.max(0, kolomPertama - BUFFER_KERANGKA);
    const kerangkaAkhir = kolomPertama + muat + BUFFER_KERANGKA;
    setRentangKolom((lama) => {
      // Render ulang HANYA saat rentangnya benar-benar bergeser: komponen ini berat,
      // dan guliran memancarkan puluhan event per detik di dalam satu kolom yang sama.
      return lama.awal === awal && lama.akhir === akhir
        && lama.kerangkaAwal === kerangkaAwal && lama.kerangkaAkhir === kerangkaAkhir
        ? lama
        : { awal, akhir, kerangkaAwal, kerangkaAkhir };
    });
  };

  /**
   * Hitung ulang rentang SESUDAH geserannya berhenti.
   *
   * Dipanggil dari penangan guliran, yang menyala puluhan kali per detik. Menghitung di
   * setiap panggilan berarti membayar render penuh di tengah geseran — persis yang
   * membuatnya tersendat sebelum ini.
   */
  const jadwalkanRentang = (el: HTMLDivElement) => {
    if (jedaGeserRef.current) clearTimeout(jedaGeserRef.current);
    jedaGeserRef.current = setTimeout(() => hitungRentangKolom(el), JEDA_GESER);
  };

  /*
    ── Panah geser di tepi kiri/kanan deret ──

    Menggantikan pil paginasi di bawah-tengah. Pil itu selalu ada, menutupi kartu paling
    bawah, dan letaknya jauh dari tepi yang hendak dituju — orang menggeser ke kanan
    dengan menekan tombol di tengah bawah.

    ⚠️ SELALU terlihat selama arahnya masih bisa digeser — diminta langsung. Dulu ia baru
    muncul saat kursor masuk ke area kartu, dan itu terbaca seperti kendali yang rusak:
    orang tidak tahu tombolnya ada sampai kebetulan melewatinya dengan kursor.

    Keduanya tetap ada di DOM (cuma `opacity: 0` di ujung deret), bukan dirender bersyarat —
    elemen ber-opacity nol tetap bisa dijangkau Tab, dan itu satu-satunya cara pemakai papan
    tik menggeser deret ini.
  */
  /*
    ── Bilah guliran melayang di dasar layar ──

    Panah menggeser selayar demi selayar; bilah ini untuk melompat jauh sekaligus, dan ia
    satu-satunya kendali yang memperlihatkan POSISI — seberapa jauh deretnya sudah berjalan
    dan berapa sisanya.

    Ia cermin dari penggulir utama, bukan penggulir kedua: lebarnya mengikuti lebar deret,
    isinya selebar seluruh kartu, dan keduanya saling menulis `scrollLeft`. Menyetel nilai
    yang sudah sama tidak memicu event lagi, jadi keduanya bertemu tanpa saling kejar.

    ⚠️ SELALU terlihat (`position: fixed`, menempel ke dasar VIEWPORT) — diminta langsung,
    supaya indikator posisi guliran tetap terjangkau sekalipun kartunya jauh lebih tinggi
    daripada layar dan halaman sudah tergulir jauh ke bawah. Dulu ia baru muncul saat kursor
    mendekat ke 120px terbawah layar; itu berarti orang harus menggulir HALAMAN dulu sampai
    ke dasarnya sebelum kendali guliran MENDATAR ini kelihatan — dua sumbu guliran yang
    saling menyandera.
  */
  const bilahBawahRef = useRef<HTMLDivElement | null>(null);
  const isiBilahBawahRef = useRef<HTMLDivElement | null>(null);

  const [bisaGeserKiri, setBisaGeserKiri] = useState(false);
  const [bisaGeserKanan, setBisaGeserKanan] = useState(false);
  // Tepi kiri/kanan deret, diukur — panahnya `fixed`, jadi ia perlu tahu di mana deretnya.
  const [tepiDeret, setTepiDeret] = useState<{ kiri: number; kanan: number } | null>(null);

  /*
    ── Seret untuk menggeser deret ──

    Pelengkap panah, bukan penggantinya: menggeser sejauh beberapa kartu lebih enak
    diseret daripada diklik berkali-kali.

    Yang tidak boleh direbut: elemen yang `draggable` (kepala kartu masih menyusun ulang
    urutannya, pegangan baris masih memindah baris) dan kendali biasa (tombol, tautan,
    isian). Tanpa pengecualian itu, satu gerakan punya dua arti dan keduanya salah.

    Ambang 4px memisahkan seret dari klik; tanpa ambang, klik yang jarinya sedikit
    bergeser akan terbaca sebagai pan dan kartunya melompat.
  */
  const panRef = useRef<{ x: number; kiri: number } | null>(null);
  const baruSajaPanRef = useRef(false);
  const [sedangPan, setSedangPan] = useState(false);

  const bolehPan = (target: EventTarget | null) => {
    const el = target as HTMLElement | null;
    if (!el?.closest) return false;
    if (el.closest('[draggable="true"]')) return false;
    if (el.closest('button, a, input, textarea, select, [role="button"], [role="checkbox"]')) return false;
    return true;
  };

  const mulaiPan = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const el = gulirRef.current;
    if (!el || !bolehPan(e.target)) return;
    panRef.current = { x: e.clientX, kiri: el.scrollLeft };
    baruSajaPanRef.current = false;
  };

  /*
    Klik yang lahir dari seret ditelan.

    Tanpa ini, melepas tetikus sesudah menggeser akan menghitung sebagai klik pada apa pun
    yang kebetulan ada di bawah kursor — dan di kartu ini yang ada di bawah kursor
    seringkali tautan ke profil orang.
  */
  const telanKlikSetelahPan = (e: React.MouseEvent) => {
    if (!baruSajaPanRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    baruSajaPanRef.current = false;
  };

  useEffect(() => {
    const gerak = (e: MouseEvent) => {
      const p = panRef.current;
      const el = gulirRef.current;
      if (!p || !el) return;
      const selisih = e.clientX - p.x;
      if (!baruSajaPanRef.current && Math.abs(selisih) < 4) return;
      if (!baruSajaPanRef.current) {
        baruSajaPanRef.current = true;
        setSedangPan(true);
      }
      el.scrollLeft = p.kiri - selisih;
      e.preventDefault();
    };
    const lepas = () => {
      panRef.current = null;
      setSedangPan(false);
    };
    window.addEventListener('mousemove', gerak);
    window.addEventListener('mouseup', lepas);
    return () => {
      window.removeEventListener('mousemove', gerak);
      window.removeEventListener('mouseup', lepas);
    };
  }, []);

  /*
    ⚠️ Dipanggil pada SETIAP event guliran, jadi tiap `setState` di sini harus benar-benar
    menahan diri.

    `setTepiDeret` dulu selalu diberi objek baru; acuannya berubah tiap kali, dan komponen
    seukuran ini — ratusan kartu, tiap kartu berlusin baris — dirender ulang di setiap frame
    guliran. Itu yang membuat menggeser terasa berat, bukan animasi panahnya.

    Sekarang tepinya hanya ditulis kalau angkanya memang bergeser. Dua boolean di bawahnya
    aman apa adanya: React sudah membatalkan render kalau nilainya identik.
  */
  /*
    Batas guliran saja — dipanggil di SETIAP event guliran, jadi isinya sengaja cuma
    aritmetika atas nilai yang memang berubah saat menggulir.

    Sengaja TIDAK memanggil `getBoundingClientRect()`: tepi deret tidak bergeser ketika
    orang menggulir mendatar, dan mengukurnya di tiap frame memaksa reflow atas kisi berisi
    ratusan kartu. Itu pengukuran mahal untuk jawaban yang sudah pasti sama.
  */
  /*
    Lebar penggulir dan lebar isinya, DISIMPAN — bukan dibaca ulang tiap guliran.

    `clientWidth` dan `scrollWidth` adalah properti yang bergantung tata letak: membacanya
    memaksa peramban menghitung ulang layout, dan pada deret selebar 30.000 px itu mahal.
    Keduanya hanya berubah saat tata letaknya berubah — ganti ukuran jendela, jumlah kartu,
    atau kolom yang tampil — dan ketiganya sudah memanggil `ukurDeret()`. Jadi di sanalah
    nilainya diperbarui, bukan di penangan guliran yang menyala puluhan kali per detik.

    Ini catatan yang sama semangatnya dengan larangan `getBoundingClientRect()` di bawah.
  */
  const ukuranGulirRef = useRef({ clientWidth: 0, scrollWidth: 0 });

  const perbaruiBatas = (el: HTMLDivElement) => {
    const { clientWidth, scrollWidth } = ukuranGulirRef.current;
    // Toleransi 1px: `scrollWidth` dan `clientWidth` bisa berselisih pecahan di layar
    // ber-DPR tinggi, dan tanpa toleransi panahnya tak pernah benar-benar hilang di ujung.
    setBisaGeserKiri(el.scrollLeft > 1);
    setBisaGeserKanan(el.scrollLeft + clientWidth < scrollWidth - 1);
  };

  /** Tepi kiri/kanan deret. Hanya perlu diukur ulang saat tata letaknya berubah. */
  const ukurDeret = () => {
    const el = gulirRef.current;
    if (!el) return;
    const kotak = el.getBoundingClientRect();
    setTepiDeret((lama) =>
      lama && lama.kiri === kotak.left && lama.kanan === kotak.right
        ? lama
        : { kiri: kotak.left, kanan: kotak.right },
    );
    // Satu-satunya tempat kedua lebar ini dibaca — lihat `ukuranGulirRef`.
    ukuranGulirRef.current = { clientWidth: el.clientWidth, scrollWidth: el.scrollWidth };
    perbaruiBatas(el);
    // Lebar penggulir menentukan berapa kolom yang muat — jadi rentangnya ikut diukur
    // ulang di sini, termasuk pada render pertama dan setiap `resize`.
    hitungRentangKolom(el);
  };

  // Visible columns — read from localStorage (shared with Table view)
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    const bawaan = () => new Set(allCompareColumnDefs.filter(c => c.defaultVisible).map(c => String(c.key)));
    try {
      const saved = localStorage.getItem(VISIBLE_COLUMNS_STORAGE_KEY);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) {
          const tersimpan = new Set<string>(arr as string[]);
          /*
            Kolom bawaan disusulkan SEKALI per versi, bukan tiap kali mount.

            Dulu penggabungan ini berjalan di setiap muat, jadi kolom yang sengaja
            dimatikan pemakai menyala lagi sesudah menyegarkan halaman — tak apa selagi
            bawaannya belasan, tapi Competency Score menambah 37, dan "matikan yang tak
            saya perlukan" jadi tak berarti apa-apa. Padahal justru itu gunanya Data
            Visibility.

            Penanda versinya membuat kolom yang BARU tetap muncul sekali saat ia
            diperkenalkan — yang memang perlu, kalau tidak tak seorang pun tahu ia ada —
            lalu sesudah itu pilihan orangnya yang berlaku.
          */
          if (localStorage.getItem(COMPARE_DEFAULTS_VERSION_KEY) === COMPARE_DEFAULTS_VERSION) {
            return tersimpan;
          }
          bawaan().forEach(k => tersimpan.add(k));
          localStorage.setItem(COMPARE_DEFAULTS_VERSION_KEY, COMPARE_DEFAULTS_VERSION);
          return tersimpan;
        }
      }
      localStorage.setItem(COMPARE_DEFAULTS_VERSION_KEY, COMPARE_DEFAULTS_VERSION);
    } catch {}
    // Fallback: default visible columns
    return bawaan();
  });

  // Keep in sync when Table view saves new column selections (cross-tab)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== VISIBLE_COLUMNS_STORAGE_KEY || !e.newValue) return;
      try {
        const arr = JSON.parse(e.newValue);
        if (Array.isArray(arr)) setVisibleColumns(new Set(arr as string[]));
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Columns dialog state
  const [isColumnsDialogOpen, setIsColumnsDialogOpen] = useState(false);

  /*
    Cluster tempat tiap variabel digambar = cluster-nya di dialog Data Visibility (bawaan, buatan pengguna,
    dan pemindahan variabel), bukan cluster CSV aslinya. Dialog menyimpan pilihannya langsung ke
    localStorage, jadi dibaca ulang tiap dialog ditutup.
  */
  const [versiKlaster, setVersiKlaster] = useState(0);
  const petaKlaster = useMemo(
    () => ({ override: bacaOverrideKlaster(), pengguna: bacaKlasterPengguna() }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [versiKlaster],
  );
  /** Cluster punya minimal satu variabel yang sedang dicentang? (menentukan ubin 3C di atas kartu) */
  const adaKlaster = (kunci: string): boolean => visibleAspectCols.some((c) => kunciGrup(c) === kunci);
  const kunciGrup = (col: ColumnConfig): string => {
    const e = klasterEfektifKolom(col, petaKlaster.override, petaKlaster.pengguna);
    if (e !== 'competencyScore') return e;
    const c = col.cluster as string | undefined;
    return c === 'competencyGeneral' || c === 'competencyTechnical' ? c : e;
  };
  const labelGrup = (kunci: string): string =>
    [...KLASTER_BAWAAN, ...petaKlaster.pengguna].find((k) => k.key === kunci)?.label ?? clusterDisplayName(kunci);

  const handleApplyVisibleColumns = (cols: Set<string>) => {
    setVisibleColumns(cols);
    try {
      localStorage.setItem(VISIBLE_COLUMNS_STORAGE_KEY, JSON.stringify(Array.from(cols)));
    } catch {}
  };

  // Read rankings from localStorage (written by TableScreener) so both views stay in sync
  const [employeeRankings, setEmployeeRankings] = useState<Map<string, number>>(() => {
    try {
      const saved = localStorage.getItem('tableRankings');
      if (saved) {
        const obj = JSON.parse(saved) as Record<string, number>;
        return new Map(Object.entries(obj).map(([k, v]) => [k, Number(v)]));
      }
    } catch {}
    return new Map();
  });

  // Listen for ranking changes from TableScreener (cross-tab or same-tab updates)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'tableRankings' || !e.newValue) return;
      try {
        const obj = JSON.parse(e.newValue) as Record<string, number>;
        setEmployeeRankings(new Map(Object.entries(obj).map(([k, v]) => [k, Number(v)])));
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);


  /*
    Kotak pencarian dititipkan ke `Screener` supaya ia menempati baris toolbar.

    `compareSearch` ikut jadi dependensi: elemennya membawa `value`, jadi tanpa itu
    kotaknya membeku pada ketikan pertama. Fokus tetap terjaga karena React
    memperbarui elemen input yang SAMA — posisinya di pohon tidak berubah, hanya
    propnya.
  */
  useEffect(() => {
    if (!onSearchRender) return;
    onSearchRender(
      /*
        Pencarian dan pemilih jabatan acuan BERSEBELAHAN di sisi kiri — diminta langsung.

        Dropdown-nya dulu duduk di gerombolan kanan bersama Data Visibility dan Filters.
        Tempatnya memang di sini: ia menentukan TERHADAP APA skor kartu dibandingkan, jadi
        ia pasangan pencarian dalam memilih apa yang dilihat — bukan tombol alat seperti
        tetangganya di kanan.

        `Group` design system, bukan `div` ber-flex tulisan tangan; `wrap="nowrap"` supaya
        keduanya tak pernah patah ke baris berikutnya saat toolbar menyempit.
      */
      <Group gap={8} wrap="nowrap">
        {/*
          `TextInput` design system. Dulu `Input` shadcn lokal dibungkus `div.relative`
          dengan ikon `absolute left-3 -translate-y-1/2` — penempatan ikon buatan
          tangan yang `leftSection` sudah tangani, termasuk jarak kirinya.

          Lebarnya dipendekkan 384 → 280 supaya dropdown di sebelahnya muat tanpa
          mendesak tombol alat di gerombolan kanan.
        */}
        <TextInput
          w={280}
          placeholder="Search by name, position, or team..."
          value={compareSearch}
          onChange={(e) => setCompareSearch(e.currentTarget.value)}
          leftSection={<Search className="w-4 h-4" />}
        />
        {/* Satu dropdown bergabung: Current Position atau Target:<jabatan> */}
        <Select
          w={220}
          value={dropdownValue}
          onChange={(v) => setDropdownValue(v ?? 'current')}
          data={combinedSelectData}
          searchable
          allowDeselect={false}
          styles={{ input: { fontWeight: 600 } }}
        />
      </Group>,
    );
    return () => onSearchRender(null);
  }, [onSearchRender, compareSearch, dropdownValue, combinedSelectData]);

  // Columns to show in cluster accordion sections: all visible non-basic columns
  // — includes both typed columns (adaptability, leadership, etc.) AND csv: columns
  // — mirrors exactly what is visible in the Table
  const visibleAspectCols = useMemo(() =>
    allCompareColumnDefs.filter(col => {
      const k = String(col.key);
      if (BASIC_KEYS.has(k)) return false; // skip name, role, department, level
      if (k === KUNCI_DISC) return false; // digambar sebagai ubin DISC di atas kartu, bukan baris
      return visibleColumns.has(k);
    }),
  [visibleColumns]);

  // Aspect row order – shared across all cards; re-seeds when visible set changes
  const [aspectOrder, setAspectOrder] = useState<string[]>(() =>
    allCompareColumnDefs
      .filter(c => !BASIC_KEYS.has(String(c.key)) && c.defaultVisible)
      .map(c => String(c.key))
  );

  // Keep aspectOrder in sync when visibleAspectCols changes (add new keys, remove gone ones)
  useEffect(() => {
    setAspectOrder(prev => {
      const visibleKeys = new Set(visibleAspectCols.map(c => String(c.key)));
      // Keep existing order for keys still visible, append newly-visible keys
      const kept = prev.filter(k => visibleKeys.has(k));
      const added = visibleAspectCols.map(c => String(c.key)).filter(k => !kept.includes(k));
      return [...kept, ...added];
    });
  }, [visibleAspectCols]);

  /**
   * Bilah nama lengket sedang DIMATIKAN — lihat `{BILAH_NAMA_AKTIF && …}` di bagian
   * render. Satu tetapan ini yang menyalakan bilahnya sekaligus pengintainya, supaya
   * keduanya tak pernah bisa hidup sendiri-sendiri lagi.
   */
  const BILAH_NAMA_AKTIF = true;

  // Sticky bar: shows when the HAV banner top reaches the top of the viewport.
  // Uses scroll listener on the scrolling ancestor (not IntersectionObserver, which
  // requires the viewport to scroll — but Root.tsx uses an inner overflow container).
  const [showStickyBar, setShowStickyBar] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollListenerCleanupRef = useRef<(() => void) | null>(null);

  /*
    Pengintai bilah nama: IntersectionObserver, BUKAN pendengar guliran. Pendengar guliran memanggil
    `getBoundingClientRect()` di setiap event — 10–15 ms per panggilan pada kisi sebesar ini, alasan bilah
    ini dulu dimatikan. Observer hanya berbunyi saat penanda melintasi tepi, dan murah.

    Penanda = garis setipis 1px di dasar foto kartu pertama. Begitu ia keluar dari area gulir DI ATAS
    (bukan di bawah), fotonya sudah tergulir lewat dan bilah nama dimunculkan.
  */
  const observerSentinelRef = useRef<IntersectionObserver | null>(null);
  const setSentinel = useCallback((el: HTMLDivElement | null) => {
    observerSentinelRef.current?.disconnect();
    observerSentinelRef.current = null;
    sentinelRef.current = el;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    /*
      Bilah muncul KONTEKSTUAL: begitu nama utama di foto mulai tenggelam di bawah tepi atas area gulir,
      bukan menunggu seluruh foto lenyap. Nama duduk ~74px di atas dasar foto dan bilahnya setinggi ~52px,
      jadi penandanya (dasar foto) dianggap "keluar" saat tingginya kurang dari ~126px dari tepi atas
      area gulir — `rootMargin` negatif menggeser garis batas itu. Root = kontainer yang menggulir, karena
      toolbar di atasnya tidak ikut menggulir dan bukan bagian dari ukuran.
    */
    let akar: HTMLElement | null = el.parentElement;
    // Yang BENAR-BENAR menggulir vertikal: pembungkus `overflow-x-auto` juga ber-overflow-y "auto" (aturan CSS)
    // tapi tak pernah menggulir, dan memilihnya membuat bilah salah waktu.
    while (akar && !(/(auto|scroll)/.test(getComputedStyle(akar).overflowY) && akar.scrollHeight > akar.clientHeight + 10)) {
      akar = akar.parentElement;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        const batasAtas = e.rootBounds?.top ?? 0;
        setShowStickyBar(!e.isIntersecting && e.boundingClientRect.top < batasAtas);
      },
      { root: akar, rootMargin: '-126px 0px 0px 0px', threshold: 0 },
    );
    io.observe(el);
    observerSentinelRef.current = io;
  }, []);

  // Drag state — cards
  const [dragCardId, setDragCardId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  // Drag state — aspect rows
  const [dragAspectId, setDragAspectId] = useState<string | null>(null);
  const [dragOverAspectId, setDragOverAspectId] = useState<string | null>(null);
  // Drag state — cluster sections
  const [dragClusterId, setDragClusterId] = useState<string | null>(null);
  const [dragOverClusterId, setDragOverClusterId] = useState<string | null>(null);

  // Cluster section order — seeded from CLUSTER_ORDER, can be reordered by drag
  const [clusterOrder, setClusterOrder] = useState<string[]>([...CLUSTER_ORDER, '__none__']);

  // Collapsed cluster sections — keys in this set are hidden
  const [collapsedClusters, setCollapsedClusters] = useState<Set<string>>(new Set());
  const toggleClusterCollapse = (clusterKey: string) => {
    setCollapsedClusters(prev => {
      const next = new Set(prev);
      if (next.has(clusterKey)) next.delete(clusterKey);
      else next.add(clusterKey);
      return next;
    });
  };

  // Risk Heat (editable, persisted)
  const [riskHeatData, setRiskHeatData] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('customColumnData');
      if (!saved) return {};
      const data = JSON.parse(saved);
      const result: Record<string, string> = {};
      Object.entries(data).forEach(([empId, fields]) => {
        if ((fields as Record<string, string>).readinessRiskHeat)
          result[empId] = (fields as Record<string, string>).readinessRiskHeat;
      });
      return result;
    } catch { return {}; }
  });

  const handleRiskHeatChange = (employeeId: string, value: string) => {
    const saved = localStorage.getItem('customColumnData');
    const customData = saved ? JSON.parse(saved) : {};
    customData[employeeId] = { ...(customData[employeeId] || {}), readinessRiskHeat: value };
    localStorage.setItem('customColumnData', JSON.stringify(customData));
    setRiskHeatData(prev => ({ ...prev, [employeeId]: value }));
  };

  // Reset sticky bar when employee list changes
  useEffect(() => { setShowStickyBar(false); }, [comparisonEmployees]);

  /*
    Kartu Compare MENGIKUTI filter tabel.

    ── Apa yang berubah, dan kenapa ──

    Sebelumnya efek ini hanya bergantung pada `allEmployees`, jadi ia membaca
    `localStorage` SEKALI saat dipasang dan tak pernah lagi. Menulis localStorage tidak
    memicu render ulang, jadi mengubah filter tak pernah sampai ke sini: terukur,
    memilih dua karyawan membuat tabel jadi 2 baris sementara Compare tetap 106 kartu.

    Sekarang `visibleIds` datang sebagai prop dari `Screener`, dan ia ada di daftar
    kebergantungan — jadi setiap perubahan filter langsung menyusun ulang kartunya.

    localStorage tetap jadi CADANGAN untuk pemasangan pertama (dan untuk pemakaian
    komponen ini di luar `Screener`): pada render pertama `visibleIds` masih `null`
    karena tabelnya belum melapor.
  */
  useEffect(() => {
    let idTerlihat: string[] | null = visibleIds ?? null;
    if (idTerlihat === null) {
      try {
        const saved = localStorage.getItem('tableVisibleEmployeeIds');
        if (saved) idTerlihat = JSON.parse(saved) as string[];
      } catch {}
    }

    /*
      Larik KOSONG dihormati — nol orang lolos filter berarti nol kartu. Versi
      sebelumnya menuliskan `if (ordered.length > 0)`, jadi filter yang tak
      menyisakan siapa pun diam-diam kembali menampilkan SELURUH karyawan: layar
      menyatakan kebalikan dari yang diminta pemakainya.
    */
    const baseEmployees =
      idTerlihat === null
        ? allEmployees
        : (idTerlihat
            .map(id => allEmployees.find(e => e.id === id))
            .filter(Boolean) as Employee[]);

    setComparisonEmployees(baseEmployees);
    setCardOrder(baseEmployees.map(e => e.id));
  }, [allEmployees, visibleIds]);

  // Persist pinnedIds locally only when not managed by parent
  useEffect(() => {
    if (!onPinnedIdsChange) {
      localStorage.setItem('shared_pinned', JSON.stringify(pinnedIds));
    }
  }, [pinnedIds, onPinnedIdsChange]);

  // Pin toggle
  const togglePin = (id: string) => {
    setPinnedIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };


  // ── Local hide/show state (does NOT touch URL params — always recoverable) ──
  const [localHiddenIds, setLocalHiddenIds] = useState<Set<string>>(new Set());
  const [localShowOnlyIds, setLocalShowOnlyIds] = useState<Set<string> | null>(null);

  // ── Checkbox selection state ──────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Hide: hide selected employees (local state only — always recoverable)
  const handleHideSelected = () => {
    setLocalHiddenIds(prev => new Set([...prev, ...selectedIds]));
    setLocalShowOnlyIds(null);
    setPinnedIds(prev => prev.filter(p => !selectedIds.has(p)));
    setSelectedIds(new Set());
  };

  // Show Only: keep only selected (local state only — always recoverable)
  const handleShowOnly = () => {
    setLocalShowOnlyIds(new Set(selectedIds));
    setLocalHiddenIds(new Set());
    setSelectedIds(new Set());
  };


  // Compute ordered display list: apply local hide/show → role filter → sort by ranking → search
  const displayEmployees = useMemo(() => {
    // Apply local hide/show filters
    let base = comparisonEmployees;
    if (localShowOnlyIds !== null) {
      base = base.filter(e => localShowOnlyIds.has(e.id));
    } else if (localHiddenIds.size > 0) {
      base = base.filter(e => !localHiddenIds.has(e.id));
    }

    // Apply role filter:
    // Current Position mode → show only employees whose current role matches
    // Target Position mode  → show ALL employees as candidates (no role filter)
    if (selectedRole !== 'all' && contextMode === 'current') {
      base = base.filter(e => e.role === selectedRole);
    }

    const pinned = pinnedIds
      .map(id => base.find(e => e.id === id))
      .filter(Boolean) as Employee[];
    const unpinned = base
      .filter(e => !pinnedIds.includes(e.id))
      .sort((a, b) => (employeeRankings.get(a.id) ?? 999) - (employeeRankings.get(b.id) ?? 999));
    const ordered = [...pinned, ...unpinned];
    if (!compareSearch.trim()) return ordered;
    const term = compareSearch.toLowerCase();
    return ordered.filter(e =>
      e.name.toLowerCase().includes(term) ||
      e.role.toLowerCase().includes(term) ||
      e.department.toLowerCase().includes(term)
    );
  }, [comparisonEmployees, pinnedIds, employeeRankings, compareSearch, localHiddenIds, localShowOnlyIds, selectedRole, contextMode]);

  /*
    Seluruh kartu dirender sekaligus; yang membatasi tampilan adalah lebar penggulir,
    bukan potongan halaman.
  */
  const kartuTampil = displayEmployees;

  /*
    Kolom yang benar-benar digambar — lihat "Virtualisasi kolom" di atas untuk alasannya
    dan angka-angka yang mendasarinya.

    `offsetKolom` dipakai dua kali: menggeser kisi ke posisi kolom pertama, dan
    menerjemahkan indeks irisan kembali ke indeks sebenarnya saat sebuah baris memang
    membutuhkannya.
  */
  const offsetKolom = Math.min(rentangKolom.kerangkaAwal, Math.max(0, kartuTampil.length - 1));
  const kartuDirender = useMemo(
    () => kartuTampil.slice(offsetKolom, rentangKolom.kerangkaAkhir + 1),
    [kartuTampil, offsetKolom, rentangKolom.kerangkaAkhir],
  );

  /**
   * Kolom pada indeks irisan ke-`i` digambar dengan ISI, atau cukup kerangkanya?
   *
   * Di luar rentang penuh, yang digambar wireframe — lihat "Dua rentang" di atas.
   */
  const isiPenuh = (i: number) => {
    const idx = offsetKolom + i;
    return idx >= rentangKolom.awal && idx <= rentangKolom.akhir;
  };

  /*
    Ukur ulang saat jumlah kartu atau lebar jendela berubah.

    Jumlah kartu penting: menyaring kandidat bisa membuat deretnya cukup pendek sehingga
    tak ada lagi yang perlu digeser, dan panah yang tinggal menunjuk ke ruang kosong lebih
    buruk daripada tak ada panah sama sekali.
  */
  useEffect(() => {
    ukurDeret();
    window.addEventListener('resize', ukurDeret);
    return () => window.removeEventListener('resize', ukurDeret);
  }, [kartuTampil.length]);

  /*
    Samakan bilah bawah dengan deretnya, dan teruskan guliran dari bilah ke deret.

    Semuanya lewat DOM langsung, tanpa satu pun `setState`: ukuran dan posisi guliran
    berubah jauh lebih sering daripada yang sanggup ditanggung render ulang komponen ini.
  */
  useEffect(() => {
    const utama = gulirRef.current;
    const bilah = bilahBawahRef.current;
    const isi = isiBilahBawahRef.current;
    if (!utama || !bilah || !isi) return;

    const samakan = () => {
      const kotak = utama.getBoundingClientRect();
      isi.style.width = `${utama.scrollWidth}px`;
      bilah.style.left = `${kotak.left}px`;
      bilah.style.width = `${kotak.width}px`;
      // Deret yang muat seluruhnya tak punya yang perlu digulir — bilahnya pun tak perlu ada.
      bilah.style.display = utama.scrollWidth <= utama.clientWidth + 1 ? 'none' : 'block';
      bilah.scrollLeft = utama.scrollLeft;
    };

    const dariBilah = () => {
      if (utama.scrollLeft !== bilah.scrollLeft) utama.scrollLeft = bilah.scrollLeft;
    };

    samakan();
    bilah.addEventListener('scroll', dariBilah);
    window.addEventListener('resize', samakan);
    return () => {
      bilah.removeEventListener('scroll', dariBilah);
      window.removeEventListener('resize', samakan);
    };
  }, [kartuTampil.length, visibleColumns]);

  /*
    Gerombolan alat di kanan toolbar bersama.

    Tinggal Data Visibility. Dropdown jabatan acuan pindah ke gerombolan KIRI bersebelahan
    dengan pencarian (lihat `onSearchRender`), dan hitungan "N employees" dibuang atas
    permintaan langsung — angkanya sudah terbaca dari kartunya sendiri.
  */
  useEffect(() => {
    if (!onToolbarRender) return;
    onToolbarRender(
      <Group gap={8} wrap="nowrap">
        {/* Tombol ikon + tooltip, sama dengan tampilan Table (Data Visibility, Filters, Presets). */}
        <Tooltip label="Data Visibility" withArrow>
          <ActionIcon
            variant="subtle"
            color="primary"
            size="lg"
            radius="xl"
            aria-label="Data Visibility"
            onClick={() => setIsColumnsDialogOpen(true)}
          >
            <Columns3 className="w-4 h-4" />
          </ActionIcon>
        </Tooltip>
      </Group>
    );
    return () => onToolbarRender(null);
  }, [onToolbarRender]);

  /*
    Geser SATU kartu — diminta langsung.

    Dulu selayar penuh (sebanyak kartu yang muat). Untuk membandingkan orang per orang,
    lompatan selayar terlalu kasar: kartu yang sedang diperhatikan langsung hilang dari
    pandangan dan orang kehilangan jejak posisinya.

    Dibulatkan ke KISI kolom, bukan ditambah mentah dari `scrollLeft` yang sedang berjalan:
    kalau tidak, posisi guliran perlahan melenceng dari tepi kartu dan lama-lama setiap
    kartu tampil terpotong separuh di tepi layar.
  */
  const geser = (arah: -1 | 1) => {
    const el = gulirRef.current;
    if (!el) return;
    const satuKolom = LEBAR_KOLOM + JARAK_KOLOM;
    const kolomSekarang = Math.round(el.scrollLeft / satuKolom);
    const tujuan = Math.max(0, kolomSekarang + arah) * satuKolom;
    el.scrollTo({ left: tujuan, behavior: 'smooth' });
  };

  // Bilah nama lengket mengikuti guliran utama, supaya nama tetap sejajar kartunya.
  const saatMenggulir = () => {
    const el = gulirRef.current;
    if (!el) return;
    /*
      Baca dulu, tulis kemudian.

      Menulis `scrollLeft` lalu membaca `clientWidth`/`scrollWidth` memaksa peramban
      menghitung ulang tata letak di tengah penanganan — urutan terbalik ini yang membuat
      menggulir tersendat pada kisi sebesar ini.
    */
    const kiri = el.scrollLeft;
    perbaruiBatas(el);
    // DIJADWALKAN, bukan dihitung sekarang — lihat `jadwalkanRentang`. Menghitungnya di
    // sini berarti satu render penuh (~600 ms) di tengah geseran.
    jadwalkanRentang(el);

    const bilah = gulirBilahRef.current;
    if (bilah && bilah.scrollLeft !== kiri) bilah.scrollLeft = kiri;
    const bawah = bilahBawahRef.current;
    if (bawah && bawah.scrollLeft !== kiri) bawah.scrollLeft = kiri;
  };

  // ── Card drag handlers ────────────────────────────────────────────────────
  const handleCardDragStart = (e: React.DragEvent, id: string) => {
    setDragCardId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('dragType', 'card');
  };

  const handleCardDragOver = (e: React.DragEvent, id: string) => {
    if (dragCardId === null) return;
    e.preventDefault();
    setDragOverCardId(id);
  };

  const handleCardDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverCardId(null);
    if (!dragCardId || dragCardId === targetId) { setDragCardId(null); return; }

    const srcPinned = pinnedIds.includes(dragCardId);
    const tgtPinned = pinnedIds.includes(targetId);

    if (srcPinned && tgtPinned) {
      setPinnedIds(prev => {
        const arr = [...prev];
        const si = arr.indexOf(dragCardId);
        const ti = arr.indexOf(targetId);
        [arr[si], arr[ti]] = [arr[ti], arr[si]];
        return arr;
      });
    } else if (!srcPinned && !tgtPinned) {
      setCardOrder(prev => {
        const arr = [...prev];
        const si = arr.indexOf(dragCardId);
        const ti = arr.indexOf(targetId);
        if (si === -1 || ti === -1) return arr;
        arr.splice(si, 1);
        arr.splice(ti, 0, dragCardId);
        return arr;
      });
    }
    setDragCardId(null);
  };

  // ── Aspect row drag handlers ──────────────────────────────────────────────
  const handleAspectDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDragAspectId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('dragType', 'aspect');
  };

  const handleAspectDragOver = (e: React.DragEvent, id: string) => {
    if (dragAspectId === null) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOverAspectId(id);
  };

  const handleAspectDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverAspectId(null);
    if (!dragAspectId || dragAspectId === targetId) { setDragAspectId(null); return; }
    setAspectOrder(prev => {
      const arr = [...prev];
      const si = arr.indexOf(dragAspectId);
      const ti = arr.indexOf(targetId);
      if (si === -1 || ti === -1) return arr;
      arr.splice(si, 1);
      arr.splice(ti, 0, dragAspectId);
      return arr;
    });
    setDragAspectId(null);
  };

  const handleClusterDragStart = (e: React.DragEvent, id: string) => {
    setDragClusterId(id);
    setDragAspectId(null); // prevent conflict
    e.stopPropagation();
  };

  const handleClusterDragOver = (e: React.DragEvent, id: string) => {
    if (dragClusterId === null) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOverClusterId(id);
  };

  const handleClusterDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverClusterId(null);
    if (!dragClusterId || dragClusterId === targetId) { setDragClusterId(null); return; }
    setClusterOrder(prev => {
      const arr = [...prev];
      const si = arr.indexOf(dragClusterId);
      const ti = arr.indexOf(targetId);
      if (si === -1 || ti === -1) return arr;
      arr.splice(si, 1);
      arr.splice(ti, 0, dragClusterId);
      return arr;
    });
    setDragClusterId(null);
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  if (comparisonEmployees.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F8F9FA]" style={{ minHeight: '60vh' }}>
        <div className="text-center max-w-md">
          <Users className="w-16 h-16 mx-auto mb-4" style={{ color: '#adb5bd' }} />
          <Text component="h2" size="xl" fw={700} ff="heading" c="neutral.7" mb={8}>
            No Employees to Compare
          </Text>
          <Text size="md" c="neutral.6">
            Gunakan <Text span fw={700} c="primary">Filters</Text> untuk memilih karyawan yang ingin dibandingkan.
          </Text>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col bg-[#F8F9FA]">
      {/*
        Baris pencarian yang dulu berdiri di sini sekarang dititipkan ke `Screener`
        lewat `onSearchRender`, supaya ia menempati baris toolbar dan pemilih tampilan
        turun ke bawahnya. Lihat effect `onSearchRender` di atas.
      */}

      {/* Sticky employee name bar removed — toolbar no longer fixed */}
      {BILAH_NAMA_AKTIF && displayEmployees.length > 0 && (
        /*
          Lengket di atas area gulir halaman (bukan `fixed` ke layar): bilah ini mengikuti kontainer
          yang menggulir, jadi tak pernah menutupi toolbar di atasnya. Pembungkusnya setinggi NOL —
          bilahnya sendiri mengambang di dalamnya — supaya keberadaannya tak mendorong kartu ke bawah.
        */
        <div className="sticky top-0 z-[40]" style={{ height: 0 }}>
        <div
          className="absolute left-0 right-0 bg-white border-b border-gray-200 px-6 py-2"
          style={{
            top: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transform: showStickyBar ? 'translateY(0)' : 'translateY(-110%)',
            opacity: showStickyBar ? 1 : 0,
            transition: 'transform 0.25s ease, opacity 0.25s ease',
            pointerEvents: showStickyBar ? 'auto' : 'none',
          }}
        >
          {/*
            Bilah ini harus memakai kisi yang SAMA dengan kartunya — lebar kolom tetap,
            mengalir ke samping — dan digulir mengikuti penggulir utama
            (`saatMenggulir`). Dulu `grid-cols-4` sudah cukup karena kartunya juga
            selalu empat; sejak jumlahnya mengikuti lebar layar, kisi tetap empat akan
            membuat nama berhenti sejajar dengan orangnya.

            Guliran bilah ini sendiri disembunyikan (`overflow-hidden`): ia cerminan,
            bukan kendali. Dua penggulir yang saling menyetel `scrollLeft` akan saling
            memantul.
          */}
          <div ref={gulirBilahRef} className="overflow-hidden">
          <div
            className="grid"
            style={{
              /*
                Ikut divirtualisasi dengan irisan dan pergeseran yang SAMA dengan kisi
                kartu — kalau tidak, nama berhenti sejajar dengan orangnya begitu digeser.
                Lebar penuh tetap dipatok supaya guliran cerminan ini punya jangkauan yang
                sama dengan penggulir utama.
              */
              gridTemplateColumns: `repeat(${Math.max(kartuDirender.length, 1)}, ${LEBAR_KOLOM}px)`,
              columnGap: `${JARAK_KOLOM}px`,
              marginLeft: offsetKolom * (LEBAR_KOLOM + JARAK_KOLOM),
              // Lebar SISA sesudah pergeseran — `marginLeft + width` inilah yang menjaga
              // jangkauan guliran bilah ini tetap sama dengan penggulir utama.
              width:
                kartuTampil.length * (LEBAR_KOLOM + JARAK_KOLOM) -
                JARAK_KOLOM -
                offsetKolom * (LEBAR_KOLOM + JARAK_KOLOM),
            }}
          >
            {kartuDirender.map((emp, idx) => {
              if (!isiPenuh(idx)) return <SelKerangka key={emp.id} tinggi={22} />;
              const isPinned = pinnedIds.includes(emp.id);
              return (
                <div key={emp.id} className="flex items-center gap-2 min-w-0">
                  <img
                    src={emp.photo}
                    alt={emp.name}
                    loading="lazy"
                    decoding="async"
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  {/* Fixed-width name block so it truncates neatly */}
                  <div className="min-w-0 flex-1" style={{ maxWidth: 'calc(100% - 64px)' }}>
                    {/*
                      Nama di bilah lengket ini SENGAJA `--font-body`, bukan
                      `ff="heading"` seperti nama di kartunya. Di sini ia bukan judul
                      melainkan penanda kolom setinggi avatar 32px; memberinya Avenir
                      akan membuat bilah tipis ini bersaing dengan judul kartu yang
                      sedang digulir di bawahnya.
                    */}
                    <Text size="xs" fw={600} c="neutral.9" truncate>
                      {emp.name}
                    </Text>
                    <Text size="xs" c="neutral.6" truncate>
                      {jabatan(emp)}
                    </Text>
                  </div>
                  {/* Pin button */}
                  <button
                    onClick={() => togglePin(emp.id)}
                    title={isPinned ? 'Unpin' : 'Pin to front'}
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
                    style={{ cursor: 'pointer' }}
                  >
                    <Pin
                      className="w-3.5 h-3.5"
                      style={{ color: isPinned ? 'var(--mantine-color-primary-filled)' : '#9ca3af' }}
                      fill={isPinned ? 'var(--mantine-color-primary-filled)' : 'none'}
                    />
                  </button>
                </div>
              );
            })}
          </div>
          </div>{/* end cermin guliran bilah */}
        </div>
        </div>
      )}

      {/* Floating action bar — appears when ≥1 checkbox checked */}
      {selectedIds.size > 0 && (
        /*
          Kembali ke bawah-tengah, tanpa perlu bertingkat: pil paginasi yang dulu duduk di
          sini — dan menutupi tombol Hide/Show Only — sudah diganti panah di tepi deret.
          `z-[9999]` tetap di atas panah (9998) supaya bar ini selalu menang kalau suatu
          saat keduanya berpapasan.
        */
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 px-2 py-2 flex items-center gap-3">
            <Text size="xs" fw={600} c="neutral.7" px={8}>
              {selectedIds.size} selected
            </Text>
            <div className="w-px h-6 bg-gray-300" />
            <Button
              variant="outline"
              color="gray"
              leftSection={<X className="w-3.5 h-3.5" />}
              onClick={handleHideSelected}
            >
              Hide
            </Button>
            {/* `color="primary"` menggantikan `backgroundColor: 'var(--mantine-color-primary-filled)'` yang ditulis langsung. */}
            <Button
              color="primary"
              leftSection={<Users className="w-3.5 h-3.5" />}
              onClick={handleShowOnly}
            >
              Show Only
            </Button>
          </div>
        </div>
      )}

      {/* Target Position context banner */}
      {contextMode === 'target' && (
        <div style={{
          background: 'linear-gradient(90deg, #1c7ed6 0%, #339af0 100%)',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', flexShrink: 0 }} />
          <Text size="sm" fw={600} c="white">
            {selectedRole !== 'all'
              ? `Evaluating candidates for: ${selectedRole}`
              : 'Target Position mode — select a role to evaluate candidates'}
          </Text>
          <Text size="xs" c="rgba(255,255,255,0.75)" ml="auto">
            {displayEmployees.length} candidate{displayEmployees.length !== 1 ? 's' : ''}
          </Text>
        </div>
      )}

      {/* Cards paginated grid */}
      {/*
        Masuknya kursor ke area kartu dipakai untuk MENGUKUR ULANG tepi deret — panahnya
        `fixed`, jadi ia perlu tahu di mana deretnya berada setelah tata letak bergeser.
        Panahnya sendiri tidak lagi bergantung hover; lihat catatan pada `tampil`.
      */}
      <div onMouseEnter={ukurDeret}>
        <div className="overflow-x-auto p-6">
        {/* ----------------------------------------------------------------
            Row-based layout: structure computed once, values per employee.
            Each "row" spans all 4 columns so items align perfectly.
            Column-strip divs (absolute) provide the card visual.
        ---------------------------------------------------------------- */}
        {(() => {
          // Saat mode target aktif: hitung competency match tiap kartu terhadap
          // jabatan yang dipilih, bukan jabatan sekarang orang itu.
          // Kunci: UUID kanonik dari kolom "Referance ID" — format yang dikenali
          // kunciPartisipan() di layers.ts untuk memetakannya ke p01/p05/dst.
          const targetMatchMap = contextMode === 'target' && selectedRole !== 'all'
            ? new Map(kartuTampil.map(emp => {
                const uuid = emp.csvFields?.['Referance ID'] || emp.id;
                return [emp.id, matchPercent(uuid, selectedRole)];
              }))
            : null;

          /*
            Jabatan yang jadi acuan baris Competency Score. Hanya terisi di mode target —
            di mode Current, baris-barisnya tetap menampilkan skor polos seperti sebelumnya,
            sama seperti ubin Capability yang juga baru berubah saat target dipilih.
          */
          const posisiAcuan = contextMode === 'target' && selectedRole !== 'all' ? selectedRole : null;
          const standarAcuan = posisiAcuan ? STANDARDS_BY_POSITION[posisiAcuan] ?? null : null;

          // Compute cluster structure once (shared across all cards)
          const colByKey = Object.fromEntries(visibleAspectCols.map(c => [String(c.key), c]));
          const orderedColDefs = aspectOrder.filter(k => k in colByKey).map(k => colByKey[k]);

          const groupedClusters: { clusterKey: string; label: string; colDefs: ColumnConfig[] }[] = [];
          const seenClusters = new Set<string>();
          // Use user-reordered clusterOrder, then append any new keys not yet in it
          const allClusterKeys = orderedColDefs.map(col => kunciGrup(col));
          const userOrderedKeys = [
            ...clusterOrder,
            ...allClusterKeys.filter(k => !clusterOrder.includes(k)),
          ];
          userOrderedKeys.forEach(clusterKey => {
            if (seenClusters.has(clusterKey)) return;
            if (clusterKey === 'competency') return; // Capability cluster excluded
            seenClusters.add(clusterKey);
            let cols = orderedColDefs.filter(col => kunciGrup(col) === clusterKey);
            /*
              Baris Competency Score yang kosong untuk SEMUA kartu yang sedang dibandingkan
              tidak ditampilkan.

              Seseorang hanya dinilai beberapa aspek teknis dari katalog yang jauh lebih
              panjang, jadi tanpa saringan ini satu kartu memperlihatkan belasan baris
              "No Data" berturut-turut dan baris yang benar-benar berisi tenggelam di
              antaranya.

              Saringannya per BARIS, bukan per sel: kisi kartu menuntut satu sel per
              karyawan per baris, dan menghilangkan satu sel saja akan menggeser seluruh
              baris sesudahnya. Jadi sebuah aspek hilang hanya kalau tak seorang pun di
              antara kartu yang tampil punya nilainya — kalau salah satu punya, barisnya
              tetap ada dan yang lain menampilkan "No Data", karena justru di situ letak
              perbandingannya.

              Sengaja hanya untuk dua cluster ini. Section lain tetap memperlihatkan
              barisnya apa adanya; mengubah itu berarti mengubah perilaku layar yang tidak
              sedang diminta.
            */
            if (clusterKey === 'competencyTechnical' && standarAcuan) {
              /*
                Di mode target, section Technical berpindah mengikuti kursinya: yang
                ditampilkan PERSIS aspek teknis yang dituntut jabatan target, bukan lagi
                aspek yang kebetulan dimiliki kandidat yang sedang dibandingkan.

                Aspek teknis di kelola melekat pada departemen — tiap jabatan menuntut 3–5
                dari katalog yang jauh lebih panjang. Jadi kandidat dari departemen lain
                memang tak punya nilai pada tuntutan kursi ini, dan barisnya berbunyi
                "No Data". Itu bukan lubang data yang perlu disembunyikan; itu jawabannya —
                "orang ini belum pernah dinilai pada apa yang kursi ini tuntut".

                Karena itu saringan baris-kosong di bawah sengaja TIDAK ikut berlaku di sini:
                ia justru akan membuang baris yang paling ingin dilihat orang.
              */
              cols = cols.filter(col => typeof standarAcuan[col.label] === 'number');
            } else if (clusterKey === 'competencyGeneral' || clusterKey === 'competencyTechnical') {
              cols = cols.filter(col => kartuTampil.some(emp => getColValue(col, emp) !== null));
            }
            if (cols.length === 0) return;
            groupedClusters.push({
              clusterKey,
              label: labelGrup(clusterKey),
              colDefs: cols,
            });
          });

          /*
            Kolom berlebar TETAP, sebanyak karyawan yang ditampilkan; kisinya tumbuh
            melewati tepi layar dan pembungkus di luar yang menggulirnya.

            ⚠️ Tetap `grid-template-columns`, BUKAN `grid-auto-flow: column`.
            Seluruh baris di bawah dibangun dengan cara yang sama: satu sel per
            karyawan, berturut-turut, mengandalkan kisi MEMBUNGKUS setiap N sel untuk
            membentuk baris berikutnya. Dengan `auto-flow: column` pembungkusan itu
            hilang — semua sel dari semua baris berbaris jadi satu baris raksasa, dan
            di layar tampak seperti kartu yang terpotong sesudah header.
          */
          const satuKolom = LEBAR_KOLOM + JARAK_KOLOM;
          /*
            Kisinya hanya selebar kolom yang DIGAMBAR, lalu digeser ke posisi kolom
            pertamanya. Lebar penuh deret tetap dipegang pembungkus `w-max` di bawah,
            jadi `scrollWidth` tak berubah sedikit pun oleh virtualisasi ini.
          */
          const gridStyle = {
            gridTemplateColumns: `repeat(${Math.max(kartuDirender.length, 1)}, ${LEBAR_KOLOM}px)`,
            marginLeft: offsetKolom * satuKolom,
          };
          /** Lebar deret seandainya semua kolom digambar — penjaga `scrollWidth`. */
          const lebarPenuh = kartuTampil.length * satuKolom - JARAK_KOLOM;

          return (
            /*
              Pembungkus penggulir. `w-max` penting: tanpanya lapisan latar
              `absolute inset-0` hanya selebar layar, jadi kartu di luar tepi kehilangan
              alas putihnya begitu digulir.
            */
            <div
              ref={gulirRef}
              onScroll={saatMenggulir}
              onMouseDown={mulaiPan}
              onClickCapture={telanKlikSetelahPan}
              className="overflow-x-auto overflow-y-hidden"
              style={{
                scrollbarWidth: 'thin',
                cursor: sedangPan ? 'grabbing' : undefined,
                // Saat menyeret, jangan ada teks yang ikut tersorot.
                userSelect: sedangPan ? 'none' : undefined,
              }}
            >
            <div
              className="relative"
              style={{
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                /*
                  Lebar dipatok eksplisit, menggantikan `w-max`. Dengan virtualisasi isi
                  kisinya tak lagi selebar seluruh deret, jadi `w-max` akan menciutkan
                  pembungkus ini — dan bersamanya `scrollWidth`, panah geser, serta posisi
                  guliran ikut melenceng. Angka ini yang menahannya tetap seperti semula.
                */
                width: lebarPenuh,
              }}
            >
              {/* Column-strip backgrounds — card visual per column */}
              <div
                className="absolute inset-0 grid pointer-events-none"
                style={{ ...gridStyle, columnGap: `${JARAK_KOLOM}px`, rowGap: '8px' }}
              >
                {kartuDirender.map(emp => {
                  const isPinned = pinnedIds.includes(emp.id);
                  const isDragging = dragCardId === emp.id;
                  const isDropTarget = dragOverCardId === emp.id && dragCardId !== emp.id;
                  return (
                    <div
                      key={emp.id}
                      className="rounded-[16px] bg-white"
                      style={{
                        boxShadow: 'rgba(0,0,0,0.1) 1px 1px 20px 0px, rgba(0,0,0,0.05) 1px 1px 12px -4px',
                        opacity: isDragging ? 0.5 : 1,
                        outline: isDropTarget ? '2px dashed var(--mantine-color-primary-filled)' : isPinned ? '2px solid var(--mantine-color-primary-filled)' : 'none',
                        outlineOffset: -2,
                      }}
                    />
                  );
                })}
                {/* Empty slot placeholders to fill remaining columns */}
              </div>

              {/* Content rows grid */}
              <div className="relative grid" style={{ ...gridStyle, columnGap: `${JARAK_KOLOM}px`, rowGap: '8px' }}>

                {/* ── ROW: Card header (photo / HAV / 3C / riskHeat) ── */}
                {kartuDirender.map((employee, index) => {
                  /*
                    Kepala kartu — foto, 3C, lencana. Baris TERBERAT di layar ini, jadi ia
                    yang paling banyak menghemat saat digambar sebagai kerangka. Tingginya
                    dipatok 320px, kira-kira setinggi kepala kartu sungguhan (foto persegi
                    280px + ubin skor), supaya deretnya tidak melompat saat isinya masuk.
                  */
                  if (!isiPenuh(index)) {
                    return <SelKerangka key={`header-${employee.id}`} tinggi={320} />;
                  }
                  const isPinned   = pinnedIds.includes(employee.id);
                  const scores3C   = get3CScores(employee);
                  return (
                    <div
                      key={`header-${employee.id}`}
                      draggable
                      onDragStart={e => handleCardDragStart(e, employee.id)}
                      onDragOver={e => handleCardDragOver(e, employee.id)}
                      onDrop={e => handleCardDrop(e, employee.id)}
                      onDragEnd={() => { setDragCardId(null); setDragOverCardId(null); }}
                      className="overflow-hidden rounded-t-[16px]"
                      style={{ cursor: 'grab' }}
                    >
                      {/* Checkbox + Pin buttons */}
                      <div className="relative">
                        <button
                          onClick={() => toggleSelect(employee.id)}
                          className="absolute top-4 left-4 z-20 w-10 h-10 flex items-center justify-center"
                          style={{ cursor: 'default' }}
                        >
                          <div style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            border: `2px solid ${selectedIds.has(employee.id) ? 'var(--mantine-color-primary-filled)' : 'rgba(255,255,255,0.8)'}`,
                            background: selectedIds.has(employee.id) ? 'var(--mantine-color-primary-filled)' : 'rgba(0,0,0,0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                          }}>
                            {selectedIds.has(employee.id) && (
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                        </button>
                        <button
                          onClick={() => togglePin(employee.id)}
                          title={isPinned ? 'Unpin' : 'Pin to front'}
                          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center"
                          style={{ cursor: 'default' }}
                        >
                          <Pin className="w-4 h-4" style={{ color: '#FD9F28' }} fill={isPinned ? '#FD9F28' : 'none'} />
                        </button>
                        {isPinned && (
                          <div className="absolute top-16 right-4 z-10">
                            {/*
                              Dulu `<span>` dengan `bg-[#016699]`, `text-[10px]`, dan
                              `rounded-full` — pil buatan tangan berwarna hex. Kini
                              `Tag` dengan token `primary`, sama seperti pil status di
                              Beranda dan iProfile.
                            */}
                            <Tag warnaDS="primary">Pinned</Tag>
                          </div>
                        )}

                        {/* Photo — aspect-square ensures 1:1 ratio at any card width */}
                        <div className="relative aspect-square overflow-hidden">
                          {/* Layer 1 — background biru, 65% tinggi dari bawah */}
                          <div className="absolute bottom-0 left-0 right-0" style={{ height: '65%', background: '#197fc9', borderRadius: '8px 164px 0 0' }} />

                          {/* Layer 2 — foto */}
                          {/*
                            `loading="lazy"` menyusul carousel. Dengan paginasi hanya
                            empat foto yang pernah ada di DOM sekaligus; sekarang
                            seluruh 106 kartu dirender, dan memuat semuanya di muka
                            berarti ~9 MB gambar yang sebagian besar di luar layar.
                          */}
                          <img src={employee.photo} alt={employee.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/avatars/male.jpg'; e.currentTarget.onerror = null; }} />

                          {/* Layer 3 — gradient hitam */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                          <div className="absolute bottom-6 left-6 right-6">
                            {/*
                              Nama pakai `--font-display` (Avenir) lewat `ff="heading"`:
                              aturan design system yang sama dengan judul kartu di
                              Beranda dan iProfile. Sisanya `--font-body`, otomatis
                              dari `Text`. Warna putih dipertahankan karena teksnya
                              berdiri di atas foto, bukan di atas latar kartu.
                            */}
                            <Text
                              component="h2"
                              size="lg"
                              fw={700}
                              ff="heading"
                              c="white"
                              mb={2}
                              truncate
                              className="hover:underline cursor-pointer"
                              onClick={(e) => { e.stopPropagation(); window.location.href = `/iprofile?id=${encodeURIComponent(getIProfilePid(employee))}`; }}
                              title="Go to iProfile"
                            >
                              {employee.name}
                            </Text>
                            <Text size="xs" fw={600} c="rgba(255,255,255,0.8)" truncate>
                              {jabatan(employee)}
                            </Text>
                            {employee.usia && (
                              <Text size="md" c="rgba(255,255,255,0.8)" mt={4}>
                                {employee.usia} Tahun
                              </Text>
                            )}
                          </div>
                          {/* Watermark ranking — angka besar semi-transparan pojok kanan bawah */}
                          {employeeRankings.get(employee.id) != null && (
                            <div
                              aria-hidden
                              style={{
                                position: 'absolute',
                                bottom: -8,
                                right: 8,
                                fontSize: 96,
                                fontWeight: 800,
                                lineHeight: 1,
                                color: 'rgba(255,255,255,0.18)',
                                fontFamily: 'var(--font-heading)',
                                pointerEvents: 'none',
                                userSelect: 'none',
                                letterSpacing: -4,
                              }}
                            >
                              #{employeeRankings.get(employee.id)}
                            </div>
                          )}
                          {/* Sentinel: sticky bar fires when photo bottom leaves viewport */}
                          {index === 0 && <div ref={setSentinel} className="absolute bottom-0 left-0 w-full h-px" />}
                        </div>

                        {/*
                          Ubin statistik: DUA kolom, dua baris.

                          Dulu tiga kolom di baris pertama (Kompetensi | Engagement |
                          Ranking) dan Leadership Style selebar kartu di baris kedua.
                          Tiga kolom cuma memberi 77px per ubin — terlalu sempit untuk
                          label berukuran token; lihat catatan di `StatUbin`. Jumlah
                          barisnya tetap dua, jadi tinggi kartunya praktis sama.
                        */}
                        <div className="px-4 pt-4 pb-4 flex flex-col gap-2">
                          {/*
                            Ubin 3C hanya tampil bila cluster-nya punya variabel yang dicentang di Data
                            Visibility — tak ada yang dicentang di Contribution berarti ubin Contribution
                            hilang. DISC tak punya cluster, jadi tetap.
                          */}
                          <div className="grid grid-cols-2 gap-2">
                            {/* Capability — rata-rata [KOMPETENSI] */}
                            {adaKlaster('capability') && (
  <div className="rounded-[8px] px-3 py-3 text-center"
                                style={{ background: '#fff', boxShadow: '2px 4px 20px 0px #00000012' }}>
                                <StatUbin label="Capability">
                                  {targetMatchMap
                                    ? (targetMatchMap.get(employee.id) ?? '—')
                                    : scores3C.capability}
                                </StatUbin>
                              </div>
                            )}
                            {/* Commitment — rata-rata [ENGAGEMENT], fallback Engagement polos */}
                            {adaKlaster('commitment') && (
  <div className="rounded-[8px] px-3 py-3 text-center"
                                style={{ background: '#fff', boxShadow: '2px 4px 20px 0px #00000012' }}>
                                <StatUbin label="Commitment">
                                  {scores3C.commitment}
                                </StatUbin>
                              </div>
                            )}
                            {/* Contribution — kolom Performance */}
                            {adaKlaster('contribution') && (
  <div className="rounded-[8px] px-3 py-3 text-center"
                                style={{ background: '#fff', boxShadow: '2px 4px 20px 0px #00000012' }}>
                                <StatUbin label="Contribution">
                                  {scores3C.contribution ?? <NoDataChip />}
                                </StatUbin>
                              </div>
                            )}
                            {/* DISC personality — hanya bila variabel "Personality (DISC)" dicentang di Data Visibility */}
                            {visibleColumns.has(KUNCI_DISC) && (
                            <div className="rounded-[8px] px-3 py-3 text-center flex flex-col justify-center"
                              style={{ background: '#fff', boxShadow: '2px 4px 20px 0px #00000012' }}>
                              <Text size="xs" c="neutral.6" mb={4} style={{ lineHeight: 1.4 }}>DISC</Text>
                              {(employee as any).personality
                                ? <Text size="xs" fw={700} c="primary" style={{ lineHeight: 1.3 }}>{(employee as any).personality}</Text>
                                : <NoDataChip />
                              }
                            </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
                {/* Empty slot cells in header row */}

                {/* ── ROWS: cluster sections (aligned across all columns) ── */}
                {groupedClusters.map(({ clusterKey, label, colDefs }) => {
                  const isClusterDragging = dragClusterId === clusterKey;
                  const isClusterDropTarget = dragOverClusterId === clusterKey && dragClusterId !== clusterKey;
                  return (
                  <React.Fragment key={clusterKey}>
                    {/* Cluster label row — draggable + collapse toggle */}
                    {kartuDirender.map((emp, empIdx) => (
                      !isiPenuh(empIdx) ? <SelKerangka key={`cl-${clusterKey}-${emp.id}`} tinggi={30} /> : (
                      <div
                        key={`cl-${clusterKey}-${emp.id}`}
                        onDragStart={e => handleClusterDragStart(e, clusterKey)}
                        onDragOver={e => handleClusterDragOver(e, clusterKey)}
                        onDrop={e => handleClusterDrop(e, clusterKey)}
                        onDragEnd={() => { setDragClusterId(null); setDragOverClusterId(null); }}
                        className="px-4 pt-3 pb-1"
                        style={{
                          opacity: isClusterDragging ? 0.4 : 1,
                          /*
                            `empIdx` di sini indeks dalam IRISAN, jadi 0 berarti kolom
                            pertama yang sedang digambar — bukan kolom pertama deret.
                            Justru itu yang benar: penanda sasaran jatuh tetap terlihat di
                            tepi kiri layar berapa pun posisi guliran.
                          */
                          borderTop: isClusterDropTarget && empIdx === 0
                            ? '2px dashed var(--mantine-color-primary-filled)'
                            : '2px solid transparent',
                        }}
                      >
                        <div className="flex items-center gap-2">
                        {/*
                          Yang diseret PEGANGANNYA, bukan seluruh baris.

                          Ikon ini sudah lama tergambar di sini dan menjanjikan "seret aku";
                          sekarang janji itu ditepati secara harfiah. Sisa barisnya jadi bebas
                          untuk gestur seret-menggeser deret — dua arti pada satu gerakan
                          adalah cara tercepat membuat keduanya terasa rusak.

                          `dragstart` menggelembung, jadi penangan di barisnya tetap terpakai.
                        */}
                          <span draggable style={{ cursor: 'grab', display: 'flex' }}>
                            <GripVertical className="w-3 h-3 shrink-0" style={{ color: '#ADB5BD' }} />
                          </span>
                          <Text size="xs" c="neutral.7" style={{ flex: 1 }}>{label}</Text>
                          <button
                            onClick={e => { e.stopPropagation(); toggleClusterCollapse(clusterKey); }}
                            style={{ cursor: 'pointer' }}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                            title={collapsedClusters.has(clusterKey) ? 'Expand' : 'Collapse'}
                          >
                            {collapsedClusters.has(clusterKey)
                              ? <ChevronDown className="w-4 h-4" style={{ color: '#495057' }} />
                              : <ChevronUp className="w-4 h-4" style={{ color: '#495057' }} />}
                          </button>
                        </div>
                      </div>
                      )
                    ))}

                    {/* One row per item — only rendered when cluster is expanded */}
                    {!collapsedClusters.has(clusterKey) && colDefs.map(col => (
                      <React.Fragment key={String(col.key)}>
                        {kartuDirender.map((emp, idx) => {
                          const itemKey = String(col.key);
                          /*
                            Baris aspek ada PULUHAN — satu per aspek, dikalikan kolom. Di
                            sinilah kerangka paling banyak menghemat secara akumulatif,
                            meski satu selnya kecil.
                          */
                          if (!isiPenuh(idx)) {
                            return <SelKerangka key={`item-${itemKey}-${emp.id}`} tinggi={26} />;
                          }
                          const rawVal = getColValue(col, emp);
                          // Di mode target, kolom Competency Match menunjukkan kecocokan
                          // terhadap jabatan yang dipilih — bukan jabatan sekarang orang itu.
                          const val = (String(col.key) === 'competencyMatch' && targetMatchMap)
                            ? (targetMatchMap.get(emp.id) ?? rawVal)
                            : rawVal;
                          return (
                            <div
                              key={`item-${itemKey}-${emp.id}`}
                              onDragStart={e => handleAspectDragStart(e, itemKey)}
                              onDragOver={e => handleAspectDragOver(e, itemKey)}
                              onDrop={e => handleAspectDrop(e, itemKey)}
                              onDragEnd={() => { setDragAspectId(null); setDragOverAspectId(null); }}
                              className="px-4 py-0"
                              style={{
                                opacity: isClusterDragging || dragAspectId === itemKey ? 0.4 : 1,
                                borderTop: dragOverAspectId === itemKey && dragAspectId !== itemKey
                                  ? '1px dashed var(--mantine-color-primary-filled)' : '1px solid transparent',
                              }}
                            >
                              <div className="bg-gray-50 rounded-[8px] flex items-center gap-2" style={{ padding: '8px 8px 8px 12px' }}>
                                <span draggable style={{ cursor: 'grab', display: 'flex' }}>
                                  <GripVertical className="shrink-0" style={{ width: 12, height: 12, color: '#ADB5BD' }} />
                                </span>
                                <div className="flex flex-col" style={{ gap: 2 }}>
                                  <Text size="xs" c="neutral.5" style={{ lineHeight: 1.2 }}>{col.label}</Text>
                                  {val === null ? (
                                    <NoDataChip />
                                  ) : (col.cluster as string) === 'careerHistory' ? (
                                    <Text size="xs" c="neutral.7" style={{ lineHeight: 1.3 }}>{String(val)}</Text>
                                  ) : typeof val === 'number' && val <= 5 ? (
                                    (() => {
                                      /*
                                        Penanda gap terhadap jabatan target.

                                        Skornya sendiri tidak berubah — yang berubah standar
                                        pembandingnya. Aturannya sama dengan iProfile
                                        (`standardScore > 0 && score < standardScore`), dan
                                        chip-nya pun chip yang sama, supaya aspek yang di
                                        iProfile ditandai DEV. tidak terbaca aman di sini.

                                        Standar hanya ada di mode target; di mode Current
                                        `standarAcuan` null dan barisnya kembali jadi skor polos.
                                      */
                                      const std = AWALAN_KATEGORI[col.cluster as string] && standarAcuan
                                        ? standarAcuan[col.label]
                                        : undefined;
                                      const kurang = typeof std === 'number' && std > 0 && val < std;
                                      return (
                                        <div className="flex items-center gap-[6px]">
                                          <RatingBoxes score={val} maxScore={5} accentColor="var(--mantine-color-primary-filled)" />
                                          {kurang && (
                                            <Tag latar="var(--mantine-color-secondary-0)" warna="var(--mantine-color-secondary-8)">DEV.</Tag>
                                          )}
                                        </div>
                                      );
                                    })()
                                  ) : typeof val === 'number' ? (
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${Math.min(val, 100)}%`, background: 'var(--mantine-color-primary-filled)' }} />
                                      </div>
                                      <Text size="xs" c="neutral.7">{val}</Text>
                                    </div>
                                  ) : (
                                    <Text size="xs" c="neutral.7" style={{ lineHeight: 1.3 }}>{String(val)}</Text>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}

                    {/* Bottom padding row for cluster section */}
                    {kartuDirender.map(emp => (
                      <div key={`cl-end-${clusterKey}-${emp.id}`} className="px-4 pb-2" />
                    ))}
                  </React.Fragment>
                  );
                })}

                {/* ── ROW: Create IDP (Go to Profile removed — name click already opens iProfile) ── */}
                {kartuDirender.map((emp, idx) => (
                  !isiPenuh(idx) ? <SelKerangka key={`actions-${emp.id}`} tinggi={36} /> : (
                  <div key={`actions-${emp.id}`} className="px-4 pb-4 pt-2">
                    {/*
                      Warna dan tebal huruf datang dari tema DS (`color="primary"`,
                      label 700), bukan dari `border-[#016699] text-[#016699]` dan
                      `style={{ fontWeight: 700 }}` yang dulu ditulis di sini untuk
                      mengalahkan reset `button { font-weight }` di
                      `vismap/styles/globals.css`. Tema Mantine menata lewat
                      `styles.label`, yang kekhususannya di atas reset elemen itu.
                    */}
                    <Button
                      variant="outline"
                      color="primary"
                      fullWidth
                      onClick={() => { window.location.href = `/idp?page=create-idp-admin.html&name=${encodeURIComponent(emp.name || '')}`; }}
                    >
                      Create IDP
                    </Button>
                  </div>
                  )
                ))}

              </div>{/* end content rows grid */}
            </div>{/* end lapisan w-max */}
            </div>
          );
        })()}

        </div> {/* end scroll container */}
      </div> {/* end cards grid wrapper */}

      {/*
        Kendali geser deret kartu.

        Menggantikan pil paginasi di bawah-tengah. Nomor halaman sudah lama dibuang —
        kartunya satu deret menerus dan berapa yang terlihat bergantung lebar layar — tapi
        pilnya masih menyisakan dua panah yang duduk jauh dari tepi yang hendak dituju,
        sambil menutupi kartu paling bawah sepanjang waktu.

        Sekarang panahnya menempel di tepi deret dan SELALU terlihat. Yang tak bisa dituju
        disembunyikan: di ujung kiri, panah kiri hilang — posisi terbaca tanpa perlu ada yang
        dibaca, dan tak ada tombol yang bisa ditekan tapi tak melakukan apa-apa.

        ⚠️ Keduanya SELALU ada di DOM, hanya `opacity: 0` di ujung deret — bukan dirender
        bersyarat. Elemen ber-opacity nol tetap bisa dijangkau Tab. Merendernya bersyarat akan
        menghapus satu-satunya cara pemakai papan tik menggeser deret ini, dan justru itu
        alasan tombolnya diadakan: guliran mendatar biasa menuntut trackpad atau roda mendatar.
      */}
      {/*
        Bilah guliran melayang — lihat catatan di dekat `bilahBawahRef`.

        `left` dan `width` diisi secara imperatif supaya ia persis selebar deretnya, bukan
        selebar layar: kartunya tidak bermula di tepi jendela. Tingginya 10px memberi ruang
        bagi thumb 6px yang sudah ditetapkan `theme.css` untuk `.tdp-root`.

        SELALU terlihat (bukan lagi bergantung kedekatan kursor) selama deretnya memang
        perlu digulir — `display` sudah menanganinya sendiri lewat `samakan()`.
      */}
      {kartuTampil.length > 0 && (
        <div
          ref={bilahBawahRef}
          className="fixed overflow-x-auto overflow-y-hidden"
          style={{
            bottom: 0,
            height: 10,
            zIndex: 9997,
            background: 'rgba(255,255,255,0.92)',
            borderTop: '1px solid #e9ecef',
          }}
        >
          <div ref={isiBilahBawahRef} style={{ height: 1 }} />
        </div>
      )}

      {kartuTampil.length > 0 && tepiDeret && (
        <>
          {([
            { arah: -1 as const, bisa: bisaGeserKiri, gaya: { left: tepiDeret.kiri + 6 }, Ikon: ChevronLeft, label: 'Geser ke kartu sebelumnya' },
            // Dihitung dari tepi yang sudah diukur — bidang klik 56px, lingkaran 44px di
            // tengahnya, disisakan 12px dari tepi deret. Bukan dari `window.innerWidth`:
            // satu sumber ukuran, dan tak ada yang dibaca saat render.
            { arah: 1 as const, bisa: bisaGeserKanan, gaya: { left: tepiDeret.kanan - 62 }, Ikon: ChevronRight, label: 'Geser ke kartu berikutnya' },
          ]).map(({ arah, bisa, gaya, Ikon, label }) => {
            /*
              SELALU terlihat selama arah itu memang masih bisa digeser — diminta langsung.

              Dulu `deretDihover && bisa`: panahnya baru muncul setelah kursor masuk ke area
              kartu. Akibatnya ia terbaca seperti kendali yang rusak — orang tidak tahu ada
              tombol geser sampai kebetulan melewatinya dengan kursor.

              Yang TETAP: ia hilang di ujung deret (`bisa` false). Itu bukan penyembunyian,
              melainkan jawaban — tak ada lagi kartu ke arah sana.
            */
            const tampil = bisa;
            return (
              <button
                key={arah}
                type="button"
                onClick={() => geser(arah)}
                aria-label={label}
                aria-hidden={!bisa}
                tabIndex={bisa ? 0 : -1}
                /*
                  Area klik JAUH lebih besar dari lingkarannya.

                  Tombol 40px terlihat cukup, tapi di belakangnya ada kartu yang seluruh
                  kepalanya bisa diklik dan diseret — jadi meleset sedikit saja bukan berarti
                  "tidak terjadi apa-apa", melainkan membuka profil orang. Lingkarannya tetap
                  44px supaya tampilannya tidak berubah; yang melebar bidang bening di
                  sekelilingnya.
                */
                className="fixed flex items-center justify-center"
                style={{
                  ...gaya,
                  top: '50%',
                  width: 56,
                  height: 80,
                  transform: 'translateY(-50%)',
                  zIndex: 9998,
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  opacity: tampil ? 1 : 0,
                  pointerEvents: tampil ? 'auto' : 'none',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <span
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-white border border-gray-200"
                  style={{
                    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                    color: 'var(--mantine-color-primary-filled)',
                  }}
                >
                  <Ikon className="w-5 h-5" />
                </span>
              </button>
            );
          })}
        </>
      )}

      {/* Visible Columns Dialog — shared with Table view */}
      <VisibleColumnsDialog
        open={isColumnsDialogOpen}
        onOpenChange={(o) => { setIsColumnsDialogOpen(o); if (!o) setVersiKlaster((v) => v + 1); }}
        visibleColumns={visibleColumns}
        onApply={handleApplyVisibleColumns}
        columnDefinitions={allCompareColumnDefs.filter((c) => c.key !== 'level')}
        customColumns={[]}
        onDeleteCustomColumn={() => {}}
        onAddColumn={() => {}}
      />
    </div>
  );
}
