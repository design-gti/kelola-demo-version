"use client";
import { useSyncExternalStore } from "react";
import { allProfiles, fieldsOf, PROFILE_DATA_EVENT } from "@/app/admin/profile-data/profiles";
import { extensionCardId } from "@/iprofile/components/ExtensionDataCards";

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

/**
 * Susunan bawaan: urutan di dalam kolom mengikuti urutan daftar ini.
 *
 * Kiri berisi siapa orangnya dan skornya, tengah rencana ke depan beserta
 * kepribadiannya, kanan data kepegawaian dan riwayat pengembangannya.
 *
 * Potency Scores mati secara bawaan — bacaannya sudah terwakili sumbu Potency di
 * kartu lain, dan menyalakan dua radar chart sekaligus membuat kolom kiri jauh
 * lebih panjang dari dua kolom lainnya. User yang memerlukannya tinggal
 * menyalakan lewat panel Configuration.
 */
const STATIC_CARDS: IProfileCardConfig[] = [
  { id: "profile",           label: "Profile",                 description: "Foto, jabatan, DISC, IQ, dan competency match",        enabled: true,  col: 0, locked: true },
  { id: "competency-scores", label: "Competency Scores",       description: "Skor aspek kompetensi terhadap standar Job",           enabled: true,  col: 0 },
  { id: "potency-scores",    label: "Potency Scores",          description: "Skor aspek potensi terhadap standar Job",              enabled: false, col: 0 },
  { id: "teams",             label: "Teams",                   description: "Tim tempat karyawan ini tergabung",                    enabled: true,  col: 0 },
  { id: "career-plan",       label: "Career Plan",             description: "Rencana karier karyawan ini",                          enabled: true,  col: 1 },
  { id: "succession-plan",   label: "Succession Plan",         description: "Calon penerus jabatan karyawan ini",                   enabled: true,  col: 1 },
  { id: "personality-factors", label: "16 Personality Factors", description: "Skor STEN 16PF beserta kecenderungan tiap faktor",     enabled: true,  col: 1 },
  { id: "personal-data",     label: "Personal Data",           description: "NIK, kontak, domisili, dan data pribadi lainnya",      enabled: true,  col: 2 },
  { id: "employee-data",     label: "Employee Data",           description: "Atasan, masa kerja, dan riwayat jabatan",              enabled: true,  col: 2 },
  { id: "development",       label: "Development",             description: "Riwayat IDP beserta status dan periodenya",            enabled: true,  col: 2 },
];

/**
 * Kartu data extension: satu per bidang tambahan yang aktif di Admin > Profile
 * Data, dihitung saat dipakai — bukan didaftar tetap seperti kartu lainnya.
 *
 * Daftar bidangnya memang bisa berubah kapan saja selama sesi berjalan, jadi
 * daftar kartu di sini harus ikut. Bidang yang dimatikan di halaman admin tidak
 * menghasilkan kartu sama sekali; itulah arti sakelar di sana.
 */
function extensionCards(): IProfileCardConfig[] {
  return allProfiles()
    // Bidang tanpa kolom tidak menghasilkan kartu: kartunya akan kosong, dan
    // wadah kosong itu tetap memakan jarak antar kartu di kolomnya. Begitu
    // kolomnya ditambahkan di Admin, kartunya muncul sendiri.
    .filter((p) => p.kind === "extension" && p.enabled && fieldsOf(p.slug).length > 0)
    .map((p) => ({
      id: extensionCardId(p.slug),
      label: p.name,
      description: p.description === "-" ? "Data extension" : p.description,
      enabled: true,
      col: 0 as const,
    }));
}

/**
 * Kartu data extension disisipkan tepat setelah Competency Scores, bukan
 * ditempel di ujung daftar: keduanya sama-sama "angka tentang orang ini", jadi
 * mereka duduk berdekatan di kolom kiri, dan Teams tetap menutup kolom itu.
 */
const defaultCards = (): IProfileCardConfig[] => {
  const out = [...STATIC_CARDS];
  const at = out.findIndex((c) => c.id === "potency-scores");
  out.splice(at + 1, 0, ...extensionCards());
  return out;
};

/*
 * v2: susunan bawaannya berubah (kolom, urutan, dan Potency Scores yang kini
 * mati secara bawaan). Kunci dinaikkan supaya susunan baru itu benar-benar
 * terlihat; simpanan v1 memuat kolom lama untuk setiap kartu, dan mergeWithDefaults
 * mempertahankannya — jadi tanpa kunci baru, tata letak bawaan yang baru tidak
 * akan pernah muncul di browser yang pernah membuka halaman ini.
 */
const STORAGE_KEY = "iprofile-card-config-v2";

/**
 * Kartu yang pernah dipecah jadi beberapa kartu. Tanpa ini simpanan lama
 * kehilangan id-nya, dan kartu penggantinya menclok di dasar kolom alih-alih
 * di tempat kartu asalnya.
 */
const SPLIT_CARDS: Record<string, string[]> = {
  "career-succession": ["career-plan", "succession-plan"],
  // Satu kartu berisi dua kelompok baris, kini dua kartu terpisah. Tanpa entri
  // ini, simpanan lama kehilangan id "employee-data" dan kedua penggantinya
  // menclok di dasar kolom alih-alih di tempat kartu asalnya.
  "employee-data": ["personal-data", "employee-data"],
};

/** Gabungkan simpanan lama dengan bawaan, supaya kartu baru tetap muncul. */
function mergeWithDefaults(stored: Partial<IProfileCardConfig>[]): IProfileCardConfig[] {
  const defaults = defaultCards();
  const result = stored
    .flatMap((s) => {
      const heirs = s.id ? SPLIT_CARDS[s.id] : undefined;
      return heirs ? heirs.map((id) => ({ ...s, id })) : [s];
    })
    .map((s) => {
      const def = defaults.find((d) => d.id === s.id);
      if (!def) return null;
      return {
        ...def,
        // Kartu terkunci tetap menyala apa pun isi simpanannya.
        enabled: def.locked ? true : s.enabled ?? def.enabled,
        col: s.col === 0 || s.col === 1 || s.col === 2 ? s.col : def.col,
      };
    })
    .filter((c): c is IProfileCardConfig => c !== null);

  defaults.forEach((def) => {
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

function build(): IProfileCardConfig[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? mergeWithDefaults(JSON.parse(stored)) : defaultCards();
  } catch {
    return defaultCards();
  }
}

function getSnapshot(): IProfileCardConfig[] {
  if (!snapshot) snapshot = build();
  return snapshot;
}

/**
 * Snapshot server disimpan sekali dan dipakai ulang.
 *
 * useSyncExternalStore membandingkan hasilnya antar render dengan Object.is;
 * mengembalikan array baru tiap panggilan akan membuatnya menganggap datanya
 * berubah terus dan merender tanpa henti.
 */
let serverSnapshot: IProfileCardConfig[] | null = null;
const getServerSnapshot = () => (serverSnapshot ??= defaultCards());

/**
 * Daftar bidang tambahan bisa berubah di halaman admin selagi tab ini terbuka.
 * Saat itu terjadi, daftar kartu dihitung ulang — kartu bidang baru langsung
 * muncul di panel pengaturan, dan kartu bidang yang dihapus ikut lenyap.
 */
function onProfileDataChanged() {
  snapshot = build();
  listeners.forEach((l) => l());
}

/**
 * Langganan peristiwa dipasang SEKALI seumur tab, bukan mengikuti ada-tidaknya
 * komponen yang memakai hook ini.
 *
 * Dulu ia dilepas begitu pemakai terakhir dilepas. Akibatnya, bidang yang
 * dibuat di halaman Admin selagi iProfile tidak terpasang tidak pernah masuk ke
 * snapshot — dan karena snapshot itu tersimpan di modul, kembali ke iProfile
 * menampilkan daftar kartu yang basi, tanpa kartu bidang baru itu.
 */
let subscribedToProfileData = false;
function ensureProfileDataSubscription() {
  if (subscribedToProfileData || typeof window === "undefined") return;
  subscribedToProfileData = true;
  window.addEventListener(PROFILE_DATA_EVENT, onProfileDataChanged);
}

function subscribe(listener: () => void) {
  ensureProfileDataSubscription();
  listeners.add(listener);
  return () => { listeners.delete(listener); };
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

  const reset = () => setCards(defaultCards());

  return { cards, toggle, insertAt, reset };
}
