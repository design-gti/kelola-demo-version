import { describe, expect, it } from "vitest";
import type { SessionContext } from "@/lib/session";
import { candidates } from "@/data/dummyData";
import {
  bandReadinessGap,
  bandScore,
  getAgentDataQualityView,
  getAgentDevelopmentView,
  getAgentEmployeeRankView,
  getAgentIdpStatusView,
  getAgentOrgHierarchyView,
  getAgentPersonalityView,
  getAgentPositionHolderView,
  getAgentProfileCompletionView,
  getAgentRankedEmployeesView,
  getAgentSuccessionRiskView,
  getAgentTalentMappingView,
  getAgentTeamOverviewView,
} from "./mediation";

// Role/scope-based access restriction is intentionally disabled in mediation.ts
// (every session sees the full pool) — see that file's module comment. These
// two sessions should therefore behave identically everywhere below.
const hrSession: SessionContext = { role: "hr", scopeIds: null, issuedAt: 0 };
const managerSession: SessionContext = { role: "manager", scopeIds: [], issuedAt: 0 };

describe("bandScore / bandReadinessGap", () => {
  it("bands performance scores without exposing the raw number", () => {
    expect(bandScore(null)).toBe("not_assessed");
    expect(bandScore(55)).toBe("needs_review");
    expect(bandScore(70)).toBe("meets");
    expect(bandScore(90)).toBe("exceeds");
  });

  it("bands readiness gaps using the same 25-point threshold as the succession-risk card", () => {
    expect(bandReadinessGap(30)).toBe("large_gap");
    expect(bandReadinessGap(15)).toBe("moderate_gap");
    expect(bandReadinessGap(5)).toBe("ready_soon");
  });
});

describe("getAgentSuccessionRiskView", () => {
  it("matches the dashboard's real numbers, identically for every session", () => {
    const view = getAgentSuccessionRiskView(hrSession);
    expect(view).not.toBeNull();
    expect(view?.positionsTotal).toBe(5);
    expect(view?.positionsAtRisk).toBeGreaterThan(0);
    expect(view?.positionsAtRisk).toBeLessThanOrEqual(view!.positionsTotal);
    // Bands, not raw gap numbers, on every successor.
    view?.atRisk.forEach(p => p.successors.forEach(s => expect(["large_gap", "moderate_gap", "ready_soon"]).toContain(s.readinessBand)));
  });

  it("is not hidden from manager sessions — restriction is intentionally disabled", () => {
    // asOf is a fresh timestamp per call, so compare atRisk instead of the whole object.
    expect(getAgentSuccessionRiskView(managerSession)?.atRisk).toEqual(getAgentSuccessionRiskView(hrSession)?.atRisk);
  });
});

describe("getAgentDevelopmentView", () => {
  it("scopes total to the full candidate pool regardless of session role", () => {
    const hrView = getAgentDevelopmentView(hrSession);
    const managerView = getAgentDevelopmentView(managerSession);
    expect(hrView.total).toBe(candidates.length);
    expect(managerView.total).toBe(candidates.length);
  });
});

describe("getAgentProfileCompletionView", () => {
  it("returns a valid percentage for an unscoped hr session", () => {
    const pct = getAgentProfileCompletionView(hrSession).pct;
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(100);
  });
});

describe("getAgentPersonalityView", () => {
  it("returns a candidate's dominant type + static guidance, never raw axis scores", () => {
    const view = getAgentPersonalityView(hrSession, candidates[0].id);
    expect(view).not.toBeNull();
    expect(view).not.toHaveProperty("discScores");
    expect(view).not.toHaveProperty("axes");
    if (view?.dominantType) {
      expect(view.guidance).toEqual(
        expect.objectContaining({ relationship: expect.any(String), communicate: expect.any(String), avoid: expect.any(String) })
      );
    }
  });

  it("allows a manager session to see any candidate — restriction is intentionally disabled", () => {
    expect(getAgentPersonalityView(managerSession, candidates[0].id)).not.toBeNull();
  });

  it("returns null only for an id that doesn't exist at all", () => {
    expect(getAgentPersonalityView(hrSession, "nonexistent-id")).toBeNull();
  });
});

describe("getAgentPositionHolderView", () => {
  it("finds a position holder by acronym, identically for every session", () => {
    const view = getAgentPositionHolderView(hrSession, "CEO");
    expect(view.matches.length).toBeGreaterThan(0);
    expect(view.matches[0].position).toBe("Chief Executive Officer");
    expect(getAgentPositionHolderView(managerSession, "CEO").matches).toEqual(view.matches);
  });

  it("returns no matches for a position that doesn't exist, never fabricating one", () => {
    expect(getAgentPositionHolderView(hrSession, "Chief Astronaut Officer").matches).toHaveLength(0);
  });
});

describe("getAgentIdpStatusView", () => {
  it("returns counts that add up to the total, identically for every session", async () => {
    const view = await getAgentIdpStatusView(hrSession);
    const sum = Object.values(view.byStatus).reduce((a, b) => a + b, 0);
    expect(sum).toBe(view.total);
    // asOf is a fresh timestamp per call, so compare everything else instead of the whole object.
    const managerView = await getAgentIdpStatusView(managerSession);
    expect(managerView.total).toBe(view.total);
    expect(managerView.byStatus).toEqual(view.byStatus);
    expect(managerView.overdue).toEqual(view.overdue);
  });
});

describe("getAgentTalentMappingView", () => {
  it("maps every candidate with complete data into exactly one of the 9 boxes", () => {
    const view = getAgentTalentMappingView(hrSession);
    expect(view.distribution).toHaveLength(9);
    const boxed = view.distribution.reduce((sum, b) => sum + b.count, 0);
    expect(boxed + view.noData).toBe(view.total);
    expect(view.total).toBe(candidates.length);
  });
});

describe("getAgentTeamOverviewView", () => {
  it("finds a team by partial, case-insensitive name and bands its averages", () => {
    const view = getAgentTeamOverviewView(hrSession, "engineering");
    expect(view).not.toBeNull();
    expect(view?.teamName).toBe("Engineering Team");
    expect(view?.memberCount).toBeGreaterThan(0);
    if (view?.avgPerformanceBand) {
      expect(["needs_review", "meets", "exceeds", "not_assessed"]).toContain(view.avgPerformanceBand);
    }
  });

  it("returns null for a team name that doesn't exist", () => {
    expect(getAgentTeamOverviewView(hrSession, "Nonexistent Team")).toBeNull();
  });

  // Regression: same class of bug fixed in positions.ts — "Operation Team"
  // (singular) returned null even though "Operations Team" is a real team.
  it("finds a team despite a singular/plural mismatch", () => {
    const view = getAgentTeamOverviewView(hrSession, "Operation Team");
    expect(view?.teamName).toBe("Operations Team");
  });
});

describe("getAgentDataQualityView", () => {
  it("returns alerts grouped by urgency, identically for every session", () => {
    const view = getAgentDataQualityView(hrSession);
    view.alerts.forEach(a => expect(["Critical", "High", "Normal"]).toContain(a.urgency));
    // asOf is a fresh timestamp per call, so compare the alerts instead of the whole object.
    expect(getAgentDataQualityView(managerSession).alerts).toEqual(view.alerts);
  });
});

describe("getAgentRankedEmployeesView", () => {
  it("answers a 'top N by performance' query — the gap this was built to close", () => {
    const view = getAgentRankedEmployeesView(hrSession, "performance", "top", 5);
    expect(view.ranked).toHaveLength(5);
    expect(view.ranked[0].rank).toBe(1);
  });

  it("is identical regardless of session role — restriction is intentionally disabled", () => {
    const hrView = getAgentRankedEmployeesView(hrSession, "technical", "bottom", 3);
    const managerView = getAgentRankedEmployeesView(managerSession, "technical", "bottom", 3);
    expect(managerView.ranked).toEqual(hrView.ranked);
  });
});

describe("getAgentOrgHierarchyView", () => {
  it("resolves a manager + direct reports, identically for every session", () => {
    const view = getAgentOrgHierarchyView(hrSession, "Ayu Lestari");
    expect(view.person?.name).toBe("Ayu Lestari");
    expect(getAgentOrgHierarchyView(managerSession, "Ayu Lestari")).toEqual(view);
  });
});

describe("getAgentEmployeeRankView", () => {
  it("answers the exact question that previously got a hallucinated answer", () => {
    const view = getAgentEmployeeRankView(hrSession, "Ahmad Al-Faruq", "performance");
    expect(view).not.toBeNull();
    expect(view?.person.name).toBe("Ahmad Al-Faruq");
    // Nilai nyata, dihitung dari kolom `performance` di participants.csv —
    // sumber yang dipakai getEmployeeRank. Sengaja BUKAN tdp-employees.csv:
    // kolom Performance di sana diturunkan lewat rumus lain dan memberi
    // peringkat berbeda untuk orang yang sama.
    expect(view?.rank).toBe(55);
  });

  it("is identical regardless of session role — restriction is intentionally disabled", () => {
    const hrView = getAgentEmployeeRankView(hrSession, "Ayu Lestari", "performance");
    const managerView = getAgentEmployeeRankView(managerSession, "Ayu Lestari", "performance");
    // asOf is a fresh timestamp per call, so compare everything else instead of the whole object.
    expect(managerView?.person).toEqual(hrView?.person);
    expect(managerView?.rank).toBe(hrView?.rank);
    expect(managerView?.total).toBe(hrView?.total);
  });
});
