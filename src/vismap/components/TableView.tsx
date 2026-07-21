import { useState } from "react";
import { type Employee } from "../data/orgChartData";
import { Search, Plus, Filter, MoreVertical, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, TrendingUp, ChevronsUpDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { type HeatmapConfig } from "./HeatmapSettings";
import { dataManager } from "../data/dataManager";

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Data Visibility modal column definitions
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type TVVisibilityKey =
  | 'gender' | 'city' | 'maritalStatus'
  | 'performance' | 'iq'
  | 'capability' | 'commitment' | 'contribution';

const TV_ALL_COLUMNS: { key: TVVisibilityKey; label: string; category: string }[] = [
  { key: 'gender',        label: 'Gender',            category: 'basic' },
  { key: 'city',          label: 'City',              category: 'basic' },
  { key: 'maritalStatus', label: 'Marital Status',    category: 'basic' },
  { key: 'performance',   label: 'Performance Score', category: 'performance' },
  { key: 'iq',            label: 'IQ Score',          category: 'performance' },
  { key: 'capability',    label: 'Capability',         category: 'cluster' },
  { key: 'commitment',    label: 'Commitment',         category: 'cluster' },
  { key: 'contribution',  label: 'Contribution',       category: 'cluster' },
];

const TV_CATEGORIES = [
  { id: 'basic',       label: 'BASIC INFORMATION' },
  { id: 'performance', label: 'PERFORMANCE & SCORE' },
  { id: 'cluster',     label: 'CLUSTER SCORES' },
];

interface VisibleColumns {
  gender: boolean;
  city: boolean;
  maritalStatus: boolean;
  performance: boolean;
  iq: boolean;
  capability: boolean;
  commitment: boolean;
  contribution: boolean;
}

interface TableViewProps {
  employees: Employee[];
  activeTab: string;
  onEmployeeClick: (employee: Employee) => void;
  visibleColumns: VisibleColumns;
  setVisibleColumns: React.Dispatch<React.SetStateAction<VisibleColumns>>;
  showHeatmap: boolean;
  heatmapStyle: 'gradient' | 'border' | 'glow';
  heatmapConfig: HeatmapConfig;
}

type SortField = 'name' | 'position' | 'competencyScore' | 'jobTitle' | 'readinessScore' | 'criticalPosition' | 'gender' | 'city' | 'maritalStatus' | 'performance' | 'iq' | 'capabilityScore' | 'commitmentScore' | 'contributionScore';
type SortDirection = 'asc' | 'desc';

export default function TableView({ employees, activeTab, onEmployeeClick, visibleColumns, setVisibleColumns, showHeatmap, heatmapStyle, heatmapConfig }: TableViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isVariableDialogOpen, setIsVariableDialogOpen] = useState(false);
  const [tempVisibleColumns, setTempVisibleColumns] = useState<VisibleColumns>({ ...visibleColumns });
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  const toggleColumn = (column: keyof VisibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const toggleTempColumn = (column: keyof VisibleColumns) => {
    setTempVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  const tempSelectedCount = Object.values(tempVisibleColumns).filter(Boolean).length;

  // NO FILTER - Show all employees (tabs only affect heatmap, not data filtering)
  const getFilteredEmployees = () => {
    let filtered = employees;

    // Apply search filter only
    if (searchQuery) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedEmployees = () => {
    const filtered = getFilteredEmployees();
    
    return [...filtered].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle undefined values
      if (aValue === undefined) aValue = 0;
      if (bValue === undefined) bValue = 0;

      // String comparison
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const sortedEmployees = getSortedEmployees();

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 inline ml-1 text-[#adb5bd]" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1 text-[#016699]" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1 text-[#016699]" />
    );
  };

  // Heatmap Logic - Get color for employee row based on activeTab
  const getRowHeatmapColor = (employee: Employee): string | null => {
    if (!showHeatmap) return null;
    
    // Default Tab (activeTab = 'all', heatmapMode = 'performance'):
    // Use Competency Score with needDevelop config (5-level)
    if (activeTab === 'all') {
      const score = employee.competencyScore;
      const ranges = heatmapConfig.needDevelop;
      
      for (const range of ranges) {
        if (score >= range.min && score <= range.max) {
          return range.color;
        }
      }
      return ranges[0].color; // Fallback to lowest range
    }
    
    // Need Develop Tab (heatmapMode = 'need-develop'):
    // Use Competency Score with needDevelop config (5-level)
    // Don't show for vacant positions
    else if (activeTab === 'need-develop') {
      // Skip vacant positions
      if (employee.name === '(Vacant)') {
        return null;
      }
      
      const score = employee.competencyScore;
      const ranges = heatmapConfig.needDevelop;
      
      for (const range of ranges) {
        if (score >= range.min && score <= range.max) {
          return range.color;
        }
      }
      return ranges[0].color; // Fallback to lowest range
    }
    
    // Need Successors v2 Tab (heatmapMode = 'need-successors-copy'):
    // Complex logic based on subordinates' readiness scores
    // Only applies to managers (employees with at least 1 subordinate)
    else if (activeTab === 'need-successors-copy') {
      // Check if employee has subordinates (direct reports)
      const directReports = employees.filter(e => e.managerId === employee.id);
      const hasSubordinates = directReports.length > 0;
      
      // Only show heatmap for managers
      if (!hasSubordinates) {
        return null;
      }
      
      // Get thresholds from heatmap config
      const readinessRanges = heatmapConfig.readinessScore;
      const sortedRanges = [...readinessRanges].sort((a, b) => a.min - b.min);
      const redRange = sortedRanges[0]; // Lowest range
      const greenRange = sortedRanges[sortedRanges.length - 1]; // Highest range (READY)
      
      // Calculate readiness score for each subordinate
      const subordinatesWithReadiness = directReports.map(report => {
        // Use readiness score from data if available
        if (report.readinessScore !== undefined && report.readinessScore !== null) {
          return report.readinessScore;
        }
        
        // Fallback calculation based on competency score
        const currentScore = report.competencyScore;
        if (currentScore >= 91) {
          return Math.round(currentScore * 0.92);
        } else if (currentScore >= 76) {
          return Math.round(currentScore * 0.88);
        } else if (currentScore >= 66) {
          return Math.round(currentScore * 0.80);
        } else {
          return Math.round(currentScore * 0.72);
        }
      });
      
      // Classify subordinates based on threshold
      const greenCount = subordinatesWithReadiness.filter(score => 
        score >= greenRange.min && score <= greenRange.max
      ).length;
      const redCount = subordinatesWithReadiness.filter(score => 
        score >= redRange.min && score <= redRange.max
      ).length;
      const totalCount = subordinatesWithReadiness.length;
      const greenPercentage = (greenCount / totalCount) * 100;
      
      // Logic untuk menentukan warna manager (same as OrgNode):
      // 1. Manager HIJAU jika: >= 50% bawahan READY (hijau) ATAU minimal 2 bawahan READY
      if (greenPercentage >= 50 || greenCount >= 2) {
        return '#88E113'; // Green
      }
      
      // 4. Manager MERAH jika: tidak ada bawahan READY DAN minimal ada 1 bawahan merah
      if (greenCount === 0 && redCount > 0) {
        return '#FE0D00'; // Red
      }
      
      // 3 & 5. Manager ORANGE untuk kondisi lainnya
      return '#F59E02'; // Orange
    }
    
    return null;
  };

  // Get row styles based on heatmap style
  const getRowStyles = (employee: Employee): { className: string; style: React.CSSProperties } => {
    const heatmapColor = getRowHeatmapColor(employee);
    
    if (!heatmapColor) {
      return {
        className: "cursor-pointer hover:bg-gray-50 border-t border-[#dee2e6]",
        style: {}
      };
    }
    
    // Gradient Overlay Style
    if (heatmapStyle === 'gradient') {
      return {
        className: "cursor-pointer hover:brightness-95 border-t border-[#dee2e6] transition-all",
        style: {
          background: `linear-gradient(to right, ${heatmapColor}40, ${heatmapColor}10)`,
        }
      };
    }
    
    // Discrete Border Style
    else if (heatmapStyle === 'border') {
      return {
        className: "cursor-pointer hover:bg-gray-50 border-t border-[#dee2e6] transition-all",
        style: {
          borderLeft: `4px solid ${heatmapColor}`,
        }
      };
    }
    
    // Glow Effect Style
    else if (heatmapStyle === 'glow') {
      return {
        className: "cursor-pointer hover:brightness-95 border-t border-[#dee2e6] transition-all",
        style: {
          backgroundColor: `${heatmapColor}20`,
          boxShadow: `inset 0 0 20px ${heatmapColor}30`,
        }
      };
    }
    
    return {
      className: "cursor-pointer hover:bg-gray-50 border-t border-[#dee2e6]",
      style: {}
    };
  };

  return (
    <div className="size-full flex flex-col">
      {/* Table Container with Shadow */}
      <div className="bg-white rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col flex-1">
        {/* Toolbar */}
        <div className="bg-white border-b border-[#dee2e6] px-[16px] py-[8px] flex items-center justify-between">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-[#dee2e6] rounded-[16px] px-[12px] py-[8px] pr-[36px] w-[299px] font-['Open_Sans',_sans-serif] text-[12px] text-[#adb5bd] focus:outline-none focus:border-[#016699]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#58595B]" />
          </div>

          {/* Right Actions */}
          <div className="flex gap-[8px] items-center">
            <button
              onClick={() => {
                setTempVisibleColumns({ ...visibleColumns });
                setSelectedCategory('basic');
                setModalSearchQuery('');
                setIsVariableDialogOpen(true);
              }}
              className="flex gap-[8px] items-center px-[12px] py-[8px] rounded-[28px] hover:bg-gray-50"
            >
              <Plus className="w-5 h-5 text-[#016699]" />
              <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#016699]">Variable</span>
            </button>
            <button className="flex gap-[8px] items-center px-[12px] py-[8px] rounded-[28px] hover:bg-gray-50">
              <Filter className="w-5 h-5 text-[#016699]" />
              <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#016699]">Filter</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr>
                {/* Row Number Column */}
                <th className="bg-white h-[35px] w-[54px] sticky top-0 z-10"></th>
                
                {/* Employee Name */}
                <th 
                  className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('name')}
                >
                  <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                    <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                      Employee Name <SortIcon field="name" />
                    </span>
                  </div>
                </th>

                {/* Position */}
                <th 
                  className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('position')}
                >
                  <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                    <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                      Posisi <SortIcon field="position" />
                    </span>
                  </div>
                </th>

                {/* Department */}
                <th 
                  className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('jobTitle')}
                >
                  <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                    <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                      Departmen <SortIcon field="jobTitle" />
                    </span>
                  </div>
                </th>

                {/* Competency Score */}
                <th 
                  className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('competencyScore')}
                >
                  <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                    <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                      Competency Score <SortIcon field="competencyScore" />
                    </span>
                  </div>
                </th>

                {/* Readiness Score */}
                <th 
                  className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('readinessScore')}
                >
                  <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                    <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                      Readiness Score <SortIcon field="readinessScore" />
                    </span>
                  </div>
                </th>

                {/* Critical Position */}
                <th 
                  className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('criticalPosition')}
                >
                  <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                    <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                      Critical Position <SortIcon field="criticalPosition" />
                    </span>
                  </div>
                </th>

                {/* Gender */}
                {visibleColumns.gender && (
                  <th 
                    className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('gender')}
                  >
                    <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                      <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                        Gender <SortIcon field="gender" />
                      </span>
                    </div>
                  </th>
                )}

                {/* City */}
                {visibleColumns.city && (
                  <th 
                    className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('city')}
                  >
                    <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                      <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                        City <SortIcon field="city" />
                      </span>
                    </div>
                  </th>
                )}

                {/* Marital Status */}
                {visibleColumns.maritalStatus && (
                  <th 
                    className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('maritalStatus')}
                  >
                    <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                      <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                        Marital Status <SortIcon field="maritalStatus" />
                      </span>
                    </div>
                  </th>
                )}

                {/* Performance */}
                {visibleColumns.performance && (
                  <th 
                    className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('performance')}
                  >
                    <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                      <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                        Performance <SortIcon field="performance" />
                      </span>
                    </div>
                  </th>
                )}

                {/* IQ */}
                {visibleColumns.iq && (
                  <th
                    className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('iq')}
                  >
                    <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                      <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                        IQ <SortIcon field="iq" />
                      </span>
                    </div>
                  </th>
                )}

                {/* Capability */}
                {visibleColumns.capability && (
                  <th
                    className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('capabilityScore')}
                  >
                    <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                      <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                        Capability <SortIcon field="capabilityScore" />
                      </span>
                    </div>
                  </th>
                )}

                {/* Commitment */}
                {visibleColumns.commitment && (
                  <th
                    className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('commitmentScore')}
                  >
                    <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                      <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                        Commitment <SortIcon field="commitmentScore" />
                      </span>
                    </div>
                  </th>
                )}

                {/* Contribution */}
                {visibleColumns.contribution && (
                  <th
                    className="bg-white sticky top-0 z-10 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('contributionScore')}
                  >
                    <div className="px-[12px] py-[8px] flex gap-[12px] items-center justify-start">
                      <span className="font-['Avenir',_sans-serif] font-black text-[14px] text-[#495057]">
                        Contribution <SortIcon field="contributionScore" />
                      </span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7 + Object.values(visibleColumns).filter(Boolean).length} className="text-center text-[#adb5bd] py-8">
                    <span className="font-['Open_Sans',_sans-serif] text-[12px]">No employees found</span>
                  </td>
                </tr>
              ) : (
                sortedEmployees.map((employee, index) => {
                  const rowStyles = getRowStyles(employee);
                  return (
                    <tr
                      key={employee.id}
                      className={rowStyles.className}
                      onClick={() => onEmployeeClick(employee)}
                      style={rowStyles.style}
                    >
                      {/* Row Number */}
                      <td className="h-[48px] w-[54px]">
                        <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                          <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            {index + 1}
                          </span>
                        </div>
                      </td>

                      {/* Employee Name */}
                      <td className="h-[48px] w-[220px]">
                        <div className="px-[12px] py-[8px] flex gap-[10px] items-center">
                          {/* Avatar */}
                          <div className="w-[32px] h-[32px] rounded-full overflow-hidden flex-shrink-0 bg-[#dee2e6]">
                            {employee.imageUrl ? (
                              <img
                                src={employee.imageUrl}
                                alt={employee.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#6c757d] text-[12px] font-bold">
                                {employee.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          {/* Name + Display ID */}
                          <div className="flex flex-col min-w-0">
                            <span className="font-['Avenir',_sans-serif] font-black text-[12px] text-[#016699] truncate">
                              {employee.name}
                            </span>
                            {employee.displayId && (
                              <span className="font-['Open_Sans',_sans-serif] text-[10px] text-[#adb5bd]">
                                {employee.displayId}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="h-[48px]">
                        <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                          <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            {employee.position}
                          </span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="h-[48px]">
                        <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                          <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            {employee.jobTitle}
                          </span>
                        </div>
                      </td>

                      {/* Competency Score */}
                      <td className="h-[48px]">
                        <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                          <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            {employee.competencyScore}%
                          </span>
                        </div>
                      </td>

                      {/* Readiness Score */}
                      <td className="h-[48px]">
                        <div className="px-[12px] py-[8px] flex gap-[6px] items-center">
                          <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            {employee.readinessScore !== undefined ? `${employee.readinessScore}%` : '-'}
                          </span>
                          {employee.activeIDP && employee.readinessScore !== undefined && (
                            <TrendingUp 
                              className="w-[12px] h-[12px] text-[#016699]" 
                              strokeWidth={2.5}
                            />
                          )}
                        </div>
                      </td>

                      {/* Critical Position */}
                      <td className="h-[48px]">
                        <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                          <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                            {employee.criticalPosition ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>

                      {/* Gender */}
                      {visibleColumns.gender && (
                        <td className="h-[48px]">
                          <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                            <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                              {employee.gender || '-'}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* City */}
                      {visibleColumns.city && (
                        <td className="h-[48px]">
                          <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                            <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                              {employee.city || '-'}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Marital Status */}
                      {visibleColumns.maritalStatus && (
                        <td className="h-[48px]">
                          <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                            <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                              {employee.maritalStatus || '-'}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Performance */}
                      {visibleColumns.performance && (
                        <td className="h-[48px]">
                          <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                            <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                              {employee.performance !== undefined ? `${employee.performance}%` : '-'}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* IQ */}
                      {visibleColumns.iq && (
                        <td className="h-[48px]">
                          <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                            <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                              {employee.iq || '-'}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Capability */}
                      {visibleColumns.capability && (
                        <td className="h-[48px]">
                          <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                            <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                              {employee.capabilityScore !== undefined ? `${employee.capabilityScore}` : '-'}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Commitment */}
                      {visibleColumns.commitment && (
                        <td className="h-[48px]">
                          <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                            <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                              {employee.commitmentScore !== undefined ? `${employee.commitmentScore}` : '-'}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Contribution */}
                      {visibleColumns.contribution && (
                        <td className="h-[48px]">
                          <div className="px-[12px] py-[8px] flex gap-[12px] items-center">
                            <span className="font-['Open_Sans',_sans-serif] text-[12px] text-[#495057]" style={{ fontVariationSettings: "'wdth' 100" }}>
                              {employee.contributionScore !== undefined ? `${employee.contributionScore}` : '-'}
                            </span>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Visibility Dialog */}
      <Dialog open={isVariableDialogOpen} onOpenChange={setIsVariableDialogOpen}>
        <DialogContent className="max-w-[640px] font-['Open_Sans',_sans-serif] p-0 overflow-hidden rounded-[12px]">

          {/* Header */}
          <div className="px-6 pt-5 pb-4">
            <DialogTitle className="font-['Avenir',_sans-serif] font-bold text-[#212529] text-[18px]">
              Data Visibility
            </DialogTitle>
            <DialogDescription className="sr-only">
              Pilih variabel yang ditampilkan pada tabel
            </DialogDescription>
          </div>

          {/* Body â€” two panels */}
          <div className="flex border-t border-b border-[#DEE2E6] h-[420px]">

            {/* â”€â”€ Left: search + accordion â”€â”€ */}
            <div className="w-[220px] border-r border-[#DEE2E6] flex flex-col shrink-0 bg-[#FAFAFA]">
              <div className="px-3 py-3 border-b border-[#DEE2E6]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#ADB5BD] pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={modalSearchQuery}
                    onChange={e => setModalSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-[7px] text-[12px] font-['Open_Sans',_sans-serif] bg-white rounded-full border border-[#DEE2E6] outline-none focus:border-[#016699] transition-colors placeholder:text-[#ADB5BD]"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {TV_CATEGORIES.map(cat => {
                  const isActive = !modalSearchQuery && selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setModalSearchQuery(''); }}
                      className={`w-full flex items-center justify-between px-4 py-4 text-[11px] font-bold tracking-[0.07em] border-b border-[#F0F0F0] transition-colors ${
                        isActive ? 'bg-[#EDF6FB] text-[#212529]' : 'text-[#6C757D] hover:bg-[#F0F2F4]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {isActive
                        ? <ChevronLeft className="w-[14px] h-[14px] text-[#016699] shrink-0" />
                        : <ChevronRight className="w-[14px] h-[14px] text-[#ADB5BD] shrink-0" />
                      }
                    </button>
                  );
                })}
              </div>
            </div>

            {/* â”€â”€ Right: variables â”€â”€ */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              <div className="flex justify-end px-5 py-2.5 border-b border-[#DEE2E6]">
                <button
                  onClick={() => {
                    const cols = modalSearchQuery
                      ? TV_ALL_COLUMNS.filter(c => c.label.toLowerCase().includes(modalSearchQuery.toLowerCase()))
                      : TV_ALL_COLUMNS.filter(c => c.category === selectedCategory);
                    const next = { ...tempVisibleColumns };
                    let cnt = Object.values(next).filter(Boolean).length;
                    for (const col of cols) {
                      if (!next[col.key] && cnt < 5) { next[col.key] = true; cnt++; }
                    }
                    setTempVisibleColumns(next);
                  }}
                  className="text-[12px] font-semibold text-[#016699] hover:underline font-['Open_Sans',_sans-serif]"
                >
                  Select All
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Required row */}
                <div className="flex items-center gap-3 px-5 py-[11px] border-b border-[#F0F0F0]">
                  <Checkbox id="tv-req-emp" checked disabled className="pointer-events-none opacity-50" />
                  <Label htmlFor="tv-req-emp" className="text-[13px] text-[#016699] font-['Open_Sans',_sans-serif] opacity-50 cursor-not-allowed select-none">
                    Employee (Required)
                  </Label>
                </div>

                {/* Optional columns */}
                {(() => {
                  const cols = modalSearchQuery
                    ? TV_ALL_COLUMNS.filter(c => c.label.toLowerCase().includes(modalSearchQuery.toLowerCase()))
                    : TV_ALL_COLUMNS.filter(c => c.category === selectedCategory);

                  if (cols.length === 0) {
                    return (
                      <div className="py-12 text-center">
                        <p className="text-[12px] text-[#ADB5BD] font-['Open_Sans',_sans-serif]">
                          {modalSearchQuery ? `No results for "${modalSearchQuery}"` : 'No variables in this category'}
                        </p>
                      </div>
                    );
                  }

                  return cols.map(col => {
                    const isChecked = tempVisibleColumns[col.key];
                    const isDisabled = !isChecked && tempSelectedCount >= 5;
                    return (
                      <div key={col.key} className={`flex items-center gap-3 px-5 py-[11px] border-b border-[#F0F0F0] last:border-0 transition-opacity ${isDisabled ? 'opacity-35' : ''}`}>
                        <Checkbox
                          id={`tv-${col.key}`}
                          checked={isChecked}
                          disabled={isDisabled}
                          onCheckedChange={() => toggleTempColumn(col.key)}
                        />
                        <Label
                          htmlFor={`tv-${col.key}`}
                          className={`text-[13px] font-['Open_Sans',_sans-serif] select-none transition-colors ${
                            isChecked ? 'text-[#016699] font-semibold' : 'text-[#495057]'
                          } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {col.label}
                        </Label>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4">
            <span className={`text-[12px] font-['Open_Sans',_sans-serif] ${tempSelectedCount >= 5 ? 'text-[#FD9F28] font-semibold' : 'text-[#ADB5BD]'}`}>
              {tempSelectedCount}/5 variabel dipilih
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setIsVariableDialogOpen(false)}
                className="px-5 py-2 text-[13px] font-semibold font-['Open_Sans',_sans-serif] text-[#016699] border-2 border-[#016699] rounded-full hover:bg-[#E7F5FF] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setVisibleColumns(tempVisibleColumns);
                  setIsVariableDialogOpen(false);
                }}
                className="px-5 py-2 text-[13px] font-semibold font-['Open_Sans',_sans-serif] text-white bg-[#016699] rounded-full hover:bg-[#005079] transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  );
}
