"use client";
import { useRouter, useSearchParams } from "next/navigation";
import svgPaths from "./svg-djevy8uiqd";
import { ScoreAspectWithTabs } from "../components/ScoreAspectWithTabs";
import { StandardPositionSelect } from "../components/StandardPositionSelect";
import { ProfileMoreMenu } from "../components/ProfileMoreMenu";
import { SuccessorsAccordion } from "../components/SuccessorsAccordion";
import { CareerPlanAccordion } from "../components/CareerPlanAccordion";
import { AddCareerPlanModal } from "../components/AddCareerPlanModal";
import { AddSuccessorsModal } from "../components/AddSuccessorsModal";
import { useState, useContext, useRef, useEffect } from "react";
import { candidates } from "@/data/dummyData";
import { getParticipant, scoreOf, allTeams } from "@/data/model/selectors";
import {
  ProfileContext,
  DEFAULT_EMP,
  DEFAULT_EXT,
  EMPTY_ASPECTS,
  type ProfileContextValue as ProfileCtxT,
  type CareerPlan,
  type Successor,
  type TeamRef,
  type Extension,
  type IdpHistoryItem,
  type ScoreAspects,
} from "../lib/ProfileContext";
import { getEditedPhoto } from "../lib/photoStore";

type ProfileDetail = { careerPlans: CareerPlan[]; successors: Successor[]; scoreAspects: ScoreAspects; teams: TeamRef[]; bloodType: string; extension: Extension; idpHistory: IdpHistoryItem[]; employee: ProfileCtxT["employee"] };

/**
 * "Competency match" = rata-rata kecocokan skor tiap aspek (Score Aspect card,
 * tab Competency) terhadap standarnya masing-masing, skala 0-100 — disamakan
 * dengan skala competency score di Vismap/TDP/Team Profile (bukan lagi 0-5
 * seperti sebelumnya, yang cuma cocok dengan kotak skor 1-5 di kartu Score
 * Aspect tapi beda sendiri dari halaman lain). Aspek yang skornya sudah >=
 * standar dihitung penuh (dibatasi 100%, tidak menambah rata-rata lewat itu),
 * aspek yang di bawah standar menariknya turun — jadi angka ini benar-benar
 * mencerminkan kecocokan orang tersebut dengan posisinya SAAT INI.
 */
function competencyMatchFromAspects(aspects: ScoreAspects["competency"]): string | null {
  if (!aspects || aspects.length === 0) return null;
  const ratios = aspects.map(a => Math.min(1, a.score / a.standardScore));
  const avg = ratios.reduce((s, v) => s + v, 0) / ratios.length;
  return Math.round(avg * 100).toString();
}

function Frame151() {
  const { name, position, employeeId } = useContext(ProfileContext);
  // Per-person WC photo keyed by canonical p-id; falls back to the generic photo.
  const defaultPhoto = /^p\d+$/i.test(employeeId) ? `/avatars/photo_wc2026/${employeeId.toLowerCase()}.png` : '/iprofile-assets/profile-photo.png';
  const [photoSrc, setPhotoSrc] = useState<string>(() => getEditedPhoto(employeeId) || defaultPhoto);

  // Re-read when the viewed employee changes (e.g. navigating list → detail → list → another detail).
  useEffect(() => {
    setPhotoSrc(getEditedPhoto(employeeId) || defaultPhoto);
  }, [employeeId, defaultPhoto]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { employeeId: string; dataUrl: string };
      if (detail.employeeId === employeeId) setPhotoSrc(detail.dataUrl);
    };
    window.addEventListener('profile-photo-changed', handler);
    return () => window.removeEventListener('profile-photo-changed', handler);
  }, [employeeId]);

  return (
    <div className="absolute left-[18px] top-[44px] w-[269px] h-[269px] overflow-hidden"
      style={{ borderRadius: "8px 8px 164.89px 8px" }}>

      {/* Layer 1 — background biru, 3/4 tinggi dari bawah */}
      <div className="absolute bottom-0 left-0 right-0 rounded-[8px]" style={{ height: "75%", background: "#197fc9" }} />

      {/* Layer 2 — foto PNG tanpa background */}
      <img alt="" className="absolute inset-0 w-full h-full object-cover object-top" src={photoSrc} onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.src = '/iprofile-assets/profile-photo.png'; t.onerror = null; }} />

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
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] whitespace-nowrap">
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
  const { personality } = useContext(ProfileContext);
  return (
    <div className="bg-[#f8f9fa] h-[50px] leading-[0] overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-full whitespace-nowrap">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center left-[13px] text-[#495057] text-[10px] top-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Personality</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Avenir:Heavy',sans-serif] justify-center left-[13px] not-italic text-[#016699] text-[14px] top-[34.5px]">
        <p className="leading-[normal]">{personality}</p>
      </div>
    </div>
  );
}

function Frame102() {
  const { iq, gtq } = useContext(ProfileContext);
  return (
    <div className="bg-[#f8f9fa] h-[50px] leading-[0] overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[135px] whitespace-nowrap">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center left-[13px] text-[#495057] text-[10px] top-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Intelligence</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['Avenir:Heavy',sans-serif] justify-center left-[13px] not-italic text-[#016699] text-[0px] top-[34.5px]">
        <p>
          <span className="leading-[normal] text-[8px]">IQ:</span>
          <span className="leading-[normal] text-[14px]">{`${iq} , `}</span>
          <span className="leading-[normal] text-[8px]">GTQ:</span>
          <span className="leading-[normal] text-[14px]">{gtq}</span>
        </p>
      </div>
    </div>
  );
}

function Frame25() {
  const { competencyMatch } = useContext(ProfileContext);
  return (
    <div className="bg-[#f8f9fa] h-[50px] overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-full">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] left-[13px] text-[#495057] text-[10px] top-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Competency match</p>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-row items-center gap-[2px] left-[15px] top-[34.5px] whitespace-nowrap">
        <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic text-[#016699] text-[14px]">{competencyMatch}%</p>
      </div>
      <div className="absolute overflow-clip size-[10px] top-[21px]" style={{ left: `${15 + `${competencyMatch}%`.length * 7.5}px` }} data-name="arrow-up">
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

// Toggle list/spider-chart pindah ke baris dropdown standar jabatan (Frame116),
// jadi baris ini tinggal tombol Score Records saja, rata kanan.
// Aksi kartu (bukan filter) — ditaruh sebagai footer, dipisah garis dari isi.
// Sebelumnya berdiri di antara kontrol dan ikut terbaca sebagai filter, padahal
// semua kontrol lain mengubah tampilan sementara tombol ini membuka data lain.
function Frame153() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-full pt-[12px] mt-[4px] border-t border-[#e9ecef]">
      <div className="content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[4px] relative rounded-[28px] shrink-0 w-[135px] cursor-pointer" data-name="button">
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

// Baris filter: dropdown standar jabatan di kiri, opsi tampilan (list/spider)
// di kanan lewat `rightSlot`; legend "Score" jadi caption kecil di bawahnya.
//
// `showLegend` false saat view spider chart: tanda centang & kotak biru itu
// bahasa visual milik view list, di chart keduanya tidak ada — dan chart sudah
// punya legend sendiri di bawahnya.
function Frame116({ rightSlot, showLegend = true }: { rightSlot?: React.ReactNode; showLegend?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] relative shrink-0 w-full">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
        <StandardPositionSelect />
        {rightSlot}
      </div>
      {showLegend && <Frame9 />}
    </div>
  );
}


function Frame118() {
  const { scoreAspects } = useContext(ProfileContext);
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
        scoreAspects={scoreAspects}
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

function Frame46() {
  const { careerPlans } = useContext(ProfileContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
        {careerPlans.map((cp, i) => (
          <div key={i} data-conn={i === 0 ? "career-structural" : "career-additional"} className="w-full"><CareerPlanAccordion label={`Career Plan ${i + 1}`} position={cp.position} name={cp.name} percentage={cp.percentage} status={cp.status} showAddedTag={i > 0} addedTagIcon={i % 2 === 0 ? "arrow-up-right" : "arrows-horizontal"} showDeleteIcon={i > 0} /></div>
        ))}
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

function Frame49() {
  const { successors } = useContext(ProfileContext);
  const [isAddSuccessorsModalOpen, setIsAddSuccessorsModalOpen] = useState(false);

  return (
    <>
      <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
        {successors.map((sx, i) => (
          <div key={i} data-conn="succ-structural" className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Component successors">
            <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[normal] whitespace-pre-wrap">{`Successors ${i + 1}`}</p>
            </div>
            <div className="content-stretch flex items-center relative shrink-0 w-full"><SuccessorsAccordion name={sx.name} position={sx.position} percentage={sx.percentage} status={sx.status} photoType={i % 2 === 0 ? "woman" : "man"} photoUrl={sx.id ? `/avatars/photo_wc2026/${sx.id}.png` : undefined} /></div>
          </div>
        ))}
        {successors.length === 0 && <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: "#adb5bd", padding: "8px 0" }}>No successors yet.</div>}
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

function Frame33() {
  const { bloodType } = useContext(ProfileContext);
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start leading-[0] relative shrink-0 text-white whitespace-nowrap">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Golongan Darah</p>
      </div>
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[14px]">
        <p className="leading-[normal]">{bloodType}</p>
      </div>
    </div>
  );
}

// One team tile — data-driven replacement for the fixed Component4/5/6.
function TeamTile({ name, role }: { name: string; role: string }) {
  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] h-[51.5px] min-h-px min-w-px relative rounded-[8px]" data-name="Team">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center leading-[0] px-[16px] py-[4px] relative size-full whitespace-nowrap">
          <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[14px]">
            <p className="leading-[normal] font-[Open_Sans] font-bold text-[12px]">{name}</p>
          </div>
          <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[normal]">{role}</p>
          </div>
        </div>
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

function Frame87() {
  const { teams } = useContext(ProfileContext);
  // team tiles + the blood-type tile as the final cell, laid out 2 per row
  const cells = [
    ...teams.map((t, i) => <TeamTile key={`t${i}`} name={t.name} role={t.role} />),
    <Frame66 key="blood" />,
  ];
  const rows: React.ReactNode[][] = [];
  for (let i = 0; i < cells.length; i += 2) rows.push(cells.slice(i, i + 2));
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      {rows.map((row, i) => (
        <div key={i} className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
          {row}
        </div>
      ))}
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
  const { extension } = useContext(ProfileContext);
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Performance</p>
      </div>
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#016699] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">{extension.performance}</p>
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
  const { extension } = useContext(ProfileContext);
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Engagement</p>
      </div>
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#016699] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">{extension.engagement}</p>
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
  const { extension } = useContext(ProfileContext);
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start leading-[0] relative shrink-0 whitespace-nowrap">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Potency</p>
      </div>
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center not-italic relative shrink-0 text-[#016699] text-[14px]">
        <p className="leading-[normal]">{extension.potency}</p>
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
  const { extension } = useContext(ProfileContext);
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
          <span className="leading-[normal] text-[14px]">{extension.height}</span>
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
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] whitespace-nowrap">
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
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">IDP History</p>
      </div>
      <button 
        onClick={() => { window.location.href = '/idp?page=create-idp-admin.html&from=iprofile'; }}
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

// One IDP-history card — data-driven replacement for the fixed IdpList/IdpList1.
function IdpCard({ program, competencies, pic, dateRange, status }: { program: string; competencies: string[]; pic: string; dateRange: string; status: string }) {
  const router = useRouter();
  const { name: employeeName } = useContext(ProfileContext);
  const done = status.toLowerCase() === "done";
  return (
    <div
      className="bg-[#f8f9fa] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-[336.333px] cursor-pointer transition-all hover:shadow-md"
      data-name="IDP List"
      onClick={() => router.push(`/idp?page=detail-idp-admin.html&name=${encodeURIComponent(employeeName)}`)}
    >
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#212529] text-[13px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{program}</p>
      <div className="content-start flex flex-wrap gap-[4px] items-start relative shrink-0 w-full">
        {competencies.map((c, i) => (
          <div key={i} className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
            <div className="bg-[#e7f5ff] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
              <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#016699] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>{c}</p>
            </div>
          </div>
        ))}
      </div>
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
          <p className="leading-[normal] whitespace-pre-wrap">{pic}</p>
        </div>
      </div>
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
          <p className="leading-[normal] whitespace-pre-wrap">{dateRange}</p>
        </div>
      </div>
      <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
        <div className={`${done ? 'bg-[#f2f9f7]' : 'bg-[#fff2e4]'} content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0`} data-name="Chip">
          <p className={`font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 ${done ? 'text-[#00875a]' : 'text-[#fd9f28]'} text-[10px] uppercase`} style={{ fontVariationSettings: "'wdth' 100" }}>{status}</p>
        </div>
      </div>
    </div>
  );
}

function Frame105() {
  const { idpHistory } = useContext(ProfileContext);
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-[336.333px]">
      {idpHistory.map((h, i) => (
        <IdpCard key={i} program={h.program} competencies={h.competencies} pic={h.pic} dateRange={h.dateRange} status={h.status} />
      ))}
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
  const { employee } = useContext(ProfileContext);
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">NIK</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{employee.nik}</p>
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
          <p className="leading-[normal] whitespace-pre-wrap">+6282342905XXX</p>
        </div>
      </div>
    </div>
  );
}

function Frame30() {
  const { employee } = useContext(ProfileContext);
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Date of Birth</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{employee.dob}</p>
        </div>
      </div>
    </div>
  );
}

// Hitung umur dari string DOB ("1 Jan 1990" / "12 Februari 1988" / "17 Mei 1996").
// Bulan mendukung singkatan EN & ID. iProfile ssr:false → new Date() aman (client-only).
const _DOB_MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, may: 4, jun: 5, jul: 6,
  agu: 7, agt: 7, aug: 7, sep: 8, okt: 9, oct: 9, nov: 10, des: 11, dec: 11,
};
function ageFromDob(dob: string): string {
  const m = dob.trim().match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (!m) return "-";
  const day = parseInt(m[1], 10);
  const mon = _DOB_MONTHS[m[2].slice(0, 3).toLowerCase()];
  const year = parseInt(m[3], 10);
  if (mon == null) return "-";
  const now = new Date();
  let age = now.getFullYear() - year;
  if (now.getMonth() < mon || (now.getMonth() === mon && now.getDate() < day)) age -= 1;
  return age >= 0 ? String(age) : "-";
}

function Frame29() {
  const { employee } = useContext(ProfileContext);
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Age</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{ageFromDob(employee.dob)}</p>
        </div>
      </div>
    </div>
  );
}

function Frame31() {
  const { employee } = useContext(ProfileContext);
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Gender</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{employee.gender}</p>
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  const { employee } = useContext(ProfileContext);
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Last Education</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{employee.lastEducation}</p>
        </div>
      </div>
    </div>
  );
}

function Frame38() {
  const { employee } = useContext(ProfileContext);
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">City Domicile</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{employee.city}</p>
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  const { employee } = useContext(ProfileContext);
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Province Domicile</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{employee.province}</p>
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  const { employee } = useContext(ProfileContext);
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Marital Status</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{employee.maritalStatus}</p>
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
  const { employee } = useContext(ProfileContext);
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">Report to</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{employee.reportTo}</p>
        </div>
      </div>
    </div>
  );
}

// A labelled key/value row inside the Employee Data card.
function EmpDataRow({ label, value, border = true }: { label: string; value: string; border?: boolean }) {
  return (
    <div className="relative shrink-0 w-full">
      {border && <div aria-hidden="true" className="absolute border-[#dee2e6] border-b border-solid inset-0 pointer-events-none" />}
      <div className="content-stretch flex font-['Open_Sans:Regular',sans-serif] font-normal gap-[4px] items-start leading-[0] p-[8px] relative text-[#495057] text-[12px] w-full">
        <div className="flex flex-col justify-center relative shrink-0 w-[118px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{label}</p>
        </div>
        <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative text-right" style={{ fontVariationSettings: "'wdth' 100" }}>
          <p className="leading-[normal] whitespace-pre-wrap">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Frame68() {
  const { employee } = useContext(ProfileContext);
  const hist = employee.careerHistory;
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start py-[4px] relative shrink-0 w-full">
      <Frame115 />
      <Frame8 />
      <EmpDataRow label="Work start date" value={employee.workStartDate} />
      <EmpDataRow label="Tenure" value={employee.tenure} />
      {hist.map((h, i) => (
        <EmpDataRow key={i} label="Career History" value={`${h.title} | ${h.period}`} border={i < hist.length - 1} />
      ))}
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
  const participant = id ? getParticipant(id) : null;
  const comp = id ? scoreOf(id, "competency") : null;
  // Load per-participant profile detail from the editable JSON at runtime
  // (public/data/iprofile-data.json) — no rebuild needed to change it.
  const [iprofileData, setIprofileData] = useState<Record<string, ProfileDetail>>({});
  // Data IDP yang sama dengan halaman Monitoring, agar IDP History di sini sinkron.
  const [idpData, setIdpData] = useState<{ employees?: Array<{ name: string; idps?: Array<{ program?: string; aspects?: string[]; pics?: Array<{ name: string }>; period?: string; statusLabel?: string }> }> }>({});
  useEffect(() => {
    fetch("/data/iprofile-data.json").then(r => r.json()).then(setIprofileData).catch(() => {});
    fetch("/data/idp-data.json").then(r => r.json()).then(setIdpData).catch(() => {});
  }, []);
  const detail = id ? iprofileData[id] ?? null : null;

  // Teams — dari model kanonik (bukan blob): tim tempat participant menjadi member
  // dan/atau leader. Model memberi satu teamId per participant; role "leader" bila
  // ia memimpin tim tsb.
  const teams = id
    ? allTeams()
        .filter(t => t.leaderId === id || t.id === participant?.teamId)
        .map(t => ({ name: t.name, role: t.leaderId === id ? "as Team Leader" : "as Team member" }))
    : [];

  // IDP History — sinkron dengan data IDP (public/data/idp-data.json), dicocokkan
  // by NAMA participant (JSON itu tak menyimpan p-id). Participant tanpa IDP → kosong.
  const idpEmp = candidate ? (idpData.employees ?? []).find(e => e.name === candidate.name) : null;
  const idpHistory = (idpEmp?.idps ?? []).map(idp => ({
    program: idp.program ?? "-",
    competencies: (idp.aspects ?? []).map(a => a.replace(/\s*\([^)]*\)\s*$/, "")),
    pic: idp.pics?.[0]?.name ?? "-",
    dateRange: idp.period ?? "-",
    status: idp.statusLabel === "PENDING" ? "Need Review" : (idp.statusLabel ?? "-"),
  }));

  const profileValue: ProfileCtxT = {
    name: candidate?.name ?? "Julian Alvarez",
    position: candidate?.position ?? "Direktur Pengembangan Bisnis",
    employeeId: id ?? "default", // shared photo storage key with TDP
    personality: participant?.disc ?? "SC",
    competencyMatch: competencyMatchFromAspects(detail?.scoreAspects?.competency ?? []) ?? (comp != null ? String(comp) : "90"),
    iq: comp != null ? String(Math.round(95 + comp / 4)) : "120",
    gtq: comp != null ? String(Math.round(90 + comp / 4)) : "115",
    careerPlans: detail?.careerPlans ?? [],
    successors: detail?.successors ?? [],
    scoreAspects: detail?.scoreAspects ?? EMPTY_ASPECTS,
    teams,
    bloodType: detail?.bloodType ?? "A",
    extension: detail?.extension ?? DEFAULT_EXT,
    idpHistory,
    employee: detail?.employee ?? DEFAULT_EMP,
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
