// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import svgPaths from "./svg-sjz6a9ecv";
import imgEllipse264 from "figma:asset/c463f8c0e2fba9e21d3fc8e0fea52cd7725194b2.png";
import imgEllipse262 from "figma:asset/b239abe662f813ea6e91c0fc3e4a2ac8da2b0168.png";
import imgEllipse267 from "figma:asset/11862ca4d1c101c2f6a8726ad1b7642a296a3e35.png";
import imgEllipse263 from "figma:asset/d4b05639b18a7193545692643479aa26b0842e52.png";
import imgEllipse265 from "figma:asset/ccac20ffa679c63d58c00faef2e2ca9373811788.png";
import imgEllipse266 from "figma:asset/a33b8818e16111d0828d156e16d75673c10bc105.png";

function Label() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        X-Axis (Horizontal)
      </p>
    </div>
  );
}

function SelectValue() {
  return (
    <div className="h-[20px] relative shrink-0 w-[59.625px]" data-name="SelectValue">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#1a1a1a] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Potential
        </p>
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="ChevronDownIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ChevronDownIcon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function SelectTrigger() {
  return (
    <div className="bg-[#f9fafb] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="SelectTrigger">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <SelectValue />
          <ChevronDownIcon />
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Label />
      <SelectTrigger />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Y-Axis (Vertical)
      </p>
    </div>
  );
}

function SelectValue1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[86.266px]" data-name="SelectValue">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#1a1a1a] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Performance
        </p>
      </div>
    </div>
  );
}

function ChevronDownIcon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="ChevronDownIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ChevronDownIcon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function SelectTrigger1() {
  return (
    <div className="bg-[#f9fafb] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="SelectTrigger">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <SelectValue1 />
          <ChevronDownIcon1 />
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[8px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Label1 />
      <SelectTrigger1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-full" data-name="Label">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#364153] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Bubble Size
      </p>
    </div>
  );
}

function SelectValue2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[82.938px]" data-name="SelectValue">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#1a1a1a] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Engagement
        </p>
      </div>
    </div>
  );
}

function ChevronDownIcon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="ChevronDownIcon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ChevronDownIcon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function SelectTrigger2() {
  return (
    <div className="bg-[#f9fafb] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="SelectTrigger">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[13px] py-px relative size-full">
          <SelectValue2 />
          <ChevronDownIcon2 />
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="col-3 content-stretch flex flex-col gap-[8px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Label2 />
      <SelectTrigger2 />
    </div>
  );
}

function Div() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[64px] relative shrink-0 w-full" data-name="div">
      <Container />
      <Container1 />
      <Container2 />
    </div>
  );
}

function Group() {
  return (
    <div className="col-1 h-[463.335px] ml-0 mt-[7.65px] relative row-1 w-0">
      <div className="absolute inset-[-0.42%_-14.22px_0_-14.21px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.4303 465.265">
          <g id="Group 459">
            <path d={svgPaths.p2eb6abb2} fill="var(--stroke-0, #A5ADBA)" id="Vector 271" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] h-[463.335px] inline-grid ml-[30.74px] mt-0 place-items-start relative row-1 w-[15.44px]">
      <Group />
      <div className="col-1 flex h-[34.747px] items-center justify-center ml-[66.97px] mt-0 relative row-1 w-[15.44px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[15.44px] justify-center leading-[0] relative text-[#495057] text-[15.359px] text-center w-[34.747px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[15.443px]">Low</p>
          </div>
        </div>
      </div>
      <div className="col-1 flex h-[88.797px] items-center justify-center ml-[194.37px] mt-0 relative row-1 w-[15.44px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[15.44px] justify-center leading-[0] relative text-[#495057] text-[15.359px] text-center w-[88.797px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[15.443px]">Mid</p>
          </div>
        </div>
      </div>
      <div className="col-1 flex h-[42.468px] items-center justify-center ml-[365.53px] mt-0 relative row-1 w-[15.44px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[15.44px] justify-center leading-[0] relative text-[#495057] text-[15.359px] text-center w-[42.468px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[15.443px]">High</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Group3 />
      <div className="col-1 flex h-[96px] items-center justify-center ml-0 mt-[193.26px] relative row-1 w-[17px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none">
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative text-[#58595b] text-[12.799px] uppercase whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            Performance
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="absolute h-[34.558px] left-[195.72px] top-[84.48px] w-[33.278px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[33.278px] top-[calc(50%+0.64px)]">
        <div className="absolute inset-[-38.46%_-46.15%_-46.15%_-38.46%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61.4366 61.4366">
            <g filter="url(#filter0_d_4012_887)" id="Ellipse 269">
              <circle cx="29.4384" cy="29.4384" fill="var(--fill-0, #FD9F28)" fillOpacity="0.5" r="16.6391" shapeRendering="crispEdges" />
              <circle cx="29.4384" cy="29.4384" r="17.279" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="61.4366" id="filter0_d_4012_887" width="61.4366" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_887" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_887" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[2.56px] size-[28.158px] top-[3.84px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.1585 28.1585">
          <circle cx="14.0792" cy="14.0792" fill="var(--fill-0, #FD9F28)" fillOpacity="0.5" id="Ellipse 268" r="14.0792" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-[calc(50%+0.64px)]">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse264} width="23.039" />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#fff2e4] h-[152.312px] relative shrink-0 w-[326.382px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Avenir:Black',sans-serif] justify-center leading-[0] left-[24.39px] not-italic text-[#ffd176] text-[25.599px] text-center top-[17.5px] w-[48.776px]">
          <p className="leading-[normal]">6</p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.46px)] text-[#495057] text-[12.799px] text-center top-[calc(50%-1.37px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Need Coaching</p>
        </div>
        <Frame20 />
      </div>
      <div aria-hidden="true" className="absolute border-[#a5adba] border-[1.251px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame21() {
  return (
    <div className="absolute left-[171.41px] size-[28.158px] top-[101.11px]">
      <div className="absolute left-0 size-[28.158px] top-0">
        <div className="absolute inset-[-45.45%_-54.55%_-54.55%_-45.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56.3169 56.3169">
            <g filter="url(#filter0_d_4012_848)" id="Ellipse 256">
              <circle cx="26.8785" cy="26.8785" fill="var(--fill-0, #DE350B)" fillOpacity="0.5" r="14.0792" shapeRendering="crispEdges" />
              <circle cx="26.8785" cy="26.8785" r="14.7192" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56.3169" id="filter0_d_4012_848" width="56.3169" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_848" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_848" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-1/2">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse262} width="23.039" />
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="absolute left-[115.09px] size-[28.158px] top-[75.52px]">
      <div className="absolute left-0 size-[28.158px] top-0">
        <div className="absolute inset-[-45.45%_-54.55%_-54.55%_-45.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56.3169 56.3169">
            <g filter="url(#filter0_d_4012_848)" id="Ellipse 256">
              <circle cx="26.8785" cy="26.8785" fill="var(--fill-0, #DE350B)" fillOpacity="0.5" r="14.0792" shapeRendering="crispEdges" />
              <circle cx="26.8785" cy="26.8785" r="14.7192" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56.3169" id="filter0_d_4012_848" width="56.3169" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_848" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_848" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-1/2">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse267} width="23.039" />
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute left-[185.49px] size-[38.398px] top-[81.92px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[38.398px] top-1/2">
        <div className="absolute inset-[-33.33%_-40%_-40%_-33.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 66.5563 66.5563">
            <g filter="url(#filter0_d_4012_850)" id="Ellipse 272">
              <circle cx="31.9982" cy="31.9982" fill="var(--fill-0, #00875A)" fillOpacity="0.25" r="19.1989" shapeRendering="crispEdges" />
              <circle cx="31.9982" cy="31.9982" r="19.8389" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="66.5563" id="filter0_d_4012_850" width="66.5563" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_850" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_850" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[33.278px] top-1/2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.2782 33.2782">
          <circle cx="16.6391" cy="16.6391" fill="var(--fill-0, #00875A)" fillOpacity="0.25" id="Ellipse 270" r="16.6391" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[28.158px] top-1/2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.1585 28.1585">
          <circle cx="14.0792" cy="14.0792" fill="var(--fill-0, #00875A)" fillOpacity="0.25" id="Ellipse 271" r="14.0792" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-1/2">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse263} width="23.039" />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#d6e6ff] h-[152.312px] relative shrink-0 w-[327.662px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Avenir:Black',sans-serif] justify-center leading-[0] left-[24.82px] not-italic text-[25.599px] text-[rgba(0,135,90,0.2)] text-center top-[17.5px] w-[48.776px]">
          <p className="leading-[normal]">8</p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.05px)] text-[#495057] text-[12.799px] text-center top-[calc(50%-1.37px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Rising Star</p>
        </div>
        <Frame21 />
        <Frame22 />
        <Frame18 />
      </div>
      <div aria-hidden="true" className="absolute border-[#a5adba] border-[1.251px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute left-[31.89px] size-[28.158px] top-[66.56px]">
      <div className="absolute left-0 size-[28.158px] top-0">
        <div className="absolute inset-[-45.45%_-54.55%_-54.55%_-45.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56.3169 56.3169">
            <g filter="url(#filter0_d_4012_848)" id="Ellipse 256">
              <circle cx="26.8785" cy="26.8785" fill="var(--fill-0, #DE350B)" fillOpacity="0.5" r="14.0792" shapeRendering="crispEdges" />
              <circle cx="26.8785" cy="26.8785" r="14.7192" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56.3169" id="filter0_d_4012_848" width="56.3169" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_848" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_848" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-1/2">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse262} width="23.039" />
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute h-[34.558px] left-[118.93px] top-[69.12px] w-[33.278px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[33.278px] top-[calc(50%+0.64px)]">
        <div className="absolute inset-[-38.46%_-46.15%_-46.15%_-38.46%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61.4366 61.4366">
            <g filter="url(#filter0_d_4012_887)" id="Ellipse 269">
              <circle cx="29.4384" cy="29.4384" fill="var(--fill-0, #FD9F28)" fillOpacity="0.5" r="16.6391" shapeRendering="crispEdges" />
              <circle cx="29.4384" cy="29.4384" r="17.279" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="61.4366" id="filter0_d_4012_887" width="61.4366" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_887" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_887" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[2.56px] size-[28.158px] top-[3.84px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.1585 28.1585">
          <circle cx="14.0792" cy="14.0792" fill="var(--fill-0, #FD9F28)" fillOpacity="0.5" id="Ellipse 268" r="14.0792" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-[calc(50%+0.64px)]">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse264} width="23.039" />
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute left-[95.89px] size-[38.398px] top-[78.08px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[38.398px] top-1/2">
        <div className="absolute inset-[-33.33%_-40%_-40%_-33.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 66.5563 66.5563">
            <g filter="url(#filter0_d_4012_850)" id="Ellipse 272">
              <circle cx="31.9982" cy="31.9982" fill="var(--fill-0, #00875A)" fillOpacity="0.25" r="19.1989" shapeRendering="crispEdges" />
              <circle cx="31.9982" cy="31.9982" r="19.8389" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="66.5563" id="filter0_d_4012_850" width="66.5563" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_850" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_850" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[33.278px] top-1/2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.2782 33.2782">
          <circle cx="16.6391" cy="16.6391" fill="var(--fill-0, #00875A)" fillOpacity="0.25" id="Ellipse 270" r="16.6391" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[28.158px] top-1/2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.1585 28.1585">
          <circle cx="14.0792" cy="14.0792" fill="var(--fill-0, #00875A)" fillOpacity="0.25" id="Ellipse 271" r="14.0792" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-1/2">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse265} width="23.039" />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#a4c7ff] h-[152.312px] relative shrink-0 w-[326.382px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+1.62px)] text-[#495057] text-[12.799px] text-center top-[calc(50%-1.37px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Star</p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Avenir:Black',sans-serif] justify-center leading-[0] left-[24px] not-italic text-[25.599px] text-[rgba(0,135,90,0.2)] text-center top-[17.5px] w-[48.776px]">
          <p className="leading-[normal]">9</p>
        </div>
        <Frame23 />
        <Frame24 />
        <Frame19 />
      </div>
      <div aria-hidden="true" className="absolute border-[#a5adba] border-[1.251px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Avatar() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-1/2" data-name="Avatar">
      <div className="absolute inset-[0_0.01%_0_-0.01%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.0387 23.0387">
          <circle cx="11.5194" cy="11.5194" fill="var(--fill-0, #495057)" id="Ellipse 1" opacity="0.8" r="11.5194" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Open_Sans:Bold',sans-serif] font-bold inset-[27.01%_29.91%_29.59%_22.35%] justify-center leading-[0] text-[7.684px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">KR</p>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="absolute left-[266.12px] size-[28.158px] top-[108.79px]">
      <div className="absolute left-0 size-[28.158px] top-0">
        <div className="absolute inset-[-45.45%_-54.55%_-54.55%_-45.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56.3169 56.3169">
            <g filter="url(#filter0_d_4012_848)" id="Ellipse 256">
              <circle cx="26.8785" cy="26.8785" fill="var(--fill-0, #DE350B)" fillOpacity="0.5" r="14.0792" shapeRendering="crispEdges" />
              <circle cx="26.8785" cy="26.8785" r="14.7192" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56.3169" id="filter0_d_4012_848" width="56.3169" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_848" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_848" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <Avatar />
    </div>
  );
}

function Frame26() {
  return (
    <div className="absolute h-[34.558px] left-[277.64px] top-[12.8px] w-[33.278px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[33.278px] top-[calc(50%+0.64px)]">
        <div className="absolute inset-[-38.46%_-46.15%_-46.15%_-38.46%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61.4366 61.4366">
            <g filter="url(#filter0_d_4012_887)" id="Ellipse 269">
              <circle cx="29.4384" cy="29.4384" fill="var(--fill-0, #FD9F28)" fillOpacity="0.5" r="16.6391" shapeRendering="crispEdges" />
              <circle cx="29.4384" cy="29.4384" r="17.279" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="61.4366" id="filter0_d_4012_887" width="61.4366" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_887" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_887" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[2.56px] size-[28.158px] top-[3.84px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.1585 28.1585">
          <circle cx="14.0792" cy="14.0792" fill="var(--fill-0, #FD9F28)" fillOpacity="0.5" id="Ellipse 268" r="14.0792" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-[calc(50%+0.64px)]">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse264} width="23.039" />
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#ffd3d3] h-[152.312px] relative shrink-0 w-[327.662px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Avenir:Black',sans-serif] justify-center leading-[0] left-[24.39px] not-italic text-[25.599px] text-[rgba(222,53,11,0.2)] text-center top-[16.94px] w-[48.776px]">
          <p className="leading-[normal]">3</p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.43px)] text-[#495057] text-[12.799px] text-center top-[calc(50%-0.68px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Questionable Fit</p>
        </div>
        <Frame25 />
        <Frame26 />
      </div>
      <div aria-hidden="true" className="absolute border-[#a5adba] border-[1.251px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame27() {
  return (
    <div className="absolute left-[122.77px] size-[28.158px] top-[66.56px]">
      <div className="absolute left-0 size-[28.158px] top-0">
        <div className="absolute inset-[-45.45%_-54.55%_-54.55%_-45.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56.3169 56.3169">
            <g filter="url(#filter0_d_4012_848)" id="Ellipse 256">
              <circle cx="26.8785" cy="26.8785" fill="var(--fill-0, #DE350B)" fillOpacity="0.5" r="14.0792" shapeRendering="crispEdges" />
              <circle cx="26.8785" cy="26.8785" r="14.7192" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56.3169" id="filter0_d_4012_848" width="56.3169" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_848" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_848" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-1/2">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse262} width="23.039" />
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-[calc(50%+0.64px)]">
      <div className="absolute left-0 size-[23.039px] top-0" data-name="Avatar">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.0387 23.0387">
          <circle cx="11.5194" cy="11.5194" fill="var(--fill-0, #495057)" id="Ellipse 1" opacity="0.8" r="11.5194" />
        </svg>
        <div className="absolute flex flex-col font-['Open_Sans:Bold',sans-serif] font-bold inset-[21.45%_30.91%_22.66%_27.92%] justify-center leading-[0] text-[7.68px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">DT</p>
        </div>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="absolute h-[34.558px] left-[231.56px] top-[87.04px] w-[33.278px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[33.278px] top-[calc(50%+0.64px)]">
        <div className="absolute inset-[-38.46%_-46.15%_-46.15%_-38.46%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61.4366 61.4366">
            <g filter="url(#filter0_d_4012_887)" id="Ellipse 269">
              <circle cx="29.4384" cy="29.4384" fill="var(--fill-0, #FD9F28)" fillOpacity="0.5" r="16.6391" shapeRendering="crispEdges" />
              <circle cx="29.4384" cy="29.4384" r="17.279" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="61.4366" id="filter0_d_4012_887" width="61.4366" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_887" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_887" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[2.56px] size-[28.158px] top-[3.84px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.1585 28.1585">
          <circle cx="14.0792" cy="14.0792" fill="var(--fill-0, #FD9F28)" fillOpacity="0.5" id="Ellipse 268" r="14.0792" />
        </svg>
      </div>
      <Frame29 />
    </div>
  );
}

function Avatar1() {
  return (
    <div className="absolute left-0 size-[25.599px] top-0" data-name="Avatar">
      <div className="absolute inset-[0_-0.01%_0_0.01%]">
        <div className="absolute inset-[-47.5%_-57.5%_-57.5%_-47.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52.4771 52.4771">
            <g filter="url(#filter0_d_4012_842)" id="Ellipse 1" opacity="0.8">
              <circle cx="24.9586" cy="24.9586" fill="var(--fill-0, #495057)" r="12.7993" />
              <circle cx="24.9586" cy="24.9586" r="13.1193" stroke="var(--stroke-0, white)" strokeWidth="0.639965" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="52.4771" id="filter0_d_4012_842" width="52.4771" x="6.55651e-07" y="6.55651e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_842" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_842" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute flex flex-col font-['Open_Sans:Bold',sans-serif] font-bold inset-[15%_13.74%_18.59%_55.01%] justify-center leading-[0] text-[12.799px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">3</p>
      </div>
      <div className="absolute aspect-[15/15] left-[5.01%] overflow-clip right-[44.99%] top-[6.4px]" data-name="user">
        <div className="absolute bottom-[12.5%] left-1/4 right-1/4 top-[12.5%]" data-name="Vector">
          <div className="absolute inset-[-6.67%_-10%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.67958 10.8794">
              <path d={svgPaths.p3b8c3300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="absolute left-[188.04px] size-[25.599px] top-[10.24px]">
      <Avatar1 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="absolute left-[154.77px] size-[38.398px] top-[81.92px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[38.398px] top-1/2">
        <div className="absolute inset-[-33.33%_-40%_-40%_-33.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 66.5563 66.5563">
            <g filter="url(#filter0_d_4012_850)" id="Ellipse 272">
              <circle cx="31.9982" cy="31.9982" fill="var(--fill-0, #00875A)" fillOpacity="0.25" r="19.1989" shapeRendering="crispEdges" />
              <circle cx="31.9982" cy="31.9982" r="19.8389" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="66.5563" id="filter0_d_4012_850" width="66.5563" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_850" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_850" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[33.278px] top-1/2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.2782 33.2782">
          <circle cx="16.6391" cy="16.6391" fill="var(--fill-0, #00875A)" fillOpacity="0.25" id="Ellipse 270" r="16.6391" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[28.158px] top-1/2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.1585 28.1585">
          <circle cx="14.0792" cy="14.0792" fill="var(--fill-0, #00875A)" fillOpacity="0.25" id="Ellipse 271" r="14.0792" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-1/2">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse265} width="23.039" />
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#fff2e4] h-[152.312px] relative shrink-0 w-[326.382px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Frame27 />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Avenir:Black',sans-serif] justify-center leading-[0] left-[24.82px] not-italic text-[#ffd176] text-[25.599px] text-center top-[16.94px] w-[48.776px]">
          <p className="leading-[normal]">5</p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+1.68px)] text-[#495057] text-[12.799px] text-center top-[calc(50%-0.68px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Contributor</p>
        </div>
        <Frame28 />
        <Frame30 />
        <Frame31 />
      </div>
      <div aria-hidden="true" className="absolute border-[#a5adba] border-[1.251px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame32() {
  return (
    <div className="absolute left-[62.61px] size-[28.158px] top-[88.32px]">
      <div className="absolute left-0 size-[28.158px] top-0">
        <div className="absolute inset-[-45.45%_-54.55%_-54.55%_-45.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56.3169 56.3169">
            <g filter="url(#filter0_d_4012_848)" id="Ellipse 256">
              <circle cx="26.8785" cy="26.8785" fill="var(--fill-0, #DE350B)" fillOpacity="0.5" r="14.0792" shapeRendering="crispEdges" />
              <circle cx="26.8785" cy="26.8785" r="14.7192" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56.3169" id="filter0_d_4012_848" width="56.3169" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_848" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_848" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-1/2">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse266} width="23.039" />
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="absolute h-[34.558px] left-[95.89px] top-[20.48px] w-[33.278px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[33.278px] top-[calc(50%+0.64px)]">
        <div className="absolute inset-[-38.46%_-46.15%_-46.15%_-38.46%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61.4366 61.4366">
            <g filter="url(#filter0_d_4012_887)" id="Ellipse 269">
              <circle cx="29.4384" cy="29.4384" fill="var(--fill-0, #FD9F28)" fillOpacity="0.5" r="16.6391" shapeRendering="crispEdges" />
              <circle cx="29.4384" cy="29.4384" r="17.279" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="61.4366" id="filter0_d_4012_887" width="61.4366" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_887" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_887" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[2.56px] size-[28.158px] top-[3.84px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.1585 28.1585">
          <circle cx="14.0792" cy="14.0792" fill="var(--fill-0, #FD9F28)" fillOpacity="0.5" id="Ellipse 268" r="14.0792" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-[calc(50%+0.64px)]">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse264} width="23.039" />
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#d6e6ff] h-[152.312px] relative shrink-0 w-[326.382px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Avenir:Black',sans-serif] justify-center leading-[0] left-[24px] not-italic text-[25.599px] text-[rgba(0,135,90,0.2)] text-center top-[16.94px] w-[48.776px]">
          <p className="leading-[normal]">7</p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+0.33px)] text-[#495057] text-[12.799px] text-center top-[calc(50%-0.68px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Emerging Star</p>
        </div>
        <Frame32 />
        <Frame33 />
      </div>
      <div aria-hidden="true" className="absolute border-[#a5adba] border-[1.251px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#ffd3d3] h-[151.032px] relative shrink-0 w-[326.382px]">
      <div className="leading-[0] overflow-clip relative rounded-[inherit] size-full text-center">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Avenir:Black',sans-serif] justify-center left-[24.39px] not-italic text-[25.599px] text-[rgba(222,53,11,0.2)] top-[17.63px] w-[48.776px]">
          <p className="leading-[normal]">1</p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center left-[calc(50%+0.21px)] text-[#495057] text-[12.799px] top-[calc(50%-1.88px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Under Performer</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#a5adba] border-[1.251px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame34() {
  return (
    <div className="absolute left-[126.61px] size-[28.158px] top-[30.72px]">
      <div className="absolute left-0 size-[28.158px] top-0">
        <div className="absolute inset-[-45.45%_-54.55%_-54.55%_-45.45%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56.3169 56.3169">
            <g filter="url(#filter0_d_4012_848)" id="Ellipse 256">
              <circle cx="26.8785" cy="26.8785" fill="var(--fill-0, #DE350B)" fillOpacity="0.5" r="14.0792" shapeRendering="crispEdges" />
              <circle cx="26.8785" cy="26.8785" r="14.7192" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="56.3169" id="filter0_d_4012_848" width="56.3169" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_848" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_848" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-1/2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.0387 23.0387">
          <circle cx="11.5194" cy="11.5194" fill="var(--fill-0, #495057)" id="Ellipse 1" opacity="0.8" r="11.5194" />
        </svg>
      </div>
      <div className="absolute flex flex-col font-['Open_Sans:Bold',sans-serif] font-bold inset-[31.82%_29.12%_32.67%_31.82%] justify-center leading-[0] text-[7.684px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">GT</p>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="absolute h-[34.558px] left-[165.01px] top-[10.24px] w-[33.278px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[33.278px] top-[calc(50%+0.64px)]">
        <div className="absolute inset-[-38.46%_-46.15%_-46.15%_-38.46%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61.4366 61.4366">
            <g filter="url(#filter0_d_4012_887)" id="Ellipse 269">
              <circle cx="29.4384" cy="29.4384" fill="var(--fill-0, #FD9F28)" fillOpacity="0.5" r="16.6391" shapeRendering="crispEdges" />
              <circle cx="29.4384" cy="29.4384" r="17.279" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="61.4366" id="filter0_d_4012_887" width="61.4366" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_887" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_887" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[2.56px] size-[28.158px] top-[3.84px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.1585 28.1585">
          <circle cx="14.0792" cy="14.0792" fill="var(--fill-0, #FD9F28)" fillOpacity="0.5" id="Ellipse 268" r="14.0792" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-[calc(50%+0.64px)]">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse264} width="23.039" />
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#ffd3d3] h-[151.032px] relative shrink-0 w-[327.662px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Avenir:Black',sans-serif] justify-center leading-[0] left-[24.82px] not-italic text-[25.599px] text-[rgba(222,53,11,0.2)] text-center top-[17.63px] w-[48.776px]">
          <p className="leading-[normal]">2</p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%-0.98px)] text-[#495057] text-[12.799px] text-center top-[calc(50%-1.88px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Specialist</p>
        </div>
        <Frame34 />
        <Frame35 />
      </div>
      <div aria-hidden="true" className="absolute border-[#a5adba] border-[1.251px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame36() {
  return (
    <div className="absolute left-[39.57px] size-[38.398px] top-[29.44px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[38.398px] top-1/2">
        <div className="absolute inset-[-33.33%_-40%_-40%_-33.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 66.5563 66.5563">
            <g filter="url(#filter0_d_4012_850)" id="Ellipse 272">
              <circle cx="31.9982" cy="31.9982" fill="var(--fill-0, #00875A)" fillOpacity="0.25" r="19.1989" shapeRendering="crispEdges" />
              <circle cx="31.9982" cy="31.9982" r="19.8389" shapeRendering="crispEdges" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.27993" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="66.5563" id="filter0_d_4012_850" width="66.5563" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="1.27993" dy="1.27993" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_850" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_850" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[33.278px] top-1/2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.2782 33.2782">
          <circle cx="16.6391" cy="16.6391" fill="var(--fill-0, #00875A)" fillOpacity="0.25" id="Ellipse 270" r="16.6391" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[28.158px] top-1/2">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.1585 28.1585">
          <circle cx="14.0792" cy="14.0792" fill="var(--fill-0, #00875A)" fillOpacity="0.25" id="Ellipse 271" r="14.0792" />
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[23.039px] top-1/2">
        <img alt="" className="absolute block max-w-none size-full" height="23.039" src={imgEllipse265} width="23.039" />
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-[#fff2e4] h-[151.032px] relative shrink-0 w-[326.382px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Avenir:Black',sans-serif] justify-center leading-[0] left-[24px] not-italic text-[#ffd176] text-[25.599px] text-center top-[17.63px] w-[48.776px]">
          <p className="leading-[normal]">4</p>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] left-[calc(50%+1.62px)] text-[#495057] text-[12.799px] text-center top-[calc(50%-1.88px)] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal]">Expert</p>
        </div>
        <Frame36 />
      </div>
      <div aria-hidden="true" className="absolute border-[#a5adba] border-[1.251px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-start flex flex-wrap gap-0 items-start relative shrink-0 w-[981.706px]">
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
      <Frame5 />
      <Frame6 />
      <Frame7 />
      <Frame8 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[17.919px] items-start relative shrink-0 w-full">
      <Group4 />
      <Frame9 />
    </div>
  );
}

function Group1() {
  return (
    <div className="h-[1018.824px] relative w-0">
      <div className="absolute inset-[-0.19%_-14.22px_0_-14.22px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.4303 1020.75">
          <g id="Group 459">
            <path d={svgPaths.pbfada80} fill="var(--stroke-0, #A5ADBA)" id="Vector 271" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="col-1 flex h-0 items-center justify-center ml-0 mt-[7.65px] relative row-1 w-[1018.824px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <Group1 />
        </div>
      </div>
      <div className="col-1 flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[15.44px] justify-center ml-[135.89px] mt-0 relative row-1 text-[#495057] text-[15.359px] text-center w-[70.557px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Low</p>
      </div>
      <div className="col-1 flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[15.44px] justify-center ml-[413.25px] mt-0 relative row-1 text-[#495057] text-[15.359px] text-center w-[180.312px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Mid</p>
      </div>
      <div className="col-1 flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[15.44px] justify-center ml-[818.7px] mt-0 relative row-1 text-[#495057] text-[15.359px] text-center w-[86.236px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">High</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[12.799px] items-center relative shrink-0 w-[1036.743px]">
      <Group2 />
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] min-w-full relative shrink-0 text-[#58595b] text-[12.799px] text-center uppercase w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Potential
      </p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-white relative rounded-[10.239px] self-stretch shadow-[2.56px_2.56px_19.199px_0px_rgba(0,0,0,0.1)] shrink-0 w-[1105.859px]">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[17.919px] items-center pl-[20.479px] pr-[30.718px] py-[20.479px] relative size-full">
          <Div />
          <Frame11 />
          <Frame10 />
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="relative shrink-0 size-[10.771px]">
        <div className="absolute inset-[-105.07%_-152.6%_-152.6%_-105.07%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38.5233 38.5233">
            <g filter="url(#filter0_d_4012_871)" id="Ellipse 249">
              <circle cx="16.7018" cy="16.7018" fill="var(--fill-0, #FE1401)" r="5.3853" />
              <circle cx="16.7018" cy="16.7018" r="5.3853" stroke="var(--stroke-0, white)" strokeWidth="2.15412" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="38.5233" id="filter0_d_4012_871" width="38.5233" x="-4.76837e-07" y="-4.76837e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2.55986" dy="2.55986" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_871" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_871" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="relative shrink-0 size-[12.925px]">
        <div className="absolute inset-[-87.56%_-127.17%_-127.17%_-87.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.6774 40.6774">
            <g filter="url(#filter0_d_4012_864)" id="Ellipse 250">
              <circle cx="17.7789" cy="17.7789" fill="var(--fill-0, #FB3D01)" r="6.46236" />
              <circle cx="17.7789" cy="17.7789" r="6.46236" stroke="var(--stroke-0, white)" strokeWidth="2.15412" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="40.6774" id="filter0_d_4012_864" width="40.6774" x="-4.76837e-07" y="-4.76837e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2.55986" dy="2.55986" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_864" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_864" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="relative shrink-0 size-[15.079px]">
        <div className="absolute inset-[-75.05%_-109%_-109%_-75.05%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 42.8316 42.8316">
            <g filter="url(#filter0_d_4012_844)" id="Ellipse 251">
              <circle cx="18.8559" cy="18.8559" fill="var(--fill-0, #F86A02)" r="7.53942" />
              <circle cx="18.8559" cy="18.8559" r="7.53942" stroke="var(--stroke-0, white)" strokeWidth="2.15412" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="42.8316" id="filter0_d_4012_844" width="42.8316" x="-4.76837e-07" y="-4.76837e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2.55986" dy="2.55986" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_844" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_844" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="relative shrink-0 size-[17.233px]">
        <div className="absolute inset-[-65.67%_-95.38%_-95.38%_-65.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.9857 44.9857">
            <g filter="url(#filter0_d_4012_873)" id="Ellipse 252">
              <circle cx="19.933" cy="19.933" fill="var(--fill-0, #F59A02)" r="8.61648" />
              <circle cx="19.933" cy="19.933" r="8.61648" stroke="var(--stroke-0, white)" strokeWidth="2.15412" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="44.9857" id="filter0_d_4012_873" width="44.9857" x="-4.76837e-07" y="-4.76837e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2.55986" dy="2.55986" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_873" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_873" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="relative shrink-0 size-[19.387px]">
        <div className="absolute inset-[-58.37%_-84.78%_-84.78%_-58.37%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 47.1398 47.1398">
            <g filter="url(#filter0_d_4012_862)" id="Ellipse 253">
              <circle cx="21.01" cy="21.01" fill="var(--fill-0, #F4B302)" r="9.69354" />
              <circle cx="21.01" cy="21.01" r="9.69354" stroke="var(--stroke-0, white)" strokeWidth="2.15412" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="47.1398" id="filter0_d_4012_862" width="47.1398" x="-3.57628e-07" y="-3.57628e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2.55986" dy="2.55986" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_862" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_862" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="relative shrink-0 size-[21.541px]">
        <div className="absolute inset-[-52.53%_-76.3%_-76.3%_-52.53%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 49.2939 49.2939">
            <g filter="url(#filter0_d_4012_889)" id="Ellipse 254">
              <circle cx="22.0871" cy="22.0871" fill="var(--fill-0, #F2CD02)" r="10.7706" />
              <circle cx="22.0871" cy="22.0871" r="10.7706" stroke="var(--stroke-0, white)" strokeWidth="2.15412" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="49.2939" id="filter0_d_4012_889" width="49.2939" x="-4.76837e-07" y="-4.76837e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2.55986" dy="2.55986" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_889" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_889" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="relative shrink-0 size-[23.695px]">
        <div className="absolute inset-[-47.76%_-69.36%_-69.36%_-47.76%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 51.448 51.448">
            <g filter="url(#filter0_d_4012_883)" id="Ellipse 255">
              <circle cx="23.1642" cy="23.1642" fill="var(--fill-0, #E0DE05)" r="11.8477" />
              <circle cx="23.1642" cy="23.1642" r="11.8477" stroke="var(--stroke-0, white)" strokeWidth="2.15412" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="51.448" id="filter0_d_4012_883" width="51.448" x="-4.76837e-07" y="-4.76837e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2.55986" dy="2.55986" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_883" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_883" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="relative shrink-0 size-[25.849px]">
        <div className="absolute inset-[-43.78%_-63.58%_-63.58%_-43.78%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.6021 53.6021">
            <g filter="url(#filter0_d_4012_860)" id="Ellipse 256">
              <circle cx="24.2412" cy="24.2412" fill="var(--fill-0, #B6E10B)" r="12.9247" />
              <circle cx="24.2412" cy="24.2412" r="12.9247" stroke="var(--stroke-0, white)" strokeWidth="2.15412" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="53.6022" id="filter0_d_4012_860" width="53.6022" x="-4.76837e-07" y="-4.76837e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2.55986" dy="2.55986" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_860" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_860" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="relative shrink-0 size-[28.004px]">
        <div className="absolute inset-[-40.41%_-58.69%_-58.69%_-40.41%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 55.7563 55.7563">
            <g filter="url(#filter0_d_4012_856)" id="Ellipse 257">
              <circle cx="25.3183" cy="25.3183" fill="var(--fill-0, #78CB0E)" r="14.0018" />
              <circle cx="25.3183" cy="25.3183" r="14.0018" stroke="var(--stroke-0, white)" strokeWidth="2.15412" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="55.7563" id="filter0_d_4012_856" width="55.7563" x="-4.76837e-07" y="-4.76837e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2.55986" dy="2.55986" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_856" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_856" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="relative shrink-0 size-[30.158px]">
        <div className="absolute inset-[-37.52%_-54.5%_-54.5%_-37.52%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 57.9104 57.9104">
            <g filter="url(#filter0_d_4012_879)" id="Ellipse 258">
              <circle cx="26.3953" cy="26.3953" fill="var(--fill-0, #38A20A)" r="15.0788" />
              <circle cx="26.3953" cy="26.3953" r="15.0788" stroke="var(--stroke-0, white)" strokeWidth="2.15412" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="57.9104" id="filter0_d_4012_879" width="57.9104" x="-4.76837e-07" y="-4.76837e-07">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="2.55986" dy="2.55986" />
                <feGaussianBlur stdDeviation="6.39965" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_4012_879" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_4012_879" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal items-center justify-between leading-[normal] relative shrink-0 text-[#495057] text-[12.799px] w-full whitespace-nowrap">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Low Score
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        High Score
      </p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[7.68px] items-start relative shrink-0 w-full">
      <Frame14 />
      <Frame13 />
    </div>
  );
}

function Legend() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10.239px] items-start pb-[20.479px] pt-[10.239px] px-[20.479px] relative rounded-[10.239px] shadow-[2.56px_2.56px_19.199px_0px_rgba(0,0,0,0.1)] shrink-0 w-[328.942px]" data-name="Legend">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[15.359px] whitespace-nowrap">Radius Legend</p>
      <Frame15 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Avenir:Heavy',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative text-[#364153] text-[15.359px]">Statistik</p>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20.479px] relative shrink-0 w-[146.552px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4a5565] text-[12.799px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Avg. Performance
        </p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[25.599px] relative shrink-0 w-[54.037px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Avenir:Heavy',sans-serif] leading-[0] left-0 not-italic text-[#016699] text-[0px] top-[calc(50%-9.68px)] w-[55.037px]">
          <span className="leading-[normal] text-[15.359px]">65</span>
          <span className="leading-[normal] text-[#adb5bd] text-[10.239px]">/100</span>
        </p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex h-[25.599px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text />
      <Text1 />
    </div>
  );
}

function Container8() {
  return <div className="bg-[#016699] h-[10.239px] rounded-[42947268px] shrink-0 w-[163.831px]" data-name="Container" />;
}

function Container7() {
  return (
    <div className="bg-[rgba(230,230,230,0.5)] h-[10.239px] relative rounded-[42947268px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[176.39px] relative size-full">
          <Container8 />
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col h-[40.958px] items-start relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Container7 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20.479px] relative shrink-0 w-[151.972px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4a5565] text-[12.799px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Avg. Potential
        </p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[25.599px] relative shrink-0 w-[54.037px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Avenir:Heavy',sans-serif] leading-[0] left-0 not-italic text-[#016699] text-[0px] top-[calc(50%-9.68px)] w-[55.037px]">
          <span className="leading-[normal] text-[15.359px]">68</span>
          <span className="leading-[normal] text-[#adb5bd] text-[10.239px]">/100</span>
        </p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex h-[25.599px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text2 />
      <Text3 />
    </div>
  );
}

function Container12() {
  return <div className="bg-[#016699] h-[10.239px] rounded-[42947268px] shrink-0 w-[179.19px]" data-name="Container" />;
}

function Container11() {
  return (
    <div className="bg-[rgba(230,230,230,0.5)] h-[10.239px] relative rounded-[42947268px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[159.751px] relative size-full">
          <Container12 />
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col h-[40.958px] items-start relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20.479px] relative shrink-0 w-[152.112px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4a5565] text-[12.799px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Avg. Engagement
        </p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[25.599px] relative shrink-0 w-[36.158px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Avenir:Heavy',sans-serif] leading-[normal] left-0 not-italic text-[#016699] text-[15.359px] top-[calc(50%-9.68px)] w-[37.118px]">56%</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex h-[25.599px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text4 />
      <Text5 />
    </div>
  );
}

function Container16() {
  return <div className="bg-[#016699] h-[10.239px] rounded-[42947268px] shrink-0 w-[171.511px]" data-name="Container" />;
}

function Container15() {
  return (
    <div className="bg-[rgba(230,230,230,0.5)] h-[10.239px] relative rounded-[42947268px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pr-[221.968px] relative size-full">
          <Container16 />
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col h-[40.958px] items-start relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container15 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[12.799px] h-[148.472px] items-start relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container9 />
      <Container13 />
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-white relative rounded-[10.239px] shadow-[2.56px_2.56px_19.199px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[15.359px] items-start px-[20.479px] py-[10.239px] relative w-full">
        <Heading />
        <Container4 />
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[20.479px] h-[677.083px] items-start relative shrink-0 w-[328.942px]">
      <Legend />
      <Container3 />
    </div>
  );
}

export default function Frame16() {
  return (
    <div className="content-stretch flex gap-[20.479px] items-start relative size-full">
      <Frame12 />
      <Frame17 />
    </div>
  );
}