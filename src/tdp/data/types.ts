// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  departments?: string[]; // Multi-team support
  level: string;
  performanceRating: number; // 0-100 percentage
  potentialRating: number; // 0-100 percentage
  yearsInCompany: number;
  yearsInRole: number;
  timeInRole: number; // months
  skills: string[];
  certifications: string[];
  education: string;
  flightRisk: 'Low' | 'Medium' | 'High';
  promotionReadiness: 'Not Ready' | 'Ready in 1-2 years' | 'Ready Now';
  readinessLevel: number; // 0-100 percentage
  engagementScore: number; // 0-100
  assessmentScore: number; // 0-100
  salary: number;
  lastPromotionDate: string;
  criticalRole: boolean;
  successorIdentified: boolean;
  manager: string;
  photo: string;
  // Timestamps for data freshness
  performanceRatingDate?: string;
  potentialRatingDate?: string;
  engagementScoreDate?: string;
  readinessScore?: number;    // Readiness (overall score)
  readinessHAV?: string;      // [Readiness] HAV
  usia?: number;              // [Readiness] Usia
  readinessRiskHeat?: string; // [Readiness] Risk Heat
  // AI / CSV columns
  iqScore?: number;
  personality?: string; // DISC
  leadershipType?: string;
  /** [CAPABILITY] Competency Match */
  competencyMatch?: number;
  // [CAPABILITY] cluster — 10 aspects (scale 1-5)
  leadership?: number;       // [CAPABILITY] Leadership
  communication?: number;    // [CAPABILITY] Influencing
  problemSolving?: number;   // [CAPABILITY] Planning
  teamwork?: number;         // [CAPABILITY] Collaboration
  adaptability?: number;     // [CAPABILITY] Relationship Building
  strategicThinking?: number; // [CAPABILITY] Strategic Thinking
  decisionMaking?: number;   // [CAPABILITY] Decision Making
  innovation?: number;       // [CAPABILITY] Developing Others
  analyticalSkills?: number; // [CAPABILITY] Analytical Thinking
  accountability?: number;   // [CAPABILITY] Integrity
  /**
   * Raw CSV row data keyed by original CSV header.
   * Used by column-popup keys of form `csv:<HeaderName>` so any CSV column
   * can be surfaced in the Table without an explicit Employee field.
   */
  csvFields?: Record<string, string>;
}
