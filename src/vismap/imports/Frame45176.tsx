import svgPaths from "./svg-gf0oxykc11";

function Check() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="check">
          <path clipRule="evenodd" d={svgPaths.p3b440680} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Box() {
  return (
    <div className="bg-[#016699] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <Check />
    </div>
  );
}

function Checkbox() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
      <Box />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Critical Thinking</p>
      </div>
    </div>
  );
}

function InfoCircle() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="info-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_4004_1012)" id="info-circle">
          <path d={svgPaths.p18fd5980} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_4004_1012">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <Checkbox />
      <Frame3 />
      <InfoCircle />
    </div>
  );
}

function Box1() {
  return (
    <div className="basis-0 bg-white grow h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-bl-[4px] rounded-tl-[4px] shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-bl-[4px] rounded-tl-[4px]" />
    </div>
  );
}

function Check1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="check">
          <path d="M3.75 9L7.5 12.75L15 5.25" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Box2() {
  return (
    <div className="basis-0 bg-white box-border content-stretch flex grow h-[24px] items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none" />
      <Check1 />
    </div>
  );
}

function Box3() {
  return (
    <div className="basis-0 bg-white grow h-[24px] min-h-px min-w-px mr-[-1px] relative shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Box4() {
  return (
    <div className="basis-0 bg-[#d6e6ff] grow h-[24px] min-h-px min-w-px mr-[-1px] relative shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Box5() {
  return (
    <div className="basis-0 bg-white grow h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-br-[4px] rounded-tr-[4px] shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-br-[4px] rounded-tr-[4px]" />
    </div>
  );
}

function Score() {
  return (
    <div className="box-border content-stretch flex items-start pl-0 pr-px py-0 relative shrink-0 w-full" data-name="Score">
      <Box1 />
      <Box2 />
      <Box3 />
      <Box4 />
      <Box5 />
    </div>
  );
}

function InputField() {
  return (
    <div className="bg-white h-[52px] relative rounded-[8px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[52px] items-start px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#adb5bd] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">Development Goals</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextArea() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="TextArea">
      <InputField />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame4 />
      <Score />
      <TextArea />
    </div>
  );
}

function CardData() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
          <Frame />
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

function Checkbox1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
      <Box6 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Strategic Thinking</p>
      </div>
    </div>
  );
}

function InfoCircle1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="info-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_4004_1012)" id="info-circle">
          <path d={svgPaths.p18fd5980} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_4004_1012">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <Checkbox1 />
      <Frame6 />
      <InfoCircle1 />
    </div>
  );
}

function Check2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="check">
          <path d="M3.75 9L7.5 12.75L15 5.25" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Box7() {
  return (
    <div className="basis-0 bg-white box-border content-stretch flex grow h-[24px] items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none" />
      <Check2 />
    </div>
  );
}

function Box8() {
  return (
    <div className="basis-0 bg-white grow h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-bl-[4px] rounded-tl-[4px] shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-bl-[4px] rounded-tl-[4px]" />
    </div>
  );
}

function Box9() {
  return (
    <div className="basis-0 bg-[#d6e6ff] grow h-[24px] min-h-px min-w-px mr-[-1px] relative shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Box10() {
  return (
    <div className="basis-0 bg-white grow h-[24px] min-h-px min-w-px mr-[-1px] relative shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Box11() {
  return (
    <div className="basis-0 bg-white grow h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-br-[4px] rounded-tr-[4px] shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-br-[4px] rounded-tr-[4px]" />
    </div>
  );
}

function Score1() {
  return (
    <div className="box-border content-stretch flex items-start pl-0 pr-px py-0 relative shrink-0 w-full" data-name="Score">
      <Box7 />
      <Box8 />
      <Box9 />
      <Box10 />
      <Box11 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame5 />
      <Score1 />
    </div>
  );
}

function CardData1() {
  return (
    <div className="bg-white h-[58px] relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col h-[58px] items-start justify-center p-[8px] relative w-full">
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Box12() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Checkbox2() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Checkbox">
      <Box12 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">Communication</p>
      </div>
    </div>
  );
}

function InfoCircle2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="info-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_4004_1012)" id="info-circle">
          <path d={svgPaths.p18fd5980} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_4004_1012">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <Checkbox2 />
      <Frame7 />
      <InfoCircle2 />
    </div>
  );
}

function Box13() {
  return (
    <div className="basis-0 bg-white grow h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-bl-[4px] rounded-tl-[4px] shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-bl-[4px] rounded-tl-[4px]" />
    </div>
  );
}

function Check3() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="check">
          <path d="M3.75 9L7.5 12.75L15 5.25" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Box14() {
  return (
    <div className="basis-0 bg-white box-border content-stretch flex grow h-[24px] items-center justify-center min-h-px min-w-px mr-[-1px] relative shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none" />
      <Check3 />
    </div>
  );
}

function Box15() {
  return (
    <div className="basis-0 bg-[#d6e6ff] grow h-[24px] min-h-px min-w-px mr-[-1px] relative shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Box16() {
  return (
    <div className="basis-0 bg-white grow h-[24px] min-h-px min-w-px mr-[-1px] relative shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Box17() {
  return (
    <div className="basis-0 bg-white grow h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-br-[4px] rounded-tr-[4px] shrink-0" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-br-[4px] rounded-tr-[4px]" />
    </div>
  );
}

function Score2() {
  return (
    <div className="box-border content-stretch flex items-start pl-0 pr-px py-0 relative shrink-0 w-full" data-name="Score">
      <Box13 />
      <Box14 />
      <Box15 />
      <Box16 />
      <Box17 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame8 />
      <Score2 />
    </div>
  );
}

function CardData2() {
  return (
    <div className="bg-white h-[58px] relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col h-[58px] items-start justify-center p-[8px] relative w-full">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <CardData />
      <CardData1 />
      <CardData2 />
    </div>
  );
}

function Radio() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Radio">
      <div className="absolute inset-0" style={{ "--fill-0": "rgba(1, 102, 153, 1)" } as React.CSSProperties}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <g id="Radio">
            <path d={svgPaths.p180dff00} fill="var(--fill-0, #016699)" />
            <circle cx="8" cy="8" fill="var(--fill-0, white)" id="Circle" r="4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0" data-name="Text">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Job Assignment</p>
      </div>
    </div>
  );
}

function Radio1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Radio">
      <Radio />
      <Text />
    </div>
  );
}

function Radio2() {
  return (
    <div className="bg-white relative rounded-[800px] shrink-0 size-[16px]" data-name="Radio">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[800px]" />
    </div>
  );
}

function Text1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0" data-name="Text">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Training</p>
      </div>
    </div>
  );
}

function Radio3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Radio">
      <Radio2 />
      <Text1 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Radio1 />
      <Radio3 />
    </div>
  );
}

function InputField1() {
  return (
    <div className="bg-white h-[52px] relative rounded-[8px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[52px] items-start px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#adb5bd] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">Tugas apa yang sedang atau akan dikerjakan employee?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextArea1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="TextArea">
      <InputField1 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] w-full">Development Program</p>
      <Frame10 />
      <TextArea1 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#016699] relative rounded-[28px] shrink-0 w-full" data-name="button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative w-full">
          <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Generate IDP Recommendation</p>
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame11 />
      <Button />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute box-border content-stretch flex gap-[8px] items-center justify-center left-[12px] px-[12px] py-[8px] rounded-[28px] top-[777px] w-[294px]" data-name="button">
      <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
      <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-nowrap whitespace-pre">Quick IDP Recommendation</p>
    </div>
  );
}

export default function Frame9() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] size-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[12px] items-start p-[12px] relative size-full">
          <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[#495057] text-[14px] w-[min-content]">
            <p className="leading-[normal]">Aspect Need Develop</p>
          </div>
          <Frame12 />
          <Frame13 />
          <Button1 />
        </div>
      </div>
    </div>
  );
}
