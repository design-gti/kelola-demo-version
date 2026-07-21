"use client";
import { useState } from 'react';
import svgPaths from '../imports/svg-djevy8uiqd';
import svgPathsPotency from '../imports/svg-87qx2z9isd';

type TabType = 'competency' | 'potency';

interface ScoreAspectProps {
  Frame79: React.ComponentType;
  Frame153: React.ComponentType;
  Frame116: React.ComponentType;
  Frame24: React.ComponentType;
}

export function ScoreAspectWithTabs({ Frame79, Frame153, Frame116, Frame24 }: ScoreAspectProps) {
  const [activeTab, setActiveTab] = useState<TabType>('competency');

  return (
    <div className="bg-white content-stretch flex flex-col gap-[12px] items-center overflow-clip p-[16px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-[368px]" data-name="Score Aspect">
      <Frame79 />
      
      {/* Tabs */}
      <div className="content-stretch flex gap-[2px] items-center relative shrink-0 w-full">
        {/* Competency Tab */}
        <button
          onClick={() => setActiveTab('competency')}
          className="cursor-pointer flex-[1_0_0] min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px]"
          data-name="Tab button"
        >
          <div 
            aria-hidden="true" 
            className={`absolute border-b-2 border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px] ${
              activeTab === 'competency' ? 'border-[#016699]' : 'border-[#dee2e6]'
            }`} 
          />
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex gap-[2px] items-center justify-center px-[16px] py-[8px] relative w-full">
              <div className={`flex flex-col font-['Open_Sans',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center whitespace-nowrap ${
                activeTab === 'competency' ? 'text-[#016699]' : 'text-[#495057]'
              }`}>
                <p className="leading-[normal]">Competency</p>
              </div>
            </div>
          </div>
        </button>
        
        {/* Potency Tab */}
        <button
          onClick={() => setActiveTab('potency')}
          className="cursor-pointer flex-[1_0_0] min-h-px min-w-px relative rounded-tl-[4px] rounded-tr-[4px]"
          data-name="Tab button"
        >
          <div 
            aria-hidden="true" 
            className={`absolute border-b-2 border-solid inset-0 pointer-events-none rounded-tl-[4px] rounded-tr-[4px] ${
              activeTab === 'potency' ? 'border-[#016699]' : 'border-[#dee2e6]'
            }`} 
          />
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex gap-[2px] items-center justify-center px-[16px] py-[8px] relative w-full">
              <div className={`flex flex-col font-['Open_Sans',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center whitespace-nowrap ${
                activeTab === 'potency' ? 'text-[#016699]' : 'text-[#495057]'
              }`}>
                <p className="leading-[normal]">Potency</p>
              </div>
            </div>
          </div>
        </button>
      </div>

      {activeTab === 'competency' ? (
        <>
          <Frame153 />
          <Frame116 />
          <Frame24 />
        </>
      ) : (
        <>
          <PotencyControls />
          <PotencyFilter />
          <PotencyContent />
        </>
      )}
      
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
  );
}

// Potency Controls (Chart/List view buttons)
function PotencyControls() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <button className="bg-[#f8f9fa] block cursor-pointer overflow-clip relative rounded-[4px] shrink-0 size-[20px]" data-name="chart-radar">
        <div className="absolute inset-[12.5%_10.42%]" data-name="Vector">
          <div className="absolute inset-[-5%_-4.74%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.3334 16.5">
              <path d={svgPathsPotency.p4355100} id="Vector" stroke="var(--stroke-0, #CED4DA)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.854902" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </button>
      <div className="bg-[#e7f5ff] overflow-clip relative rounded-[4px] shrink-0 size-[20px]" data-name="list">
        <div className="absolute bottom-[24.96%] left-[20.83%] right-[16.67%] top-1/4" data-name="Vector">
          <div className="absolute inset-[-7.49%_-6%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 11.5083">
              <path d={svgPathsPotency.p24455faf} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Potency Filter (Score icon and dropdown)
function PotencyFilter() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
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
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative" data-name="TextInput">
        <div className="bg-[#f8f9fa] relative rounded-[16px] shrink-0 w-full" data-name="Input field">
          <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[16px]" />
          <div className="flex flex-row items-center size-full">
            <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[4px] relative w-full">
              <div className="bg-[#d6e6ff] relative rounded-[4px] shrink-0 size-[16px]" data-name="Box">
                <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[4px]" />
              </div>
              <div className="flex flex-[1_0_0] flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px overflow-hidden relative text-[#495057] text-[10px] text-ellipsis whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[normal] overflow-hidden">Stnd. [Marketing]</p>
              </div>
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="chevron-down">
                <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
                  <div className="absolute inset-[-18.75%_-9.38%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5 5.5">
                      <path d={svgPathsPotency.p14416700} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Potency Content Component
function PotencyContent() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full">
      {/* Category A */}
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
        <div className="flex flex-col font-['Open_Sans',sans-serif] font-bold justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-ellipsis w-full whitespace-nowrap">
          <p className="leading-[normal] overflow-hidden">Category A</p>
        </div>
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          <PotencyCard title="Logika Berpikir" score={4} standardScore={3} />
          <PotencyCard title="Kemampuan Numerikal" score={3} standardScore={4} />
          <PotencyCard title="Kemampuan verbal" score={4} standardScore={3} />
        </div>
      </div>

      {/* Uncategorized */}
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
        <div className="flex flex-col font-['Open_Sans',sans-serif] font-bold justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[#495057] text-[12px] text-ellipsis w-full whitespace-nowrap">
          <p className="leading-[normal] overflow-hidden">Uncategorized</p>
        </div>
        <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
          <PotencyCard title="Daya Analisa" score={3} standardScore={3} />
          <PotencyCard title="Fleksibilitas" score={4} standardScore={3} />
          <PotencyCard title="Leadership" score={4} standardScore={3} />
          <PotencyCard title="Keterampilan Interpersonal" score={4} standardScore={3} />
          <PotencyCard title="Kerjasama" score={4} standardScore={3} />
          <PotencyCard title="Kemampuan Perencanaan" score={4} standardScore={3} />
        </div>
      </div>
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
              <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[normal] whitespace-pre-wrap">{title}</p>
              </div>
              <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info-circle">
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

