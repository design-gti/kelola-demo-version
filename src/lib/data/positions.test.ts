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

  // Regression test: kueri bentuk tunggal ("Operation Lead") dulu mengembalikan
  // nol hasil padahal "Operations Lead" ada — pencocokan lama menuntut potongan
  // teks yang sama persis, jadi satu huruf "s" saja sudah mematahkannya tanpa
  // pesan apa pun.
  it("matches a title despite a singular/plural mismatch", () => {
    const result = findPositionHolders("Operation Lead");
    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.matches[0].position).toBe("Operations Lead");
    expect(result.matches[0].name).toBe("Ratna Juwita");
  });

  it("does not over-match unrelated titles that share only one word", () => {
    // "Operation Lead" tidak boleh ikut menarik "Recruitment Lead" atau
    // "Backend Lead" cuma karena sama-sama mengandung kata "Lead".
    const result = findPositionHolders("Operation Lead");
    expect(result.matches.length).toBeGreaterThan(0);
    expect(result.matches.every(m => m.position === "Operations Lead")).toBe(true);
  });
});
