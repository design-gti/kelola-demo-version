import { describe, it, expect, vi } from "vitest";
import type { Employee } from "../data/orgChartData";

// Talent = kuadran Star pada 9-box, dan sumbernya data kanonik nyata. Di test
// id-nya dibuat sendiri, jadi keanggotaan talent di-stub supaya yang diuji
// adalah "SIAPA yang ditanyakan" — inti dari pelacakan penghuni kursi.
const talentIds = new Set(["jude"]);
vi.mock("./employeeFacts", () => ({
  isTalent: (id?: string) => !!id && talentIds.has(id),
}));

const { buildSimulation, VACANT_NAME } = await import("./simulation");

const seat = (id: string, name: string, position: string, extra: Partial<Employee> = {}): Employee => ({
  id,
  name,
  position,
  jobTitle: position,
  competencyScore: 80,
  successors: 0,
  reports: [],
  ...extra,
} as unknown as Employee);

// Id kursi = id kanonik orang yang MENDUDUKINYA DI AWAL — begitulah data
// aslinya (canonicalAdapter.ts: employee id == participant id), dan justru itu
// yang bikin pelacakan penghuni perlu: begitu ada langkah, id kursi bukan lagi
// id penghuninya.
//
// pep ← (jude, erling); jude ← (lamine, phil)
const baseOrg = (): Employee[] => [
  seat("pep", "Pep Guardiola", "Chief Executive Officer"),
  seat("jude", "Jude Bellingham", "Chief Engineering Officer", { managerId: "pep", readinessScore: 90 }),
  seat("erling", "Erling Haaland", "Strategic Officer", { managerId: "pep", readinessScore: 85 }),
  seat("lamine", "Lamine Yamal", "Frontend Lead", { managerId: "jude", readinessScore: 88 }),
  seat("phil", "Phil Foden", "Backend Lead", { managerId: "jude", readinessScore: 40 }),
];

const READY_MIN = 81;
const byId = (list: Employee[], id: string) => list.find(e => e.id === id)!;

describe("buildSimulation — exchange", () => {
  it("menukar orang antar dua kursi tanpa mengosongkan keduanya", () => {
    const { employees } = buildSimulation(
      baseOrg(),
      [{ id: "s1", kind: "exchange", targetSeatId: "jude", incomingSeatId: "erling" }],
      READY_MIN,
    );

    expect(byId(employees, "jude").name).toBe("Erling Haaland");
    expect(byId(employees, "erling").name).toBe("Jude Bellingham");
    // Struktur menempel pada kursi, bukan pada orang.
    expect(byId(employees, "jude").position).toBe("Chief Engineering Officer");
    expect(byId(employees, "erling").managerId).toBe("pep");
  });
});

describe("buildSimulation — cut & replace", () => {
  it("mengosongkan kursi asal dan mengeluarkan orang yang tergeser", () => {
    const { employees } = buildSimulation(
      baseOrg(),
      [{ id: "s1", kind: "cut-replace", targetSeatId: "erling", incomingSeatId: "lamine" }],
      READY_MIN,
    );

    expect(byId(employees, "erling").name).toBe("Lamine Yamal");
    expect(byId(employees, "lamine").name).toBe(VACANT_NAME);
    // Erling tergeser keluar — tidak muncul di kursi mana pun.
    expect(employees.map(e => e.name)).not.toContain("Erling Haaland");
  });

  it("menandai kursi yang jadi kosong sebagai consequence", () => {
    const { views } = buildSimulation(
      baseOrg(),
      [{ id: "s1", kind: "cut-replace", targetSeatId: "erling", incomingSeatId: "lamine" }],
      READY_MIN,
    );

    expect(views[0].consequences).toEqual(expect.arrayContaining([
      expect.objectContaining({ subject: "position", label: "Frontend Lead", text: expect.stringContaining("kosong") }),
    ]));
  });
});

describe("buildSimulation — consequences", () => {
  it("melaporkan atasan yang kehilangan suksesor siap", () => {
    // Lamine (88, ready) keluar dari tim chief → chief kehilangan satu suksesor siap.
    const { views } = buildSimulation(
      baseOrg(),
      [{ id: "s1", kind: "cut-replace", targetSeatId: "erling", incomingSeatId: "lamine" }],
      READY_MIN,
    );

    expect(views[0].consequences).toEqual(expect.arrayContaining([
      expect.objectContaining({
        subject: "position",
        label: "Chief Engineering Officer",
        text: expect.stringContaining("successornya berkurang"),
      }),
    ]));
  });

  it("memperingatkan kalau yang tergeser keluar adalah talent", () => {
    const { views } = buildSimulation(
      baseOrg(),
      [{ id: "s1", kind: "cut-replace", targetSeatId: "jude", incomingSeatId: "phil" }],
      READY_MIN,
    );

    expect(views[0].consequences).toEqual(expect.arrayContaining([
      expect.objectContaining({ subject: "person", label: "Jude Bellingham", text: expect.stringContaining("talent") }),
    ]));
  });

  it("menanyakan talent pada ORANGNYA, bukan pada kursi yang ia tinggalkan", () => {
    // Langkah 1 memindahkan Jude (talent) ke kursi Strategic Officer (id
    // `erling`); langkah 2 menggeser Jude keluar DARI kursi itu. Peringatan
    // talent harus tetap menyebut Jude — kalau keanggotaan talent dibaca dari
    // id kursi, `erling` bukan talent dan peringatannya hilang.
    const { views } = buildSimulation(
      baseOrg(),
      [
        { id: "s1", kind: "exchange", targetSeatId: "erling", incomingSeatId: "jude" },
        { id: "s2", kind: "cut-replace", targetSeatId: "erling", incomingSeatId: "lamine" },
      ],
      READY_MIN,
    );

    expect(views[1].consequences).toEqual(expect.arrayContaining([
      expect.objectContaining({ subject: "person", label: "Jude Bellingham", text: expect.stringContaining("talent") }),
    ]));
  });

  it("memperingatkan kalau kesiapan orang yang masuk masih di bawah ambang", () => {
    const { views } = buildSimulation(
      baseOrg(),
      [{ id: "s1", kind: "exchange", targetSeatId: "jude", incomingSeatId: "phil" }],
      READY_MIN,
    );

    expect(views[0].consequences).toEqual(expect.arrayContaining([
      expect.objectContaining({ subject: "person", label: "Phil Foden", text: expect.stringContaining("40%") }),
    ]));
  });
});

describe("buildSimulation — view per langkah", () => {
  it("menampilkan keadaan SEBELUM langkah itu, bukan keadaan awal", () => {
    const { views } = buildSimulation(
      baseOrg(),
      [
        { id: "s1", kind: "exchange", targetSeatId: "erling", incomingSeatId: "jude" },
        { id: "s2", kind: "cut-replace", targetSeatId: "erling", incomingSeatId: "lamine" },
      ],
      READY_MIN,
    );

    // Setelah #1, kursi Strategic Officer diisi Jude — itulah yang harus
    // terbaca di kotak kiri langkah #2 (persis seperti sketsanya).
    expect(views[1].target).toEqual({ position: "Strategic Officer", personName: "Jude Bellingham" });
    expect(views[1].incoming).toEqual({ position: "Frontend Lead", personName: "Lamine Yamal" });
  });

  it("memberi verdict good hanya kalau langkahnya tanpa consequence", () => {
    const { views } = buildSimulation(
      baseOrg(),
      [{ id: "s1", kind: "exchange", targetSeatId: "jude", incomingSeatId: "erling" }],
      READY_MIN,
    );

    expect(views[0].consequences).toEqual([]);
    expect(views[0].verdict).toBe("good");
  });
});
