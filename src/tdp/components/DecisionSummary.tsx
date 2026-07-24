// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { useState, useEffect, useMemo } from 'react';
import { Employee } from '../data/mockEmployees';
import { loadEmployeeDraftEmployees } from '../data/employeeDraft';
import {
  Star,
  TrendingUp,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  Printer,
  Edit3,
  Trash2,
  Plus,
  Calendar,
  Users,
  Target,
  AlertCircle,
  ArrowUpCircle,
  BookOpen,
  PlayCircle,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export type DecisionStatus = 'promotion' | 'salary-review' | 'bonus' | 'layoff';

export interface EmployeeDecision {
  id: string;
  employeeId: string;
  employee: Employee;
  status: DecisionStatus;
  notes: string;
  followUpActions: string[];
  timeline?: string;
  developmentAreas?: string[];
  decidedBy: string;
  decidedDate: string;
}

export default function DecisionSummary() {
  const allEmployees = useMemo(() => loadEmployeeDraftEmployees(), []);
  const [decisions, setDecisions] = useState<EmployeeDecision[]>([]);
  const [editingDecision, setEditingDecision] = useState<EmployeeDecision | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTableState, setCurrentTableState] = useState<any>(null);

  // Form state for editing
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [status, setStatus] = useState<DecisionStatus>('promotion');
  const [notes, setNotes] = useState('');
  const [timeline, setTimeline] = useState('');
  const [followUpAction, setFollowUpAction] = useState('');
  const [followUpActions, setFollowUpActions] = useState<string[]>([]);

  // Load decisions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('talentDecisions');
    if (saved) {
      const parsedDecisions = JSON.parse(saved);
      // Rehydrate with full employee data
      const hydratedDecisions = parsedDecisions.map((d: any) => ({
        ...d,
        id: d.id || Math.random().toString(36).substr(2, 9), // Generate ID if missing
        employee: allEmployees.find((e) => e.id === d.employeeId),
      }));
      setDecisions(hydratedDecisions);
    }
  }, [allEmployees]);

  // Load currentTableState from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('currentTableState');
    if (savedState) {
      setCurrentTableState(JSON.parse(savedState));
    }
  }, []);

  // Helper functions for statistics
  const getActiveFiltersCount = () => {
    // Count from new filter system (activeFilterConditions)
    if (currentTableState?.activeFilterConditions && currentTableState.activeFilterConditions.length > 0) {
      // Only count valid conditions (field is not null)
      return currentTableState.activeFilterConditions.filter((c: any) => c.field !== null).length;
    }
    
    // Fallback to old filter system if activeFilterConditions not available
    if (!currentTableState?.filters) return 0;
    const filters = currentTableState.filters;
    let count = 0;
    
    // Category filters
    if (filters.department?.length > 0) count++;
    if (filters.level?.length > 0) count++;
    if (filters.searchTerm) count++;
    if (filters.flightRisk?.length > 0) count++;
    if (filters.promotionReadiness?.length > 0) count++;
    if (filters.criticalRole !== null && filters.criticalRole !== undefined) count++;
    
    // Numeric condition filters
    if (filters.performanceRating?.operator) count++;
    if (filters.potentialRating?.operator) count++;
    if (filters.readinessLevel?.operator) count++;
    if (filters.timeInRole?.operator) count++;
    if (filters.engagementScore?.operator) count++;
    if (filters.assessmentScore?.operator) count++;
    if (filters.salary?.operator) count++;
    if (filters.iqScore?.operator) count++;
    
    // Boolean filters
    if (filters.successorIdentified !== null && filters.successorIdentified !== undefined) count++;
    
    // Category filters for imported columns
    if (filters.personality?.length > 0) count++;
    if (filters.leadershipType?.length > 0) count++;
    
    return count;
  };

  const getActiveVariablesCount = () => {
    if (!currentTableState?.visibleColumns) return 0;
    
    // If visibleColumns is an array (new format), count array length
    if (Array.isArray(currentTableState.visibleColumns)) {
      return currentTableState.visibleColumns.length;
    }
    
    // Fallback to old format (object with boolean values)
    const visible = currentTableState.visibleColumns;
    let count = 0;
    
    if (visible.performanceRating) count++;
    if (visible.potentialRating) count++;
    if (visible.readinessLevel) count++;
    if (visible.timeInRole) count++;
    if (visible.engagementScore) count++;
    if (visible.assessmentScore) count++;
    if (visible.salary) count++;
    if (visible.iqScore) count++;
    if (visible.flightRisk) count++;
    if (visible.promotionReadiness) count++;
    if (visible.criticalRole) count++;
    if (visible.successorIdentified) count++;
    if (visible.personality) count++;
    if (visible.leadershipType) count++;
    
    return count;
  };

  // Save decisions to localStorage
  const saveDecisions = (newDecisions: EmployeeDecision[]) => {
    setDecisions(newDecisions);
    // Save without the full employee object to avoid duplication
    const toSave = newDecisions.map((d) => ({
      ...d,
      employee: undefined,
    }));
    localStorage.setItem('talentDecisions', JSON.stringify(toSave));
  };

  const handleAddDecision = () => {
    if (!selectedEmployeeId) return;

    const employee = allEmployees.find((e) => e.id === selectedEmployeeId);
    if (!employee) return;

    const newDecision: EmployeeDecision = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: selectedEmployeeId,
      employee,
      status,
      notes,
      followUpActions,
      timeline,
      decidedBy: 'Talent Committee',
      decidedDate: new Date().toISOString(),
    };

    saveDecisions([...decisions, newDecision]);
    resetForm();
    setShowAddDialog(false);
  };

  const handleUpdateDecision = () => {
    if (!editingDecision) return;

    const updatedDecisions = decisions.map((d) =>
      d.employeeId === editingDecision.employeeId
        ? {
            ...d,
            status,
            notes,
            followUpActions,
            timeline,
          }
        : d
    );

    saveDecisions(updatedDecisions);
    resetForm();
    setShowEditDialog(false);
    setEditingDecision(null);
  };

  const handleDeleteDecision = (employeeId: string) => {
    const updatedDecisions = decisions.filter((d) => d.employeeId !== employeeId);
    saveDecisions(updatedDecisions);
  };

  const startEdit = (decision: EmployeeDecision) => {
    setEditingDecision(decision);
    setStatus(decision.status);
    setNotes(decision.notes);
    setFollowUpActions(decision.followUpActions || []);
    setTimeline(decision.timeline || '');
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setSelectedEmployeeId('');
    setStatus('promotion');
    setNotes('');
    setFollowUpActions([]);
    setTimeline('');
    setFollowUpAction('');
  };

  const addFollowUpAction = () => {
    if (followUpAction.trim()) {
      setFollowUpActions([...followUpActions, followUpAction.trim()]);
      setFollowUpAction('');
    }
  };

  const removeFollowUpAction = (index: number) => {
    setFollowUpActions(followUpActions.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: DecisionStatus) => {
    switch (status) {
      case 'promotion':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'salary-review':
        return 'bg-[#016699] bg-opacity-10 text-[#016699] border-[#016699] border-opacity-30';
      case 'bonus':
        return 'bg-[#FD9F28] bg-opacity-10 text-[#FD9F28] border-[#FD9F28] border-opacity-30';
      case 'layoff':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: DecisionStatus) => {
    switch (status) {
      case 'promotion':
        return <ArrowUpCircle className="w-4 h-4" />;
      case 'salary-review':
        return <BookOpen className="w-4 h-4" />;
      case 'bonus':
        return <Clock className="w-4 h-4" />;
      case 'layoff':
        return <Target className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: DecisionStatus) => {
    switch (status) {
      case 'promotion':
        return 'Promotion';
      case 'salary-review':
        return 'Salary Review';
      case 'bonus':
        return 'Bonus/Insentif';
      case 'layoff':
        return 'Layoff';
      default:
        return status;
    }
  };

  // Statistics
  const stats = {
    total: decisions.length,
    promotion: decisions.filter((d) => d.status === 'promotion').length,
    salaryReview: decisions.filter((d) => d.status === 'salary-review').length,
    bonus: decisions.filter((d) => d.status === 'bonus').length,
    layoff: decisions.filter((d) => d.status === 'layoff').length,
  };

  const availableEmployees = allEmployees.filter(
    (e) =>
      !decisions.find((d) => d.employeeId === e.id) &&
      (e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExport = () => {
    const exportData = decisions.map((d) => ({
      Name: d.employee.name,
      Role: d.employee.role,
      Department: d.employee.department,
      Decision: getStatusLabel(d.status),
      Notes: d.notes,
      Timeline: d.timeline || 'N/A',
      'Follow-up Actions': d.followUpActions.join('; '),
      'Decided By': d.decidedBy,
      'Decision Date': new Date(d.decidedDate).toLocaleDateString(),
    }));

    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talent-committee-decisions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Talent Committee Decision Summary
                </h2>
                <p className="text-gray-600 mt-1">
                  Review and manage talent decisions from committee sessions
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={handleExport} disabled={decisions.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Decision
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[700px] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Talent Decision</DialogTitle>
                      <DialogDescription>
                        Record a talent committee decision for an employee.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {/* Employee Selection */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Select Employee
                        </label>
                        <Input
                          placeholder="Search employees..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="mb-2"
                        />
                        <div className="max-h-[200px] overflow-y-auto border rounded-lg">
                          {availableEmployees.map((employee) => (
                            <button
                              key={employee.id}
                              onClick={() => {
                                setSelectedEmployeeId(employee.id);
                                setSearchTerm('');
                              }}
                              className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b transition-colors text-left ${
                                selectedEmployeeId === employee.id ? 'bg-blue-50' : ''
                              }`}
                            >
                              <img
                                src={employee.photo}
                                alt={employee.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {employee.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {employee.role} • {employee.department}
                                </div>
                              </div>
                              {selectedEmployeeId === employee.id && (
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                              )}
                            </button>
                          ))}
                        </div>
                        {selectedEmployeeId && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                            Selected:{' '}
                            {allEmployees.find((e) => e.id === selectedEmployeeId)?.name}
                          </div>
                        )}
                      </div>

                      {/* Decision Status */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Decision Status
                        </label>
                        <Select value={status} onValueChange={(v) => setStatus(v as DecisionStatus)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="promotion">
                              <div className="flex items-center gap-2">
                                <ArrowUpCircle className="w-4 h-4 text-green-600" />
                                Promotion
                              </div>
                            </SelectItem>
                            <SelectItem value="salary-review">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                Salary Review
                              </div>
                            </SelectItem>
                            <SelectItem value="bonus">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-600" />
                                Bonus/Insentif
                              </div>
                            </SelectItem>
                            <SelectItem value="layoff">
                              <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-purple-600" />
                                Layoff
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Timeline */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Timeline
                        </label>
                        <Input
                          placeholder="e.g., Q2 2026, Next 6 months, January 2027"
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Decision Notes
                        </label>
                        <Textarea
                          placeholder="Add context about this decision..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={4}
                        />
                      </div>

                      {/* Follow-up Actions */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Follow-up Actions
                        </label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Add an action item..."
                            value={followUpAction}
                            onChange={(e) => setFollowUpAction(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addFollowUpAction();
                              }
                            }}
                          />
                          <Button type="button" onClick={addFollowUpAction} size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {followUpActions.length > 0 && (
                          <div className="space-y-1">
                            {followUpActions.map((action, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                              >
                                <span className="flex-1">{action}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFollowUpAction(index)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddDecision} disabled={!selectedEmployeeId}>
                        Save Decision
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Card className="bg-white px-[8px] py-[4px] rounded-[8px] flex flex-col gap-[2px]">
                <div className="flex flex-col font-['Open_Sans',sans-serif] font-normal text-[#495057] text-[10px]">
                  <p className="leading-[normal]">Employees</p>
                </div>
                <div className="flex flex-col font-semibold text-[#016699] text-[14px]">
                  <p className="leading-[normal] font-bold text-[16px]">
                    {currentTableState?.employeeIds?.length || 0}
                  </p>
                </div>
              </Card>
              <Card className="bg-white px-[8px] py-[4px] rounded-[8px] flex flex-col gap-[2px]">
                <div className="flex flex-col font-['Open_Sans',sans-serif] font-normal text-[#495057] text-[10px]">
                  <p className="leading-[normal]">Total Decisions</p>
                </div>
                <div className="flex flex-col font-semibold text-[#016699] text-[14px]">
                  <p className="leading-[normal] text-[16px] font-bold">{stats.total}</p>
                </div>
              </Card>
              <Card className="bg-white px-[8px] py-[4px] rounded-[8px] flex flex-col gap-[2px]">
                <div className="flex flex-col font-['Open_Sans',sans-serif] font-normal text-[#495057] text-[10px]">
                  <p className="leading-[normal]">Active Filters</p>
                </div>
                <div className="flex flex-col font-semibold text-[#016699] text-[14px]">
                  <p className="leading-[normal] text-[16px] font-bold">{getActiveFiltersCount()}</p>
                </div>
              </Card>
              <Card className="bg-white px-[8px] py-[4px] rounded-[8px] flex flex-col gap-[2px]">
                <div className="flex flex-col font-['Open_Sans',sans-serif] font-normal text-[#495057] text-[10px]">
                  <p className="leading-[normal]">Active Variables</p>
                </div>
                <div className="flex flex-col font-semibold text-[#016699] text-[14px]">
                  <p className="leading-[normal] text-[16px] font-bold">{getActiveVariablesCount()}</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Decision List */}
          {decisions.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Decisions Recorded Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start documenting your talent committee decisions to track and manage talent
                development initiatives.
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Decision
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {decisions.map((decision) => (
                <Card key={decision.id} className="overflow-hidden">
                  <div className="flex">
                    {/* Employee Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={decision.employee.photo}
                          alt={decision.employee.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {decision.employee.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {decision.employee.role} • {decision.employee.department}
                              </p>
                            </div>
                            <Badge
                              variant="secondary"
                              className={`${getStatusColor(decision.status)} flex items-center gap-1`}
                            >
                              {getStatusIcon(decision.status)}
                              {getStatusLabel(decision.status)}
                            </Badge>
                          </div>

                          {/* Performance Indicators */}
                          <div className="flex gap-4 text-sm mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-gray-700">
                                Performance: {decision.employee.performanceRating}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-700">
                                Potential: {decision.employee.potentialRating}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4 text-green-500" />
                              <span className="text-gray-700">
                                {decision.employee.promotionReadiness}
                              </span>
                            </div>
                          </div>

                          {/* Timeline */}
                          {decision.timeline && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                              <Calendar className="w-4 h-4" />
                              <span>Timeline: {decision.timeline}</span>
                            </div>
                          )}

                          {/* Notes */}
                          {decision.notes && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                  <div className="text-xs font-medium text-gray-700 mb-1">
                                    Decision Notes
                                  </div>
                                  <p className="text-sm text-gray-700">{decision.notes}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Follow-up Actions */}
                          {decision.followUpActions && decision.followUpActions.length > 0 && (
                            <div className="border-t border-gray-200 pt-3">
                              <div className="flex items-start gap-2">
                                <PlayCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-gray-700 mb-2">
                                    Follow-up Actions ({decision.followUpActions.length})
                                  </div>
                                  <ul className="space-y-1">
                                    {decision.followUpActions.map((action, index) => (
                                      <li
                                        key={index}
                                        className="text-sm text-gray-700 flex items-start gap-2"
                                      >
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>{action}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Metadata */}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                            <span>Decided by: {decision.decidedBy}</span>
                            <span>•</span>
                            <span>
                              {new Date(decision.decidedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 p-4 flex flex-col gap-2 justify-center border-l border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(decision)}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDecision(decision.employeeId)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl max-h-[700px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Talent Decision</DialogTitle>
                <DialogDescription>
                  Update the decision details for {editingDecision?.employee.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Decision Status */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Decision Status
                  </label>
                  <Select value={status} onValueChange={(v) => setStatus(v as DecisionStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotion">
                        <div className="flex items-center gap-2">
                          <ArrowUpCircle className="w-4 h-4 text-green-600" />
                          Promotion
                        </div>
                      </SelectItem>
                      <SelectItem value="salary-review">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          Salary Review
                        </div>
                      </SelectItem>
                      <SelectItem value="bonus">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          Bonus/Insentif
                        </div>
                      </SelectItem>
                      <SelectItem value="layoff">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-purple-600" />
                          Layoff
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Timeline */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Timeline
                  </label>
                  <Input
                    placeholder="e.g., Q2 2026, Next 6 months, January 2027"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Decision Notes
                  </label>
                  <Textarea
                    placeholder="Add context about this decision..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Follow-up Actions */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Follow-up Actions
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add an action item..."
                      value={followUpAction}
                      onChange={(e) => setFollowUpAction(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFollowUpAction();
                        }
                      }}
                    />
                    <Button type="button" onClick={addFollowUpAction} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {followUpActions.length > 0 && (
                    <div className="space-y-1">
                      {followUpActions.map((action, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                        >
                          <span className="flex-1">{action}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFollowUpAction(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateDecision}>
                  Update Decision
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}