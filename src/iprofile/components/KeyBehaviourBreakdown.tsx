"use client";

// score null = belum ada data untuk KB ini (ditampilkan "-").
export type KeyBehaviour = { label: string; score: number | null };

/**
 * Breakdown Key Behaviour satu aspek. Dipakai dua tempat dengan tampilan yang
 * sama persis: expand inline di kartu aspek (view list) dan panel di bawah
 * chart (view spider). Sengaja satu komponen — informasi yang sama tidak boleh
 * punya dua bahasa visual di kartu yang sama.
 *
 * Hanya ada di Competency; Potency tidak punya breakdown KB.
 *
 * Tag skor sengaja netral (bukan merah/oranye/hijau) — breakdown ini murni
 * informasi, bukan heatmap.
 */
export function KeyBehaviourBreakdown({ keyBehaviours }: { keyBehaviours: KeyBehaviour[] }) {
  return (
    <div className="flex flex-col gap-[6px] w-full pt-[8px] mt-[4px] border-t border-[#e9ecef]">
      {keyBehaviours.map((kb) => (
        <div key={kb.label} className="flex items-center justify-between gap-[8px] w-full">
          <p className="text-[12px] text-[#495057] leading-[normal]" style={{ fontVariationSettings: "'wdth' 100" }}>{kb.label}</p>
          <span className="shrink-0 font-['Open_Sans:Bold',sans-serif] font-bold rounded-[800px] px-[8px] py-[1px] text-[12px] text-[#6c757d] bg-[#f1f3f5]">
            {kb.score == null ? "-" : `${kb.score}/5`}
          </span>
        </div>
      ))}
    </div>
  );
}
