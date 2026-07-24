// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { ArrowLeft, Search, Filter, FileCheck, AlertTriangle, CheckCircle2, X, Users, ArrowUpDown, ArrowUp, ArrowDown, ArrowLeftRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { useNavigate, useLocation } from 'react-router';
import { useState } from 'react';

interface ImportedEmployee {
  id: string;
  masterEmployee: string; // Name from table screener
  extractedName: string; // Name from AI extraction
  iqScore: number;
  personality: string; // DISC
  leadershipType: string;
  matchStatus: 'perfect' | 'partial' | 'no-match';
  matchConfidence: number; // 0-100
  originalStatus?: 'partial'; // Track if converted from partial to perfect
  originalName?: string; // Track original extracted name for undo
}

// Dummy data with master employees from screener
const importedEmployees: ImportedEmployee[] = [
  {
    id: '1',
    masterEmployee: 'Sarah Chen',
    extractedName: 'Sarah Chen',
    iqScore: 132,
    personality: 'D',
    leadershipType: 'Visionary',
    matchStatus: 'perfect',
    matchConfidence: 100
  },
  {
    id: '2',
    masterEmployee: 'Marcus Johnson',
    extractedName: 'Marcus Johnson',
    iqScore: 128,
    personality: 'I',
    leadershipType: 'Coach',
    matchStatus: 'perfect',
    matchConfidence: 100
  },
  {
    id: '3',
    masterEmployee: 'Emily Rodriguez',
    extractedName: 'Emily Rodriguez',
    iqScore: 135,
    personality: 'S',
    leadershipType: 'Servant',
    matchStatus: 'perfect',
    matchConfidence: 100
  },
  {
    id: '4',
    masterEmployee: 'James Anderson',
    extractedName: 'James Anderson',
    iqScore: 118,
    personality: 'C',
    leadershipType: 'Strategic',
    matchStatus: 'perfect',
    matchConfidence: 100
  },
  {
    id: '5',
    masterEmployee: 'Priya Patel',
    extractedName: 'Priya Patel',
    iqScore: 142,
    personality: 'DI',
    leadershipType: 'Transformational',
    matchStatus: 'perfect',
    matchConfidence: 100
  },
  {
    id: '6',
    masterEmployee: 'Alex Thompson',
    extractedName: 'Alexander Thompson',
    iqScore: 125,
    personality: 'IS',
    leadershipType: 'Collaborative',
    matchStatus: 'partial',
    matchConfidence: 92
  },
  {
    id: '7',
    masterEmployee: 'Lisa Martinez',
    extractedName: 'Lisa M. Martinez',
    iqScore: 121,
    personality: 'SI',
    leadershipType: 'Democratic',
    matchStatus: 'partial',
    matchConfidence: 95
  },
  {
    id: '8',
    masterEmployee: 'David Wong',
    extractedName: 'David Wong',
    iqScore: 130,
    personality: 'D',
    leadershipType: 'Autocratic',
    matchStatus: 'perfect',
    matchConfidence: 100
  },
  {
    id: '9',
    masterEmployee: 'Rachel Green',
    extractedName: 'Rachel L. Green',
    iqScore: 127,
    personality: 'I',
    leadershipType: 'Affiliative',
    matchStatus: 'partial',
    matchConfidence: 93
  },
  {
    id: '10',
    masterEmployee: 'Michael Lee',
    extractedName: 'Mike Lee',
    iqScore: 122,
    personality: 'SC',
    leadershipType: 'Pacesetting',
    matchStatus: 'partial',
    matchConfidence: 88
  },
  {
    id: '11',
    masterEmployee: 'Jennifer Taylor',
    extractedName: 'Jennifer Taylor',
    iqScore: 138,
    personality: 'DC',
    leadershipType: 'Directive',
    matchStatus: 'perfect',
    matchConfidence: 100
  },
  {
    id: '12',
    masterEmployee: 'Robert Brown',
    extractedName: 'Rob Brown',
    iqScore: 115,
    personality: 'C',
    leadershipType: 'Bureaucratic',
    matchStatus: 'partial',
    matchConfidence: 85
  },
  {
    id: '13',
    masterEmployee: 'Sarah Chen',
    extractedName: 'Sara Chen',
    iqScore: 131,
    personality: 'D',
    leadershipType: 'Visionary',
    matchStatus: 'partial',
    matchConfidence: 90
  },
  {
    id: '14',
    masterEmployee: 'Amanda White',
    extractedName: 'Amanda J. White',
    iqScore: 124,
    personality: 'IS',
    leadershipType: 'Coaching',
    matchStatus: 'partial',
    matchConfidence: 91
  },
  {
    id: '15',
    masterEmployee: 'Christopher Davis',
    extractedName: 'Christopher Davis',
    iqScore: 129,
    personality: 'DI',
    leadershipType: 'Charismatic',
    matchStatus: 'perfect',
    matchConfidence: 100
  },
  {
    id: '16',
    masterEmployee: 'Unknown',
    extractedName: 'John Smith',
    iqScore: 119,
    personality: 'S',
    leadershipType: 'Servant',
    matchStatus: 'no-match',
    matchConfidence: 0
  },
  {
    id: '17',
    masterEmployee: 'Unknown',
    extractedName: 'Maria Garcia',
    iqScore: 133,
    personality: 'I',
    leadershipType: 'Democratic',
    matchStatus: 'no-match',
    matchConfidence: 0
  },
  {
    id: '18',
    masterEmployee: 'Kevin Nguyen',
    extractedName: 'Kevin H. Nguyen',
    iqScore: 126,
    personality: 'C',
    leadershipType: 'Analytical',
    matchStatus: 'partial',
    matchConfidence: 94
  },
];

export default function ImportReviewTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | 'perfect' | 'partial' | 'no-match'>('all');
  const [employees, setEmployees] = useState<ImportedEmployee[]>(importedEmployees);
  const [sortColumn, setSortColumn] = useState<'masterEmployee' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const rowsPerPage = 10;
  const [selectedForSwitch, setSelectedForSwitch] = useState<string | null>(null);
  const [showSwitchConfirmation, setShowSwitchConfirmation] = useState(false);
  const [targetEmployeeId, setTargetEmployeeId] = useState<string | null>(null);

  // Import Modal States
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState({
    iqScore: true,
    personality: true,
    leadershipType: true
  });

  // Calculate metrics
  const totalRows = employees.length;
  const perfectMatchCount = employees.filter(e => e.matchStatus === 'perfect').length;
  const partialMatchCount = employees.filter(e => e.matchStatus === 'partial').length;
  const noMatchCount = employees.filter(e => e.matchStatus === 'no-match').length;
  const avgConfidence = Math.round(
    employees.reduce((sum, e) => sum + e.matchConfidence, 0) / employees.length
  );

  // Filter and search
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.masterEmployee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.extractedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.personality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.leadershipType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || emp.matchStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Sort - create a new sorted array
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!sortColumn) return 0;
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + rowsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedEmployees.map((e) => e.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      // In switch mode, limit to 2 selections
      if (selectedRows.length >= 2) {
        return; // Don't allow more than 2 selections
      }
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'perfect':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle2 className="w-3 h-3" />
            Matching
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <FileCheck className="w-3 h-3" />
            Partial Match
          </span>
        );
      case 'no-match':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3" />
            No Match
          </span>
        );
      default:
        return null;
    }
  };

  const getConfidenceColor = (matchStatus: string, confidence: number) => {
    if (confidence === 0) return 'text-yellow-600';
    if (matchStatus === 'perfect') return 'text-blue-600';
    if (matchStatus === 'partial') return 'text-orange-600';
    return 'text-yellow-600';
  };

  const getIQScoreColor = (iqScore: number) => {
    return 'text-gray-900';
  };

  const handleImport = () => {
    // Get the columns that are selected
    const importedColumns: string[] = [];
    if (selectedColumns.iqScore) importedColumns.push('iqScore');
    if (selectedColumns.personality) importedColumns.push('personality');
    if (selectedColumns.leadershipType) importedColumns.push('leadershipType');

    // Navigate to Table Screener with imported columns info
    console.log('Importing columns:', importedColumns);
    navigate('/', { 
      state: { 
        importedColumns,
        message: `Successfully imported ${importedColumns.length} column(s)`
      } 
    });
  };

  const handleUnmatch = (employeeId: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? { ...emp, matchStatus: 'partial' as const, matchConfidence: 85 }
          : emp
      )
    );
  };

  const handleMakeMatch = (employeeId: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId
          ? { 
              ...emp, 
              matchStatus: 'perfect' as const, 
              matchConfidence: 100,
              extractedName: emp.masterEmployee, // Update employee name to match master
              originalStatus: emp.matchStatus === 'partial' ? 'partial' : undefined,
              originalName: emp.matchStatus === 'partial' ? emp.extractedName : undefined
            }
          : emp
      )
    );
  };

  const handleUndo = (employeeId: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId && emp.originalStatus && emp.originalName
          ? { 
              ...emp, 
              matchStatus: emp.originalStatus,
              matchConfidence: 85,
              extractedName: emp.originalName,
              originalStatus: undefined,
              originalName: undefined
            }
          : emp
      )
    );
  };

  const handleSort = (column: 'masterEmployee') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSwitchClick = (employeeId: string) => {
    if (!selectedForSwitch) {
      // First selection
      setSelectedForSwitch(employeeId);
    } else if (selectedForSwitch === employeeId) {
      // Cancel selection
      setSelectedForSwitch(null);
    } else {
      // Second selection - show confirmation
      setTargetEmployeeId(employeeId);
      setShowSwitchConfirmation(true);
    }
  };

  const confirmSwitch = () => {
    if (!selectedForSwitch || !targetEmployeeId) return;

    setEmployees((prev) => {
      const emp1 = prev.find((e) => e.id === selectedForSwitch);
      const emp2 = prev.find((e) => e.id === targetEmployeeId);
      
      if (!emp1 || !emp2) return prev;

      return prev.map((emp) => {
        if (emp.id === selectedForSwitch) {
          return {
            ...emp,
            extractedName: emp2.extractedName,
            iqScore: emp2.iqScore,
            personality: emp2.personality,
            leadershipType: emp2.leadershipType,
            matchStatus: emp2.matchStatus,
            matchConfidence: emp2.matchConfidence,
            originalStatus: emp2.originalStatus,
            originalName: emp2.originalName,
          };
        }
        if (emp.id === targetEmployeeId) {
          return {
            ...emp,
            extractedName: emp1.extractedName,
            iqScore: emp1.iqScore,
            personality: emp1.personality,
            leadershipType: emp1.leadershipType,
            matchStatus: emp1.matchStatus,
            matchConfidence: emp1.matchConfidence,
            originalStatus: emp1.originalStatus,
            originalName: emp1.originalName,
          };
        }
        return emp;
      });
    });

    // Clear selection after switch
    setSelectedForSwitch(null);
    setTargetEmployeeId(null);
    setShowSwitchConfirmation(false);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F9FA' }}>
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200" style={{ boxShadow: '1px 1px 10px 0 rgba(0,0,0,0.1), 1px 1px 6px -2px rgba(0,0,0,0.05)' }}>
          <div className="px-6 py-4 flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/import')}
              className="rounded-full flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" style={{ color: '#016699' }} />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Review Import Data - Step 2</h1>
              <p className="text-sm text-gray-600">Review and verify the extracted data before importing</p>
            </div>
            <Button
              onClick={() => setShowImportModal(true)}
              className="rounded-full bg-[#016699] hover:bg-[#014d73] text-white"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Metrics Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-[16px] p-6" style={{ boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Rows</p>
                    <p className="text-3xl font-bold text-gray-900">{totalRows}</p>
                  </div>
                  <FileCheck className="w-8 h-8" style={{ color: '#016699' }} />
                </div>
              </div>

              <div className="bg-white rounded-[16px] p-6" style={{ boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Perfect Match</p>
                    <p className="text-3xl font-bold text-gray-900">{perfectMatchCount}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-[16px] p-6" style={{ boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Partial Match</p>
                    <p className="text-3xl font-bold text-gray-900">{partialMatchCount}</p>
                  </div>
                  <FileCheck className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-[16px] p-6" style={{ boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">No Match</p>
                    <p className="text-3xl font-bold text-gray-900">{noMatchCount}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-[16px] p-4" style={{ boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, personality, or leadership type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-full"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                    className="rounded-full"
                    style={filterStatus === 'all' ? { backgroundColor: '#016699' } : {}}
                  >
                    All ({totalRows})
                  </Button>
                  <Button
                    variant={filterStatus === 'perfect' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('perfect')}
                    className="rounded-full"
                    style={filterStatus === 'perfect' ? { backgroundColor: '#016699' } : {}}
                  >
                    Perfect ({perfectMatchCount})
                  </Button>
                  <Button
                    variant={filterStatus === 'partial' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('partial')}
                    className="rounded-full"
                    style={filterStatus === 'partial' ? { backgroundColor: '#016699' } : {}}
                  >
                    Partial ({partialMatchCount})
                  </Button>
                  <Button
                    variant={filterStatus === 'no-match' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('no-match')}
                    className="rounded-full"
                    style={filterStatus === 'no-match' ? { backgroundColor: '#016699' } : {}}
                  >
                    No Match ({noMatchCount})
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)' }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                        <div className="flex items-center cursor-pointer" onClick={() => handleSort('masterEmployee')}>
                          Master Employee
                          {sortColumn === 'masterEmployee' && (
                            <ArrowUpDown className="w-4 h-4 ml-2" style={{ color: sortDirection === 'asc' ? '#016699' : '#016699' }} />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Employee Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">IQ Score</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Personality (DISC)</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Leadership Type</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Match Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Confidence</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedEmployees.map((employee) => (
                      <tr
                        key={employee.id}
                        className={`hover:bg-gray-50 transition-all ${
                          employee.matchStatus === 'no-match' ? 'bg-yellow-50' : ''
                        } ${
                          selectedForSwitch === employee.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {employee.masterEmployee}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm ${employee.matchStatus === 'perfect' ? 'text-gray-700' : 'text-red-600 font-medium'}`}>{employee.extractedName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm font-medium ${getIQScoreColor(employee.iqScore)}`}>
                            {employee.iqScore}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                            {employee.personality}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{employee.leadershipType}</div>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(employee.matchStatus)}</td>
                        <td className="px-6 py-4">
                          <div className={`text-sm font-medium ${getConfidenceColor(employee.matchStatus, employee.matchConfidence)}`}>
                            {employee.matchConfidence > 0 ? `${employee.matchConfidence}%` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {employee.matchStatus === 'perfect' && employee.originalStatus ? (
                            <Button
                              variant="outline"
                              onClick={() => handleUndo(employee.id)}
                              className="rounded-full text-xs px-3 py-1 h-auto border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400"
                            >
                              Undo
                            </Button>
                          ) : employee.matchStatus === 'partial' ? (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => handleSwitchClick(employee.id)}
                                title="Switch Data"
                                className={`rounded-full p-2 h-auto ${
                                  selectedForSwitch === employee.id
                                    ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                                    : 'border-gray-300 text-gray-400 hover:bg-gray-50 hover:border-gray-400'
                                }`}
                              >
                                <ArrowLeftRight className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleMakeMatch(employee.id)}
                                className="rounded-full text-xs px-3 py-1 h-auto"
                                style={{ borderColor: '#016699', color: '#016699' }}
                              >
                                Make It Match
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => handleSwitchClick(employee.id)}
                              title="Switch Data"
                              className={`rounded-full p-2 h-auto ${
                                selectedForSwitch === employee.id
                                  ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                                  : 'border-gray-300 text-gray-400 hover:bg-gray-50 hover:border-gray-400'
                              }`}
                            >
                              <ArrowLeftRight className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredEmployees.length)} of{' '}
                  {filteredEmployees.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="rounded-full"
                  >
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(page)}
                        className="rounded-full w-10 h-10 p-0"
                        style={currentPage === page ? { backgroundColor: '#016699' } : {}}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-full"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Import Modal - Clean and Modern Design */}
        {showImportModal && (
          <div 
            className="fixed inset-0 flex items-center justify-center" 
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.2)', 
              zIndex: 9999 
            }}
            onClick={() => setShowImportModal(false)}
          >
            <div 
              className="bg-white p-8" 
              style={{ 
                borderRadius: '16px',
                boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)',
                maxWidth: '500px',
                width: '90%'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Columns To Import</h2>
                <p className="text-sm text-gray-600">Choose which data columns you want to import to the system</p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 mb-8">
                {/* IQ Score */}
                <div 
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedColumns({ ...selectedColumns, iqScore: !selectedColumns.iqScore })}
                >
                  <Checkbox
                    id="iqScore"
                    checked={selectedColumns.iqScore}
                    onCheckedChange={(checked) =>
                      setSelectedColumns({ ...selectedColumns, iqScore: checked as boolean })
                    }
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">IQ Score</div>
                    <div className="text-xs text-gray-500">Import employee intelligence quotient scores</div>
                  </div>
                </div>

                {/* Personality */}
                <div 
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedColumns({ ...selectedColumns, personality: !selectedColumns.personality })}
                >
                  <Checkbox
                    id="personality"
                    checked={selectedColumns.personality}
                    onCheckedChange={(checked) =>
                      setSelectedColumns({ ...selectedColumns, personality: checked as boolean })
                    }
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Personality (DISC)</div>
                    <div className="text-xs text-gray-500">Import DISC personality assessment results</div>
                  </div>
                </div>

                {/* Leadership Type */}
                <div 
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedColumns({ ...selectedColumns, leadershipType: !selectedColumns.leadershipType })}
                >
                  <Checkbox
                    id="leadershipType"
                    checked={selectedColumns.leadershipType}
                    onCheckedChange={(checked) =>
                      setSelectedColumns({ ...selectedColumns, leadershipType: checked as boolean })
                    }
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">Leadership Type</div>
                    <div className="text-xs text-gray-500">Import leadership style classifications</div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowImportModal(false)}
                  className="rounded-full px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  className="rounded-full px-6 bg-[#016699] hover:bg-[#014d73] text-white"
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Switch Confirmation Modal */}
        {showSwitchConfirmation && selectedForSwitch && targetEmployeeId && (() => {
          const emp1 = employees.find(e => e.id === selectedForSwitch);
          const emp2 = employees.find(e => e.id === targetEmployeeId);
          
          return (
            <div 
              className="fixed inset-0 flex items-center justify-center" 
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.2)', 
                zIndex: 9999 
              }}
              onClick={() => {
                setShowSwitchConfirmation(false);
                setTargetEmployeeId(null);
              }}
            >
              <div 
                className="bg-white p-8" 
                style={{ 
                  borderRadius: '16px',
                  boxShadow: '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)',
                  maxWidth: '600px',
                  width: '90%'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <ArrowLeftRight className="w-6 h-6 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Confirm Switch Data</h2>
                  </div>
                  <p className="text-sm text-gray-600">Are you sure you want to switch the data between these two employees?</p>
                </div>

                {/* Employee Comparison */}
                <div className="mb-8">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Employee 1 */}
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs font-semibold text-orange-600 mb-2">EMPLOYEE 1</p>
                      <p className="font-bold text-gray-900 mb-3">{emp1?.masterEmployee}</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span> <span className="font-medium text-gray-900">{emp1?.extractedName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">IQ Score:</span> <span className="font-medium text-gray-900">{emp1?.iqScore}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Personality:</span> <span className="font-medium text-gray-900">{emp1?.personality}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Leadership:</span> <span className="font-medium text-gray-900">{emp1?.leadershipType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Employee 2 */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-semibold text-blue-600 mb-2">EMPLOYEE 2</p>
                      <p className="font-bold text-gray-900 mb-3">{emp2?.masterEmployee}</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span> <span className="font-medium text-gray-900">{emp2?.extractedName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">IQ Score:</span> <span className="font-medium text-gray-900">{emp2?.iqScore}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Personality:</span> <span className="font-medium text-gray-900">{emp2?.personality}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Leadership:</span> <span className="font-medium text-gray-900">{emp2?.leadershipType}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="flex items-center justify-center -my-3 relative z-10">
                    <div className="bg-white p-2 rounded-full border-2 border-gray-300">
                      <ArrowLeftRight className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This action will swap all data fields (Name, IQ Score, Personality, Leadership Type) between the two employees.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSwitchConfirmation(false);
                      setTargetEmployeeId(null);
                    }}
                    className="rounded-full px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmSwitch}
                    className="rounded-full px-6 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    Confirm Switch
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </>
  );
}