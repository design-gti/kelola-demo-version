import { describe, it, expect } from "vitest";
import type { OrgChartNode } from "../data/orgChartData";
import { buildHistory } from "./orgHistory";

/*
 * Yang dikunci di sini adalah janji utama riwayat dummy: checkpoint terakhir HARUS
 * identik dengan struktur yang sedang tampil. Kalau tidak, "Hari ini" di timeline
 * memperlihatkan organisasi yang berbeda dari yang dilihat user di kanvas — bug
 * yang mudah lolos dari pandangan mata karena isinya ratusan kartu.
 */

let n = 0;
const seat = (position: string, reports: OrgChartNode[] = []): OrgChartNode => {
  const id = `s${++n}`;
  return {
    id,
    name: `Orang ${id}`,
    position,
    jobTitle: position,
    competencyScore: 70,
    successors: 0,
    reports,
  };
};

/** Pohon 4 tingkat: cukup dalam supaya kandidat peristiwa (bukan root/anak root) ada. */
const tree = (): OrgChartNode[] => {
  n = 0;
  return [
    seat("CEO", [
      seat("CTO", [
        seat("Head of Engineering", [
          seat("Backend Lead", [seat("Backend #1"), seat("Backend #2"), seat("Backend #3")]),
          seat("QA Lead", [seat("QA #1"), seat("QA #2")]),
        ]),
        seat("Head of Data", [
          seat("Data Lead", [seat("Data #1"), seat("Data #2")]),
          seat("ML Lead", [seat("ML #1"), seat("ML #2")]),
        ]),
      ]),
    ]),
  ];
};

describe("buildHistory", () => {
  it("checkpoint terakhir sama persis dengan struktur hari ini", () => {
    const { checkpoints } = buildHistory(tree());
    const today = checkpoints[checkpoints.length - 1];
    expect(today.occupancy).toEqual({});
    expect(today.hiddenSeats).toEqual([]);
  });

  it("tanggalnya urut maju dan tidak beraturan jaraknya", () => {
    const { checkpoints } = buildHistory(tree());
    const days = checkpoints.map(c => new Date(`${c.date}T00:00:00Z`).getTime() / 86_400_000);
    for (let i = 1; i < days.length; i++) expect(days[i]).toBeGreaterThan(days[i - 1]);

    const gaps = days.slice(1).map((d, i) => d - days[i]);
    expect(new Set(gaps).size).toBeGreaterThan(1);
  });

  it("makin lama makin sedikit kursi yang sudah terbentuk", () => {
    const { checkpoints } = buildHistory(tree());
    const hidden = checkpoints.map(c => c.hiddenSeats.length);
    for (let i = 1; i < hidden.length; i++) expect(hidden[i]).toBeLessThanOrEqual(hidden[i - 1]);
    expect(hidden[0]).toBeGreaterThan(0);
  });

  it("setiap resign selalu berakhir pada kursi yang terisi kembali", () => {
    const { checkpoints } = buildHistory(tree());
    const resignations = checkpoints.filter(c => c.events.some(e => e.kind === "resign"));
    expect(resignations.length).toBeGreaterThan(0);

    for (const cp of resignations) {
      const resign = cp.events.find(e => e.kind === "resign")!;
      const move = cp.events.find(e => e.kind === "move");
      expect(cp.events.some(e => e.kind === "hire")).toBe(true);

      if (move) {
        // Pola beruntun: yang naik mengisi kursi yang ditinggalkan, dan kursi
        // yang DIA tinggalkan itulah yang direkrut dari luar.
        expect(move.seatId).toBe(resign.seatId);
        expect(cp.events.some(e => e.kind === "hire" && e.seatId === move.fromSeatId)).toBe(true);
      } else {
        // Pola langsung: tanpa penerus internal, kursinya sendiri yang direkrut.
        expect(cp.events.some(e => e.kind === "hire" && e.seatId === resign.seatId)).toBe(true);
      }
    }
  });

  it("kedua pola pengisian kursi sama-sama muncul di riwayat", () => {
    const { checkpoints } = buildHistory(tree());
    const resignations = checkpoints.filter(c => c.events.some(e => e.kind === "resign"));
    const beruntun = resignations.filter(c => c.events.some(e => e.kind === "move"));
    const langsung = resignations.filter(c => !c.events.some(e => e.kind === "move"));
    expect(beruntun.length).toBeGreaterThan(0);
    expect(langsung.length).toBeGreaterThan(0);
  });

  it("orang yang sudah resign tetap bisa ditemukan datanya untuk dirender", () => {
    const { checkpoints, people } = buildHistory(tree());
    for (const cp of checkpoints) {
      for (const personId of Object.values(cp.occupancy)) {
        if (personId) expect(people[personId]).toBeDefined();
      }
    }
  });
});
