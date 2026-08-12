// AUTO-GENERATED oleh scripts/gen-aspects.mjs — jangan edit manual.
// Sumber: public/data/aspects.csv + participants.csv + tabel di generator.
// Regenerate: node scripts/gen-aspects.mjs (sudah dihook di npm run seed).

export type AspectCategory = string;
export type AspectKeyBehaviour = { label: string; score: number };
export type CatalogAspect = { label: string; category: AspectCategory; description: string; keyBehaviours: string[] };

/** Semua aspek yang dikenal aplikasi, apa pun kategorinya. */
export const ASPECT_CATALOG: CatalogAspect[] = [
  {
    "label": "Logika Berpikir",
    "category": "General",
    "description": "Kemampuan menyusun penalaran yang runtut, menarik kesimpulan yang sahih dari informasi yang tersedia, dan menguji asumsi sebelum mengambil keputusan.",
    "keyBehaviours": [
      "Berpikir Sistematis",
      "Berpikir Kritis",
      "Pemecahan Masalah",
      "Pengambilan Kesimpulan Logis",
      "Pengujian Asumsi"
    ]
  },
  {
    "label": "Kemampuan Numerikal",
    "category": "General",
    "description": "Kemampuan bekerja dengan angka secara cepat dan tepat, membaca data kuantitatif, serta menafsirkan maknanya untuk kebutuhan pekerjaan.",
    "keyBehaviours": [
      "Ketepatan Hitung",
      "Interpretasi Data Angka",
      "Estimasi Cepat",
      "Pembacaan Tabel & Grafik",
      "Ketelitian Angka"
    ]
  },
  {
    "label": "Kemampuan verbal",
    "category": "General",
    "description": "Kemampuan memahami bacaan dan menyampaikan gagasan secara lisan maupun tertulis dengan struktur, kosakata, dan tata bahasa yang jelas.",
    "keyBehaviours": [
      "Pemahaman Bacaan",
      "Kejelasan Ekspresi Lisan",
      "Kosakata & Tata Bahasa",
      "Penyusunan Tulisan Kerja",
      "Penyesuaian Gaya Bahasa"
    ]
  },
  {
    "label": "Daya Analisa",
    "category": "General",
    "description": "Kemampuan menguraikan masalah menjadi bagian-bagian yang lebih kecil, mengenali pola dan hubungan sebab-akibat, lalu menyusunnya kembali jadi kesimpulan yang utuh.",
    "keyBehaviours": [
      "Identifikasi Pola",
      "Analisis Sebab-Akibat",
      "Sintesis Informasi",
      "Evaluasi Alternatif",
      "Penyederhanaan Masalah"
    ]
  },
  {
    "label": "Keterampilan Interpersonal",
    "category": "General",
    "description": "Kemampuan membangun dan menjaga hubungan kerja yang sehat, membaca situasi sosial, serta menyesuaikan cara berkomunikasi dengan lawan bicara.",
    "keyBehaviours": [
      "Mendengarkan Aktif",
      "Empati",
      "Membangun Hubungan Kerja",
      "Membaca Situasi Sosial",
      "Penyampaian Umpan Balik"
    ]
  },
  {
    "label": "Kerjasama",
    "category": "General",
    "description": "Kesediaan bekerja bersama orang lain demi tujuan bersama, berbagi informasi secara terbuka, dan mendukung penyelesaian tugas rekan satu tim.",
    "keyBehaviours": [
      "Kontribusi dalam Tim",
      "Resolusi Konflik",
      "Berbagi Informasi",
      "Dukungan ke Rekan Kerja",
      "Menjaga Komitmen Bersama"
    ]
  },
  {
    "label": "Fleksibilitas",
    "category": "General",
    "description": "Kemampuan menyesuaikan diri dengan perubahan prioritas, cara kerja, atau situasi baru tanpa kehilangan efektivitas.",
    "keyBehaviours": [
      "Adaptasi Perubahan",
      "Keterbukaan pada Ide Baru",
      "Toleransi Ambiguitas",
      "Penyesuaian Prioritas",
      "Pemulihan Setelah Hambatan"
    ]
  },
  {
    "label": "Leadership",
    "category": "General",
    "description": "Kemampuan mengarahkan dan memotivasi orang lain menuju sasaran bersama, mengambil keputusan, serta bertanggung jawab atas hasilnya.",
    "keyBehaviours": [
      "Pengambilan Keputusan",
      "Memotivasi Tim",
      "Delegasi Tugas",
      "Tanggung Jawab atas Hasil",
      "Pengembangan Anggota Tim"
    ]
  },
  {
    "label": "Kemampuan Perencanaan",
    "category": "General",
    "description": "Kemampuan menetapkan sasaran, menyusun langkah kerja beserta kebutuhan sumber dayanya, dan memantau pelaksanaannya sampai tuntas.",
    "keyBehaviours": [
      "Penetapan Prioritas",
      "Manajemen Waktu",
      "Antisipasi Risiko",
      "Penyusunan Langkah Kerja",
      "Pemantauan Pelaksanaan"
    ]
  },
  {
    "label": "Arsitektur Sistem",
    "category": "Technical",
    "description": "Merancang struktur sistem yang aman, terukur, dan mudah dirawat, termasuk memilih pola dan batasan antar-komponen.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Code Review",
    "category": "Technical",
    "description": "Menelaah kode rekan kerja untuk menjaga kualitas, menemukan cacat lebih awal, dan menularkan standar teknis tim.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Keamanan Aplikasi",
    "category": "Technical",
    "description": "Mengenali dan menutup celah keamanan pada aplikasi, dari validasi masukan sampai pengelolaan hak akses.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "CI/CD",
    "category": "Technical",
    "description": "Menyiapkan dan merawat alur build, uji, dan rilis otomatis agar perubahan sampai ke produksi dengan cepat dan aman.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Cloud Infrastructure",
    "category": "Technical",
    "description": "Mengelola sumber daya cloud — komputasi, jaringan, dan penyimpanan — sesuai kebutuhan beban dan anggaran.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Observability",
    "category": "Technical",
    "description": "Menyiapkan log, metrik, dan penelusuran agar perilaku sistem di produksi bisa dipantau dan masalahnya cepat ditemukan.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Kualitas Kode",
    "category": "Technical",
    "description": "Menulis kode yang bersih, konsisten, dan mudah dibaca orang lain, bukan hanya berjalan benar.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Pengujian Otomatis",
    "category": "Technical",
    "description": "Menyusun pengujian yang menangkap regresi lebih awal dan menjaga keyakinan saat kode diubah.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Debugging",
    "category": "Technical",
    "description": "Menelusuri penyebab kegagalan secara sistematis sampai ke akar masalahnya, bukan berhenti di gejalanya.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Version Control",
    "category": "Technical",
    "description": "Mengelola riwayat perubahan, percabangan, dan penggabungan kode secara tertib dalam kerja tim.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Arsitektur Komponen",
    "category": "Technical",
    "description": "Menyusun komponen antarmuka yang dapat dipakai ulang dengan batas tanggung jawab yang jelas.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "State Management",
    "category": "Technical",
    "description": "Mengelola alur data dan status aplikasi sisi klien agar tetap dapat diprediksi saat aplikasi membesar.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Aksesibilitas",
    "category": "Technical",
    "description": "Memastikan antarmuka dapat digunakan semua orang, termasuk pengguna pembaca layar dan navigasi keyboard.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Performa Web",
    "category": "Technical",
    "description": "Mengukur dan memperbaiki kecepatan muat serta kelancaran interaksi halaman.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Design System",
    "category": "Technical",
    "description": "Membangun dan merawat komponen serta token desain bersama agar tampilan produk konsisten.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Desain API",
    "category": "Technical",
    "description": "Merancang antarmuka layanan yang jelas, konsisten, dan mudah dipakai tim lain.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Basis Data",
    "category": "Technical",
    "description": "Merancang skema dan relasi data yang menjaga integritas serta sesuai pola penggunaannya.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Optimasi Query",
    "category": "Technical",
    "description": "Menganalisis dan memperbaiki kueri yang lambat, termasuk penggunaan indeks yang tepat.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Message Queue",
    "category": "Technical",
    "description": "Memakai antrean pesan untuk memisahkan proses yang berjalan asinkron dan menahan lonjakan beban.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Containerization",
    "category": "Technical",
    "description": "Mengemas aplikasi beserta dependensinya ke dalam container agar konsisten di semua lingkungan.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Strategi Korporat",
    "category": "Technical",
    "description": "Menyusun arah jangka panjang perusahaan dan menerjemahkannya jadi sasaran yang bisa dijalankan unit kerja.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Alokasi Modal",
    "category": "Technical",
    "description": "Memutuskan ke mana dana dan sumber daya diarahkan berdasarkan potensi imbal hasil serta risikonya.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Tata Kelola",
    "category": "Technical",
    "description": "Menjaga proses pengambilan keputusan perusahaan berjalan sesuai aturan, wewenang, dan akuntabilitas yang berlaku.",
    "keyBehaviours": [
      "Pemahaman Ketentuan",
      "Penerapan pada Proses Kerja",
      "Identifikasi Risiko Kepatuhan",
      "Dokumentasi & Pelaporan",
      "Pembaruan atas Perubahan Aturan"
    ]
  },
  {
    "label": "Analisis Kompetitif",
    "category": "Technical",
    "description": "Membaca posisi pesaing dan dinamika pasar untuk menemukan peluang serta ancaman bagi perusahaan.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Pemodelan Skenario",
    "category": "Technical",
    "description": "Menyusun beberapa kemungkinan masa depan beserta dampaknya sebagai bahan pengambilan keputusan.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Manajemen Risiko",
    "category": "Technical",
    "description": "Mengidentifikasi, menilai, dan menyiapkan penanganan atas risiko yang dapat mengganggu tujuan organisasi.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Kepatuhan Regulasi",
    "category": "Technical",
    "description": "Memastikan kegiatan perusahaan memenuhi ketentuan hukum dan regulasi yang berlaku.",
    "keyBehaviours": [
      "Pemahaman Ketentuan",
      "Penerapan pada Proses Kerja",
      "Identifikasi Risiko Kepatuhan",
      "Dokumentasi & Pelaporan",
      "Pembaruan atas Perubahan Aturan"
    ]
  },
  {
    "label": "Audit Internal",
    "category": "Technical",
    "description": "Menguji secara independen apakah proses dan pengendalian internal berjalan sebagaimana mestinya.",
    "keyBehaviours": [
      "Pemahaman Ketentuan",
      "Penerapan pada Proses Kerja",
      "Identifikasi Risiko Kepatuhan",
      "Dokumentasi & Pelaporan",
      "Pembaruan atas Perubahan Aturan"
    ]
  },
  {
    "label": "Pelaporan Keuangan",
    "category": "Technical",
    "description": "Menyusun laporan keuangan yang akurat, tepat waktu, dan sesuai standar yang berlaku.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Analisis Anggaran",
    "category": "Technical",
    "description": "Menyusun anggaran dan menganalisis realisasinya untuk menjaga belanja tetap pada rencana.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Kepatuhan Pajak",
    "category": "Technical",
    "description": "Memenuhi kewajiban perpajakan perusahaan secara tepat hitung dan tepat waktu.",
    "keyBehaviours": [
      "Pemahaman Ketentuan",
      "Penerapan pada Proses Kerja",
      "Identifikasi Risiko Kepatuhan",
      "Dokumentasi & Pelaporan",
      "Pembaruan atas Perubahan Aturan"
    ]
  },
  {
    "label": "Standar Akuntansi",
    "category": "Technical",
    "description": "Menerapkan standar akuntansi yang berlaku dalam pencatatan dan penyajian transaksi.",
    "keyBehaviours": [
      "Pemahaman Ketentuan",
      "Penerapan pada Proses Kerja",
      "Identifikasi Risiko Kepatuhan",
      "Dokumentasi & Pelaporan",
      "Pembaruan atas Perubahan Aturan"
    ]
  },
  {
    "label": "Pemodelan Keuangan",
    "category": "Technical",
    "description": "Membangun model perhitungan untuk memproyeksikan kinerja keuangan dan menguji asumsinya.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Analisis Varians",
    "category": "Technical",
    "description": "Menjelaskan selisih antara rencana dan realisasi beserta penyebabnya.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Rekonsiliasi",
    "category": "Technical",
    "description": "Mencocokkan catatan antar-sumber data keuangan dan menuntaskan selisih yang ditemukan.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Spreadsheet Lanjutan",
    "category": "Technical",
    "description": "Mengolah data dengan rumus, tabel pivot, dan otomasi spreadsheet untuk analisis yang berulang.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Pengendalian Internal",
    "category": "Technical",
    "description": "Merancang dan menjalankan kontrol yang mencegah kesalahan serta penyimpangan dalam proses kerja.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Audit Kepatuhan",
    "category": "Technical",
    "description": "Memeriksa kesesuaian pelaksanaan proses terhadap kebijakan dan ketentuan yang berlaku.",
    "keyBehaviours": [
      "Pemahaman Ketentuan",
      "Penerapan pada Proses Kerja",
      "Identifikasi Risiko Kepatuhan",
      "Dokumentasi & Pelaporan",
      "Pembaruan atas Perubahan Aturan"
    ]
  },
  {
    "label": "Manajemen Talenta",
    "category": "Technical",
    "description": "Mengelola identifikasi, pengembangan, dan retensi karyawan bertalenta sesuai kebutuhan organisasi.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Perencanaan SDM",
    "category": "Technical",
    "description": "Memproyeksikan kebutuhan tenaga kerja dan menyiapkan pemenuhannya sejalan dengan rencana bisnis.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Hubungan Industrial",
    "category": "Technical",
    "description": "Menjaga hubungan kerja yang sehat antara perusahaan dan karyawan sesuai ketentuan ketenagakerjaan.",
    "keyBehaviours": [
      "Pemahaman Ketentuan",
      "Penerapan pada Proses Kerja",
      "Identifikasi Risiko Kepatuhan",
      "Dokumentasi & Pelaporan",
      "Pembaruan atas Perubahan Aturan"
    ]
  },
  {
    "label": "HRIS",
    "category": "Technical",
    "description": "Mengelola data dan proses kepegawaian melalui sistem informasi SDM.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Manajemen Kinerja",
    "category": "Technical",
    "description": "Menjalankan siklus penetapan sasaran, pemantauan, dan penilaian kinerja karyawan.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Remunerasi",
    "category": "Technical",
    "description": "Menyusun struktur gaji dan tunjangan yang adil secara internal serta bersaing di pasar.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Sourcing Kandidat",
    "category": "Technical",
    "description": "Menemukan dan menjangkau kandidat yang sesuai kebutuhan posisi melalui berbagai kanal.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Teknik Wawancara",
    "category": "Technical",
    "description": "Menggali kemampuan dan kesesuaian kandidat lewat pertanyaan yang terstruktur dan bukti perilaku.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Employer Branding",
    "category": "Technical",
    "description": "Membangun citra perusahaan sebagai tempat kerja yang menarik bagi kandidat sasaran.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "ATS",
    "category": "Technical",
    "description": "Mengelola alur rekrutmen dan data pelamar melalui sistem pelacakan kandidat.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Administrasi Personalia",
    "category": "Technical",
    "description": "Mengurus dokumen, kontrak, dan pencatatan kepegawaian secara tertib dan tepat waktu.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Onboarding",
    "category": "Technical",
    "description": "Menyiapkan karyawan baru agar cepat memahami peran, alat kerja, dan budaya organisasi.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Kepatuhan Ketenagakerjaan",
    "category": "Technical",
    "description": "Memastikan praktik kepegawaian memenuhi peraturan ketenagakerjaan yang berlaku.",
    "keyBehaviours": [
      "Pemahaman Ketentuan",
      "Penerapan pada Proses Kerja",
      "Identifikasi Risiko Kepatuhan",
      "Dokumentasi & Pelaporan",
      "Pembaruan atas Perubahan Aturan"
    ]
  },
  {
    "label": "Perencanaan Kapasitas",
    "category": "Technical",
    "description": "Menyelaraskan kapasitas produksi atau layanan dengan proyeksi permintaan.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Manajemen Rantai Pasok",
    "category": "Technical",
    "description": "Mengelola aliran barang dan informasi dari pemasok sampai ke pelanggan.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Kendali Mutu",
    "category": "Technical",
    "description": "Menjaga hasil kerja memenuhi standar mutu melalui pemeriksaan dan tindakan perbaikan.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Analitik Operasional",
    "category": "Technical",
    "description": "Mengolah data operasional menjadi temuan yang bisa ditindaklanjuti untuk perbaikan proses.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Keselamatan Kerja",
    "category": "Technical",
    "description": "Menerapkan prosedur keselamatan untuk mencegah kecelakaan dan penyakit akibat kerja.",
    "keyBehaviours": [
      "Pemahaman Ketentuan",
      "Penerapan pada Proses Kerja",
      "Identifikasi Risiko Kepatuhan",
      "Dokumentasi & Pelaporan",
      "Pembaruan atas Perubahan Aturan"
    ]
  },
  {
    "label": "Perencanaan Produksi",
    "category": "Technical",
    "description": "Menyusun jadwal dan urutan produksi agar target terpenuhi dengan sumber daya yang ada.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Efisiensi Proses",
    "category": "Technical",
    "description": "Menemukan pemborosan dalam alur kerja dan merancang perbaikannya.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Manajemen Vendor",
    "category": "Technical",
    "description": "Memilih, mengevaluasi, dan membina hubungan dengan pemasok agar pasokan andal.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Perencanaan Inventori",
    "category": "Technical",
    "description": "Menjaga tingkat persediaan pada titik yang aman tanpa menahan modal berlebih.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Sistem ERP",
    "category": "Technical",
    "description": "Menjalankan proses bisnis terpadu melalui sistem ERP perusahaan.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Pemetaan Proses",
    "category": "Technical",
    "description": "Mendokumentasikan alur kerja beserta pelaku dan keluarannya sebagai dasar perbaikan.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Strategi Kampanye",
    "category": "Technical",
    "description": "Merancang kampanye pemasaran mulai dari sasaran, pesan, sampai pemilihan kanal.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Riset Pasar",
    "category": "Technical",
    "description": "Menggali kebutuhan, perilaku, dan persepsi pasar sebagai dasar keputusan pemasaran.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Manajemen Brand",
    "category": "Technical",
    "description": "Menjaga konsistensi identitas dan persepsi merek di seluruh titik sentuh.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Analitik Digital",
    "category": "Technical",
    "description": "Mengukur kinerja kanal digital dan menerjemahkan datanya jadi keputusan optimasi.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Otomasi Pemasaran",
    "category": "Technical",
    "description": "Merancang alur komunikasi otomatis yang berjalan sesuai perilaku calon pelanggan.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Eksperimen Pertumbuhan",
    "category": "Technical",
    "description": "Merancang dan menjalankan uji coba terukur untuk menemukan pendorong pertumbuhan.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Optimasi Konversi",
    "category": "Technical",
    "description": "Memperbaiki tahapan perjalanan pengguna agar lebih banyak yang menuntaskan tindakan sasaran.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Strategi Brand",
    "category": "Technical",
    "description": "Menetapkan posisi, nilai, dan arah jangka panjang merek di pasar.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Narasi & Positioning",
    "category": "Technical",
    "description": "Merumuskan cerita dan pembeda merek agar tertanam jelas di benak audiens.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Strategi Pendapatan",
    "category": "Technical",
    "description": "Menyusun cara perusahaan menumbuhkan pendapatan lintas produk dan segmen.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Manajemen Pipeline",
    "category": "Technical",
    "description": "Mengelola tahapan peluang penjualan agar prakiraan pendapatan dapat diandalkan.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Penetapan Harga",
    "category": "Technical",
    "description": "Menentukan harga berdasarkan nilai bagi pelanggan, biaya, dan posisi pesaing.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Arahan Kreatif",
    "category": "Technical",
    "description": "Memimpin arah visual dan pesan karya kreatif agar selaras dengan sasaran kampanye.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Storytelling Visual",
    "category": "Technical",
    "description": "Menyampaikan gagasan melalui rangkaian visual yang runtut dan berkesan.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Manajemen Produksi",
    "category": "Technical",
    "description": "Mengatur jadwal, sumber daya, dan mutu pada proses produksi materi kreatif.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  },
  {
    "label": "Desain Terdistribusi",
    "category": "Technical",
    "description": "Merancang sistem yang berjalan di banyak layanan dengan memperhitungkan kegagalan parsial dan konsistensi data.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Technical Roadmap",
    "category": "Technical",
    "description": "Menyusun arah teknis jangka menengah, termasuk urutan pembenahan utang teknis dan investasi platform.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Perencanaan Strategis",
    "category": "Technical",
    "description": "Menerjemahkan sasaran jangka panjang menjadi rencana kerja dengan tahapan dan ukuran keberhasilan.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Manajemen Kas",
    "category": "Technical",
    "description": "Mengelola arus kas masuk dan keluar agar likuiditas perusahaan tetap terjaga.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Negosiasi Pengadaan",
    "category": "Technical",
    "description": "Merundingkan harga dan syarat pengadaan yang menguntungkan tanpa mengorbankan mutu.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Penulisan Konten",
    "category": "Technical",
    "description": "Menulis konten yang jelas, sesuai audiens, dan mendukung tujuan komunikasi.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "Produksi Visual",
    "category": "Technical",
    "description": "Menghasilkan materi visual yang rapi dan sesuai panduan merek.",
    "keyBehaviours": [
      "Penguasaan Konsep Dasar",
      "Penerapan pada Pekerjaan Harian",
      "Penanganan Kasus Kompleks",
      "Perbaikan Cara Kerja",
      "Berbagi Pengetahuan ke Tim"
    ]
  },
  {
    "label": "SEO",
    "category": "Technical",
    "description": "Meningkatkan keterlihatan halaman di mesin pencari lewat perbaikan teknis dan konten.",
    "keyBehaviours": [
      "Penguasaan Fitur Inti",
      "Pemakaian dalam Alur Kerja",
      "Troubleshooting Mandiri",
      "Optimasi & Otomasi",
      "Pendampingan Pengguna Lain"
    ]
  }
];

/** Aspek yang dinilai untuk tiap posisi (maks 12). */
export const ASPECTS_BY_POSITION: Record<string, string[]> = {
  "Head of Engineering": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Arsitektur Sistem",
    "Code Review",
    "Keamanan Aplikasi",
    "CI/CD",
    "Cloud Infrastructure",
    "Observability"
  ],
  "Senior Engineer": [
    "Logika Berpikir",
    "Daya Analisa",
    "Kerjasama",
    "Fleksibilitas",
    "Kemampuan Perencanaan",
    "Kemampuan verbal",
    "Kualitas Kode",
    "Pengujian Otomatis",
    "Debugging",
    "Version Control"
  ],
  "Frontend Lead": [
    "Logika Berpikir",
    "Daya Analisa",
    "Kerjasama",
    "Fleksibilitas",
    "Kemampuan Perencanaan",
    "Kemampuan verbal",
    "Arsitektur Komponen",
    "State Management",
    "Aksesibilitas",
    "Performa Web",
    "Design System"
  ],
  "Backend Lead": [
    "Logika Berpikir",
    "Daya Analisa",
    "Kerjasama",
    "Fleksibilitas",
    "Kemampuan Perencanaan",
    "Kemampuan verbal",
    "Desain API",
    "Basis Data",
    "Optimasi Query",
    "Message Queue",
    "Containerization"
  ],
  "Chief Executive Officer": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Strategi Korporat",
    "Alokasi Modal",
    "Tata Kelola"
  ],
  "Chief Strategy Officer": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Strategi Korporat",
    "Analisis Kompetitif",
    "Pemodelan Skenario"
  ],
  "VP Corporate Strategy": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Strategi Korporat",
    "Analisis Kompetitif",
    "Pemodelan Skenario"
  ],
  "Head of Governance": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Manajemen Risiko",
    "Kepatuhan Regulasi",
    "Audit Internal"
  ],
  "Head of Finance": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Pelaporan Keuangan",
    "Analisis Anggaran",
    "Manajemen Risiko",
    "Kepatuhan Pajak",
    "Standar Akuntansi"
  ],
  "Senior Finance Analyst": [
    "Logika Berpikir",
    "Daya Analisa",
    "Kemampuan Numerikal",
    "Kemampuan verbal",
    "Kerjasama",
    "Fleksibilitas",
    "Pemodelan Keuangan",
    "Analisis Varians",
    "Rekonsiliasi",
    "Spreadsheet Lanjutan",
    "Standar Akuntansi"
  ],
  "Finance Analyst": [
    "Logika Berpikir",
    "Daya Analisa",
    "Kemampuan Numerikal",
    "Kemampuan verbal",
    "Kerjasama",
    "Fleksibilitas",
    "Pemodelan Keuangan",
    "Rekonsiliasi",
    "Analisis Varians",
    "Spreadsheet Lanjutan",
    "Standar Akuntansi"
  ],
  "Controller": [
    "Logika Berpikir",
    "Daya Analisa",
    "Kemampuan Numerikal",
    "Kemampuan verbal",
    "Kerjasama",
    "Fleksibilitas",
    "Pengendalian Internal",
    "Pelaporan Keuangan",
    "Audit Kepatuhan",
    "Standar Akuntansi"
  ],
  "HR Business Partner": [
    "Keterampilan Interpersonal",
    "Kerjasama",
    "Kemampuan verbal",
    "Fleksibilitas",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Manajemen Talenta",
    "Perencanaan SDM",
    "Hubungan Industrial",
    "HRIS"
  ],
  "HR Manager": [
    "Keterampilan Interpersonal",
    "Kerjasama",
    "Kemampuan verbal",
    "Fleksibilitas",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Manajemen Kinerja",
    "Remunerasi",
    "Hubungan Industrial",
    "HRIS"
  ],
  "Talent Acquisition Lead": [
    "Keterampilan Interpersonal",
    "Kerjasama",
    "Kemampuan verbal",
    "Fleksibilitas",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Sourcing Kandidat",
    "Teknik Wawancara",
    "Employer Branding",
    "ATS"
  ],
  "People Ops Specialist": [
    "Keterampilan Interpersonal",
    "Kerjasama",
    "Kemampuan verbal",
    "Fleksibilitas",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Administrasi Personalia",
    "Onboarding",
    "Kepatuhan Ketenagakerjaan",
    "HRIS"
  ],
  "VP Operations": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Perencanaan Kapasitas",
    "Manajemen Rantai Pasok",
    "Kendali Mutu",
    "Analitik Operasional",
    "Keselamatan Kerja"
  ],
  "Operations Manager": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Perencanaan Produksi",
    "Kendali Mutu",
    "Efisiensi Proses",
    "Keselamatan Kerja"
  ],
  "Supply Chain Lead": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Manajemen Rantai Pasok",
    "Manajemen Vendor",
    "Perencanaan Inventori",
    "Sistem ERP"
  ],
  "Operations Analyst": [
    "Logika Berpikir",
    "Daya Analisa",
    "Kemampuan Numerikal",
    "Kemampuan verbal",
    "Kerjasama",
    "Fleksibilitas",
    "Analitik Operasional",
    "Pemetaan Proses",
    "Spreadsheet Lanjutan"
  ],
  "Head of Marketing": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Strategi Kampanye",
    "Riset Pasar",
    "Manajemen Brand",
    "Analitik Digital",
    "Otomasi Pemasaran"
  ],
  "Senior Marketing Manager": [
    "Kemampuan verbal",
    "Fleksibilitas",
    "Daya Analisa",
    "Kerjasama",
    "Keterampilan Interpersonal",
    "Kemampuan Perencanaan",
    "Strategi Kampanye",
    "Riset Pasar",
    "Analitik Digital"
  ],
  "Brand Manager": [
    "Kemampuan verbal",
    "Fleksibilitas",
    "Daya Analisa",
    "Kerjasama",
    "Keterampilan Interpersonal",
    "Kemampuan Perencanaan",
    "Manajemen Brand",
    "Strategi Kampanye",
    "Riset Pasar"
  ],
  "Growth Marketing Lead": [
    "Logika Berpikir",
    "Daya Analisa",
    "Kemampuan Numerikal",
    "Kemampuan verbal",
    "Kerjasama",
    "Fleksibilitas",
    "Eksperimen Pertumbuhan",
    "Optimasi Konversi",
    "Analitik Digital"
  ],
  "Senior Brand Strategist": [
    "Kemampuan verbal",
    "Fleksibilitas",
    "Daya Analisa",
    "Kerjasama",
    "Keterampilan Interpersonal",
    "Kemampuan Perencanaan",
    "Strategi Brand",
    "Riset Pasar",
    "Narasi & Positioning"
  ],
  "Chief Revenue Officer": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Strategi Pendapatan",
    "Manajemen Pipeline",
    "Penetapan Harga"
  ],
  "Creative Director": [
    "Kemampuan verbal",
    "Fleksibilitas",
    "Daya Analisa",
    "Kerjasama",
    "Keterampilan Interpersonal",
    "Kemampuan Perencanaan",
    "Arahan Kreatif",
    "Storytelling Visual",
    "Manajemen Produksi"
  ],
  "Principal Engineer": [
    "Logika Berpikir",
    "Daya Analisa",
    "Kerjasama",
    "Fleksibilitas",
    "Kemampuan Perencanaan",
    "Kemampuan verbal",
    "Arsitektur Sistem",
    "Desain Terdistribusi",
    "Technical Roadmap",
    "Cloud Infrastructure",
    "Observability"
  ],
  "Operations Strategist": [
    "Logika Berpikir",
    "Daya Analisa",
    "Kemampuan Numerikal",
    "Kemampuan verbal",
    "Kerjasama",
    "Fleksibilitas",
    "Perencanaan Strategis",
    "Analitik Operasional",
    "Pemodelan Skenario"
  ],
  "Growth Marketing Manager": [
    "Logika Berpikir",
    "Daya Analisa",
    "Kemampuan Numerikal",
    "Kemampuan verbal",
    "Kerjasama",
    "Fleksibilitas",
    "Eksperimen Pertumbuhan",
    "Analitik Digital",
    "Optimasi Konversi",
    "Otomasi Pemasaran"
  ],
  "Senior Finance Manager": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Pelaporan Keuangan",
    "Analisis Anggaran",
    "Manajemen Kas",
    "Standar Akuntansi"
  ],
  "Supply Chain Manager": [
    "Leadership",
    "Kemampuan Perencanaan",
    "Daya Analisa",
    "Keterampilan Interpersonal",
    "Kemampuan verbal",
    "Kerjasama",
    "Manajemen Rantai Pasok",
    "Negosiasi Pengadaan",
    "Perencanaan Inventori",
    "Sistem ERP"
  ],
  "Digital Content Specialist": [
    "Kemampuan verbal",
    "Fleksibilitas",
    "Daya Analisa",
    "Kerjasama",
    "Keterampilan Interpersonal",
    "Kemampuan Perencanaan",
    "Penulisan Konten",
    "Produksi Visual",
    "SEO",
    "Analitik Digital"
  ]
};

/** Job (departemen) tiap posisi — dipakai untuk menemukan standar aspeknya. */
export const JOB_BY_POSITION: Record<string, string> = {
  "Head of Engineering": "Teknologi",
  "Senior Engineer": "Teknologi",
  "Frontend Lead": "Teknologi",
  "Backend Lead": "Teknologi",
  "Chief Executive Officer": "Strategi",
  "Chief Strategy Officer": "Strategi",
  "VP Corporate Strategy": "Strategi",
  "Head of Governance": "Strategi",
  "Head of Finance": "Keuangan",
  "Senior Finance Analyst": "Keuangan",
  "Finance Analyst": "Keuangan",
  "Controller": "Keuangan",
  "HR Business Partner": "SDM",
  "HR Manager": "SDM",
  "Talent Acquisition Lead": "SDM",
  "People Ops Specialist": "SDM",
  "VP Operations": "Operasional",
  "Operations Manager": "Operasional",
  "Supply Chain Lead": "Operasional",
  "Operations Analyst": "Operasional",
  "Head of Marketing": "Pemasaran",
  "Senior Marketing Manager": "Pemasaran",
  "Brand Manager": "Pemasaran",
  "Growth Marketing Lead": "Pemasaran",
  "Senior Brand Strategist": "Pemasaran",
  "Chief Revenue Officer": "Strategi",
  "Creative Director": "Pemasaran",
  "Principal Engineer": "Teknologi",
  "Operations Strategist": "Operasional",
  "Growth Marketing Manager": "Pemasaran",
  "Senior Finance Manager": "Keuangan",
  "Supply Chain Manager": "Operasional",
  "Digital Content Specialist": "Pemasaran"
};

/** Standar tiap aspek per Job — aspek yang sama boleh beda antar Job. */
export const STANDARDS_BY_JOB: Record<string, Record<string, number>> = {
  "Teknologi": {
    "Leadership": 4,
    "Kemampuan Perencanaan": 4,
    "Daya Analisa": 3,
    "Keterampilan Interpersonal": 4,
    "Kemampuan verbal": 4,
    "Kerjasama": 4,
    "Arsitektur Sistem": 4,
    "Code Review": 4,
    "Keamanan Aplikasi": 3,
    "CI/CD": 3,
    "Cloud Infrastructure": 3,
    "Observability": 4,
    "Logika Berpikir": 4,
    "Fleksibilitas": 3,
    "Kualitas Kode": 4,
    "Pengujian Otomatis": 4,
    "Debugging": 3,
    "Version Control": 4,
    "Arsitektur Komponen": 4,
    "State Management": 3,
    "Aksesibilitas": 3,
    "Performa Web": 3,
    "Design System": 4,
    "Desain API": 3,
    "Basis Data": 3,
    "Optimasi Query": 3,
    "Message Queue": 3,
    "Containerization": 4,
    "Desain Terdistribusi": 4,
    "Technical Roadmap": 4
  },
  "Strategi": {
    "Leadership": 4,
    "Kemampuan Perencanaan": 4,
    "Daya Analisa": 5,
    "Keterampilan Interpersonal": 4,
    "Kemampuan verbal": 4,
    "Kerjasama": 4,
    "Strategi Korporat": 4,
    "Alokasi Modal": 4,
    "Tata Kelola": 5,
    "Analisis Kompetitif": 5,
    "Pemodelan Skenario": 4,
    "Manajemen Risiko": 4,
    "Kepatuhan Regulasi": 4,
    "Audit Internal": 5,
    "Strategi Pendapatan": 4,
    "Manajemen Pipeline": 5,
    "Penetapan Harga": 4
  },
  "Keuangan": {
    "Leadership": 4,
    "Kemampuan Perencanaan": 4,
    "Daya Analisa": 3,
    "Keterampilan Interpersonal": 4,
    "Kemampuan verbal": 4,
    "Kerjasama": 4,
    "Pelaporan Keuangan": 3,
    "Analisis Anggaran": 4,
    "Manajemen Risiko": 4,
    "Kepatuhan Pajak": 3,
    "Standar Akuntansi": 4,
    "Logika Berpikir": 4,
    "Kemampuan Numerikal": 4,
    "Fleksibilitas": 3,
    "Pemodelan Keuangan": 4,
    "Analisis Varians": 3,
    "Rekonsiliasi": 4,
    "Spreadsheet Lanjutan": 4,
    "Pengendalian Internal": 4,
    "Audit Kepatuhan": 3,
    "Manajemen Kas": 4
  },
  "SDM": {
    "Keterampilan Interpersonal": 4,
    "Kerjasama": 4,
    "Kemampuan verbal": 4,
    "Fleksibilitas": 3,
    "Kemampuan Perencanaan": 4,
    "Daya Analisa": 3,
    "Manajemen Talenta": 4,
    "Perencanaan SDM": 3,
    "Hubungan Industrial": 4,
    "HRIS": 3,
    "Manajemen Kinerja": 3,
    "Remunerasi": 4,
    "Sourcing Kandidat": 3,
    "Teknik Wawancara": 4,
    "Employer Branding": 3,
    "ATS": 3,
    "Administrasi Personalia": 3,
    "Onboarding": 4,
    "Kepatuhan Ketenagakerjaan": 4
  },
  "Operasional": {
    "Leadership": 4,
    "Kemampuan Perencanaan": 4,
    "Daya Analisa": 5,
    "Keterampilan Interpersonal": 4,
    "Kemampuan verbal": 4,
    "Kerjasama": 4,
    "Perencanaan Kapasitas": 4,
    "Manajemen Rantai Pasok": 4,
    "Kendali Mutu": 4,
    "Analitik Operasional": 5,
    "Keselamatan Kerja": 4,
    "Perencanaan Produksi": 4,
    "Efisiensi Proses": 4,
    "Manajemen Vendor": 5,
    "Perencanaan Inventori": 5,
    "Sistem ERP": 5,
    "Logika Berpikir": 4,
    "Kemampuan Numerikal": 4,
    "Fleksibilitas": 5,
    "Pemetaan Proses": 4,
    "Spreadsheet Lanjutan": 4,
    "Perencanaan Strategis": 5,
    "Pemodelan Skenario": 4,
    "Negosiasi Pengadaan": 4
  },
  "Pemasaran": {
    "Leadership": 4,
    "Kemampuan Perencanaan": 4,
    "Daya Analisa": 3,
    "Keterampilan Interpersonal": 4,
    "Kemampuan verbal": 4,
    "Kerjasama": 4,
    "Strategi Kampanye": 4,
    "Riset Pasar": 3,
    "Manajemen Brand": 4,
    "Analitik Digital": 4,
    "Otomasi Pemasaran": 3,
    "Fleksibilitas": 3,
    "Logika Berpikir": 4,
    "Kemampuan Numerikal": 4,
    "Eksperimen Pertumbuhan": 3,
    "Optimasi Konversi": 4,
    "Strategi Brand": 3,
    "Narasi & Positioning": 4,
    "Arahan Kreatif": 4,
    "Storytelling Visual": 3,
    "Manajemen Produksi": 4,
    "Penulisan Konten": 3,
    "Produksi Visual": 4,
    "SEO": 4
  }
};

/** Skor tiap partisipan per aspek. */
export const SCORES_BY_PARTICIPANT: Record<string, Record<string, number>> = {
  "p01": {
    "Leadership": 3,
    "Kemampuan Perencanaan": 3,
    "Daya Analisa": 4,
    "Keterampilan Interpersonal": 5,
    "Kemampuan verbal": 5,
    "Kerjasama": 2,
    "Arsitektur Sistem": 3,
    "Code Review": 2,
    "Keamanan Aplikasi": 3,
    "CI/CD": 4,
    "Cloud Infrastructure": 2,
    "Observability": 3
  },
  "p02": {
    "Logika Berpikir": 5,
    "Daya Analisa": 4,
    "Kerjasama": 3,
    "Fleksibilitas": 4,
    "Kemampuan Perencanaan": 4,
    "Kemampuan verbal": 5,
    "Kualitas Kode": 4,
    "Pengujian Otomatis": 4,
    "Debugging": 4,
    "Version Control": 5
  },
  "p03": {
    "Logika Berpikir": 2,
    "Daya Analisa": 1,
    "Kerjasama": 3,
    "Fleksibilitas": 1,
    "Kemampuan Perencanaan": 4,
    "Kemampuan verbal": 2,
    "Arsitektur Komponen": 4,
    "State Management": 4,
    "Aksesibilitas": 2,
    "Performa Web": 4,
    "Design System": 5
  },
  "p04": {
    "Logika Berpikir": 3,
    "Daya Analisa": 2,
    "Kerjasama": 4,
    "Fleksibilitas": 2,
    "Kemampuan Perencanaan": 5,
    "Kemampuan verbal": 3,
    "Desain API": 2,
    "Basis Data": 1,
    "Optimasi Query": 4,
    "Message Queue": 1,
    "Containerization": 5
  },
  "p05": {
    "Leadership": 5,
    "Kemampuan Perencanaan": 5,
    "Daya Analisa": 4,
    "Keterampilan Interpersonal": 3,
    "Kemampuan verbal": 3,
    "Kerjasama": 4,
    "Strategi Korporat": 5,
    "Alokasi Modal": 4,
    "Tata Kelola": 3
  },
  "p06": {
    "Leadership": 2,
    "Kemampuan Perencanaan": 2,
    "Daya Analisa": 5,
    "Keterampilan Interpersonal": 4,
    "Kemampuan verbal": 4,
    "Kerjasama": 5,
    "Strategi Korporat": 5,
    "Analisis Kompetitif": 5,
    "Pemodelan Skenario": 4
  },
  "p07": {
    "Leadership": 3,
    "Kemampuan Perencanaan": 3,
    "Daya Analisa": 5,
    "Keterampilan Interpersonal": 4,
    "Kemampuan verbal": 4,
    "Kerjasama": 5,
    "Strategi Korporat": 2,
    "Analisis Kompetitif": 5,
    "Pemodelan Skenario": 4
  },
  "p08": {
    "Leadership": 3,
    "Kemampuan Perencanaan": 3,
    "Daya Analisa": 5,
    "Keterampilan Interpersonal": 5,
    "Kemampuan verbal": 5,
    "Kerjasama": 2,
    "Manajemen Risiko": 4,
    "Kepatuhan Regulasi": 4,
    "Audit Internal": 5
  },
  "p09": {
    "Leadership": 4,
    "Kemampuan Perencanaan": 4,
    "Daya Analisa": 4,
    "Keterampilan Interpersonal": 5,
    "Kemampuan verbal": 5,
    "Kerjasama": 3,
    "Pelaporan Keuangan": 2,
    "Analisis Anggaran": 5,
    "Manajemen Risiko": 4,
    "Kepatuhan Pajak": 4,
    "Standar Akuntansi": 4
  },
  "p10": {
    "Logika Berpikir": 5,
    "Daya Analisa": 4,
    "Kemampuan Numerikal": 4,
    "Kemampuan verbal": 5,
    "Kerjasama": 2,
    "Fleksibilitas": 4,
    "Pemodelan Keuangan": 3,
    "Analisis Varians": 1,
    "Rekonsiliasi": 2,
    "Spreadsheet Lanjutan": 3,
    "Standar Akuntansi": 4
  },
  "p11": {
    "Logika Berpikir": 5,
    "Daya Analisa": 4,
    "Kemampuan Numerikal": 5,
    "Kemampuan verbal": 5,
    "Kerjasama": 3,
    "Fleksibilitas": 4,
    "Pemodelan Keuangan": 3,
    "Rekonsiliasi": 3,
    "Analisis Varians": 2,
    "Spreadsheet Lanjutan": 4,
    "Standar Akuntansi": 4
  },
  "p12": {
    "Logika Berpikir": 2,
    "Daya Analisa": 1,
    "Kemampuan Numerikal": 5,
    "Kemampuan verbal": 2,
    "Kerjasama": 3,
    "Fleksibilitas": 1,
    "Pengendalian Internal": 5,
    "Pelaporan Keuangan": 2,
    "Audit Kepatuhan": 2,
    "Standar Akuntansi": 5
  },
  "p13": {
    "Keterampilan Interpersonal": 3,
    "Kerjasama": 4,
    "Kemampuan verbal": 3,
    "Fleksibilitas": 2,
    "Kemampuan Perencanaan": 5,
    "Daya Analisa": 2,
    "Manajemen Talenta": 4,
    "Perencanaan SDM": 4,
    "Hubungan Industrial": 3,
    "HRIS": 3
  },
  "p14": {
    "Keterampilan Interpersonal": 3,
    "Kerjasama": 4,
    "Kemampuan verbal": 3,
    "Fleksibilitas": 2,
    "Kemampuan Perencanaan": 5,
    "Daya Analisa": 2,
    "Manajemen Kinerja": 4,
    "Remunerasi": 4,
    "Hubungan Industrial": 4,
    "HRIS": 4
  },
  "p15": {
    "Keterampilan Interpersonal": 4,
    "Kerjasama": 5,
    "Kemampuan verbal": 4,
    "Fleksibilitas": 3,
    "Kemampuan Perencanaan": 2,
    "Daya Analisa": 3,
    "Sourcing Kandidat": 4,
    "Teknik Wawancara": 5,
    "Employer Branding": 4,
    "ATS": 4
  },
  "p16": {
    "Keterampilan Interpersonal": 4,
    "Kerjasama": 5,
    "Kemampuan verbal": 4,
    "Fleksibilitas": 3,
    "Kemampuan Perencanaan": 3,
    "Daya Analisa": 3,
    "Administrasi Personalia": 1,
    "Onboarding": 4,
    "Kepatuhan Ketenagakerjaan": 5,
    "HRIS": 1
  },
  "p17": {
    "Leadership": 3,
    "Kemampuan Perencanaan": 3,
    "Daya Analisa": 5,
    "Keterampilan Interpersonal": 5,
    "Kemampuan verbal": 5,
    "Kerjasama": 2,
    "Perencanaan Kapasitas": 4,
    "Manajemen Rantai Pasok": 3,
    "Kendali Mutu": 5,
    "Analitik Operasional": 5,
    "Keselamatan Kerja": 5
  },
  "p18": {
    "Leadership": 4,
    "Kemampuan Perencanaan": 4,
    "Daya Analisa": 5,
    "Keterampilan Interpersonal": 5,
    "Kemampuan verbal": 5,
    "Kerjasama": 3,
    "Perencanaan Produksi": 3,
    "Kendali Mutu": 2,
    "Efisiensi Proses": 5,
    "Keselamatan Kerja": 5
  },
  "p19": {
    "Leadership": 4,
    "Kemampuan Perencanaan": 4,
    "Daya Analisa": 3,
    "Keterampilan Interpersonal": 2,
    "Kemampuan verbal": 2,
    "Kerjasama": 3,
    "Manajemen Rantai Pasok": 4,
    "Manajemen Vendor": 4,
    "Perencanaan Inventori": 3,
    "Sistem ERP": 5
  },
  "p20": {
    "Logika Berpikir": 5,
    "Daya Analisa": 5,
    "Kemampuan Numerikal": 5,
    "Kemampuan verbal": 5,
    "Kerjasama": 3,
    "Fleksibilitas": 5,
    "Analitik Operasional": 5,
    "Pemetaan Proses": 3,
    "Spreadsheet Lanjutan": 4
  },
  "p21": {
    "Leadership": 4,
    "Kemampuan Perencanaan": 4,
    "Daya Analisa": 1,
    "Keterampilan Interpersonal": 2,
    "Kemampuan verbal": 2,
    "Kerjasama": 3,
    "Strategi Kampanye": 4,
    "Riset Pasar": 4,
    "Manajemen Brand": 2,
    "Analitik Digital": 3,
    "Otomasi Pemasaran": 4
  },
  "p22": {
    "Kemampuan verbal": 3,
    "Fleksibilitas": 2,
    "Daya Analisa": 2,
    "Kerjasama": 4,
    "Keterampilan Interpersonal": 3,
    "Kemampuan Perencanaan": 5,
    "Strategi Kampanye": 4,
    "Riset Pasar": 4,
    "Analitik Digital": 3
  },
  "p23": {
    "Kemampuan verbal": 3,
    "Fleksibilitas": 2,
    "Daya Analisa": 2,
    "Kerjasama": 4,
    "Keterampilan Interpersonal": 3,
    "Kemampuan Perencanaan": 5,
    "Manajemen Brand": 3,
    "Strategi Kampanye": 5,
    "Riset Pasar": 1
  },
  "p24": {
    "Logika Berpikir": 4,
    "Daya Analisa": 3,
    "Kemampuan Numerikal": 3,
    "Kemampuan verbal": 4,
    "Kerjasama": 5,
    "Fleksibilitas": 3,
    "Eksperimen Pertumbuhan": 2,
    "Optimasi Konversi": 3,
    "Analitik Digital": 4
  },
  "p25": {
    "Kemampuan verbal": 4,
    "Fleksibilitas": 3,
    "Daya Analisa": 3,
    "Kerjasama": 5,
    "Keterampilan Interpersonal": 4,
    "Kemampuan Perencanaan": 3,
    "Strategi Brand": 2,
    "Riset Pasar": 2,
    "Narasi & Positioning": 3
  },
  "p26": {
    "Leadership": 3,
    "Kemampuan Perencanaan": 3,
    "Daya Analisa": 5,
    "Keterampilan Interpersonal": 5,
    "Kemampuan verbal": 5,
    "Kerjasama": 2,
    "Strategi Pendapatan": 4,
    "Manajemen Pipeline": 5,
    "Penetapan Harga": 4
  },
  "p27": {
    "Kemampuan verbal": 5,
    "Fleksibilitas": 4,
    "Daya Analisa": 4,
    "Kerjasama": 3,
    "Keterampilan Interpersonal": 5,
    "Kemampuan Perencanaan": 4,
    "Arahan Kreatif": 5,
    "Storytelling Visual": 3,
    "Manajemen Produksi": 4
  },
  "p28": {
    "Logika Berpikir": 2,
    "Daya Analisa": 1,
    "Kerjasama": 3,
    "Fleksibilitas": 1,
    "Kemampuan Perencanaan": 4,
    "Kemampuan verbal": 2,
    "Arsitektur Sistem": 4,
    "Desain Terdistribusi": 3,
    "Technical Roadmap": 4,
    "Cloud Infrastructure": 3,
    "Observability": 4
  },
  "p29": {
    "Logika Berpikir": 3,
    "Daya Analisa": 4,
    "Kemampuan Numerikal": 2,
    "Kemampuan verbal": 3,
    "Kerjasama": 4,
    "Fleksibilitas": 4,
    "Perencanaan Strategis": 3,
    "Analitik Operasional": 4,
    "Pemodelan Skenario": 3
  },
  "p30": {
    "Logika Berpikir": 2,
    "Daya Analisa": 1,
    "Kemampuan Numerikal": 5,
    "Kemampuan verbal": 2,
    "Kerjasama": 3,
    "Fleksibilitas": 1,
    "Eksperimen Pertumbuhan": 4,
    "Analitik Digital": 3,
    "Optimasi Konversi": 5,
    "Otomasi Pemasaran": 4
  },
  "p31": {
    "Leadership": 5,
    "Kemampuan Perencanaan": 5,
    "Daya Analisa": 2,
    "Keterampilan Interpersonal": 3,
    "Kemampuan verbal": 3,
    "Kerjasama": 4,
    "Pelaporan Keuangan": 3,
    "Analisis Anggaran": 3,
    "Manajemen Kas": 4,
    "Standar Akuntansi": 5
  },
  "p32": {
    "Leadership": 5,
    "Kemampuan Perencanaan": 5,
    "Daya Analisa": 4,
    "Keterampilan Interpersonal": 3,
    "Kemampuan verbal": 3,
    "Kerjasama": 4,
    "Manajemen Rantai Pasok": 5,
    "Negosiasi Pengadaan": 5,
    "Perencanaan Inventori": 4,
    "Sistem ERP": 5
  },
  "p33": {
    "Kemampuan verbal": 4,
    "Fleksibilitas": 3,
    "Daya Analisa": 3,
    "Kerjasama": 5,
    "Keterampilan Interpersonal": 4,
    "Kemampuan Perencanaan": 2,
    "Penulisan Konten": 4,
    "Produksi Visual": 3,
    "SEO": 4,
    "Analitik Digital": 4
  }
};

/** Breakdown Key Behaviour tiap partisipan per aspek. */
export const KB_BY_PARTICIPANT: Record<string, Record<string, AspectKeyBehaviour[]>> = {
  "p01": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 2
      },
      {
        "label": "Memotivasi Tim",
        "score": 2
      },
      {
        "label": "Delegasi Tugas",
        "score": 3
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 3
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 3
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 4
      },
      {
        "label": "Manajemen Waktu",
        "score": 3
      },
      {
        "label": "Antisipasi Risiko",
        "score": 2
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 2
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 2
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 5
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 5
      },
      {
        "label": "Sintesis Informasi",
        "score": 5
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 5
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 3
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 4
      },
      {
        "label": "Empati",
        "score": 4
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 4
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 4
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 5
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 5
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 5
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 5
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 4
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 5
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 1
      },
      {
        "label": "Resolusi Konflik",
        "score": 2
      },
      {
        "label": "Berbagi Informasi",
        "score": 2
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 3
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 1
      }
    ],
    "Arsitektur Sistem": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Code Review": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 1
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 1
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 1
      }
    ],
    "Keamanan Aplikasi": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 2
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "CI/CD": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 3
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 3
      }
    ],
    "Cloud Infrastructure": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 2
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 2
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 3
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 3
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 2
      }
    ],
    "Observability": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 2
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 3
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 2
      }
    ]
  },
  "p02": {
    "Logika Berpikir": [
      {
        "label": "Berpikir Sistematis",
        "score": 5
      },
      {
        "label": "Berpikir Kritis",
        "score": 5
      },
      {
        "label": "Pemecahan Masalah",
        "score": 4
      },
      {
        "label": "Pengambilan Kesimpulan Logis",
        "score": 4
      },
      {
        "label": "Pengujian Asumsi",
        "score": 5
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 4
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 3
      },
      {
        "label": "Sintesis Informasi",
        "score": 3
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 4
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 4
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 3
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 3
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 4
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 3
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 3
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 5
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 5
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 3
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 4
      },
      {
        "label": "Manajemen Waktu",
        "score": 3
      },
      {
        "label": "Antisipasi Risiko",
        "score": 5
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 4
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 4
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 5
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 5
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 5
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 5
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 5
      }
    ],
    "Kualitas Kode": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Pengujian Otomatis": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Debugging": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Version Control": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 5
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 5
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 5
      }
    ]
  },
  "p03": {
    "Logika Berpikir": [
      {
        "label": "Berpikir Sistematis",
        "score": 1
      },
      {
        "label": "Berpikir Kritis",
        "score": 1
      },
      {
        "label": "Pemecahan Masalah",
        "score": 3
      },
      {
        "label": "Pengambilan Kesimpulan Logis",
        "score": 3
      },
      {
        "label": "Pengujian Asumsi",
        "score": 3
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 1
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 2
      },
      {
        "label": "Sintesis Informasi",
        "score": 2
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 1
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 2
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 4
      },
      {
        "label": "Resolusi Konflik",
        "score": 2
      },
      {
        "label": "Berbagi Informasi",
        "score": 2
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 2
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 1
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 1
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 1
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 1
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 1
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 3
      },
      {
        "label": "Manajemen Waktu",
        "score": 4
      },
      {
        "label": "Antisipasi Risiko",
        "score": 4
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 5
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 5
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 1
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 1
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 1
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 3
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 1
      }
    ],
    "Arsitektur Komponen": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "State Management": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Aksesibilitas": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 1
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Performa Web": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 3
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 3
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 3
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 4
      }
    ],
    "Design System": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 5
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 5
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 5
      }
    ]
  },
  "p04": {
    "Logika Berpikir": [
      {
        "label": "Berpikir Sistematis",
        "score": 4
      },
      {
        "label": "Berpikir Kritis",
        "score": 4
      },
      {
        "label": "Pemecahan Masalah",
        "score": 3
      },
      {
        "label": "Pengambilan Kesimpulan Logis",
        "score": 3
      },
      {
        "label": "Pengujian Asumsi",
        "score": 2
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 2
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 2
      },
      {
        "label": "Sintesis Informasi",
        "score": 2
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 2
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 1
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 3
      },
      {
        "label": "Resolusi Konflik",
        "score": 5
      },
      {
        "label": "Berbagi Informasi",
        "score": 5
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 4
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 3
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 3
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 1
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 3
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 3
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 5
      },
      {
        "label": "Manajemen Waktu",
        "score": 5
      },
      {
        "label": "Antisipasi Risiko",
        "score": 4
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 4
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 4
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 4
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 3
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 3
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 2
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 4
      }
    ],
    "Desain API": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 1
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Basis Data": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 1
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 1
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 1
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 2
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 1
      }
    ],
    "Optimasi Query": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Message Queue": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 2
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 2
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 1
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 1
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 1
      }
    ],
    "Containerization": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 4
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 5
      }
    ]
  },
  "p05": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 5
      },
      {
        "label": "Memotivasi Tim",
        "score": 5
      },
      {
        "label": "Delegasi Tugas",
        "score": 5
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 5
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 4
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 5
      },
      {
        "label": "Manajemen Waktu",
        "score": 4
      },
      {
        "label": "Antisipasi Risiko",
        "score": 5
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 5
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 5
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 5
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 3
      },
      {
        "label": "Sintesis Informasi",
        "score": 3
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 5
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 5
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 3
      },
      {
        "label": "Empati",
        "score": 3
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 4
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 4
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 4
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 3
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 4
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 4
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 4
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 3
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 5
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 5
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 4
      }
    ],
    "Strategi Korporat": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Alokasi Modal": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Tata Kelola": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 3
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 3
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 4
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 4
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 2
      }
    ]
  },
  "p06": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 3
      },
      {
        "label": "Memotivasi Tim",
        "score": 3
      },
      {
        "label": "Delegasi Tugas",
        "score": 1
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 1
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 3
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 1
      },
      {
        "label": "Manajemen Waktu",
        "score": 3
      },
      {
        "label": "Antisipasi Risiko",
        "score": 3
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 2
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 2
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 4
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 5
      },
      {
        "label": "Sintesis Informasi",
        "score": 5
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 4
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 5
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 5
      },
      {
        "label": "Empati",
        "score": 5
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 4
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 4
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 3
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 3
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 3
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 3
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 4
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 3
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 5
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 4
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 5
      }
    ],
    "Strategi Korporat": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Analisis Kompetitif": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Pemodelan Skenario": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 4
      }
    ]
  },
  "p07": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 2
      },
      {
        "label": "Memotivasi Tim",
        "score": 2
      },
      {
        "label": "Delegasi Tugas",
        "score": 3
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 3
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 3
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 4
      },
      {
        "label": "Manajemen Waktu",
        "score": 3
      },
      {
        "label": "Antisipasi Risiko",
        "score": 2
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 2
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 2
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 5
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 5
      },
      {
        "label": "Sintesis Informasi",
        "score": 5
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 5
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 4
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 3
      },
      {
        "label": "Empati",
        "score": 3
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 3
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 3
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 5
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 4
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 5
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 5
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 3
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 4
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 4
      },
      {
        "label": "Resolusi Konflik",
        "score": 5
      },
      {
        "label": "Berbagi Informasi",
        "score": 5
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 5
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 4
      }
    ],
    "Strategi Korporat": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 1
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Analisis Kompetitif": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Pemodelan Skenario": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 5
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 5
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 3
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 4
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 3
      }
    ]
  },
  "p08": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 4
      },
      {
        "label": "Memotivasi Tim",
        "score": 4
      },
      {
        "label": "Delegasi Tugas",
        "score": 4
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 4
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 2
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 3
      },
      {
        "label": "Manajemen Waktu",
        "score": 2
      },
      {
        "label": "Antisipasi Risiko",
        "score": 4
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 3
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 3
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 5
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 4
      },
      {
        "label": "Sintesis Informasi",
        "score": 4
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 5
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 5
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 5
      },
      {
        "label": "Empati",
        "score": 5
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 5
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 5
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 5
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 5
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 5
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 5
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 5
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 5
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 2
      },
      {
        "label": "Resolusi Konflik",
        "score": 3
      },
      {
        "label": "Berbagi Informasi",
        "score": 3
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 2
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Manajemen Risiko": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Kepatuhan Regulasi": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 3
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 4
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 3
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 3
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 4
      }
    ],
    "Audit Internal": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 5
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 4
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 5
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 5
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 5
      }
    ]
  },
  "p09": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 4
      },
      {
        "label": "Memotivasi Tim",
        "score": 4
      },
      {
        "label": "Delegasi Tugas",
        "score": 3
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 3
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 4
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 3
      },
      {
        "label": "Manajemen Waktu",
        "score": 4
      },
      {
        "label": "Antisipasi Risiko",
        "score": 4
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 5
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 5
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 3
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 5
      },
      {
        "label": "Sintesis Informasi",
        "score": 5
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 3
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 5
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 5
      },
      {
        "label": "Empati",
        "score": 5
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 5
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 5
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 4
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 4
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 4
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 4
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 5
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 4
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 4
      },
      {
        "label": "Resolusi Konflik",
        "score": 2
      },
      {
        "label": "Berbagi Informasi",
        "score": 2
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 2
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Pelaporan Keuangan": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 1
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Analisis Anggaran": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Manajemen Risiko": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Kepatuhan Pajak": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 4
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 4
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 5
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 5
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 3
      }
    ],
    "Standar Akuntansi": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 5
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 5
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 4
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 4
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 3
      }
    ]
  },
  "p10": {
    "Logika Berpikir": [
      {
        "label": "Berpikir Sistematis",
        "score": 5
      },
      {
        "label": "Berpikir Kritis",
        "score": 5
      },
      {
        "label": "Pemecahan Masalah",
        "score": 5
      },
      {
        "label": "Pengambilan Kesimpulan Logis",
        "score": 5
      },
      {
        "label": "Pengujian Asumsi",
        "score": 4
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 5
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 5
      },
      {
        "label": "Sintesis Informasi",
        "score": 5
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 5
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 3
      }
    ],
    "Kemampuan Numerikal": [
      {
        "label": "Ketepatan Hitung",
        "score": 4
      },
      {
        "label": "Interpretasi Data Angka",
        "score": 4
      },
      {
        "label": "Estimasi Cepat",
        "score": 4
      },
      {
        "label": "Pembacaan Tabel & Grafik",
        "score": 4
      },
      {
        "label": "Ketelitian Angka",
        "score": 4
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 5
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 5
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 5
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 4
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 5
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 1
      },
      {
        "label": "Resolusi Konflik",
        "score": 2
      },
      {
        "label": "Berbagi Informasi",
        "score": 2
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 3
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 1
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 4
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 4
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 3
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 4
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 4
      }
    ],
    "Pemodelan Keuangan": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 2
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Analisis Varians": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 1
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Rekonsiliasi": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 1
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Spreadsheet Lanjutan": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 2
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 3
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 2
      }
    ],
    "Standar Akuntansi": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 3
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 5
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 3
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 3
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 5
      }
    ]
  },
  "p11": {
    "Logika Berpikir": [
      {
        "label": "Berpikir Sistematis",
        "score": 5
      },
      {
        "label": "Berpikir Kritis",
        "score": 5
      },
      {
        "label": "Pemecahan Masalah",
        "score": 4
      },
      {
        "label": "Pengambilan Kesimpulan Logis",
        "score": 4
      },
      {
        "label": "Pengujian Asumsi",
        "score": 5
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 4
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 3
      },
      {
        "label": "Sintesis Informasi",
        "score": 3
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 4
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 4
      }
    ],
    "Kemampuan Numerikal": [
      {
        "label": "Ketepatan Hitung",
        "score": 5
      },
      {
        "label": "Interpretasi Data Angka",
        "score": 5
      },
      {
        "label": "Estimasi Cepat",
        "score": 4
      },
      {
        "label": "Pembacaan Tabel & Grafik",
        "score": 4
      },
      {
        "label": "Ketelitian Angka",
        "score": 4
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 5
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 5
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 5
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 5
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 5
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 3
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 3
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 4
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 3
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 3
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 5
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 5
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 3
      }
    ],
    "Pemodelan Keuangan": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Rekonsiliasi": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Analisis Varians": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 1
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 1
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 1
      }
    ],
    "Spreadsheet Lanjutan": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 3
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 3
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 3
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 4
      }
    ],
    "Standar Akuntansi": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 4
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 3
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 5
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 5
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 4
      }
    ]
  },
  "p12": {
    "Logika Berpikir": [
      {
        "label": "Berpikir Sistematis",
        "score": 1
      },
      {
        "label": "Berpikir Kritis",
        "score": 1
      },
      {
        "label": "Pemecahan Masalah",
        "score": 3
      },
      {
        "label": "Pengambilan Kesimpulan Logis",
        "score": 3
      },
      {
        "label": "Pengujian Asumsi",
        "score": 3
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 1
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 2
      },
      {
        "label": "Sintesis Informasi",
        "score": 2
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 1
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 2
      }
    ],
    "Kemampuan Numerikal": [
      {
        "label": "Ketepatan Hitung",
        "score": 4
      },
      {
        "label": "Interpretasi Data Angka",
        "score": 4
      },
      {
        "label": "Estimasi Cepat",
        "score": 5
      },
      {
        "label": "Pembacaan Tabel & Grafik",
        "score": 5
      },
      {
        "label": "Ketelitian Angka",
        "score": 5
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 1
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 1
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 1
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 3
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 1
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 4
      },
      {
        "label": "Resolusi Konflik",
        "score": 2
      },
      {
        "label": "Berbagi Informasi",
        "score": 2
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 2
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 1
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 1
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 1
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 1
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 1
      }
    ],
    "Pengendalian Internal": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Pelaporan Keuangan": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 1
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Audit Kepatuhan": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 1
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 2
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 1
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 1
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 2
      }
    ],
    "Standar Akuntansi": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 5
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 5
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 5
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 5
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 4
      }
    ]
  },
  "p13": {
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 2
      },
      {
        "label": "Empati",
        "score": 2
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 2
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 2
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 3
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 3
      },
      {
        "label": "Resolusi Konflik",
        "score": 5
      },
      {
        "label": "Berbagi Informasi",
        "score": 5
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 4
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 4
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 3
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 3
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 2
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 4
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 3
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 3
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 1
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 3
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 3
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 5
      },
      {
        "label": "Manajemen Waktu",
        "score": 5
      },
      {
        "label": "Antisipasi Risiko",
        "score": 4
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 4
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 4
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 2
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 2
      },
      {
        "label": "Sintesis Informasi",
        "score": 2
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 2
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 1
      }
    ],
    "Manajemen Talenta": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Perencanaan SDM": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Hubungan Industrial": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 3
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 2
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 4
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 4
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 3
      }
    ],
    "HRIS": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 2
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 3
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 2
      }
    ]
  },
  "p14": {
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 3
      },
      {
        "label": "Empati",
        "score": 3
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 4
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 4
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 4
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 5
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 5
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 4
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 3
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 4
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 4
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 4
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 3
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 1
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 1
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 2
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 2
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 1
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 5
      },
      {
        "label": "Manajemen Waktu",
        "score": 4
      },
      {
        "label": "Antisipasi Risiko",
        "score": 5
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 5
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 5
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 3
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 1
      },
      {
        "label": "Sintesis Informasi",
        "score": 1
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 3
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 3
      }
    ],
    "Manajemen Kinerja": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Remunerasi": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Hubungan Industrial": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 5
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 5
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 4
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 4
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 3
      }
    ],
    "HRIS": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 3
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 3
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 3
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 4
      }
    ]
  },
  "p15": {
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 5
      },
      {
        "label": "Empati",
        "score": 5
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 4
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 4
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 3
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 5
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 4
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 5
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 3
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 3
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 3
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 4
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 3
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 4
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 4
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 4
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 2
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 4
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 1
      },
      {
        "label": "Manajemen Waktu",
        "score": 3
      },
      {
        "label": "Antisipasi Risiko",
        "score": 3
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 2
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 2
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 2
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 3
      },
      {
        "label": "Sintesis Informasi",
        "score": 3
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 2
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 3
      }
    ],
    "Sourcing Kandidat": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Teknik Wawancara": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Employer Branding": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "ATS": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 5
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 5
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 4
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 4
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 5
      }
    ]
  },
  "p16": {
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 3
      },
      {
        "label": "Empati",
        "score": 3
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 3
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 3
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 5
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 4
      },
      {
        "label": "Resolusi Konflik",
        "score": 5
      },
      {
        "label": "Berbagi Informasi",
        "score": 5
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 5
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 4
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 4
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 5
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 5
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 3
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 4
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 3
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 3
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 2
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 3
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 3
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 4
      },
      {
        "label": "Manajemen Waktu",
        "score": 3
      },
      {
        "label": "Antisipasi Risiko",
        "score": 2
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 2
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 2
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 4
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 4
      },
      {
        "label": "Sintesis Informasi",
        "score": 4
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 4
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 2
      }
    ],
    "Administrasi Personalia": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 1
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Onboarding": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Kepatuhan Ketenagakerjaan": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 5
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 4
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 5
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 5
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 5
      }
    ],
    "HRIS": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 1
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 1
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 1
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 2
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 1
      }
    ]
  },
  "p17": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 4
      },
      {
        "label": "Memotivasi Tim",
        "score": 4
      },
      {
        "label": "Delegasi Tugas",
        "score": 4
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 4
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 2
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 3
      },
      {
        "label": "Manajemen Waktu",
        "score": 2
      },
      {
        "label": "Antisipasi Risiko",
        "score": 4
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 3
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 3
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 5
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 4
      },
      {
        "label": "Sintesis Informasi",
        "score": 4
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 5
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 5
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 5
      },
      {
        "label": "Empati",
        "score": 5
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 5
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 5
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 5
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 5
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 5
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 5
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 5
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 5
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 2
      },
      {
        "label": "Resolusi Konflik",
        "score": 3
      },
      {
        "label": "Berbagi Informasi",
        "score": 3
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 2
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Perencanaan Kapasitas": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Manajemen Rantai Pasok": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Kendali Mutu": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Analitik Operasional": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 5
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 5
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 5
      }
    ],
    "Keselamatan Kerja": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 4
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 5
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 4
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 4
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 5
      }
    ]
  },
  "p18": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 4
      },
      {
        "label": "Memotivasi Tim",
        "score": 4
      },
      {
        "label": "Delegasi Tugas",
        "score": 3
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 3
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 4
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 3
      },
      {
        "label": "Manajemen Waktu",
        "score": 4
      },
      {
        "label": "Antisipasi Risiko",
        "score": 4
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 5
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 5
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 4
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 5
      },
      {
        "label": "Sintesis Informasi",
        "score": 5
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 4
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 5
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 5
      },
      {
        "label": "Empati",
        "score": 5
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 5
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 5
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 4
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 4
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 4
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 4
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 5
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 4
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 4
      },
      {
        "label": "Resolusi Konflik",
        "score": 2
      },
      {
        "label": "Berbagi Informasi",
        "score": 2
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 2
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Perencanaan Produksi": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 2
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Kendali Mutu": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 1
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 1
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 1
      }
    ],
    "Efisiensi Proses": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Keselamatan Kerja": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 5
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 4
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 5
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 5
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 5
      }
    ]
  },
  "p19": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 3
      },
      {
        "label": "Memotivasi Tim",
        "score": 3
      },
      {
        "label": "Delegasi Tugas",
        "score": 5
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 5
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 5
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 4
      },
      {
        "label": "Manajemen Waktu",
        "score": 5
      },
      {
        "label": "Antisipasi Risiko",
        "score": 3
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 3
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 3
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 3
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 3
      },
      {
        "label": "Sintesis Informasi",
        "score": 3
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 3
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 2
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 1
      },
      {
        "label": "Empati",
        "score": 1
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 1
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 1
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 2
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 3
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 2
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 2
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 1
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 3
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 2
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 3
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 2
      }
    ],
    "Manajemen Rantai Pasok": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Manajemen Vendor": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Perencanaan Inventori": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Sistem ERP": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 5
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 5
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 4
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 4
      }
    ]
  },
  "p20": {
    "Logika Berpikir": [
      {
        "label": "Berpikir Sistematis",
        "score": 5
      },
      {
        "label": "Berpikir Kritis",
        "score": 5
      },
      {
        "label": "Pemecahan Masalah",
        "score": 4
      },
      {
        "label": "Pengambilan Kesimpulan Logis",
        "score": 4
      },
      {
        "label": "Pengujian Asumsi",
        "score": 5
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 5
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 4
      },
      {
        "label": "Sintesis Informasi",
        "score": 4
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 5
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 5
      }
    ],
    "Kemampuan Numerikal": [
      {
        "label": "Ketepatan Hitung",
        "score": 5
      },
      {
        "label": "Interpretasi Data Angka",
        "score": 5
      },
      {
        "label": "Estimasi Cepat",
        "score": 4
      },
      {
        "label": "Pembacaan Tabel & Grafik",
        "score": 4
      },
      {
        "label": "Ketelitian Angka",
        "score": 4
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 5
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 5
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 5
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 5
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 5
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 3
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 3
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 4
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 4
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 4
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 5
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 5
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 4
      }
    ],
    "Analitik Operasional": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 5
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 5
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 5
      }
    ],
    "Pemetaan Proses": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 2
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Spreadsheet Lanjutan": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 3
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 3
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 3
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 4
      }
    ]
  },
  "p21": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 4
      },
      {
        "label": "Memotivasi Tim",
        "score": 4
      },
      {
        "label": "Delegasi Tugas",
        "score": 3
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 3
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 4
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 3
      },
      {
        "label": "Manajemen Waktu",
        "score": 4
      },
      {
        "label": "Antisipasi Risiko",
        "score": 4
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 5
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 5
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 1
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 2
      },
      {
        "label": "Sintesis Informasi",
        "score": 2
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 1
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 2
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 2
      },
      {
        "label": "Empati",
        "score": 2
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 3
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 3
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 1
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 1
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 1
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 1
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 3
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 1
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 4
      },
      {
        "label": "Resolusi Konflik",
        "score": 2
      },
      {
        "label": "Berbagi Informasi",
        "score": 2
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 2
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Strategi Kampanye": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Riset Pasar": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Manajemen Brand": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 1
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Analitik Digital": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 2
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 3
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 2
      }
    ],
    "Otomasi Pemasaran": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 4
      }
    ]
  },
  "p22": {
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 4
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 3
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 3
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 2
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 4
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 3
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 3
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 1
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 3
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 3
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 2
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 2
      },
      {
        "label": "Sintesis Informasi",
        "score": 2
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 2
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 1
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 3
      },
      {
        "label": "Resolusi Konflik",
        "score": 5
      },
      {
        "label": "Berbagi Informasi",
        "score": 5
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 4
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 2
      },
      {
        "label": "Empati",
        "score": 2
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 2
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 2
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 3
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 5
      },
      {
        "label": "Manajemen Waktu",
        "score": 5
      },
      {
        "label": "Antisipasi Risiko",
        "score": 4
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 4
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 4
      }
    ],
    "Strategi Kampanye": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Riset Pasar": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Analitik Digital": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 2
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 2
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 4
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 2
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 3
      }
    ]
  },
  "p23": {
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 3
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 4
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 4
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 4
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 3
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 1
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 1
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 2
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 2
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 1
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 3
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 1
      },
      {
        "label": "Sintesis Informasi",
        "score": 1
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 3
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 3
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 5
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 5
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 4
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 3
      },
      {
        "label": "Empati",
        "score": 3
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 4
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 4
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 4
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 5
      },
      {
        "label": "Manajemen Waktu",
        "score": 4
      },
      {
        "label": "Antisipasi Risiko",
        "score": 5
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 5
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 5
      }
    ],
    "Manajemen Brand": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Strategi Kampanye": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Riset Pasar": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 1
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 1
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 1
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 1
      }
    ]
  },
  "p24": {
    "Logika Berpikir": [
      {
        "label": "Berpikir Sistematis",
        "score": 3
      },
      {
        "label": "Berpikir Kritis",
        "score": 3
      },
      {
        "label": "Pemecahan Masalah",
        "score": 4
      },
      {
        "label": "Pengambilan Kesimpulan Logis",
        "score": 4
      },
      {
        "label": "Pengujian Asumsi",
        "score": 4
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 2
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 3
      },
      {
        "label": "Sintesis Informasi",
        "score": 3
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 2
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 3
      }
    ],
    "Kemampuan Numerikal": [
      {
        "label": "Ketepatan Hitung",
        "score": 2
      },
      {
        "label": "Interpretasi Data Angka",
        "score": 2
      },
      {
        "label": "Estimasi Cepat",
        "score": 4
      },
      {
        "label": "Pembacaan Tabel & Grafik",
        "score": 4
      },
      {
        "label": "Ketelitian Angka",
        "score": 4
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 3
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 3
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 3
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 4
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 3
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 5
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 4
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 5
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 4
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 4
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 4
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 2
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 4
      }
    ],
    "Eksperimen Pertumbuhan": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 1
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 1
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 2
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 1
      }
    ],
    "Optimasi Konversi": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Analitik Digital": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 3
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 3
      }
    ]
  },
  "p25": {
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 4
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 5
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 5
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 3
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 4
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 3
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 3
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 2
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 3
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 3
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 4
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 4
      },
      {
        "label": "Sintesis Informasi",
        "score": 4
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 4
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 2
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 4
      },
      {
        "label": "Resolusi Konflik",
        "score": 5
      },
      {
        "label": "Berbagi Informasi",
        "score": 5
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 5
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 4
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 3
      },
      {
        "label": "Empati",
        "score": 3
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 3
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 3
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 5
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 4
      },
      {
        "label": "Manajemen Waktu",
        "score": 3
      },
      {
        "label": "Antisipasi Risiko",
        "score": 2
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 2
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 2
      }
    ],
    "Strategi Brand": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 1
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Riset Pasar": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 1
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Narasi & Positioning": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 2
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ]
  },
  "p26": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 4
      },
      {
        "label": "Memotivasi Tim",
        "score": 4
      },
      {
        "label": "Delegasi Tugas",
        "score": 4
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 4
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 2
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 3
      },
      {
        "label": "Manajemen Waktu",
        "score": 2
      },
      {
        "label": "Antisipasi Risiko",
        "score": 4
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 3
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 3
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 5
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 4
      },
      {
        "label": "Sintesis Informasi",
        "score": 4
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 5
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 5
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 5
      },
      {
        "label": "Empati",
        "score": 5
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 5
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 5
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 5
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 5
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 5
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 5
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 5
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 5
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 2
      },
      {
        "label": "Resolusi Konflik",
        "score": 3
      },
      {
        "label": "Berbagi Informasi",
        "score": 3
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 2
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Strategi Pendapatan": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Manajemen Pipeline": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Penetapan Harga": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ]
  },
  "p27": {
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 4
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 4
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 4
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 5
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 4
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 4
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 4
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 4
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 3
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 4
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 3
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 5
      },
      {
        "label": "Sintesis Informasi",
        "score": 5
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 3
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 5
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 4
      },
      {
        "label": "Resolusi Konflik",
        "score": 2
      },
      {
        "label": "Berbagi Informasi",
        "score": 2
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 2
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 5
      },
      {
        "label": "Empati",
        "score": 5
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 5
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 5
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 4
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 3
      },
      {
        "label": "Manajemen Waktu",
        "score": 4
      },
      {
        "label": "Antisipasi Risiko",
        "score": 4
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 5
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 5
      }
    ],
    "Arahan Kreatif": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Storytelling Visual": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Manajemen Produksi": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 5
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 5
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 4
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 4
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 5
      }
    ]
  },
  "p28": {
    "Logika Berpikir": [
      {
        "label": "Berpikir Sistematis",
        "score": 3
      },
      {
        "label": "Berpikir Kritis",
        "score": 3
      },
      {
        "label": "Pemecahan Masalah",
        "score": 2
      },
      {
        "label": "Pengambilan Kesimpulan Logis",
        "score": 2
      },
      {
        "label": "Pengujian Asumsi",
        "score": 1
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 1
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 1
      },
      {
        "label": "Sintesis Informasi",
        "score": 1
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 1
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 1
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 2
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 3
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 2
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 2
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 2
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 1
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 2
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 2
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 4
      },
      {
        "label": "Manajemen Waktu",
        "score": 5
      },
      {
        "label": "Antisipasi Risiko",
        "score": 3
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 3
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 3
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 3
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 2
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 2
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 1
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 3
      }
    ],
    "Arsitektur Sistem": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Desain Terdistribusi": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 2
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Technical Roadmap": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Cloud Infrastructure": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 3
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 3
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 4
      }
    ],
    "Observability": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 3
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 3
      }
    ]
  },
  "p29": {
    "Logika Berpikir": [
      {
        "label": "Berpikir Sistematis",
        "score": 3
      },
      {
        "label": "Berpikir Kritis",
        "score": 3
      },
      {
        "label": "Pemecahan Masalah",
        "score": 2
      },
      {
        "label": "Pengambilan Kesimpulan Logis",
        "score": 2
      },
      {
        "label": "Pengujian Asumsi",
        "score": 4
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 5
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 3
      },
      {
        "label": "Sintesis Informasi",
        "score": 3
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 5
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 5
      }
    ],
    "Kemampuan Numerikal": [
      {
        "label": "Ketepatan Hitung",
        "score": 2
      },
      {
        "label": "Interpretasi Data Angka",
        "score": 2
      },
      {
        "label": "Estimasi Cepat",
        "score": 1
      },
      {
        "label": "Pembacaan Tabel & Grafik",
        "score": 1
      },
      {
        "label": "Ketelitian Angka",
        "score": 1
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 3
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 4
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 4
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 4
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 3
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 5
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 5
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 4
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 3
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 3
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 4
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 4
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 3
      }
    ],
    "Perencanaan Strategis": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Analitik Operasional": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 4
      }
    ],
    "Pemodelan Skenario": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 2
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 2
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 3
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 2
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 4
      }
    ]
  },
  "p30": {
    "Logika Berpikir": [
      {
        "label": "Berpikir Sistematis",
        "score": 1
      },
      {
        "label": "Berpikir Kritis",
        "score": 1
      },
      {
        "label": "Pemecahan Masalah",
        "score": 3
      },
      {
        "label": "Pengambilan Kesimpulan Logis",
        "score": 3
      },
      {
        "label": "Pengujian Asumsi",
        "score": 3
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 1
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 2
      },
      {
        "label": "Sintesis Informasi",
        "score": 2
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 1
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 2
      }
    ],
    "Kemampuan Numerikal": [
      {
        "label": "Ketepatan Hitung",
        "score": 4
      },
      {
        "label": "Interpretasi Data Angka",
        "score": 4
      },
      {
        "label": "Estimasi Cepat",
        "score": 5
      },
      {
        "label": "Pembacaan Tabel & Grafik",
        "score": 5
      },
      {
        "label": "Ketelitian Angka",
        "score": 5
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 1
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 1
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 1
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 3
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 1
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 4
      },
      {
        "label": "Resolusi Konflik",
        "score": 2
      },
      {
        "label": "Berbagi Informasi",
        "score": 2
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 2
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 1
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 1
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 1
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 1
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 1
      }
    ],
    "Eksperimen Pertumbuhan": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 3
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 3
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 3
      }
    ],
    "Analitik Digital": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 2
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 3
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 2
      }
    ],
    "Optimasi Konversi": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Otomasi Pemasaran": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 4
      }
    ]
  },
  "p31": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 4
      },
      {
        "label": "Memotivasi Tim",
        "score": 4
      },
      {
        "label": "Delegasi Tugas",
        "score": 5
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 5
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 5
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 5
      },
      {
        "label": "Manajemen Waktu",
        "score": 5
      },
      {
        "label": "Antisipasi Risiko",
        "score": 4
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 4
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 4
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 2
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 2
      },
      {
        "label": "Sintesis Informasi",
        "score": 2
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 2
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 1
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 2
      },
      {
        "label": "Empati",
        "score": 2
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 2
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 2
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 3
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 4
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 3
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 3
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 2
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 4
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 3
      },
      {
        "label": "Resolusi Konflik",
        "score": 5
      },
      {
        "label": "Berbagi Informasi",
        "score": 5
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 4
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 3
      }
    ],
    "Pelaporan Keuangan": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "Analisis Anggaran": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 2
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Manajemen Kas": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 3
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Standar Akuntansi": [
      {
        "label": "Pemahaman Ketentuan",
        "score": 4
      },
      {
        "label": "Penerapan pada Proses Kerja",
        "score": 5
      },
      {
        "label": "Identifikasi Risiko Kepatuhan",
        "score": 4
      },
      {
        "label": "Dokumentasi & Pelaporan",
        "score": 4
      },
      {
        "label": "Pembaruan atas Perubahan Aturan",
        "score": 5
      }
    ]
  },
  "p32": {
    "Leadership": [
      {
        "label": "Pengambilan Keputusan",
        "score": 5
      },
      {
        "label": "Memotivasi Tim",
        "score": 5
      },
      {
        "label": "Delegasi Tugas",
        "score": 5
      },
      {
        "label": "Tanggung Jawab atas Hasil",
        "score": 5
      },
      {
        "label": "Pengembangan Anggota Tim",
        "score": 4
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 5
      },
      {
        "label": "Manajemen Waktu",
        "score": 4
      },
      {
        "label": "Antisipasi Risiko",
        "score": 5
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 5
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 5
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 5
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 3
      },
      {
        "label": "Sintesis Informasi",
        "score": 3
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 5
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 5
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 3
      },
      {
        "label": "Empati",
        "score": 3
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 4
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 4
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 4
      }
    ],
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 3
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 4
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 4
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 4
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 3
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 5
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 5
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 4
      }
    ],
    "Manajemen Rantai Pasok": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 5
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Negosiasi Pengadaan": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 4
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Perencanaan Inventori": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 5
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 5
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 5
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 5
      }
    ],
    "Sistem ERP": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 4
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 5
      }
    ]
  },
  "p33": {
    "Kemampuan verbal": [
      {
        "label": "Pemahaman Bacaan",
        "score": 3
      },
      {
        "label": "Kejelasan Ekspresi Lisan",
        "score": 3
      },
      {
        "label": "Kosakata & Tata Bahasa",
        "score": 3
      },
      {
        "label": "Penyusunan Tulisan Kerja",
        "score": 4
      },
      {
        "label": "Penyesuaian Gaya Bahasa",
        "score": 3
      }
    ],
    "Fleksibilitas": [
      {
        "label": "Adaptasi Perubahan",
        "score": 4
      },
      {
        "label": "Keterbukaan pada Ide Baru",
        "score": 4
      },
      {
        "label": "Toleransi Ambiguitas",
        "score": 4
      },
      {
        "label": "Penyesuaian Prioritas",
        "score": 2
      },
      {
        "label": "Pemulihan Setelah Hambatan",
        "score": 4
      }
    ],
    "Daya Analisa": [
      {
        "label": "Identifikasi Pola",
        "score": 2
      },
      {
        "label": "Analisis Sebab-Akibat",
        "score": 3
      },
      {
        "label": "Sintesis Informasi",
        "score": 3
      },
      {
        "label": "Evaluasi Alternatif",
        "score": 2
      },
      {
        "label": "Penyederhanaan Masalah",
        "score": 3
      }
    ],
    "Kerjasama": [
      {
        "label": "Kontribusi dalam Tim",
        "score": 5
      },
      {
        "label": "Resolusi Konflik",
        "score": 4
      },
      {
        "label": "Berbagi Informasi",
        "score": 4
      },
      {
        "label": "Dukungan ke Rekan Kerja",
        "score": 4
      },
      {
        "label": "Menjaga Komitmen Bersama",
        "score": 5
      }
    ],
    "Keterampilan Interpersonal": [
      {
        "label": "Mendengarkan Aktif",
        "score": 5
      },
      {
        "label": "Empati",
        "score": 5
      },
      {
        "label": "Membangun Hubungan Kerja",
        "score": 4
      },
      {
        "label": "Membaca Situasi Sosial",
        "score": 4
      },
      {
        "label": "Penyampaian Umpan Balik",
        "score": 3
      }
    ],
    "Kemampuan Perencanaan": [
      {
        "label": "Penetapan Prioritas",
        "score": 1
      },
      {
        "label": "Manajemen Waktu",
        "score": 3
      },
      {
        "label": "Antisipasi Risiko",
        "score": 3
      },
      {
        "label": "Penyusunan Langkah Kerja",
        "score": 2
      },
      {
        "label": "Pemantauan Pelaksanaan",
        "score": 2
      }
    ],
    "Penulisan Konten": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 4
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 4
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 4
      }
    ],
    "Produksi Visual": [
      {
        "label": "Penguasaan Konsep Dasar",
        "score": 2
      },
      {
        "label": "Penerapan pada Pekerjaan Harian",
        "score": 2
      },
      {
        "label": "Penanganan Kasus Kompleks",
        "score": 4
      },
      {
        "label": "Perbaikan Cara Kerja",
        "score": 3
      },
      {
        "label": "Berbagi Pengetahuan ke Tim",
        "score": 2
      }
    ],
    "SEO": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 3
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 3
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 5
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 3
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 4
      }
    ],
    "Analitik Digital": [
      {
        "label": "Penguasaan Fitur Inti",
        "score": 4
      },
      {
        "label": "Pemakaian dalam Alur Kerja",
        "score": 4
      },
      {
        "label": "Troubleshooting Mandiri",
        "score": 3
      },
      {
        "label": "Optimasi & Otomasi",
        "score": 5
      },
      {
        "label": "Pendampingan Pengguna Lain",
        "score": 3
      }
    ]
  }
};
