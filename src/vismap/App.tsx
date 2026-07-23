import { useState, useRef, useEffect } from "react";
import OrgChartCard from "./components/OrgChartCard";
import EmployeeDetailPanel from "./components/EmployeeDetailPanel";
import SuccessionPanel from "./components/SuccessionPanel";
import SuccessorComparison from "./components/SuccessorComparison";
import EmployeeDetail from "./components/EmployeeDetail";
import IDPCreation from "./components/IDPCreation";
import TabFilter from "./components/TabFilter";
import TableView from "./components/TableView";
import DataEditor from "./components/DataEditor";
import SuccessionRiskModal from "./components/SuccessionRiskModal";
import NeedDevelopModal from "./components/NeedDevelopModal";
import { buildOrgChart, type Employee, type OrgChartNode } from "./data/orgChartData";
import { dataManager } from "./data/dataManager";
import { loadEmployeesFromCanonical } from "./data/canonicalAdapter";
import { ChevronDown, ChevronRight, ZoomIn, ZoomOut, Maximize2, Table as TableIcon, Network, Search, Settings, TrendingUp, Plus, Shuffle } from "lucide-react";
import AppBreadcrumb from "@/components/Breadcrumb";
import { Button } from "./components/ui/button";
import { Switch } from "./components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import DataVisibilityModal from "./components/DataVisibilityModal";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import HeatmapSettings, { type HeatmapConfig, type HeatmapRange } from "./components/HeatmapSettings";
import SimulationPanel, { type SimulationSwap } from "./components/SimulationPanel";


interface OrgNodeProps {
  employee: OrgChartNode;
  level: number;
  showHeatmap: boolean;
  heatmapStyle: 'gradient' | 'border' | 'glow';
  heatmapMode: 'performance' | 'successor-risk' | 'need-successors' | 'need-develop' | 'need-successors-copy';
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
  heatmapRanges: HeatmapRange[];
  heatmapConfig: HeatmapConfig;
  allEmployees: Employee[];
  selectedCardInV2Mode?: string | null;
  onCardClickInV2Mode?: (employeeId: string) => void;
  highlightedEmployeeId?: string | null;
  isSimulationMode?: boolean;
  simulatedEmployeeIds?: Set<string>;
}

function OrgNode({ employee, level, showHeatmap, heatmapStyle, heatmapMode, onEmployeeClick, managerPosition, visibleColumns, heatmapRanges, heatmapConfig, allEmployees, selectedCardInV2Mode, onCardClickInV2Mode, highlightedEmployeeId, isSimulationMode, simulatedEmployeeIds }: OrgNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Expand all by default
  const hasReports = employee.reports && employee.reports.length > 0;
  
  // Calculate maximum card height based on all employees and visible columns
  const calculateMaxCardHeight = (): number => {
    let maxAdditionalFields = 0;
    
    allEmployees.forEach(emp => {
      let fieldCount = 0;
      if (visibleColumns.gender && emp.gender) fieldCount++;
      if (visibleColumns.city && emp.city) fieldCount++;
      if (visibleColumns.maritalStatus && emp.maritalStatus) fieldCount++;
      if (visibleColumns.performance) fieldCount++;
      if (visibleColumns.iq) fieldCount++;
      if (visibleColumns.capability) fieldCount++;
      if (visibleColumns.commitment) fieldCount++;
      if (visibleColumns.contribution) fieldCount++;
      
      if (fieldCount > maxAdditionalFields) {
        maxAdditionalFields = fieldCount;
      }
    });
    
    const baseHeight = 200;
    const additionalHeight = maxAdditionalFields * 12; // 12px per additional field
    return baseHeight + additionalHeight;
  };
  
  const maxCardHeight = calculateMaxCardHeight();
  
  // For successor-risk mode: Red when NO direct report has green readiness tag (>= 81)
  const getReportReadiness = (report: Employee): number => {
    if (report.readinessScore != null) return report.readinessScore;
    const s = report.competencyScore;
    if (s >= 91) return Math.round(s * 0.92);
    if (s >= 76) return Math.round(s * 0.88);
    if (s >= 66) return Math.round(s * 0.80);
    return Math.round(s * 0.72);
  };
  const hasLowPerformingSubordinates = hasReports && !employee.reports.some(r => getReportReadiness(r) >= 81);
  
  // Find the lowest scale among subordinates (for determining heatmap color)
  // Scale 1 (0-65), Scale 2 (66-70), Scale 3 (71-75), Scale 4 (76-85), Scale 5 (86-90), Scale 6 (91-100)
  const getLowestSubordinateScale = (): number => {
    if (!hasReports) return 0;
    
    const hasScale1 = employee.reports.some(report => report.competencyScore <= 65);
    const hasScale2 = employee.reports.some(report => report.competencyScore >= 66 && report.competencyScore <= 70);
    const hasScale3 = employee.reports.some(report => report.competencyScore >= 71 && report.competencyScore <= 75);
    const hasScale4 = employee.reports.some(report => report.competencyScore >= 76 && report.competencyScore <= 85);
    const hasScale5 = employee.reports.some(report => report.competencyScore >= 86 && report.competencyScore <= 90);
    const hasScale6 = employee.reports.some(report => report.competencyScore >= 91);
    
    if (hasScale1) return 1;
    if (hasScale2) return 2;
    if (hasScale3) return 3;
    if (hasScale4) return 4;
    if (hasScale5) return 5;
    if (hasScale6) return 6;
    return 0; // No subordinates
  };
  
  const lowestSubordinateScale = getLowestSubordinateScale();
  
  // For need-successors mode: Calculate color based on subordinates' readiness scores
  const getNeedSuccessorsColor = (): string | null => {
    // Only applies to managers (employees with at least 1 subordinate)
    if (!hasReports) return null;
    
    // Get thresholds from heatmap config
    const readinessRanges = heatmapConfig.readinessScore;
    // Assume ranges are ordered: [red, orange, green] based on min values
    const sortedRanges = [...readinessRanges].sort((a, b) => a.min - b.min);
    const redRange = sortedRanges[0]; // Lowest range
    const greenRange = sortedRanges[sortedRanges.length - 1]; // Highest range (READY)
    
    // Calculate readiness score for each subordinate
    const subordinatesWithReadiness = employee.reports.map(report => {
      // Use readiness score from data if available, otherwise calculate fallback
      if (report.readinessScore !== undefined && report.readinessScore !== null) {
        return report.readinessScore;
      }
      
      // Fallback calculation based on competency score
      const currentScore = report.competencyScore;
      if (currentScore >= 91) {
        return Math.round(currentScore * 0.92);
      } else if (currentScore >= 76) {
        return Math.round(currentScore * 0.88);
      } else if (currentScore >= 66) {
        return Math.round(currentScore * 0.80);
      } else {
        return Math.round(currentScore * 0.72);
      }
    });
    
    // Classify subordinates based on threshold
    const greenCount = subordinatesWithReadiness.filter(score => 
      score >= greenRange.min && score <= greenRange.max
    ).length;
    const redCount = subordinatesWithReadiness.filter(score => 
      score >= redRange.min && score <= redRange.max
    ).length;
    const totalCount = subordinatesWithReadiness.length;
    const greenPercentage = (greenCount / totalCount) * 100;
    
    // Logic untuk menentukan warna manager:
    // 1. Manager HIJAU jika: >= 50% bawahan READY (hijau) ATAU minimal 2 bawahan READY
    if (greenPercentage >= 50 || greenCount >= 2) {
      return '#88E113'; // Green
    }
    
    // 4. Manager MERAH jika: tidak ada bawahan READY DAN minimal ada 1 bawahan merah
    if (greenCount === 0 && redCount > 0) {
      return '#FE0D00'; // Red
    }
    
    // 3 & 5. Manager ORANGE untuk kondisi lainnya
    // (bawahan READY < 50% dan < 2 orang, atau semua orange)
    return '#F59E02'; // Orange
  };
  
  const needSuccessorsColor = getNeedSuccessorsColor();
  
  // Use readiness score from employee data (editable in Data Editor)
  // If not available, use calculated fallback based on competency score
  const getPromotionReadinessPercentage = (): number => {
    // If readinessScore exists in data, use it
    if (employee.readinessScore !== undefined && employee.readinessScore !== null) {
      return employee.readinessScore;
    }
    
    // Fallback calculation based on competency score
    const currentScore = employee.competencyScore;
    if (currentScore >= 91) {
      return Math.round(currentScore * 0.92);
    } else if (currentScore >= 76) {
      return Math.round(currentScore * 0.88);
    } else if (currentScore >= 66) {
      return Math.round(currentScore * 0.80);
    } else {
      return Math.round(currentScore * 0.72);
    }
  };
  
  const promotionReadinessPercentage = getPromotionReadinessPercentage();

  // Check if this is a vacant position
  const isVacant = employee.name === '(Vacant)';

  // Check if employee has actual readiness data from CSV (not calculated fallback)
  const hasReadinessData = employee.readinessScore !== undefined && employee.readinessScore !== null;

  // Show promotion tag on ALL cards in all tabs
  const showPromotionTag = true;

  // Get color based on percentage range using readiness score heatmap config
  const getTagColor = (percentage: number): string => {
    // For vacant positions or no data, always return red
    if (isVacant || !hasReadinessData) {
      return '#FF0004'; // Red for vacant
    }
    
    const ranges = heatmapConfig.readinessScore;
    
    // Find which range the percentage falls into
    for (const range of ranges) {
      if (percentage >= range.min && percentage <= range.max) {
        return range.color;
      }
    }
    
    // Fallback: use first or last range
    if (percentage < ranges[0].min) {
      return ranges[0].color;
    }
    return ranges[ranges.length - 1].color;
  };
  
  const tagColor = getTagColor(promotionReadinessPercentage);
  
  // Extract first name from full name
  const firstName = employee.name.split(' ')[0];

  // For need-successors-copy mode: determine if this card should show heatmap
  const shouldShowHeatmapInV2Mode = (): boolean => {
    if (heatmapMode !== 'need-successors-copy') {
      return true; // Not in v2 mode, show normally
    }
    
    if (!selectedCardInV2Mode) {
      // No card selected: show heatmap for all managers (like need-successors mode)
      return hasReports;
    }
    
    // A card is selected
    // Show heatmap if:
    // 1. This is the selected card
    if (employee.id === selectedCardInV2Mode) {
      return true;
    }
    
    // 2. This card is a subordinate (direct report) of the selected card
    if (employee.managerId === selectedCardInV2Mode) {
      return true;
    }
    
    // 3. This card is an additional successor of the selected card
    const selectedEmployee = allEmployees.find(emp => emp.id === selectedCardInV2Mode);
    if (selectedEmployee?.additionalSuccessors?.includes(employee.id)) {
      return true;
    }
    
    return false; // Don't show heatmap for this card
  };
  
  const showHeatmapForThisCard = shouldShowHeatmapInV2Mode();
  
  // Determine if this is a successor/subordinate (not the manager itself) in V2 mode
  const isSubordinateInV2Mode = !!(heatmapMode === 'need-successors-copy'
    && selectedCardInV2Mode
    && employee.id !== selectedCardInV2Mode
    && (employee.managerId === selectedCardInV2Mode || allEmployees.find(emp => emp.id === selectedCardInV2Mode)?.additionalSuccessors?.includes(employee.id)));
  
  // Handle card click in V2 mode
  const handleCardClick = () => {
    // Always open employee detail panel
    onEmployeeClick(employee);
    
    if (heatmapMode === 'need-successors-copy' && onCardClickInV2Mode) {
      // Only allow selection of managers (employees with subordinates)
      if (!hasReports) {
        // Non-manager card - just open panel, don't change selection
        return;
      }
      
      // Toggle: if clicking the same card, deselect it
      if (selectedCardInV2Mode === employee.id) {
        onCardClickInV2Mode(null as any); // Will reset to null
      } else {
        onCardClickInV2Mode(employee.id);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Promotion Readiness Tag - Above card, on the connector line */}
      {showPromotionTag && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="mb-1 px-2 py-0.5 border rounded-full bg-white z-20 text-[8px] cursor-help flex items-center gap-1"
                style={{ borderColor: tagColor }}
              >
                {employee.activeIDP && !isVacant && (
                  <TrendingUp 
                    className="w-[10px] h-[10px]" 
                    style={{ color: tagColor }}
                    strokeWidth={2.5}
                  />
                )}
                <span
                  className="font-['Open_Sans',_sans-serif] text-[8px] font-bold font-normal"
                  style={{ color: tagColor }}
                >
                  {(isVacant || !hasReadinessData) ? '-' : `${promotionReadinessPercentage}%`}
                </span>
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
                        <span className="text-[#016699] font-bold">ðŸš€ Sedang menjalankan IDP</span>
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
        {/* Employee Card */}
        <div
          className="relative"
          style={isSimulationMode && simulatedEmployeeIds?.has(employee.id) ? {
            outline: '2px solid #016699',
            outlineOffset: 4,
            borderRadius: 8,
            background: 'rgba(1,102,153,0.06)',
          } : undefined}
        >
          <OrgChartCard
            name={employee.name}
            position={employee.position}
            jobTitle={employee.jobTitle}
            competencyScore={employee.competencyScore}
            successors={allEmployees.filter(e => e.managerId === employee.id).length}
            imageUrl={employee.imageUrl}
            performanceRating={employee.performanceRating}
            showHeatmap={showHeatmapForThisCard && showHeatmap}
            heatmapStyle={heatmapStyle}
            heatmapMode={heatmapMode}
            hasLowPerformingSubordinates={hasLowPerformingSubordinates}
            lowestSubordinateScale={lowestSubordinateScale}
            criticalPosition={employee.criticalPosition}
            onClick={handleCardClick}
            visibleColumns={visibleColumns}
            gender={employee.gender}
            city={employee.city}
            maritalStatus={employee.maritalStatus}
            performance={employee.performance}
            iq={employee.iq}
            capability={employee.capabilityScore}
            commitment={employee.commitmentScore}
            contribution={employee.contributionScore}
            heatmapRanges={heatmapRanges}
            readinessScore={promotionReadinessPercentage}
            needSuccessorsColor={isSubordinateInV2Mode ? null : needSuccessorsColor}
            employeeId={employee.id}
            allEmployees={allEmployees}
            readinessScoreRanges={heatmapConfig.readinessScore}
            isSubordinateInV2Mode={isSubordinateInV2Mode}
            selectedCardInV2Mode={selectedCardInV2Mode}
            maxCardHeight={maxCardHeight}
            highlighted={highlightedEmployeeId === employee.id}
          />
          
          {/* Expand/Collapse Button */}
          {hasReports && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
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
                {/* Horizontal connector segments drawn from card center outward to siblings.
                    Each column draws its own half-segment, so the line always aligns
                    with the actual card centers regardless of column width. */}
                {!isOnly && (
                  <>
                    {/* Left half-segment: connects to the sibling on the left */}
                    {!isFirst && (
                      <div className="absolute h-px bg-[#016699]" style={{ top: 0, left: 0, right: '50%' }} />
                    )}
                    {/* Right half-segment: connects to the sibling on the right */}
                    {!isLast && (
                      <div className="absolute h-px bg-[#016699]" style={{ top: 0, left: '50%', right: 0 }} />
                    )}
                  </>
                )}
                {/* Vertical stalk from horizontal connector down to child card */}
                <div className="w-px bg-[#016699] h-6" />
                <OrgNode employee={report} level={level + 1} showHeatmap={showHeatmap} heatmapStyle={heatmapStyle} heatmapMode={heatmapMode} onEmployeeClick={onEmployeeClick} managerPosition={employee.position} visibleColumns={visibleColumns} heatmapRanges={heatmapRanges} heatmapConfig={heatmapConfig} allEmployees={allEmployees} selectedCardInV2Mode={selectedCardInV2Mode} onCardClickInV2Mode={onCardClickInV2Mode} highlightedEmployeeId={highlightedEmployeeId} isSimulationMode={isSimulationMode} simulatedEmployeeIds={simulatedEmployeeIds} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [zoom, setZoom] = useState(45);
  const [position, setPosition] = useState({ x: 0, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // Read initial tab from URL query param (e.g. ?tab=succession-risk).
  // Lets embedders open the iframe directly on a specific tab.
  const initialTabState = (() => {
    if (typeof window === 'undefined') return { tab: 'all', heatmap: false, mode: 'performance' as const };
    const param = new URLSearchParams(window.location.search).get('tab');
    if (param === 'succession-risk' || param === 'need-successors-copy') {
      return { tab: 'need-successors-copy', heatmap: true, mode: 'need-successors-copy' as const };
    }
    if (param === 'need-develop' || param === 'need-development') {
      return { tab: 'need-develop', heatmap: true, mode: 'need-develop' as const };
    }
    return { tab: 'all', heatmap: false, mode: 'performance' as const };
  })();
  const [showHeatmap, setShowHeatmap] = useState(initialTabState.heatmap);
  const heatmapStyle = 'glow' as const; // Always use glow effect
  const [heatmapMode, setHeatmapMode] = useState<'performance' | 'successor-risk' | 'need-successors' | 'need-develop' | 'need-successors-copy'>(initialTabState.mode);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState(initialTabState.tab);
  const [selectedCardInV2Mode, setSelectedCardInV2Mode] = useState<string | null>(null);
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
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [highlightedEmployeeId, setHighlightedEmployeeId] = useState<string | null>(null);
  const [isVariableDialogOpen, setIsVariableDialogOpen] = useState(false);

  // Simulation mode state
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [pendingSwaps, setPendingSwaps] = useState<SimulationSwap[]>([]);
  const [simulationApplied, setSimulationApplied] = useState(false);
  const [initialSimulationTargetId, setInitialSimulationTargetId] = useState<string | null>(null);

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

  const handleZoomToEmployee = (employeeId: string) => {
    setHighlightedEmployeeId(employeeId);
    setTimeout(() => setHighlightedEmployeeId(null), 3000);
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
            setTimeout(() => handleZoomToEmployee(match.id), 600);
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
  const getCurrentHeatmapRanges = (): HeatmapRange[] => {
    // Performance and Need-develop modes use Competency Score (5-level gradasi)
    if (heatmapMode === 'performance' || heatmapMode === 'need-develop') {
      return heatmapConfig.needDevelop;
    }
    // Successor-risk and need-successors modes use Readiness Score (3-level)
    else if (heatmapMode === 'successor-risk' || heatmapMode === 'need-successors' || heatmapMode === 'need-successors-copy') {
      return heatmapConfig.readinessScore;
    }
    // Fallback to needDevelop ranges (Competency Score)
    return heatmapConfig.needDevelop;
  };

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
  
  // Apply swaps to employee list for simulation
  const applySwaps = (emps: Employee[], swaps: SimulationSwap[]): Employee[] => {
    let result = emps.map(e => ({ ...e }));
    for (const swap of swaps) {
      const idxA = result.findIndex(e => e.id === swap.aId);
      const idxB = result.findIndex(e => e.id === swap.bId);
      if (idxA === -1 || idxB === -1) continue;
      const a = result[idxA] as Record<string, unknown>;
      const b = result[idxB] as Record<string, unknown>;
      // Swap only personal identity data — structure (position, jobTitle, managerId) stays fixed
      const personalFields = ['name', 'imageUrl', 'competencyScore', 'readinessScore', 'performanceRating', 'gender', 'city', 'maritalStatus', 'iq', 'capability', 'commitment', 'contribution'] as const;
      for (const field of personalFields) {
        const tmp = a[field];
        a[field] = b[field];
        b[field] = tmp;
      }
    }
    return result;
  };

  const simulatedEmployees = isSimulationMode ? applySwaps(employees, pendingSwaps) : employees;
  const simulatedOrgChart = buildOrgChart(simulatedEmployees);
  const simulatedEmployeeIds = new Set(pendingSwaps.flatMap(s => [s.aId, s.bId]));

  const handleSimulationAddSwap = (swap: SimulationSwap) => {
    const alreadySwapped = pendingSwaps.some(
      s => (s.aId === swap.aId && s.bId === swap.bId) || (s.aId === swap.bId && s.bId === swap.aId)
    );
    if (alreadySwapped) { toast.info('Swap ini sudah ada.'); return; }
    setPendingSwaps(prev => [...prev, swap]);
    const nameA = employees.find(e => e.id === swap.aId)?.name?.split(' ')[0] ?? swap.aId;
    const nameB = employees.find(e => e.id === swap.bId)?.name?.split(' ')[0] ?? swap.bId;
    toast.success(`Swap ditambahkan: ${nameA} ⇄ ${nameB}`);
  };

  const handleSimulationApply = () => {
    setSimulationApplied(true);
    toast.success('Simulasi diterapkan ke canvas.');
  };

  const handleSimulationReset = () => {
    setPendingSwaps([]);
    setSimulationApplied(false);
    toast.info('Semua swap direset.');
  };

  const handleSimulationClose = () => {
    setIsSimulationMode(false);
    setPendingSwaps([]);
    setSimulationApplied(false);
  };

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
            className="fixed top-20 z-50 flex gap-0"
            style={{ left: "calc(var(--sidebar-w, 220px) + 4px)" }}
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
                className="flex gap-[8px] items-center px-[12px] py-[8px] rounded-[28px] hover:bg-gray-50"
              >
                <Plus className="w-5 h-5 text-[#016699]" />
                <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#016699] font-bold">Variable</span>
              </button>
            </div>
          </div>
        )}

        {/* Succession Risk Modal - Top right corner (only in Succession Risk tab) */}
        {viewMode === 'chart' && activeTab === 'need-successors-copy' && showHeatmap && (
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
        {viewMode === 'chart' && activeTab === 'need-develop' && showHeatmap && (
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
        {(activeTab === 'need-successors' || activeTab === 'need-successors-copy') ? (
          <SuccessionPanel
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
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
        ) : activeTab === 'need-develop' ? (
          <EmployeeDetailPanel
            employee={selectedEmployee}
            onClose={() => setSelectedEmployee(null)}
            onNavigateToDetail={handleNavigateToDetail}
            onNavigateToIDP={handleNavigateToIDP}
            onShowIDPProgress={handleShowIDPProgress}
          />
        ) : null}
      </div>

      {/* Simulation Panel */}
      {isSimulationMode && (
        <SimulationPanel
          swaps={pendingSwaps}
          employees={employees}
          simulatedEmployees={simulatedEmployees}
          onRemoveSwap={(i) => setPendingSwaps(prev => prev.filter((_, idx) => idx !== i))}
          onAddSwap={handleSimulationAddSwap}
          onApply={handleSimulationApply}
          onReset={handleSimulationReset}
          onClose={handleSimulationClose}
          initialTargetId={initialSimulationTargetId}
        />
      )}

      {/* Combined Top Bar - Tab Filter + View Mode Toggle */}
      <div
        data-no-drag
        className="fixed top-0 right-0 bg-white shadow-lg z-50 px-4 flex flex-col"
        style={{ left: "var(--sidebar-w, 220px)" }}
      >
        <AppBreadcrumb noPadding items={[{ label: "Vismap" }]} />
        {/* Tab Filter row */}
        <div className="flex items-center justify-between py-2">
        <TabFilter activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'need-develop') {
            setShowHeatmap(true);
            setHeatmapMode('need-develop');
            setSelectedCardInV2Mode(null); // Reset selection when changing tabs
          } else if (tab === 'need-successors') {
            setShowHeatmap(true);
            setHeatmapMode('need-successors');
            setSelectedCardInV2Mode(null); // Reset selection when changing tabs
          } else if (tab === 'need-successors-copy') {
            setShowHeatmap(true);
            setHeatmapMode('need-successors-copy');
            // Don't reset selectedCardInV2Mode here - keep it when staying in the same tab
          } else if (tab === 'all') {
            setShowHeatmap(false);
            setHeatmapMode('performance'); // Reset to default mode
            setSelectedCardInV2Mode(null); // Reset selection when changing tabs
          }
        }} />

        {/* View Mode Toggle */}
        <div className="flex gap-2 items-center">
          {/* Simulate Button */}
          {viewMode === 'chart' && (
            <button
              onClick={() => {
                if (isSimulationMode) {
                  handleSimulationClose();
                } else {
                  setIsSimulationMode(true);
                  setPendingSwaps([]);
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
            position: 'fixed', top: 64, left: 0, right: 300, zIndex: 49,
            background: '#fef3c7', borderBottom: '1px solid #fbbf24',
            padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: '#92400e',
          }}
        >
          <Shuffle size={13} />
          <strong>Simulation Mode aktif</strong> — Pilih employee di panel kiri untuk mensimulasikan pertukaran posisi.
          {pendingSwaps.length > 0 && (
            <span style={{ marginLeft: 8, background: '#f59e0b', color: 'white', borderRadius: 20, padding: '1px 8px', fontWeight: 700, fontSize: 10 }}>
              {pendingSwaps.length} swap pending
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
      <div className="absolute inset-0" style={{ paddingTop: '64px' }}>
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
                    showHeatmap={showHeatmap}
                    heatmapStyle={heatmapStyle}
                    heatmapMode={heatmapMode}
                    onEmployeeClick={(emp) => {
                      // Only allow card selection on tabs with panels
                      if (activeTab !== 'all' && !isSimulationMode) {
                        setSelectedEmployee(emp);
                      }
                    }}
                    visibleColumns={visibleColumns}
                    heatmapRanges={getCurrentHeatmapRanges()}
                    heatmapConfig={heatmapConfig}
                    allEmployees={isSimulationMode ? simulatedEmployees : employees}
                    selectedCardInV2Mode={selectedCardInV2Mode}
                    onCardClickInV2Mode={(employeeId) => {
                      if (employeeId === null) {
                        setSelectedCardInV2Mode(null);
                      } else {
                        setSelectedCardInV2Mode(employeeId);
                      }
                    }}
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
