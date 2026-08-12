import { createContext } from "react";

export type CareerPlan = { position: string; name: string; percentage: string; status: string };
export type Successor = { id?: string; name: string; position: string; percentage: string; status: string };
export type CareerHistory = { title: string; period: string };
export type EmployeeBio = { nik: string; dob: string; gender: string; lastEducation: string; city: string; province: string; maritalStatus: string; reportTo: string; workStartDate: string; tenure: string; careerHistory: CareerHistory[] };
export type TeamRef = { name: string; role: string };
export type Extension = { performance: string; engagement: string; potency: string; height: number };
export type IdpHistoryItem = { program: string; competencies: string[]; pic: string; dateRange: string; status: string };
// score null = belum ada data untuk KB ini (ditampilkan "-").
export type KeyBehaviour = { label: string; score: number | null };
export type AspectItem = { label: string; category: string; score: number; standardScore: number; dev: boolean; keyBehaviours?: KeyBehaviour[] };
export type ScoreAspects = { competency: AspectItem[]; potency: AspectItem[] };

export type ProfileContextValue = {
  name: string;
  position: string;
  /** Raw employee id ("default" when none), used as the shared photo storage key
   * (`employee-photo-<employeeId>`) so an upload from TDP or iProfile shows up in both. */
  employeeId: string;
  personality: string;
  competencyMatch: string;
  iq: string;
  gtq: string;
  careerPlans: CareerPlan[];
  successors: Successor[];
  scoreAspects: ScoreAspects;
  teams: TeamRef[];
  bloodType: string;
  extension: Extension;
  idpHistory: IdpHistoryItem[];
  employee: EmployeeBio;
};

export const DEFAULT_EMP: EmployeeBio = { nik: "2349710001", dob: "12 Februari 1988", gender: "Laki-laki", lastEducation: "S2 Psychology UNPAD", city: "Surabaya", province: "Jawa Timur", maritalStatus: "Menikah", reportTo: "Product Lead (Rodri)", workStartDate: "September 2019", tenure: "4 thn, 4 bln", careerHistory: [] };
export const DEFAULT_EXT: Extension = { performance: "4.3", engagement: "4.3", potency: "86%", height: 172 };
export const EMPTY_ASPECTS: ScoreAspects = { competency: [], potency: [] };

export const ProfileContext = createContext<ProfileContextValue>({
  name: "Julian Alvarez",
  position: "Direktur Pengembangan Bisnis",
  employeeId: "default",
  personality: "SC",
  competencyMatch: "90", // skala 0-100, sama seperti Vismap/TDP/Team Profile
  iq: "120",
  gtq: "115",
  careerPlans: [],
  successors: [],
  scoreAspects: EMPTY_ASPECTS,
  teams: [],
  bloodType: "A",
  extension: DEFAULT_EXT,
  idpHistory: [],
  employee: DEFAULT_EMP,
});
