import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { X } from "lucide-react";
import svgPaths from "../imports/svg-6otnznij8n";

export interface HeatmapRange {
  color: string;
  min: number;
  max: number;
}

export interface HeatmapConfig {
  needDevelop: HeatmapRange[];
  readinessScore: HeatmapRange[];
}

interface HeatmapSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: HeatmapConfig;
  onSave: (config: HeatmapConfig) => void;
}

export default function HeatmapSettings({ isOpen, onClose, currentConfig, onSave }: HeatmapSettingsProps) {
  const [insight, setInsight] = useState("Need Develop");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState<HeatmapConfig>(currentConfig);

  const insightOptions = ["Need Develop", "Readiness Score"];

  // Update temp config when currentConfig changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      setTempConfig(currentConfig);
    }
  }, [isOpen, currentConfig]);

  // Get current ranges based on selected insight
  const getCurrentRanges = (): HeatmapRange[] => {
    return insight === "Need Develop" ? tempConfig.needDevelop : tempConfig.readinessScore;
  };

  const ranges = getCurrentRanges();

  const handleRangeChange = (index: number, field: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    
    setTempConfig(prev => {
      const key = insight === "Need Develop" ? "needDevelop" : "readinessScore";
      const updated = [...prev[key]];
      updated[index][field] = numValue;
      
      // Auto-update nilai minimum level berikutnya jika max value berubah
      if (field === 'max' && index < updated.length - 1) {
        updated[index + 1].min = numValue + 1;
      }
      
      return {
        ...prev,
        [key]: updated
      };
    });
  };

  const handleSave = () => {
    onSave(tempConfig);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[525px] p-0 gap-0 bg-[#f8f9fa] font-['Open_Sans',_sans-serif]">
        <DialogTitle className="sr-only">Settings Heatmap Condition</DialogTitle>
        <DialogDescription className="sr-only">
          Configure heatmap conditions and color ranges for organizational chart visualization
        </DialogDescription>
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
          {/* Header */}
          <div className="content-stretch flex h-[22px] items-center justify-between relative shrink-0 w-full">
            <p className="font-['Avenir',_sans-serif] font-[900] leading-[normal] not-italic relative shrink-0 text-[#58595b] text-[16px] text-nowrap whitespace-pre">
              Settings Heatmap Condition
            </p>
            <button 
              className="block cursor-pointer relative shrink-0 size-[20px]" 
              onClick={onClose}
            >
              <X className="size-full text-[#58595b]" strokeWidth={1.5} />
            </button>
          </div>

          {/* Insight Dropdown */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
              <p className="font-['Avenir',_sans-serif] font-[900] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">
                Criteria
              </p>
            </div>
            <div 
              className="bg-[#f8f9fa] relative rounded-[16px] shrink-0 w-full cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
              <div className="flex flex-row items-center size-full">
                <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
                  <div className="basis-0 flex flex-col font-['Open_Sans',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-nowrap">
                    <p className="leading-[normal] overflow-ellipsis overflow-hidden">{insight}</p>
                  </div>
                  <div className="relative shrink-0 size-[16px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                      <path d="M4 6L8 10L12 6" stroke="#58595B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#dee2e6] rounded-[8px] shadow-lg z-10">
                  {insightOptions.map((option) => (
                    <div
                      key={option}
                      className="px-[12px] py-[8px] hover:bg-[#f8f9fa] cursor-pointer text-[#495057] text-[12px] font-['Open_Sans',_sans-serif]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInsight(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Readiness Score Section */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal h-[16px] justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#495057] text-[10px] text-nowrap w-full">
              <p className="leading-[normal] overflow-ellipsis overflow-hidden">{insight === "Need Develop" ? "Competency score" : "Readiness score"}</p>
            </div>
            <div className="h-0 relative shrink-0 w-full">
              <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 461 1">
                  <line stroke="#DEE2E6" x2="461" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Color Ranges */}
          {ranges.map((range, index) => (
            <div key={index} className="content-stretch flex gap-[16px] items-center relative shrink-0">
              <div className="flex flex-row items-center self-stretch">
                <div className="h-full shrink-0 w-[29px]" style={{ backgroundColor: range.color }} />
              </div>
              
              {/* Nilai Minimum */}
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[200px]">
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                  <p className="font-['Avenir',_sans-serif] font-[900] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">
                    Nilai Minimum
                  </p>
                </div>
                <div className="bg-[#e9ecef] relative rounded-[16px] shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
                  <div className="flex flex-row items-center size-full">
                    <input
                      type="number"
                      value={range.min}
                      onChange={(e) => handleRangeChange(index, 'min', e.target.value)}
                      className="box-border w-full bg-transparent px-[12px] py-[8px] font-['Open_Sans',_sans-serif] font-normal text-[#495057] text-[12px] outline-none cursor-not-allowed"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              {/* Nilai Maksimum */}
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[200px]">
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                  <p className="font-['Avenir',_sans-serif] font-[900] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">
                    Nilai Maksimum
                  </p>
                </div>
                <div className={`${index === ranges.length - 1 ? 'bg-[#e9ecef]' : 'bg-white'} relative rounded-[16px] shrink-0 w-full`}>
                  <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
                  <div className="flex flex-row items-center size-full">
                    <input
                      type="number"
                      value={range.max}
                      onChange={(e) => handleRangeChange(index, 'max', e.target.value)}
                      className={`box-border w-full bg-transparent px-[12px] py-[8px] font-['Open_Sans',_sans-serif] font-normal text-[#495057] text-[12px] outline-none ${index === ranges.length - 1 ? 'cursor-not-allowed' : ''}`}
                      disabled={index === ranges.length - 1}
                    />
                    <div className="relative shrink-0 size-[16px] mr-[12px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <g>
                          <path d={svgPaths.p7474000} fill="#868E96" />
                          <path d={svgPaths.p2dac3a00} fill="#868E96" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Buttons */}
          <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0 w-full">
            <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0">
              <button 
                className="box-border content-stretch cursor-pointer flex gap-[8px] items-center justify-center overflow-visible px-[12px] py-[8px] relative rounded-[28px] shrink-0 w-[80px]"
                onClick={onClose}
              >
                <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
                <p className="font-['Avenir',_sans-serif] font-[900] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-nowrap whitespace-pre">
                  Cancel
                </p>
              </button>
              <button 
                className="bg-[#016699] box-border content-stretch cursor-pointer flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative rounded-[28px] shrink-0 w-[107px]"
                onClick={handleSave}
              >
                <p className="font-['Avenir',_sans-serif] font-[900] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">
                  Save
                </p>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

