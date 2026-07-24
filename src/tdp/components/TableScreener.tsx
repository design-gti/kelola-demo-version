// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import React, { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router';
import { mockEmployees, Employee } from '../data/mockEmployees';
import { tdpEmployees, CSV_RAW_HEADERS } from '../data/tdpEmployees';
import { getProfileUrl } from '../data/profileLinks';
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
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Label } from './ui/label';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';
import { filterFigmaProps } from './ui/utils';
import EmployeeDetailModal from './EmployeeDetailModal';
import VisibleColumnsDialog from './VisibleColumnsDialog';
import svgPaths from '../imports/svg-vfm09kdtkj';
import visibleColumnsSvgPaths from '../imports/svg-uatce53kpn';

// Bumped to v11: force reset to hardcoded mockEmployees with dummy Tim assignments.
const EMPLOYEE_UPLOAD_DRAFT_KEY = 'employeeUploadDraft.v11';
const EMPLOYEE_UPLOAD_FILE_NAME_KEY = 'employeeUploadDraftFileName.v10';
const VISIBLE_COLUMNS_STORAGE_KEY = 'visibleColumns.v8';
const COLUMN_DEFAULTS_VERSION = 'v5-csv-full';

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

const NoDataChip = () => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 999,
      fontSize: 10,
      fontWeight: 600,
      fontFamily: '"Open Sans", sans-serif',
      background: '#fff8f0',
      color: '#FD9F28',
      border: '1px solid #FD9F28',
      lineHeight: 1.4,
    }}
  >
    No Data
  </span>
);

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
  categories?: string[]; // For categorical columns
  cluster?: 'competency' | 'commitment' | 'contribution' | 'aspect' | 'custom'; // For custom columns
  clusterName?: string; // Original cluster name from uploaded XLSX header
}

// ---------- Typed Employee-field columns (the 8 KOMPETENSI we already map + scores) ----------
// These have first-class fields on the Employee record; they are NOT auto-generated.
const typedColumnDefinitions: ColumnConfig[] = [
  // Basic Info (typed)
  { key: 'name', label: 'Employee', sortable: true, defaultVisible: true },
  { key: 'role', label: 'Position', sortable: true, defaultVisible: true },
  { key: 'department', label: 'Tim', sortable: true, defaultVisible: false },
  { key: 'level', label: 'Level', sortable: true, defaultVisible: false },
  // 8 mapped KOMPETENSI → typed aspect fields (scale 1-5)
  { key: 'adaptability', label: 'Agility and Adaptability', sortable: true, defaultVisible: true, cluster: 'aspect' },
  { key: 'teamwork', label: 'Customer Focus', sortable: true, defaultVisible: true, cluster: 'aspect' },
  { key: 'decisionMaking', label: 'Building Strategic Partnership', sortable: true, defaultVisible: true, cluster: 'aspect' },
  { key: 'innovation', label: 'Developing Organizational Capabilities', sortable: true, defaultVisible: true, cluster: 'aspect' },
  { key: 'communication', label: 'Optimizing Work Process', sortable: true, defaultVisible: true, cluster: 'aspect' },
  { key: 'leadership', label: 'Driving Execution', sortable: true, defaultVisible: true, cluster: 'aspect' },
  { key: 'problemSolving', label: 'Leading Change', sortable: true, defaultVisible: true, cluster: 'aspect' },
  { key: 'analyticalSkills', label: 'Strategic Orientation', sortable: true, defaultVisible: true, cluster: 'aspect' },
  // Score fields (typed, derived in tdpEmployees.ts)
  { key: 'competencyMatch', label: 'Competency Match', sortable: true, defaultVisible: true },
  { key: 'engagementScore', label: 'Engagement', sortable: true, defaultVisible: false },
  { key: 'performanceRating', label: 'Performance', sortable: true, defaultVisible: true },
  { key: 'potentialRating', label: 'Score', sortable: true, defaultVisible: false },
];

// CSV headers ALREADY represented by typedColumnDefinitions → skip when auto-generating.
const COVERED_CSV_HEADERS = new Set<string>([
  'Name', 'Position', 'Tim', 'Level',
  '[KOMPETENSI] Agility and Adaptability',
  '[KOMPETENSI] Customer Focus',
  '[KOMPETENSI] Building Strategic Partnership',
  '[KOMPETENSI] Developing Organizational Capabilities',
  '[KOMPETENSI] Optimizing Work Process',
  '[KOMPETENSI] Driving Execution',
  '[KOMPETENSI] Leading Change',
  '[KOMPETENSI] Strategic Orientation',
  // Filter / rendering helpers — not user-facing columns
  'Shown in TDP', 'Photo URL',
  // Aggregate typed columns — superseded by cluster averages
  'IQ', 'Capability',
]);

// Map a raw CSV header → cluster used by VisibleColumnsDialog.
// Mirrors the CSV's own column-grouping:
//   [KOMPETENSI]  → aspect (sub-section under Capability)
//   [HEROES]      → commitment
//   [LEADERSHIP PROFILE] → contribution
//   Capability, IQ → capability (uses 'competency' cluster, main Capability section)
//   Commitment    → commitment (main section, not aspect)
//   Contribution, Performance → contribution
//   Score         → potency
//   Readiness     → readiness
//   everything else → basic
function clusterFromCsvHeader(h: string): ColumnConfig['cluster'] | undefined {
  if (h.startsWith('[KOMPETENSI]')) return 'aspect';
  if (h.startsWith('[HEROES]')) return 'commitment' as ColumnConfig['cluster'];
  if (h.startsWith('[LEADERSHIP PROFILE]')) return 'contribution' as ColumnConfig['cluster'];
  if (h === 'Capability' || h === 'IQ') return 'competency' as ColumnConfig['cluster'];
  if (h === 'Commitment') return 'commitment' as ColumnConfig['cluster'];
  if (h === 'Contribution' || h === 'Performance') return 'contribution' as ColumnConfig['cluster'];
  if (h === 'Score') return 'potency' as ColumnConfig['cluster'];
  if (h === 'Readiness') return 'readiness' as ColumnConfig['cluster'];
  if (h.startsWith('[LEADERSHIP STYLE]')) return 'leadershipStyle' as ColumnConfig['cluster'];
  return undefined; // Basic Info
}

// Strip a leading [BRACKET] prefix for the user-facing label.
function labelFromCsvHeader(h: string): string {
  return h.replace(/^\[[^\]]+\]\s*/, '').trim() || h;
}

// Auto-generated CSV-backed column definitions — one per CSV header.
const autoCsvColumnDefinitions: ColumnConfig[] = CSV_RAW_HEADERS
  .filter((h) => h && !COVERED_CSV_HEADERS.has(h))
  .map((h) => ({
    key: `csv:${h}` as ColumnKey,
    label: labelFromCsvHeader(h),
    sortable: true,
    defaultVisible: h.startsWith('[LEADERSHIP STYLE]'),
    cluster: clusterFromCsvHeader(h),
  }));

const columnDefinitions: ColumnConfig[] = [
  ...typedColumnDefinitions,
  ...autoCsvColumnDefinitions,
];

// Derive display names for internal cluster IDs from CSV bracket prefixes.
// e.g. { aspect: 'KOMPETENSI', commitment: 'HEROES', contribution: 'LEADERSHIP PROFILE' }
const CSV_CLUSTER_NAMES: Record<string, string> = (() => {
  const names: Record<string, string> = {};
  CSV_RAW_HEADERS.forEach((h) => {
    const m = h.match(/^\[([^\]]+)\]/);
    if (!m) return;
    const bracketGroup = m[1];
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
    name: CSV_CLUSTER_NAMES['aspect'] ?? 'CAPABILITY',
    columns: [
      'adaptability', 'teamwork', 'decisionMaking', 'innovation', 'communication',
      'leadership', 'problemSolving', 'analyticalSkills', 'competencyMatch',
    ],
    totalScoreKey: 'competencyScore' as const,
  },
  {
    // CSV bracket group: [HEROES] (or whatever maps to 'commitment')
    name: CSV_CLUSTER_NAMES['commitment'] ?? 'COMMITMENT',
    columns: ['engagementScore'],
    totalScoreKey: 'commitmentScore' as const
  },
  {
    // CSV bracket group: [LEADERSHIP PROFILE] (or whatever maps to 'contribution')
    name: CSV_CLUSTER_NAMES['contribution'] ?? 'CONTRIBUTION',
    columns: ['performanceRating'],
    totalScoreKey: 'contributionScore' as const
  },
  {
    name: 'POTENSI',
    columns: ['potentialRating'],
    totalScoreKey: 'aspectScore' as const
  },
  {
    name: CSV_CLUSTER_NAMES['leadershipStyle'] ?? 'LEADERSHIP STYLE',
    columns: [] as string[],
  }
];

// Field type mapping for new filter system
const fieldTypeMap: Record<string, { type: FilterFieldType; label: string }> = {
  department: { type: 'categorical', label: 'Department' },
  level: { type: 'categorical', label: 'Level' },
  performanceRating: { type: 'numerical', label: 'Performance' },
  potentialRating: { type: 'numerical', label: 'Score' },
  readinessHAV: { type: 'categorical', label: 'HAV' },
  usia: { type: 'numerical', label: 'Usia' },
  readinessRiskHeat: { type: 'categorical', label: 'Risk Heat' },
  engagementScore: { type: 'numerical', label: 'Engagement' },
  employees: { type: 'employee-selector', label: 'Employees' },
  // [KOMPETENSI] cluster — competency names sourced from CSV [KOMPETENSI] columns
  adaptability: { type: 'numerical', label: 'Agility and Adaptability' },
  teamwork: { type: 'numerical', label: 'Customer Focus' },
  decisionMaking: { type: 'numerical', label: 'Building Strategic Partnership' },
  innovation: { type: 'numerical', label: 'Developing Organizational Capabilities' },
  communication: { type: 'numerical', label: 'Optimizing Work Process' },
  leadership: { type: 'numerical', label: 'Driving Execution' },
  problemSolving: { type: 'numerical', label: 'Leading Change' },
  analyticalSkills: { type: 'numerical', label: 'Strategic Orientation' },
  competencyMatch: { type: 'numerical', label: 'Competency Match' },
};

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
  onPresetChange?: (label: string | null) => void;
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

export default function TableScreener({ onToolbarRender, onSharedToolbarRender, onPresetChange, pinnedIds: pinnedIdsProp, onPinnedIdsChange }: TableScreenerProps = {}) {
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
  
  // Saved filters state
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [isSaveFilterDialogOpen, setIsSaveFilterDialogOpen] = useState(false);
  const [filterNameToSave, setFilterNameToSave] = useState('');

  // Custom columns state
  const [customColumns, setCustomColumns] = useState<ColumnConfig[]>([]);
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
  const [customColumnData, setCustomColumnData] = useState<Record<string, Record<string, any>>>({});
  
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
      floatingScrollContent.style.width = `${tableWrapper.scrollWidth}px`;
      floatingScrollbar.style.width = `${tableWrapper.clientWidth}px`;
      
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
      default:
        return [];
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

  // Check if condition matches employee
  const checkConditionMatch = (employee: Employee, condition: ActiveFilterCondition): boolean => {
    if (!condition.field || !condition.fieldType) return true;

    const field = condition.field;
    
    if (condition.fieldType === 'categorical') {
      if (!condition.selectedValues || condition.selectedValues.length === 0) return true;
      const empValue = employee[field as keyof Employee];
      return condition.selectedValues.includes(String(empValue));
    }
    
    if (condition.fieldType === 'boolean') {
      if (!condition.selectedValues || condition.selectedValues.length === 0) return true;
      const empValue = employee[field as keyof Employee];
      const boolValue = empValue ? 'Yes' : 'No';
      return condition.selectedValues.includes(boolValue);
    }

    if (condition.fieldType === 'employee-selector') {
      if (!condition.selectedValues || condition.selectedValues.length === 0) return true;
      return condition.selectedValues.includes(employee.id);
    }
    
    if (condition.fieldType === 'numerical') {
      if (!condition.operator || condition.value === null) return true;
      const empValue = employee[field as keyof Employee] as number;
      
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
      const cat = baseCategories.find((c) => c.name === catName);
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

  // Calculate cluster scores for each employee (0-100)
  const calculateEmployeeClusterScores = (employee: Employee, visibleCols: Set<string>) => {
    const categories = dynamicCategories;

    const scores: Record<string, number> = {};

    categories.forEach(category => {
      let totalWeightedScore = 0;
      let totalWeight = 0;

      // Only calculate from visible columns in this cluster
      category.columns.forEach(field => {
        if (visibleCols.has(field)) {
          // Check if it's a custom column
          const isCustomColumn = customColumns.some(col => col.key === field);

          let value;
          if (isCustomColumn) {
            // Get value from customColumnData
            value = customColumnData[employee.id]?.[field];
          } else {
            // Get value from employee object
            value = employee[field as keyof Employee];
          }

          if (value !== null && value !== undefined) {
            const normalizedValue = normalizeValue(value, field, mockEmployees);
            const weight = columnWeights[field] || 1; // Get weight, default to 1
            totalWeightedScore += normalizedValue * weight;
            totalWeight += weight;
          }
        }
      });

      // Calculate weighted average score for this cluster
      scores[category.name] = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
    });

    return scores;
  };

  // Calculate Ranking Score from visible columns + dynamic categories in real-time
  const calculateRankingScore = (employee: Employee): number => {
    let totalScore = 0;
    let totalWeight = 0;

    const categoryTotalScoreKeys = new Set(
      dynamicCategories
        .map((category) => category.totalScoreKey)
        .filter((key): key is string => Boolean(key))
    );

    // Apply cluster multipliers and per-column weights for category columns
    dynamicCategories.forEach((category) => {
      const multiplierKey = category.totalScoreKey;
      const clusterMultiplier = multiplierKey ? (columnWeights[multiplierKey] || 1) : 1;

      category.columns.forEach((field) => {
        if (!visibleColumns.has(field)) return;

        const individualWeight = columnWeights[field] || 1;
        const effectiveWeight = individualWeight * clusterMultiplier;
        const isCustomColumn = customColumns.some((col) => col.key === field);
        const rawValue = isCustomColumn ? customColumnData[employee.id]?.[field] : employee[field as keyof Employee];

        if (rawValue === null || rawValue === undefined || rawValue === '') return;

        const normalizedValue = normalizeValue(rawValue, field, employees);
        totalScore += normalizedValue * effectiveWeight;
        totalWeight += effectiveWeight;
      });
    });

    // Handle visible columns not inside any category (and not total score multipliers)
    allColumnDefinitions.forEach((col) => {
      const field = col.key;
      const isInAnyCategory = dynamicCategories.some((category) => category.columns.includes(field));
      if (!visibleColumns.has(field) || isInAnyCategory || categoryTotalScoreKeys.has(field)) return;

      const isCustomColumn = customColumns.some((c) => c.key === field);
      const rawValue = isCustomColumn ? customColumnData[employee.id]?.[field] : employee[field as keyof Employee];
      if (rawValue === null || rawValue === undefined || rawValue === '') return;

      const weight = columnWeights[field] || 1;
      const normalizedValue = normalizeValue(rawValue, field, employees);
      totalScore += normalizedValue * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  };

  // Returns list of visible+weighted column labels that have missing data for an employee.
  // Used to show red-star indicator in Ranking column.
  const getMissingWeightedColumns = (employee: Employee): string[] => {
    const missing: string[] = [];
    const categoryTotalScoreKeys = new Set(
      dynamicCategories.map(c => c.totalScoreKey).filter(Boolean) as string[]
    );

    dynamicCategories.forEach((category) => {
      category.columns.forEach((field) => {
        if (!visibleColumns.has(field)) return;
        const isCustom = customColumns.some(c => c.key === field);
        const raw = isCustom ? customColumnData[employee.id]?.[field] : employee[field as keyof Employee];
        if (raw === null || raw === undefined || raw === '') {
          const label = allColumnDefinitions.find(c => c.key === field)?.label ?? field;
          missing.push(label);
        }
      });
    });

    allColumnDefinitions.forEach((col) => {
      const field = col.key;
      const isInCategory = dynamicCategories.some(c => c.columns.includes(field));
      if (!visibleColumns.has(field) || isInCategory || categoryTotalScoreKeys.has(field)) return;
      const isCustom = customColumns.some(c => c.key === field);
      const raw = isCustom ? customColumnData[employee.id]?.[field] : employee[field as keyof Employee];
      if (raw === null || raw === undefined || raw === '') {
        missing.push(col.label);
      }
    });

    return missing;
  };


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
  }, [filteredAndSortedEmployees, columnWeights, visibleColumns, sortField, sortDirection, customColumnData, dynamicCategories, allColumnDefinitions, customColumns, employees]);

  // Sync rankings to localStorage so Compare tab can read the same ranking
  useEffect(() => {
    const rankMap: Record<string, number> = {};
    employeesWithRanking.forEach(emp => { rankMap[emp.id] = emp.ranking; });
    try { localStorage.setItem('tableRankings', JSON.stringify(rankMap)); } catch {}
  }, [employeesWithRanking]);

  // Sync visible employee IDs to localStorage so Compare tab mirrors Table's active filter
  useEffect(() => {
    const ids = filteredAndSortedEmployees.map(e => e.id);
    try { localStorage.setItem('tableVisibleEmployeeIds', JSON.stringify(ids)); } catch {}
  }, [filteredAndSortedEmployees]);

  // Add cluster scores to employees
  const employeesWithClusterScores = useMemo(() => {
    let result = employeesWithRanking.map(emp => {
      const clusterScores = calculateEmployeeClusterScores(emp, visibleColumns);
      return {
        ...emp,
        competencyScore: clusterScores[CSV_CLUSTER_NAMES['aspect'] ?? 'CAPABILITY'],
        commitmentScore: clusterScores[CSV_CLUSTER_NAMES['commitment'] ?? 'COMMITMENT'],
        contributionScore: clusterScores[CSV_CLUSTER_NAMES['contribution'] ?? 'CONTRIBUTION'],
        aspectScore: clusterScores[CSV_CLUSTER_NAMES['potency'] ?? 'POTENSI'],
      };
    });

    // If sorting by cluster scores, re-sort the result
    if (sortField === 'competencyScore' || sortField === 'commitmentScore' || sortField === 'contributionScore' || sortField === 'aspectScore') {
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
      clusterTotalSlotOverride,
      columnDefaultsVersion: COLUMN_DEFAULTS_VERSION,
    };
    localStorage.setItem('currentTableState', JSON.stringify(tableState));
  }, [filters, sortField, sortDirection, visibleColumns, filteredAndSortedEmployees, selectedEmployeeIds, activeFilterConditions, matchMode, columnWeights, clusterTotalSlotOverride]);

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
      setSortDirection('desc');
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

    const updatedColumns = [...customColumns, newColumn];
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
    const updatedColumns = customColumns.filter(col => col.key !== columnToDelete);
    setCustomColumns(updatedColumns);
    localStorage.setItem('customColumns', JSON.stringify(updatedColumns));

    // Remove from visible columns
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      newSet.delete(columnToDelete);
      return newSet;
    });

    // Remove data for this column from all employees
    const updatedData = { ...customColumnData };
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
    // Notify parent of the selected preset label
    onPresetChange?.(presetLabels[presetType]);
  };

  const deletePreset = (id: string) => {
    const updatedPresets = presets.filter(p => p.id !== id);
    setPresets(updatedPresets);
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
          customColumns.map((col) => [String(col.key), col])
        );
        const newColumns = inferredCustomColumns.filter(
          (col) => !existingByKey.has(String(col.key))
        );
        const allCustomColumns = [...customColumns, ...newColumns];

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
            photo: getCell('photo') || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
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

  const hasActiveFilters = 
    activeFilterConditions.length > 0 ||
    filters.department.length > 0 ||
    filters.level.length > 0 ||
    filters.performanceRating.operator !== null ||
    filters.potentialRating.operator !== null ||
    filters.readinessLevel.operator !== null ||
    filters.timeInRole.operator !== null ||
    filters.engagementScore.operator !== null ||
    filters.salary.operator !== null ||
    filters.iqScore.operator !== null ||
    filters.flightRisk.length > 0 ||
    filters.criticalRole !== null ||
    filters.successorIdentified !== null ||
    filters.personality.length > 0 ||
    filters.leadershipType.length > 0 ||
    filters.searchTerm !== '';

  // Keep the latest upload as recoverable draft across tab close/navigation
  useEffect(() => {
    localStorage.setItem(EMPLOYEE_UPLOAD_DRAFT_KEY, JSON.stringify(employees));
  }, [employees]);

  // Send Columns button to parent (view-specific toolbar)
  useEffect(() => {
    if (onToolbarRender) {
      onToolbarRender(
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-full"
          onClick={() => setIsVisibleColumnsDialogOpen(true)}
        >
          <Columns3 className="w-4 h-4" style={{ color: '#016699' }} />
          Data Visibility
        </Button>
      );
    }
    return () => onToolbarRender?.(null);
  }, [onToolbarRender, dynamicCategories, clusterTotalSlotOverride, allColumnDefinitions]);

  // Send Filter + Preset buttons to shared toolbar (always visible across tabs)
  useEffect(() => {
    if (!onSharedToolbarRender) return;
    const sharedButtons = (
      <div className="flex gap-3">
          {/* Filter Button */}
          <Button
            variant="outline"
            onClick={() => setIsFilterDialogOpen(true)}
            className="flex items-center gap-2 rounded-full"
          >
            <Filter className="w-4 h-4" style={{ color: '#016699' }} />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-[#016699] text-white text-xs rounded-full">
                Active
              </span>
            )}
          </Button>


          {/* Preset Manager */}
          <Popover open={isPresetPopoverOpen} onOpenChange={(open) => { setIsPresetPopoverOpen(open); if (!open) setPresetSearch(''); }}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 rounded-full">
                <Bookmark className="w-4 h-4" style={{ color: '#016699' }} />
                Presets
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[220px] p-0 rounded-[12px] overflow-hidden shadow-[2px_4px_20px_0px_#00000012] border border-[#dee2e6]">
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
                    style={{ fontFamily: '"Open Sans", sans-serif' }}
                  />
                </div>
              </div>

              <div className="max-h-[320px] overflow-y-auto py-1">
                {/* General Criteria section */}
                {(!presetSearch || 'General'.toLowerCase().includes(presetSearch.toLowerCase())) && (
                  <>
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <span className="text-[10px] font-semibold text-[#adb5bd] whitespace-nowrap" style={{ fontFamily: '"Open Sans", sans-serif' }}>General Criteria</span>
                      <div className="flex-1 h-px bg-[#dee2e6]" />
                    </div>
                    <button
                      className="w-full text-left px-3 py-2 text-xs font-normal text-[#495057] hover:bg-[#f8f9fa] transition-colors"
                      style={{ fontFamily: '"Open Sans", sans-serif' }}
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
                          <span className="text-[10px] font-semibold text-[#adb5bd] whitespace-nowrap" style={{ fontFamily: '"Open Sans", sans-serif' }}>Job Criteria</span>
                          <div className="flex-1 h-px bg-[#dee2e6]" />
                        </div>
                      );
                    }
                    acc.push(
                      <button
                        key={key}
                        className="w-full text-left px-3 py-2 text-xs font-normal text-[#495057] hover:bg-[#f8f9fa] transition-colors"
                        style={{ fontFamily: '"Open Sans", sans-serif' }}
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
                      <span className="text-[10px] font-semibold text-[#adb5bd] whitespace-nowrap" style={{ fontFamily: '"Open Sans", sans-serif' }}>Saved Presets</span>
                      <div className="flex-1 h-px bg-[#dee2e6]" />
                    </div>
                    {presets
                      .filter(p => !presetSearch || p.name.toLowerCase().includes(presetSearch.toLowerCase()))
                      .map((preset) => (
                        <div key={preset.id} className="flex items-center justify-between px-3 py-2 hover:bg-[#f8f9fa] transition-colors group">
                          <button
                            className="flex-1 text-left text-xs font-normal text-[#495057]"
                            style={{ fontFamily: '"Open Sans", sans-serif' }}
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
                  style={{ fontFamily: '"Open Sans", sans-serif' }}
                  onClick={() => { setIsPresetDialogOpen(true); setIsPresetPopoverOpen(false); setPresetSearch(''); }}
                >
                  <Save className="w-4 h-4" />
                  Save Current as Preset
                </button>
              </div>
            </PopoverContent>
          </Popover>

        </div>
      );
    onSharedToolbarRender(sharedButtons);
    return () => onSharedToolbarRender(null);
  }, [
    hasActiveFilters,
    presets,
    presetSearch,
    isPresetPopoverOpen,
    onSharedToolbarRender,
    navigate,
  ]);

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
      return <span className="text-xs text-gray-700">{raw}</span>;
    }

    switch (key) {
      case 'name': {
        const isPinned = pinnedTableIds.includes(employee.id);
        return (
          <div className="flex items-center gap-3 group/nameCell">
            <div className="relative shrink-0">
              <img
                src={employee.photo}
                alt={employee.name}
                onError={(e) => { e.currentTarget.src = '/avatars/male.jpg'; e.currentTarget.onerror = null; }}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {employee.name === 'No Data' ? (
                  <NoDataChip />
                ) : (() => {
                  const profileUrl = getProfileUrl(employee);
                  const displayName = employee.name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
                  if (profileUrl) {
                    return (
                      <a
                        href={profileUrl}
                        target="_top"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-gray-900 hover:text-[#016699] hover:underline transition-colors text-left"
                      >
                        {displayName}
                      </a>
                    );
                  }
                  return (
                    <button
                      onClick={() => {
                        setSelectedEmployeeForDetail(employee);
                        setIsEmployeeDetailModalOpen(true);
                      }}
                      className="text-xs font-bold text-gray-900 hover:text-[#016699] hover:underline transition-colors text-left"
                    >
                      {displayName}
                    </button>
                  );
                })()}
                {/* Pin button — visible on hover or when pinned */}
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
                {hasDecision && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-[#016699] border border-blue-200 text-xs px-2 py-0.5"
                  >
                    <FileCheck className="w-3 h-3 mr-1" />
                    In Decision
                  </Badge>
                )}
              </div>
              <div className="text-[8px] text-gray-600">{employee.id}</div>
            </div>
          </div>
        );
      }
      case 'role':
        if (employee.role === 'No Data') {
          return <NoDataChip />;
        }
        return <span className="text-xs text-gray-700">{employee.role.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</span>;
      case 'department': {
        if (employee.department === 'No Data') {
          return <NoDataChip />;
        }
        const allTeams = employee.departments ?? [employee.department];
        const extraCount = allTeams.length - 1;
        return (
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs text-gray-700">{allTeams[0]}</span>
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
        return <Badge variant="outline">{employee.level}</Badge>;
      case 'performanceRating':
        if (!employee.performanceRating || employee.performanceRating === 0) {
          return <NoDataChip />;
        }
        const performanceTooltip = getDataFreshnessTooltip(employee.performanceRatingDate);
        const isPerformanceOld = isDataOld(employee.performanceRatingDate);
        if (performanceTooltip) {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  {isPerformanceOld && <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                  <span className="text-xs text-gray-700 font-medium">{employee.performanceRating}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{performanceTooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        }
        return (
          <span className="text-xs text-gray-700 font-medium">{employee.performanceRating}%</span>
        );
      case 'potentialRating':
        if (!employee.potentialRating || employee.potentialRating === 0) {
          return <NoDataChip />;
        }
        const potentialTooltip = getDataFreshnessTooltip(employee.potentialRatingDate);
        const isPotentialOld = isDataOld(employee.potentialRatingDate);
        if (potentialTooltip) {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  {isPotentialOld && <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                  <span className="text-xs text-gray-700 font-medium">{employee.potentialRating}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{potentialTooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        }
        return (
          <span className="text-xs text-gray-700 font-medium">{employee.potentialRating}%</span>
        );
      case 'readinessLevel':
        if (!employee.readinessLevel || employee.readinessLevel === 0) {
          return <NoDataChip />;
        }
        return (
          <span className="text-xs text-gray-700 font-medium">{employee.readinessLevel}%</span>
        );
      case 'timeInRole':
        if (!employee.timeInRole || employee.timeInRole === 0) {
          return <NoDataChip />;
        }
        return <span className="text-xs text-gray-700">{employee.timeInRole}mo</span>;
      case 'engagementScore':
        if (!employee.engagementScore || employee.engagementScore === 0) {
          return <NoDataChip />;
        }
        const engagementTooltip = getDataFreshnessTooltip(employee.engagementScoreDate);
        const isEngagementOld = isDataOld(employee.engagementScoreDate);
        if (engagementTooltip) {
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  {isEngagementOld && <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />}
                  <span className="text-xs text-gray-700 font-medium">{employee.engagementScore}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{engagementTooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        }
        return (
          <span className="text-xs text-gray-700 font-medium">{employee.engagementScore}%</span>
        );
      case 'flightRisk':
        return (
          <span className="text-xs text-gray-700 font-medium">
            {employee.flightRisk}
          </span>
        );
      case 'salary':
        if (!employee.salary || employee.salary === 0) {
          return <NoDataChip />;
        }
        return <span className="text-xs text-gray-700">Rp {employee.salary.toLocaleString('id-ID')}</span>;
      case 'criticalRole':
        return (
          <span className="text-xs text-gray-700 font-medium">
            {employee.criticalRole ? 'Yes' : 'No'}
          </span>
        );
      case 'successorIdentified':
        return (
          <span className="text-xs text-gray-700 font-medium">
            {employee.successorIdentified ? 'Yes' : 'No'}
          </span>
        );
      // Imported columns from AI Analysis
      case 'iqScore':
        if (!employee.iqScore || employee.iqScore === 0) {
          return <NoDataChip />;
        }
        return <span className="text-xs text-gray-700 font-medium">{employee.iqScore}</span>;
      case 'personality':
        if (!employee.personality || employee.personality === 'No Data') {
          return <NoDataChip />;
        }
        return (
          <span className="text-xs text-gray-700 font-medium">{employee.personality}</span>
        );
      case 'leadershipType':
        if (!employee.leadershipType || employee.leadershipType === 'No Data') {
          return <NoDataChip />;
        }
        return <span className="text-xs text-gray-700">{employee.leadershipType}</span>;
      // Readiness columns
      case 'readinessHAV':
        return employee.readinessHAV
          ? <span className="text-xs text-gray-700">{employee.readinessHAV}</span>
          : <NoDataChip />;
      case 'usia':
        return employee.usia != null
          ? <span className="text-xs text-gray-700">{employee.usia} thn</span>
          : <NoDataChip />;
      case 'readinessRiskHeat': {
        const riskVal = customColumnData[employee.id]?.readinessRiskHeat ?? employee.readinessRiskHeat ?? '';
        return (
          <Input
            type="text"
            value={riskVal}
            onChange={(e) => handleUpdateCustomData(employee.id, 'readinessRiskHeat', e.target.value)}
            placeholder="Isi risk heat..."
            className="text-xs w-full min-w-[110px] h-8"
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
          <span className="text-xs text-gray-700 font-medium">
            {key === 'competencyMatch' ? aspectValue : `${aspectValue}/5`}
          </span>
        );
      // Cluster Scores
      case 'competencyScore':
      case 'commitmentScore':
      case 'contributionScore':
      case 'aspectScore':
        const empWithScores = employee as Employee & {
          competencyScore?: number;
          commitmentScore?: number;
          contributionScore?: number;
          aspectScore?: number;
        };
        const scoreValue = empWithScores[key];
        if (scoreValue === undefined) return <NoDataChip />;
        return renderClusterScoreCell(scoreValue);
      default:
        // Check if this is a custom column
        const customCol = customColumns.find(col => col.key === key);
        if (customCol) {
          const customValue = customColumnData[employee.id]?.[key];
          return renderCustomCell(employee.id, key, customValue, customCol.customType!, customCol.categories);
        }
        return null;
    }
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
        <Select 
          value={value || ''} 
          onValueChange={(newValue) => handleUpdateCustomData(employeeId, columnKey, newValue)}
        >
          <SelectTrigger className="text-xs w-full min-w-[120px] border-none shadow-none bg-white hover:bg-gray-50">
            {value ? (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {value}
              </Badge>
            ) : (
              <SelectValue placeholder="Select..." />
            )}
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                onClick={() => handleUpdateCustomData(employeeId, columnKey, null)}
                title="Remove attachment"
              >
                <X className="w-3 h-3" />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 hover:bg-blue-50 hover:border-blue-300"
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
              <Upload className="w-3 h-3 mr-1" />
              Upload
            </Button>
          )}
        </div>
      );
    }

    // For like-dislike type, show thumbs up/down buttons
    if (columnType === 'like-dislike') {
      return (
        <div className="flex items-center gap-1">
          <Button
            variant={value === 'like' ? 'default' : 'outline'}
            size="sm"
            className={`h-7 w-7 p-0 ${value === 'like' ? 'bg-green-600 hover:bg-green-700' : ''}`}
            onClick={() => handleUpdateCustomData(employeeId, columnKey, value === 'like' ? null : 'like')}
          >
            <ThumbsUp className="w-3 h-3" />
          </Button>
          <Button
            variant={value === 'dislike' ? 'default' : 'outline'}
            size="sm"
            className={`h-7 w-7 p-0 ${value === 'dislike' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            onClick={() => handleUpdateCustomData(employeeId, columnKey, value === 'dislike' ? null : 'dislike')}
          >
            <ThumbsDown className="w-3 h-3" />
          </Button>
        </div>
      );
    }
    
    // For text and numerical types, use Input
    return (
      <Input
        type={columnType === 'numerical' ? 'number' : 'text'}
        value={value || ''}
        onChange={(e) => handleUpdateCustomData(employeeId, columnKey, e.target.value)}
        placeholder={columnType === 'numerical' ? '0' : 'Enter value'}
        className="text-xs w-full min-w-[100px]"
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
        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg font-['Open_Sans'] font-bold text-xs"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {score}
      </div>
    );
  };

  return (
    <div className="flex flex-col" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Search Bar */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, position, or team..."
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters({ ...filters, searchTerm: e.target.value })
              }
              className="pl-10 rounded-full bg-gray-50 border border-gray-200"
            />
          </div>



        </div>

        {/* Dialogs */}
        {/* Visible Columns Dialog */}
        <VisibleColumnsDialog
          open={isVisibleColumnsDialogOpen}
          onOpenChange={setIsVisibleColumnsDialogOpen}
          visibleColumns={visibleColumns}
          onApply={handleApplyVisibleColumns}
          columnDefinitions={columnDefinitions}
          customColumns={customColumns}
          onDeleteCustomColumn={handleDeleteCustomColumn}
          onAddColumn={() => setIsAddColumnDialogOpen(true)}
        />

        {/* Employee Selector Dialog */}
        <Dialog 
          open={isEmployeeSelectorOpen} 
          onOpenChange={(open) => {
            setIsEmployeeSelectorOpen(open);
            if (!open) {
              // Reset search when closing
              setEmployeeSelectorSearch('');
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="font-['Open_Sans'] font-bold" style={{ textTransform: 'capitalize' }}>
                Select Employees
              </DialogTitle>
              <DialogDescription className="font-['Open_Sans']">
                Choose specific employees to display in the table. Leave all unchecked to show all employees.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {/* Search Bar for Employee Selector */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search employees..."
                    value={employeeSelectorSearch}
                    onChange={(e) => setEmployeeSelectorSearch(e.target.value)}
                    className="pl-10 rounded-lg bg-gray-50 border border-gray-200 font-['Open_Sans']"
                  />
                </div>
              </div>

              {/* Select All / Deselect All */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <div className="flex items-center gap-2">
                  <Checkbox
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
                    onCheckedChange={(checked) => {
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
                    className="font-['Open_Sans'] font-bold cursor-pointer"
                    style={{ textTransform: 'capitalize' }}
                  >
                    Select All {employeeSelectorSearch ? '(Filtered)' : `(${mockEmployees.length} Employees)`}
                  </Label>
                </div>
                <div className="text-sm text-gray-500 font-['Open_Sans']">
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
                        <p className="text-sm text-gray-500 font-['Open_Sans']">
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
                    <Checkbox
                      id={`employee-${employee.id}`}
                      checked={selectedEmployeeIds.includes(employee.id)}
                      onCheckedChange={(checked) => {
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
                        <div className="font-['Open_Sans'] font-bold" style={{ textTransform: 'capitalize' }}>
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500 font-['Open_Sans']">
                          {employee.role} • {employee.department}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 font-['Open_Sans']">
                        {employee.id}
                      </div>
                    </Label>
                  </div>
                ));
                })()}
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedEmployeeIds([]);
                  setIsEmployeeSelectorOpen(false);
                }}
              >
                Clear & Close
              </Button>
              <Button 
                onClick={() => setIsEmployeeSelectorOpen(false)}
                style={{ backgroundColor: '#016699', color: 'white' }}
              >
                Apply Selection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isPresetDialogOpen} onOpenChange={setIsPresetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save as Preset</DialogTitle>
              <DialogDescription>
                Save your current filter and column settings as a preset for quick access later.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="preset-name" className="mb-2 block">Preset Name</Label>
              <Input
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
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsPresetDialogOpen(false);
                setPresetName('');
              }}>
                Cancel
              </Button>
              <Button onClick={savePreset} disabled={!presetName.trim()}>
                <Save className="w-4 h-4 mr-2" />
                Save Preset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Custom Column Dialog */}
        <Dialog 
          open={isAddColumnDialogOpen} 
          onOpenChange={(open) => {
            setIsAddColumnDialogOpen(open);
            if (!open) {
              // Reset state when closing
              setNewColumnName('');
              setNewColumnType('text');
              setNewColumnCategories([]);
              setCategoryInput('');
              setNewColumnCluster('custom');
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
                  <DialogTitle>Add Custom Data</DialogTitle>
                  <DialogDescription>
                    Create a new custom column to track additional employee data.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="column-name" className="mb-2 block">Data Name</Label>
                    <Input
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
                    <Select value={newColumnType} onValueChange={(value: 'text' | 'numerical' | 'categorical' | 'attachment' | 'like-dislike') => setNewColumnType(value)}>
                      <SelectTrigger id="column-type" style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 'normal' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="numerical">Numerical</SelectItem>
                        <SelectItem value="categorical">Categorical</SelectItem>
                        <SelectItem value="attachment">Attachment</SelectItem>
                        <SelectItem value="like-dislike">Like/Dislike</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Categories Input - Only show for categorical type */}
                  {newColumnType === 'categorical' && (
                    <div>
                      <Label className="mb-2 block">Categories</Label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
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
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleAddCategory}
                            disabled={!categoryInput.trim()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Display added categories as chips */}
                        {newColumnCategories.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                            {newColumnCategories.map((category) => (
                              <Badge 
                                key={category} 
                                variant="secondary"
                                className="px-3 py-1 flex items-center gap-2"
                              >
                                {category}
                                <X 
                                  className="w-3 h-3 cursor-pointer hover:text-red-600" 
                                  onClick={() => handleRemoveCategory(category)}
                                />
                              </Badge>
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
                    <Select value={newColumnCluster} onValueChange={(value: string) => setNewColumnCluster(value)}>
                      <SelectTrigger id="column-cluster" style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 'normal' }}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="competency">Competency</SelectItem>
                        <SelectItem value="commitment">Commitment</SelectItem>
                        <SelectItem value="contribution">Contribution</SelectItem>
                        <SelectItem value="aspect">Aspect</SelectItem>
                        <SelectItem value="custom">Others</SelectItem>
                        {userClusters.length > 0 && (
                          <>
                            <div className="my-1 border-t border-gray-100" />
                            {userClusters.map(uc => (
                              <SelectItem key={uc.key} value={uc.key}>{uc.label}</SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsAddColumnDialogOpen(false);
                    setNewColumnName('');
                    setNewColumnType('text');
                    setNewColumnCategories([]);
                    setCategoryInput('');
                    setNewColumnCluster('custom');
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveCustomColumn} 
                    disabled={
                      !newColumnName.trim() || 
                      (newColumnType === 'categorical' && newColumnCategories.length === 0)
                    }
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Column
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Custom Column Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Custom Column</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this column? All data associated with this column will be permanently removed.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDeleteConfirmOpen(false);
                      setColumnToDelete(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={confirmDeleteCustomColumn}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Column
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setHiddenEmployeeIds(prev => [...new Set([...prev, ...selectedEmployees])]);
                setShowOnlyIds(null);
                setSelectedEmployees([]);
              }}
            >
              <X className="w-3.5 h-3.5" />
              Hide
            </Button>
            {/* Show Only Selected */}
            <Button
              className="flex items-center gap-2 rounded-full text-sm"
              style={{ backgroundColor: '#016699' }}
              onClick={() => {
                setShowOnlyIds([...selectedEmployees]);
                setHiddenEmployeeIds([]);
                setSelectedEmployees([]);
              }}
            >
              <Users className="w-3.5 h-3.5" />
              Show Only
            </Button>
          </div>
        </div>
      )}

      {/* Reset bar — shown when Hide or Show Only is active */}
      {(hiddenEmployeeIds.length > 0 || showOnlyIds !== null) && selectedEmployees.length === 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 px-6 py-4 flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {showOnlyIds !== null
                ? `Showing ${showOnlyIds.length} of ${employees.length} employees`
                : `${hiddenEmployeeIds.length} employee${hiddenEmployeeIds.length > 1 ? 's' : ''} hidden`}
            </span>
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
                            className="bg-gray-50 p-0 border-r border-gray-300"
                          >
                            <div className="flex items-center w-full min-h-[44px] box-border">
                              <div className="flex items-center justify-center border-r border-gray-200 bg-gray-50 box-border px-1 shrink-0 w-[50px]">
                                <Checkbox
                                  checked={
                                    selectedEmployees.length === employeesWithRanking.length &&
                                    employeesWithRanking.length > 0
                                  }
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedEmployees(employeesWithRanking.map((e) => e.id));
                                    } else {
                                      setSelectedEmployees([]);
                                    }
                                  }}
                                />
                              </div>
                              <div className="flex items-center justify-center bg-gray-50 px-2 py-2 text-center text-xs font-semibold leading-tight text-gray-700 flex-1 border-r border-gray-200 uppercase">
                                Basic Information
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
                            <Checkbox
                              checked={
                                selectedEmployees.length === employeesWithRanking.length &&
                                employeesWithRanking.length > 0
                              }
                              onCheckedChange={(checked) => {
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
                                <span className="uppercase">{category.name}</span>
                                {hasScoreColumn && (() => {
                                  const slotKeyEffective = getEffectiveTotalSlotColumnKey(category, clusterTotalSlotOverride);
                                  const usesAlternate = slotUsesAlternateColumn(category, clusterTotalSlotOverride);
                                  const selectVal = usesAlternate ? slotKeyEffective! : TOTAL_SCORE_SLOT_DEFAULT_VALUE;
                                  return (
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <button
                                          className="inline-flex items-center justify-center w-5 h-5 p-0 hover:bg-gray-200 rounded transition-colors"
                                          type="button"
                                          title={`Configure ${category.name} total score`}
                                        >
                                          <Settings className="w-4 h-4 text-gray-600" />
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-[340px] p-4 z-[110]" align="center" side="bottom">
                                        <div className="space-y-3">
                                          <p className="text-xs font-semibold text-gray-900">{category.name} - Total Score</p>
                                          <p className="text-xs text-gray-600 leading-relaxed">
                                            Pilih salah satu variable di dalam cluster untuk ditampilkan di posisi kolom Total Score (tanpa menduplikasi kolom di grid).
                                          </p>
                                          <Select
                                            value={selectVal}
                                            onValueChange={(val) => {
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
                                          >
                                            <SelectTrigger className="h-9 text-xs">
                                              <SelectValue placeholder="Total Score (default)" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[120]">
                                              <SelectItem value={TOTAL_SCORE_SLOT_DEFAULT_VALUE}>Total Score (default)</SelectItem>
                                              {category.columns.map((colKey) => {
                                                const def = allColumnDefinitions.find((c) => c.key === colKey);
                                                if (!def) return null;
                                                return (
                                                  <SelectItem key={colKey} value={colKey}>
                                                    {def.label}
                                                  </SelectItem>
                                                );
                                              })}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  );
                                })()}
                              </div>
                            </th>
                          );
                        }
                      });

                      return result;
                    })()}
                    
                    <th 
                      className="sticky right-0 z-[62] bg-gray-50 px-4 py-2 text-center min-w-[130px] w-[130px]"
                      rowSpan={2}
                      style={{ top: 0 }}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SafeDiv 
                            className="flex items-center justify-center gap-1 cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                            onClick={() => handleSort('ranking')}
                          >
                            <span className="text-sm font-medium text-gray-700">Ranking</span>
                            <Info className="w-3 h-3 text-[#016699] opacity-60" />
                            {sortField === 'ranking' && (
                              sortDirection === 'asc' ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              )
                            )}
                          </SafeDiv>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="left" 
                          className="max-w-sm p-4 bg-gray-900 text-white"
                          sideOffset={5}
                        >
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
                        </TooltipContent>
                      </Tooltip>
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
                                      <span>{col.label}</span>
                                      {sortField === 'name' && (
                                        sortDirection === 'asc'
                                          ? <ArrowUp className="w-3 h-3 text-gray-500" />
                                          : <ArrowDown className="w-3 h-3 text-gray-500" />
                                      )}
                                    </div>
                                    <Popover open={employeeHeaderMenuOpen} onOpenChange={setEmployeeHeaderMenuOpen}>
                                      <PopoverTrigger asChild>
                                        <button
                                          className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200"
                                          onClick={e => e.stopPropagation()}
                                        >
                                          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent
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
                                      </PopoverContent>
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
                                    {col.label}
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
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <SafeDiv
                                    className="flex items-center justify-start gap-1 cursor-pointer hover:bg-gray-100 rounded px-0 py-1"
                                    onClick={() => handleSort(slotKey as SortField)}
                                  >
                                    <span>{headerLabel}</span>
                                    <Info className="w-3 h-3 text-[#016699] opacity-60" />
                                    {sortField === slotKey && (
                                      sortDirection === 'asc' ? (
                                        <ArrowUp className="w-4 h-4" />
                                      ) : (
                                        <ArrowDown className="w-4 h-4" />
                                      )
                                    )}
                                  </SafeDiv>
                                </TooltipTrigger>
                                <TooltipContent 
                                  side="top" 
                                  className="max-w-xs p-3 bg-gray-900 text-white"
                                  sideOffset={5}
                                >
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
                                          Nilai rata-rata dari <strong className="text-white">{visibleVarsInCategory.length} variable</strong> yang terlihat:
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
                                </TooltipContent>
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
                              {col.label}
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
                            <span className="text-xs font-semibold text-gray-700">Weightage</span>
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
                              <span className="text-xs text-gray-400">-</span>
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
                            <span className="text-xs font-semibold text-gray-700">Weightage</span>
                          </th>
                        );
                      }

                      // Check if column can have weight (only numeric columns)
                      const canHaveWeight = (key: string): boolean => {
                        // Typed numeric columns
                        const numericTypedColumns = new Set([
                          'performanceRating', 'potentialRating', 'readinessLevel',
                          'timeInRole', 'engagementScore', 'iqScore', 'salary',
                          'leadership', 'communication', 'problemSolving', 'teamwork', 'adaptability',
                          'strategicThinking', 'decisionMaking', 'innovation', 'analyticalSkills', 'accountability',
                          'competencyScore', 'commitmentScore', 'contributionScore', 'aspectScore',
                        ]);
                        if (numericTypedColumns.has(key)) return true;

                        // CSV columns — numeric only if cluster is aspect/commitment/contribution/potency
                        if (key.startsWith('csv:')) {
                          const colDef = allColumnDefinitions.find(c => String(c.key) === key);
                          const numericClusters = new Set(['aspect', 'commitment', 'contribution', 'potency', 'readiness']);
                          return colDef ? numericClusters.has(colDef.cluster as string) : false;
                        }

                        // Custom columns — only numerical or like-dislike type
                        const customCol = customColumns.find(col => String(col.key) === key);
                        if (customCol) {
                          return customCol.customType === 'numerical' || (customCol.customType as string) === 'like-dislike';
                        }

                        return false;
                      };

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
                            {canHaveWeight(col.key) ? (
                              <Input
                                type="number"
                                min="1"
                                step="1"
                                value={columnWeights[col.key] ?? 1}
                                onChange={(e) => {
                                  const value = Math.max(1, parseFloat(e.target.value) || 1);
                                  setColumnWeights((prev) => ({
                                    ...prev,
                                    [col.key]: value
                                  }));
                                }}
                                className="w-16 h-8 text-left text-sm font-medium border-gray-300 rounded-full px-2"
                                style={{ backgroundColor: 'white' }}
                              />
                            ) : (
                              <Input
                                type="number"
                                value={0}
                                disabled
                                className="w-16 h-8 text-left text-sm font-medium rounded-full px-2 cursor-not-allowed opacity-40"
                                style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
                              />
                            )}
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
                                  {canHaveWeight(col.key) ? (
                                    <Input
                                      type="number"
                                      min="1"
                                      step="1"
                                      value={columnWeights[col.key] ?? 1}
                                      onChange={(e) => {
                                        const value = Math.max(1, parseFloat(e.target.value) || 1);
                                        setColumnWeights((prev) => ({
                                          ...prev,
                                          [col.key]: value
                                        }));
                                      }}
                                      className="w-16 h-8 text-left text-sm font-medium border-gray-300 rounded-full px-2"
                                      style={{ backgroundColor: 'white' }}
                                    />
                                  ) : (
                                    <Input
                                      type="number"
                                      value={0}
                                      disabled
                                      className="w-16 h-8 text-left text-sm font-medium rounded-full px-2 cursor-not-allowed opacity-40"
                                      style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
                                    />
                                  )}
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
                                <Input
                                  type="number"
                                  min="1"
                                  step="1"
                                  value={columnWeights[category.totalScoreKey] ?? 1}
                                  onChange={(e) => {
                                    const value = Math.max(1, parseFloat(e.target.value) || 1);
                                    setColumnWeights((prev) => ({
                                      ...prev,
                                      [category.totalScoreKey]: value
                                    }));
                                  }}
                                  className="w-16 h-8 text-left text-sm font-medium border-gray-300 rounded-full px-2"
                                  style={{ backgroundColor: 'white' }}
                                />
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
                    
                    {/* Ranking Column Weight */}
                    <th 
                      className="sticky right-0 z-[66] px-4 py-2"
                      style={{ backgroundColor: '#F0F8FF', top: theadStickyTops.row3 }}
                    >
                      <span className="text-xs text-gray-400">-</span>
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
                        <Checkbox
                          checked={selectedEmployees.includes(empWithAll.id)}
                          onCheckedChange={() => toggleEmployeeSelection(empWithAll.id)}
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
                                    <span className="text-xs font-bold text-gray-700">
                                      {empWithAll[category.totalScoreKey as keyof typeof empWithAll]}
                                    </span>
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
                        className="sticky right-0 z-[56] bg-white px-4 py-3 min-w-[130px] w-[130px]"
                        style={{ top: theadStickyTops.row3 }}
                      >
                        {(() => {
                          const missingCols = getMissingWeightedColumns(empWithAll);
                          const hasIncomplete = missingCols.length > 0;
                          return (
                            <>
                              <div className="flex items-center justify-center gap-1.5">
                                <span className="text-sm font-bold text-gray-700">
                                  {empWithAll.score.toFixed(1)}
                                </span>
                                {hasIncomplete && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-help flex items-center">
                                        <AlertCircle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="left" className="max-w-[220px]">
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
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                              <div className="text-center mt-1">
                                <span className="text-xs text-gray-500">
                                  Ranking: {empWithAll.ranking}
                                </span>
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
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent className="w-[800px] sm:max-w-[800px] max-w-[92vw] max-h-[85vh] overflow-y-auto overflow-x-hidden" style={{ fontFamily: '"Open Sans", sans-serif' }}>
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-bold text-[#58595b]">Filter</DialogTitle>
            <DialogDescription className="sr-only">
              Add and configure filter conditions to narrow down employee results
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">

            {/* Match Mode Selector */}
            <div className="flex items-center gap-2 text-xs text-[#495057]">
              <span>Meeting</span>
              <Select value={matchMode} onValueChange={(value: MatchMode) => setMatchMode(value)}>
                <SelectTrigger className="w-[80px] h-7 text-xs bg-white rounded-[16px] border-[#dee2e6]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="any">Any</SelectItem>
                </SelectContent>
              </Select>
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
                    value={condition.field || ''}
                    onValueChange={(value) => {
                      const fieldInfo = fieldTypeMap[value];
                      updateFilterCondition(condition.id, {
                        field: value,
                        fieldType: fieldInfo.type,
                        selectedValues: [],
                        operator: null,
                        value: null,
                        value2: null,
                      });
                    }}
                  >
                    <SelectTrigger className="w-full bg-white rounded-[16px] border-[#dee2e6] text-xs">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(fieldTypeMap)
                        .filter(([key]) => {
                          // 'employees' is always available regardless of visible columns
                          if (key !== 'employees' && !visibleColumns.has(key)) return false;
                          // Hide fields that are already used in other conditions
                          const isUsedInOtherCondition = activeFilterConditions.some(
                            c => c.id !== condition.id && c.field === key
                          );
                          return !isUsedInOtherCondition;
                        })
                        .map(([key, info]) => (
                          <SelectItem key={key} value={key} className="text-xs">
                            {info.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
                                  <span className="text-[10px] font-bold text-[#016699] uppercase">
                                    {val}
                                  </span>
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
                              <span className="text-[#adb5bd]">Select values</span>
                            )}
                          </div>
                          <svg className="w-4 h-4 shrink-0 ml-2" fill="none" viewBox="0 0 9.5 5.5">
                            <path d={svgPaths.p14416700} stroke="#495057" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {getFieldOptions(condition.field).map((option) => (
                          <DropdownMenuCheckboxItem
                            key={option}
                            checked={condition.selectedValues?.includes(option)}
                            onCheckedChange={(checked) => {
                              const currentValues = condition.selectedValues || [];
                              updateFilterCondition(condition.id, {
                                selectedValues: checked
                                  ? [...currentValues, option]
                                  : currentValues.filter((v) => v !== option),
                              });
                            }}
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
                                  <span className="text-[10px] font-bold text-[#016699] uppercase">
                                    {val}
                                  </span>
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
                              <span className="text-[#adb5bd]">Select value</span>
                            )}
                          </div>
                          <svg className="w-4 h-4 shrink-0 ml-2" fill="none" viewBox="0 0 9.5 5.5">
                            <path d={svgPaths.p14416700} stroke="#495057" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        {['Yes', 'No'].map((option) => (
                          <DropdownMenuCheckboxItem
                            key={option}
                            checked={condition.selectedValues?.includes(option)}
                            onCheckedChange={(checked) => {
                              const currentValues = condition.selectedValues || [];
                              updateFilterCondition(condition.id, {
                                selectedValues: checked
                                  ? [...currentValues, option]
                                  : currentValues.filter((v) => v !== option),
                              });
                            }}
                          >
                            {option}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {condition.field === 'employees' && condition.fieldType === 'employee-selector' && (
                    <Popover
                      open={employeeDropdownOpenId === condition.id}
                      onOpenChange={(open) => {
                        setEmployeeDropdownOpenId(open ? condition.id : null);
                        if (!open) setEmployeeFilterSearch('');
                      }}
                    >
                      <PopoverTrigger asChild>
                        <button className="w-full bg-white rounded-[16px] border border-[#dee2e6] px-3 py-2 flex items-center justify-between text-xs min-h-[36px]">
                          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                            {condition.selectedValues && condition.selectedValues.length > 0 ? (
                              mockEmployees
                                .filter((e) => condition.selectedValues!.includes(e.id))
                                .map((emp) => (
                                  <div
                                    key={emp.id}
                                    className="bg-[#e7f5ff] flex gap-1 items-center px-2 py-0.5 rounded-full"
                                  >
                                    <span className="text-[10px] font-bold text-[#016699] truncate max-w-[100px]">
                                      {emp.name}
                                    </span>
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
                              <span className="text-[10px] font-bold text-[#016699]">All Employee</span>
                            )}
                          </div>
                          <svg className="w-4 h-4 shrink-0 ml-2" fill="none" viewBox="0 0 9.5 5.5">
                            <path d={svgPaths.p14416700} stroke="#495057" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
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
                            className="w-full text-xs text-[#495057] outline-none placeholder-[#adb5bd] bg-transparent font-[Open_Sans,sans-serif]"
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
                              <Checkbox
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
                                  <Checkbox checked={isSelected} className="pointer-events-none" />
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
                            <span className="text-xs font-bold text-[#016699]">
                              {condition.selectedValues.length} selected
                            </span>
                            <button
                              onClick={() => updateFilterCondition(condition.id, { selectedValues: [] })}
                              className="text-xs text-[#de350b] hover:underline"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  )}

                  {condition.field && condition.fieldType === 'numerical' && (
                    <div className="flex gap-2">
                      {/* Operator Selector */}
                      <div className="w-auto">
                        <Select
                          value={condition.operator || ''}
                          onValueChange={(value: FilterOperator) =>
                            updateFilterCondition(condition.id, { operator: value })
                          }
                        >
                          <SelectTrigger className="w-16 bg-white rounded-[16px] border-[#dee2e6] text-xs h-9 m-[0px] p-[16px]">
                            <div className="flex items-center gap-2">
                              {condition.operator === '=' && (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 10.8333 4.16667">
                                  <path d={svgPaths.p91a7370} stroke="#495057" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                </svg>
                              )}
                              <SelectValue placeholder="≥" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value=">">&gt;</SelectItem>
                            <SelectItem value=">=">&ge;</SelectItem>
                            <SelectItem value="<">&lt;</SelectItem>
                            <SelectItem value="<=">&le;</SelectItem>
                            <SelectItem value="=">=</SelectItem>
                            <SelectItem value="between">Between</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Value Input */}
                      <Input
                        type="number"
                        placeholder="Value"
                        value={condition.value ?? ''}
                        onChange={(e) =>
                          updateFilterCondition(condition.id, {
                            value: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                        className="flex-1 text-xs h-9 rounded-[16px] border-[#dee2e6]"
                      />

                      {/* Value 2 for Between */}
                      {condition.operator === 'between' && (
                        <Input
                          type="number"
                          placeholder="Value 2"
                          value={condition.value2 ?? ''}
                          onChange={(e) =>
                            updateFilterCondition(condition.id, {
                              value2: e.target.value ? Number(e.target.value) : null,
                            })
                          }
                          className="flex-1 text-xs h-9 rounded-[16px] border-[#dee2e6]"
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
                  <X className="w-5 h-5" style={{ color: '#000000', strokeWidth: 2.5 }} />
                </button>
              </div>
            ))}

            {/* Add Condition Button */}
            <button
              onClick={addFilterCondition}
              className="flex items-center gap-2 px-3 py-2 text-[#016699] hover:bg-gray-50 rounded-[28px] transition-colors"
            >
              <Plus className="w-5 h-5" style={{ color: '#016699' }} />
              <span className="text-sm font-bold">Add Condition</span>
            </button>

            {/* Divider */}
            <div className="h-px bg-[#dee2e6] w-full" />

            {/* Footer — Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsFilterDialogOpen(false)}
                className="px-3 py-2 border border-[#016699] rounded-[28px] text-[#016699] text-sm font-bold w-[80px] hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Avenir, "Avenir Next", sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFilterDialogOpen(false)}
                className="px-3 py-2 bg-[#016699] rounded-[28px] text-white text-sm font-bold w-[80px] hover:bg-[#014d73] transition-colors"
                style={{ fontFamily: 'Avenir, "Avenir Next", sans-serif' }}
              >
                Apply
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


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