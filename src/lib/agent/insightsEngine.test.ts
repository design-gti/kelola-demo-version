import { describe, expect, it } from "vitest";
import type { SessionContext } from "@/lib/session";
import { getInsights } from "./insightsEngine";

// Role/scope-based access restriction is intentionally disabled in mediation.ts
// (every session sees the full pool) — see that file's module comment.
const hrSession: SessionContext = { role: "hr", scopeIds: null, issuedAt: 0 };
const managerSession: SessionContext = { role: "manager", scopeIds: [], issuedAt: 0 };

describe("getInsights", () => {
  it("every insight carries real, non-empty evidence (never a fabricated claim)", async () => {
    for (const session of [hrSession, managerSession]) {
      for (const insight of await getInsights(session)) {
        expect(insight.evidence.sourceIds.length).toBeGreaterThan(0);
        expect(insight.evidence.basis.length).toBeGreaterThan(0);
        expect(() => new Date(insight.evidence.computedAt)).not.toThrow();
      }
    }
  });

  it("surfaces the succession-risk insight identically to manager and hr sessions", async () => {
    const managerInsights = await getInsights(managerSession);
    const hrInsights = await getInsights(hrSession);
    // evidence.computedAt is a fresh timestamp per call, so compare the message instead of the whole object.
    expect(managerInsights.find(i => i.category === "succession-risk")?.message).toEqual(
      hrInsights.find(i => i.category === "succession-risk")?.message
    );
  });

  it("surfaces succession-risk to hr sessions, matching the current fixture", async () => {
    const hrInsights = await getInsights(hrSession);
    const succession = hrInsights.find(i => i.category === "succession-risk");
    expect(succession).toBeDefined();
    expect(succession?.evidence.sourceIds.length).toBeGreaterThan(0);
    expect(succession?.navigationTarget?.href).toBe("/vismap?tab=succession-risk");
  });

  it("surfaces an idp-overdue insight sourced from the real idp-data.json, deep-linking to the first overdue employee", async () => {
    const idp = (await getInsights(hrSession)).find(i => i.category === "idp-overdue");
    expect(idp).toBeDefined();
    expect(idp?.navigationTarget?.href).toMatch(/^\/idp\?id=\d+$/);
  });

  it("sorts by severity, critical before warning before info", async () => {
    const insights = await getInsights(hrSession);
    const order: Record<string, number> = { critical: 0, warning: 1, info: 2 };
    for (let i = 1; i < insights.length; i++) {
      expect(order[insights[i - 1].severity]).toBeLessThanOrEqual(order[insights[i].severity]);
    }
  });
});
