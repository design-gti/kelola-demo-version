// Effective Talent Identification config: 9box default merged with the user's saved
// overrides (layout + metrics + band thresholds + box labels/tags) from localStorage.
// The Setting page writes here; the Talent Mapping page reads getEffectiveTIConfig().
import { TMConfig, makeConfig } from "./talentMappingData";

const KEY = "tm-config-TI";
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
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event(TM_CONFIG_EVENT));
}

export function resetTIConfig(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(TM_CONFIG_EVENT));
}
