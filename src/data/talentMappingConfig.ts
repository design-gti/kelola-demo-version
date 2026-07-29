// Effective Talent Identification config: 9box default merged with the user's saved
// overrides (layout + metrics + band thresholds + box labels/tags) from localStorage.
// The Setting page writes here; the Talent Mapping page reads getEffectiveTIConfig().
//
// Also mirrors the save into a plain cookie (same JSON, same key minus casing —
// see COOKIE below) so the Server Component at src/app/talent-mapping/page.tsx
// can read the user's choice via src/lib/data/talentMappingConfig.ts's
// getEffectiveTIConfigServer() — localStorage doesn't exist on the server.
// Keep the cookie name in sync with TM_CONFIG_COOKIE in that file by hand;
// they can't share an import across the client/server module boundary.
import { TMConfig, makeConfig } from "./talentMappingShared";

const KEY = "tm-config-TI";
const COOKIE = "tm-config-ti";
export const TM_CONFIG_EVENT = "tm-config-changed";

type Saved = Pick<TMConfig, "layout" | "sumbuX" | "sumbuY" | "sumbuXKey" | "sumbuYKey" | "rangesX" | "rangesY" | "boxes">;

export function getEffectiveTIConfig(): TMConfig {
  const base = makeConfig("9box");
  if (typeof window === "undefined") return base;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    const s = JSON.parse(raw) as Saved;
    // Start from the saved layout's defaults (ordering + colors), overlay saved edits.
    const cfg = makeConfig(s.layout, { sumbuXKey: s.sumbuXKey, sumbuYKey: s.sumbuYKey });
    if (s.rangesX?.length === cfg.rangesX.length) cfg.rangesX = s.rangesX;
    if (s.rangesY?.length === cfg.rangesY.length) cfg.rangesY = s.rangesY;
    if (s.boxes?.length === cfg.boxes.length) {
      cfg.boxes = cfg.boxes.map(b => {
        const o = s.boxes.find(x => x.order === b.order);
        return o ? { ...b, label: o.label, tag: o.tag } : b;
      });
    }
    return cfg;
  } catch {
    return base;
  }
}

export function saveTIConfig(cfg: TMConfig): void {
  if (typeof window === "undefined") return;
  const s: Saved = {
    layout: cfg.layout, sumbuX: cfg.sumbuX, sumbuY: cfg.sumbuY,
    sumbuXKey: cfg.sumbuXKey, sumbuYKey: cfg.sumbuYKey,
    rangesX: cfg.rangesX, rangesY: cfg.rangesY, boxes: cfg.boxes,
  };
  const json = JSON.stringify(s);
  localStorage.setItem(KEY, json);
  document.cookie = `${COOKIE}=${encodeURIComponent(json)}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
  window.dispatchEvent(new Event(TM_CONFIG_EVENT));
}

export function resetTIConfig(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  document.cookie = `${COOKIE}=; path=/; max-age=0`;
  window.dispatchEvent(new Event(TM_CONFIG_EVENT));
}
