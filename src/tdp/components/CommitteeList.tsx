// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockCommittees as initialCommittees, Committee } from '../data/mockCommittees';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Filter,
  Users,
  Settings,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

type StatusFilter = 'All' | 'Active' | 'Draft' | 'Locked' | 'Completed';

export default function CommitteeList() {
  const navigate = useNavigate();
  const [committees, setCommittees] = useState(initialCommittees);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [periodFilter, setPeriodFilter] = useState('2024');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    objective: '',
    status: 'Active' as Committee['status'],
  });

  // Filter committees
  const filteredCommittees = committees.filter((committee) => {
    const matchesSearch = 
      committee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      committee.objective.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || committee.status === statusFilter;
    
    const matchesPeriod = 
      committee.period.start.includes(periodFilter) || 
      committee.period.end.includes(periodFilter);

    return matchesSearch && matchesStatus && matchesPeriod;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCommittees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCommittees = filteredCommittees.slice(startIndex, endIndex);

  const getStatusBadge = (status: Committee['status']) => {
    const variants = {
      Active: 'bg-blue-100 text-blue-700',
      Draft: 'bg-gray-100 text-gray-700',
      Locked: 'bg-red-100 text-red-700',
      Completed: 'bg-green-100 text-green-700',
    };
    return variants[status];
  };

  const handleCommitteeClick = (committeeId: string) => {
    navigate(`/committee/${committeeId}/screener`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Committees</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and oversee organizational groups and their objectives.
              </p>
            </div>
            <Button className="flex items-center gap-2" onClick={() => navigate('/committee/new')}>
              <Plus className="w-4 h-4" />
              Create New Committee
            </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by committee name or objective..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Locked">Locked</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Period Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Period:</span>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Committee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objective
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedCommittees.map((committee) => (
                  <tr
                    key={committee.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleCommitteeClick(committee.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-gray-900">{committee.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md truncate">
                        {committee.objective}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {committee.period.start} - {committee.period.end}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusBadge(committee.status)}>
                        {committee.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{committee.participants}</div>
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleCommitteeClick(committee.id);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCommittee(committee);
                            setEditForm({
                              name: committee.name,
                              objective: committee.objective,
                              status: committee.status,
                            });
                            setEditDialogOpen(true);
                          }}>
                            Edit Committee
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCommittee(committee);
                            setParticipantsDialogOpen(true);
                          }}>
                            Manage Participants
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCommittee(committee);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedCommittees.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No committees found matching your filters.
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredCommittees.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredCommittees.length)} of {filteredCommittees.length} committees
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <Select 
                    value={itemsPerPage.toString()} 
                    onValueChange={(v) => {
                      setItemsPerPage(Number(v));
                      setCurrentPage(1); // Reset to first page when changing items per page
                    }}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Committee Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Committee</DialogTitle>
            <DialogDescription>
              Make changes to your committee details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Committee Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter committee name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="objective">Objective</Label>
              <Input
                id="objective"
                value={editForm.objective}
                onChange={(e) => setEditForm({ ...editForm, objective: e.target.value })}
                placeholder="Enter committee objective"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(v) => setEditForm({ ...editForm, status: v as Committee['status'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Locked">Locked</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (selectedCommittee) {
                  const updatedCommittees = committees.map((c) =>
                    c.id === selectedCommittee.id ? { ...c, ...editForm } : c
                  );
                  setCommittees(updatedCommittees);
                  setEditDialogOpen(false);
                }
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Committee Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Committee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCommittee?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (selectedCommittee) {
                  const updatedCommittees = committees.filter((c) => c.id !== selectedCommittee.id);
                  setCommittees(updatedCommittees);
                  setDeleteDialogOpen(false);
                }
              }}
            >
              Delete Committee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Participants Dialog */}
      <Dialog open={participantsDialogOpen} onOpenChange={setParticipantsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Participants</DialogTitle>
            <DialogDescription>
              Manage participants for "{selectedCommittee?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h4 className="font-medium text-gray-900">Current Participants</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedCommittee?.participants} participants currently assigned
                  </p>
                </div>
                <Button size="sm" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add Participant
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Search Participants</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="border rounded-lg divide-y max-h-[300px] overflow-y-auto">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Participant {i}</div>
                        <div className="text-sm text-gray-500">participant{i}@company.com</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setParticipantsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}