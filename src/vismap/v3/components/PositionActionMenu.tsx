// Menu aksi V3 — muncul di samping card job position yang diklik.
//
// Empat aksi utama (Simulation, Succession, Development, iProfile). "Simulation"
// membuka submenu tahap kedua: aksi terhadap incumbant (Exchange, Cut & Replace,
// Promote, Mutation) dan terhadap job-nya (Change Job Criteria).
//
// TAHAP INI: hanya "Exchange" yang tersambung ke SimulationPanel V1 yang sudah
// ada. Empat sisanya sengaja masih placeholder — lihat docs/vismap-v3.md §8.
import { ArrowUpNarrowWide, FlaskConical, GitCompareArrows, LayoutGrid, Network, Repeat, TrendingUp, UserRound, UserRoundX } from 'lucide-react';

export type SimulationAction = 'exchange' | 'cut-replace' | 'promote' | 'mutation' | 'change-job-criteria';

interface PositionActionMenuProps {
  simulationOpen: boolean;
  onToggleSimulation: () => void;
  onSuccession: () => void;
  onDevelopment: () => void;
  onIProfile: () => void;
  onSimulationAction: (action: SimulationAction) => void;
}

function MenuButton({ icon, label, active, onClick }: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="flex items-center gap-[6px] whitespace-nowrap rounded-[6px] border px-[8px] py-[5px] font-['Open_Sans',_sans-serif] text-[9px] font-semibold transition-colors"
      style={{
        borderColor: active ? '#016699' : '#dee2e6',
        background: active ? '#016699' : '#ffffff',
        color: active ? '#ffffff' : '#016699',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

export default function PositionActionMenu({
  simulationOpen, onToggleSimulation, onSuccession, onDevelopment, onIProfile, onSimulationAction,
}: PositionActionMenuProps) {
  return (
    <div
      data-no-drag
      className="absolute left-full top-0 z-50 flex items-start gap-[8px] pl-[8px]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Aksi utama */}
      <div className="flex flex-col gap-[6px]">
        <MenuButton
          icon={<FlaskConical className="w-[10px] h-[10px]" />}
          label="Simulation"
          active={simulationOpen}
          onClick={onToggleSimulation}
        />
        <MenuButton icon={<Network className="w-[10px] h-[10px]" />} label="Succession" onClick={onSuccession} />
        <MenuButton icon={<TrendingUp className="w-[10px] h-[10px]" />} label="Development" onClick={onDevelopment} />
        <MenuButton icon={<UserRound className="w-[10px] h-[10px]" />} label="iProfile" onClick={onIProfile} />
      </div>

      {/* Submenu Simulation */}
      {simulationOpen && (
        <div
          className="flex w-[152px] flex-col gap-[8px] rounded-[8px] border border-[#dee2e6] bg-white p-[8px]"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center gap-[5px] border-b border-[#dee2e6] pb-[5px]">
            <FlaskConical className="w-[10px] h-[10px] text-[#016699]" />
            <p className="font-['Open_Sans',_sans-serif] text-[9px] font-bold text-[#016699]">Simulation</p>
          </div>

          <p className="font-['Open_Sans',_sans-serif] text-[8px] text-[#58595b]">Incumbant</p>
          <div className="flex flex-col gap-[5px]">
            <MenuButton icon={<GitCompareArrows className="w-[10px] h-[10px]" />} label="Exchange" onClick={() => onSimulationAction('exchange')} />
            <MenuButton icon={<UserRoundX className="w-[10px] h-[10px]" />} label="Cut & Replace" onClick={() => onSimulationAction('cut-replace')} />
            <MenuButton icon={<ArrowUpNarrowWide className="w-[10px] h-[10px]" />} label="Promote" onClick={() => onSimulationAction('promote')} />
            <MenuButton icon={<Repeat className="w-[10px] h-[10px]" />} label="Mutation" onClick={() => onSimulationAction('mutation')} />
          </div>

          <p className="font-['Open_Sans',_sans-serif] text-[8px] text-[#58595b]">Job</p>
          <MenuButton icon={<LayoutGrid className="w-[10px] h-[10px]" />} label="Change Job Criteria" onClick={() => onSimulationAction('change-job-criteria')} />
        </div>
      )}
    </div>
  );
}
