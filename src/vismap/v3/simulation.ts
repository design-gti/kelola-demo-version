// Model simulasi V3 — BUKAN `SimulationSwap` milik V1 (aturan copy-on-demand,
// docs/vismap-v3.md §3). V1 memodelkan satu swap sebagai sepasang id kursi dan
// menukar field personal di antaranya; itu cukup untuk "dua orang tukar kursi",
// tapi tidak bisa mengungkapkan langkah yang MENGOSONGKAN kursi (Cut & Replace)
// dan tidak bisa menjawab "siapa yang tergeser" — dua hal yang jadi inti panel
// simulasi V3 (langkah bernomor + daftar Consequences per langkah).
//
// Dua hal yang berubah dari model V1:
//
// 1. Penghuni kursi dilacak eksplisit (`occupantOf`). Di model data Vismap satu
//    baris Employee = satu KURSI berisi orang: `position`/`managerId` menempel
//    pada kursi, `name`/foto/skor menempel pada orangnya. Karena V1 memindahkan
//    orang dengan cara menukar field personal, `id` tetap milik kursi — jadi
//    setelah satu swap, id kursi bukan lagi id orangnya. Fakta yang berbasis
//    ORANG (mis. isTalent) akan menjawab tentang orang yang salah. `occupantOf`
//    memetakan kursi → id kanonik penghuninya, dan ikut berpindah bersama field
//    personal.
//
// 2. Langkah dievaluasi PROGRESIF. Panel menampilkan tiap langkah dengan
//    keadaan pada saat langkah itu dijalankan (pada sketsa: langkah #2 menyebut
//    "Strategic Officer / Jude Bellingham", padahal Jude baru duduk di sana
//    setelah langkah #1), jadi buildSimulation mengembalikan satu view per
//    langkah, bukan hanya keadaan akhir.
import type { Employee } from "../data/orgChartData";
import { isTalent } from "./employeeFacts";

/** Nama penghuni untuk kursi kosong — konvensi yang sudah dipakai kanvas. */
export const VACANT_NAME = "(Vacant)";

export type SimulationActionKind = "exchange" | "cut-replace";

export interface SimulationStep {
  id: string;
  kind: SimulationActionKind;
  /** Kursi yang akan diisi. */
  targetSeatId: string;
  /** Kursi tempat orang yang akan masuk sedang duduk sekarang. */
  incomingSeatId: string;
}

export type ConsequenceSubject = "position" | "person";

export interface Consequence {
  subject: ConsequenceSubject;
  /** Isi chip: nama jabatan (position) atau nama orang (person). */
  label: string;
  text: string;
}

export type Verdict = "good" | "at-risk";

export interface StepView {
  step: SimulationStep;
  /** Kursi target beserta penghuninya SEBELUM langkah ini dijalankan. */
  target: { position: string; personName: string };
  /** Kursi asal orang yang masuk, juga sebelum langkah ini dijalankan. */
  incoming: { position: string; personName: string };
  consequences: Consequence[];
  verdict: Verdict;
}

/** Field yang menempel pada ORANG, bukan pada kursi. */
const PERSONAL_FIELDS = [
  "name", "imageUrl", "competencyScore", "readinessScore", "performanceRating",
  "gender", "city", "maritalStatus", "iq", "capability", "commitment", "contribution",
] as const;

interface SimState {
  employees: Employee[];
  /** kursi id → id kanonik penghuni, atau null kalau kursinya kosong. */
  occupantOf: Map<string, string | null>;
}

function initialState(base: Employee[]): SimState {
  return {
    employees: base.map(e => ({ ...e })),
    // Sebelum ada langkah apa pun, id kursi memang id penghuninya (lihat
    // canonicalAdapter.ts) — kecuali kursi yang sudah kosong dari datanya.
    occupantOf: new Map(base.map(e => [e.id, isVacantName(e.name) ? null : e.id])),
  };
}

export function isVacantName(name?: string): boolean {
  return name === VACANT_NAME || !name?.trim();
}

/** Kesiapan seorang penghuni kursi — formula yang sama dengan kartu V3/V1. */
export function seatReadiness(seat: Employee): number {
  if (seat.readinessScore != null) return seat.readinessScore;
  const s = seat.competencyScore;
  if (s >= 91) return Math.round(s * 0.92);
  if (s >= 76) return Math.round(s * 0.88);
  if (s >= 66) return Math.round(s * 0.80);
  return Math.round(s * 0.72);
}

/** Jumlah bawahan langsung yang kesiapannya sudah masuk range READY. */
function readySuccessorCount(employees: Employee[], seatId: string, readyMin: number): number {
  return employees.filter(e =>
    e.managerId === seatId && !isVacantName(e.name) && seatReadiness(e) >= readyMin
  ).length;
}

function movePerson(from: Employee, to: Employee): void {
  const src = from as unknown as Record<string, unknown>;
  const dst = to as unknown as Record<string, unknown>;
  for (const field of PERSONAL_FIELDS) dst[field] = src[field];
}

function vacate(seat: Employee): void {
  const row = seat as unknown as Record<string, unknown>;
  row.name = VACANT_NAME;
  row.imageUrl = undefined;
  row.readinessScore = undefined;
  row.performanceRating = undefined;
  // competencyScore wajib angka di tipe Employee; 0 dibaca kanvas sebagai
  // "tidak ada data" karena kartu kosong memang tidak menampilkan skor.
  row.competencyScore = 0;
}

function runStep(state: SimState, step: SimulationStep): void {
  const target = state.employees.find(e => e.id === step.targetSeatId);
  const incoming = state.employees.find(e => e.id === step.incomingSeatId);
  if (!target || !incoming || target.id === incoming.id) return;

  const displacedOccupant = state.occupantOf.get(target.id) ?? null;
  const incomingOccupant = state.occupantOf.get(incoming.id) ?? null;
  const displacedSnapshot = { ...target };

  movePerson(incoming, target);
  state.occupantOf.set(target.id, incomingOccupant);

  if (step.kind === "exchange") {
    // Yang tergeser pindah ke kursi yang baru ditinggalkan — tidak ada yang
    // keluar dari struktur.
    movePerson(displacedSnapshot, incoming);
    state.occupantOf.set(incoming.id, displacedOccupant);
  } else {
    // Cut & Replace: kursi asal jadi kosong dan orang yang tergeser keluar
    // dari struktur.
    vacate(incoming);
    state.occupantOf.set(incoming.id, null);
  }
}

function consequencesFor(
  step: SimulationStep,
  before: SimState,
  after: SimState,
  readyMin: number,
): Consequence[] {
  const out: Consequence[] = [];

  // 1. Posisi yang kehilangan suksesor siap. Dihitung untuk SEMUA kursi yang
  //    punya bawahan, bukan hanya dua kursi yang tersentuh: memindahkan orang
  //    keluar dari sebuah tim menurunkan kesiapan suksesi ATASANNYA, dan itu
  //    justru efek yang tidak terlihat di kanvas.
  for (const seat of before.employees) {
    const wasReady = readySuccessorCount(before.employees, seat.id, readyMin);
    if (wasReady === 0) continue;
    const nowReady = readySuccessorCount(after.employees, seat.id, readyMin);
    if (nowReady < wasReady) {
      out.push({
        subject: "position",
        label: seat.position,
        text: "Semakin berisiko karena successornya berkurang.",
      });
    }
  }

  // 2. Orang yang tergeser keluar dari struktur, padahal dia talent.
  if (step.kind === "cut-replace") {
    const displacedId = before.occupantOf.get(step.targetSeatId) ?? null;
    const displacedSeat = before.employees.find(e => e.id === step.targetSeatId);
    if (displacedId && isTalent(displacedId) && displacedSeat) {
      out.push({
        subject: "person",
        label: displacedSeat.name,
        text: "Adalah talent, dan menggantikannya berarti Anda kehilangan seorang yang potensial.",
      });
    }
  }

  // 3. Kursi yang jadi kosong setelah langkah ini.
  for (const seat of after.employees) {
    const wasFilled = !isVacantName(before.employees.find(e => e.id === seat.id)?.name);
    if (wasFilled && isVacantName(seat.name)) {
      out.push({
        subject: "position",
        label: seat.position,
        text: "Menjadi kosong setelah langkah ini.",
      });
    }
  }

  // 4. Kesiapan orang yang masuk masih di bawah range READY untuk kursi itu.
  const filled = after.employees.find(e => e.id === step.targetSeatId);
  if (filled && !isVacantName(filled.name)) {
    const readiness = seatReadiness(filled);
    if (readiness < readyMin) {
      out.push({
        subject: "person",
        label: filled.name,
        text: `Kesiapannya baru ${readiness}%, di bawah ambang siap (${readyMin}%) untuk posisi ini.`,
      });
    }
  }

  return out;
}

/**
 * Menjalankan seluruh langkah di atas `base` dan mengembalikan keadaan akhir
 * plus satu view per langkah. `readyMin` datang dari range READY di Setting
 * Heatmap Condition, bukan ambang sendiri, supaya "suksesor siap" di panel
 * simulasi berarti sama dengan yang dibaca kanvas.
 */
export function buildSimulation(
  base: Employee[],
  steps: SimulationStep[],
  readyMin: number,
): { employees: Employee[]; views: StepView[] } {
  const state = initialState(base);
  const views: StepView[] = [];

  for (const step of steps) {
    const target = state.employees.find(e => e.id === step.targetSeatId);
    const incoming = state.employees.find(e => e.id === step.incomingSeatId);
    if (!target || !incoming) continue;

    const snapshot: SimState = {
      employees: state.employees.map(e => ({ ...e })),
      occupantOf: new Map(state.occupantOf),
    };
    const view = {
      target: { position: target.position, personName: target.name },
      incoming: { position: incoming.position, personName: incoming.name },
    };

    runStep(state, step);

    const consequences = consequencesFor(step, snapshot, state, readyMin);
    views.push({
      step,
      ...view,
      consequences,
      verdict: consequences.length > 0 ? "at-risk" : "good",
    });
  }

  return { employees: state.employees, views };
}
