"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Text, UnstyledButton } from "@mantine/core";
import { IconInfoCircle, IconX } from "@tabler/icons-react";
import { menuTitle } from "@/lib/nav";
import { menuInfo } from "@/lib/menuInfo";
import {
  MENU_INFO_EVENT,
  TOUR_RESTART_EVENT,
  findMenuInfoButton,
  type MenuInfoEventDetail,
} from "@/lib/tourSignals";

/**
 * Petunjuk kecil ke ikon "i" — muncul saat sebuah menu DIBUKA PERTAMA KALI.
 *
 * Bukan tur berurutan yang harus dituntaskan: orang membuka menu sesuai
 * keperluannya sendiri, bukan sesuai urutan yang kita tentukan, dan tur yang
 * memaksa tujuh langkah justru diburu-buru untuk dilewati. Di sini tiap menu
 * berdiri sendiri — begitu user mendarat di menu yang belum pernah dia buka,
 * sebuah gelembung kecil menunjuk ikon "i" dan menawarkan panduan menu ITU.
 *
 * Petunjuknya MENETAP sampai user menanggapinya — tidak hilang sendiri setelah
 * beberapa detik. Orang yang baru membuka menu biasanya sedang menyapu isinya
 * dulu; petunjuk yang keburu lenyap justru tidak pernah terbaca. Dua cara
 * menutupnya, keduanya dihitung "sudah tahu": ikon "i"-nya diklik — gelembung
 * ini menutup dan berganti jadi panduan menu tersebut — atau tombol tutup
 * ditekan.
 */

const STORAGE_KEY = "kelola-menu-guide-seen-v1";
/** Jeda sebelum muncul — memberi halaman waktu terpasang dan tidak terasa mengagetkan. */
const APPEAR_DELAY = 700;
const ACCENT = "#016699";
const BUBBLE_W = 300;

const readSeen = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

const writeSeen = (list: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* localStorage diblokir — petunjuknya tetap hilang untuk sesi ini */
  }
};

export default function MenuGuideHint() {
  const pathname = usePathname();
  const title = menuTitle(pathname);
  const info = menuInfo(pathname);

  /*
   * Yang disimpan adalah MENU pemilik petunjuknya, bukan sekadar "sedang
   * tampil". Dengan begitu petunjuk milik menu sebelumnya hilang sendiri begitu
   * pathname berganti — tanpa perlu mematikannya secara sinkron di dalam efek,
   * yang memicu render berantai.
   */
  const [hintFor, setHintFor] = useState<string | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const shown = hintFor !== null && hintFor === pathname;

  const dismiss = useCallback((markSeen: boolean) => {
    setHintFor(null);
    if (!markSeen) return;
    const seen = readSeen();
    if (!seen.includes(pathname)) writeSeen([...seen, pathname]);
  }, [pathname]);

  // ── munculkan saat mendarat di menu yang belum pernah dibuka ──────────────
  useEffect(() => {
    // Menu tanpa penjelasan tidak punya apa-apa untuk ditunjuk.
    if (!info || !title) return;
    if (readSeen().includes(pathname)) return;

    const timer = setTimeout(() => setHintFor(pathname), APPEAR_DELAY);
    return () => clearTimeout(timer);
  }, [pathname, info, title]);

  // ── ikuti posisi ikon "i" ─────────────────────────────────────────────────
  useEffect(() => {
    if (!shown) return;
    let raf = 0;
    const track = () => {
      const el = findMenuInfoButton();
      setRect(el ? el.getBoundingClientRect() : null);
      raf = requestAnimationFrame(track);
    };
    raf = requestAnimationFrame(track);
    return () => cancelAnimationFrame(raf);
  }, [shown]);

  // ── panduannya dibuka = tujuan petunjuk ini tercapai ──────────────────────
  useEffect(() => {
    const onInfo = (e: Event) => {
      const detail = (e as CustomEvent<MenuInfoEventDetail>).detail;
      if (!detail.open) return;
      // Ditandai lewat pathname event-nya, bukan state lokal: user bisa membuka
      // panduan tanpa petunjuk ini pernah muncul, dan itu pun berarti dia sudah
      // tahu tombolnya — tidak perlu ditawari lagi di menu tersebut.
      const seen = readSeen();
      if (!seen.includes(detail.pathname)) writeSeen([...seen, detail.pathname]);
      setHintFor(null);
    };
    window.addEventListener(MENU_INFO_EVENT, onInfo);
    return () => window.removeEventListener(MENU_INFO_EVENT, onInfo);
  }, []);

  // ── "tampilkan lagi" dari dalam modal panduan ─────────────────────────────
  useEffect(() => {
    const onReset = () => {
      writeSeen([]);
      setHintFor(pathname);
    };
    window.addEventListener(TOUR_RESTART_EVENT, onReset);
    return () => window.removeEventListener(TOUR_RESTART_EVENT, onReset);
  }, [pathname]);

  if (!shown || !rect) return null;

  const pad = 8;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 300 }}>
      {/* Cincin penanda. Tidak ada selubung gelap seluruh layar: petunjuk ini
          muncul di tiap menu baru, dan meredupkan layar sesering itu berubah
          dari membantu jadi menghalangi. */}
      <span
        className="kelola-hint-ring"
        style={{
          position: "fixed",
          top: rect.top - pad,
          left: rect.left - pad,
          width: rect.width + pad * 2,
          height: rect.height + pad * 2,
          borderRadius: 999,
          border: `2px solid ${ACCENT}`,
          pointerEvents: "none",
        }}
      />

      <div
        role="status"
        style={{
          position: "fixed",
          top: rect.bottom + 14,
          left: Math.max(16, Math.min(rect.left - 20, window.innerWidth - BUBBLE_W - 16)),
          width: BUBBLE_W,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 14px 36px rgba(15,23,42,0.22)",
          border: "1px solid #e9ecef",
          padding: "12px 14px",
          pointerEvents: "auto",
          animation: "kelola-hint-in 0.22s ease-out",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <IconInfoCircle size={16} stroke={1.8} color={ACCENT} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <Text size="sm" fw={700} c="#212529">
              Baru pertama membuka {title}?
            </Text>
            <Text size="xs" c="#6c757d" mt={2}>
              Klik ikon ⓘ di atas untuk melihat panduan menu ini — apa gunanya dan bisa dipakai untuk apa.
            </Text>
          </div>
          <UnstyledButton
            onClick={() => dismiss(true)}
            aria-label="Tutup petunjuk"
            style={{ display: "flex", flexShrink: 0, color: "#adb5bd" }}
          >
            <IconX size={14} stroke={2} />
          </UnstyledButton>
        </div>
      </div>

      <style>{`
        @keyframes kelola-hint-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes kelola-hint-ring {
          0%   { transform: scale(1);    opacity: 0.9; }
          70%  { transform: scale(1.5);  opacity: 0; }
          100% { transform: scale(1.5);  opacity: 0; }
        }
        .kelola-hint-ring { animation: kelola-hint-ring 1.8s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .kelola-hint-ring { animation: none; opacity: 0.9; }
          [role="status"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
