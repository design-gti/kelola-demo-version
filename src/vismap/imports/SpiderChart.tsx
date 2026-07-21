import svgPaths from "./svg-mrz6nb6szr";

function Box() {
  return (
    <div className="bg-[#016699] relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Box />
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#495057] text-[10px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Score
      </p>
    </div>
  );
}

function Box1() {
  return (
    <div className="bg-[#d6e6ff] relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Box1 />
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#495057] text-[10px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Standar Nilai
      </p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Frame4({ onViewModeChange }: { onViewModeChange?: () => void }) {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="bg-[#e7f5ff] overflow-clip relative rounded-[4px] shrink-0 size-[20px]" data-name="chart-radar">
        <div className="absolute inset-[12.5%_10.42%]" data-name="Vector">
          <div className="absolute inset-[-5%_-4.74%]" style={{ "--stroke-0": "rgba(1, 102, 153, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 17">
              <path d={svgPaths.p4355100} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="bg-[#f8f9fa] overflow-clip relative rounded-[4px] shrink-0 size-[20px] cursor-pointer" data-name="list" onClick={onViewModeChange}>
        <div className="absolute bottom-[24.96%] left-[20.83%] right-[16.67%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-7.49%_-6%]" style={{ "--stroke-0": "rgba(206, 212, 218, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 12">
              <path d={svgPaths.p24455faf} id="Vector" stroke="var(--stroke-0, #CED4DA)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.854902" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ onViewModeChange }: { onViewModeChange?: () => void }) {
  return (
    <div className="box-border content-stretch flex items-center justify-between px-0 py-[4px] relative shrink-0 w-full" data-name="Legend">
      <Frame5 />
      <Frame4 onViewModeChange={onViewModeChange} />
    </div>
  );
}

function Group() {
  return (
    <div className="[grid-area:1_/_1] ml-[64.25px] mt-[16px] relative size-[193px]">
      <div className="absolute inset-[-10.88%_-13.99%_-15.03%_-11.92%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 243 243">
          <g id="Group 3484">
            <g filter="url(#filter0_d_2007_433)" id="Ellipse 252">
              <circle cx="119.5" cy="117.5" r="96" shapeRendering="crispEdges" stroke="var(--stroke-0, #DEE2E6)" />
            </g>
            <circle cx="119.5" cy="117.5" id="Ellipse 253" r="74.8906" stroke="var(--stroke-0, #DEE2E6)" />
            <circle cx="119.5" cy="117.5" id="Ellipse 254" r="52.2734" stroke="var(--stroke-0, #DEE2E6)" />
            <circle cx="119.5" cy="117.5" id="Ellipse 255" r="30.4102" stroke="var(--stroke-0, #DEE2E6)" />
            <circle cx="119.5" cy="117.5" id="Ellipse 256" r="13.0703" stroke="var(--stroke-0, #DEE2E6)" />
            <line id="Line 91" stroke="var(--stroke-0, #DEE2E6)" x1="120" x2="120" y1="21" y2="213.246" />
            <line id="Line 92" stroke="var(--stroke-0, #DEE2E6)" x1="23.377" x2="215.623" y1="116.623" y2="116.623" />
            <line id="Line 94" stroke="var(--stroke-0, #DEE2E6)" x1="51.8842" x2="187.823" y1="48.8002" y2="184.739" />
            <line id="Line 93" stroke="var(--stroke-0, #DEE2E6)" x1="51.1771" x2="187.116" y1="184.739" y2="48.8002" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="243" id="filter0_d_2007_433" width="243" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dx="2" dy="4" />
              <feGaussianBlur stdDeviation="12.5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2007_433" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_2007_433" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Kemampuan verbal</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex flex-col items-center justify-center ml-[221.234px] mt-[161px] relative w-[115px]">
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#fff2e4] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#ca6f00] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
            DEV.
          </p>
        </div>
      </div>
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Logika Berpikir</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex flex-col items-center justify-center ml-0 mt-[15px] relative w-[115px]">
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#fff2e4] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#ca6f00] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
            DEV.
          </p>
        </div>
      </div>
      <Frame3 />
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <div className="[grid-area:1_/_1] flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center ml-[135.25px] mt-[7px] relative text-[#495057] text-[10px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Leadership</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center ml-[11.75px] mt-[108px] relative text-[#495057] text-[10px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Progresif</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center ml-[5.25px] mt-[187px] relative text-[#495057] text-[10px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Strategic Thinking</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center ml-[123.25px] mt-[220px] relative text-[#495057] text-[10px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Communication</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center ml-[229.234px] mt-[36px] relative text-[#495057] text-[10px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Analythical Thinking</p>
      </div>
      <div className="[grid-area:1_/_1] flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center ml-[263.25px] mt-[108px] relative text-[#495057] text-[10px] text-nowrap translate-y-[-50%]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">People</p>
      </div>
      <Group />
      <div className="[grid-area:1_/_1] h-[130px] ml-[107.25px] mt-[59px] relative w-[129px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 129 130">
          <path d={svgPaths.p3cfd9b00} fill="var(--fill-0, #D6E6FF)" fillOpacity="0.8" id="Vector 384" />
        </svg>
      </div>
      <div className="[grid-area:1_/_1] h-[128px] ml-[125.25px] mt-[37px] relative w-[111px]">
        <div className="absolute inset-[-8.59%_-11.71%_-14.84%_-15.32%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 141 158">
            <g filter="url(#filter0_ddi_2002_4049)" id="Vector 385">
              <path d={svgPaths.p18016b00} fill="url(#paint0_linear_2002_4049)" fillOpacity="0.75" shapeRendering="crispEdges" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="158" id="filter0_ddi_2002_4049" width="141" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="-2" dy="4" />
                <feGaussianBlur stdDeviation="7.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_2002_4049" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="4" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend in2="effect1_dropShadow_2002_4049" mode="normal" result="effect2_dropShadow_2002_4049" />
                <feBlend in="SourceGraphic" in2="effect2_dropShadow_2002_4049" mode="normal" result="shape" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dx="-1" dy="-2" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0" />
                <feBlend in2="shape" mode="normal" result="effect3_innerShadow_2002_4049" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_2002_4049" x1="118.217" x2="16.595" y1="108.506" y2="47.1888">
                <stop stopColor="#00547E" />
                <stop offset="1" stopColor="#00A9FF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <Frame6 />
      <Frame7 />
    </div>
  );
}

export default function SpiderChart({ onViewModeChange }: { onViewModeChange?: () => void }) {
  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="Spider chart">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-center overflow-clip p-[16px] relative size-full">
          <Legend onViewModeChange={onViewModeChange} />
          <Group1 />
        </div>
      </div>
    </div>
  );
}
