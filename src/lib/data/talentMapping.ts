import { candidates, type Candidate } from "@/data/dummyData";
import { TI_CONFIG, TR_CONFIG, boxByOrder, orderFor, plotPos, resolveColor, type MetricKey, type TMConfig, type TMPoint } from "@/data/talentMappingShared";
import { mantineColor } from "@/components/team/mantineColor";
import { allTeams, getParticipant } from "@/data/model/selectors";

const val = (c: Candidate, key: MetricKey): number | null => c[key];
const darker = (token: string) => mantineColor[token.split(".")[0]]?.[6] ?? "#495057";

// Team karyawan = nama Team KANONIK (Engineering Team, Sales & Marketing Team, …),
// bukan department posisi (Teknologi/Keuangan). Menyamakan filter Teams di Talent
// Mapping dengan Monitoring / iProfile / Team Profile.
const _teamNameById = new Map(allTeams().map(t => [t.id, t.name]));
const teamNameOf = (participantId: string): string => {
  const tid = getParticipant(participantId)?.teamId;
  return (tid ? _teamNameById.get(tid) : "") ?? "";
};

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
      team: teamNameOf(c.id),
      rawX, rawY,
      x: has ? plotPos(rawX!, cfg.rangesX) : null,
      y: has ? plotPos(rawY!, cfg.rangesY) : null,
      order: has ? orderFor(cfg, rawX!, rawY!) : null,
    };
  });
}

// ─── TR (Talent Readiness) ───────────────────────────────────────────────────
// Readiness benchmarks every employee against ONE target position: Competency (X)
// is the match% of their competency-metric vs the target's requirement (so it
// changes per target); Potency (Y) stays the employee's intrinsic score. Mirrors
// kelola-app, where X = calculate_match_percentage(employee, targetPosition).

export interface JobTarget { id: string; title: string }

/** Job targets = distinct positions that currently have an incumbent (mirrors
 *  kelola-app's "jobs with ≥1 position"). Title doubles as the stable id. */
export function getJobTargets(pool: Candidate[] = candidates): JobTarget[] {
  return Array.from(new Set(pool.map(c => c.position).filter(Boolean)))
    .sort()
    .map(title => ({ id: title, title }));
}

/** Deterministic competency requirement for a target, by seniority keyword —
 *  senior targets demand more, so everyone's match% (and readiness) drops. */
export function targetRequirement(title: string): number {
  const t = title.toLowerCase();
  if (/(chief|officer|\bceo\b|\bcxo\b)/.test(t)) return 95;
  if (/\bvp\b|vice president/.test(t)) return 92;
  if (/head|director/.test(t)) return 90;
  if (/lead|principal/.test(t)) return 87;
  if (/manager/.test(t)) return 84;
  if (/senior/.test(t)) return 81;
  return 78;
}

const clampPct = (v: number) => Math.min(100, Math.max(0, Math.round(v * 100) / 100));

/** Talent Readiness points for one job target, using the effective TR config. */
export function getTalentReadinessPoints(targetId: string, cfg: TMConfig = TR_CONFIG, pool: Candidate[] = candidates): TMPoint[] {
  const req = targetRequirement(targetId);
  return pool.map(c => {
    const comp = val(c, cfg.sumbuXKey);                 // competency metric (target-relative)
    const rawX = comp == null ? null : clampPct((comp / req) * 100);
    const rawY = val(c, cfg.sumbuYKey);                 // potency (intrinsic)
    const has = rawX != null && rawY != null;
    return {
      employeeId: c.id,
      name: c.name,
      positionTitle: c.position,
      team: teamNameOf(c.id),
      rawX, rawY,
      x: has ? plotPos(rawX!, cfg.rangesX) : null,
      y: has ? plotPos(rawY!, cfg.rangesY) : null,
      order: has ? orderFor(cfg, rawX!, rawY!) : null,
    };
  });
}

/** Precompute readiness points for every job target (keyed by target id) so the
 *  client can switch targets instantly without shipping raw per-person scores. */
export function getTalentReadinessByTarget(cfg: TMConfig = TR_CONFIG, pool: Candidate[] = candidates): Record<string, TMPoint[]> {
  return Object.fromEntries(getJobTargets(pool).map(t => [t.id, getTalentReadinessPoints(t.id, cfg, pool)]));
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
