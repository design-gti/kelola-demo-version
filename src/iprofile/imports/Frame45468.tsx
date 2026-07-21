import svgPaths from "./svg-ojldl57q5q";

function Cell() {
  return <div className="content-stretch flex h-[48px] items-center justify-center py-[8px] shrink-0 w-[20px]" data-name="Cell" />;
}

function Frame() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#adb5bd] text-[12px] text-ellipsis" style={{ fontVariationSettings: "'wdth' 100" }}>
        Press enter to add program
      </p>
    </div>
  );
}

function Component() {
  return (
    <div className="bg-white content-stretch flex items-center relative shrink-0 w-full" data-name="Component 186">
      <Cell />
      <div className="flex-[1_0_0] h-[48px] min-h-px min-w-px relative" data-name="Cell">
        <div aria-hidden="true" className="absolute border-[#dee2e6] border-solid border-t inset-[-0.5px_0_0_0] pointer-events-none" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center pl-[4px] pr-[12px] py-[8px] relative size-full">
            <Frame />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[293px]">
      <div className="bg-white relative shrink-0 w-full" data-name="Title cell">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[8px] relative w-full">
            <p className="flex-[1_0_0] font-['Avenir:Heavy',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative text-[#343a40] text-[14px] whitespace-pre-wrap">IDP Program List</p>
          </div>
        </div>
      </div>
      <Component />
    </div>
  );
}

function Cell1() {
  return (
    <div className="bg-white h-[48px] relative shrink-0 w-full" data-name="Cell">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-solid border-t inset-[-0.5px_0_0_0] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#adb5bd] text-[12px] text-ellipsis" style={{ fontVariationSettings: "'wdth' 100" }}>
            Choose aspect
          </p>
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-down">
            <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
              <div className="absolute inset-[-15%_-7.5%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 6.5">
                  <path d={svgPaths.p3d2c9380} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PeriodeA() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Periode a">
      <div className="bg-white relative shrink-0 w-full" data-name="Title cell">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[8px] relative w-full">
            <p className="flex-[1_0_0] font-['Avenir:Heavy',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative text-[#343a40] text-[14px] whitespace-pre-wrap">Aspect</p>
          </div>
        </div>
      </div>
      <Cell1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#adb5bd] text-[12px] text-ellipsis" style={{ fontVariationSettings: "'wdth' 100" }}>
        Write here
      </p>
    </div>
  );
}

function Cell2() {
  return (
    <div className="bg-white h-[48px] relative shrink-0 w-full" data-name="Cell">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-solid border-t inset-[-0.5px_0_0_0] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative size-full">
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function PeriodeA1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Periode a">
      <div className="bg-white relative shrink-0 w-full" data-name="Title cell">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[8px] relative w-full">
            <p className="flex-[1_0_0] font-['Avenir:Heavy',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative text-[#343a40] text-[14px] whitespace-pre-wrap">Goals</p>
          </div>
        </div>
      </div>
      <Cell2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#adb5bd] text-[12px] text-ellipsis" style={{ fontVariationSettings: "'wdth' 100" }}>
        Choose date
      </p>
    </div>
  );
}

function Cell3() {
  return (
    <div className="bg-white h-[48px] relative shrink-0 w-full" data-name="Cell">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-solid border-t inset-[-0.5px_0_0_0] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <Frame2 />
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="calendar-time">
            <div className="absolute inset-[12.5%_8.33%_8.33%_12.5%]" data-name="Vector">
              <div className="absolute inset-[-4.74%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3333 17.3333">
                  <path d={svgPaths.p13956980} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PeriodeA2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Periode a">
      <div className="bg-white relative shrink-0 w-full" data-name="Title cell">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[8px] relative w-full">
            <p className="flex-[1_0_0] font-['Avenir:Heavy',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative text-[#343a40] text-[14px] whitespace-pre-wrap">Start Date</p>
          </div>
        </div>
      </div>
      <Cell3 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#adb5bd] text-[12px] text-ellipsis" style={{ fontVariationSettings: "'wdth' 100" }}>
        Choose date
      </p>
    </div>
  );
}

function Cell4() {
  return (
    <div className="bg-white h-[48px] relative shrink-0 w-full" data-name="Cell">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-solid border-t inset-[-0.5px_0_0_0] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <Frame3 />
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="calendar-time">
            <div className="absolute inset-[12.5%_8.33%_8.33%_12.5%]" data-name="Vector">
              <div className="absolute inset-[-4.74%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3333 17.3333">
                  <path d={svgPaths.p13956980} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PeriodeA3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Periode a">
      <div className="bg-white relative shrink-0 w-full" data-name="Title cell">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[8px] relative w-full">
            <p className="flex-[1_0_0] font-['Avenir:Heavy',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative text-[#343a40] text-[14px] whitespace-pre-wrap">Due Date</p>
          </div>
        </div>
      </div>
      <Cell4 />
    </div>
  );
}

function Cell5() {
  return (
    <div className="bg-white h-[48px] relative shrink-0 w-full" data-name="Cell">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-solid border-t inset-[-0.5px_0_0_0] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] overflow-hidden relative shrink-0 text-[#adb5bd] text-[12px] text-ellipsis" style={{ fontVariationSettings: "'wdth' 100" }}>
            Choose PIC
          </p>
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-down">
            <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
              <div className="absolute inset-[-15%_-7.5%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 6.5">
                  <path d={svgPaths.p3d2c9380} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PeriodeA4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Periode a">
      <div className="bg-white relative shrink-0 w-full" data-name="Title cell">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[8px] relative w-full">
            <p className="flex-[1_0_0] font-['Avenir:Heavy',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative text-[#343a40] text-[14px] whitespace-pre-wrap">PIC</p>
          </div>
        </div>
      </div>
      <Cell5 />
    </div>
  );
}

function Table() {
  return (
    <div className="content-stretch flex gap-px items-start overflow-x-auto overflow-y-clip relative shrink-0 w-full" data-name="Table">
      <Frame4 />
      <PeriodeA />
      <PeriodeA1 />
      <PeriodeA2 />
      <PeriodeA3 />
      <PeriodeA4 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      <Table />
      <button className="content-stretch cursor-pointer flex gap-[8px] h-[36px] items-center justify-center px-[12px] py-[8px] relative rounded-[28px] shrink-0" data-name="button">
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="plus">
          <div className="absolute inset-[20.83%]" data-name="Vector">
            <div className="absolute inset-[-6.43%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.1667 13.1667">
                <g id="Vector">
                  <path d="M6.58333 0.75V12.4167Z" fill="var(--fill-0, #016699)" />
                  <path d="M0.75 6.58333H12.4167Z" fill="var(--fill-0, #016699)" />
                  <path d={svgPaths.p2593f8c0} stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-left">Add Program</p>
      </button>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <Frame7 />
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <p className="font-['Avenir:Heavy',sans-serif] h-[19px] leading-[normal] not-italic relative shrink-0 text-[#343a40] text-[14px] w-full whitespace-pre-wrap">Create IDP</p>
      <Frame5 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch cursor-pointer flex gap-[8px] items-center relative shrink-0">
      <button className="content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[12px] py-[8px] relative rounded-[28px] shrink-0 w-[106px]" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
        <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-left">Cancel</p>
      </button>
      <button className="bg-[#016699] content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[12px] py-[8px] relative rounded-[28px] shrink-0 w-[106px]" data-name="button">
        <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-left text-white">Submit</p>
      </button>
    </div>
  );
}

export default function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-end relative size-full">
      <Frame6 />
      <Frame8 />
    </div>
  );
}
