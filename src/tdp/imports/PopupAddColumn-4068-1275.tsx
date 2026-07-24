// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import svgPaths from "./svg-598bjhmvk3";

function Frame() {
  return (
    <div className="content-stretch flex h-[22px] items-center justify-between relative shrink-0 w-full">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#58595b] text-[16px] whitespace-nowrap">Visible Columns</p>
      <button className="block cursor-pointer overflow-clip relative shrink-0 size-[20px]" data-name="x">
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

function InputField() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px overflow-hidden relative text-[#adb5bd] text-[12px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal] overflow-hidden">Search</p>
          </div>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="search">
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <div className="absolute inset-[-6.25%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
                  <path d={svgPaths.p216c8100} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextWIcon() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Basic Information</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-right">
        <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-7.5%_-15%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.5 11.5">
              <path d={svgPaths.p35ac1680} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectOption() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon />
        </div>
      </div>
    </div>
  );
}

function TextWIcon1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Competency</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-left">
        <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-7.5%_-15%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.5 11.5">
              <path d={svgPaths.p27040a80} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectOption1() {
  return (
    <div className="bg-[#f8f9fa] h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon1 />
        </div>
      </div>
    </div>
  );
}

function TextWIcon2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Commitment</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-right">
        <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-7.5%_-15%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.5 11.5">
              <path d={svgPaths.p35ac1680} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectOption2() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon2 />
        </div>
      </div>
    </div>
  );
}

function TextWIcon3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Contribution</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-right">
        <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-7.5%_-15%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.5 11.5">
              <path d={svgPaths.p35ac1680} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectOption3() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon3 />
        </div>
      </div>
    </div>
  );
}

function TextWIcon4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Others</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-right">
        <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-7.5%_-15%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.5 11.5">
              <path d={svgPaths.p35ac1680} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectOption4() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon4 />
        </div>
      </div>
    </div>
  );
}

function TextWIcon5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Aspect</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-right">
        <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-7.5%_-15%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.5 11.5">
              <path d={svgPaths.p35ac1680} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectOption5() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon5 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full">
      <SelectOption />
      <SelectOption1 />
      <SelectOption2 />
      <SelectOption3 />
      <SelectOption4 />
      <SelectOption5 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[4px] items-start relative rounded-[4px] shrink-0 w-[253px]">
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="TextInput">
        <InputField />
      </div>
      <Frame3 />
    </div>
  );
}

function Box() {
  return (
    <div className="bg-[#016699] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="check">
        <div className="absolute inset-[22.92%_16.67%_27.08%_12.5%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.3333 8">
            <path clipRule="evenodd" d={svgPaths.p30901900} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TextWIcon6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
        <Box />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Role</p>
      </div>
    </div>
  );
}

function SelectOption6() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon6 />
        </div>
      </div>
    </div>
  );
}

function Box1() {
  return (
    <div className="bg-[#016699] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="check">
        <div className="absolute inset-[22.92%_16.67%_27.08%_12.5%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.3333 8">
            <path clipRule="evenodd" d={svgPaths.p30901900} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TextWIcon7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
        <Box1 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Department</p>
      </div>
    </div>
  );
}

function SelectOption7() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon7 />
        </div>
      </div>
    </div>
  );
}

function Box2() {
  return (
    <div className="bg-[#016699] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="check">
        <div className="absolute inset-[22.92%_16.67%_27.08%_12.5%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.3333 8">
            <path clipRule="evenodd" d={svgPaths.p30901900} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TextWIcon8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
        <Box2 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Level</p>
      </div>
    </div>
  );
}

function SelectOption8() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon8 />
        </div>
      </div>
    </div>
  );
}

function TextWIcon9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Aspect</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-left">
        <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-7.5%_-15%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.5 11.5">
              <path d={svgPaths.p27040a80} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectOption9() {
  return (
    <div className="bg-[#f8f9fa] h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon9 />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[4px] self-stretch shrink-0 w-[253px]">
      <SelectOption6 />
      <SelectOption7 />
      <SelectOption8 />
      <SelectOption9 />
    </div>
  );
}

function Box3() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextWIcon10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
        <Box3 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Leadership</p>
      </div>
    </div>
  );
}

function SelectOption10() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon10 />
        </div>
      </div>
    </div>
  );
}

function Box4() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextWIcon11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
        <Box4 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Aspect 2</p>
      </div>
    </div>
  );
}

function SelectOption11() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon11 />
        </div>
      </div>
    </div>
  );
}

function Box5() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextWIcon12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
        <Box5 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Aspect 3</p>
      </div>
    </div>
  );
}

function SelectOption12() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon12 />
        </div>
      </div>
    </div>
  );
}

function Box6() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextWIcon13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
        <Box6 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Aspect 4</p>
      </div>
    </div>
  );
}

function SelectOption13() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon13 />
        </div>
      </div>
    </div>
  );
}

function Box7() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextWIcon14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
        <Box7 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Aspect 5</p>
      </div>
    </div>
  );
}

function SelectOption14() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon14 />
        </div>
      </div>
    </div>
  );
}

function Box8() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextWIcon15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
        <Box8 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Aspect 6</p>
      </div>
    </div>
  );
}

function SelectOption15() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon15 />
        </div>
      </div>
    </div>
  );
}

function Box9() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextWIcon16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Text w/ Icon">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
        <Box9 />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Aspect 7</p>
      </div>
    </div>
  );
}

function SelectOption16() {
  return (
    <div className="h-[36px] relative rounded-[4px] shrink-0 w-full" data-name="Select / Option">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[12px] py-[8px] relative size-full">
          <TextWIcon16 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[4px] self-stretch shrink-0 w-[253px]">
      <SelectOption10 />
      <SelectOption11 />
      <SelectOption12 />
      <SelectOption13 />
      <SelectOption14 />
      <SelectOption15 />
      <SelectOption16 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
      <Frame2 />
      <div className="flex h-0 items-center justify-center relative self-center shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none h-full rotate-90">
          <div className="h-full relative w-[262px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 262 1">
                <line id="Line 104" stroke="var(--stroke-0, #DEE2E6)" x2="262" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame1 />
      <div className="flex h-0 items-center justify-center relative self-center shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none h-full rotate-90">
          <div className="h-full relative w-[262px]">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 262 1">
                <line id="Line 104" stroke="var(--stroke-0, #DEE2E6)" x2="262" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame5 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[28px] shrink-0" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
        <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] whitespace-nowrap">Cancel</p>
      </div>
      <div className="bg-[#016699] content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[28px] shrink-0" data-name="button">
        <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">Apply</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Button">
      <div className="content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[28px] shrink-0" data-name="button">
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="upload">
          <div className="absolute inset-[16.67%_16.67%_12.5%_16.67%]" data-name="Vector">
            <div className="absolute inset-[-5.29%_-5.63%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8333 15.6667">
                <path d={svgPaths.p2168f880} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
        <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] whitespace-nowrap">Add Data</p>
      </div>
      <Frame6 />
    </div>
  );
}

export default function PopupAddColumn() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] size-full" data-name="popup Add Column">
      <Frame />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 797 1">
            <line id="Line 104" stroke="var(--stroke-0, #DEE2E6)" x2="797" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame4 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 797 1">
            <line id="Line 104" stroke="var(--stroke-0, #DEE2E6)" x2="797" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Button />
    </div>
  );
}