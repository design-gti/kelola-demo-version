import { describe, expect, it } from "vitest";
import config from "./next.config";

describe("headers()", () => {
  it("hanya mengizinkan host Integro meng-iframe demo ini, tidak kurang tidak lebih", async () => {
    const entries = await config.headers!();
    const csp = entries
      .flatMap((entry) => entry.headers)
      .find((header) => header.key === "Content-Security-Policy");

    expect(csp).toBeDefined();

    // Parse nilai frame-ancestors dari CSP header
    // Contoh: "frame-ancestors 'self' https://... https://... https://...;"
    const cspValue = csp!.value;
    const match = cspValue.match(/frame-ancestors\s+([^;]+);/);
    expect(match).toBeDefined();

    const tokens = match![1].split(/\s+/).filter((t) => t.length > 0);

    // Himpunan yang diharapkan: 'self' + tiga domain Integro
    const expectedTokens = [
      "'self'",
      "https://*.talentlytica.net",
      "https://*.talentlytic.com",
      "https://*.talentlytica.app",
    ];

    // Uji bahwa tokens memiliki PERSIS elemen yang sama (tidak kurang tidak lebih)
    expect(tokens.sort()).toEqual(expectedTokens.sort());
  });

  it("memasang header itu ke semua path", async () => {
    const entries = await config.headers!();

    expect(entries.some((entry) => entry.source === "/:path*")).toBe(true);
  });
});
