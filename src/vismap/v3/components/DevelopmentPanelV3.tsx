"use client";
// Panel Development V3 — SALINAN-BARU, bukan `EmployeeDetailPanel` yang dipakai
// V1 (aturan copy-on-demand, docs/vismap-v3.md §3): tampilannya diubah total
// jadi dua tab, sehingga tidak boleh menumpang komponen share.
//
// Dua tab menjawab dua pertanyaan yang di versi lama tercampur jadi
// "Competency Score" dan "Readiness Score" tanpa konteks jabatan:
//
//   Current Position → seberapa cocok orang ini dengan jabatan yang DIISI
//                      sekarang; dropdown-nya terkunci di jabatan itu.
//   Target Position  → seberapa cocok terhadap jabatan yang DITUJU; default
//                      atasan langsungnya, tapi bisa diganti ke jabatan lain.
//
// Di bawah tiap persentase ada breakdown aspek yang masih di bawah standar
// jabatan tersebut beserta Key Behaviour-nya. KB yang dicentang ikut terbawa
// sebagai baris program di form Create IDP.
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Info, Star, TrendingUp, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { devAspectsFor, hasCompetencyData, matchPercentFor, positionOptions, type DevAspect } from '../competency';

interface DevelopmentPanelV3Props {
  employeeId: string;
  employeeName: string;
  employeePosition: string;
  employeePhoto?: string;
  /** Jabatan atasan langsung — default tab Target Position. */
  managerPosition?: string | null;
  onClose: () => void;
}

type TabId = 'current' | 'target';

const kbKey = (aspect: string, kb: string) => `${aspect}||${kb}`;

function StarRow({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-[1px]">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className="w-[12px] h-[12px]"
          style={{ color: i <= score ? '#F59E02' : '#dee2e6' }}
          fill={i <= score ? '#F59E02' : '#dee2e6'}
          strokeWidth={0}
        />
      ))}
    </span>
  );
}

function AspectRow({ aspect, checked, onToggleKb }: {
  aspect: DevAspect;
  checked: Set<string>;
  onToggleKb: (aspectLabel: string, kb: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasKb = aspect.keyBehaviours.length > 0;
  const checkedCount = aspect.keyBehaviours.filter(kb => checked.has(kbKey(aspect.label, kb.label))).length;

  return (
    <div className="rounded-[8px] border border-[#dee2e6] overflow-hidden">
      <button
        onClick={() => hasKb && setExpanded(v => !v)}
        className="w-full flex items-center gap-[8px] px-[12px] py-[10px] bg-white hover:bg-[#f8f9fa] transition-colors text-left"
      >
        <span className="flex items-center gap-[5px] flex-1 min-w-0">
          <span className="font-['Open_Sans',_sans-serif] text-[12px] font-semibold text-[#212529] truncate">
            {aspect.label}
          </span>
          {aspect.description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="shrink-0 cursor-help"><Info className="w-[12px] h-[12px] text-[#adb5bd]" /></span>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[260px]">
                  <p className="font-['Open_Sans',_sans-serif] text-xs">{aspect.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </span>

        {/* Selisih yang harus ditutup untuk mencapai standar jabatan */}
        <span className="shrink-0 rounded-full border border-[#F59E02] px-[6px] py-[1px] font-['Open_Sans',_sans-serif] text-[10px] font-bold text-[#B5721C]">
          +{aspect.gap}
        </span>
        <StarRow score={aspect.score} />
        <span className="shrink-0 rounded-[4px] bg-[#f1f3f5] px-[6px] py-[1px] font-['Open_Sans',_sans-serif] text-[11px] font-bold text-[#495057]">
          {aspect.score}
        </span>
        {hasKb && (
          expanded
            ? <ChevronUp className="w-[14px] h-[14px] text-[#016699] shrink-0" />
            : <ChevronDown className="w-[14px] h-[14px] text-[#016699] shrink-0" />
        )}
      </button>

      {expanded && hasKb && (
        <div className="flex flex-col border-t border-[#dee2e6]">
          {aspect.keyBehaviours.map(kb => {
            const key = kbKey(aspect.label, kb.label);
            const isChecked = checked.has(key);
            return (
              <label
                key={key}
                className="flex items-start gap-[8px] px-[12px] py-[8px] bg-[#f8f9fa] border-b border-[#e9ecef] last:border-b-0 cursor-pointer hover:bg-[#f1f3f5]"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleKb(aspect.label, kb.label)}
                  className="mt-[2px] size-[13px] accent-[#016699] shrink-0"
                />
                <span className="flex-1 font-['Open_Sans',_sans-serif] text-[11px] leading-[1.45] text-[#495057]">
                  {kb.label}
                </span>
                <span className="shrink-0 font-['Open_Sans',_sans-serif] text-[10px] font-bold text-[#6c757d]">
                  Taraf {kb.level}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {expanded && checkedCount > 0 && (
        <div className="px-[12px] py-[6px] bg-white border-t border-[#e9ecef]">
          <p className="font-['Open_Sans',_sans-serif] text-[10px] text-[#016699]">
            {checkedCount} key behaviour dipilih untuk IDP
          </p>
        </div>
      )}
    </div>
  );
}

export default function DevelopmentPanelV3({
  employeeId, employeeName, employeePosition, managerPosition, onClose,
}: DevelopmentPanelV3Props) {
  const [tab, setTab] = useState<TabId>('current');
  const allPositions = useMemo(() => positionOptions(), []);

  // Target default: jabatan atasan langsung. Kalau atasannya tidak punya data
  // aspek (atau orang ini sudah di puncak), jatuh ke jabatan pertama yang ada
  // datanya supaya tab Target tidak pernah kosong tanpa sebab.
  const defaultTarget = useMemo(() => {
    if (managerPosition && hasCompetencyData(managerPosition)) return managerPosition;
    return allPositions.find(p => p !== employeePosition) ?? employeePosition;
  }, [managerPosition, allPositions, employeePosition]);

  const [targetPosition, setTargetPosition] = useState(defaultTarget);
  useEffect(() => { setTargetPosition(defaultTarget); }, [defaultTarget]);

  // Centangan KB dipegang per jabatan yang dibandingkan: pindah tab atau ganti
  // target berarti aspek yang dibahas berbeda, jadi centangan lama tidak boleh
  // ikut terbawa diam-diam ke form IDP.
  const comparedPosition = tab === 'current' ? employeePosition : targetPosition;
  const [checkedByPosition, setCheckedByPosition] = useState<Record<string, Set<string>>>({});
  const checked = checkedByPosition[comparedPosition] ?? new Set<string>();

  const toggleKb = (aspectLabel: string, kb: string) => {
    setCheckedByPosition(prev => {
      const next = new Set(prev[comparedPosition] ?? []);
      const key = kbKey(aspectLabel, kb);
      if (next.has(key)) next.delete(key); else next.add(key);
      return { ...prev, [comparedPosition]: next };
    });
  };

  const match = matchPercentFor(employeeId, comparedPosition);
  const devAspects = useMemo(
    () => (hasCompetencyData(comparedPosition) ? devAspectsFor(employeeId, comparedPosition) : []),
    [employeeId, comparedPosition],
  );

  const handleCreateIDP = () => {
    // Kelompokkan KB tercentang per aspek → satu baris program per aspek di
    // form Create IDP, dengan Development Goals terisi KB-nya.
    const grouped = new Map<string, string[]>();
    for (const key of checked) {
      const [aspect, kb] = key.split('||');
      if (!grouped.has(aspect)) grouped.set(aspect, []);
      grouped.get(aspect)!.push(kb);
    }

    const params = new URLSearchParams({
      page: 'create-idp-admin.html',
      participants: employeeName,
      from: 'vismap-v3',
    });

    if (grouped.size > 0) {
      const payload = [...grouped.entries()].map(([aspect, goals]) => ({ aspect, goals }));
      // base64 supaya label KB yang panjang & berisi tanda baca tidak merusak
      // query string; halaman create-idp membacanya lewat param `prefill`.
      params.set('prefill', btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
    }

    window.location.href = `/idp?${params.toString()}`;
  };

  const checkedTotal = checked.size;

  return (
    <div
      className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-[-4px_0px_30px_0px_rgba(0,0,0,0.1)] z-[100] flex flex-col animate-in slide-in-from-right duration-300"
      data-name="Development Panel V3"
    >
      {/* Header — label konteks, nama, dan jabatan disusun bertumpuk supaya
          tidak saling tertimpa seperti pada panel versi sebelumnya. */}
      <div className="shrink-0 px-[17px] pt-[18px] pb-[12px] border-b border-[#e9ecef]">
        <div className="flex items-start justify-between gap-[12px]">
          <div className="min-w-0">
            <p className="font-['Open_Sans',_sans-serif] text-[10px] font-bold uppercase tracking-[0.08em] text-[#016699]">
              Development
            </p>
            <p className="mt-[4px] font-['Open_Sans',_sans-serif] text-[14px] font-bold text-[#212529] truncate">
              {employeeName}
            </p>
            <p className="font-['Open_Sans',_sans-serif] text-[11px] text-[#6c757d] truncate">
              {employeePosition}
            </p>
          </div>
          <button onClick={onClose} className="shrink-0 hover:opacity-70 transition-opacity" title="Tutup">
            <X className="size-5 text-[#016699]" />
          </button>
        </div>

        {/* Tab */}
        <div className="mt-[14px] flex gap-[18px]">
          {([['current', 'Current Position'], ['target', 'Target Position']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="pb-[6px] font-['Open_Sans',_sans-serif] text-[12px] font-semibold transition-colors"
              style={{
                color: tab === id ? '#016699' : '#adb5bd',
                borderBottom: tab === id ? '2px solid #016699' : '2px solid transparent',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Isi */}
      <div className="flex-1 overflow-y-auto px-[17px] py-[14px] flex flex-col gap-[14px]">
        {/* Competency Match */}
        <div className="rounded-[8px] border border-[#dee2e6] p-[12px]">
          <div className="flex items-center justify-between gap-[10px]">
            <p className="font-['Open_Sans',_sans-serif] text-[12px] font-semibold text-[#495057]">Competency Match</p>
            <p className="font-['Open_Sans',_sans-serif] text-[26px] font-bold leading-none text-[#016699]">
              {match == null ? '-' : `${match}%`}
            </p>
          </div>

          {tab === 'current' ? (
            <select
              value={employeePosition}
              disabled
              className="mt-[10px] w-full rounded-[6px] border border-[#dee2e6] bg-[#f1f3f5] px-[8px] py-[6px] font-['Open_Sans',_sans-serif] text-[11px] text-[#6c757d] cursor-not-allowed"
            >
              <option value={employeePosition}>{employeePosition}</option>
            </select>
          ) : (
            <select
              value={targetPosition}
              onChange={e => setTargetPosition(e.target.value)}
              className="mt-[10px] w-full rounded-[6px] border border-[#016699] bg-white px-[8px] py-[6px] font-['Open_Sans',_sans-serif] text-[11px] text-[#212529]"
            >
              {allPositions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          )}

          <p className="mt-[6px] font-['Open_Sans',_sans-serif] text-[10px] text-[#adb5bd]">
            {tab === 'current'
              ? 'Kecocokan terhadap standar jabatan yang diisi saat ini.'
              : 'Kecocokan terhadap standar jabatan yang dituju.'}
          </p>
        </div>

        {/* Need Development */}
        <div className="flex flex-col gap-[8px]">
          <p className="font-['Open_Sans',_sans-serif] text-[12px] font-semibold text-[#495057]">Need Development</p>

          {!hasCompetencyData(comparedPosition) ? (
            <div className="rounded-[8px] bg-[#f8f9fa] px-[12px] py-[18px] text-center">
              <p className="font-['Open_Sans',_sans-serif] text-[12px] text-[#6c757d]">Data aspek jabatan ini belum tersedia</p>
            </div>
          ) : devAspects.length === 0 ? (
            <div className="rounded-[8px] bg-[#f8f9fa] px-[12px] py-[18px] text-center">
              <p className="font-['Open_Sans',_sans-serif] text-[12px] font-semibold text-[#495057]">Tidak ada aspek yang perlu dikembangkan</p>
              <p className="mt-[2px] font-['Open_Sans',_sans-serif] text-[11px] text-[#adb5bd]">Semua aspek sudah memenuhi standar jabatan</p>
            </div>
          ) : (
            devAspects.map(a => (
              <AspectRow key={a.label} aspect={a} checked={checked} onToggleKb={toggleKb} />
            ))
          )}
        </div>
      </div>

      {/* Create IDP */}
      <div className="shrink-0 border-t border-[#e9ecef] p-[14px]">
        <button
          onClick={handleCreateIDP}
          className="w-full rounded-[8px] border-2 border-[#016699] bg-white px-[14px] py-[10px] font-['Open_Sans',_sans-serif] text-[13px] font-bold text-[#016699] hover:bg-[#016699] hover:text-white transition-colors flex items-center justify-center gap-[6px]"
        >
          <TrendingUp className="w-[15px] h-[15px]" />
          Create IDP
          {checkedTotal > 0 && (
            <span className="rounded-full bg-[#016699] px-[7px] py-[1px] text-[10px] font-bold text-white">
              {checkedTotal} KB
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
