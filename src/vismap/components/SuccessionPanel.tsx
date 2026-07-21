import { X, ChevronDown, ChevronUp, UserPlus, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";
import svgPaths from "../imports/svg-bqjp15cxvt";
import { Employee } from "../data/orgChartData";
import { generateDevelopmentData } from "../data/developmentData";
import { dataManager } from "../data/dataManager";
import { toast } from "sonner";
import AspectDevelopmentPanel, { IDPFormData } from "./AspectDevelopmentPanel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImageLoader } from './ImageLoader';
import { generateAIRecommendation, AIGeneratedRecommendation } from "../utils/aiIDPGenerator";

interface SuccessionPanelProps {
  employee: Employee | null;
  onClose: () => void;
  onCompare?: (manager: Employee, successors: Employee[]) => void;
  onIDPDialogChange?: (isOpen: boolean) => void;
  onAddSuccessorDialogChange?: (isOpen: boolean) => void;
  heatmapConfig?: any; // HeatmapConfig from HeatmapSettings
  onNavigateToDetail?: (employeeId: string) => void;
  onNavigateToIDP?: (employeeId: string) => void;
  onShowIDPProgress?: (employeeId: string) => void;
  allEmployees?: Employee[]; // CSV-loaded employees passed from parent
  onEmployeesChange?: (employees: Employee[]) => void; // Propagates successor mutations back to App state
}

function ChevronsRight() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="chevrons-right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="chevrons-right">
          <path d={svgPaths.p1f7b6fc0} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function InfoCircle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="info-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="info-circle">
          <path d={svgPaths.p30224ec0} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Check() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="check">
          <path d="M3.75 9L7.5 12.75L15 5.25" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function CompetencyGapCard({ name, score }: { name: string; score: number }) {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
              <div className="content-stretch flex items-center relative shrink-0">
                <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <p className="leading-[normal]">{name}</p>
                </div>
              </div>
              <InfoCircle />
            </div>
            <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
              <div className="basis-0 box-border content-stretch flex grow items-start min-h-px min-w-px pl-0 pr-px py-0 relative shrink-0" data-name="Score">
                {[1, 2, 3, 4, 5].map((box, idx) => {
                  const isChecked = box === score;
                  const isHighlighted = box === 3;
                  const isFirst = idx === 0;
                  const isLast = idx === 4;

                  return (
                    <div
                      key={box}
                      className={`basis-0 ${isChecked ? 'box-border content-stretch flex items-center justify-center' : ''} grow h-[24px] min-h-px min-w-px mr-[-1px] relative shrink-0 ${
                        isHighlighted ? 'bg-[#d6e6ff]' : 'bg-white'
                      } ${isFirst ? 'rounded-bl-[4px] rounded-tl-[4px]' : ''} ${
                        isLast ? 'rounded-br-[4px] rounded-tr-[4px]' : ''
                      }`}
                      data-name="Box"
                    >
                      <div aria-hidden="true" className={`absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none ${
                        isFirst ? 'rounded-bl-[4px] rounded-tl-[4px]' : ''
                      } ${isLast ? 'rounded-br-[4px] rounded-tr-[4px]' : ''}`} />
                      {isChecked && <Check />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClusterScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative size-full">
          <div className="content-stretch flex h-[16px] items-center leading-[0] relative shrink-0 text-[12px] w-full">
            <div className="flex flex-[1_0_0] flex-col font-['Open_Sans',_sans-serif] font-normal justify-center min-w-px relative text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[normal]">{label}</p>
            </div>
            <div className="flex flex-[1_0_0] flex-col font-['Avenir:Heavy',_sans-serif] justify-center min-w-px not-italic relative text-[#016699] text-right">
              <p className="leading-[normal]">{score}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IDPSection({ recommendation }: { recommendation: any }) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      {/* Competency chip */}
      <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
        <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
          <div className="bg-[#e7f5ff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
            <p className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#016699] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
              {recommendation.competency}
            </p>
          </div>
        </div>
      </div>
      
      {/* Success Measures */}
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="TextArea">
        <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Label">
          <p className="font-['Open_Sans',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre font-bold">Success Measures</p>
        </div>
        <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Input field">
          <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[16px]" />
          <div className="size-full">
            <div className="box-border content-stretch flex gap-[8px] items-start px-[12px] py-[8px] relative w-full">
              <div className="basis-0 flex flex-col font-['Open_Sans',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                <ul className="list-disc w-full">
                  {recommendation.successMeasures.map((measure: string, idx: number) => (
                    <li key={idx} className={idx === 0 ? "mb-0 ms-[18px]" : "ms-[18px]"}>
                      <span className="leading-[normal] block w-full">{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Programs */}
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="TextArea">
        <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Label">
          <p className="font-['Open_Sans',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre font-bold">Program</p>
        </div>
        <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Input field">
          <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[16px]" />
          <div className="size-full">
            <div className="box-border content-stretch flex flex-col gap-[8px] items-start px-[12px] py-[8px] relative w-full">
              {recommendation.programs.map((program: any, idx: number) => (
                <div key={idx} className="w-full">
                  <div className="bg-[#f8f9fa] box-border inline-flex gap-[4px] items-center justify-center px-[6px] py-[1px] relative rounded-[800px] shrink-0" data-name="Chip">
                    <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[800px]" />
                    <p className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {program.type}
                    </p>
                  </div>
                  <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center leading-[0] min-w-full relative shrink-0 text-[#495057] text-[12px] w-full mt-2" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <ul className="w-full">
                      <li className="list-disc ms-[18px]">
                        <span className="leading-[normal] block w-full">{program.description}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SuccessorCardProps {
  successor: Employee;
  index: number;
  onIDPDialogChange?: (isOpen: boolean) => void;
  isAdditional?: boolean; // True if manually added (not direct report)
  onRemove?: () => void; // Callback to remove additional successor
  heatmapConfig?: any; // HeatmapConfig for readiness score threshold
  onNavigateToDetail?: (employeeId: string) => void;
  onNavigateToIDP?: (employeeId: string) => void;
  onShowIDPProgress?: (employeeId: string) => void;
  onNavigateToProfile?: (employeeId: string) => void; // New handler for employee profile navigation
}

function SuccessorCard({ successor, index, onIDPDialogChange, isAdditional, onRemove, heatmapConfig, onNavigateToDetail, onNavigateToIDP, onShowIDPProgress, onNavigateToProfile }: SuccessorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false); // All successors collapsed by default
  const [isIDPProgressDialogOpen, setIsIDPProgressDialogOpen] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIGeneratedRecommendation[]>([]);
  const [showAIDialog, setShowAIDialog] = useState(false);
  
  // Check if successor has active IDP
  const hasActiveIDP = successor.activeIDP && successor.activeIDP.programs.length > 0;
  
  // Get competency details for gaps
  const { competencyDetails, idpRecommendations } = successor.competencyDetails && successor.idpRecommendations
    ? { competencyDetails: successor.competencyDetails, idpRecommendations: successor.idpRecommendations }
    : generateDevelopmentData(successor.id, successor.readinessScore || successor.competencyScore);
  
  // Filter aspects that need development (score < 3, which is the standard)
  const aspectsNeedDevelop = competencyDetails.filter(comp => comp.score < 3);
  
  // Calculate promotion readiness percentage (same logic as in App.tsx)
  const getPromotionReadinessPercentage = (): number => {
    // If readinessScore exists in data, use it
    if (successor.readinessScore !== undefined && successor.readinessScore !== null) {
      return successor.readinessScore;
    }
    
    // Fallback calculation based on competency score
    const currentScore = successor.competencyScore;
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

  // Determine status based on readiness percentage using heatmap config
  const getReadinessBadge = (percentage: number) => {
    // Get threshold from heatmapConfig readinessScore
    // Default: Green (Ready) is 81-100, Orange/Red (Need Develop) is 0-80
    const greenThreshold = heatmapConfig?.readinessScore?.find((range: any) => range.color === "#00875A")?.min || 81;

    if (percentage >= greenThreshold) {
      return {
        bg: "#f2f9f7",
        border: "#00875a",
        text: "#00875a",
        label: "READY"
      };
    } else {
      return {
        bg: "#fff2e4",
        border: "#ca6f00",
        text: "#ca6f00",
        label: "NEED DEV."
      };
    }
  };

  const badge = getReadinessBadge(promotionReadinessPercentage);

  // Get cluster scores with defaults if not available
  const getClusterScores = () => {
    // If scores exist in data, use them
    if (successor.capabilityScore !== undefined &&
        successor.commitmentScore !== undefined &&
        successor.contributionScore !== undefined) {
      return {
        capability: successor.capabilityScore,
        commitment: successor.commitmentScore,
        contribution: successor.contributionScore
      };
    }

    // Generate default scores based on readiness score
    const base = successor.readinessScore || successor.competencyScore;
    // Add some variance to make it realistic
    const variance1 = Math.floor(Math.random() * 10) - 5; // -5 to +5
    const variance2 = Math.floor(Math.random() * 10) - 5;
    const variance3 = Math.floor(Math.random() * 10) - 5;

    return {
      capability: Math.max(0, Math.min(100, base + variance1)),
      commitment: Math.max(0, Math.min(100, base + variance2)),
      contribution: Math.max(0, Math.min(100, base + variance3))
    };
  };

  const clusterScores = getClusterScores();
  
  return (
    <>
      <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full">
        <div className="content-stretch flex gap-[6px] items-center justify-between relative shrink-0 w-full">
          <div className="flex gap-[6px] items-center">
            <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[normal] whitespace-pre">Successor {index + 1}</p>
            </div>
            {isAdditional && (
              <div className="bg-[#e7f5ff] px-[6px] py-[2px] rounded-full">
                <p className="font-['Open_Sans',_sans-serif] text-[#016699] text-[8px] uppercase font-bold">Added</p>
              </div>
            )}
          </div>
        </div>
      
      {/* Card */}
      {isExpanded ? (
        <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
          <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[2px_2px_20px_0px_rgba(1,102,153,0.2)]" />
          <div className="flex flex-col items-end size-full">
            <div className="box-border content-stretch flex flex-col gap-[8px] items-end p-[8px] relative w-full">
              {/* Successor info */}
              <div className="box-border content-stretch flex gap-[8px] h-[38px] items-center pb-[8px] pt-0 px-0 relative rounded-[8px] shrink-0 w-full">
                <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[30px]">
                  {successor.imageUrl && (
                    <img src={successor.imageUrl} alt={successor.name} className="absolute inset-0 object-cover size-full" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                  )}
                </div>
                <div
                  className="basis-0 content-stretch flex flex-col grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0 cursor-pointer"
                  onClick={() => onNavigateToProfile?.(successor.id)}
                >
                  <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[12px] w-full hover:opacity-70 transition-opacity">
                    <p className="leading-[normal]">{successor.name}</p>
                  </div>
                  <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="leading-[normal]">{successor.position}</p>
                  </div>
                </div>
                <div className="content-stretch flex items-center justify-center relative shrink-0">
                  <div 
                    className="box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" 
                    data-name="Chip"
                    style={{ backgroundColor: badge.bg, border: `1px solid ${badge.border}` }}
                  >
                    <p 
                      className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[10px] text-nowrap uppercase whitespace-pre" 
                      style={{ fontVariationSettings: "'wdth' 100", color: badge.text }}
                    >
                      {promotionReadinessPercentage}%
                    </p>
                    {successor.activeIDP && (
                      <TrendingUp 
                        className="w-[10px] h-[10px]" 
                        style={{ color: badge.text }}
                        strokeWidth={2.5}
                      />
                    )}
                  </div>
                </div>
                {isAdditional && onRemove && (
                  <button 
                    onClick={onRemove}
                    className="content-stretch flex items-center relative shrink-0 hover:opacity-70 transition-opacity p-1 hover:bg-red-50 rounded"
                    title="Remove successor"
                  >
                    <Trash2 className="size-[16px] text-red-500" />
                  </button>
                )}
                <button onClick={() => setIsExpanded(!isExpanded)} className="content-stretch flex items-center relative shrink-0 hover:opacity-70 transition-opacity">
                  <ChevronUp className="size-[20px] text-[#58595B]" />
                </button>
              </div>

              {/* Cluster Score Section */}
              <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#adb5bd] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[normal]">Cluster Score</p>
              </div>

              {/* Cluster Score Cards */}
              <ClusterScoreCard label="Capability" score={clusterScores.capability} />
              <ClusterScoreCard label="Commitment" score={clusterScores.commitment} />
              <ClusterScoreCard label="Contribution" score={clusterScores.contribution} />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
          <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <div className="flex flex-row items-center">
            <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
              <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[30px]">
                {successor.imageUrl && (
                  <img src={successor.imageUrl} alt={successor.name} className="absolute inset-0 object-cover size-full" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                )}
              </div>
              <div
                className="basis-0 content-stretch flex flex-col grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0 cursor-pointer"
                onClick={() => onNavigateToProfile?.(successor.id)}
              >
                <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[12px] w-full hover:opacity-70 transition-opacity">
                  <p className="leading-[normal]">{successor.name}</p>
                </div>
                <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <p className="leading-[normal]">{successor.position}</p>
                </div>
              </div>
              <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0">
                <p className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {promotionReadinessPercentage}%
                </p>
                {successor.activeIDP && (
                  <TrendingUp 
                    className="w-[10px] h-[10px]" 
                    style={{ color: badge.text }}
                    strokeWidth={2.5}
                  />
                )}
              </div>
              {isAdditional && onRemove && (
                <button 
                  onClick={onRemove}
                  className="content-stretch flex items-center relative shrink-0 hover:opacity-70 transition-opacity p-1 hover:bg-red-50 rounded"
                  title="Remove successor"
                >
                  <Trash2 className="size-[16px] text-red-500" />
                </button>
              )}
              <button onClick={() => setIsExpanded(!isExpanded)} className="content-stretch flex items-center relative shrink-0 hover:opacity-70 transition-opacity">
                <ChevronDown className="size-[20px] text-[#495057]" />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      
      {/* IDP Progress Dialog */}
      <Dialog open={isIDPProgressDialogOpen} onOpenChange={(open) => {
        setIsIDPProgressDialogOpen(open);
        onIDPDialogChange?.(open);
      }}>
        <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto font-['Open_Sans',_sans-serif]">
          <DialogHeader>
            <DialogTitle className="font-['Open_Sans',_sans-serif] font-bold text-[#495057]">
              IDP Progress - {successor.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Individual Development Plan progress for {successor.name}
            </DialogDescription>
          </DialogHeader>
          
          {successor.activeIDP && (
            <div className="flex flex-col gap-[16px] mt-4">
              {/* IDP Start Date */}
              <div className="flex items-center gap-2 text-[12px] text-[#495057]">
                <span className="font-bold">IDP Start Date:</span>
                <span>{new Date(successor.activeIDP.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              {/* Programs */}
              {successor.activeIDP.programs.map((program, idx) => (
                <div key={idx} className="bg-white border border-[#dee2e6] rounded-[8px] p-[16px]">
                  {/* Competency Header */}
                  <div className="flex items-center justify-between mb-[12px]">
                    <h3 className="font-bold text-[14px] text-[#495057]">{program.competency}</h3>
                    <div className={`px-[8px] py-[2px] rounded-[800px] text-[10px] font-bold uppercase ${
                      program.status === 'completed' 
                        ? 'bg-[#f2f9f7] text-[#00875a] border border-[#00875a]' 
                        : 'bg-[#fff2e4] text-[#fd9f28] border border-[#fd9f28]'
                    }`}>
                      {program.status}
                    </div>
                  </div>
                  
                  {/* Program Name */}
                  <div className="mb-[12px]">
                    <p className="text-[12px] text-[#495057]">
                      <span className="font-bold">Program:</span> {program.program}
                    </p>
                  </div>
                  
                  {/* Mentor, Duration, Dates */}
                  <div className="grid grid-cols-2 gap-[8px] mb-[12px] text-[11px] text-[#495057]">
                    <div>
                      <span className="font-bold">Mentor:</span> {program.mentor}
                    </div>
                    <div>
                      <span className="font-bold">Duration:</span> {program.duration}
                    </div>
                    <div>
                      <span className="font-bold">Start:</span> {new Date(program.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div>
                      <span className="font-bold">End:</span> {new Date(program.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-[12px]">
                    <div className="flex items-center justify-between mb-[4px]">
                      <span className="text-[11px] font-bold text-[#495057]">Progress</span>
                      <span className="text-[11px] font-bold text-[#016699]">{program.progress}%</span>
                    </div>
                    <div className="w-full bg-[#e9ecef] rounded-full h-[8px] overflow-hidden">
                      <div 
                        className="bg-[#016699] h-full rounded-full transition-all duration-300"
                        style={{ width: `${program.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Activities */}
                  <div>
                    <p className="text-[11px] font-bold text-[#495057] mb-[8px]">Activities:</p>
                    <div className="flex flex-col gap-[6px]">
                      {program.activities.map((activity, actIdx) => (
                        <div key={actIdx} className="flex items-start gap-[8px]">
                          <div className={`mt-[2px] shrink-0 size-[16px] rounded-full border-2 flex items-center justify-center ${
                            activity.completed 
                              ? 'bg-[#00875a] border-[#00875a]' 
                              : 'bg-white border-[#adb5bd]'
                          }`}>
                            {activity.completed && (
                              <Check />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-[11px] ${activity.completed ? 'text-[#495057] line-through' : 'text-[#495057]'}`}>
                              {activity.name}
                            </p>
                            {activity.completed && activity.completedDate && (
                              <p className="text-[10px] text-[#6c757d] mt-[2px]">
                                Completed: {new Date(activity.completedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Footer */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button 
              onClick={() => setIsIDPProgressDialogOpen(false)}
              className="bg-[#016699] hover:bg-[#015580] text-white px-6 py-2 rounded-[28px] transition-colors font-['Open_Sans',_sans-serif] text-[14px] font-normal"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* AI-Generated IDP Recommendation Dialog */}
      <Dialog open={showAIDialog} onOpenChange={(open) => {
        setShowAIDialog(open);
        onIDPDialogChange?.(open);
      }}>
        <DialogContent className="max-w-[550px] max-h-[80vh] overflow-y-auto font-['Open_Sans',_sans-serif]">
          <DialogHeader>
            <DialogTitle className="font-['Avenir',_sans-serif] font-black text-[#58595b] text-[16px] not-italic">
              AI-Generated IDP Recommendation - {successor.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              AI-generated Individual Development Plan recommendation with tasks and success measures for {successor.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-[16px] mt-4 max-h-[529px] overflow-y-auto">
            {aiRecommendations.length > 0 ? (
              aiRecommendations.map((rec, idx) => (
                <div key={idx} className="bg-[#f8f9fa] rounded-[8px] p-[16px] border border-[#dee2e6]">
                  {/* Competency Chip */}
                  <div className="flex items-start gap-[8px] mb-[16px]">
                    <div className="bg-[#e7f5ff] px-[8px] py-[2px] rounded-full">
                      <p className="font-['Open_Sans',_sans-serif] font-bold text-[#016699] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {rec.competency}
                      </p>
                    </div>
                  </div>
                  
                  {/* Development Goals Section */}
                  <div className="bg-white rounded-[8px] mb-[16px]">
                    <div className="p-[16px]">
                      <div className="mb-[16px]">
                        <p className="font-['Avenir',_sans-serif] font-black text-[#495057] text-[14px] not-italic leading-[20px]">
                          Development Goals
                        </p>
                      </div>
                      <div>
                        <p className="font-['Open_Sans',_sans-serif] text-[#495057] text-[12px] leading-[normal]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          {rec.developmentGoal}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Success Measures Section */}
                  <div className="bg-white rounded-[8px] mb-[16px]">
                    <div className="p-[16px]">
                      <div className="mb-[4px]">
                        <p className="font-['Avenir',_sans-serif] font-black text-[#495057] text-[14px] not-italic leading-[20px]">
                          Success Measures
                        </p>
                      </div>
                      <div>
                        <ul className="list-disc">
                          {rec.successMeasures.map((measure, mIdx) => (
                            <li key={mIdx} className={`ms-[18px] ${mIdx === rec.successMeasures.length - 1 ? '' : 'mb-0'}`}>
                              <span className="font-['Open_Sans',_sans-serif] text-[#495057] text-[12px] leading-[normal]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                {measure}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recommended Programs Section */}
                  <div className="bg-white rounded-[8px]">
                    <div className="p-[16px]">
                      <div className="mb-[6px]">
                        <p className="font-['Avenir',_sans-serif] font-black text-[#495057] text-[14px] not-italic leading-[20px]">
                          Recommended Programs:
                        </p>
                      </div>
                      
                      {/* Job Assignment Chip + Duration */}
                      <div className="flex gap-[4px] items-start mb-[16px]">
                        <div className="bg-white border border-[#495057] px-[8px] py-[2px] rounded-full">
                          <p className="font-['Open_Sans',_sans-serif] font-bold text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Job Assignment
                          </p>
                        </div>
                        <p className="font-['Open_Sans',_sans-serif] text-[#495057] text-[12px] leading-[normal]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          {rec.duration}
                        </p>
                      </div>
                      
                      {/* Tasks List */}
                      <div className="p-[4px]">
                        <ul className="list-disc mb-[8px]">
                          {rec.tasks.map((taskItem, tIdx) => (
                            <li key={tIdx} className={`ms-[18px] ${tIdx === rec.tasks.length - 1 ? '' : 'mb-0'}`}>
                              <span className="font-['Open_Sans',_sans-serif] text-[#495057] text-[12px] leading-[normal]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                {taskItem.task}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <p className="font-['Open_Sans',_sans-serif] text-[#adb5bd] text-[12px] leading-[normal]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Mentor: {rec.mentor}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-[24px]">
                <p className="text-[#adb5bd] text-[14px] text-center">No recommendations generated</p>
              </div>
            )}
          </div>
          
          {/* Divider Line */}
          <div className="h-0 relative shrink-0 w-full">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1034 1">
                <line stroke="#DEE2E6" x2="1034" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex gap-[12px] items-center justify-end mt-4">
            <button 
              onClick={() => setShowAIDialog(false)}
              className="border border-[#016699] px-[12px] py-[8px] rounded-[28px] cursor-pointer hover:bg-[#f0f7ff] transition-colors"
            >
              <p className="font-['Avenir',_sans-serif] font-black text-[#016699] text-[14px] not-italic leading-[normal]">Close</p>
            </button>
            <button 
              onClick={() => {
                setShowAIDialog(false);
                onNavigateToIDP?.(successor.id);
              }}
              className="bg-[#016699] px-[12px] py-[8px] rounded-[28px] cursor-pointer hover:bg-[#015580] transition-colors"
            >
              <p className="font-['Avenir',_sans-serif] font-black text-white text-[14px] not-italic leading-[normal]">Continue</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Get successors for an employee
function getSuccessors(employee: Employee): Employee[] {
  // Get employees from dataManager (localStorage) instead of static import
  const employees = dataManager.getEmployees();
  
  // Find all employees who report to this employee (direct reports are successors)
  const directReports = employees.filter(emp => emp.managerId === employee.id);
  
  // Return direct reports only (no peers fallback)
  return directReports;
}

export default function SuccessionPanel({ employee, onClose, onCompare, onIDPDialogChange, onAddSuccessorDialogChange, heatmapConfig, onNavigateToDetail, onNavigateToIDP, onShowIDPProgress, allEmployees: propEmployees, onEmployeesChange }: SuccessionPanelProps) {
  const [isAddSuccessorDialogOpen, setIsAddSuccessorDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Helper to update dialog state and notify parent
  const setAddSuccessorDialogOpen = (isOpen: boolean) => {
    setIsAddSuccessorDialogOpen(isOpen);
    onAddSuccessorDialogChange?.(isOpen);
  };

  if (!employee) return null;

  // Use CSV-loaded employees from prop if available, fall back to dataManager
  const allEmployees = propEmployees && propEmployees.length > 0 ? propEmployees : dataManager.getEmployees();
  const currentEmployeeData = allEmployees.find(e => e.id === employee.id);
  const additionalSuccessorIds = currentEmployeeData?.additionalSuccessors || [];

  // CSV-based planned successors (from "Successor For Employee ID" column)
  const csvSuccessorIds = (currentEmployeeData ?? employee).successorIds || [];
  const csvSuccessors = csvSuccessorIds
    .map(id => allEmployees.find(e => e.id === id))
    .filter((emp): emp is Employee => emp !== undefined)
    .sort((a, b) => (b.competencyScore ?? 0) - (a.competencyScore ?? 0));

  // Direct reports fallback (used when no CSV successor data)
  const directReports = allEmployees.filter(emp => emp.managerId === employee.id)
    .sort((a, b) => (b.competencyScore ?? 0) - (a.competencyScore ?? 0));

  // Manually added successors (de-duped against CSV successors)
  const additionalSuccessors = additionalSuccessorIds
    .map(id => allEmployees.find(e => e.id === id))
    .filter((emp): emp is Employee => emp !== undefined)
    .filter(emp => !csvSuccessorIds.includes(emp.id));

  // Primary successor list: CSV-based if available, else direct reports
  const primarySuccessors = csvSuccessorIds.length > 0 ? csvSuccessors : directReports;

  // Combine all successors
  const allSuccessors = [...primarySuccessors, ...additionalSuccessors];

  const handleCompareClick = () => {
    // Navigate to parent window (break out of iframe)
    window.top!.location.href = 'http://dsn.kelola.app/tdp';
  };

  const handleNavigateToEmployeeProfile = (employeeId: string) => {
    const selectedEmployee = allEmployees.find(e => e.id === employeeId);
    const name = selectedEmployee ? encodeURIComponent(selectedEmployee.name) : '';
    window.top!.location.href = `/iprofile?id=${encodeURIComponent(employeeId)}&name=${name}&from=vismap`;
  };
  
  // Get eligible employees for adding as successors
  // Same level (same manager) OR level below (anyone with managerId set)
  const getEligibleEmployees = (): { sameLevel: Employee[], levelBelow: Employee[] } => {
    // Helper function to get all superiors (manager chain)
    const getSuperiors = (emp: Employee): Set<string> => {
      const superiors = new Set<string>();
      let currentManagerId = emp.managerId;

      while (currentManagerId) {
        superiors.add(currentManagerId);
        const manager = allEmployees.find(e => e.id === currentManagerId);
        currentManagerId = manager?.managerId;
      }

      return superiors;
    };

    const superiorIds = getSuperiors(employee);

    const sameLevel: Employee[] = [];
    const levelBelow: Employee[] = [];

    allEmployees.forEach(emp => {
      // Don't include self
      if (emp.id === employee.id) return;

      // Don't include already listed successors
      const isAlreadySuccessor = allSuccessors.some(s => s.id === emp.id);
      if (isAlreadySuccessor) return;

      // Don't include superiors (level di atasnya)
      if (superiorIds.has(emp.id)) return;

      // Same level: same manager as current employee
      if (emp.managerId === employee.managerId) {
        sameLevel.push(emp);
      } else {
        // Level below: everyone else
        levelBelow.push(emp);
      }
    });
    
    // Sort both sections by readiness score (descending)
    const sortByReadiness = (a: Employee, b: Employee) => {
      const aScore = a.readinessScore ?? 0;
      const bScore = b.readinessScore ?? 0;
      return bScore - aScore;
    };
    
    sameLevel.sort(sortByReadiness);
    levelBelow.sort(sortByReadiness);
    
    return { sameLevel, levelBelow };
  };
  
  const { sameLevel, levelBelow } = getEligibleEmployees();
  const eligibleEmployees = [...sameLevel, ...levelBelow];
  
  // Filter eligible employees by search term
  const filteredSameLevel = sameLevel.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredLevelBelow = levelBelow.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const hasFilteredResults = filteredSameLevel.length > 0 || filteredLevelBelow.length > 0;
  
  const handleAddSuccessor = (successorId: string) => {
    const updatedEmployees = allEmployees.map(emp => {
      if (emp.id === employee.id) {
        const currentAdditional = emp.additionalSuccessors || [];
        return {
          ...emp,
          additionalSuccessors: [...currentAdditional, successorId]
        };
      }
      return emp;
    });

    dataManager.saveEmployees(updatedEmployees);
    onEmployeesChange?.(updatedEmployees);
    toast.success("Successor added successfully!");
  };

  const handleRemoveSuccessor = (successorId: string) => {
    const updatedEmployees = allEmployees.map(emp => {
      if (emp.id === employee.id) {
        const currentAdditional = emp.additionalSuccessors || [];
        return {
          ...emp,
          additionalSuccessors: currentAdditional.filter(id => id !== successorId)
        };
      }
      return emp;
    });

    dataManager.saveEmployees(updatedEmployees);
    onEmployeesChange?.(updatedEmployees);
    toast.success("Successor removed successfully!");
  };

  return (
    <div
      className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-[-4px_0px_30px_0px_rgba(0,0,0,0.1)] z-[100] animate-in slide-in-from-right duration-300 overflow-y-auto"
      data-name="Succession"
    >
      {/* Header */}
      <div className="absolute content-stretch flex items-center justify-between left-[17px] top-[20px] w-[384px]">
        <div
          className={`flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap text-right cursor-pointer hover:opacity-70 transition-opacity`}
          onClick={() => handleNavigateToEmployeeProfile(employee.id)}
        >
          <p className="leading-[normal] whitespace-pre font-bold">{employee.name}</p>
        </div>
        <button 
          onClick={onClose}
          className="block cursor-pointer relative shrink-0 hover:opacity-70 transition-opacity"
        >
          <ChevronsRight />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-[calc(50%+0.5px)] overflow-x-clip overflow-y-auto top-[61px] translate-x-[-50%] w-[385px] pb-[100px] bottom-[80px]">
        {/* Current Employee Card */}
        <div className="bg-[#f8f9fa] h-[46px] relative rounded-[8px] shrink-0 w-full">
          <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[2px_2px_20px_0px_rgba(1,102,153,0.2)]" />
          <div className="flex flex-row items-center size-full">
            <div className="box-border content-stretch flex gap-[8px] h-[46px] items-center p-[8px] relative w-full">
              <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[30px]">
                {employee.imageUrl && (
                  <img src={employee.imageUrl} alt={employee.name} className="absolute inset-0 object-cover size-full" referrerPolicy="no-referrer" crossOrigin="anonymous" />
                )}
              </div>
              <div
                className="basis-0 content-stretch flex flex-col grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0 cursor-pointer"
                onClick={() => handleNavigateToEmployeeProfile(employee.id)}
              >
                <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[12px] w-full hover:opacity-70 transition-opacity">
                  <p className="leading-[normal]">{employee.name}</p>
                </div>
                <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <p className="leading-[normal]">{employee.position}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Successors */}
        <div className="flex flex-col gap-[6px] items-end relative w-full">
          {allSuccessors.length > 0 ? (
            <>
              {/* Primary Successors (CSV-based or direct reports fallback) */}
              {primarySuccessors.map((successor, idx) => (
                <SuccessorCard
                  key={successor.id}
                  successor={successor}
                  index={idx}
                  onIDPDialogChange={onIDPDialogChange}
                  isAdditional={false}
                  heatmapConfig={heatmapConfig}
                  onNavigateToDetail={onNavigateToDetail}
                  onNavigateToIDP={onNavigateToIDP}
                  onShowIDPProgress={onShowIDPProgress}
                  onNavigateToProfile={handleNavigateToEmployeeProfile}
                />
              ))}
              {/* Manually Added Successors */}
              {additionalSuccessors.map((successor, idx) => (
                <SuccessorCard
                  key={successor.id}
                  successor={successor}
                  index={primarySuccessors.length + idx}
                  onIDPDialogChange={onIDPDialogChange}
                  isAdditional={true}
                  onRemove={() => handleRemoveSuccessor(successor.id)}
                  heatmapConfig={heatmapConfig}
                  onNavigateToDetail={onNavigateToDetail}
                  onNavigateToIDP={onNavigateToIDP}
                  onShowIDPProgress={onShowIDPProgress}
                />
              ))}
            </>
          ) : (
            <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#adb5bd] text-[12px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[normal]">No successors available</p>
            </div>
          )}
        </div>

        {/* Add Successors Button */}
        <button
          onClick={() => setAddSuccessorDialogOpen(true)}
          className="bg-white border border-[#016699] box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[6px] rounded-[28px] w-full hover:bg-[#f0f7ff] transition-colors cursor-pointer"
        >
          <UserPlus className="size-[16px] text-[#016699]" />
          <p className="font-['Open_Sans',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-nowrap whitespace-pre">Add Successors</p>
        </button>
      </div>

      {/* Bottom button */}
      {allSuccessors.length > 0 && (
        <button
          onClick={handleCompareClick}
          className="absolute bg-[#016699] box-border content-stretch flex gap-[8px] items-center justify-center left-[calc(50%+0.5px)] px-[12px] py-[8px] rounded-[28px] bottom-[20px] translate-x-[-50%] hover:bg-[#015580] transition-colors cursor-pointer"
        >
          <p className="font-['Open_Sans',_sans-serif] leading-[normal] not-italic relative shrink-0 text-white text-[14px] text-nowrap whitespace-pre">View Data & Compare</p>
        </button>
      )}
      
      {/* Add Successor Dialog */}
      <Dialog open={isAddSuccessorDialogOpen} onOpenChange={setAddSuccessorDialogOpen}>
        <DialogContent className="max-w-[600px] max-h-[80vh] font-['Open_Sans',_sans-serif]">
          <DialogHeader>
            <DialogTitle className="font-['Open_Sans',_sans-serif] font-bold text-[#495057]">
              Add Successor for {employee.name}
            </DialogTitle>
            <DialogDescription className="text-[#6c757d] text-[12px] mt-2">
              Select employees from the same level or below to add as succession candidates
            </DialogDescription>
          </DialogHeader>
          
          {/* Search */}
          <div className="mt-4">
            <Input
              placeholder="Search by name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          {/* Employee List */}
          <div className="flex flex-col gap-[8px] max-h-[400px] overflow-y-auto mt-4">
            {hasFilteredResults ? (
              <>
                {filteredSameLevel.length > 0 && (
                  <div className="font-['Open_Sans',_sans-serif] font-bold text-[#495057] text-[12px] mb-2">Same Level</div>
                )}
                {filteredSameLevel.map((emp) => (
                  <div 
                    key={emp.id}
                    className="bg-[#f8f9fa] border border-[#dee2e6] rounded-[8px] p-[12px] flex items-center gap-[12px] hover:bg-[#e9ecef] transition-colors cursor-pointer"
                    onClick={() => {
                      handleAddSuccessor(emp.id);
                      setAddSuccessorDialogOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[40px]">
                      {emp.imageUrl && (
                        <ImageLoader 
                          imageUrl={emp.imageUrl} 
                          alt={emp.name} 
                          className="absolute inset-0 object-cover size-full" 
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-['Avenir:Heavy',_sans-serif] text-[#016699] text-[14px]">{emp.name}</p>
                      <p className="font-['Open_Sans',_sans-serif] text-[#495057] text-[12px]">{emp.position}</p>
                      <p className="font-['Open_Sans',_sans-serif] text-[#6c757d] text-[10px]">{emp.jobTitle}</p>
                    </div>
                    <div className="flex flex-col items-end gap-[4px]">
                      <p className="font-['Open_Sans',_sans-serif] text-[#495057] text-[10px] font-bold">
                        Readines score: {emp.readinessScore ?? 0}%
                      </p>
                      {emp.managerId === employee.managerId && (
                        <div className="bg-[#fff3cd] px-[6px] py-[2px] rounded-full">
                          <p className="font-['Open_Sans',_sans-serif] text-[#856404] text-[8px] uppercase font-bold">Same Level</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredLevelBelow.length > 0 && (
                  <div className="font-['Open_Sans',_sans-serif] font-bold text-[#495057] text-[12px] mt-4 mb-2">Level Below</div>
                )}
                {filteredLevelBelow.map((emp) => (
                  <div 
                    key={emp.id}
                    className="bg-[#f8f9fa] border border-[#dee2e6] rounded-[8px] p-[12px] flex items-center gap-[12px] hover:bg-[#e9ecef] transition-colors cursor-pointer"
                    onClick={() => {
                      handleAddSuccessor(emp.id);
                      setAddSuccessorDialogOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[40px]">
                      {emp.imageUrl && (
                        <ImageLoader 
                          imageUrl={emp.imageUrl} 
                          alt={emp.name} 
                          className="absolute inset-0 object-cover size-full" 
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-['Avenir:Heavy',_sans-serif] text-[#016699] text-[14px]">{emp.name}</p>
                      <p className="font-['Open_Sans',_sans-serif] text-[#495057] text-[12px]">{emp.position}</p>
                      <p className="font-['Open_Sans',_sans-serif] text-[#6c757d] text-[10px]">{emp.jobTitle}</p>
                    </div>
                    <div className="flex flex-col items-end gap-[4px]">
                      <p className="font-['Open_Sans',_sans-serif] text-[#495057] text-[10px] font-bold">
                        Readines score: {emp.readinessScore ?? 0}%
                      </p>
                      {emp.managerId === employee.managerId && (
                        <div className="bg-[#fff3cd] px-[6px] py-[2px] rounded-full">
                          <p className="font-['Open_Sans',_sans-serif] text-[#856404] text-[8px] uppercase font-bold">Same Level</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-[24px]">
                <p className="text-[#adb5bd] text-[14px] text-center">
                  {searchTerm ? "No employees found matching your search" : "No eligible employees available"}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
