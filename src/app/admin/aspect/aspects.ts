import { ASPECT_CATALOG, type KeyBehaviourRef } from "@/data/model/aspects.generated";

export type { KeyBehaviourRef };

export type LibraryAspect = {
  label: string;
  /** Satu-satunya pengelompokan aspek. "General" & "Technical" cuma kategori bawaan. */
  category: string;
  /** Penjelasan singkat kemampuan yang dinilai aspek ini. */
  description: string;
  /**
   * Key Behaviour milik aspek ini, bertaraf: tiap taraf 1..SCALE punya
   * beberapa butir. Kolom taraf di halaman Aspect hanya menawarkan butir milik
   * taraf yang bersangkutan.
   */
  keyBehaviours: KeyBehaviourRef[];
};

/** Skala penilaian aspek; sama dengan skala skor di iProfile. */
export const SCALE = 5;

/**
 * Library aspek: seluruh katalog, apa pun kategorinya.
 *
 * Sudah tidak ada pemisahan soft/hard di sini — aspek berperilaku sama, yang
 * membedakan hanya kategorinya. Katalognya modul TS hasil seed, jadi siap saat
 * render pertama tanpa fetch.
 */
export function buildLibrary(): LibraryAspect[] {
  return ASPECT_CATALOG.map((a) => ({
    label: a.label,
    category: a.category,
    description: a.description,
    keyBehaviours: a.keyBehaviours,
  }));
}

/** Kelompokkan aspek per kategori, urutan kategori mengikuti kemunculan pertama. */
export function byCategory(aspects: LibraryAspect[]): [string, LibraryAspect[]][] {
  const map = new Map<string, LibraryAspect[]>();
  for (const a of aspects) {
    const list = map.get(a.category);
    if (list) list.push(a);
    else map.set(a.category, [a]);
  }
  return [...map.entries()];
}
