import { cookies } from "next/headers";
import { makeConfigById, type TMConfig } from "@/data/talentMappingShared";

/**
 * Server-side counterpart of src/data/talentMappingConfig.ts's
 * getEffectiveConfig() — same merge logic, but reads the cookie that function's
 * saveConfig()/resetConfig() writes instead of localStorage (which doesn't exist
 * on the server). One cookie per box mapping (TI/TR), kept in sync deliberately:
 * this is a display preference, not access control, so a plain (non-httpOnly)
 * cookie set from the client is fine — no Server Action round-trip needed.
 */
type ConfigId = "TI" | "TR";
const cookieName = (id: ConfigId) => `tm-config-${id.toLowerCase()}`;
// Kept for existing imports.
export const TM_CONFIG_COOKIE = cookieName("TI");

type Saved = Pick<TMConfig, "layout" | "sumbuXKey" | "sumbuYKey" | "rangesX" | "rangesY" | "boxes">;

export async function getEffectiveConfigServer(id: ConfigId): Promise<TMConfig> {
  const base = makeConfigById(id);
  const store = await cookies();
  const raw = store.get(cookieName(id))?.value;
  if (!raw) return base;

  try {
    const s = JSON.parse(decodeURIComponent(raw)) as Saved;
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
  } catch {
    return base;
  }
}

export const getEffectiveTIConfigServer = () => getEffectiveConfigServer("TI");
export const getEffectiveTRConfigServer = () => getEffectiveConfigServer("TR");
