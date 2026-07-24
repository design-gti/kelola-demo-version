// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start leading-[0] relative shrink-0 whitespace-nowrap">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Total Decisions</p>
      </div>
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[14px]">
        <p className="leading-[normal]">0</p>
      </div>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-white content-stretch flex items-center px-[8px] py-[4px] relative rounded-[8px] size-full">
      <Frame />
    </div>
  );
}