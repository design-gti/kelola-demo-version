// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import svgPaths from "./svg-1z47brzs7w";
import imgImg from "figma:asset/5afbf4adf6f97b59b3484f6073a416ed8c6892e6.png";

function MainContent() {
  return <div className="bg-[#f8f9fa] h-[97px] shrink-0 w-full" data-name="Main Content" />;
}

function Div() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col h-[210px] items-start pt-[113px] relative shrink-0 w-full" data-name="div">
      <MainContent />
    </div>
  );
}

function Body() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[210px] items-center left-0 top-0 w-[2209px]" data-name="Body">
      <Div />
    </div>
  );
}

function ArrowLeft() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="ArrowLeft">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ArrowLeft">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, #1A1A1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, #1A1A1A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[33554400px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <ArrowLeft />
      </div>
    </div>
  );
}

function H() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[107.5px]" data-name="h1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#101828] text-[20px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Committee
        </p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="flex-[1_0_0] h-[28px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <H />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[36px] relative shrink-0 w-[159.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Button />
        <Container1 />
      </div>
    </div>
  );
}

function Clock() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Clock">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_77_3646)" id="Clock">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 4V8L10.6667 9.33333" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_77_3646">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span() {
  return (
    <div className="h-[24px] relative shrink-0 w-[129.891px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[24px] left-[65px] text-[#4a5565] text-[16px] text-center top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          Snapshot History
        </p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[rgba(255,255,255,0)] flex-[1_0_0] h-[43.984px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.984px] items-center justify-center relative size-full">
        <Clock />
        <Span />
      </div>
    </div>
  );
}

function Camera() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Camera">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Camera">
          <path d={svgPaths.p39f43800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p370da580} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Span1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[71.156px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[24px] left-[36.5px] text-[16px] text-center text-white top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          Snapshot
        </p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-gradient-to-b from-[#016699] h-[43.984px] relative rounded-[22px] shadow-[0px_4px_12px_0px_rgba(1,102,153,0.25)] shrink-0 to-[#0288d1] w-[123.141px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.984px] items-center justify-center relative size-full">
        <Camera />
        <Span1 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[43.984px] relative shrink-0 w-[313px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.984px] items-center relative size-full">
        <Button1 />
        <Button2 />
      </div>
    </div>
  );
}

function Div1() {
  return (
    <div className="h-[80px] relative shrink-0 w-full" data-name="div">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] relative size-full">
          <Container />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[81px] items-start left-0 pb-px top-0 w-[2209px]" data-name="nav">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <Div1 />
    </div>
  );
}

function ChevronLeft() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ChevronLeft">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ChevronLeft">
          <path d="M15 18L9 12L15 6" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[16px] opacity-30 rounded-[33554400px] shadow-[1px_1px_10px_0px_rgba(0,0,0,0.15)] size-[48px] top-[604px]" data-name="button">
      <ChevronLeft />
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="ChevronRight">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="ChevronRight">
          <path d="M9 18L15 12L9 6" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-white content-stretch flex items-center justify-center left-[2145px] rounded-[33554400px] shadow-[1px_1px_10px_0px_rgba(0,0,0,0.15)] size-[48px] top-[604px]" data-name="button">
      <ChevronRight />
    </div>
  );
}

function Table() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Table2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Table2">
          <path d={svgPaths.p3cc96c00} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Span2() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#6b7280] text-[16px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          Screener
        </p>
      </div>
    </div>
  );
}

function NavLink() {
  return (
    <div className="h-[48px] relative shrink-0 w-[147.313px]" data-name="NavLink">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.984px] items-center pb-[2px] px-[24px] relative size-full">
        <Table />
        <Span2 />
      </div>
    </div>
  );
}

function CreditCard() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="CreditCard">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="CreditCard">
          <path d={svgPaths.p16dd5f0} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M1.66667 8.33333H18.3333" id="Vector_2" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Span3() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#016699] text-[16px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          Review
        </p>
      </div>
    </div>
  );
}

function NavLink1() {
  return (
    <div className="h-[48px] relative shrink-0 w-[133.484px]" data-name="NavLink">
      <div aria-hidden="true" className="absolute border-[#016699] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.984px] items-center pb-[2px] px-[24px] relative size-full">
        <CreditCard />
        <Span3 />
      </div>
    </div>
  );
}

function FileCheck() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="FileCheck">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="FileCheck">
          <path d={svgPaths.p3713e00} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.pd2076c0} id="Vector_2" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p12751280} id="Vector_3" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Span4() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#6b7280] text-[16px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          Decisions
        </p>
      </div>
    </div>
  );
}

function NavLink2() {
  return (
    <div className="h-[48px] relative shrink-0 w-[152.172px]" data-name="NavLink">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.984px] items-center pb-[2px] px-[24px] relative size-full">
        <FileCheck />
        <Span4 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex h-[48px] items-center pb-px relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <NavLink />
      <NavLink1 />
      <NavLink2 />
    </div>
  );
}

function Div2() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[73px] items-start left-0 pb-px pt-[12px] px-[24px] top-[113px] w-[2209px]" data-name="div">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none shadow-[1px_1px_10px_0px_rgba(0,0,0,0.1),1px_1px_6px_0px_rgba(0,0,0,0.05)]" />
      <Container3 />
    </div>
  );
}

function Img() {
  return (
    <div className="absolute h-[320px] left-0 top-0 w-[373.328px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg} />
    </div>
  );
}

function Container6() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.8)] h-[320px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.3)] w-[373.328px]" data-name="Container" />;
}

function Briefcase() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[10px]" data-name="Briefcase">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Briefcase">
          <path d={svgPaths.p1c647980} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13d22180} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.8)] h-[36px] left-[16px] rounded-[33554400px] top-[16px] w-[200.047px]" data-name="Container">
      <Briefcase />
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] left-[40px] text-[14px] text-white top-[8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        4.5+ years experience
      </p>
    </div>
  );
}

function Container8() {
  return <div className="absolute bg-[#00c950] border-2 border-solid border-white left-[345.33px] rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[12px] top-[16px]" data-name="Container" />;
}

function Container11() {
  return <div className="absolute bg-[#51a2ff] left-[12px] rounded-[33554400px] size-[8px] top-[8px]" data-name="Container" />;
}

function Span5() {
  return (
    <div className="absolute h-[16px] left-[28px] top-[4px] w-[65.984px]" data-name="span">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.9)] top-0">ID: EMP001</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] border-solid h-[26px] left-[24px] rounded-[33554400px] top-[25px] w-[107.984px]" data-name="Container">
      <Container11 />
      <Span5 />
    </div>
  );
}

function H1() {
  return (
    <div className="absolute h-[32px] left-[24px] top-[75px] w-[325.328px]" data-name="h2">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[32px] left-0 text-[24px] text-white top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Sarah Chen
      </p>
    </div>
  );
}

function P() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[111px] w-[325.328px]" data-name="p">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-[rgba(255,255,255,0.9)] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Senior Software Engineer
      </p>
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] h-[26px] left-0 rounded-[33554400px] top-0 w-[39.266px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          L5
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Badge1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] h-[26px] left-[47.27px] rounded-[33554400px] top-0 w-[93.391px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          Engineering
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute h-[26px] left-[24px] top-[147px] w-[325.328px]" data-name="Container">
      <Badge />
      <Badge1 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[197px] left-0 top-[123px] w-[373.328px]" data-name="Container">
      <Container10 />
      <H1 />
      <P />
      <Container12 />
    </div>
  );
}

function Phone() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Phone">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_77_3637)" id="Phone">
          <path d={svgPaths.p1a7ce800} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_77_3637">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[rgba(255,255,255,0.9)] relative rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 size-[40px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Phone />
      </div>
    </div>
  );
}

function Mail() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Mail">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Mail">
          <path d={svgPaths.pd919a80} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p189c1170} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[rgba(255,255,255,0.9)] flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Mail />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[40px] items-start left-[261.33px] top-[256px] w-[88px]" data-name="Container">
      <Button5 />
      <Button6 />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[320px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <Img />
      <Container6 />
      <Container7 />
      <Container8 />
      <Container9 />
      <Container13 />
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[320px] items-start overflow-clip relative rounded-[16px] shadow-[1px_1px_20px_0px_rgba(0,0,0,0.1),1px_1px_12px_-4px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Container">
      <Container5 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute h-[16px] left-[20px] opacity-90 top-[11px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-white top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Performance
      </p>
    </div>
  );
}

function Span6() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-start left-[17.16px] opacity-75 top-[10px] w-[17.734px]" data-name="span">
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[18px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        /5
      </p>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[31px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[36px] left-0 text-[30px] text-white top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        5
      </p>
      <Span6 />
    </div>
  );
}

function Star() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star3() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star4() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[12px] items-start left-[20px] top-[75px] w-[138.656px]" data-name="Container">
      <Star />
      <Star1 />
      <Star2 />
      <Star3 />
      <Star4 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[103px] left-[0.16px] rounded-[16px] shadow-[1px_1px_10px_0px_rgba(0,0,0,0.1),1px_1px_6px_0px_rgba(0,0,0,0.05)] top-0 w-[179px]" data-name="Container" style={{ backgroundImage: "linear-gradient(150.083deg, rgb(43, 127, 255) 0%, rgb(21, 93, 252) 100%)" }}>
      <Container16 />
      <Container17 />
      <Container18 />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute h-[16px] left-[20px] opacity-90 top-[11px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-white top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Potential
      </p>
    </div>
  );
}

function Span7() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-start left-[17.16px] opacity-75 top-[10px] w-[17.734px]" data-name="span">
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[18px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        /5
      </p>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[31px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[36px] left-0 text-[30px] text-white top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        4
      </p>
      <Span7 />
    </div>
  );
}

function Star5() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star6() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star7() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star8() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star9() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3610)" id="Star">
          <path d={svgPaths.p295e8380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3" />
        </g>
        <defs>
          <clipPath id="clip0_77_3610">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[12px] items-start left-[20px] top-[75px] w-[138.672px]" data-name="Container">
      <Star5 />
      <Star6 />
      <Star7 />
      <Star8 />
      <Star9 />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute h-[103px] left-[195.16px] rounded-[16px] shadow-[1px_1px_10px_0px_rgba(0,0,0,0.1),1px_1px_6px_0px_rgba(0,0,0,0.05)] top-0 w-[178px]" data-name="Container" style={{ backgroundImage: "linear-gradient(149.944deg, rgb(97, 95, 255) 0%, rgb(79, 57, 246) 100%)" }}>
      <Container20 />
      <Container21 />
      <Container22 />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute h-[16px] left-[20px] top-[12px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Engagement
      </p>
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[32px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#016699] text-[0px] top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span className="leading-[36px] text-[30px]">92</span>
        <span className="leading-[28px] text-[#6a7282] text-[18px]">%</span>
      </p>
    </div>
  );
}

function Container27() {
  return <div className="bg-gradient-to-r from-[#05df72] h-[8px] rounded-[33554400px] shrink-0 to-[#00a63e] w-full" data-name="Container" />;
}

function Container26() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex flex-col h-[8px] items-start left-[20px] pr-[11.094px] rounded-[33554400px] top-[72px] w-[138.656px]" data-name="Container">
      <Container27 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-[#f8f9fa] h-[94px] left-[0.16px] rounded-[16px] top-[117px] w-[179px]" data-name="Container">
      <Container24 />
      <Container25 />
      <Container26 />
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[16px] left-[20px] top-[12px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Flight Risk
      </p>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[32px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#016699] text-[0px] top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span className="leading-[36px] text-[30px]">15</span>
        <span className="leading-[28px] text-[#6a7282] text-[18px]">%</span>
      </p>
    </div>
  );
}

function Container32() {
  return <div className="bg-gradient-to-r from-[#ff6467] h-[8px] rounded-[33554400px] shrink-0 to-[#e7000b] w-full" data-name="Container" />;
}

function Container31() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex flex-col h-[8px] items-start left-[20px] pr-[117.875px] rounded-[33554400px] top-[72px] w-[138.672px]" data-name="Container">
      <Container32 />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-[#f8f9fa] h-[94px] left-[195.16px] rounded-[16px] top-[117px] w-[178px]" data-name="Container">
      <Container29 />
      <Container30 />
      <Container31 />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[211px] relative shrink-0 w-[373px]" data-name="Container">
      <Container15 />
      <Container19 />
      <Container23 />
      <Container28 />
    </div>
  );
}

function Briefcase1() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="Briefcase">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Briefcase">
          <path d={svgPaths.pe6b10c0} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p4c21d00} id="Vector_2" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function H2() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <Briefcase1 />
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[28px] text-[#101828] text-[18px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Career Information
      </p>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Manager
      </p>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        David Kim
      </p>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[281.328px]" data-name="Container">
      <Container34 />
      <Container35 />
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute h-[16px] left-0 top-0 w-[281.328px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tenure
      </p>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute h-[21px] left-0 top-[20px] w-[281.328px]" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        4.5 yrs in company
      </p>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 top-[41px] w-[281.328px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px relative text-[#4a5565] text-[14px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        2 yrs in role
      </p>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[61px] relative shrink-0 w-[281.328px]" data-name="Container">
      <Container37 />
      <Container38 />
      <Container39 />
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Salary
      </p>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        $145,000
      </p>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[281.344px]" data-name="Container">
      <Container41 />
      <Container42 />
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Last Promotion
      </p>
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Jan 15, 2023
      </p>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[281.344px]" data-name="Container">
      <Container44 />
      <Container45 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">
        <H2 />
        <Container33 />
        <Container36 />
        <Container40 />
        <Container43 />
      </div>
    </div>
  );
}

function GraduationCap() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="GraduationCap">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="GraduationCap">
          <path d={svgPaths.pd2ce200} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 8.33333V13.3333" id="Vector_2" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ead9c00} id="Vector_3" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function H3() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <GraduationCap />
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[28px] text-[#101828] text-[18px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>{`Education & Skills`}</p>
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Education
      </p>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        MS Computer Science - Stanford
      </p>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[320px]" data-name="Container">
      <Container47 />
      <Container48 />
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Certifications
      </p>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        AWS Solutions Architect, Scrum Master
      </p>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[320px]" data-name="Container">
      <Container50 />
      <Container51 />
    </div>
  );
}

function Span8() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[68.813px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        React
      </p>
    </div>
  );
}

function Span9() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[101.688px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        TypeScript
      </p>
    </div>
  );
}

function Span10() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[128.781px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        System Design
      </p>
    </div>
  );
}

function Span11() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[105.719px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Leadership
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-start flex flex-wrap gap-[10px_8px] items-start relative shrink-0 w-full">
      <Span8 />
      <Span9 />
      <Span10 />
      <Span11 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[325px]">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6a7282] text-[12px] tracking-[0.3px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Skills
      </p>
      <Frame />
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">
        <H3 />
        <Container46 />
        <Container49 />
        <Frame1 />
      </div>
    </div>
  );
}

function Shield() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="Shield">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Shield">
          <path d={svgPaths.p25fc4100} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function H4() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <Shield />
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[28px] text-[#101828] text-[18px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Risk Assessment
      </p>
    </div>
  );
}

function Container52() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Flight Risk
      </p>
    </div>
  );
}

function Badge2() {
  return (
    <div className="bg-[#dcfce7] h-[30px] relative rounded-[33554400px] shrink-0 w-[53.578px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#016630] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Low
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container52 />
      <Badge2 />
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Promotion Readiness
      </p>
    </div>
  );
}

function Badge3() {
  return (
    <div className="bg-[#dcfce7] h-[30px] relative rounded-[33554400px] shrink-0 w-[101.906px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#016630] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Ready Now
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container53 />
      <Badge3 />
    </div>
  );
}

function Container54() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Critical Role
      </p>
    </div>
  );
}

function AlertCircle() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="AlertCircle">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_77_3590)" id="AlertCircle">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 6.66667V10" id="Vector_2" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 13.3333H10.0083" id="Vector_3" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_77_3590">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span12() {
  return (
    <div className="h-[24px] relative shrink-0 w-[26.484px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#016699] text-[16px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          Yes
        </p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <AlertCircle />
      <Span12 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container54 />
      <Container55 />
    </div>
  );
}

function Container56() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Successor Identified
      </p>
    </div>
  );
}

function X() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="X">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="X">
          <path d="M15 5L5 15" id="Vector" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 5L15 15" id="Vector_2" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Span13() {
  return (
    <div className="h-[24px] relative shrink-0 w-[22.922px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#016699] text-[16px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          No
        </p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <X />
      <Span13 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container56 />
      <Container57 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">
        <H4 />
        <Frame2 />
        <Frame3 />
        <Frame4 />
        <Frame5 />
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[406px]">
      <Container4 />
      <Container14 />
      <Frame6 />
      <Frame7 />
      <Frame8 />
    </div>
  );
}

function Img1() {
  return (
    <div className="absolute h-[320px] left-0 top-0 w-[373.328px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg} />
    </div>
  );
}

function Container60() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.8)] h-[320px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.3)] w-[373.328px]" data-name="Container" />;
}

function Briefcase2() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[10px]" data-name="Briefcase">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Briefcase">
          <path d={svgPaths.p1c647980} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13d22180} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container61() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.8)] h-[36px] left-[16px] rounded-[33554400px] top-[16px] w-[200.047px]" data-name="Container">
      <Briefcase2 />
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] left-[40px] text-[14px] text-white top-[8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        4.5+ years experience
      </p>
    </div>
  );
}

function Container62() {
  return <div className="absolute bg-[#00c950] border-2 border-solid border-white left-[345.33px] rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[12px] top-[16px]" data-name="Container" />;
}

function Container65() {
  return <div className="absolute bg-[#51a2ff] left-[12px] rounded-[33554400px] size-[8px] top-[8px]" data-name="Container" />;
}

function Span14() {
  return (
    <div className="absolute h-[16px] left-[28px] top-[4px] w-[65.984px]" data-name="span">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.9)] top-0">ID: EMP001</p>
    </div>
  );
}

function Container64() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] border-solid h-[26px] left-[24px] rounded-[33554400px] top-[25px] w-[107.984px]" data-name="Container">
      <Container65 />
      <Span14 />
    </div>
  );
}

function H5() {
  return (
    <div className="absolute h-[32px] left-[24px] top-[75px] w-[325.328px]" data-name="h2">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[32px] left-0 text-[24px] text-white top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Sarah Chen
      </p>
    </div>
  );
}

function P1() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[111px] w-[325.328px]" data-name="p">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-[rgba(255,255,255,0.9)] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Senior Software Engineer
      </p>
    </div>
  );
}

function Badge4() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] h-[26px] left-0 rounded-[33554400px] top-0 w-[39.266px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          L5
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Badge5() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] h-[26px] left-[47.27px] rounded-[33554400px] top-0 w-[93.391px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          Engineering
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Container66() {
  return (
    <div className="absolute h-[26px] left-[24px] top-[147px] w-[325.328px]" data-name="Container">
      <Badge4 />
      <Badge5 />
    </div>
  );
}

function Container63() {
  return (
    <div className="absolute h-[197px] left-0 top-[123px] w-[373.328px]" data-name="Container">
      <Container64 />
      <H5 />
      <P1 />
      <Container66 />
    </div>
  );
}

function Phone1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Phone">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_77_3637)" id="Phone">
          <path d={svgPaths.p1a7ce800} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_77_3637">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[rgba(255,255,255,0.9)] relative rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 size-[40px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Phone1 />
      </div>
    </div>
  );
}

function Mail1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Mail">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Mail">
          <path d={svgPaths.pd919a80} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p189c1170} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[rgba(255,255,255,0.9)] flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Mail1 />
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[40px] items-start left-[261.33px] top-[256px] w-[88px]" data-name="Container">
      <Button7 />
      <Button8 />
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[320px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <Img1 />
      <Container60 />
      <Container61 />
      <Container62 />
      <Container63 />
      <Container67 />
    </div>
  );
}

function Container58() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[320px] items-start overflow-clip relative rounded-[16px] shadow-[1px_1px_20px_0px_rgba(0,0,0,0.1),1px_1px_12px_-4px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Container">
      <Container59 />
    </div>
  );
}

function Container70() {
  return (
    <div className="absolute h-[16px] left-[20px] opacity-90 top-[11px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-white top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Performance
      </p>
    </div>
  );
}

function Span15() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-start left-[17.16px] opacity-75 top-[10px] w-[17.734px]" data-name="span">
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[18px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        /5
      </p>
    </div>
  );
}

function Container71() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[31px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[36px] left-0 text-[30px] text-white top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        5
      </p>
      <Span15 />
    </div>
  );
}

function Star10() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star11() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star12() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star13() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star14() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container72() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[12px] items-start left-[20px] top-[75px] w-[138.656px]" data-name="Container">
      <Star10 />
      <Star11 />
      <Star12 />
      <Star13 />
      <Star14 />
    </div>
  );
}

function Container69() {
  return (
    <div className="absolute h-[103px] left-[0.16px] rounded-[16px] shadow-[1px_1px_10px_0px_rgba(0,0,0,0.1),1px_1px_6px_0px_rgba(0,0,0,0.05)] top-0 w-[179px]" data-name="Container" style={{ backgroundImage: "linear-gradient(150.083deg, rgb(43, 127, 255) 0%, rgb(21, 93, 252) 100%)" }}>
      <Container70 />
      <Container71 />
      <Container72 />
    </div>
  );
}

function Container74() {
  return (
    <div className="absolute h-[16px] left-[20px] opacity-90 top-[11px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-white top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Potential
      </p>
    </div>
  );
}

function Span16() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-start left-[17.16px] opacity-75 top-[10px] w-[17.734px]" data-name="span">
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[18px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        /5
      </p>
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[31px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[36px] left-0 text-[30px] text-white top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        4
      </p>
      <Span16 />
    </div>
  );
}

function Star15() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star16() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star17() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star18() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star19() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3610)" id="Star">
          <path d={svgPaths.p295e8380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3" />
        </g>
        <defs>
          <clipPath id="clip0_77_3610">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container76() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[12px] items-start left-[20px] top-[75px] w-[138.672px]" data-name="Container">
      <Star15 />
      <Star16 />
      <Star17 />
      <Star18 />
      <Star19 />
    </div>
  );
}

function Container73() {
  return (
    <div className="absolute h-[103px] left-[195.16px] rounded-[16px] shadow-[1px_1px_10px_0px_rgba(0,0,0,0.1),1px_1px_6px_0px_rgba(0,0,0,0.05)] top-0 w-[178px]" data-name="Container" style={{ backgroundImage: "linear-gradient(149.944deg, rgb(97, 95, 255) 0%, rgb(79, 57, 246) 100%)" }}>
      <Container74 />
      <Container75 />
      <Container76 />
    </div>
  );
}

function Container78() {
  return (
    <div className="absolute h-[16px] left-[20px] top-[12px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Engagement
      </p>
    </div>
  );
}

function Container79() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[32px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#016699] text-[0px] top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span className="leading-[36px] text-[30px]">92</span>
        <span className="leading-[28px] text-[#6a7282] text-[18px]">%</span>
      </p>
    </div>
  );
}

function Container81() {
  return <div className="bg-gradient-to-r from-[#05df72] h-[8px] rounded-[33554400px] shrink-0 to-[#00a63e] w-full" data-name="Container" />;
}

function Container80() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex flex-col h-[8px] items-start left-[20px] pr-[11.094px] rounded-[33554400px] top-[72px] w-[138.656px]" data-name="Container">
      <Container81 />
    </div>
  );
}

function Container77() {
  return (
    <div className="absolute bg-[#f8f9fa] h-[94px] left-[0.16px] rounded-[16px] top-[117px] w-[179px]" data-name="Container">
      <Container78 />
      <Container79 />
      <Container80 />
    </div>
  );
}

function Container83() {
  return (
    <div className="absolute h-[16px] left-[20px] top-[12px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Flight Risk
      </p>
    </div>
  );
}

function Container84() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[32px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#016699] text-[0px] top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span className="leading-[36px] text-[30px]">15</span>
        <span className="leading-[28px] text-[#6a7282] text-[18px]">%</span>
      </p>
    </div>
  );
}

function Container86() {
  return <div className="bg-gradient-to-r from-[#ff6467] h-[8px] rounded-[33554400px] shrink-0 to-[#e7000b] w-full" data-name="Container" />;
}

function Container85() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex flex-col h-[8px] items-start left-[20px] pr-[117.875px] rounded-[33554400px] top-[72px] w-[138.672px]" data-name="Container">
      <Container86 />
    </div>
  );
}

function Container82() {
  return (
    <div className="absolute bg-[#f8f9fa] h-[94px] left-[195.16px] rounded-[16px] top-[117px] w-[178px]" data-name="Container">
      <Container83 />
      <Container84 />
      <Container85 />
    </div>
  );
}

function Container68() {
  return (
    <div className="h-[211px] relative shrink-0 w-[373px]" data-name="Container">
      <Container69 />
      <Container73 />
      <Container77 />
      <Container82 />
    </div>
  );
}

function Briefcase3() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="Briefcase">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Briefcase">
          <path d={svgPaths.pe6b10c0} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p4c21d00} id="Vector_2" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function H6() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <Briefcase3 />
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[28px] text-[#101828] text-[18px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Career Information
      </p>
    </div>
  );
}

function Container88() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Manager
      </p>
    </div>
  );
}

function Container89() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        David Kim
      </p>
    </div>
  );
}

function Container87() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[281.328px]" data-name="Container">
      <Container88 />
      <Container89 />
    </div>
  );
}

function Container91() {
  return (
    <div className="absolute h-[16px] left-0 top-0 w-[281.328px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tenure
      </p>
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute h-[21px] left-0 top-[20px] w-[281.328px]" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        4.5 yrs in company
      </p>
    </div>
  );
}

function Container93() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 top-[41px] w-[281.328px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px relative text-[#4a5565] text-[14px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        2 yrs in role
      </p>
    </div>
  );
}

function Container90() {
  return (
    <div className="h-[61px] relative shrink-0 w-[281.328px]" data-name="Container">
      <Container91 />
      <Container92 />
      <Container93 />
    </div>
  );
}

function Container95() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Salary
      </p>
    </div>
  );
}

function Container96() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        $145,000
      </p>
    </div>
  );
}

function Container94() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[281.344px]" data-name="Container">
      <Container95 />
      <Container96 />
    </div>
  );
}

function Container98() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Last Promotion
      </p>
    </div>
  );
}

function Container99() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Jan 15, 2023
      </p>
    </div>
  );
}

function Container97() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[281.344px]" data-name="Container">
      <Container98 />
      <Container99 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">
        <H6 />
        <Container87 />
        <Container90 />
        <Container94 />
        <Container97 />
      </div>
    </div>
  );
}

function GraduationCap1() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="GraduationCap">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="GraduationCap">
          <path d={svgPaths.pd2ce200} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 8.33333V13.3333" id="Vector_2" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ead9c00} id="Vector_3" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function H7() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <GraduationCap1 />
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[28px] text-[#101828] text-[18px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>{`Education & Skills`}</p>
    </div>
  );
}

function Container101() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Education
      </p>
    </div>
  );
}

function Container102() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        MS Computer Science - Stanford
      </p>
    </div>
  );
}

function Container100() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[320px]" data-name="Container">
      <Container101 />
      <Container102 />
    </div>
  );
}

function Container104() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Certifications
      </p>
    </div>
  );
}

function Container105() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        AWS Solutions Architect, Scrum Master
      </p>
    </div>
  );
}

function Container103() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[320px]" data-name="Container">
      <Container104 />
      <Container105 />
    </div>
  );
}

function Span17() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[68.813px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        React
      </p>
    </div>
  );
}

function Span18() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[101.688px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        TypeScript
      </p>
    </div>
  );
}

function Span19() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[128.781px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        System Design
      </p>
    </div>
  );
}

function Span20() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[105.719px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Leadership
      </p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-start flex flex-wrap gap-[10px_8px] items-start relative shrink-0 w-full">
      <Span17 />
      <Span18 />
      <Span19 />
      <Span20 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[325px]">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6a7282] text-[12px] tracking-[0.3px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Skills
      </p>
      <Frame15 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">
        <H7 />
        <Container100 />
        <Container103 />
        <Frame14 />
      </div>
    </div>
  );
}

function Shield1() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="Shield">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Shield">
          <path d={svgPaths.p25fc4100} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function H8() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <Shield1 />
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[28px] text-[#101828] text-[18px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Risk Assessment
      </p>
    </div>
  );
}

function Container106() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Flight Risk
      </p>
    </div>
  );
}

function Badge6() {
  return (
    <div className="bg-[#dcfce7] h-[30px] relative rounded-[33554400px] shrink-0 w-[53.578px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#016630] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Low
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container106 />
      <Badge6 />
    </div>
  );
}

function Container107() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Promotion Readiness
      </p>
    </div>
  );
}

function Badge7() {
  return (
    <div className="bg-[#dcfce7] h-[30px] relative rounded-[33554400px] shrink-0 w-[101.906px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#016630] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Ready Now
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container107 />
      <Badge7 />
    </div>
  );
}

function Container108() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Critical Role
      </p>
    </div>
  );
}

function AlertCircle1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="AlertCircle">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_77_3590)" id="AlertCircle">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 6.66667V10" id="Vector_2" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 13.3333H10.0083" id="Vector_3" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_77_3590">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span21() {
  return (
    <div className="h-[24px] relative shrink-0 w-[26.484px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#016699] text-[16px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          Yes
        </p>
      </div>
    </div>
  );
}

function Container109() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <AlertCircle1 />
      <Span21 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container108 />
      <Container109 />
    </div>
  );
}

function Container110() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Successor Identified
      </p>
    </div>
  );
}

function X1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="X">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="X">
          <path d="M15 5L5 15" id="Vector" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 5L15 15" id="Vector_2" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Span22() {
  return (
    <div className="h-[24px] relative shrink-0 w-[22.922px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#016699] text-[16px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          No
        </p>
      </div>
    </div>
  );
}

function Container111() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <X1 />
      <Span22 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container110 />
      <Container111 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">
        <H8 />
        <Frame17 />
        <Frame18 />
        <Frame19 />
        <Frame20 />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[406px]">
      <Container58 />
      <Container68 />
      <Frame12 />
      <Frame13 />
      <Frame16 />
    </div>
  );
}

function Img2() {
  return (
    <div className="absolute h-[320px] left-0 top-0 w-[373.328px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg} />
    </div>
  );
}

function Container114() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.8)] h-[320px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.3)] w-[373.328px]" data-name="Container" />;
}

function Briefcase4() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[10px]" data-name="Briefcase">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Briefcase">
          <path d={svgPaths.p1c647980} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13d22180} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container115() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.8)] h-[36px] left-[16px] rounded-[33554400px] top-[16px] w-[200.047px]" data-name="Container">
      <Briefcase4 />
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] left-[40px] text-[14px] text-white top-[8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        4.5+ years experience
      </p>
    </div>
  );
}

function Container116() {
  return <div className="absolute bg-[#00c950] border-2 border-solid border-white left-[345.33px] rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[12px] top-[16px]" data-name="Container" />;
}

function Container119() {
  return <div className="absolute bg-[#51a2ff] left-[12px] rounded-[33554400px] size-[8px] top-[8px]" data-name="Container" />;
}

function Span23() {
  return (
    <div className="absolute h-[16px] left-[28px] top-[4px] w-[65.984px]" data-name="span">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.9)] top-0">ID: EMP001</p>
    </div>
  );
}

function Container118() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] border-solid h-[26px] left-[24px] rounded-[33554400px] top-[25px] w-[107.984px]" data-name="Container">
      <Container119 />
      <Span23 />
    </div>
  );
}

function H9() {
  return (
    <div className="absolute h-[32px] left-[24px] top-[75px] w-[325.328px]" data-name="h2">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[32px] left-0 text-[24px] text-white top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Sarah Chen
      </p>
    </div>
  );
}

function P2() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[111px] w-[325.328px]" data-name="p">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-[rgba(255,255,255,0.9)] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Senior Software Engineer
      </p>
    </div>
  );
}

function Badge8() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] h-[26px] left-0 rounded-[33554400px] top-0 w-[39.266px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          L5
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Badge9() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] h-[26px] left-[47.27px] rounded-[33554400px] top-0 w-[93.391px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          Engineering
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Container120() {
  return (
    <div className="absolute h-[26px] left-[24px] top-[147px] w-[325.328px]" data-name="Container">
      <Badge8 />
      <Badge9 />
    </div>
  );
}

function Container117() {
  return (
    <div className="absolute h-[197px] left-0 top-[123px] w-[373.328px]" data-name="Container">
      <Container118 />
      <H9 />
      <P2 />
      <Container120 />
    </div>
  );
}

function Phone2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Phone">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_77_3637)" id="Phone">
          <path d={svgPaths.p1a7ce800} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_77_3637">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[rgba(255,255,255,0.9)] relative rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 size-[40px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Phone2 />
      </div>
    </div>
  );
}

function Mail2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Mail">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Mail">
          <path d={svgPaths.pd919a80} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p189c1170} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[rgba(255,255,255,0.9)] flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Mail2 />
      </div>
    </div>
  );
}

function Container121() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[40px] items-start left-[261.33px] top-[256px] w-[88px]" data-name="Container">
      <Button9 />
      <Button10 />
    </div>
  );
}

function Container113() {
  return (
    <div className="h-[320px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <Img2 />
      <Container114 />
      <Container115 />
      <Container116 />
      <Container117 />
      <Container121 />
    </div>
  );
}

function Container112() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[320px] items-start overflow-clip relative rounded-[16px] shadow-[1px_1px_20px_0px_rgba(0,0,0,0.1),1px_1px_12px_-4px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Container">
      <Container113 />
    </div>
  );
}

function Container124() {
  return (
    <div className="absolute h-[16px] left-[20px] opacity-90 top-[11px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-white top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Performance
      </p>
    </div>
  );
}

function Span24() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-start left-[17.16px] opacity-75 top-[10px] w-[17.734px]" data-name="span">
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[18px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        /5
      </p>
    </div>
  );
}

function Container125() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[31px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[36px] left-0 text-[30px] text-white top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        5
      </p>
      <Span24 />
    </div>
  );
}

function Star20() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star21() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star22() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star23() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star24() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container126() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[12px] items-start left-[20px] top-[75px] w-[138.656px]" data-name="Container">
      <Star20 />
      <Star21 />
      <Star22 />
      <Star23 />
      <Star24 />
    </div>
  );
}

function Container123() {
  return (
    <div className="absolute h-[103px] left-[0.16px] rounded-[16px] shadow-[1px_1px_10px_0px_rgba(0,0,0,0.1),1px_1px_6px_0px_rgba(0,0,0,0.05)] top-0 w-[179px]" data-name="Container" style={{ backgroundImage: "linear-gradient(150.083deg, rgb(43, 127, 255) 0%, rgb(21, 93, 252) 100%)" }}>
      <Container124 />
      <Container125 />
      <Container126 />
    </div>
  );
}

function Container128() {
  return (
    <div className="absolute h-[16px] left-[20px] opacity-90 top-[11px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-white top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Potential
      </p>
    </div>
  );
}

function Span25() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-start left-[17.16px] opacity-75 top-[10px] w-[17.734px]" data-name="span">
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[18px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        /5
      </p>
    </div>
  );
}

function Container129() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[31px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[36px] left-0 text-[30px] text-white top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        4
      </p>
      <Span25 />
    </div>
  );
}

function Star25() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star26() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star27() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star28() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star29() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3610)" id="Star">
          <path d={svgPaths.p295e8380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3" />
        </g>
        <defs>
          <clipPath id="clip0_77_3610">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container130() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[12px] items-start left-[20px] top-[75px] w-[138.672px]" data-name="Container">
      <Star25 />
      <Star26 />
      <Star27 />
      <Star28 />
      <Star29 />
    </div>
  );
}

function Container127() {
  return (
    <div className="absolute h-[103px] left-[195.16px] rounded-[16px] shadow-[1px_1px_10px_0px_rgba(0,0,0,0.1),1px_1px_6px_0px_rgba(0,0,0,0.05)] top-0 w-[178px]" data-name="Container" style={{ backgroundImage: "linear-gradient(149.944deg, rgb(97, 95, 255) 0%, rgb(79, 57, 246) 100%)" }}>
      <Container128 />
      <Container129 />
      <Container130 />
    </div>
  );
}

function Container132() {
  return (
    <div className="absolute h-[16px] left-[20px] top-[12px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Engagement
      </p>
    </div>
  );
}

function Container133() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[32px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#016699] text-[0px] top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span className="leading-[36px] text-[30px]">92</span>
        <span className="leading-[28px] text-[#6a7282] text-[18px]">%</span>
      </p>
    </div>
  );
}

function Container135() {
  return <div className="bg-gradient-to-r from-[#05df72] h-[8px] rounded-[33554400px] shrink-0 to-[#00a63e] w-full" data-name="Container" />;
}

function Container134() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex flex-col h-[8px] items-start left-[20px] pr-[11.094px] rounded-[33554400px] top-[72px] w-[138.656px]" data-name="Container">
      <Container135 />
    </div>
  );
}

function Container131() {
  return (
    <div className="absolute bg-[#f8f9fa] h-[94px] left-[0.16px] rounded-[16px] top-[117px] w-[179px]" data-name="Container">
      <Container132 />
      <Container133 />
      <Container134 />
    </div>
  );
}

function Container137() {
  return (
    <div className="absolute h-[16px] left-[20px] top-[12px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Flight Risk
      </p>
    </div>
  );
}

function Container138() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[32px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#016699] text-[0px] top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span className="leading-[36px] text-[30px]">15</span>
        <span className="leading-[28px] text-[#6a7282] text-[18px]">%</span>
      </p>
    </div>
  );
}

function Container140() {
  return <div className="bg-gradient-to-r from-[#ff6467] h-[8px] rounded-[33554400px] shrink-0 to-[#e7000b] w-full" data-name="Container" />;
}

function Container139() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex flex-col h-[8px] items-start left-[20px] pr-[117.875px] rounded-[33554400px] top-[72px] w-[138.672px]" data-name="Container">
      <Container140 />
    </div>
  );
}

function Container136() {
  return (
    <div className="absolute bg-[#f8f9fa] h-[94px] left-[195.16px] rounded-[16px] top-[117px] w-[178px]" data-name="Container">
      <Container137 />
      <Container138 />
      <Container139 />
    </div>
  );
}

function Container122() {
  return (
    <div className="h-[211px] relative shrink-0 w-[373px]" data-name="Container">
      <Container123 />
      <Container127 />
      <Container131 />
      <Container136 />
    </div>
  );
}

function Briefcase5() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="Briefcase">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Briefcase">
          <path d={svgPaths.pe6b10c0} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p4c21d00} id="Vector_2" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function H10() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <Briefcase5 />
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[28px] text-[#101828] text-[18px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Career Information
      </p>
    </div>
  );
}

function Container142() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Manager
      </p>
    </div>
  );
}

function Container143() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        David Kim
      </p>
    </div>
  );
}

function Container141() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[281.328px]" data-name="Container">
      <Container142 />
      <Container143 />
    </div>
  );
}

function Container145() {
  return (
    <div className="absolute h-[16px] left-0 top-0 w-[281.328px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tenure
      </p>
    </div>
  );
}

function Container146() {
  return (
    <div className="absolute h-[21px] left-0 top-[20px] w-[281.328px]" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        4.5 yrs in company
      </p>
    </div>
  );
}

function Container147() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 top-[41px] w-[281.328px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px relative text-[#4a5565] text-[14px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        2 yrs in role
      </p>
    </div>
  );
}

function Container144() {
  return (
    <div className="h-[61px] relative shrink-0 w-[281.328px]" data-name="Container">
      <Container145 />
      <Container146 />
      <Container147 />
    </div>
  );
}

function Container149() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Salary
      </p>
    </div>
  );
}

function Container150() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        $145,000
      </p>
    </div>
  );
}

function Container148() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[281.344px]" data-name="Container">
      <Container149 />
      <Container150 />
    </div>
  );
}

function Container152() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Last Promotion
      </p>
    </div>
  );
}

function Container153() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Jan 15, 2023
      </p>
    </div>
  );
}

function Container151() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[281.344px]" data-name="Container">
      <Container152 />
      <Container153 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">
        <H10 />
        <Container141 />
        <Container144 />
        <Container148 />
        <Container151 />
      </div>
    </div>
  );
}

function GraduationCap2() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="GraduationCap">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="GraduationCap">
          <path d={svgPaths.pd2ce200} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 8.33333V13.3333" id="Vector_2" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ead9c00} id="Vector_3" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function H11() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <GraduationCap2 />
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[28px] text-[#101828] text-[18px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>{`Education & Skills`}</p>
    </div>
  );
}

function Container155() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Education
      </p>
    </div>
  );
}

function Container156() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        MS Computer Science - Stanford
      </p>
    </div>
  );
}

function Container154() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[320px]" data-name="Container">
      <Container155 />
      <Container156 />
    </div>
  );
}

function Container158() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Certifications
      </p>
    </div>
  );
}

function Container159() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        AWS Solutions Architect, Scrum Master
      </p>
    </div>
  );
}

function Container157() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[320px]" data-name="Container">
      <Container158 />
      <Container159 />
    </div>
  );
}

function Span26() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[68.813px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        React
      </p>
    </div>
  );
}

function Span27() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[101.688px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        TypeScript
      </p>
    </div>
  );
}

function Span28() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[128.781px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        System Design
      </p>
    </div>
  );
}

function Span29() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[105.719px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Leadership
      </p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-start flex flex-wrap gap-[10px_8px] items-start relative shrink-0 w-full">
      <Span26 />
      <Span27 />
      <Span28 />
      <Span29 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[325px]">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6a7282] text-[12px] tracking-[0.3px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Skills
      </p>
      <Frame25 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">
        <H11 />
        <Container154 />
        <Container157 />
        <Frame24 />
      </div>
    </div>
  );
}

function Shield2() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="Shield">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Shield">
          <path d={svgPaths.p25fc4100} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function H12() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <Shield2 />
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[28px] text-[#101828] text-[18px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Risk Assessment
      </p>
    </div>
  );
}

function Container160() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Flight Risk
      </p>
    </div>
  );
}

function Badge10() {
  return (
    <div className="bg-[#dcfce7] h-[30px] relative rounded-[33554400px] shrink-0 w-[53.578px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#016630] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Low
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container160 />
      <Badge10 />
    </div>
  );
}

function Container161() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Promotion Readiness
      </p>
    </div>
  );
}

function Badge11() {
  return (
    <div className="bg-[#dcfce7] h-[30px] relative rounded-[33554400px] shrink-0 w-[101.906px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#016630] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Ready Now
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container161 />
      <Badge11 />
    </div>
  );
}

function Container162() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Critical Role
      </p>
    </div>
  );
}

function AlertCircle2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="AlertCircle">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_77_3590)" id="AlertCircle">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 6.66667V10" id="Vector_2" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 13.3333H10.0083" id="Vector_3" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_77_3590">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span30() {
  return (
    <div className="h-[24px] relative shrink-0 w-[26.484px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#016699] text-[16px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          Yes
        </p>
      </div>
    </div>
  );
}

function Container163() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <AlertCircle2 />
      <Span30 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container162 />
      <Container163 />
    </div>
  );
}

function Container164() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Successor Identified
      </p>
    </div>
  );
}

function X2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="X">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="X">
          <path d="M15 5L5 15" id="Vector" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 5L15 15" id="Vector_2" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Span31() {
  return (
    <div className="h-[24px] relative shrink-0 w-[22.922px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#016699] text-[16px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          No
        </p>
      </div>
    </div>
  );
}

function Container165() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <X2 />
      <Span31 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container164 />
      <Container165 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">
        <H12 />
        <Frame27 />
        <Frame28 />
        <Frame29 />
        <Frame30 />
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[406px]">
      <Container112 />
      <Container122 />
      <Frame22 />
      <Frame23 />
      <Frame26 />
    </div>
  );
}

function Img3() {
  return (
    <div className="absolute h-[320px] left-0 top-0 w-[373.328px]" data-name="img">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg} />
    </div>
  );
}

function Container168() {
  return <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.8)] h-[320px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0.3)] w-[373.328px]" data-name="Container" />;
}

function Briefcase6() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[10px]" data-name="Briefcase">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Briefcase">
          <path d={svgPaths.p1c647980} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p13d22180} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container169() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.8)] h-[36px] left-[16px] rounded-[33554400px] top-[16px] w-[200.047px]" data-name="Container">
      <Briefcase6 />
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] left-[40px] text-[14px] text-white top-[8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        4.5+ years experience
      </p>
    </div>
  );
}

function Container170() {
  return <div className="absolute bg-[#00c950] border-2 border-solid border-white left-[345.33px] rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[12px] top-[16px]" data-name="Container" />;
}

function Container173() {
  return <div className="absolute bg-[#51a2ff] left-[12px] rounded-[33554400px] size-[8px] top-[8px]" data-name="Container" />;
}

function Span32() {
  return (
    <div className="absolute h-[16px] left-[28px] top-[4px] w-[65.984px]" data-name="span">
      <p className="absolute font-['Consolas:Regular',sans-serif] leading-[16px] left-0 not-italic text-[12px] text-[rgba(255,255,255,0.9)] top-0">ID: EMP001</p>
    </div>
  );
}

function Container172() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] border-solid h-[26px] left-[24px] rounded-[33554400px] top-[25px] w-[107.984px]" data-name="Container">
      <Container173 />
      <Span32 />
    </div>
  );
}

function H13() {
  return (
    <div className="absolute h-[32px] left-[24px] top-[75px] w-[325.328px]" data-name="h2">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[32px] left-0 text-[24px] text-white top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Sarah Chen
      </p>
    </div>
  );
}

function P3() {
  return (
    <div className="absolute h-[24px] left-[24px] top-[111px] w-[325.328px]" data-name="p">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-[rgba(255,255,255,0.9)] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Senior Software Engineer
      </p>
    </div>
  );
}

function Badge12() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] h-[26px] left-0 rounded-[33554400px] top-0 w-[39.266px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          L5
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Badge13() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] h-[26px] left-[47.27px] rounded-[33554400px] top-0 w-[93.391px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
          Engineering
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.3)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Container174() {
  return (
    <div className="absolute h-[26px] left-[24px] top-[147px] w-[325.328px]" data-name="Container">
      <Badge12 />
      <Badge13 />
    </div>
  );
}

function Container171() {
  return (
    <div className="absolute h-[197px] left-0 top-[123px] w-[373.328px]" data-name="Container">
      <Container172 />
      <H13 />
      <P3 />
      <Container174 />
    </div>
  );
}

function Phone3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Phone">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_77_3637)" id="Phone">
          <path d={svgPaths.p1a7ce800} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_77_3637">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-[rgba(255,255,255,0.9)] relative rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 size-[40px]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Phone3 />
      </div>
    </div>
  );
}

function Mail3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Mail">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Mail">
          <path d={svgPaths.pd919a80} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p189c1170} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-[rgba(255,255,255,0.9)] flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[33554400px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" data-name="button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Mail3 />
      </div>
    </div>
  );
}

function Container175() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[40px] items-start left-[261.33px] top-[256px] w-[88px]" data-name="Container">
      <Button11 />
      <Button12 />
    </div>
  );
}

function Container167() {
  return (
    <div className="h-[320px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <Img3 />
      <Container168 />
      <Container169 />
      <Container170 />
      <Container171 />
      <Container175 />
    </div>
  );
}

function Container166() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[320px] items-start overflow-clip relative rounded-[16px] shadow-[1px_1px_20px_0px_rgba(0,0,0,0.1),1px_1px_12px_-4px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Container">
      <Container167 />
    </div>
  );
}

function Container178() {
  return (
    <div className="absolute h-[16px] left-[20px] opacity-90 top-[11px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-white top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Performance
      </p>
    </div>
  );
}

function Span33() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-start left-[17.16px] opacity-75 top-[10px] w-[17.734px]" data-name="span">
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[18px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        /5
      </p>
    </div>
  );
}

function Container179() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[31px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[36px] left-0 text-[30px] text-white top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        5
      </p>
      <Span33 />
    </div>
  );
}

function Star30() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star31() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star32() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star33() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star34() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container180() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[12px] items-start left-[20px] top-[75px] w-[138.656px]" data-name="Container">
      <Star30 />
      <Star31 />
      <Star32 />
      <Star33 />
      <Star34 />
    </div>
  );
}

function Container177() {
  return (
    <div className="absolute h-[103px] left-[0.16px] rounded-[16px] shadow-[1px_1px_10px_0px_rgba(0,0,0,0.1),1px_1px_6px_0px_rgba(0,0,0,0.05)] top-0 w-[179px]" data-name="Container" style={{ backgroundImage: "linear-gradient(150.083deg, rgb(43, 127, 255) 0%, rgb(21, 93, 252) 100%)" }}>
      <Container178 />
      <Container179 />
      <Container180 />
    </div>
  );
}

function Container182() {
  return (
    <div className="absolute h-[16px] left-[20px] opacity-90 top-[11px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[12px] text-white top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Potential
      </p>
    </div>
  );
}

function Span34() {
  return (
    <div className="absolute content-stretch flex h-[24px] items-start left-[17.16px] opacity-75 top-[10px] w-[17.734px]" data-name="span">
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[18px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
        /5
      </p>
    </div>
  );
}

function Container183() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[31px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[36px] left-0 text-[30px] text-white top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        4
      </p>
      <Span34 />
    </div>
  );
}

function Star35() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star36() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star37() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star38() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3613)" id="Star">
          <path d={svgPaths.p295e8380} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_77_3613">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Star39() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Star">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_77_3610)" id="Star">
          <path d={svgPaths.p295e8380} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3" />
        </g>
        <defs>
          <clipPath id="clip0_77_3610">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container184() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[12px] items-start left-[20px] top-[75px] w-[138.672px]" data-name="Container">
      <Star35 />
      <Star36 />
      <Star37 />
      <Star38 />
      <Star39 />
    </div>
  );
}

function Container181() {
  return (
    <div className="absolute h-[103px] left-[195.16px] rounded-[16px] shadow-[1px_1px_10px_0px_rgba(0,0,0,0.1),1px_1px_6px_0px_rgba(0,0,0,0.05)] top-0 w-[178px]" data-name="Container" style={{ backgroundImage: "linear-gradient(149.944deg, rgb(97, 95, 255) 0%, rgb(79, 57, 246) 100%)" }}>
      <Container182 />
      <Container183 />
      <Container184 />
    </div>
  );
}

function Container186() {
  return (
    <div className="absolute h-[16px] left-[20px] top-[12px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Engagement
      </p>
    </div>
  );
}

function Container187() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[32px] w-[138.656px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#016699] text-[0px] top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span className="leading-[36px] text-[30px]">92</span>
        <span className="leading-[28px] text-[#6a7282] text-[18px]">%</span>
      </p>
    </div>
  );
}

function Container189() {
  return <div className="bg-gradient-to-r from-[#05df72] h-[8px] rounded-[33554400px] shrink-0 to-[#00a63e] w-full" data-name="Container" />;
}

function Container188() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex flex-col h-[8px] items-start left-[20px] pr-[11.094px] rounded-[33554400px] top-[72px] w-[138.656px]" data-name="Container">
      <Container189 />
    </div>
  );
}

function Container185() {
  return (
    <div className="absolute bg-[#f8f9fa] h-[94px] left-[0.16px] rounded-[16px] top-[117px] w-[179px]" data-name="Container">
      <Container186 />
      <Container187 />
      <Container188 />
    </div>
  );
}

function Container191() {
  return (
    <div className="absolute h-[16px] left-[20px] top-[12px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Flight Risk
      </p>
    </div>
  );
}

function Container192() {
  return (
    <div className="absolute h-[36px] left-[20px] top-[32px] w-[138.672px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[0] left-0 text-[#016699] text-[0px] top-[-1px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span className="leading-[36px] text-[30px]">15</span>
        <span className="leading-[28px] text-[#6a7282] text-[18px]">%</span>
      </p>
    </div>
  );
}

function Container194() {
  return <div className="bg-gradient-to-r from-[#ff6467] h-[8px] rounded-[33554400px] shrink-0 to-[#e7000b] w-full" data-name="Container" />;
}

function Container193() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex flex-col h-[8px] items-start left-[20px] pr-[117.875px] rounded-[33554400px] top-[72px] w-[138.672px]" data-name="Container">
      <Container194 />
    </div>
  );
}

function Container190() {
  return (
    <div className="absolute bg-[#f8f9fa] h-[94px] left-[195.16px] rounded-[16px] top-[117px] w-[178px]" data-name="Container">
      <Container191 />
      <Container192 />
      <Container193 />
    </div>
  );
}

function Container176() {
  return (
    <div className="h-[211px] relative shrink-0 w-[373px]" data-name="Container">
      <Container177 />
      <Container181 />
      <Container185 />
      <Container190 />
    </div>
  );
}

function Briefcase7() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="Briefcase">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Briefcase">
          <path d={svgPaths.pe6b10c0} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p4c21d00} id="Vector_2" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function H14() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <Briefcase7 />
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[28px] text-[#101828] text-[18px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Career Information
      </p>
    </div>
  );
}

function Container196() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Manager
      </p>
    </div>
  );
}

function Container197() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        David Kim
      </p>
    </div>
  );
}

function Container195() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[281.328px]" data-name="Container">
      <Container196 />
      <Container197 />
    </div>
  );
}

function Container199() {
  return (
    <div className="absolute h-[16px] left-0 top-0 w-[281.328px]" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Tenure
      </p>
    </div>
  );
}

function Container200() {
  return (
    <div className="absolute h-[21px] left-0 top-[20px] w-[281.328px]" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        4.5 yrs in company
      </p>
    </div>
  );
}

function Container201() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 top-[41px] w-[281.328px]" data-name="Container">
      <p className="flex-[1_0_0] font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px relative text-[#4a5565] text-[14px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        2 yrs in role
      </p>
    </div>
  );
}

function Container198() {
  return (
    <div className="h-[61px] relative shrink-0 w-[281.328px]" data-name="Container">
      <Container199 />
      <Container200 />
      <Container201 />
    </div>
  );
}

function Container203() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Salary
      </p>
    </div>
  );
}

function Container204() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        $145,000
      </p>
    </div>
  );
}

function Container202() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[281.344px]" data-name="Container">
      <Container203 />
      <Container204 />
    </div>
  );
}

function Container206() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Last Promotion
      </p>
    </div>
  );
}

function Container207() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Jan 15, 2023
      </p>
    </div>
  );
}

function Container205() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[281.344px]" data-name="Container">
      <Container206 />
      <Container207 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">
        <H14 />
        <Container195 />
        <Container198 />
        <Container202 />
        <Container205 />
      </div>
    </div>
  );
}

function GraduationCap3() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="GraduationCap">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="GraduationCap">
          <path d={svgPaths.pd2ce200} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 8.33333V13.3333" id="Vector_2" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1ead9c00} id="Vector_3" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function H15() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <GraduationCap3 />
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[28px] text-[#101828] text-[18px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>{`Education & Skills`}</p>
    </div>
  );
}

function Container209() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Education
      </p>
    </div>
  );
}

function Container210() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        MS Computer Science - Stanford
      </p>
    </div>
  );
}

function Container208() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[320px]" data-name="Container">
      <Container209 />
      <Container210 />
    </div>
  );
}

function Container212() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Certifications
      </p>
    </div>
  );
}

function Container213() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[21px] left-0 text-[#016699] text-[14px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        AWS Solutions Architect, Scrum Master
      </p>
    </div>
  );
}

function Container211() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[41px] items-start relative shrink-0 w-[320px]" data-name="Container">
      <Container212 />
      <Container213 />
    </div>
  );
}

function Span35() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[68.813px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        React
      </p>
    </div>
  );
}

function Span36() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[101.688px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        TypeScript
      </p>
    </div>
  );
}

function Span37() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[128.781px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        System Design
      </p>
    </div>
  );
}

function Span38() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#eff6ff] h-[36px] items-start px-[16px] py-[8px] relative rounded-[33554400px] shadow-[1px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 to-[#eef2ff] w-[105.719px]" data-name="span">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#016699] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Leadership
      </p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-start flex flex-wrap gap-[10px_8px] items-start relative shrink-0 w-full">
      <Span35 />
      <Span36 />
      <Span37 />
      <Span38 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[325px]">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6a7282] text-[12px] tracking-[0.3px] w-full whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Skills
      </p>
      <Frame35 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">
        <H15 />
        <Container208 />
        <Container211 />
        <Frame34 />
      </div>
    </div>
  );
}

function Shield3() {
  return (
    <div className="absolute left-0 size-[20px] top-[4px]" data-name="Shield">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Shield">
          <path d={svgPaths.p25fc4100} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function H16() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="h3">
      <Shield3 />
      <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[28px] text-[#101828] text-[18px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
        Risk Assessment
      </p>
    </div>
  );
}

function Container214() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Flight Risk
      </p>
    </div>
  );
}

function Badge14() {
  return (
    <div className="bg-[#dcfce7] h-[30px] relative rounded-[33554400px] shrink-0 w-[53.578px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#016630] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Low
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container214 />
      <Badge14 />
    </div>
  );
}

function Container215() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Promotion Readiness
      </p>
    </div>
  );
}

function Badge15() {
  return (
    <div className="bg-[#dcfce7] h-[30px] relative rounded-[33554400px] shrink-0 w-[101.906px]" data-name="Badge">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[13px] py-[5px] relative rounded-[inherit] size-full">
        <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#016630] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Ready Now
        </p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container215 />
      <Badge15 />
    </div>
  );
}

function Container216() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Critical Role
      </p>
    </div>
  );
}

function AlertCircle3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="AlertCircle">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_77_3590)" id="AlertCircle">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 6.66667V10" id="Vector_2" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 13.3333H10.0083" id="Vector_3" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_77_3590">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Span39() {
  return (
    <div className="h-[24px] relative shrink-0 w-[26.484px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[24px] left-0 text-[#016699] text-[16px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          Yes
        </p>
      </div>
    </div>
  );
}

function Container217() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <AlertCircle3 />
      <Span39 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container216 />
      <Container217 />
    </div>
  );
}

function Container218() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Open_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#6a7282] text-[12px] top-[-1px] tracking-[0.3px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Successor Identified
      </p>
    </div>
  );
}

function X3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="X">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="X">
          <path d="M15 5L5 15" id="Vector" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M5 5L15 15" id="Vector_2" stroke="var(--stroke-0, #FB2C36)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Span40() {
  return (
    <div className="h-[24px] relative shrink-0 w-[22.922px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Open_Sans:Bold',sans-serif] font-bold leading-[24px] left-0 text-[#016699] text-[16px] top-0" style={{ fontVariationSettings: "'wdth' 100" }}>
          No
        </p>
      </div>
    </div>
  );
}

function Container219() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <X3 />
      <Span40 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container218 />
      <Container219 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[16px] relative w-full">
        <H16 />
        <Frame37 />
        <Frame38 />
        <Frame39 />
        <Frame40 />
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[406px]">
      <Container166 />
      <Container176 />
      <Frame32 />
      <Frame33 />
      <Frame36 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute content-stretch flex gap-[32px] items-center left-[280px] top-[232px] w-[1727px]">
      <Frame9 />
      <Frame10 />
      <Frame21 />
      <Frame31 />
    </div>
  );
}

export default function HrTalentCommitteeApp() {
  return (
    <div className="bg-white relative size-full" data-name="HR Talent Committee App">
      <Body />
      <Nav />
      <Button3 />
      <Button4 />
      <Div2 />
      <Frame11 />
    </div>
  );
}