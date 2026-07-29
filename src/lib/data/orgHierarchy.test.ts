import { describe, expect, it } from "vitest";
import { findOrgHierarchy } from "./orgHierarchy";

describe("findOrgHierarchy", () => {
  it("finds a person by partial, case-insensitive name and resolves their manager", () => {
    const result = findOrgHierarchy("jude bellingham");
    expect(result.person?.name).toBe("Jude Bellingham");
    expect(result.manager).not.toBeNull();
  });

  it("lists direct reports that agree with the manager relationship (symmetric)", () => {
    const result = findOrgHierarchy("Jude Bellingham");
    if (result.manager) {
      const managerView = findOrgHierarchy(result.manager.name);
      expect(managerView.directReports.map(r => r.candidateId)).toContain(result.person?.candidateId);
    }
  });

  it("returns null person for a name that doesn't exist", () => {
    const result = findOrgHierarchy("Nonexistent Person");
    expect(result.person).toBeNull();
    expect(result.manager).toBeNull();
    expect(result.directReports).toHaveLength(0);
  });

  it("returns no manager for the top of the hierarchy", () => {
    const result = findOrgHierarchy("Kylian Mbappe");
    expect(result.person?.name).toBe("Kylian Mbappe");
    expect(result.manager).toBeNull();
  });

  // Regression: a query typed with a space instead of a hyphen ("Son Heung
  // Min") returned no person at all, even though "Son Heung-min" is a real
  // participant — the old plain-substring match required an exact
  // contiguous run of characters, so the hyphen/space difference alone
  // broke it silently.
  it("finds a hyphenated name even when the query uses a space instead", () => {
    const result = findOrgHierarchy("Son Heung Min");
    expect(result.person?.name).toBe("Son Heung-min");
  });
});
