import { describe, expect, it } from "vitest";
import { matchesFuzzy } from "./textMatch";

describe("matchesFuzzy", () => {
  it("matches exact and case-insensitive queries", () => {
    expect(matchesFuzzy("Operations Analyst", "operations analyst")).toBe(true);
  });

  it("matches a partial/substring query", () => {
    expect(matchesFuzzy("Senior Finance Analyst", "Finance")).toBe(true);
  });

  it("matches an acronym query", () => {
    expect(matchesFuzzy("Chief Executive Officer", "CEO")).toBe(true);
  });

  // Regression: "Operation Analyst" returned zero matches for the real
  // title "Operations Analyst" (Son Heung-min) — a plain substring check
  // requires an exact contiguous run of characters, so a single missing
  // "s" silently broke it.
  it("matches despite a singular/plural mismatch", () => {
    expect(matchesFuzzy("Operations Analyst", "Operation Analyst")).toBe(true);
    expect(matchesFuzzy("Operations Team", "Operation Team")).toBe(true);
  });

  it("does not let a short shared word over-match a different title", () => {
    expect(matchesFuzzy("Operations Manager", "Operation Analyst")).toBe(false);
  });

  // Regression: same class of bug as the plural mismatch, surfaced for the
  // one hyphenated name in the dataset (Son Heung-min) — a query typed
  // with a space instead of a hyphen returned nothing.
  it("matches despite a hyphen/space mismatch", () => {
    expect(matchesFuzzy("Son Heung-min", "Son Heung Min")).toBe(true);
    expect(matchesFuzzy("Son Heung-min", "son heung min")).toBe(true);
  });

  it("does not match an unrelated query", () => {
    expect(matchesFuzzy("Chief Executive Officer", "Chief Astronaut Officer")).toBe(false);
  });

  it("does not match an empty query", () => {
    expect(matchesFuzzy("Chief Executive Officer", "")).toBe(false);
    expect(matchesFuzzy("Chief Executive Officer", "   ")).toBe(false);
  });
});
