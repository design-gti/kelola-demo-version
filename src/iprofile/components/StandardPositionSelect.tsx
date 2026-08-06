"use client";
import { useEffect, useRef, useState } from "react";
import { allParticipants, positionOf } from "@/data/model/selectors";

/**
 * Dropdown "Stnd. [Posisi]" di Score Aspect (Competency & Potency).
 *
 * Sengaja dekoratif — memilih posisi lain TIDAK mengubah standarScore di
 * kartu aspek (13 aspek kompetensi Vismap V2 dan 9 aspek kognitif iProfile
 * adalah dua instrumen yang berbeda, tidak bisa dipetakan 1:1 — lihat diskusi
 * terkait). Yang disinkronkan di sini cuma DAFTAR NAMA POSISInya: diambil dari
 * store kanonik yang sama (participants → position) yang juga dipakai Vismap,
 * bukan lagi teks "[Marketing]" yang hardcode.
 */
function allPositionTitles(): string[] {
  const titles = new Set(allParticipants().map((p) => positionOf(p).title).filter(Boolean));
  return [...titles].sort((a, b) => a.localeCompare(b));
}

export function StandardPositionSelect() {
  const [options] = useState<string[]>(() => allPositionTitles());
  const [selected, setSelected] = useState(options[0] ?? "-");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative" data-name="TextInput">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="bg-[#f8f9fa] relative rounded-[16px] shrink-0 w-full cursor-pointer"
        data-name="Input field"
      >
        <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[4px] relative w-full">
            <div className="bg-[#d6e6ff] relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
              <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
            </div>
            <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px overflow-hidden relative text-[#495057] text-[10px] text-ellipsis whitespace-nowrap text-left" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[normal] overflow-hidden">{`Stnd. [${selected}]`}</p>
            </div>
            <div className={`overflow-clip relative shrink-0 size-[16px] transition-transform ${open ? "rotate-180" : ""}`} data-name="chevron-down">
              <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
                <div className="absolute inset-[-18.75%_-9.38%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5 5.5">
                    <path d="M0.75 0.75L4.75 4.75L8.75 0.75" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-[4px] max-h-[200px] overflow-y-auto bg-white rounded-[8px] border border-[#dee2e6] shadow-[2px_4px_10px_0px_rgba(0,0,0,0.1)] z-20"
        >
          {options.map((title) => (
            <button
              key={title}
              type="button"
              role="option"
              aria-selected={title === selected}
              onClick={() => { setSelected(title); setOpen(false); }}
              className={`w-full text-left px-[12px] py-[6px] text-[10px] cursor-pointer hover:bg-[#f8f9fa] ${
                title === selected ? "bg-[#e7f5ff] text-[#016699] font-bold" : "text-[#495057]"
              }`}
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
