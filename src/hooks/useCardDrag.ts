"use client";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Mesin geser kartu antar kolom — dipakai Beranda dan iProfile.
 *
 * Hook ini hanya mengurus yang benar-benar sama di kedua halaman: menangkap
 * pointer, menghitung titik sisip, dan menyimpan ukuran bayangan kartu. Susunan
 * kolom dan cara tiap kartu digambar tetap milik halamannya masing-masing —
 * Beranda punya kartu selebar penuh di luar kolom, iProfile tidak.
 *
 * Sebelumnya seluruh logika ini menyatu di HomeClient. Disalin ke halaman kedua
 * berarti dua perilaku yang perlahan berbeda tanpa ada yang menyadari.
 */

export type InsertInfo = {
  targetCol: number;
  /** null = disisipkan di paling bawah kolom. */
  insertBeforeId: string | null;
};

type DragInfo = { id: string; offsetX: number; offsetY: number };

/** Kartu yang ikut dipindai saat mencari titik sisip. */
type ScanCard = { id: string; col: number };

export function useCardDrag({
  columnCount,
  cards,
  onDrop,
}: {
  columnCount: number;
  /** Kartu yang sedang tampil, TERMASUK yang sedang diseret. */
  cards: ScanCard[];
  onDrop: (id: string, targetCol: number, insertBeforeId: string | null) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);
  const [ghostDims, setGhostDims] = useState<{ w: number; h: number; scale: number } | null>(null);
  const [insertInfo, setInsertInfo] = useState<InsertInfo | null>(null);

  /**
   * Bayangan kartu digambar lewat portal ke document.body, jadi baru boleh
   * muncul setelah komponennya menempel di klien. Dibaca lewat store luar,
   * bukan setState di dalam effect: server mengembalikan false, klien true,
   * tanpa render tambahan.
   */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const dragRef = useRef<DragInfo | null>(null);
  const insertInfoRef = useRef<InsertInfo | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pageScaleRef = useRef(1);

  // Nilai terbaru disimpan di ref karena listener pointer dipasang sekali saja;
  // kalau membaca langsung dari closure, isinya beku di render pertama.
  // Disalin lewat effect, bukan saat render — ref tidak boleh ditulis saat
  // komponen sedang dirender.
  const cardsRef = useRef<ScanCard[]>(cards);
  const onDropRef = useRef(onDrop);
  useEffect(() => {
    cardsRef.current = cards;
    onDropRef.current = onDrop;
  });

  useEffect(() => {
    // Beranda mengecilkan seluruh halaman di layar sempit; bayangan kartu ikut
    // diskalakan supaya ukurannya sama dengan kartu aslinya.
    const update = () => {
      pageScaleRef.current = Math.min(window.innerWidth / 1440, 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const findInsertPoint = useCallback(
    (mx: number, my: number): InsertInfo => {
      const scan = cardsRef.current.filter((c) => c.id !== dragRef.current?.id);

      // Kolom tujuan ditentukan dari wadah kolomnya, bukan dari kartu di
      // dalamnya — supaya kolom yang sedang kosong tetap bisa jadi tujuan.
      let targetCol = 0;
      let minDist = Infinity;
      for (let ci = 0; ci < columnCount; ci++) {
        const container = colRefs.current[ci];
        if (!container) continue;
        const r = container.getBoundingClientRect();
        if (mx >= r.left && mx <= r.right) {
          targetCol = ci;
          break;
        }
        const d = Math.min(Math.abs(mx - r.left), Math.abs(mx - r.right));
        if (d < minDist) {
          minDist = d;
          targetCol = ci;
        }
      }

      for (const c of scan.filter((c) => c.col === targetCol)) {
        const el = cardRefs.current.get(c.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (my < rect.top + rect.height / 2) return { targetCol, insertBeforeId: c.id };
      }
      return { targetCol, insertBeforeId: null };
    },
    [columnCount],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      setGhostPos({ x: e.clientX - drag.offsetX, y: e.clientY - drag.offsetY });
      const info = findInsertPoint(e.clientX, e.clientY);
      const prev = insertInfoRef.current;
      if (!prev || prev.targetCol !== info.targetCol || prev.insertBeforeId !== info.insertBeforeId) {
        insertInfoRef.current = info;
        setInsertInfo(info);
      }
    };

    const onMouseUp = () => {
      const drag = dragRef.current;
      if (!drag) return;
      const info = insertInfoRef.current;
      if (info) onDropRef.current(drag.id, info.targetCol, info.insertBeforeId);
      dragRef.current = null;
      insertInfoRef.current = null;
      setDragId(null);
      setGhostPos(null);
      setGhostDims(null);
      setInsertInfo(null);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [findInsertPoint]);

  const onHandleMouseDown = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = cardRefs.current.get(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = { id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top };
    insertInfoRef.current = null;
    setDragId(id);
    setGhostPos({ x: rect.left, y: rect.top });
    setGhostDims({ w: rect.width, h: rect.height, scale: pageScaleRef.current });
    setInsertInfo(null);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  }, []);

  /** ref callback untuk tiap kartu; dipakai mengukur posisinya saat menggeser. */
  const registerCard = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) cardRefs.current.set(id, el);
      else cardRefs.current.delete(id);
    },
    [],
  );

  /** ref callback untuk wadah tiap kolom. */
  const registerColumn = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      colRefs.current[index] = el;
    },
    [],
  );

  /**
   * Garis sisip yang harus digambar pada sebuah kartu: "before" di atasnya,
   * "after" di bawahnya (hanya untuk kartu terakhir di kolom tujuan).
   */
  const insertLineFor = useCallback(
    (cardId: string, col: number, lastIdInCol: string | undefined): "before" | "after" | null => {
      if (!insertInfo) return null;
      if (insertInfo.insertBeforeId === cardId) return "before";
      if (insertInfo.targetCol === col && insertInfo.insertBeforeId === null && cardId === lastIdInCol) {
        return "after";
      }
      return null;
    },
    [insertInfo],
  );

  return {
    dragId,
    ghostPos,
    ghostDims,
    insertInfo,
    mounted,
    onHandleMouseDown,
    registerCard,
    registerColumn,
    insertLineFor,
  };
}
