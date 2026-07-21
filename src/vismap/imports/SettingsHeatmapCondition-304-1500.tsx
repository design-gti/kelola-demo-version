import svgPaths from "./svg-rcu42uuv16";

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
    <div className="content-stretch flex h-[22px] items-center justify-between relative shrink-0 w-full">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#58595b] text-[16px] text-nowrap whitespace-pre">Settings Heatmap Condition</p>
      <X />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Criteria</p>
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
            <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">Readiness Score</p>
          </div>
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[52px] items-start relative shrink-0 w-[461px]" data-name="TextInput">
      <Label />
      <InputField />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <TextInput />
      <div className="h-0 relative shrink-0 w-[461px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 461 1">
            <line id="Line 30" stroke="var(--stroke-0, #DEE2E6)" x2="461" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Nilai Minimum</p>
    </div>
  );
}

function InputField1() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#adb5bd] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[200px]" data-name="TextInput">
      <Label1 />
      <InputField1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Nilai Maksimum</p>
    </div>
  );
}

function Selector() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="selector">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="selector">
          <g id="Vector">
            <path d={svgPaths.p7474000} fill="var(--fill-0, #868E96)" />
            <path d={svgPaths.p2dac3a00} fill="var(--fill-0, #868E96)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function InputField2() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">65</p>
          </div>
          <Selector />
        </div>
      </div>
    </div>
  );
}

function TextInput2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[200px]" data-name="TextInput">
      <Label2 />
      <InputField2 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <div className="flex flex-row items-center self-stretch">
        <div className="bg-[#de350b] h-full shrink-0 w-[29px]" />
      </div>
      <TextInput1 />
      <TextInput2 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Nilai Minimum</p>
    </div>
  );
}

function InputField3() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#adb5bd] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">66</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[200px]" data-name="TextInput">
      <Label3 />
      <InputField3 />
    </div>
  );
}

function Label4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Nilai Maksimum</p>
    </div>
  );
}

function Selector1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="selector">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="selector">
          <g id="Vector">
            <path d={svgPaths.p7474000} fill="var(--fill-0, #868E96)" />
            <path d={svgPaths.p2dac3a00} fill="var(--fill-0, #868E96)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function InputField4() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">80</p>
          </div>
          <Selector1 />
        </div>
      </div>
    </div>
  );
}

function TextInput4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[200px]" data-name="TextInput">
      <Label4 />
      <InputField4 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <div className="flex flex-row items-center self-stretch">
        <div className="bg-[#fd9f28] h-full shrink-0 w-[29px]" />
      </div>
      <TextInput3 />
      <TextInput4 />
    </div>
  );
}

function Label5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Nilai Minimum</p>
    </div>
  );
}

function InputField5() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#adb5bd] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">81</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[200px]" data-name="TextInput">
      <Label5 />
      <InputField5 />
    </div>
  );
}

function Label6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Nilai Maksimum</p>
    </div>
  );
}

function Selector2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="selector">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="selector">
          <g id="Vector">
            <path d={svgPaths.p7474000} fill="var(--fill-0, #868E96)" />
            <path d={svgPaths.p2dac3a00} fill="var(--fill-0, #868E96)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function InputField6() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#adb5bd] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">100</p>
          </div>
          <Selector2 />
        </div>
      </div>
    </div>
  );
}

function TextInput6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[200px]" data-name="TextInput">
      <Label6 />
      <InputField6 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <div className="flex flex-row items-center self-stretch">
        <div className="bg-[#016699] h-full shrink-0 w-[29px]" />
      </div>
      <TextInput5 />
      <TextInput6 />
    </div>
  );
}

function Button() {
  return (
    <button className="box-border content-stretch cursor-pointer flex gap-[8px] items-center justify-center overflow-visible px-[12px] py-[8px] relative rounded-[28px] shrink-0 w-[80px]" data-name="button">
      <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-nowrap whitespace-pre">Cancel</p>
    </button>
  );
}

function Button1() {
  return (
    <div className="bg-[#016699] box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative rounded-[28px] shrink-0 w-[107px]" data-name="button">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Save</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0" data-name="Button">
      <Button />
      <Button1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0 w-full">
      <Button2 />
    </div>
  );
}

export default function SettingsHeatmapCondition() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] size-full" data-name="Settings Heatmap Condition">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative size-full">
          <Frame />
          <Frame5 />
          <Frame1 />
          <Frame2 />
          <Frame4 />
          <Frame3 />
        </div>
      </div>
    </div>
  );
}
