// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Employee } from '../data/mockEmployees';
import { loadEmployeeDraftEmployees } from '../data/employeeDraft';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  X,
  Clock,
  Users,
  Shield,
  FileCheck,
  GitCompare,
  Search,
  Filter,
  XCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { motion } from 'motion/react';

type DecisionStatus = 'promotion' | 'salary-review' | 'bonus' | 'layoff';
type FilterOperator = '>' | '>=' | '<' | '<=' | '=' | 'between' | null;

interface FilterCondition {
  operator: FilterOperator;
  value: number | null;
  value2?: number | null;
}

interface NumericRange {
  min: number;
  max: number;
}

interface Filters {
  department: string[];
  level: string[];
  performanceRating: FilterCondition;
  potentialRating: FilterCondition;
  readinessLevel: FilterCondition;
  timeInRole: FilterCondition;
  engagementScore: FilterCondition;
  assessmentScore: FilterCondition;
  salary?: FilterCondition;
  iqScore?: FilterCondition;
  flightRisk: string[];
  promotionReadiness: string[];
  criticalRole: boolean | null;
  successorIdentified?: boolean | null;
  personality?: string[];
  leadershipType?: string[];
  searchTerm: string;
}

interface EmployeeCardProps {
  employee: Employee;
  getFlightRiskColor: (risk: string) => string;
  getPromotionReadinessColor: (readiness: string) => string;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

function EmployeeCard({ employee, getFlightRiskColor, getPromotionReadinessColor, isSelected, onToggleSelect }: EmployeeCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={`bg-white rounded-[16px] overflow-hidden flex-shrink-0 relative ${isSelected ? 'ring-4 ring-[#016699]' : ''}`}
      style={{ width: 'calc(25% - 12px)', boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)' }}
    >
      {/* Checkbox Overlay */}
      <div className="absolute top-4 left-4 z-20">
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(employee.id);
          }}
          className="cursor-pointer"
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(employee.id)}
            className="w-5 h-5 bg-white border-2 border-white shadow-lg data-[state=checked]:bg-[#016699] data-[state=checked]:border-[#016699]"
          />
        </div>
      </div>

      {/* Profile Photo Section */}
      <div className="relative h-[320px] overflow-hidden">
        <img
          src={employee.photo}
          alt={employee.name}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        {/* Employee ID */}
        <div className="absolute bottom-[123px] left-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-xs text-white/90 font-mono font-medium">
              ID: {employee.id}
            </span>
          </div>
        </div>
        
        {/* Name and Role */}
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-2xl font-bold text-white mb-1 truncate">{employee.name}</h2>
          <p className="text-white/90 text-base truncate">{employee.role}</p>
          {employee.usia && <p className="text-white/80 text-sm mt-1">{employee.usia} Tahun</p>}
        </div>
      </div>

      {/* Metrics Section */}
      <div className="p-4 space-y-4">
        {/* Performance & Potential */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
            <div className="text-xs opacity-90 mb-1 tracking-wide">Performance</div>
            <div className="text-2xl font-bold mb-2">
              {employee.performanceRating}
              <span className="text-sm opacity-75">/5</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i < employee.performanceRating
                      ? 'fill-white text-white'
                      : 'text-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 text-white">
            <div className="text-xs opacity-90 mb-1 tracking-wide">Potential</div>
            <div className="text-2xl font-bold mb-2">
              {employee.potentialRating}
              <span className="text-sm opacity-75">/5</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 ${
                    i < employee.potentialRating
                      ? 'fill-white text-white'
                      : 'text-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Engagement & Flight Risk */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4" style={{ boxShadow: '1px 1px 6px 0 rgba(0,0,0,0.07), 1px 1px 4px -1px rgba(0,0,0,0.06)' }}>
            <div className="text-xs text-gray-500 mb-1 tracking-wide">Engagement</div>
            <div className="text-2xl font-bold mb-1 text-[#016699]">
              {employee.engagementScore}
              <span className="text-sm text-gray-500">%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full"
                style={{ width: `${employee.engagementScore}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4" style={{ boxShadow: '1px 1px 6px 0 rgba(0,0,0,0.07), 1px 1px 4px -1px rgba(0,0,0,0.06)' }}>
            <div className="text-xs text-gray-500 mb-1 tracking-wide">Flight Risk</div>
            <div className="text-2xl font-bold mb-1 text-[#016699]">
              {employee.flightRisk}
            </div>
          </div>
        </div>

        {/* Career Information */}
        <div className="bg-white rounded-xl p-4" style={{ boxShadow: '1px 1px 6px 0 rgba(0,0,0,0.07), 1px 1px 4px -1px rgba(0,0,0,0.06)' }}>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#016699]" />
            Career Information
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <div className="text-gray-500">Manager</div>
              <div className="font-bold text-[#016699]">{employee.manager}</div>
            </div>
            <div>
              <div className="text-gray-500">Tenure</div>
              <div className="font-bold text-[#016699]">
                {employee.yearsInCompany} yrs in company
              </div>
              <div className="text-gray-600">{employee.yearsInRole} yrs in role</div>
            </div>
            <div>
              <div className="text-gray-500">Salary</div>
              <div className="font-bold text-[#016699]">Rp {employee.salary.toLocaleString('id-ID')}</div>
            </div>
            <div>
              <div className="text-gray-500">Last Promotion</div>
              <div className="font-bold text-[#016699]">
                {new Date(employee.lastPromotionDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Education & Skills */}
        <div className="bg-white rounded-xl p-4" style={{ boxShadow: '1px 1px 6px 0 rgba(0,0,0,0.07), 1px 1px 4px -1px rgba(0,0,0,0.06)' }}>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#016699]" />
            Education & Skills
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <div className="text-gray-500">Education</div>
              <div className="font-bold text-[#016699]">{employee.education}</div>
            </div>
            <div>
              <div className="text-gray-500">Certifications</div>
              <div className="font-bold text-[#016699]">
                {employee.certifications.length > 0
                  ? employee.certifications.join(', ')
                  : 'None'}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">Skills</div>
              <div className="flex flex-wrap gap-1">
                {employee.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full text-xs font-medium text-[#016699]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-xl p-4" style={{ boxShadow: '1px 1px 6px 0 rgba(0,0,0,0.07), 1px 1px 4px -1px rgba(0,0,0,0.06)' }}>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#016699]" />
            Risk Assessment
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <div className="text-gray-500 mb-1">Flight Risk</div>
              <Badge className={`${getFlightRiskColor(employee.flightRisk)} text-xs`}>
                {employee.flightRisk}
              </Badge>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Promotion Readiness</div>
              <Badge className={`${getPromotionReadinessColor(employee.promotionReadiness)} text-xs`}>
                {employee.promotionReadiness}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-gray-500 mb-1">Critical Role</div>
                <div className="flex items-center gap-1">
                  <span className={`font-medium ${employee.criticalRole ? 'text-orange-600' : 'text-gray-600'}`}>
                    {employee.criticalRole ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-gray-500 mb-1">Successor</div>
                <div className="flex items-center gap-1">
                  <span className={`font-medium ${employee.successorIdentified ? 'text-green-600' : 'text-gray-600'}`}>
                    {employee.successorIdentified ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SwipeReview() {
  const allEmployees = useMemo(() => loadEmployeeDraftEmployees(), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  // Add to Decision states
  const [isAddDecisionDialogOpen, setIsAddDecisionDialogOpen] = useState(false);
  const [decisionStatus, setDecisionStatus] = useState<DecisionStatus>('promotion');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionTimeline, setDecisionTimeline] = useState('');

  // Filter states
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const defaultFilters: Filters = {
    department: [],
    level: [],
    performanceRating: { operator: null, value: null },
    potentialRating: { operator: null, value: null },
    readinessLevel: { operator: null, value: null },
    timeInRole: { operator: null, value: null },
    engagementScore: { operator: null, value: null },
    assessmentScore: { operator: null, value: null },
    salary: { operator: null, value: null },
    iqScore: { operator: null, value: null },
    flightRisk: [],
    promotionReadiness: [],
    criticalRole: null,
    successorIdentified: null,
    personality: [],
    leadershipType: [],
    searchTerm: '',
  };
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  // Extract unique values for filter options
  const departments = Array.from(new Set(allEmployees.map((e) => e.department)));
  const levels = Array.from(new Set(allEmployees.map((e) => e.level))).sort();
  const flightRisks: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
  const promotionReadinessOptions: ('Not Ready' | 'Ready in 1-2 years' | 'Ready Now')[] = [
    'Not Ready',
    'Ready in 1-2 years',
    'Ready Now',
  ];

  // Get active employees from table state
  const getActiveEmployeeIds = (): string[] | null => {
    const savedState = localStorage.getItem('currentTableState');
    if (!savedState) return null;

    try {
      const state = JSON.parse(savedState);
      return state.employeeIds || null;
    } catch {
      return null;
    }
  };

  // Apply filters to employees - sync with table view
  const filteredEmployees = useMemo(() => {
    const activeEmployeeIds = getActiveEmployeeIds();

    // Start with employees from table state if available
    let baseEmployees = allEmployees;
    if (activeEmployeeIds && activeEmployeeIds.length > 0) {
      baseEmployees = allEmployees.filter(emp => activeEmployeeIds.includes(emp.id));
    }

    return baseEmployees.filter((e) => {
      // Apply search
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchesSearch =
          e.name.toLowerCase().includes(term) ||
          e.role.toLowerCase().includes(term) ||
          e.skills.some((s) => s.toLowerCase().includes(term));
        if (!matchesSearch) return false;
      }

      // Apply category filters
      if (filters.department.length > 0 && !filters.department.includes(e.department)) return false;
      if (filters.level.length > 0 && !filters.level.includes(e.level)) return false;
      if (filters.flightRisk.length > 0 && !filters.flightRisk.includes(e.flightRisk)) return false;
      if (filters.promotionReadiness.length > 0 && !filters.promotionReadiness.includes(e.promotionReadiness)) return false;
      if (filters.criticalRole !== null && e.criticalRole !== filters.criticalRole) return false;

      // Helper function to check numeric filter condition
      const checkNumericCondition = (value: number, condition: FilterCondition | undefined): boolean => {
        if (!condition || !condition.operator || condition.value === null) return true;
        
        switch (condition.operator) {
          case '>':
            return value > condition.value;
          case '>=':
            return value >= condition.value;
          case '<':
            return value < condition.value;
          case '<=':
            return value <= condition.value;
          case '=':
            return value === condition.value;
          case 'between':
            return condition.value2 !== null && value >= condition.value && value <= condition.value2;
          default:
            return true;
        }
      };

      // Apply numeric condition filters
      if (!checkNumericCondition(e.performanceRating, filters.performanceRating)) return false;
      if (!checkNumericCondition(e.potentialRating, filters.potentialRating)) return false;
      if (!checkNumericCondition(e.readinessLevel, filters.readinessLevel)) return false;
      if (!checkNumericCondition(e.timeInRole, filters.timeInRole)) return false;
      if (!checkNumericCondition(e.engagementScore, filters.engagementScore)) return false;
      if (!checkNumericCondition(e.assessmentScore, filters.assessmentScore)) return false;
      if (!checkNumericCondition(e.salary, filters.salary)) return false;
      if (e.iqScore && !checkNumericCondition(e.iqScore, filters.iqScore)) return false;

      // Apply boolean filters
      if (filters.successorIdentified !== null && e.successorIdentified !== filters.successorIdentified) return false;

      // Apply category filters for imported columns
      if (filters.personality && filters.personality.length > 0 && (!e.personality || !filters.personality.includes(e.personality))) return false;
      if (filters.leadershipType && filters.leadershipType.length > 0 && (!e.leadershipType || !filters.leadershipType.includes(e.leadershipType))) return false;

      return true;
    });
  }, [filters, allEmployees]);

  const hasActiveFilters = 
    filters.department.length > 0 ||
    filters.level.length > 0 ||
    filters.performanceRating.operator !== null ||
    filters.potentialRating.operator !== null ||
    filters.readinessLevel.operator !== null ||
    filters.timeInRole.operator !== null ||
    filters.engagementScore.operator !== null ||
    filters.assessmentScore.operator !== null ||
    (filters.salary && filters.salary.operator !== null) ||
    (filters.iqScore && filters.iqScore.operator !== null) ||
    filters.flightRisk.length > 0 ||
    filters.promotionReadiness.length > 0 ||
    filters.criticalRole !== null ||
    (filters.successorIdentified !== null && filters.successorIdentified !== undefined) ||
    (filters.personality && filters.personality.length > 0) ||
    (filters.leadershipType && filters.leadershipType.length > 0) ||
    filters.searchTerm !== '';

  const clearFilters = () => {
    setFilters(defaultFilters);
    setCurrentIndex(0);
  };

  const employeesPerPage = 4;
  const currentEmployees = filteredEmployees.slice(currentIndex, currentIndex + employeesPerPage);

  const handleNext = () => {
    if (currentIndex + employeesPerPage < filteredEmployees.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getFlightRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPromotionReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'Ready Now':
        return 'bg-green-100 text-green-800';
      case 'Ready in 1-2 years':
        return 'bg-blue-100 text-blue-800';
      case 'Not Ready':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const onToggleSelect = (id: string) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const navigate = useNavigate();

  const handleAddToDecision = () => {
    // Save decisions to localStorage (same as screener)
    const existingDecisionsStr = localStorage.getItem('talentDecisions');
    const existingDecisions = existingDecisionsStr ? JSON.parse(existingDecisionsStr) : [];
    
    const selectedEmps = filteredEmployees.filter(emp => selectedEmployees.includes(emp.id));
    
    const newDecisions = selectedEmps.map(emp => ({
      id: Date.now().toString() + emp.id,
      employeeId: emp.id,
      employeeName: emp.name,
      employeeRole: emp.role,
      employeeDepartment: emp.department,
      status: decisionStatus,
      notes: decisionNotes,
      timeline: decisionTimeline,
      createdAt: new Date().toISOString(),
    }));
    
    localStorage.setItem('talentDecisions', JSON.stringify([...existingDecisions, ...newDecisions]));
    
    // Reset form and close dialog
    setDecisionStatus('promotion');
    setDecisionNotes('');
    setDecisionTimeline('');
    setIsAddDecisionDialogOpen(false);
    
    // Clear selection
    setSelectedEmployees([]);
    
    // Navigate to decisions page
    navigate('/decisions');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200" style={{ boxShadow: '1px 1px 10px 0 rgba(0,0,0,0.1), 1px 1px 6px -2px rgba(0,0,0,0.05)' }}>
        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between px-6 py-3 gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, position, or skills..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="pl-10 rounded-full bg-gray-50 border border-gray-200"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3">
            {/* Results Count */}
            <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full">
              <span className="text-sm font-medium text-gray-700">
                {filteredEmployees.length} of {allEmployees.length} employees
              </span>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="rounded-full"
              >
                <XCircle className="w-4 h-4 mr-2" style={{ color: '#016699' }} />
                Clear Filters
              </Button>
            )}

            {/* Filter Dialog Button */}
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={`rounded-full ${hasActiveFilters ? 'bg-[#016699] text-white hover:bg-[#014d73] hover:text-white' : ''}`}
                >
                  <Filter className="w-4 h-4 mr-2" style={{ color: hasActiveFilters ? 'white' : '#016699' }} />
                  Filters
                  {hasActiveFilters && (
                    <Badge className="ml-2 bg-white text-[#016699] rounded-full">
                      Active
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Filter Employees</DialogTitle>
                  <DialogDescription>
                    Apply filters to narrow down the employee list in Review mode
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Department Filter */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">Department</Label>
                    <div className="flex flex-wrap gap-2">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => {
                            const newDept = filters.department.includes(dept)
                              ? filters.department.filter(d => d !== dept)
                              : [...filters.department, dept];
                            setFilters({ ...filters, department: newDept });
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            filters.department.includes(dept)
                              ? 'bg-[#016699] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">Level</Label>
                    <div className="flex flex-wrap gap-2">
                      {levels.map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => {
                            const newLevel = filters.level.includes(lvl)
                              ? filters.level.filter(l => l !== lvl)
                              : [...filters.level, lvl];
                            setFilters({ ...filters, level: newLevel });
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            filters.level.includes(lvl)
                              ? 'bg-[#016699] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Performance Rating */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Performance Rating
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={filters.performanceRating.operator || ''}
                        onValueChange={(value) =>
                          setFilters({
                            ...filters,
                            performanceRating: { ...filters.performanceRating, operator: value as FilterOperator },
                          })
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=">">Lebih Dari (&gt;)</SelectItem>
                          <SelectItem value=">=">Lebih Dari Sama Dengan (≥)</SelectItem>
                          <SelectItem value="<">Kurang Dari (&lt;)</SelectItem>
                          <SelectItem value="<=">Kurang Dari Sama Dengan (≤)</SelectItem>
                          <SelectItem value="=">Sama Dengan (=)</SelectItem>
                          <SelectItem value="between">Antara</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Value"
                        value={filters.performanceRating.value ?? ''}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            performanceRating: {
                              ...filters.performanceRating,
                              value: e.target.value ? Number(e.target.value) : null,
                            },
                          })
                        }
                        className="flex-1"
                        min={1}
                        max={5}
                      />
                      {filters.performanceRating.operator === 'between' && (
                        <Input
                          type="number"
                          placeholder="Value 2"
                          value={filters.performanceRating.value2 ?? ''}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              performanceRating: {
                                ...filters.performanceRating,
                                value2: e.target.value ? Number(e.target.value) : null,
                              },
                            })
                          }
                          className="flex-1"
                          min={1}
                          max={5}
                        />
                      )}
                    </div>
                  </div>

                  {/* Potential Rating */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Potential Rating
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={filters.potentialRating.operator || ''}
                        onValueChange={(value) =>
                          setFilters({
                            ...filters,
                            potentialRating: { ...filters.potentialRating, operator: value as FilterOperator },
                          })
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=">">Lebih Dari (&gt;)</SelectItem>
                          <SelectItem value=">=">Lebih Dari Sama Dengan (≥)</SelectItem>
                          <SelectItem value="<">Kurang Dari (&lt;)</SelectItem>
                          <SelectItem value="<=">Kurang Dari Sama Dengan (≤)</SelectItem>
                          <SelectItem value="=">Sama Dengan (=)</SelectItem>
                          <SelectItem value="between">Antara</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Value"
                        value={filters.potentialRating.value ?? ''}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            potentialRating: {
                              ...filters.potentialRating,
                              value: e.target.value ? Number(e.target.value) : null,
                            },
                          })
                        }
                        className="flex-1"
                        min={1}
                        max={5}
                      />
                      {filters.potentialRating.operator === 'between' && (
                        <Input
                          type="number"
                          placeholder="Value 2"
                          value={filters.potentialRating.value2 ?? ''}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              potentialRating: {
                                ...filters.potentialRating,
                                value2: e.target.value ? Number(e.target.value) : null,
                              },
                            })
                          }
                          className="flex-1"
                          min={1}
                          max={5}
                        />
                      )}
                    </div>
                  </div>

                  {/* Readiness Level */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Readiness Level
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={filters.readinessLevel.operator || ''}
                        onValueChange={(value) =>
                          setFilters({
                            ...filters,
                            readinessLevel: { ...filters.readinessLevel, operator: value as FilterOperator },
                          })
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=">">Lebih Dari (&gt;)</SelectItem>
                          <SelectItem value=">=">Lebih Dari Sama Dengan (≥)</SelectItem>
                          <SelectItem value="<">Kurang Dari (&lt;)</SelectItem>
                          <SelectItem value="<=">Kurang Dari Sama Dengan (≤)</SelectItem>
                          <SelectItem value="=">Sama Dengan (=)</SelectItem>
                          <SelectItem value="between">Antara</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Value"
                        value={filters.readinessLevel.value ?? ''}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            readinessLevel: {
                              ...filters.readinessLevel,
                              value: e.target.value ? Number(e.target.value) : null,
                            },
                          })
                        }
                        className="flex-1"
                        min={1}
                        max={5}
                      />
                      {filters.readinessLevel.operator === 'between' && (
                        <Input
                          type="number"
                          placeholder="Value 2"
                          value={filters.readinessLevel.value2 ?? ''}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              readinessLevel: {
                                ...filters.readinessLevel,
                                value2: e.target.value ? Number(e.target.value) : null,
                              },
                            })
                          }
                          className="flex-1"
                          min={1}
                          max={5}
                        />
                      )}
                    </div>
                  </div>

                  {/* Engagement Score */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                      Engagement Score
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={filters.engagementScore.operator || ''}
                        onValueChange={(value) =>
                          setFilters({
                            ...filters,
                            engagementScore: { ...filters.engagementScore, operator: value as FilterOperator },
                          })
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=">">Lebih Dari (&gt;)</SelectItem>
                          <SelectItem value=">=">Lebih Dari Sama Dengan (≥)</SelectItem>
                          <SelectItem value="<">Kurang Dari (&lt;)</SelectItem>
                          <SelectItem value="<=">Kurang Dari Sama Dengan (≤)</SelectItem>
                          <SelectItem value="=">Sama Dengan (=)</SelectItem>
                          <SelectItem value="between">Antara</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Value"
                        value={filters.engagementScore.value ?? ''}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            engagementScore: {
                              ...filters.engagementScore,
                              value: e.target.value ? Number(e.target.value) : null,
                            },
                          })
                        }
                        className="flex-1"
                        min={0}
                        max={100}
                      />
                      {filters.engagementScore.operator === 'between' && (
                        <Input
                          type="number"
                          placeholder="Value 2"
                          value={filters.engagementScore.value2 ?? ''}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              engagementScore: {
                                ...filters.engagementScore,
                                value2: e.target.value ? Number(e.target.value) : null,
                              },
                            })
                          }
                          className="flex-1"
                          min={0}
                          max={100}
                        />
                      )}
                    </div>
                  </div>

                  {/* Flight Risk */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">Flight Risk</Label>
                    <div className="flex flex-wrap gap-2">
                      {flightRisks.map((risk) => (
                        <button
                          key={risk}
                          onClick={() => {
                            const newRisk = filters.flightRisk.includes(risk)
                              ? filters.flightRisk.filter(r => r !== risk)
                              : [...filters.flightRisk, risk];
                            setFilters({ ...filters, flightRisk: newRisk });
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            filters.flightRisk.includes(risk)
                              ? 'bg-[#016699] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {risk}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Promotion Readiness */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">Promotion Readiness</Label>
                    <div className="flex flex-wrap gap-2">
                      {promotionReadinessOptions.map((readiness) => (
                        <button
                          key={readiness}
                          onClick={() => {
                            const newReadiness = filters.promotionReadiness.includes(readiness)
                              ? filters.promotionReadiness.filter(r => r !== readiness)
                              : [...filters.promotionReadiness, readiness];
                            setFilters({ ...filters, promotionReadiness: newReadiness });
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            filters.promotionReadiness.includes(readiness)
                              ? 'bg-[#016699] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {readiness}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Critical Role */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-3 block">Critical Role</Label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilters({ ...filters, criticalRole: null })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          filters.criticalRole === null
                            ? 'bg-[#016699] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilters({ ...filters, criticalRole: true })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          filters.criticalRole === true
                            ? 'bg-[#016699] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setFilters({ ...filters, criticalRole: false })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          filters.criticalRole === false
                            ? 'bg-[#016699] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={clearFilters}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                  <Button onClick={() => setIsFilterDialogOpen(false)} className="bg-[#016699] hover:bg-[#014d73]">
                    Apply Filters
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="w-full p-8">
          {/* Empty State */}
          {filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-[16px]" style={{ boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)' }}>
              <Users className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Employees Found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters to see more results</p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  <XCircle className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* 4 Column Grid Layout */}
              <div className="flex gap-4">
                {currentEmployees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    getFlightRiskColor={getFlightRiskColor}
                    getPromotionReadinessColor={getPromotionReadinessColor}
                    isSelected={selectedEmployees.includes(employee.id)}
                    onToggleSelect={onToggleSelect}
                  />
                ))}
              </div>

              {/* Pagination Indicator */}
              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2" style={{ boxShadow: '1px 1px 10px 0 rgba(0,0,0,0.1), 1px 1px 6px -2px rgba(0,0,0,0.05)' }}>
                  <span className="text-sm text-gray-600">
                    Showing {currentIndex + 1} - {Math.min(currentIndex + employeesPerPage, filteredEmployees.length)} of {filteredEmployees.length}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Carousel Navigation Buttons */}
          {filteredEmployees.length > employeesPerPage && (
            <>
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
                style={{ boxShadow: '1px 1px 10px 0 rgba(0,0,0,0.15)' }}
              >
                <ChevronLeft className="w-6 h-6 text-[#016699]" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex + employeesPerPage >= filteredEmployees.length}
                className="fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
                style={{ boxShadow: '1px 1px 10px 0 rgba(0,0,0,0.15)' }}
              >
                <ChevronRight className="w-6 h-6 text-[#016699]" />
              </button>
            </>
          )}

          {/* Action Buttons - Only show when employees are selected */}
          {selectedEmployees.length > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3 bg-white rounded-[16px] p-4 shadow-xl" style={{ boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.15), 1px 1px 12px -4px rgba(0,0,0,0.1)' }}>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  {selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''} selected
                </span>
                <div className="w-px h-6 bg-gray-300"></div>
                <Dialog open={isAddDecisionDialogOpen} onOpenChange={setIsAddDecisionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#016699] hover:bg-[#014d73] text-white rounded-full">
                      <FileCheck className="w-4 h-4 mr-2" />
                      Add To Decision ({selectedEmployees.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add to Decision Summary</DialogTitle>
                      <DialogDescription>
                        Create decisions for {selectedEmployees.length} selected employee(s).
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {/* Decision Status */}
                      <div>
                        <Label htmlFor="decision-status" className="mb-2 block">Decision Status</Label>
                        <Select value={decisionStatus} onValueChange={(v) => setDecisionStatus(v as DecisionStatus)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="promotion">Promote Now</SelectItem>
                            <SelectItem value="salary-review">Salary Review</SelectItem>
                            <SelectItem value="bonus">Bonus</SelectItem>
                            <SelectItem value="layoff">Layoff</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Timeline */}
                      <div>
                        <Label htmlFor="decision-timeline" className="mb-2 block">Timeline</Label>
                        <Input
                          id="decision-timeline"
                          placeholder="e.g., Q2 2026, Next 6 months"
                          value={decisionTimeline}
                          onChange={(e) => setDecisionTimeline(e.target.value)}
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <Label htmlFor="decision-notes" className="mb-2 block">Decision Notes</Label>
                        <Textarea
                          id="decision-notes"
                          placeholder="Add context about this decision..."
                          value={decisionNotes}
                          onChange={(e) => setDecisionNotes(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDecisionDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddToDecision}>
                        <FileCheck className="w-4 h-4 mr-2" />
                        Add to Decision
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => {
                    const selected = filteredEmployees.filter(emp => selectedEmployees.includes(emp.id));
                    navigate('/comparison', { state: { selectedEmployees: selected } });
                  }}
                  disabled={selectedEmployees.length < 2}
                  variant="outline"
                  className="rounded-full"
                >
                  <GitCompare className="w-4 h-4 mr-2" style={{ color: '#016699' }} />
                  Compare ({selectedEmployees.length})
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
