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

  // Dulu bernama "Pemasaran". Kuncinya ikut diganti saat organisasi memakai
  // lima Chief — kalau tidak, Job Marketing tampil tanpa deskripsi sama sekali.
  Marketing: `Membangun permintaan pasar dan menjaga posisi merek perusahaan.

Ruang lingkup:
• Menyusun strategi kampanye dan mengeksekusinya lintas kanal.
• Melakukan riset pasar serta memahami kebutuhan pelanggan.
• Mengelola identitas merek, narasi, dan materi kreatif.
• Mengukur kinerja kampanye lewat analitik digital dan mengoptimalkan konversi.

Kolaborasi utama: Strategi untuk sasaran pertumbuhan, Teknologi untuk kebutuhan produk.`,

  // Hunter & Farmer ditulis lebih rinci daripada Job lain karena keduanya yang
  // dipakai mendemokan "Generate Aspect by Job Desc." — perekomendasi membaca
  // teks ini, jadi makin jelas uraiannya makin masuk akal hasilnya.
  Hunter: `Tujuan Jabatan
Bertanggung jawab untuk mencari, mengembangkan, dan mengakuisisi klien baru guna meningkatkan jumlah pelanggan dan pendapatan perusahaan.

Tanggung Jawab Utama:
• Mengidentifikasi dan mencari prospek atau calon klien baru yang sesuai dengan target pasar perusahaan.
• Melakukan pendekatan awal kepada calon klien melalui berbagai kanal seperti networking, referral, email, telepon, LinkedIn, maupun aktivitas bisnis lainnya.
• Menggali kebutuhan dan permasalahan calon klien untuk mengidentifikasi peluang kerja sama.
• Memperkenalkan dan menjelaskan produk atau solusi perusahaan yang relevan dengan kebutuhan calon klien.
• Mengembangkan prospek dari tahap awal hingga menjadi peluang penjualan yang potensial.
• Menyusun dan melakukan presentasi, proposal, serta negosiasi dengan calon klien.
• Mengawal proses penjualan hingga tercapai kesepakatan atau closing dengan klien baru.
• Membangun hubungan yang baik dengan calon klien selama proses akuisisi.
• Mengelola dan memperbarui data prospek, pipeline, aktivitas penjualan, dan status peluang bisnis secara berkala.
• Berkoordinasi dengan tim internal untuk memastikan kebutuhan calon klien dapat dipenuhi dengan tepat.
• Memantau perkembangan pasar dan mengidentifikasi peluang, industri, atau segmen baru yang potensial.
• Mencapai target akuisisi klien baru dan revenue sesuai sasaran yang telah ditetapkan perusahaan.`,

  Farmer: `Tujuan Jabatan
Bertanggung jawab untuk memelihara, mengembangkan, dan mempertahankan hubungan dengan klien yang sudah ada guna memastikan kepuasan pelanggan, retensi, serta peningkatan nilai bisnis dari klien eksisting.

Tanggung Jawab Utama:
• Menjaga dan membangun hubungan jangka panjang dengan klien yang sudah ada.
• Memastikan tingkat kepuasan klien terhadap produk dan layanan perusahaan tetap tinggi.
• Melakukan monitoring terhadap kebutuhan klien secara berkala untuk memastikan layanan tetap relevan.
• Menjadi contact person utama bagi klien dalam menangani pertanyaan, permintaan, atau kendala.
• Mengidentifikasi peluang upselling dan cross-selling pada klien existing.
• Mengelola proses renewal kontrak atau perpanjangan kerja sama dengan klien.
• Menangani dan menyelesaikan komplain atau isu klien dengan cepat dan efektif bersama tim internal terkait.
• Berkoordinasi dengan tim internal (produk, operasional, dan teknis) untuk memastikan kebutuhan klien terpenuhi.
• Menyusun laporan terkait aktivitas klien, status hubungan, dan potensi pengembangan bisnis.
• Memastikan tingkat retensi klien (customer retention) tetap tinggi.
• Mengumpulkan feedback dari klien untuk perbaikan produk dan layanan perusahaan.
• Membangun kepercayaan dan menjadi trusted advisor bagi klien yang sudah ada.`,
};

/** Deskripsi Job; string kosong kalau Job-nya belum punya deskripsi. */
export function descriptionOf(jobName: string): string {
  return DESCRIPTIONS[jobName] ?? "";
}
