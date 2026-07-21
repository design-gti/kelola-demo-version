import { useState } from "react";
import { type HeatmapRange } from "./HeatmapSettings";
import { Minus, Info } from "lucide-react";

interface HeatmapLegendProps {
  ranges: HeatmapRange[];
  mode: 'performance' | 'successor-risk' | 'need-successors' | 'need-develop' | 'need-successors-copy';
  isVisible: boolean;
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="chevron-down">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function LegendItem({ color, range }: { color: string; range: string }) {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[17px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          <circle cx="8.5" cy="8.5" fill={color} id="Ellipse 38" r="8.5" />
        </svg>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">{range}</p>
      </div>
    </div>
  );
}

export default function HeatmapLegend({
  ranges,
  mode,
  isVisible,
}: HeatmapLegendProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Sort ranges by min value (ascending)
  const sortedRanges = [...ranges].sort((a, b) => a.min - b.min);
  
  // Determine title based on mode
  const title = mode === 'performance' || mode === 'need-develop' ? 'Competency Score' : 'Readiness Score';
  
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-[#f8f9fa] rounded-[8px]" data-name="Heatmap style & Legend">
      {isMinimized ? (
        // Minimized view - just show Info icon button
        <div className="box-border flex items-center justify-center p-[12px] relative shadow-[0_10px_40px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] bg-white rounded-[8px] w-[48px] h-[48px]">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
            title="Expand legend"
          >
            <Info className="w-5 h-5 text-[#495057]" />
          </button>
        </div>
      ) : (
        // Expanded view - show full legend
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative shadow-[0_10px_40px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] min-w-[280px] bg-white rounded-[8px]">
          {/* Minimize button in top right corner */}
          <button
            onClick={() => setIsMinimized(true)}
            className="absolute top-[8px] right-[8px] flex items-center justify-center hover:bg-gray-100 rounded p-2 transition-colors cursor-pointer"
            title="Minimize legend"
          >
            <Minus className="w-5 h-5 text-[#495057]" />
          </button>

          {/* Legend */}
          {(mode === 'need-successors' || mode === 'need-successors-copy') ? (
            <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
              <div className="flex h-[8px] items-center justify-center relative shrink-0 w-full rounded-[4px] overflow-hidden">
                <div className="bg-gradient-to-r from-[#fe0d00] to-[#88E113] via-50% via-[#f59e02] w-full h-full" />
              </div>
              <div className="content-stretch flex font-['Open_Sans',sans-serif] items-center justify-between leading-[normal] relative shrink-0 text-[#495057] text-[10px] w-full pt-[4px]">
                <p className="overflow-ellipsis overflow-hidden text-nowrap">No ready successors</p>
                <p className="overflow-ellipsis overflow-hidden text-nowrap">Successors ready now</p>
              </div>
            </div>
          ) : mode === 'need-develop' ? (
            <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
              <div className="flex h-[8px] items-center justify-center relative shrink-0 w-full rounded-[4px] overflow-hidden">
                {/* Dynamic gradient based on heatmap config */}
                <div 
                  className="w-full h-full" 
                  style={{
                    background: `linear-gradient(to right, ${sortedRanges.map((range, idx) => {
                      const position = (idx / (sortedRanges.length - 1)) * 100;
                      return `${range.color} ${position}%`;
                    }).join(', ')})`
                  }}
                />
              </div>
              <div className="content-stretch flex font-['Open_Sans',sans-serif] items-center justify-between leading-[normal] relative shrink-0 text-[#495057] text-[10px] w-full pt-[4px]">
                <p className="overflow-ellipsis overflow-hidden text-nowrap">Need Intervention</p>
                <p className="overflow-ellipsis overflow-hidden text-nowrap">Stable condition</p>
              </div>
            </div>
          ) : (
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <p className="font-['Open_Sans',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre font-bold">{title}</p>
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                {sortedRanges.map((range, index) => {
                  const rangeLabel = `${range.min} - ${range.max}`;
                  
                  return (
                    <LegendItem
                      key={index}
                      color={range.color}
                      range={rangeLabel}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
