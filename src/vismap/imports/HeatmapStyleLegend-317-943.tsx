import svgPaths from "./svg-2s85w3moty";

function Label() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Heatmap Style</p>
    </div>
  );
}

function InputField() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">Glow Effect</p>
          </div>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="chevron-down">
            <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
              <div className="absolute inset-[-18.75%_-9.38%]" style={{ "--stroke-0": "rgba(88, 89, 91, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 6">
                  <path d={svgPaths.p14416700} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal items-center justify-between leading-[0] relative shrink-0 text-[#495057] text-[10px] text-nowrap w-full">
      <div className="flex flex-col h-[16px] justify-center overflow-ellipsis overflow-hidden relative shrink-0 w-[101px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden text-[10px] text-nowrap">Need Intervention</p>
      </div>
      <div className="flex flex-col h-[16px] justify-center overflow-ellipsis overflow-hidden relative shrink-0 text-right w-[108px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden text-[10px] text-nowrap">Stable condition</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[261px]">
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-full" style={{ "--transform-inner-width": "261", "--transform-inner-height": "261" } as React.CSSProperties}>
        <div className="flex-none rotate-[270deg] w-full">
          <div className="bg-gradient-to-b from-[#fe0d00] h-[261px] to-[#0de627] via-50% via-[#f0dc02] w-full" />
        </div>
      </div>
      <Frame />
    </div>
  );
}

export default function HeatmapStyleLegend() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] size-full" data-name="Heatmap style & Legend">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative size-full">
          <div className="content-stretch flex flex-col gap-[4px] h-[52px] items-start relative shrink-0 w-full" data-name="TextInput">
            <Label />
            <InputField />
          </div>
          <Frame1 />
        </div>
      </div>
    </div>
  );
}
