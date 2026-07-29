import { describe, expect, it } from "vitest";
import { getIdpEntries, getIdpStatusSummary, isOverdue } from "./idp";

describe("getIdpEntries", () => {
  it("reads real entries from public/data/idp-data.json, not a hand-authored fixture", async () => {
    const entries = await getIdpEntries();
    expect(entries.length).toBeGreaterThan(0);
    entries.forEach(e => {
      expect(typeof e.name).toBe("string");
      expect(["In Progress", "Expired", "Need Review", "Completed"]).toContain(e.status);
    });
  });
});

describe("getIdpStatusSummary", () => {
  it("counts add up to the total", async () => {
    const summary = await getIdpStatusSummary();
    const sum = Object.values(summary.byStatus).reduce((a, b) => a + b, 0);
    expect(sum).toBe(summary.total);
  });

  it("only counts non-Expired, past-due entries as overdue", async () => {
    const summary = await getIdpStatusSummary();
    const entries = await getIdpEntries();
    const today = new Date(summary.asOf);
    const expectedOverdue = entries.filter(e => e.status !== "Expired" && isOverdue(e.dueDate, today));
    expect(summary.overdue.length).toBe(expectedOverdue.length);
  });
});
