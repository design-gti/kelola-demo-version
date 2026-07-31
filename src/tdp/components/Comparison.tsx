// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { Employee } from '../data/mockEmployees';
import { loadEmployeeDraftEmployees } from '../data/employeeDraft';
import { CSV_RAW_HEADERS } from '../data/tdpEmployees';
import { ColumnConfig } from '../data/columnDefinitions';
import { getProfileUrl } from '../data/profileLinks';
import { Pagination } from '@mantine/core';
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
import { Button } from './ui/button';
import { Input } from './ui/input';
import VisibleColumnsDialog from './VisibleColumnsDialog';
import { Columns3 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Shared visible-columns storage key (must match TableScreener)
// ---------------------------------------------------------------------------
const VISIBLE_COLUMNS_STORAGE_KEY = 'visibleColumns.v8';

// Basic-info column keys — always shown in the card header; skip in the aspect section.
const BASIC_KEYS = new Set(['name', 'role', 'department', 'level']);

// ---------------------------------------------------------------------------
// Duplicate of TableScreener helpers (kept in sync) to avoid cross-component
// import cycles.  These derive column metadata from raw CSV headers.
// ---------------------------------------------------------------------------
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
  'Shown in TDP', 'Photo URL',
  // Aggregate typed columns — superseded by cluster averages
  'IQ', 'Capability',
]);

function clusterFromCsvHeader(h: string): ColumnConfig['cluster'] | undefined {
  if (h.startsWith('[KOMPETENSI]')) return 'aspect';
  if (h.startsWith('[ENGAGEMENT]')) return 'commitment' as ColumnConfig['cluster'];
  if (h.startsWith('[LEADERSHIP PROFILE]')) return 'contribution' as ColumnConfig['cluster'];
  if (h === 'Capability' || h === 'IQ') return 'competency' as ColumnConfig['cluster'];
  if (h === 'Commitment') return 'commitment' as ColumnConfig['cluster'];
  if (h === 'Contribution' || h === 'Performance') return 'contribution' as ColumnConfig['cluster'];
  if (h === 'Score') return 'potency' as ColumnConfig['cluster'];
  if (h === 'Readiness') return 'readiness' as ColumnConfig['cluster'];
  if (h.startsWith('[LEADERSHIP STYLE]')) return 'leadershipStyle' as ColumnConfig['cluster'];
  return undefined;
}

function labelFromCsvHeader(h: string): string {
  return h.replace(/^\[[^\]]+\]\s*/, '').trim() || h;
}

// Typed columns (mirrors TableScreener typedColumnDefinitions)
const typedColumnDefs: ColumnConfig[] = [
  { key: 'name',             label: 'Employee',                             sortable: true, defaultVisible: true },
  { key: 'role',             label: 'Position',                             sortable: true, defaultVisible: true },
  { key: 'department',       label: 'Tim',                                  sortable: true, defaultVisible: false },
  { key: 'level',            label: 'Level',                                sortable: true, defaultVisible: false },
  { key: 'adaptability',     label: 'Agility and Adaptability',             sortable: true, defaultVisible: true,  cluster: 'aspect' },
  { key: 'teamwork',         label: 'Customer Focus',                       sortable: true, defaultVisible: true,  cluster: 'aspect' },
  { key: 'decisionMaking',   label: 'Building Strategic Partnership',       sortable: true, defaultVisible: true,  cluster: 'aspect' },
  { key: 'innovation',       label: 'Developing Organizational Capabilities', sortable: true, defaultVisible: true, cluster: 'aspect' },
  { key: 'communication',    label: 'Optimizing Work Process',              sortable: true, defaultVisible: true,  cluster: 'aspect' },
  { key: 'leadership',       label: 'Driving Execution',                    sortable: true, defaultVisible: true,  cluster: 'aspect' },
  { key: 'problemSolving',   label: 'Leading Change',                       sortable: true, defaultVisible: true,  cluster: 'aspect' },
  { key: 'analyticalSkills', label: 'Strategic Orientation',                sortable: true, defaultVisible: true,  cluster: 'aspect' },
  { key: 'competencyMatch',  label: 'Competency Match',                     sortable: true, defaultVisible: true },
  { key: 'engagementScore',  label: 'Engagement',                           sortable: true, defaultVisible: false },
  { key: 'performanceRating',label: 'Performance',                          sortable: true, defaultVisible: true },
  { key: 'potentialRating',  label: 'Score',                                sortable: true, defaultVisible: false },
];

const autoCsvColumnDefs: ColumnConfig[] = CSV_RAW_HEADERS
  .filter((h) => h && !COVERED_CSV_HEADERS.has(h))
  .map((h) => ({
    key: `csv:${h}` as ColumnConfig['key'],
    label: labelFromCsvHeader(h),
    sortable: true,
    defaultVisible: h.startsWith('[LEADERSHIP STYLE]'),
    cluster: clusterFromCsvHeader(h),
  }));

/** All column definitions available to both Table and Compare views. */
const allCompareColumnDefs: ColumnConfig[] = [...typedColumnDefs, ...autoCsvColumnDefs];

// Derive display names for internal cluster IDs from CSV bracket prefixes
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

// Friendly fallback labels for typed clusters not covered by CSV bracket prefixes
const CLUSTER_FALLBACK_LABELS: Record<string, string> = {
  aspect: 'Capability',
  competency: 'Capability',
  commitment: 'Commitment',
  contribution: 'Contribution',
  potency: 'Potensi',
  readiness: 'Readiness',
  leadershipStyle: 'Leadership Style',
};

function clusterDisplayName(cluster: string): string {
  return CSV_CLUSTER_NAMES[cluster] ?? CLUSTER_FALLBACK_LABELS[cluster] ?? cluster.toUpperCase();
}

// Stable order for cluster sections in the Compare card
const CLUSTER_ORDER = ['aspect', 'commitment', 'contribution', 'potency', 'readiness', 'leadershipStyle'];

// ---------------------------------------------------------------------------
// Helpers to read a column value from an Employee record
// ---------------------------------------------------------------------------
function getColValue(col: ColumnConfig, employee: Employee): number | string | null {
  const k = String(col.key);
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
  character: string;
} {
  const fields = (employee as any).csvFields as Record<string, string> | undefined ?? {};

  // Capability = avg of [KOMPETENSI] fields (1–5 scale → ×20 → 0–100)
  const kompetensiVals = Object.entries(fields)
    .filter(([k]) => k.startsWith('[KOMPETENSI]'))
    .map(([, v]) => parseFloat(v))
    .filter((n) => !isNaN(n));
  const capability = kompetensiVals.length > 0
    ? Math.round((kompetensiVals.reduce((s, v) => s + v, 0) / kompetensiVals.length) * 20)
    : 0;

  // Commitment = avg of [ENGAGEMENT] fields (exclude presen_kecocokan/hasil_rekomendasi)
  const heroesVals = Object.entries(fields)
    .filter(([k]) => k.startsWith('[ENGAGEMENT]') &&
      k !== '[ENGAGEMENT] presen_kecocokan' && k !== '[ENGAGEMENT] hasil_rekomendasi')
    .map(([, v]) => parseFloat(v))
    .filter((n) => !isNaN(n));
  const commitment = heroesVals.length > 0
    ? Math.round((heroesVals.reduce((s, v) => s + v, 0) / heroesVals.length) * 20)
    : 0;

  // Character = Leadership Style string from [LEADERSHIP STYLE] cluster
  const lsStyle = fields['[LEADERSHIP STYLE] Leadership Style']?.trim();
  const lsSocial = fields['[LEADERSHIP STYLE] Social Style']?.trim();
  const character = (lsStyle && lsStyle !== '#N/A' ? lsStyle : '')
    || (lsSocial && lsSocial !== '#N/A' ? lsSocial : '')
    || '—';

  return { capability, commitment, character };
}

// ---------------------------------------------------------------------------
// Rating boxes: filled squares up to value (1-5 scale)
// ---------------------------------------------------------------------------
const RatingBoxes = ({
  score,
  maxScore = 5,
  accentColor = '#016699',
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

// No-data indicator — consistent orange chip used across Table and Compare
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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface ComparisonProps {
  onToolbarRender?: (buttons: React.ReactNode) => void;
  pinnedIds?: string[];
  onPinnedIdsChange?: (ids: string[]) => void;
}

// pid = canonical p-id from the raw CSV row, used to deep-link into /iprofile
const getIProfilePid = (emp: Employee) =>
  (emp.csvFields?.['Employee ID'] || '').trim()
    || ('p' + String(emp.id).replace(/\D/g, '').slice(-2).padStart(2, '0'));

export default function Comparison({ onToolbarRender, pinnedIds: pinnedIdsProp, onPinnedIdsChange }: ComparisonProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [comparisonEmployees, setComparisonEmployees] = useState<Employee[]>([]);
  const [compareSearch, setCompareSearch] = useState('');
  const allEmployees = useMemo(() => loadEmployeeDraftEmployees(), []);

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

  // Pagination
  const CARDS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(0);

  // Visible columns — read from localStorage (shared with Table view)
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(VISIBLE_COLUMNS_STORAGE_KEY);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) {
          const validColumnsSet = new Set<string>(arr as string[]);
          // Merge in newly-added defaultVisible columns (e.g. LEADERSHIP STYLE) that weren't in old saved state
          const defaultVisible = new Set(allCompareColumnDefs.filter(c => c.defaultVisible).map(c => String(c.key)));
          defaultVisible.forEach(k => { if (!validColumnsSet.has(k)) validColumnsSet.add(k); });
          return validColumnsSet;
        }
      }
    } catch {}
    // Fallback: default visible columns
    return new Set(allCompareColumnDefs.filter(c => c.defaultVisible).map(c => String(c.key)));
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

  // Push Columns button into the shared toolbar slot
  useEffect(() => {
    if (!onToolbarRender) return;
    onToolbarRender(
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 rounded-full"
        style={{ fontWeight: 700 }}
        onClick={() => setIsColumnsDialogOpen(true)}
      >
        <Columns3 className="w-4 h-4" style={{ color: '#016699' }} />
        Data Visibility
      </Button>
    );
    return () => onToolbarRender(null);
  }, [onToolbarRender]);

  // Columns to show in cluster accordion sections: all visible non-basic columns
  // — includes both typed columns (adaptability, leadership, etc.) AND csv: columns
  // — mirrors exactly what is visible in the Table
  const visibleAspectCols = useMemo(() =>
    allCompareColumnDefs.filter(col => {
      const k = String(col.key);
      if (BASIC_KEYS.has(k)) return false; // skip name, role, department, level
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

  // Sticky bar: shows when the HAV banner top reaches the top of the viewport.
  // Uses scroll listener on the scrolling ancestor (not IntersectionObserver, which
  // requires the viewport to scroll — but Root.tsx uses an inner overflow container).
  const [showStickyBar, setShowStickyBar] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollListenerCleanupRef = useRef<(() => void) | null>(null);

  // Floating pagination: always visible, no need to scroll first.
  const showFloatingPagination = true;

  const setSentinel = (el: HTMLDivElement | null) => {
    // Clean up previous listener
    if (scrollListenerCleanupRef.current) {
      scrollListenerCleanupRef.current();
      scrollListenerCleanupRef.current = null;
    }
    sentinelRef.current = el;
    if (!el) return;

    // Use capture-phase listener on document to catch scroll events from
    // ANY scrolling ancestor (Root.tsx's overflow container, etc.)
    const check = () => {
      if (!sentinelRef.current) return;
      const rect = sentinelRef.current.getBoundingClientRect();
      setShowStickyBar(rect.top <= 0);
    };

    document.addEventListener('scroll', check, { capture: true, passive: true });

    scrollListenerCleanupRef.current = () =>
      document.removeEventListener('scroll', check, { capture: true });
  };

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

  // Sync employees from Table's active filter (via localStorage) — always mirror Table
  useEffect(() => {
    let baseEmployees = allEmployees;
    try {
      const saved = localStorage.getItem('tableVisibleEmployeeIds');
      if (saved) {
        const tableIds: string[] = JSON.parse(saved);
        const ordered = tableIds
          .map(id => allEmployees.find(e => e.id === id))
          .filter(Boolean) as Employee[];
        if (ordered.length > 0) baseEmployees = ordered;
      }
    } catch {}
    setComparisonEmployees(baseEmployees);
    setCardOrder(baseEmployees.map(e => e.id));
  }, [allEmployees]);

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


  // Compute ordered display list: apply local hide/show → sort by ranking → search
  const displayEmployees = useMemo(() => {
    // Apply local hide/show filters
    let base = comparisonEmployees;
    if (localShowOnlyIds !== null) {
      base = base.filter(e => localShowOnlyIds.has(e.id));
    } else if (localHiddenIds.size > 0) {
      base = base.filter(e => !localHiddenIds.has(e.id));
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
  }, [comparisonEmployees, pinnedIds, employeeRankings, compareSearch, localHiddenIds, localShowOnlyIds]);

  // Pagination: slice the display list into pages of CARDS_PER_PAGE
  const totalPages = Math.max(1, Math.ceil(displayEmployees.length / CARDS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages - 1);
  const pagedEmployees = useMemo(() => {
    const start = safePage * CARDS_PER_PAGE;
    return displayEmployees.slice(start, start + CARDS_PER_PAGE);
  }, [displayEmployees, safePage]);

  // Clamp page when employees change
  useEffect(() => {
    if (currentPage >= totalPages) setCurrentPage(Math.max(0, totalPages - 1));
  }, [totalPages, currentPage]);

  // Slide direction for the page-change carousel animation
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next');
  const goToPage = (nextIndex: number) => {
    setSlideDir(nextIndex > safePage ? 'next' : 'prev');
    setCurrentPage(nextIndex);
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
          <h2 className="text-lg font-bold mb-2" style={{ color: '#495057', fontFamily: 'Avenir, sans-serif' }}>
            No Employees to Compare
          </h2>
          <p className="text-sm" style={{ color: '#868e96' }}>
            Gunakan <span className="font-bold" style={{ color: '#016699' }}>Filters</span> untuk memilih karyawan yang ingin dibandingkan.
          </p>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-white border-b border-[#dee2e6] shrink-0">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, position, or team..."
              value={compareSearch}
              onChange={(e) => setCompareSearch(e.target.value)}
              className="pl-10 rounded-full bg-gray-50 border border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Sticky employee name bar — fixed to viewport so it doesn't scroll away */}
      {displayEmployees.length > 0 && (
        <div
          className="fixed right-0 z-[9999] bg-white border-b border-gray-200 px-6 py-2"
          style={{
            top: 0,
            left: 'var(--sidebar-w, 220px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transform: showStickyBar ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.25s ease',
            pointerEvents: showStickyBar ? 'auto' : 'none',
          }}
        >
          <div className="grid grid-cols-4 gap-[10px]">
            {pagedEmployees.map(emp => {
              const isPinned = pinnedIds.includes(emp.id);
              return (
                <div key={emp.id} className="flex items-center gap-2 min-w-0">
                  <img
                    src={emp.photo}
                    alt={emp.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                  {/* Fixed-width name block so it truncates neatly */}
                  <div className="min-w-0 flex-1" style={{ maxWidth: 'calc(100% - 64px)' }}>
                    <div
                      className="text-sm font-semibold text-gray-900 truncate"
                      style={{ maxWidth: '100%' }}
                    >
                      {emp.name}
                    </div>
                    <div
                      className="text-xs text-gray-500 truncate"
                      style={{ maxWidth: '100%' }}
                    >
                      {emp.role}
                    </div>
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
                      style={{ color: isPinned ? '#016699' : '#9ca3af' }}
                      fill={isPinned ? '#016699' : 'none'}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating action bar — appears when ≥1 checkbox checked */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 px-2 py-2 flex items-center gap-3">
            <span className="font-medium text-gray-700 px-2" style={{ fontSize: 12 }}>
              {selectedIds.size} selected
            </span>
            <div className="w-px h-6 bg-gray-300" />
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={handleHideSelected}
            >
              <X className="w-3.5 h-3.5" />
              Hide
            </Button>
            <Button
              className="flex items-center gap-2 rounded-full text-sm"
              style={{ backgroundColor: '#016699' }}
              onClick={handleShowOnly}
            >
              <Users className="w-3.5 h-3.5" />
              Show Only
            </Button>
          </div>
        </div>
      )}

      {/* Cards paginated grid */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-auto p-6">
        {/* ----------------------------------------------------------------
            Row-based layout: structure computed once, values per employee.
            Each "row" spans all 4 columns so items align perfectly.
            Column-strip divs (absolute) provide the card visual.
        ---------------------------------------------------------------- */}
        {(() => {
          // Compute cluster structure once (shared across all cards)
          const colByKey = Object.fromEntries(visibleAspectCols.map(c => [String(c.key), c]));
          const orderedColDefs = aspectOrder.filter(k => k in colByKey).map(k => colByKey[k]);

          const groupedClusters: { clusterKey: string; label: string; colDefs: ColumnConfig[] }[] = [];
          const seenClusters = new Set<string>();
          // Use user-reordered clusterOrder, then append any new keys not yet in it
          const allClusterKeys = orderedColDefs.map(col => (col.cluster as string | undefined) ?? '__none__');
          const userOrderedKeys = [
            ...clusterOrder,
            ...allClusterKeys.filter(k => !clusterOrder.includes(k)),
          ];
          userOrderedKeys.forEach(clusterKey => {
            if (seenClusters.has(clusterKey)) return;
            if (clusterKey === 'competency') return; // Capability cluster excluded
            seenClusters.add(clusterKey);
            const cols = orderedColDefs.filter(col =>
              ((col.cluster as string | undefined) ?? '__none__') === clusterKey
            );
            if (cols.length === 0) return;
            groupedClusters.push({
              clusterKey,
              label: clusterKey === '__none__' ? 'Other' : clusterDisplayName(clusterKey),
              colDefs: cols,
            });
          });

          const FIXED_COLS = 4; // Always 4 columns — empty slots stay visible
          const gridStyle = { gridTemplateColumns: `repeat(${FIXED_COLS}, minmax(0, 1fr))` };

          return (
            <div
              key={safePage}
              className={`relative animate-in duration-300 ease-out fill-mode-both ${
                slideDir === 'next' ? 'slide-in-from-right-12' : 'slide-in-from-left-12'
              }`}
              style={{ willChange: 'transform', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
            >
              {/* Column-strip backgrounds — card visual per column */}
              <div
                className="absolute inset-0 grid pointer-events-none"
                style={{ ...gridStyle, columnGap: '10px', rowGap: '8px' }}
              >
                {pagedEmployees.map(emp => {
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
                        outline: isDropTarget ? '2px dashed #016699' : isPinned ? '2px solid #016699' : 'none',
                      }}
                    />
                  );
                })}
                {/* Empty slot placeholders to fill remaining columns */}
                {Array.from({ length: FIXED_COLS - pagedEmployees.length }).map((_, i) => (
                  <div key={`empty-bg-${i}`} className="rounded-[16px]"
                    style={{ background: '#f8f9fa', border: '2px dashed #dee2e6' }} />
                ))}
              </div>

              {/* Content rows grid */}
              <div className="relative grid" style={{ ...gridStyle, columnGap: '10px', rowGap: '8px' }}>

                {/* ── ROW: Card header (photo / HAV / 3C / riskHeat) ── */}
                {pagedEmployees.map((employee, index) => {
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
                            border: `2px solid ${selectedIds.has(employee.id) ? '#016699' : 'rgba(255,255,255,0.8)'}`,
                            background: selectedIds.has(employee.id) ? '#016699' : 'rgba(0,0,0,0.25)',
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
                            <span className="text-[10px] font-semibold bg-[#016699] text-white px-2 py-0.5 rounded-full">Pinned</span>
                          </div>
                        )}

                        {/* Photo — aspect-square ensures 1:1 ratio at any card width */}
                        <div className="relative aspect-square overflow-hidden">
                          {/* Layer 1 — background biru, 65% tinggi dari bawah */}
                          <div className="absolute bottom-0 left-0 right-0" style={{ height: '65%', background: '#197fc9', borderRadius: '8px 164px 0 0' }} />

                          {/* Layer 2 — foto */}
                          <img src={employee.photo} alt={employee.name} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/avatars/male.jpg'; e.currentTarget.onerror = null; }} />

                          {/* Layer 3 — gradient hitam */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                          <div className="absolute bottom-6 left-6 right-6">
                            <h2
                              className="text-base font-bold text-white mb-0.5 truncate hover:underline cursor-pointer"
                              onClick={(e) => { e.stopPropagation(); window.location.href = `/iprofile?id=${encodeURIComponent(getIProfilePid(employee))}`; }}
                              title="Go to iProfile"
                            >
                              {employee.name}
                            </h2>
                            <p className="text-white/80 text-xs font-medium truncate">{employee.role}</p>
                            {employee.usia && <p className="text-white/80 text-sm mt-1">{employee.usia} Tahun</p>}
                          </div>
                          {/* Sentinel: sticky bar fires when photo bottom leaves viewport */}
                          {index === 0 && <div ref={setSentinel} className="absolute bottom-0 left-0 w-full h-px" />}
                        </div>

                        {/* 3C Cards — 3 columns: Kompetensi | Heroes | Ranking */}
                        <div className="px-4 pt-4 pb-4 flex flex-col gap-2">
                          {/* Row 1: Kompetensi + Heroes + Ranking (3 cols) */}
                          <div className="grid grid-cols-3 gap-2">
                            {/* Kompetensi */}
                            <div className="rounded-[8px] px-3 py-3 text-center"
                              style={{ background: '#fff', boxShadow: '2px 4px 20px 0px #00000012' }}>
                              <div style={{ fontSize: 10, color: '#868e96', fontFamily: '"Open Sans", sans-serif', marginBottom: 4 }}>
                                {CSV_CLUSTER_NAMES['aspect'] ?? 'Kompetensi'}
                              </div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#016699', fontFamily: '"Open Sans", sans-serif', lineHeight: 1.2 }}>
                                {scores3C.capability}
                              </div>
                            </div>
                            {/* Heroes */}
                            <div className="rounded-[8px] px-3 py-3 text-center"
                              style={{ background: '#fff', boxShadow: '2px 4px 20px 0px #00000012' }}>
                              <div style={{ fontSize: 10, color: '#868e96', fontFamily: '"Open Sans", sans-serif', marginBottom: 4 }}>
                                {CSV_CLUSTER_NAMES['commitment'] ?? 'Engagement'}
                              </div>
                              <div style={{ fontSize: 12, fontWeight: 700, color: '#016699', fontFamily: '"Open Sans", sans-serif', lineHeight: 1.2 }}>
                                {scores3C.commitment}
                              </div>
                            </div>
                            {/* Ranking — style C: biru muda + border + angka besar */}
                            <div className="rounded-[8px] px-3 py-3 flex flex-col items-center justify-center"
                              style={{ background: '#f0f8fb', boxShadow: '2px 4px 20px 0px #00000012', border: '1.5px solid #c8e6f0' }}>
                              <div style={{ fontSize: 10, color: '#016699', fontFamily: '"Open Sans", sans-serif', fontWeight: 600, marginBottom: 2 }}>
                                Ranking
                              </div>
                              <div style={{ fontSize: 18, fontWeight: 800, color: '#016699', fontFamily: '"Open Sans", sans-serif', lineHeight: 1 }}>
                                #{employeeRankings.get(employee.id) ?? '—'}
                              </div>
                            </div>
                          </div>

                          {/* Row 2: Leadership Style — full width */}
                          <div className="rounded-[8px] px-3 py-3 text-center"
                            style={{ background: '#fff', boxShadow: '2px 4px 20px 0px #00000012' }}>
                            <div style={{ fontSize: 10, color: '#868e96', fontFamily: '"Open Sans", sans-serif', marginBottom: 4 }}>
                              {CSV_CLUSTER_NAMES['leadershipStyle'] ?? 'Leadership Style'}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#016699', fontFamily: '"Open Sans", sans-serif', lineHeight: 1.3 }}>
                              {scores3C.character || <NoDataChip />}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
                {/* Empty slot cells in header row */}
                {Array.from({ length: FIXED_COLS - pagedEmployees.length }).map((_, i) => (
                  <div key={`empty-header-${i}`} />
                ))}

                {/* ── ROWS: cluster sections (aligned across all columns) ── */}
                {groupedClusters.map(({ clusterKey, label, colDefs }) => {
                  const isClusterDragging = dragClusterId === clusterKey;
                  const isClusterDropTarget = dragOverClusterId === clusterKey && dragClusterId !== clusterKey;
                  return (
                  <React.Fragment key={clusterKey}>
                    {/* Cluster label row — draggable + collapse toggle */}
                    {pagedEmployees.map((emp, empIdx) => (
                      <div
                        key={`cl-${clusterKey}-${emp.id}`}
                        draggable
                        onDragStart={e => handleClusterDragStart(e, clusterKey)}
                        onDragOver={e => handleClusterDragOver(e, clusterKey)}
                        onDrop={e => handleClusterDrop(e, clusterKey)}
                        onDragEnd={() => { setDragClusterId(null); setDragOverClusterId(null); }}
                        className="px-4 pt-3 pb-1"
                        style={{
                          opacity: isClusterDragging ? 0.4 : 1,
                          borderTop: isClusterDropTarget && empIdx === 0
                            ? '2px dashed #016699'
                            : '2px solid transparent',
                          cursor: 'grab',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3 h-3 shrink-0" style={{ color: '#ADB5BD' }} />
                          <span style={{ fontSize: 10, fontWeight: 400, color: '#495057', fontFamily: '"Open Sans", sans-serif', flex: 1 }}>{label}</span>
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
                    ))}
                    {Array.from({ length: FIXED_COLS - pagedEmployees.length }).map((_, i) => (
                      <div key={`cl-${clusterKey}-empty-${i}`} />
                    ))}

                    {/* One row per item — only rendered when cluster is expanded */}
                    {!collapsedClusters.has(clusterKey) && colDefs.map(col => (
                      <React.Fragment key={String(col.key)}>
                        {pagedEmployees.map(emp => {
                          const val = getColValue(col, emp);
                          const itemKey = String(col.key);
                          return (
                            <div
                              key={`item-${itemKey}-${emp.id}`}
                              draggable
                              onDragStart={e => handleAspectDragStart(e, itemKey)}
                              onDragOver={e => handleAspectDragOver(e, itemKey)}
                              onDrop={e => handleAspectDrop(e, itemKey)}
                              onDragEnd={() => { setDragAspectId(null); setDragOverAspectId(null); }}
                              className="px-4 py-0"
                              style={{
                                opacity: isClusterDragging || dragAspectId === itemKey ? 0.4 : 1,
                                borderTop: dragOverAspectId === itemKey && dragAspectId !== itemKey
                                  ? '1px dashed #016699' : '1px solid transparent',
                                cursor: 'grab',
                              }}
                            >
                              <div className="bg-gray-50 rounded-[8px] flex items-center gap-2" style={{ padding: '8px 8px 8px 12px' }}>
                                <GripVertical className="shrink-0" style={{ width: 12, height: 12, color: '#ADB5BD' }} />
                                <div className="flex flex-col" style={{ gap: 2 }}>
                                  <span style={{ fontSize: 10, color: '#ADB5BD', fontFamily: '"Open Sans", sans-serif', lineHeight: 1.2 }}>{col.label}</span>
                                  {val === null ? (
                                    <NoDataChip />
                                  ) : typeof val === 'number' && val <= 5 ? (
                                    <RatingBoxes score={val} maxScore={5} accentColor="#016699" />
                                  ) : typeof val === 'number' ? (
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${Math.min(val, 100)}%`, background: '#016699' }} />
                                      </div>
                                      <span style={{ fontSize: 12, fontWeight: 400, color: '#495057', fontFamily: '"Open Sans", sans-serif' }}>{val}</span>
                                    </div>
                                  ) : (
                                    <span style={{ fontSize: 12, fontWeight: 400, color: '#495057', fontFamily: '"Open Sans", sans-serif', lineHeight: 1.3 }}>{String(val)}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {Array.from({ length: FIXED_COLS - pagedEmployees.length }).map((_, i) => (
                          <div key={`item-${String(col.key)}-empty-${i}`} />
                        ))}
                      </React.Fragment>
                    ))}

                    {/* Bottom padding row for cluster section */}
                    {pagedEmployees.map(emp => (
                      <div key={`cl-end-${clusterKey}-${emp.id}`} className="px-4 pb-2" />
                    ))}
                    {Array.from({ length: FIXED_COLS - pagedEmployees.length }).map((_, i) => (
                      <div key={`cl-end-${clusterKey}-empty-${i}`} />
                    ))}
                  </React.Fragment>
                  );
                })}

                {/* ── ROW: Create IDP (Go to Profile removed — name click already opens iProfile) ── */}
                {pagedEmployees.map(emp => {
                  const btnClass = 'flex-1 text-xs border-[#016699] text-[#016699] hover:bg-[#e7f5ff] hover:text-[#016699]';
                  // Inline fontWeight needed: a global `button { font-weight: ... }` reset in
                  // vismap/styles/globals.css (imported app-wide) beats the DS Button's own
                  // `.font-bold` utility in the cascade. Inline style always wins.
                  const btnStyle = { fontWeight: 700 as const };
                  return (
                    <div key={`actions-${emp.id}`} className="px-4 pb-4 pt-2 flex gap-2">
                      <Button variant="outline" size="sm" className={btnClass} style={btnStyle} onClick={() => { window.location.href = `/idp?page=create-idp-admin.html&name=${encodeURIComponent(emp.name || '')}`; }}>Create IDP</Button>
                    </div>
                  );
                })}

              </div>{/* end content rows grid */}
            </div>
          );
        })()}

        </div> {/* end scroll container */}
      </div> {/* end cards grid wrapper */}

      {/* Floating pagination — fixed at bottom, slides up on scroll-down, down on scroll-up */}
      {totalPages > 1 && (
        <div
          className="fixed left-1/2 z-[9999]"
          style={{
            bottom: 24,
            transform: showFloatingPagination
              ? 'translate(-50%, 0)'
              : 'translate(-50%, calc(100% + 32px))',
            transition: 'transform 0.3s ease',
            pointerEvents: showFloatingPagination ? 'auto' : 'none',
          }}
        >
          <div
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2"
            style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}
          >
            <Pagination
              total={totalPages}
              value={safePage + 1}
              onChange={(p) => goToPage(p - 1)}
              radius="xl"
              size="sm"
              color="#016699"
              getItemProps={() => ({ style: { fontFamily: 'inherit' } })}
            />

            <span className="text-xs text-gray-500 pl-1 pr-1">
              {safePage * CARDS_PER_PAGE + 1}–
              {Math.min((safePage + 1) * CARDS_PER_PAGE, displayEmployees.length)} of {displayEmployees.length}
            </span>
          </div>
        </div>
      )}

      {/* Visible Columns Dialog — shared with Table view */}
      <VisibleColumnsDialog
        open={isColumnsDialogOpen}
        onOpenChange={setIsColumnsDialogOpen}
        visibleColumns={visibleColumns}
        onApply={handleApplyVisibleColumns}
        columnDefinitions={allCompareColumnDefs}
        customColumns={[]}
        onDeleteCustomColumn={() => {}}
        onAddColumn={() => {}}
      />
    </div>
  );
}
