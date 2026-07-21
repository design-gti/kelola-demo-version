"use client";
import { useState } from 'react';
import svgPaths from '../imports/svg-djevy8uiqd';
import svgPathsSuccessors from '../imports/svg-c6yt3d5wws';
const imgPortraitSuccessfulBusinessWomanUsingDigitalTabletFrontModernOffice2 = "/iprofile-assets/7d155afcea4f2b1e6b32eb88a344313d97b8f6a2.png";
const imgFreepikTheStyleIsCandidImagePhotographyWithNatural52479 = "/iprofile-assets/6f02d082c705f4920de8542ceb25e13d8dac0d49.png";

interface SuccessorsAccordionProps {
  name?: string;
  position?: string;
  percentage?: string;
  status?: string;
  photoType?: 'woman' | 'man';
}

export function SuccessorsAccordion({
  name = "Shani Indira",
  position = "Product Designer",
  percentage = "92%",
  status = "Ready",
  photoType = 'woman'
}: SuccessorsAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderPhoto = () => {
    if (photoType === 'man') {
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

    return (
      <div className="bg-white overflow-clip relative rounded-[15px] shadow-[1px_1px_8px_0px_rgba(0,0,0,0.2)] shrink-0 size-[30px]">
        <div className="absolute left-px size-[31px] top-0" data-name="portrait-successful-business-woman-using-digital-tablet-front-modern-office 2">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[239.1%] left-[-51.94%] max-w-none top-[-24.12%] w-[159.36%]" src={imgPortraitSuccessfulBusinessWomanUsingDigitalTabletFrontModernOffice2} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f8f9fa] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px]">
      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col size-full">
        {/* Header - Always visible */}
        <div className="flex flex-row items-center w-full">
          <div className={`content-stretch flex gap-[8px] items-center p-[8px] relative w-full ${isExpanded ? 'rounded-t-[8px]' : ''}`}>
            {/* Photo */}
            {renderPhoto()}

            {/* Name and Position */}
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[0] min-h-px min-w-px relative">
              <div className="flex flex-col font-['Open_Sans',sans-serif] font-bold justify-center not-italic relative shrink-0 text-[#016699] text-[12px] w-full">
                <p className="leading-[normal] whitespace-pre-wrap">{name}</p>
              </div>
              <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#495057] text-[10px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[normal] whitespace-pre-wrap">{position}</p>
              </div>
            </div>

            {/* Percentage */}
            <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
              {percentage}
            </p>

            {/* Status Chip */}
            <div className="content-stretch flex items-center relative shrink-0 w-[68px]" data-name="Chip - DISC">
              <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
                <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {status}
                </p>
              </div>
            </div>

            {/* Chevron Button */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="content-stretch cursor-pointer flex items-center relative shrink-0"
            >
              <div className="overflow-clip relative shrink-0 size-[20px]" data-name={isExpanded ? "chevron-up" : "chevron-down"}>
                <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Vector">
                  <div className="absolute inset-[-15%_-7.5%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 6.5" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}>
                      <path d={svgPaths.p3d2c9380} id="Vector" stroke="var(--stroke-0, #495057)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Expanded Content - From ComponentSuccessors.tsx */}
        {isExpanded && (
          <div className="content-stretch flex flex-col gap-[8px] items-start px-[8px] pb-[8px] relative w-full">
            {/* Competency GAP Label */}
            <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#adb5bd] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[normal] whitespace-pre-wrap">Competency GAP</p>
            </div>

            {/* Amanah Card */}
            <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
              <div className="flex flex-col justify-center size-full">
                <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
                  <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
                    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                      <div className="content-stretch flex items-center relative shrink-0">
                        <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal] whitespace-pre-wrap">Amanah</p>
                        </div>
                      </div>
                      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info-circle">
                        <div className="absolute inset-[12.5%]" data-name="Vector">
                          <div className="absolute inset-[-6.25%]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
                              <path d={svgPathsSuccessors.p11080840} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
                      <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px pr-px relative" data-name="Score">
                        <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-bl-[4px] rounded-tl-[4px]" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-bl-[4px] rounded-tl-[4px]" />
                        </div>
                        <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px mr-[-1px] relative" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none" />
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
                        <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px mr-[-1px] relative" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none" />
                        </div>
                        <div className="bg-[#d6e6ff] flex-[1_0_0] h-[24px] min-h-px min-w-px mr-[-1px] relative" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none" />
                        </div>
                        <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-br-[4px] rounded-tr-[4px]" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-br-[4px] rounded-tr-[4px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Focus Card */}
            <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
              <div className="flex flex-col justify-center size-full">
                <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
                  <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
                    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                      <div className="content-stretch flex items-center relative shrink-0">
                        <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal] whitespace-pre-wrap">Customer Focus</p>
                        </div>
                      </div>
                      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info-circle">
                        <div className="absolute inset-[12.5%]" data-name="Vector">
                          <div className="absolute inset-[-6.25%]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
                              <path d={svgPathsSuccessors.p11080840} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
                      <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px pr-px relative" data-name="Score">
                        <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-bl-[4px] rounded-tl-[4px]" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-bl-[4px] rounded-tl-[4px]" />
                        </div>
                        <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px mr-[-1px] relative" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none" />
                        </div>
                        <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px mr-[-1px] relative" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none" />
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
                        <div className="bg-[#d6e6ff] flex-[1_0_0] h-[24px] min-h-px min-w-px mr-[-1px] relative" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none" />
                        </div>
                        <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-br-[4px] rounded-tr-[4px]" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-br-[4px] rounded-tr-[4px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Continous Improvement Card */}
            <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
              <div className="flex flex-col justify-center size-full">
                <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
                  <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
                    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                      <div className="content-stretch flex items-center relative shrink-0">
                        <div className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                          <p className="leading-[normal] whitespace-pre-wrap">Continous Improvement</p>
                        </div>
                      </div>
                      <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info-circle">
                        <div className="absolute inset-[12.5%]" data-name="Vector">
                          <div className="absolute inset-[-6.25%]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
                              <path d={svgPathsSuccessors.p11080840} id="Vector" stroke="var(--stroke-0, #ADB5BD)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
                      <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px pr-px relative" data-name="Score">
                        <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-bl-[4px] rounded-tl-[4px]" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-bl-[4px] rounded-tl-[4px]" />
                        </div>
                        <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px mr-[-1px] relative" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none" />
                        </div>
                        <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px mr-[-1px] relative" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none" />
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
                        <div className="bg-[#d6e6ff] flex-[1_0_0] h-[24px] min-h-px min-w-px mr-[-1px] relative" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none" />
                        </div>
                        <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-br-[4px] rounded-tr-[4px]" data-name="Box">
                          <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-br-[4px] rounded-tr-[4px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="content-stretch flex gap-[8px] h-[35px] items-start relative shrink-0 w-full">
              <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[28px]" data-name="button">
                <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative w-full">
                    <p className="font-['Open_Sans',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px]">Create IDP</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#016699] flex-[1_0_0] min-h-px min-w-px relative rounded-[28px]" data-name="button">
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[8px] relative w-full">
                    <p className="font-['Open_Sans',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-white">See IDP Progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

