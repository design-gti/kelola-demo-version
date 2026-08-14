"use client";
import { useSyncExternalStore } from "react";

/**
 * Susunan kartu halaman iProfile: kartu mana yang tampil dan di kolom mana.
 *
 * Tersimpan di localStorage dan berlaku untuk profil siapa pun yang dibuka —
 * tata letak itu preferensi orang yang menilai, bukan milik orang yang dinilai.
 *
 * Polanya sengaja sama dengan useDashboardConfig milik Beranda, tapi tidak
 * disatukan: daftar kartu, jumlah kolom, dan aturan kartu terkuncinya berbeda,
 * dan menyatukannya hanya akan melahirkan hook penuh percabangan.
 */
export interface IProfileCardConfig {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  col: 0 | 1 | 2;
  /** Tidak bisa disembunyikan — halaman kehilangan konteks tanpa kartu ini. */
  locked?: boolean;
}

const DEFAULT_CARDS: IProfileCardConfig[] = [
  { id: "profile",           label: "Profile",                 description: "Foto, jabatan, DISC, IQ, dan competency match",        enabled: true, col: 0, locked: true },
  { id: "competency-scores", label: "Competency Scores",       description: "Skor aspek kompetensi terhadap standar Job",           enabled: true, col: 0 },
  { id: "potency-scores",    label: "Potency Scores",          description: "Skor aspek potensi terhadap standar Job",              enabled: true, col: 0 },
  { id: "career-plan",       label: "Career Plan",             description: "Rencana karier karyawan ini",                          enabled: true, col: 1 },
  { id: "succession-plan",   label: "Succession Plan",         description: "Calon penerus jabatan karyawan ini",                   enabled: true, col: 1 },
  { id: "teams",             label: "Teams",                   description: "Tim tempat karyawan ini tergabung",                    enabled: true, col: 1 },
  { id: "extension-data",    label: "Extension Data",          description: "Performa, engagement, potensi, dan medical checkup",   enabled: true, col: 1 },
  { id: "development",       label: "Development",             description: "Riwayat IDP beserta status dan periodenya",            enabled: true, col: 2 },
  { id: "employee-data",     label: "Employee Data",           description: "Data pribadi dan riwayat kepegawaian",                 enabled: true, col: 2 },
];

const STORAGE_KEY = "iprofile-card-config-v1";

/**
 * Kartu yang pernah dipecah jadi beberapa kartu. Tanpa ini simpanan lama
 * kehilangan id-nya, dan kartu penggantinya menclok di dasar kolom alih-alih
 * di tempat kartu asalnya.
 */
const SPLIT_CARDS: Record<string, string[]> = {
  "career-succession": ["career-plan", "succession-plan"],
};

/** Gabungkan simpanan lama dengan bawaan, supaya kartu baru tetap muncul. */
function mergeWithDefaults(stored: Partial<IProfileCardConfig>[]): IProfileCardConfig[] {
  const result = stored
    .flatMap((s) => {
      const heirs = s.id ? SPLIT_CARDS[s.id] : undefined;
      return heirs ? heirs.map((id) => ({ ...s, id })) : [s];
    })
    .map((s) => {
      const def = DEFAULT_CARDS.find((d) => d.id === s.id);
      if (!def) return null;
      return {
        ...def,
        // Kartu terkunci tetap menyala apa pun isi simpanannya.
        enabled: def.locked ? true : s.enabled ?? def.enabled,
        col: s.col === 0 || s.col === 1 || s.col === 2 ? s.col : def.col,
      };
    })
    .filter((c): c is IProfileCardConfig => c !== null);

  DEFAULT_CARDS.forEach((def) => {
    if (!result.find((c) => c.id === def.id)) result.push(def);
  });
  return result;
}

/**
 * Susunan kartu disimpan di luar React sebagai store kecil.
 *
 * Alasannya: localStorage hanya ada di browser, sedangkan halaman ini dirender
 * lebih dulu di server. Kalau dibaca lewat effect lalu di-setState, React
 * merender dua kali tiap kali halaman dibuka — dan aturan lint melarangnya
 * justru karena itu. Dengan store, server memakai snapshot bawaan dan klien
 * memakai snapshot dari localStorage tanpa render tambahan.
 */
let snapshot: IProfileCardConfig[] | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): IProfileCardConfig[] {
  if (snapshot) return snapshot;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    snapshot = stored ? mergeWithDefaults(JSON.parse(stored)) : DEFAULT_CARDS;
  } catch {
    snapshot = DEFAULT_CARDS;
  }
  return snapshot;
}

const getServerSnapshot = () => DEFAULT_CARDS;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setCards(next: IProfileCardConfig[]) {
  snapshot = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

export function useIProfileConfig() {
  const cards = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = (id: string) =>
    setCards(cards.map((c) => (c.id === id && !c.locked ? { ...c, enabled: !c.enabled } : c)));

  /** Pindahkan kartu ke kolom lain, disisipkan sebelum `insertBeforeId`. */
  const insertAt = (fromId: string, targetCol: 0 | 1 | 2, insertBeforeId: string | null) => {
    const fromIdx = cards.findIndex((c) => c.id === fromId);
    if (fromIdx === -1) return;

    const next = [...cards];
    const moved: IProfileCardConfig = { ...next[fromIdx], col: targetCol };
    next.splice(fromIdx, 1);

    if (insertBeforeId === null) {
      let lastIdx = -1;
      next.forEach((c, i) => {
        if (c.col === targetCol) lastIdx = i;
      });
      next.splice(lastIdx + 1, 0, moved);
    } else {
      const beforeIdx = next.findIndex((c) => c.id === insertBeforeId);
      next.splice(beforeIdx === -1 ? next.length : beforeIdx, 0, moved);
    }
    setCards(next);
  };

  const reset = () => setCards(DEFAULT_CARDS);

  return { cards, toggle, insertAt, reset };
}
