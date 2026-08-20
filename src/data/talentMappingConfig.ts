// Konfigurasi box mapping efektif (TI/TR/tab custom): bawaan layout ditimpa
// suntingan user. Halaman Setting menulis ke sini; halaman Talent Mapping
// membacanya lewat getEffectiveConfig(). Konfigurasi TERPISAH per box mapping,
// meniru kelola-app.
//
// SIMPANANNYA HANYA DI MEMORI, SENGAJA. Untuk keperluan demo, semua pengaturan
// berlaku penuh selama sesi berjalan — pindah halaman, bolak-balik antar tab,
// semuanya bertahan — tapi refresh browser atau login ulang mengembalikannya ke
// setelan awal, sehingga setiap demo mulai dari kondisi yang sama tanpa perlu
// membersihkan apa pun. localStorage dan cookie tidak dipakai justru karena
// keduanya selamat dari reload; peta modul di bawah ini tidak.
//
// Konsekuensinya server tidak bisa lagi membaca konfigurasi ini (tidak ada
// cookie yang dikirim), jadi titik 9-box dihitung di klien dari tabel metrik —
// lihat pointsFrom() di talentMappingShared.
import { TMConfig, MetricKey, makeConfigById, metricLabel } from "./talentMappingShared";

/** "TI" / "TR" untuk dua tab bawaan; tab buatan user memakai id sendiri. */
export type ConfigId = string;

/** Dua tab yang selalu ada dan tidak bisa dihapus. */
export const BUILT_IN_TABS: { id: string; label: string }[] = [
  { id: "TI", label: "Talent Identification" },
  { id: "TR", label: "Talent Readiness" },
];
export const isBuiltInTab = (id: string) => BUILT_IN_TABS.some(t => t.id === id);

/** Tab box mapping buatan user: nama plus kombinasi sumbunya. */
export interface CustomTab {
  id: string;
  name: string;
  sumbuXKey: MetricKey;
  sumbuYKey: MetricKey;
  sumbuZKey?: MetricKey;
}

export const TM_TABS_EVENT = "tm-tabs-changed";

/** Registry tab custom untuk sesi ini. Hilang saat halaman dimuat ulang. */
let memTabs: CustomTab[] = [];

export function getCustomTabs(): CustomTab[] {
  return memTabs;
}

function writeCustomTabs(tabs: CustomTab[]): void {
  memTabs = tabs;
  window.dispatchEvent(new Event(TM_TABS_EVENT));
}

/**
 * Id diturunkan dari cap waktu, bukan dari namanya: nama boleh diganti, dan
 * konfigurasi tersimpan menempel pada id — kalau id ikut berubah, seluruh
 * pengaturan tab itu hilang begitu namanya disunting.
 */
export function addCustomTab(tab: Omit<CustomTab, "id">): CustomTab {
  const created: CustomTab = { ...tab, id: "TC" + Date.now().toString(36) };
  writeCustomTabs([...getCustomTabs(), created]);
  return created;
}

export function renameCustomTab(id: string, name: string): void {
  writeCustomTabs(getCustomTabs().map(t => (t.id === id ? { ...t, name } : t)));
}

/** Menghapus tab sekalian membuang konfigurasi tersimpannya. */
export function removeCustomTab(id: string): void {
  writeCustomTabs(getCustomTabs().filter(t => t.id !== id));
  resetConfig(id);
}

/** Konfigurasi tersimpan per box mapping, sebagai JSON. Sengaja di memori:
 *  lihat catatan di kepala berkas. */
const memConfig = new Map<ConfigId, string>();
export const TM_CONFIG_EVENT = "tm-config-changed";

type Saved = Pick<TMConfig, "layout" | "sumbuX" | "sumbuY" | "sumbuXKey" | "sumbuYKey" | "rangesX" | "rangesY" | "boxes" | "useZ" | "sumbuZ" | "sumbuZKey" | "rangesZ" | "tagOptions" | "colorOptions" | "ordering">;

function mergeSaved(id: ConfigId, raw: string): TMConfig {
  const s = JSON.parse(raw) as Saved;
  // Start from the saved layout's defaults (ordering + colors + id identity),
  // overlay saved edits.
  const cfg = makeConfigById(id, s.layout, { sumbuXKey: s.sumbuXKey, sumbuYKey: s.sumbuYKey });
  if (s.rangesX?.length === cfg.rangesX.length) cfg.rangesX = s.rangesX;
  if (s.rangesY?.length === cfg.rangesY.length) cfg.rangesY = s.rangesY;
  // Sumbu Z: pilihan metrik dan pitanya ikut dipulihkan.
  cfg.useZ = !!s.useZ;
  cfg.sumbuZKey = s.sumbuZKey;
  cfg.sumbuZ = s.sumbuZ;
  if (s.rangesZ?.length) cfg.rangesZ = s.rangesZ;
  if (s.tagOptions?.length) cfg.tagOptions = s.tagOptions;
    if (s.colorOptions?.length) cfg.colorOptions = s.colorOptions;
  // Nomor box bisa ditukar user; urutannya tinggal di ordering, jadi harus
  // ikut tersimpan — kalau tidak, penukaran nomor hilang saat halaman dimuat.
  if (s.ordering?.length === cfg.ordering.length) cfg.ordering = s.ordering;
  if (s.boxes?.length === cfg.boxes.length) {
    // Box tersimpan yang jadi acuan, NOMORNYA ikut.
    //
    // Dulu pasangannya dicari lewat nomor box (`find(x => x.order === b.order)`).
    // Itu cuma bekerja selama nomor hanya ditukar-tukar di dalam deret bawaan
    // layout. Nomor box sekarang bisa disetel sampai 27, jadi begitu ada nomor di
    // luar deret itu pencariannya tidak menemukan pasangan, nomor box kembali ke
    // bawaan, sementara `ordering` sudah memakai nomor baru — grid lalu menunjuk
    // box yang tidak ada dan halaman berhenti dengan galat.
    //
    // Pasangannya sekarang lewat POSISI dalam daftar, yang tidak berubah oleh
    // penomoran ulang. Simpanan lama belum punya medan readiness, jadi nilainya
    // tetap diambil dari bawaan kalau kosong.
    cfg.boxes = s.boxes.map((o, i) => {
      const base = cfg.boxes[i];
      return { ...base, ...o, color: o.color ?? base.color, readiness: o.readiness ?? base.readiness };
    });
  }
  return cfg;
}

export function getEffectiveConfig(id: ConfigId): TMConfig {
  let base = makeConfigById(id);
  // Nama dan sumbu tab custom tinggal di registry tab, bukan di simpanan
  // konfigurasi — supaya mengganti nama tab tidak menyentuh konfigurasinya.
  const custom = getCustomTabs().find(t => t.id === id);
  if (custom) {
    base = {
      ...base,
      name: custom.name, tabLabel: custom.name,
      sumbuXKey: custom.sumbuXKey, sumbuX: metricLabel(custom.sumbuXKey),
      sumbuYKey: custom.sumbuYKey, sumbuY: metricLabel(custom.sumbuYKey),
      ...(custom.sumbuZKey ? { useZ: true, sumbuZKey: custom.sumbuZKey, sumbuZ: metricLabel(custom.sumbuZKey) } : {}),
    };
  }
  const raw = memConfig.get(id);
  if (!raw) return base;
  try {
    return mergeSaved(id, raw);
  } catch {
    return base;
  }
}

export function saveConfig(id: ConfigId, cfg: TMConfig): void {
  if (typeof window === "undefined") return;
  const s: Saved = {
    layout: cfg.layout, sumbuX: cfg.sumbuX, sumbuY: cfg.sumbuY,
    sumbuXKey: cfg.sumbuXKey, sumbuYKey: cfg.sumbuYKey,
    rangesX: cfg.rangesX, rangesY: cfg.rangesY, boxes: cfg.boxes,
    useZ: cfg.useZ, sumbuZ: cfg.sumbuZ, sumbuZKey: cfg.sumbuZKey, rangesZ: cfg.rangesZ,
    tagOptions: cfg.tagOptions, colorOptions: cfg.colorOptions, ordering: cfg.ordering,
  };
  memConfig.set(id, JSON.stringify(s));
  window.dispatchEvent(new Event(TM_CONFIG_EVENT));
}

export function resetConfig(id: ConfigId): void {
  memConfig.delete(id);
  window.dispatchEvent(new Event(TM_CONFIG_EVENT));
}

// Back-compat TI wrappers (existing callers).
export const getEffectiveTIConfig = () => getEffectiveConfig("TI");
export const saveTIConfig = (cfg: TMConfig) => saveConfig("TI", cfg);
export const resetTIConfig = () => resetConfig("TI");
