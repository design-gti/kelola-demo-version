// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { Settings, RotateCcw, Lock, Unlock, GripVertical, X, Plus, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from './ui/dialog';
import { Slider } from './ui/slider';
import { Employee } from '../data/mockEmployees';
import { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface RankingWeights {
  performanceRating: number;
  potentialRating: number;
  readinessLevel: number;
  timeInRole: number;
  engagementScore: number;
  assessmentScore: number;
}

interface NumericalColumn {
  key: keyof Employee;
  label: string;
  max: number;
}

interface RankingConfigDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  weights: RankingWeights;
  tempWeights: RankingWeights;
  setTempWeights: (weights: RankingWeights) => void;
  onSave: () => void;
  onReset: () => void;
  visibleColumns?: Set<string>;
  numericalColumns?: NumericalColumn[];
}

interface ActiveVariable {
  key: keyof RankingWeights;
  label: string;
  max: number;
}

interface DragItem {
  index: number;
  type: string;
}

function DraggableVariableRow({
  variable,
  index,
  weight,
  isLocked,
  onWeightChange,
  onToggleLock,
  onDelete,
  moveVariable,
  totalVariables,
}: {
  variable: ActiveVariable;
  index: number;
  weight: number;
  isLocked: boolean;
  onWeightChange: (value: number) => void;
  onToggleLock: () => void;
  onDelete: () => void;
  moveVariable: (dragIndex: number, hoverIndex: number) => void;
  totalVariables: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'VARIABLE_ROW',
    item: () => ({ index, type: 'VARIABLE_ROW' }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'VARIABLE_ROW',
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveVariable(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  preview(drop(ref));

  return (
    <div
      ref={ref}
      className={`grid grid-cols-[40px_1fr_80px_40px] gap-4 items-center p-3 rounded-lg transition-all ${
        isDragging ? 'opacity-30' : 'opacity-100'
      } ${isOver ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
      style={{ borderBottom: '1px solid #E5E7EB' }}
    >
      {/* Drag Handle */}
      <div ref={drag} className="cursor-move flex items-center justify-center">
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>

      {/* Variable Name & Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-gray-700">{variable.label}</span>
          <span className="text-[14px] font-bold text-[#016699]">{weight}%</span>
        </div>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[weight]}
          onValueChange={([val]) => onWeightChange(val)}
          disabled={isLocked}
          className="w-full"
        />
      </div>

      {/* Lock Button */}
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLock}
          className={`h-8 w-8 p-0 ${
            isLocked ? 'text-[#016699] bg-blue-50 hover:bg-blue-100' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </Button>
      </div>

      {/* Delete Button */}
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={totalVariables <= 1}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function RankingConfigDialog({
  isOpen,
  onClose,
  weights,
  tempWeights,
  setTempWeights,
  onSave,
  onReset,
  visibleColumns = new Set(),
  numericalColumns = [],
}: RankingConfigDialogProps) {
  // State to track active variables (independent from visible columns)
  const [activeVariables, setActiveVariables] = useState<ActiveVariable[]>(() => {
    // Initialize with visible columns
    return numericalColumns
      .filter(col => visibleColumns.has(col.key))
      .map(col => ({
        key: col.key as keyof RankingWeights,
        label: col.label,
        max: col.max,
      }));
  });

  // State to track locked columns
  const [lockedColumns, setLockedColumns] = useState<Set<keyof RankingWeights>>(new Set());

  // Calculate total weight from active variables
  const activeWeightSum = activeVariables.reduce((sum, variable) => {
    return sum + (tempWeights[variable.key] || 0);
  }, 0);

  const handleWeightChange = (key: keyof RankingWeights, newValue: number) => {
    const oldValue = tempWeights[key] || 0;
    const delta = newValue - oldValue;

    if (delta === 0) return;

    // Get unlocked variables except the one being changed
    const unlockedVariables = activeVariables.filter(
      v => v.key !== key && !lockedColumns.has(v.key)
    );

    if (unlockedVariables.length === 0) {
      setTempWeights({ ...tempWeights, [key]: newValue });
      return;
    }

    // Calculate locked total (including the changed variable)
    const lockedTotal = activeVariables.reduce((sum, v) => {
      if (v.key === key) return sum + newValue;
      if (lockedColumns.has(v.key)) return sum + (tempWeights[v.key] || 0);
      return sum;
    }, 0);

    const unlockedTarget = 100 - lockedTotal;
    const currentUnlockedTotal = unlockedVariables.reduce(
      (sum, v) => sum + (tempWeights[v.key] || 0),
      0
    );

    const newWeights = { ...tempWeights, [key]: newValue };

    if (currentUnlockedTotal === 0) {
      const perVariable = Math.floor(unlockedTarget / unlockedVariables.length);
      let remaining = unlockedTarget - perVariable * unlockedVariables.length;

      unlockedVariables.forEach((v, idx) => {
        const extra = idx < remaining ? 1 : 0;
        newWeights[v.key] = Math.max(0, perVariable + extra);
      });
    } else {
      let distributed = 0;

      unlockedVariables.forEach((v, idx) => {
        if (idx === unlockedVariables.length - 1) {
          newWeights[v.key] = Math.max(0, unlockedTarget - distributed);
        } else {
          const proportion = (tempWeights[v.key] || 0) / currentUnlockedTotal;
          const targetWeight = Math.round(unlockedTarget * proportion);
          newWeights[v.key] = Math.max(0, targetWeight);
          distributed += newWeights[v.key];
        }
      });
    }

    setTempWeights(newWeights);
  };

  const toggleLock = (key: keyof RankingWeights) => {
    const newLocked = new Set(lockedColumns);
    if (newLocked.has(key)) {
      newLocked.delete(key);
    } else {
      newLocked.add(key);
    }
    setLockedColumns(newLocked);
  };

  const moveVariable = useCallback((dragIndex: number, hoverIndex: number) => {
    setActiveVariables((prev) => {
      const newVariables = [...prev];
      const [removed] = newVariables.splice(dragIndex, 1);
      newVariables.splice(hoverIndex, 0, removed);
      return newVariables;
    });
  }, []);

  const handleDeleteVariable = (key: keyof RankingWeights) => {
    if (activeVariables.length <= 1) return;

    const deletedWeight = tempWeights[key] || 0;
    const newVariables = activeVariables.filter(v => v.key !== key);
    
    // Remove from locked columns if it was locked
    const newLocked = new Set(lockedColumns);
    newLocked.delete(key);
    setLockedColumns(newLocked);

    // Redistribute weight to remaining unlocked variables
    const remainingUnlocked = newVariables.filter(v => !newLocked.has(v.key));
    
    if (remainingUnlocked.length > 0) {
      const newWeights = { ...tempWeights };
      newWeights[key] = 0;

      const unlockedTotal = remainingUnlocked.reduce(
        (sum, v) => sum + (tempWeights[v.key] || 0),
        0
      );

      if (unlockedTotal === 0) {
        const perVariable = Math.floor(deletedWeight / remainingUnlocked.length);
        let remaining = deletedWeight - perVariable * remainingUnlocked.length;

        remainingUnlocked.forEach((v, idx) => {
          const extra = idx < remaining ? 1 : 0;
          newWeights[v.key] = (newWeights[v.key] || 0) + perVariable + extra;
        });
      } else {
        let distributed = 0;
        remainingUnlocked.forEach((v, idx) => {
          if (idx === remainingUnlocked.length - 1) {
            newWeights[v.key] = (newWeights[v.key] || 0) + deletedWeight - distributed;
          } else {
            const proportion = (tempWeights[v.key] || 0) / unlockedTotal;
            const addition = Math.round(deletedWeight * proportion);
            newWeights[v.key] = (newWeights[v.key] || 0) + addition;
            distributed += addition;
          }
        });
      }

      setTempWeights(newWeights);
    }

    setActiveVariables(newVariables);
  };

  const handleAddVariable = (key: string) => {
    const columnToAdd = numericalColumns.find(col => col.key === key);
    if (!columnToAdd) return;

    const newVariable: ActiveVariable = {
      key: columnToAdd.key as keyof RankingWeights,
      label: columnToAdd.label,
      max: columnToAdd.max,
    };

    setActiveVariables([...activeVariables, newVariable]);

    // Set initial weight to 0, will be adjusted by handleWeightChange
    const newWeights = { ...tempWeights, [newVariable.key]: 0 };
    setTempWeights(newWeights);
  };

  const handleRating = () => {
    // Sort variables by current weight descending
    const sortedVariables = [...activeVariables].sort((a, b) => {
      const weightA = tempWeights[a.key] || 0;
      const weightB = tempWeights[b.key] || 0;
      return weightB - weightA;
    });

    const n = sortedVariables.length;
    
    if (n === 1) {
      // If only one variable, give it 100%
      const newWeights = { ...tempWeights };
      newWeights[sortedVariables[0].key] = 100;
      setTempWeights(newWeights);
      return;
    }

    // Arithmetic sequence: a, a-d, a-2d, ..., a-(n-1)d
    // Sum = n*a - d*n*(n-1)/2 = 100
    // Rearrange: a = 100/n + d*(n-1)/2
    //
    // With constraint last term >= minLast:
    // a - (n-1)*d >= minLast
    // Substitute a:
    // 100/n + d*(n-1)/2 - (n-1)*d >= minLast
    // 100/n - d*(n-1)/2 >= minLast
    // d <= 2*(100/n - minLast) / (n-1)
    
    const minLast = 5; // minimum weight for last variable
    const maxGap = 2 * (100 / n - minLast) / (n - 1);
    const gap = Math.floor(maxGap); // Use floor to ensure last >= minLast
    const first = 100 / n + gap * (n - 1) / 2;
    
    const newWeights = { ...tempWeights };
    let totalAssigned = 0;
    
    sortedVariables.forEach((v, idx) => {
      if (idx === sortedVariables.length - 1) {
        // Last variable gets the remainder to ensure exact 100%
        newWeights[v.key] = 100 - totalAssigned;
      } else {
        const weight = Math.round(first - gap * idx);
        newWeights[v.key] = weight;
        totalAssigned += weight;
      }
    });

    setTempWeights(newWeights);
    setActiveVariables(sortedVariables);
  };

  // Get available variables to add (not already active)
  const availableVariables = numericalColumns.filter(
    col => !activeVariables.some(v => v.key === col.key)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#016699]" />
            Configure Ranking Formula
          </DialogTitle>
          <DialogDescription>
            Adjust the weight of each variable to customize how employees are ranked. Total weight will always be 100%.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {availableVariables.length > 0 && (
                <Select onValueChange={handleAddVariable}>
                  <SelectTrigger className="w-[200px] h-9 text-[13px]">
                    <Plus className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Add Variable" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVariables.map(col => (
                      <SelectItem key={col.key} value={col.key}>
                        {col.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRating}
              className="h-9 text-[13px]"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Rating
            </Button>
          </div>

          {/* Variables Table */}
          <div className="border rounded-lg bg-white shadow-sm">
            {/* Table Header */}
            <div
              className="grid grid-cols-[40px_1fr_80px_40px] gap-4 p-3 bg-gray-50 border-b font-medium text-[13px] text-gray-600"
            >
              <div></div>
              <div>Variable Name</div>
              <div className="text-center">Lock</div>
              <div className="text-center">Delete</div>
            </div>

            {/* Variables List */}
            <DndProvider backend={HTML5Backend}>
              <div>
                {activeVariables.map((variable, index) => (
                  <DraggableVariableRow
                    key={variable.key}
                    variable={variable}
                    index={index}
                    weight={tempWeights[variable.key] || 0}
                    isLocked={lockedColumns.has(variable.key)}
                    onWeightChange={(val) => handleWeightChange(variable.key, val)}
                    onToggleLock={() => toggleLock(variable.key)}
                    onDelete={() => handleDeleteVariable(variable.key)}
                    moveVariable={moveVariable}
                    totalVariables={activeVariables.length}
                  />
                ))}
              </div>
            </DndProvider>
          </div>

          {/* Total Weight Indicator */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-gray-700">Total Weight:</span>
              <span
                className={`text-[18px] font-bold ${
                  activeWeightSum === 100
                    ? 'text-green-600'
                    : activeWeightSum > 100
                    ? 'text-red-600'
                    : 'text-orange-600'
                }`}
              >
                {activeWeightSum}%
              </span>
            </div>
            {activeWeightSum !== 100 && (
              <p className="text-[12px] text-gray-600 mt-1">
                {activeWeightSum > 100
                  ? 'Total weight exceeds 100%. Adjust the weights.'
                  : 'Total weight is less than 100%. Adjust the weights.'}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onReset} className="mr-auto">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-[#016699] hover:bg-[#014d73]">
            <Settings className="w-4 h-4 mr-2" />
            Apply Formula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}