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

  it("only counts Expired entries as overdue, never a Completed one with a stale due date", async () => {
    const summary = await getIdpStatusSummary();
    const entries = await getIdpEntries();
    const expectedOverdue = entries.filter(e => e.status === "Expired");
    expect(summary.overdue.length).toBe(expectedOverdue.length);
    expect(summary.overdue.every(o => entries.find(e => e.id === o.id)?.status === "Expired")).toBe(true);
  });

  it("upgrades a not-yet-Completed entry to Expired once its due date has passed, matching MonitoringIDPCard.tsx", async () => {
    const entries = await getIdpEntries();
    const today = new Date();
    entries.forEach(e => {
      if (e.status !== "Completed" && e.dueDate && isOverdue(e.dueDate, today)) {
        expect(e.status).toBe("Expired");
      }
    });
  });
});
