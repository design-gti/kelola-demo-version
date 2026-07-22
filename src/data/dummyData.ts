// Back-compat adapter (PGS-1133 / E1): `candidates` kini DIDERIVE dari canonical store.
// Interface `Candidate` dipertahankan agar 11 komponen card lama tetap jalan tanpa diubah.
import { allParticipants, positionOf, scoreOf, assignmentsOf, successorsOf } from "./model/selectors";

export interface Candidate {
  id: string;
  name: string;
  position: string;
  department: string;
  behavioral_score: number | null;
  technical_score: number | null;
  performance_score: number | null;
  dataLastUpdated?: string;
  leadership_score: number;
  potential: "low" | "medium" | "high";
  photo: null;
  hasHRIS: boolean;
  hasIDP: boolean;
  isSuccession: boolean;
  isPGS: boolean;
  isTalentPool: boolean;
}

export interface CriticalPosition {
  id: string;
  title: string;
  department: string;
  successors: { candidateId: string; readiness_gap: number }[];
}

export interface SyncSystem {
  id: string;
  name: string;
  lastSync: string;
  status: "success" | "warning" | "failed";
  errorMsg?: string;
  dataType: string;
}

export interface ActivityEntry {
  id: string;
  type: "data_updated" | "assessment_completed" | "idp_action" | "sync_event" | "alert_triggered";
  description: string;
  actor: string;
  timestamp: string;
  candidateId?: string;
}

// derive Candidate[] from canonical participants + scores
export const candidates: Candidate[] = allParticipants().map(p => {
  const perf = scoreOf(p.id, "performance");
  const hasAssignment = assignmentsOf(p.id).length > 0;
  const isSucc = p.successorForId != null || successorsOf(p.id).length > 0;
  return {
    id: p.id,
    name: p.name,
    position: positionOf(p).title,
    department: positionOf(p).department,
    behavioral_score: scoreOf(p.id, "behavioral"),
    technical_score: scoreOf(p.id, "technical"),
    performance_score: perf,
    leadership_score: scoreOf(p.id, "leadership") ?? 0,
    potential: p.potential,
    photo: null,
    hasHRIS: true,
    hasIDP: hasAssignment,
    isSuccession: isSucc,
    isPGS: p.potential === "high",
    isTalentPool: p.potential === "high" || (perf ?? 0) >= 80,
  };
});

// Critical positions — successor candidateId mengacu id kanonik (p-xx)
export const criticalPositions: CriticalPosition[] = [
  { id: "cp1", title: "Chief Executive Officer", department: "Strategi", successors: [{ candidateId: "p07", readiness_gap: 8 }, { candidateId: "p01", readiness_gap: 12 }] },
  { id: "cp2", title: "Head of Finance", department: "Keuangan", successors: [{ candidateId: "p12", readiness_gap: 6 }] },
  { id: "cp3", title: "VP Operations", department: "Operasional", successors: [{ candidateId: "p18", readiness_gap: 20 }] },
  { id: "cp4", title: "Head of Marketing", department: "Pemasaran", successors: [{ candidateId: "p23", readiness_gap: 10 }, { candidateId: "p24", readiness_gap: 28 }] },
  { id: "cp5", title: "Head of Engineering", department: "Teknologi", successors: [] },
];

export const syncSystems: SyncSystem[] = [
  { id: "s1", name: "HRIS Sistem", lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: "success", dataType: "Data Karyawan" },
  { id: "s2", name: "IDP Platform", lastSync: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), status: "warning", dataType: "Rencana Pengembangan" },
  { id: "s3", name: "Assessment Engine", lastSync: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), status: "failed", errorMsg: "Koneksi timeout pada endpoint /api/scores", dataType: "Skor Penilaian" },
  { id: "s4", name: "PGS System", lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), status: "success", dataType: "Program Generasi Suksesor" },
  { id: "s5", name: "Talent Analytics", lastSync: new Date(Date.now() - 70 * 60 * 60 * 1000).toISOString(), status: "warning", dataType: "Analitik Talenta" },
];

export const activityLog: ActivityEntry[] = [
  { id: "al1", type: "assessment_completed", description: "Penilaian leadership selesai untuk Jude Bellingham", actor: "Sistem Assessment", timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), candidateId: "p01" },
  { id: "al2", type: "data_updated", description: "Profil Kylian Mbappe diperbarui", actor: "Admin SDM", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), candidateId: "p05" },
  { id: "al3", type: "sync_event", description: "Sinkronisasi HRIS berhasil — 24 data diperbarui", actor: "Sistem HRIS", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "al4", type: "idp_action", description: "Rencana pengembangan Jamal Musiala telah disetujui", actor: "Manajer Langsung", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), candidateId: "p02" },
  { id: "al5", type: "assessment_completed", description: "Competency test selesai untuk Rodri", actor: "Sistem Assessment", timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), candidateId: "p07" },
  { id: "al6", type: "data_updated", description: "Skor kepemimpinan Virgil van Dijk diperbarui", actor: "Admin SDM", timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), candidateId: "p08" },
  { id: "al7", type: "alert_triggered", description: "3 posisi kritis tanpa kandidat suksesor teridentifikasi", actor: "Sistem", timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() },
  { id: "al8", type: "idp_action", description: "Target pengembangan Q3 ditetapkan untuk Lautaro Martinez", actor: "HR Business Partner", timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), candidateId: "p17" },
  { id: "al9", type: "sync_event", description: "Assessment Engine gagal sinkronisasi — timeout", actor: "Sistem", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
  { id: "al10", type: "assessment_completed", description: "360° feedback selesai untuk Vinicius Junior", actor: "Tim Penilai", timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), candidateId: "p21" },
  { id: "al11", type: "data_updated", description: "Data succession planning diperbarui untuk posisi CEO", actor: "Admin SDM", timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString() },
  { id: "al12", type: "idp_action", description: "Program mentoring dimulai untuk Declan Rice", actor: "HR Business Partner", timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), candidateId: "p14" },
];

export const recentlyViewed: string[] = ["p05", "p01", "p17", "p21", "p07"];
