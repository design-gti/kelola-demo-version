// Vismap V3 — sandbox eksplorasi desain, disalin dari V1 (src/vismap/App.tsx)
// pada titik awal yang identik. Lihat docs/vismap-v3.md untuk PRD-nya.
//
// V1 TIDAK BOLEH ikut berubah saat file ini dieksplorasi. Komponen yang masih
// dipakai bersama (EmployeeDetail, TableView, SimulationPanel, modal-modal,
// components/ui/*) diimpor dari ../components — begitu salah satunya perlu
// diubah untuk V3, SALIN dulu ke src/vismap/v3/components/ dengan sufiks V3,
// lalu ubah salinannya. Jangan pernah mengedit aslinya.
//
// Host-nya tetap App.tsx (V1): file itu yang memegang switch versi dan
// merender komponen ini saat V3 dipilih, sama seperti pola V2.
import { useState, useRef, useEffect } from "react";
import OrgChartCardV3 from "./components/OrgChartCardV3";
import EmployeeDetailPanel from "../components/EmployeeDetailPanel";
import SuccessionPanel from "../components/SuccessionPanel";
import SuccessorComparison from "../components/SuccessorComparison";
import EmployeeDetail from "../components/EmployeeDetail";
import IDPCreation from "../components/IDPCreation";
import TableView from "../components/TableView";
import DataEditor from "../components/DataEditor";
import SuccessionRiskModal from "../components/SuccessionRiskModal";
import NeedDevelopModal from "../components/NeedDevelopModal";
import { buildOrgChart, type Employee, type OrgChartNode } from "../data/orgChartData";
import { dataManager } from "../data/dataManager";
import { loadEmployeesFromCanonical } from "../data/canonicalAdapter";
import { ChevronDown, ChevronRight, ZoomIn, ZoomOut, Maximize2, Table as TableIcon, Network, Search, Settings, Filter, Shuffle } from "lucide-react";
import { HEADER_HEIGHT } from "@/components/AppHeader";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import DataVisibilityModal from "../components/DataVisibilityModal";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";
import HeatmapSettings, { type HeatmapConfig } from "../components/HeatmapSettings";
import SimulationPanelV3 from "./components/SimulationPanelV3";
import { buildSimulation, type SimulationActionKind, type SimulationStep, type StepView } from "./simulation";
import ReadinessPill from "../components/ReadinessPill";
import PositionActionMenu, { type SimulationAction } from "./components/PositionActionMenu";
import DevelopmentPanelV3 from "./components/DevelopmentPanelV3";
import { OVERLAYS, toggleOverlay, type OverlayId } from "./overlays";
import { isTalent, teamsOf, tenureOf } from "./employeeFacts";


interface OrgNodeProps {
  employee: OrgChartNode;
  level: number;
  onEmployeeClick: (employee: Employee) => void;
  managerPosition?: string;
  visibleColumns: {
    gender: boolean;
    city: boolean;
    maritalStatus: boolean;
    performance: boolean;
    iq: boolean;
    capability: boolean;
    commitment: boolean;
    contribution: boolean;
  };
  heatmapConfig: HeatmapConfig;
  allEmployees: Employee[];
  /** Overlay yang sedang menyala — mengganti model tab/heatmapMode milik V1. */
  overlays: Set<OverlayId>;
  /** Card position yang sedang dipilih (anchor menu aksi). */
  actionMenuId: string | null;
  /** Posisi yang sedang di-focus lewat aksi Succession (di luar toggle overlay). */
  successionFocusId?: string | null;
  /** Calon suksesor posisi yang di-focus — card employee-nya diberi heatmap kesiapan. */
  focusSuccessorIds?: Set<string>;
  simulationMenuOpen: boolean;
  onPositionClick: (employeeId: string) => void;
  onToggleSimulationMenu: () => void;
  onAction: (kind: 'succession' | 'development' | 'iprofile', employee: Employee) => void;
  onSimulationAction: (action: SimulationAction, employee: Employee) => void;
  highlightedEmployeeId?: string | null;
  isSimulationMode?: boolean;
  simulatedEmployeeIds?: Set<string>;
}

function OrgNode({ employee, level, onEmployeeClick, managerPosition, visibleColumns, heatmapConfig, allEmployees, overlays, actionMenuId, successionFocusId, focusSuccessorIds, simulationMenuOpen, onPositionClick, onToggleSimulationMenu, onAction, onSimulationAction, highlightedEmployeeId, isSimulationMode, simulatedEmployeeIds }: OrgNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Expand all by default
  const hasReports = employee.reports && employee.reports.length > 0;

  // Tinggi kartu diseragamkan lintas node supaya barisnya tetap rata saat
  // Filter Card Data menambah baris data.
  const maxCardHeight = (() => {
    const fieldCount = [
      visibleColumns.gender, visibleColumns.city, visibleColumns.maritalStatus,
      visibleColumns.performance, visibleColumns.iq, visibleColumns.capability,
      visibleColumns.commitment, visibleColumns.contribution,
    ].filter(Boolean).length;
    return 214 + fieldCount * 12;
  })();

  const getReportReadiness = (report: Employee): number => {
    if (report.readinessScore != null) return report.readinessScore;
    const s = report.competencyScore;
    if (s >= 91) return Math.round(s * 0.92);
    if (s >= 76) return Math.round(s * 0.88);
    if (s >= 66) return Math.round(s * 0.80);
    return Math.round(s * 0.72);
  };

  // Overlay Succession Risk — warna frame job position, dihitung dari kesiapan
  // para calon suksesor posisi ini. Logic dan ambangnya dipertahankan sama
  // dengan tab "Succession Risk" di V1 supaya angkanya tidak berubah arti.
  const getSuccessionRiskColor = (): string | null => {
    if (!hasReports) return null;

    const sortedRanges = [...heatmapConfig.readinessScore].sort((a, b) => a.min - b.min);
    const redRange = sortedRanges[0];
    const greenRange = sortedRanges[sortedRanges.length - 1];
    if (!redRange || !greenRange) return null;

    const readiness = employee.reports.map(getReportReadiness);
    const greenCount = readiness.filter(s => s >= greenRange.min && s <= greenRange.max).length;
    const redCount = readiness.filter(s => s >= redRange.min && s <= redRange.max).length;
    const greenPercentage = (greenCount / readiness.length) * 100;

    if (greenPercentage >= 50 || greenCount >= 2) return '#88E113';
    if (greenCount === 0 && redCount > 0) return '#FE0D00';
    return '#F59E02';
  };

  const isVacant = employee.name === '(Vacant)' || !employee.name?.trim();
  const firstName = employee.name?.split(' ')[0] ?? '';
  const hasReadinessData = employee.readinessScore !== undefined && employee.readinessScore !== null;

  const promotionReadinessPercentage = hasReadinessData
    ? (employee.readinessScore as number)
    : getReportReadiness(employee);

  const getTagColor = (percentage: number): string => {
    const ranges = heatmapConfig.readinessScore;
    const hit = ranges.find(r => percentage >= r.min && percentage <= r.max);
    return hit?.color ?? '#6c757d';
  };
  const tagColor = (isVacant || !hasReadinessData) ? '#adb5bd' : getTagColor(promotionReadinessPercentage);

  // Jumlah suksesor yang sudah READY (range tertinggi) — ditampilkan di footer card.
  const readySuccessorsCount = (() => {
    if (!hasReports) return 0;
    const sortedRanges = [...heatmapConfig.readinessScore].sort((a, b) => a.min - b.min);
    const readyRange = sortedRanges[sortedRanges.length - 1];
    if (!readyRange) return 0;
    return employee.reports.filter(r => {
      const score = getReportReadiness(r);
      return score >= readyRange.min && score <= readyRange.max;
    }).length;
  })();

  // ——— Overlay aktif → properti kartu ———
  // Dua sumber yang menyalakan heatmap: toggle global di toolbar, DAN focus
  // suksesi setempat dari aksi "Succession". Focus tidak mengubah toggle.
  const isSuccessionFocus = successionFocusId === employee.id;
  const isFocusSuccessor = !!focusSuccessorIds?.has(employee.id);

  // Saat ada posisi yang di-focus, heatmap Succession Risk EKSKLUSIF milik posisi
  // itu — posisi lain dimatikan meski toggle-nya menyala. Alasannya: focus berarti
  // user sedang membaca suksesi SATU posisi, dan warna di posisi lain hanya
  // menambah derau pada bacaan itu. Di luar focus, toggle yang menentukan.
  const positionHeatmapColor = successionFocusId
    ? (isSuccessionFocus ? getSuccessionRiskColor() : null)
    : (overlays.has('succession-risk') ? getSuccessionRiskColor() : null);

  // Pembagian indikator yang disepakati:
  //   heatmap card employee  → kesiapan terhadap posisi SAAT INI (competency)
  //   pil %Ready to Promote  → kesiapan terhadap posisi DI ATASNYA (succession)
  // Karena itu, calon suksesor pada mode focus TIDAK lagi diberi heatmap card
  // employee (versi sebelumnya begitu), melainkan pil persentase — indikator
  // yang memang mengukur succession readiness.
  const employeeHeatmapScore = !isVacant && overlays.has('need-development')
    ? employee.competencyScore
    : null;
  const showCriticalIcon = overlays.has('critical-position') && !!employee.criticalPosition;
  const showTalentIcon = overlays.has('talent') && isTalent(employee.id);
  // Saat ada posisi yang di-focus, pil persentase EKSKLUSIF milik calon
  // suksesornya — sama seperti heatmap succession risk yang eksklusif milik
  // posisi focus. Di luar focus, toggle yang menentukan.
  const showPromotionTag = level > 0 && (
    successionFocusId ? isFocusSuccessor : overlays.has('ready-to-promote')
  );

  const isMenuOpen = actionMenuId === employee.id;

  return (
    <div className="flex flex-col items-center">
      {/* Overlay %Ready to Promote — pada garis struktur di atas card position */}
      {showPromotionTag && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mb-1 z-20 cursor-help">
                <ReadinessPill
                  percentage={(isVacant || !hasReadinessData) ? null : promotionReadinessPercentage}
                  color={tagColor}
                  showIDPIcon={!!employee.activeIDP && !isVacant}
                  size="md"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-['Open_Sans',_sans-serif]">
                {isVacant ? (
                  <>Posisi <strong>kosong</strong> (belum ada yang mengisi)</>
                ) : !hasReadinessData ? (
                  <>Data kesiapan <strong>{firstName}</strong> belum tersedia</>
                ) : (
                  <>
                    Kesiapan <strong>{firstName}</strong> terhadap posisi <strong>{managerPosition || employee.position}</strong> sebesar <strong>{promotionReadinessPercentage}%</strong>
                    {employee.activeIDP && (
                      <>
                        <br />
                        <span className="text-[#016699] font-bold">Sedang menjalankan IDP</span>
                      </>
                    )}
                  </>
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <div className="flex flex-col items-center gap-2">
        <div
          className="relative"
          style={isSimulationMode && simulatedEmployeeIds?.has(employee.id) ? {
            outline: '2px solid #016699',
            outlineOffset: 4,
            borderRadius: 8,
            background: 'rgba(1,102,153,0.06)',
          } : undefined}
        >
          <OrgChartCardV3
            name={employee.name}
            position={employee.position}
            jobTitle={employee.jobTitle}
            competencyScore={employee.competencyScore}
            successors={allEmployees.filter(e => e.managerId === employee.id).length}
            readySuccessorsCount={readySuccessorsCount}
            imageUrl={employee.imageUrl}
            employeeId={employee.id}
            positionHeatmapColor={positionHeatmapColor}
            employeeHeatmapScore={employeeHeatmapScore}
            employeeHeatmapRanges={heatmapConfig.needDevelop}
            showCriticalIcon={showCriticalIcon}
            showTalentIcon={showTalentIcon}
            teams={teamsOf(employee.id, employee.department)}
            tenure={tenureOf(employee.id)}
            visibleColumns={visibleColumns}
            gender={employee.gender}
            city={employee.city}
            maritalStatus={employee.maritalStatus}
            performance={employee.performance}
            iq={employee.iq}
            capability={employee.capabilityScore}
            commitment={employee.commitmentScore}
            contribution={employee.contributionScore}
            selected={isMenuOpen || isSuccessionFocus}
            highlighted={highlightedEmployeeId === employee.id}
            maxCardHeight={maxCardHeight}
            onClick={() => onPositionClick(employee.id)}
          />

          {/* Menu aksi — muncul saat card position ini dipilih */}
          {isMenuOpen && (
            <PositionActionMenu
              simulationOpen={simulationMenuOpen}
              onToggleSimulation={onToggleSimulationMenu}
              onSuccession={() => onAction('succession', employee)}
              onDevelopment={() => onAction('development', employee)}
              onIProfile={() => onAction('iprofile', employee)}
              onSimulationAction={(action) => onSimulationAction(action, employee)}
            />
          )}

          {/* Expand/Collapse Button */}
          {hasReports && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[rgb(230,230,230)] border-2 border-[#016699] rounded-full p-1 hover:bg-blue-50 transition-colors z-10 text-[15px]"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-[#016699]" />
              ) : (
                <ChevronRight className="w-3 h-3 text-[#016699]" />
              )}
            </button>
          )}
        </div>

        {/* Connector Line from card to children */}
        {hasReports && isExpanded && (
          <div className="w-px bg-[#016699] h-6" />
        )}
      </div>

      {/* Direct Reports */}
      {hasReports && isExpanded && (
        <div className="flex justify-center">
          {employee.reports.map((report, index) => {
            const isOnly = employee.reports.length === 1;
            const isFirst = index === 0;
            const isLast = index === employee.reports.length - 1;
            return (
              <div key={report.id} className="relative flex flex-col items-center px-4">
                {!isOnly && (
                  <>
                    {!isFirst && (
                      <div className="absolute h-px bg-[#016699]" style={{ top: 0, left: 0, right: '50%' }} />
                    )}
                    {!isLast && (
                      <div className="absolute h-px bg-[#016699]" style={{ top: 0, left: '50%', right: 0 }} />
                    )}
                  </>
                )}
                <div className="w-px bg-[#016699] h-6" />
                <OrgNode
                  employee={report}
                  level={level + 1}
                  onEmployeeClick={onEmployeeClick}
                  managerPosition={employee.position}
                  visibleColumns={visibleColumns}
                  heatmapConfig={heatmapConfig}
                  allEmployees={allEmployees}
                  overlays={overlays}
                  actionMenuId={actionMenuId}
                  successionFocusId={successionFocusId}
                  focusSuccessorIds={focusSuccessorIds}
                  simulationMenuOpen={simulationMenuOpen}
                  onPositionClick={onPositionClick}
                  onToggleSimulationMenu={onToggleSimulationMenu}
                  onAction={onAction}
                  onSimulationAction={onSimulationAction}
                  highlightedEmployeeId={highlightedEmployeeId}
                  isSimulationMode={isSimulationMode}
                  simulatedEmployeeIds={simulatedEmployeeIds}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Map a ?tab= param value to Vismap's tab/heatmap/mode state.
function resolveTabState(param: string | null): {
  tab: string;
  heatmap: boolean;
  mode: 'performance' | 'need-develop' | 'need-successors-copy';
} {
  if (param === 'succession-risk' || param === 'need-successors-copy') {
    return { tab: 'need-successors-copy', heatmap: true, mode: 'need-successors-copy' };
  }
  if (param === 'need-develop' || param === 'need-development') {
    return { tab: 'need-develop', heatmap: true, mode: 'need-develop' };
  }
  return { tab: 'all', heatmap: false, mode: 'performance' };
}

export default function VismapV3({ initialTab }: { initialTab?: string } = {}) {
  const [zoom, setZoom] = useState(45);
  const [position, setPosition] = useState({ x: 0, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // Resolve the active tab from the ?tab= query param (or a passed initialTab).
  // Lets Home/embedders open Vismap directly on a specific tab.
  const initialTabState = resolveTabState(
    initialTab ?? (typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('tab'))
  );
  const [showHeatmap, setShowHeatmap] = useState(initialTabState.heatmap);
  const heatmapStyle = 'glow' as const; // Always use glow effect
  const [heatmapMode, setHeatmapMode] = useState<'performance' | 'successor-risk' | 'need-successors' | 'need-develop' | 'need-successors-copy'>(initialTabState.mode);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState(initialTabState.tab);
  // React to initialTab changes (client-side nav from Home doesn't remount).
  useEffect(() => {
    if (initialTab == null) return;
    const s = resolveTabState(initialTab);
    setActiveTab(s.tab);
    setShowHeatmap(s.heatmap);
    setHeatmapMode(s.mode);
  }, [initialTab]);
  // V3: overlay indikator menggantikan 3 tab view V1 — semuanya bisa menyala
  // bersamaan di atas satu struktur organisasi (lihat ./overlays.ts).
  const [overlays, setOverlays] = useState<Set<OverlayId>>(new Set());
  const flipOverlay = (id: OverlayId) => setOverlays(prev => toggleOverlay(prev, id));
  // Card position yang diklik → menu aksi di sampingnya.
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [simulationMenuOpen, setSimulationMenuOpen] = useState(false);
  // Panel samping tidak lagi ditentukan tab (V1), tapi oleh aksi yang dipilih.
  const [sidePanel, setSidePanel] = useState<'succession' | 'development' | null>(null);
  // Focus suksesi: aksi "Succession" menyalakan heatmap SETEMPAT tanpa menyentuh
  // toggle overlay — frame posisi ini memakai heatmap Succession Risk, dan card
  // employee para calon suksesornya memakai heatmap kesiapan terhadap posisi ini
  // (standar posisi di atasnya). Menyalin perilaku V1: mode Succession Risk +
  // satu posisi diklik → terlihat suksesor mana yang ready dan mana yang perlu
  // dikembangkan.
  const [successionFocusId, setSuccessionFocusId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [isDataEditorOpen, setIsDataEditorOpen] = useState(false);
  const [isHeatmapSettingsOpen, setIsHeatmapSettingsOpen] = useState(false);
  const [isIDPDialogOpen, setIsIDPDialogOpen] = useState(false);
  const [isAddSuccessorDialogOpen, setIsAddSuccessorDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [comparisonData, setComparisonData] = useState<{ manager: Employee; successors: Employee[] } | null>(null);
  const [showEmployeeDetail, setShowEmployeeDetail] = useState(false);
  const [detailEmployeeId, setDetailEmployeeId] = useState<string | null>(null);
  const [showIDPCreation, setShowIDPCreation] = useState(false);
  const [idpEmployeeId, setIdpEmployeeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    gender: false,
    city: false,
    maritalStatus: false,
    performance: false,
    iq: false,
    capability: false,
    commitment: false,
    contribution: false,
  });
  const visibleFieldCount = Object.values(visibleColumns).filter(Boolean).length;
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [highlightedEmployeeId, setHighlightedEmployeeId] = useState<string | null>(null);
  const [isVariableDialogOpen, setIsVariableDialogOpen] = useState(false);

  // Simulation mode state
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [initialSimulationTargetId, setInitialSimulationTargetId] = useState<string | null>(null);
  const [initialSimulationKind, setInitialSimulationKind] = useState<SimulationActionKind | null>(null);

  const searchInputRef = useRef<HTMLDivElement>(null);
  
  // Default heatmap configuration
  const defaultHeatmapConfig: HeatmapConfig = {
    needDevelop: [
      { color: "#fe0d00", min: 0, max: 65 },
      { color: "#F59B02", min: 66, max: 75 },
      { color: "#f0dc02", min: 76, max: 85 },
      { color: "#9de20f", min: 86, max: 92 },
      { color: "#0de627", min: 93, max: 100 },
    ],
    readinessScore: [
      { color: "#DE350B", min: 0, max: 65 },
      { color: "#FD9F28", min: 66, max: 80 },
      { color: "#00875A", min: 81, max: 100 }, // Changed from blue (#016699) to green (#00875A)
    ],
  };
  
  const [heatmapConfig, setHeatmapConfig] = useState<HeatmapConfig>(() => {
    const saved = localStorage.getItem('heatmapConfig');
    const version = localStorage.getItem('heatmapConfigVersion');
    
    // Force reset if version is old or doesn't exist
    if (version !== '2.0') {
      localStorage.setItem('heatmapConfigVersion', '2.0');
      localStorage.setItem('heatmapConfig', JSON.stringify(defaultHeatmapConfig));
      return defaultHeatmapConfig;
    }
    
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old config with needSuccessors to readinessScore
      if (parsed.needSuccessors && !parsed.readinessScore) {
        parsed.readinessScore = defaultHeatmapConfig.readinessScore;
        delete parsed.needSuccessors;
      }
      // Reset readinessScore if it has wrong number of levels (should be 3)
      if (parsed.readinessScore && parsed.readinessScore.length !== 3) {
        parsed.readinessScore = defaultHeatmapConfig.readinessScore;
      }
      return parsed;
    }
    return defaultHeatmapConfig;
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // keepHighlight: dipakai deep-link ?highlight= — sorotannya harus menetap, bukan
  // berkedip 3 detik lalu hilang seperti hasil pencarian, supaya pengguna yang baru
  // mendarat dari halaman lain tetap tahu kartu mana yang dimaksud.
  const handleZoomToEmployee = (employeeId: string, keepHighlight = false) => {
    setHighlightedEmployeeId(employeeId);
    if (!keepHighlight) setTimeout(() => setHighlightedEmployeeId(null), 3000);
    setTimeout(() => {
      const cardElement = document.querySelector(`[data-employee-id="${employeeId}"]`);
      if (cardElement && containerRef.current && contentRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const cardRect = cardElement.getBoundingClientRect();
        const cardRelX = cardRect.left + cardRect.width / 2 - containerRect.left;
        const cardRelY = cardRect.top + cardRect.height / 2 - containerRect.top;

        // Read current transform from DOM to avoid stale React closure values.
        // Content div: left:50%, transformOrigin:0 0.
        // matrix(scale,0,0,scale, tx, ty) where tx=position.x, ty=position.y.
        const matrix = new DOMMatrix(getComputedStyle(contentRef.current).transform);
        const currentScale = matrix.a;
        const tx = matrix.e;
        const ty = matrix.f;
        const halfW = containerRect.width / 2;

        const cardOriginalX = (cardRelX - halfW - tx) / currentScale;
        const cardOriginalY = (cardRelY - ty) / currentScale;

        const newX = -cardOriginalX;
        const newY = containerRect.height / 2 - cardOriginalY;

        setZoom(100);
        setPosition({ x: newX, y: newY });
      }
    }, 100);
  };
  
  // Check if any dialog is open
  const isAnyDialogOpen = isDataEditorOpen || isHeatmapSettingsOpen || isIDPDialogOpen || isAddSuccessorDialogOpen;
  
  // Load employees from CSV on mount (always fresh from file)
  useEffect(() => {
    setIsLoadingData(true);
    loadEmployeesFromCanonical()
      .then(csvEmployees => {
        setEmployees(csvEmployees);
        const params = new URLSearchParams(window.location.search);
        // ?simulate=true&targetPosition=... → open simulation panel with pre-filled target
        const simulateParam = params.get('simulate');
        const targetPositionParam = params.get('targetPosition');
        if (simulateParam === 'true') {
          setIsSimulationMode(true);
          if (targetPositionParam) {
            const match = csvEmployees.find(e =>
              (e.position ?? '').toLowerCase() === targetPositionParam.toLowerCase()
            );
            if (match) {
              setInitialSimulationTargetId(match.id);
              setTimeout(() => handleZoomToEmployee(match.id), 600);
            }
          }
        }
        // Deep-link: ?highlight=PositionName → zoom to that node after render
        const highlightParam = params.get('highlight');
        if (highlightParam) {
          const match = csvEmployees.find(e =>
            (e.position ?? '').toLowerCase() === highlightParam.toLowerCase() ||
            (e.jobTitle ?? '').toLowerCase() === highlightParam.toLowerCase() ||
            (e.name ?? '').toLowerCase() === highlightParam.toLowerCase()
          );
          if (match) {
            setTimeout(() => handleZoomToEmployee(match.id, true), 600);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load CSV, falling back to localStorage:', err);
        setEmployees(dataManager.getEmployees());
      })
      .finally(() => setIsLoadingData(false));
  }, []);


  // Handle data change from editor
  const handleDataChange = () => {
    setEmployees(dataManager.getEmployees());
    // Close any open panels since employee data might have changed
    setSelectedEmployee(null);
  };

  // Handle heatmap config save
  const handleHeatmapConfigSave = (newConfig: HeatmapConfig) => {
    console.log('[Heatmap Config] Saving new config:', newConfig);
    setHeatmapConfig(newConfig);
    localStorage.setItem('heatmapConfig', JSON.stringify(newConfig));
    toast.success('Heatmap settings saved successfully!');
  };

  // Get current heatmap ranges based on heatmap mode

  // Handle compare successors
  const handleCompareSuccessors = (manager: Employee, successors: Employee[]) => {
    setComparisonData({ manager, successors });
  };

  // Close comparison view
  const handleCloseComparison = () => {
    setComparisonData(null);
  };

  // Handle navigation to employee detail page
  const handleNavigateToDetail = (employeeId: string) => {
    setDetailEmployeeId(employeeId);
    setShowEmployeeDetail(true);
  };

  // Handle back from employee detail page
  const handleBackFromDetail = () => {
    setShowEmployeeDetail(false);
    setDetailEmployeeId(null);
  };

  // Handle navigation to IDP creation page
  const handleNavigateToIDP = (employeeId: string) => {
    setIdpEmployeeId(employeeId);
    setShowIDPCreation(true);
  };

  // Handle back from IDP creation page
  const handleBackFromIDP = () => {
    setShowIDPCreation(false);
    setIdpEmployeeId(null);
  };

  // Handle showing IDP Progress
  const handleShowIDPProgress = (employeeId: string) => {
    // TODO: Implement IDP Progress popup
    console.log('Show IDP Progress for employee:', employeeId);
  };

  // Handle adding employee to manager's successors list
  const handleAddToSuccessors = (managerId: string, successorId: string) => {
    const updatedEmployees = employees.map(emp => {
      if (emp.id === managerId) {
        // Check if successor is already in the additionalSuccessors list
        const currentAdditionalSuccessors = emp.additionalSuccessors || [];
        if (!currentAdditionalSuccessors.includes(successorId)) {
          return {
            ...emp,
            additionalSuccessors: [...currentAdditionalSuccessors, successorId]
          };
        }
      }
      return emp;
    });
    
    setEmployees(updatedEmployees);
    dataManager.saveEmployees(updatedEmployees);
    
    // Show success notification
    const successorName = employees.find(e => e.id === successorId)?.name;
    const managerName = employees.find(e => e.id === managerId)?.name;
    if (successorName && managerName) {
      toast.success(`${successorName} added as successor for ${managerName}`);
    }
    
    // Update comparison data to reflect the change
    if (comparisonData) {
      const updatedManager = updatedEmployees.find(e => e.id === managerId);
      if (updatedManager) {
        setComparisonData({
          ...comparisonData,
          manager: updatedManager
        });
      }
    }
  };
  
  // Keadaan hasil simulasi. Perhitungannya ada di src/vismap/v3/simulation.ts
  // (bukan inline seperti `applySwaps` V1) karena langkah V3 bisa mengosongkan
  // kursi dan harus melaporkan konsekuensinya — logika yang perlu bisa diuji
  // tanpa merender kanvas.
  //
  // `readyMin` diambil dari range READY di Setting Heatmap Condition, bukan
  // ambang sendiri, supaya "suksesor siap" di panel simulasi berarti sama
  // dengan yang dibaca heatmap kanvas.
  const readyMin = (() => {
    const sorted = [...heatmapConfig.readinessScore].sort((a, b) => a.min - b.min);
    return sorted[sorted.length - 1]?.min ?? 81;
  })();

  const simulation = buildSimulation(employees, isSimulationMode ? simulationSteps : [], readyMin);
  const simulatedEmployees = isSimulationMode ? simulation.employees : employees;
  const simulatedOrgChart = buildOrgChart(simulatedEmployees);
  const simulatedEmployeeIds = new Set(
    simulationSteps.flatMap(s => [s.targetSeatId, s.incomingSeatId])
  );

  const handleSimulationAddStep = (step: Omit<SimulationStep, 'id'>) => {
    const duplicate = simulationSteps.some(
      s => s.kind === step.kind && s.targetSeatId === step.targetSeatId && s.incomingSeatId === step.incomingSeatId
    );
    if (duplicate) { toast.info('Langkah ini sudah ada.'); return; }
    // Id langkah cukup unik di dalam satu sesi simulasi; dipakai sebagai key
    // React dan sebagai pegangan tombol hapus.
    const id = `${step.kind}-${step.targetSeatId}-${step.incomingSeatId}-${simulationSteps.length}`;
    setSimulationSteps(prev => [...prev, { ...step, id }]);
  };

  const handleSimulationRemoveStep = (stepId: string) => {
    setSimulationSteps(prev => prev.filter(s => s.id !== stepId));
  };

  // Sengaja belum mengubah data apa pun: "career/succession plan" belum
  // punya definisi di store kanonik (posisi target? suksesor? urutan langkah?),
  // dan menulis sesuatu yang salah lebih buruk daripada mengatakannya belum ada
  // — prinsip yang sama dengan aksi placeholder lain di V3 (docs §7).
  const handleSimulationSetAsPlan = (view: StepView) => {
    toast.info(
      `Set as Career/Succession Plan (${view.target.position}) belum tersimpan — bentuk datanya masih dirancang.`
    );
  };

  const handleSimulationStop = () => {
    setIsSimulationMode(false);
    setSimulationSteps([]);
    setInitialSimulationTargetId(null);
  };

  // Klik card position → pilih card itu dan buka menu aksi. Klik ulang card yang
  // sama menutup menunya, jadi tidak perlu tombol close terpisah.
  const handlePositionClick = (employeeId: string) => {
    setActionMenuId(prev => (prev === employeeId ? null : employeeId));
    setSimulationMenuOpen(false);
    if (employeeId !== successionFocusId) setSuccessionFocusId(null);
  };

  // Aksi Succession / Development / iProfile dari menu.
  const handleMenuAction = (kind: 'succession' | 'development' | 'iprofile', employee: Employee) => {
    setActionMenuId(null);
    setSimulationMenuOpen(false);
    if (kind === 'iprofile') {
      setSuccessionFocusId(null);
      handleNavigateToDetail(employee.id);
      return;
    }
    setSelectedEmployee(employee);
    setSidePanel(kind === 'succession' ? 'succession' : 'development');
    // Focus suksesi hanya hidup untuk aksi Succession.
    setSuccessionFocusId(kind === 'succession' ? employee.id : null);
  };

  // Submenu Simulation. TAHAP INI: hanya Exchange yang benar-benar tersambung ke
  // SimulationPanel V1; empat lainnya sengaja placeholder (docs/vismap-v3.md §8)
  // supaya tidak ada aksi yang tampak berhasil padahal tidak mengubah apa pun.
  const handleSimulationAction = (action: SimulationAction, employee: Employee) => {
    // Exchange dan Cut & Replace sudah punya model langkahnya
    // (src/vismap/v3/simulation.ts), jadi keduanya masuk Simulation Mode dengan
    // posisi ini sebagai target langkah pertama. Tiga aksi sisanya belum
    // dimodelkan dan tetap mengatakannya apa adanya, bukan diam-diam gagal.
    if (action === 'exchange' || action === 'cut-replace') {
      setActionMenuId(null);
      setSimulationMenuOpen(false);
      setSelectedEmployee(null);
      setSidePanel(null);
      setSuccessionFocusId(null);
      setSimulationSteps([]);
      setInitialSimulationTargetId(employee.id);
      setInitialSimulationKind(action);
      setIsSimulationMode(true);
      return;
    }
    const labels: Record<Exclude<SimulationAction, 'exchange' | 'cut-replace'>, string> = {
      'promote': 'Promote',
      'mutation': 'Mutation',
      'change-job-criteria': 'Change Job Criteria',
    };
    toast.info(`${labels[action]} belum tersedia di V3 — masih tahap rancangan.`);
  };

  // Kumpulan calon suksesor posisi yang di-focus. Aturannya sama dengan V1:
  // successorIds dari data kalau ada, kalau tidak bawahan langsung, ditambah
  // suksesor yang ditambahkan manual.
  const focusSuccessorIds = (() => {
    if (!successionFocusId) return new Set<string>();
    const pool = isSimulationMode ? simulatedEmployees : employees;
    const target = pool.find(e => e.id === successionFocusId);
    if (!target) return new Set<string>();
    const fromCsv = target.successorIds ?? [];
    const primary = fromCsv.length > 0 ? fromCsv : pool.filter(e => e.managerId === successionFocusId).map(e => e.id);
    return new Set<string>([...primary, ...(target.additionalSuccessors ?? [])]);
  })();

  const orgChart = buildOrgChart(employees);
  
  // Get employee for IDP Progress popup
  const handleZoomIn = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newZoom = Math.min(zoom + 10, 200);
    const zoomRatio = newZoom / zoom;
    
    setPosition(prev => ({
      x: centerX - (centerX - prev.x) * zoomRatio,
      y: centerY - (centerY - prev.y) * zoomRatio
    }));
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newZoom = Math.max(zoom - 10, 25);
    const zoomRatio = newZoom / zoom;
    
    setPosition(prev => ({
      x: centerX - (centerX - prev.x) * zoomRatio,
      y: centerY - (centerY - prev.y) * zoomRatio
    }));
    setZoom(newZoom);
  };

  const handleResetView = () => {
    setZoom(45);
    setPosition({ x: 0, y: 150 });
  };

  // Mouse drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging on left mouse button and not on interactive elements
    if (e.button !== 0) return;
    
    const target = e.target as HTMLElement;
    // Don't start dragging if clicking on buttons or interactive elements
    if (target.closest('button') || target.closest('a') || target.closest('[data-no-drag]')) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Mouse drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  // Mouse drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse leaving the container
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Double-click to zoom in
  const handleDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('[data-no-drag]')) return;
    
    if (zoom >= 200) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const newZoom = Math.min(zoom + 20, 200);
    const zoomRatio = newZoom / zoom;
    
    setPosition(prev => ({
      x: clickX - (clickX - prev.x) * zoomRatio,
      y: clickY - (clickY - prev.y) * zoomRatio
    }));
    setZoom(newZoom);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-no-drag]')) return;
    
    e.preventDefault();
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Get mouse position relative to the transform origin (center horizontally, top vertically)
    // The content div has left: 50%, so its transform origin is at the horizontal center
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top;
    
    // Determine zoom direction and amount
    const delta = -e.deltaY;
    const zoomChange = delta > 0 ? 10 : -10;
    const newZoom = Math.max(25, Math.min(200, zoom + zoomChange));
    
    if (newZoom === zoom) return;
    
    // Calculate zoom ratio
    const zoomRatio = newZoom / zoom;
    
    // Adjust position so the point under the mouse stays in place
    setPosition(prev => ({
      x: mouseX - (mouseX - prev.x) * zoomRatio,
      y: mouseY - (mouseY - prev.y) * zoomRatio
    }));
    setZoom(newZoom);
  };

  // Add global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Filter employees based on search query
  const filteredEmployees = searchQuery.trim() 
    ? employees.filter(emp => {
        const query = searchQuery.toLowerCase();
        const matchName = emp.name.toLowerCase().includes(query);
        const matchPosition = emp.position.toLowerCase().includes(query);
        return matchName || matchPosition;
      }).slice(0, 10) // Limit to 10 results
    : [];

  // Show dropdown when there are filtered results
  useEffect(() => {
    setShowSearchDropdown(filteredEmployees.length > 0 && searchQuery.trim().length > 0);
  }, [filteredEmployees.length, searchQuery]);

  // Handle click outside search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle select employee from search
  const handleSelectEmployee = (employee: Employee) => {
    // Set employee as selected (opens detail panel)
    setSelectedEmployee(employee);
    
    // Set highlighted state
    setHighlightedEmployeeId(employee.id);
    
    // Clear search
    setSearchQuery('');
    setShowSearchDropdown(false);
    
    // Auto pan/zoom to employee card - CENTERED
    setTimeout(() => {
      const cardElement = document.querySelector(`[data-employee-id="${employee.id}"]`);
      if (cardElement && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const cardRect = cardElement.getBoundingClientRect();
        
        const cardRelX = cardRect.left + cardRect.width / 2 - containerRect.left;
        const cardRelY = cardRect.top + cardRect.height / 2 - containerRect.top;

        const halfW = containerRect.width / 2;
        const currentScale = zoom / 100;

        const cardOriginalX = (cardRelX - halfW - position.x) / currentScale;
        const cardOriginalY = (cardRelY - position.y) / currentScale;

        const newX = -cardOriginalX;
        const newY = containerRect.height / 2 - cardOriginalY;
        
        setZoom(100);
        setPosition({ x: newX, y: newY });
        
        toast.success(`Navigated to ${employee.name}`);
        
        // Clear highlight after 3 seconds
        setTimeout(() => {
          setHighlightedEmployeeId(null);
        }, 3000);
      }
    }, 100);
  };

  if (!orgChart || orgChart.length === 0) {
    return <div className="size-full flex items-center justify-center">No org chart data available</div>;
  }

  // Show IDP creation page if active
  if (showIDPCreation && idpEmployeeId) {
    const idpEmployee = employees.find(emp => emp.id === idpEmployeeId);
    if (idpEmployee) {
      return <IDPCreation employee={idpEmployee} onBack={handleBackFromIDP} />;
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8f9fa]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#016699] border-t-transparent rounded-full animate-spin" />
          <span className="font-['Open_Sans',_sans-serif] text-[14px] text-[#6c757d]">Loading employee data...</span>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>

      {/* Comparison View - Full screen overlay (works in all views) */}
      {comparisonData && (
        <SuccessorComparison
          manager={comparisonData.manager}
          successors={comparisonData.successors}
          employees={employees}
          onClose={handleCloseComparison}
          onIDPDialogChange={setIsIDPDialogOpen}
          onEmployeeClick={handleNavigateToDetail}
          onAddToSuccessors={handleAddToSuccessors}
          heatmapConfig={heatmapConfig}
        />
      )}

      {/* Show employee detail page if active */}
      {showEmployeeDetail && detailEmployeeId ? (
        <EmployeeDetail employeeId={detailEmployeeId} onBack={handleBackFromDetail} onShowIDPProgress={handleShowIDPProgress} onCompare={handleCompareSuccessors} />
      ) : (
        <>

      <div 
        ref={containerRef}
        className="size-full bg-gray-100 overflow-hidden relative select-none"
        onMouseDown={viewMode === 'chart' && !isAnyDialogOpen ? handleMouseDown : undefined}
        onMouseMove={viewMode === 'chart' && !isAnyDialogOpen ? handleMouseMove : undefined}
        onMouseUp={viewMode === 'chart' && !isAnyDialogOpen ? handleMouseUp : undefined}
        onMouseLeave={viewMode === 'chart' && !isAnyDialogOpen ? handleMouseLeave : undefined}
        onDoubleClick={viewMode === 'chart' && !isAnyDialogOpen ? handleDoubleClick : undefined}
        onWheel={viewMode === 'chart' && !isAnyDialogOpen ? handleWheel : undefined}
        style={{ cursor: viewMode === 'chart' && !isAnyDialogOpen && isDragging ? 'grabbing' : viewMode === 'chart' && !isAnyDialogOpen ? 'grab' : 'default' }}
      >
        <Toaster position="top-center" />
        
        {/* Search Field - Top left corner (only in chart view) */}
        {viewMode === 'chart' && (
          <div 
            ref={searchInputRef}
            data-no-drag
            className="fixed z-50 flex gap-0"
            // Menempel tepat di bawah bilah atas Vismap, yang kini mulai di
            // bawah header aplikasi.
            style={{ left: "calc(var(--sidebar-w, 220px) + 4px)", top: HEADER_HEIGHT + 56 }}
          >
            {/* Search Input */}
            <div className="bg-[rgba(255,255,255,0)] rounded-lg p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-[#dee2e6] rounded-[16px] px-[12px] py-[8px] pr-[36px] w-[280px] font-['Open_Sans',_sans-serif] text-[12px] text-[#495057] focus:outline-none focus:border-[#016699] placeholder:text-[#adb5bd]"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#58595B]" />
              </div>
              
              {/* Search Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#dee2e6] rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50">
                  {filteredEmployees.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => handleSelectEmployee(emp)}
                      className="w-full px-4 py-3 text-left hover:bg-[#f8f9fa] transition-colors border-b border-[#dee2e6] last:border-b-0 flex items-start gap-3"
                    >
                      <div className="flex-shrink-0">
                        {emp.imageUrl ? (
                          <img 
                            src={emp.imageUrl} 
                            alt={emp.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#016699] flex items-center justify-center text-white font-['Open_Sans',_sans-serif] text-sm">
                            {emp.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-['Open_Sans',_sans-serif] text-[13px] font-semibold text-[#495057] truncate">
                          {emp.name}
                        </div>
                        <div className="font-['Open_Sans',_sans-serif] text-[11px] text-[#6c757d] truncate">
                          {emp.position}
                        </div>
                        <div className="font-['Open_Sans',_sans-serif] text-[10px] text-[#adb5bd] mt-0.5">
                          Score: {emp.competencyScore}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* + Variable Button */}
            <div className="bg-[rgba(255,255,255,0)] rounded-lg p-3 flex items-center">
              <button
                onClick={() => setIsVariableDialogOpen(true)}
                className="flex gap-[8px] items-center rounded-[28px] border border-[#dee2e6] bg-white px-[12px] py-[8px] hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 text-[#016699]" />
                <span className="font-['Open_Sans',_sans-serif] text-[13px] font-bold text-[#016699]">
                  Filter Card Data{visibleFieldCount > 0 ? ` (${visibleFieldCount})` : ''}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Succession Risk Modal - Top right corner (only in Succession Risk tab) */}
        {viewMode === 'chart' && overlays.has('succession-risk') && (
          <div
            data-no-drag
            className={`fixed top-20 z-50 transition-all duration-300 ${
              selectedEmployee ? 'right-[460px]' : 'right-4'
            }`}
          >
            <SuccessionRiskModal
              employees={employees}
              heatmapConfig={heatmapConfig}
              onZoomToEmployee={handleZoomToEmployee}
            />
          </div>
        )}

        {/* Need Develop Modal - Top right corner (only in Need Develop tab) */}
        {viewMode === 'chart' && overlays.has('need-development') && (
          <div
            data-no-drag
            className={`fixed top-20 z-50 transition-all duration-300 ${
              selectedEmployee ? 'right-[460px]' : 'right-4'
            }`}
          >
            <NeedDevelopModal
              employees={employees}
              heatmapConfig={heatmapConfig}
              onZoomToEmployee={handleZoomToEmployee}
            />
          </div>
        )}

        {/* Heatmap Legend - Removed */}

      {/* Employee Detail Panel */}
      <div data-no-drag>
        {sidePanel === 'succession' ? (
          <SuccessionPanel
            contextLabel="Succession"
            filledReadinessPill
            employee={selectedEmployee}
            onClose={() => { setSelectedEmployee(null); setSidePanel(null); setSuccessionFocusId(null); }}
            onCompare={handleCompareSuccessors}
            onIDPDialogChange={setIsIDPDialogOpen}
            onAddSuccessorDialogChange={setIsAddSuccessorDialogOpen}
            heatmapConfig={heatmapConfig}
            onNavigateToDetail={handleNavigateToDetail}
            onNavigateToIDP={handleNavigateToIDP}
            onShowIDPProgress={handleShowIDPProgress}
            allEmployees={employees}
            onEmployeesChange={setEmployees}
          />
        ) : sidePanel === 'development' && selectedEmployee ? (
          <DevelopmentPanelV3
            employeeId={selectedEmployee.id}
            employeeName={selectedEmployee.name}
            employeePosition={selectedEmployee.position}
            managerPosition={
              // Default tab Target Position = jabatan atasan langsung.
              employees.find(e => e.id === selectedEmployee.managerId)?.position ?? null
            }
            onClose={() => { setSelectedEmployee(null); setSidePanel(null); setSuccessionFocusId(null); }}
          />
        ) : null}
      </div>

      {/* Simulation Panel */}
      {isSimulationMode && (
        <SimulationPanelV3
          simulatedEmployees={simulatedEmployees}
          views={simulation.views}
          onAddStep={handleSimulationAddStep}
          onRemoveStep={handleSimulationRemoveStep}
          onSetAsPlan={handleSimulationSetAsPlan}
          onStop={handleSimulationStop}
          initialTargetSeatId={initialSimulationTargetId}
          initialKind={initialSimulationKind}
        />
      )}

      {/* Combined Top Bar - Tab Filter + View Mode Toggle */}
      <div
        data-no-drag
        className="fixed right-0 bg-white shadow-lg z-50 px-4 flex flex-col"
        // Digeser turun setinggi header aplikasi: bilah ini `fixed`, jadi kalau
        // tetap di top:0 ia menutupi header dan judul menunya tidak terlihat.
        style={{ left: "var(--sidebar-w, 220px)", top: HEADER_HEIGHT }}
      >
        {/* Tab Filter row */}
        <div className="flex items-center justify-between py-2">
        {/* Overlay indikator — pengganti 3 tab view V1. Semua bisa menyala
            bersamaan karena tiap overlay menempel pada elemen yang berbeda
            (frame job position, card employee, atau garis struktur). */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {OVERLAYS.map(o => (
            <TooltipProvider key={o.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <label className="flex cursor-pointer items-center gap-2">
                    <Switch
                      checked={overlays.has(o.id)}
                      onCheckedChange={() => flipOverlay(o.id)}
                    />
                    <span className="font-['Open_Sans',_sans-serif] text-[13px] font-semibold text-[#016699] whitespace-nowrap">
                      {o.label}
                    </span>
                  </label>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-['Open_Sans',_sans-serif] max-w-[240px]">{o.hint}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 items-center">
          {/* Simulate Button */}
          {viewMode === 'chart' && (
            <button
              onClick={() => {
                if (isSimulationMode) {
                  handleSimulationStop();
                } else {
                  setIsSimulationMode(true);
                  setSimulationSteps([]);
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 20,
                border: isSimulationMode ? 'none' : '1.5px solid #016699',
                background: isSimulationMode ? '#f59e0b' : 'white',
                color: isSimulationMode ? 'white' : '#016699',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Open Sans', sans-serif",
              }}
            >
              <Shuffle size={14} />
              {isSimulationMode ? 'Stop Simulate' : 'Simulate'}
            </button>
          )}
          <div className="flex gap-1 p-1 bg-gray-50 rounded-lg">
            <Button
              variant={viewMode === 'chart' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('chart')}
              title="Chart View"
              style={viewMode === 'chart' ? { backgroundColor: '#016699' } : undefined}
            >
              <Network className="w-4 h-4" style={{ color: viewMode === 'chart' ? 'white' : '#016699' }} />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('table')}
              title="Table View"
              style={viewMode === 'table' ? { backgroundColor: '#016699' } : undefined}
            >
              <TableIcon className="w-4 h-4" style={{ color: viewMode === 'table' ? 'white' : '#016699' }} />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-no-drag
                title="Settings"
                size="icon"
                style={{ backgroundColor: 'white' }}
              >
                <Settings className="w-4 h-4" style={{ color: '#016699' }} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-['Open_Sans',_sans-serif]">
              <DropdownMenuItem onClick={() => setIsDataEditorOpen(true)}>
                Setting Employee Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsHeatmapSettingsOpen(true)}>
                Setting Heatmap Condition
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>
      </div>

      {/* Zoom Controls - Only show in chart view */}
      {viewMode === 'chart' && (
        <div
          data-no-drag
          className={`fixed bottom-4 bg-white rounded-lg shadow-lg p-2 flex flex-col items-center gap-2 z-50 transition-all duration-300 ${
            selectedEmployee ? 'right-[440px]' : isSimulationMode ? 'right-[316px]' : 'right-4'
          }`}
        >
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoom >= 200 || isAnyDialogOpen}
          title="Zoom In" className="text-[rgb(1,102,153)]"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <span className="px-2 text-sm">{zoom}%</span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoom <= 25 || isAnyDialogOpen}
          title="Zoom Out" className="text-[rgb(1,102,153)]"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <div className="w-full h-px bg-gray-200 my-1" />
        <Button
          variant="outline"
          size="icon"
          onClick={handleResetView}
          disabled={isAnyDialogOpen}
          title="Reset View" className="text-[rgb(1,102,153)]"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        </div>
      )}

      {/* Simulation Mode Banner */}
      {isSimulationMode && (
        <div
          data-no-drag
          style={{
            position: 'fixed', top: 64, left: 0, right: 420, zIndex: 49,
            background: '#fef3c7', borderBottom: '1px solid #fbbf24',
            padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#92400e',
          }}
        >
          <Shuffle size={13} />
          <strong>Simulation Mode aktif</strong> — Susun langkahnya di panel Simulation, dan kanvas mengikuti hasilnya.
          {simulationSteps.length > 0 && (
            <span style={{ marginLeft: 8, background: '#f59e0b', color: 'white', borderRadius: 20, padding: '1px 8px', fontWeight: 700, fontSize: 10 }}>
              {simulationSteps.length} langkah
            </span>
          )}
        </div>
      )}

      {/* Main Content Area with padding for top bar */}
      {/* Simulation mode orange frame highlight */}
      {isSimulationMode && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 4px #f59e0b, inset 0 0 40px 8px rgba(245,158,11,0.15)',
            zIndex: 9999,
          }}
        />
      )}
      {/* Kanvas dimulai di bawah header aplikasi + bilah atas Vismap. */}
      <div className="absolute inset-0" style={{ paddingTop: 64 }}>
        {viewMode === 'chart' ? (
          <div 
            ref={contentRef}
            className="absolute p-12"
            style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
              transformOrigin: '0 0',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              left: '50%',
              top: 0,
              willChange: 'transform'
            }}
          >
            <div style={{ transform: 'translateX(-50%)' }}>
              {/* Render multiple top-level executives horizontally */}
              <div className="flex gap-16 justify-center items-start">
                {(isSimulationMode ? simulatedOrgChart : orgChart).map((root) => (
                  <OrgNode
                    key={root.id}
                    employee={root}
                    level={0}
                    onEmployeeClick={(emp) => setSelectedEmployee(emp)}
                    visibleColumns={visibleColumns}
                    heatmapConfig={heatmapConfig}
                    allEmployees={isSimulationMode ? simulatedEmployees : employees}
                    overlays={overlays}
                    actionMenuId={actionMenuId}
                    successionFocusId={successionFocusId}
                    focusSuccessorIds={focusSuccessorIds}
                    simulationMenuOpen={simulationMenuOpen}
                    onPositionClick={handlePositionClick}
                    onToggleSimulationMenu={() => setSimulationMenuOpen(prev => !prev)}
                    onAction={handleMenuAction}
                    onSimulationAction={handleSimulationAction}
                    highlightedEmployeeId={highlightedEmployeeId}
                    isSimulationMode={isSimulationMode}
                    simulatedEmployeeIds={simulatedEmployeeIds}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="size-full p-4">
            <TableView
              employees={employees}
              activeTab={activeTab}
              onEmployeeClick={(emp) => {
                // Only allow card selection on tabs with panels
                if (activeTab !== 'all') {
                  setSelectedEmployee(emp);
                }
              }}
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
              showHeatmap={showHeatmap}
              heatmapStyle={heatmapStyle}
              heatmapConfig={heatmapConfig}
            />
          </div>
        )}
      </div>

      {/* Data Editor Dialog */}
      <DataEditor
        isOpen={isDataEditorOpen}
        onClose={() => setIsDataEditorOpen(false)}
        onDataChange={handleDataChange}
        visibleColumns={visibleColumns}
      />

      {/* Heatmap Settings Dialog */}
      <HeatmapSettings
        isOpen={isHeatmapSettingsOpen}
        onClose={() => setIsHeatmapSettingsOpen(false)}
        currentConfig={heatmapConfig}
        onSave={handleHeatmapConfigSave}
      />

      {/* Data Visibility Modal */}
      <DataVisibilityModal
        open={isVariableDialogOpen}
        onOpenChange={setIsVariableDialogOpen}
        visibleColumns={visibleColumns}
        onApply={setVisibleColumns}
      />
    </div>
      </>
      )}
    </TooltipProvider>
  );
}
