import { useState } from "react";
import { ArrowLeft, Eye, Edit, Calendar, Plus, Sparkles, Trash } from "lucide-react";
import { Employee } from "../data/orgChartData";
import { generateDevelopmentData } from "../data/developmentData";

interface IDPCreationProps {
  employee: Employee;
  onBack: () => void;
}

interface SuccessMeasure {
  id: string;
  text: string;
  selected: boolean;
  isManual?: boolean;
}

interface Program {
  id: string;
  description: string;
  type: string;
  selected: boolean;
  isManual?: boolean;
}

interface AspectData {
  id: string;
  name: string;
  successMeasures: SuccessMeasure[];
  programs: Program[];
}

export default function IDPCreation({ employee, onBack }: IDPCreationProps) {
  const [picName, setPicName] = useState("");
  const [picEmail, setPicEmail] = useState("");
  const [idpPeriod, setIdpPeriod] = useState("05 April 2025 - 06 juli 2025 (3 Bulan)");
  const [notes, setNotes] = useState("");

  // Get IDP data from employee or generate
  const { competencyDetails, idpRecommendations } = employee.competencyDetails && employee.idpRecommendations
    ? { competencyDetails: employee.competencyDetails, idpRecommendations: employee.idpRecommendations }
    : generateDevelopmentData(employee.id, employee.readinessScore || employee.competencyScore);

  // Filter aspects that need development
  const aspectsNeedDevelop = competencyDetails.filter(comp => comp.score < 3);

  // Initialize aspects data from IDP recommendations
  const [aspects, setAspects] = useState<AspectData[]>(() => 
    aspectsNeedDevelop.map((comp, idx) => {
      const rec = idpRecommendations[idx] || idpRecommendations[0];
      return {
        id: `aspect-${idx}`,
        name: comp.name,
        successMeasures: rec.successMeasures.map((sm, smIdx) => ({
          id: `sm-${idx}-${smIdx}`,
          text: sm,
          selected: true
        })),
        programs: rec.programs.map((prog, pIdx) => ({
          id: `prog-${idx}-${pIdx}`,
          description: prog.description,
          type: prog.type,
          selected: true
        }))
      };
    })
  );

  const toggleSuccessMeasure = (aspectId: string, measureId: string) => {
    setAspects(prev => prev.map(aspect => {
      if (aspect.id === aspectId) {
        return {
          ...aspect,
          successMeasures: aspect.successMeasures.map(sm =>
            sm.id === measureId ? { ...sm, selected: !sm.selected } : sm
          )
        };
      }
      return aspect;
    }));
  };

  const toggleProgram = (aspectId: string, programId: string) => {
    setAspects(prev => prev.map(aspect => {
      if (aspect.id === aspectId) {
        return {
          ...aspect,
          programs: aspect.programs.map(prog =>
            prog.id === programId ? { ...prog, selected: !prog.selected } : prog
          )
        };
      }
      return aspect;
    }));
  };

  const addSuccessMeasure = (aspectId: string) => {
    setAspects(prev => prev.map(aspect => {
      if (aspect.id === aspectId) {
        const newMeasure: SuccessMeasure = {
          id: `sm-${aspectId}-${Date.now()}`,
          text: "",
          selected: true,
          isManual: true
        };
        return {
          ...aspect,
          successMeasures: [...aspect.successMeasures, newMeasure]
        };
      }
      return aspect;
    }));
  };

  const addProgram = (aspectId: string) => {
    setAspects(prev => prev.map(aspect => {
      if (aspect.id === aspectId) {
        const newProgram: Program = {
          id: `prog-${aspectId}-${Date.now()}`,
          description: "",
          type: "Training",
          selected: true,
          isManual: true
        };
        return {
          ...aspect,
          programs: [...aspect.programs, newProgram]
        };
      }
      return aspect;
    }));
  };

  const deleteSuccessMeasure = (aspectId: string, measureId: string) => {
    setAspects(prev => prev.map(aspect => {
      if (aspect.id === aspectId) {
        return {
          ...aspect,
          successMeasures: aspect.successMeasures.filter(sm => sm.id !== measureId)
        };
      }
      return aspect;
    }));
  };

  const deleteProgram = (aspectId: string, programId: string) => {
    setAspects(prev => prev.map(aspect => {
      if (aspect.id === aspectId) {
        return {
          ...aspect,
          programs: aspect.programs.filter(prog => prog.id !== programId)
        };
      }
      return aspect;
    }));
  };

  const updateSuccessMeasureText = (aspectId: string, measureId: string, text: string) => {
    setAspects(prev => prev.map(aspect => {
      if (aspect.id === aspectId) {
        return {
          ...aspect,
          successMeasures: aspect.successMeasures.map(sm =>
            sm.id === measureId ? { ...sm, text } : sm
          )
        };
      }
      return aspect;
    }));
  };

  const updateProgramDescription = (aspectId: string, programId: string, description: string) => {
    setAspects(prev => prev.map(aspect => {
      if (aspect.id === aspectId) {
        return {
          ...aspect,
          programs: aspect.programs.map(prog =>
            prog.id === programId ? { ...prog, description } : prog
          )
        };
      }
      return aspect;
    }));
  };

  const updateProgramType = (aspectId: string, programId: string, type: string) => {
    setAspects(prev => prev.map(aspect => {
      if (aspect.id === aspectId) {
        return {
          ...aspect,
          programs: aspect.programs.map(prog =>
            prog.id === programId ? { ...prog, type } : prog
          )
        };
      }
      return aspect;
    }));
  };

  const handleSubmit = () => {
    console.log("Submitting IDP:", {
      employee: employee.name,
      picName,
      picEmail,
      idpPeriod,
      notes,
      aspects
    });
    // Here you would save the IDP data
    alert("IDP submitted successfully!");
  };

  return (
    <div className="size-full bg-[rgb(255,255,255)] overflow-auto">
      <div className="max-w-[900px] mx-auto p-[24px]">
        <div className="content-stretch flex flex-col gap-[16px] items-start relative w-full">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="content-stretch flex gap-[4px] items-center relative shrink-0 hover:opacity-70 transition-opacity cursor-pointer"
          >
            <div className="overflow-clip relative shrink-0 size-[20px]">
              <ArrowLeft className="size-full text-[#495057]" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col font-['Open_Sans',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#495057] text-[12px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[normal] whitespace-pre">Back</p>
            </div>
          </button>

          {/* Employee Info Card */}
          <div className="bg-white h-[92px] relative rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)] shrink-0 w-full">
            <div className="size-full">
              <div className="box-border content-stretch flex flex-row gap-[16px] h-[92px] items-center p-[16px] relative w-full">
                {/* Employee Photo */}
                <div className="relative shrink-0 size-[60px] rounded-full overflow-hidden bg-[#d6e6ff]">
                  {employee.imageUrl && (
                    <img 
                      src={employee.imageUrl} 
                      alt={employee.name}
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                </div>
                
                {/* Employee Info */}
                <div className="flex flex-col gap-[8px] flex-1 justify-center">
                  <div className="flex flex-col font-['Avenir',_sans-serif] justify-center leading-[0] not-italic relative text-[#495057] text-[20px]">
                    <p className="leading-[normal] font-black">{employee.name}</p>
                  </div>
                  <div className="flex flex-col font-['Avenir',_sans-serif] justify-center leading-[0] not-italic relative text-[#495057] text-[12px]">
                    <p className="leading-[normal] font-black">{employee.position}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create IDP Title */}
          <div className="flex flex-col font-['Avenir',_sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#495057] text-[14px] w-full">
            <p className="leading-[normal] font-black">Create IDP</p>
          </div>

          {/* Form Fields */}
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full bg-white p-[16px] rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)]">
            {/* PIC Name and Email */}
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
              <div className="basis-0 content-stretch flex flex-col gap-[4px] grow h-[52px] items-start min-h-px min-w-px relative shrink-0">
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                  <p className="font-['Avenir',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre font-black">PIC</p>
                </div>
                <div className="bg-white relative rounded-[16px] shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[16px]" />
                  <input
                    type="text"
                    value={picName}
                    onChange={(e) => setPicName(e.target.value)}
                    placeholder="PIC Name"
                    className="box-border w-full px-[12px] py-[8px] font-['Open_Sans',_sans-serif] font-normal text-[12px] text-[#495057] bg-transparent border-none outline-none rounded-[16px]"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  />
                </div>
              </div>
              <div className="basis-0 content-stretch flex flex-col gap-[4px] grow h-[52px] items-start justify-end min-h-px min-w-px relative shrink-0">
                <div className="bg-white relative rounded-[16px] shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[16px]" />
                  <input
                    type="email"
                    value={picEmail}
                    onChange={(e) => setPicEmail(e.target.value)}
                    placeholder="PIC Email"
                    className="box-border w-full px-[12px] py-[8px] font-['Open_Sans',_sans-serif] font-normal text-[12px] text-[#495057] bg-transparent border-none outline-none rounded-[16px]"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  />
                </div>
              </div>
            </div>

            {/* Periode IDP */}
            <div className="content-stretch flex flex-col gap-[4px] h-[52px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                <p className="font-['Avenir',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap whitespace-pre font-black">Periode IDP</p>
              </div>
              <div className="bg-white relative rounded-[16px] shrink-0 w-full">
                <div aria-hidden="true" className="absolute border border-[#adb5bd] border-solid inset-0 pointer-events-none rounded-[16px]" />
                <div className="flex flex-row items-center size-full">
                  <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
                    <input
                      type="text"
                      value={idpPeriod}
                      onChange={(e) => setIdpPeriod(e.target.value)}
                      className="basis-0 flex flex-col font-['Open_Sans',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px] bg-transparent border-none outline-none"
                      style={{ fontVariationSettings: "'wdth' 100" }}
                    />
                    <Calendar className="size-[16px] text-[#495057]" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                <p className="font-['Avenir',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#495057] text-[12px] text-nowrap font-black">
                  Notes <span className="text-[#adb5bd] font-black">(optional)</span>
                </p>
              </div>
              <div className="bg-white h-[52px] relative rounded-[8px] shrink-0 w-full">
                <div aria-hidden="true" className="absolute border border-[rgba(206,212,218,0.85)] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes..."
                  className="box-border w-full h-full px-[12px] py-[8px] font-['Open_Sans',_sans-serif] font-normal text-[12px] text-[#495057] bg-transparent border-none outline-none resize-none rounded-[8px]"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                />
              </div>
            </div>
          </div>

          {/* Aspects */}
          {aspects.map((aspect, aspectIdx) => (
            <div key={aspect.id} className="bg-[#f8f9fa] relative rounded-[8px] shrink-0 w-full">
              <div className="size-full">
                <div className="box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full bg-[rgb(255,255,255)] rounded-[8px] shadow-[2px_2px_15px_0px_rgba(0,0,0,0.1)]">
                  {/* Aspect Name Badge */}
                  <div className="content-stretch flex items-start relative shrink-0">
                    <div className="bg-[#e7f5ff] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0">
                      <p className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#016699] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {aspect.name}
                      </p>
                    </div>
                  </div>

                  {/* Success Measures Table */}
                  <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shrink-0 w-full">
                    <div className="content-stretch flex gap-px items-center overflow-clip relative shrink-0 w-full">
                      {/* Checkbox Column */}
                      <div className="content-stretch flex flex-col items-start relative shrink-0">
                        <div className="bg-white relative shrink-0 w-full">
                          <div aria-hidden="true" className="absolute border-[#dee2e6] border-[0px_0px_1px] border-solid bottom-[-0.5px] left-0 pointer-events-none right-0 top-0" />
                          <div className="flex flex-row items-center justify-center size-full">
                            <div className="box-border content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[8px] relative w-full">
                              <p className="basis-0 font-['Avenir',_sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[14px] font-black">&nbsp;</p>
                            </div>
                          </div>
                        </div>
                        {aspect.successMeasures.map((measure) => (
                          <div key={measure.id} className="bg-white h-[48px] relative shrink-0 w-full">
                            <div aria-hidden="true" className="absolute border-[#dee2e6] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
                            <div className="flex flex-row items-center justify-center size-full">
                              <div className="box-border content-stretch flex gap-[12px] h-[48px] items-center justify-center px-[12px] py-[8px] relative w-full">
                                <button 
                                  onClick={() => toggleSuccessMeasure(aspect.id, measure.id)}
                                  className="box-border content-stretch cursor-pointer flex gap-[12px] items-center overflow-visible p-0 relative shrink-0"
                                >
                                  <div className={`content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[16px] ${measure.selected ? 'bg-[#016699]' : 'bg-white border border-[#dee2e6]'}`}>
                                    {measure.selected && (
                                      <svg className="size-[12px]" fill="none" viewBox="0 0 12 8">
                                        <path d="M11.1381 0.195262C11.3984 0.455612 11.3984 0.877722 11.1381 1.13807L4.4714 7.80474C4.21105 8.06509 3.78894 8.06509 3.5286 7.80474L0.195262 4.4714C-0.0650874 4.21106 -0.0650874 3.78895 0.195262 3.5286C0.455612 3.26825 0.877722 3.26825 1.13807 3.5286L4 6.39052L10.1953 0.195262C10.4556 -0.0650874 10.8777 -0.0650874 11.1381 0.195262Z" fill="white" />
                                      </svg>
                                    )}
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Success Measures Content */}
                      <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="bg-white relative shrink-0 w-full">
                          <div aria-hidden="true" className="absolute border-[#dee2e6] border-[0px_0px_1px] border-solid bottom-[-0.5px] left-0 pointer-events-none right-0 top-0" />
                          <div className="flex flex-row items-center justify-center size-full">
                            <div className="box-border content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[8px] relative w-full">
                              <p className="basis-0 font-['Avenir',_sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[14px] font-black">Success Measures</p>
                            </div>
                          </div>
                        </div>
                        {aspect.successMeasures.map((measure, idx) => (
                          <div key={measure.id} className="bg-white h-[48px] relative shrink-0 w-full">
                            <div aria-hidden="true" className={`absolute border-[#dee2e6] ${idx === aspect.successMeasures.length - 1 ? '' : 'border-[1px_0px_0px]'} border-solid inset-0 pointer-events-none`} />
                            <div className="flex flex-row items-center size-full">
                              <div className="box-border content-stretch flex gap-[12px] h-[48px] items-center px-[12px] py-[8px] relative w-full">
                                <input
                                  type="text"
                                  value={measure.text}
                                  onChange={(e) => updateSuccessMeasureText(aspect.id, measure.id, e.target.value)}
                                  placeholder="Enter success measure..."
                                  className="basis-0 font-['Open_Sans',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px] bg-transparent border-none outline-none"
                                  style={{ fontVariationSettings: "'wdth' 100" }}
                                />
                                {measure.isManual ? (
                                  <button
                                    onClick={() => deleteSuccessMeasure(aspect.id, measure.id)}
                                    className="hover:text-red-500 transition-colors"
                                  >
                                    <Trash className="size-[16px] text-[#adb5bd]" strokeWidth={1.5} />
                                  </button>
                                ) : (
                                  <Sparkles className="size-[16px] text-[#adb5bd]" strokeWidth={1.5} />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Add Success Measure Button */}
                    <button 
                      onClick={() => addSuccessMeasure(aspect.id)}
                      className="relative shrink-0 w-full hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div aria-hidden="true" className="absolute border-[#dee2e6] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
                      <div className="flex flex-row items-center size-full">
                        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
                          <Plus className="size-[20px] text-[#016699]" strokeWidth={1.5} />
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Programs Table */}
                  <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[8px] shrink-0 w-full">
                    <div className="content-stretch flex gap-px items-center overflow-clip relative shrink-0 w-full">
                      {/* Checkbox Column */}
                      <div className="content-stretch flex flex-col items-start relative shrink-0">
                        <div className="bg-white relative shrink-0 w-full">
                          <div aria-hidden="true" className="absolute border-[#dee2e6] border-[0px_0px_1px] border-solid bottom-[-0.5px] left-0 pointer-events-none right-0 top-0" />
                          <div className="flex flex-row items-center justify-center size-full">
                            <div className="box-border content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[8px] relative w-full">
                              <p className="basis-0 font-['Avenir',_sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[14px] font-black">&nbsp;</p>
                            </div>
                          </div>
                        </div>
                        {aspect.programs.map((program) => (
                          <div key={program.id} className="bg-white h-[48px] relative shrink-0 w-full">
                            <div aria-hidden="true" className="absolute border-[#dee2e6] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
                            <div className="flex flex-row items-center justify-center size-full">
                              <div className="box-border content-stretch flex gap-[12px] h-[48px] items-center justify-center px-[12px] py-[8px] relative w-full">
                                <button 
                                  onClick={() => toggleProgram(aspect.id, program.id)}
                                  className="box-border content-stretch cursor-pointer flex gap-[12px] items-center overflow-visible p-0 relative shrink-0"
                                >
                                  <div className={`content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[16px] ${program.selected ? 'bg-[#016699]' : 'bg-white border border-[#dee2e6]'}`}>
                                    {program.selected && (
                                      <svg className="size-[12px]" fill="none" viewBox="0 0 12 8">
                                        <path d="M11.1381 0.195262C11.3984 0.455612 11.3984 0.877722 11.1381 1.13807L4.4714 7.80474C4.21105 8.06509 3.78894 8.06509 3.5286 7.80474L0.195262 4.4714C-0.0650874 4.21106 -0.0650874 3.78895 0.195262 3.5286C0.455612 3.26825 0.877722 3.26825 1.13807 3.5286L4 6.39052L10.1953 0.195262C10.4556 -0.0650874 10.8777 -0.0650874 11.1381 0.195262Z" fill="white" />
                                      </svg>
                                    )}
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Program Description */}
                      <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="bg-white relative shrink-0 w-full">
                          <div aria-hidden="true" className="absolute border-[#dee2e6] border-[0px_0px_1px] border-solid bottom-[-0.5px] left-0 pointer-events-none right-0 top-0" />
                          <div className="flex flex-row items-center justify-center size-full">
                            <div className="box-border content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[8px] relative w-full">
                              <p className="basis-0 font-['Avenir',_sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[14px] font-black">Program</p>
                            </div>
                          </div>
                        </div>
                        {aspect.programs.map((program, idx) => (
                          <div key={program.id} className="bg-white h-[48px] relative shrink-0 w-full">
                            <div aria-hidden="true" className="absolute border-[#dee2e6] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
                            <div className="flex flex-row items-center size-full">
                              <div className="box-border content-stretch flex gap-[12px] h-[48px] items-center px-[12px] py-[8px] relative w-full">
                                <input
                                  type="text"
                                  value={program.description}
                                  onChange={(e) => updateProgramDescription(aspect.id, program.id, e.target.value)}
                                  placeholder="Enter program description..."
                                  className="basis-0 font-['Open_Sans',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#495057] text-[12px] bg-transparent border-none outline-none"
                                  style={{ fontVariationSettings: "'wdth' 100" }}
                                />
                                {program.isManual ? (
                                  <button
                                    onClick={() => deleteProgram(aspect.id, program.id)}
                                    className="hover:text-red-500 transition-colors"
                                  >
                                    <Trash className="size-[16px] text-[#adb5bd]" strokeWidth={1.5} />
                                  </button>
                                ) : (
                                  <Sparkles className="size-[16px] text-[#adb5bd]" strokeWidth={1.5} />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* IDP Program Type */}
                      <div className="content-stretch flex flex-col items-start relative shrink-0 w-[174px]">
                        <div className="bg-white relative shrink-0 w-full">
                          <div aria-hidden="true" className="absolute border-[#dee2e6] border-[0px_0px_1px] border-solid bottom-[-0.5px] left-0 pointer-events-none right-0 top-0" />
                          <div className="flex flex-row items-center justify-center size-full">
                            <div className="box-border content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[8px] relative w-full">
                              <p className="basis-0 font-['Avenir',_sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#495057] text-[14px] font-black">IDP Program</p>
                            </div>
                          </div>
                        </div>
                        {aspect.programs.map((program) => (
                          <div key={program.id} className="bg-white h-[48px] relative shrink-0 w-full">
                            <div aria-hidden="true" className="absolute border-[#dee2e6] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
                            <div className="flex flex-row items-center size-full">
                              <div className="box-border content-stretch flex gap-[12px] h-[48px] items-center px-[12px] py-[8px] relative w-full">
                                <div className="content-stretch flex items-center justify-center relative shrink-0">
                                  {program.isManual ? (
                                    <div className="bg-[#f8f9fa] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0">
                                      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[800px]" />
                                      <select
                                        value={program.type}
                                        onChange={(e) => updateProgramType(aspect.id, program.id, e.target.value)}
                                        className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] uppercase bg-transparent border-none outline-none cursor-pointer pr-[4px]"
                                        style={{ fontVariationSettings: "'wdth' 100" }}
                                      >
                                        <option value="Training">TRAINING</option>
                                        <option value="Coaching">COACHING</option>
                                        <option value="Job Assignment">JOB ASSIGNMENT</option>
                                      </select>
                                    </div>
                                  ) : (
                                    <div className="bg-[#f8f9fa] box-border content-stretch flex gap-[4px] items-center justify-center px-[8px] py-[2px] relative rounded-[800px] shrink-0">
                                      <div aria-hidden="true" className="absolute border border-[#dee2e6] border-solid inset-0 pointer-events-none rounded-[800px]" />
                                      <p className="font-['Open_Sans',_sans-serif] font-bold leading-[normal] relative shrink-0 text-[#495057] text-[10px] text-nowrap uppercase whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
                                        {program.type}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Add Program Button */}
                    <button 
                      onClick={() => addProgram(aspect.id)}
                      className="cursor-pointer relative shrink-0 w-full hover:bg-gray-50 transition-colors"
                    >
                      <div aria-hidden="true" className="absolute border-[#dee2e6] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
                      <div className="flex flex-row items-center size-full">
                        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
                          <Plus className="size-[20px] text-[#016699]" strokeWidth={1.5} />
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-full">
            <button 
              onClick={onBack}
              className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[28px] shrink-0 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div aria-hidden="true" className="absolute border border-[#016699] border-solid inset-0 pointer-events-none rounded-[28px]" />
              <p className="font-['Avenir',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#016699] text-[14px] text-nowrap whitespace-pre font-black">Cancel</p>
            </button>
            <button 
              onClick={handleSubmit}
              className="bg-[#016699] box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative rounded-[28px] shrink-0 hover:bg-[#015580] transition-colors cursor-pointer"
            >
              <p className="font-['Avenir',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre font-black">Submit IDP</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

