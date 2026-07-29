import { candidates, type Candidate } from "@/data/dummyData";
import type { TMPoint } from "@/data/talentMappingShared";

// combination "x-y" (1-indexed thirds) → box order, from kelola-app 9Box(3x3) template
const COMBO_ORDER: Record<string, number> = {
  "1-1": 1, "2-1": 2, "1-2": 3, "3-1": 4, "2-2": 5, "1-3": 6, "3-2": 7, "2-3": 8, "3-3": 9,
};

// spread a value to 0..100 within the metric's observed range (2..98 to keep off edges)
function normalizer(vals: (number | null)[]) {
  const nums = vals.filter((n): n is number => n != null);
  const mn = Math.min(...nums), mx = Math.max(...nums);
  return (v: number | null) => (v == null || mx === mn ? null : 2 + ((v - mn) / (mx - mn)) * 96);
}

const third = (p: number) => (p <= 33.33 ? 1 : p <= 66.66 ? 2 : 3);

/** TI (Human Asset Value): Performance (X) × Potency (Y). */
export function getTalentIdentificationPoints(pool: Candidate[] = candidates): TMPoint[] {
  const normPerf = normalizer(pool.map(c => c.performance_score));
  const normPot = normalizer(pool.map(c => c.leadership_score));

  return pool.map(c => {
    const x = normPerf(c.performance_score);
    const y = normPot(c.leadership_score);
    const order = x != null && y != null ? COMBO_ORDER[`${third(x)}-${third(y)}`] : null;
    return {
      employeeId: c.id,
      name: c.name,
      positionTitle: c.position,
      rawX: c.performance_score,
      rawY: c.leadership_score,
      x, y, order,
    };
  });
}

// TR (Talent Readiness): empty until a Job Target is picked — mirrors kelola-app default.
export function getTalentReadinessPoints(): TMPoint[] {
  return [];
}
