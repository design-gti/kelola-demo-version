// Ringkasan sebaran di halaman Talent Mapping: satu tag yang dipakai box, satu
// batang. Aturan itu yang dibaca user, jadi ia dijaga di sini — termasuk dua
// keranjang tambahan yang hanya boleh muncul kalau memang ada orang di dalamnya.
import { describe, expect, it } from "vitest";
import { donutTags, makeConfigById, TALENT_TAG, type TMConfig, type TMPoint } from "./talentMappingShared";

/** Titik palsu: yang dipakai donutTags cuma `order`. */
const pointIn = (order: number | null, i: number): TMPoint => ({
  employeeId: `p${i}`,
  name: `Orang ${i}`,
  positionTitle: "-",
  team: "-",
  rawX: 1,
  rawY: 1,
  x: 0,
  y: 0,
  order,
});

/** Satu titik untuk setiap box, plus titik tambahan sesuai `extra`. */
const spread = (cfg: TMConfig, extra: (number | null)[] = []): TMPoint[] => [
  ...cfg.boxes.map((b, i) => pointIn(b.order, i)),
  ...extra.map((o, i) => pointIn(o, 1000 + i)),
];

const distinctTags = (cfg: TMConfig) =>
  [...new Set(cfg.boxes.map(b => b.readiness).filter(Boolean))];

describe("donutTags — satu tag satu batang", () => {
  it("Talent Identification memberi tag pada SEMUA box", () => {
    const cfg = makeConfigById("TI");
    expect(cfg.boxes.every(b => !!b.readiness)).toBe(true);
    // Tanpa ini, orang di box tak bertag jatuh ke keranjang "Tanpa Tag" dan
    // ringkasannya berhenti bercerita soal kategori.
  });

  it("box bertanda talent tetap memakai tag Talent", () => {
    const cfg = makeConfigById("TI");
    cfg.boxes.filter(b => b.tag === "talent").forEach(b => {
      expect(b.readiness).toBe(TALENT_TAG);
    });
  });

  it("jumlah batang = jumlah tag yang dipakai box", () => {
    const cfg = makeConfigById("TI");
    const bars = donutTags(cfg, spread(cfg));
    expect(bars.map(b => b.name).sort()).toEqual(distinctTags(cfg).sort());
  });

  it("menambah satu tag baru menambah satu batang", () => {
    const base = makeConfigById("TI");
    const before = donutTags(base, spread(base)).length;

    // Box yang dipilih harus BERBAGI tag dengan box lain. Kalau ia satu-satunya
    // pemakai tag itu, mengganti tagnya cuma menukar — satu tag hilang, satu
    // muncul — dan jumlah batangnya tidak berubah.
    const shared = base.boxes.find(
      b => base.boxes.filter(x => x.readiness === b.readiness).length > 1,
    );
    expect(shared).toBeDefined();
    const cfg: TMConfig = {
      ...base,
      boxes: base.boxes.map(b => (b.order === shared!.order ? { ...b, readiness: "Ready Now" } : b)),
    };
    const after = donutTags(cfg, spread(cfg));

    expect(after.length).toBe(before + 1);
    expect(after.map(b => b.name)).toContain("Ready Now");
  });

  it("setiap orang terhitung tepat sekali", () => {
    const cfg = makeConfigById("TI");
    const points = spread(cfg, [null, null, 1]);
    const total = donutTags(cfg, points).reduce((n, b) => n + b.value, 0);
    expect(total).toBe(points.length);
  });

  it("keranjang tambahan hanya muncul kalau berisi", () => {
    const cfg = makeConfigById("TI");
    const rapi = donutTags(cfg, spread(cfg)).map(b => b.name);
    expect(rapi).not.toContain("No Data");
    expect(rapi).not.toContain("Tanpa Tag");

    const adaLuar = donutTags(cfg, spread(cfg, [null])).map(b => b.name);
    expect(adaLuar).toContain("No Data");

    const tanpaTag: TMConfig = {
      ...cfg,
      boxes: cfg.boxes.map(b => (b.order === 1 ? { ...b, readiness: null } : b)),
    };
    expect(donutTags(tanpaTag, spread(tanpaTag)).map(b => b.name)).toContain("Tanpa Tag");
  });

  it("warna batang diambil dari box pemilik tagnya", () => {
    const cfg = makeConfigById("TI");
    donutTags(cfg, spread(cfg)).forEach(bar => {
      const box = cfg.boxes.find(b => b.readiness === bar.name);
      if (box) expect(bar.color).toBe(box.color);
    });
  });
});
