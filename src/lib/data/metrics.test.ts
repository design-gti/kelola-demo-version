import { describe, expect, it } from "vitest";
import { candidates } from "@/data/dummyData";
import { managerTeam } from "@/data/managerTeamData";
import {
  getCriticalPositions,
  getEmployeeRank,
  getEmployeesNeedingDevelopment,
  getProfileCompletion,
  getRankedEmployees,
  getSuccessionRiskSummary,
} from "./metrics";

describe("getCriticalPositions / getSuccessionRiskSummary", () => {
  it("computes status from readiness_gap using the same 25-point threshold as CriticalPositionRiskCard", () => {
    const positions = getCriticalPositions();
    expect(positions).toHaveLength(5);

    // dummyData.ts's canonical criticalPositions fixture — one position with
    // zero successors ("no-candidate") is deliberate, mirroring a real
    // succession-risk gap; see that file's own comment.
    const byTitle = Object.fromEntries(positions.map(p => [p.title, p]));
    expect(byTitle["Head of Engineering"].status).toBe("no-candidate");
    expect(byTitle["Head of Engineering"].successors).toHaveLength(0);
  });

  it("summarizes at-risk positions against the current fixture", () => {
    const summary = getSuccessionRiskSummary();
    expect(summary.positionsTotal).toBe(5);
    expect(summary.positionsAtRisk).toBeGreaterThan(0);
    expect(summary.positionsAtRisk).toBeLessThanOrEqual(summary.positionsTotal);
    expect(summary.atRisk.map(p => p.title)).toContain("Head of Engineering");
    expect(() => new Date(summary.asOf)).not.toThrow();
  });
});

describe("getEmployeesNeedingDevelopment", () => {
  it("flags low-potential/low-performance candidates against the full candidate fixture", () => {
    const summary = getEmployeesNeedingDevelopment();
    expect(summary.total).toBe(candidates.length);
    expect(summary.needingDevelopment.length).toBeGreaterThan(0);
    expect(summary.needingDevelopment.length).toBeLessThan(summary.total);
  });

  it("scopes to a smaller pool when one is provided (e.g. a manager's team)", () => {
    const summary = getEmployeesNeedingDevelopment(managerTeam);
    expect(summary.total).toBe(managerTeam.length);
    expect(summary.total).toBeLessThan(candidates.length);
  });
});

describe("getProfileCompletion", () => {
  it("computes a valid completion percentage for the full candidate pool", () => {
    const result = getProfileCompletion();
    expect(result.pct).toBeGreaterThanOrEqual(0);
    expect(result.pct).toBeLessThanOrEqual(100);
  });

  it("returns 0% for an empty pool instead of dividing by zero", () => {
    expect(getProfileCompletion([]).pct).toBe(0);
  });
});

describe("getRankedEmployees", () => {
  it("ranks by descending score for 'top', ascending for 'bottom'", () => {
    const top = getRankedEmployees("performance", "top", 5);
    expect(top.ranked).toHaveLength(5);
    expect(top.ranked.map(r => r.rank)).toEqual([1, 2, 3, 4, 5]);

    const bottom = getRankedEmployees("performance", "bottom", 5);
    expect(bottom.ranked[0].person.candidateId).not.toBe(top.ranked[0].person.candidateId);
  });

  it("excludes candidates with no measured value for the metric instead of ranking them last", () => {
    const result = getRankedEmployees("performance", "top", candidates.length);
    const withScore = candidates.filter(c => c.performance_score !== null).length;
    expect(result.ranked.length).toBe(withScore);
    expect(result.excludedNoData).toBe(candidates.length - withScore);
  });

  it("never exposes a raw score, only rank + person", () => {
    const result = getRankedEmployees("performance", "top", 3);
    result.ranked.forEach(r => {
      expect(r).not.toHaveProperty("score");
      expect(r).not.toHaveProperty("performance_score");
    });
  });

  // Regression test for the real discrepancy this surfaced: Vinicius Junior
  // ranks outside the top 5 by performance, but inside the top 5 by
  // competency — two genuinely different metrics, not a data bug. See
  // scripts/gen-tdp-data.mjs: TDP's competency-derived columns come from
  // scoreOf(id, "competency"), never from "performance".
  it("ranks 'performance' and 'competency' independently — they are different metrics", () => {
    const byPerformance = getRankedEmployees("performance", "top", 5).ranked.map(r => r.person.name);
    const byCompetency = getRankedEmployees("competency", "top", 5).ranked.map(r => r.person.name);
    expect(byPerformance).not.toEqual(byCompetency);
  });

  it("supports all 7 canonical score kinds", () => {
    const kinds = ["behavioral", "technical", "performance", "leadership", "competency", "prediction", "engagement"] as const;
    kinds.forEach(kind => {
      const result = getRankedEmployees(kind, "top", 3);
      expect(result.metric).toBe(kind);
      expect(result.ranked.length).toBeGreaterThan(0);
    });
  });

  it("reports total pool size alongside the slice", () => {
    const result = getRankedEmployees("performance", "top", 5);
    const withScore = candidates.filter(c => c.performance_score !== null).length;
    expect(result.total).toBe(withScore);
  });

  // Regression test for a real hallucination: the assistant once stated a
  // specific person's rank (17th) that didn't match either getRankedEmployees'
  // bottom-5 result or reality — because "rank" was relative to whichever
  // slice direction was requested, not absolute. Rank must now mean the same
  // thing (1 = highest score) regardless of "top" or "bottom".
  it("gives the same absolute rank for a person whether reached via 'top' or 'bottom'", () => {
    const total = getRankedEmployees("performance", "top", candidates.length).total;
    const bottomAll = getRankedEmployees("performance", "bottom", total);
    const lowestPerson = bottomAll.ranked[0];
    // The single lowest scorer via "bottom" must be rank `total` via absolute numbering.
    expect(lowestPerson.rank).toBe(total);
    const viaEmployeeRank = getEmployeeRank(lowestPerson.person.name, "performance");
    expect(viaEmployeeRank?.rank).toBe(lowestPerson.rank);
  });
});

describe("getEmployeeRank", () => {
  it("finds a person by partial name and returns their absolute rank + total", () => {
    const result = getEmployeeRank("ahmad al", "performance");
    expect(result).not.toBeNull();
    expect(result?.person.name).toBe("Ahmad Al-Faruq");
    expect(result?.rank).toBeGreaterThan(0);
    expect(result?.rank).toBeLessThanOrEqual(result!.total);
  });

  it("agrees with getRankedEmployees for the same person and metric", () => {
    const top5 = getRankedEmployees("performance", "top", 5);
    const firstPlace = top5.ranked[0];
    const viaEmployeeRank = getEmployeeRank(firstPlace.person.name, "performance");
    expect(viaEmployeeRank?.rank).toBe(1);
    expect(viaEmployeeRank?.rank).toBe(firstPlace.rank);
  });

  it("returns null for a name that doesn't exist", () => {
    expect(getEmployeeRank("Nonexistent Person", "performance")).toBeNull();
  });

  it("never exposes a raw score, only rank + total", () => {
    const result = getEmployeeRank("Ayu Lestari", "performance");
    expect(result).not.toHaveProperty("score");
    expect(result).not.toHaveProperty("performance_score");
  });

  // Regression: same class of bug as getRankedEmployees' plural mismatch —
  // a hyphen/space difference in the one hyphenated name in the dataset
  // silently returned null instead of the real person.
  it("finds a hyphenated name even when the query uses a space instead", () => {
    const result = getEmployeeRank("Ahmad Al Faruq", "performance");
    expect(result?.person.name).toBe("Ahmad Al-Faruq");
  });
});
