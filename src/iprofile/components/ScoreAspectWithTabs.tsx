"use client";
import { useContext, useState } from 'react';
import { Tabs } from '@mantine/core';
import svgPaths from '../imports/svg-djevy8uiqd';
import svgPathsPotency from '../imports/svg-87qx2z9isd';
import { StandardPositionSelect } from './StandardPositionSelect';
import { AspectRadarChart } from './AspectRadarChart';
import { KeyBehaviourBreakdown, type KeyBehaviour } from './KeyBehaviourBreakdown';
import { ProfileContext } from '../lib/ProfileContext';
import { aspectsFor } from '../lib/aspects';

/** Cara aspek ditampilkan: daftar kartu skor, atau spider/radar chart. */
type ViewMode = 'list' | 'chart';

export type { KeyBehaviour };
export type AspectItem = { label: string; category: string; score: number; standardScore: number; dev: boolean; keyBehaviours?: KeyBehaviour[] };

interface ScoreAspectProps {
  /** Header kartu; judulnya dioper karena dipakai dua kartu dengan nama berbeda. */
  Frame79: React.ComponentType<{ title: string }>;
  /** Baris toolbar tab Competency. `leftSlot` diisi toggle list/chart dari sini,
   *  Keduanya statis hasil import Figma, jadi bagian yang perlu state (toggle
   *  tampilan) dititipkan lewat slot dari sini. */
  Frame153: React.ComponentType;
  /** Baris dropdown standar jabatan; `rightSlot` diisi toggle list/spider,
   *  `showLegend` dimatikan di view chart (chart punya legend sendiri). */
  Frame116: React.ComponentType<{ rightSlot?: React.ReactNode; showLegend?: boolean }>;
  scoreAspects: { competency: AspectItem[]; potency: AspectItem[] };
}

// Group aspects by their category, preserving first-seen order.
function byCategory(items: AspectItem[]): [string, AspectItem[]][] {
  const map = new Map<string, AspectItem[]>();
  items.forEach((it) => { (map.get(it.category) ?? map.set(it.category, []).get(it.category)!).push(it); });
  return [...map.entries()];
}

/** "All" berarti tanpa penyaringan; sisanya nama kategori apa adanya. */
const ALL = 'all';

/**
 * Tab penyaring kategori. Isinya diturunkan dari data, bukan ditulis tetap:
 * kategori bisa ditambah lewat halaman Aspect, dan tab di sini ikut sendiri.
 */
function CategoryTabs({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  // Satu kategori saja tidak perlu penyaring — tabnya cuma jadi hiasan.
  if (categories.length < 2) return null;

  return (
    <Tabs value={value} onChange={(v) => onChange(v ?? ALL)} w="100%">
      <Tabs.List grow>
        <Tabs.Tab value={ALL}>All</Tabs.Tab>
        {categories.map((c) => (
          <Tabs.Tab key={c} value={c}>
            {c}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}

/** Kategori yang benar-benar ada di daftar aspek, urut kemunculan pertama. */
const categoriesOf = (items: AspectItem[]) => [...new Set(items.map((a) => a.category))];

/** Kerangka kartu skor — dipakai kartu Competency maupun Potency. */
function ScoreCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[12px] items-center overflow-clip p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368px]" data-name="Score Aspect">
      {children}

    </div>
  );
}

/**
 * Skor Competency — aspek yang dinilai untuk posisi orang ini beserta standar
 * Job-nya. Berdiri sebagai kartu sendiri; dulu satu kartu bertab dengan Potency.
 */
export function CompetencyScoresCard({ Frame79, Frame153, Frame116 }: Omit<ScoreAspectProps, 'scoreAspects'>) {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [category, setCategory] = useState<string>(ALL);

  // Satu daftar aspek untuk orang ini — General dan Technical berbaur, karena
  // keduanya cuma kategori. Aspek mana yang dinilai ditentukan posisinya, dan
  // standarnya oleh Job-nya; keduanya diurus `aspectsFor`.
  const { position, employeeId } = useContext(ProfileContext);
  const all = aspectsFor(position, employeeId);
  const items = category === ALL ? all : all.filter((a) => a.category === category);

  return (
    <ScoreCard>
      <Frame79 title="Competency Scores" />
      <CategoryTabs categories={categoriesOf(all)} value={category} onChange={setCategory} />
      <Frame116
        rightSlot={<ViewModeToggle mode={viewMode} onChange={setViewMode} />}
        showLegend={viewMode === 'list'}
      />
      {viewMode === 'chart' ? (
        // Penanda kategori di lingkar luar cuma berarti saat kategorinya lebih
        // dari satu; di tab General/Technical isinya sudah seragam.
        <AspectRadarChart items={items} showCategories={category === ALL} />
      ) : (
        <CompetencyContent items={items} />
      )}
      {/* Aksi kartu ditaruh paling bawah, di luar rangkaian kontrol. */}
      <Frame153 />
    </ScoreCard>
  );
}

/** Skor Potency — kartu terpisah dengan kontrol tampilannya sendiri. */
export function PotencyScoresCard({
  Frame79,
  items: all,
}: {
  Frame79: React.ComponentType<{ title: string }>;
  items: AspectItem[];
}) {
  // State tampilan milik kartu ini sendiri: sejak Competency dan Potency jadi
  // dua kartu, mengubah salah satunya tidak lagi ikut mengubah yang lain.
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [category, setCategory] = useState<string>(ALL);
  const items = category === ALL ? all : all.filter((a) => a.category === category);

  return (
    <ScoreCard>
      <Frame79 title="Potency Scores" />
      <CategoryTabs categories={categoriesOf(all)} value={category} onChange={setCategory} />
      <PotencyFilter
        rightSlot={<ViewModeToggle mode={viewMode} onChange={setViewMode} />}
        showLegend={viewMode === 'list'}
      />
      {viewMode === 'chart' ? (
        <AspectRadarChart items={items} showCategories={category === ALL} />
      ) : (
        <PotencyContent items={items} />
      )}
    </ScoreCard>
  );
}

/**
 * Toggle tampilan aspek: spider chart vs list. Dipakai kedua kartu.
 * Ikonnya persis aset Figma yang sudah ada, cuma sekarang state aktifnya nyata.
 */
export function ViewModeToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  const box = (active: boolean) =>
    `${active ? 'bg-[#e7f5ff]' : 'bg-[#f8f9fa]'} block cursor-pointer overflow-clip relative rounded-[4px] shrink-0 size-[20px]`;
  const stroke = (active: boolean) => (active ? '#016699' : '#CED4DA');

  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <button
        type="button"
        onClick={() => onChange('chart')}
        aria-pressed={mode === 'chart'}
        title="Tampilan spider chart"
        className={box(mode === 'chart')}
        data-name="chart-radar"
      >
        <div className="absolute inset-[12.5%_10.42%]" data-name="Vector">
          <div className="absolute inset-[-5%_-4.74%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3334 16.5">
              <path d={svgPathsPotency.p4355100} id="Vector" stroke={stroke(mode === 'chart')} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        aria-pressed={mode === 'list'}
        title="Tampilan list"
        className={box(mode === 'list')}
        data-name="list"
      >
        <div className="absolute bottom-[24.96%] left-[20.83%] right-[16.67%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-7.49%_-6%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 11.5083">
              <path d={svgPathsPotency.p24455faf} id="Vector" stroke={stroke(mode === 'list')} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

// Potency Filter — susunannya disamakan dengan tab Competency: dropdown standar
// jabatan di kiri, opsi tampilan di kanan, legend "Score" jadi caption di bawah.
// Legend disembunyikan di view chart (lihat alasan di Frame116).
function PotencyFilter({ rightSlot, showLegend = true }: { rightSlot?: React.ReactNode; showLegend?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] relative shrink-0 w-full">
      <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
        <StandardPositionSelect />
        {rightSlot}
      </div>
      {showLegend && (
        <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="circle">
            <div className="absolute inset-[12.5%]" data-name="Vector">
              <div className="absolute inset-[-6.25%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
                  <path d={svgPathsPotency.p39111680} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
          <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#495057] text-[10px]" style={{ fontVariationSettings: "'wdth' 100" }}>
            Score
          </p>
        </div>
      )}
    </div>
  );
}

// Category section wrapper — shared by both tabs.
function CategorySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Open_Sans',sans-serif] font-bold justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-ellipsis w-full whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">{title}</p>
      </div>
      <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
        {children}
      </div>
    </div>
  );
}

// Potency Content Component (data-driven)
function PotencyContent({ items }: { items: AspectItem[] }) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full">
      {byCategory(items).map(([cat, group]) => (
        <CategorySection key={cat} title={cat}>
          {group.map((a, i) => (
            <PotencyCard key={i} title={a.label} score={a.score} standardScore={a.standardScore} />
          ))}
        </CategorySection>
      ))}
    </div>
  );
}

// Competency Content Component (data-driven)
function CompetencyContent({ items }: { items: AspectItem[] }) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full">
      {byCategory(items).map(([cat, group]) => (
        <CategorySection key={cat} title={cat}>
          {group.map((a, i) => (
            <CompetencyCard key={i} title={a.label} score={a.score} standardScore={a.standardScore} dev={a.dev} keyBehaviours={a.keyBehaviours} />
          ))}
        </CategorySection>
      ))}
    </div>
  );
}

// Competency Card — label (+ DEV chip), 5-box score row, dan breakdown Key
// Behaviour yang bisa di-expand/collapse lewat icon info (bukan modal popup).
function CompetencyCard({ title, score, standardScore, dev, keyBehaviours }: { title: string; score: number; standardScore: number; dev: boolean; keyBehaviours?: KeyBehaviour[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasBreakdown = !!keyBehaviours && keyBehaviours.length > 0;

  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
              {/* Lebar nama aspek dibiarkan mengikuti sisa ruang baris (bukan
                  142px tetap seperti hasil export Figma) — nama sepanjang
                  "Keterampilan Interpersonal" atau "Kepatuhan Ketenagakerjaan"
                  jadi muat satu baris, dan tetap membungkus kalau memang tidak
                  cukup (mis. saat chip DEV. ikut memakan ruang). */}
              <div className="content-stretch flex gap-[4px] items-center relative flex-1 min-w-0 pr-[8px]">
                {dev && (
                  <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
                    <div className="bg-[#fff2e4] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
                      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#ca6f00] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>DEV.</p>
                    </div>
                  </div>
                )}
                <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative flex-1 min-w-0 text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <p className="leading-[normal] whitespace-pre-wrap">{title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => hasBreakdown && setExpanded((v) => !v)}
                aria-label={`${expanded ? "Tutup" : "Lihat"} breakdown Key Behaviour ${title}`}
                title="Penjelasan"
                aria-expanded={expanded}
                disabled={!hasBreakdown}
                className={`overflow-clip relative shrink-0 size-[16px] transition-transform ${hasBreakdown ? "cursor-pointer" : "cursor-default"}`}
                style={{ transform: expanded ? "rotate(180deg)" : undefined }}
                data-name="info-circle"
              >
                <div className="absolute inset-[12.5%]" data-name="Vector">
                  <div className="absolute inset-[-6.25%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
                      <path d={svgPathsPotency.p11080840} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
            <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
              <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-start min-h-px min-w-px relative" data-name="Score">
                {[1, 2, 3, 4, 5].map((index) => (
                  <CompetencyScoreBox key={index} position={index} score={score} standardScore={standardScore} />
                ))}
              </div>
            </div>
            {expanded && hasBreakdown && <KeyBehaviourBreakdown keyBehaviours={keyBehaviours!} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Competency Score Box — blue box marks the market standard, a check marks the score.
function CompetencyScoreBox({ position, score, standardScore }: { position: number; score: number; standardScore: number }) {
  const isScore = position === score;
  const isStandard = position === standardScore;
  const bg = isStandard ? "bg-[#d6e6ff]" : "bg-white";
  return (
    <div className={`${bg} content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]`} data-name="Box">
      <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      {isScore && (
        <div className="overflow-clip relative shrink-0 size-[18px]" data-name="check">
          <div className="absolute inset-[29.17%_16.67%_29.17%_20.83%]" data-name="Vector">
            <div className="absolute inset-[-10%_-6.67%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.75 9">
                <path d="M0.75 4.5L4.5 8.25L12 0.75" id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Potency Card Component
function PotencyCard({ title, score, standardScore }: { title: string; score: number; standardScore: number }) {
  return (
    <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
            <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
              {/* Sama seperti CompetencyCard: lebar nama aspek ikut sisa ruang. */}
              <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative flex-1 min-w-0 pr-[8px] text-[#495057] text-[12px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[normal] whitespace-pre-wrap">{title}</p>
              </div>
              {/* info-circle dekoratif — Potency tidak punya breakdown Key Behaviour */}
              <div
                className="overflow-clip relative shrink-0 size-[16px]"
                data-name="info-circle"
              >
                <div className="absolute inset-[12.5%]" data-name="Vector">
                  <div className="absolute inset-[-6.25%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
                      <path d={svgPathsPotency.p11080840} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
              <div className="content-stretch flex flex-[1_0_0] gap-[2px] items-start min-h-px min-w-px relative" data-name="Score">
                {[1, 2, 3, 4, 5].map((index) => (
                  <PotencyScoreBox key={index} position={index} score={score} standardScore={standardScore} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Potency Score Box Component - dengan circle indicator di posisi tertentu
function PotencyScoreBox({ position, score, standardScore }: { position: number; score: number; standardScore: number }) {
  const isCirclePosition = position === score;
  const isStandardBox = position === standardScore; // Kotak biru di posisi standardScore
  
  if (isCirclePosition) {
    // Box dengan circle
    return (
      <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px relative rounded-[4px]" data-name="Box">
        <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
        <div className="overflow-clip relative shrink-0 size-[18px]" data-name="circle">
          <div className="absolute inset-[12.5%]" data-name="Vector">
            <div className="absolute inset-[-5.56%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                <path d={svgPathsPotency.p244b3080} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isStandardBox) {
    // Box dengan background biru (di posisi standardScore)
    return (
      <div className="bg-[#d6e6ff] flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
        <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
    );
  } else {
    // Box kosong (posisi lainnya)
    return (
      <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Box">
        <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
      </div>
    );
  }
}

