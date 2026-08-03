/**
 * Long-form narrative content per team archetype, shown on the Team Type page.
 * Keyed by the archetype code from teamsData's ARCHETYPES (e.g. "DC" = Achiever Team).
 *
 * `conflictPoints` is optional — several archetypes have no "Titik Konflik"
 * section, and the page hides that block entirely when it's absent.
 */
export interface DevelopmentTip {
  title: string;
  detail: string;
}

export interface TeamTypeContent {
  characteristics: string;
  strengths: string[];
  developmentAreas: string[];
  conflictPoints?: string[];
  developmentTips: DevelopmentTip[];
}

/** Reused verbatim across several archetypes in the source material. */
const TIP_DEEP_ANALYSIS: DevelopmentTip = {
  title: "Biasakan anggota tim untuk melakukan analisis mendalam",
  detail:
    'Biasakan tim untuk melakukan analisis mendalam, seperti memiliki alasan "mengapa" dari setiap ide atau keputusan yang diberikan serta mempertimbangkan plus minus dalam tiap keputusan.',
};
const TIP_CHECK_IN: DevelopmentTip = {
  title: "Lakukan sesi check-in keadaan masing-masing anggota tim",
  detail:
    "Sesi weekly bisa diiringi dengan check-in keadaan (hal efektif dan isu yang dialami) saat bekerja dalam beberapa kurun waktu terakhir, sehingga anggota tim semakin peka dengan kondisi yang lainnya.",
};
const TIP_REALISTIC: DevelopmentTip = {
  title: "Ingatkan anggota tim untuk realistis dalam bekerja",
  detail:
    "Buat kesepakatan untuk saling mengingatkan antar anggota tim terkait fleksibilitas kerja, hal ini dilakukan untuk menghindari penetapan harapan yang tidak realistis dan menambah kesulitan diri sendiri dalam pengerjaanya.",
};
const TIP_WORK_BOUNDARY: DevelopmentTip = {
  title: "Persuasi anggota tim untuk membuat batasan kerja",
  detail:
    "Buat batasan secara jelas kapan waktu penyelesaian target tugas dan tanggung jawab pekerjaan, kapan waktu untuk melakukan istirahat dalam bekerja, sehingga dapat menjaga work-life balance.",
};
const TIP_FEEDBACK_RULE: DevelopmentTip = {
  title: "Tetapkan aturan untuk memberikan umpan balik dari ide atau usulan orang lain",
  detail:
    "Aturan yang bisa ditetapkan adalah kebiasaan meminta izin sebelum memberikan umpan balik, menyeimbangkan kritik yang membangun dengan setidaknya satu pujian, sehingga umpan balik dapat lebih diterima dengan baik.",
};
const TIP_PRODUCT_EXPOSURE: DevelopmentTip = {
  title: "Hadapkan anggota tim dengan pengembangan produk",
  detail:
    "Sesekali tim perlu dihadapkan pada pengembangan produk atau penanganan masalah yang cukup kompleks yang dihadapi oleh bidang pekerjaan, untuk dapat melatih kesiapannya dalam mengambil resiko.",
};
const TIP_OBJECTIVE_CONFLICT: DevelopmentTip = {
  title: "Latih anggota tim untuk menyelesaikan konflik secara objektif",
  detail:
    "Hindari terlalu melibatkan perasaan, tetap berpegang pada fakta dan diskusikan harapan/keinginan masing-masing anggota, sehingga dapat mencapai kesepakatan yang nyaman bagi masing-masing anggota tim.",
};
const TIP_LISTEN_OTHERS: DevelopmentTip = {
  title: "Dengarkan masukan dari anggota tim yang lain",
  detail:
    "Buat satu sesi untuk mendiskusikan roadmap tim dan ambil potongan ide dari masing-masing anggota tim untuk dieksekusi, sehingga dapat menghindari konflik mengenai ide siapa yang diprioritaskan.",
};

export const TEAM_TYPE_CONTENT: Record<string, TeamTypeContent> = {
  // ── DC — Achiever Team ────────────────────────────────────────────────────
  DC: {
    characteristics:
      "Karakteristik utama dari tim ini adalah pekerja keras. Budaya dalam tim akan mengedepankan pola pikir yang logis dan sistematis. Tim ini mampu menghasilkan ide dan strategi dan mengubahnya menjadi rencana dan operasi, dengan hal ini mereka akan selalu dapat memperbarui cara kerja tim untuk mencapai tujuan. Tim ini juga cenderung berorientasi pada hasil kinerja yang solid, sehingga mereka akan banyak mengkritisi tugas yang dikerjakan oleh satu sama lain.",
    strengths: [
      "Rajin, berkemauan keras, dan bertekad dalam mengejar kemajuan bisnis",
      "Bertindak dengan tujuan dan fokus",
      "Menggunakan pendekatan yang formal saat berinteraksi",
      "Mengembangkan pendekatan yang efisien untuk menjaga kualitas kinerja",
      "Hati-hati mempertimbangkan dalam membuat keputusan yang dianggap berisiko tinggi",
      "Menempatkan ekspektasi tinggi pada kinerja tim",
      "Melihat kebutuhan bisnis melalui lensa yang jelas, logis, dan faktual",
      "Bertanggung jawab atas keputusan maupun hasil kerja",
    ],
    developmentAreas: [
      "Memberi ruang kepada orang lain untuk bekerja secara mandiri dan tanpa pengawasan ketat",
      "Berkomunikasi secara informal sesekali",
      "Pengelolaan ekspektasi kinerja",
      "Tetap berpikiran terbuka saat ada yang menawarkan ide lain",
      "Bersikap tenang dalam situasi apapun terkait pekerjaan",
    ],
    conflictPoints: [
      "Tipe Analyzer perlu penyesuaian diri untuk mengambil keputusan kerja dengan cepat",
    ],
    developmentTips: [
      {
        title: "Biasakan anggota tim untuk menang bersama",
        detail:
          'Biasakan tim untuk berpacuan pada prinsip "menang bersama", sehingga hal ini dapat meningkatkan kerjasama antar anggota tim dan secara proaktif mencari peluang untuk saling membantu.',
      },
      {
        title: "Persuasi tim untuk lebih klien sentris",
        detail:
          "Persuasi anggota tim untuk terbuka pada ide selain pengembangan produk baru, misalnya mendengarkan masukan pelanggan atau memuaskan pelanggan dengan pembaharuan-pembaharuan produk baru.",
      },
      TIP_REALISTIC,
      {
        title: "Berikan anggota lain waktu untuk memeriksa ulang keputusan",
        detail:
          'Hindari pernyataan seperti "Ini harus diputuskan secepat mungkin..." yang terdengar seperti pemaksaan. Akan lebih baik jika menawarkan bantuan atau memberikan perspektif atas keraguan yang dialami Tipe Analyzer dalam pengambilan keputusan.',
      },
    ],
  },

  // ── DISC — Adaptive Team ──────────────────────────────────────────────────
  DISC: {
    characteristics:
      "Karakteristik utama dari tim ini adalah seimbang, fleksibel, dan serba bisa. Tim ini bisa memiliki berbagai macam profil, sehingga memberikan mereka kesempatan untuk dapat beradaptasi dengan inisiatif bisnis apapun. Dalam mencapai tujuan, tim ini dapat memaksimalkan kinerjanya dengan bekerja sama dan menggabungkan masing-masing kekuatan individu di dalamnya. Tim ini juga cukup fleksibel untuk mengatasi permasalahan menggunakan strategi budaya apa pun yang tampaknya tepat pada saat itu.",
    strengths: [
      "Lingkungan kerja yang dinamis",
      "Membuat keputusan secara efektif dan efisien",
      "Memperhitungkan risiko dengan teliti",
      "Mendorong inovasi-inovasi baru",
      "Ahli dalam mempromosikan ide",
      "Berkomitmen untuk menyelesaikan pekerjaan dengan benar",
      "Menghasilkan pekerjaan yang dapat diandalkan",
    ],
    developmentAreas: [
      "Berjuang untuk melakukan satu hal dengan baik",
      "Perbedaan kepribadian, perbedaan cara berkomunikasi",
      "Membuat keputusan yang adil, efektif dan efisien",
      "Toleransi dan melengkapi kekurangan masing-masing anggota tim",
    ],
    conflictPoints: [
      "Tipe Driver dan Persuader cenderung blak-blakan dan ekspresif dalam berkomunikasi, sedangkan Tipe Analyzer dan Mediator cenderung diam dan berhati-hati dalam berkomunikasi",
      "Tipe Driver dan Analyzer lebih menekankan pentingnya penyelesaian tugas sehingga cenderung impersonal dalam bekerja, sedangkan Tipe Persuader dan Mediator lebih menekankan pentingnya hubungan antarpribadi dalam bekerja",
    ],
    developmentTips: [
      {
        title: "Diskusikan peran dari masing-masing anggota tim",
        detail:
          "Lakukan penyelarasan target kerja terdekat, buat kesepakatan bagaimana tim akan mendukung proyek dan tentukan satu pihak yang bertanggung jawab. Hal ini dilakukan agar tim dapat mencapai satu persatu target dengan baik.",
      },
      TIP_LISTEN_OTHERS,
      {
        title: "Manfaatkan pedoman berkomunikasi efektif antar tipe anggota tim",
        detail:
          "Susunlah pedoman komunikasi untuk memahami preferensi komunikasi anggota tim satu sama lain (misalnya: Berkomunikasi menggunakan media vs. percakapan langsung, cara pendekatan, komunikasi ekspresif, serta komunikasi informal vs. komunikasi terbatas formal).",
      },
      {
        title: "Bagilah tugas berdasarkan keahlian dan minat kerja",
        detail:
          "Bagi tim menjadi subkelompok berdasarkan keahlian kerja yang serupa dan preferensi cara kerja (individual vs kerjasama). Kemudian tetapkan tugas yang berbeda bagi setiap subkelompok berdasarkan jenis pekerjaan yang paling memotivasi dan preferensi cara kerja mereka.",
      },
    ],
  },

  // ── IS — Advocate Team ────────────────────────────────────────────────────
  IS: {
    characteristics:
      "Karakteristik utama dari tim ini adalah ini memprioritaskan kolaborasi dan menjunjung tinggi pemberian bantuan dalam penyelesaian pekerjaan. Orang-orang dalam tim ini cenderung membawa sikap positif pada pekerjaan dan hubungan dalam tim. Sehingga dalam kesehariannya akan diwarnai dengan semangat dari satu sama lain, komunikasi informal, dan diskusi yang hangat. Tim ini butuh menangani konflik secara langsung, untuk membuat hubungan dan kepercayaan tim tumbuh lebih kuat dari waktu ke waktu.",
    strengths: [
      "Menawarkan lingkungan kerja yang hangat dan peduli",
      "Memprioritaskan kerja sama dalam penyelesaian pekerjaan",
      "Berkomunikasi secara informal, mencampur pembicaraan pribadi dengan diskusi bisnis",
      "Ahli dalam mempromosikan ide-ide baru",
      "Orientasi pada pelayanan terhadap orang lain",
      "Penuh dengan optimisme",
      "Melibatkan pendapat orang lain dalam diskusi",
      "Mempertimbangkan dampak pada orang lain ketika membuat keputusan",
    ],
    developmentAreas: [
      "Memberikan umpan balik dengan cara yang jelas dan langsung",
      "Merencanakan tugas atau keputusan yang lebih penting",
      "Membuat keputusan secara efektif, namun tetap objektif",
      "Pengelolaan optimisme agar tetap realistis",
      "Pengelolaan emosi saat berhadapan dengan pertentangan ide",
    ],
    conflictPoints: [
      "Tipe Mediator perlu penyesuaian diri untuk melakukan komunikasi asertif",
    ],
    developmentTips: [
      { ...TIP_DEEP_ANALYSIS, title: "Biasakan anggota tim untuk membuat keputusan efektif" },
      {
        title: "Susun prioritas dalam perencanaan kerja",
        detail:
          "Tekankan unsur keselarasan terhadap tujuan organisasi dalam rencana kerja yang disusun dan tetapkan prioritas bagi tugas-tugas yang lebih penting untuk tim selesaikan.",
      },
      TIP_OBJECTIVE_CONFLICT,
      {
        title: "Beri kesempatan anggota tim untuk mengekspresikan pendapatnya",
        detail:
          "Dorong Tipe Mediator untuk menyampaikan pendapatnya pada momen diskusi mengenai target dan rencana kerja tim. Berikan apresiasi dan tanggapan positif atas pendapat yang telah disampaikan oleh anggota tim.",
      },
    ],
  },

  // ── IC — Balancing Team ───────────────────────────────────────────────────
  IC: {
    characteristics:
      "Karakteristik utama dari tim ini adalah kooperatif, namun juga dapat diandalkan. Tim fokus pada proses, berusaha untuk menyeimbangkan antara proses bekerja yang sistematis serta tetap mengedepankan kolaborasi. Tim mampu merencanakan kegiatan kerja secara terorganisir dan cermat, serta tetap mau menerima masukan dan keterlibatan dari seluruh tim. Adanya prosedur yang ditetapkan, dirancang untuk meminimalkan hasil kerja yang merugikan.",
    strengths: [
      "Menyediakan atmosfer kerja yang optimis, namun tetap realistis",
      "Berusaha untuk merumuskan tujuan bisnis secara cermat",
      "Mendorong inovasi bisnis berdasarkan kondisi lapangan",
      "Mendorong proses brainstorming secara kolektif",
      "Menekankan reliabilitas dan ketepatan hasil",
      "Memprioritaskan kerja sama tim sesuai dengan keahlian",
      "Memberikan saran dan masukan untuk perbaikan hasil kerja",
      "Memberikan hasil kerja yang kualitasnya terkontrol",
    ],
    developmentAreas: [
      "Membuat keputusan secara efisien",
      "Pola kerja yang cepat dan dinamis",
      "Manajemen konflik terhadap perbedaan sikap anggota tim",
      "Pengelolaan energi dan work-life balance",
      "Bertanggung jawab atas keputusan maupun hasil kerja",
    ],
    conflictPoints: [
      "Tipe Persuader perlu melakukan penyesuaian diri untuk bekerja dengan lebih terorganisir",
    ],
    developmentTips: [
      TIP_DEEP_ANALYSIS,
      TIP_WORK_BOUNDARY,
      {
        title: "Biasakan tim untuk bertanggung jawab atas pekerjaan",
        detail:
          "Adakan sesi untuk kilas balik dan mengevaluasi kinerja secara berkala, agar anggota tim terbiasa untuk bertanggung jawab atas keputusan maupun hasil kerja yang telah mereka lakukan.",
      },
      {
        title: "Terapkan prosedur kerja terstandarisasi dalam tim",
        detail:
          "Prosedur kerja yang bisa ditetapkan adalah timeline kerja, item tindakan kerja untuk setiap orang, serta ekspektasi yang diharapkan dari pekerjaan. Gunakan bantuan aplikasi pengelola tugas untuk pekerjaan yang lebih teratur.",
      },
    ],
  },

  // ── DS — Discipline Team ──────────────────────────────────────────────────
  DS: {
    characteristics:
      "Karakteristik utama dari tim ini adalah disiplin dalam bekerja. Tim mampu melakukan manajemen sumber daya dengan baik untuk membantu penyelesaian tugas, karena tim berkomitmen untuk menghasilkan kinerja yang solid. Budaya interaksi yang terbangun dalam tim ini adalah berkomunikasi dengan jujur dan tegas, namun tetap menghargai dan menjaga perasaan orang lain. Sehingga, dalam kesehariannya tim mampu meluangkan waktu untuk berkoordinasi satu sama lain sebelum bertindak.",
    strengths: [
      "Menggunakan pendekatan yang jujur dan tegas saat berinteraksi",
      "Melakukan manajemen tim dan tugas demi mencapai tujuan",
      "Rajin dan disiplin dalam mengejar tujuan bisnis",
      "Berkomitmen untuk menyelesaikan pekerjaan dengan benar",
      "Bertanggung jawab atas keputusan maupun hasil kerja",
      "Memprioritaskan kerja sama tim jika dibutuhkan",
      "Melakukan koordinasi untuk ketepatan hasil kerja",
      "Mendorong inovasi yang dibutuhkan dalam kemajuan bisnis",
    ],
    developmentAreas: [
      "Manajemen konflik terhadap perbedaan sikap anggota tim",
      "Menerapkan budaya kedekatan dan kehangatan sesekali",
      "Penerimaan atas feedback",
      "Analisis mendalam saat membuat keputusan",
      "Pengelolaan energi dan work-life balance",
    ],
    conflictPoints: [
      "Tipe Driver terlihat sebagai individu yang sangat skeptis dalam tim",
    ],
    developmentTips: [
      TIP_FEEDBACK_RULE,
      TIP_CHECK_IN,
      TIP_WORK_BOUNDARY,
      {
        title: "Hindari menantang atau menolak pendapat orang lain",
        detail:
          "Berikan apresiasi dan umpan balik positif terhadap opini yang diajukan oleh Tipe Mediator. Menunjukkan sikap reseptif akan menciptakan budaya di mana anggota kelompok merasa dihargai dan nyaman untuk berkontribusi.",
      },
    ],
  },

  // ── DI — Energetic Team ───────────────────────────────────────────────────
  DI: {
    characteristics:
      "Karakteristik utama dari tim ini adalah memiliki ritme kerja yang aktif dan energik. Tim ini merupakan inisiator yang handal, memiliki banyak ide untuk mengembangkan suatu produk. Tim ini juga bekerja secara kompetitif dan mengerahkan segala sumber daya yang tersedia untuk menyelesaikan pekerjaan dengan cepat. Orang-orang dalam tim tahu bagaimana cara memanfaatkan keterampilan dan kemampuan satu sama lain untuk mencapai tujuan atau hasil kinerja yang ditentukan.",
    strengths: [
      "Mampu bekerja dengan tempo kerja yang cepat",
      "Cepat melihat peluang baru untuk kemajuan",
      "Memberikan inovasi luar biasa untuk kemajuan bisnis",
      "Berani mengambil resiko",
      "Manajemen sumber daya demi mencapai tujuan",
      "Membawa energi dan rasa petualangan ke dalam tim",
      "Mendorong orang lain untuk berkontribusi",
      "Mendorong proses brainstorming secara kolektif",
    ],
    developmentAreas: [
      "Analisis mendalam dalam membuat keputusan",
      "Keteraturan dalam bekerja",
      "Memprioritaskan target yang paling penting",
      "Komitmen dalam menyelesaikan pekerjaan sesuai jadwal",
      "Belajar untuk memberikan kesempatan pada anggota lain mengendalikan proyek",
    ],
    conflictPoints: [
      "Tipe Persuader merasa kurang nyaman dengan penekanan kerja yang minim interaksi personal",
    ],
    developmentTips: [
      {
        title: "Biasakan anggota tim untuk bekerja secara sistematis",
        detail:
          "Terapkan penggunaan aplikasi pengelola pekerjaan untuk membiasakan anggota tim bekerja secara sistematis sesuai dengan prioritas dan bertanggung jawab terhadap dokumentasi kerja tim.",
      },
      TIP_DEEP_ANALYSIS,
      {
        title: "Berikan kesempatan bergilir untuk memimpin proyek",
        detail:
          "Berikan anggota tim kesempatan untuk mengendalikan proyek, secara bergilir jadikan masing-masing anggota sebagai person-in-charge atau koordinator dimulai dari proyek kecil.",
      },
      {
        title: "Lakukan sesi percakapan informal",
        detail:
          "Topik percakapan yang bisa dibicarakan merupakan topik di luar masalah pekerjaan, seperti minat, perasaan tentang suatu masalah atau peristiwa terkini, atau latar belakang diri masing-masing anggota tim yang belum diketahui.",
      },
    ],
  },

  // ── SC — Executing Team ───────────────────────────────────────────────────
  SC: {
    characteristics:
      "Karakteristik utama tim ini adalah pelaksana yang baik, tanpa basa-basi. Tim mampu untuk fokus dan berhati-hati saat mengerjakan tugas, serta memastikan penyelesaian tugas mereka sesuai dengan standar yang ditentukan. Tim akan berkolaborasi saat dibutuhkan, tetapi dalam kesehariannya, mereka cenderung dapat diandalkan dan mampu mengerjakan tugas mereka sendiri secara individu. Selain itu, dalam bekerja, tim cenderung menunjukkan pola kerja yang teratur dengan persiapan, penjadwalan, dan pertimbangan dalam setiap langkah kerja.",
    strengths: [
      "Memiliki kesadaran untuk menyelesaikan pekerjaan dengan benar",
      "Menggunakan jadwal yang telah ditetapkan",
      "Mengambil langkah dengan hati-hati",
      "Memberikan informasi yang spesifik dan detail saat membicarakan pekerjaan",
      "Mengakomodasi permintaan orang lain daripada mengambil risiko konflik",
      "Menghargai bimbingan dan arahan dari orang lain",
      "Menggunakan pendekatan analitis untuk memikirkan langkah strategis",
      "Menjaga kualitas hasil kerja",
    ],
    developmentAreas: [
      "Keterbukaan atas kritik yang konstruktif",
      "Keberanian untuk mencoba cara-cara baru",
      "Menetapkan waktu yang ditentukan untuk keputusan penting",
      "Batasan dalam menganalisis",
      "Melakukan kolaborasi untuk hasil kerja yang lebih efektif",
    ],
    conflictPoints: [
      "Tipe Analyzer perlu penyesuaian diri terhadap kultur kerja sama",
    ],
    developmentTips: [
      {
        title: "Tinjau kembali proses kerja yang telah berlangsung dalam tim",
        detail:
          "Lakukan evaluasi terhadap proses kerja yang telah berlangsung dan pertimbangkan penggunaan cara kerja yang fleksibel, sehingga membuat kinerja tim menjadi lebih cepat dan efisien tanpa mengorbankan kualitas kerja tim.",
      },
      TIP_PRODUCT_EXPOSURE,
      {
        title: "Lakukan kolaborasi dalam tim",
        detail:
          "Cari dan pahami bagaimana cara memanfaatkan sumber daya masing-masing anggota untuk mencapai tujuan bersama, bentuk tim menjadi satu tim kerja yang sering berkoordinasi.",
      },
      {
        title: "Tanyakan bagaimana pendekatan yang lebih disukai oleh anggota yang sulit bekerja sama",
        detail:
          "Sarankan untuk bekerja sama ketika Anda benar-benar merasa bahwa perspektif anggota tersebut dapat berkontribusi pada hasil yang lebih baik untuk grup.",
      },
    ],
  },

  // ── I — Influence Team (no conflict points in source) ─────────────────────
  I: {
    characteristics:
      "Karakteristik utama dari tim ini adalah memiliki atmosfer kerja yang energik, pendekatan yang optimis, dan banyaknya waktu yang dihabiskan untuk bersosialisasi dan bertemu banyak orang. Tim ini berorientasi pada kerja sama yang efektif dengan pendekatan kreatif untuk menyelesaikan permasalahan. Kepercayaan diberikan kepada orang-orang yang terbuka dan ekspresif, serta mampu bersosialisasi. Tim ini selalu memberikan berbagai macam inspirasi, imajinasi atau ide-ide baru secara spontan.",
    strengths: [
      "Meningkatkan kreatifitas melalui besarnya energi yang dikeluarkan",
      "Menyediakan atmosfer kerja yang menyenangkan dan optimis",
      "Mendorong proses brainstorming secara kolektif",
      "Mendukung komunikasi informal dalam beberapa waktu",
      "Ahli dalam mempromosikan ide-ide baru",
      "Proaktif",
      "Memberikan apresiasi atas hasil kerja yang bagus",
      "Menawarkan lingkungan kerja yang hangat dan peduli",
    ],
    developmentAreas: [
      "Manajemen waktu",
      "Keteraturan dalam bekerja",
      "Komitmen dalam mengerjakan pekerjaan rutin",
      "Pengelolaan energi dalam bersosialisasi",
      "Pertimbangan atas potensi resiko",
    ],
    developmentTips: [
      {
        title: "Tetapkan kontrak saat bersosialisasi secara formal",
        detail:
          "Kontrak yang bisa dilakukan adalah penetapan agenda dan tujuan pertemuan dan batasan untuk memastikan diskusi yang efisien, produktif, serta tidak keluar dari topik pekerjaan.",
      },
      {
        title: "Biasakan tim untuk mengatur untuk pekerjaan sehari-hari",
        detail:
          "Pengaturan yang dapat dilakukan adalah membuat to-do-list harian yang spesifik dan pengecekan harian apakah yang pekerjaan yang dikerjakan sudah sesuai dengan to-do-list.",
      },
      {
        title: "Biasakan tim untuk mempertimbangkan resiko dalam mengambil keputusan",
        detail:
          "Buat list pertimbangan mengenai kelebihan dari setiap pilihan yang ingin diambil dan resiko yang mungkin terjadi saat mengambil pilihan, sehingga anggota tim terbiasa memahami permasalahan secara menyeluruh.",
      },
    ],
  },

  // ── D — Producing Team (no conflict points in source) ─────────────────────
  D: {
    characteristics:
      "Karakteristik utama dari tim ini adalah budaya kerjanya untuk membuat keputusan secara cepat, tidak berbasa-basi, dan memiliki atmosfer kerja yang kompetitif. Tim ini cenderung berorientasi pada hasil kinerja yang solid dan progresif. Orang-orang yang sukses berada di tim ini adalah orang-orang yang menyukai tantangan dan haus akan kesuksesan. Kebanyakan dari mereka adalah orang-orang yang kreatif dan selalu ingin menunjukkan inovasi-inovasi dalam bekerja.",
    strengths: [
      "Menawarkan lingkungan kerja yang dinamis dan menarik",
      "Membuat keputusan secara efisien",
      "Memiliki dorongan untuk berorientasi pada hasil kerja",
      "Adanya kesempatan untuk pembuktian diri",
      "Penghargaan atas tekad dan ketekunan",
      "Terdapat dorongan berkelanjutan atas pencapaian-pencapaian baru",
      "Mendorong inovasi-inovasi baru",
      "Memberikan umpan balik secara langsung",
    ],
    developmentAreas: [
      "Pengelolaan energi dalam bekerja",
      "Analisis mendalam dalam membuat keputusan",
      "Manajemen resiko",
      "Penerimaan dan tindak lanjut feedback",
      "Pemberdayaan sumber daya manusia secara efektif",
    ],
    developmentTips: [
      {
        title: "Dengarkan masukan dari anggota tim yang lain",
        detail:
          "Lakukan sesi 1-on-1 untuk mendiskusikan masukan dari anggota tim lain yang mungkin lebih analitis, sehingga pembuatan keputusan dilakukan dengan lebih hati-hati dan didasarkan pada analisis mendalam.",
      },
      {
        title: "Diskusikan fokus utama tim saat ini dengan anggota tim yang lain",
        detail:
          "Buat satu sesi untuk mendiskusikan roadmap tim dan ambil potongan ide dari masing-masing anggota tim untuk dieksekusi, sehingga dapat menghindari konflik mengenai ide siapa yang diprioritaskan.",
      },
      TIP_FEEDBACK_RULE,
    ],
  },

  // ── C — Strategic Team (no conflict points in source) ─────────────────────
  C: {
    characteristics:
      "Karakteristik utama dari tim ini adalah berorientasi pada kualitas kerja, keakurasian, dan aturan. Tim ini menjunjung adanya standar yang tinggi dalam bekerja, menganalisis segala sesuatunya secara teliti, dan diplomatis. Tim ini menuntut hasil kerja yang sempurna dengan pendekatan kerja yang lebih konvensional. Budaya kerja tim ini juga menghargai ketepatan waktu, kerja keras, dan bisa diandalkan. Tim sangat logis, konsisten dan obyektif dalam menilai fakta-fakta.",
    strengths: [
      "Memperhitungkan risiko dengan teliti",
      "Memberikan hasil kerja yang kualitasnya terkontrol",
      "Membuat keputusan secara logis",
      "Memastikan keakuratan",
      "Mengklasifikasikan kebijakan dan ekspektasi",
      "Menekankan reliabilitas dan ketepatan hasil",
      "Menghargai hak orang lain",
      "Merumuskan tujuan dengan jelas",
    ],
    developmentAreas: [
      "Batasan dalam menganalisis",
      "Keberanian untuk mengambil risiko",
      "Dorongan dalam membangun komunikasi dan hubungan kerja yang harmonis",
      "Energi positif dan optimisme dalam bekerja",
      "Membangun lingkungan kerja yang aman dan nyaman",
    ],
    developmentTips: [TIP_CHECK_IN, TIP_REALISTIC, TIP_PRODUCT_EXPOSURE],
  },

  // ── S — Support Team (no conflict points in source) ───────────────────────
  S: {
    characteristics:
      "Karakteristik utama dari tim ini adalah berorientasi pada ritme kerja yang stabil dan terprediksi. Budaya kerja tim ini berfokus pada kerja sama yang kuat dengan kehidupan kerja yang seimbang. Kepercayaan diberikan kepada orang-orang yang tulus dan peka. Tim ini butuh untuk menghindari konflik dan membutuhkan semua orang di dalamnya untuk mencapai kesuksesan, sehingga secara alami satu sama lain saling mendukung dalam pendekatan yang sistematis dalam bekerja. Tim akan menjadi lebih efektif dalam bekerja apabila merasakan keamanan dan keselamatan dalam bekerja.",
    strengths: [
      "Berkomitmen untuk menyelesaikan pekerjaan dengan benar",
      "Menyediakan atmosfer kerja yang santai dan tidak menekan",
      "Menghasilkan pekerjaan yang dapat diandalkan",
      "Mendukung lingkungan kerja yang aman dan nyaman",
      "Work-life balance",
      "Memiliki dorongan atas rasa kewajiban kerja yang kuat",
      "Membutuhkan tingkat kerja sama tim yang tinggi",
      "Menumbuhkan perilaku sopan dan bijaksana",
    ],
    developmentAreas: [
      "Keberanian untuk menantang ide-ide baru",
      "Motivasi untuk mencapai kesuksesan yang lebih",
      "Membuat keputusan secara efektif dan efisien",
      "Manajemen konflik",
      "Keterbukaan atas kritik yang konstruktif",
    ],
    developmentTips: [
      TIP_OBJECTIVE_CONFLICT,
      {
        title: "Kenali potensi atau isu yang dihadapi oleh bidang pekerjaan",
        detail:
          "Tantang anggota tim untuk mengenali potensi isu yang akan dihadapi oleh bidang pekerjaannya di masa mendatang, tantang pula mereka memikirkan ide atau inovasi dari isu tersebut.",
      },
      {
        title: "Kesampingkan ketakutan terhadap umpan balik",
        detail:
          "Saling mengingatkan antar anggota untuk mengesampingkan ketakutan terhadap adanya pemberian umpan balik dari eksternal tim, demi peningkatan performa kerja tim.",
      },
    ],
  },
};
