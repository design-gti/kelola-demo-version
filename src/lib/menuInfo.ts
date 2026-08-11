/**
 * Penjelasan tiap menu — muncul di modal saat ikon "i" di header diklik.
 *
 * Dikunci ke `href` menu, bukan ke judulnya, supaya judul boleh berganti kata
 * tanpa memutus penjelasannya. Tiga bagiannya sengaja tetap: definisi (ini apa),
 * kegunaan (dipakai untuk apa), dan value (kenapa penting) — sehingga pembaca
 * yang baru pertama membuka menu langsung dapat tiga jawaban yang sama urutannya
 * di menu mana pun.
 */
export type MenuInfo = {
  /** Menu ini apa, dalam satu kalimat. */
  definition: string;
  /** Yang bisa dikerjakan pengguna di sini. */
  usage: string[];
  /** Manfaat yang didapat organisasi kalau menu ini dipakai. */
  value: string;
};

const INFO: Record<string, MenuInfo> = {
  "/": {
    definition:
      "Halaman ringkasan yang mengumpulkan kondisi talenta organisasi dalam satu layar — skor keseluruhan, kesehatan tim, status pengembangan, dan aktivitas terbaru.",
    usage: [
      "Melihat kondisi organisasi sekilas tanpa membuka menu satu per satu",
      "Menangkap penyimpangan lebih awal lewat kartu insight dan status sinkronisasi data",
      "Melompat ke menu yang relevan dari temuan di kartu",
    ],
    value:
      "Menjadi titik awal harian: keputusan tidak lagi menunggu laporan bulanan karena kondisi terkini sudah terbaca dalam hitungan detik.",
  },
  "/iprofile": {
    definition:
      "Profil talenta per individu: data diri, skor aspek kompetensi dan potensi beserta standarnya, riwayat penilaian, rencana karier, dan calon penerus.",
    usage: [
      "Menelaah kekuatan dan kesenjangan seseorang terhadap standar posisinya",
      "Membuka rincian Key Behaviour di balik tiap skor aspek",
      "Menyiapkan bahan diskusi karier dan suksesi yang berbasis data",
    ],
    value:
      "Percakapan tentang seseorang berpindah dari kesan ke bukti — atasan dan HR memakai gambaran yang sama saat menilai kesiapan dan arah pengembangan.",
  },
  "/vismap": {
    definition:
      "Peta visual struktur organisasi yang menampilkan posisi, atasan-bawahan, dan kondisi talenta di tiap simpulnya.",
    usage: [
      "Menelusuri struktur organisasi sampai ke posisi paling bawah",
      "Melihat sebaran kesiapan talenta pada kerangka organisasi yang sebenarnya",
      "Menemukan posisi kritikal yang belum punya pelapis",
    ],
    value:
      "Risiko organisasi jadi terlihat pada bentuknya sendiri: lubang suksesi dan beban rentang kendali muncul sebagai gambar, bukan sebagai baris tabel.",
  },
  "/tdp-view": {
    definition:
      "Ruang keputusan talenta: hasil penilaian dirangkum jadi rekomendasi tindak lanjut untuk tiap orang.",
    usage: [
      "Membandingkan kandidat pada kriteria yang sama",
      "Menetapkan keputusan pengembangan, promosi, atau penempatan",
      "Menelusuri dasar dari sebuah keputusan saat ditanya kembali",
    ],
    value:
      "Keputusan talenta punya jejak yang bisa diaudit — bukan hasil rapat yang tak terekam, melainkan pilihan yang dasarnya tersimpan.",
  },
  "/talent-mapping": {
    definition:
      "Pemetaan talenta pada dua sumbu penilaian, sehingga setiap orang jatuh di kotak yang menerangkan posisinya relatif terhadap yang lain.",
    usage: [
      "Melihat sebaran talenta dalam satu kelompok atau seluruh organisasi",
      "Mengenali kelompok siap-promosi dan kelompok yang butuh perhatian",
      "Menentukan perlakuan pengembangan yang berbeda per kelompok",
    ],
    value:
      "Sumber daya pengembangan bisa diarahkan ke tempat yang dampaknya paling besar, bukan dibagi rata ke semua orang.",
  },
  "/team-profile": {
    definition:
      "Profil talenta pada tingkat tim: komposisi anggota, kekuatan kolektif, dan celah kemampuan yang dimiliki tim tersebut.",
    usage: [
      "Membaca kekuatan dan kelemahan tim sebagai satu kesatuan",
      "Membandingkan kondisi antar tim",
      "Menyiapkan rencana penguatan tim dari celah yang terbaca",
    ],
    value:
      "Kinerja tim jarang persoalan satu orang — melihatnya dalam satu bingkai membuat penyebab kolektif terbaca sebelum salah menyalahkan individu.",
  },
  "/idp": {
    definition:
      "Individual Development Plan: rencana pengembangan per orang beserta target, kegiatan, tenggat, dan kemajuannya.",
    usage: [
      "Menyusun rencana pengembangan yang berangkat dari celah kompetensi",
      "Memantau kemajuan dan kegiatan yang tertunda",
      "Menautkan hasil penilaian ke tindakan nyata",
    ],
    value:
      "Hasil asesmen tidak berhenti jadi laporan: setiap celah punya rencana, pemilik, dan tenggat yang bisa ditagih.",
  },

  // ——— Admin Settings ———
  "/admin/aspect": {
    definition:
      "Library seluruh aspek penilaian yang dipakai organisasi, dikelompokkan ke dalam kategori, lengkap dengan deskripsi dan Key Behaviour-nya.",
    usage: [
      "Menambah, menyunting, dan mengelompokkan aspek ke dalam kategori",
      "Memetakan Key Behaviour ke tiap taraf nilai 1-5",
      "Mengimpor aspek dari library ke kategori yang sedang dikelola",
    ],
    value:
      "Semua penilaian di aplikasi berdiri di atas daftar aspek yang sama — sekali kamus ini rapi, angka dari mana pun bisa diperbandingkan.",
  },
  "/admin/job-position": {
    definition:
      "Pengelolaan Job (departemen) berikut posisi di dalamnya, uraian jabatan, dan standar aspek yang berlaku untuk Job tersebut.",
    usage: [
      "Menata Job beserta posisi dan tingkatannya",
      "Menyunting job description tiap Job",
      "Menetapkan standar nilai tiap aspek — aspek yang sama boleh berbeda standar antar Job",
    ],
    value:
      "Standar yang dipakai menilai orang jadi eksplisit dan terpasang di tempatnya, sehingga 'memenuhi standar' punya arti yang sama bagi semua penilai.",
  },
  "/admin/employee": {
    definition:
      "Data induk karyawan: identitas, penempatan posisi, dan status kepegawaian yang menjadi rujukan seluruh menu lain.",
    usage: [
      "Mendaftarkan dan memutakhirkan data karyawan",
      "Menempatkan karyawan pada posisi dan Job-nya",
      "Menjaga data tetap selaras dengan kondisi organisasi terkini",
    ],
    value:
      "Satu sumber data karyawan yang dipakai bersama — tidak ada lagi selisih angka antar laporan karena masing-masing memakai daftar sendiri.",
  },
  "/admin/profile-data": {
    definition:
      "Pengaturan bidang data apa saja yang ditampilkan pada profil talenta.",
    usage: [
      "Menentukan bidang data yang tampil di iProfile",
      "Menyesuaikan susunan informasi profil dengan kebutuhan organisasi",
    ],
    value:
      "Profil menampilkan yang memang dipakai untuk mengambil keputusan, bukan seluruh isi basis data.",
  },
  "/admin/criteria": {
    definition:
      "Pengaturan kriteria dan pembobotan yang dipakai aplikasi saat menilai kesiapan dan mengelompokkan talenta.",
    usage: [
      "Menetapkan kriteria kesiapan dan ambang nilainya",
      "Mengatur bobot tiap komponen penilaian",
    ],
    value:
      "Aturan main penilaian tertulis di satu tempat dan berlaku seragam, sehingga hasilnya bisa dijelaskan dan diulang.",
  },
  "/admin/role-access": {
    definition:
      "Pengaturan peran pengguna dan hak akses ke tiap menu dan data.",
    usage: [
      "Menetapkan peran pengguna",
      "Membatasi menu dan data yang bisa diakses tiap peran",
    ],
    value:
      "Data talenta bersifat sensitif — pembatasan akses menjaga informasi hanya sampai ke pihak yang memang berkepentingan.",
  },
  "/admin/activity-log": {
    definition:
      "Catatan aktivitas pengguna di aplikasi: siapa mengubah apa dan kapan.",
    usage: [
      "Menelusuri perubahan data dan pengaturan",
      "Memeriksa kembali riwayat saat ada temuan atau sengketa data",
    ],
    value:
      "Perubahan yang tercatat membuat pengelolaan data bisa dipertanggungjawabkan dan kekeliruan bisa dilacak sampai sumbernya.",
  },
};

/**
 * Penjelasan menu untuk sebuah URL. Dicocokkan dari href terpanjang supaya
 * sub-menu menang atas induknya, dan halaman turunan ikut penjelasan menunya —
 * sama aturannya dengan `menuTitle`, jadi judul dan penjelasan selalu sepasang.
 */
export function menuInfo(pathname: string): MenuInfo | null {
  const hrefs = Object.keys(INFO).sort((a, b) => b.length - a.length);
  const hit = hrefs.find((href) => (href === "/" ? pathname === "/" : pathname.startsWith(href)));
  return hit ? INFO[hit] : null;
}
