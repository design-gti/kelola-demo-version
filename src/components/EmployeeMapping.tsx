"use client";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import TextButton from "@/components/ui/TextButton";

const avOverlay = "https://www.figma.com/api/mcp/asset/2719dfbb-ac03-4588-a503-9dbbccb2baa9";

export interface CellData {
  count: number;
  label: string;
  countColor: string;
  bg: string;
  avatars: string[];
  names: string[];
}

function AvatarStack({ avatars, names, count }: { avatars: string[]; names: string[]; count: number }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const extra = count - avatars.length;

  return (
    <>
      <div
        ref={ref}
        className="flex items-center"
        onMouseEnter={() => {
          if (ref.current) {
            const r = ref.current.getBoundingClientRect();
            setPos({ x: r.left + r.width / 2, y: r.top });
          }
        }}
        onMouseLeave={() => setPos(null)}
      >
        {avatars.map((src, i) => (
          <div key={i} className="w-[22px] h-[22px] rounded-full overflow-hidden border-2 border-white flex-shrink-0 bg-[#e6f3f8]"
            style={{ marginRight: "-4px", zIndex: avatars.length - i }}>
            <img src={src} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>
        ))}
        {extra > 0 && (
          <div className="w-[22px] h-[22px] rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ backgroundImage: `url(${avOverlay})`, backgroundSize: "cover", zIndex: 0, marginLeft: "4px" }}>
            <span className="text-white text-[10px]" style={{ fontFamily: "'Open Sans', sans-serif" }}>+{extra}</span>
          </div>
        )}
      </div>

      {pos && typeof document !== "undefined" && createPortal(
        <div style={{
          position: "fixed",
          left: pos.x,
          top: pos.y - 8,
          transform: "translate(-50%, -100%)",
          background: "#1e293b",
          color: "#fff",
          borderRadius: 8,
          padding: "8px 12px",
          zIndex: 9999,
          pointerEvents: "none",
          minWidth: 140,
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          fontFamily: "'Open Sans', sans-serif",
          fontSize: 11,
          lineHeight: "1.6",
        }}>
          {names.map((name, i) => (
            <div key={i} style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#94a3b8", display: "inline-block", flexShrink: 0 }} />
              {name}
            </div>
          ))}
          {/* Arrow */}
          <div style={{
            position: "absolute", top: "100%", left: "50%",
            transform: "translateX(-50%)",
            border: "5px solid transparent",
            borderTopColor: "#1e293b",
            width: 0, height: 0,
          }} />
        </div>,
        document.body
      )}
    </>
  );
}

function GridCell({ cell, rowIdx, colIdx }: { cell: CellData; rowIdx: number; colIdx: number }) {
  const roundedMap: Record<string, string> = {
    "0-0": "rounded-tl-[8px]", "0-2": "rounded-tr-[8px]",
    "2-0": "rounded-bl-[8px]", "2-2": "rounded-br-[8px]",
  };
  return (
    <div className={`relative overflow-hidden ${roundedMap[`${rowIdx}-${colIdx}`] || ""}`} style={{ background: cell.bg }}>
      <span className="absolute top-[6px] left-[6px] text-[14px] leading-none"
        style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, color: cell.countColor }}>
        {cell.count}
      </span>
      <span className="absolute inset-0 flex items-center justify-center text-[#495057] text-[9px] text-center px-1 pt-2"
        style={{ fontFamily: "'Open Sans', sans-serif" }}>
        {cell.label}
      </span>
      <div className="absolute bottom-[6px] left-0 right-0 flex justify-center">
        <AvatarStack avatars={cell.avatars} names={cell.names} count={cell.count} />
      </div>
    </div>
  );
}

export default function EmployeeMapping({
  title = "Talent Mapping",
  cells: cellData,
  axisX = "Performance",
  axisY = "Potency",
}: {
  title?: string;
  /** Always computed server-side (src/lib/data/talentMapping.ts's getTalentMappingCells) — never candidates data directly in this client component. */
  cells: CellData[];
  axisX?: string;
  axisY?: string;
}) {
  const router = useRouter();
  return (
    <div className="bg-white rounded-[8px] p-[16px] flex flex-col gap-[16px] w-full h-full"
      style={{ boxShadow: "2px 4px 10px rgba(0,0,0,0.07)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[#495057] text-[12px]"
          style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700 }}>
          {title}
        </p>
        <TextButton onClick={() => router.push("/talent-mapping")}>See Detail</TextButton>
      </div>

      {/* Matrix */}
      <div className="flex-1 flex gap-[4px] min-h-[260px]">
        {/* Y-axis label */}
        <div className="flex items-center justify-center w-[18px] flex-shrink-0">
          <div className="text-[#58595b] text-[10px] whitespace-nowrap"
            style={{ fontFamily: "'Open Sans', sans-serif", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            {axisY}
          </div>
        </div>

        {/* Grid + X-axis */}
        <div className="flex flex-col flex-1 gap-[2px]">
          <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-[2px]">
            {cellData.map((cell, idx) => (
              <GridCell key={idx} cell={cell} rowIdx={Math.floor(idx / 3)} colIdx={idx % 3} />
            ))}
          </div>
          <div className="h-px bg-[#adb5bd] mt-[2px]" />
          <p className="text-[#58595b] text-[10px] text-center mt-[2px]" style={{ fontFamily: "'Open Sans', sans-serif" }}>
            {axisX}
          </p>
        </div>
      </div>
    </div>
  );
}
