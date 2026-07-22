"use client";
import { useRouter, useSearchParams } from "next/navigation";
import svgPaths from "./svg-djevy8uiqd";
const imgImage96 = "/iprofile-assets/388adc9209c1e548d705450bad480024dd98f3b9.png";
const imgPortraitSuccessfulBusinessWomanUsingDigitalTabletFrontModernOffice2 = "/iprofile-assets/7d155afcea4f2b1e6b32eb88a344313d97b8f6a2.png";
const imgFreepikTheStyleIsCandidImagePhotographyWithNatural52479 = "/iprofile-assets/6f02d082c705f4920de8542ceb25e13d8dac0d49.png";
import { ScoreAspectWithTabs } from "../components/ScoreAspectWithTabs";
import { ProfileMoreMenu } from "../components/ProfileMoreMenu";
import { SuccessorsAccordion } from "../components/SuccessorsAccordion";
import { CareerPlanAccordion } from "../components/CareerPlanAccordion";
import { AddCareerPlanModal } from "../components/AddCareerPlanModal";
import { AddSuccessorsModal } from "../components/AddSuccessorsModal";
import { useState, createContext, useContext, useRef, useEffect } from "react";
import { candidates } from "@/data/dummyData";

const ProfileContext = createContext({ name: "Julian Alvarez", position: "Direktur Pengembangan Bisnis" });

function Frame151() {
  const { name, position } = useContext(ProfileContext);
  const [photoSrc, setPhotoSrc] = useState<string>(
    () => (typeof window !== 'undefined' && localStorage.getItem('iprofile-photo')) || '/iprofile-assets/profile-photo.png'
  );

  useEffect(() => {
    const handler = (e: Event) => {
      setPhotoSrc((e as CustomEvent).detail);
    };
    window.addEventListener('profile-photo-changed', handler);
    return () => window.removeEventListener('profile-photo-changed', handler);
  }, []);

  return (
    <div className="absolute left-[18px] top-[44px] w-[269px] h-[269px] overflow-hidden"
      style={{ borderRadius: "8px 8px 164.89px 8px" }}>

      {/* Layer 1 — background biru, 3/4 tinggi dari bawah */}
      <div className="absolute bottom-0 left-0 right-0 rounded-[8px]" style={{ height: "75%", background: "#197fc9" }} />

      {/* Layer 2 — foto PNG tanpa background */}
      <img alt="" className="absolute inset-0 w-full h-full object-cover object-top" src={photoSrc} />

      {/* Layer 3 — gradient hitam, 1/2 tinggi dari bawah */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "50%", background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.82))" }} />

      {/* Layer 4 — nama & posisi */}
      <div className="absolute bottom-0 left-0 right-0 px-[14px] pb-[14px]">
        <div style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", lineHeight: 1.2, marginBottom: 2 }}>
          {name}
        </div>
        <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.8)", lineHeight: 1.3 }}>
          {position}
        </div>
      </div>

    </div>
  );
}

function Frame81() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">Profile</p>
      </div>
    </div>
  );
}

function Frame82() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-end relative shrink-0 w-[70.083px]">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrows-diagonal">
        <div className="absolute inset-[16.67%]" data-name="Vector">
          <div className="absolute inset-[-7.03%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.1667 12.1667">
              <path d={svgPaths.p10ddf7c0} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      <ProfileMoreMenu />
    </div>
  );
}

function Frame78() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex items-center justify-between left-[calc(50%+0.17px)] top-[16px] w-[336.333px]">
      <Frame81 />
      <Frame82 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-[#f8f9fa] h-[50px] leading-[0] overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-full whitespace-nowrap">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center left-[13px] text-[#495057] text-[10px] top-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Personality</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Avenir:Heavy',sans-serif] justify-center left-[13px] not-italic text-[#016699] text-[14px] top-[34.5px]">
        <p className="leading-[normal]">SC</p>
      </div>
    </div>
  );
}

function Frame102() {
  return (
    <div className="bg-[#f8f9fa] h-[50px] leading-[0] overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[135px] whitespace-nowrap">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center left-[13px] text-[#495057] text-[10px] top-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Intelligence</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Avenir:Heavy',sans-serif] justify-center left-[13px] not-italic text-[#016699] text-[0px] top-[34.5px]">
        <p>
          <span className="leading-[normal] text-[8px]">IQ:</span>
          <span className="leading-[normal] text-[14px]">{`120 , `}</span>
          <span className="leading-[normal] text-[8px]">GTQ:</span>
          <span className="leading-[normal] text-[14px]">115</span>
        </p>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-[#f8f9fa] h-[50px] overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-full">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] left-[13px] text-[#495057] text-[10px] top-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Competency match</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] left-[15px] not-italic text-[#016699] text-[14px] top-[34.5px] whitespace-nowrap">
        <p className="leading-[normal]">4.5</p>
      </div>
      <div className="absolute left-[36px] overflow-clip size-[10px] top-[21px]" data-name="arrow-up">
        <div className="absolute bottom-[20.83%] left-1/4 right-1/4 top-[20.83%]" data-name="Vector">
          <div className="absolute inset-[-8.04%_-9.38%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.9375 6.77083">
              <path d={svgPaths.pe7b5200} id="Vector" stroke="var(--stroke-0, #00875A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9375" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame88() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-end left-[217px] top-[147.83px] w-[135px]">
      <Frame26 />
      <Frame102 />
      <Frame25 />
    </div>
  );
}

function Frame74() {
  const { position } = useContext(ProfileContext);
  return (
    <div className="content-stretch flex gap-[4px] h-[18px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">{position}</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-18.75%_-9.38%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5 5.5">
              <path d={svgPaths.p14416700} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame144() {
  const { name } = useContext(ProfileContext);
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-start left-[calc(50%-0.17px)] top-[50.5px] w-[340px]">
      <div className="flex flex-col font-['Open_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#016699] text-[20px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[99.58000183105469%] whitespace-pre-wrap">{name}</p>
      </div>
      <Frame74 />
    </div>
  );
}

function Frame83() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">Score Aspect</p>
      </div>
    </div>
  );
}

function Frame76() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-end relative shrink-0 w-[70.083px]">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="dots-vertical">
        <div className="absolute inset-[16.67%_45.83%]" data-name="Vector">
          <div className="absolute inset-[-7.03%_-56.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.83333 12.1667">
              <g id="Vector">
                <path d={svgPaths.pccbae00} stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p363ea80} stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame79() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[336.333px]">
      <Frame83 />
      <Frame76 />
    </div>
  );
}

function Frame75() {
  return (
    <div className="content-stretch flex gap-[2px] items-center relative shrink-0 w-full">
      <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px]" data-name="Tab button">
        <div aria-hidden="true" className="absolute border-[#016699] border-b-2 border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px]" />
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[2px] items-center justify-center px-[16px] py-[8px] relative w-full">
            <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#016699] text-[14px] text-center whitespace-nowrap">
              <p className="leading-[normal]">Competency</p>
            </div>
          </div>
        </div>
      </div>
      <button className="cursor-pointer flex-[1_0_0] min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px]" data-name="Tab button">
        <div aria-hidden="true" className="absolute border-[#dee2e6] border-b-2 border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px]" />
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[2px] items-center justify-center px-[16px] py-[8px] relative w-full">
            <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] text-center whitespace-nowrap">
              <p className="leading-[normal]">Potency</p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <button className="bg-[#f8f9fa] block cursor-pointer overflow-clip relative rounded-[4px] shrink-0 size-[20px]" data-name="chart-radar">
        <div className="absolute inset-[12.5%_10.42%]" data-name="Vector">
          <div className="absolute inset-[-5%_-4.74%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3334 16.5">
              <path d={svgPaths.p4355100} id="Vector" stroke="var(--stroke-0, #CED4DA)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.854902" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </button>
      <div className="bg-[#e7f5ff] overflow-clip relative rounded-[4px] shrink-0 size-[20px]" data-name="list">
        <div className="absolute bottom-[24.96%] left-[20.83%] right-[16.67%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-7.49%_-6%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 11.5083">
              <path d={svgPaths.p24455faf} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame153() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame27 />
      <div className="content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[28px] shrink-0 w-[135px]" data-name="button">
        <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
        <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px]">Score Records</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="check">
        <div className="absolute inset-[29.17%_16.67%_29.17%_20.83%]" data-name="Vector">
          <div className="absolute inset-[-11.25%_-7.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 8.16667">
              <path d={svgPaths.p372d5680} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Score
      </p>
    </div>
  );
}

function Box() {
  return (
    <div className="bg-[#d6e6ff] relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function InputField() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[16px] shrink-0 w-full" data-name="Input field">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[4px] relative w-full">
          <Box />
          <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px overflow-hidden relative text-[#495057] text-[10px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal] overflow-hidden">Stnd. [Marketing]</p>
          </div>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="chevron-down">
            <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
              <div className="absolute inset-[-18.75%_-9.38%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5 5.5">
                  <path d={svgPaths.p14416700} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative" data-name="TextInput">
      <InputField />
    </div>
  );
}

function Frame116() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
      <Frame9 />
      <TextInput />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Logika Berpikir</p>
      </div>
    </div>
  );
}

function Frame125() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[231px]">
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#fff2e4] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#ca6f00] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            DEV.
          </p>
        </div>
      </div>
      <Frame10 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame125 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info-circle">
        <div className="absolute inset-[12.5%]" data-name="Vector">
          <div className="absolute inset-[-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
              <path d={svgPaths.p11080840} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box1() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box2() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box3() {
  return (
    <div className="bg-[#d6e6ff] content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="check">
        <div className="absolute inset-[29.17%_16.67%_29.17%_20.83%]" data-name="Vector">
          <div className="absolute inset-[-10%_-6.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.75 9">
              <path d="M0.75 4.5L4.5 8.25L12 0.75" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box4() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box5() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Score() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-start min-h-px min-w-px relative" data-name="Score">
      <Box1 />
      <Box2 />
      <Box3 />
      <Box4 />
      <Box5 />
    </div>
  );
}

function Points() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
      <Score />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
      <Frame12 />
      <Points />
    </div>
  );
}

function CardData() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Kemampuan verbal</p>
      </div>
    </div>
  );
}

function Frame126() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-[231px]">
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#fff2e4] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#ca6f00] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            DEV.
          </p>
        </div>
      </div>
      <Frame11 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame126 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info-circle">
        <div className="absolute inset-[12.5%]" data-name="Vector">
          <div className="absolute inset-[-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
              <path d={svgPaths.p11080840} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box6() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box7() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box8() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box9() {
  return (
    <div className="bg-[#d6e6ff] content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="check">
        <div className="absolute inset-[29.17%_16.67%_29.17%_20.83%]" data-name="Vector">
          <div className="absolute inset-[-10%_-6.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.75 9">
              <path d="M0.75 4.5L4.5 8.25L12 0.75" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box10() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Score1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-start min-h-px min-w-px relative" data-name="Score">
      <Box6 />
      <Box7 />
      <Box8 />
      <Box9 />
      <Box10 />
    </div>
  );
}

function Points1() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
      <Score1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
      <Frame13 />
      <Points1 />
    </div>
  );
}

function CardData1() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Daya Analisa</p>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame15 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info-circle">
        <div className="absolute inset-[12.5%]" data-name="Vector">
          <div className="absolute inset-[-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
              <path d={svgPaths.p11080840} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box11() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box12() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="check">
        <div className="absolute inset-[29.17%_16.67%_29.17%_20.83%]" data-name="Vector">
          <div className="absolute inset-[-10%_-6.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.75 9">
              <path d="M0.75 4.5L4.5 8.25L12 0.75" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box13() {
  return (
    <div className="bg-[#d6e6ff] flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box14() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box15() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Score2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-start min-h-px min-w-px relative" data-name="Score">
      <Box11 />
      <Box12 />
      <Box13 />
      <Box14 />
      <Box15 />
    </div>
  );
}

function Points2() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
      <Score2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
      <Frame14 />
      <Points2 />
    </div>
  );
}

function CardData2() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame142() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <CardData />
      <CardData1 />
      <CardData2 />
    </div>
  );
}

function Frame140() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-ellipsis w-full whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">Category A</p>
      </div>
      <Frame142 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Fleksibilitas</p>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame17 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info-circle">
        <div className="absolute inset-[12.5%]" data-name="Vector">
          <div className="absolute inset-[-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
              <path d={svgPaths.p11080840} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box16() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box17() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box18() {
  return (
    <div className="bg-[#d6e6ff] flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box19() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="check">
        <div className="absolute inset-[29.17%_16.67%_29.17%_20.83%]" data-name="Vector">
          <div className="absolute inset-[-10%_-6.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.75 9">
              <path d="M0.75 4.5L4.5 8.25L12 0.75" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box20() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Score3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-start min-h-px min-w-px relative" data-name="Score">
      <Box16 />
      <Box17 />
      <Box18 />
      <Box19 />
      <Box20 />
    </div>
  );
}

function Points3() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
      <Score3 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
      <Frame16 />
      <Points3 />
    </div>
  );
}

function CardData3() {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Leadership</p>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame19 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info-circle">
        <div className="absolute inset-[12.5%]" data-name="Vector">
          <div className="absolute inset-[-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
              <path d={svgPaths.p11080840} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box21() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box22() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box23() {
  return (
    <div className="bg-[#d6e6ff] content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="check">
        <div className="absolute inset-[29.17%_16.67%_29.17%_20.83%]" data-name="Vector">
          <div className="absolute inset-[-10%_-6.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.75 9">
              <path d="M0.75 4.5L4.5 8.25L12 0.75" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box24() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box25() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Score4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-start min-h-px min-w-px relative" data-name="Score">
      <Box21 />
      <Box22 />
      <Box23 />
      <Box24 />
      <Box25 />
    </div>
  );
}

function Points4() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
      <Score4 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
      <Frame18 />
      <Points4 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Kerjasama</p>
      </div>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame21 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info-circle">
        <div className="absolute inset-[12.5%]" data-name="Vector">
          <div className="absolute inset-[-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
              <path d={svgPaths.p11080840} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box26() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box27() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box28() {
  return (
    <div className="bg-[#d6e6ff] content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="check">
        <div className="absolute inset-[29.17%_16.67%_29.17%_20.83%]" data-name="Vector">
          <div className="absolute inset-[-10%_-6.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.75 9">
              <path d="M0.75 4.5L4.5 8.25L12 0.75" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box29() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box30() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Score5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-start min-h-px min-w-px relative" data-name="Score">
      <Box26 />
      <Box27 />
      <Box28 />
      <Box29 />
      <Box30 />
    </div>
  );
}

function Points5() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
      <Score5 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
      <Frame20 />
      <Points5 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Kemampuan Perencanaan</p>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame23 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info-circle">
        <div className="absolute inset-[12.5%]" data-name="Vector">
          <div className="absolute inset-[-6.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
              <path d={svgPaths.p11080840} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box31() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box32() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box33() {
  return (
    <div className="bg-[#d6e6ff] content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="check">
        <div className="absolute inset-[29.17%_16.67%_29.17%_20.83%]" data-name="Vector">
          <div className="absolute inset-[-10%_-6.67%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.75 9">
              <path d="M0.75 4.5L4.5 8.25L12 0.75" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box34() {
  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Box35() {
  return (
    <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Score6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-start min-h-px min-w-px relative" data-name="Score">
      <Box31 />
      <Box32 />
      <Box33 />
      <Box34 />
      <Box35 />
    </div>
  );
}

function Points6() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
      <Score6 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
      <Frame22 />
      <Points6 />
    </div>
  );
}

function Frame143() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <CardData3 />
      <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
        <div className="flex flex-col justify-center size-full">
          <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
            <Frame4 />
          </div>
        </div>
      </div>
      <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
        <div className="flex flex-col justify-center size-full">
          <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
            <Frame5 />
          </div>
        </div>
      </div>
      <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
        <div className="flex flex-col justify-center size-full">
          <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
            <Frame6 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame141() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-ellipsis w-full whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">Uncategorized</p>
      </div>
      <Frame143 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full">
      <Frame140 />
      <Frame141 />
    </div>
  );
}

function Frame118() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[368.333px]">
      <div className="bg-white overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368px]" data-name="Profile">
        <div style={{ height: 346 }} />
        <Frame151 />
        <Frame78 />
        <div className="absolute left-0 overflow-clip size-[16px] top-[16px]" data-name="grip-vertical">
          <div className="absolute inset-[16.67%_33.33%]" data-name="Vector">
            <div className="absolute inset-[-7.03%_-14.06%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.83333 12.1667">
                <g id="Vector">
                  <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.pccbae00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p363ea80} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p374adb00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p29561a80} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p21375e00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <Frame88 />
      </div>
      <ScoreAspectWithTabs 
        Frame79={Frame79}
        Frame153={Frame153}
        Frame116={Frame116}
        Frame24={Frame24}
      />
    </div>
  );
}

function Frame84() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">{`Career & Succession Plan`}</p>
      </div>
    </div>
  );
}

function Frame77() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-[70.083px]">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="arrows-diagonal">
        <div className="absolute inset-[16.67%]" data-name="Vector">
          <div className="absolute inset-[-7.03%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.1667 12.1667">
              <path d={svgPaths.p10ddf7c0} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame80() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[336.333px]">
      <Frame84 />
      <Frame77 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[0] min-h-px min-w-px relative">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#495057] text-[12px] w-full">
        <p className="leading-[normal] whitespace-pre-wrap">Deleivery Manager</p>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#016699] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Valverde</p>
      </div>
    </div>
  );
}

function Frame122() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
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
  );
}

function Frame42() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Frame41 />
          <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Chip - DISC">
            <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                94%
              </p>
            </div>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-[68px]" data-name="Chip - DISC">
            <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                Ready
              </p>
            </div>
          </div>
          <Frame122 />
        </div>
      </div>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <Frame42 />
    </div>
  );
}

function ComponentCareerPlan() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Component Career plan">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Career Plan 1</p>
      </div>
      <Frame57 />
    </div>
  );
}

function Frame148() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Career Plan 2</p>
      </div>
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#e7f5ff] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <div className="overflow-clip relative shrink-0 size-[14px]" data-name="arrow-up-right">
            <div className="absolute inset-[29.17%]" data-name="Vector">
              <div className="absolute inset-[-12.86%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.33333 7.33333">
                  <path d={svgPaths.p52d7500} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#016699] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            Added
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame136() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame148 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="trash">
        <div className="absolute inset-[12.5%_16.67%]" data-name="Vector">
          <div className="absolute inset-[-6.25%_-7.03%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.1667 13.5">
              <path d={svgPaths.p49e8c00} id="Vector" stroke="var(--stroke-0, #DE350B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[0] min-h-px min-w-px relative">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#495057] text-[12px] w-full">
        <p className="leading-[normal] whitespace-pre-wrap">Product Manager</p>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#016699] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Griezmann</p>
      </div>
    </div>
  );
}

function Frame123() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <button className="block cursor-pointer overflow-clip relative shrink-0 size-[20px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-15%_-7.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 6.5">
              <path d={svgPaths.p3d2c9380} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

function Frame43() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Frame44 />
          <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Chip - DISC">
            <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                70%
              </p>
            </div>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-[68px]" data-name="Chip - DISC">
            <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                need dev.
              </p>
            </div>
          </div>
          <Frame123 />
        </div>
      </div>
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <Frame43 />
    </div>
  );
}

function Frame149() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Career Plan 2</p>
      </div>
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#e7f5ff] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <div className="overflow-clip relative shrink-0 size-[14px]" data-name="arrows-horizontal">
            <div className="absolute inset-[33.33%_12.5%]" data-name="Vector">
              <div className="absolute inset-[-16.07%_-7.14%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 6.16667">
                  <path d={svgPaths.p53b7280} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#016699] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            Added
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame137() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame149 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="trash">
        <div className="absolute inset-[12.5%_16.67%]" data-name="Vector">
          <div className="absolute inset-[-6.25%_-7.03%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.1667 13.5">
              <path d={svgPaths.p49e8c00} id="Vector" stroke="var(--stroke-0, #DE350B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[0] min-h-px min-w-px relative">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#495057] text-[12px] w-full">
        <p className="leading-[normal] whitespace-pre-wrap">Product Designer</p>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#016699] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Fernandez</p>
      </div>
    </div>
  );
}

function Frame124() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <button className="block cursor-pointer overflow-clip relative shrink-0 size-[20px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-15%_-7.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 6.5">
              <path d={svgPaths.p3d2c9380} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

function Frame45() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Frame48 />
          <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Chip - DISC">
            <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                70%
              </p>
            </div>
          </div>
          <div className="content-stretch flex items-center relative shrink-0 w-[68px]" data-name="Chip - DISC">
            <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                need dev.
              </p>
            </div>
          </div>
          <Frame124 />
        </div>
      </div>
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <Frame45 />
    </div>
  );
}

function Frame46() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
        <div data-conn="career-structural" className="w-full"><CareerPlanAccordion label="Career Plan 1" position="Deleivery Manager" name="Valverde" percentage="94%" status="Ready" /></div>
        <div data-conn="career-additional" className="w-full"><CareerPlanAccordion label="Career Plan 2" position="Product Manager" name="Griezmann" percentage="70%" status="need dev." showAddedTag={true} addedTagIcon="arrow-up-right" showDeleteIcon={true} /></div>
        <div data-conn="career-additional" className="w-full"><CareerPlanAccordion label="Career Plan 3" position="Product Designer" name="Fernandez" percentage="70%" status="need dev." showAddedTag={true} addedTagIcon="arrows-horizontal" showDeleteIcon={true} /></div>
        <button 
          className="block cursor-pointer overflow-clip relative shrink-0 size-[20px]" 
          data-name="plus"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="absolute inset-[20.83%]" data-name="Vector">
            <div className="absolute inset-[-6.43%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.1667 13.1667">
                <path d={svgPaths.p2593f8c0} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </button>
      </div>
      <AddCareerPlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

function Frame145() {
  const { name } = useContext(ProfileContext);
  return (
    <div data-conn="current" className="bg-[#e7f5ff] h-[24px] relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start px-[8px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[12px] text-center whitespace-nowrap">
          <p className="leading-[normal]">{name}</p>
        </div>
      </div>
    </div>
  );
}

function Frame99() {
  return (
    <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[30px]">
      <div className="absolute left-px size-[31px] top-0" data-name="portrait-successful-business-woman-using-digital-tablet-front-modern-office 2">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[239.1%] left-[-51.94%] max-w-none top-[-24.12%] w-[159.36%]" src={imgPortraitSuccessfulBusinessWomanUsingDigitalTabletFrontModernOffice2} />
        </div>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[0] min-h-px min-w-px relative">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[12px] w-full">
        <p className="leading-[normal] whitespace-pre-wrap">Vinicius Junior</p>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Product Designer</p>
      </div>
    </div>
  );
}

function Frame127() {
  return (
    <button className="content-stretch cursor-pointer flex items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-15%_-7.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 6.5">
              <path d={svgPaths.p3d2c9380} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

function Frame50() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Frame99 />
          <Frame51 />
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            92%
          </p>
          <div className="content-stretch flex items-center relative shrink-0 w-[68px]" data-name="Chip - DISC">
            <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                Ready
              </p>
            </div>
          </div>
          <Frame127 />
        </div>
      </div>
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <SuccessorsAccordion />
    </div>
  );
}

function Frame100() {
  return (
    <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[30px]">
      <div className="absolute left-px size-[31px] top-0" data-name="portrait-successful-business-woman-using-digital-tablet-front-modern-office 2">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[239.1%] left-[-51.94%] max-w-none top-[-24.12%] w-[159.36%]" src={imgPortraitSuccessfulBusinessWomanUsingDigitalTabletFrontModernOffice2} />
        </div>
      </div>
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[0] min-h-px min-w-px relative">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[12px] w-full">
        <p className="leading-[normal] whitespace-pre-wrap">Nico Williams</p>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Product Designer</p>
      </div>
    </div>
  );
}

function Frame128() {
  return (
    <button className="content-stretch cursor-pointer flex items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-15%_-7.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 6.5">
              <path d={svgPaths.p3d2c9380} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

function Frame52() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Frame100 />
          <Frame53 />
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            84%
          </p>
          <div className="content-stretch flex items-center relative shrink-0 w-[68px]" data-name="Chip - DISC">
            <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                Ready
              </p>
            </div>
          </div>
          <Frame128 />
        </div>
      </div>
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <SuccessorsAccordion name="Nico Williams" position="Product Designer" percentage="84%" status="Ready" />
    </div>
  );
}

function Frame101() {
  return (
    <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[30px]">
      <div className="absolute left-px size-[31px] top-0" data-name="portrait-successful-business-woman-using-digital-tablet-front-modern-office 2">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[239.1%] left-[-51.94%] max-w-none top-[-24.12%] w-[159.36%]" src={imgPortraitSuccessfulBusinessWomanUsingDigitalTabletFrontModernOffice2} />
        </div>
      </div>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[0] min-h-px min-w-px relative">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[12px] w-full">
        <p className="leading-[normal] whitespace-pre-wrap">Hakimi</p>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Product Designer</p>
      </div>
    </div>
  );
}

function Frame129() {
  return (
    <button className="content-stretch cursor-pointer flex items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-15%_-7.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 6.5">
              <path d={svgPaths.p3d2c9380} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

function Frame54() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Frame101 />
          <Frame55 />
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            84%
          </p>
          <div className="content-stretch flex items-center relative shrink-0 w-[68px]" data-name="Chip - DISC">
            <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                Ready
              </p>
            </div>
          </div>
          <Frame129 />
        </div>
      </div>
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <SuccessorsAccordion name="Hakimi" position="Product Designer" percentage="84%" status="Ready" />
    </div>
  );
}

function Frame150() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Successor 2</p>
      </div>
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#e7f5ff] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <div className="overflow-clip relative shrink-0 size-[14px]" data-name="arrows-horizontal">
            <div className="absolute inset-[33.33%_12.5%]" data-name="Vector">
              <div className="absolute inset-[-16.07%_-7.14%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 6.16667">
                  <path d={svgPaths.p53b7280} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#016699] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            Added
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame138() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame150 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="trash">
        <div className="absolute inset-[12.5%_16.67%]" data-name="Vector">
          <div className="absolute inset-[-6.25%_-7.03%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.1667 13.5">
              <path d={svgPaths.p49e8c00} id="Vector" stroke="var(--stroke-0, #DE350B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame130() {
  return (
    <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[30px]">
      <div className="absolute h-[42px] left-[-3px] top-0 w-[32.667px]" data-name="freepik__the-style-is-candid-image-photography-with-natural__52479">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-[113.05%] top-0" src={imgFreepikTheStyleIsCandidImagePhotographyWithNatural52479} />
        </div>
      </div>
    </div>
  );
}

function Frame131() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[0] min-h-px min-w-px relative">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[12px] w-full">
        <p className="leading-[normal] whitespace-pre-wrap">Son Heung-min</p>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Digital Marketing</p>
      </div>
    </div>
  );
}

function Frame132() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-15%_-7.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 6.5">
              <path d={svgPaths.p3d2c9380} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame56() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Frame130 />
          <Frame131 />
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            72%
          </p>
          <div className="content-stretch flex items-center relative shrink-0 w-[68px]" data-name="Chip - DISC">
            <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                Ready
              </p>
            </div>
          </div>
          <Frame132 />
        </div>
      </div>
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <SuccessorsAccordion name="Son Heung-min" position="Digital Marketing" percentage="72%" status="Ready" photoType="man" />
    </div>
  );
}

function ComponentSuccessors() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Component successors">
      <Frame138 />
      <Frame63 />
    </div>
  );
}

function Frame152() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Successor 2</p>
      </div>
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#e7f5ff] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <div className="overflow-clip relative shrink-0 size-[14px]" data-name="arrow-up-left">
            <div className="absolute inset-[29.17%]" data-name="Vector">
              <div className="absolute inset-[-12.86%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.33333 7.33333">
                  <path d={svgPaths.p28873c00} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#016699] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            Added
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame139() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame152 />
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="trash">
        <div className="absolute inset-[12.5%_16.67%]" data-name="Vector">
          <div className="absolute inset-[-6.25%_-7.03%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.1667 13.5">
              <path d={svgPaths.p49e8c00} id="Vector" stroke="var(--stroke-0, #DE350B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame133() {
  return (
    <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[30px]">
      <div className="absolute h-[42px] left-[-3px] top-0 w-[32.667px]" data-name="freepik__the-style-is-candid-image-photography-with-natural__52479">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-[113.05%] top-0" src={imgFreepikTheStyleIsCandidImagePhotographyWithNatural52479} />
        </div>
      </div>
    </div>
  );
}

function Frame134() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[0] min-h-px min-w-px relative">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[12px] w-full">
        <p className="leading-[normal] whitespace-pre-wrap">Pulisic</p>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Digital Marketing</p>
      </div>
    </div>
  );
}

function Frame135() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="chevron-down">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
          <div className="absolute inset-[-15%_-7.5%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 6.5">
              <path d={svgPaths.p3d2c9380} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame65() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <Frame133 />
          <Frame134 />
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            72%
          </p>
          <div className="content-stretch flex items-center relative shrink-0 w-[68px]" data-name="Chip - DISC">
            <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                Ready
              </p>
            </div>
          </div>
          <Frame135 />
        </div>
      </div>
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <SuccessorsAccordion name="Pulisic" position="Digital Marketing" percentage="72%" status="Ready" photoType="man" />
    </div>
  );
}

function ComponentSuccessors1() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Component successors">
      <Frame139 />
      <Frame64 />
    </div>
  );
}

function Frame49() {
  const [isAddSuccessorsModalOpen, setIsAddSuccessorsModalOpen] = useState(false);

  return (
    <>
      <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
        <div data-conn="succ-structural" className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Component successors">
          <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal] whitespace-pre-wrap">Successors 1</p>
          </div>
          <Frame60 />
        </div>
        <div data-conn="succ-structural" className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Component successors">
          <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal] whitespace-pre-wrap">Successors 2</p>
          </div>
          <Frame61 />
        </div>
        <div data-conn="succ-structural" className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Component successors">
          <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal] whitespace-pre-wrap">Successors 3</p>
          </div>
          <Frame62 />
        </div>
        <div data-conn="succ-additional" className="w-full"><ComponentSuccessors /></div>
        <div data-conn="succ-additional" className="w-full"><ComponentSuccessors1 /></div>
        <button 
          onClick={() => setIsAddSuccessorsModalOpen(true)}
          className="overflow-clip relative shrink-0 size-[20px] cursor-pointer hover:opacity-70 transition-opacity" 
          data-name="plus"
        >
          <div className="absolute inset-[20.83%]" data-name="Vector">
            <div className="absolute inset-[-6.43%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.1667 13.1667">
                <path d={svgPaths.p2593f8c0} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </button>
      </div>
      
      <AddSuccessorsModal 
        isOpen={isAddSuccessorsModalOpen}
        onClose={() => setIsAddSuccessorsModalOpen(false)}
      />
    </>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
      <Frame46 />
      <Frame145 />
      <Frame49 />
    </div>
  );
}

function DynamicConnectors() {
  const selfRef = useRef<HTMLDivElement>(null);
  const [svgData, setSvgData] = useState<{
    h: number;
    career: { y: number; add: boolean }[];
    current: number;
    succ: { y: number; add: boolean }[];
  }>({ h: 0, career: [], current: 0, succ: [] });

  useEffect(() => {
    const card = selfRef.current?.parentElement;
    if (!card) return;

    const measure = () => {
      const cardRect = card.getBoundingClientRect();
      const getY = (el: Element) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2 - cardRect.top;
      };

      const currentEl = card.querySelector('[data-conn="current"]');
      const currentY = currentEl ? getY(currentEl) : cardRect.height / 2;

      const career = Array.from(card.querySelectorAll('[data-conn^="career-"]')).map(el => ({
        y: getY(el),
        add: el.getAttribute('data-conn') === 'career-additional',
      }));

      const succ = Array.from(card.querySelectorAll('[data-conn^="succ-"]')).map(el => ({
        y: getY(el),
        add: el.getAttribute('data-conn') === 'succ-additional',
      }));

      setSvgData({ h: cardRect.height, career, current: currentY, succ });
    };

    const ro = new ResizeObserver(measure);
    ro.observe(card);
    measure();
    return () => ro.disconnect();
  }, []);

  const { h, career, current, succ } = svgData;
  const CX = 18;
  const TICK = 17;
  const A = 5;
  const firstC = career[0]?.y;
  const lastC = career[career.length - 1]?.y;
  const firstS = succ[0]?.y;
  const lastS = succ[succ.length - 1]?.y;

  return (
    <div ref={selfRef} className="absolute inset-0 pointer-events-none">
      {h > 0 && (
        <svg width={36} height={h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {/* Career spine */}
          {firstC != null && lastC != null && (
            <line x1={CX} y1={firstC} x2={CX} y2={lastC} stroke="#495057" strokeWidth="1" />
          )}
          {/* Career upward arrow */}
          {firstC != null && (
            <path d={`M${CX - A} ${firstC + A * 2} L${CX} ${firstC} L${CX + A} ${firstC + A * 2}`} fill="#495057" />
          )}
          {/* Career ticks */}
          {career.map((c, i) => (
            <line key={i} x1={CX} y1={c.y} x2={CX + TICK} y2={c.y}
              stroke={c.add ? '#2F95DE' : '#495057'} strokeWidth="1"
              strokeDasharray={c.add ? '2 2' : undefined} />
          ))}
          {/* Spine: last career → current employee */}
          {lastC != null && (
            <line x1={CX} y1={lastC} x2={CX} y2={current} stroke="#495057" strokeWidth="1" />
          )}
          {/* Current employee node */}
          <circle cx={CX} cy={current} r={3} fill="#495057" />
          {/* Spine: current employee → first successor */}
          {firstS != null && (
            <line x1={CX} y1={current} x2={CX} y2={firstS} stroke="#495057" strokeWidth="1" />
          )}
          {/* Successor spine */}
          {firstS != null && lastS != null && (
            <line x1={CX} y1={firstS} x2={CX} y2={lastS} stroke="#495057" strokeWidth="1" />
          )}
          {/* Successor ticks */}
          {succ.map((s, i) => (
            <line key={i} x1={CX} y1={s.y} x2={CX + TICK} y2={s.y}
              stroke={s.add ? '#2F95DE' : '#495057'} strokeWidth="1"
              strokeDasharray={s.add ? '2 2' : undefined} />
          ))}
          {/* Successor downward arrow */}
          {lastS != null && (
            <path d={`M${CX - A} ${lastS - A * 2} L${CX} ${lastS} L${CX + A} ${lastS - A * 2}`} fill="#495057" />
          )}
        </svg>
      )}
    </div>
  );
}

function Frame85() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">Teams</p>
      </div>
    </div>
  );
}

function Frame86() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-end relative shrink-0 w-[70.083px]">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="dots-vertical">
        <div className="absolute inset-[16.67%_45.83%]" data-name="Vector">
          <div className="absolute inset-[-7.03%_-56.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.83333 12.1667">
              <g id="Vector">
                <path d={svgPaths.pccbae00} stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p363ea80} stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame117() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame85 />
      <Frame86 />
    </div>
  );
}

function Component6() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] h-[51.5px] min-h-px min-w-px relative rounded-[8px]" data-name="Component 132">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center leading-[0] px-[16px] py-[4px] relative size-full whitespace-nowrap">
          <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[14px]">
            <p className="leading-[normal] font-[Open_Sans] font-bold text-[12px]">Rising Project Team</p>
          </div>
          <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">as Team Leader</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component5() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] h-[51.5px] min-h-px min-w-px relative rounded-[8px]" data-name="Component 131">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center leading-[0] px-[16px] py-[4px] relative size-full whitespace-nowrap">
          <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[14px]">
            <p className="leading-[normal] font-[Open_Sans] text-[12px] font-bold">Product Team</p>
          </div>
          <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">as Team member</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame89() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Component6 />
      <Component5 />
    </div>
  );
}

function Component4() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] h-[51.5px] min-h-px min-w-px relative rounded-[8px]" data-name="Component 130">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center leading-[0] px-[16px] py-[4px] relative size-full whitespace-nowrap">
          <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[14px]">
            <p className="leading-[normal] font-bold text-[12px] font-[Open_Sans]">Pegasus Team</p>
          </div>
          <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">{`as  Team member`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start leading-[0] relative shrink-0 text-white whitespace-nowrap">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Golongan Darah</p>
      </div>
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[14px]">
        <p className="leading-[normal]">A</p>
      </div>
    </div>
  );
}

function Frame66() {
  return (
    <div className="bg-white flex-[1_0_0] h-[51.5px] min-h-px min-w-px relative rounded-[8px]">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[16px] py-[4px] relative size-full">
          <Frame33 />
        </div>
      </div>
    </div>
  );
}

function Frame90() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Component4 />
      <Frame66 />
    </div>
  );
}

function Frame87() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame89 />
      <Frame90 />
    </div>
  );
}

function Frame92() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">Extension Data</p>
      </div>
    </div>
  );
}

function Frame93() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-end relative shrink-0 w-[70.083px]">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="dots-vertical">
        <div className="absolute inset-[16.67%_45.83%]" data-name="Vector">
          <div className="absolute inset-[-7.03%_-56.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.83333 12.1667">
              <g id="Vector">
                <path d={svgPaths.pccbae00} stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p363ea80} stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame91() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame92 />
      <Frame93 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Performance</p>
      </div>
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#016699] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">4.3</p>
      </div>
      <div className="absolute flex items-center justify-center left-[21px] size-[10px] top-[20px]">
        <div className="flex-none rotate-180">
          <div className="overflow-clip relative size-[10px]" data-name="arrow-up">
            <div className="absolute bottom-[20.83%] left-1/4 right-1/4 top-[20.83%]" data-name="Vector">
              <div className="absolute inset-[-8.04%_-9.38%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.9375 6.77083">
                  <path d={svgPaths.pe7b5200} id="Vector" stroke="var(--stroke-0, #DE350B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9375" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] h-[51.5px] min-h-px min-w-px relative rounded-[8px]" data-name="Component 104">
      <div className="content-stretch flex items-start justify-between px-[16px] py-[4px] relative size-full">
        <Frame34 />
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Engagement</p>
      </div>
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#016699] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">4.3</p>
      </div>
      <div className="absolute flex items-center justify-center left-[21px] size-[10px] top-[20px]">
        <div className="flex-none rotate-180">
          <div className="overflow-clip relative size-[10px]" data-name="arrow-up">
            <div className="absolute bottom-[20.83%] left-1/4 right-1/4 top-[20.83%]" data-name="Vector">
              <div className="absolute inset-[-8.04%_-9.38%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.9375 6.77083">
                  <path d={svgPaths.pe7b5200} id="Vector" stroke="var(--stroke-0, #DE350B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9375" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] h-[51.5px] min-h-px min-w-px relative rounded-[8px]" data-name="Component 103">
      <div className="content-stretch flex items-start justify-between px-[16px] py-[4px] relative size-full">
        <Frame35 />
      </div>
    </div>
  );
}

function Frame95() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Component1 />
      <Component />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start leading-[0] relative shrink-0 whitespace-nowrap">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Potency</p>
      </div>
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[14px]">
        <p className="leading-[normal]">86%</p>
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="bg-[#f8f9fa] content-stretch flex h-[51.5px] items-start justify-between px-[16px] py-[4px] relative rounded-[8px] shrink-0 w-[160.167px]" data-name="Component 106">
      <Frame36 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start leading-[0] relative shrink-0 whitespace-nowrap">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Medical Checkup</p>
      </div>
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[0px]">
        <p>
          <span className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Tinggi Badan
          </span>
          <span className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>{` `}</span>
          <span className="leading-[normal] text-[14px]">172</span>
        </p>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="bg-[#f8f9fa] content-stretch flex h-[51.5px] items-start justify-between px-[16px] py-[4px] relative rounded-[8px] shrink-0 w-[160.167px]" data-name="Component 104">
      <Frame37 />
    </div>
  );
}

function Frame96() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Component3 />
      <Component2 />
    </div>
  );
}

function Frame94() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame95 />
      <Frame96 />
    </div>
  );
}

function Frame121() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[368.333px]">
      <div className="bg-white content-stretch flex flex-col gap-[16px] items-end overflow-x-clip overflow-y-auto pl-[36px] pr-[16px] py-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368.333px]" data-name="Career & Succession plan">
        <Frame80 />
        <Frame47 />
        <div className="relative rounded-[28px] shrink-0 w-full cursor-pointer hover:bg-[#f0f9ff] transition-colors" data-name="button"
          onClick={() => { window.location.href = '/tdp-view?tab=compare&from=iprofile'; }}>
          <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative w-full">
              <div className="overflow-clip relative shrink-0 size-[20px]" data-name="users">
                <div className="absolute inset-[12.5%]" data-name="Vector">
                  <div className="absolute inset-[-5%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
                      <path d={svgPaths.p221e2500} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px]">Compare Successors</p>
            </div>
          </div>
        </div>
        <div className="absolute left-0 overflow-clip size-[16px] top-[17px]" data-name="grip-vertical">
          <div className="absolute inset-[16.67%_33.33%]" data-name="Vector">
            <div className="absolute inset-[-7.03%_-14.06%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.83333 12.1667">
                <g id="Vector">
                  <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.pccbae00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p363ea80} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p374adb00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p29561a80} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p21375e00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <DynamicConnectors />
      </div>
      <div className="bg-white content-stretch flex flex-col gap-[23px] items-start p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368.333px]" data-name="Teams">
        <Frame117 />
        <Frame87 />
        <div className="absolute left-0 overflow-clip size-[16px] top-[17px]" data-name="grip-vertical">
          <div className="absolute inset-[16.67%_33.33%]" data-name="Vector">
            <div className="absolute inset-[-7.03%_-14.06%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.83333 12.1667">
                <g id="Vector">
                  <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.pccbae00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p363ea80} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p374adb00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p29561a80} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p21375e00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white content-stretch flex flex-col gap-[23px] h-[216.313px] items-start p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368.333px]" data-name="Data Extension">
        <Frame91 />
        <Frame94 />
        <div className="absolute left-0 overflow-clip size-[16px] top-[16px]" data-name="grip-vertical">
          <div className="absolute inset-[16.67%_33.33%]" data-name="Vector">
            <div className="absolute inset-[-7.03%_-14.06%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.83333 12.1667">
                <g id="Vector">
                  <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.pccbae00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p363ea80} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p374adb00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p29561a80} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p21375e00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame98() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">Development</p>
      </div>
    </div>
  );
}

function Frame103() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-end relative shrink-0 w-[70.083px]">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="filter">
        <div className="absolute inset-[16.67%_16.67%_12.5%_16.67%]" data-name="Vector">
          <div className="absolute inset-[-6.62%_-7.03%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.1667 12.8333">
              <path d={svgPaths.p371f8300} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="dots-vertical">
        <div className="absolute inset-[16.67%_45.83%]" data-name="Vector">
          <div className="absolute inset-[-7.03%_-56.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.83333 12.1667">
              <g id="Vector">
                <path d={svgPaths.pccbae00} stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p363ea80} stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame97() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[336.333px]">
      <Frame98 />
      <Frame103 />
    </div>
  );
}

function Frame104() {
  const router = useRouter();
  
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">IDP History</p>
      </div>
      <button 
        onClick={() => { window.location.href = '/idp/create-idp-admin.html?from=iprofile'; }}
        className="content-stretch flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[28px] shrink-0 cursor-pointer hover:bg-[#f5f5f5] transition-colors"
      >
        <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="plus">
          <div className="absolute inset-[20.83%]" data-name="Vector">
            <div className="absolute inset-[-6.43%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.1667 13.1667">
                <path d={svgPaths.p2593f8c0} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
        <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px]">Create New IDP</p>
      </button>
    </div>
  );
}

function Frame146() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#e7f5ff] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#016699] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            Problem solving
          </p>
        </div>
      </div>
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#e7f5ff] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#016699] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            critical thinking
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame106() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="user">
        <div className="absolute bottom-[12.5%] left-1/4 right-1/4 top-[12.5%]" data-name="Vector">
          <div className="absolute inset-[-6.25%_-9.38%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5 13.5">
              <path d={svgPaths.p31b1e080} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] w-[124.333px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Lautaro Martinez</p>
      </div>
    </div>
  );
}

function Frame107() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="calendar-time">
        <div className="absolute inset-[12.5%_8.33%_8.33%_12.5%]" data-name="Vector">
          <div className="absolute inset-[-5.92%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.1667 14.1667">
              <path d={svgPaths.p1d4d7580} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Dec 5, 2024 - Mar 11, 2025</p>
      </div>
    </div>
  );
}

function IdpList() {
  const router = useRouter();
  
  return (
    <div 
      className="bg-[#f8f9fa] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-[336.333px] cursor-pointer transition-all hover:shadow-md" 
      data-name="IDP List"
      onClick={() => router.push('/idp-monitoring')}
    >
      <Frame146 />
      <Frame106 />
      <Frame107 />
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#fff2e4] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <div className="overflow-clip relative shrink-0 size-[14px]" data-name="progress">
            <div className="absolute inset-[13.43%_12.51%_13.43%_13.02%]" data-name="Vector">
              <div className="absolute inset-[-7.33%_-7.19%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9269 11.7402">
                  <path d={svgPaths.p15195200} id="Vector" stroke="var(--stroke-0, #FD9F28)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#fd9f28] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            in progress
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame108() {
  return (
    <div className="content-start flex flex-wrap gap-[4px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[800px]" />
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            strategic thinking
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame147() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#e7f5ff] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#016699] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            Startegic thinking
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame109() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="user">
        <div className="absolute bottom-[12.5%] left-1/4 right-1/4 top-[12.5%]" data-name="Vector">
          <div className="absolute inset-[-6.25%_-9.38%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5 13.5">
              <path d={svgPaths.p31b1e080} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] w-[124.333px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Griezmann</p>
      </div>
    </div>
  );
}

function Frame110() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="calendar-time">
        <div className="absolute inset-[12.5%_8.33%_8.33%_12.5%]" data-name="Vector">
          <div className="absolute inset-[-5.92%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.1667 14.1667">
              <path d={svgPaths.p1d4d7580} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre-wrap">Dec 5, 2024 - Mar 11, 2025</p>
      </div>
    </div>
  );
}

function IdpList1() {
  const router = useRouter();
  
  return (
    <div 
      className="bg-[#f8f9fa] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-[336.333px] cursor-pointer transition-all hover:shadow-md" 
      data-name="IDP List"
      onClick={() => router.push('/idp-monitoring')}
    >
      <Frame108 />
      <Frame147 />
      <Frame109 />
      <Frame110 />
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className="bg-[#f2f9f7] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
          <div className="overflow-clip relative shrink-0 size-[14px]" data-name="check">
            <div className="absolute inset-[22.92%_16.67%_27.08%_12.5%]" data-name="Vector">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.91667 7">
                <path clipRule="evenodd" d={svgPaths.p2eda3e00} fill="var(--fill-0, #00875A)" fillRule="evenodd" id="Vector" />
              </svg>
            </div>
          </div>
          <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#00875a] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
            done
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame105() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-[336.333px]">
      <IdpList />
      <IdpList1 />
    </div>
  );
}

function Frame112() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">Employee Data</p>
      </div>
    </div>
  );
}

function Frame113() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-[70.083px]">
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="dots-vertical">
        <div className="absolute inset-[16.67%_45.83%]" data-name="Vector">
          <div className="absolute inset-[-7.03%_-56.25%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.83333 12.1667">
              <g id="Vector">
                <path d={svgPaths.pccbae00} stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p363ea80} stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame111() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[336.333px]">
      <Frame112 />
      <Frame113 />
    </div>
  );
}

function Frame114() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">Personal Data</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="edit">
        <div className="absolute inset-[12.5%_12.5%_16.67%_16.67%]" data-name="Vector">
          <div className="absolute inset-[-6.62%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8334 12.8334">
              <path d={svgPaths.p6667300} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">NIK</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">2349710001</p>
        </div>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Phone</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">+6282342905893</p>
        </div>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Date of Birth</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">12 Februari 1988</p>
        </div>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Age</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">36</p>
        </div>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Gender</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Laki-laki</p>
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Last Education</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">S2 Psychology UNPAD</p>
        </div>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">City Domicile</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Surabaya</p>
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Province Domicile</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Jawa Timur</p>
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Marital Status</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Menikah</p>
        </div>
      </div>
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start py-[4px] relative shrink-0 w-full">
      <Frame114 />
      <Frame7 />
      <Frame28 />
      <Frame30 />
      <Frame29 />
      <Frame31 />
      <Frame32 />
      <Frame38 />
      <Frame39 />
      <Frame40 />
    </div>
  );
}

function Frame115() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">Employee Data</p>
      </div>
      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="edit">
        <div className="absolute inset-[12.5%_12.5%_16.67%_16.67%]" data-name="Vector">
          <div className="absolute inset-[-6.62%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8334 12.8334">
              <path d={svgPaths.p6667300} id="Vector" stroke="var(--stroke-0, #58595B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Report to</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Product Lead (Rodri)</p>
        </div>
      </div>
    </div>
  );
}

function Frame70() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Work start date</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">September 2019</p>
        </div>
      </div>
    </div>
  );
}

function Frame71() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Tenure</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">4 thn, 4 bln</p>
        </div>
      </div>
    </div>
  );
}

function Frame72() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Career History</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Product Head | Jul 2021 - Current</p>
        </div>
      </div>
    </div>
  );
}

function Frame73() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 text-white w-[117px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Career History</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-[#495057] text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{`Product Designer | Sept 2019 - Jul  2021 `}</p>
        </div>
      </div>
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start py-[4px] relative shrink-0 w-full">
      <Frame115 />
      <Frame8 />
      <Frame70 />
      <Frame71 />
      <Frame72 />
      <Frame73 />
    </div>
  );
}

function Frame69() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start overflow-clip relative shrink-0 w-full">
      <Frame67 />
      <Frame68 />
    </div>
  );
}

function Frame119() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[368.333px]">
      <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368px]" data-name="IDP List">
        <Frame97 />
        <Frame104 />
        <Frame105 />
        <div className="absolute left-[-0.17px] overflow-clip size-[16px] top-[16px]" data-name="grip-vertical">
          <div className="absolute inset-[16.67%_33.33%]" data-name="Vector">
            <div className="absolute inset-[-7.03%_-14.06%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.83333 12.1667">
                <g id="Vector">
                  <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.pccbae00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p363ea80} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p374adb00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p29561a80} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p21375e00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white content-stretch flex flex-col gap-[16px] items-center p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368px]" data-name="Employee Data">
        <Frame111 />
        <Frame69 />
        <button className="content-stretch cursor-pointer flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[28px] shrink-0" data-name="button">
          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[28px]" />
          <div className="overflow-clip relative shrink-0 size-[20px]" data-name="circle-chevron-up">
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <div className="absolute inset-[-5%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
                  <path d={svgPaths.pffcc900} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adb5bd] text-[14px] text-left">Less</p>
        </button>
        <div className="absolute left-0 overflow-clip size-[16px] top-[16px]" data-name="grip-vertical">
          <div className="absolute inset-[16.67%_33.33%]" data-name="Vector">
            <div className="absolute inset-[-7.03%_-14.06%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.83333 12.1667">
                <g id="Vector">
                  <path d={svgPaths.p3bb3ed00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.pccbae00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p363ea80} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p374adb00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p29561a80} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  <path d={svgPaths.p21375e00} stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Frame120() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const candidate = id ? candidates.find(c => c.id === id) : null;
  const profileValue = {
    name: candidate?.name ?? "Julian Alvarez",
    position: candidate?.position ?? "Direktur Pengembangan Bisnis",
  };
  return (
    <ProfileContext.Provider value={profileValue}>
      <div className="content-stretch flex gap-[16px] items-start relative size-full">
        <Frame118 />
        <Frame121 />
        <Frame119 />
      </div>
    </ProfileContext.Provider>
  );
}
