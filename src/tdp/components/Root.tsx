// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { Outlet } from 'react-router';
import { FileCheck } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

type DecisionStatus = 'promotion' | 'salary-review' | 'bonus' | 'layoff';

export default function Root() {
  // Add to Decision states
  const [isAddDecisionDialogOpen, setIsAddDecisionDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [decisionStatus, setDecisionStatus] = useState<DecisionStatus>('promotion');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [decisionTimeline, setDecisionTimeline] = useState('');

  const handleOpenAddDecision = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setIsAddDecisionDialogOpen(true);
  };

  const handleAddToDecision = () => {
    if (!decisionStatus || !selectedEmployeeId) return;

    const saved = localStorage.getItem('talentDecisions');
    const existingDecisions = saved ? JSON.parse(saved) : [];

    const newDecision = {
      employeeId: selectedEmployeeId,
      status: decisionStatus,
      notes: decisionNotes,
      followUpActions: [],
      timeline: decisionTimeline,
      decidedBy: 'Talent Committee',
      decidedDate: new Date().toISOString(),
    };

    const existingIndex = existingDecisions.findIndex(
      (d: any) => d.employeeId === selectedEmployeeId
    );

    if (existingIndex >= 0) {
      existingDecisions[existingIndex] = newDecision;
    } else {
      existingDecisions.push(newDecision);
    }

    localStorage.setItem('talentDecisions', JSON.stringify(existingDecisions));

    setDecisionStatus('promotion');
    setDecisionNotes('');
    setDecisionTimeline('');
    setSelectedEmployeeId('');
    setIsAddDecisionDialogOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Add to Decision Dialog */}
      <Dialog open={isAddDecisionDialogOpen} onOpenChange={setIsAddDecisionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Decision Summary</DialogTitle>
            <DialogDescription>
              Create a decision for this employee.
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
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="salary-review">Salary Review</SelectItem>
                  <SelectItem value="bonus">Bonus/Insentif</SelectItem>
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

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain">
        <main className="pt-0 pb-8">
          <Outlet context={{ onAddDecision: handleOpenAddDecision }} />
        </main>
      </div>
    </div>
  );
}
