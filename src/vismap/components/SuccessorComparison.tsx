import { useState, useEffect } from "react";
import { X, Plus, Search, TrendingUp } from "lucide-react";
import { Employee } from "../data/orgChartData";
import svgPaths from "../imports/svg-y8exswobkd";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { generateDevelopmentData } from "../data/developmentData";
import svgPathsInfo from "../imports/svg-5ngobpa356";

interface SuccessorComparisonProps {
  manager: Employee;
  successors: Employee[];
  employees: Employee[];
  onClose: () => void;
  onIDPDialogChange?: (isOpen: boolean) => void;
  onEmployeeClick?: (employeeId: string) => void;
  onAddToSuccessors?: (managerId: string, successorId: string) => void;
  heatmapConfig?: any;
}

// Competency aspects for comparison (13 standard aspects)
const competencyAspects = [
  "Orientasi Hasil",
  "Kerjasama",
  "Komunikasi",
  "Daya Analisis",
  "Adaptabilitas",
  "Inisiatif",
  "Pelayanan Pelanggan",
  "Integritas",
  "Pengembangan Diri",
  "Pengambilan Keputusan",
  "Manajemen Waktu",
  "Disiplin",
  "Keterampilan Interpersonal"
];

// Available variables that can be added
const availableVariableOptions = [
  { id: 'tenure', name: 'Tenure', type: 'number' as const },
  { id: 'gender', name: 'Gender', type: 'category' as const },
  { id: 'city', name: 'City', type: 'category' as const },
  { id: 'maritalStatus', name: 'Marital Status', type: 'category' as const },
  { id: 'performance', name: 'Performance', type: 'number' as const },
  { id: 'iq', name: 'IQ', type: 'number' as const },
  { id: 'criticalPosition', name: 'Critical Position', type: 'category' as const },
];

// Helper components for IDP Recommendation
function InfoCircle() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="info-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_4_1475)" id="info-circle">
          <path d={svgPathsInfo.p18fd5980} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
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

export default function SuccessorComparison({ manager, successors: allSuccessors, employees: allEmployees, onClose, onIDPDialogChange, onEmployeeClick, onAddToSuccessors, heatmapConfig }: SuccessorComparisonProps) {
  const [selectedSuccessors, setSelectedSuccessors] = useState<Employee[]>(allSuccessors);
  const [variables, setVariables] = useState<string[]>(competencyAspects);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddVariableOpen, setIsAddVariableOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVariableQuery, setSearchVariableQuery] = useState("");
  const [idpEmployee, setIdpEmployee] = useState<Employee | null>(null);
  const [newlyAddedIds, setNewlyAddedIds] = useState<Set<string>>(new Set());

  // Helper function to determine job level from position
  const getJobLevel = (position: string): number => {
    const lowerPosition = position.toLowerCase();
    
    // Level 1: CEO
    if (lowerPosition.includes('ceo')) return 1;
    
    // Level 2: C-Suite (Chief Officers)
    if (lowerPosition.includes('chief')) return 2;
    
    // Level 3: Leads/Directors
    if (lowerPosition.includes('lead') || lowerPosition.includes('director')) return 3;
    
    // Level 4: Managers/Seniors
    if (lowerPosition.includes('manager') || lowerPosition.includes('senior')) return 4;
    
    // Level 5: Individual Contributors (Staff, Specialists, etc)
    return 5;
  };

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("SuccessorComparison mounted");
    console.log("Total employees:", allEmployees.length);
    console.log("Manager:", manager.name);
    console.log("Manager Level:", getJobLevel(manager.position));
    console.log("Selected successors:", selectedSuccessors.length);
  }, []);
  
  // Notify parent when IDP dialog opens/closes
  useEffect(() => {
    onIDPDialogChange?.(!!idpEmployee);
  }, [idpEmployee, onIDPDialogChange]);
  
  // Get employee score for competency aspect from actual competencyDetails
  const getEmployeeScore = (employee: Employee, aspect: string, isIncumbant: boolean): number => {
    // Get or generate competencyDetails
    const { competencyDetails } = employee.competencyDetails && employee.competencyDetails.length > 0
      ? { competencyDetails: employee.competencyDetails }
      : generateDevelopmentData(employee.id, employee.readinessScore || employee.competencyScore);
    
    // Find the specific aspect score
    const competency = competencyDetails.find(c => c.name === aspect);
    
    if (competency) {
      return competency.score;
    }
    
    // Fallback if aspect not found (shouldn't happen with 13 standard aspects)
    return 3;
  };

  // Get readiness percentage
  const getReadinessPercentage = (employee: Employee): number => {
    if (employee.readinessScore !== undefined && employee.readinessScore !== null) {
      return employee.readinessScore;
    }
    
    const currentScore = employee.competencyScore;
    if (currentScore >= 91) return Math.round(currentScore * 0.92);
    else if (currentScore >= 76) return Math.round(currentScore * 0.88);
    else if (currentScore >= 66) return Math.round(currentScore * 0.80);
    else return Math.round(currentScore * 0.72);
  };

  // Get readiness badge - uses heatmap config to determine threshold
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

  // Remove successor from comparison
  const removeSuccessor = (index: number) => {
    setSelectedSuccessors(prev => prev.filter((_, i) => i !== index));
  };

  // Add employee to comparison
  const addEmployee = (employee: Employee) => {
    if (!selectedSuccessors.find(s => s.id === employee.id) && employee.id !== manager.id) {
      setSelectedSuccessors(prev => [...prev, employee]);
      // Mark this employee as newly added
      setNewlyAddedIds(prev => new Set(prev).add(employee.id));
      setIsAddEmployeeOpen(false);
      setSearchQuery("");
    }
  };

  // Add employee to manager's successors list permanently
  const handleAddToSuccessors = (successorId: string) => {
    if (onAddToSuccessors) {
      onAddToSuccessors(manager.id, successorId);
      // Remove from newly added list since it's now a permanent successor
      setNewlyAddedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(successorId);
        return newSet;
      });
    }
  };

  // Filter employees for search
  const filteredEmployees = allEmployees.filter(emp => {
    // Exclude manager and already selected successors
    if (emp.id === manager.id) return false;
    if (selectedSuccessors.find(s => s.id === emp.id)) return false;
    
    // Filter by job level - only show employees at same level or below
    const managerLevel = getJobLevel(manager.position);
    const employeeLevel = getJobLevel(emp.position);
    if (employeeLevel < managerLevel) return false; // Higher level (smaller number) = excluded
    
    // Filter by search query
    if (searchQuery.trim() === "") return true;
    
    const query = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(query) ||
      emp.position.toLowerCase().includes(query) ||
      emp.jobTitle.toLowerCase().includes(query)
    );
  });

  // Debug: Log filtered employees when popover opens
  useEffect(() => {
    if (isAddEmployeeOpen) {
      const managerLevel = getJobLevel(manager.position);
      console.log("Popover opened. Manager level:", managerLevel);
      console.log("Filtered employees:", filteredEmployees.length);
      console.log("Search query:", searchQuery);
      
      // Log sample of filtered employees with their levels
      filteredEmployees.slice(0, 5).forEach(emp => {
        console.log(`- ${emp.name} (${emp.position}) - Level ${getJobLevel(emp.position)}`);
      });
    }
  }, [isAddEmployeeOpen, searchQuery]);

  // Add variable to comparison
  const addVariable = (variableName: string) => {
    if (!variables.includes(variableName)) {
      setVariables(prev => [...prev, variableName]);
      setIsAddVariableOpen(false);
      setSearchVariableQuery("");
    }
  };

  // Remove variable from comparison
  const removeVariable = (variableName: string) => {
    setVariables(prev => prev.filter(v => v !== variableName));
  };

  // Filter variables for search
  const filteredVariables = availableVariableOptions.filter(variable => {
    // Exclude already added variables
    if (variables.includes(variable.name)) return false;
    
    // Filter by search query
    if (searchVariableQuery.trim() === "") return true;
    
    const query = searchVariableQuery.toLowerCase();
    return variable.name.toLowerCase().includes(query);
  });

  // Get variable value from employee data or generate dummy data for new variable types
  const getVariableValue = (employee: Employee, variableName: string): string => {
    const variable = availableVariableOptions.find(v => v.name === variableName);
    if (!variable) return "N/A";
    
    switch (variable.id) {
      case 'tenure':
        // Use employee ID to generate consistent random values for tenure (not in data yet)
        const seed = employee.id.charCodeAt(0) + employee.id.charCodeAt(employee.id.length - 1);
        const months = (seed % 55) + 6;
        return `${months} months`;
      
      case 'gender':
        // Use actual gender from employee data
        return employee.gender || 'N/A';
      
      case 'city':
        // Use actual city from employee data
        return employee.city || 'N/A';
      
      case 'maritalStatus':
        // Use actual marital status from employee data
        return employee.maritalStatus || 'N/A';
      
      case 'performance':
        // Use actual performance from employee data
        return employee.performance !== undefined ? `${employee.performance}%` : 'N/A';
      
      case 'iq':
        // Use actual IQ from employee data
        return employee.iq !== undefined ? `${employee.iq}` : 'N/A';
      
      case 'criticalPosition':
        // Use actual critical position from employee data
        return employee.criticalPosition ? 'Yes' : 'No';
      
      default:
        return 'N/A';
    }
  };

  // Plus Icon Component
  function PlusIcon() {
    return (
      <div className="relative shrink-0 size-[20px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <g>
            <path d={svgPaths.p17eb400} stroke="#016699" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    );
  }

  // X Icon Component
  function XIcon() {
    return (
      <div className="relative shrink-0 size-[16px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <g>
            <path d="M12 4L4 12M4 4L12 12" stroke="#ADB5BD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    );
  }

  // Employee Column Component
  function EmployeeColumn({ 
    employee, 
    isIncumbant = false, 
    successorNumber, 
    onRemove,
    onShowIDP,
    isNewlyAdded = false,
    onAddToSuccessors
  }: { 
    employee: Employee; 
    isIncumbant?: boolean; 
    successorNumber?: number;
    onShowIDP?: () => void; 
    onRemove?: () => void;
    isNewlyAdded?: boolean;
    onAddToSuccessors?: () => void;
  }) {
    const readinessPercentage = getReadinessPercentage(employee);
    const badge = getReadinessBadge(readinessPercentage);

    return (
      <div className={`${isIncumbant ? 'bg-[#F4FAFF]' : 'bg-[#f8f9fa]'} box-border content-stretch flex flex-col gap-[16px] items-start p-[8px] relative rounded-[8px] shrink-0 w-[184px]`}>
        <div className={`absolute border ${isIncumbant ? 'border-[#016699]' : 'border-[#dee2e6]'} border-solid inset-0 pointer-events-none rounded-[8px]`} />
        
        {/* Header */}
        {isIncumbant ? (
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <p className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#58595b] text-[10px] text-center uppercase w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
              Incumbant
            </p>
            
            {/* Employee Card */}
            <div className="bg-white relative rounded-[8px] shrink-0 w-full">
              <div className="flex flex-col items-center size-full">
                <div className="box-border content-stretch flex flex-col gap-[4px] items-center px-[16px] py-[8px] relative w-full">
                  {/* Photo */}
                  <div className="relative shrink-0 size-[46px] rounded-full overflow-hidden bg-white">
                    {employee.imageUrl && (
                      <img alt={employee.name} className="block max-w-none size-full object-cover" src={employee.imageUrl} />
                    )}
                  </div>
                  
                  {/* Name */}
                  <p 
                    onClick={() => onEmployeeClick?.(employee.id)}
                    className="font-['Avenir',_sans-serif] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#495057] text-[12px] text-center w-[min-content] cursor-pointer hover:text-[#016699] transition-colors"
                  >
                    {employee.name}
                  </p>
                  
                  {/* Position */}
                  <p className="font-['Open_Sans',_sans-serif] font-normal leading-[normal] min-w-full relative shrink-0 text-[#58595b] text-[10px] text-center w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {employee.position}
                  </p>
                  
                  {/* Badge & Percentage */}
                  <div className="content-stretch flex gap-[7px] items-center justify-center relative shrink-0 w-full">
                    <div className="box-border content-stretch flex gap-[1.688px] h-[13.39px] items-center justify-center px-[6.008px] py-[1.502px] relative rounded-[600.76px] shrink-0" style={{ backgroundColor: badge.bg }}>
                      <div className="absolute border-solid inset-0 pointer-events-none rounded-[600.76px]" style={{ borderColor: badge.border, borderWidth: '0.751px' }} />
                      <p className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[7.509px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100", color: badge.text }}>
                        {badge.label}
                      </p>
                    </div>
                    <div className="flex items-center gap-[3px]">
                      <p className="font-['Open_Sans',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#495057] text-[10px] text-center text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {readinessPercentage}%
                      </p>
                      {employee.activeIDP && (
                        <TrendingUp 
                          className="w-[10px] h-[10px] text-[#016699]" 
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            {/* Header with X */}
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
              <p className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#58595b] text-[10px] text-center text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                Successors {successorNumber}
              </p>
              <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
                <XIcon />
              </button>
            </div>
            
            {/* Employee Card */}
            <div className="bg-white relative rounded-[8px] shrink-0 w-full">
              <div className="flex flex-col items-center size-full">
                <div className="box-border content-stretch flex flex-col gap-[4px] items-center px-[16px] py-[8px] relative w-full">
                  {/* Photo */}
                  <div className="relative shrink-0 size-[46px] rounded-full overflow-hidden bg-white">
                    {employee.imageUrl && (
                      <img alt={employee.name} className="block max-w-none size-full object-cover" src={employee.imageUrl} />
                    )}
                  </div>
                  
                  {/* Name */}
                  <p 
                    onClick={() => onEmployeeClick?.(employee.id)}
                    className="font-['Avenir',_sans-serif] font-bold leading-[normal] min-w-full not-italic relative shrink-0 text-[#495057] text-[12px] text-center w-[min-content] cursor-pointer hover:text-[#016699] transition-colors"
                  >
                    {employee.name}
                  </p>
                  
                  {/* Position */}
                  <p className="font-['Open_Sans',_sans-serif] font-normal leading-[normal] min-w-full relative shrink-0 text-[#58595b] text-[10px] text-center w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {employee.position}
                  </p>
                  
                  {/* Badge & Percentage */}
                  <div className="content-stretch flex gap-[7px] items-center justify-center relative shrink-0 w-full">
                    <div className="box-border content-stretch flex gap-[1.688px] h-[13.39px] items-center justify-center px-[6.008px] py-[1.502px] relative rounded-[600.76px] shrink-0" style={{ backgroundColor: badge.bg }}>
                      <div className="absolute border-solid inset-0 pointer-events-none rounded-[600.76px]" style={{ borderColor: badge.border, borderWidth: '0.751px' }} />
                      <p className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[7.509px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100", color: badge.text }}>
                        {badge.label}
                      </p>
                    </div>
                    <div className="flex items-center gap-[3px]">
                      <p className="font-['Open_Sans',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#495057] text-[10px] text-center text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {readinessPercentage}%
                      </p>
                      {employee.activeIDP && (
                        <TrendingUp 
                          className="w-[10px] h-[10px] text-[#016699]" 
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Competency Rows */}
        {variables.map((aspect, index) => {
          // Check if this is a custom variable or competency aspect
          const isCustomVariable = availableVariableOptions.some(v => v.name === aspect);
          const value = isCustomVariable ? getVariableValue(employee, aspect) : getEmployeeScore(employee, aspect, isIncumbant);
          
          return (
            <div key={index} className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="flex items-center justify-between font-['Open_Sans',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[normal]">{aspect}</p>
                {/* Only show remove button for custom variables and only in first column (incumbant) */}
                {isCustomVariable && isIncumbant && (
                  <button 
                    onClick={() => removeVariable(aspect)}
                    className="hover:opacity-70 transition-opacity -mr-1"
                    title="Remove variable"
                  >
                    <XIcon />
                  </button>
                )}
              </div>
              <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full">
                <div className="flex flex-row items-center size-full">
                  <div className="box-border content-stretch flex gap-[16px] h-[32px] items-center p-[8px] relative w-full">
                    <div className="basis-0 flex flex-col font-['Open_Sans',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      <p className="leading-[normal]">{value}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* IDP Recommendation Button - Only for successors */}
        {!isIncumbant && onShowIDP && (
          <button 
            onClick={onShowIDP}
            className="w-full bg-[#016699] hover:bg-[#015580] transition-colors rounded-[8px] px-[8px] py-[6px] mt-[4px]"
          >
            <p className="font-['Open_Sans',_sans-serif] text-white text-[10px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
              IDP Recommendation
            </p>
          </button>
        )}

        {/* Add to Successors Button - Only for newly added employees */}
        {!isIncumbant && isNewlyAdded && onAddToSuccessors && (
          <button 
            onClick={onAddToSuccessors}
            className="w-full bg-white hover:bg-gray-50 border border-[#016699] transition-colors rounded-[8px] px-[8px] py-[6px] mt-[4px]"
          >
            <p className="font-['Open_Sans',_sans-serif] text-[#016699] text-[10px] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
              Add to Successors
            </p>
          </button>
        )}
      </div>
    );
  }

  // Get development data for IDP modal
  const getEmployeeIDPData = (employee: Employee) => {
    const { competencyDetails, idpRecommendations } = employee.competencyDetails && employee.idpRecommendations
      ? { competencyDetails: employee.competencyDetails, idpRecommendations: employee.idpRecommendations }
      : generateDevelopmentData(employee.id, employee.readinessScore || employee.competencyScore);
    
    // Filter aspects that need development (score < 3)
    const aspectsNeedDevelop = competencyDetails.filter(comp => comp.score < 3);
    
    return { aspectsNeedDevelop, idpRecommendations };
  };

  return (
    <>
      {/* IDP Recommendation Dialog */}
      {idpEmployee && (() => {
        const { aspectsNeedDevelop, idpRecommendations } = getEmployeeIDPData(idpEmployee);
        
        return (
          <Dialog open={!!idpEmployee} onOpenChange={(open) => {
            if (!open) setIdpEmployee(null);
            onIDPDialogChange?.(open);
          }}>
            <DialogContent className="max-w-[500px] max-h-[80vh] overflow-y-auto font-['Open_Sans',_sans-serif]">
              <DialogHeader>
                <DialogTitle className="font-['Open_Sans',_sans-serif] font-bold text-[#495057]">
                  IDP Recommendation - {idpEmployee.name}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Individual Development Plan recommendations for {idpEmployee.name}
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
              
              {/* Footer with Continue button */}
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setIdpEmployee(null)}
                  className="bg-[#016699] hover:bg-[#015580] text-white px-6 py-2 rounded-[28px] transition-colors font-['Open_Sans',_sans-serif] text-[14px] font-normal"
                >
                  Continue
                </button>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}

      <div className="fixed inset-0 bg-gray-100 z-[150] overflow-auto font-['Open_Sans',_sans-serif] p-8">
        <div className="max-w-full mx-auto flex flex-col gap-6">
          {/* Title with Back Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-md"
            >
              <svg className="w-5 h-5 text-[#495057]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-['Avenir',_sans-serif] font-bold text-[24px] text-[#495057]">
              Profile Comparison
            </h1>
          </div>

          {/* Main Container - with max-width and horizontal scroll */}
          <div className="bg-white relative rounded-[8px] w-full">
        <div className="size-full">
          <div className="box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative size-full">
            
            {/* Columns Container - with horizontal scroll */}
            <div className="w-full overflow-x-auto">
              <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
                {/* Incumbant Column */}
                <EmployeeColumn employee={manager} isIncumbant={true} />

                {/* Successor Columns */}
                {selectedSuccessors.map((successor, index) => (
                  <EmployeeColumn
                    key={successor.id}
                    employee={successor}
                    successorNumber={index + 1}
                    onRemove={() => removeSuccessor(index)}
                    onShowIDP={() => setIdpEmployee(successor)}
                    isNewlyAdded={newlyAddedIds.has(successor.id)}
                    onAddToSuccessors={() => handleAddToSuccessors(successor.id)}
                  />
                ))}

                {/* Add Successor Button - Always visible */}
                <div className="relative">
                  <Popover open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
                    <PopoverTrigger asChild>
                      <button 
                        type="button"
                        className="box-border content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[28px] shrink-0 hover:bg-gray-100 transition-colors"
                      >
                        <div className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
                        <PlusIcon />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-[320px] p-0 font-['Open_Sans',_sans-serif] z-[200]" 
                      align="start"
                      side="bottom"
                      sideOffset={8}
                    >
                      <div className="flex flex-col">
                        {/* Search Header */}
                        <div className="p-3 border-b border-gray-200">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder="Search employees..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-9 font-['Open_Sans',_sans-serif] text-[12px]"
                              autoFocus
                            />
                          </div>
                        </div>
                        
                        {/* Employee List */}
                        <div className="max-h-[300px] overflow-y-auto">
                          {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((employee) => (
                              <button
                                type="button"
                                key={employee.id}
                                onClick={() => addEmployee(employee)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
                              >
                                {/* Photo */}
                                <div className="relative shrink-0 size-[40px] rounded-full overflow-hidden bg-gray-200">
                                  {employee.imageUrl && (
                                    <img 
                                      alt={employee.name} 
                                      className="block size-full object-cover" 
                                      src={employee.imageUrl} 
                                    />
                                  )}
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="font-['Avenir',_sans-serif] font-bold text-[12px] text-[#495057] truncate">
                                    {employee.name}
                                  </p>
                                  <p className="font-['Open_Sans',_sans-serif] text-[10px] text-[#58595b] truncate" style={{ fontVariationSettings: "'wdth' 100" }}>
                                    {employee.position}
                                  </p>
                                  <p className="font-['Open_Sans',_sans-serif] text-[9px] text-[#adb5bd] truncate" style={{ fontVariationSettings: "'wdth' 100" }}>
                                    Score: {employee.competencyScore}
                                  </p>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="p-8 text-center">
                              <p className="text-[12px] text-[#adb5bd] font-['Open_Sans',_sans-serif]">
                                No employees found
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Add Variable Button */}
            <div className="relative">
              <Popover open={isAddVariableOpen} onOpenChange={setIsAddVariableOpen}>
                <PopoverTrigger asChild>
                  <button 
                    type="button"
                    className="box-border content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[28px] shrink-0 hover:bg-gray-100 transition-colors"
                  >
                    <PlusIcon />
                    <p className="font-['Avenir',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-nowrap whitespace-pre font-bold">
                      Variable
                    </p>
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-[280px] p-0 font-['Open_Sans',_sans-serif] z-[200]" 
                  align="start"
                  side="bottom"
                  sideOffset={8}
                >
                  <div className="flex flex-col">
                    {/* Search Header */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search variables..."
                          value={searchVariableQuery}
                          onChange={(e) => setSearchVariableQuery(e.target.value)}
                          className="pl-9 font-['Open_Sans',_sans-serif] text-[12px]"
                          autoFocus
                        />
                      </div>
                    </div>
                    
                    {/* Variable List */}
                    <div className="max-h-[300px] overflow-y-auto">
                      {filteredVariables.length > 0 ? (
                        filteredVariables.map((variable) => (
                          <button
                            type="button"
                            key={variable.id}
                            onClick={() => addVariable(variable.name)}
                            className="w-full px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
                          >
                            <p className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]">
                              {variable.name}
                            </p>
                          </button>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-[12px] text-[#adb5bd] font-['Open_Sans',_sans-serif]">
                            No variables available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
    </>
  );
}

