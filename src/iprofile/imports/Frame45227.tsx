"use client";
import { useRouter, useSearchParams } from "next/navigation";
import svgPaths from "./svg-djevy8uiqd";
import { IProfileCardGrid } from "../components/IProfileCardGrid";
import { StandardPositionSelect } from "../components/StandardPositionSelect";
import { ProfileMoreMenu } from "../components/ProfileMoreMenu";
import { SuccessorsAccordion } from "../components/SuccessorsAccordion";
import { CareerPlanAccordion } from "../components/CareerPlanAccordion";
import { AddCareerPlanModal } from "../components/AddCareerPlanModal";
import { AddSuccessorsModal } from "../components/AddSuccessorsModal";
import { useState, useContext, useEffect } from "react";
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
  type EmployeeBio,
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

/**
 * Tata letak kartu Profile.
 *
 * Kartu ini tidak memakai latar putih, bayangan, maupun baris kepala: fotonya
 * sendiri sudah punya bidang dan bayangan, jadi kotak putih di belakangnya cuma
 * menambah kerangka yang tidak memberi keterangan apa pun.
 *
 * Angka-angkanya saling terikat, jadi dikumpulkan di sini:
 * - top 0 karena tidak ada baris kepala yang perlu diberi ruang.
 * - size 300 adalah batas praktisnya: wadahnya ber-overflow-clip, jadi tinggi
 *   apa pun di atas ini terpotong di bawah.
 * - CARD_HEIGHT 302 dihitung dari isi paling bawah (chip berakhir di 286),
 *   bukan ditebak; sisa 16px sama dengan proporsi rancangan aslinya.
 *
 * Menggeser salah satu tanpa yang lain meninggalkan ruang kosong di kaki kartu
 * atau memotong isinya.
 */
const PHOTO = { left: 8, top: 0, size: 300 } as const;
const CARD_HEIGHT = 302;
const CHIPS_TOP = 103.83;

/**
 * Perbandingan radius sudut terhadap sisi bidang foto, dari rancangan aslinya
 * (164.89 pada bidang 269px). Ditulis sebagai rasio, bukan angka mati: dipakai
 * apa adanya pada bidang 300px, lengkung besar di sudutnya jadi lebih dangkal
 * dan bentuk khas foto itu berubah.
 */
const PHOTO_CORNER_RATIO = 164.89 / 269;

/**
 * Latar tiga chip (Personality, Intelligence, Competency match).
 *
 * Putih karena yang di belakangnya halaman yang abu muda. Waktu kartu ini masih
 * berlatar putih, chip-nya justru abu muda — putih di atas putih tidak terbaca
 * sebagai bidang tersendiri.
 */
const CHIP_BG = "#ffffff";

function Frame151() {
  const { name, position, employeeId } = useContext(ProfileContext);
  // Per-person WC photo keyed by canonical p-id; falls back to the generic photo.
  const defaultPhoto = /^p\d+$/i.test(employeeId) ? `/avatars/employee/${employeeId.toLowerCase()}.png` : '/iprofile-assets/profile-photo.png';
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
    <div
      className="absolute overflow-hidden"
      style={{
        top: PHOTO.top,
        left: PHOTO.left,
        width: PHOTO.size,
        height: PHOTO.size,
        borderRadius: `8px 8px ${(PHOTO.size * PHOTO_CORNER_RATIO).toFixed(2)}px 8px`,
      }}
    >

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

function Frame26() {
  const { personality } = useContext(ProfileContext);
  return (
    <div className="h-[50px] leading-[0] overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-full whitespace-nowrap" style={{ background: CHIP_BG }}>
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
    <div className="h-[50px] leading-[0] overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[135px] whitespace-nowrap" style={{ background: CHIP_BG }}>
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
    <div className="h-[50px] overflow-clip relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" style={{ background: CHIP_BG }}>
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
    <div
      className="absolute content-stretch flex flex-col gap-[16px] items-end left-[217px] w-[135px]"
      style={{ top: CHIPS_TOP }}
    >
      <Frame26 />
      <Frame102 />
      <Frame25 />
    </div>
  );
}

// Judul dioper, tidak ditulis tetap: header ini dipakai dua kartu — Competency
// Scores dan Potency Scores — yang dulu masih satu kartu bertab "Score Aspect".
function Frame83({ title }: { title: string }) {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">{title}</p>
      </div>
    </div>
  );
}

/**
 * Kepala kartu skor. `rightSlot` menempati sudut kanan atas — dulu diisi menu
 * titik tiga yang tidak pernah membuka apa pun, sekarang tempat aksi kartunya.
 */
export function Frame79({ title, rightSlot }: { title: string; rightSlot?: React.ReactNode }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[336.333px]">
      <Frame83 title={title} />
      {rightSlot}
    </div>
  );
}

/**
 * Score Records — aksi kartu, bukan penyaring: ia membuka data lain, bukan
 * mengubah tampilan yang sedang dilihat. Bergaya text button supaya tidak
 * bersaing perhatian dengan isi kartu, dan duduk di kepala kartu bersama
 * judulnya.
 */
export function Frame153() {
  return (
    <button
      type="button"
      className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic shrink-0 text-[#016699] text-[14px] cursor-pointer bg-transparent border-none p-0 hover:underline"
      data-name="button"
    >
      Score Records
    </button>
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
export function Frame116({ rightSlot, showLegend = true }: { rightSlot?: React.ReactNode; showLegend?: boolean }) {
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


/** Kartu Profile — tanpa latar putih, bayangan, maupun baris kepala. */
export function ProfileCard() {
  return (
  <div className="overflow-clip relative rounded-[8px] shrink-0 w-[368px]" data-name="Profile">
    <div style={{ height: CARD_HEIGHT }} />
    <Frame151 />
    {/*
      Bidang foto adalah pemicu menu foto (lihat/ubah foto profil) — tidak ada
      lagi tombol titik-tiga. Menu itu satu-satunya jalan ke ubah foto profil di
      seluruh aplikasi, jadi ia tidak boleh hilang bersama tombolnya.

      Ditaruh SEBELUM Frame88 supaya chip di kanan tetap tergambar di atasnya:
      chip menimpa sisi kanan foto, dan pemicu yang menutupinya akan membuat klik
      di atas chip terasa seperti klik pada foto.

      Radiusnya disamakan dengan fotonya supaya daerah kliknya berhenti di tempat
      fotonya berhenti, bukan di kotak siku yang tak terlihat.
    */}
    <div
      className="absolute"
      style={{
        top: PHOTO.top,
        left: PHOTO.left,
        width: PHOTO.size,
        height: PHOTO.size,
        borderRadius: `8px 8px ${(PHOTO.size * PHOTO_CORNER_RATIO).toFixed(2)}px 8px`,
      }}
    >
      <ProfileMoreMenu />
    </div>
    <Frame88 />
  </div>
  );
}

function Frame84({ title }: { title: string }) {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">{title}</p>
      </div>
    </div>
  );
}

function Frame80({ title, rightSlot }: { title: string; rightSlot?: React.ReactNode }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[336.333px]">
      <Frame84 title={title} />
      {rightSlot}
    </div>
  );
}

/** Tombol tambah di sudut kanan atas kartu. */
function PlusButton({ onClick, title }: { onClick: () => void; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="block cursor-pointer overflow-clip relative shrink-0 size-[20px] hover:opacity-70 transition-opacity"
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
  );
}

/**
 * Isi kartu Career Plan, kepala kartunya sekalian: tombol tambah duduk di
 * sudut kanan atas, dan yang membuka modalnya komponen ini juga — tombol dan
 * state-nya tidak perlu berjauhan.
 */
function Frame46() {
  const { careerPlans } = useContext(ProfileContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Frame80
        title="Career Plan"
        rightSlot={<PlusButton onClick={() => setIsModalOpen(true)} title="Tambah career plan" />}
      />
      <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
        {careerPlans.map((cp, i) => (
          <div key={i} className="w-full"><CareerPlanAccordion label={`Career Plan ${i + 1}`} position={cp.position} name={cp.name} percentage={cp.percentage} status={cp.status} showAddedTag={i > 0} addedTagIcon={i % 2 === 0 ? "arrow-up-right" : "arrows-horizontal"} showDeleteIcon={i > 0} /></div>
        ))}
      </div>
      <AddCareerPlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

function Frame49() {
  const { successors } = useContext(ProfileContext);
  const [isAddSuccessorsModalOpen, setIsAddSuccessorsModalOpen] = useState(false);

  return (
    <>
      <Frame80
        title="Succession Plan"
        rightSlot={<PlusButton onClick={() => setIsAddSuccessorsModalOpen(true)} title="Tambah successor" />}
      />
      <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
        {successors.map((sx, i) => (
          <div key={i} className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-full" data-name="Component successors">
            <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[normal] whitespace-pre-wrap">{`Successors ${i + 1}`}</p>
            </div>
            <div className="content-stretch flex items-center relative shrink-0 w-full"><SuccessorsAccordion name={sx.name} position={sx.position} percentage={sx.percentage} status={sx.status} photoType={i % 2 === 0 ? "woman" : "man"} photoUrl={sx.id ? `/avatars/employee/${sx.id}.png` : undefined} /></div>
          </div>
        ))}
        {successors.length === 0 && <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 11, color: "#adb5bd", padding: "8px 0" }}>No successors yet.</div>}
      </div>
      
      <AddSuccessorsModal 
        isOpen={isAddSuccessorsModalOpen}
        onClose={() => setIsAddSuccessorsModalOpen(false)}
      />
    </>
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

/**
 * Rencana karier orang ini. Dulu satu kartu bersama Succession Plan; dipisah
 * karena keduanya menjawab pertanyaan berbeda — ke mana orang ini bisa naik,
 * versus siapa yang bisa menggantikannya.
 */
export function CareerPlanCard() {
  return (
  <div className="bg-white content-stretch flex flex-col gap-[16px] items-end overflow-x-clip overflow-y-auto p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368.333px]" data-name="Career plan">
    <Frame46 />
  </div>
  );
}

/**
 * iProfile mengenal orang lewat id `pNN`, TDP lewat `EMPnnn` — dua penomoran
 * untuk orang yang sama. Lihat generateEmployeeId di tdp/data/tdpEmployees.ts.
 */
function toTdpId(pid: string): string {
  const angka = pid.replace(/[^0-9]/g, '');
  return angka ? `EMP${angka.padStart(3, '0')}` : pid;
}

/** Calon penerus jabatan orang ini, beserta jalan ke perbandingannya. */
export function SuccessionPlanCard() {
  const { successors } = useContext(ProfileContext);

  /**
   * Buka TDP dengan para successor sudah tersemat.
   *
   * TDP memungut pin dari localStorage `shared_pinned` saat Screener pertama
   * kali dipasang, jadi cukup ditulis sebelum berpindah halaman — tidak perlu
   * jalur khusus lewat URL, apalagi router TDP hanya di memori dan tidak
   * membaca query param.
   *
   * `tableVisibleEmployeeIds` ikut dibersihkan: kalau tabel sedang menyaring
   * karyawan, successor yang tidak lolos saringan itu tidak akan muncul di
   * perbandingan meski sudah tersemat.
   */
  const bukaPerbandingan = () => {
    const pinIds = successors.map((s) => s.id).filter(Boolean).map((id) => toTdpId(id as string));
    try {
      localStorage.setItem('shared_pinned', JSON.stringify(pinIds));
      localStorage.removeItem('tableVisibleEmployeeIds');
    } catch {
      // localStorage bisa ditolak (mode privat); perbandingannya tetap dibuka,
      // hanya tanpa sematan.
    }
    window.location.href = '/tdp-view?tab=compare&from=iprofile';
  };

  return (
  <div className="bg-white content-stretch flex flex-col gap-[16px] items-end overflow-x-clip overflow-y-auto p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368.333px]" data-name="Succession plan">
    <Frame49 />
    <div className="relative rounded-[28px] shrink-0 w-full cursor-pointer hover:bg-[#f0f9ff] transition-colors" data-name="button"
      onClick={bukaPerbandingan}>
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
  </div>
  );
}

export function TeamsCard() {
  return (
  <div className="bg-white content-stretch flex flex-col gap-[23px] items-start p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368.333px]" data-name="Teams">
    <Frame117 />
    <Frame87 />
  </div>
  );
}

export function ExtensionDataCard() {
  return (
  <div className="bg-white content-stretch flex flex-col gap-[23px] h-[216.313px] items-start p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368.333px]" data-name="Data Extension">
    <Frame91 />
    <Frame94 />
  </div>
  );
}

function Frame98() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">Development Plan</p>
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
      // w-full, bukan lebar tetap: wadahnya menyusut sebesar batang gulir, dan
      // item berlebar tetap akan melebihinya sehingga muncul gulir MENDATAR.
      className="bg-[#f8f9fa] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] w-full cursor-pointer transition-all hover:shadow-md"
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

/**
 * Tinggi maksimum daftar IDP sebelum ia menggulir sendiri.
 *
 * Yang dibatasi DAFTARNYA, bukan seluruh kartu. Kalau kartunya yang menggulir,
 * judul dan tombol "Create New IDP" ikut hanyut ke atas — tombol utama kartu ini
 * jadi tidak terjangkau tepat ketika daftarnya panjang, yaitu saat orang paling
 * mungkin ingin menambah IDP.
 */
const IDP_LIST_MAX_HEIGHT = 420;

function Frame105() {
  const { idpHistory } = useContext(ProfileContext);
  return (
    <div
      className="content-stretch flex flex-col gap-[12px] items-stretch relative shrink-0 w-full overflow-y-auto"
      style={{ maxHeight: IDP_LIST_MAX_HEIGHT }}
    >
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



/**
 * Baris "Personal Data" (NIK s/d Marital Status), dibangun sebagai data supaya
 * bisa dipotong saat kartu dilipat lewat tombol Less/More. Nilainya sama
 * persis dengan yang dulu ditulis tetap di Frame7/28/30/29/31/32/38/39/40 —
 * termasuk "Phone" yang memang selalu angka dummy, bukan dari data karyawan.
 */
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

function personalDataRows(employee: EmployeeBio): { label: string; value: string }[] {
  return [
    { label: "NIK", value: employee.nik },
    { label: "Phone", value: "+6282342905XXX" },
    { label: "Date of Birth", value: employee.dob },
    { label: "Age", value: ageFromDob(employee.dob) },
    { label: "Gender", value: employee.gender },
    { label: "Last Education", value: employee.lastEducation },
    { label: "City Domicile", value: employee.city },
    { label: "Province Domicile", value: employee.province },
    { label: "Marital Status", value: employee.maritalStatus },
  ];
}

/** Baris "Employee Data" (Report to s/d Career History), bentuk data yang sama. */
function employeeDataRows(employee: EmployeeBio): { label: string; value: string }[] {
  return [
    { label: "Report to", value: employee.reportTo },
    { label: "Work start date", value: employee.workStartDate },
    { label: "Tenure", value: employee.tenure },
    ...employee.careerHistory.map((h) => ({ label: "Career History", value: `${h.title} | ${h.period}` })),
  ];
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

/**
 * Satu grup baris berjudul ("Personal Data" / "Employee Data") dengan jumlah
 * baris yang tampil dibatasi oleh `visible`. Grup yang kehabisan jatah (visible
 * <= 0) tidak dirender sama sekali — judulnya pun ikut hilang, karena judul
 * tanpa satu baris pun di bawahnya cuma kotak kosong.
 */
function EmpDataGroup({
  title,
  rows,
  visible,
}: {
  title: string;
  rows: { label: string; value: string }[];
  /** Berapa baris dari grup ini yang boleh tampil; grup lain memakai sisanya. */
  visible: number;
}) {
  if (visible <= 0) return null;
  const shown = rows.slice(0, visible);
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start py-[4px] relative shrink-0 w-full">
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <div className="flex flex-col font-['Avenir:Heavy',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[12px] whitespace-nowrap">
          <p className="leading-[normal]">{title}</p>
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
      {shown.map((r, i) => (
        <EmpDataRow key={r.label + i} label={r.label} value={r.value} border={i < shown.length - 1} />
      ))}
    </div>
  );
}

export function DevelopmentCard() {
  return (
  <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368px]" data-name="IDP List">
    <Frame97 />
    <Frame104 />
    <Frame105 />
  </div>
  );
}

/** Baris yang tampil saat dilipat — cukup untuk memberi gambaran tanpa memenuhi kartu. */
const COLLAPSED_ROW_COUNT = 6;

export function EmployeeDataCard() {
  const { employee } = useContext(ProfileContext);
  // Default terbuka: perilaku sebelum tombol ini hidup adalah menampilkan
  // semua baris, jadi keadaan awal harus tetap begitu.
  const [expanded, setExpanded] = useState(true);

  const personalRows = personalDataRows(employee);
  const employeeRows = employeeDataRows(employee);
  const totalRows = personalRows.length + employeeRows.length;

  // Jatah 6 baris dihabiskan dari grup Personal Data dulu, sisanya baru
  // dipakai Employee Data — begitu Personal Data sendiri sudah >= 6 baris
  // (selalu benar di data ini: 9 baris), grup Employee Data tidak tampil sama
  // sekali saat dilipat, judulnya pun ikut hilang lewat EmpDataGroup.
  const personalVisible = expanded ? personalRows.length : Math.min(COLLAPSED_ROW_COUNT, personalRows.length);
  const employeeVisible = expanded
    ? employeeRows.length
    : Math.max(0, COLLAPSED_ROW_COUNT - personalRows.length);

  return (
  <div className="bg-white content-stretch flex flex-col gap-[16px] items-center p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368px]" data-name="Employee Data">
    <Frame111 />
    <div className="content-stretch flex flex-col gap-[24px] items-start overflow-clip relative shrink-0 w-full">
      <EmpDataGroup title="Personal Data" rows={personalRows} visible={personalVisible} />
      <EmpDataGroup title="Employee Data" rows={employeeRows} visible={employeeVisible} />
    </div>
    {/* Tombol cuma berarti kalau ada sesuatu yang bisa disembunyikan. */}
    {totalRows > COLLAPSED_ROW_COUNT && (
      <button
        onClick={() => setExpanded((v) => !v)}
        className="content-stretch cursor-pointer flex gap-[8px] items-center px-[8px] py-[4px] relative rounded-[28px] shrink-0"
        data-name="button"
      >
        <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[28px]" />
        <div
          className="overflow-clip relative shrink-0 size-[20px]"
          data-name="circle-chevron-up"
          style={{ transform: expanded ? undefined : "rotate(180deg)", transition: "transform 0.15s" }}
        >
          <div className="absolute inset-[12.5%]" data-name="Vector">
            <div className="absolute inset-[-5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
                <path d={svgPaths.pffcc900} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
        <p className="font-['Avenir:Heavy',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#adb5bd] text-[14px] text-left">
          {expanded ? "Less" : "More"}
        </p>
      </button>
    )}
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
      <IProfileCardGrid scoreAspects={profileValue.scoreAspects} />
    </ProfileContext.Provider>
  );
}
