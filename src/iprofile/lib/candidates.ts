import { allParticipants, getParticipant, positionOf, scoreOf } from "@/data/model/selectors";

/**
 * Kandidat untuk modal Add Career Plan dan Add Successors.
 *
 * Isinya diturunkan dari data karyawan yang sama dengan seluruh aplikasi,
 * bukan daftar tetap hasil impor Figma — supaya nama, jabatan, dan skor yang
 * muncul di demo cocok dengan yang terlihat di halaman lain.
 */

/** Posisi kandidat terhadap orang yang sedang dibuka profilnya. */
export type LevelRel = "above" | "same" | "below";

export type CandidateOption = {
  id: string;
  name: string;
  position: string;
  level: LevelRel;
  /** Skor kompetensi 0-100, dipakai apa adanya sebagai persentase. */
  percentage: number;
};

/**
 * Kedalaman seseorang di struktur organisasi: berapa langkah ke puncak.
 *
 * Rantai atasan ditelusuri dengan penjaga kunjungan — data organisasi boleh
 * saja mengandung lingkaran, dan tanpa penjaga itu satu lingkaran cukup untuk
 * menggantung halamannya.
 */
function depthOf(id: string): number {
  let depth = 0;
  let current = getParticipant(id);
  const seen = new Set<string>([id]);
  while (current?.managerId && !seen.has(current.managerId)) {
    seen.add(current.managerId);
    current = getParticipant(current.managerId);
    depth++;
  }
  return depth;
}

const LEVEL_ORDER: Record<LevelRel, number> = { above: 0, same: 1, below: 2 };

/**
 * Semua karyawan selain orang itu sendiri, dengan penanda level dan skornya.
 *
 * Diurutkan level dulu (atas → sejajar → bawah) lalu skor tertinggi, jadi yang
 * paling masuk akal dipertimbangkan berada di urutan teratas.
 */
export function candidateOptions(ownerId: string): CandidateOption[] {
  const ownerDepth = depthOf(ownerId);

  return allParticipants()
    .filter((p) => p.id !== ownerId)
    .map((p) => {
      const d = depthOf(p.id);
      const level: LevelRel = d < ownerDepth ? "above" : d > ownerDepth ? "below" : "same";
      return {
        id: p.id,
        name: p.name,
        position: positionOf(p).title,
        level,
        percentage: Math.round(scoreOf(p.id, "competency") ?? 0),
      };
    })
    .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || b.percentage - a.percentage);
}

/** Saring berdasarkan nama atau jabatan; kosong berarti tanpa saringan. */
export function filterCandidates(items: CandidateOption[], query: string): CandidateOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (c) => c.name.toLowerCase().includes(q) || c.position.toLowerCase().includes(q),
  );
}

/** Warna chip level, mengikuti gaya yang sudah dipakai kedua modal. */
export const LEVEL_CHIP: Record<LevelRel, { label: string; bg: string; fg: string }> = {
  above: { label: "Level above", bg: "#f2f9f7", fg: "#00875a" },
  same: { label: "Same level", bg: "#e7f5ff", fg: "#016699" },
  below: { label: "Level below", bg: "#fff2e4", fg: "#ca6f00" },
};
