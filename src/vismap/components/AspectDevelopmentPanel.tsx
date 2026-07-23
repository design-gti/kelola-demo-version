import { useState } from "react";
import svgPaths from "../imports/svg-gf0oxykc11";
import { toast } from "sonner";

interface AspectData {
  name: string;
  score: number;
  standard: number;
}

export interface IDPFormData {
  selectedAspects: string[];
  developmentGoals: Record<string, string>;
  programType: 'job' | 'training';
  programDetails: string;
}

interface AspectDevelopmentPanelProps {
  aspects: AspectData[];
  onGenerateIDP?: (data: IDPFormData) => void;
  onQuickIDP?: () => void;
}

function CheckIcon() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="check">
          <path clipRule="evenodd" d={svgPaths.p3b440680} fill="white" fillRule="evenodd" />
        </g>
      </svg>
    </div>
  );
}

function CheckedBox() {
  return (
    <div className="bg-[#016699] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[16px]">
      <CheckIcon />
    </div>
  );
}

function EmptyBox() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function InfoCircle() {
  return (
    <div className="relative shrink-0 size-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_4004_1012)">
          <path d={svgPaths.p18fd5980} stroke="#ADB5BD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_4004_1012">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ScoreBox({ filled, highlighted, position }: { filled: boolean; highlighted: boolean; position: 'first' | 'middle' | 'last' }) {
  const borderRadius = position === 'first' ? 'rounded-bl-[4px] rounded-tl-[4px]' : 
                       position === 'last' ? 'rounded-br-[4px] rounded-tr-[4px]' : '';
  const bgColor = highlighted ? 'bg-[#d6e6ff]' : 'bg-white';
  
  return (
    <div className={`basis-0 ${bgColor} ${filled ? 'box-border content-stretch flex items-center justify-center' : ''} grow h-[24px] min-h-px min-w-px mr-[-1px] relative ${borderRadius} shrink-0`}>
      <div aria-hidden="true" className={`absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none ${borderRadius}`} />
      {filled && (
        <div className="relative shrink-0 size-[18px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <g>
              <path d="M3.75 9L7.5 12.75L15 5.25" stroke="#016699" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}

function ScoreVisualization({ score, standard }: { score: number; standard: number }) {
  // Standard is level 3 (index 2), current score determines which box gets the checkmark
  // Only ONE checkmark should appear at the score position (same as EmployeeDetailPanel)
  const currentScore = Math.round(score);
  
  return (
    <div className="box-border content-stretch flex items-start pl-0 pr-px py-0 relative shrink-0 w-full">
      {[0, 1, 2, 3, 4].map((index) => {
        const level = index + 1;
        const filled = level === currentScore; // CHANGED: Only fill the box matching the score
        const highlighted = level === standard;
        const position = index === 0 ? 'first' : index === 4 ? 'last' : 'middle';
        
        return <ScoreBox key={index} filled={filled} highlighted={highlighted} position={position} />;
      })}
    </div>
  );
}

function RadioSelected() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g>
          <path d={svgPaths.p180dff00} fill="#016699" />
          <circle cx="8" cy="8" fill="white" r="4" />
        </g>
      </svg>
    </div>
  );
}

function RadioUnselected() {
  return (
    <div className="bg-white relative rounded-[800px] shrink-0 size-[16px]">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[800px]" />
    </div>
  );
}

interface AspectCardProps {
  aspect: AspectData;
  isSelected: boolean;
  onToggleSelect: () => void;
  developmentGoals: string;
  onDevelopmentGoalsChange: (value: string) => void;
}

function AspectCard({ 
  aspect, 
  isSelected,
  onToggleSelect,
  developmentGoals,
  onDevelopmentGoalsChange
}: AspectCardProps) {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            {/* Header with checkbox, name, info icon */}
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
              <div 
                className="content-stretch flex gap-[12px] items-center relative shrink-0 cursor-pointer"
                onClick={onToggleSelect}
              >
                {isSelected ? <CheckedBox /> : <EmptyBox />}
              </div>
              <div className="content-stretch flex items-center relative shrink-0 flex-1">
                <div className="flex flex-col font-['Open_Sans',_sans-serif] justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <p className="leading-[normal] whitespace-pre">{aspect.name}</p>
                </div>
              </div>
              <InfoCircle />
            </div>

            {/* Score Visualization */}
            <ScoreVisualization score={aspect.score} standard={aspect.standard} />

            {/* Development Goals - Show when selected */}
            {isSelected && (
              <>
                {/* Development Goals */}
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full mt-[4px]">
                  <div className="bg-white relative rounded-[8px] shrink-0 w-full">
                    <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[8px]" />
                    <div className="size-full">
                      <div className="box-border content-stretch flex gap-[8px] items-start px-[12px] py-[8px] relative w-full">
                        <textarea
                          value={developmentGoals}
                          onChange={(e) => onDevelopmentGoalsChange(e.target.value)}
                          placeholder="Development Goals"
                          className="basis-0 flex flex-col font-['Open_Sans',_sans-serif] grow justify-center leading-[normal] min-h-[36px] min-w-px relative shrink-0 text-[#495057] text-[12px] bg-transparent border-none outline-none resize-none"
                          style={{ fontVariationSettings: "'wdth' 100" }}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AspectDevelopmentPanel({ aspects, onGenerateIDP, onQuickIDP }: AspectDevelopmentPanelProps) {
  const [selectedAspects, setSelectedAspects] = useState<Set<string>>(new Set());
  const [developmentGoals, setDevelopmentGoals] = useState<Record<string, string>>({});
  const [programType, setProgramType] = useState<'job' | 'training'>('job');
  const [programDetails, setProgramDetails] = useState<string>('');

  const handleToggleSelect = (aspectName: string) => {
    const newSelected = new Set(selectedAspects);
    if (newSelected.has(aspectName)) {
      newSelected.delete(aspectName);
    } else {
      newSelected.add(aspectName);
    }
    setSelectedAspects(newSelected);
  };

  const hasSelectedAspects = selectedAspects.size > 0;

  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start p-[12px] relative w-full">
          {/* Title */}
          <div className="flex flex-col font-['Avenir',_sans-serif] font-black justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] w-full">
            <p className="leading-[normal]">Aspect Need Develop</p>
          </div>

          {/* Aspect Cards */}
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            {aspects.map((aspect) => (
              <AspectCard
                key={aspect.name}
                aspect={aspect}
                isSelected={selectedAspects.has(aspect.name)}
                onToggleSelect={() => handleToggleSelect(aspect.name)}
                developmentGoals={developmentGoals[aspect.name] || ''}
                onDevelopmentGoalsChange={(value) => setDevelopmentGoals({ ...developmentGoals, [aspect.name]: value })}
              />
            ))}
          </div>

          {/* Development Program Section - Only show when at least one aspect is selected */}
          {hasSelectedAspects && (
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="font-['Avenir',_sans-serif] font-black leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] w-full">
                Development Program
              </p>
              
              {/* Radio buttons */}
              <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                <div 
                  className="content-stretch flex gap-[8px] items-center relative shrink-0 cursor-pointer"
                  onClick={() => setProgramType('job')}
                >
                  {programType === 'job' ? <RadioSelected /> : <RadioUnselected />}
                  <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0">
                    <div className="flex flex-col font-['Open_Sans',_sans-serif] h-[20px] justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                      <p className="leading-[normal]">Job Assignment</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="content-stretch flex gap-[8px] items-center relative shrink-0 cursor-pointer"
                  onClick={() => setProgramType('training')}
                >
                  {programType === 'training' ? <RadioSelected /> : <RadioUnselected />}
                  <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0">
                    <div className="flex flex-col font-['Open_Sans',_sans-serif] h-[20px] justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                      <p className="leading-[normal]">Training</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Details Textarea */}
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                <div className="bg-white relative rounded-[8px] shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  <div className="size-full">
                    <div className="box-border content-stretch flex gap-[8px] items-start px-[12px] py-[8px] relative w-full">
                      <textarea
                        value={programDetails}
                        onChange={(e) => setProgramDetails(e.target.value)}
                        placeholder="Tugas apa yang sedang atau akan dikerjakan employee?"
                        className="basis-0 flex flex-col font-['Open_Sans',_sans-serif] grow justify-center leading-[normal] min-h-[36px] min-w-px relative shrink-0 text-[#495057] text-[12px] bg-transparent border-none outline-none resize-none"
                        style={{ fontVariationSettings: "'wdth' 100" }}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate IDP Button */}
              <button 
                className="bg-[#016699] relative rounded-[28px] shrink-0 w-full hover:bg-[#015580] transition-colors"
                onClick={() => {
                  if (onGenerateIDP) {
                    onGenerateIDP({
                      selectedAspects: Array.from(selectedAspects),
                      developmentGoals,
                      programType,
                      programDetails
                    });
                  }
                }}
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative w-full">
                    <p className="font-['Avenir',_sans-serif] font-black leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">
                      Generate IDP Recommendation
                    </p>
                  </div>
                </div>
              </button>

              {/* Continue Button */}
              <button
                className="bg-[#016699] relative rounded-[28px] shrink-0 w-full hover:bg-[#015580] transition-colors hidden"
                onClick={() => {
                  if (onGenerateIDP) {
                    onGenerateIDP({
                      selectedAspects: Array.from(selectedAspects),
                      developmentGoals,
                      programType,
                      programDetails
                    });
                  }
                }}
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative w-full">
                    <p className="font-['Open_Sans',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">
                      Continue
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
