"use client";
import { useState, useRef, useEffect } from "react";
import { X, RotateCcw, Play, ArrowLeftRight, Trash2, ChevronDown, Search, Plus } from "lucide-react";
import type { Employee } from "../data/orgChartData";

export interface SimulationSwap {
  aId: string; // current holder of target position
  bId: string; // candidate being moved in
}

interface SimulationPanelProps {
  swaps: SimulationSwap[];
  employees: Employee[];
  simulatedEmployees: Employee[];
  onRemoveSwap: (index: number) => void;
  onAddSwap: (swap: SimulationSwap) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
  initialTargetId?: string | null;
}

function calcMetrics(employees: Employee[]) {
  const risk = employees.filter(e => {
    const reports = employees.filter(r => r.managerId === e.id);
    if (reports.length === 0) return false;
    return reports.filter(r => (r.readinessScore ?? 0) >= 81).length === 0;
  }).length;
  const develop = employees.filter(e => e.competencyScore < 76).length;
  const withReadiness = employees.filter(e => e.readinessScore != null);
  const avgReadiness = withReadiness.length > 0
    ? Math.round(withReadiness.reduce((s, e) => s + (e.readinessScore ?? 0), 0) / withReadiness.length)
    : 0;
  return { risk, develop, avgReadiness };
}

function Delta({ before, after, lowerIsBetter = true }: { before: number; after: number; lowerIsBetter?: boolean }) {
  const diff = after - before;
  if (diff === 0) return <span style={{ color: '#adb5bd', fontSize: 10 }}>—</span>;
  const improved = lowerIsBetter ? diff < 0 : diff > 0;
  return (
    <span style={{ color: improved ? '#28a745' : '#dc3545', fontSize: 10, fontWeight: 700 }}>
      {diff > 0 ? '+' : ''}{diff}
    </span>
  );
}

function buildLevelMap(employees: Employee[]): Map<string, number> {
  const map = new Map<string, number>();
  const roots = employees.filter(e => !e.managerId);
  const queue: Array<{ id: string; level: number }> = roots.map(e => ({ id: e.id, level: 0 }));
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    map.set(id, level);
    employees.filter(e => e.managerId === id).forEach(child => queue.push({ id: child.id, level: level + 1 }));
  }
  return map;
}

function calcFit(emp: Employee): number {
  // Use same formula as card readiness tag (getPromotionReadinessPercentage)
  if (emp.readinessScore != null) return emp.readinessScore;
  const s = emp.competencyScore;
  if (s >= 91) return Math.round(s * 0.92);
  if (s >= 76) return Math.round(s * 0.88);
  if (s >= 66) return Math.round(s * 0.80);
  return Math.round(s * 0.72);
}

function positionTags(emp: Employee, allEmployees: Employee[]): { critical?: boolean; vacant?: boolean; risk?: boolean } {
  const vacant = emp.name === '(Vacant)';
  const critical = !!emp.criticalPosition;
  // Risk = holder is a manager but has no ready successors (readinessScore >= 81)
  const directReports = allEmployees.filter(e => e.managerId === emp.id);
  const hasReadySuccessors = directReports.some(r => (r.readinessScore ?? 0) >= 81);
  const risk = directReports.length > 0 && !hasReadySuccessors;
  return { critical, vacant, risk };
}

function TagBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ fontSize: 8, background: bg, color, borderRadius: 4, padding: '1px 5px', fontWeight: 700, flexShrink: 0 }}>
      {label}
    </span>
  );
}

// Reusable searchable dropdown
function SearchDropdown<T>({
  value,
  placeholder,
  onSelect,
  renderTrigger,
  renderItem,
  items,
  filterFn,
  keyFn,
  isSelectableFn,
}: {
  value: T | null;
  placeholder: string;
  onSelect: (item: T) => void;
  renderTrigger: (item: T | null) => React.ReactNode;
  renderItem: (item: T) => React.ReactNode;
  items: T[];
  filterFn: (item: T, q: string) => boolean;
  keyFn: (item: T) => string;
  isSelectableFn?: (item: T) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = search.trim() ? items.filter(i => filterFn(i, search)) : items;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(v => !v); setSearch(''); }}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#fff', border: '1.5px solid #dee2e6', borderRadius: 9999, padding: '0 14px', height: 30,
          cursor: 'pointer', fontFamily: "'Open Sans', sans-serif", textAlign: 'left', gap: 6,
        }}
      >
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>{renderTrigger(value)}</div>
        <ChevronDown size={13} style={{ flexShrink: 0, color: '#adb5bd' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 300,
          background: '#fff', border: '1px solid #dee2e6', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.13)', overflow: 'hidden',
        }}>
          <div style={{ padding: '7px 8px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ position: 'relative' }}>
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari..."
                style={{
                  width: '100%', boxSizing: 'border-box', border: '1px solid #dee2e6', borderRadius: 20,
                  height: 26, padding: '0 26px 0 9px', fontSize: 10,
                  fontFamily: "'Open Sans', sans-serif", outline: 'none',
                }}
              />
              <Search size={11} style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            </div>
          </div>
          <div style={{ maxHeight: 260, overflowY: 'auto' }}>
            {filtered.map(item => (
              <div
                key={keyFn(item)}
                onMouseDown={() => {
                  if (isSelectableFn && !isSelectableFn(item)) return;
                  onSelect(item); setOpen(false); setSearch('');
                }}
                style={{ borderBottom: '1px solid #f8f9fa', cursor: (isSelectableFn && !isSelectableFn(item)) ? 'default' : 'pointer' }}
                onMouseEnter={ev => { if (!isSelectableFn || isSelectableFn(item)) ev.currentTarget.style.background = '#f8f9fa'; }}
                onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}
              >
                {renderItem(item)}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '12px', textAlign: 'center', color: '#adb5bd', fontSize: 10 }}>Tidak ditemukan</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SimulationPanel({
  swaps, employees, simulatedEmployees,
  onRemoveSwap, onAddSwap, onApply, onReset, onClose, initialTargetId,
}: SimulationPanelProps) {
  const [targetEmployee, setTargetEmployee] = useState<Employee | null>(() =>
    initialTargetId ? (employees.find(e => e.id === initialTargetId) ?? null) : null
  );
  const [candidateEmployee, setCandidateEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (initialTargetId && employees.length > 0 && !targetEmployee) {
      const match = employees.find(e => e.id === initialTargetId);
      if (match) setTargetEmployee(match);
    }
  }, [initialTargetId, employees]);

  const before = calcMetrics(employees);
  const after = calcMetrics(simulatedEmployees);
  const affectedIds = new Set(swaps.flatMap(s => [s.aId, s.bId]));

  const getEmployee = (id: string) => employees.find(e => e.id === id);

  type CandidateItem = (Employee & { fit: number; _type: 'candidate' }) | { _type: 'header'; _label: string; id: string };

  const levelMap = buildLevelMap(employees);
  const targetLevel = targetEmployee ? (levelMap.get(targetEmployee.id) ?? 0) : 0;

  const scoredCandidates = employees
    .map(e => ({ ...e, fit: calcFit(e) }))
    .sort((a, b) => b.fit - a.fit);

  // Build grouped candidate items with section headers
  const directReportIds = new Set(employees.filter(e => e.managerId === targetEmployee?.id).map(e => e.id));
  const successorIds = new Set([
    ...Array.from(directReportIds),
    ...(targetEmployee?.successorIds ?? []),
    ...(targetEmployee?.additionalSuccessors ?? []),
  ]);
  // Only show candidates at same level or below target position
  const candidatePool = scoredCandidates.filter(e =>
    e.id !== targetEmployee?.id && (levelMap.get(e.id) ?? 0) >= targetLevel
  );
  const successorCands = candidatePool.filter(e => successorIds.has(e.id));
  const otherCands = candidatePool.filter(e => !successorIds.has(e.id));

  // Group non-successor candidates by their org level
  const levelGroups = new Map<number, typeof otherCands>();
  otherCands.forEach(e => {
    const lvl = levelMap.get(e.id) ?? 0;
    if (!levelGroups.has(lvl)) levelGroups.set(lvl, []);
    levelGroups.get(lvl)!.push(e);
  });
  const sortedLevels = Array.from(levelGroups.keys()).sort((a, b) => a - b);

  const levelLabel = (lvl: number) =>
    lvl === targetLevel ? 'Same Level' : `L${lvl + 1}`;

  const candidateItems: CandidateItem[] = [
    ...(successorCands.length > 0 ? [
      { _type: 'header' as const, _label: 'Successors', id: '_h_succ' },
      ...successorCands.map(e => ({ ...e, _type: 'candidate' as const })),
    ] : []),
    ...sortedLevels.flatMap(lvl => [
      { _type: 'header' as const, _label: levelLabel(lvl), id: `_h_lvl_${lvl}` },
      ...levelGroups.get(lvl)!.map(e => ({ ...e, _type: 'candidate' as const })),
    ]),
  ];

  const canAdd = targetEmployee && candidateEmployee && targetEmployee.id !== candidateEmployee.id;

  const handleAdd = () => {
    if (!canAdd) return;
    onAddSwap({ aId: targetEmployee!.id, bId: candidateEmployee!.id });
    setCandidateEmployee(null);
  };

  return (
    <div
      data-no-drag
      style={{
        position: 'fixed', top: 90, right: 0, bottom: 0, width: 300,
        background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.10)',
        display: 'flex', flexDirection: 'column', zIndex: 50,
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #e9ecef', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ fontWeight: 700, fontSize: 13, color: '#333' }}>Simulation Mode</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#adb5bd', padding: 4 }}>
            <X size={16} />
          </button>
        </div>
        <p style={{ fontSize: 10, color: '#6c757d', margin: 0 }}>
          Pilih posisi target dan kandidat untuk simulasi.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Add Simulation Form */}
        <div style={{ background: '#f8f9fa', borderRadius: 10, padding: 12, border: '1px solid #e9ecef' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#333', marginBottom: 10 }}>Tambah Simulasi</div>

          {/* Position Target Dropdown */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: '#6c757d', fontWeight: 600, marginBottom: 4 }}>Posisi Target</div>
            <SearchDropdown<Employee>
              value={targetEmployee}
              placeholder="Pilih posisi..."
              onSelect={emp => { setTargetEmployee(emp); setCandidateEmployee(null); }}
              keyFn={emp => emp.id}
              filterFn={(emp, q) =>
                emp.position.toLowerCase().includes(q.toLowerCase()) ||
                emp.name.toLowerCase().includes(q.toLowerCase())
              }
              items={employees}
              renderTrigger={_emp => (
                <span style={{ fontSize: 11, color: '#adb5bd' }}>Pilih posisi target...</span>
              )}
              renderItem={emp => {
                const tags = positionTags(emp, employees);
                return (
                  <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#495057', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {emp.position}
                      </div>
                      <div style={{ fontSize: 9, color: '#adb5bd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {emp.name}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                      {tags.critical && <TagBadge label="Critical" color="#dc3545" bg="rgba(220,53,69,0.1)" />}
                      {tags.vacant && <TagBadge label="Vacant" color="#6c757d" bg="rgba(108,117,125,0.12)" />}
                      {tags.risk && <TagBadge label="Risk" color="#f59e0b" bg="rgba(245,158,11,0.12)" />}
                    </div>
                  </div>
                );
              }}
            />
          </div>

          {/* Current holder info */}
          {targetEmployee && (
            <div style={{
              marginBottom: 8, background: 'rgba(1,102,153,0.05)', borderRadius: 8,
              padding: '6px 10px', border: '1px solid rgba(1,102,153,0.12)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#016699', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {targetEmployee.name}
                </div>
                <div style={{ fontSize: 9, color: '#6c757d' }}>Pemegang posisi saat ini</div>
              </div>
              <span style={{ fontSize: 9, background: '#016699', color: 'white', borderRadius: 20, padding: '2px 8px', fontWeight: 700, flexShrink: 0 }}>Saat ini</span>
            </div>
          )}

          {/* Candidate Dropdown */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: '#6c757d', fontWeight: 600, marginBottom: 4 }}>Kandidat</div>
            <SearchDropdown<CandidateItem>
              value={null}
              placeholder="Pilih kandidat..."
              onSelect={item => { if (item._type === 'candidate') setCandidateEmployee(item as Employee & { fit: number }); }}
              keyFn={item => item.id}
              filterFn={(item, q) => {
                if (item._type === 'header') return true;
                const c = item as Employee & { fit: number };
                return c.name.toLowerCase().includes(q.toLowerCase()) || c.position.toLowerCase().includes(q.toLowerCase());
              }}
              isSelectableFn={item => item._type === 'candidate'}
              items={candidateItems}
              renderTrigger={_item => (
                <span style={{ fontSize: 11, color: '#adb5bd' }}>Pilih kandidat...</span>
              )}
              renderItem={item => {
                if (item._type === 'header') {
                  return (
                    <div style={{ padding: '5px 10px 3px', fontSize: 9, fontWeight: 700, color: '#adb5bd', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8f9fa' }}>
                      {(item as { _type: 'header'; _label: string; id: string })._label}
                    </div>
                  );
                }
                const emp = item as Employee & { fit: number; _type: 'candidate' };
                const barColor = emp.fit >= 80 ? '#016699' : emp.fit >= 60 ? '#fd9f28' : '#adb5bd';
                return (
                  <div style={{ padding: '8px 10px', display: 'grid', gridTemplateColumns: '1fr 80px', gap: 8, alignItems: 'center' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#495057', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.name}</div>
                      <div style={{ fontSize: 9, color: '#adb5bd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.position}</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 9, color: '#adb5bd' }}>Fit</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: barColor }}>{emp.fit}%</span>
                      </div>
                      <div style={{ height: 3, background: '#e9ecef', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${emp.fit}%`, background: barColor, borderRadius: 2 }} />
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </div>

          {/* Preview */}
          {targetEmployee && candidateEmployee && (
            <div style={{ marginBottom: 8, background: 'white', borderRadius: 8, padding: '8px 10px', border: '1px solid #dee2e6', fontSize: 10 }}>
              <div style={{ fontWeight: 700, color: '#016699', marginBottom: 4, fontSize: 10 }}>Preview Simulasi:</div>
              <div style={{ color: '#495057', fontSize: 10 }}>
                <span style={{ fontWeight: 700 }}>{candidateEmployee.name.split(' ')[0]}</span> → <span style={{ color: '#5f3dc4', fontWeight: 600 }}>{targetEmployee.position}</span>
              </div>
              <div style={{ color: '#6c757d', fontSize: 9, marginTop: 2 }}>
                {targetEmployee.name.split(' ')[0]} pindah ke {candidateEmployee.position}
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={!canAdd}
            style={{
              width: '100%', padding: '7px 0', borderRadius: 20, border: 'none',
              background: canAdd ? '#016699' : '#dee2e6',
              color: canAdd ? 'white' : '#adb5bd',
              fontSize: 11, fontWeight: 700, cursor: canAdd ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}
          >
            <Plus size={12} /> Tambah Simulasi
          </button>
        </div>

        {/* Planned Simulations */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#495057', marginBottom: 8 }}>
            Simulasi Terpilih ({swaps.length})
          </div>
          {swaps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '14px 0', color: '#adb5bd', fontSize: 10 }}>
              Belum ada simulasi.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {swaps.map((swap, i) => {
                const a = getEmployee(swap.aId);
                const b = getEmployee(swap.bId);
                const fitB = b ? calcFit(b) : 0;
                const barColor = fitB >= 80 ? '#016699' : fitB >= 60 ? '#fd9f28' : '#adb5bd';
                return (
                  <div key={i} style={{
                    background: '#f8f9fa', borderRadius: 8, padding: '8px 10px',
                    display: 'flex', alignItems: 'flex-start', gap: 6, border: '1px solid #e9ecef',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#333', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {a?.position}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                        <span style={{ fontSize: 9, color: '#adb5bd', textDecoration: 'line-through' }}>{a?.name?.split(' ')[0]}</span>
                        <ArrowLeftRight size={9} style={{ color: '#adb5bd', flexShrink: 0 }} />
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#016699' }}>{b?.name?.split(' ')[0]}</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                          <span style={{ fontSize: 9, color: '#adb5bd' }}>Fit kandidat</span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: barColor }}>{fitB}%</span>
                        </div>
                        <div style={{ height: 3, background: '#e9ecef', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${fitB}%`, background: barColor, borderRadius: 2 }} />
                        </div>
                      </div>
                    </div>
                    <button onClick={() => onRemoveSwap(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', padding: 4, flexShrink: 0 }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Impact Preview */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#495057', marginBottom: 8 }}>Impact Preview</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Succession Risk', before: before.risk, after: after.risk, color: '#dc3545', fmt: (v: number) => `${v}`, lower: true },
              { label: 'Need Development', before: before.develop, after: after.develop, color: '#f59e0b', fmt: (v: number) => `${v}`, lower: true },
              { label: 'Avg. Readiness', before: before.avgReadiness, after: after.avgReadiness, color: '#6c757d', fmt: (v: number) => `${v}%`, lower: false },
              { label: 'Posisi Terdampak', before: affectedIds.size, after: affectedIds.size, color: '#016699', fmt: (v: number) => `${v}`, lower: false },
            ].map(item => (
              <div key={item.label} style={{ background: '#f8f9fa', borderRadius: 8, padding: '10px 12px', border: '1px solid #e9ecef' }}>
                <div style={{ fontSize: 9, color: '#6c757d', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                {item.label === 'Posisi Terdampak' ? (
                  <>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#016699' }}>{affectedIds.size}</div>
                    <div style={{ fontSize: 9, color: '#6c757d' }}>dari {employees.length} posisi</div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{item.fmt(item.before)}</span>
                      <span style={{ color: '#adb5bd', fontSize: 10 }}>→</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: item.after !== item.before ? (item.lower ? item.after < item.before ? '#28a745' : '#dc3545' : item.after > item.before ? '#28a745' : '#dc3545') : '#333' }}>
                        {item.fmt(item.after)}
                      </span>
                    </div>
                    <Delta before={item.before} after={item.after} lowerIsBetter={item.lower} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid #e9ecef', display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={onReset}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 20, border: '1.5px solid #dc3545',
            background: 'white', color: '#dc3545', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}
        >
          <RotateCcw size={12} /> Reset
        </button>
        <button
          onClick={onApply}
          disabled={swaps.length === 0}
          style={{
            flex: 2, padding: '8px 0', borderRadius: 20, border: 'none',
            background: swaps.length === 0 ? '#dee2e6' : '#016699',
            color: swaps.length === 0 ? '#adb5bd' : 'white',
            fontSize: 11, fontWeight: 700, cursor: swaps.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}
        >
          <Play size={12} /> Apply to Canvas
        </button>
      </div>
    </div>
  );
}
