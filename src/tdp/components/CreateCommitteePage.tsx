// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { loadEmployeeDraftEmployees } from '../data/employeeDraft';
import { X, Search, Plus, ArrowLeft, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { DatePicker } from './ui/date-picker';

interface Collaborator {
  email: string;
  role: 'EDITOR' | 'VIEWER';
}

export default function CreateCommitteePage() {
  const navigate = useNavigate();
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

  const updateCollaboratorRole = (index: number, role: 'EDITOR' | 'VIEWER') => {
    const updatedCollaborators = [...collaborators];
    updatedCollaborators[index].role = role;
    setCollaborators(updatedCollaborators);
  };

  const handleCreate = () => {
    const committeeData = {
      id: Date.now().toString(),
      name: committeeName,
      objective,
      period: {
        start: startDate ? startDate.toISOString().split('T')[0] : '',
        end: endDate ? endDate.toISOString().split('T')[0] : '',
      },
      status: 'Draft' as const,
      participants: selectedCandidates.length,
      icon: '🎯',
      iconColor: 'bg-blue-100',
      candidates: selectedCandidates,
      collaborators,
    };
    
    // Save to localStorage or state management
    const saved = localStorage.getItem('committees');
    const existingCommittees = saved ? JSON.parse(saved) : [];
    localStorage.setItem('committees', JSON.stringify([committeeData, ...existingCommittees]));
    
    // Navigate back to committee list
    navigate('/');
  };

  const isFormValid = committeeName && objective && startDate && endDate;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Create Committee</h1>
                  <p className="text-sm text-gray-600">
                    Establish a new organizational group and define its objectives
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="space-y-8">
          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Establish New Committee</h2>
            <p className="text-base text-gray-600 mt-2">
              Define the core objectives and assembly for the upcoming strategic session.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="col-span-2 space-y-8">
              {/* General Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">General Information</h3>
                </div>

                {/* Committee Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Committee Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Q4 Strategic Growth Taskforce"
                    value={committeeName}
                    onChange={(e) => setCommitteeName(e.target.value)}
                    className="text-base"
                  />
                </div>

                {/* Objective */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objective <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Describe the mission, goals, and core responsibilities of this committee..."
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    rows={5}
                    className="text-base"
                  />
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      date={startDate}
                      onDateChange={setStartDate}
                      placeholder="Select start date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
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
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Select Candidates</h3>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 text-sm">
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
                    className="pl-10 text-base"
                  />
                </div>

                {/* Candidate List */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredCandidates.map((candidate) => {
                    const isSelected = selectedCandidates.includes(candidate.id);
                    return (
                      <div
                        key={candidate.id}
                        onClick={() => toggleCandidate(candidate.id)}
                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={candidate.photo}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{candidate.name}</div>
                            <div className="text-sm text-gray-600">{candidate.role}</div>
                            <div className="text-xs text-gray-500">{candidate.department}</div>
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
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllCandidates}
                    disabled={isAllSelected}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deselectAllCandidates}
                    disabled={!isAllSelected}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>

              {/* Invite Collaborators */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Invite Collaborators</h3>
                </div>

                {/* Add Collaborator Input */}
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter email address..."
                    value={newCollaboratorEmail}
                    onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                    className="flex-1 text-base"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCollaborator();
                      }
                    }}
                  />
                  <select
                    value={newCollaboratorRole}
                    onChange={(e) => setNewCollaboratorRole(e.target.value as 'EDITOR' | 'VIEWER')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="VIEWER">Viewer</option>
                    <option value="EDITOR">Editor</option>
                  </select>
                  <Button onClick={addCollaborator} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Invite
                  </Button>
                </div>

                {/* Collaborators List */}
                {collaborators.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {collaborators.map((collab, index) => (
                      <div
                        key={collab.email}
                        className="flex items-center gap-2 bg-gray-100 rounded-full pl-4 pr-2 py-2"
                      >
                        <span className="text-sm text-gray-700">{collab.email}</span>
                        <select
                          value={collab.role}
                          onChange={(e) => updateCollaboratorRole(index, e.target.value as 'EDITOR' | 'VIEWER')}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="VIEWER">Viewer</option>
                          <option value="EDITOR">Editor</option>
                        </select>
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

            {/* Right Column - Summary */}
            <div className="col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Committee Summary</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Status</div>
                    <Badge className="bg-gray-100 text-gray-700">Draft</Badge>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Name</div>
                    <div className="text-sm text-gray-900">
                      {committeeName || <span className="text-gray-400 italic">Not set</span>}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Period</div>
                    <div className="text-sm text-gray-900">
                      {startDate && endDate ? (
                        `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                      ) : (
                        <span className="text-gray-400 italic">Not set</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Candidates</div>
                    <div className="text-sm text-gray-900">
                      {selectedCandidates.length} {selectedCandidates.length === 1 ? 'person' : 'people'}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">Collaborators</div>
                    <div className="text-sm text-gray-900">
                      {collaborators.length} {collaborators.length === 1 ? 'person' : 'people'}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 italic">
                    All fields are auto-saved as draft
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}