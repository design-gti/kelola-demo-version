import { X, TrendingUp } from "lucide-react";
import { useState } from "react";
import svgPaths from "../imports/svg-5ngobpa356";
import { Employee } from "../data/orgChartData";
import { generateDevelopmentData } from "../data/developmentData";
import AspectDevelopmentPanel, { IDPFormData } from "./AspectDevelopmentPanel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { generateAIRecommendation, AIGeneratedRecommendation } from "../utils/aiIDPGenerator";

interface EmployeeDetailPanelProps {
  employee: Employee | null;
  onClose: () => void;
  onNavigateToDetail?: (employeeId: string) => void;
  onNavigateToIDP?: (employeeId: string) => void;
  onShowIDPProgress?: (employeeId: string) => void;
}

function InfoCircle() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="info-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_4_1475)" id="info-circle">
          <path d={svgPaths.p18fd5980} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_4_1475">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
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

function CompetencyScore({ name, score }: { name: string; score: number }) {
  return (
    <div className="bg-white h-[58px] relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col h-[58px] items-start justify-center p-[8px] relative w-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            {/* Label */}
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex items-center relative shrink-0">
                <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <p className="leading-[normal] whitespace-pre text-[12px]">{name}</p>
                </div>
              </div>
              <InfoCircle />
            </div>
            
            {/* Score boxes */}
            <div className="box-border content-stretch flex items-start pl-0 pr-px py-0 relative shrink-0 w-full" data-name="Score">
              {[1, 2, 3, 4, 5].map((box, idx) => {
                const isChecked = box === score;
                const isHighlighted = box === 3;
                const isFirst = idx === 0;
                const isLast = idx === 4;
                
                return (
                  <div
                    key={box}
                    className={`basis-0 grow h-[24px] min-h-px min-w-px mr-[-1px] relative shrink-0 ${
                      isHighlighted ? 'bg-[#d6e6ff]' : 'bg-white'
                    } ${isFirst ? 'rounded-bl-[4px] rounded-tl-[4px]' : ''} ${
                      isLast ? 'rounded-br-[4px] rounded-tr-[4px]' : ''
                    } ${isChecked ? 'box-border content-stretch flex items-center justify-center' : ''}`}
                    data-name="Box"
                  >
                    <div aria-hidden="true" className={`absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none ${
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

export default function EmployeeDetailPanel({ employee, onClose, onNavigateToDetail, onNavigateToIDP, onShowIDPProgress }: EmployeeDetailPanelProps) {
  const [isIDPDialogOpen, setIsIDPDialogOpen] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIGeneratedRecommendation[]>([]);
  const [showAIDialog, setShowAIDialog] = useState(false);
  
  if (!employee) return null;

  // Get or generate development data
  const { competencyDetails, idpRecommendations } = employee.competencyDetails && employee.idpRecommendations
    ? { competencyDetails: employee.competencyDetails, idpRecommendations: employee.idpRecommendations }
    : generateDevelopmentData(employee.id, employee.readinessScore || employee.competencyScore);

  // Filter aspects that need development (score < 3, which is the standard)
  const aspectsNeedDevelop = competencyDetails.filter(comp => comp.score < 3);
  
  // Check if employee has active IDP
  const hasActiveIDP = employee.activeIDP && employee.activeIDP.programs.length > 0;

  return (
    <div 
      className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-[-4px_0px_30px_0px_rgba(0,0,0,0.1)] z-[100] animate-in slide-in-from-right duration-300"
      data-name="Insight"
    >
      {/* Header */}
      <div className="absolute content-stretch flex items-center justify-between left-[17px] top-[20px] w-[385px]">
        <div 
          className={`flex flex-col font-['Open_Sans',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap text-right ${onNavigateToDetail ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''}`}
          onClick={() => onNavigateToDetail?.(employee.id)}
        >
          <p className="leading-[normal] whitespace-pre font-bold">{employee.name}</p>
          <p className="leading-[normal] whitespace-pre text-[10px] text-[#adb5bd] mt-1">{employee.position}</p>
        </div>
        <button 
          onClick={onClose}
          className="block cursor-pointer relative shrink-0 size-[20px] hover:opacity-70 transition-opacity"
          data-name="chevrons-right"
        >
          <X className="size-5 text-[#016699]" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[calc(50%+0.5px)] overflow-x-clip overflow-y-auto top-[65px] translate-x-[-50%] w-[387px] pb-[120px] bottom-[80px]">
        {/* Employee Stats */}
        <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
          <div className="bg-white h-[58px] relative rounded-[8px] shrink-0 flex-1 border border-[#dee2e6]">
            <div className="flex flex-col justify-center items-center size-full p-[8px]">
              <div className="font-['Open_Sans',_sans-serif] text-[10px] text-[#495057] mb-1" style={{ fontVariationSettings: "'wdth' 100" }}>
                Competency Score
              </div>
              <div className="font-['Open_Sans',_sans-serif] font-bold text-[18px] text-[#016699]">
                {employee.competencyScore}%
              </div>
            </div>
          </div>
          {employee.readinessScore !== undefined && (
            <div className="bg-white h-[58px] relative rounded-[8px] shrink-0 flex-1 border border-[#dee2e6]">
              <div className="flex flex-col justify-center items-center size-full p-[8px]">
                <div className="font-['Open_Sans',_sans-serif] text-[10px] text-[#495057] mb-1" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Readiness Score
                </div>
                <div className="flex items-center gap-[4px]">
                  <div className="font-['Open_Sans',_sans-serif] font-bold text-[18px] text-[#016699]">
                    {employee.readinessScore}%
                  </div>
                  {employee.activeIDP && (
                    <TrendingUp 
                      className="w-[14px] h-[14px] text-[#016699]" 
                      strokeWidth={2.5}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Aspect Need Develop - Only show if there are aspects with GAP < 0 */}
        {aspectsNeedDevelop.length > 0 && (
          <AspectDevelopmentPanel
            aspects={aspectsNeedDevelop.map(comp => ({
              name: comp.name,
              score: comp.score,
              standard: 3
            }))}
            onGenerateIDP={(formData) => {
              // Generate AI recommendation based on form data
              const recommendations = generateAIRecommendation(formData);
              setAiRecommendations(recommendations);
              setShowAIDialog(true);
            }}
            onQuickIDP={() => onNavigateToIDP?.(employee.id)}
          />
        )}

        {/* Message when no aspects need development */}
        {aspectsNeedDevelop.length === 0 && (
          <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
            <div className="size-full">
              <div className="box-border content-stretch flex flex-col gap-[12px] items-center justify-center p-[24px] relative w-full">
                <div className="flex flex-col font-['Open_Sans',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#adb5bd] text-[14px] text-center w-full">
                  <p className="leading-[normal] w-full">No aspects need development</p>
                  <p className="leading-[normal] w-full text-[12px] mt-2">All competency scores meet or exceed the standard</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="absolute content-stretch flex gap-[8px] items-center justify-center left-[calc(50%-0.5px)] bottom-[20px] translate-x-[-50%] w-[291px]">
        {hasActiveIDP ? (
          <button 
            className="bg-[#016699] relative rounded-[28px] w-full hover:bg-[#015580] transition-colors" 
            data-name="button"
            onClick={() => onShowIDPProgress?.(employee.id)}
          >
            <div className="flex flex-row items-center justify-center size-full">
              <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative">
                <p className="font-['Open_Sans',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">See IDP Progress</p>
              </div>
            </div>
          </button>
        ) : (
          <button
            className="relative rounded-[28px] w-full hover:bg-gray-50 transition-colors"
            data-name="button"
            onClick={() => {
              // Open the demo's Create IDP page with this person pre-filled as participant.
              const url = `/idp?page=create-idp-admin.html&participants=${encodeURIComponent(employee.name)}`;
              try {
                (window.top ?? window).location.href = url;
              } catch {
                window.location.href = url;
              }
            }}
          >
            <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
            <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative">
              <p className="font-['Avenir',_sans-serif] font-black leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-nowrap whitespace-pre">Create IDP</p>
            </div>
          </button>
        )}
      </div>

      {/* IDP Recommendation Dialog */}
      <Dialog open={isIDPDialogOpen} onOpenChange={setIsIDPDialogOpen}>
        <DialogContent className="max-w-[500px] max-h-[80vh] overflow-y-auto font-['Open_Sans',_sans-serif]">
          <DialogHeader>
            <DialogTitle className="font-['Open_Sans',_sans-serif] font-bold text-[#495057]">
              IDP Recommendation - {employee.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Individual Development Plan recommendations for {employee.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-[16px] mt-4">
            {aspectsNeedDevelop.length > 0 ? (
              aspectsNeedDevelop.map((comp, idx) => {
                // Find matching recommendation by name
                let matchingRec = idpRecommendations.find(rec => 
                  rec.competency.toLowerCase() === comp.name.toLowerCase()
                );
                
                // If no match found, create a default recommendation with the EXACT aspect name
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
                  // Even if found, ensure the competency name matches exactly
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
                  onShowIDPProgress?.(employee.id);
                }}
                className="bg-[#016699] hover:bg-[#015580] text-white px-6 py-2 rounded-[28px] transition-colors font-['Open_Sans',_sans-serif] text-[14px] font-normal"
              >
                See IDP Progress
              </button>
            ) : (
              <button 
                onClick={() => {
                  setIsIDPDialogOpen(false);
                  onNavigateToIDP?.(employee.id);
                }}
                className="bg-[#016699] hover:bg-[#015580] text-white px-6 py-2 rounded-[28px] transition-colors font-['Open_Sans',_sans-serif] text-[14px] font-normal"
              >
                Continue
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* AI-Generated IDP Recommendation Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="max-w-[550px] max-h-[80vh] overflow-y-auto font-['Open_Sans',_sans-serif]">
          <DialogHeader>
            <DialogTitle className="font-['Avenir',_sans-serif] font-black text-[#58595b] text-[16px] not-italic">
              AI-Generated IDP Recommendation - {employee.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              AI-generated Individual Development Plan recommendation with tasks and success measures for {employee.name}
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
                onNavigateToIDP?.(employee.id);
              }}
              className="bg-[#016699] px-[12px] py-[8px] rounded-[28px] cursor-pointer hover:bg-[#015580] transition-colors"
            >
              <p className="font-['Avenir',_sans-serif] font-black text-white text-[14px] not-italic leading-[normal]">Continue</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
