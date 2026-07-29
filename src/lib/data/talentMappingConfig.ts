import { cookies } from "next/headers";
import { makeConfig, type TMConfig } from "@/data/talentMappingShared";

/**
 * Server-side counterpart of src/data/talentMappingConfig.ts's
 * getEffectiveTIConfig() — same merge logic, but reads the cookie that
 * function's saveTIConfig()/resetTIConfig() writes instead of localStorage
 * (which doesn't exist on the server). Kept in sync deliberately: this is a
 * display preference, not access control, so a plain (non-httpOnly) cookie
 * set directly from the client is fine — no Server Action round-trip needed.
 */
export const TM_CONFIG_COOKIE = "tm-config-ti";

type Saved = Pick<TMConfig, "layout" | "sumbuXKey" | "sumbuYKey" | "rangesX" | "rangesY" | "boxes">;

export async function getEffectiveTIConfigServer(): Promise<TMConfig> {
  const base = makeConfig("9box");
  const store = await cookies();
  const raw = store.get(TM_CONFIG_COOKIE)?.value;
  if (!raw) return base;

  try {
    const s = JSON.parse(decodeURIComponent(raw)) as Saved;
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
