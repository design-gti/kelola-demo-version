"use client";
// Self-contained port of kelola-app Components/Organisme/Chart/TMTRBox — 9-box grid
// with axis ranges and plotted employee bubbles (grouped + overlap-resolved).
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TMConfig, TMPoint, AxisRange, boxByOrder, resolveColor, defaultShade, textOn } from "@/data/talentMappingShared";
import { mantineColor } from "@/components/team/mantineColor";

const FONT = "'Open Sans', sans-serif";
const NODE_BG = mantineColor.neutral[7]; // #495057

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
}
function darker(token: string) {
  return mantineColor[token.split(".")[0]]?.[6] ?? "#495057";
}
/** Tulisan di atas warna box; putih kalau warnanya tua. */
const onBox = (color: string) => textOn(resolveColor(color));
/** Nomor box ikut keluarga warnanya selama masih terang, putih di atas gelap. */
const numberColor = (color: string) => (onBox(color) === "#fff" ? "#fff" : darker(color));

const SIZE_AVATAR = 20;

/** Tinggi blok sumbu (pita warna + label + keterangan) dan jaraknya ke grid. */
const AXIS_BLOCK = 50, AXIS_GAP = 16;

/**
 * Tebal pita cincin sumbu Z per tingkat, dalam px — bukan kelipatan tetap,
 * jadi jarak antar tingkat bisa disetel sendiri. Indeks ke-4 dipakai layout
 * 12-box yang sumbunya punya empat pita.
 *
 * Tidak ada cincin putih — baik di dalam maupun di luar. `box-shadow` dengan
 * spread menggambar CAKRAM penuh, bukan cincin: satu lapisan putih di luar
 * warna berarti cakram putih solid duduk di belakangnya, dan warna
 * transparan itu bercampur dengan putih alih-alih dengan bulatan di
 * belakangnya. Tanpa putih, transparansinya benar-benar terlihat.
 */
const Z_THICKNESS = [3, 5, 7, 9];
/** Cincin dibuat tembus supaya titik yang bertumpuk tetap terbaca. */
const Z_ALPHA = 0.35;

/** Hex → rgba, untuk menembuskan warna pita tanpa mengubah token aslinya. */
function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Cincin penanda sumbu Z: setebal apa, dan warnanya.
 *
 * Yang membedakan tingkat Z adalah tebal cincin, bukan ukuran avatarnya —
 * wajah orang tetap terbaca sama besar di seluruh grafik. Warnanya diambil
 * dari pita tempat nilainya jatuh, supaya cocok dengan penanda warna di
 * halaman setting.
 *
 * Hanya dipakai untuk bulatan berisi SATU orang. Bulatan tumpukan tidak
 * bercincin: rata-rata Z sekelompok orang bukan nilai milik siapa pun, dan
 * mewarnainya hijau sementara sebagian anggotanya merah adalah pernyataan yang
 * keliru. Sebaran Z tiap anggota dibaca di popover, bukan di bulatannya.
 */
function zRing(group: TMPoint[], bands: AxisRange[]): { thickness: number; color: string } | null {
  const vals = group.map(p => p.rawZ).filter((v): v is number => v != null);
  if (vals.length === 0 || bands.length === 0) return null;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  let bi = bands.findIndex(b => avg <= b.max);
  if (bi === -1) bi = bands.length - 1;
  return {
    thickness: Z_THICKNESS[Math.min(bi, Z_THICKNESS.length - 1)],
    color: defaultShade(bands[bi].color),
  };
}

/**
 * Bayangan rapat di tepi avatar, menandai lingkaran terdalam itu sendiri.
 * Ditaruh sebagai lapisan pertama supaya tergambar DI ATAS cincin warna —
 * kalau di bawah, cincin menutupinya dan bayangannya tak terlihat.
 */
const AVATAR_DROP = "0 1px 3px rgba(0,0,0,0.4)";

/**
 * Bayangan luar yang mengangkat seluruh bulatan dari warna kotak. `spread`
 * menyamakannya dengan tepi terluar cincin; tanpa itu bayangan tetap seukuran
 * avatar dan tertutup penuh oleh cincin di atasnya.
 */
const outerDrop = (spread = 0) => `0 2px 6px ${spread}px rgba(0,0,0,0.22)`;

/**
 * Garis putih tipis di tepi terluar bulatan.
 *
 * Dipakai `outline`, bukan lapisan box-shadow lagi: outline menggambar garis
 * saja, sedangkan box-shadow ber-spread menggambar cakram penuh yang akan
 * kembali menutup apa pun di belakang cincin dan mematikan transparansinya.
 * `outlineOffset` mendorongnya ke tepi luar pita warna.
 */
function zOutline(ring: { thickness: number; color: string } | null) {
  return { outline: "1.5px solid #fff", outlineOffset: `${ring?.thickness ?? 0}px` };
}

function zShadow(ring: { thickness: number; color: string } | null): string {
  if (!ring) return [AVATAR_DROP, outerDrop()].join(", ");
  const band = ring.thickness;
  return [
    AVATAR_DROP,
    `0 0 0 ${band}px ${withAlpha(ring.color, Z_ALPHA)}`,
    outerDrop(band),
  ].join(", ");
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
      // Semua bubble sekarang digambar seukuran foto, jadi jarak peleburan pun
      // memakai ukuran itu — bukan ukuran yang membesar mengikuti jumlah.
      const largerR = (SIZE_AVATAR / size) * 50;
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

export default function TMTRBox({ config, points, size = 360, selectedBox, onBoxClick, emptyNotice }: {
  config: TMConfig;
  points: TMPoint[];
  size?: number;
  selectedBox: number | null;
  onBoxClick: (order: number | null) => void;
  /**
   * Keterangan di tengah grid saat grafik sengaja kosong — bukan karena tidak
   * ada data, tapi karena masih menunggu pilihan user. Talent Readiness butuh
   * satu jabatan target sebelum ada yang bisa ditempatkan; tanpa keterangan di
   * sini, grid kosong terbaca sebagai "datanya tidak ada".
   */
  emptyNotice?: string;
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
  // Sumbu Z hanya berlaku kalau dinyalakan DAN metriknya sudah dipilih.
  const zActive = !!config.useZ && !!config.sumbuZKey;

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
    // Tinggi = grid + jarak ke sumbu + blok sumbu itu sendiri. Lebar tidak
    // ikut bertambah: jaraknya hanya perlu di bawah grid, bukan di sampingnya.
    <div style={{ position: "relative", width: size + AXIS_BLOCK, height: size + AXIS_GAP + AXIS_BLOCK, fontFamily: FONT }}>
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
            <span style={{ position: "absolute", top: 6, left: 8, fontSize: 22, fontWeight: 700, color: numberColor(zoom.box.color), opacity: 0.4 }}>{zoom.box.order}</span>
            <span style={{ position: "absolute", top: 8, right: 10, fontSize: 12, fontWeight: 700, color: onBox(zoom.box.color) }}>{zoom.box.label}</span>
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
                      <span style={{ position: "absolute", top: 4, left: 4, fontSize: 15, fontWeight: 700, color: numberColor(box.color), opacity: 0.4 }}>{order}</span>
                      <span style={{ position: "absolute", top: "50%", left: "50%", maxWidth: "90%", transform: "translate(-50%,-50%)", textAlign: "center", fontSize: 11, color: onBox(box.color) }}>{box.label}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {emptyNotice && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, pointerEvents: "none" }}>
            <span style={{ background: "rgba(255,255,255,0.94)", border: "1px solid #dee2e6", borderRadius: 10, padding: "10px 18px", fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#495057", textAlign: "center", maxWidth: "80%", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
              {emptyNotice}
            </span>
          </div>
        )}

        {/* Plotted bubbles (full grid, or zoomed box) */}
        {activeNodes.map((g, i) => {
          const gx = g.reduce((s, p) => s + (p.x ?? outbox), 0) / g.length;
          const gy = g.reduce((s, p) => s + (p.y ?? outbox), 0) / g.length;
          const x = gx < 0 ? outbox : gx, y = gy < 0 ? outbox : gy;
          const outside = x === outbox && y === outbox;
          if (g.length > 1) {
            // Bubble tumpukan seukuran foto biasa dan TANPA cincin Z. Ukuran dan
            // warna cincin adalah bacaan tentang SATU orang; pada tumpukan
            // keduanya jadi rata-rata yang tidak mewakili siapa pun — lingkaran
            // besar berpita hijau bisa berisi orang dengan skor Z terendah.
            // Angkanya sendiri sudah menyatakan "ada beberapa orang di sini";
            // rinciannya dibuka lewat popover.
            return (
              <div key={i} title={g.map(p => p.name).join(", ")}
                onClick={(e) => { e.stopPropagation(); setPopover({ group: g, x, y }); }}
                style={{ position: "absolute", bottom: `${y}%`, left: `${x}%`, transform: "translate(-50%,50%)", width: SIZE_AVATAR, height: SIZE_AVATAR, borderRadius: "50%", background: NODE_BG, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: groupFontSize(g.length, SIZE_AVATAR), fontWeight: 700, zIndex: outside ? 10 : 100, cursor: "pointer", boxShadow: zShadow(null), ...zOutline(null) }}>
                {g.length}
              </div>
            );
          }
          const p = g[0];
          const outsideOne = (p.x ?? outbox) === outbox && (p.y ?? outbox) === outbox;
          const ring = zActive && !outsideOne ? zRing(g, config.rangesZ ?? []) : null;
          return (
            <div key={i} title={p.name}
              onClick={(e) => { e.stopPropagation(); setPopover({ group: g, x: p.x ?? outbox, y: p.y ?? outbox }); }}
              style={{ position: "absolute", bottom: `${p.y ?? outbox}%`, left: `${p.x ?? outbox}%`, transform: "translate(-50%,50%)", width: SIZE_AVATAR, height: SIZE_AVATAR, borderRadius: "50%", background: NODE_BG, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, zIndex: 100, overflow: "hidden", cursor: "pointer", boxShadow: zShadow(ring), ...zOutline(ring) }}>
              <span>{initials(p.name)}</span>
              {p.employeeId && (
                <img
                  src={`/avatars/employee/${p.employeeId}.png`}
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
              <div style={{ display: "grid", gridTemplateColumns: zActive ? "1fr 58px 58px 58px" : "1fr 58px 58px", gap: 4, padding: "8px 10px", borderBottom: "1px solid #e9ecef", fontSize: 9.5, fontWeight: 700, color: "#adb5bd", textTransform: "uppercase" }}>
                <span>Employee</span><span style={{ textAlign: "right" }}>{config.sumbuX}</span><span style={{ textAlign: "right" }}>{config.sumbuY}</span>
                {zActive && <span style={{ textAlign: "right" }}>{config.sumbuZ}</span>}
              </div>
              <div style={{ maxHeight: 176, overflowY: "auto" }}>
                {popover.group.map((p) => (
                  <div key={p.employeeId} style={{ display: "grid", gridTemplateColumns: zActive ? "1fr 58px 58px 58px" : "1fr 58px 58px", gap: 4, alignItems: "center", padding: "6px 10px", fontSize: 11, color: "#495057" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: NODE_BG, color: "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, overflow: "hidden", position: "relative" }}>
                        <span>{initials(p.name)}</span>
                        {p.employeeId && <img src={`/avatars/employee/${p.employeeId}.png`} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />}
                      </span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                    </span>
                    <span style={{ textAlign: "right" }}>{p.rawX ?? "-"}</span>
                    <span style={{ textAlign: "right" }}>{p.rawY ?? "-"}</span>
                    {zActive && <span style={{ textAlign: "right" }}>{p.rawZ ?? "-"}</span>}
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
        {zActive && (
          <div style={{ fontSize: 10, textAlign: "center", color: "#adb5bd", marginTop: 4 }}>
            Lapis cincin = {config.sumbuZ}
          </div>
        )}
      </div>
    </div>
  );
}
