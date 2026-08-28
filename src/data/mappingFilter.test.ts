// Saringan tiap tab dipakai DUA tampilan: halaman Talent Mapping dan tampilan
// Semua Mapping. Tes ini menjaga hal yang paling mudah rusak diam-diam di sana:
// tab yang sumbunya sama tapi pita bawaannya berbeda harus menghasilkan
// kumpulan orang yang berbeda. Kalau tidak, keempat grafik di Semua Mapping
// tergambar identik dan tampilan itu kehilangan seluruh gunanya.
import { describe, expect, it } from "vitest";
import { getEffectiveConfig } from "./talentMappingConfig";
import { applyFilter, emptyFilter, filterCount, pointsFrom, type EmployeeMetrics } from "./talentMappingShared";

/** Orang semu dengan Potency yang tersebar merata di ketiga pita. */
const metrics: EmployeeMetrics[] = Array.from({ length: 30 }, (_, i) => ({
  employeeId: `p${i}`,
  name: `Orang ${i}`,
  positionTitle: i % 2 ? "Analis" : "Manajer",
  // Tim sengaja TIDAK sejajar dengan pita Potency (i % 3): kalau sejajar,
  // seluruh penghuni satu pita kebetulan satu tim, dan tes saringan tim di
  // bawah lolos tanpa membuktikan apa pun.
  team: i % 2 ? "Alpha" : "Beta",
  technical_score: 80,
  performance_score: 80,
  leadership_score: i % 3 === 0 ? 50 : i % 3 === 1 ? 80 : 95,
  behavioral_score: 70,
}));

const pointsFor = (id: string) => {
  const cfg = getEffectiveConfig(id);
  return applyFilter(cfg, pointsFrom(cfg, metrics), emptyFilter(cfg));
};

describe("saringan bawaan tab Po", () => {
  it("memisahkan orang berdasarkan pita Potency-nya", () => {
    const hi = pointsFor("HIPO").length;
    const mid = pointsFor("MIPO").length;
    const low = pointsFor("LOPO").length;
    const all = pointsFor("TI").length;

    expect(all).toBe(metrics.length);
    // Tiga tab Po membagi habis orang yang sama, tanpa tumpang tindih.
    expect(hi + mid + low).toBe(all);
    [hi, mid, low].forEach(n => expect(n).toBeGreaterThan(0));
  });

  it("tab Po berangkat dengan satu kriteria menyala, TI tanpa kriteria", () => {
    const hipo = getEffectiveConfig("HIPO");
    const ti = getEffectiveConfig("TI");
    expect(filterCount(hipo, emptyFilter(hipo))).toBe(1);
    expect(filterCount(ti, emptyFilter(ti))).toBe(0);
  });

  it("saringan tim dan jabatan berlaku bersama saringan pita", () => {
    const cfg = getEffectiveConfig("HIPO");
    const base = pointsFrom(cfg, metrics);
    const f = { ...emptyFilter(cfg), teams: ["Alpha"] };
    const got = applyFilter(cfg, base, f);
    expect(got.length).toBeGreaterThan(0);
    expect(got.every(p => p.team === "Alpha")).toBe(true);
    expect(got.length).toBeLessThan(applyFilter(cfg, base, emptyFilter(cfg)).length);
  });
});
