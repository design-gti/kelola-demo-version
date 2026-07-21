import type { CompetencyDetail, IDPRecommendation } from './orgChartData';

// 13 Standard Competencies
const STANDARD_COMPETENCIES = [
  "Orientasi Hasil",
  "Kerjasama",
  "Komunikasi",
  "Daya Analisis",
  "Adaptabilitas",
  "Inisiatif",
  "Pelayanan Pelanggan",
  "Integritas",
  "Pengembangan Diri",
  "Pengambilan Keputusan",
  "Manajemen Waktu",
  "Disiplin",
  "Keterampilan Interpersonal"
];

// IDP Program templates for each competency
const IDP_TEMPLATES: Record<string, IDPRecommendation> = {
  "Orientasi Hasil": {
    competency: "Orientasi Hasil",
    successMeasures: [
      "Mencapai 100% target KPI selama 2 kuartal berturut-turut",
      "Menyelesaikan minimal 3 proyek tepat waktu dengan kualitas excellent"
    ],
    programs: [
      { type: "Training", description: "Workshop Goal Setting & Achievement Strategy" },
      { type: "Job Assignment", description: "Memimpin proyek prioritas tinggi dengan target terukur" }
    ]
  },
  "Kerjasama": {
    competency: "Kerjasama",
    successMeasures: [
      "Mendapat rating 4.0/5.0 dari rekan kerja dalam peer evaluation",
      "Berhasil menyelesaikan 2+ proyek cross-functional dengan sukses"
    ],
    programs: [
      { type: "Training", description: "Team Collaboration & Interpersonal Skills Workshop" },
      { type: "Job Assignment", description: "Menjadi koordinator dalam proyek lintas divisi" }
    ]
  },
  "Komunikasi": {
    competency: "Komunikasi",
    successMeasures: [
      "Mencapai clarity score 85%+ dalam survei efektivitas komunikasi",
      "Sukses memfasilitasi 4+ presentasi/meeting penting per bulan"
    ],
    programs: [
      { type: "Training", description: "Professional Presentation & Communication Skills" },
      { type: "Practice Assignment", description: "Memimpin weekly team stand-ups dan monthly presentations" }
    ]
  },
  "Daya Analisis": {
    competency: "Daya Analisis",
    successMeasures: [
      "Mengidentifikasi dan mengimplementasikan 3+ improvement dengan ROI terukur",
      "Membuat analisis data-driven untuk mendukung minimal 5 keputusan strategis"
    ],
    programs: [
      { type: "Training", description: "Data Analysis & Problem Solving Certification" },
      { type: "Job Assignment", description: "Lead analytical projects requiring complex data interpretation" }
    ]
  },
  "Adaptabilitas": {
    competency: "Adaptabilitas",
    successMeasures: [
      "Berhasil beradaptasi dengan 2+ perubahan sistem/proses besar tanpa penurunan kinerja",
      "Mendapat rating 'Excellent' dalam flexibility assessment"
    ],
    programs: [
      { type: "Job Rotation", description: "Rotasi 3 bulan ke departemen berbeda untuk exposure" },
      { type: "Coaching", description: "Mentoring dengan leader yang kuat dalam change management" }
    ]
  },
  "Inisiatif": {
    competency: "Inisiatif",
    successMeasures: [
      "Menginisiasi dan melaksanakan 3+ proyek improvement tanpa diminta",
      "Memberikan minimal 5 ide inovatif yang diadopsi oleh tim/perusahaan"
    ],
    programs: [
      { type: "Job Assignment", description: "Memimpin innovation project atau improvement initiative" },
      { type: "Workshop", description: "Creative Thinking & Innovation Workshop" }
    ]
  },
  "Pelayanan Pelanggan": {
    competency: "Pelayanan Pelanggan",
    successMeasures: [
      "Mencapai customer satisfaction score 4.5/5.0 atau lebih tinggi",
      "Mengurangi waktu resolusi complaint sebesar 20%"
    ],
    programs: [
      { type: "Training", description: "Customer Experience & Service Excellence Program" },
      { type: "Job Rotation", description: "Temporary assignment di customer-facing role" }
    ]
  },
  "Integritas": {
    competency: "Integritas",
    successMeasures: [
      "Zero compliance violations selama 12 bulan berturut-turut",
      "Mendapat rating 'Excellent' dalam integrity evaluation oleh atasan"
    ],
    programs: [
      { type: "Workshop", description: "Ethics & Professional Conduct Training" },
      { type: "Job Assignment", description: "Menjadi PIC untuk proyek yang melibatkan audit atau finance" }
    ]
  },
  "Pengembangan Diri": {
    competency: "Pengembangan Diri",
    successMeasures: [
      "Menyelesaikan minimal 2 sertifikasi profesional dalam 12 bulan",
      "Mencatat dan mengimplementasikan 10+ learning points dari development activities"
    ],
    programs: [
      { type: "Training", description: "Professional certification program sesuai career path" },
      { type: "Mentorship", description: "Regular mentoring sessions dengan senior leader" }
    ]
  },
  "Pengambilan Keputusan": {
    competency: "Pengambilan Keputusan",
    successMeasures: [
      "Membuat minimal 5 keputusan strategis dengan outcome positif terukur",
      "Mengurangi decision-making time sebesar 15% tanpa mengorbankan kualitas"
    ],
    programs: [
      { type: "Training", description: "Strategic Decision Making & Critical Thinking Workshop" },
      { type: "Job Assignment", description: "Mendapat delegasi untuk decision-making authority yang lebih tinggi" }
    ]
  },
  "Manajemen Waktu": {
    competency: "Manajemen Waktu",
    successMeasures: [
      "Mencapai on-time delivery rate 95%+ untuk semua deliverables",
      "Berhasil mengelola minimal 5 proyek simultan tanpa delay"
    ],
    programs: [
      { type: "Training", description: "Time Management & Productivity Excellence Workshop" },
      { type: "Coaching", description: "One-on-one coaching untuk priority management" }
    ]
  },
  "Disiplin": {
    competency: "Disiplin",
    successMeasures: [
      "Attendance rate 98%+ dan zero tardiness selama 6 bulan",
      "100% compliance terhadap SOP dan prosedur perusahaan"
    ],
    programs: [
      { type: "Workshop", description: "Self-discipline & Professional Work Ethics Training" },
      { type: "Mentorship", description: "Buddy system dengan role model yang memiliki disiplin tinggi" }
    ]
  },
  "Keterampilan Interpersonal": {
    competency: "Keterampilan Interpersonal",
    successMeasures: [
      "Mendapat rating 4.5/5.0 dalam interpersonal skills assessment",
      "Berhasil membangun relationship yang produktif dengan 90%+ stakeholders"
    ],
    programs: [
      { type: "Training", description: "Interpersonal Skills & Emotional Intelligence Workshop" },
      { type: "Practice Assignment", description: "Menjadi liaison untuk cross-departmental initiatives" }
    ]
  }
};

// Seeded random number generator for consistency
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate development data based on readiness score
export function generateDevelopmentData(
  employeeId: string,
  readinessScore: number
): {
  competencyDetails: CompetencyDetail[];
  idpRecommendations: IDPRecommendation[];
} {
  const seed = parseInt(employeeId);
  
  // Determine gap count based on readiness score
  // Thresholds aligned with heatmap config default:
  // - Biru/READY: readiness >= 81 â†’ 0 gaps
  // - Orange: readiness 66-80 â†’ 2-3 gaps
  // - Merah: readiness < 66 â†’ 4-6 gaps
  
  let gapCount: number;
  let gapScoreDistribution: number[]; // Array of scores (1 or 2) for gap aspects
  
  if (readinessScore >= 81) {
    // READY - No gaps
    gapCount = 0;
    gapScoreDistribution = [];
  } else if (readinessScore >= 66) {
    // ORANGE - 2-3 gaps
    // Use seeded random to pick 2 or 3
    gapCount = seededRandom(seed * 1.1) > 0.5 ? 3 : 2;
    
    // For orange (medium readiness), mix of score 1 and 2
    // Higher readiness within range â†’ more score 2 than 1
    gapScoreDistribution = [];
    for (let i = 0; i < gapCount; i++) {
      // 70% chance of score 2, 30% chance of score 1 for orange range
      const isScore2 = seededRandom(seed * (2 + i)) > 0.3;
      gapScoreDistribution.push(isScore2 ? 2 : 1);
    }
  } else {
    // MERAH - 4-6 gaps
    // Lower readiness â†’ more gaps
    // Distribute 4-6 based on how low the score is
    if (readinessScore < 40) {
      gapCount = 6;
    } else if (readinessScore < 50) {
      gapCount = 5;
    } else {
      gapCount = 4;
    }
    
    // For red (low readiness), more score 1 than 2
    // Lower readiness â†’ more score 1
    gapScoreDistribution = [];
    for (let i = 0; i < gapCount; i++) {
      // For very low readiness (<40), 80% score 1
      // For medium-low (40-65), 60% score 1
      const threshold = readinessScore < 40 ? 0.8 : 0.6;
      const isScore1 = seededRandom(seed * (3 + i)) < threshold;
      gapScoreDistribution.push(isScore1 ? 1 : 2);
    }
  }
  
  // Select which competencies will have gaps (seeded random for consistency)
  const gapIndices: number[] = [];
  const availableIndices = Array.from({ length: 13 }, (_, i) => i);
  
  for (let i = 0; i < gapCount; i++) {
    const randomIndex = Math.floor(seededRandom(seed * (10 + i)) * availableIndices.length);
    gapIndices.push(availableIndices[randomIndex]);
    availableIndices.splice(randomIndex, 1);
  }
  
  // Generate competency details
  const competencyDetails: CompetencyDetail[] = STANDARD_COMPETENCIES.map((name, index) => {
    const isGap = gapIndices.includes(index);
    
    if (isGap) {
      // Gap aspect: score 1 or 2
      const gapIndexInDistribution = gapIndices.indexOf(index);
      return {
        name,
        score: gapScoreDistribution[gapIndexInDistribution]
      };
    } else {
      // Non-gap aspect: score 3-5
      // Higher readiness â†’ higher average score for non-gaps
      let score: number;
      if (readinessScore >= 90) {
        score = 5; // All excellent for top performers
      } else if (readinessScore >= 81) {
        // READY range: mostly 4-5
        score = seededRandom(seed * (20 + index)) > 0.3 ? 5 : 4;
      } else if (readinessScore >= 66) {
        // ORANGE range: 3-4
        score = seededRandom(seed * (30 + index)) > 0.5 ? 4 : 3;
      } else {
        // MERAH range: mostly 3
        score = seededRandom(seed * (40 + index)) > 0.7 ? 4 : 3;
      }
      
      return { name, score };
    }
  });
  
  // Generate IDP recommendations only for gap aspects
  const idpRecommendations: IDPRecommendation[] = [];
  
  gapIndices.forEach(index => {
    const competencyName = STANDARD_COMPETENCIES[index];
    const template = IDP_TEMPLATES[competencyName];
    if (template) {
      idpRecommendations.push(template);
    }
  });
  
  // If no gaps (READY status), provide aspirational IDP for top 2 competencies
  if (idpRecommendations.length === 0) {
    // For high performers, suggest advanced development in their strength areas
    const aspirationalIDP: IDPRecommendation = {
      competency: "Leadership Development",
      successMeasures: [
        "Memimpin strategic initiative melibatkan multiple departments",
        "Menjadi mentor untuk 2+ junior team members dengan measurable improvement"
      ],
      programs: [
        { type: "Job Assignment", description: "Lead cross-functional strategic project" },
        { type: "Executive Coaching", description: "Executive coaching sessions dengan senior leadership" }
      ]
    };
    idpRecommendations.push(aspirationalIDP);
  }
  
  return {
    competencyDetails,
    idpRecommendations
  };
}

// Calculate competency score from aspect scores (for data consistency)
export function calculateCompetencyScore(competencyDetails: CompetencyDetail[]): number {
  if (!competencyDetails || competencyDetails.length === 0) return 0;
  
  const average = competencyDetails.reduce((sum, detail) => sum + detail.score, 0) / competencyDetails.length;
  // Convert from 1-5 scale to 0-100 scale
  return Math.round(average * 20);
}

