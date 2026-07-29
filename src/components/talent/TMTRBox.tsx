"use client";
// Self-contained port of kelola-app Components/Organisme/Chart/TMTRBox — 9-box grid
// with axis ranges and plotted employee bubbles (grouped + overlap-resolved).
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TMConfig, TMPoint, boxByOrder, resolveColor } from "@/data/talentMappingData";
import { mantineColor } from "@/components/team/mantineColor";

const FONT = "'Open Sans', sans-serif";
const NODE_BG = mantineColor.neutral[7]; // #495057

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
}
function darker(token: string) {
  return mantineColor[token.split(".")[0]]?.[6] ?? "#495057";
}

const SIZE_AVATAR = 20;
const MAX_GROUP = 56;

function groupCircleSize(count: number) {
  return count <= 1 ? SIZE_AVATAR : Math.min(SIZE_AVATAR + Math.log2(count) * 5, MAX_GROUP);
}
function groupFontSize(count: number, circle: number) {
  if (count >= 100) return Math.min(10, circle * 0.35);
  if (count >= 10) return Math.min(12, circle * 0.4);
  return 14;
}
const dist = (x1: number, y1: number, x2: number, y2: number) => Math.hypot(x1 - x2, y1 - y2);

function groupPoints(data: TMPoint[], threshold: number, outbox: number) {
  const groups: TMPoint[][] = [];
  const outside: TMPoint[] = [];
  data.forEach(p => {
    const px = p.x ?? outbox, py = p.y ?? outbox;
    if (px === outbox && py === outbox) { outside.push(p); return; }
    for (const g of groups) {
      if (g.some(o => dist(px, py, o.x ?? outbox, o.y ?? outbox) <= threshold)) { g.push(p); return; }
    }
    groups.push([p]);
  });
  if (outside.length) groups.push(outside);
  return groups;
}

function resolveOverlaps(groups: TMPoint[][], size: number, outbox: number) {
  type Info = { group: TMPoint[]; cx: number; cy: number; absorbed: boolean };
  const cxy = (g: TMPoint[]) => ({
    cx: g.reduce((s, p) => s + (p.x ?? outbox), 0) / g.length,
    cy: g.reduce((s, p) => s + (p.y ?? outbox), 0) / g.length,
  });
  const infos: Info[] = groups.filter(g => g.length > 1).map(g => ({ group: g, ...cxy(g), absorbed: false }));
  for (let i = 0; i < infos.length; i++) {
    if (infos[i].absorbed) continue;
    for (let j = i + 1; j < infos.length; j++) {
      if (infos[j].absorbed) continue;
      const a = infos[i], b = infos[j];
      const d = dist(a.cx, a.cy, b.cx, b.cy);
      const largerR = Math.max(groupCircleSize(a.group.length), groupCircleSize(b.group.length)) / size * 50;
      if (d < largerR) {
        if (a.group.length >= b.group.length) { a.group = [...a.group, ...b.group]; b.absorbed = true; }
        else { b.group = [...b.group, ...a.group]; a.absorbed = true; break; }
      }
    }
  }
  const singles = groups.filter(g => g.length === 1);
  return [...infos.filter(i => !i.absorbed).map(i => i.group), ...singles];
}

function AxisDividers({ ranges, selected }: { ranges: { label: string; color: string }[]; selected: boolean }) {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      {ranges.map((r, i) => (
        <div key={i} style={{ flex: 1, position: "relative", height: 3, background: selected ? "#dee2e6" : resolveColor(r.color) }}>
          <span style={{ position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 700, color: "#868e96", fontFamily: FONT, whiteSpace: "nowrap" }}>{r.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function TMTRBox({ config, points, size = 360, selectedBox, onBoxClick }: {
  config: TMConfig;
  points: TMPoint[];
  size?: number;
  selectedBox: number | null;
  onBoxClick: (order: number | null) => void;
}) {
  const outbox = size * -0.01;
  const threshold = (SIZE_AVATAR / size) * 100;
  const nodes = useMemo(() => resolveOverlaps(groupPoints(points, threshold, outbox), size, outbox), [points, threshold, size, outbox]);

  // Zoom-to-box (mirror kelola-app): clicking a box expands it to fill the chart,
  // re-plotting its members by their raw score within that band's [min,max].
  const zoom = useMemo(() => {
    if (selectedBox == null) return null;
    let ri = -1, ci = -1;
    config.ordering.forEach((row, r) => { const c = row.indexOf(selectedBox); if (c !== -1) { ri = r; ci = c; } });
    if (ri < 0) return null;
    const bandX = config.rangesX[ci];
    const bandY = config.rangesY[config.rangesY.length - 1 - ri];
    const box = boxByOrder(config, selectedBox);
    if (!box || !bandX || !bandY) return null;
    const frac = (v: number, b: { min: number; max: number }) => {
      const span = b.max - b.min;
      return span > 0 ? Math.min(1, Math.max(0, (v - b.min) / span)) : 0.5;
    };
    const members = points
      .filter(p => p.order === selectedBox && p.rawX != null && p.rawY != null)
      .map(p => ({ ...p, x: frac(p.rawX!, bandX) * 100, y: frac(p.rawY!, bandY) * 100 }));
    const zoomNodes = resolveOverlaps(groupPoints(members, threshold, outbox), size, outbox);
    return { box, bandX, bandY, nodes: zoomNodes };
  }, [selectedBox, config, points, threshold, size, outbox]);

  const activeNodes = zoom ? zoom.nodes : nodes;

  // Clicking a bubble opens a small table of the people at that coordinate.
  const [popover, setPopover] = useState<{ group: TMPoint[]; x: number; y: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  // Close the popover on any click outside of it (donut, table, filter, page, …).
  useEffect(() => {
    if (!popover) return;
    const onDown = (e: MouseEvent) => {
      if (!popoverRef.current?.contains(e.target as Node)) setPopover(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [popover]);

  return (
    <div style={{ position: "relative", width: size + 50, height: size + 50, fontFamily: FONT }}>
      {/* Y axis (label + ranges), rotated onto the left edge */}
      <div style={{ position: "absolute", top: 0, left: 0, width: size, transform: "rotate(270deg)", transformOrigin: `${size / 2}px ${size / 2}px` }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", textAlign: "center", color: "#495057", marginBottom: 2 }}>{config.sumbuY}</div>
        <AxisDividers
          ranges={zoom ? [{ label: `${zoom.bandY.min} - ${zoom.bandY.max}`, color: zoom.box.color }] : config.rangesY}
          selected={selectedBox != null}
        />
      </div>

      {/* Box grid */}
      <div style={{ position: "absolute", top: 0, right: 0, width: size, height: size, border: "1px solid #ADB5BD" }}>
        {zoom ? (
          /* Zoomed single box — click background to exit zoom */
          <div
            onClick={() => onBoxClick(null)}
            title="Klik untuk keluar dari zoom"
            style={{ width: size, height: size, position: "relative", cursor: "zoom-out", background: resolveColor(zoom.box.color) }}
          >
            <span style={{ position: "absolute", top: 6, left: 8, fontSize: 22, fontWeight: 700, color: darker(zoom.box.color), opacity: 0.4 }}>{zoom.box.order}</span>
            <span style={{ position: "absolute", top: 8, right: 10, fontSize: 12, fontWeight: 700, color: "#495057" }}>{zoom.box.label}</span>
          </div>
        ) : (
          <div style={{ width: size, height: size, display: "flex", flexDirection: "column" }}>
            {config.ordering.map((row, ri) => (
              <div key={ri} style={{ flex: 1, display: "flex" }}>
                {row.map(order => {
                  const box = boxByOrder(config, order)!;
                  return (
                    <div
                      key={order}
                      onClick={() => onBoxClick(order)}
                      style={{
                        flex: 1, position: "relative", cursor: "zoom-in",
                        border: "1px solid #ADB5BD", background: resolveColor(box.color),
                        transition: "opacity .2s",
                      }}
                    >
                      <span style={{ position: "absolute", top: 4, left: 4, fontSize: 15, fontWeight: 700, color: darker(box.color), opacity: 0.4 }}>{order}</span>
                      <span style={{ position: "absolute", top: "50%", left: "50%", maxWidth: "90%", transform: "translate(-50%,-50%)", textAlign: "center", fontSize: 11, color: "#495057" }}>{box.label}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Plotted bubbles (full grid, or zoomed box) */}
        {activeNodes.map((g, i) => {
          const gx = g.reduce((s, p) => s + (p.x ?? outbox), 0) / g.length;
          const gy = g.reduce((s, p) => s + (p.y ?? outbox), 0) / g.length;
          const x = gx < 0 ? outbox : gx, y = gy < 0 ? outbox : gy;
          const outside = x === outbox && y === outbox;
          if (g.length > 1) {
            const cs = outside ? SIZE_AVATAR : groupCircleSize(g.length);
            return (
              <div key={i} title={g.map(p => p.name).join(", ")}
                onClick={(e) => { e.stopPropagation(); setPopover({ group: g, x, y }); }}
                style={{ position: "absolute", bottom: `${y}%`, left: `${x}%`, transform: "translate(-50%,50%)", width: cs, height: cs, borderRadius: "50%", background: NODE_BG, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: outside ? 10 : groupFontSize(g.length, cs), fontWeight: 700, zIndex: outside ? 10 : 100, cursor: "pointer" }}>
                {g.length}
              </div>
            );
          }
          const p = g[0];
          return (
            <div key={i} title={p.name}
              onClick={(e) => { e.stopPropagation(); setPopover({ group: g, x: p.x ?? outbox, y: p.y ?? outbox }); }}
              style={{ position: "absolute", bottom: `${p.y ?? outbox}%`, left: `${p.x ?? outbox}%`, transform: "translate(-50%,50%)", width: SIZE_AVATAR, height: SIZE_AVATAR, borderRadius: "50%", background: NODE_BG, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, zIndex: 100, overflow: "hidden", cursor: "pointer" }}>
              <span>{initials(p.name)}</span>
              {p.employeeId && (
                <img
                  src={`/avatars/photo_wc2026/${p.employeeId}.png`}
                  alt=""
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                />
              )}
            </div>
          );
        })}

        {/* Coordinate detail table (click a bubble) */}
        {popover && (
          <>
            <div ref={popoverRef} onClick={(e) => e.stopPropagation()}
              style={{ position: "absolute", bottom: `${popover.y}%`, left: `${popover.x}%`, transform: "translate(10px, 50%)", zIndex: 300, background: "#fff", borderRadius: 8, boxShadow: "0 6px 20px rgba(0,0,0,0.18)", border: "1px solid #e9ecef", minWidth: 300, maxWidth: 400, overflow: "hidden", fontFamily: FONT }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 58px 58px", gap: 4, padding: "8px 10px", borderBottom: "1px solid #e9ecef", fontSize: 9.5, fontWeight: 700, color: "#adb5bd", textTransform: "uppercase" }}>
                <span>Employee</span><span style={{ textAlign: "right" }}>{config.sumbuX}</span><span style={{ textAlign: "right" }}>{config.sumbuY}</span>
              </div>
              <div style={{ maxHeight: 176, overflowY: "auto" }}>
                {popover.group.map((p) => (
                  <div key={p.employeeId} style={{ display: "grid", gridTemplateColumns: "1fr 58px 58px", gap: 4, alignItems: "center", padding: "6px 10px", fontSize: 11, color: "#495057" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: NODE_BG, color: "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, overflow: "hidden", position: "relative" }}>
                        <span>{initials(p.name)}</span>
                        {p.employeeId && <img src={`/avatars/photo_wc2026/${p.employeeId}.png`} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />}
                      </span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                    </span>
                    <span style={{ textAlign: "right" }}>{p.rawX ?? "-"}</span>
                    <span style={{ textAlign: "right" }}>{p.rawY ?? "-"}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* X axis (ranges + label) */}
      <div style={{ position: "absolute", bottom: 0, right: 0, width: size }}>
        <AxisDividers
          ranges={zoom ? [{ label: `${zoom.bandX.min} - ${zoom.bandX.max}`, color: zoom.box.color }] : config.rangesX}
          selected={selectedBox != null}
        />
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", textAlign: "center", color: "#495057", marginTop: 14 }}>{config.sumbuX}</div>
      </div>
    </div>
  );
}
