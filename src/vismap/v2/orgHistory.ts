import type { Employee, OrgChartNode } from "../data/orgChartData";
import { isVacant } from "./layers";

/*
 * RIWAYAT STRUKTUR ORGANISASI (dummy sesi)
 *
 * Struktur yang dirender Vismap V2 dianggap sebagai kondisi TERBARU. Berkas ini
 * mengarang rentetan peristiwa di belakangnya supaya timeline punya sesuatu untuk
 * diputar.
 *
 * Dua keputusan yang membentuk isi berkas ini:
 *
 * 1. Peristiwanya BUKAN per periode tetap. Orang resign tidak menunggu akhir
 *    kuartal, jadi jarak antar-checkpoint sengaja tidak beraturan.
 *
 * 2. Satu peristiwa hampir tidak pernah berdiri sendiri — ia beruntun. Satu orang
 *    resign, kursinya diisi bawahannya, lalu kursi bawahan itu yang kosong: entah
 *    diisi rekrutan baru atau dibiarkan kosong sampai peristiwa berikutnya.
 *
 * Riwayat dibangun MUNDUR dari kondisi hari ini, bukan maju dari masa lalu. Dengan
 * begitu snapshot terakhir dijamin persis sama dengan data yang sedang tampil —
 * kalau dikarang maju, selisih sekecil apa pun akan membuat kondisi "hari ini"
 * versi timeline berbeda dari yang dilihat user.
 *
 * Sesi saja: dibangkitkan di memori setiap kali halaman dimuat, tidak disimpan.
 */

export type HistoryEventKind = "resign" | "move" | "hire" | "vacant" | "team-formed";

export interface HistoryEvent {
  kind: HistoryEventKind;
  /** Kursi yang terlibat. Untuk "move" ini kursi TUJUAN. */
  seatId: string;
  /** Kursi asal, hanya untuk "move". */
  fromSeatId?: string;
  /** Orang yang terlibat; kosong untuk "team-formed". */
  personId?: string;
  /** Teks siap tampil di panel timeline. */
  text: string;
}

export interface Checkpoint {
  id: string;
  /** ISO yyyy-mm-dd. */
  date: string;
  /** Tanggal siap tampil, mis. "14 Mei 2025". */
  label: string;
  /** Ringkasan satu baris peristiwanya. */
  title: string;
  events: HistoryEvent[];
  /**
   * Kondisi kursi PADA saat itu — hanya kursi yang berbeda dari hari ini yang
   * dicatat. Nilai null berarti kursi itu kosong saat itu.
   */
  occupancy: Record<string, string | null>;
  /** Kursi yang belum ada pada tanggal itu (beserta seluruh anak buahnya). */
  hiddenSeats: string[];
}

export interface OrgHistory {
  /** Terurut dari paling lama ke paling baru; elemen terakhir = hari ini. */
  checkpoints: Checkpoint[];
  /** Semua orang yang pernah muncul di riwayat, termasuk yang sudah resign. */
  people: Record<string, Employee>;
}

/** Tanggal acuan "hari ini" untuk data dummy. */
const TODAY = "2026-08-31";
/**
 * Jarak hari antar-peristiwa, dihitung mundur dari hari ini. Sengaja tidak rata:
 * ada yang berdekatan (dua resign dalam sebulan), ada jeda panjang.
 */
const DAY_GAPS = [26, 41, 12, 87, 33, 118, 21, 64, 150];

const ALUMNI_NAMES = [
  "Hendra Kusuma", "Ratna Widodo", "Bayu Setiawan", "Dewi Anggraini", "Fajar Nugroho",
  "Sari Melati", "Gunawan Prakoso", "Indah Lestari", "Tommy Wijaya", "Ayu Kartika",
];
const HIRE_NAMES = [
  "Nadia Rahmawati", "Reza Firmansyah", "Kiara Puspita", "Damar Setyo", "Alya Kusnadi",
  "Bimo Prasetya", "Citra Halim", "Yoga Mahendra", "Laras Ayu", "Fikri Ramadhan",
];

/** Jumlah berkas avatar di public/avatars/employee (p01..p112). */
const AVATAR_COUNT = 112;

/** Hash deterministik (FNV-1a) — dipakai supaya skor orang karangan stabil antar-render. */
function hash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const pick = <T,>(list: T[], seed: number): T => list[seed % list.length];

/** Orang karangan: alumni yang sudah resign, atau rekrutan yang belum ada di masa lalu. */
function makePerson(id: string, name: string, seat: OrgChartNode): Employee {
  const h = hash(id);
  const avatar = (h % AVATAR_COUNT) + 1;
  return {
    id,
    name,
    position: seat.position,
    jobTitle: seat.jobTitle,
    // Skor dibawa orangnya sendiri, bukan kursinya — jadi heatmap di checkpoint
    // lama memperlihatkan kondisi saat itu, bukan skor penghuni hari ini.
    competencyScore: 58 + (h % 38),
    performanceRating: 2 + ((h >> 5) % 4),
    readinessScore: 45 + ((h >> 9) % 50),
    successors: 0,
    imageUrl: `/avatars/employee/p${String(avatar).padStart(2, "0")}.png`,
    criticalPosition: seat.criticalPosition,
  };
}

const fmtDate = (iso: string): string => {
  const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${BULAN[m - 1]} ${y}`;
};

const shiftDays = (iso: string, days: number): string => {
  const t = new Date(`${iso}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() - days);
  return t.toISOString().slice(0, 10);
};

/**
 * Bangun riwayat dummy dari struktur hari ini.
 *
 * Cara kerjanya mundur: mulai dari occupancy hari ini, tiap langkah "membatalkan"
 * satu rentetan peristiwa sehingga menghasilkan kondisi sebelumnya.
 */
export function buildHistory(orgChart: OrgChartNode[]): OrgHistory {
  const seats: OrgChartNode[] = [];
  const parentOf = new Map<string, string>();
  const walk = (n: OrgChartNode, parent?: string) => {
    seats.push(n);
    if (parent) parentOf.set(n.id, parent);
    (n.reports ?? []).forEach(r => walk(r, n.id));
  };
  orgChart.forEach(root => walk(root));

  const people: Record<string, Employee> = {};
  for (const s of seats) if (!isVacant(s)) people[s.id] = s;

  /*
   * Nama alumni tidak boleh bertabrakan dengan karyawan yang masih ada. Dataset
   * demo memakai nama-nama Indonesia umum, jadi beberapa nama di ALUMNI_NAMES
   * memang sudah dipakai orang yang masih menjabat — dan dua kartu bernama sama
   * di satu layar terbaca sebagai bug, bukan kebetulan.
   */
  const takenNames = new Set(seats.map(x => x.name));
  const nextAlumniName = (step: number): string => {
    for (let i = 0; i < ALUMNI_NAMES.length; i++) {
      const name = ALUMNI_NAMES[(step + i) % ALUMNI_NAMES.length];
      if (!takenNames.has(name)) {
        takenNames.add(name);
        return name;
      }
    }
    return `${ALUMNI_NAMES[step % ALUMNI_NAMES.length]} (alumni)`;
  };

  /** Kondisi kerja, dimulai dari hari ini lalu dimundurkan langkah demi langkah. */
  const occ = new Map<string, string | null>();
  for (const s of seats) occ.set(s.id, isVacant(s) ? null : s.id);
  const hidden = new Set<string>();

  // Kandidat kursi untuk peristiwa: punya bawahan (supaya ada yang naik menggantikan)
  // dan bukan root (root diganti terlalu sering bikin riwayatnya tidak masuk akal).
  const candidates = seats.filter(
    s => (s.reports?.length ?? 0) > 0 && parentOf.has(s.id) && parentOf.has(parentOf.get(s.id)!),
  );
  // Kursi utuh yang bisa "baru dibentuk" — punya bawahan, jadi kemunculannya terasa
  // sebagai tim baru, bukan sekadar satu kursi nambah.
  const teamSeats = candidates.filter(s => (s.reports?.length ?? 0) >= 2);

  const checkpoints: Checkpoint[] = [];
  const snapshot = (): Record<string, string | null> => {
    const out: Record<string, string | null> = {};
    for (const s of seats) {
      const now = occ.get(s.id) ?? null;
      const today = isVacant(s) ? null : s.id;
      if (now !== today) out[s.id] = now;
    }
    return out;
  };

  // Hari ini — tidak ada selisih apa pun terhadap data yang sedang tampil.
  checkpoints.push({
    id: "cp-today",
    date: TODAY,
    label: "Hari ini",
    title: "Struktur berjalan",
    events: [],
    occupancy: {},
    hiddenSeats: [],
  });

  let date = TODAY;
  let usedTeam = 0;

  for (let step = 0; step < DAY_GAPS.length; step++) {
    date = shiftDays(date, DAY_GAPS[step]);
    const seed = hash(`cp-${step}`);

    // Tiap peristiwa ketiga adalah pembentukan tim, sisanya rentetan resign.
    const asTeam = step % 3 === 2 && usedTeam < 2 && teamSeats.length > 0;

    if (asTeam) {
      const seat = pick(teamSeats, seed + usedTeam * 7);
      usedTeam++;
      // Mundur = tim ini belum ada. Seluruh cabangnya disembunyikan.
      const branch: string[] = [];
      const collect = (n: OrgChartNode) => {
        branch.push(n.id);
        (n.reports ?? []).forEach(collect);
      };
      collect(seat);
      branch.forEach(id => hidden.add(id));
      checkpoints.push({
        id: `cp-${step}`,
        date,
        label: fmtDate(date),
        title: `Tim ${seat.position} dibentuk`,
        events: [{
          kind: "team-formed",
          seatId: seat.id,
          text: `Tim ${seat.position} dibentuk — ${branch.length} kursi baru`,
        }],
        occupancy: snapshot(),
        hiddenSeats: [...hidden],
      });
      continue;
    }

    const usable = candidates.filter(s => !hidden.has(s.id) && occ.get(s.id));
    if (usable.length === 0) break;
    const upper = pick(usable, seed);

    /*
     * Dua pola pengisian kursi yang ditinggalkan, keduanya nyata di lapangan:
     *
     *   beruntun — kursinya diisi bawahannya (promosi), lalu kursi bawahan itu
     *     yang direkrut dari luar. Rantainya dua kartu bergerak.
     *   langsung — tidak ada penerus yang siap di dalam, jadi kursinya langsung
     *     diisi rekrutan baru. Hanya satu kartu masuk, tanpa promosi.
     *
     * Tanpa pola kedua, riwayatnya jadi terlalu rapi: seolah setiap kursi kosong
     * selalu punya penerus internal yang siap.
     */
    // Langkah yang bukan pembentukan tim dibagi: sepertiga di antaranya diisi
    // langsung dari luar, sisanya lewat promosi internal.
    const directHire = step % 3 === 0;

    if (directHire) {
      const alumniId = `alumni-${step}`;
      people[alumniId] = makePerson(alumniId, nextAlumniName(step), upper);
      const hiredId = occ.get(upper.id)!;   // penghuni hari ini = rekrutan itu
      const hiredName = people[hiredId]?.name ?? pick(HIRE_NAMES, seed >> 9);
      occ.set(upper.id, alumniId);

      checkpoints.push({
        id: `cp-${step}`,
        date,
        label: fmtDate(date),
        title: `${people[alumniId].name} resign dari ${upper.position}`,
        events: [
          {
            kind: "resign",
            seatId: upper.id,
            personId: alumniId,
            text: `${people[alumniId].name} resign — ${upper.position} kosong`,
          },
          {
            kind: "hire",
            seatId: upper.id,
            personId: hiredId,
            text: `${hiredName} direkrut langsung mengisi ${upper.position} — tidak ada penerus internal`,
          },
        ],
        occupancy: snapshot(),
        hiddenSeats: [...hidden],
      });
      continue;
    }

    // --- rentetan resign → promosi internal → rekrutan baru ---
    const reports = (upper.reports ?? []).filter(r => !hidden.has(r.id) && occ.get(r.id));
    if (reports.length === 0) continue;
    const lower = pick(reports, seed >> 3);

    const promotedId = occ.get(upper.id)!;   // hari ini duduk di kursi atas…
    const backfillId = occ.get(lower.id)!;   // …dan ini penghuni kursi bawahnya sekarang

    // Alumni: orang yang dulu menempati kursi atas lalu resign.
    const alumniId = `alumni-${step}`;
    people[alumniId] = makePerson(alumniId, nextAlumniName(step), upper);

    // Mundurkan keadaan: kursi atas kembali ke alumni, yang dipromosikan kembali
    // ke kursi bawahnya, dan penghuni kursi bawah hari ini belum ada.
    occ.set(upper.id, alumniId);
    occ.set(lower.id, promotedId);

    // Penghuni kursi bawah hari ini adalah orang yang direkrut pada peristiwa ini —
    // sebelum tanggal ini dia belum ada di struktur sama sekali.
    const hiredName = people[backfillId]?.name ?? pick(HIRE_NAMES, seed >> 9);

    const alumniName = people[alumniId].name;
    const promotedName = people[promotedId]?.name ?? "—";

    checkpoints.push({
      id: `cp-${step}`,
      date,
      label: fmtDate(date),
      title: `${alumniName} resign dari ${upper.position}`,
      events: [
        {
          kind: "resign",
          seatId: upper.id,
          personId: alumniId,
          text: `${alumniName} resign — ${upper.position} kosong`,
        },
        {
          kind: "move",
          seatId: upper.id,
          fromSeatId: lower.id,
          personId: promotedId,
          text: `${promotedName} naik dari ${lower.position} ke ${upper.position}`,
        },
        {
          kind: "hire",
          seatId: lower.id,
          personId: backfillId,
          text: `${hiredName} direkrut mengisi ${lower.position}`,
        },
      ],
      occupancy: snapshot(),
      hiddenSeats: [...hidden],
    });
  }

  // Dibalik: indeks 0 = paling lama, terakhir = hari ini.
  checkpoints.reverse();

  /*
   * Peristiwa digeser satu slot.
   *
   * Saat dibangun mundur, tiap langkah menyimpan keadaan SEBELUM peristiwanya
   * beserta daftar peristiwa itu sendiri. Padahal yang ingin dibaca user adalah
   * "apa yang terjadi sehingga struktur jadi seperti ini" — jadi daftar peristiwa
   * milik checkpoint yang lebih tua dipindahkan ke checkpoint sesudahnya.
   */
  const shifted = checkpoints.map((cp, i) => (
    i === 0
      ? { ...cp, events: [], title: "Struktur awal tercatat" }
      : { ...cp, events: checkpoints[i - 1].events, title: checkpoints[i - 1].title }
  ));

  return { checkpoints: shifted, people };
}
