"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Modal "Edit Image" — atur posisi & zoom foto sebelum dipakai.
 *
 * Area crop SELALU persegi: viewport-nya `aspect-square`, dan hasilnya digambar ke
 * canvas persegi (OUT_SIZE), jadi rasio tidak bisa berubah walau jendela di-resize.
 * Canvas sengaja tidak diberi warna latar supaya transparansi PNG tetap terjaga —
 * syarat "sudah remove background" akan sia-sia kalau crop-nya menambah background.
 */

/** Sisi output dalam piksel. Cukup besar untuk foto profil tanpa memboroskan localStorage. */
const OUT_SIZE = 512;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

export function CropImageModal({ src, onCancel, onApply }: {
  src: string;
  onCancel: () => void;
  /** Data URL PNG hasil crop persegi. */
  onApply: (dataUrl: string) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [viewport, setViewport] = useState(0);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  // Ukur viewport (persegi) sekali dan setiap kali ukurannya berubah.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setViewport(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => { imgRef.current = img; setNatural({ w: img.naturalWidth, h: img.naturalHeight }); };
    img.src = src;
  }, [src]);

  /** Skala agar seluruh foto pas di dalam kotak (contain) — titik nol slider zoom. */
  const baseScale = natural && viewport ? Math.min(viewport / natural.w, viewport / natural.h) : 1;
  const scale = baseScale * zoom;
  const drawW = (natural?.w ?? 0) * scale;
  const drawH = (natural?.h ?? 0) * scale;

  /** Batasi geser supaya foto tidak bisa ditarik keluar dari kotak. */
  function clamp(next: { x: number; y: number }) {
    const maxX = Math.max(0, (drawW - viewport) / 2) + viewport * 0.25;
    const maxY = Math.max(0, (drawH - viewport) / 2) + viewport * 0.25;
    return {
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y)),
    };
  }

  function onPointerDown(e: React.PointerEvent) {
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    setOffset(clamp({ x: d.ox + (e.clientX - d.x), y: d.oy + (e.clientY - d.y) }));
  }
  function onPointerUp() { drag.current = null; }

  function reset() { setZoom(MIN_ZOOM); setOffset({ x: 0, y: 0 }); }

  function apply() {
    const img = imgRef.current;
    if (!img || !viewport) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUT_SIZE;
    canvas.height = OUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Petakan tampilan viewport → canvas apa adanya, tanpa mengisi latar.
    const f = OUT_SIZE / viewport;
    ctx.drawImage(
      img,
      (viewport / 2 + offset.x - drawW / 2) * f,
      (viewport / 2 + offset.y - drawH / 2) * f,
      drawW * f,
      drawH * f
    );
    onApply(canvas.toDataURL("image/png"));
  }

  return createPortal(
    <div
      onClick={onCancel}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Edit Image"
        className="bg-white rounded-[12px] w-full max-w-[380px] p-[24px]"
        style={{ fontFamily: "'Open Sans', sans-serif", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[15px] font-bold text-[#212529] m-0">Edit Image</h2>
          <button onClick={onCancel} aria-label="Tutup" className="text-[18px] leading-none text-[#adb5bd] hover:text-[#495057] cursor-pointer">
            ✕
          </button>
        </div>

        {/* Area crop — selalu persegi */}
        <div
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="mt-[16px] relative w-full aspect-square overflow-hidden bg-[#868e96] cursor-grab active:cursor-grabbing touch-none select-none"
        >
          {natural && (
            <img
              src={src}
              alt=""
              draggable={false}
              className="absolute left-1/2 top-1/2 pointer-events-none"
              style={{
                width: drawW,
                height: drawH,
                // Reset CSS global memberi `img { max-width: 100% }`; tanpa dilepas,
                // lebar foto mentok di lebar kotak saat zoom sementara tingginya terus
                // bertambah — hasilnya foto gepeng, bukan ter-zoom.
                maxWidth: "none",
                maxHeight: "none",
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              }}
            />
          )}

          {/* Garis bantu rule-of-thirds */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/60" />
            <div className="absolute top-0 bottom-0 left-2/3 w-px bg-white/60" />
            <div className="absolute left-0 right-0 top-1/3 h-px bg-white/60" />
            <div className="absolute left-0 right-0 top-2/3 h-px bg-white/60" />
          </div>
        </div>

        {/* Zoom + reset */}
        <div className="mt-[16px] flex items-center gap-[10px]">
          <ZoomIcon variant="out" />
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={e => {
              setZoom(Number(e.target.value));
              setOffset(prev => clamp(prev));
            }}
            aria-label="Zoom"
            className="flex-1 accent-[#016699] cursor-pointer"
          />
          <ZoomIcon variant="in" />
          <button onClick={reset} aria-label="Reset" title="Reset" className="text-[#495057] hover:text-[#016699] cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
        </div>

        <div className="mt-[20px] flex justify-end gap-[12px]">
          <button
            onClick={onCancel}
            className="px-[20px] py-[8px] rounded-full border border-[#016699] text-[#016699] text-[12px] font-bold cursor-pointer hover:bg-[#f1f7fb] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={apply}
            disabled={!natural}
            className="px-[24px] py-[8px] rounded-full bg-[#016699] hover:bg-[#01557f] text-white text-[12px] font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ZoomIcon({ variant }: { variant: "in" | "out" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
      <path d="M8 11h6" />
      {variant === "in" && <path d="M11 8v6" />}
    </svg>
  );
}
