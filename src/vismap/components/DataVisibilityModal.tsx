import { useState, useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogPortal, DialogOverlay, DialogTitle } from './ui/dialog';
import svgPaths from '../imports/svg-datavisibility';

type VisibilityColumnKey =
  | 'gender' | 'city' | 'maritalStatus'
  | 'performance' | 'iq'
  | 'capability' | 'commitment' | 'contribution';

type VisibleColumnsState = Record<VisibilityColumnKey, boolean>;

const ALL_COLUMNS: { key: VisibilityColumnKey; label: string; section: string }[] = [
  { key: 'gender',        label: 'Gender',            section: 'basic' },
  { key: 'city',          label: 'City',              section: 'basic' },
  { key: 'maritalStatus', label: 'Marital Status',    section: 'basic' },
  { key: 'performance',   label: 'Performance Score', section: 'performance' },
  { key: 'iq',            label: 'IQ Score',          section: 'performance' },
  { key: 'capability',    label: 'Capability',         section: 'cluster' },
  { key: 'commitment',    label: 'Commitment',         section: 'cluster' },
  { key: 'contribution',  label: 'Contribution',       section: 'cluster' },
];

const SECTIONS = [
  { id: 'basic',       label: 'Basic Information' },
  { id: 'performance', label: 'Performance & Score' },
  { id: 'cluster',     label: 'Cluster Scores' },
];

const REQUIRED_COLUMNS = [
  'Nama Employee',
  'Posisi',
  'Department / Job Title',
  'Competency Score',
  'Successor Ready',
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibleColumns: VisibleColumnsState;
  onApply: (columns: VisibleColumnsState) => void;
}

export default function DataVisibilityModal({ open, onOpenChange, visibleColumns, onApply }: Props) {
  const [temp, setTemp] = useState<VisibleColumnsState>({ ...visibleColumns });
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open) {
      setTemp({ ...visibleColumns });
      setExpandedSection('basic');
      setSearchQuery('');
    }
  }, [open]);

  const selectedCount = Object.values(temp).filter(Boolean).length;

  const toggleColumn = (key: VisibilityColumnKey) => {
    setTemp(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(prev => (prev === sectionId ? null : sectionId));
  };

  const getSectionColumns = (sectionId: string) =>
    ALL_COLUMNS.filter(c => c.section === sectionId);

  const isSectionAllSelected = (sectionId: string): boolean => {
    const cols = getSectionColumns(sectionId);
    return cols.length > 0 && cols.every(c => temp[c.key]);
  };

  const handleToggleSelectAll = (sectionId: string) => {
    const cols = getSectionColumns(sectionId);
    if (isSectionAllSelected(sectionId)) {
      setTemp(prev => {
        const next = { ...prev };
        cols.forEach(c => { next[c.key] = false; });
        return next;
      });
    } else {
      setTemp(prev => {
        const next = { ...prev };
        let cnt = Object.values(next).filter(Boolean).length;
        cols.forEach(c => {
          if (!next[c.key] && cnt < 5) { next[c.key] = true; cnt++; }
        });
        return next;
      });
    }
  };

  const searchResults = searchQuery.trim()
    ? ALL_COLUMNS.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  const renderCheckboxItem = (key: VisibilityColumnKey, label: string) => {
    const isChecked = temp[key];
    const isDisabled = !isChecked && selectedCount >= 5;
    return (
      <div
        key={key}
        className={`h-9 px-3 py-2 flex items-center gap-2 hover:bg-gray-50 ${isDisabled ? 'opacity-40' : ''}`}
      >
        <button
          onClick={() => !isDisabled && toggleColumn(key)}
          disabled={isDisabled}
          className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          style={{
            backgroundColor: isChecked ? '#016699' : 'transparent',
            border: isChecked ? 'none' : '1px solid #dee2e6',
          }}
        >
          {isChecked && (
            <svg className="w-full h-full" fill="none" viewBox="0 0 11.3333 8">
              <path clipRule="evenodd" d={svgPaths.checkmark} fill="white" fillRule="evenodd" />
            </svg>
          )}
        </button>
        <span
          className={`text-xs flex-1 truncate ${isChecked ? 'text-[#016699]' : 'text-[#495057]'}`}
          style={{ fontFamily: 'Open Sans, sans-serif' }}
        >
          {label}
        </span>
      </div>
    );
  };

  const renderRequiredRow = () => (
    <>
      {REQUIRED_COLUMNS.map(label => (
        <div key={label} className="h-9 px-3 py-2 flex items-center gap-2">
          <div
            className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 cursor-not-allowed"
            style={{ backgroundColor: '#016699', opacity: 0.5 }}
          >
            <svg className="w-full h-full" fill="none" viewBox="0 0 11.3333 8">
              <path clipRule="evenodd" d={svgPaths.checkmark} fill="white" fillRule="evenodd" />
            </svg>
          </div>
          <span
            className="text-xs flex-1 truncate text-[#6c757d]"
            style={{ fontFamily: 'Open Sans, sans-serif', opacity: 0.5 }}
          >
            {label} <span className="text-[10px]">(Required)</span>
          </span>
        </div>
      ))}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className="bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[250] translate-x-[-50%] translate-y-[-50%] w-full max-w-[calc(100%-2rem)] rounded-lg shadow-lg duration-200 flex flex-col overflow-hidden"
          style={{ maxWidth: 723, maxHeight: '80vh', fontFamily: 'Open Sans, sans-serif' }}
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#dee2e6] flex-shrink-0">
            <DialogTitle
              className="text-[16px] font-bold text-[#58595b]"
              style={{ fontFamily: 'Avenir, sans-serif' }}
            >
              Data Visibility
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="w-5 h-5 flex items-center justify-center cursor-pointer"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 11.5 11.5">
                <path
                  d={svgPaths.close}
                  stroke="#58595B"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex gap-4 p-4 min-h-0 flex-1 overflow-hidden">

            {/* Left Panel */}
            <div className="flex flex-col gap-1 w-[253px] min-h-0 flex-shrink-0">

              {/* Search â€” rounded-2xl, not rounded-full */}
              <div className="bg-white rounded-2xl border border-[#dee2e6] mb-1">
                <div className="flex items-center px-3 py-2 gap-2">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 text-xs text-[#495057] outline-none bg-transparent placeholder:text-[#adb5bd]"
                    style={{ fontFamily: 'Open Sans, sans-serif' }}
                  />
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 13.5 13.5">
                    <path
                      d={svgPaths.search}
                      stroke="#495057"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>

              {/* Section accordion list */}
              <div className="flex flex-col gap-0.5 overflow-y-auto flex-1 min-h-0">
                {SECTIONS.map(sec => {
                  const isExpanded = !searchQuery && expandedSection === sec.id;
                  return (
                    <div
                      key={sec.id}
                      className={`flex items-center gap-1 rounded hover:bg-gray-50 ${isExpanded ? 'bg-gray-50' : ''}`}
                    >
                      <button
                        onClick={() => { setSearchQuery(''); toggleSection(sec.id); }}
                        className="flex-1 flex items-center justify-between h-9 px-2 py-2 min-w-0"
                      >
                        <span
                          className="text-xs font-normal text-[#495057] uppercase truncate"
                          style={{ fontFamily: 'Open Sans, sans-serif' }}
                        >
                          {sec.label}
                        </span>
                        <svg className="w-3.5 h-3.5 flex-shrink-0 ml-1" fill="none" viewBox="0 0 6.5 11.5">
                          <path
                            d={isExpanded ? svgPaths.chevronLeft : svgPaths.chevronRight}
                            stroke="#58595B"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vertical divider */}
            <div className="w-px bg-[#dee2e6] self-stretch flex-shrink-0" />

            {/* Right Panel */}
            <div className="flex-1 bg-white rounded overflow-y-auto min-h-0">
              {searchResults !== null ? (
                <div className="flex flex-col">
                  <div className="flex items-center justify-end px-3 py-1.5 border-b border-[#f0f0f0]">
                    <span
                      className="text-[11px] text-[#adb5bd]"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      Search results
                    </span>
                  </div>
                  {renderRequiredRow()}
                  {searchResults.length === 0 ? (
                    <div
                      className="px-3 py-6 text-center text-xs text-[#adb5bd]"
                      style={{ fontFamily: 'Open Sans, sans-serif' }}
                    >
                      No results for &ldquo;{searchQuery}&rdquo;
                    </div>
                  ) : (
                    searchResults.map(col => renderCheckboxItem(col.key, col.label))
                  )}
                </div>
              ) : expandedSection ? (
                <div className="flex flex-col">
                  {/* Select All / Clear All */}
                  <div className="flex items-center justify-end px-3 py-1.5 border-b border-[#f0f0f0]">
                    <button
                      onClick={() => handleToggleSelectAll(expandedSection)}
                      className="text-[11px] font-semibold hover:underline"
                      style={{ color: '#016699', fontFamily: 'Open Sans, sans-serif' }}
                    >
                      {isSectionAllSelected(expandedSection) ? 'Clear All' : 'Select All'}
                    </button>
                  </div>
                  {renderRequiredRow()}
                  {getSectionColumns(expandedSection).map(col =>
                    renderCheckboxItem(col.key, col.label)
                  )}
                </div>
              ) : (
                <div
                  className="flex items-center justify-center h-full text-xs text-[#adb5bd]"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  Select a category from the left panel.
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#dee2e6] p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span
                className={`text-[12px] ${selectedCount >= 5 ? 'text-[#FD9F28] font-semibold' : 'text-[#adb5bd]'}`}
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {selectedCount}/5 variabel dipilih
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenChange(false)}
                  className="px-3 py-2 rounded-full border border-[#016699] text-[#016699] text-sm font-bold"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { onApply(temp); onOpenChange(false); }}
                  className="px-3 py-2 rounded-full bg-[#016699] text-white text-sm font-bold"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

