function X() {
  return (
    <button className="block cursor-pointer relative shrink-0 size-[20px]" data-name="x">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="x">
          <path d="M15 5L5 15M5 5L15 15" id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </button>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#58595b] text-[16px] text-nowrap whitespace-pre">{`AI-Generated IDP Recommendation -  [Employee name]`}</p>
      <X />
    </div>
  );
}

function Chip() {
  return (
    <div className="bg-[#e7f5ff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#016699] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        [nama aspek]
      </p>
    </div>
  );
}

function ChipDisc() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
      <Chip />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] w-[504px]">
        <p className="leading-[normal]">Development Goals</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Generate by AI</p>
      </div>
    </div>
  );
}

function ActionPlan() {
  return (
    <div className="content-stretch flex items-start relative rounded-[8px] shrink-0 w-full" data-name="Action plan">
      <Frame2 />
    </div>
  );
}

function Monitoring() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Monitoring">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] items-start p-[16px] relative w-full">
          <Frame6 />
          <ActionPlan />
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] w-[504px]">
        <p className="leading-[normal]">Success Measuures</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <ul className="list-disc">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">{`Lorem ipsim `}</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">{`Lorem ipsim `}</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">{`Lorem ipsim `}</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">{`Lorem ipsim `}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function ActionPlan1() {
  return (
    <div className="content-stretch flex items-start relative rounded-[8px] shrink-0 w-full" data-name="Action plan">
      <Frame3 />
    </div>
  );
}

function Monitoring1() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Monitoring">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[4px] items-start p-[16px] relative w-full">
          <Frame7 />
          <ActionPlan1 />
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] w-[504px]">
        <p className="leading-[normal]">Recommended Programs:</p>
      </div>
    </div>
  );
}

function Chip1() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
      <div aria-hidden="true" className="absolute border border-[#495057] border-solid inset-0 pointer-events-none rounded-[800px]" />
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Job Assignment
      </p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
      <Chip1 />
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">3-6 months</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <ul className="list-disc mb-[8px]">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">{`Lorem ipsim `}</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">{`Lorem ipsim `}</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[normal]">{`Lorem ipsim `}</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[normal]">{`Lorem ipsim `}</span>
          </li>
        </ul>
        <p className="leading-[normal] text-[#adb5bd]">Mentor: Direct Supervvisor</p>
      </div>
    </div>
  );
}

function ActionPlan2() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Action plan">
      <div className="size-full">
        <div className="box-border content-stretch flex items-start p-[4px] relative w-full">
          <Frame4 />
        </div>
      </div>
    </div>
  );
}

function Monitoring2() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Monitoring">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[6px] items-start p-[16px] relative w-full">
          <Frame8 />
          <Frame10 />
          <ActionPlan2 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
          <ChipDisc />
          <Monitoring />
          <Monitoring1 />
          <Monitoring2 />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[529px] items-start overflow-x-clip overflow-y-auto relative shrink-0 w-full">
      <Frame5 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] left-[1058px] top-[54px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]">
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[1058px] top-[54px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "529", "--transform-inner-height": "6" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="bg-[#e9e9e9] h-[6px] rounded-[3px] w-[529px]" />
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[1058px] top-[54px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "343.34375", "--transform-inner-height": "6" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="bg-[#cacaca] h-[6px] rounded-[3px] w-[343.354px]" />
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <button className="box-border content-stretch cursor-pointer flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[28px] shrink-0" data-name="button">
      <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-nowrap whitespace-pre">Close</p>
    </button>
  );
}

function Button1() {
  return (
    <div className="bg-[#016699] box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[28px] shrink-0" data-name="button">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Continue</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center justify-end left-[16px] top-[608px] w-[1034px]">
      <Button />
      <Button1 />
    </div>
  );
}

export default function PopUp() {
  return (
    <div className="bg-white relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] size-full" data-name="pop up -">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start pl-[16px] pr-[20px] py-[16px] relative size-full">
          <Frame />
          <Frame9 />
          <div className="h-0 relative shrink-0 w-full">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1034 1">
                <line id="Line 103" stroke="var(--stroke-0, #DEE2E6)" x2="1034" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
          <Group />
          <Frame1 />
        </div>
      </div>
    </div>
  );
}
