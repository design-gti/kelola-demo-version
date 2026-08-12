import { allParticipants, getParticipant, positionOf } from "@/data/model/selectors";
import type { Participant } from "@/data/model/types";

/**
 * Model dua tingkat untuk halaman Job and Position:
 *
 *   Job      — pengelompokan; isinya departemen di participants.csv
 *              (Teknologi, Keuangan, SDM, ...). Disebut "Job" mengikuti
 *              penamaan produk, walau secara fungsi ini departemen.
 *   Position — jabatan konkret di dalam Job itu, satu baris per kursi,
 *              lengkap dengan incumbent dan atasannya.
 *
 * Semua diturunkan dari participants.csv, jadi daftarnya selalu sama dengan
 * yang dipakai Vismap, TDP, dan Team Profile — termasuk garis atasannya, yang
 * sama-sama berasal dari kolom manager_id.
 */

export type Job = {
  name: string;
  /** Tingkat jabatan tertinggi di dalamnya; 1 = paling senior (CEO). */
  level: number;
  /** Jumlah posisi (kursi) di dalam Job ini. */
  positions: number;
};

export type PositionRow = {
  title: string;
  participantId: string;
  incumbent: string;
  /** Atasan langsung: "<jabatan> | <nama>", null untuk puncak hierarki. */
  reportTo: string | null;
  /** Kedalaman di hierarki, dipakai untuk indentasi baris tabel. */
  depth: number;
};

/**
 * Tingkat jabatan diturunkan dari judulnya, karena participants.csv tidak
 * menyimpan kolom level. Ini heuristik, bukan data resmi HR — kalau nanti ada
 * kolomnya, fungsi ini yang diganti dan sisanya tetap.
 */
export function levelOf(title: string): number {
  const t = title.toLowerCase();
  if (/^(chief|ceo|cto|cfo)|(^| )vp( |$)|president/.test(t)) return 1;
  if (/head of|director|lead\b|principal/.test(t)) return 2;
  if (/manager|controller|business partner|strategist/.test(t)) return 3;
  return 4;
}

const departmentOf = (p: Participant) => positionOf(p).department;

/** Daftar Job, urut dari yang tingkat tertingginya paling senior. */
export function allJobs(): Job[] {
  const byJob = new Map<string, Participant[]>();
  for (const p of allParticipants()) {
    const dept = departmentOf(p);
    if (!dept) continue;
    const list = byJob.get(dept);
    if (list) list.push(p);
    else byJob.set(dept, [p]);
  }

  return [...byJob.entries()]
    .map(([name, members]) => ({
      name,
      // Level Job = level posisi paling senior di dalamnya, jadi Job yang
      // memuat CEO tampil sebagai level 1.
      level: Math.min(...members.map((m) => levelOf(positionOf(m).title))),
      positions: members.length,
    }))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
}

export function findJob(name: string): Job | null {
  return allJobs().find((j) => j.name === name) ?? null;
}

/**
 * Posisi di dalam satu Job, disusun mengikuti hierarki Vismap: atasan dulu,
 * bawahannya menyusul tepat di bawahnya. Akarnya adalah orang yang atasannya
 * berada di luar Job ini (atau tidak punya atasan) — tanpa itu, kepala
 * departemen tidak akan pernah muncul sebagai baris teratas.
 */
export function positionsOf(jobName: string): PositionRow[] {
  const members = allParticipants().filter((p) => departmentOf(p) === jobName);
  const ids = new Set(members.map((m) => m.id));

  const childrenOf = new Map<string, Participant[]>();
  const roots: Participant[] = [];
  for (const p of members) {
    if (p.managerId && ids.has(p.managerId)) {
      const list = childrenOf.get(p.managerId);
      if (list) list.push(p);
      else childrenOf.set(p.managerId, [p]);
    } else {
      roots.push(p);
    }
  }

  const byName = (a: Participant, b: Participant) => a.name.localeCompare(b.name);
  const rows: PositionRow[] = [];
  const walk = (p: Participant, depth: number) => {
    const manager = p.managerId ? getParticipant(p.managerId) : null;
    rows.push({
      title: positionOf(p).title,
      participantId: p.id,
      incumbent: p.name,
      reportTo: manager ? `${positionOf(manager).title} | ${manager.name}` : null,
      depth,
    });
    (childrenOf.get(p.id) ?? []).sort(byName).forEach((child) => walk(child, depth + 1));
  };
  roots.sort(byName).forEach((root) => walk(root, 0));

  return rows;
}
