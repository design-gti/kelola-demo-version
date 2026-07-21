import svgPaths from "../imports/svg-mk5wxcpy2w";
import { ImageLoader } from './ImageLoader';
import { AlertCircle, TrendingUp, Armchair, UserPlus, User, UserX } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface HeatmapRange {
  color: string;
  min: number;
  max: number;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  jobTitle: string;
  competencyScore: number;
  successors: number;
  managerId?: string;
  readinessScore?: number;
  additionalSuccessors?: string[];
  reports?: Employee[];
}

interface OrgChartCardProps {
  name: string;
  position: string;
  jobTitle: string;
  competencyScore: number;
  successors: number;
  imageUrl?: string;
  performanceRating?: number;
  showHeatmap?: boolean;
  heatmapStyle?: 'gradient' | 'border' | 'glow';
  heatmapMode?: 'performance' | 'successor-risk' | 'need-successors' | 'need-develop' | 'need-successors-copy';
  hasLowPerformingSubordinates?: boolean;
  lowestSubordinateScale?: number; // 1, 2, or 3 - lowest scale among subordinates
  criticalPosition?: boolean; // Critical position indicator
  onClick?: () => void;
  visibleColumns?: {
    gender: boolean;
    city: boolean;
    maritalStatus: boolean;
    performance: boolean;
    iq: boolean;
    capability: boolean;
    commitment: boolean;
    contribution: boolean;
  };
  gender?: string;
  city?: string;
  maritalStatus?: string;
  performance?: number;
  iq?: number;
  capability?: number;
  commitment?: number;
  contribution?: number;
  heatmapRanges: HeatmapRange[];
  readinessScore?: number;
  needSuccessorsColor?: string | null;
  employeeId?: string;
  allEmployees?: Employee[];
  readinessScoreRanges?: HeatmapRange[];
  activeIDP?: boolean;
  onShowIDPProgress?: () => void;
  isSubordinateInV2Mode?: boolean; // True if this is a subordinate/successor in need-successors-copy mode
  selectedCardInV2Mode?: string | null; // ID of the selected manager card in v2 mode
  maxCardHeight?: number; // Maximum card height from parent
  highlighted?: boolean; // Highlighted from search
}

// Helper function to convert hex to rgba
function hexToRgba(hex: string, opacity: number = 1): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 0, 0, ${opacity})`;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Get color based on score and custom ranges
function getColorFromRanges(score: number, ranges: HeatmapRange[], opacity: number = 0.7): string {
  // Find which range the score falls into
  for (const range of ranges) {
    if (score >= range.min && score <= range.max) {
      return hexToRgba(range.color, opacity);
    }
  }
  
  // Fallback: use first or last range
  if (score < ranges[0].min) {
    return hexToRgba(ranges[0].color, opacity);
  }
  return hexToRgba(ranges[ranges.length - 1].color, opacity);
}

function getHeatmapColor(score: number, ranges: HeatmapRange[], opacity: number = 0.7): string {
  return getColorFromRanges(score, ranges, opacity);
}

function getDiscreteHeatmapColor(score: number, ranges: HeatmapRange[]): { border: string; bg: string } {
  const color = getColorFromRanges(score, ranges, 0.7);
  const bgColor = getColorFromRanges(score, ranges, 0.15);
  
  return { border: color, bg: bgColor };
}

function Frame3435({ position, jobTitle, name, showSwapped }: { position: string; jobTitle: string; name?: string; showSwapped?: boolean }) {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 text-[#58595b] w-full">
      {showSwapped ? (
        <p className="[white-space-collapse:collapse] font-['Open_Sans',_sans-serif] leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[8px] text-nowrap w-full font-bold font-normal text-center">
          {name || position}
        </p>
      ) : (
        <>
          <p className="[white-space-collapse:collapse] font-['Open_Sans',_sans-serif] leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[6.353px] text-nowrap w-full">
            {position}
          </p>
          <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[5.294px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">[{jobTitle}]</p>
          </div>
        </>
      )}
    </div>
  );
}

function Component9({ position, jobTitle, name, showSwapped }: { position: string; jobTitle: string; name?: string; showSwapped?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[2.118px] h-[16px] items-center relative rounded-[4.235px] shrink-0 w-full" data-name="Component 9">
      <Frame3435 position={position} jobTitle={jobTitle} name={name} showSwapped={showSwapped} />
    </div>
  );
}

function Frame45153({ competencyScore }: { competencyScore: number }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 text-[#58595b] text-[5.294px] w-full">
      <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center relative shrink-0 w-[53.996px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] text-[6px]">Competency Score</p>
      </div>
      <div className="flex flex-col font-['Open_Sans',_sans-serif] font-bold justify-center relative shrink-0 text-right w-[32.821px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] text-[6px]">{competencyScore}%</p>
      </div>
    </div>
  );
}

function Group3595({ competencyScore }: { competencyScore: number }) {
  const width = (competencyScore / 100) * 95.817;
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0 w-full">
      <div className="[grid-area:1_/_1] bg-[#dee2e6] h-[4.235px] ml-0 mt-0 rounded-[2.118px] w-[95.817px]" />
      <div className="[grid-area:1_/_1] bg-[#016699] h-[4.235px] ml-0 mt-0 rounded-[2.118px]" style={{ width: `${width}px` }} />
    </div>
  );
}

function CompetencyScore({ competencyScore }: { competencyScore: number }) {
  return (
    <div className="content-stretch flex flex-col gap-[2.118px] h-[13.352px] items-start leading-[0] relative shrink-0 w-full" data-name="Competency Score">
      <Frame45153 competencyScore={competencyScore} />
      <Group3595 competencyScore={competencyScore} />
    </div>
  );
}

function Button({ successors }: { successors: number }) {
  return (
    <div className="box-border content-stretch flex gap-[2.118px] items-center px-[8px] py-[4px] relative rounded-[14.936px] shrink-0" data-name="button">
      <p className="font-['Open_Sans',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[7.411px] text-nowrap whitespace-pre">{successors}</p>
    </div>
  );
}

function Successors({ successors, readyCount }: { successors: number; readyCount: number }) {
  return (
    <div className="content-stretch flex h-[14.822px] items-center justify-between relative shrink-0 w-full" data-name="Successors">
      <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#58595b] text-[6.353px] w-[53.996px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] text-[6px] font-bold">Successors Ready</p>
      </div>
      <Button successors={readyCount} />
    </div>
  );
}

function AdditionalInfo({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 text-[#58595b] text-[5.294px] w-full">
      <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] text-[6px]">{label}</p>
      </div>
      <div className="flex flex-col font-['Open_Sans',_sans-serif] font-bold justify-center relative shrink-0 text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] text-[6px]">{value}</p>
      </div>
    </div>
  );
}

function VariableScore({ position, jobTitle, competencyScore, successors, visibleColumns, gender, city, maritalStatus, performance, iq, capability, commitment, contribution, readySuccessorsCount, name, showSwapped }: { position: string; jobTitle: string; competencyScore: number; successors: number; visibleColumns?: { gender: boolean; city: boolean; maritalStatus: boolean; performance: boolean; iq: boolean; capability: boolean; commitment: boolean; contribution: boolean; }; gender?: string; city?: string; maritalStatus?: string; performance?: number; iq?: number; capability?: number; commitment?: number; contribution?: number; readySuccessorsCount: number; name?: string; showSwapped?: boolean; }) {
  const additionalFields = [];

  if (visibleColumns?.gender && gender) {
    additionalFields.push({ label: 'Gender', value: gender });
  }
  if (visibleColumns?.city && city) {
    additionalFields.push({ label: 'City', value: city });
  }
  if (visibleColumns?.maritalStatus && maritalStatus) {
    additionalFields.push({ label: 'Marital Status', value: maritalStatus });
  }
  if (visibleColumns?.performance) {
    additionalFields.push({ label: 'Performance', value: performance ?? '-' });
  }
  if (visibleColumns?.iq) {
    additionalFields.push({ label: 'IQ', value: iq ?? '-' });
  }
  if (visibleColumns?.capability) {
    additionalFields.push({ label: 'Capability', value: capability ?? '-' });
  }
  if (visibleColumns?.commitment) {
    additionalFields.push({ label: 'Commitment', value: commitment ?? '-' });
  }
  if (visibleColumns?.contribution) {
    additionalFields.push({ label: 'Contribution', value: contribution ?? '-' });
  }

  return (
    <div className={`relative content-stretch flex flex-col ${showSwapped ? 'gap-[7px]' : 'gap-[12px]'} items-start w-full px-[7px] py-[10px]`} data-name="Variable Score">
      {showSwapped && (
        <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[5.294px] w-full text-center">
          <p className="leading-[normal] text-[7px]">[{jobTitle}]</p>
        </div>
      )}
      <Component9 position={position} jobTitle={jobTitle} name={name} showSwapped={showSwapped} />
      <CompetencyScore competencyScore={competencyScore} />
      <Successors successors={successors} readyCount={readySuccessorsCount} />
      {additionalFields.length > 0 && (
        <div className="flex flex-col gap-[4px] w-full mt-[2px]">
          {additionalFields.map((field, index) => (
            <AdditionalInfo key={index} label={field.label} value={field.value} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmployeFoto({ name, imageUrl, showChairIcon, position, showSwapped, jobTitle }: { name: string; imageUrl?: string; showChairIcon?: boolean; position?: string; showSwapped?: boolean; jobTitle?: string }) {
  const displayText = showSwapped ? (position || name) : name;
  const isEmptyName = !name?.trim();
  const isVacantMarker = name === '(Vacant)';
  const isVacant = isVacantMarker || isEmptyName;

  return (
    <div className={`absolute left-1/2 overflow-clip w-full h-[109px] top-[-0.28px] translate-x-[-50%]`} style={{ backgroundColor: isVacant ? '#9e9e9e' : '#d6e6ff' }} data-name="Employe Foto">
      {isEmptyName ? (
        // Empty name: gray background only, no icon
        null
      ) : isVacantMarker ? (
        // Vacant position marker: show UserX icon
        <div className="absolute inset-0 flex items-center justify-center -translate-y-3">
          <UserX className="w-[60px] h-[60px] text-[#ffffff]" strokeWidth={1.5} />
        </div>
      ) : showChairIcon ? (
        // Need Successors v2 mode: show Armchair icon
        <div className="absolute inset-0 flex items-center justify-center -translate-y-3">
          <Armchair className="w-[60px] h-[60px] text-[#818181]" strokeWidth={1.5} />
        </div>
      ) : imageUrl ? (
        <div className="absolute inset-0 overflow-hidden">
          <ImageLoader
            imageUrl={imageUrl}
            alt={name}
            className="absolute size-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center -translate-y-3">
          <User className="w-[60px] h-[60px] text-[#016699]" strokeWidth={1.5} />
        </div>
      )}
      {!showSwapped && (
        <div className="absolute bg-gradient-to-b bottom-[-0.35px] from-[3.968%] from-[rgba(2,2,2,0)] h-[33.351px] left-[calc(50%+0.026px)] mix-blend-multiply to-[148.41%] to-[rgba(0,0,0,0.48)] translate-x-[-50%] w-full" />
      )}
      {showSwapped ? (
        <>
          <div className="absolute flex flex-col font-['Open_Sans',_sans-serif] justify-center leading-[0] left-[calc(50%+0.468px)] not-italic text-[7.411px] text-center text-white top-[95px] translate-x-[-50%] translate-y-[-50%] w-full px-2">
            <p className="leading-[normal] text-[rgb(0,0,0)] font-bold">{displayText.toUpperCase()}</p>
          </div>
        </>
      ) : (
        <div className="[text-shadow:rgba(0,0,0,0.6)_1.059px_1.059px_7.941px] absolute flex flex-col font-['Open_Sans',_sans-serif] justify-center leading-[0] left-[calc(50%+0.468px)] not-italic text-[7.411px] text-center text-white top-[100px] translate-x-[-50%] translate-y-[-50%] w-full px-4">
          <p className="leading-[normal] text-white font-bold text-[8px] -translate-y-[3px]">{displayText.toUpperCase()}</p>
        </div>
      )}
    </div>
  );
}

export default function OrgChartCard({ name, position, jobTitle, competencyScore, successors, imageUrl, performanceRating, showHeatmap, heatmapStyle = 'gradient', heatmapMode = 'performance', hasLowPerformingSubordinates, lowestSubordinateScale = 0, criticalPosition, onClick, visibleColumns, gender, city, maritalStatus, performance, iq, capability, commitment, contribution, heatmapRanges, readinessScore = 0, needSuccessorsColor = null, employeeId, allEmployees = [], readinessScoreRanges = [], activeIDP, onShowIDPProgress, isSubordinateInV2Mode = false, selectedCardInV2Mode = null, maxCardHeight, highlighted }: OrgChartCardProps) {
  // Calculate ready successors count (successors with green/READY readiness score)
  const getReadySuccessorsCount = (): number => {
    if (!employeeId || !allEmployees || allEmployees.length === 0 || readinessScoreRanges.length === 0) {
      return 0;
    }
    
    // Find current employee
    const currentEmployee = allEmployees.find(emp => emp.id === employeeId);
    if (!currentEmployee) {
      return 0;
    }
    
    // Get all successors â€” prefer CSV successorIds, fall back to direct reports
    const csvSuccessorIds = currentEmployee.successorIds || [];
    const directReports = allEmployees.filter(emp => emp.managerId === employeeId);
    const additionalSuccessorIds = currentEmployee.additionalSuccessors || [];
    const additionalSuccessors = allEmployees.filter(emp =>
      additionalSuccessorIds.includes(emp.id) && !csvSuccessorIds.includes(emp.id)
    );
    const primarySuccessors = csvSuccessorIds.length > 0
      ? allEmployees.filter(emp => csvSuccessorIds.includes(emp.id))
      : directReports;
    const allSuccessors = [...primarySuccessors, ...additionalSuccessors];
    
    // Get green/READY range (highest range = READY)
    const sortedRanges = [...readinessScoreRanges].sort((a, b) => a.min - b.min);
    const readyRange = sortedRanges[sortedRanges.length - 1]; // Highest range
    
    if (!readyRange) {
      return 0;
    }
    
    // Count successors with readiness score in READY range
    const readyCount = allSuccessors.filter(successor => {
      const score = successor.readinessScore;
      if (score === undefined || score === null) {
        return false;
      }
      return score >= readyRange.min && score <= readyRange.max;
    }).length;
    
    return readyCount;
  };
  
  const readySuccessorsCount = getReadySuccessorsCount();
  
  // Determine which score to use based on heatmap mode
  // For performance mode: Use Competency Score
  // For need-develop mode: Use Competency Score (untuk gradasi 5-level merah-kuning-hijau)
  // For successor-risk mode: Use Readiness Score
  // For need-successors mode: Use fixed color from calculation
  const getScoreForHeatmap = (): number => {
    if (heatmapMode === 'performance' || heatmapMode === 'need-develop') {
      // Performance or Need Develop - use Competency Score
      return competencyScore;
    } else if (heatmapMode === 'successor-risk') {
      // Successor Risk - use Readiness Score
      return readinessScore;
    } else {
      // Need Successors - will use fixed color, return 0
      return 0;
    }
  };
  
  const heatmapScore = getScoreForHeatmap();
  
  // Check if employee has actual subordinates (direct reports)
  const hasSubordinates = employeeId && allEmployees.length > 0 
    ? allEmployees.some(emp => emp.managerId === employeeId)
    : false;
  
  // Debug log for need-successors mode
  if (heatmapMode === 'need-successors' && showHeatmap) {
    console.log(`[Need Successors] ${name}:`, {
      employeeId,
      hasSubordinates,
      needSuccessorsColor,
      shouldShow: needSuccessorsColor !== null && hasSubordinates,
      allEmployeesCount: allEmployees.length
    });
  }
  
  // Check if this is a vacant position
  const isVacant = name === '(Vacant)' || !name?.trim();
  
  // For successor-risk mode: Only show heatmap for employees with readiness score
  // For performance mode: Show heatmap for all employees
  // For need-develop mode: Show heatmap for all employees EXCEPT vacant positions
  // For need-successors mode: Only show heatmap for managers with needSuccessorsColor AND has subordinates
  // For need-successors-copy mode: Show for managers (with needSuccessorsColor) OR subordinates (with readinessScore)
  const shouldShowHeatmap = showHeatmap && (
    (heatmapMode === 'performance') ||
    (heatmapMode === 'need-develop' && !isVacant) ||  // Don't show heatmap for vacant in need-develop mode
    (heatmapMode === 'successor-risk' && !!hasLowPerformingSubordinates && hasSubordinates) ||
    (heatmapMode === 'need-successors' && needSuccessorsColor !== null && hasSubordinates) ||
    (heatmapMode === 'need-successors-copy' && (needSuccessorsColor !== null || isSubordinateInV2Mode))
  );
  
  // For need-successors and need-successors-copy modes:
  // - Managers: use needSuccessorsColor (fixed color based on subordinates' readiness)
  // - Subordinates in V2 mode: use readinessScore with readinessScoreRanges
  const useReadinessScoreForSubordinate = (heatmapMode === 'need-successors-copy') && isSubordinateInV2Mode;
  const effectiveColor = heatmapMode === 'successor-risk' && hasLowPerformingSubordinates
    ? '#FE0D00'
    : (heatmapMode === 'need-successors' || heatmapMode === 'need-successors-copy') && !isSubordinateInV2Mode ? needSuccessorsColor : null;
  
  const getHeatmapOverlay = () => {
    if (!shouldShowHeatmap) return null;
    
    // For need-successors-copy mode (v2): Override readinessScoreRanges to use green instead of blue
    let effectiveReadinessScoreRanges = readinessScoreRanges;
    if (heatmapMode === 'need-successors-copy' && isSubordinateInV2Mode && readinessScoreRanges.length > 0) {
      // Replace the highest range color (READY level) with bright green
      effectiveReadinessScoreRanges = readinessScoreRanges.map((range, index) => {
        if (index === readinessScoreRanges.length - 1) {
          // Highest range - change to bright green (#B7FF00)
          return { ...range, color: '#B7FF00' };
        }
        return range;
      });
    }
    
    if (heatmapStyle === 'gradient') {
      // Diffused blur heatmap - multiple layers for realistic heat effect
      const rangesForSubordinate = useReadinessScoreForSubordinate && effectiveReadinessScoreRanges ? effectiveReadinessScoreRanges : heatmapRanges;
      const scoreForSubordinate = useReadinessScoreForSubordinate ? readinessScore : heatmapScore;
      
      return (
        <>
          {/* Outer glow - most diffused */}
          <div 
            className="absolute -inset-[60px] z-40 pointer-events-none transition-all duration-500"
            style={{ 
              backgroundColor: effectiveColor ? hexToRgba(effectiveColor, 0.6) : getHeatmapColor(scoreForSubordinate, rangesForSubordinate, 0.6),
              filter: 'blur(45px)',
              opacity: 0.7
            }}
          />
          {/* Middle glow */}
          <div 
            className="absolute -inset-[30px] z-40 pointer-events-none transition-all duration-500"
            style={{ 
              backgroundColor: effectiveColor ? hexToRgba(effectiveColor, 0.7) : getHeatmapColor(scoreForSubordinate, rangesForSubordinate, 0.7),
              filter: 'blur(25px)',
              opacity: 0.6
            }}
          />
          {/* Inner glow - card overlay */}
          <div 
            className="absolute inset-0 z-40 pointer-events-none rounded-[5px] transition-all duration-500"
            style={{ 
              backgroundColor: effectiveColor ? hexToRgba(effectiveColor, 0.25) : getHeatmapColor(scoreForSubordinate, rangesForSubordinate, 0.25),
              filter: 'blur(8px)'
            }}
          />
        </>
      );
    } else if (heatmapStyle === 'border') {
      // Discrete border style - overlay on top
      const rangesForSubordinate = useReadinessScoreForSubordinate && effectiveReadinessScoreRanges ? effectiveReadinessScoreRanges : heatmapRanges;
      const scoreForSubordinate = useReadinessScoreForSubordinate ? readinessScore : heatmapScore;
      
      const colors = effectiveColor 
        ? { border: hexToRgba(effectiveColor, 0.7), bg: hexToRgba(effectiveColor, 0.15) }
        : getDiscreteHeatmapColor(scoreForSubordinate, rangesForSubordinate);
      return (
        <>
          {/* Outer glow for border style */}
          <div 
            className="absolute -inset-[30px] z-40 pointer-events-none transition-all duration-500"
            style={{ 
              backgroundColor: colors.bg,
              filter: 'blur(20px)',
              opacity: 0.5
            }}
          />
          {/* Border overlay */}
          <div 
            className="absolute inset-0 z-40 pointer-events-none rounded-[5px] border-4 transition-all duration-300"
            style={{ 
              borderColor: colors.border,
              backgroundColor: colors.bg
            }}
          />
        </>
      );
    } else if (heatmapStyle === 'glow') {
      // Glow effect - overlay on top
      const rangesForSubordinate = useReadinessScoreForSubordinate && effectiveReadinessScoreRanges ? effectiveReadinessScoreRanges : heatmapRanges;
      const scoreForSubordinate = useReadinessScoreForSubordinate ? readinessScore : heatmapScore;
      
      const glowColorMedium = effectiveColor ? hexToRgba(effectiveColor, 0.5) : getHeatmapColor(scoreForSubordinate, rangesForSubordinate, 0.5);
      const glowColorLight = effectiveColor ? hexToRgba(effectiveColor, 0.25) : getHeatmapColor(scoreForSubordinate, rangesForSubordinate, 0.25);
      const glowColorStrong = effectiveColor ? hexToRgba(effectiveColor, 0.8) : getHeatmapColor(scoreForSubordinate, rangesForSubordinate, 0.8);
      const glowColorWeak = effectiveColor ? hexToRgba(effectiveColor, 0.3) : getHeatmapColor(scoreForSubordinate, rangesForSubordinate, 0.3);
      
      return (
        <>
          {/* Outer diffused glow */}
          <div 
            className="absolute -inset-[40px] z-40 pointer-events-none transition-all duration-500"
            style={{ 
              backgroundColor: glowColorMedium,
              filter: 'blur(30px)',
              opacity: 0.6
            }}
          />
          {/* Inner glow with shadow */}
          <div 
            className="absolute inset-0 z-40 pointer-events-none rounded-[5px] transition-all duration-300"
            style={{ 
              backgroundColor: glowColorLight,
              boxShadow: `0 0 20px ${glowColorStrong}, inset 0 0 15px ${glowColorWeak}`
            }}
          />
        </>
      );
    }
  };

  // Calculate dynamic height based on visible additional fields
  const additionalFieldsCount = [
    visibleColumns?.gender && gender,
    visibleColumns?.city && city,
    visibleColumns?.maritalStatus && maritalStatus,
    visibleColumns?.performance,
    visibleColumns?.iq,
    visibleColumns?.capability,
    visibleColumns?.commitment,
    visibleColumns?.contribution,
  ].filter(Boolean).length;
  
  const baseHeight = 200;
  const additionalHeight = additionalFieldsCount * 12; // 12px per additional field
  const cardHeight = baseHeight + additionalHeight;
  
  // In need-successors-copy mode:
  // - If NO card is selected (selectedCardInV2Mode is null): ALL cards show chair icon
  // - If a card IS selected:
  //   - Selected manager card: still shows chair icon
  //   - Successor cards (subordinates): show PHOTO
  //   - Other cards (not heatmapped): show chair icon
  const isCardHeatmappedInV2Mode = heatmapMode === 'need-successors-copy' && selectedCardInV2Mode && isSubordinateInV2Mode;
  
  // IMPORTANT: Only apply swapped layout when ACTUALLY in need-successors-copy mode
  const showSwapped = heatmapMode === 'need-successors-copy' && !isCardHeatmappedInV2Mode;
  
  // In need-successors-copy mode, only show photo if card is heatmapped (successors only)
  // In other modes, always use the provided imageUrl
  const effectiveImageUrl = (heatmapMode === 'need-successors-copy' && showSwapped) ? undefined : imageUrl;
  
  // Check if this is an additional successor (manually added, not direct report)
  const isAdditionalSuccessor = selectedCardInV2Mode && employeeId && allEmployees.length > 0 && (() => {
    const selectedManager = allEmployees.find(emp => emp.id === selectedCardInV2Mode);
    return selectedManager?.additionalSuccessors?.includes(employeeId) && employeeId !== selectedCardInV2Mode;
  })();
  
  // Check if this is a direct report
  const isDirectReport = selectedCardInV2Mode && employeeId && (() => {
    const currentEmp = allEmployees.find(emp => emp.id === employeeId);
    return currentEmp?.managerId === selectedCardInV2Mode;
  })();
  
  // Determine tooltip message for V2 mode
  const getV2ModeTooltip = (): string | null => {
    if (heatmapMode !== 'need-successors-copy' || !selectedCardInV2Mode) return null;
    
    const selectedManager = allEmployees.find(emp => emp.id === selectedCardInV2Mode);
    if (!selectedManager) return null;
    
    if (employeeId === selectedCardInV2Mode) {
      return `Manager dengan ${selectedManager.reports?.length || 0} bawahan langsung`;
    }
    
    if (isAdditionalSuccessor) {
      return `Successor yang ditambahkan manual untuk ${selectedManager.name}`;
    }
    
    if (isDirectReport) {
      return `Bawahan langsung dari ${selectedManager.name}`;
    }
    
    return null;
  };
  
  const v2Tooltip = getV2ModeTooltip();

  return (
    <div
      className="relative w-[135px] cursor-pointer group"
      style={{ height: maxCardHeight ? `${maxCardHeight}px` : `${cardHeight}px` }}
      data-name="Employee Card Wrapper"
      data-employee-id={employeeId}
      onClick={onClick}
    >
      {/* Highlight ring animation when searched */}
      {highlighted && (
        <div className="absolute -inset-[6px] z-50 pointer-events-none animate-pulse">
          <div 
            className="absolute inset-0 rounded-[8px] border-[4px] border-[#016699]"
            style={{
              boxShadow: '0 0 20px rgba(1, 102, 153, 0.8), 0 0 40px rgba(1, 102, 153, 0.5), inset 0 0 20px rgba(1, 102, 153, 0.3)'
            }}
          />
        </div>
      )}
      
      <div className="bg-white overflow-clip relative rounded-[8px] w-full min-h-full flex flex-col z-10 transition-all duration-300 hover:scale-105" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="relative w-full h-[109px] shrink-0">
          <EmployeFoto name={name} imageUrl={effectiveImageUrl} showChairIcon={showSwapped} position={position} showSwapped={showSwapped} jobTitle={jobTitle} />
        </div>
        <div className="flex-1 transition-all duration-500 ease-in-out">
          <VariableScore position={position} jobTitle={jobTitle} competencyScore={competencyScore} successors={successors} visibleColumns={visibleColumns} gender={gender} city={city} maritalStatus={maritalStatus} performance={performance} iq={iq} capability={capability} commitment={commitment} contribution={contribution} readySuccessorsCount={readySuccessorsCount} name={name} showSwapped={showSwapped} />
        </div>
        
        {/* Additional Successor Badge - only in V2 mode */}
        {isAdditionalSuccessor && isCardHeatmappedInV2Mode && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="absolute top-[2px] left-[2px] z-50 bg-[#016699] rounded-full p-[3px] shadow-md"
                  title="Additional Successor"
                >
                  <UserPlus className="w-[12px] h-[12px] text-white" strokeWidth={2.5} />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="font-['Open_Sans',_sans-serif] text-xs">Successor Tambahan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* V2 Mode Status Tooltip */}
        {v2Tooltip && isCardHeatmappedInV2Mode && (
          <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-black/80 text-white px-2 py-1 rounded text-[8px] whitespace-nowrap font-['Open_Sans',_sans-serif]">
              {v2Tooltip}
            </div>
          </div>
        )}
        
        {/* Critical Position Indicator */}
        {criticalPosition && (
          <div 
            className="absolute top-[2px] right-[2px] z-50 bg-red-500 rounded-full p-[3px] shadow-md"
            title="Critical Position"
          >
            <AlertCircle className="w-[12px] h-[12px] text-white" strokeWidth={2.5} />
          </div>
        )}
      </div>
      {getHeatmapOverlay()}
    </div>
  );
}
