function Label() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Heatmap Style</p>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="chevron-down">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
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
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[52px] items-start relative shrink-0 w-full" data-name="TextInput">
      <Label />
      <InputField />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[17px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          <circle cx="8.5" cy="8.5" fill="var(--fill-0, #FE0D00)" id="Ellipse 38" r="8.5" />
        </svg>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-nowrap w-[413px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">x - xx</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[17px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          <circle cx="8.5" cy="8.5" fill="var(--fill-0, #F59B02)" id="Ellipse 38" r="8.5" />
        </svg>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-nowrap w-[413px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">xx - xx</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[17px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          <circle cx="8.5" cy="8.5" fill="var(--fill-0, #F0DC02)" id="Ellipse 38" r="8.5" />
        </svg>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-nowrap w-[413px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">xx - xx</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[17px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          <circle cx="8.5" cy="8.5" fill="var(--fill-0, #A3DF0F)" id="Ellipse 38" r="8.5" />
        </svg>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-nowrap w-[413px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">xx - xx</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[17px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
          <circle cx="8.5" cy="8.5" fill="var(--fill-0, #0DE627)" id="Ellipse 38" r="8.5" />
        </svg>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-nowrap w-[413px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">xx - xxx</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Competency Score</p>
      <Frame5 />
    </div>
  );
}

export default function HeatmapStyleLegend() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] size-full" data-name="Heatmap style & Legend">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative size-full">
          <TextInput />
          <Frame6 />
        </div>
      </div>
    </div>
  );
}
