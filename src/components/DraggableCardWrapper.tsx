"use client";
import { forwardRef } from "react";

interface Props {
  id: string;
  isDragging: boolean;
  showInsertLine: "before" | "after" | null;
  onHandleMouseDown: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

const DraggableCardWrapper = forwardRef<HTMLDivElement, Props>(function DraggableCardWrapper(
  { id, isDragging, showInsertLine, onHandleMouseDown, children },
  ref
) {
  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Insert line — before */}
      {showInsertLine === "before" && (
        <div style={{
          position: "absolute", top: -9, left: 0, right: 0,
          height: 2, background: "#016699", borderRadius: 2, zIndex: 10,
          boxShadow: "0 0 0 3px rgba(1,102,153,0.15)",
        }}>
          <div style={{
            position: "absolute", left: 0, top: "50%",
            transform: "translateY(-50%)",
            width: 8, height: 8, borderRadius: "50%",
            background: "#016699", marginLeft: -4,
          }} />
        </div>
      )}

      <div
        className="group"
        style={{
          opacity: isDragging ? 0 : 1,
          transition: "opacity 0.12s ease",
          userSelect: "none",
          position: "relative",
        }}
      >
        {children}
        {/* Drag handle — absolute di dalam padding kiri card (left 3–13px, title mulai x=16) */}
        <div
          onMouseDown={e => onHandleMouseDown(id, e)}
          style={{
            position: "absolute", left: 3, top: 14, zIndex: 20,
            opacity: 0, cursor: "grab",
            transition: "opacity 0.15s",
          }}
          className="group-hover:!opacity-100"
        >
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
            <circle cx="2.5" cy="2"  r="1.5" fill="#adb5bd"/>
            <circle cx="7.5" cy="2"  r="1.5" fill="#adb5bd"/>
            <circle cx="2.5" cy="7"  r="1.5" fill="#adb5bd"/>
            <circle cx="7.5" cy="7"  r="1.5" fill="#adb5bd"/>
            <circle cx="2.5" cy="12" r="1.5" fill="#adb5bd"/>
            <circle cx="7.5" cy="12" r="1.5" fill="#adb5bd"/>
          </svg>
        </div>
      </div>

      {/* Insert line — after (end of column) */}
      {showInsertLine === "after" && (
        <div style={{
          position: "absolute", bottom: -9, left: 0, right: 0,
          height: 2, background: "#016699", borderRadius: 2, zIndex: 10,
          boxShadow: "0 0 0 3px rgba(1,102,153,0.15)",
        }}>
          <div style={{
            position: "absolute", left: 0, top: "50%",
            transform: "translateY(-50%)",
            width: 8, height: 8, borderRadius: "50%",
            background: "#016699", marginLeft: -4,
          }} />
        </div>
      )}
    </div>
  );
});

export default DraggableCardWrapper;
