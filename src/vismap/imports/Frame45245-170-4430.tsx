import svgPaths from "./svg-xltyjsadnr";
import imgEllipse255 from "/vismap-assets/9b63e5bd4e2520123fc46e943c3e0ee5a06a802c.png";
import imgEllipse253 from "/vismap-assets/c6085ab1bbd7e5967e4e3e4f4d905ff1e5d6d7ba.png";
import imgEllipse254 from "/vismap-assets/55f9f18f079dec193decdeb15f14cf34a6171290.png";

function Label() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[240px]" data-name="Label">
      <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Job Target/Benchmark</p>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="chevron-down">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function InputField() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">
              <span className="text-[#495057]">{`Position Title `}</span>
              <span className="text-[#adb5bd]">(Incumbant name)</span>
            </p>
          </div>
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="TextInput">
      <Label />
      <InputField />
    </div>
  );
}

function ChevronDown1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="chevron-down">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function InputField1() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">Employee Name</p>
          </div>
          <ChevronDown1 />
        </div>
      </div>
    </div>
  );
}

function Select() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Select">
      <InputField1 />
    </div>
  );
}

function X() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="x">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="x">
          <path d="M15 5L5 15M5 5L15 15" id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Select2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Select 2">
      <Select />
      <X />
    </div>
  );
}

function ChevronDown2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="chevron-down">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function InputField2() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">Employee Name</p>
          </div>
          <ChevronDown2 />
        </div>
      </div>
    </div>
  );
}

function Select1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Select">
      <InputField2 />
    </div>
  );
}

function X1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="x">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="x">
          <path d="M15 5L5 15M5 5L15 15" id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Select3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Select 3">
      <Select1 />
      <X1 />
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[28px] shrink-0 w-full" data-name="button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative w-full">
          <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-nowrap whitespace-pre">Add Employee</p>
        </div>
      </div>
    </div>
  );
}

function Select5() {
  return (
    <div className="content-stretch flex flex-col h-[35px] items-start justify-center relative shrink-0 w-[176px]" data-name="Select 5">
      <Button />
    </div>
  );
}

function FromTo() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[286px]" data-name="From To">
      <Select2 />
      <Select3 />
      <Select5 />
    </div>
  );
}

function Frame45244() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[174px] items-start relative shrink-0 w-full">
      <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Compare Employees</p>
      <FromTo />
    </div>
  );
}

function Frame44866() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-[17px] top-[16px] w-[302px]">
      <TextInput />
      <Frame45244 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#016699] bottom-[19px] box-border content-stretch flex gap-[8px] items-center justify-center left-[17px] px-[12px] py-[8px] rounded-[28px] w-[302px]" data-name="button">
      <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Compare</p>
    </div>
  );
}

function Component103() {
  return (
    <div className="bg-white overflow-clip relative rounded-[8px] self-stretch shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[336px]" data-name="Component 103">
      <Frame44866 />
      <Button1 />
    </div>
  );
}

function ChevronDown5() {
  return (
    <div className="relative shrink-0 size-[14.742px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="chevron-down">
          <path d={svgPaths.p1339700} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.552817" />
        </g>
      </svg>
    </div>
  );
}

function Frame3383() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex gap-[3.685px] h-[22.85px] items-center ml-[148.658px] mt-[18.176px] p-[4.054px] relative w-[22.269px]">
      <ChevronDown5 />
    </div>
  );
}

function Chip() {
  return (
    <div className="bg-[#fff2e4] box-border content-stretch flex gap-[1.688px] h-[13.39px] items-center justify-center px-[6.008px] py-[1.502px] relative rounded-[600.76px] shrink-0" data-name="Chip">
      <div aria-hidden="true" className="absolute border-[#ca6f00] border-[0.751px] border-solid inset-0 pointer-events-none rounded-[600.76px]" />
      <p className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#ca6f00] text-[7.509px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        NEED DEVELOPMENT
      </p>
    </div>
  );
}

function Frame45243() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex gap-[7px] items-center ml-[24.872px] mt-[97px] relative w-[119.89px]">
      <Chip />
      <p className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[12.464px] text-center w-[35px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        43%
      </p>
    </div>
  );
}

function Group3598() {
  return (
    <div className="basis-0 grid-cols-[max-content] grid-rows-[max-content] grow inline-grid leading-[0] min-h-px min-w-px place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] h-[49px] ml-[71.8px] mt-0 relative w-[40.615px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 41 49">
          <ellipse cx="20.3076" cy="24.5" fill="var(--fill-0, #F4F4F4)" id="Ellipse 57" rx="20.3076" ry="24.5" />
        </svg>
      </div>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ml-[91.75px] mt-[58.281px] relative text-[12.464px] text-black text-center translate-x-[-50%] w-[171px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Employee Name
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Regular',_sans-serif] font-normal leading-[normal] ml-[90.25px] mt-[77.281px] relative text-[#58595b] text-[8.309px] text-center translate-x-[-50%] w-[168px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Position Title
      </p>
      <Frame3383 />
      <Frame45243 />
      <div className="[grid-area:1_/_1] ml-[67.247px] mt-[2px] relative size-[46px]">
        <img alt="" className="block max-w-none size-full" height="46" src={imgEllipse255} width="46" />
      </div>
    </div>
  );
}

function Chip1() {
  return (
    <div className="[grid-area:1_/_1] bg-[#fff2e4] box-border content-stretch flex gap-[1.688px] h-[13.39px] items-center justify-center ml-[28.197px] mt-[94.516px] px-[6.008px] py-[1.502px] relative rounded-[600.76px] w-[87.729px]" data-name="Chip">
      <div aria-hidden="true" className="absolute border-[#ca6f00] border-[0.751px] border-solid inset-0 pointer-events-none rounded-[600.76px]" />
      <p className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#ca6f00] text-[7.509px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        NEED DEVELOPMENT
      </p>
    </div>
  );
}

function KategoriTalent() {
  return <div className="[grid-area:1_/_1] h-[12.463px] ml-[84.94px] mt-[41.545px] w-[12.147px]" data-name="Kategori Talent" />;
}

function ChevronDown6() {
  return (
    <div className="relative shrink-0 size-[14.742px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="chevron-down">
          <path d={svgPaths.p1339700} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.552817" />
        </g>
      </svg>
    </div>
  );
}

function Frame3384() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex gap-[3.685px] h-[22.85px] items-center ml-[148.658px] mt-[18.176px] p-[4.054px] relative w-[22.269px]">
      <ChevronDown6 />
    </div>
  );
}

function Group3599() {
  return (
    <div className="basis-0 grid-cols-[max-content] grid-rows-[max-content] grow inline-grid leading-[0] min-h-px min-w-px place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] h-[49.335px] ml-[66.718px] mt-0 relative w-[48.082px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 49 50">
          <ellipse cx="24.0408" cy="24.6674" fill="var(--fill-0, #F4F4F4)" id="Ellipse 57" rx="24.0408" ry="24.6674" />
        </svg>
      </div>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ml-[90.997px] mt-[58px] relative text-[12.464px] text-black text-center translate-x-[-50%] w-[172px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Employee Name
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ml-[138.502px] mt-[92px] relative text-[#495057] text-[12.464px] text-center translate-x-[-50%] w-[37px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        53%
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Regular',_sans-serif] font-normal leading-[normal] ml-[91.003px] mt-[77px] relative text-[#58595b] text-[8.309px] text-center translate-x-[-50%] w-[166px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Position Title
      </p>
      <Chip1 />
      <KategoriTalent />
      <Frame3384 />
      <div className="[grid-area:1_/_1] h-[46px] ml-[68.221px] mt-[2px] relative w-[44.832px]">
        <img alt="" className="block max-w-none size-full" height="46" src={imgEllipse253} width="44.832" />
      </div>
    </div>
  );
}

function Chip2() {
  return (
    <div className="[grid-area:1_/_1] bg-[#f8f9fa] box-border content-stretch flex gap-[1.688px] h-[13.39px] items-center justify-center ml-[54.391px] mt-[94.515px] px-[6.008px] py-[1.502px] relative rounded-[600.76px] w-[35.912px]" data-name="Chip">
      <div aria-hidden="true" className="absolute border-[#00875a] border-[0.751px] border-solid inset-0 pointer-events-none rounded-[600.76px]" />
      <p className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#00875a] text-[7.509px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        ready
      </p>
    </div>
  );
}

function Group3483() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <div className="[grid-area:1_/_1] h-[49.335px] ml-[67.012px] mt-0 relative w-[47.959px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 50">
          <ellipse cx="23.9792" cy="24.6674" fill="var(--fill-0, #F4F4F4)" id="Ellipse 57" rx="23.9792" ry="24.6674" />
        </svg>
      </div>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ml-[90.754px] mt-[58px] relative text-[12.464px] text-black text-center translate-x-[-50%] w-[174px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Employee Name
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ml-[118.242px] mt-[92px] relative text-[#00875a] text-[12.464px] text-center translate-x-[-50%] w-[45px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        86%
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Regular',_sans-serif] font-normal leading-[normal] ml-[91.654px] mt-[77.378px] relative text-[#58595b] text-[8.309px] text-center translate-x-[-50%] w-[103.043px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Position Title
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Regular',_sans-serif] font-normal leading-[normal] ml-0 mt-[11px] relative text-[#58595b] text-[9.348px] w-[74px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Incumbant
      </p>
      <Chip2 />
    </div>
  );
}

function Group3600() {
  return (
    <div className="basis-0 grid-cols-[max-content] grid-rows-[max-content] grow inline-grid leading-[0] min-h-px min-w-px place-items-start relative shrink-0">
      <Group3483 />
      <div className="[grid-area:1_/_1] h-[46px] ml-[69.266px] mt-[2px] relative w-[44.717px]">
        <img alt="" className="block max-w-none size-full" height="46" src={imgEllipse254} width="44.717" />
      </div>
    </div>
  );
}

function Frame44892() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <div className="basis-0 bg-white grow h-[19px] min-h-px min-w-px shrink-0" />
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "100", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[100px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 100 1">
                <line id="Line 88" stroke="var(--stroke-0, #CED4DA)" strokeOpacity="0.854902" x2="100" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Group3598 />
      <Group3599 />
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "97.984375", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[98px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 98 1">
                <line id="Line 89" stroke="var(--stroke-0, #CED4DA)" strokeOpacity="0.854902" x2="98" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Group3600 />
    </div>
  );
}

function X2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="x">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="x">
          <path d="M12 4L4 12M4 4L12 12" id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame44863() {
  return (
    <div className="basis-0 content-stretch flex gap-[4px] grow items-center min-h-px min-w-px relative shrink-0">
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Aspect Competency A</p>
      </div>
      <X2 />
    </div>
  );
}

function Frame44862() {
  return (
    <div className="basis-0 bg-[#f8f9fa] grow min-h-px min-w-px relative rounded-[8px] shrink-0">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center p-[8px] relative w-full">
          <Frame44863 />
        </div>
      </div>
    </div>
  );
}

function Frame44885() {
  return (
    <div className="basis-0 bg-[#f8f9fa] grow min-h-px min-w-px relative rounded-[8px] shrink-0">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center p-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame44886() {
  return (
    <div className="basis-0 bg-[#f8f9fa] grow min-h-px min-w-px relative rounded-[8px] shrink-0">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center p-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">2</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame44887() {
  return (
    <div className="basis-0 bg-[#e7f5ff] grow min-h-px min-w-px relative rounded-[8px] shrink-0">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center p-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">4</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame44888() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame44862 />
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "40", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[40px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 1">
                <line id="Line 88" stroke="var(--stroke-0, #CED4DA)" strokeOpacity="0.854902" x2="40" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame44885 />
      <Frame44886 />
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "40", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[40px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 1">
                <line id="Line 88" stroke="var(--stroke-0, #CED4DA)" strokeOpacity="0.854902" x2="40" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame44887 />
    </div>
  );
}

function Plus() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="plus">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="plus">
          <path d={svgPaths.p3b397100} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame44878() {
  return (
    <div className="basis-0 content-stretch flex gap-[4px] grow items-center min-h-px min-w-px relative shrink-0">
      <Plus />
      <div className="basis-0 flex flex-col font-['Avenir:Heavy',_sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#016699] text-[12px]">
        <p className="leading-[normal]">Add Variable</p>
      </div>
    </div>
  );
}

function Frame44879() {
  return (
    <div className="bg-[#f8f9fa] box-border content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[8px] shrink-0 w-[182.25px]">
      <Frame44878 />
    </div>
  );
}

function Frame44880() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[176px]">
      <div className="basis-0 flex flex-col font-['Avenir:Heavy',_sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[12px]">
        <p className="leading-[normal]">Action</p>
      </div>
    </div>
  );
}

function ExternalLink() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="external-link">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="external-link">
          <path d={svgPaths.p1f44b200} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center pl-0 pr-[12px] py-[8px] relative rounded-[28px] shrink-0" data-name="button">
      <ExternalLink />
    </div>
  );
}

function UserUp() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="user-up">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="user-up">
          <path d={svgPaths.pa520580} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[28px] shrink-0" data-name="button">
      <UserUp />
    </div>
  );
}

function Frame44869() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Frame44893() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[16px] items-center px-[8px] py-0 relative rounded-[8px] shrink-0 w-[809px]">
      <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)]" />
      <Frame44880 />
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "25.984375", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[26px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 1">
                <line id="Line 88" stroke="var(--stroke-0, #CED4DA)" strokeOpacity="0.854902" x2="26" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {[...Array(3).keys()].map((_, i) => (
        <Frame44869 key={i} />
      ))}
    </div>
  );
}

function Comparison() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0" data-name="Comparison">
      <Frame44892 />
      {[...Array(6).keys()].map((_, i) => (
        <Frame44888 key={i} />
      ))}
      <Frame44879 />
      <Frame44893 />
    </div>
  );
}

export default function Frame45245() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative size-full">
      <Component103 />
      <Comparison />
    </div>
  );
}
