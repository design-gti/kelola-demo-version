// Aspek Technical untuk Job di luar Hunter & Farmer.
//
// Library dari klien (data-sources/Framework_Kompetensi_Sales_Hunter_Farmer.xlsx)
// hanya mencakup ranah penjualan: 13 aspek General yang berlaku lintas bidang,
// dan 7 aspek Technical yang semuanya khas sales. Aspek General-nya dipakai
// ulang di sini; yang Technical tidak bisa — menilai Backend Engineer dengan
// "Penguasaan Produk & Pasar" tidak masuk akal.
//
// Bentuknya sengaja mengikuti berkas klien persis: definisi satu kalimat, lalu
// 15 Key Behaviour tersusun 3 butir per taraf, menanjak dari menjalankan yang
// sudah diarahkan (taraf 1) sampai membentuk cara kerja orang lain (taraf 5).

/** @type {{aspect: string, description: string, kb: string[][]}[]} */
export const EXTRA_ASPECTS = [
  // ── Teknologi ──────────────────────────────────────────────────────────────
  {
    aspect: "Rekayasa Perangkat Lunak",
    description:
      "Kemampuan menulis, menguji, dan merawat kode yang benar, mudah dibaca, dan bertahan terhadap perubahan.",
    kb: [
      [
        "Menulis kode yang berjalan sesuai spesifikasi yang diberikan",
        "Mengikuti standar penulisan kode yang berlaku di tim",
        "Memakai version control untuk pekerjaan sehari-hari",
      ],
      [
        "Menulis pengujian untuk kode yang dibuatnya sendiri",
        "Menelusuri penyebab galat tanpa perlu didampingi",
        "Memecah pekerjaan jadi perubahan kecil yang mudah ditinjau",
      ],
      [
        "Meninjau kode rekan dan memberi masukan yang bisa ditindaklanjuti",
        "Menangani kasus rumit yang menyentuh beberapa bagian sistem",
        "Menimbang keterbacaan dan kecepatan saat memilih pendekatan",
      ],
      [
        "Merancang penyelesaian untuk masalah yang belum ada contohnya di tim",
        "Menemukan dan melunasi utang teknis yang menghambat pengembangan",
        "Menetapkan standar mutu kode yang diikuti tim",
      ],
      [
        "Mengarahkan praktik rekayasa lintas tim",
        "Menilai cara kerja baru dan memutuskan mana yang layak diadopsi",
        "Membimbing engineer lain sampai mandiri menangani kasus rumit",
      ],
    ],
  },
  {
    aspect: "Arsitektur & Rancangan Sistem",
    description:
      "Kemampuan menyusun struktur sistem yang aman, terukur, dan mudah dirawat, beserta alasan di balik tiap pilihannya.",
    kb: [
      [
        "Menjelaskan susunan komponen sistem yang sedang dikerjakan",
        "Mengikuti pola rancangan yang sudah ditetapkan",
        "Membaca dan memahami dokumen rancangan yang ada",
      ],
      [
        "Merancang satu komponen beserta antarmukanya",
        "Mengenali ketergantungan antar bagian sebelum mengubahnya",
        "Mendokumentasikan rancangan yang dibuatnya",
      ],
      [
        "Merancang alur antar beberapa komponen sekaligus",
        "Menimbang pilihan rancangan beserta konsekuensinya",
        "Mengenali titik yang akan jadi hambatan saat beban bertambah",
      ],
      [
        "Menyusun arsitektur untuk satu ranah produk secara utuh",
        "Merencanakan migrasi sistem berjalan tanpa menghentikan layanan",
        "Menetapkan batas tanggung jawab antar tim lewat rancangan",
      ],
      [
        "Menetapkan arah arsitektur jangka panjang perusahaan",
        "Menilai risiko teknis tingkat organisasi dan menyiapkan mitigasinya",
        "Menjadi rujukan keputusan arsitektur lintas tim",
      ],
    ],
  },
  {
    aspect: "Keandalan & Operasional Sistem",
    description:
      "Kemampuan menjaga layanan tetap hidup: memantau, menangani gangguan, dan mencegahnya berulang.",
    kb: [
      [
        "Membaca dasbor pemantauan dan mengenali kondisi tidak wajar",
        "Menjalankan prosedur penanganan gangguan yang sudah tertulis",
        "Melaporkan gangguan dengan keterangan yang cukup untuk ditindaklanjuti",
      ],
      [
        "Menangani gangguan rutin tanpa eskalasi",
        "Menyiapkan peringatan dini untuk layanan yang jadi tanggung jawabnya",
        "Menulis catatan pasca-gangguan yang runtut",
      ],
      [
        "Memimpin penanganan gangguan yang menyentuh banyak layanan",
        "Menelusuri akar masalah sampai ke penyebab sebenarnya",
        "Mengubah sistem supaya gangguan serupa tidak terulang",
      ],
      [
        "Menyusun target keandalan beserta cara mengukurnya",
        "Merancang kesiapan sistem menghadapi lonjakan beban",
        "Menilai kesiapan operasional sebelum layanan baru dirilis",
      ],
      [
        "Menetapkan budaya keandalan yang dianut seluruh tim teknologi",
        "Menyeimbangkan kecepatan rilis dengan risiko gangguan di tingkat organisasi",
        "Membangun kemampuan tim lain dalam menangani gangguan",
      ],
    ],
  },
  {
    aspect: "Keamanan Informasi",
    description:
      "Kemampuan mengenali dan menutup celah keamanan pada sistem, data, dan cara kerja sehari-hari.",
    kb: [
      [
        "Mengikuti ketentuan keamanan dasar dalam pekerjaan sehari-hari",
        "Mengenali data yang bersifat rahasia dan memperlakukannya semestinya",
        "Melaporkan hal mencurigakan lewat jalur yang benar",
      ],
      [
        "Menerapkan pengendalian akses pada pekerjaan yang dibuatnya",
        "Mengenali celah keamanan yang umum pada kode atau konfigurasi",
        "Memakai perkakas pemindai keamanan yang disediakan",
      ],
      [
        "Menilai risiko keamanan sebuah rancangan sebelum dibangun",
        "Menutup celah yang ditemukan beserta pengujian pembuktiannya",
        "Menjelaskan risiko keamanan dengan bahasa yang dipahami non-teknis",
      ],
      [
        "Menyusun standar keamanan untuk satu ranah sistem",
        "Merancang tanggapan atas insiden keamanan",
        "Menilai kepatuhan pihak ketiga yang terhubung ke sistem",
      ],
      [
        "Menetapkan arah keamanan informasi tingkat organisasi",
        "Menyeimbangkan kebutuhan bisnis dengan risiko keamanan",
        "Membangun kesadaran keamanan di seluruh perusahaan",
      ],
    ],
  },
  {
    aspect: "Pengelolaan Data",
    description:
      "Kemampuan menyiapkan, mengolah, dan menjaga mutu data agar layak dipakai untuk pengambilan keputusan.",
    kb: [
      [
        "Mengambil data dengan kueri sederhana sesuai permintaan",
        "Mengenali arti kolom pada tabel yang dipakainya",
        "Menyajikan data dalam bentuk yang mudah dibaca",
      ],
      [
        "Menyusun kueri gabungan lintas tabel",
        "Memeriksa kewajaran data sebelum dipakai",
        "Membuat alur pengolahan data yang berjalan berulang",
      ],
      [
        "Merancang struktur data untuk kebutuhan baru",
        "Menelusuri sumber ketidakcocokan angka antar laporan",
        "Menjaga alur data tetap berjalan saat sumbernya berubah",
      ],
      [
        "Menetapkan definisi baku untuk ukuran yang dipakai bersama",
        "Merancang tata kelola mutu data pada satu ranah",
        "Menilai kelayakan data untuk kebutuhan analitik lanjutan",
      ],
      [
        "Menetapkan arah pengelolaan data tingkat organisasi",
        "Menjadikan data sebagai dasar keputusan lintas fungsi",
        "Membangun kemampuan olah data di tim lain",
      ],
    ],
  },

  // ── Keuangan ───────────────────────────────────────────────────────────────
  {
    aspect: "Pelaporan & Standar Akuntansi",
    description:
      "Kemampuan menyusun laporan keuangan yang benar, tepat waktu, dan sesuai standar yang berlaku.",
    kb: [
      [
        "Mencatat transaksi sesuai klasifikasi yang berlaku",
        "Menyiapkan berkas pendukung yang lengkap",
        "Mengikuti tenggat pelaporan yang ditetapkan",
      ],
      [
        "Menyusun rekonsiliasi akun secara mandiri",
        "Menemukan selisih pencatatan dan menelusurinya",
        "Menyiapkan bagian laporan berkala tanpa didampingi",
      ],
      [
        "Menyusun laporan keuangan utuh untuk satu periode",
        "Menerapkan standar akuntansi pada transaksi yang tidak lazim",
        "Menjelaskan isi laporan kepada pihak non-keuangan",
      ],
      [
        "Menilai dampak perubahan standar terhadap pelaporan perusahaan",
        "Menyusun kebijakan akuntansi internal",
        "Memimpin proses tutup buku lintas unit",
      ],
      [
        "Menetapkan kerangka pelaporan keuangan perusahaan",
        "Menjadi rujukan penafsiran standar bagi seluruh unit",
        "Menjaga kepercayaan auditor dan pemangku kepentingan luar",
      ],
    ],
  },
  {
    aspect: "Analisis & Perencanaan Keuangan",
    description:
      "Kemampuan membaca angka menjadi keputusan: menyusun anggaran, proyeksi, dan menilai kelayakan investasi.",
    kb: [
      [
        "Menghimpun data realisasi anggaran",
        "Menghitung selisih anggaran terhadap rencana",
        "Menyajikan angka dalam format yang diminta",
      ],
      [
        "Menjelaskan penyebab selisih anggaran",
        "Menyusun proyeksi sederhana berdasarkan tren",
        "Menyiapkan bahan rapat anggaran unit",
      ],
      [
        "Menyusun model keuangan untuk satu inisiatif",
        "Menilai kelayakan belanja modal beserta asumsinya",
        "Menyusun anggaran satu unit secara utuh",
      ],
      [
        "Menyusun rencana keuangan lintas unit",
        "Menguji ketahanan rencana lewat beberapa skenario",
        "Mengarahkan alokasi sumber daya berdasarkan hasil analisis",
      ],
      [
        "Menetapkan arah perencanaan keuangan perusahaan",
        "Menjadi mitra pikir direksi dalam keputusan besar",
        "Menghubungkan rencana keuangan dengan strategi jangka panjang",
      ],
    ],
  },
  {
    aspect: "Pengendalian & Kepatuhan",
    description:
      "Kemampuan menjaga proses keuangan berjalan sesuai aturan, termasuk perpajakan dan pengendalian internal.",
    kb: [
      [
        "Menjalankan prosedur pengendalian yang sudah ditetapkan",
        "Menyiapkan dokumen kepatuhan yang diminta",
        "Mengenali kewajiban pajak yang rutin",
      ],
      [
        "Memeriksa kelengkapan bukti sesuai ketentuan",
        "Menghitung kewajiban pajak berkala",
        "Melaporkan penyimpangan prosedur yang ditemuinya",
      ],
      [
        "Menilai kecukupan pengendalian pada satu proses",
        "Menangani pemeriksaan dari pihak luar",
        "Menutup temuan audit beserta perbaikan prosesnya",
      ],
      [
        "Merancang pengendalian internal untuk proses baru",
        "Menilai risiko kepatuhan pada rencana bisnis",
        "Menyusun kebijakan perpajakan perusahaan",
      ],
      [
        "Menetapkan kerangka pengendalian dan kepatuhan perusahaan",
        "Menyeimbangkan kelincahan bisnis dengan risiko kepatuhan",
        "Menjaga hubungan dengan otoritas dan auditor",
      ],
    ],
  },

  // ── Operasional ────────────────────────────────────────────────────────────
  {
    aspect: "Perbaikan Proses",
    description:
      "Kemampuan memetakan cara kerja yang berjalan, menemukan pemborosan, dan merapikannya.",
    kb: [
      [
        "Menjalankan proses kerja sesuai prosedur",
        "Mencatat hambatan yang ditemui saat bekerja",
        "Mengenali langkah kerja yang jadi tanggung jawabnya",
      ],
      [
        "Memetakan alur kerja satu proses",
        "Mengusulkan perbaikan kecil dari pengalaman lapangan",
        "Mengukur waktu dan hasil satu proses",
      ],
      [
        "Menemukan akar pemborosan pada proses berjalan",
        "Merancang perbaikan proses beserta cara mengukurnya",
        "Menjalankan uji coba perbaikan pada lingkup terbatas",
      ],
      [
        "Merancang ulang proses lintas unit",
        "Menilai dampak perubahan proses terhadap mutu dan biaya",
        "Menjadikan perbaikan bertahan lewat standar baru",
      ],
      [
        "Menetapkan arah keunggulan operasional perusahaan",
        "Membangun kebiasaan perbaikan berkelanjutan di seluruh unit",
        "Menyeimbangkan efisiensi dengan mutu layanan di tingkat organisasi",
      ],
    ],
  },
  {
    aspect: "Kendali Mutu",
    description:
      "Kemampuan menjaga hasil kerja memenuhi standar mutu, termasuk menangani penyimpangan yang muncul.",
    kb: [
      [
        "Memeriksa hasil kerja terhadap daftar periksa yang ada",
        "Mencatat temuan ketidaksesuaian",
        "Mengikuti prosedur penanganan produk cacat",
      ],
      [
        "Menilai mutu dengan ukuran yang ditetapkan",
        "Menelusuri penyebab langsung ketidaksesuaian",
        "Menyiapkan laporan mutu berkala",
      ],
      [
        "Menganalisis pola ketidaksesuaian yang berulang",
        "Menyusun tindakan perbaikan beserta pemantauannya",
        "Melatih rekan menerapkan standar mutu",
      ],
      [
        "Menyusun standar mutu untuk satu lini kerja",
        "Menilai kesiapan mutu sebelum layanan diluncurkan",
        "Menghubungkan data mutu dengan keputusan operasional",
      ],
      [
        "Menetapkan sistem mutu tingkat perusahaan",
        "Menjadikan mutu sebagai ukuran kinerja lintas unit",
        "Mewakili perusahaan dalam sertifikasi dan audit mutu",
      ],
    ],
  },
  {
    aspect: "Manajemen Rantai Pasok",
    description:
      "Kemampuan menjaga ketersediaan barang dan jasa: perencanaan kebutuhan, pemasok, dan persediaan.",
    kb: [
      [
        "Mencatat penerimaan dan pengeluaran barang dengan tertib",
        "Menyiapkan dokumen pengadaan rutin",
        "Memantau tingkat persediaan terhadap batas yang ditetapkan",
      ],
      [
        "Menyusun rencana kebutuhan berdasarkan permintaan",
        "Membandingkan penawaran pemasok pada kriteria yang jelas",
        "Menangani keterlambatan pasokan dengan prosedur yang ada",
      ],
      [
        "Menegosiasikan syarat dengan pemasok",
        "Menilai kinerja pemasok berdasarkan data",
        "Menyeimbangkan biaya persediaan dengan risiko kekosongan",
      ],
      [
        "Merancang strategi pasokan untuk satu kategori",
        "Menyiapkan rencana cadangan atas risiko pasokan",
        "Menyusun kemitraan jangka panjang dengan pemasok utama",
      ],
      [
        "Menetapkan arah rantai pasok perusahaan",
        "Menilai risiko rantai pasok tingkat organisasi",
        "Menghubungkan keputusan pasokan dengan strategi bisnis",
      ],
    ],
  },

  // ── SDM ────────────────────────────────────────────────────────────────────
  {
    aspect: "Rekrutmen & Seleksi",
    description:
      "Kemampuan menemukan, menilai, dan meyakinkan kandidat yang sesuai kebutuhan jabatan.",
    kb: [
      [
        "Memasang lowongan sesuai ketentuan yang berlaku",
        "Menyaring lamaran terhadap syarat minimum",
        "Mengatur jadwal wawancara dengan tertib",
      ],
      [
        "Mencari kandidat aktif lewat beberapa kanal",
        "Melakukan wawancara awal dengan panduan yang ada",
        "Menyiapkan ringkasan kandidat yang berguna bagi pengguna",
      ],
      [
        "Menggali bukti perilaku lewat wawancara terstruktur",
        "Menilai kecocokan kandidat dengan kebutuhan jabatan",
        "Meyakinkan kandidat yang diincar untuk bergabung",
      ],
      [
        "Merancang proses seleksi untuk jabatan yang sulit diisi",
        "Menilai mutu proses rekrutmen lewat data",
        "Membangun jalur kandidat sebelum kebutuhan muncul",
      ],
      [
        "Menetapkan strategi pemenuhan talenta perusahaan",
        "Membangun citra perusahaan sebagai tempat kerja pilihan",
        "Mengembangkan kemampuan mewawancara di seluruh jajaran",
      ],
    ],
  },
  {
    aspect: "Pengembangan Talenta",
    description:
      "Kemampuan menumbuhkan kemampuan orang: menilai kebutuhan, menyiapkan program, dan menyiapkan penerus.",
    kb: [
      [
        "Menjalankan program pengembangan yang sudah dirancang",
        "Mencatat kehadiran dan hasil pelatihan",
        "Mengumpulkan masukan peserta",
      ],
      [
        "Mengenali kebutuhan pengembangan dari hasil penilaian",
        "Menyiapkan materi pengembangan untuk kebutuhan sederhana",
        "Mendampingi karyawan menyusun rencana pengembangan diri",
      ],
      [
        "Merancang program pengembangan untuk satu kelompok jabatan",
        "Mengukur dampak program terhadap kinerja",
        "Memfasilitasi pembahasan talenta bersama atasan unit",
      ],
      [
        "Menyusun peta talenta dan rencana suksesi satu unit",
        "Merancang jalur karier antar jabatan",
        "Menilai kesiapan calon penerus jabatan kunci",
      ],
      [
        "Menetapkan arah pengembangan talenta perusahaan",
        "Menjaga ketersediaan penerus untuk jabatan kunci",
        "Menjadikan pengembangan bagian dari cara kerja para pemimpin",
      ],
    ],
  },
  {
    aspect: "Manajemen Kinerja & Remunerasi",
    description:
      "Kemampuan menjalankan penilaian kinerja yang adil dan menyusun imbalan yang bersaing serta layak.",
    kb: [
      [
        "Menjalankan siklus penilaian sesuai jadwal",
        "Menghimpun data kinerja dari unit",
        "Menyiapkan administrasi imbalan dengan teliti",
      ],
      [
        "Menjelaskan mekanisme penilaian kepada karyawan",
        "Memeriksa kewajaran sasaran kerja yang disusun unit",
        "Menghitung komponen imbalan sesuai kebijakan",
      ],
      [
        "Mendampingi atasan menyusun sasaran yang terukur",
        "Menengahi perbedaan pandangan atas hasil penilaian",
        "Membandingkan imbalan perusahaan dengan pasar",
      ],
      [
        "Merancang kebijakan penilaian kinerja satu ranah",
        "Menyusun struktur imbalan untuk kelompok jabatan",
        "Menilai keterkaitan kinerja dengan imbalan lewat data",
      ],
      [
        "Menetapkan kerangka kinerja dan imbalan perusahaan",
        "Menjaga keadilan internal sekaligus daya saing eksternal",
        "Mengarahkan perubahan budaya kinerja di seluruh organisasi",
      ],
    ],
  },

  // ── Strategi ───────────────────────────────────────────────────────────────
  {
    aspect: "Analisis Strategis",
    description:
      "Kemampuan membaca lanskap bisnis — pasar, pesaing, dan kemampuan internal — menjadi pilihan yang bisa diputuskan.",
    kb: [
      [
        "Menghimpun data pasar dan pesaing dari sumber yang tersedia",
        "Merangkum temuan dalam format yang diminta",
        "Mengenali istilah dan ukuran yang dipakai di industrinya",
      ],
      [
        "Membandingkan posisi perusahaan terhadap pesaing utama",
        "Menyusun analisis sederhana beserta sumbernya",
        "Menandai perubahan pasar yang perlu diperhatikan",
      ],
      [
        "Menyusun pilihan strategis beserta konsekuensinya",
        "Menguji asumsi yang mendasari sebuah rencana",
        "Menyajikan analisis kepada pengambil keputusan",
      ],
      [
        "Menyusun skenario jangka menengah beserta pemicunya",
        "Menilai peluang masuk ke ranah baru",
        "Menghubungkan analisis dengan alokasi sumber daya",
      ],
      [
        "Menetapkan arah strategis perusahaan bersama direksi",
        "Menjaga strategi tetap relevan saat lanskap berubah",
        "Membangun cara berpikir strategis di jajaran pemimpin",
      ],
    ],
  },
  {
    aspect: "Tata Kelola & Manajemen Risiko",
    description:
      "Kemampuan menjaga keputusan perusahaan berjalan lewat mekanisme yang benar dan risikonya terkelola.",
    kb: [
      [
        "Mengikuti mekanisme persetujuan yang berlaku",
        "Menyiapkan dokumen tata kelola yang diminta",
        "Mencatat risiko yang ditemui dalam pekerjaannya",
      ],
      [
        "Menjelaskan mekanisme tata kelola kepada rekan kerja",
        "Menilai risiko satu kegiatan dengan panduan yang ada",
        "Memantau tindak lanjut atas risiko yang tercatat",
      ],
      [
        "Menyusun peta risiko satu ranah beserta mitigasinya",
        "Menilai kepatuhan proses terhadap kebijakan",
        "Menyiapkan bahan keputusan bagi forum tata kelola",
      ],
      [
        "Merancang kebijakan tata kelola untuk kebutuhan baru",
        "Menilai risiko rencana strategis sebelum diputuskan",
        "Menyeimbangkan pengendalian dengan kecepatan bisnis",
      ],
      [
        "Menetapkan kerangka tata kelola dan risiko perusahaan",
        "Menjaga akuntabilitas keputusan di seluruh jajaran",
        "Mewakili perusahaan di hadapan regulator dan pemegang saham",
      ],
    ],
  },

  // ── Pemasaran ──────────────────────────────────────────────────────────────
  {
    aspect: "Strategi Merek & Komunikasi",
    description:
      "Kemampuan membangun posisi merek dan menyampaikannya secara konsisten di seluruh titik sentuh.",
    kb: [
      [
        "Menerapkan panduan merek pada materi yang dibuatnya",
        "Menyiapkan materi komunikasi sesuai arahan",
        "Mengenali pesan utama merek perusahaan",
      ],
      [
        "Menyusun materi komunikasi untuk satu kanal",
        "Menjaga konsistensi nada dan tampilan antar materi",
        "Menyesuaikan pesan dengan khalayak yang dituju",
      ],
      [
        "Menyusun narasi kampanye beserta alasan di baliknya",
        "Menilai efektivitas pesan lewat tanggapan khalayak",
        "Mengarahkan mitra kreatif agar hasilnya sesuai maksud",
      ],
      [
        "Menyusun posisi merek untuk satu lini produk",
        "Merancang kampanye lintas kanal beserta ukurannya",
        "Menjaga merek saat menghadapi situasi sulit",
      ],
      [
        "Menetapkan arah merek perusahaan",
        "Menjaga kesatuan merek di seluruh unit dan mitra",
        "Menghubungkan kekuatan merek dengan hasil bisnis",
      ],
    ],
  },
  {
    aspect: "Pemasaran Digital & Analitik",
    description:
      "Kemampuan menjalankan dan mengukur kegiatan pemasaran di kanal digital, lalu memperbaikinya dari data.",
    kb: [
      [
        "Menjalankan kegiatan kanal digital sesuai rencana",
        "Menyiapkan materi sesuai ketentuan tiap kanal",
        "Membaca laporan kinerja dasar kanal",
      ],
      [
        "Menyiapkan dan menayangkan kampanye berbayar sederhana",
        "Memantau ukuran kinerja harian dan menandai kejanggalan",
        "Menyusun laporan kinerja berkala",
      ],
      [
        "Menganalisis kinerja kampanye sampai ke tingkat konversi",
        "Menjalankan uji pembanding untuk memperbaiki hasil",
        "Menyesuaikan alokasi belanja berdasarkan data",
      ],
      [
        "Merancang bauran kanal untuk sasaran pertumbuhan",
        "Menyusun model pengukuran dampak pemasaran",
        "Menilai kelayakan kanal baru sebelum digarap",
      ],
      [
        "Menetapkan strategi pemasaran digital perusahaan",
        "Menghubungkan investasi pemasaran dengan pendapatan",
        "Membangun kemampuan analitik pemasaran di tim",
      ],
    ],
  },
  {
    aspect: "Riset Pasar & Wawasan Pelanggan",
    description:
      "Kemampuan menggali kebutuhan dan perilaku pelanggan, lalu mengubahnya jadi arahan yang bisa dipakai.",
    kb: [
      [
        "Menghimpun data pelanggan dari sumber yang tersedia",
        "Menyiapkan kuesioner sederhana sesuai arahan",
        "Merangkum hasil pengumpulan data",
      ],
      [
        "Menjalankan wawancara pelanggan dengan panduan",
        "Mengolah hasil survei jadi temuan yang terbaca",
        "Mengenali pola keluhan dan permintaan yang berulang",
      ],
      [
        "Merancang riset untuk menjawab pertanyaan bisnis tertentu",
        "Menerjemahkan temuan riset jadi usulan tindakan",
        "Menguji dugaan tentang pelanggan lewat data",
      ],
      [
        "Menyusun segmentasi pelanggan beserta implikasinya",
        "Menilai peluang produk baru dari sisi kebutuhan pasar",
        "Menghubungkan wawasan pelanggan dengan keputusan produk",
      ],
      [
        "Menetapkan agenda riset pasar perusahaan",
        "Menjadikan wawasan pelanggan dasar keputusan lintas fungsi",
        "Membangun kebiasaan mendengarkan pelanggan di seluruh tim",
      ],
    ],
  },
];

/**
 * Aspek per Job untuk Job di luar Hunter & Farmer.
 *
 * `general` diambil dari library klien, `technical` dari daftar di atas.
 * Batasnya 13 aspek per Job — angka yang sama dengan Farmer di berkas klien.
 */
export const JOB_ASPECTS = {
  Teknologi: {
    general: ["Mendengar Aktif", "Inisiatif", "Keandalan", "Koordinasi Lintas Fungsi", "Ketahanan Tekanan", "Kegigihan", "Pemantauan Kinerja Akun"],
    technical: ["Rekayasa Perangkat Lunak", "Arsitektur & Rancangan Sistem", "Keandalan & Operasional Sistem", "Keamanan Informasi", "Pengelolaan Data"],
  },
  Keuangan: {
    general: ["Mendengar Aktif", "Keandalan", "Pemantauan Kinerja Akun", "Koordinasi Lintas Fungsi", "Kepekaan Sosial", "Inisiatif", "Ketahanan Tekanan"],
    technical: ["Pelaporan & Standar Akuntansi", "Analisis & Perencanaan Keuangan", "Pengendalian & Kepatuhan", "Pengelolaan Data"],
  },
  Operasional: {
    general: ["Keandalan", "Koordinasi Lintas Fungsi", "Pemantauan Kinerja Akun", "Inisiatif", "Mendengar Aktif", "Ketahanan Tekanan", "Orientasi Melayani"],
    technical: ["Perbaikan Proses", "Kendali Mutu", "Manajemen Rantai Pasok", "Pengelolaan Data"],
  },
  SDM: {
    general: ["Mendengar Aktif", "Kepekaan Sosial", "Orientasi Melayani", "Enablement Klien", "Koordinasi Lintas Fungsi", "Keandalan", "Pemantauan Kinerja Akun", "Negosiasi"],
    technical: ["Rekrutmen & Seleksi", "Pengembangan Talenta", "Manajemen Kinerja & Remunerasi"],
  },
  // Produk menggantikan Strategi: sejak organisasi memakai lima Chief, unit
  // strategi melebur ke bawah CPO. Aspeknya memakai bahan yang sama —
  // analisis, tata kelola, dan pembacaan kebutuhan pelanggan.
  Produk: {
    general: ["Mendengar Aktif", "Inisiatif", "Kemitraan Strategis", "Koordinasi Lintas Fungsi", "Pemantauan Kinerja Akun", "Kepekaan Sosial", "Persuasi"],
    technical: ["Analisis Strategis", "Riset Pasar & Wawasan Pelanggan", "Pengelolaan Data", "Tata Kelola & Manajemen Risiko", "Analisis Kebutuhan Klien"],
  },
  Marketing: {
    general: ["Mendengar Aktif", "Inisiatif", "Persuasi", "Koordinasi Lintas Fungsi", "Kepekaan Sosial", "Kemitraan Strategis", "Pemantauan Kinerja Akun"],
    technical: ["Strategi Merek & Komunikasi", "Pemasaran Digital & Analitik", "Riset Pasar & Wawasan Pelanggan", "Penguasaan Produk & Pasar", "Ketajaman Komersial"],
  },
};
