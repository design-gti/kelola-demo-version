"use client";
import { useState } from "react";
import svgPaths from "../imports/svg-h3pz99mkta";
import svgPathsMain from "../imports/svg-djevy8uiqd";

interface CareerPlanAccordionProps {
  label: string;
  position: string;
  name: string;
  percentage: string;
  status: string;
  showAddedTag?: boolean;
  addedTagIcon?: "arrow-up-right" | "arrows-horizontal";
  showDeleteIcon?: boolean;
}

export function CareerPlanAccordion({
  label,
  position,
  name,
  percentage,
  status,
  showAddedTag = false,
  addedTagIcon = "arrow-up-right",
  showDeleteIcon = false,
}: CareerPlanAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="content-stretch flex flex-col gap-[4px] items-start relative w-full"
      data-name="Component Career plan"
    >
      {/* Header */}
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
          <div
            className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] whitespace-nowrap"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="leading-[normal]">{label}</p>
          </div>
          {showAddedTag && (
            <div className="content-stretch flex items-start relative shrink-0" data-name="Chip - DISC">
              <div className="bg-[#e7f5ff] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0" data-name="Chip">
                {addedTagIcon === "arrow-up-right" && (
                  <div className="overflow-clip relative shrink-0 size-[14px]" data-name="arrow-up-right">
                    <div className="absolute inset-[29.17%]" data-name="Vector">
                      <div className="absolute inset-[-12.86%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.33333 7.33333">
                          <path d={svgPathsMain.p52d7500} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                {addedTagIcon === "arrows-horizontal" && (
                  <div className="overflow-clip relative shrink-0 size-[14px]" data-name="arrows-horizontal">
                    <div className="absolute inset-[33.33%_12.5%]" data-name="Vector">
                      <div className="absolute inset-[-16.07%_-7.14%]">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 6.16667">
                          <path d={svgPathsMain.p53b7280} id="Vector" stroke="var(--stroke-0, #016699)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
                <p
                  className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#016699] text-[10px] uppercase"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  Added
                </p>
              </div>
            </div>
          )}
        </div>
        {showDeleteIcon && (
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="trash">
            <div className="absolute inset-[12.5%_16.67%]" data-name="Vector">
              <div className="absolute inset-[-6.25%_-7.03%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.1667 13.5">
                  <path d={svgPathsMain.p49e8c00} id="Vector" stroke="var(--stroke-0, #DE350B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Section */}
      <div className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
        <div
          aria-hidden="true"
          className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[8px]"
        />
        <div className="content-stretch flex flex-col gap-[8px] items-start p-[8px] relative w-full">
          {/* Main Row with chevron button */}
          <div className="content-stretch flex gap-[8px] h-[38px] items-center pb-[8px] relative rounded-[8px] shrink-0 w-full">
            {/* Position and Name */}
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center leading-[0] min-h-px min-w-px relative">
              <div className="flex flex-col font-['Open_Sans',sans-serif] font-bold justify-center not-italic relative shrink-0 text-[#495057] text-[12px] w-full">
                <p className="leading-[normal] whitespace-pre-wrap">{position}</p>
              </div>
              <div
                className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#016699] text-[10px] w-full"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                <p className="leading-[normal] whitespace-pre-wrap">{name}</p>
              </div>
            </div>

            {/* Percentage Chip */}
            <div
              className="content-stretch flex items-center justify-center relative shrink-0"
              data-name="Chip - DISC"
            >
              <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0">
                <p
                  className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {percentage}
                </p>
              </div>
            </div>

            {/* Status Chip */}
            <div
              className="content-stretch flex items-center relative shrink-0 w-[68px]"
              data-name="Chip - DISC"
            >
              <div className="bg-[#f8f9fa] content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0">
                <p
                  className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {status}
                </p>
              </div>
            </div>

            {/* Chevron Button */}
            <div className="content-stretch flex items-center relative shrink-0">
              <button
                className="block cursor-pointer overflow-clip relative shrink-0 size-[20px]"
                data-name="chevron-up"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div
                  className={`absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%] transition-transform ${
                    isExpanded ? "" : "rotate-180"
                  }`}
                  data-name="Vector"
                >
                  <div className="absolute inset-[-15%_-7.5%]">
                    <svg
                      className="block size-full"
                      fill="none"
                      preserveAspectRatio="none"
                      viewBox="0 0 11.5 6.5"
                    >
                      <path
                        d={svgPaths.p259324a0}
                        id="Vector"
                        stroke="var(--stroke-0, #58595B)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Expanded Content - Competency GAP */}
          {isExpanded && (
            <>
              <div
                className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#adb5bd] text-[10px] w-[142px]"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                <p className="leading-[normal] whitespace-pre-wrap">Competency GAP</p>
              </div>

              {/* Card Data - Amanah */}
              <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Card Data">
                <div className="flex flex-col justify-center size-full">
                  <div className="content-stretch flex flex-col items-start justify-center p-[8px] relative w-full">
                    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center relative shrink-0 w-full">
                      {/* Header with info icon */}
                      <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                        <div className="content-stretch flex items-center relative shrink-0">
                          <div
                            className="flex flex-col font-['Open_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[10px] w-[142px]"
                            style={{ fontVariationSettings: "'wdth' 100" }}
                          >
                            <p className="leading-[normal] whitespace-pre-wrap">Amanah</p>
                          </div>
                        </div>
                        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="info-circle">
                          <div className="absolute inset-[12.5%]" data-name="Vector">
                            <div className="absolute inset-[-6.25%]">
                              <svg
                                className="block size-full"
                                fill="none"
                                preserveAspectRatio="none"
                                viewBox="0 0 13.5 13.5"
                              >
                                <path
                                  d={svgPaths.p11080840}
                                  id="Vector"
                                  stroke="var(--stroke-0, #ADB5BD)"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.5"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Score Points */}
                      <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full" data-name="Points">
                        <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px pr-px relative" data-name="Score">
                          {/* Box 1 */}
                          <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-bl-[4px] rounded-tl-[4px]" data-name="Box">
                            <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-bl-[4px] rounded-tl-[4px]" />
                          </div>
                          {/* Box 2 with check */}
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
                          {/* Box 3 */}
                          <div className="bg-white content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-h-px min-w-px mr-[-1px] relative" data-name="Box">
                            <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none" />
                          </div>
                          {/* Box 4 - highlighted */}
                          <div className="bg-[#d6e6ff] flex-[1_0_0] h-[24px] min-h-px min-w-px mr-[-1px] relative" data-name="Box">
                            <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none" />
                          </div>
                          {/* Box 5 */}
                          <div className="bg-white flex-[1_0_0] h-[24px] min-h-px min-w-px mr-[-1px] relative rounded-br-[4px] rounded-tr-[4px]" data-name="Box">
                            <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-br-[4px] rounded-tr-[4px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
