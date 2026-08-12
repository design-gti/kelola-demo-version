import { describe, expect, it } from "vitest";
import { findPositionHolders } from "./positions";

describe("findPositionHolders", () => {
  it("matches a position by its acronym", () => {
    const result = findPositionHolders("CEO");
    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.matches[0].position).toBe("Chief Executive Officer");
  });

  it("matches a position by its full title, case-insensitively", () => {
    const result = findPositionHolders("chief executive officer");
    expect(result.matches.length).toBeGreaterThan(0);
  });

  it("matches a position by a partial title", () => {
    const result = findPositionHolders("Head of Engineering");
    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.matches[0].position).toBe("Head of Engineering");
  });

  it("returns no matches for a query with no corresponding position", () => {
    const result = findPositionHolders("Chief Astronaut Officer");
    expect(result.matches).toHaveLength(0);
  });

  // Regression test: "Operation Analyst" (singular) returned zero matches
  // even though "Operations Analyst" (Ahmad Al-Faruq's real title, verified
  // against src/data/model/generated.ts) exists — the old substring-only
  // match requires an exact contiguous match, so a single missing "s" broke
  // it silently instead of still finding the position.
  it("matches a title despite a singular/plural mismatch", () => {
    const result = findPositionHolders("Operation Analyst");
    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.matches[0].position).toBe("Operations Analyst");
    expect(result.matches[0].name).toBe("Bintang Mahesa");
  });

  it("does not over-match unrelated titles that share only one word", () => {
    const result = findPositionHolders("Operation Manager");
    expect(result.matches.every(m => m.position === "Operations Manager")).toBe(true);
  });
});
