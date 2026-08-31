"use client";
// Panel Simulation V3 — SALINAN-BARU, bukan `SimulationPanel` yang dipakai V1
// (aturan copy-on-demand, docs/vismap-v3.md §3). Konsepnya berbeda, bukan cuma
// gayanya:
//
//   V1  : satu daftar swap datar + satu blok metrik before/after (risk,
//         need-develop, avg readiness) untuk SELURUH struktur.
//   V3  : daftar LANGKAH bernomor. Tiap langkah punya verdict sendiri
//         (Good / At Risk) dan daftar Consequences sendiri dalam kalimat —
//         "posisi X semakin berisiko karena successornya berkurang" — jadi
//         dampaknya terbaca per keputusan, bukan sebagai selisih tiga angka
//         yang tidak menyebut sebabnya.
//
// Verdict dan Consequences tidak dihitung di sini: semuanya datang dari
// `buildSimulation` (src/vismap/v3/simulation.ts) supaya bisa diuji tanpa UI.
import { useMemo, useState } from 'react';
import {
  ChevronDown, ChevronUp, CircleStop, FlaskConical, GitCompareArrows,
  Plus, Sparkles, Trash2, UserRoundX,
} from 'lucide-react';
import type { Employee } from '../../data/orgChartData';
import { isVacantName, type SimulationActionKind, type SimulationStep, type StepView } from '../simulation';

interface SimulationPanelV3Props {
  /** Keadaan TERKINI (hasil semua langkah) — sumber pilihan target & kandidat. */
  simulatedEmployees: Employee[];
  views: StepView[];
  onAddStep: (step: Omit<SimulationStep, 'id'>) => void;
  onRemoveStep: (stepId: string) => void;
  onSetAsPlan: (view: StepView) => void;
  onStop: () => void;
  /**
   * Datang dari menu aksi sebuah card (Simulation → Exchange / Cut & Replace)
   * atau deep-link `?simulate=true&targetPosition=`. Panel langsung membuka
   * form langkah dengan posisi itu sebagai target, jadi aksi di kanvas tidak
   * berhenti di "panel terbuka, silakan cari sendiri posisinya".
   */
  initialTargetSeatId?: string | null;
  initialKind?: SimulationActionKind | null;
}

const ACTION_META: Record<SimulationActionKind, { label: string; hint: string; icon: React.ReactNode }> = {
  'exchange': {
    label: 'Exchange',
    hint: 'Dua orang bertukar kursi. Tidak ada posisi yang jadi kosong.',
    icon: <GitCompareArrows className="w-[13px] h-[13px] text-[#016699]" />,
  },
  'cut-replace': {
    label: 'Cut & Replace',
    hint: 'Kandidat mengisi posisi target; posisi asalnya jadi kosong dan orang yang tergeser keluar dari struktur.',
    icon: <UserRoundX className="w-[13px] h-[13px] text-[#dc3545]" />,
  },
};

function VerdictChip({ verdict }: { verdict: StepView['verdict'] }) {
  const good = verdict === 'good';
  return (
    <span
      className="rounded-full px-[8px] py-[1px] text-[9px] font-bold border"
      style={good
        ? { color: '#00875A', borderColor: 'rgba(0,135,90,0.35)', background: 'rgba(0,135,90,0.08)' }
        : { color: '#dc3545', borderColor: 'rgba(220,53,69,0.35)', background: 'rgba(220,53,69,0.08)' }}
    >
      {good ? 'Good' : 'At Risk'}
    </span>
  );
}

/** Kotak posisi + penghuninya, dipakai untuk kedua sisi sebuah langkah. */
function SeatBox({ position, personName }: { position: string; personName: string }) {
  const vacant = isVacantName(personName);
  return (
    <div className="flex-1 min-w-0 rounded-[8px] border border-[#e9ecef] p-[8px]">
      <div className="truncate font-['Open_Sans',_sans-serif] text-[10px] font-bold text-[#333]" title={position}>
        {position}
      </div>
      <div
        className="mt-[5px] truncate rounded-[6px] border border-[#dee2e6] px-[7px] py-[3px] font-['Open_Sans',_sans-serif] text-[10px]"
        style={{ color: vacant ? '#adb5bd' : '#495057', fontStyle: vacant ? 'italic' : undefined }}
        title={personName}
      >
        {vacant ? '[VACANT]' : personName}
      </div>
    </div>
  );
}

function StepCard({ index, view, onRemove, onSetAsPlan }: {
  index: number;
  view: StepView;
  onRemove: () => void;
  onSetAsPlan: () => void;
}) {
  const [showConsequences, setShowConsequences] = useState(view.verdict === 'at-risk');
  const meta = ACTION_META[view.step.kind];

  return (
    <div className="rounded-[10px] border border-[#e9ecef] bg-white p-[10px]">
      <div className="mb-[8px] flex items-center justify-between gap-[8px]">
        <div className="flex items-center gap-[6px]">
          <span className="font-['Open_Sans',_sans-serif] text-[12px] font-bold text-[#333]">#{index}</span>
          <VerdictChip verdict={view.verdict} />
        </div>
        <button
          onClick={onRemove}
          title="Hapus langkah ini"
          className="rounded-[6px] border border-[rgba(220,53,69,0.35)] p-[4px] text-[#dc3545] hover:bg-[rgba(220,53,69,0.08)] transition-colors"
        >
          <Trash2 className="w-[12px] h-[12px]" />
        </button>
      </div>

      <div className="flex items-center gap-[6px]">
        <SeatBox position={view.target.position} personName={view.target.personName} />
        <span title={`${meta.label} — ${meta.hint}`} className="shrink-0 cursor-help">{meta.icon}</span>
        <SeatBox position={view.incoming.position} personName={view.incoming.personName} />
      </div>

      <button
        onClick={() => setShowConsequences(v => !v)}
        className="mt-[8px] flex w-full items-center justify-center gap-[5px] rounded-[7px] bg-[#f1f3f5] px-[10px] py-[5px] font-['Open_Sans',_sans-serif] text-[10px] font-semibold text-[#495057] hover:bg-[#e9ecef] transition-colors"
      >
        Consequences
        {view.consequences.length > 0 && (
          <span className="rounded-full bg-[#dc3545] px-[5px] text-[9px] font-bold text-white">
            {view.consequences.length}
          </span>
        )}
        {showConsequences
          ? <ChevronUp className="w-[12px] h-[12px]" />
          : <ChevronDown className="w-[12px] h-[12px]" />}
      </button>

      {showConsequences && (
        <div className="mt-[6px] flex flex-col gap-[5px]">
          {view.consequences.length === 0 ? (
            <p className="m-0 px-[2px] font-['Open_Sans',_sans-serif] text-[10px] text-[#6c757d]">
              Tidak ada konsekuensi yang terdeteksi dari langkah ini.
            </p>
          ) : view.consequences.map((c, i) => (
            <div key={i} className="flex items-start gap-[6px] rounded-[7px] bg-[#f8f9fa] p-[7px]">
              <span
                className="shrink-0 max-w-[45%] truncate rounded-[5px] border px-[6px] py-[2px] font-['Open_Sans',_sans-serif] text-[9px] font-semibold"
                style={c.subject === 'position'
                  ? { color: '#016699', borderColor: 'rgba(1,102,153,0.3)', background: 'rgba(1,102,153,0.07)' }
                  : { color: '#8a5a00', borderColor: 'rgba(245,158,2,0.4)', background: 'rgba(245,158,2,0.1)' }}
                title={c.label}
              >
                {c.label}
              </span>
              <span className="font-['Open_Sans',_sans-serif] text-[10px] leading-[14px] text-[#495057]">{c.text}</span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onSetAsPlan}
        className="mt-[8px] flex w-full items-center justify-center gap-[6px] rounded-[8px] border border-[#dee2e6] bg-white px-[10px] py-[7px] font-['Open_Sans',_sans-serif] text-[10px] font-bold uppercase tracking-[0.03em] text-[#495057] hover:border-[#016699] hover:text-[#016699] transition-colors"
      >
        <Sparkles className="w-[12px] h-[12px]" />
        Set as Career/Succession Plan
      </button>
    </div>
  );
}

/**
 * Form tambah langkah. Sketsanya tidak menggambarkan isi form ini (di sana
 * hanya ada tombol "+ ADD SIMULATION STEP"), jadi bentuknya: pilih jenis aksi,
 * posisi target, lalu kandidat. Pemilihnya `<select>` bawaan — bukan dropdown
 * ber-search seperti panel V1 — karena tahap ini masih eksplorasi bentuk panel.
 */
function AddStepForm({ seats, initialTargetSeatId, initialKind, onCancel, onSubmit }: {
  seats: Employee[];
  initialTargetSeatId?: string | null;
  initialKind?: SimulationActionKind | null;
  onCancel: () => void;
  onSubmit: (step: Omit<SimulationStep, 'id'>) => void;
}) {
  const [kind, setKind] = useState<SimulationActionKind>(initialKind ?? 'exchange');
  const [targetSeatId, setTargetSeatId] = useState(initialTargetSeatId ?? '');
  const [incomingSeatId, setIncomingSeatId] = useState('');

  const sorted = useMemo(
    () => [...seats].sort((a, b) => a.position.localeCompare(b.position)),
    [seats],
  );
  // Kursi kosong tidak bisa jadi sumber orang — tidak ada yang bisa dipindahkan.
  const candidates = sorted.filter(s => s.id !== targetSeatId && !isVacantName(s.name));
  const ready = targetSeatId && incomingSeatId && targetSeatId !== incomingSeatId;

  const label = (s: Employee) => `${s.position} — ${isVacantName(s.name) ? '[VACANT]' : s.name}`;
  const selectClass = "w-full rounded-[7px] border border-[#dee2e6] bg-white px-[8px] py-[6px] font-['Open_Sans',_sans-serif] text-[10px] text-[#495057]";

  return (
    <div className="rounded-[10px] border border-dashed border-[#016699] bg-[rgba(1,102,153,0.03)] p-[10px]">
      <div className="mb-[8px] font-['Open_Sans',_sans-serif] text-[11px] font-bold text-[#333]">Langkah baru</div>

      <div className="mb-[8px] flex gap-[5px]">
        {(Object.keys(ACTION_META) as SimulationActionKind[]).map(k => (
          <button
            key={k}
            onClick={() => setKind(k)}
            title={ACTION_META[k].hint}
            className="flex-1 flex items-center justify-center gap-[4px] rounded-[7px] border px-[6px] py-[5px] font-['Open_Sans',_sans-serif] text-[10px] font-semibold transition-colors"
            style={kind === k
              ? { borderColor: '#016699', background: 'rgba(1,102,153,0.08)', color: '#016699' }
              : { borderColor: '#dee2e6', background: '#fff', color: '#6c757d' }}
          >
            {ACTION_META[k].icon}
            {ACTION_META[k].label}
          </button>
        ))}
      </div>

      <div className="mb-[6px]">
        <div className="mb-[3px] font-['Open_Sans',_sans-serif] text-[9px] font-semibold text-[#6c757d]">Posisi target</div>
        <select className={selectClass} value={targetSeatId} onChange={e => { setTargetSeatId(e.target.value); setIncomingSeatId(''); }}>
          <option value="">Pilih posisi...</option>
          {sorted.map(s => <option key={s.id} value={s.id}>{label(s)}</option>)}
        </select>
      </div>

      <div className="mb-[10px]">
        <div className="mb-[3px] font-['Open_Sans',_sans-serif] text-[9px] font-semibold text-[#6c757d]">Kandidat yang masuk</div>
        <select className={selectClass} value={incomingSeatId} onChange={e => setIncomingSeatId(e.target.value)} disabled={!targetSeatId}>
          <option value="">{targetSeatId ? 'Pilih kandidat...' : 'Pilih posisi target dulu'}</option>
          {candidates.map(s => <option key={s.id} value={s.id}>{label(s)}</option>)}
        </select>
      </div>

      <div className="flex gap-[6px]">
        <button
          onClick={onCancel}
          className="flex-1 rounded-[7px] border border-[#dee2e6] bg-white py-[6px] font-['Open_Sans',_sans-serif] text-[10px] font-semibold text-[#6c757d] hover:bg-[#f8f9fa] transition-colors"
        >
          Batal
        </button>
        <button
          onClick={() => ready && onSubmit({ kind, targetSeatId, incomingSeatId })}
          disabled={!ready}
          className="flex-1 rounded-[7px] py-[6px] font-['Open_Sans',_sans-serif] text-[10px] font-bold text-white transition-colors"
          style={{ background: ready ? '#016699' : '#adb5bd', cursor: ready ? 'pointer' : 'not-allowed' }}
        >
          Tambah
        </button>
      </div>
    </div>
  );
}

export default function SimulationPanelV3({
  simulatedEmployees, views, onAddStep, onRemoveStep, onSetAsPlan, onStop,
  initialTargetSeatId, initialKind,
}: SimulationPanelV3Props) {
  const [adding, setAdding] = useState(!!initialTargetSeatId);

  return (
    <div
      className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-[-4px_0px_30px_0px_rgba(0,0,0,0.12)] z-[60] flex flex-col"
      data-name="Simulation Panel V3"
      data-no-drag
    >
      <div className="shrink-0 border-b border-[#e9ecef] px-[16px] py-[14px] flex items-center gap-[7px]">
        <FlaskConical className="w-[15px] h-[15px] text-[#F59E02]" />
        <span className="font-['Open_Sans',_sans-serif] text-[14px] font-bold text-[#333]">Simulation</span>
        <span className="ml-auto font-['Open_Sans',_sans-serif] text-[10px] text-[#6c757d]">
          {views.length} langkah
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-[14px] flex flex-col gap-[10px]">
        {views.length === 0 && !adding && (
          <p className="m-0 font-['Open_Sans',_sans-serif] text-[11px] leading-[16px] text-[#6c757d]">
            Belum ada langkah. Tambahkan langkah untuk melihat dampaknya pada struktur
            dan kesiapan suksesi.
          </p>
        )}

        {views.map((view, i) => (
          <StepCard
            key={view.step.id}
            index={i + 1}
            view={view}
            onRemove={() => onRemoveStep(view.step.id)}
            onSetAsPlan={() => onSetAsPlan(view)}
          />
        ))}

        {adding && (
          <AddStepForm
            seats={simulatedEmployees}
            // Prefill hanya untuk langkah PERTAMA: setelah ada langkah, target
            // yang relevan sudah bukan posisi yang tadi diklik di kanvas.
            initialTargetSeatId={views.length === 0 ? initialTargetSeatId : null}
            initialKind={views.length === 0 ? initialKind : null}
            onCancel={() => setAdding(false)}
            onSubmit={step => { onAddStep(step); setAdding(false); }}
          />
        )}
      </div>

      <div className="shrink-0 border-t border-[#e9ecef] p-[14px] flex flex-col gap-[8px]">
        <button
          onClick={() => setAdding(true)}
          disabled={adding}
          className="flex w-full items-center justify-center gap-[6px] rounded-[8px] border border-[#dee2e6] bg-white px-[14px] py-[9px] font-['Open_Sans',_sans-serif] text-[11px] font-bold uppercase tracking-[0.03em] text-[#495057] hover:border-[#016699] hover:text-[#016699] disabled:opacity-50 transition-colors"
        >
          <Plus className="w-[13px] h-[13px]" />
          Add Simulation Step
        </button>
        <button
          onClick={onStop}
          className="flex w-full items-center justify-center gap-[6px] rounded-[8px] border border-[#dc3545] bg-white px-[14px] py-[9px] font-['Open_Sans',_sans-serif] text-[11px] font-bold uppercase tracking-[0.03em] text-[#dc3545] hover:bg-[#dc3545] hover:text-white transition-colors"
        >
          <CircleStop className="w-[13px] h-[13px]" />
          Stop Simulation
        </button>
      </div>
    </div>
  );
}
