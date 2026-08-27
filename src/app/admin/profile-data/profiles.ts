/**
 * Data untuk halaman Profile Data.
 *
 * "Profile Data" mengatur bidang data apa saja yang menempel pada profil
 * talenta: empat bawaan (Performance, Engagement, Kompetensi, Potensi) plus
 * bidang tambahan yang didaftarkan sendiri oleh organisasi.
 *
 * Kolom tabel detail TIDAK ditulis tetap di sini — diturunkan dari data yang
 * memang dimiliki tiap bidang. Kompetensi punya rincian per aspek, jadi satu
 * aspek satu kolom; bidang lain baru punya satu angka, jadi satu kolom. Kalau
 * kolomnya ditulis tetap, tabel akan menjanjikan angka yang tidak ada isinya.
 */
import { ASPECT_CATALOG, KB_BY_PARTICIPANT, SCORES_BY_PARTICIPANT } from "@/data/model/aspects.generated";
import { allParticipants, scoreOf } from "@/data/model/selectors";
import type { ScoreKind } from "@/data/model/types";

export type ProfileKind = "default" | "extension";

export interface ProfileField {
  /**
   * Kunci kolom yang pasti unik. Label KB saja tidak cukup: butir yang sama bisa
   * dipakai lebih dari satu aspek, dan kolom yang berbagi kunci akan saling
   * menimpa saat disembunyikan.
   */
  key: string;
  /** Judul kolom. */
  label: string;
  /** Aspek pemilik, hanya pada kolom Key Behaviour. */
  aspect?: string;
  /** Taraf, hanya untuk kolom Key Behaviour — KB berlaku pada taraf tertentu. */
  level?: number;
  /** Nilai satu karyawan untuk kolom ini; null = belum ada datanya. */
  valueOf: (participantId: string) => number | null;
  /**
   * Cara menulis nilainya, kalau angka mentahnya bukan yang ingin dibaca orang.
   *
   * Kolom bidang tambahan bisa bertipe Date atau Text, sedangkan seluruh jalur
   * data di sini — tabel, riwayat nilai — bekerja dengan angka. Jadi angkanya
   * tetap yang disimpan, dan ini yang menerjemahkannya saat digambar.
   */
  format?: (value: number | null) => string;
}

export interface ProfileEntry {
  /** Dipakai sebagai segmen URL detail — ikut jadi kunci pengaturannya. */
  slug: string;
  name: string;
  description: string;
  kind: ProfileKind;
  enabled: boolean;
  /**
   * Kolom-kolom nilai, hanya untuk bidang tambahan.
   *
   * Bidang bawaan tidak punya ini: kolomnya diturunkan dari data yang memang
   * dimilikinya (satu aspek satu kolom, dan seterusnya), bukan dinamai user.
   * Bidang tambahan belum punya sumber angka, jadi nama dan tipe kolomnya
   * dinyatakan saat dibuat.
   */
  columns?: ExtensionColumn[];
}

/** Tipe data satu kolom bidang tambahan. */
export type ExtensionColumnType =
  | "Text"
  | "Long Text"
  | "Number (Whole)"
  | "Number (Decimal)"
  | "Date";

export const EXTENSION_COLUMN_TYPES: ExtensionColumnType[] = [
  "Text",
  "Long Text",
  "Number (Whole)",
  "Number (Decimal)",
  "Date",
];

export interface ExtensionColumn {
  label: string;
  type: ExtensionColumnType;
  /**
   * Rentang nilai untuk kolom angka, kalau 0–99 bawaan tidak masuk akal —
   * "Tinggi Badan: 4" terbaca sebagai data rusak, bukan data contoh.
   *
   * Hanya diisi bidang bawaan demo; kolom yang dibuat user lewat modal tidak
   * punya cara menyatakan rentang, dan memang tidak perlu.
   */
  range?: [number, number];
  /** Daftar nilai untuk kolom teks, menggantikan contoh umum. */
  options?: string[];
}

/**
 * Aspek kompetensi = kategori "General" di katalog aspek. Diambil dari katalog,
 * bukan didaftar ulang, supaya menambah aspek di Admin > Aspect langsung
 * menambah kolomnya di sini.
 */
const competencyAspects = (): string[] =>
  ASPECT_CATALOG.filter((a) => a.category === "General").map((a) => a.label);

const aspectField = (label: string): ProfileField => ({
  key: "aspect:" + label,
  label,
  valueOf: (id) => SCORES_BY_PARTICIPANT[id]?.[label] ?? null,
});

const scoreField = (label: string, kind: ScoreKind): ProfileField => ({
  key: "score:" + kind,
  label,
  valueOf: (id) => scoreOf(id, kind),
});

/**
 * Bidang bawaan. `fields` sengaja fungsi, bukan array jadi: katalog aspek
 * dibaca saat dipakai supaya perubahan di Admin > Aspect langsung terpakai.
 */
const DEFAULT_PROFILES: (Omit<ProfileEntry, "enabled"> & { fields: () => ProfileField[] })[] = [
  {
    slug: "performance",
    name: "Performance",
    description: "Data Extension Default Performance",
    kind: "default",
    fields: () => [scoreField("Performance", "performance")],
  },
  {
    slug: "engagement",
    name: "Engagement",
    description: "Data Extension Default Engagement",
    kind: "default",
    fields: () => [scoreField("Engagement", "engagement")],
  },
  {
    slug: "kompetensi",
    name: "Kompetensi",
    description: "Data Extension Default Kompetensi",
    kind: "default",
    fields: () => competencyAspects().map(aspectField),
  },
  {
    slug: "potensi",
    name: "Potensi",
    description: "Data Extension Default Potensi",
    kind: "default",
    fields: () => [scoreField("Potensi", "leadership")],
  },
];

/** Bidang tambahan bawaan demo; bisa ditambah user lewat "Tambah Data". */
const SEED_EXTENSIONS: Omit<ProfileEntry, "kind">[] = [
  { slug: "tenure", name: "Tenure", description: "Masa Kerja", enabled: true },
  { slug: "test", name: "test", description: "-", enabled: false },
  {
    slug: "medical-checkup",
    name: "Medical Checkup",
    description: "Hasil pemeriksaan kesehatan tahunan",
    enabled: true,
    /*
     * Satu bidang tambahan bawaan yang benar-benar berisi, supaya alur "data
     * extension → kartu di iProfile" bisa dilihat tanpa harus membuatnya dulu.
     *
     * Rentang tiap kolom ditulis di sini karena angka semu 0–99 tidak masuk
     * akal untuk tinggi dan berat badan.
     */
    columns: [
      { label: "Tinggi Badan", type: "Number (Whole)", range: [150, 190] },
      { label: "Berat Badan", type: "Number (Whole)", range: [45, 95] },
      { label: "Status Kesehatan", type: "Text", options: ["Sehat", "Perlu Pemantauan", "Perlu Tindak Lanjut"] },
      { label: "Golongan Darah", type: "Text", options: ["A", "B", "AB", "O"] },
    ],
  },
];

// ─── Simpanan sesi ───────────────────────────────────────────────────────────
// Sengaja di memori, sama seperti halaman admin lain: perubahan berlaku selama
// sesi berjalan supaya alurnya bisa didemokan bolak-balik antara daftar dan
// detail, lalu kembali ke setelan awal saat halaman dimuat ulang.

export const PROFILE_DATA_EVENT = "profile-data-changed";

let extensions: Omit<ProfileEntry, "kind">[] = SEED_EXTENSIONS.map((e) => ({ ...e }));
let defaultsEnabled: Record<string, boolean> = Object.fromEntries(
  DEFAULT_PROFILES.map((p) => [p.slug, true]),
);

function announce(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(PROFILE_DATA_EVENT));
}

export function allProfiles(): ProfileEntry[] {
  return [
    ...DEFAULT_PROFILES.map((p) => ({
      slug: p.slug,
      name: p.name,
      description: p.description,
      kind: "default" as const,
      enabled: defaultsEnabled[p.slug] ?? true,
    })),
    ...extensions.map((e) => ({ ...e, kind: "extension" as const })),
  ];
}

export function findProfile(slug: string): ProfileEntry | null {
  return allProfiles().find((p) => p.slug === slug) ?? null;
}

export function toggleProfile(slug: string): void {
  if (defaultsEnabled[slug] !== undefined) {
    defaultsEnabled = { ...defaultsEnabled, [slug]: !defaultsEnabled[slug] };
  } else {
    extensions = extensions.map((e) => (e.slug === slug ? { ...e, enabled: !e.enabled } : e));
  }
  announce();
}

/** Slug diturunkan dari namanya, dengan akhiran angka kalau sudah terpakai. */
export function addExtension(name: string, description: string, columns: ExtensionColumn[] = []): ProfileEntry {
  const base = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "data";
  const taken = new Set(allProfiles().map((p) => p.slug));
  let slug = base;
  for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
  const created = {
    slug,
    name: name.trim(),
    description: description.trim() || "-",
    enabled: true,
    // Kolom tanpa nama tidak bisa jadi judul apa pun, jadi disaring di sini —
    // bukan diandalkan pada pemeriksaan di UI, yang bisa dilewati pemanggil lain.
    columns: columns.filter((c) => c.label.trim() !== "").map((c) => ({ label: c.label.trim(), type: c.type })),
  };
  extensions = [...extensions, created];
  announce();
  return { ...created, kind: "extension" };
}

export function removeExtension(slug: string): void {
  extensions = extensions.filter((e) => e.slug !== slug);
  announce();
}

/**
 * Nilai semu satu karyawan untuk satu kolom bidang tambahan: 0–99.
 *
 * Bidang tambahan belum punya sumber angka sungguhan. Angkanya diturunkan dari
 * id karyawan dan kunci kolomnya, BUKAN diacak: angka acak berubah tiap render,
 * jadi orang yang sama akan menunjukkan nilai berbeda setiap kali dibuka dan
 * tidak ada yang bisa dibandingkan — termasuk antara tabel admin dan kartu di
 * iProfile, yang harus menyebut angka yang sama.
 */
function extensionSeed(participantId: string, key: string): number {
  let h = 2166136261;
  for (const ch of `${participantId}|${key}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0) % 100;
}

/** Isi contoh kolom Text: pendek, cukup untuk satu sel tabel. */
const TEXT_SAMPLES = ["Sangat Baik", "Baik", "Cukup", "Perlu Perhatian"];

/**
 * Isi contoh kolom Long Text: satu kalimat.
 *
 * Dibedakan dari Text bukan sekadar demi panjangnya, tapi karena itu memang
 * bedanya kedua tipe ini — Long Text menampung catatan, bukan label.
 */
const LONG_TEXT_SAMPLES = [
  "Menunjukkan hasil konsisten di seluruh periode penilaian.",
  "Perlu pendampingan pada aspek teknis tertentu sebelum promosi.",
  "Berkembang cepat sejak rotasi terakhir, cocok untuk peran lebih luas.",
  "Hasil memadai, namun belum terlihat inisiatif di luar tugas rutin.",
];

/**
 * Menulis angka semu sesuai tipe kolomnya.
 *
 * `column` opsional: kolom bawaan demo bisa membawa rentang angka atau daftar
 * nilainya sendiri, sedangkan kolom buatan user memakai bawaan umum.
 */
export function formatExtensionValue(
  value: number | null,
  type: ExtensionColumnType,
  column?: Pick<ExtensionColumn, "range" | "options">,
): string {
  if (value == null) return "-";
  // Angka semunya 0–99; dipetakan ke rentang kolom kalau kolomnya punya.
  const scaled = column?.range
    ? column.range[0] + (value / 100) * (column.range[1] - column.range[0])
    : value;
  const words = column?.options;

  switch (type) {
    case "Number (Whole)":
      return String(Math.round(scaled));
    case "Number (Decimal)":
      // Satu angka di belakang koma. Tanpa rentang, 0–99 jadi 0,0–9,9.
      return (column?.range ? scaled : value / 10).toFixed(1).replace(".", ",");
    case "Long Text":
      return (words ?? LONG_TEXT_SAMPLES)[value % (words ?? LONG_TEXT_SAMPLES).length];
    case "Date": {
      // Tanggal dalam rentang dua tahun ke belakang dari tanggal acuan. Acuannya
      // ditulis tetap, bukan hari ini, supaya tampilan server dan klien sama
      // dan tidak berubah tiap hari.
      const d = new Date(DATE_ANCHOR);
      d.setDate(d.getDate() - value * 7);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    }
    default: {
      const list = words ?? TEXT_SAMPLES;
      return list[value % list.length];
    }
  }
}

const DATE_ANCHOR = "2026-06-30T00:00:00Z";

/** Kolom tabel detail untuk sebuah bidang. */
export function fieldsOf(slug: string): ProfileField[] {
  const def = DEFAULT_PROFILES.find((p) => p.slug === slug);
  if (def) return def.fields();

  /*
   * Bidang tambahan didaftarkan user lewat UI dan belum punya sumber angka,
   * jadi kolomnya sebanyak yang ia nyatakan saat membuat — bernama "Kolom 1",
   * "Kolom 2", dan seterusnya, dengan nilai kosong sampai datanya diunggah.
   *
   * Kolom kosong tetap lebih berguna daripada tabel tanpa kolom: ia menunjukkan
   * bentuk data yang ditunggu, dan tempat angkanya akan mendarat.
   */
  const ext = extensions.find((e) => e.slug === slug);
  return (ext?.columns ?? []).map((c, i) => ({
    // Indeks ikut jadi kunci: dua kolom boleh bernama sama, dan kunci kembar
    // membuat keduanya saling menimpa saat disembunyikan lewat pemilih kolom.
    key: `${slug}:col${i + 1}`,
    label: c.label,
    valueOf: (id: string) => extensionSeed(id, `${slug}:${i}:${c.label}`),
    format: (v: number | null) => formatExtensionValue(v, c.type, c),
  }));
}

// ─── Lapisan Key Behaviour ───────────────────────────────────────────────────
// Tiap aspek dijabarkan jadi ~15 Key Behaviour (beberapa butir per taraf). Satu
// karyawan bisa punya 165–195 nilai KB, jadi menampilkan SEMUA KB sekaligus
// sebagai kolom tidak mungkin dibaca. Lapisan ini karena itu dipersempit ke satu
// aspek: kolomnya KB milik aspek yang dipilih, barisnya tetap satu per karyawan,
// sehingga KB masih bisa dibandingkan antar orang.

/** Aspek yang punya jabaran KB — kosong berarti bidang ini tak punya lapisan KB. */
export function kbAspectsOf(slug: string): string[] {
  if (slug !== "kompetensi") return [];
  return competencyAspects().filter(
    (label) => (ASPECT_CATALOG.find((a) => a.label === label)?.keyBehaviours.length ?? 0) > 0,
  );
}

/** Apakah bidang ini punya lapisan Key Behaviour. */
export const hasKbLayer = (slug: string): boolean => kbAspectsOf(slug).length > 0;

/**
 * Kolom KB: SELURUH Key Behaviour dari semua aspek bidang ini — 13 aspek × 15
 * butir = 195 kolom. Lapisan ini memang bacaan data mentah, jadi KB-nya tidak
 * diikat ke satu aspek; yang mempersempit adalah pemilih kolom.
 *
 * Daftar kolomnya diambil dari KATALOG, bukan dari KB yang dimiliki karyawan:
 * seorang karyawan hanya dinilai pada aspek yang berlaku untuk posisinya, jadi
 * menyusun kolom dari data seseorang membuat kolomnya berubah-ubah mengikuti
 * siapa yang kebetulan ada di halaman itu. Urutannya aspek → taraf → butir.
 */
export function kbFieldsOf(slug: string): ProfileField[] {
  return kbAspectsOf(slug).flatMap((aspectLabel) => {
    const entry = ASPECT_CATALOG.find((a) => a.label === aspectLabel);
    if (!entry) return [];
    return [...entry.keyBehaviours]
      .sort((a, b) => a.level - b.level || a.label.localeCompare(b.label))
      .map((kb) => ({
        key: ["kb", aspectLabel, kb.level, kb.label].join(":"),
        label: kb.label,
        aspect: aspectLabel,
        level: kb.level,
        valueOf: (id: string) =>
          KB_BY_PARTICIPANT[id]?.[aspectLabel]?.find((k) => k.label === kb.label && k.level === kb.level)?.score ?? null,
      }));
  });
}

// ─── Baris tabel ─────────────────────────────────────────────────────────────

export interface ProfileRow {
  employeeId: string;
  name: string;
  email: string;
  lastUpdate: string;
  values: (number | null)[];
}

/**
 * Cap waktu sinkronisasi terakhir, ditulis tetap dan bukan waktu sekarang.
 *
 * Halaman ini dirender di server lebih dulu; memakai jam berjalan membuat
 * server dan browser menghasilkan teks berbeda dan React mengeluh beda
 * hidrasi. Detiknya digeser per baris supaya terbaca seperti hasil satu proses
 * impor yang berjalan berurutan, persis seperti data hasil sinkron.
 */
const LAST_SYNC = new Date("2026-02-08T16:09:18");

const stamp = (index: number): string => {
  const t = new Date(LAST_SYNC.getTime() + Math.floor(index / 6) * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
};

/** Email demo diturunkan dari nama supaya tetap sama di setiap render. */
const emailOf = (name: string): string =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "")}@mail.com`;

/** Baris untuk kumpulan kolom apa pun — lapisan aspek maupun lapisan KB. */
export function rowsFor(fields: ProfileField[]): ProfileRow[] {
  return allParticipants().map((p, i) => ({
    employeeId: p.id,
    name: p.name,
    email: emailOf(p.name),
    lastUpdate: stamp(i),
    values: fields.map((f) => f.valueOf(p.id)),
  }));
}

/**
 * Riwayat satu angka: nilai sekarang plus dua revisi sebelumnya.
 *
 * Diturunkan dari nilai dan posisinya, bukan diacak — supaya membuka riwayat
 * yang sama dua kali tidak menampilkan angka yang berbeda.
 */
export function historyOf(value: number | null, seed: number): { at: string; value: number | null }[] {
  if (value == null) return [];
  const step = (n: number) => Math.max(1, Math.min(5, value - n));
  return [
    { at: stamp(seed), value },
    { at: "2025-11-14 09:22:41", value: step(1 + (seed % 2)) },
    { at: "2025-08-02 10:05:12", value: step(2 + (seed % 2)) },
  ];
}
