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

export const candidates: Candidate[] = [
  { id: "c1",  name: "Budi Santoso",      position: "Manajer Operasional",          department: "Operasional", behavioral_score: 78,   technical_score: 82,   performance_score: 75,   leadership_score: 80, potential: "high",   photo: null, hasHRIS: true,  hasIDP: true,  isSuccession: true,  isPGS: false, isTalentPool: true,  dataLastUpdated: "2024-01-10" },
  { id: "c2",  name: "Siti Rahayu",       position: "Kepala Divisi Keuangan",        department: "Keuangan",   behavioral_score: 85,   technical_score: 88,   performance_score: 90,   leadership_score: 87, potential: "high",   photo: null, hasHRIS: true,  hasIDP: true,  isSuccession: true,  isPGS: true,  isTalentPool: true,  dataLastUpdated: "2024-03-22" },
  { id: "c3",  name: "Ahmad Fauzi",       position: "Senior Engineer",               department: "Teknologi",  behavioral_score: null, technical_score: 91,   performance_score: 88,   leadership_score: 70, potential: "high",   photo: null, hasHRIS: true,  hasIDP: false, isSuccession: false, isPGS: false, isTalentPool: true  },
  { id: "c4",  name: "Dewi Kusuma",       position: "HR Business Partner",           department: "SDM",        behavioral_score: 72,   technical_score: null, performance_score: 69,   leadership_score: 75, potential: "medium", photo: null, hasHRIS: true,  hasIDP: true,  isSuccession: false, isPGS: true,  isTalentPool: false, dataLastUpdated: "2025-09-15" },
  { id: "c5",  name: "Rizky Pratama",     position: "Manajer Pemasaran",             department: "Pemasaran",  behavioral_score: 66,   technical_score: 70,   performance_score: null, leadership_score: 72, potential: "medium", photo: null, hasHRIS: false, hasIDP: true,  isSuccession: true,  isPGS: false, isTalentPool: true,  dataLastUpdated: "2023-11-05" },
  { id: "c6",  name: "Nurul Hidayah",     position: "Analis Data Senior",            department: "Teknologi",  behavioral_score: 80,   technical_score: 85,   performance_score: 82,   leadership_score: 68, potential: "high",   photo: null, hasHRIS: true,  hasIDP: true,  isSuccession: false, isPGS: false, isTalentPool: true,  dataLastUpdated: "2025-10-01" },
  { id: "c7",  name: "Hendra Wijaya",     position: "Direktur Pengembangan Bisnis",  department: "Strategi",   behavioral_score: null, technical_score: null, performance_score: 71,   leadership_score: 88, potential: "high",   photo: null, hasHRIS: true,  hasIDP: false, isSuccession: true,  isPGS: true,  isTalentPool: true,  dataLastUpdated: "2024-06-20" },
  { id: "c8",  name: "Maya Sari",         position: "Kepala Legal",                  department: "Hukum",      behavioral_score: 76,   technical_score: 79,   performance_score: 74,   leadership_score: 77, potential: "medium", photo: null, hasHRIS: true,  hasIDP: true,  isSuccession: false, isPGS: false, isTalentPool: false, dataLastUpdated: "2024-02-14" },
  { id: "c9",  name: "Doni Setiawan",     position: "Manajer Rantai Pasok",          department: "Operasional",behavioral_score: 63,   technical_score: 68,   performance_score: 60,   leadership_score: 65, potential: "low",    photo: null, hasHRIS: false, hasIDP: false, isSuccession: false, isPGS: false, isTalentPool: false, dataLastUpdated: "2025-08-20" },
  { id: "c10", name: "Intan Permata",     position: "Senior Finance Analyst",        department: "Keuangan",   behavioral_score: 88,   technical_score: 92,   performance_score: 86,   leadership_score: 82, potential: "high",   photo: null, hasHRIS: true,  hasIDP: true,  isSuccession: true,  isPGS: true,  isTalentPool: true,  dataLastUpdated: "2025-11-30" },
  { id: "c11", name: "Fajar Nugroho",     position: "IT Security Lead",              department: "Teknologi",  behavioral_score: null, technical_score: 87,   performance_score: null, leadership_score: 73, potential: "medium", photo: null, hasHRIS: true,  hasIDP: true,  isSuccession: false, isPGS: false, isTalentPool: true  },
  { id: "c12", name: "Ratna Wulandari",   position: "Manajer SDM",                   department: "SDM",        behavioral_score: 74,   technical_score: 65,   performance_score: 72,   leadership_score: 79, potential: "medium", photo: null, hasHRIS: true,  hasIDP: false, isSuccession: false, isPGS: false, isTalentPool: false, dataLastUpdated: "2024-04-18" },
  { id: "c13", name: "Eko Prasetyo",      position: "VP Operasional",                department: "Operasional",behavioral_score: 82,   technical_score: 78,   performance_score: 85,   leadership_score: 90, potential: "high",   photo: null, hasHRIS: true,  hasIDP: true,  isSuccession: true,  isPGS: true,  isTalentPool: true,  dataLastUpdated: "2025-07-05" },
  { id: "c14", name: "Lina Marlina",      position: "Senior Marketing Manager",      department: "Pemasaran",  behavioral_score: 71,   technical_score: null, performance_score: 68,   leadership_score: 74, potential: "medium", photo: null, hasHRIS: false, hasIDP: true,  isSuccession: false, isPGS: false, isTalentPool: true  },
  { id: "c15", name: "Wahyu Hidayat",     position: "Business Analyst",              department: "Strategi",   behavioral_score: 58,   technical_score: 62,   performance_score: 55,   leadership_score: 60, potential: "low",    photo: null, hasHRIS: true,  hasIDP: false, isSuccession: false, isPGS: false, isTalentPool: false, dataLastUpdated: "2023-08-30" },
  { id: "c16", name: "Putri Andini",      position: "Manajer Kepatuhan",             department: "Hukum",      behavioral_score: 77,   technical_score: 80,   performance_score: 76,   leadership_score: 78, potential: "medium", photo: null, hasHRIS: true,  hasIDP: true,  isSuccession: false, isPGS: false, isTalentPool: false, dataLastUpdated: "2025-09-10" },
  { id: "c17", name: "Agus Salim",        position: "Kepala Riset & Inovasi",        department: "Teknologi",  behavioral_score: 84,   technical_score: 90,   performance_score: 81,   leadership_score: 85, potential: "high",   photo: null, hasHRIS: true,  hasIDP: true,  isSuccession: true,  isPGS: false, isTalentPool: true,  dataLastUpdated: "2024-05-07" },
  { id: "c18", name: "Fitri Handayani",   position: "Controller Keuangan",           department: "Keuangan",   behavioral_score: null, technical_score: 76,   performance_score: 73,   leadership_score: 71, potential: "medium", photo: null, hasHRIS: true,  hasIDP: false, isSuccession: false, isPGS: false, isTalentPool: false },
  { id: "c19", name: "Bambang Sutrisno",  position: "Direktur Teknologi",            department: "Teknologi",  behavioral_score: 79,   technical_score: 84,   performance_score: 80,   leadership_score: 86, potential: "high",   photo: null, hasHRIS: true,  hasIDP: true,  isSuccession: true,  isPGS: true,  isTalentPool: true,  dataLastUpdated: "2025-10-12" },
  { id: "c20", name: "Sri Mulyani",       position: "Kepala Strategi Korporat",      department: "Strategi",   behavioral_score: 86,   technical_score: 83,   performance_score: 88,   leadership_score: 92, potential: "high",   photo: null, hasHRIS: true,  hasIDP: true,  isSuccession: true,  isPGS: true,  isTalentPool: true,  dataLastUpdated: "2025-11-01" },
];

export const criticalPositions: CriticalPosition[] = [
  { id: "p1", title: "CEO", department: "Executive", successors: [] },
  { id: "p2", title: "Chief People Officer", department: "People", successors: [{ candidateId: "c4", readiness_gap: 10 }, { candidateId: "c12", readiness_gap: 8 }] },
  { id: "p3", title: "HR Operations Lead", department: "People", successors: [{ candidateId: "c16", readiness_gap: 5 }] },
  { id: "p4", title: "Product Manager Lead", department: "Product", successors: [{ candidateId: "c7", readiness_gap: 30 }, { candidateId: "c17", readiness_gap: 12 }] },
  { id: "p5", title: "Research Lead", department: "Research", successors: [{ candidateId: "c6", readiness_gap: 35 }] },
];

export const syncSystems: SyncSystem[] = [
  { id: "s1", name: "HRIS Sistem", lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: "success", dataType: "Data Karyawan" },
  { id: "s2", name: "IDP Platform", lastSync: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), status: "warning", dataType: "Rencana Pengembangan" },
  { id: "s3", name: "Assessment Engine", lastSync: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), status: "failed", errorMsg: "Koneksi timeout pada endpoint /api/scores", dataType: "Skor Penilaian" },
  { id: "s4", name: "PGS System", lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), status: "success", dataType: "Program Generasi Suksesor" },
  { id: "s5", name: "Talent Analytics", lastSync: new Date(Date.now() - 70 * 60 * 60 * 1000).toISOString(), status: "warning", dataType: "Analitik Talenta" },
];

export const activityLog: ActivityEntry[] = [
  { id: "a1", type: "assessment_completed", description: "Penilaian behavioral selesai untuk Budi Santoso", actor: "Sistem Assessment", timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), candidateId: "c1" },
  { id: "a2", type: "data_updated", description: "Profil karyawan Siti Rahayu diperbarui", actor: "Admin SDM", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), candidateId: "c2" },
  { id: "a3", type: "sync_event", description: "Sinkronisasi HRIS berhasil — 247 data diperbarui", actor: "Sistem HRIS", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "a4", type: "alert_triggered", description: "Data foto profil belum tersedia untuk 20 kandidat", actor: "Sistem", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
  { id: "a5", type: "idp_action", description: "Rencana pengembangan Ahmad Fauzi telah disetujui", actor: "Manajer Langsung", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), candidateId: "c3" },
  { id: "a6", type: "assessment_completed", description: "Technical assessment selesai untuk Intan Permata", actor: "Sistem Assessment", timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), candidateId: "c10" },
  { id: "a7", type: "data_updated", description: "Skor kepemimpinan Hendra Wijaya diperbarui", actor: "Admin SDM", timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), candidateId: "c7" },
  { id: "a8", type: "alert_triggered", description: "Performance score belum tersedia untuk Rizky Pratama", actor: "Sistem", timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), candidateId: "c5" },
  { id: "a9", type: "sync_event", description: "Assessment Engine gagal sinkronisasi — timeout", actor: "Sistem", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
  { id: "a10", type: "idp_action", description: "Target pengembangan Q3 ditetapkan untuk Eko Prasetyo", actor: "HR Business Partner", timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), candidateId: "c13" },
  { id: "a11", type: "assessment_completed", description: "Penilaian potensi selesai untuk Sri Mulyani", actor: "Konsultan Eksternal", timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), candidateId: "c20" },
  { id: "a12", type: "data_updated", description: "Data succession planning diperbarui untuk posisi CFO", actor: "Admin SDM", timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString() },
  { id: "a13", type: "idp_action", description: "Modul pelatihan kepemimpinan diselesaikan oleh Agus Salim", actor: "Agus Salim", timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), candidateId: "c17" },
  { id: "a14", type: "alert_triggered", description: "3 posisi kritis tanpa kandidat suksesor teridentifikasi", actor: "Sistem", timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
  { id: "a15", type: "data_updated", description: "Informasi departemen Dewi Kusuma diperbarui", actor: "Admin SDM", timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), candidateId: "c4" },
  { id: "a16", type: "sync_event", description: "IDP Platform sinkronisasi parsial — 15 data gagal", actor: "Sistem IDP", timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString() },
  { id: "a17", type: "assessment_completed", description: "360° feedback selesai untuk Bambang Sutrisno", actor: "Tim Penilai", timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), candidateId: "c19" },
  { id: "a18", type: "idp_action", description: "Program mentoring dimulai untuk Nurul Hidayah", actor: "HR Business Partner", timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), candidateId: "c6" },
  { id: "a19", type: "alert_triggered", description: "Behavioral score belum tersedia untuk 4 kandidat succession", actor: "Sistem", timestamp: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString() },
  { id: "a20", type: "data_updated", description: "Profil talent pool diperbarui — 18 kandidat aktif", actor: "Admin SDM", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
];

export const recentlyViewed: string[] = ["c1", "c2", "c7", "c13", "c20"];
