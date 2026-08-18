"use client";
import { useContext, useMemo, useState } from "react";
import svgPaths from "./svg-6vtdstsktn";
import { ProfileContext } from "../lib/ProfileContext";
import { candidateOptions, filterCandidates, LEVEL_CHIP, type CandidateOption } from "../lib/candidates";

function Header({ name, onClose }: { name: string; onClose?: () => void }) {
  return (
    <div className="content-stretch flex h-[22px] items-center justify-between relative shrink-0 w-full">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#58595b] text-[16px]">
        Add Career Plan for {name}
      </p>
      <button className="block cursor-pointer overflow-clip relative shrink-0 size-[20px]" data-name="x" onClick={onClose}>
        <div className="absolute inset-1/4" data-name="Vector">
          <div className="absolute inset-[-7.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 11.5">
              <path d={svgPaths.p14b78080} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

function InputField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search by name or position..."
            className="flex-[1_0_0] min-w-px bg-transparent border-none outline-none font-['Open_Sans:Regular',sans-serif] text-[#495057] text-[12px] placeholder:text-[#adb5bd]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          />
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="search">
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <div className="absolute inset-[-6.25%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
                  <path d={svgPaths.p216c8100} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Satu baris pilihan. Jabatan jadi judulnya, nama pemegangnya di bawah —
 * yang dipilih di sini memang posisi tujuan, bukan orangnya.
 */
function CandidateRow({ item }: { item: CandidateOption }) {
  const chip = LEVEL_CHIP[item.level];
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="bg-[#f8f9fa] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] hover:bg-[#e9ecef] transition-colors cursor-pointer">
        <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[0] min-h-px min-w-px relative">
              <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[12px] w-full">
                <p className="leading-[normal] whitespace-pre-wrap">{item.position}</p>
              </div>
              <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[normal] whitespace-pre-wrap">{item.name}</p>
              </div>
            </div>
            <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
              <div className="content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip" style={{ background: chip.bg }}>
                <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100", color: chip.fg }}>
                  {chip.label}
                </p>
              </div>
            </div>
            <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
              {item.percentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddCareerPlan({ onClose }: { onClose?: () => void }) {
  const { name, employeeId } = useContext(ProfileContext);
  const [query, setQuery] = useState("");

  const all = useMemo(() => candidateOptions(employeeId), [employeeId]);
  const shown = useMemo(() => filterCandidates(all, query), [all, query]);

  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] size-full" data-name="Add Career Plan">
      <Header name={name} onClose={onClose} />
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="TextInput">
        <InputField value={query} onChange={setQuery} />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] h-[500px] items-start overflow-x-clip overflow-y-auto relative shrink-0 w-full">
        {shown.map((item) => (
          <CandidateRow key={item.id} item={item} />
        ))}
        {shown.length === 0 && (
          <p className="font-['Open_Sans:Regular',sans-serif] text-[#adb5bd] text-[12px] py-[8px]">
            No matching employee
          </p>
        )}
      </div>
    </div>
  );
}
