// Effective box-mapping config (TI or TR): the layout default merged with the
// user's saved overrides (layout + metrics + band thresholds + box labels/tags/
// readiness) from localStorage. The Setting page writes here; the Talent Mapping
// page reads getEffective{TI,TR}Config(). Config is INDEPENDENT per box mapping
// (separate key/cookie), mirroring kelola-app.
//
// Each save also mirrors into a plain cookie (same JSON) so the Server Component
// at src/app/talent-mapping/page.tsx can read the choice via
// src/lib/data/talentMappingConfig.ts (localStorage doesn't exist on the server).
// Keep the cookie names in sync with that file by hand.
import { TMConfig, makeConfigById } from "./talentMappingShared";

export type ConfigId = "TI" | "TR";

const key = (id: ConfigId) => `tm-config-${id}`;
// `-v2` bukan sisa eksperimen: sama seperti kelola-role-v2 (lihat setRole.ts),
// cookie lama non-partitioned bertahan sampai 180 hari di jar terpisah dari
// cookie Partitioned yang baru dan MENANG saat server membacanya di luar
// iframe. Ganti nama memaksa pengguna lama mulai dari cookie baru yang benar,
// bukan bertabrakan diam-diam dengan cookie lama yang salah atribut.
const cookie = (id: ConfigId) => `tm-config-${id.toLowerCase()}-v2`;
export const TM_CONFIG_EVENT = "tm-config-changed";

type Saved = Pick<TMConfig, "layout" | "sumbuX" | "sumbuY" | "sumbuXKey" | "sumbuYKey" | "rangesX" | "rangesY" | "boxes">;

function mergeSaved(id: ConfigId, raw: string): TMConfig {
  const s = JSON.parse(raw) as Saved;
  // Start from the saved layout's defaults (ordering + colors + id identity),
  // overlay saved edits.
  const cfg = makeConfigById(id, s.layout, { sumbuXKey: s.sumbuXKey, sumbuYKey: s.sumbuYKey });
  if (s.rangesX?.length === cfg.rangesX.length) cfg.rangesX = s.rangesX;
  if (s.rangesY?.length === cfg.rangesY.length) cfg.rangesY = s.rangesY;
  if (s.boxes?.length === cfg.boxes.length) {
    cfg.boxes = cfg.boxes.map(b => {
      const o = s.boxes.find(x => x.order === b.order);
      return o ? { ...b, label: o.label, tag: o.tag, readiness: o.readiness } : b;
    });
  }
  return cfg;
}

export function getEffectiveConfig(id: ConfigId): TMConfig {
  const base = makeConfigById(id);
  if (typeof window === "undefined") return base;
  try {
    const raw = localStorage.getItem(key(id));
    return raw ? mergeSaved(id, raw) : base;
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
  };
  const json = JSON.stringify(s);
  localStorage.setItem(key(id), json);
  // Halaman ini di-embed sebagai iframe lintas situs di Integro. Dengan
  // SameSite=Lax browser memperlakukan cookie ini sebagai pihak ketiga dan
  // tidak menyimpannya, sehingga getEffectiveConfigServer() di
  // src/lib/data/talentMappingConfig.ts selalu jatuh ke default — pengguna
  // mengatur sumbu/rentang/box TI/TR, reload, dan pengaturannya hilang senyap
  // tanpa error. `Partitioned` (CHIPS) membuat Chrome/Firefox tetap
  // menyimpannya, terisolasi per situs induk. SameSite=None MEWAJIBKAN Secure;
  // localhost tetap dianggap tepercaya jadi `next dev` biasa tidak terdampak
  // (lihat komentar sejenis di api/session/route.ts untuk kasus non-localhost).
  document.cookie = `${cookie(id)}=${encodeURIComponent(json)}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=None; Secure; Partitioned`;
  window.dispatchEvent(new Event(TM_CONFIG_EVENT));
}

export function resetConfig(id: ConfigId): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key(id));
  // Atribut penghapusan HARUS sama (SameSite/Secure/Partitioned) dengan atribut
  // penulisan di atas — browser mencocokkan atribut cookie saat menghapus, jadi
  // max-age=0 tanpa atribut yang cocok hanya menghapus (atau membuat) cookie di
  // jar yang salah dan cookie Partitioned lama tetap hidup.
  document.cookie = `${cookie(id)}=; path=/; max-age=0; SameSite=None; Secure; Partitioned`;
  window.dispatchEvent(new Event(TM_CONFIG_EVENT));
}

// Back-compat TI wrappers (existing callers).
export const getEffectiveTIConfig = () => getEffectiveConfig("TI");
export const saveTIConfig = (cfg: TMConfig) => saveConfig("TI", cfg);
export const resetTIConfig = () => resetConfig("TI");
