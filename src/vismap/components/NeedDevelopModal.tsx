import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Employee } from "../data/orgChartData";
import { HeatmapConfig } from "./HeatmapSettings";

interface NeedDevelopModalProps {
  employees: Employee[];
  heatmapConfig: HeatmapConfig;
  onZoomToEmployee?: (employeeId: string) => void;
}

export default function NeedDevelopModal({ employees, heatmapConfig, onZoomToEmployee }: NeedDevelopModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getNeedDevelopEmployees = (): Employee[] => {
    const ranges = heatmapConfig.needDevelop || [];

    if (ranges.length === 0) {
      return employees.filter(emp => (emp.competencyScore ?? 0) <= 65);
    }

    // Find red range by color or fallback to lowest min
    let redRange = ranges.find(range => {
      const color = range.color.toLowerCase();
      return color === "#fe0d00" || color === "#ff0000" || color.includes("fe0d00") || color.includes("ff0000");
    });

    if (!redRange) {
      redRange = ranges.reduce((lowest, current) =>
        current.min < lowest.min ? current : lowest
      );
    }

    return employees.filter(emp => {
      const score = emp.competencyScore ?? 0;
      return score >= redRange.min && score <= redRange.max;
    });
  };

  const needDevelopEmployees = getNeedDevelopEmployees();
  const needDevelopCount = needDevelopEmployees.length;
  const totalCount = employees.length;

  return (
    <div
      className="bg-white content-stretch flex flex-col gap-[16px] items-start px-[16px] py-[12px] relative rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] min-w-[280px]"
      data-name="Need Develop"
    >
      {/* Header */}
      <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
        <div
          className="flex flex-col font-['Open_Sans',sans-serif] font-normal justify-end leading-[0] relative shrink-0 text-[#495057] text-[0px] whitespace-nowrap"
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          <p className="text-[12px]">
            <span className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic text-[#495057]">
              {needDevelopCount}
            </span>
            <span className="leading-[normal]">/{totalCount} Employees Need Develop</span>
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="overflow-clip relative shrink-0 size-[20px] hover:opacity-70 transition-opacity cursor-pointer"
          data-name="chevron-toggle"
        >
          {isExpanded ? (
            <ChevronUp className="size-[20px] text-[#58595B]" strokeWidth={1.5} />
          ) : (
            <ChevronDown className="size-[20px] text-[#58595B]" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Expanded list */}
      {isExpanded && (
        <div className="flex flex-col gap-[8px] items-start relative w-full max-h-[400px] overflow-y-auto">
          {needDevelopEmployees.length > 0 ? (
            needDevelopEmployees.map((emp) => (
              <div
                key={emp.id}
                className={`bg-[#f8f9fa] relative rounded-[4px] shrink-0 w-full ${onZoomToEmployee ? 'cursor-pointer hover:bg-[#e9ecef] transition-colors' : ''}`}
                onClick={() => onZoomToEmployee?.(emp.id)}
              >
                <div className="content-stretch flex flex-col items-start p-[8px] relative size-full">
                  <div className="content-stretch flex flex-col gap-[2px] items-start leading-[normal] relative shrink-0 w-full whitespace-nowrap">
                    <p className="font-['Avenir:Heavy',sans-serif] not-italic relative shrink-0 text-[#016699] text-[12px]">
                      {emp.name}
                    </p>
                    <p
                      className="font-['Open_Sans',sans-serif] font-normal relative shrink-0 text-[#495057] text-[10px]"
                      style={{ fontVariationSettings: "'wdth' 100" }}
                    >
                      {emp.position}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-[12px] w-full">
              <p className="font-['Open_Sans',sans-serif] text-[#adb5bd] text-[12px] text-center">
                No employees need development
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

