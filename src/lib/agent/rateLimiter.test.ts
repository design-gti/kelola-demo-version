import { describe, it, expect } from "vitest";
import { checkRateLimit } from "./rateLimiter";

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

describe("checkRateLimit", () => {
  it("allows requests under both limits", () => {
    const key = "burst-allow";
    const result = checkRateLimit(key, 0);
    expect(result.allowed).toBe(true);
  });

  it("denies once the per-minute burst limit is exceeded", () => {
    const key = "burst-deny";
    let last;
    for (let i = 0; i < 20; i++) last = checkRateLimit(key, 1_000);
    expect(last!.allowed).toBe(true);

    const blocked = checkRateLimit(key, 1_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.reason).toBe("burst");
  });

  it("recovers once the burst window passes, without touching the daily count", () => {
    const key = "burst-recover";
    for (let i = 0; i < 20; i++) checkRateLimit(key, 0);
    expect(checkRateLimit(key, 0).allowed).toBe(false);

    const later = checkRateLimit(key, MINUTE + 1);
    expect(later.allowed).toBe(true);
  });

  it("denies once the daily ceiling is exceeded, even when spread outside the burst window", () => {
    const key = "daily-deny";
    let last;
    for (let i = 0; i < 300; i++) last = checkRateLimit(key, i * (MINUTE + 1));
    expect(last!.allowed).toBe(true);

    const blocked = checkRateLimit(key, 300 * (MINUTE + 1));
    expect(blocked.allowed).toBe(false);
    expect(blocked.reason).toBe("daily");
  });

  it("resets the daily count once a full day has passed", () => {
    const key = "daily-recover";
    for (let i = 0; i < 300; i++) checkRateLimit(key, i * (MINUTE + 1));
    expect(checkRateLimit(key, 300 * (MINUTE + 1)).allowed).toBe(false);

    const nextDay = checkRateLimit(key, 300 * (MINUTE + 1) + DAY + 1);
    expect(nextDay.allowed).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const a = "isolated-a";
    const b = "isolated-b";
    for (let i = 0; i < 20; i++) checkRateLimit(a, 2_000);
    expect(checkRateLimit(a, 2_000).allowed).toBe(false);
    expect(checkRateLimit(b, 2_000).allowed).toBe(true);
  });
});
