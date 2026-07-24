// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { useState, useEffect, useMemo, useRef } from 'react';
import { Trash2, Plus, ArrowUpRight, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './ui/dialog';
import { ColumnConfig } from '../data/columnDefinitions';
import visibleColumnsSvgPaths from '../imports/svg-uatce53kpn';

interface VisibleColumnsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibleColumns: Set<string>;
  onApply: (columns: Set<string>) => void;
  columnDefinitions: ColumnConfig[];
  customColumns: ColumnConfig[];
  onDeleteCustomColumn: (key: string) => void;
  onAddColumn: () => void;
}

export default function VisibleColumnsDialog({
  open,
  onOpenChange,
  visibleColumns,
  onApply,
  columnDefinitions,
  customColumns,
  onDeleteCustomColumn,
  onAddColumn,
}: VisibleColumnsDialogProps) {
  const [tempVisibleColumns, setTempVisibleColumns] = useState<Set<string>>(new Set());
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');
  const [searchTerm, setSearchTerm] = useState('');

  // ── Custom clusters & variable overrides ─────────────────────────────────
  const [userClusters, setUserClusters] = useState<{ key: string; label: string }[]>(() => {
    try { return JSON.parse(localStorage.getItem('userClusters.v1') || '[]'); } catch { return []; }
  });
  const [clusterOverrides, setClusterOverrides] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('clusterOverrides.v1') || '{}'); } catch { return {}; }
  });
  const [newClusterLabel, setNewClusterLabel] = useState('');
  const [showNewClusterInput, setShowNewClusterInput] = useState(false);
  const [moveMenuFor, setMoveMenuFor] = useState<string | null>(null); // variable key
  const newClusterInputRef = useRef<HTMLInputElement>(null);

  // Sync tempVisibleColumns with visibleColumns prop whenever dialog opens
  useEffect(() => {
    if (open) {
      setTempVisibleColumns(new Set(visibleColumns));
      setSearchTerm('');
      setExpandedSection('basic');
    }
  }, [open, visibleColumns]);

  const handleOpen = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };

  const handleApply = () => {
    // Ensure mandatory columns are always included
    const finalColumns = new Set(tempVisibleColumns);
    finalColumns.add('name');
    finalColumns.add('competencyScore');
    finalColumns.add('commitmentScore');
    finalColumns.add('contributionScore');
    onApply(finalColumns);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const toggleTempColumn = (key: string) => {
    // Prevent toggling mandatory columns
    const mandatoryColumns = ['name', 'competencyScore', 'commitmentScore', 'contributionScore'];
    if (mandatoryColumns.includes(key)) return;
    
    setTempVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getFilteredColumns = (columns: ColumnConfig[]) => {
    if (!searchTerm.trim()) return columns;
    const searchLower = searchTerm.toLowerCase();
    return columns.filter(col => col.label.toLowerCase().includes(searchLower));
  };

  // ---- Cluster → columnDefinitions filter (data-driven) ----
  // Rules:
  //   basic      → typed basic fields + ANY typed non-csv column that isn't in another section
  //                + csv: columns with no cluster (no bracket prefix)
  //   capability → ONLY csv: columns whose bracket prefix maps to 'aspect' or 'competency'
  //   commitment → ONLY csv: columns whose bracket prefix maps to 'commitment'
  //   contribution → ONLY csv: columns whose bracket prefix maps to 'contribution'
  //   potency    → typed potency fields + csv: potency columns
  //   readiness  → typed readiness fields + csv: readiness columns
  // Typed aggregate scores (performanceRating, engagementScore, competencyMatch, etc.)
  // are shown under 'basic' so they remain accessible without cluttering bracket sections.
  const TYPED_POTENCY_KEYS = new Set(['potentialRating']);
  const TYPED_READINESS_KEYS = new Set(['readinessHAV', 'usia', 'readinessRiskHeat']);
  const TYPED_BASIC_KEYS = new Set(['name', 'role', 'department', 'level']);
  // Typed columns that are derived aggregates — they live in Basic so they don't
  // pollute the CSV bracket sections.
  const TYPED_SCORE_KEYS = new Set([
    'competencyMatch', 'iqScore', 'readinessLevel',
    'engagementScore', 'performanceRating', 'assessmentScore',
    'competencyScore', 'commitmentScore', 'contributionScore', 'aspectScore',
    'leadershipType', 'personality', 'flightRisk', 'promotionReadiness',
    'yearsInCompany', 'yearsInRole', 'timeInRole', 'salary', 'lastPromotionDate',
    'criticalRole', 'successorIdentified', 'manager', 'skills', 'certifications',
    'education',
  ]);

  const matchesCluster = (col: ColumnConfig, cluster: string): boolean => {
    const k = String(col.key);
    const c = col.cluster as string | undefined;
    const isCsv = k.startsWith('csv:');
    switch (cluster) {
      case 'basic':
        // Typed basic fields + typed aggregate scores + csv: columns with no bracket cluster
        return TYPED_BASIC_KEYS.has(k) || TYPED_SCORE_KEYS.has(k) || (isCsv && !c);
      case 'capability':
        // Only actual CSV bracket columns for this group
        return isCsv && (c === 'aspect' || c === 'competency');
      case 'commitment':
        return isCsv && c === 'commitment';
      case 'contribution':
        return isCsv && c === 'contribution';
      case 'potency':
        return TYPED_POTENCY_KEYS.has(k) || (isCsv && c === 'potency');
      case 'readiness':
        return TYPED_READINESS_KEYS.has(k) || (isCsv && c === 'readiness');
      case 'leadershipStyle':
        return isCsv && c === 'leadershipStyle';
      default:
        return false;
    }
  };

  // ---- Derive section labels from CSV bracket prefixes in columnDefinitions ----
  // For every csv:<header> column whose header has a [BRACKET] prefix, map the
  // internal cluster key → bracket group name.  Falls back to the friendly label
  // when no CSV bracket column exists for that cluster.
  const csvSectionLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    columnDefinitions.forEach((col) => {
      const k = String(col.key);
      if (!k.startsWith('csv:')) return;
      const header = k.slice(4);
      const m = header.match(/^\[([^\]]+)\]/);
      if (!m) return;
      const bracketGroup = m[1]; // e.g. 'KOMPETENSI', 'HEROES', 'LEADERSHIP PROFILE'
      const cluster = col.cluster as string | undefined;
      if ((cluster === 'aspect' || cluster === 'competency') && !labels['capability'])
        labels['capability'] = bracketGroup;
      if (cluster === 'commitment' && !labels['commitment'])
        labels['commitment'] = bracketGroup;
      if (cluster === 'contribution' && !labels['contribution'])
        labels['contribution'] = bracketGroup;
      if (cluster === 'leadershipStyle' && !labels['leadershipStyle'])
        labels['leadershipStyle'] = bracketGroup;
    });
    return labels;
  }, [columnDefinitions]);

  const sectionLabel = (cluster: string, fallback: string): string =>
    csvSectionLabels[cluster] ?? fallback;

  // Returns the original (built-in) cluster key for a column
  const getOriginalClusterKey = (col: ColumnConfig): string => {
    if (matchesCluster(col, 'basic')) return 'basic';
    if (matchesCluster(col, 'capability')) return 'capability';
    if (matchesCluster(col, 'commitment')) return 'commitment';
    if (matchesCluster(col, 'contribution')) return 'contribution';
    if (matchesCluster(col, 'leadershipStyle')) return 'leadershipStyle';
    if (matchesCluster(col, 'potency')) return 'potency';
    if (matchesCluster(col, 'readiness')) return 'readiness';
    return 'custom';
  };

  // Returns effective cluster (respects user overrides; basic is always locked)
  const getEffectiveClusterKey = (col: ColumnConfig): string => {
    const orig = getOriginalClusterKey(col);
    if (orig === 'basic') return 'basic'; // locked — cannot be moved
    return clusterOverrides[String(col.key)] ?? orig;
  };

  // Get all columns belonging to a cluster, respecting overrides
  const getClusterColumns = (cluster: string): string[] => {
    const allCols = [...columnDefinitions, ...customColumns];
    return allCols
      .filter(col => getEffectiveClusterKey(col) === cluster)
      .map(col => String(col.key));
  };

  // All available clusters (built-in + user-created)
  const BUILT_IN_CLUSTERS = [
    { key: 'basic',          label: 'Basic Information' },
    { key: 'capability',     label: sectionLabel('capability', 'Capability') },
    { key: 'commitment',     label: sectionLabel('commitment', 'Commitment') },
    { key: 'contribution',   label: sectionLabel('contribution', 'Contribution') },
    { key: 'leadershipStyle',label: sectionLabel('leadershipStyle', 'Leadership Style') },
  ];
  const allClusters = [...BUILT_IN_CLUSTERS, ...userClusters];

  // Move a variable to a different cluster
  const moveVariable = (varKey: string, targetCluster: string) => {
    const newOverrides = { ...clusterOverrides, [varKey]: targetCluster };
    setClusterOverrides(newOverrides);
    localStorage.setItem('clusterOverrides.v1', JSON.stringify(newOverrides));
    setMoveMenuFor(null);
  };

  // Create a new user cluster
  const createUserCluster = () => {
    const label = newClusterLabel.trim();
    if (!label) return;
    const key = `user_${Date.now()}`;
    const next = [...userClusters, { key, label }];
    setUserClusters(next);
    localStorage.setItem('userClusters.v1', JSON.stringify(next));
    setNewClusterLabel('');
    setShowNewClusterInput(false);
    setExpandedSection(key);
  };

  // Delete a user cluster — move its variables back to original cluster
  const deleteUserCluster = (clusterKey: string) => {
    const next = userClusters.filter(c => c.key !== clusterKey);
    setUserClusters(next);
    localStorage.setItem('userClusters.v1', JSON.stringify(next));
    const newOverrides = { ...clusterOverrides };
    Object.keys(newOverrides).forEach(k => {
      if (newOverrides[k] === clusterKey) delete newOverrides[k];
    });
    setClusterOverrides(newOverrides);
    localStorage.setItem('clusterOverrides.v1', JSON.stringify(newOverrides));
    if (expandedSection === clusterKey) setExpandedSection(null);
  };

  const toggleSelectAllCluster = (cluster: string) => {
    const clusterCols = getClusterColumns(cluster);
    const mandatoryColumns = ['name', 'competencyScore', 'commitmentScore', 'contributionScore'];
    const selectableCols = clusterCols.filter(col => !mandatoryColumns.includes(col));
    const allSelected = selectableCols.every(col => tempVisibleColumns.has(col));

    setTempVisibleColumns(prev => {
      const newSet = new Set(prev);
      selectableCols.forEach(col => {
        if (allSelected) {
          newSet.delete(col);
        } else {
          newSet.add(col);
        }
      });
      return newSet;
    });
  };

  const isClusterAllSelected = (cluster: string): boolean => {
    const clusterCols = getClusterColumns(cluster);
    const mandatoryColumns = ['name', 'competencyScore', 'commitmentScore', 'contributionScore'];
    const selectableCols = clusterCols.filter(col => !mandatoryColumns.includes(col));
    return selectableCols.length > 0 && selectableCols.every(col => tempVisibleColumns.has(col));
  };

  const renderCheckbox = (
    isChecked: boolean,
    onClick: () => void,
    label: string,
    onDelete?: () => void,
    isMandatory?: boolean,
    varKey?: string,
  ) => {
    const canMove = !isMandatory && varKey;
    const isMoveOpen = moveMenuFor === varKey;
    // Target clusters: all except the currently expanded one
    const moveTargets = allClusters.filter(c => c.key !== expandedSection);

    return (
      <div className={`h-9 px-3 py-2 flex items-center gap-2 ${isMandatory ? '' : 'hover:bg-gray-50'} group relative`}>
        <button
          onClick={onClick}
          disabled={isMandatory}
          className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${isMandatory ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          style={{
            backgroundColor: isChecked ? '#016699' : 'transparent',
            border: isChecked ? 'none' : '1px solid #dee2e6',
          }}
        >
          {isChecked && (
            <svg className="w-full h-full" fill="none" viewBox="0 0 11.3333 8">
              <path clipRule="evenodd" d={visibleColumnsSvgPaths.p30901900} fill="white" fillRule="evenodd" />
            </svg>
          )}
        </button>
        <span className={`text-xs flex-1 truncate ${isMandatory ? 'text-[#6c757d]' : 'text-[#495057]'}`} style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {label}{isMandatory && ' (Required)'}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {onDelete && (
            <button
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-opacity"
              title="Delete column"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </button>
          )}
          {canMove && (
            <div className="relative">
              <button
                onClick={e => { e.stopPropagation(); setMoveMenuFor(isMoveOpen ? null : varKey!); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-50 rounded transition-opacity"
                title="Move to cluster"
              >
                <ArrowUpRight className="w-3.5 h-3.5" style={{ color: '#016699' }} />
              </button>
              {isMoveOpen && (
                <div
                  className="absolute right-0 top-7 z-[200] bg-white border border-[#dee2e6] rounded-lg shadow-lg py-1 min-w-[160px]"
                  onClick={e => e.stopPropagation()}
                >
                  <p className="text-[10px] text-[#adb5bd] px-3 pt-1 pb-1.5 font-semibold uppercase" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                    Move to cluster
                  </p>
                  {moveTargets.map(c => (
                    <button
                      key={c.key}
                      onClick={() => moveVariable(varKey!, c.key)}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 text-[#495057]"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSectionButton = (section: string, label: string, isUserCluster = false) => {
    const isExpanded = expandedSection === section;
    return (
      <div className={`flex items-center gap-1 rounded hover:bg-gray-50 group/section ${isExpanded ? 'bg-gray-50' : ''}`}>
        <button
          onClick={() => toggleSection(section)}
          className="flex-1 flex items-center justify-between h-9 px-2 py-2 min-w-0"
        >
          <span className="text-xs font-normal text-[#495057] uppercase truncate" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            {label}
          </span>
          <svg className="w-3.5 h-3.5 flex-shrink-0 ml-1" fill="none" viewBox="0 0 6.5 11.5">
            <path
              d={isExpanded ? visibleColumnsSvgPaths.p27040a80 : visibleColumnsSvgPaths.p35ac1680}
              stroke="#58595B"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
        {isUserCluster && (
          <button
            onClick={e => { e.stopPropagation(); deleteUserCluster(section); }}
            className="opacity-0 group-hover/section:opacity-100 p-1 hover:bg-red-50 rounded mr-1 flex-shrink-0 transition-opacity"
            title="Delete cluster"
          >
            <X className="w-3 h-3 text-red-400" />
          </button>
        )}
      </div>
    );
  };

  // Renders "Select All / Clear All" row at top of each cluster's right panel
  const renderSelectAllRow = (section: string) => {
    const isAllSelected = isClusterAllSelected(section);
    return (
      <div className="flex items-center justify-end px-3 py-1.5 border-b border-[#f0f0f0]">
        <button
          onClick={() => toggleSelectAllCluster(section)}
          className="text-[11px] font-semibold hover:underline"
          style={{ color: '#016699', fontFamily: 'Open Sans, sans-serif' }}
        >
          {isAllSelected ? 'Clear All' : 'Select All'}
        </button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent hideCloseButton className="max-w-[723px] p-0 gap-0 bg-white rounded-lg flex flex-col" style={{ fontFamily: 'Open Sans, sans-serif', maxHeight: '80vh' }} aria-describedby={undefined}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#dee2e6] flex-shrink-0">
          <DialogTitle className="text-[16px] font-bold text-[#58595b]" style={{ fontFamily: 'Avenir, sans-serif' }}>
            Data Visibility
          </DialogTitle>
          <button
            onClick={handleCancel}
            className="w-5 h-5 flex items-center justify-center cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 11.5 11.5">
              <path
                d={visibleColumnsSvgPaths.p14b78080}
                stroke="#58595B"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>

        {/* Body: Two-panel layout — grows to fill, scrolls independently per panel */}
        <div className="flex gap-4 p-4 min-h-0 flex-1">
          {/* Left Panel: Sections */}
          <div className="flex flex-col gap-1 w-[253px] min-h-0">
            {/* Search Input */}
            <div className="bg-white rounded-2xl border border-[#dee2e6] mb-1">
              <div className="flex items-center px-3 py-2 gap-2">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 text-xs text-[#495057] outline-none bg-transparent placeholder:text-[#adb5bd]"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                />
                <svg className="w-4 h-4" fill="none" viewBox="0 0 13.5 13.5">
                  <path 
                    d={visibleColumnsSvgPaths.p216c8100} 
                    stroke="#495057" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.5" 
                  />
                </svg>
              </div>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-0.5 overflow-y-auto flex-1 min-h-0">
              {renderSectionButton('basic', 'Basic Information')}
              {renderSectionButton('capability', sectionLabel('capability', 'Capability'))}
              {renderSectionButton('commitment', sectionLabel('commitment', 'Commitment'))}
              {renderSectionButton('contribution', sectionLabel('contribution', 'Contribution'))}
              {renderSectionButton('leadershipStyle', sectionLabel('leadershipStyle', 'Leadership Style'))}
              {customColumns.filter(col => col.cluster === 'custom' || !col.cluster).length > 0 &&
                renderSectionButton('custom', 'Others')}

              {/* Divider before user clusters */}
              {userClusters.length > 0 && <div className="my-1 border-t border-[#f0f0f0]" />}

              {/* User-created clusters */}
              {userClusters.map(uc => renderSectionButton(uc.key, uc.label, true))}

              {/* New cluster input / button */}
              <div className="mt-1">
                {showNewClusterInput ? (
                  <div className="flex items-center gap-1 px-2 py-1">
                    <input
                      ref={newClusterInputRef}
                      autoFocus
                      value={newClusterLabel}
                      onChange={e => setNewClusterLabel(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') createUserCluster();
                        if (e.key === 'Escape') { setShowNewClusterInput(false); setNewClusterLabel(''); }
                      }}
                      placeholder="Cluster name..."
                      className="flex-1 text-xs border border-[#016699] rounded px-2 py-1 outline-none"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    />
                    <button
                      onClick={createUserCluster}
                      disabled={!newClusterLabel.trim()}
                      className="p-1 rounded hover:bg-blue-50 disabled:opacity-40"
                      title="Create"
                    >
                      <Plus className="w-3.5 h-3.5" style={{ color: '#016699' }} />
                    </button>
                    <button
                      onClick={() => { setShowNewClusterInput(false); setNewClusterLabel(''); }}
                      className="p-1 rounded hover:bg-gray-100"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewClusterInput(true)}
                    className="flex items-center gap-1.5 px-2 py-1.5 text-xs hover:bg-gray-50 rounded w-full"
                    style={{ color: '#016699', fontFamily: 'Open Sans, sans-serif' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Cluster
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-px bg-[#dee2e6] self-stretch flex-shrink-0" />

          {/* Right Panel: Checkboxes — scrollable */}
          <div
            className="flex-1 bg-white rounded overflow-y-auto min-h-0"
            onClick={() => moveMenuFor && setMoveMenuFor(null)}
          >
            {expandedSection && (() => {
              const isBasic = expandedSection === 'basic';
              // All cols in this cluster (respects overrides)
              const allColDefs = [...columnDefinitions, ...customColumns];
              const clusterColKeys = new Set(getClusterColumns(expandedSection));
              const colsInCluster = allColDefs.filter(col => clusterColKeys.has(String(col.key)));
              const filtered = getFilteredColumns(colsInCluster);
              const MANDATORY = new Set(['name', 'competencyScore', 'commitmentScore', 'contributionScore']);

              return (
                <div className="flex flex-col">
                  {renderSelectAllRow(expandedSection)}
                  {filtered.length === 0 && (
                    <div className="px-3 py-6 text-center text-xs text-[#adb5bd]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                      No variables in this cluster.<br />Move variables here using the ↗ icon.
                    </div>
                  )}
                  {filtered.map(col => {
                    const k = String(col.key);
                    const isMandatory = MANDATORY.has(k);
                    const isCustomCol = customColumns.some(c => String(c.key) === k);
                    return (
                      <div key={k}>
                        {renderCheckbox(
                          tempVisibleColumns.has(k),
                          () => toggleTempColumn(k),
                          col.label,
                          isCustomCol ? () => onDeleteCustomColumn(k) : undefined,
                          isMandatory,
                          isBasic ? undefined : k, // varKey — only non-basic can be moved
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Footer: Buttons */}
        <div className="border-t border-[#dee2e6] p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Left Side: Add Data */}
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-50"
                onClick={() => {
                  handleCancel();
                  setTimeout(() => onAddColumn(), 150);
                }}
                title="Add Data"
              >
                <Plus className="w-4 h-4" style={{ color: '#016699' }} />
                <span className="text-sm font-bold text-[#016699]" style={{ fontFamily: 'Avenir, sans-serif' }}>
                  Add Data
                </span>
              </button>
            </div>

            {/* Cancel and Apply Buttons - Right Side */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-3 py-2 rounded-full border border-[#016699] text-[#016699] text-sm font-bold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-3 py-2 rounded-full bg-[#016699] text-white text-sm font-bold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}