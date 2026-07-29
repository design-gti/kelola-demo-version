import { candidates, type Candidate } from "@/data/dummyData";
import { TI_CONFIG, boxByOrder, orderFor, plotPos, resolveColor, type MetricKey, type TMConfig, type TMPoint } from "@/data/talentMappingShared";
import { mantineColor } from "@/components/team/mantineColor";

const val = (c: Candidate, key: MetricKey): number | null => c[key];
const darker = (token: string) => mantineColor[token.split(".")[0]]?.[6] ?? "#495057";

/** TI (Human Asset Value): whichever two metrics `cfg` selects (default: Performance × Potency). */
export function getTalentIdentificationPoints(cfg: TMConfig = TI_CONFIG, pool: Candidate[] = candidates): TMPoint[] {
  return pool.map(c => {
    const rawX = val(c, cfg.sumbuXKey);
    const rawY = val(c, cfg.sumbuYKey);
    const has = rawX != null && rawY != null;
    return {
      employeeId: c.id,
      name: c.name,
      positionTitle: c.position,
      team: c.department,
      rawX, rawY,
      x: has ? plotPos(rawX!, cfg.rangesX) : null,
      y: has ? plotPos(rawY!, cfg.rangesY) : null,
      order: has ? orderFor(cfg, rawX!, rawY!) : null,
    };
  });
}

// TR (Talent Readiness): empty until a Job Target is picked — mirrors kelola-app default.
export function getTalentReadinessPoints(): TMPoint[] {
  return [];
}

export interface TalentMappingCell {
  count: number;
  label: string;
  countColor: string;
  bg: string;
  avatars: string[];
  names: string[];
}

/**
 * 9-box grid cells (counts + up to 2 avatar photos + names per box) for the
 * Home dashboard's Employee Mapping card. Same underlying computation as
 * getTalentIdentificationPoints — kept server-only for the same reason:
 * this touches real per-person scores, which must never enter the "use
 * client" EmployeeMapping.tsx bundle directly.
 */
export function getTalentMappingCells(cfg: TMConfig = TI_CONFIG, pool: Candidate[] = candidates): TalentMappingCell[] {
  const points = getTalentIdentificationPoints(cfg, pool);
  const byOrder = new Map<number, TMPoint[]>();
  points.forEach(p => {
    if (p.order == null) return;
    const arr = byOrder.get(p.order) ?? [];
    arr.push(p);
    byOrder.set(p.order, arr);
  });
  return cfg.ordering.flat().map(order => {
    const box = boxByOrder(cfg, order)!;
    const members = byOrder.get(order) ?? [];
    return {
      count: members.length,
      label: box.label,
      countColor: darker(box.color),
      bg: resolveColor(box.color),
      avatars: members.slice(0, 2).map(m => `/avatars/photo_wc2026/${m.employeeId}.png`),
      names: members.map(m => m.name),
    };
  });
}
