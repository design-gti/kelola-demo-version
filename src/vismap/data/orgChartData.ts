import { generateDevelopmentData } from './developmentData';

export interface CompetencyDetail {
  name: string;
  score: number; // 1-5 scale
}

export interface DevelopmentProgram {
  type: string;
  description: string;
}

export interface IDPRecommendation {
  competency: string;
  successMeasures: string[];
  programs: DevelopmentProgram[];
}

export interface ActiveIDPProgram {
  competency: string;
  program: string;
  mentor: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: 'in progress' | 'completed';
  progress: number; // 0-100 percentage
  activities: {
    name: string;
    completed: boolean;
    completedDate?: string;
  }[];
}

export interface ActiveIDP {
  startDate: string;
  programs: ActiveIDPProgram[];
}

export interface Employee {
  id: string;
  displayId?: string; // Formatted display ID, e.g. "EMP082"
  rank?: number; // Rank by Score descending (1 = highest)
  name: string;
  position: string;
  jobTitle: string;
  competencyScore: number;
  successors: number;
  managerId?: string;
  imageUrl?: string;
  referenceId?: string; // Reference ID from CSV for employee profile link
  performanceRating?: number; // 1-5 scale for heatmap
  readinessScore?: number; // 0-100 percentage - readiness for next level position
  competencyDetails?: CompetencyDetail[];
  idpRecommendations?: IDPRecommendation[];
  activeIDP?: ActiveIDP; // Current IDP in progress
  // New fields
  criticalPosition?: boolean; // Toggle yes/no
  gender?: 'Laki-laki' | 'Perempuan' | 'Male' | 'Female'; // Support both Indonesian and English
  city?: string;
  maritalStatus?: 'Menikah' | 'Belum Menikah' | 'Married' | 'Single'; // Support both Indonesian and English
  performance?: number; // Percentage 0-100
  iq?: number; // IQ score
  department?: string; // For backward compatibility with DataEditor
  additionalSuccessors?: string[]; // Manually added successor IDs (not direct reports)
  successorIds?: string[]; // IDs of employees who are successors for this employee (from CSV)
  // Cluster Scores for Succession Risk tab
  capabilityScore?: number; // 0-100 score
  commitmentScore?: number; // 0-100 score
  contributionScore?: number; // 0-100 score
}

export const employees: Employee[] = [
  {
    id: "1",
    name: "Dian Susanti",
    position: "CEO",
    jobTitle: "Executive",
    competencyScore: 98,
    successors: 0,
    performanceRating: 3,
    readinessScore: 95,
    criticalPosition: true,
    gender: "Female",
    city: "Jakarta",
    maritalStatus: "Single",
    performance: 93,
    iq: 116,
    imageUrl: "https://lh3.googleusercontent.com/d/1shLBgT6fuyMjmChgNhEB2OzZPSB1VRoI=s220?authuser=0",
    ...generateDevelopmentData("1", 95)
  },
  {
    id: "2",
    name: "Dimas Eka",
    position: "Chief Product Officer",
    jobTitle: "Product",
    competencyScore: 96,
    successors: 0,
    performanceRating: 3,
    managerId: "1",
    readinessScore: 85,
    criticalPosition: false,
    gender: "Male",
    city: "Semarang",
    maritalStatus: "Single",
    performance: 87,
    iq: 124,
    imageUrl: "https://lh3.googleusercontent.com/d/1Bf-zMgdBC7GlhsBnhNAwC54hxXKxHtzR=s220?authuser=0",
    ...generateDevelopmentData("2", 85)
  },
  {
    id: "3",
    name: "Firmansyah",
    position: "Chief Technology Officer",
    jobTitle: "Technology",
    competencyScore: 95,
    successors: 0,
    performanceRating: 3,
    managerId: "1",
    readinessScore: 78,
    criticalPosition: false,
    gender: "Male",
    city: "Makassar",
    maritalStatus: "Married",
    performance: 86,
    iq: 107,
    imageUrl: "https://lh3.googleusercontent.com/d/1744YkyaAWXXYYVE7nv34bjLQEmnWlua3=s220?authuser=0",
    ...generateDevelopmentData("3", 78),
    activeIDP: {
      startDate: "2024-08-15",
      programs: [
        {
          competency: "Strategic Planning",
          program: "Strategic Leadership Bootcamp",
          mentor: "Dian Susanti",
          startDate: "2024-08-15",
          endDate: "2024-11-15",
          duration: "3 Months",
          status: "in progress",
          progress: 65,
          activities: [
            { name: "Strategic Thinking Workshop", completed: true, completedDate: "2024-09-01" },
            { name: "Business Case Development", completed: true, completedDate: "2024-09-20" },
            { name: "Leadership Simulation Exercise", completed: false },
            { name: "Final Strategic Plan Presentation", completed: false }
          ]
        },
        {
          competency: "Innovation & Creativity",
          program: "Innovation Lab Program",
          mentor: "Dimas Eka",
          startDate: "2024-09-01",
          endDate: "2024-12-01",
          duration: "3 Months",
          status: "in progress",
          progress: 40,
          activities: [
            { name: "Design Thinking Workshop", completed: true, completedDate: "2024-09-15" },
            { name: "Innovation Project Kickoff", completed: true, completedDate: "2024-09-25" },
            { name: "MVP Development", completed: false },
            { name: "Pitch Presentation", completed: false }
          ]
        }
      ]
    }
  },
  {
    id: "4",
    name: "Yolanda",
    position: "Chief Marketing Officer",
    jobTitle: "Marketing",
    competencyScore: 94,
    successors: 0,
    performanceRating: 3,
    managerId: "1",
    readinessScore: 72,
    criticalPosition: false,
    gender: "Female",
    city: "Makassar",
    maritalStatus: "Married",
    performance: 91,
    iq: 115,
    imageUrl: "https://lh3.googleusercontent.com/d/1eisMahAq_ENqrVMTd1nfYWaMhSC5ES88=s220?authuser=0",
    ...generateDevelopmentData("4", 72)
  },
  {
    id: "5",
    name: "Chelsea",
    position: "Chief People Officer",
    jobTitle: "People",
    competencyScore: 93,
    successors: 0,
    performanceRating: 3,
    managerId: "1",
    readinessScore: 90,
    criticalPosition: true,
    gender: "Female",
    city: "Yogyakarta",
    maritalStatus: "Single",
    performance: 91,
    iq: 122,
    imageUrl: "https://lh3.googleusercontent.com/d/1Htivkd6fJfbZGWWDlpDOdJhKpT4zyD2E=s220?authuser=0",
    ...generateDevelopmentData("5", 90)
  },
  {
    id: "6",
    name: "Novaria",
    position: "Product Manager Lead",
    jobTitle: "Product",
    competencyScore: 93,
    successors: 0,
    performanceRating: 3,
    managerId: "2",
    readinessScore: 82,
    criticalPosition: true,
    gender: "Female",
    city: "Jakarta",
    maritalStatus: "Married",
    performance: 91,
    iq: 123,
    imageUrl: "https://lh3.googleusercontent.com/d/10ydJhwyLfhOSB3kpMeZdMLuQfKRWoMtQ=s220?authuser=0",
    capabilityScore: 87,
    commitmentScore: 75,
    contributionScore: 91,
    ...generateDevelopmentData("6", 82)
  },
  {
    id: "7",
    name: "Angela",
    position: "Product Designer Lead",
    jobTitle: "Product",
    competencyScore: 94,
    successors: 0,
    performanceRating: 3,
    managerId: "2",
    readinessScore: 88,
    criticalPosition: false,
    gender: "Female",
    city: "Solo",
    maritalStatus: "Married",
    performance: 84,
    iq: 117,
    imageUrl: "https://lh3.googleusercontent.com/d/1Ezd0yEMRw-50VgkvZp77775AxhWR_Ig0=s220?authuser=0",
    capabilityScore: 92,
    commitmentScore: 88,
    contributionScore: 85,
    ...generateDevelopmentData("7", 88)
  },
  {
    id: "8",
    name: "Kristo",
    position: "Research Lead",
    jobTitle: "Product",
    competencyScore: 85,
    successors: 0,
    performanceRating: 3,
    managerId: "2",
    readinessScore: 68,
    criticalPosition: true,
    gender: "Male",
    city: "Denpasar",
    maritalStatus: "Married",
    performance: 77,
    iq: 117,
    imageUrl: "https://lh3.googleusercontent.com/d/1DsFWfH-kBhKFFEYfj7qxooExD7pRvDSk=s220?authuser=0",
    capabilityScore: 72,
    commitmentScore: 65,
    contributionScore: 68,
    ...generateDevelopmentData("8", 68),
    activeIDP: {
      startDate: "2024-09-01",
      programs: [
        {
          competency: "Data Analysis",
          program: "Advanced Analytics Certification",
          mentor: "Novaria",
          startDate: "2024-09-01",
          endDate: "2024-12-01",
          duration: "3 Months",
          status: "in progress",
          progress: 55,
          activities: [
            { name: "Python for Data Science", completed: true, completedDate: "2024-09-20" },
            { name: "Statistical Analysis Methods", completed: true, completedDate: "2024-10-05" },
            { name: "Machine Learning Basics", completed: false },
            { name: "Capstone Project", completed: false }
          ]
        }
      ]
    }
  },
  {
    id: "9",
    name: "Shani",
    position: "Frontend Lead",
    jobTitle: "Technology",
    competencyScore: 97,
    successors: 0,
    performanceRating: 3,
    managerId: "3",
    readinessScore: 75,
    criticalPosition: false,
    gender: "Female",
    city: "Semarang",
    maritalStatus: "Single",
    performance: 91,
    iq: 110,
    imageUrl: "https://lh3.googleusercontent.com/d/1r_x3Cc_rcv09X3hy_cB3ph7OsHlwEnNk=s220?authuser=0",
    capabilityScore: 80,
    commitmentScore: 73,
    contributionScore: 77,
    ...generateDevelopmentData("9", 75),
    activeIDP: {
      startDate: "2024-10-01",
      programs: [
        {
          competency: "Leadership",
          program: "Tech Leadership Program",
          mentor: "Firmansyah",
          startDate: "2024-10-01",
          endDate: "2025-01-01",
          duration: "3 Months",
          status: "in progress",
          progress: 30,
          activities: [
            { name: "Leadership Assessment", completed: true, completedDate: "2024-10-10" },
            { name: "Team Management Workshop", completed: false },
            { name: "Conflict Resolution Training", completed: false },
            { name: "Leadership Project", completed: false }
          ]
        },
        {
          competency: "Communication",
          program: "Executive Communication Skills",
          mentor: "Chelsea",
          startDate: "2024-10-15",
          endDate: "2025-01-15",
          duration: "3 Months",
          status: "in progress",
          progress: 20,
          activities: [
            { name: "Public Speaking Basics", completed: true, completedDate: "2024-10-20" },
            { name: "Presentation Skills Workshop", completed: false },
            { name: "Stakeholder Communication", completed: false },
            { name: "Final Presentation", completed: false }
          ]
        }
      ]
    }
  },
  {
    id: "10",
    name: "Liliana",
    position: "Backend Lead",
    jobTitle: "Technology",
    competencyScore: 78,
    successors: 0,
    performanceRating: 3,
    managerId: "3",
    readinessScore: 82,
    criticalPosition: false,
    gender: "Female",
    city: "Palembang",
    maritalStatus: "Married",
    performance: 71,
    iq: 127,
    imageUrl: "https://lh3.googleusercontent.com/d/1ILeq-NJkegRGFff1taaOhLy6xoCGHfPi=s220?authuser=0",
    capabilityScore: 85,
    commitmentScore: 79,
    contributionScore: 84,
    ...generateDevelopmentData("10", 82)
  },
  {
    id: "11",
    name: "Aurora",
    position: "QA Lead",
    jobTitle: "Technology",
    competencyScore: 74,
    successors: 0,
    performanceRating: 3,
    managerId: "3",
    readinessScore: 79,
    criticalPosition: false,
    gender: "Female",
    city: "Yogyakarta",
    maritalStatus: "Married",
    performance: 66,
    iq: 125,
    imageUrl: "https://lh3.googleusercontent.com/d/1oR9W_HjcbT8mqR7gtBs68n7gjrcRfCND=s220?authuser=0",
    capabilityScore: 76,
    commitmentScore: 81,
    contributionScore: 78,
    ...generateDevelopmentData("11", 79)
  },
  {
    id: "12",
    name: "Vicky",
    position: "Sales Lead",
    jobTitle: "Marketing",
    competencyScore: 72,
    successors: 0,
    performanceRating: 3,
    managerId: "4",
    readinessScore: 68,
    criticalPosition: false,
    gender: "Male",
    city: "Palembang",
    maritalStatus: "Married",
    performance: 65,
    iq: 129,
    imageUrl: "https://lh3.googleusercontent.com/d/1bgcXLJ7H4yca_IsKpD7428NtTsbDj7NZ=s220?authuser=0",
    capabilityScore: 70,
    commitmentScore: 68,
    contributionScore: 71,
    ...generateDevelopmentData("12", 68),
    activeIDP: {
      startDate: "2024-07-01",
      programs: [
        {
          competency: "Communication",
          program: "Sales Communication Mastery",
          mentor: "Yolanda",
          startDate: "2024-07-01",
          endDate: "2024-10-01",
          duration: "3 Months",
          status: "in progress",
          progress: 75,
          activities: [
            { name: "Communication Fundamentals", completed: true, completedDate: "2024-07-15" },
            { name: "Persuasive Techniques Workshop", completed: true, completedDate: "2024-08-05" },
            { name: "Client Presentation Skills", completed: true, completedDate: "2024-09-10" },
            { name: "Final Role-Play Assessment", completed: false }
          ]
        },
        {
          competency: "Negotiation",
          program: "Advanced Negotiation Training",
          mentor: "Yolanda",
          startDate: "2024-08-01",
          endDate: "2024-11-01",
          duration: "3 Months",
          status: "in progress",
          progress: 50,
          activities: [
            { name: "Negotiation Principles", completed: true, completedDate: "2024-08-15" },
            { name: "Win-Win Strategy Development", completed: true, completedDate: "2024-09-05" },
            { name: "Complex Deal Simulation", completed: false },
            { name: "Negotiation Case Study", completed: false }
          ]
        }
      ]
    }
  },
  {
    id: "13",
    name: "Renaldi",
    position: "Digital Marketing Lead",
    jobTitle: "Marketing",
    competencyScore: 82,
    successors: 0,
    performanceRating: 3,
    managerId: "4",
    readinessScore: 58,
    criticalPosition: false,
    gender: "Male",
    city: "Malang",
    maritalStatus: "Single",
    performance: 79,
    iq: 106,
    imageUrl: "https://lh3.googleusercontent.com/d/1zaeMXeJjzmRb6ei5fIAB5hp8FPrnk2GO=s220?authuser=0",
    capabilityScore: 62,
    commitmentScore: 55,
    contributionScore: 60,
    ...generateDevelopmentData("13", 58)
  },
  {
    id: "14",
    name: "Shifa",
    position: "Partnership Lead",
    jobTitle: "Marketing",
    competencyScore: 75,
    successors: 0,
    performanceRating: 3,
    managerId: "4",
    readinessScore: 48,
    criticalPosition: false,
    gender: "Female",
    city: "Bogor",
    maritalStatus: "Single",
    performance: 68,
    iq: 128,
    imageUrl: "https://lh3.googleusercontent.com/d/1T1IxGrzF4C3aqi-4dI7Z9Kc81PI4kES4=s220?authuser=0",
    ...generateDevelopmentData("14", 48)
  },
  {
    id: "15",
    name: "Diana",
    position: "HR Operations Lead",
    jobTitle: "People",
    competencyScore: 96,
    successors: 0,
    performanceRating: 3,
    managerId: "5",
    readinessScore: 80,
    criticalPosition: true,
    gender: "Female",
    city: "Depok",
    maritalStatus: "Single",
    performance: 94,
    iq: 114,
    imageUrl: "https://lh3.googleusercontent.com/d/1xC4uBqlr97hGcX2ykbhsLSofeaz1CMj5=s220?authuser=0",
    capabilityScore: 84,
    commitmentScore: 78,
    contributionScore: 82,
    ...generateDevelopmentData("15", 80)
  },
  {
    id: "16",
    name: "Nolan",
    position: "Recruitment Lead",
    jobTitle: "People",
    competencyScore: 84,
    successors: 0,
    performanceRating: 3,
    managerId: "5",
    readinessScore: 80,
    criticalPosition: false,
    gender: "Male",
    city: "Tangerang",
    maritalStatus: "Married",
    performance: 82,
    iq: 115,
    imageUrl: "https://lh3.googleusercontent.com/d/1BlnBI-opyp7dMqgKE8PWm05i8SN0tV94=s220?authuser=0",
    capabilityScore: 83,
    commitmentScore: 77,
    contributionScore: 81,
    ...generateDevelopmentData("16", 80)
  },
  {
    id: "17",
    name: "Adi",
    position: "People Development Lead",
    jobTitle: "People",
    competencyScore: 86,
    successors: 0,
    performanceRating: 3,
    managerId: "5",
    readinessScore: 72,
    criticalPosition: false,
    gender: "Male",
    city: "Jakarta",
    maritalStatus: "Married",
    performance: 84,
    iq: 115,
    imageUrl: "https://lh3.googleusercontent.com/d/1yao4VDNnVfJnHNtoTgkZ_l6YA7foSTBC=s220?authuser=0",
    ...generateDevelopmentData("17", 72)
  },
  {
    id: "18",
    name: "Reza",
    position: "Product Manager",
    jobTitle: "Product",
    competencyScore: 72,
    successors: 0,
    performanceRating: 3,
    managerId: "7",
    readinessScore: 78,
    criticalPosition: false,
    gender: "Male",
    city: "Depok",
    maritalStatus: "Married",
    performance: 64,
    iq: 117,
    imageUrl: "https://lh3.googleusercontent.com/d/1psr8E8xL8yRP3TaH8gXB880tlnHfcWy0=s220?authuser=0",
    ...generateDevelopmentData("18", 78)
  },
  {
    id: "19",
    name: "Siti",
    position: "Product Manager",
    jobTitle: "Product",
    competencyScore: 68,
    successors: 0,
    performanceRating: 3,
    managerId: "6",
    readinessScore: 65,
    criticalPosition: false,
    gender: "Female",
    city: "Semarang",
    maritalStatus: "Single",
    performance: 62,
    iq: 124,
    imageUrl: "https://lh3.googleusercontent.com/d/1fRWwT75Ytd3grLO9FVKw4hbcOhZy4qHF=s220?authuser=0",
    ...generateDevelopmentData("19", 65)
  },
  {
    id: "20",
    name: "Clarissa",
    position: "Product Manager",
    jobTitle: "Product",
    competencyScore: 74,
    successors: 0,
    performanceRating: 3,
    managerId: "8",
    readinessScore: 80,
    criticalPosition: false,
    gender: "Female",
    city: "Palembang",
    maritalStatus: "Married",
    performance: 64,
    iq: 117,
    imageUrl: "https://lh3.googleusercontent.com/d/1YHcLLrl8NumXG1Go5N_FdR63RAhHEGOd=s220?authuser=0",
    ...generateDevelopmentData("20", 80)
  },
  {
    id: "21",
    name: "Doni",
    position: "Product Designer",
    jobTitle: "Product",
    competencyScore: 73,
    successors: 0,
    performanceRating: 3,
    managerId: "7",
    readinessScore: 62,
    criticalPosition: false,
    gender: "Male",
    city: "Semarang",
    maritalStatus: "Married",
    performance: 64,
    iq: 109,
    imageUrl: "https://lh3.googleusercontent.com/d/1ZEQx3IRFLsNNVw_mrv7t8KQDWv4Bmm8C=s220?authuser=0",
    ...generateDevelopmentData("21", 62)
  },
  {
    id: "22",
    name: "Putri",
    position: "Product Designer",
    jobTitle: "Product",
    competencyScore: 75,
    successors: 0,
    performanceRating: 3,
    managerId: "8",
    readinessScore: 55,
    criticalPosition: false,
    gender: "Female",
    city: "Makassar",
    maritalStatus: "Married",
    performance: 72,
    iq: 117,
    imageUrl: "https://lh3.googleusercontent.com/d/1oV2LbBwlsiCiOTq9ZhtEyg9YfsRO5c81=s220?authuser=0",
    ...generateDevelopmentData("22", 55)
  },
  {
    id: "23",
    name: "Haikal",
    position: "Product Designer",
    jobTitle: "Product",
    competencyScore: 84,
    successors: 0,
    performanceRating: 3,
    managerId: "8",
    readinessScore: 81,
    criticalPosition: false,
    gender: "Male",
    city: "Bandung",
    maritalStatus: "Married",
    performance: 69,
    iq: 119,
    imageUrl: "https://lh3.googleusercontent.com/d/1NZDVNWmITcoUIzRrGI5yRIMbFjJC17VP=s220?authuser=0",
    ...generateDevelopmentData("23", 81)
  },
  {
    id: "24",
    name: "Xavier",
    position: "UX Researcher",
    jobTitle: "Product",
    competencyScore: 75,
    successors: 0,
    performanceRating: 3,
    managerId: "7",
    readinessScore: 60,
    criticalPosition: false,
    gender: "Male",
    city: "Palembang",
    maritalStatus: "Single",
    performance: 71,
    iq: 130,
    imageUrl: "https://lh3.googleusercontent.com/d/1zx963cC9vLJJf3vZpTutplgQA0WLLbmF=s220?authuser=0",
    ...generateDevelopmentData("24", 60)
  },
  {
    id: "25",
    name: "Nana",
    position: "Frontend Developer",
    jobTitle: "Technology",
    competencyScore: 66,
    successors: 0,
    performanceRating: 3,
    managerId: "10",
    readinessScore: 72,
    criticalPosition: false,
    gender: "Female",
    city: "Makassar",
    maritalStatus: "Married",
    performance: 60,
    iq: 123,
    imageUrl: "https://lh3.googleusercontent.com/d/1qAEhKcAKD8_uIZWIxxSWnBw_MUc4h2mi=s220?authuser=0",
    ...generateDevelopmentData("25", 72)
  },
  {
    id: "26",
    name: "Jesslyn",
    position: "Frontend Developer",
    jobTitle: "Technology",
    competencyScore: 67,
    successors: 0,
    performanceRating: 3,
    managerId: "11",
    readinessScore: 48,
    criticalPosition: false,
    gender: "Female",
    city: "Tangerang",
    maritalStatus: "Married",
    performance: 59,
    iq: 121,
    imageUrl: "https://lh3.googleusercontent.com/d/1PVnxoVzaxny_536regJE_Q95PsDfg6lO=s220?authuser=0",
    ...generateDevelopmentData("26", 48)
  },
  {
    id: "27",
    name: "Harjaya Widiastuti",
    position: "Frontend Developer",
    jobTitle: "Technology",
    competencyScore: 71,
    successors: 0,
    performanceRating: 3,
    managerId: "10",
    readinessScore: 76,
    criticalPosition: false,
    gender: "Female",
    city: "Solo",
    maritalStatus: "Single",
    performance: 61,
    iq: 110,
    imageUrl: "https://lh3.googleusercontent.com/d/1S4Yc16UKeZb4p08VpabC39R64Wn8Chf7=s220?authuser=0",
    ...generateDevelopmentData("27", 76)
  },
  {
    id: "28",
    name: "Devi Uwais",
    position: "Backend Developer",
    jobTitle: "Technology",
    competencyScore: 68,
    successors: 0,
    performanceRating: 3,
    managerId: "9",
    readinessScore: 55,
    criticalPosition: false,
    gender: "Female",
    city: "Jakarta",
    maritalStatus: "Single",
    performance: 66,
    iq: 114,
    imageUrl: "https://lh3.googleusercontent.com/d/1ECvqJfD5AiY6CM_6E8TMQWlYx9F1dZTy=s220?authuser=0",
    ...generateDevelopmentData("28", 55)
  },
  {
    id: "29",
    name: "Warta Setiawan",
    position: "Backend Developer",
    jobTitle: "Technology",
    competencyScore: 86,
    successors: 0,
    performanceRating: 3,
    managerId: "9",
    readinessScore: 82,
    criticalPosition: false,
    gender: "Male",
    city: "Denpasar",
    maritalStatus: "Single",
    performance: 61,
    iq: 124,
    imageUrl: "https://lh3.googleusercontent.com/d/16ywfKFvNOi3w-lrgjHfxLUwqVD92fqHK=s220?authuser=0",
    ...generateDevelopmentData("29", 82)
  },
  {
    id: "30",
    name: "Opan Sitorus",
    position: "Backend Developer",
    jobTitle: "Technology",
    competencyScore: 70,
    successors: 0,
    performanceRating: 3,
    managerId: "9",
    readinessScore: 76,
    criticalPosition: false,
    gender: "Male",
    city: "Denpasar",
    maritalStatus: "Single",
    performance: 65,
    iq: 126,
    imageUrl: "https://lh3.googleusercontent.com/d/1K74wPFYey2Vdt4N9Z8Dcl6Kwjx0OqQS-=s220?authuser=0",
    ...generateDevelopmentData("30", 76)
  },
  {
    id: "31",
    name: "Tgk. Bakijan Irawan, M.Kom.",
    position: "QA Engineer",
    jobTitle: "Technology",
    competencyScore: 65,
    successors: 0,
    performanceRating: 3,
    managerId: "9",
    readinessScore: 58,
    criticalPosition: false,
    gender: "Male",
    city: "Makassar",
    maritalStatus: "Married",
    performance: 62,
    iq: 111,
    imageUrl: "https://lh3.googleusercontent.com/d/1WywQWvcqTmknhE8ssO4o6Kr25H1kvOwB=s220?authuser=0",
    ...generateDevelopmentData("31", 58)
  },
  {
    id: "32",
    name: "R. Shania Hastuti, M.Pd",
    position: "QA Engineer",
    jobTitle: "Technology",
    competencyScore: 64,
    successors: 0,
    performanceRating: 3,
    managerId: "11",
    readinessScore: 62,
    criticalPosition: false,
    gender: "Female",
    city: "Jakarta",
    maritalStatus: "Single",
    performance: 56,
    iq: 112,
    imageUrl: "https://lh3.googleusercontent.com/d/1h48ZXT1C7gFOpXat9_nUEm1YgC_Jm1DT=s220?authuser=0",
    ...generateDevelopmentData("32", 62)
  },
  {
    id: "33",
    name: "Karman Narpati, M.Pd",
    position: "Sales Executive",
    jobTitle: "Marketing",
    competencyScore: 75,
    successors: 0,
    performanceRating: 3,
    managerId: "12",
    readinessScore: 81,
    criticalPosition: false,
    gender: "Laki-laki",
    city: "Makassar",
    maritalStatus: "Menikah",
    performance: 69,
    iq: 121,
    imageUrl: "https://lh3.googleusercontent.com/d/14ro1jN0DBGS_C36zVdleRdlM7rbYqldg=s220?authuser=0",
    ...generateDevelopmentData("33", 81)
  },
  {
    id: "34",
    name: "Gilda Lailasari",
    position: "Sales Executive",
    jobTitle: "Marketing",
    competencyScore: 74,
    successors: 0,
    performanceRating: 3,
    managerId: "13",
    readinessScore: 78,
    criticalPosition: false,
    gender: "Perempuan",
    city: "Surabaya",
    maritalStatus: "Belum Menikah",
    performance: 67,
    iq: 128,
    imageUrl: "https://lh3.googleusercontent.com/d/158Qhp4AJBVAngxUF0UAbxAJH0vL-nwSc=s220?authuser=0",
    ...generateDevelopmentData("34", 78)
  },
  {
    id: "35",
    name: "Dr. Edward Mustofa, S.Psi",
    position: "Sales Executive",
    jobTitle: "Marketing",
    competencyScore: 73,
    successors: 0,
    performanceRating: 3,
    managerId: "14",
    readinessScore: 62,
    criticalPosition: false,
    gender: "Laki-laki",
    city: "Bandung",
    maritalStatus: "Belum Menikah",
    performance: 64,
    iq: 130,
    imageUrl: "https://lh3.googleusercontent.com/d/1Dbrnt6dKIDcJUnO3x026SOLfdN2dAgrG=s220?authuser=0",
    ...generateDevelopmentData("35", 62)
  },
  {
    id: "36",
    name: "Ami Dongoran",
    position: "Sales Executive",
    jobTitle: "Marketing",
    competencyScore: 69,
    successors: 0,
    performanceRating: 3,
    managerId: "12",
    readinessScore: 58,
    criticalPosition: false,
    gender: "Perempuan",
    city: "Bekasi",
    maritalStatus: "Belum Menikah",
    performance: 66,
    iq: 122,
    imageUrl: "https://lh3.googleusercontent.com/d/1_xb3d3Ndrvk0OZXXtt3JRiAECdbYu3-A=s220?authuser=0",
    ...generateDevelopmentData("36", 58)
  },
  {
    id: "37",
    name: "Aurora Kuswoyo",
    position: "Sales Executive",
    jobTitle: "Marketing",
    competencyScore: 97,
    successors: 0,
    performanceRating: 3,
    managerId: "14",
    readinessScore: 85,
    criticalPosition: false,
    gender: "Perempuan",
    city: "Tangerang",
    maritalStatus: "Belum Menikah",
    performance: 89,
    iq: 120,
    imageUrl: "https://lh3.googleusercontent.com/d/14RLet1K7hzEDZJMfoSDJqINtqAJCzst_=s220?authuser=0",
    ...generateDevelopmentData("37", 85)
  },
  {
    id: "38",
    name: "Hilda Mulyani, S.Farm",
    position: "Sales Executive",
    jobTitle: "Marketing",
    competencyScore: 67,
    successors: 0,
    performanceRating: 3,
    managerId: "13",
    readinessScore: 72,
    criticalPosition: false,
    gender: "Perempuan",
    city: "Solo",
    maritalStatus: "Menikah",
    performance: 57,
    iq: 129,
    imageUrl: "https://lh3.googleusercontent.com/d/1YAp4IO5EhHUBqBflU63fLVA5bRguprfv=s220?authuser=0",
    ...generateDevelopmentData("38", 72)
  },
  {
    id: "39",
    name: "Galen Augustino",
    position: "Digital Marketing Specialist",
    jobTitle: "Marketing",
    competencyScore: 79,
    successors: 0,
    performanceRating: 3,
    managerId: "12",
    readinessScore: 76,
    criticalPosition: false,
    gender: "Laki-laki",
    city: "Palembang",
    maritalStatus: "Menikah",
    performance: 63,
    iq: 127,
    imageUrl: "https://lh3.googleusercontent.com/d/1FqccdVek2R3IzWTP5q3u2w6RBvD8kwj1=s220?authuser=0",
    ...generateDevelopmentData("39", 76)
  },
  {
    id: "40",
    name: "Irno Wijayanto",
    position: "Digital Marketing Specialist",
    jobTitle: "Marketing",
    competencyScore: 96,
    successors: 0,
    performanceRating: 3,
    managerId: "12",
    readinessScore: 88,
    criticalPosition: false,
    gender: "Laki-laki",
    city: "Bekasi",
    maritalStatus: "Menikah",
    performance: 90,
    iq: 117,
    imageUrl: "https://lh3.googleusercontent.com/d/1C4tQliITLKmtYprHfhDMKxYOBx8D-5ZM=s220?authuser=0",
    ...generateDevelopmentData("40", 88)
  },
  {
    id: "41",
    name: "Tgk. Widya Prakasa",
    position: "Digital Marketing Specialist",
    jobTitle: "Marketing",
    competencyScore: 98,
    successors: 0,
    performanceRating: 3,
    managerId: "12",
    readinessScore: 75,
    criticalPosition: false,
    gender: "Laki-laki",
    city: "Bandung",
    maritalStatus: "Belum Menikah",
    performance: 95,
    iq: 114,
    imageUrl: "https://lh3.googleusercontent.com/d/10jtpd9LphB6-kiHvO90dm385rtOU0SmE=s220?authuser=0",
    ...generateDevelopmentData("41", 75)
  },
  {
    id: "42",
    name: "Julio Fujianto",
    position: "Digital Marketing Specialist",
    jobTitle: "Marketing",
    competencyScore: 75,
    successors: 0,
    performanceRating: 3,
    managerId: "14",
    readinessScore: 52,
    criticalPosition: false,
    gender: "Laki-laki",
    city: "Solo",
    maritalStatus: "Belum Menikah",
    performance: 71,
    iq: 106,
    imageUrl: "https://lh3.googleusercontent.com/d/12Yaynw_UFkEgxj9YyNSBMxRpJmV4NHt3=s220?authuser=0",
    ...generateDevelopmentData("42", 52)
  },
  {
    id: "43",
    name: "Leo Megantara",
    position: "Partnership Executive",
    jobTitle: "Marketing",
    competencyScore: 87,
    successors: 0,
    performanceRating: 3,
    managerId: "13",
    readinessScore: 92,
    criticalPosition: false,
    gender: "Laki-laki",
    city: "Surabaya",
    maritalStatus: "Menikah",
    performance: 77,
    iq: 115,
    imageUrl: "https://lh3.googleusercontent.com/d/1oBy-7tTpjkMYNG6PNvEmzvkoLifcJZph=s220?authuser=0",
    ...generateDevelopmentData("43", 92)
  },
  {
    id: "44",
    name: "Wirda Hidayanto",
    position: "Partnership Executive",
    jobTitle: "Marketing",
    competencyScore: 71,
    successors: 0,
    performanceRating: 3,
    managerId: "12",
    readinessScore: 60,
    criticalPosition: false,
    gender: "Perempuan",
    city: "Tangerang",
    maritalStatus: "Menikah",
    performance: 63,
    iq: 113,
    imageUrl: "https://lh3.googleusercontent.com/d/1kndQech18xMopER1TXGtrbhW62P5BUlG=s220?authuser=0",
    ...generateDevelopmentData("44", 60)
  },
  {
    id: "45",
    name: "Imam Ramadan",
    position: "HR Staff",
    jobTitle: "People",
    competencyScore: 88,
    successors: 0,
    performanceRating: 3,
    managerId: "15",
    readinessScore: 70,
    criticalPosition: false,
    gender: "Laki-laki",
    city: "Surabaya",
    maritalStatus: "Menikah",
    performance: 81,
    iq: 125,
    imageUrl: "https://lh3.googleusercontent.com/d/1zaEXzB61IVbJXGaBNsaqMlNKRfZd7i-6=s220?authuser=0",
    ...generateDevelopmentData("45", 70),
    activeIDP: {
      startDate: "2024-09-15",
      programs: [
        {
          competency: "Talent Management",
          program: "HR Business Partner Certification",
          mentor: "Sarah Kusuma",
          startDate: "2024-09-15",
          endDate: "2024-12-15",
          duration: "3 Months",
          status: "in progress",
          progress: 55,
          activities: [
            { name: "Talent Acquisition Workshop", completed: true, completedDate: "2024-10-01" },
            { name: "Performance Management Training", completed: true, completedDate: "2024-10-15" },
            { name: "Employee Relations Case Study", completed: false },
            { name: "HRBP Certification Exam", completed: false }
          ]
        },
        {
          competency: "Employee Engagement",
          program: "Culture & Engagement Specialist Course",
          mentor: "Rina Wijaya",
          startDate: "2024-09-15",
          endDate: "2024-12-15",
          duration: "3 Months",
          status: "in progress",
          progress: 48,
          activities: [
            { name: "Employee Survey Design", completed: true, completedDate: "2024-10-05" },
            { name: "Engagement Strategy Workshop", completed: false },
            { name: "Culture Assessment Project", completed: false },
            { name: "Engagement Metrics Presentation", completed: false }
          ]
        }
      ]
    }
  },
  {
    id: "46",
    name: "drg. Ajimin Lazuardi",
    position: "HR Staff",
    jobTitle: "People",
    competencyScore: 85,
    successors: 0,
    performanceRating: 3,
    managerId: "17",
    readinessScore: 82,
    criticalPosition: false,
    gender: "Laki-laki",
    city: "Bekasi",
    maritalStatus: "Belum Menikah",
    performance: 65,
    iq: 114,
    imageUrl: "https://lh3.googleusercontent.com/d/1fHCRbWDznr28tj2NrC-4TsUxOdTTIC1V=s220?authuser=0",
    ...generateDevelopmentData("46", 82)
  },
  {
    id: "47",
    name: "R. Balapati Hutapea, S.I.Kom",
    position: "HR Staff",
    jobTitle: "People",
    competencyScore: 93,
    successors: 0,
    performanceRating: 3,
    managerId: "16",
    readinessScore: 90,
    criticalPosition: false,
    gender: "Laki-laki",
    city: "Bogor",
    maritalStatus: "Belum Menikah",
    performance: 63,
    iq: 112,
    imageUrl: "https://lh3.googleusercontent.com/d/1Z9Z9Nma1OnRJROrgpzubdaW2hLsVLp7d=s220?authuser=0",
    ...generateDevelopmentData("47", 90)
  },
  {
    id: "48",
    name: "Tira Winarno, S.Ked",
    position: "Recruiter",
    jobTitle: "People",
    competencyScore: 82,
    successors: 0,
    performanceRating: 3,
    managerId: "17",
    readinessScore: 80,
    criticalPosition: false,
    gender: "Perempuan",
    city: "Depok",
    maritalStatus: "Belum Menikah",
    performance: 64,
    iq: 114,
    imageUrl: "https://lh3.googleusercontent.com/d/14vuMSAmFVAmiOP5piYze-xu39KZnRbW6=s220?authuser=0",
    ...generateDevelopmentData("48", 80)
  },
  {
    id: "49",
    name: "Adika Sitompul",
    position: "Recruiter",
    jobTitle: "People",
    competencyScore: 63,
    successors: 0,
    performanceRating: 3,
    managerId: "15",
    readinessScore: 58,
    criticalPosition: false,
    gender: "Laki-laki",
    city: "Surabaya",
    maritalStatus: "Belum Menikah",
    performance: 53,
    iq: 120,
    imageUrl: "https://lh3.googleusercontent.com/d/1L55qj-ZBtytOgPxtH53p8q8UyxzyHtX8=s220?authuser=0",
    ...generateDevelopmentData("49", 58)
  },
  {
    id: "50",
    name: "Zamira Rahmawati, S.IP",
    position: "Learning Specialist",
    jobTitle: "People",
    competencyScore: 72,
    successors: 0,
    performanceRating: 3,
    managerId: "15",
    readinessScore: 58,
    criticalPosition: false,
    gender: "Perempuan",
    city: "Palembang",
    maritalStatus: "Menikah",
    performance: 68,
    iq: 109,
    imageUrl: "https://lh3.googleusercontent.com/d/14Fqg11NGOibFqveSz4949xZwpffSqMxY=s220?authuser=0",
    ...generateDevelopmentData("50", 58)
  }
];

export interface OrgChartNode extends Employee {
  reports: OrgChartNode[];
}

export function buildOrgChart(employeeList: Employee[] = employees): OrgChartNode[] {
  // Create a map of employees by ID
  const employeeMap = new Map<string, OrgChartNode>();
  
  // Initialize all employees with empty reports array
  employeeList.forEach(emp => {
    employeeMap.set(emp.id, { ...emp, reports: [] });
  });
  
  const roots: OrgChartNode[] = []; // Array of top-level executives
  
  // Build the hierarchy
  employeeList.forEach(emp => {
    const node = employeeMap.get(emp.id)!;
    
    if (!emp.managerId) {
      // This is a top-level executive (CEO/CTO/CMO/etc.)
      roots.push(node);
    } else {
      // Add this employee to their manager's reports
      const manager = employeeMap.get(emp.managerId);
      if (manager) {
        manager.reports.push(node);
      }
    }
  });
  
  return roots; // Return all top-level executives
}
