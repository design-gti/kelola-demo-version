import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Employee } from "../data/orgChartData";
import { HeatmapConfig } from "./HeatmapSettings";

interface SuccessionRiskModalProps {
  employees: Employee[];
  heatmapConfig: HeatmapConfig;
  onEmployeeClick?: (employeeId: string) => void;
  onZoomToEmployee?: (employeeId: string) => void;
}

export default function SuccessionRiskModal({ employees, heatmapConfig, onEmployeeClick, onZoomToEmployee }: SuccessionRiskModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get positions with succession risk (red heatmap = low readiness score)
  const getSuccessionRiskPositions = (): Employee[] => {
    // Find the red range from heatmap config (lowest range is typically red)
    const ranges = heatmapConfig.readinessScore || [];

    if (ranges.length === 0) {
      // Fallback: assume red is 0-60
      return employees.filter(emp => {
        const score = emp.readinessScore ?? emp.competencyScore;
        return score <= 60;
      });
    }

    // Find red range - look for #FF0004 or similar red colors, or use the lowest range
    let redRange = ranges.find(range => {
      const color = range.color.toLowerCase();
      return color === "#ff0004" || color === "rgb(255, 0, 4)" || color.includes("ff0004");
    });

    // If no exact red found, use the range with lowest min value (typically red)
    if (!redRange) {
      redRange = ranges.reduce((lowest, current) =>
        current.min < lowest.min ? current : lowest
      );
    }

    // Filter employees whose readiness score falls in red range
    return employees.filter(emp => {
      const score = emp.readinessScore ?? emp.competencyScore;
      return score >= redRange.min && score <= redRange.max;
    });
  };

  const riskPositions = getSuccessionRiskPositions();
  const riskCount = riskPositions.length;
  const totalCount = employees.length;

  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start px-[16px] py-[12px] relative rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] min-w-[280px]" data-name="Succession Risk">
      {/* Header */}
      <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
        <div className="flex flex-col font-['Open_Sans',sans-serif] font-normal justify-end leading-[0] relative shrink-0 text-[#495057] text-[0px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="text-[12px]">
            <span className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic text-[#495057]">{riskCount}</span>
            <span className="leading-[normal]">/{totalCount} Succession Risk</span>
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="overflow-clip relative shrink-0 size-[20px] hover:opacity-70 transition-opacity cursor-pointer"
          data-name="chevron-down"
        >
          {isExpanded ? (
            <ChevronUp className="size-[20px] text-[#58595B]" strokeWidth={1.5} />
          ) : (
            <ChevronDown className="size-[20px] text-[#58595B]" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Expanded list - fixed height, scrollable */}
      {isExpanded && (
        <div className="flex flex-col gap-[8px] items-start relative w-full max-h-[400px] overflow-y-auto">
          {riskPositions.length > 0 ? (
            riskPositions.map((emp) => (
              <div
                key={emp.id}
                className={`bg-[#f8f9fa] relative rounded-[4px] shrink-0 w-full ${(onEmployeeClick || onZoomToEmployee) ? 'cursor-pointer hover:bg-[#e9ecef] transition-colors' : ''}`}
                onClick={() => {
                  onEmployeeClick?.(emp.id);
                  onZoomToEmployee?.(emp.id);
                }}
              >
                <div className="content-stretch flex flex-col items-start p-[8px] relative size-full">
                  <div className="content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap">
                    <p className="font-['Avenir:Heavy',sans-serif] not-italic relative shrink-0 text-[#016699] text-[12px]">
                      {emp.position}
                    </p>
                    <p className="font-['Open_Sans',sans-serif] font-normal relative shrink-0 text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {emp.name}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-[12px] w-full">
              <p className="font-['Open_Sans',sans-serif] text-[#adb5bd] text-[12px] text-center">
                No succession risk positions
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

