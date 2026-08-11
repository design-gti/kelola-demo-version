/**
 * Deskripsi tiap Job untuk halaman Admin > Job and Position.
 *
 * Ditulis sebagai teks biasa (bukan CSV seperti data lain di /public) karena
 * isinya prosa multi-baris — dipaksa masuk CSV justru bikin koma dan barisnya
 * harus di-escape terus-menerus. Kalau nanti deskripsi ini datang dari sistem
 * HR, cukup ganti isi fungsi `descriptionOf`.
 *
 * Kuncinya adalah nama Job (= departemen di participants.csv).
 */
const DESCRIPTIONS: Record<string, string> = {
  Teknologi: `Bertanggung jawab atas perancangan, pembangunan, dan pemeliharaan seluruh produk digital perusahaan.

Ruang lingkup:
• Merancang arsitektur sistem yang aman, terukur, dan mudah dirawat.
• Mengembangkan serta memelihara aplikasi sisi klien maupun server.
• Menjaga kualitas kode lewat code review, pengujian otomatis, dan standar teknis bersama.
• Mengelola infrastruktur, proses rilis, dan pemantauan layanan di produksi.

Kolaborasi utama: Pemasaran untuk kebutuhan produk, Operasional untuk kesiapan layanan.`,

  Strategi: `Menetapkan arah jangka panjang perusahaan dan memastikan setiap unit bergerak ke tujuan yang sama.

Ruang lingkup:
• Menyusun rencana korporat serta sasaran tahunan dan kuartalan.
• Menganalisis pasar, pesaing, dan peluang pertumbuhan baru.
• Mengevaluasi alokasi modal dan prioritas investasi antar unit.
• Memantau pencapaian sasaran dan mengusulkan koreksi arah bila meleset.

Kolaborasi utama: seluruh unit, dengan Keuangan sebagai mitra dalam pemodelan angka.`,

  Keuangan: `Menjaga kesehatan keuangan perusahaan serta kepatuhannya terhadap ketentuan yang berlaku.

Ruang lingkup:
• Menyusun laporan keuangan yang akurat dan tepat waktu.
• Merencanakan anggaran, memantau realisasi, dan menganalisis selisihnya.
• Mengelola arus kas, penagihan, dan pembayaran.
• Memastikan kepatuhan pajak, standar akuntansi, dan pengendalian internal.

Kolaborasi utama: Strategi untuk perencanaan, Operasional untuk pengendalian biaya.`,

  SDM: `Mengelola siklus hidup karyawan dari rekrutmen sampai pengembangan karier.

Ruang lingkup:
• Merencanakan kebutuhan tenaga kerja dan menjalankan proses rekrutmen.
• Mengelola kinerja, remunerasi, dan program pengembangan kompetensi.
• Menjaga hubungan industrial serta kepatuhan ketenagakerjaan.
• Mengelola data karyawan dan administrasi personalia lewat HRIS.

Kolaborasi utama: seluruh unit sebagai pengguna layanan, Keuangan untuk struktur remunerasi.`,

  Operasional: `Menjalankan kegiatan operasional harian agar produk dan layanan sampai ke pelanggan tepat waktu dan sesuai mutu.

Ruang lingkup:
• Merencanakan kapasitas dan jadwal produksi.
• Mengelola rantai pasok, pengadaan, dan persediaan.
• Menjaga standar mutu serta keselamatan kerja.
• Menganalisis efisiensi proses dan mengusulkan perbaikan berkelanjutan.

Kolaborasi utama: Teknologi untuk otomasi proses, Keuangan untuk pengendalian biaya.`,

  Pemasaran: `Membangun permintaan pasar dan menjaga posisi merek perusahaan.

Ruang lingkup:
• Menyusun strategi kampanye dan mengeksekusinya lintas kanal.
• Melakukan riset pasar serta memahami kebutuhan pelanggan.
• Mengelola identitas merek, narasi, dan materi kreatif.
• Mengukur kinerja kampanye lewat analitik digital dan mengoptimalkan konversi.

Kolaborasi utama: Strategi untuk sasaran pertumbuhan, Teknologi untuk kebutuhan produk.`,
};

/** Deskripsi Job; string kosong kalau Job-nya belum punya deskripsi. */
export function descriptionOf(jobName: string): string {
  return DESCRIPTIONS[jobName] ?? "";
}
