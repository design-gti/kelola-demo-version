// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { useMemo, useState } from 'react';
import { loadEmployeeDraftEmployees } from '../data/employeeDraft';
import { X, Search, Plus, UserPlus, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { DatePicker } from './ui/date-picker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface CreateCommitteeDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onCommitteeCreated: (committeeData: any) => void;
}

interface Collaborator {
  email: string;
  role: 'EDITOR' | 'VIEWER';
}

export default function CreateCommitteeDialog({
  isOpen,
  onClose,
  onCommitteeCreated,
}: CreateCommitteeDialogProps) {
  const allEmployees = useMemo(() => loadEmployeeDraftEmployees(), []);
  const [committeeName, setCommitteeName] = useState('');
  const [objective, setObjective] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState('');
  const [newCollaboratorRole, setNewCollaboratorRole] = useState<'EDITOR' | 'VIEWER'>('VIEWER');

  // Filter candidates based on search
  const filteredCandidates = allEmployees.filter((emp) => {
    const searchLower = candidateSearch.toLowerCase();
    return (
      emp.name.toLowerCase().includes(searchLower) ||
      emp.role.toLowerCase().includes(searchLower) ||
      emp.department.toLowerCase().includes(searchLower)
    );
  });

  const toggleCandidate = (employeeId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const selectAllCandidates = () => {
    const allFilteredIds = filteredCandidates.map((emp) => emp.id);
    setSelectedCandidates(allFilteredIds);
  };

  const deselectAllCandidates = () => {
    setSelectedCandidates([]);
  };

  const isAllSelected = filteredCandidates.length > 0 && 
    filteredCandidates.every((emp) => selectedCandidates.includes(emp.id));

  const addCollaborator = () => {
    if (newCollaboratorEmail && !collaborators.some((c) => c.email === newCollaboratorEmail)) {
      setCollaborators([...collaborators, { email: newCollaboratorEmail, role: newCollaboratorRole }]);
      setNewCollaboratorEmail('');
      setNewCollaboratorRole('VIEWER');
    }
  };

  const removeCollaborator = (email: string) => {
    setCollaborators(collaborators.filter((c) => c.email !== email));
  };

  const handleCreate = () => {
    const committeeData = {
      id: Date.now().toString(),
      name: committeeName,
      objective,
      period: {
        start: startDate?.toISOString().split('T')[0],
        end: endDate?.toISOString().split('T')[0],
      },
      status: 'Draft' as const,
      participants: selectedCandidates.length,
      icon: '🎯',
      iconColor: 'bg-blue-100',
      candidates: selectedCandidates,
      collaborators,
    };
    
    onCommitteeCreated(committeeData);
    
    // Reset form
    setCommitteeName('');
    setObjective('');
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedCandidates([]);
    setCollaborators([]);
  };

  const isFormValid = committeeName && objective && startDate && endDate;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-8 pt-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-xl font-semibold">Create Committee</DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Create a new committee by filling in the general information, selecting candidates, and inviting collaborators.
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 py-6 space-y-8">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Establish New Committee</h2>
            <p className="text-sm text-gray-600 mt-1">
              Define the core objectives and assembly for the upcoming strategic session.
            </p>
          </div>

          {/* General Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">General Information</h3>
            </div>

            {/* Committee Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Committee Name
              </label>
              <Input
                type="text"
                placeholder="e.g. Q4 Strategic Growth Taskforce"
                value={committeeName}
                onChange={(e) => setCommitteeName(e.target.value)}
              />
            </div>

            {/* Objective */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objective
              </label>
              <Textarea
                placeholder="Describe the mission, goals, and core responsibilities of this committee..."
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={4}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <DatePicker
                  date={startDate}
                  onDateChange={setStartDate}
                  placeholder="Select start date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <DatePicker
                  date={endDate}
                  onDateChange={setEndDate}
                  minDate={startDate}
                  placeholder="Select end date"
                />
              </div>
            </div>
          </div>

          {/* Select Candidates */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Select Candidates</h3>
              </div>
              <Badge className="bg-blue-100 text-blue-700">
                {selectedCandidates.length} Selected
              </Badge>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, role, or department..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Candidate List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredCandidates.slice(0, 10).map((candidate) => {
                const isSelected = selectedCandidates.includes(candidate.id);
                return (
                  <div
                    key={candidate.id}
                    onClick={() => toggleCandidate(candidate.id)}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={candidate.photo}
                        alt={candidate.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{candidate.name}</div>
                        <div className="text-sm text-gray-600">{candidate.role}</div>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Select All/Deselect All */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={() => {
                  if (isAllSelected) {
                    deselectAllCandidates();
                  } else {
                    selectAllCandidates();
                  }
                }}
              />
              <span className="text-sm text-gray-700">
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </span>
            </div>
          </div>

          {/* Invite Collaborators */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Invite Collaborators</h3>
            </div>

            {/* Add Collaborator Input */}
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address..."
                value={newCollaboratorEmail}
                onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCollaborator();
                  }
                }}
              />
              <Select
                value={newCollaboratorRole}
                onValueChange={(v) => setNewCollaboratorRole(v as 'EDITOR' | 'VIEWER')}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEWER">Viewer</SelectItem>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addCollaborator} className="gap-2">
                <Plus className="w-4 h-4" />
                Invite
              </Button>
            </div>

            {/* Collaborators List */}
            {collaborators.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {collaborators.map((collab) => (
                  <div
                    key={collab.email}
                    className="flex items-center gap-2 bg-gray-100 rounded-full pl-3 pr-2 py-1"
                  >
                    <span className="text-sm text-gray-700">{collab.email}</span>
                    <Badge
                      variant="secondary"
                      className={
                        collab.role === 'EDITOR'
                          ? 'bg-purple-100 text-purple-700 text-xs'
                          : 'bg-gray-200 text-gray-700 text-xs'
                      }
                    >
                      {collab.role}
                    </Badge>
                    <button
                      onClick={() => removeCollaborator(collab.email)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <Button variant="ghost" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 italic">All fields auto-saved as draft</span>
            <Button onClick={handleCreate} disabled={!isFormValid} className="gap-2">
              Create Committee
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}