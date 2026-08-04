"use client";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CropImageModal } from "./CropImageModal";

/**
 * Modal syarat foto profil, muncul sebelum file picker dibuka.
 *
 * Dua syarat yang ditegakkan (bukan hanya diinformasikan):
 *  1. Format harus PNG — dicek dari tipe file.
 *  2. Background sudah di-remove — dicek dari ada/tidaknya piksel transparan di
 *     area pinggir gambar. Foto yang backgroundnya masih utuh selalu opaque penuh.
 *
 * Syarat "close-up" tidak bisa diverifikasi program, jadi disampaikan lewat contoh
 * benar/salah seperti pada desain.
 */

/** Sampel piksel di tepi gambar; bg yang sudah di-remove menyisakan area transparan di sini. */
const EDGE_RATIO = 0.12;
/** Ambang toleransi: minimal 2% piksel tepi harus transparan agar dianggap sudah di-remove. */
const MIN_TRANSPARENT_RATIO = 0.02;

async function hasTransparentEdges(file: File): Promise<boolean> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return true; // tak bisa memeriksa → jangan halangi user
  ctx.drawImage(bitmap, 0, 0);

  const bandW = Math.max(1, Math.round(bitmap.width * EDGE_RATIO));
  const bandH = Math.max(1, Math.round(bitmap.height * EDGE_RATIO));
  const bands = [
    [0, 0, bitmap.width, bandH],                       // atas
    [0, bitmap.height - bandH, bitmap.width, bandH],   // bawah
    [0, 0, bandW, bitmap.height],                      // kiri
    [bitmap.width - bandW, 0, bandW, bitmap.height],   // kanan
  ] as const;

  let total = 0;
  let transparent = 0;
  for (const [x, y, w, h] of bands) {
    const { data } = ctx.getImageData(x, y, w, h);
    for (let i = 3; i < data.length; i += 4) {
      total++;
      if (data[i] < 250) transparent++;
    }
  }
  return total > 0 && transparent / total >= MIN_TRANSPARENT_RATIO;
}

/** Aset contoh foto yang benar/salah, disediakan tim desain. */
const EXAMPLE_CLOSEUP = "/iprofile-assets/example-closeup.png";
const EXAMPLE_NOT_CLOSEUP = "/iprofile-assets/example-not-closeup.png";

function ExampleTile({ src, ok, label }: { src: string; ok: boolean; label: string }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="relative rounded-[8px] overflow-hidden bg-[#e9ecef] aspect-square">
        <img
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
        />
        <div
          className="absolute top-[8px] right-[8px] size-[24px] rounded-full flex items-center justify-center text-white text-[14px] font-bold"
          style={{ background: ok ? "#00875A" : "#DE350B" }}
          aria-hidden
        >
          {ok ? "✓" : "✕"}
        </div>
      </div>
      <div
        className="mt-[6px] text-[11px] text-center"
        style={{ color: ok ? "#00875A" : "#DE350B", fontFamily: "'Open Sans', sans-serif" }}
      >
        {label}
      </div>
    </div>
  );
}

export function ChangePhotoModal({ onClose, onPicked }: {
  onClose: () => void;
  /** Dipanggil dengan data URL foto yang sudah lolos validasi. */
  onPicked: (dataUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  /** Foto yang sudah lolos syarat, menunggu diatur crop-nya. */
  const [toCrop, setToCrop] = useState<string | null>(null);

  async function accept(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (file.type !== "image/png") {
      setError("Format foto harus PNG. File yang Anda pilih bukan PNG.");
      return;
    }

    setChecking(true);
    try {
      if (!(await hasTransparentEdges(file))) {
        setError("Background foto belum di-remove. Unggah PNG transparan tanpa background.");
        return;
      }
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = ev => resolve(ev.target?.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      setToCrop(dataUrl);
    } catch {
      setError("Foto gagal dibaca. Coba file lain.");
    } finally {
      setChecking(false);
    }
  }

  // Tahap crop menggantikan tampilan modal syarat; Cancel kembali ke sini.
  if (toCrop) {
    return <CropImageModal src={toCrop} onCancel={() => setToCrop(null)} onApply={onPicked} />;
  }

  return createPortal(
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Select an Image"
        className="bg-white rounded-[12px] w-full max-w-[440px] max-h-[90vh] overflow-y-auto p-[24px]"
        style={{ fontFamily: "'Open Sans', sans-serif", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-[15px] font-bold text-[#212529] m-0">Select an Image</h2>
          <button onClick={onClose} aria-label="Tutup" className="text-[18px] leading-none text-[#adb5bd] hover:text-[#495057] cursor-pointer">
            ✕
          </button>
        </div>

        <p className="mt-[12px] mb-0 text-[12px] text-[#6c757d]">
          It is recommended to upload close-up photos with a plain background.
        </p>

        <div className="mt-[16px] flex gap-[12px]">
          <ExampleTile src={EXAMPLE_CLOSEUP} ok label="Close-up" />
          <ExampleTile src={EXAMPLE_NOT_CLOSEUP} ok={false} label="Bukan close-up" />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; e.target.value = ""; accept(f); }}
        />

        <button
          onClick={() => inputRef.current?.click()}
          disabled={checking}
          className="mt-[16px] w-full rounded-[8px] border border-dashed border-[#ced4da] bg-[#f8f9fa] py-[28px] flex flex-col items-center gap-[8px] cursor-pointer hover:bg-[#f1f3f5] transition-colors disabled:cursor-wait"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#495057" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-[12px] font-bold text-[#495057]">
            {checking ? "Memeriksa foto…" : "Upload Image"}
          </span>
        </button>

        {error && (
          <div
            role="alert"
            className="mt-[12px] rounded-[8px] px-[12px] py-[10px] text-[12px] leading-[1.6]"
            style={{ background: "#fff5f4", color: "#DE350B" }}
          >
            {error}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
