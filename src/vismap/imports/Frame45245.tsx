import svgPaths from "./svg-kurj1fg418";
import imgEllipse255 from "/vismap-assets/9b63e5bd4e2520123fc46e943c3e0ee5a06a802c.png";
import imgEllipse253 from "/vismap-assets/6c4e731f615cf4e33bd8da9bcd89ffb6f4da2277.png";
import imgEllipse254 from "/vismap-assets/d79ed63fed6d449c3e1115d1c3c1d9c3c7f0d68b.png";
import imgEllipse256 from "/vismap-assets/8deb217da5241e072e921070563e646d28359699.png";

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
              <span className="text-[#495057]">{`Director of Product Design `}</span>
              <span className="text-[#adb5bd]">(Thomas)</span>
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
            <p className="leading-[normal]">Jason Roberts</p>
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
            <p className="leading-[normal]">Victoria Bell</p>
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

function ChevronDown3() {
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

function InputField3() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#343a40] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">Theresa Webb</p>
          </div>
          <ChevronDown3 />
        </div>
      </div>
    </div>
  );
}

function Select4() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Select">
      <InputField3 />
    </div>
  );
}

function X2() {
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

function Select6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Select 6">
      <Select4 />
      <X2 />
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
    <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-[4.3%] right-[0.99%] top-[calc(50%+3.5px)] translate-y-[-50%]" data-name="From To">
      <Select2 />
      <Select3 />
      <Select6 />
      <Select5 />
    </div>
  );
}

function Group3471() {
  return (
    <div className="absolute bottom-[70.57%] contents left-0 right-[94.7%] top-[18.73%]">
      <div className="absolute bottom-[70.57%] left-0 right-[94.7%] top-[18.73%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 17">
          <path d={svgPaths.p35fb2c00} fill="var(--fill-0, white)" id="Ellipse 244" stroke="var(--stroke-0, #ADB5BD)" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal inset-[18.73%_95.69%_71.91%_0.99%] justify-center leading-[0] text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">vs</p>
      </div>
    </div>
  );
}

function Group3472() {
  return (
    <div className="absolute bottom-[43.81%] contents left-0 right-[94.7%] top-[45.48%]">
      <div className="absolute bottom-[43.81%] left-0 right-[94.7%] top-[45.48%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 17">
          <path d={svgPaths.p35fb2c00} fill="var(--fill-0, white)" id="Ellipse 244" stroke="var(--stroke-0, #ADB5BD)" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal inset-[45.48%_95.69%_45.15%_0.99%] justify-center leading-[0] text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">vs</p>
      </div>
    </div>
  );
}

function Group3473() {
  return (
    <div className="absolute bottom-[15.3%] contents left-0 right-[94.7%] top-[74%]">
      <div className="absolute bottom-[15.3%] left-0 right-[94.7%] top-[74%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 17">
          <path d={svgPaths.p35fb2c00} fill="var(--fill-0, white)" id="Ellipse 244" stroke="var(--stroke-0, #ADB5BD)" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal inset-[74%_95.69%_16.64%_0.99%] justify-center leading-[0] text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">vs</p>
      </div>
    </div>
  );
}

function Component52() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Component 52">
      <div className="absolute bottom-[1.33%] flex items-center justify-center left-[2.32%] right-[97.68%] top-0">
        <div className="flex-none h-px rotate-[90deg] w-[148px]">
          <div className="relative size-full">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 148 1">
                <line id="Line 54" stroke="var(--stroke-0, #ADB5BD)" x2="148" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <FromTo />
      <Group3471 />
      <Group3472 />
      <Group3473 />
    </div>
  );
}

function Frame45244() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[174px] items-start relative shrink-0 w-full">
      <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Compare Employees</p>
      <Component52 />
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

function Label4() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Avenir:Heavy',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre">Add Variable to Compare</p>
    </div>
  );
}

function ChevronDown6() {
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

function InputField4() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#adb5bd] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="[white-space-collapse:collapse] leading-[normal] overflow-ellipsis overflow-hidden">Choose Variable</p>
          </div>
          <ChevronDown6 />
        </div>
      </div>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[176px]" data-name="TextInput">
      <Label4 />
      <InputField4 />
    </div>
  );
}

function ChevronDown7() {
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
    <div className="[grid-area:1_/_1] box-border content-stretch flex gap-[3.685px] items-center ml-[152.527px] mt-[18.176px] p-[4.054px] relative size-[22.85px]">
      <ChevronDown7 />
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
    <div className="[grid-area:1_/_1] box-border content-stretch flex gap-[7px] items-center ml-[25.52px] mt-[97px] relative">
      <Chip />
      <p className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[12.464px] text-center text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        43%
      </p>
    </div>
  );
}

function Group3598() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] ml-[68.457px] mt-0 relative size-[49.335px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
          <circle cx="24.6674" cy="24.6674" fill="var(--fill-0, #F4F4F4)" id="Ellipse 57" r="24.6674" />
        </svg>
      </div>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ml-[93.688px] mt-[58.163px] relative text-[12.464px] text-black text-center text-nowrap translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Jason Roberts
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Regular',_sans-serif] font-normal leading-[normal] ml-[94.305px] mt-[77.378px] relative text-[#58595b] text-[8.309px] text-center text-nowrap translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Sales Manager
      </p>
      <Frame3383 />
      <Frame45243 />
      <div className="[grid-area:1_/_1] ml-[70px] mt-[2px] relative size-[46px]">
        <img alt="" className="block max-w-none size-full" height="46" src={imgEllipse255} width="46" />
      </div>
    </div>
  );
}

function Chip1() {
  return (
    <div className="[grid-area:1_/_1] bg-[#fff2e4] box-border content-stretch flex gap-[1.688px] h-[13.39px] items-center justify-center ml-[28.938px] mt-[94.515px] px-[6.008px] py-[1.502px] relative rounded-[600.76px]" data-name="Chip">
      <div aria-hidden="true" className="absolute border-[#ca6f00] border-[0.751px] border-solid inset-0 pointer-events-none rounded-[600.76px]" />
      <p className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#ca6f00] text-[7.509px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        NEED DEVELOPMENT
      </p>
    </div>
  );
}

function KategoriTalent() {
  return <div className="[grid-area:1_/_1] ml-[87.152px] mt-[41.545px] size-[12.463px]" data-name="Kategori Talent" />;
}

function ChevronDown8() {
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
    <div className="[grid-area:1_/_1] box-border content-stretch flex gap-[3.685px] items-center ml-[152.527px] mt-[18.176px] p-[4.054px] relative size-[22.85px]">
      <ChevronDown8 />
    </div>
  );
}

function Group3599() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] ml-[68.457px] mt-0 relative size-[49.335px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
          <circle cx="24.6674" cy="24.6674" fill="var(--fill-0, #F4F4F4)" id="Ellipse 57" r="24.6674" />
        </svg>
      </div>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ml-[94.188px] mt-[58.163px] relative text-[12.464px] text-black text-center text-nowrap translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>{`Victoria  Bell`}</p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ml-[136.055px] mt-[92.438px] relative text-[#495057] text-[12.464px] text-center text-nowrap translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        53%
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Regular',_sans-serif] font-normal leading-[normal] ml-[93.805px] mt-[77.378px] relative text-[#58595b] text-[8.309px] text-center text-nowrap translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Account Manager
      </p>
      <Chip1 />
      <KategoriTalent />
      <Frame3384 />
      <div className="[grid-area:1_/_1] ml-[70px] mt-[2px] relative size-[46px]">
        <img alt="" className="block max-w-none size-full" height="46" src={imgEllipse253} width="46" />
      </div>
    </div>
  );
}

function Chip2() {
  return (
    <div className="[grid-area:1_/_1] bg-[#f2f9f7] box-border content-stretch flex gap-[1.688px] h-[13.39px] items-center justify-center ml-[60.5px] mt-[94px] px-[6.008px] py-[1.502px] relative rounded-[600.76px]" data-name="Chip">
      <div aria-hidden="true" className="absolute border-[#00875a] border-[0.751px] border-solid inset-0 pointer-events-none rounded-[600.76px]" />
      <p className="font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#00875a] text-[7.509px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Ready
      </p>
    </div>
  );
}

function KategoriTalent1() {
  return <div className="[grid-area:1_/_1] ml-[87.152px] mt-[41.545px] size-[12.463px]" data-name="Kategori Talent" />;
}

function ChevronDown9() {
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

function Frame3385() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex gap-[3.685px] items-center ml-[152.527px] mt-[18.176px] p-[4.054px] relative size-[22.85px]">
      <ChevronDown9 />
    </div>
  );
}

function Group3601() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] ml-[68.457px] mt-0 relative size-[49.335px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
          <circle cx="24.6674" cy="24.6674" fill="var(--fill-0, #F4F4F4)" id="Ellipse 57" r="24.6674" />
        </svg>
      </div>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ml-[94.188px] mt-[58.163px] relative text-[12.464px] text-black text-center text-nowrap translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Thersa Webb
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ml-[114.5px] mt-[92.438px] relative text-[#495057] text-[12.464px] text-center text-nowrap translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        87%
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Regular',_sans-serif] font-normal leading-[normal] ml-[93.805px] mt-[77.378px] relative text-[#58595b] text-[8.309px] text-center text-nowrap translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Visual Designer
      </p>
      <Chip2 />
      <KategoriTalent1 />
      <Frame3385 />
      <div className="[grid-area:1_/_1] ml-[70px] mt-[2px] relative size-[46px]">
        <img alt="" className="block max-w-none size-full" height="46" src={imgEllipse254} width="46" />
      </div>
    </div>
  );
}

function Chip3() {
  return (
    <div className="[grid-area:1_/_1] bg-[#f8f9fa] box-border content-stretch flex gap-[1.688px] h-[13.39px] items-center justify-center ml-[55.953px] mt-[94.515px] px-[6.008px] py-[1.502px] relative rounded-[600.76px] w-[36.942px]" data-name="Chip">
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
      <div className="[grid-area:1_/_1] ml-[68.936px] mt-0 relative size-[49.335px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 50 50">
          <circle cx="24.6674" cy="24.6674" fill="var(--fill-0, #F4F4F4)" id="Ellipse 57" r="24.6674" />
        </svg>
      </div>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ml-[94.667px] mt-[58.163px] relative text-[12.464px] text-black text-center text-nowrap translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Thomas Brown
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Bold',_sans-serif] font-bold leading-[normal] ml-[111.536px] mt-[92.438px] relative text-[#00875a] text-[12.464px] text-center text-nowrap translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        86%
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Regular',_sans-serif] font-normal leading-[normal] ml-[94.283px] mt-[77.378px] relative text-[#58595b] text-[8.309px] text-center text-nowrap translate-x-[-50%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Director of Enterprise Sales
      </p>
      <p className="[grid-area:1_/_1] font-['Open_Sans:Regular',_sans-serif] font-normal leading-[normal] ml-0 mt-[11.425px] relative text-[#58595b] text-[9.348px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Incumbant
      </p>
      <Chip3 />
    </div>
  );
}

function Group3600() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group3483 />
      <div className="[grid-area:1_/_1] ml-[71px] mt-[2px] relative size-[46px]">
        <img alt="" className="block max-w-none size-full" height="46" src={imgEllipse256} width="46" />
      </div>
    </div>
  );
}

function Frame44892() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center px-[8px] py-0 relative w-full">
          <TextInput1 />
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
          <Group3601 />
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
      </div>
    </div>
  );
}

function X3() {
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
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[176px]">
      <div className="basis-0 flex flex-col font-['Avenir:Heavy',_sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[12px]">
        <p className="leading-[normal]">Tenure</p>
      </div>
      <X3 />
    </div>
  );
}

function Frame44862() {
  return (
    <div className="bg-[#f8f9fa] box-border content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[8px] shrink-0 w-[809px]">
      <Frame44863 />
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">27 Months</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">31 Months</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">18 Months</p>
      </div>
    </div>
  );
}

function Frame44884() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center relative shrink-0 w-[134.5px]">
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Frame44885() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame44862 />
      <Frame44884 />
    </div>
  );
}

function X4() {
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

function Frame44864() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[176px]">
      <div className="basis-0 flex flex-col font-['Avenir:Heavy',_sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[12px]">
        <p className="leading-[normal]">Amanah</p>
      </div>
      <X4 />
    </div>
  );
}

function Frame44865() {
  return (
    <div className="bg-[#f8f9fa] box-border content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[8px] shrink-0 w-[809px]">
      <Frame44864 />
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">2</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">2</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Frame44894() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center relative shrink-0 w-[134.5px]">
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Frame44891() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame44865 />
      <Frame44894 />
    </div>
  );
}

function X5() {
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

function Frame44867() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[176px]">
      <div className="basis-0 flex flex-col font-['Avenir:Heavy',_sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[12px]">
        <p className="leading-[normal]">Communication</p>
      </div>
      <X5 />
    </div>
  );
}

function Frame44868() {
  return (
    <div className="bg-[#f8f9fa] box-border content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[8px] shrink-0 w-[809px]">
      <Frame44867 />
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">2</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">2</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Frame44895() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center relative shrink-0 w-[134.5px]">
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">4</p>
      </div>
    </div>
  );
}

function Frame44886() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame44868 />
      <Frame44895 />
    </div>
  );
}

function X6() {
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

function Frame44872() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[176px]">
      <div className="basis-0 flex flex-col font-['Avenir:Heavy',_sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[12px]">
        <p className="leading-[normal]">Time Management</p>
      </div>
      <X6 />
    </div>
  );
}

function Frame44873() {
  return (
    <div className="bg-[#f8f9fa] box-border content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[8px] shrink-0 w-[809px]">
      <Frame44872 />
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">1</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">1</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Frame44896() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center relative shrink-0 w-[134.5px]">
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Frame44887() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame44873 />
      <Frame44896 />
    </div>
  );
}

function X7() {
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

function Frame44874() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[176px]">
      <div className="basis-0 flex flex-col font-['Avenir:Heavy',_sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[12px]">
        <p className="leading-[normal]">Creative</p>
      </div>
      <X7 />
    </div>
  );
}

function Frame44875() {
  return (
    <div className="bg-[#f8f9fa] box-border content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[8px] shrink-0 w-[809px]">
      <Frame44874 />
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">4</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">4</p>
      </div>
    </div>
  );
}

function Frame44897() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center relative shrink-0 w-[134.5px]">
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Frame44889() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame44875 />
      <Frame44897 />
    </div>
  );
}

function X8() {
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

function Frame44876() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[176px]">
      <div className="basis-0 flex flex-col font-['Avenir:Heavy',_sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[12px]">
        <p className="leading-[normal]">Problem Solving</p>
      </div>
      <X8 />
    </div>
  );
}

function Frame44877() {
  return (
    <div className="bg-[#f8f9fa] box-border content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[8px] shrink-0 w-[809px]">
      <Frame44876 />
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">4</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Frame44898() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center relative shrink-0 w-[134.5px]">
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Frame44890() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame44877 />
      <Frame44898 />
    </div>
  );
}

function X9() {
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

function Frame44878() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[176px]">
      <div className="basis-0 flex flex-col font-['Avenir:Heavy',_sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[12px]">
        <p className="leading-[normal]">Proactive</p>
      </div>
      <X9 />
    </div>
  );
}

function Frame44879() {
  return (
    <div className="bg-[#f8f9fa] box-border content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[8px] shrink-0 w-[809px]">
      <Frame44878 />
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
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">4</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
      <div className="basis-0 flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">4</p>
      </div>
    </div>
  );
}

function Frame44899() {
  return (
    <div className="content-stretch flex gap-[16px] h-[40px] items-center relative shrink-0 w-[134.5px]">
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
      <div className="flex flex-col font-['Open_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">3</p>
      </div>
    </div>
  );
}

function Frame44888() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame44879 />
      <Frame44899 />
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
      <Frame44885 />
      <Frame44891 />
      <Frame44886 />
      <Frame44887 />
      <Frame44889 />
      <Frame44890 />
      <Frame44888 />
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
