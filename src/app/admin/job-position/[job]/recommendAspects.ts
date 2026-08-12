import type { LibraryAspect } from "@/app/admin/aspect/aspects";

/**
 * Merekomendasikan aspek dari library berdasarkan job description.
 *
 * Pencocokannya deterministik — kata bermakna di job description diadu dengan
 * nama, deskripsi, dan key behaviour tiap aspek. Bukan model bahasa: demo ini
 * tidak memanggil layanan apa pun, dan hasil yang sama harus keluar setiap kali
 * tombolnya ditekan supaya bisa dibicarakan saat demo.
 */

/** Kata yang terlalu umum untuk jadi penanda kecocokan. */
const STOPWORDS = new Set([
  "yang", "untuk", "dari", "dengan", "dalam", "pada", "atau", "dan", "serta", "agar",
  "akan", "adalah", "juga", "oleh", "para", "ini", "itu", "tidak", "bisa", "dapat",
  "harus", "lebih", "secara", "kepada", "sebagai", "antar", "melalui", "setiap",
  "seluruh", "bagi", "hingga", "sampai", "ketika", "saat", "tersebut", "mereka",
  "kami", "kita", "anda", "serta", "maupun", "bahwa", "karena", "sehingga", "tanpa",
  "jabatan", "posisi", "tugas", "kerja", "bekerja", "pekerjaan", "perusahaan",
  "bertanggung", "jawab", "melakukan", "memastikan", "menjalankan", "terkait",
]);

const words = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-zÀ-ɏ\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));

/**
 * Dua kata dianggap sama kalau salah satunya awalan dari yang lain — cara murah
 * menyamakan "memimpin"/"pemimpin"/"kepemimpinan" tanpa memasang stemmer.
 */
const alike = (a: string, b: string) =>
  a === b || (a.length >= 5 && b.startsWith(a)) || (b.length >= 5 && a.startsWith(b));

export type Recommendation = {
  aspect: LibraryAspect;
  score: number;
  /** Kata di job description yang memicu kecocokan — jadi alasan yang bisa dibaca. */
  matched: string[];
};

export function recommendAspects(
  jobDescription: string,
  library: LibraryAspect[],
  /** Aspek yang sudah ada di Job — tidak perlu direkomendasikan lagi. */
  exclude: string[] = [],
  limit = 8,
): Recommendation[] {
  const jobWords = [...new Set(words(jobDescription))];
  if (jobWords.length === 0) return [];

  const skip = new Set(exclude);

  return library
    .filter((a) => !skip.has(a.label))
    .map((aspect) => {
      const matched = new Set<string>();
      let score = 0;

      // Nama aspek diberi bobot terbesar: kalau namanya sendiri disebut di job
      // description, kaitannya jauh lebih kuat daripada sekadar kesamaan kata
      // di paragraf penjelasan.
      for (const w of words(aspect.label)) {
        const hit = jobWords.find((jw) => alike(jw, w));
        if (hit) {
          score += 5;
          matched.add(hit);
        }
      }
      for (const w of new Set(words(aspect.description))) {
        const hit = jobWords.find((jw) => alike(jw, w));
        if (hit) {
          score += 1;
          matched.add(hit);
        }
      }
      for (const kb of aspect.keyBehaviours) {
        for (const w of new Set(words(kb))) {
          const hit = jobWords.find((jw) => alike(jw, w));
          if (hit) {
            score += 1;
            matched.add(hit);
          }
        }
      }

      return { aspect, score, matched: [...matched].slice(0, 4) };
    })
    .filter((r) => r.score > 0)
    // Skor sama diurutkan menurut nama supaya urutannya tetap sama tiap kali
    // dijalankan — hasil yang berpindah-pindah bikin demo sulit dibicarakan.
    .sort((a, b) => b.score - a.score || a.aspect.label.localeCompare(b.aspect.label))
    .slice(0, limit);
}
