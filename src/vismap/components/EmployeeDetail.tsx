import { ArrowLeft, ChevronDown, ChevronUp, TrendingUp, GripVertical, UserPlus, Trash2, Network, Users } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Employee } from "../data/orgChartData";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import svgPaths from "../imports/svg-lw0o1k0w05";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { generateDevelopmentData } from "../data/developmentData";
import { dataManager } from "../data/dataManager";
import { toast } from "sonner";
import { ImageLoader } from './ImageLoader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import SpiderChart from "../imports/SpiderChart";
import SuccessionChart from "./SuccessionChart";

// Card types for drag and drop
const CARD_TYPE = "EMPLOYEE_CARD";

interface CardItem {
  id: string;
  columnIndex: number;
  cardIndex: number;
}

interface DraggableCardWrapperProps {
  id: string;
  columnIndex: number;
  cardIndex: number;
  moveCard: (dragColumnIndex: number, dragCardIndex: number, hoverColumnIndex: number, hoverCardIndex: number) => void;
  children: React.ReactNode;
}

function DraggableCardWrapper({ id, columnIndex, cardIndex, moveCard, children }: DraggableCardWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: CARD_TYPE,
    item: () => ({ id, columnIndex, cardIndex }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: CARD_TYPE,
    hover: (item: CardItem, monitor) => {
      if (!ref.current) {
        return;
      }
      
      const dragColumnIndex = item.columnIndex;
      const dragCardIndex = item.cardIndex;
      const hoverColumnIndex = columnIndex;
      const hoverCardIndex = cardIndex;
      
      // Don't replace items with themselves
      if (dragColumnIndex === hoverColumnIndex && dragCardIndex === hoverCardIndex) {
        return;
      }
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      if (!clientOffset) {
        return;
      }
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      
      // Same column - check direction
      if (dragColumnIndex === hoverColumnIndex) {
        // Dragging downwards
        if (dragCardIndex < hoverCardIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        
        // Dragging upwards
        if (dragCardIndex > hoverCardIndex && hoverClientY > hoverMiddleY) {
          return;
        }
      }
      
      // Time to actually perform the action
      moveCard(dragColumnIndex, dragCardIndex, hoverColumnIndex, hoverCardIndex);
      
      // Note: we're mutating the item here for performance
      item.columnIndex = hoverColumnIndex;
      item.cardIndex = hoverCardIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transition: "opacity 0.2s",
      }}
      className={`w-full ${isOver ? 'ring-2 ring-[#016699] ring-opacity-50 rounded-[8px]' : ''}`}
    >
      <div className="cursor-grab active:cursor-grabbing w-full">
        {children}
      </div>
    </div>
  );
}

// Column drop zone component
interface ColumnDropZoneProps {
  columnIndex: number;
  isEmpty: boolean;
  moveCard: (dragColumnIndex: number, dragCardIndex: number, hoverColumnIndex: number, hoverCardIndex: number) => void;
  children: React.ReactNode;
}

function ColumnDropZone({ columnIndex, isEmpty, moveCard, children }: ColumnDropZoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isOver }, drop] = useDrop({
    accept: CARD_TYPE,
    hover: (item: CardItem, monitor) => {
      if (!isEmpty) return;
      
      if (!ref.current) {
        return;
      }
      
      const dragColumnIndex = item.columnIndex;
      const dragCardIndex = item.cardIndex;
      const hoverColumnIndex = columnIndex;
      
      // Don't do anything if it's the same column
      if (dragColumnIndex === hoverColumnIndex) {
        return;
      }
      
      // Move to empty column at index 0
      moveCard(dragColumnIndex, dragCardIndex, hoverColumnIndex, 0);
      
      // Update item
      item.columnIndex = hoverColumnIndex;
      item.cardIndex = 0;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  return (
    <div 
      ref={ref}
      className={`content-stretch flex flex-col gap-[16px] items-start col-span-4 ${isEmpty ? 'min-h-[200px]' : ''} ${isEmpty && isOver ? 'bg-[#e3f2fd] rounded-[8px] border-2 border-dashed border-[#016699]' : ''}`}
    >
      {children}
    </div>
  );
}

// Helper Components
function InfoCircle() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="info-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="info-circle">
          <path d="M8 7.33333V11.3333M8 4.66667H8.00667M14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8Z" id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
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
          <p className="font-['Open_Sans',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Success Measures</p>
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
          <p className="font-['Open_Sans',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Program</p>
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
  onShowIDPProgress?: (employeeId: string) => void;
  isAdditional?: boolean;
  onRemove?: (successorId: string) => void;
}

function SuccessorCard({ successor, index, onShowIDPProgress, isAdditional = false, onRemove }: SuccessorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isIDPDialogOpen, setIsIDPDialogOpen] = useState(false);
  
  // Check if successor has active IDP
  const hasActiveIDP = successor.activeIDP && successor.activeIDP.programs.length > 0;
  
  // Get competency details for gaps
  const { competencyDetails, idpRecommendations } = successor.competencyDetails && successor.idpRecommendations
    ? { competencyDetails: successor.competencyDetails, idpRecommendations: successor.idpRecommendations }
    : generateDevelopmentData(successor.id, successor.readinessScore || successor.competencyScore);
  
  // Filter aspects that need development (score < 3, which is the standard)
  const aspectsNeedDevelop = competencyDetails.filter(comp => comp.score < 3);
  
  // Calculate promotion readiness percentage
  const getPromotionReadinessPercentage = (): number => {
    if (successor.readinessScore !== undefined && successor.readinessScore !== null) {
      return successor.readinessScore;
    }
    
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
  
  // Determine status based on readiness percentage
  const getReadinessBadge = (percentage: number) => {
    const blueThreshold = 81;
    
    if (percentage >= blueThreshold) {
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
  
  return (
    <>
      <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full">
        <div className="content-stretch flex gap-[6px] items-center justify-between relative shrink-0 w-full">
          <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal] whitespace-pre">Successor {index + 1}</p>
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
                  <ImageWithFallback
                    src={successor.imageUrl}
                    alt={successor.name}
                    className="absolute inset-0 object-cover size-full"
                  />
                </div>
                <div className="basis-0 content-stretch flex flex-col grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0">
                  <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[12px] w-full">
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
                <div className="content-stretch flex items-center relative shrink-0 w-[68px]">
                  <div 
                    className="box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" 
                    data-name="Chip"
                    style={{ backgroundColor: badge.bg, border: `1px solid ${badge.border}` }}
                  >
                    <p 
                      className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[10px] text-nowrap uppercase whitespace-pre" 
                      style={{ fontVariationSettings: "'wdth' 100", color: badge.text }}
                    >
                      {badge.label}
                    </p>
                  </div>
                </div>
                {isAdditional && onRemove && (
                  <button
                    onClick={() => onRemove(successor.id)}
                    className="flex items-center gap-[4px] text-[#dc3545] hover:text-[#c82333] transition-colors cursor-pointer bg-transparent border-none p-0"
                    title="Remove successor"
                  >
                    <Trash2 className="size-[14px]" />
                  </button>
                )}
                <button onClick={() => setIsExpanded(!isExpanded)} className="content-stretch flex items-center relative shrink-0 hover:opacity-70 transition-opacity">
                  <ChevronUp className="size-[20px] text-[#58595B]" />
                </button>
              </div>
              
              {/* Competency GAP section */}
              {aspectsNeedDevelop.length > 0 ? (
                <>
                  {/* Competency GAP label */}
                  <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center leading-[0] min-w-full relative shrink-0 text-[#adb5bd] text-[10px] w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="leading-[normal]">Competency GAP</p>
                  </div>
                  
                  {/* Competency gaps */}
                  {aspectsNeedDevelop.map((comp, idx) => (
                    <CompetencyGapCard key={idx} name={comp.name} score={comp.score} />
                  ))}
                  
                  {/* IDP button - Show "See IDP Progress" if has activeIDP, otherwise "IDP Recommendation" */}
                  <button 
                    onClick={() => hasActiveIDP ? onShowIDPProgress?.(successor.id) : setIsIDPDialogOpen(true)}
                    className="box-border content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[28px] shrink-0 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-nowrap whitespace-pre">
                      {hasActiveIDP ? 'See IDP Progress' : 'IDP Recommendation'}
                    </p>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-[12px] w-full">
                  <p className="font-['Open_Sans',_sans-serif] text-[#adb5bd] text-[12px] text-center">No competency gaps</p>
                  <p className="font-['Open_Sans',_sans-serif] text-[#adb5bd] text-[10px] text-center mt-1">All scores meet the standard</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
          <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <div className="flex flex-row items-center">
            <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
              <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[30px]">
                <ImageWithFallback
                  src={successor.imageUrl}
                  alt={successor.name}
                  className="absolute inset-0 object-cover size-full"
                />
              </div>
              <div className="basis-0 content-stretch flex flex-col grow items-start justify-center leading-[0] min-h-px min-w-px relative shrink-0">
                <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[12px] w-full">
                  <p className="leading-[normal]">{successor.name}</p>
                </div>
                <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <p className="leading-[normal]">{successor.position}</p>
                </div>
              </div>
              <p className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                {promotionReadinessPercentage}%
              </p>
              <div className="content-stretch flex items-center relative shrink-0 w-[68px]">
                <div 
                  className="box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" 
                  data-name="Chip"
                  style={{ backgroundColor: badge.bg, border: `1px solid ${badge.border}` }}
                >
                  <p 
                    className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[10px] text-nowrap uppercase whitespace-pre" 
                    style={{ fontVariationSettings: "'wdth' 100", color: badge.text }}
                  >
                    {badge.label}
                  </p>
                </div>
              </div>
              {isAdditional && onRemove && (
                <button
                  onClick={() => onRemove(successor.id)}
                  className="flex items-center gap-[4px] text-[#dc3545] hover:text-[#c82333] transition-colors cursor-pointer bg-transparent border-none p-0"
                  title="Remove successor"
                >
                  <Trash2 className="size-[14px]" />
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
      
      {/* IDP Recommendation Dialog */}
      <Dialog open={isIDPDialogOpen} onOpenChange={setIsIDPDialogOpen}>
        <DialogContent className="max-w-[500px] max-h-[80vh] overflow-y-auto font-['Open_Sans',_sans-serif]">
          <DialogHeader>
            <DialogTitle className="font-['Open_Sans',_sans-serif] font-bold text-[#495057]">
              IDP Recommendation - {successor.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Individual Development Plan recommendations for {successor.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-[16px] mt-4">
            {aspectsNeedDevelop.length > 0 ? (
              aspectsNeedDevelop.map((comp, idx) => {
                let matchingRec = idpRecommendations.find(rec => 
                  rec.competency.toLowerCase() === comp.name.toLowerCase()
                );
                
                if (!matchingRec) {
                  matchingRec = {
                    competency: comp.name,
                    successMeasures: ["Improve competency score to level 4 or above", "Complete relevant training and development programs"],
                    programs: [
                      { type: "Training", description: `Focused training program for ${comp.name} development` },
                      { type: "Coaching", description: `One-on-one coaching sessions with subject matter expert` }
                    ]
                  };
                } else {
                  matchingRec = {
                    ...matchingRec,
                    competency: comp.name
                  };
                }
                
                return <IDPSection key={idx} recommendation={matchingRec} />;
              })
            ) : (
              <div className="flex flex-col gap-[12px] items-center justify-center p-[24px]">
                <p className="text-[#adb5bd] text-[14px] text-center">No aspects need development</p>
                <p className="text-[#adb5bd] text-[12px] text-center">All competency scores meet or exceed the standard</p>
              </div>
            )}
          </div>
          
          {/* Footer with button */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            {hasActiveIDP ? (
              <button 
                onClick={() => {
                  setIsIDPDialogOpen(false);
                  onShowIDPProgress?.(successor.id);
                }}
                className="bg-[#016699] hover:bg-[#015580] text-white px-6 py-2 rounded-[28px] transition-colors font-['Open_Sans',_sans-serif] text-[14px] font-normal"
              >
                See IDP Progress
              </button>
            ) : (
              <button 
                onClick={() => setIsIDPDialogOpen(false)}
                className="bg-[#016699] hover:bg-[#015580] text-white px-6 py-2 rounded-[28px] transition-colors font-['Open_Sans',_sans-serif] text-[14px] font-normal"
              >
                Continue
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface EmployeeDetailProps {
  employeeId: string;
  onBack: () => void;
  onShowIDPProgress?: (employeeId: string) => void;
  onCompare?: (manager: Employee, successors: Employee[]) => void;
}

// Card definition interface
interface CardDefinition {
  id: string;
  render: () => React.ReactNode;
}

function EmployeeDetailContent({ employeeId, onBack, onShowIDPProgress, onCompare }: EmployeeDetailProps) {
  // Get employees from dataManager (localStorage) instead of static import
  const employees = dataManager.getEmployees();
  const employee = employees.find(emp => emp.id === employeeId);
  const [activeTab, setActiveTab] = useState<'kompetensi' | 'potensi'>('kompetensi');
  const [viewMode, setViewMode] = useState<'radar' | 'list'>('list');
  const [isAddSuccessorDialogOpen, setIsAddSuccessorDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSuccessionChartOpen, setIsSuccessionChartOpen] = useState(false);

  // Get heatmap config from localStorage (same as org chart)
  const defaultHeatmapConfig = {
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

  const heatmapConfig = (() => {
    const saved = localStorage.getItem('heatmapConfig');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure readinessScore exists
      if (!parsed.readinessScore) {
        parsed.readinessScore = defaultHeatmapConfig.readinessScore;
      }
      return parsed;
    }
    return defaultHeatmapConfig;
  })();

  const defaultVisibleColumns = {
    gender: false,
    city: false,
    maritalStatus: false,
    performance: false,
    iq: false
  };

  // State for columns - 3 columns with cards
  const [columns, setColumns] = useState<string[][]>([
    ['profile', 'teams', 'extensionData', 'employeeData'],
    ['scoreAspect'],
    ['careerSuccession', 'development']
  ]);

  // Move card function for drag and drop across columns
  const moveCard = useCallback((
    dragColumnIndex: number, 
    dragCardIndex: number, 
    hoverColumnIndex: number, 
    hoverCardIndex: number
  ) => {
    setColumns((prevColumns) => {
      const newColumns = prevColumns.map(col => [...col]);
      
      // Remove card from source column
      const [draggedCard] = newColumns[dragColumnIndex].splice(dragCardIndex, 1);
      
      // Insert card into target column
      newColumns[hoverColumnIndex].splice(hoverCardIndex, 0, draggedCard);
      
      return newColumns;
    });
  }, []);

  if (!employee) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] p-8">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <p className="font-['Open_Sans',_sans-serif] text-[#495057]">Employee tidak ditemukan</p>
      </div>
    );
  }

  // Get actual competency data from employee
  const { competencyDetails: employeeCompetencyDetails } = employee.competencyDetails && employee.competencyDetails.length > 0
    ? { competencyDetails: employee.competencyDetails }
    : generateDevelopmentData(employee.id, employee.readinessScore || employee.competencyScore);
  
  // Convert to format expected by component
  const competencyData = employeeCompetencyDetails.map(comp => ({
    name: comp.name,
    score: comp.score,
    needDev: comp.score < 3
  }));

  // Mock data untuk teams
  const teams = [
    { name: 'Rising Project Team', role: 'Team Leader' },
    { name: 'Product Team', role: 'Team member' },
    { name: 'Pegasus Team', role: 'Team member' },
  ];

  // Get manager (one level up) for career plan
  const manager = employee.managerId ? employees.find(emp => emp.id === employee.managerId) : null;
  
  // Calculate promotion readiness percentage for career plan
  const getPromotionReadinessPercentage = (): number => {
    if (employee.readinessScore !== undefined && employee.readinessScore !== null) {
      return employee.readinessScore;
    }
    
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
  
  const promotionReadiness = getPromotionReadinessPercentage();
  
  // Career plan data
  const careerPlan = {
    position: manager ? manager.position : 'No position available',
    incumbent: manager ? manager.name : 'No manager',
    readiness: `${promotionReadiness}%`,
    status: promotionReadiness >= 81 ? 'Ready' : 'need dev.'
  };

  // Get successors â€” prefer CSV-based successorIds, fall back to direct reports
  const currentEmployeeData = dataManager.getEmployees().find(e => e.id === employee.id);
  const additionalSuccessorIds = currentEmployeeData?.additionalSuccessors || [];

  const directReports = employees.filter(emp => emp.managerId === employee.id)
    .sort((a, b) => b.competencyScore - a.competencyScore);

  // CSV-based planned successors (from "Successor For Employee ID" column)
  const csvSuccessorIds = employee.successorIds || [];
  const csvSuccessors = csvSuccessorIds
    .map(id => employees.find(e => e.id === id))
    .filter((emp): emp is Employee => emp !== undefined)
    .sort((a, b) => b.competencyScore - a.competencyScore);

  // Manually added successors (de-duped against CSV successors)
  const additionalSuccessors = additionalSuccessorIds
    .map(id => employees.find(e => e.id === id))
    .filter((emp): emp is Employee => emp !== undefined)
    .filter(emp => !csvSuccessorIds.includes(emp.id));

  // If CSV has successor data, use it; otherwise fall back to direct reports
  const successors = csvSuccessorIds.length > 0
    ? [...csvSuccessors, ...additionalSuccessors]
    : [...directReports, ...additionalSuccessors];

  // Get eligible employees for adding as successors
  const getEligibleEmployees = (): { sameLevel: Employee[], levelBelow: Employee[] } => {
    const allEmployees = dataManager.getEmployees();
    
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
      
      // Don't include already added successors (direct or additional)
      const isDirectReport = directReports.some(dr => dr.id === emp.id);
      const isAdditionalSuccessor = additionalSuccessorIds.includes(emp.id);
      if (isDirectReport || isAdditionalSuccessor) return;
      
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
    const allEmployees = dataManager.getEmployees();
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
    toast.success("Successor added successfully!");
    setRefreshKey(prev => prev + 1);
  };

  const handleRemoveSuccessor = (successorId: string) => {
    const allEmployees = dataManager.getEmployees();
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
    toast.success("Successor removed successfully!");
    setRefreshKey(prev => prev + 1);
  };

  // Mock data untuk IDP
  const idpList = [
    {
      competencies: ['leadership', 'communication'],
      mentor: 'Muhammad Mahmud',
      period: '17 Agustus 20024 - 16 November 2024 (3 Bulan)',
      status: 'in progress'
    },
    {
      competencies: ['strategic thinking'],
      mentor: 'Gunawan',
      period: '17 Agustus 20024 - 16 November 2024 (3 Bulan)',
      status: 'done'
    }
  ];

  // Render competency score boxes
  const renderScoreBoxes = (score: number, isStandard?: boolean) => {
    return (
      <div className="basis-0 content-stretch flex gap-[2px] grow items-start min-h-px min-w-px relative shrink-0">
        {[1, 2, 3, 4, 5].map((box) => {
          const isChecked = box === score;
          const isHighlighted = box === 3;
          
          return (
            <div
              key={box}
              className={`basis-0 ${isChecked ? 'content-stretch flex items-center justify-center' : ''} grow h-[24px] min-h-px min-w-px relative shrink-0 ${
                isHighlighted ? 'bg-[#d6e6ff]' : 'bg-white'
              } rounded-[4px]`}
            >
              <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
              {isChecked && (
                <div className="overflow-clip relative shrink-0 size-[18px]">
                  <div className="absolute inset-[29.17%_16.67%_29.17%_20.83%]">
                    <div className="absolute inset-[-10%_-6.67%]" style={{ "--stroke-0": "rgba(1, 102, 153, 1)" } as React.CSSProperties}>
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 9">
                        <path d="M0.75 4.5L4.5 8.25L12 0.75" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Define all cards with their render functions
  const allCards: { [key: string]: CardDefinition } = {
    profile: {
      id: 'profile',
      render: () => (
        <div className="bg-white h-[372.5px] overflow-clip relative rounded-[8px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] shrink-0 w-full">
          {/* Header */}
          <div className="absolute content-stretch flex items-center justify-between left-[16px] right-[16px] top-[16px]">
            <div className="flex items-center gap-[8px]">
              <GripVertical className="size-[16px] text-[#adb5bd] cursor-grab active:cursor-grabbing" />
              <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[#495057] text-[12px] text-nowrap">
                <p className="leading-[normal] whitespace-pre font-bold">Profile</p>
              </div>
            </div>
          </div>

          {/* Main Photo */}
          <div className="absolute left-[16px] overflow-clip rounded-[8px] size-[283px] top-[63px]">
            <div className="absolute left-0 size-[283px] top-0">
              {employee.imageUrl ? (
                <ImageWithFallback 
                  src={employee.imageUrl}
                  alt={employee.name}
                  className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
                />
              ) : (
                <div className="absolute inset-0 bg-[#dee2e6]" />
              )}
            </div>
            <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0)] h-[108px] left-0 to-[rgba(0,0,0,0.8)] top-[175px] w-[283px]" />
            <div className="absolute flex flex-col font-['Open_Sans:Bold',_sans-serif] font-bold justify-center leading-[0] left-[13.89px] text-[20px] text-nowrap text-white top-[229.5px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[99.58%] whitespace-pre">{employee.name}</p>
            </div>
            <div className="absolute content-stretch flex gap-[4px] h-[17.849px] items-center left-[14px] top-[245.83px] w-[96.593px]">
              <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[#fd9f28] text-[12px] text-nowrap">
                <p className="leading-[normal] whitespace-pre">{employee.position}</p>
              </div>
            </div>
          </div>

          {/* Right Side Info */}
          <div className="absolute content-stretch flex flex-col gap-[16px] items-end left-[217px] top-[39px] w-[135px]">
            {/* Talent Badge */}
            <div className="content-stretch flex items-start">
              <div className="bg-[#e7f5ff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] rounded-[800px]">
                <div className="overflow-clip relative shrink-0 size-[14px]">
                  <div className="absolute inset-[8.34%_8.42%_12.52%_8.36%]">
                    <div className="absolute inset-[-6.77%_-6.44%]" style={{ "--stroke-0": "rgba(1, 102, 153, 1)" } as React.CSSProperties}>
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 13">
                        <path d={svgPaths.pde03580} stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] text-[#016699] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                  talent
                </p>
              </div>
            </div>

            {/* Personality */}
            <div className="bg-[#f8f9fa] h-[50px] leading-[0] overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 text-nowrap w-full">
              <div className="absolute flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center left-[13px] text-[#495057] text-[10px] top-[12px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[normal] text-nowrap whitespace-pre">Personality</p>
              </div>
              <div className="absolute flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center left-[13px] not-italic text-[#016699] text-[14px] top-[34.5px] translate-y-[-50%]">
                <p className="leading-[normal] text-nowrap whitespace-pre">SC</p>
              </div>
            </div>

            {/* Intelligence */}
            <div className="bg-[#f8f9fa] h-[50px] leading-[0] overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 text-nowrap w-full">
              <div className="absolute flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center left-[13px] text-[#495057] text-[10px] top-[12px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[normal] text-nowrap whitespace-pre">Intelligence</p>
              </div>
              <div className="absolute flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center left-[13px] not-italic text-[#016699] text-[0px] top-[34.5px] translate-y-[-50%]">
                <p className="leading-[normal] text-nowrap whitespace-pre">
                  <span className="text-[8px]">IQ:</span>
                  <span className="text-[14px]">{employee.iq || 120} , </span>
                  <span className="text-[8px]">GTQ:</span>
                  <span className="text-[14px]">115</span>
                </p>
              </div>
            </div>

            {/* Competency match */}
            <div className="bg-[#f8f9fa] h-[50px] overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-full">
              <div className="absolute flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] left-[13px] text-[#495057] text-[10px] text-nowrap top-[12px] translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[normal] whitespace-pre">Competency match</p>
              </div>
              <div className="absolute flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] left-[15px] not-italic text-[#016699] text-[14px] text-nowrap top-[34.5px] translate-y-[-50%]">
                <p className="leading-[normal] whitespace-pre">4.5</p>
              </div>
              <div className="absolute left-[36px] overflow-clip size-[10px] top-[21px]">
                <div className="absolute bottom-[20.83%] left-1/4 right-1/4 top-[20.83%]">
                  <div className="absolute inset-[-8.04%_-9.38%]" style={{ "--stroke-0": "rgba(0, 135, 90, 1)" } as React.CSSProperties}>
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 7">
                      <path d={svgPaths.pe7b5200} stroke="var(--stroke-0, #00875A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9375" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    scoreAspect: {
      id: 'scoreAspect',
      render: () => (
        <div className="bg-white relative rounded-[8px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] shrink-0 w-full">
          <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex flex-col gap-[12px] items-center p-[16px] relative w-full">
              
              {/* Header */}
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                <div className="flex items-center gap-[8px]">
                  <GripVertical className="size-[16px] text-[#adb5bd] cursor-grab active:cursor-grabbing" />
                  <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[#495057] text-[12px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre font-bold">Score Aspect</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="content-stretch flex gap-[2px] items-center relative shrink-0 w-full">
                <button 
                  onClick={() => setActiveTab('kompetensi')}
                  className={`basis-0 grow min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 ${activeTab === 'kompetensi' ? 'border-[#016699] border-[0px_0px_2px]' : 'border-[#dee2e6] border-[0px_0px_2px]'} border-solid`}
                >
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-[16px] py-[8px] relative w-full">
                      <div className={`flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[14px] text-center text-nowrap ${activeTab === 'kompetensi' ? 'text-[#016699]' : 'text-[#495057]'}`}>
                        <p className="leading-[normal] whitespace-pre">Kompetensi</p>
                      </div>
                    </div>
                  </div>
                </button>
                <button 
                  onClick={() => setActiveTab('potensi')}
                  className={`basis-0 grow min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 ${activeTab === 'potensi' ? 'border-[#016699] border-[0px_0px_2px]' : 'border-[#dee2e6] border-[0px_0px_2px]'} border-solid`}
                >
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-[16px] py-[8px] relative w-full">
                      <div className={`flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[14px] text-center text-nowrap ${activeTab === 'potensi' ? 'text-[#016699]' : 'text-[#495057]'}`}>
                        <p className="leading-[normal] whitespace-pre">Potensi</p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Timeline */}
              <div className="bg-[#f8f9fa] box-border content-stretch flex items-start justify-between pl-[20px] pr-[16px] py-[6px] relative rounded-[4px] shrink-0 w-full">
                <div className="absolute h-0 left-1/2 top-[11px] translate-x-[-50%] w-[310px]">
                  <div className="absolute bottom-[-3.68px] left-0 right-[-0.16%] top-[-3.68px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 311 8">
                      <path d={svgPaths.p12219800} fill="var(--stroke-0, #CED4DA)" fillOpacity="0.854902" />
                    </svg>
                  </div>
                </div>
                {[1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="box-border content-stretch flex flex-col items-center px-0 py-[2px] relative shrink-0 w-[48px]">
                    <div className="relative shrink-0 size-[7px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
                        <circle cx="3.5" cy="3.5" fill={idx === 4 ? "#495057" : "#ADB5BD"} r="3" stroke={idx === 4 ? "#ADB5BD" : "#CED4DA"} strokeOpacity={idx === 4 ? "1" : "0.854902"} />
                      </svg>
                    </div>
                    <div className={`flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[10px] text-nowrap ${idx === 4 ? 'text-[#495057]' : 'text-[#f8f9fa]'}`} style={{ fontVariationSettings: "'wdth' 100" }}>
                      <p className="leading-[normal] whitespace-pre">Feb 2023</p>
                    </div>
                  </div>
                ))}
              </div>

              {viewMode === 'list' ? (
                /* Competency List */
                <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full">
                  {/* Legend */}
                  <div className="box-border content-stretch flex items-center justify-between px-0 py-[4px] relative shrink-0 w-full">
                    <div className="content-stretch flex gap-[12px] items-center">
                      <div className="content-stretch flex gap-[4px] items-center">
                        <div className="overflow-clip relative shrink-0 size-[16px]">
                          <div className="absolute inset-[29.17%_16.67%_29.17%_20.83%]">
                            <div className="absolute inset-[-11.25%_-7.5%]" style={{ "--stroke-0": "rgba(1, 102, 153, 1)" } as React.CSSProperties}>
                              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 9">
                                <path d={svgPaths.p372d5680} stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="font-['Open_Sans:Regular',_sans-serif] font-normal leading-[normal] text-[#495057] text-[10px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Score
                        </p>
                      </div>
                      <div className="content-stretch flex gap-[4px] items-center">
                        <div className="bg-[#d6e6ff] relative rounded-[4px] shrink-0 size-[16px]">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
                        </div>
                        <p className="font-['Open_Sans:Regular',_sans-serif] font-normal leading-[normal] text-[#495057] text-[10px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Standar Nilai
                        </p>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] items-center">
                      <div className={`overflow-clip relative rounded-[4px] shrink-0 size-[20px] ${viewMode === 'radar' ? 'bg-[#e7f5ff]' : 'bg-[#f8f9fa]'} cursor-pointer`} onClick={() => setViewMode('radar')}>
                        <div className="absolute inset-[12.5%_10.42%]">
                          <div className="absolute inset-[-5%_-4.74%]" style={{ "--stroke-0": viewMode === 'radar' ? "rgba(1, 102, 153, 1)" : "rgba(206, 212, 218, 1)" } as React.CSSProperties}>
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 17">
                              <path d={svgPaths.p4355100} stroke="var(--stroke-0)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={viewMode === 'radar' ? "1" : "0.854902"} strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className={`overflow-clip relative rounded-[4px] shrink-0 size-[20px] ${viewMode === 'list' ? 'bg-[#e7f5ff]' : 'bg-[#f8f9fa]'} cursor-pointer`} onClick={() => setViewMode('list')}>
                        <div className="absolute bottom-[24.96%] left-[20.83%] right-[16.67%] top-1/4">
                          <div className="absolute inset-[-7.49%_-6%]" style={{ "--stroke-0": viewMode === 'list' ? "rgba(1, 102, 153, 1)" : "rgba(206, 212, 218, 1)" } as React.CSSProperties}>
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 12">
                              <path d={svgPaths.p24455faf} stroke="var(--stroke-0)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={viewMode === 'list' ? "1" : "0.854902"} strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Competency Items */}
                  {competencyData.map((comp, idx) => (
                    <div key={idx} className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
                      <div className="flex flex-col justify-center size-full">
                        <div className="box-border content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
                          <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
                            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                              <div className="content-stretch flex gap-[4px] items-center w-[231px]">
                                {comp.needDev && (
                                  <div className="content-stretch flex items-start">
                                    <div className="bg-[#fff2e4] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] rounded-[800px]">
                                      <p className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] text-[#ca6f00] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                        DEV.
                                      </p>
                                    </div>
                                  </div>
                                )}
                                <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                                  <p className="leading-[normal]">{comp.name}</p>
                                </div>
                              </div>
                              <div className="overflow-clip relative shrink-0 size-[16px]">
                                <div className="absolute inset-[12.5%]">
                                  <div className="absolute inset-[-6.25%]" style={{ "--stroke-0": "rgba(173, 181, 189, 1)" } as React.CSSProperties}>
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                                      <path d={svgPaths.p11080840} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full">
                              {renderScoreBoxes(comp.score)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Spider Chart View */
                <div className="relative shrink-0 w-full">
                  <SpiderChart onViewModeChange={() => setViewMode('list')} />
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    teams: {
      id: 'teams',
      render: () => (
        <div className="bg-white box-border content-stretch flex flex-col gap-[23px] items-start p-[16px] rounded-[8px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] shrink-0 w-full">
          <div className="content-stretch flex items-center justify-between w-full">
            <div className="flex items-center gap-[8px]">
              <GripVertical className="size-[16px] text-[#adb5bd] cursor-grab active:cursor-grabbing" />
              <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[#495057] text-[12px] text-nowrap">
                <p className="leading-[normal] whitespace-pre font-bold">Teams</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start w-full">
            <div className="content-stretch flex gap-[16px] items-center w-full">
              {teams.slice(0, 2).map((team, idx) => (
                <div key={idx} className="basis-0 bg-[#f8f9fa] grow h-[51.5px] min-h-px min-w-px relative rounded-[8px] shrink-0">
                  <div className="flex flex-col justify-center size-full">
                    <div className="box-border content-stretch flex flex-col h-[51.5px] items-start justify-center leading-[0] px-[16px] py-[4px] text-nowrap w-full">
                      <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center not-italic text-[#016699] text-[14px]">
                        <p className="leading-[normal] text-nowrap whitespace-pre">{team.name}</p>
                      </div>
                      <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="leading-[normal] text-nowrap whitespace-pre">{team.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="content-stretch flex gap-[16px] items-center w-full">
              <div className="basis-0 bg-[#f8f9fa] grow h-[51.5px] min-h-px min-w-px relative rounded-[8px] shrink-0">
                <div className="flex flex-col justify-center size-full">
                  <div className="box-border content-stretch flex flex-col h-[51.5px] items-start justify-center leading-[0] px-[16px] py-[4px] text-nowrap w-full">
                    <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center not-italic text-[#016699] text-[14px]">
                      <p className="leading-[normal] text-nowrap whitespace-pre">{teams[2].name}</p>
                    </div>
                    <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      <p className="leading-[normal] text-nowrap whitespace-pre">{teams[2].role}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="basis-0 bg-white grow h-[51.5px] min-h-px min-w-px relative rounded-[8px] shrink-0">
                <div className="flex flex-row items-center size-full">
                  <div className="box-border content-stretch flex h-[51.5px] items-center justify-between px-[16px] py-[4px] w-full">
                    <div className="content-stretch flex flex-col gap-[6px] items-start leading-[0] text-nowrap text-white">
                      <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="leading-[normal] text-nowrap whitespace-pre">Golongan Darah</p>
                      </div>
                      <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center not-italic text-[14px]">
                        <p className="leading-[normal] text-nowrap whitespace-pre">A</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    careerSuccession: {
      id: 'careerSuccession',
      render: () => (
        <div className="bg-white relative rounded-[8px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] shrink-0 w-full">
          <div className="flex flex-col items-end overflow-x-clip overflow-y-auto size-full">
            <div className="box-border content-stretch flex flex-col gap-[16px] items-end p-[16px] w-full">
              <div className="content-stretch flex items-center justify-between w-full">
                <div className="flex items-center gap-[8px]">
                  <GripVertical className="size-[16px] text-[#adb5bd] cursor-grab active:cursor-grabbing" />
                  <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[#495057] text-[12px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre font-bold">{`Career & Succession Plan`}</p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[4px] items-center justify-end">
                  <button 
                    onClick={() => setIsSuccessionChartOpen(true)}
                    className="overflow-clip relative shrink-0 size-[16px] hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0 ml-auto"
                    title="View Succession Chart"
                  >
                    <Network className="size-[16px] text-[#016699]" />
                  </button>
                </div>
              </div>

              <div className="content-stretch flex flex-col gap-[20px] items-start w-full">
                {/* Career Plan */}
                <div className="content-stretch flex flex-col gap-[12px] items-end w-full">
                  <div className="content-stretch flex flex-col gap-[4px] items-start w-full">
                    <div className="content-stretch flex gap-[6px] items-center w-full">
                      <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] text-[#495057] text-[10px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="leading-[normal] whitespace-pre">Career Plan 1</p>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[8px] items-center w-full">
                      <div className="basis-0 bg-[#f8f9fa] grow min-h-px min-w-px relative rounded-[8px] shrink-0">
                        <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
                        <div className="flex flex-row items-center size-full">
                          <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] w-full">
                            <div className="basis-0 content-stretch flex flex-col grow items-start justify-center leading-[0] min-h-px min-w-px">
                              <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center not-italic text-[#495057] text-[12px] w-full">
                                <p className="leading-[normal]">{careerPlan.position}</p>
                              </div>
                              <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center text-[#016699] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="leading-[normal]">{careerPlan.incumbent}</p>
                              </div>
                            </div>
                            <div className="content-stretch flex items-center justify-center">
                              <div 
                                className="box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] rounded-[800px]"
                                style={{ 
                                  backgroundColor: promotionReadiness >= 81 ? "#f2f9f7" : "#fff2e4",
                                  border: `1px solid ${promotionReadiness >= 81 ? "#00875a" : "#ca6f00"}`
                                }}
                              >
                                <p 
                                  className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] text-[10px] text-nowrap uppercase whitespace-pre" 
                                  style={{ 
                                    fontVariationSettings: "'wdth' 100",
                                    color: promotionReadiness >= 81 ? "#00875a" : "#ca6f00"
                                  }}
                                >
                                  {careerPlan.readiness}
                                </p>
                              </div>
                            </div>
                            <div className="content-stretch flex items-center w-[68px]">
                              <div 
                                className="box-border content-stretch flex gap-[4px] items-center px-[8px] py-[2px] rounded-[800px]"
                                style={{ 
                                  backgroundColor: promotionReadiness >= 81 ? "#f2f9f7" : "#fff2e4",
                                  border: `1px solid ${promotionReadiness >= 81 ? "#00875a" : "#ca6f00"}`
                                }}
                              >
                                <p 
                                  className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] text-[10px] text-nowrap uppercase whitespace-pre" 
                                  style={{ 
                                    fontVariationSettings: "'wdth' 100",
                                    color: promotionReadiness >= 81 ? "#00875a" : "#ca6f00"
                                  }}
                                >
                                  {careerPlan.status.toUpperCase()}
                                </p>
                              </div>
                            </div>
                            <div className="content-stretch flex items-center">
                              <div className="overflow-clip relative shrink-0 size-[20px]">
                                <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
                                  <div className="absolute inset-[-15%_-7.5%]" style={{ "--stroke-0": "rgba(248, 249, 250, 1)" } as React.CSSProperties}>
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7">
                                      <path d={svgPaths.p3d2c9380} stroke="var(--stroke-0, #F8F9FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incumbent */}
                <div className="bg-[#f8f9fa] h-[46px] relative rounded-[8px] shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[2px_2px_20px_0px_rgba(1,102,153,0.2)]" />
                  <div className="flex flex-row items-center size-full">
                    <div className="box-border content-stretch flex gap-[8px] h-[46px] items-center p-[8px] w-full">
                      <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[30px]">
                        {employee.imageUrl ? (
                          <ImageWithFallback
                            src={employee.imageUrl}
                            alt={employee.name}
                            className="absolute inset-0 object-cover size-full"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[#dee2e6]" />
                        )}
                      </div>
                      <div className="basis-0 content-stretch flex flex-col grow items-start justify-center leading-[0] min-h-px min-w-px">
                        <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center not-italic text-[#016699] text-[12px] w-full">
                          <p className="leading-[normal]">{employee.name}</p>
                        </div>
                        <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">{employee.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Successors */}
                <div key={refreshKey} className="content-stretch flex flex-col gap-[6px] items-end w-full">
                  {successors.length > 0 ? (
                    successors.map((successor, idx) => {
                      const isAdditional = additionalSuccessorIds.includes(successor.id);
                      return (
                        <SuccessorCard
                          key={successor.id}
                          successor={successor}
                          index={idx}
                          onShowIDPProgress={onShowIDPProgress}
                          isAdditional={isAdditional}
                          onRemove={isAdditional ? handleRemoveSuccessor : undefined}
                        />
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center p-[12px] w-full bg-[#f8f9fa] rounded-[8px]">
                      <p className="font-['Open_Sans',_sans-serif] text-[#adb5bd] text-[12px] text-center">No successors available</p>
                    </div>
                  )}
                </div>

                {/* Add Successors Button */}
                <button
                  onClick={() => setIsAddSuccessorDialogOpen(true)}
                  className="bg-white border border-[#016699] box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[6px] rounded-[28px] w-full hover:bg-[#f0f7ff] transition-colors cursor-pointer"
                >
                  <UserPlus className="size-[16px] text-[#016699]" />
                  <p className="font-['Open_Sans',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-nowrap whitespace-pre">Add Successors</p>
                </button>

                {/* Compare Successors Button */}
                {successors.length > 0 && (
                  <button
                    onClick={() => onCompare?.(employee, successors)}
                    className="bg-[#016699] border border-[#016699] box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[6px] rounded-[28px] w-full hover:bg-[#015580] transition-colors cursor-pointer"
                  >
                    <Users className="size-[16px] text-white" />
                    <p className="font-['Open_Sans',_sans-serif] leading-[normal] not-italic relative shrink-0 text-white text-[14px] text-nowrap whitespace-pre">Compare Successors</p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    },
    extensionData: {
      id: 'extensionData',
      render: () => (
        <div className="bg-white relative rounded-[8px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] shrink-0 w-full">
          <div className="size-full">
            <div className="box-border content-stretch flex flex-col gap-[23px] items-start p-[16px] w-full">
              <div className="content-stretch flex items-center justify-between w-full">
                <div className="flex items-center gap-[8px]">
                  <GripVertical className="size-[16px] text-[#adb5bd] cursor-grab active:cursor-grabbing" />
                  <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[#495057] text-[12px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre font-bold">Extension Data</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[16px] items-start w-full">
                <div className="content-stretch flex gap-[16px] items-center w-full">
                  <div className="basis-0 bg-[#f8f9fa] grow h-[51.5px] min-h-px min-w-px relative rounded-[8px] shrink-0">
                    <div className="size-full">
                      <div className="box-border content-stretch flex h-[51.5px] items-start justify-between px-[16px] py-[4px] w-full">
                        <div className="content-stretch flex flex-col gap-[6px] items-start">
                          <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] text-[#495057] text-[10px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                            <p className="leading-[normal] whitespace-pre">Performance</p>
                          </div>
                          <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[#016699] text-[14px] text-nowrap">
                            <p className="leading-[normal] whitespace-pre">4.3</p>
                          </div>
                          <div className="absolute flex items-center justify-center left-[21px] size-[10px] top-[20px]">
                            <div className="flex-none rotate-[180deg]">
                              <div className="overflow-clip relative size-[10px]">
                                <div className="absolute bottom-[20.83%] left-1/4 right-1/4 top-[20.83%]">
                                  <div className="absolute inset-[-8.04%_-9.38%]" style={{ "--stroke-0": "rgba(222, 53, 11, 1)" } as React.CSSProperties}>
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 7">
                                      <path d={svgPaths.pe7b5200} stroke="var(--stroke-0, #DE350B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9375" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[#f8f9fa] grow h-[51.5px] min-h-px min-w-px relative rounded-[8px] shrink-0">
                    <div className="size-full">
                      <div className="box-border content-stretch flex h-[51.5px] items-start justify-between px-[16px] py-[4px] w-full">
                        <div className="content-stretch flex flex-col gap-[6px] items-start">
                          <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] text-[#495057] text-[10px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                            <p className="leading-[normal] whitespace-pre">Engagement</p>
                          </div>
                          <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[#016699] text-[14px] text-nowrap">
                            <p className="leading-[normal] whitespace-pre">4.3</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[16px] items-center w-full">
                  <div className="bg-[#f8f9fa] box-border content-stretch flex h-[51.5px] items-start justify-between px-[16px] py-[4px] rounded-[8px] shrink-0 w-[160.167px]">
                    <div className="content-stretch flex flex-col gap-[6px] items-start leading-[0] text-nowrap">
                      <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="leading-[normal] text-nowrap whitespace-pre">Medical Checkup</p>
                      </div>
                      <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center not-italic text-[#016699] text-[14px]">
                        <p className="leading-[normal] text-nowrap whitespace-pre">Baik</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[#f8f9fa] grow h-[51.5px] min-h-px min-w-px relative rounded-[8px] shrink-0">
                    <div className="size-full">
                      <div className="box-border content-stretch flex h-[51.5px] items-start justify-between px-[16px] py-[4px] w-full">
                        <div className="content-stretch flex flex-col gap-[6px] items-start leading-[0] text-nowrap">
                          <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            <p className="leading-[normal] text-nowrap whitespace-pre">Career Aspiration</p>
                          </div>
                          <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center not-italic text-[#016699] text-[14px]">
                            <p className="leading-[normal] text-nowrap whitespace-pre">3 Position</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    employeeData: {
      id: 'employeeData',
      render: () => (
        <div className="bg-white relative rounded-[8px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] shrink-0 w-full">
          <div className="flex flex-col items-center size-full">
            <div className="box-border content-stretch flex flex-col gap-[16px] items-center p-[16px] w-full">
              <div className="content-stretch flex items-center justify-between w-full">
                <div className="flex items-center gap-[8px]">
                  <GripVertical className="size-[16px] text-[#adb5bd] cursor-grab active:cursor-grabbing" />
                  <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[#495057] text-[12px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre font-bold">Employee Data</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[24px] items-center w-full">
                <div className="box-border content-stretch flex flex-col gap-[2px] items-center px-0 py-[4px] w-full">
                  <div className="relative shrink-0 w-full">
                    <div className="size-full">
                      <div className="box-border content-stretch flex font-['Open_Sans:Regular',_sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] text-[#495057] text-[12px] w-full">
                        <div className="flex flex-col justify-center w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">NIK</p>
                        </div>
                        <div className="basis-0 flex flex-col grow justify-center min-h-px min-w-px text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">2349710001</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0 w-full">
                    <div className="size-full">
                      <div className="box-border content-stretch flex font-['Open_Sans:Regular',_sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] text-[#495057] text-[12px] w-full">
                        <div className="flex flex-col justify-center w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">Phone</p>
                        </div>
                        <div className="basis-0 flex flex-col grow justify-center min-h-px min-w-px text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">+6282342905893</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0 w-full">
                    <div className="size-full">
                      <div className="box-border content-stretch flex font-['Open_Sans:Regular',_sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] text-[#495057] text-[12px] w-full">
                        <div className="flex flex-col justify-center w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">Date of Birth</p>
                        </div>
                        <div className="basis-0 flex flex-col grow justify-center min-h-px min-w-px text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">12 Februari 1988</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0 w-full">
                    <div className="size-full">
                      <div className="box-border content-stretch flex font-['Open_Sans:Regular',_sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] text-[#495057] text-[12px] w-full">
                        <div className="flex flex-col justify-center w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">Age</p>
                        </div>
                        <div className="basis-0 flex flex-col grow justify-center min-h-px min-w-px text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">36</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0 w-full">
                    <div className="size-full">
                      <div className="box-border content-stretch flex font-['Open_Sans:Regular',_sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] text-[#495057] text-[12px] w-full">
                        <div className="flex flex-col justify-center w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">Gender</p>
                        </div>
                        <div className="basis-0 flex flex-col grow justify-center min-h-px min-w-px text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">{employee.gender || 'Laki-laki'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0 w-full">
                    <div className="size-full">
                      <div className="box-border content-stretch flex font-['Open_Sans:Regular',_sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] text-[#495057] text-[12px] w-full">
                        <div className="flex flex-col justify-center w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">Last Education</p>
                        </div>
                        <div className="basis-0 flex flex-col grow justify-center min-h-px min-w-px text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal]">S2 Psychology UNPAD</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="box-border content-stretch flex gap-[8px] items-center px-[8px] py-[4px] rounded-[28px]">
                <div className="overflow-clip relative shrink-0 size-[20px]">
                  <div className="absolute inset-[12.5%]">
                    <div className="absolute inset-[-5%]" style={{ "--stroke-0": "rgba(173, 181, 189, 1)" } as React.CSSProperties}>
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
                        <path d={svgPaths.p38d12170} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic text-[#adb5bd] text-[14px] text-nowrap whitespace-pre">More</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    development: {
      id: 'development',
      render: () => (
        <div className="bg-white h-[392px] relative rounded-[8px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] shrink-0 w-full">
          <div className="overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex flex-col gap-[16px] h-[392px] items-start p-[16px] w-full">
              <div className="content-stretch flex items-center justify-between w-full">
                <div className="flex items-center gap-[8px]">
                  <GripVertical className="size-[16px] text-[#adb5bd] cursor-grab active:cursor-grabbing" />
                  <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[#495057] text-[12px] text-nowrap">
                    <p className="leading-[normal] whitespace-pre font-bold">Development</p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[4px] items-center justify-end">
                  <div className="overflow-clip relative shrink-0 size-[16px]">
                    <div className="absolute inset-[16.667%]">
                      <div className="absolute inset-[-7.031%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                          <path d={svgPaths.p10ddf7c0} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-clip relative shrink-0 size-[16px]">
                    <div className="absolute inset-[16.67%_16.67%_12.5%_16.67%]">
                      <div className="absolute inset-[-6.62%_-7.03%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13">
                          <path d={svgPaths.p371f8300} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-clip relative shrink-0 size-[16px]">
                    <div className="absolute inset-[16.67%_45.83%]">
                      <div className="absolute inset-[-7.03%_-56.25%]" style={{ "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties}>
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 13">
                          <g>
                            <path d={svgPaths.pccbae00} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            <path d={svgPaths.p363ea80} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-stretch flex items-end justify-between w-full">
                <div className="flex flex-col font-['Avenir:Heavy',_sans-serif] justify-center leading-[0] not-italic text-[#495057] text-[12px] text-nowrap">
                  <p className="leading-[normal] whitespace-pre">IDP List</p>
                </div>
                <div className="box-border content-stretch flex gap-[8px] items-center px-[8px] py-[4px] rounded-[28px]">
                  <div className="overflow-clip relative shrink-0 size-[20px]">
                    <div className="absolute inset-[20.833%]">
                      <div className="absolute inset-[-6.429%]" style={{ "--fill-0": "rgba(1, 102, 153, 1)", "--stroke-0": "rgba(1, 102, 153, 1)" } as React.CSSProperties}>
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                          <path d={svgPaths.p2593f8c0} stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic text-[#016699] text-[14px] text-nowrap whitespace-pre">Create New IDP</p>
                </div>
              </div>

              {/* IDP List Items */}
              <div className="content-stretch flex flex-col gap-[12px] items-center w-full">
                {idpList.map((idp, idx) => (
                  <div key={idx} className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
                    <div className="size-full">
                      <div className="box-border content-stretch flex flex-col gap-[12px] items-start p-[16px] w-full">
                        <div className="content-start flex flex-wrap gap-[4px] items-start w-full">
                          {idp.competencies.map((comp, cidx) => (
                            <div key={cidx} className="content-stretch flex items-center justify-center">
                              <div className="bg-[#f8f9fa] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] rounded-[800px]">
                                <p className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] text-[#495057] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                  {comp}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="content-stretch flex gap-[8px] items-center w-full">
                          <div className="overflow-clip relative shrink-0 size-[16px]">
                            <div className="absolute bottom-[12.5%] left-1/4 right-1/4 top-[12.5%]">
                              <div className="absolute inset-[-6.25%_-9.38%]" style={{ "--stroke-0": "rgba(73, 80, 87, 1)" } as React.CSSProperties}>
                                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 14">
                                  <path d={svgPaths.p31b1e080} stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] text-[#495057] text-[12px] w-[124.333px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            <p className="leading-[normal]">{idp.mentor}</p>
                          </div>
                        </div>
                        <div className="content-stretch flex gap-[8px] items-start w-full">
                          <div className="overflow-clip relative shrink-0 size-[16px]">
                            <div className="absolute inset-[12.5%_8.33%_8.33%_12.5%]">
                              <div className="absolute inset-[-5.921%]" style={{ "--stroke-0": "rgba(73, 80, 87, 1)" } as React.CSSProperties}>
                                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                                  <path d={svgPaths.p1d4d7580} stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            <p className="leading-[normal]">{idp.period}</p>
                          </div>
                        </div>
                        <div className="content-stretch flex items-center w-full">
                          <div className="content-stretch flex items-start">
                            <div className={`${idp.status === 'done' ? 'bg-[#f2f9f7]' : 'bg-[#fff2e4]'} box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] rounded-[800px]`}>
                              <div className="overflow-clip relative shrink-0 size-[14px]">
                                {idp.status === 'done' ? (
                                  <div className="absolute inset-[22.92%_16.67%_27.08%_12.5%]">
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 7">
                                      <path clipRule="evenodd" d={svgPaths.p2eda3e00} fill="var(--fill-0, #00875A)" fillRule="evenodd" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="absolute inset-[13.43%_12.51%_13.43%_13.02%]">
                                    <div className="absolute inset-[-7.33%_-7.19%]" style={{ "--stroke-0": "rgba(253, 159, 40, 1)" } as React.CSSProperties}>
                                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                                        <path d={svgPaths.p15195200} stroke="var(--stroke-0, #FD9F28)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <p className={`font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ${idp.status === 'done' ? 'text-[#00875a]' : 'text-[#fd9f28]'} text-[10px] text-nowrap uppercase whitespace-pre`} style={{ fontVariationSettings: "'wdth' 100" }}>
                                {idp.status}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-[16px]">
      {/* Header with Back Button */}
      <div className="mx-auto mb-4 px-[16px] max-w-[1920px]">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-2 font-['Open_Sans',_sans-serif]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>

      {/* Main Content - 3 Column Layout with Draggable Cards */}
      <div className="mx-auto content-stretch grid grid-cols-12 gap-[16px] px-[16px] max-w-[1920px]">
        {columns.map((column, columnIndex) => (
          <ColumnDropZone
            key={columnIndex}
            columnIndex={columnIndex}
            isEmpty={column.length === 0}
            moveCard={moveCard}
          >
            {column.map((cardId, cardIndex) => (
              <DraggableCardWrapper
                key={cardId}
                id={cardId}
                columnIndex={columnIndex}
                cardIndex={cardIndex}
                moveCard={moveCard}
              >
                {allCards[cardId].render()}
              </DraggableCardWrapper>
            ))}
          </ColumnDropZone>
        ))}
      </div>

      {/* Add Successor Dialog */}
      <Dialog open={isAddSuccessorDialogOpen} onOpenChange={setIsAddSuccessorDialogOpen}>
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
                      setIsAddSuccessorDialogOpen(false);
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
                        Readiness score: {emp.readinessScore ?? 0}%
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
                      setIsAddSuccessorDialogOpen(false);
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
                        Readiness score: {emp.readinessScore ?? 0}%
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

      {/* Succession Chart Dialog */}
      <Dialog open={isSuccessionChartOpen} onOpenChange={setIsSuccessionChartOpen}>
        <DialogContent className="!max-w-[98vw] !w-[98vw] h-[96vh] font-['Open_Sans',_sans-serif] p-0 flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle className="font-['Open_Sans',_sans-serif] font-bold text-[#495057]">
              Succession Chart - {employee.name}
            </DialogTitle>
            <DialogDescription className="text-[#6c757d] text-[12px]">
              Visual representation of succession planning and career path
            </DialogDescription>
          </DialogHeader>
          <SuccessionChart
            employee={employee}
            allEmployees={employees}
            heatmapRanges={heatmapConfig.needDevelop}
            readinessScoreRanges={heatmapConfig.readinessScore}
            heatmapConfig={heatmapConfig}
            visibleColumns={defaultVisibleColumns}
            onEmployeeClick={(emp) => {
              // Close the succession chart dialog
              setIsSuccessionChartOpen(false);
              // Note: To navigate to the clicked employee, we would need a prop from parent
              // For now, we just close the dialog. User can see the employee in the main view.
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function EmployeeDetail(props: EmployeeDetailProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <EmployeeDetailContent {...props} />
    </DndProvider>
  );
}

