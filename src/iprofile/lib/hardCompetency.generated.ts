// AUTO-GENERATED oleh scripts/gen-hard-competency.mjs — jangan edit manual.
// Sumber: public/data/position_hard_competency_standards.csv
//         public/data/participant_hard_competency_scores.csv
// Regenerate: node scripts/gen-hard-competency.mjs (sudah dihook di npm run seed).

export type HardAspectStandard = { label: string; category: string; standardScore: number };

/** Aspek teknis + standarnya per judul posisi. Daftarnya beda-beda tiap posisi. */
export const HARD_STANDARDS_BY_POSITION: Record<string, HardAspectStandard[]> = {
  "Head of Engineering": [
    {
      "label": "Arsitektur Sistem",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Code Review",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Keamanan Aplikasi",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "CI/CD",
      "category": "Tools & Platform",
      "standardScore": 4
    },
    {
      "label": "Cloud Infrastructure",
      "category": "Tools & Platform",
      "standardScore": 4
    },
    {
      "label": "Observability",
      "category": "Tools & Platform",
      "standardScore": 3
    }
  ],
  "Senior Engineer": [
    {
      "label": "Kualitas Kode",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Pengujian Otomatis",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Debugging",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Version Control",
      "category": "Tools & Platform",
      "standardScore": 4
    }
  ],
  "Frontend Lead": [
    {
      "label": "Arsitektur Komponen",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "State Management",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Aksesibilitas",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Performa Web",
      "category": "Tools & Platform",
      "standardScore": 4
    },
    {
      "label": "Design System",
      "category": "Tools & Platform",
      "standardScore": 4
    }
  ],
  "Backend Lead": [
    {
      "label": "Desain API",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Basis Data",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Optimasi Query",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Message Queue",
      "category": "Tools & Platform",
      "standardScore": 3
    },
    {
      "label": "Containerization",
      "category": "Tools & Platform",
      "standardScore": 3
    }
  ],
  "Chief Executive Officer": [
    {
      "label": "Strategi Korporat",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Alokasi Modal",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Tata Kelola",
      "category": "Regulasi",
      "standardScore": 5
    }
  ],
  "Chief Strategy Officer": [
    {
      "label": "Strategi Korporat",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Analisis Kompetitif",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Pemodelan Skenario",
      "category": "Tools & Platform",
      "standardScore": 4
    }
  ],
  "VP Corporate Strategy": [
    {
      "label": "Strategi Korporat",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Analisis Kompetitif",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Pemodelan Skenario",
      "category": "Tools & Platform",
      "standardScore": 4
    }
  ],
  "Head of Governance": [
    {
      "label": "Manajemen Risiko",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Kepatuhan Regulasi",
      "category": "Regulasi",
      "standardScore": 5
    },
    {
      "label": "Audit Internal",
      "category": "Regulasi",
      "standardScore": 4
    }
  ],
  "Head of Finance": [
    {
      "label": "Pelaporan Keuangan",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Analisis Anggaran",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Manajemen Risiko",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Kepatuhan Pajak",
      "category": "Regulasi",
      "standardScore": 4
    },
    {
      "label": "Standar Akuntansi",
      "category": "Regulasi",
      "standardScore": 4
    }
  ],
  "Senior Finance Analyst": [
    {
      "label": "Pemodelan Keuangan",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Analisis Varians",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Rekonsiliasi",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Spreadsheet Lanjutan",
      "category": "Tools & Platform",
      "standardScore": 4
    },
    {
      "label": "Standar Akuntansi",
      "category": "Regulasi",
      "standardScore": 3
    }
  ],
  "Finance Analyst": [
    {
      "label": "Pemodelan Keuangan",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Rekonsiliasi",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Analisis Varians",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Spreadsheet Lanjutan",
      "category": "Tools & Platform",
      "standardScore": 4
    },
    {
      "label": "Standar Akuntansi",
      "category": "Regulasi",
      "standardScore": 3
    }
  ],
  "Controller": [
    {
      "label": "Pengendalian Internal",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Pelaporan Keuangan",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Audit Kepatuhan",
      "category": "Regulasi",
      "standardScore": 4
    },
    {
      "label": "Standar Akuntansi",
      "category": "Regulasi",
      "standardScore": 4
    }
  ],
  "HR Business Partner": [
    {
      "label": "Manajemen Talenta",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Perencanaan SDM",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Hubungan Industrial",
      "category": "Regulasi",
      "standardScore": 4
    },
    {
      "label": "HRIS",
      "category": "Tools & Platform",
      "standardScore": 3
    }
  ],
  "HR Manager": [
    {
      "label": "Manajemen Kinerja",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Remunerasi",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Hubungan Industrial",
      "category": "Regulasi",
      "standardScore": 4
    },
    {
      "label": "HRIS",
      "category": "Tools & Platform",
      "standardScore": 3
    }
  ],
  "Talent Acquisition Lead": [
    {
      "label": "Sourcing Kandidat",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Teknik Wawancara",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Employer Branding",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "ATS",
      "category": "Tools & Platform",
      "standardScore": 4
    }
  ],
  "People Ops Specialist": [
    {
      "label": "Administrasi Personalia",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Onboarding",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Kepatuhan Ketenagakerjaan",
      "category": "Regulasi",
      "standardScore": 3
    },
    {
      "label": "HRIS",
      "category": "Tools & Platform",
      "standardScore": 3
    }
  ],
  "VP Operations": [
    {
      "label": "Perencanaan Kapasitas",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Manajemen Rantai Pasok",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Kendali Mutu",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Analitik Operasional",
      "category": "Tools & Platform",
      "standardScore": 4
    },
    {
      "label": "Keselamatan Kerja",
      "category": "Regulasi",
      "standardScore": 4
    }
  ],
  "Operations Manager": [
    {
      "label": "Perencanaan Produksi",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Kendali Mutu",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Efisiensi Proses",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Keselamatan Kerja",
      "category": "Regulasi",
      "standardScore": 4
    }
  ],
  "Supply Chain Lead": [
    {
      "label": "Manajemen Rantai Pasok",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Manajemen Vendor",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Perencanaan Inventori",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Sistem ERP",
      "category": "Tools & Platform",
      "standardScore": 3
    }
  ],
  "Operations Analyst": [
    {
      "label": "Analitik Operasional",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Pemetaan Proses",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Spreadsheet Lanjutan",
      "category": "Tools & Platform",
      "standardScore": 3
    }
  ],
  "Head of Marketing": [
    {
      "label": "Strategi Kampanye",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Riset Pasar",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Manajemen Brand",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Analitik Digital",
      "category": "Tools & Platform",
      "standardScore": 4
    },
    {
      "label": "Otomasi Pemasaran",
      "category": "Tools & Platform",
      "standardScore": 3
    }
  ],
  "Senior Marketing Manager": [
    {
      "label": "Strategi Kampanye",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Riset Pasar",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Analitik Digital",
      "category": "Tools & Platform",
      "standardScore": 4
    }
  ],
  "Brand Manager": [
    {
      "label": "Manajemen Brand",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Strategi Kampanye",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Riset Pasar",
      "category": "Technical Core",
      "standardScore": 3
    }
  ],
  "Growth Marketing Lead": [
    {
      "label": "Eksperimen Pertumbuhan",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Optimasi Konversi",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Analitik Digital",
      "category": "Tools & Platform",
      "standardScore": 4
    }
  ],
  "Senior Brand Strategist": [
    {
      "label": "Strategi Brand",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Riset Pasar",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Narasi & Positioning",
      "category": "Technical Core",
      "standardScore": 4
    }
  ],
  "Chief Revenue Officer": [
    {
      "label": "Strategi Pendapatan",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Manajemen Pipeline",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Penetapan Harga",
      "category": "Technical Core",
      "standardScore": 4
    }
  ],
  "Creative Director": [
    {
      "label": "Arahan Kreatif",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Storytelling Visual",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Manajemen Produksi",
      "category": "Tools & Platform",
      "standardScore": 3
    }
  ],
  "Principal Engineer": [
    {
      "label": "Arsitektur Sistem",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Desain Terdistribusi",
      "category": "Technical Core",
      "standardScore": 5
    },
    {
      "label": "Technical Roadmap",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Cloud Infrastructure",
      "category": "Tools & Platform",
      "standardScore": 4
    },
    {
      "label": "Observability",
      "category": "Tools & Platform",
      "standardScore": 4
    }
  ],
  "Operations Strategist": [
    {
      "label": "Perencanaan Strategis",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Analitik Operasional",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Pemodelan Skenario",
      "category": "Tools & Platform",
      "standardScore": 4
    }
  ],
  "Growth Marketing Manager": [
    {
      "label": "Eksperimen Pertumbuhan",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Analitik Digital",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Optimasi Konversi",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Otomasi Pemasaran",
      "category": "Tools & Platform",
      "standardScore": 4
    }
  ],
  "Senior Finance Manager": [
    {
      "label": "Pelaporan Keuangan",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Analisis Anggaran",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Manajemen Kas",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Standar Akuntansi",
      "category": "Regulasi",
      "standardScore": 4
    }
  ],
  "Supply Chain Manager": [
    {
      "label": "Manajemen Rantai Pasok",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Negosiasi Pengadaan",
      "category": "Technical Core",
      "standardScore": 4
    },
    {
      "label": "Perencanaan Inventori",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Sistem ERP",
      "category": "Tools & Platform",
      "standardScore": 3
    }
  ],
  "Digital Content Specialist": [
    {
      "label": "Penulisan Konten",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "Produksi Visual",
      "category": "Technical Core",
      "standardScore": 3
    },
    {
      "label": "SEO",
      "category": "Tools & Platform",
      "standardScore": 3
    },
    {
      "label": "Analitik Digital",
      "category": "Tools & Platform",
      "standardScore": 3
    }
  ]
};

/** Skor teknis tiap partisipan, dikunci per nama aspek. */
export const HARD_SCORES_BY_PARTICIPANT: Record<string, Record<string, number>> = {
  "p01": {
    "Arsitektur Sistem": 4,
    "Code Review": 2,
    "Keamanan Aplikasi": 4,
    "CI/CD": 5,
    "Cloud Infrastructure": 3,
    "Observability": 2
  },
  "p02": {
    "Kualitas Kode": 4,
    "Pengujian Otomatis": 3,
    "Debugging": 5,
    "Version Control": 5
  },
  "p03": {
    "Arsitektur Komponen": 4,
    "State Management": 5,
    "Aksesibilitas": 2,
    "Performa Web": 5,
    "Design System": 5
  },
  "p04": {
    "Desain API": 3,
    "Basis Data": 2,
    "Optimasi Query": 5,
    "Message Queue": 1,
    "Containerization": 4
  },
  "p05": {
    "Strategi Korporat": 5,
    "Alokasi Modal": 5,
    "Tata Kelola": 3
  },
  "p06": {
    "Strategi Korporat": 5,
    "Analisis Kompetitif": 5,
    "Pemodelan Skenario": 4
  },
  "p07": {
    "Strategi Korporat": 2,
    "Analisis Kompetitif": 5,
    "Pemodelan Skenario": 4
  },
  "p08": {
    "Manajemen Risiko": 4,
    "Kepatuhan Regulasi": 5,
    "Audit Internal": 5
  },
  "p09": {
    "Pelaporan Keuangan": 4,
    "Analisis Anggaran": 5,
    "Manajemen Risiko": 4,
    "Kepatuhan Pajak": 5,
    "Standar Akuntansi": 4
  },
  "p10": {
    "Pemodelan Keuangan": 3,
    "Analisis Varians": 2,
    "Rekonsiliasi": 1,
    "Spreadsheet Lanjutan": 3,
    "Standar Akuntansi": 3
  },
  "p11": {
    "Pemodelan Keuangan": 2,
    "Rekonsiliasi": 2,
    "Analisis Varians": 2,
    "Spreadsheet Lanjutan": 4,
    "Standar Akuntansi": 3
  },
  "p12": {
    "Pengendalian Internal": 5,
    "Pelaporan Keuangan": 3,
    "Audit Kepatuhan": 3,
    "Standar Akuntansi": 5
  },
  "p13": {
    "Manajemen Talenta": 4,
    "Perencanaan SDM": 5,
    "Hubungan Industrial": 3,
    "HRIS": 3
  },
  "p14": {
    "Manajemen Kinerja": 5,
    "Remunerasi": 3,
    "Hubungan Industrial": 4,
    "HRIS": 4
  },
  "p15": {
    "Sourcing Kandidat": 5,
    "Teknik Wawancara": 5,
    "Employer Branding": 4,
    "ATS": 5
  },
  "p16": {
    "Administrasi Personalia": 1,
    "Onboarding": 3,
    "Kepatuhan Ketenagakerjaan": 4,
    "HRIS": 1
  },
  "p17": {
    "Perencanaan Kapasitas": 5,
    "Manajemen Rantai Pasok": 3,
    "Kendali Mutu": 5,
    "Analitik Operasional": 5,
    "Keselamatan Kerja": 5
  },
  "p18": {
    "Perencanaan Produksi": 3,
    "Kendali Mutu": 2,
    "Efisiensi Proses": 4,
    "Keselamatan Kerja": 5
  },
  "p19": {
    "Manajemen Rantai Pasok": 4,
    "Manajemen Vendor": 3,
    "Perencanaan Inventori": 2,
    "Sistem ERP": 3
  },
  "p20": {
    "Analitik Operasional": 4,
    "Pemetaan Proses": 2,
    "Spreadsheet Lanjutan": 3
  },
  "p21": {
    "Strategi Kampanye": 5,
    "Riset Pasar": 5,
    "Manajemen Brand": 3,
    "Analitik Digital": 3,
    "Otomasi Pemasaran": 4
  },
  "p22": {
    "Strategi Kampanye": 4,
    "Riset Pasar": 5,
    "Analitik Digital": 3
  },
  "p23": {
    "Manajemen Brand": 3,
    "Strategi Kampanye": 5,
    "Riset Pasar": 1
  },
  "p24": {
    "Eksperimen Pertumbuhan": 2,
    "Optimasi Konversi": 2,
    "Analitik Digital": 4
  },
  "p25": {
    "Strategi Brand": 3,
    "Riset Pasar": 3,
    "Narasi & Positioning": 3
  },
  "p26": {
    "Strategi Pendapatan": 5,
    "Manajemen Pipeline": 4,
    "Penetapan Harga": 4
  },
  "p27": {
    "Arahan Kreatif": 5,
    "Storytelling Visual": 4,
    "Manajemen Produksi": 3
  },
  "p28": {
    "Arsitektur Sistem": 5,
    "Desain Terdistribusi": 4,
    "Technical Roadmap": 4,
    "Cloud Infrastructure": 4,
    "Observability": 4
  },
  "p29": {
    "Perencanaan Strategis": 2,
    "Analitik Operasional": 3,
    "Pemodelan Skenario": 3
  },
  "p30": {
    "Eksperimen Pertumbuhan": 5,
    "Analitik Digital": 3,
    "Optimasi Konversi": 5,
    "Otomasi Pemasaran": 5
  },
  "p31": {
    "Pelaporan Keuangan": 4,
    "Analisis Anggaran": 3,
    "Manajemen Kas": 4,
    "Standar Akuntansi": 5
  },
  "p32": {
    "Manajemen Rantai Pasok": 5,
    "Negosiasi Pengadaan": 5,
    "Perencanaan Inventori": 2,
    "Sistem ERP": 4
  },
  "p33": {
    "Penulisan Konten": 4,
    "Produksi Visual": 2,
    "SEO": 3,
    "Analitik Digital": 3
  }
};
