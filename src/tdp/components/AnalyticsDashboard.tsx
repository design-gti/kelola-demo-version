// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { useState, useMemo } from 'react';
import { loadEmployeeDraftEmployees } from '../data/employeeDraft';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  Award,
  Calendar,
  DollarSign,
  Shield,
  Target,
  Clock,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from './ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router';

// Performance Matrix Recommendations Data
const PERFORMANCE_MATRIX_RECOMMENDATIONS = {
  lowLow: {
    title: 'Under Performer',
    subtitle: 'Kompetency rendah, commitment rendah',
    focus: 'stabilisasi dasar dan validasi kecocokan peran',
    recommendations: [
      'lakukan performance counseling untuk mengidentifikasi akar masalah: skill gap, motivasi, role mismatch, atau issue personal/lingkungan kerja',
      'tetapkan target jangka pendek yang sangat spesifik selama 30–60 hari',
      'berikan pendampingan rutin dari atasan langsung dengan checkpoint mingguan',
      'lakukan pelatihan dasar pada area kerja inti yang paling kritikal',
      'evaluasi job fit; bila perlu pertimbangkan rotasi atau penyesuaian peran',
      'jika tidak ada perbaikan dalam periode tertentu, masuk ke performance improvement plan',
    ],
    action: 'bantu dulu, ukur cepat, lalu putuskan tegas',
  },
  lowMed: {
    title: 'Specialist',
    subtitle: 'Kompetency sedang, commitment rendah',
    focus: 'menaikkan engagement dan rasa keterikatan',
    recommendations: [
      'lakukan 1-on-1 diagnosis commitment: apakah masalahnya atasan, workload, karier, pengakuan, atau budaya kerja',
      'berikan role clarity yang lebih kuat agar orang paham kenapa pekerjaannya penting',
      'bangun individual development plan yang relevan dengan aspirasi kariernya',
      'beri quick win assignment agar muncul kembali rasa memiliki dan achievement',
      'tingkatkan recognition atas hasil kerja yang sudah baik',
      'bila ada indikasi stagnasi, pertimbangkan job enrichment atau exposure lintas fungsi',
    ],
    action: 'orangnya bisa, tapi belum tentu mau lari kencang',
  },
  lowHigh: {
    title: 'Questionable Fit',
    subtitle: 'Kompetency tinggi, commitment rendah',
    focus: 'retensi selektif atau keputusan tegas',
    recommendations: [
      'lakukan retention interview untuk memahami apakah individu masih ingin tumbuh di organisasi',
      'identifikasi apakah rendahnya commitment berasal dari manager, reward, culture, atau career blockage',
      'libatkan dalam project bermakna/strategis bila masih ingin dipertahankan',
      'diskusikan jalur karier dan ekspektasi promosi secara terbuka',
      'gunakan stay plan jika talenta ini bernilai tinggi',
      'jika tetap tidak engaged dan berdampak negatif ke tim, siapkan exit risk mitigation',
    ],
    action: 'jangan otomatis dipromosikan hanya karena jago; orang hebat yang hatinya sudah checkout bisa jadi Wi-Fi kantor: kelihatannya nyala, tapi bikin semua frustrasi.',
  },
  medLow: {
    title: 'Expert',
    subtitle: 'Kompetency rendah, commitment sedang-tinggi',
    focus: 'percepatan capability building',
    recommendations: [
      'berikan technical upskilling yang fokus pada gap paling penting',
      'tetapkan mentor atau buddy dari performer yang lebih matang',
      'gunakan on-the-job training dan simulasi kasus nyata',
      'pecah target menjadi milestone pembelajaran yang terukur',
      'pertahankan motivasi dengan feedback progres yang konkret',
      'beri tugas yang menantang tapi tetap dalam pengawasan',
    ],
    action: 'commitment sudah ada, sekarang tinggal dibantu naik level kemampuannya',
  },
  medMed: {
    title: 'Contributor',
    subtitle: 'Kompetency sedang, commitment sedang-tinggi',
    focus: 'penguatan konsistensi dan kesiapan naik box',
    recommendations: [
      'berikan stretch assignment dengan ruang belajar yang aman',
      'tingkatkan satu-dua kompetensi kunci yang paling membedakan level berikutnya',
      'libatkan dalam cross-functional project',
      'mulai berikan tanggung jawab untuk memimpin task kecil atau menjadi PIC',
      'buat development plan 3–6 bulan untuk menuju Rising Star atau Star',
      'berikan feedback yang menekankan apa yang perlu dinaikkan agar siap dipromosikan',
    ],
    action: 'ini kelompok yang paling enak dibentuk; bahan bakunya sudah bagus',
  },
  medHigh: {
    title: 'Need Coaching',
    subtitle: 'Kompetency tinggi, commitment sedang',
    focus: 'memperkuat ownership, aspiration, dan keberlanjutan performa',
    recommendations: [
      'lakukan coaching karier untuk memahami apa yang menahan energi dan drive',
      'tingkatkan sense of ownership dengan peran yang lebih strategis',
      'beri exposure ke forum keputusan, stakeholder penting, atau problem yang lebih besar',
      'pastikan atasan memberi challenge + recognition yang seimbang',
      'bila mulai jenuh, pertimbangkan pengayaan peran atau proyek transformasi',
      'monitor apakah penurunan commitment ini temporer atau struktural',
    ],
    action: 'bukan kurang mampu, tapi perlu disulut lagi mesinnya',
  },
  highLow: {
    title: 'Emerging Star',
    subtitle: 'Kompetency rendah, commitment tinggi',
    focus: 'akselerasi talenta potensial',
    recommendations: [
      'masukkan ke program development intensif',
      'berikan pelatihan inti disertai praktik langsung',
      'pasangkan dengan mentor yang kuat',
      'beri tugas bertahap dengan tingkat kesulitan meningkat',
      'evaluasi progres secara bulanan agar perkembangan terlihat',
      'beri pengakuan atas semangat dan growth, bukan hanya hasil akhir',
    ],
    action: 'semangatnya sudah mahal, jangan sampai organisasi telat membina',
  },
  highMed: {
    title: 'Rising Star',
    subtitle: 'Kompetency sedang, commitment tinggi',
    focus: 'percepatan kesiapan promosi',
    recommendations: [
      'beri stretch assignment berdampak tinggi',
      'mulai libatkan dalam leadership exposure, misalnya memimpin inisiatif kecil atau membimbing junior',
      'masukkan ke succession pipeline atau talent acceleration program',
      'lakukan coaching pada kompetensi pembeda level berikutnya, seperti strategic thinking, influencing, atau decision making',
      'beri visibility ke stakeholder yang lebih luas',
      'review kesiapan promosi tiap 3–6 bulan',
    ],
    action: 'ini biasanya kandidat favorit untuk dipoles jadi bench strength',
  },
  highHigh: {
    title: 'Star',
    subtitle: 'Kompetency tinggi, commitment tinggi',
    focus: 'retensi, percepatan, dan leverage ke organisasi',
    recommendations: [
      'siapkan succession plan dan peta karier yang jelas',
      'berikan high-impact strategic assignment',
      'pertimbangkan promosi, akselerasi, atau role enlargement',
      'libatkan sebagai mentor, coach, atau role model',
      'pastikan ada recognition, reward, dan exposure yang sepadan',
      'jaga risiko burnout dengan workload governance yang sehat',
    ],
    action: 'jangan cuma dipuji di town hall, kasih jalan tumbuh yang nyata',
  },
};

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const allEmployees = useMemo(() => loadEmployeeDraftEmployees(), []);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [xAxisMetric, setXAxisMetric] = useState<string>('performance');
  const [yAxisMetric, setYAxisMetric] = useState<string>('potential');
  const [selectedBoxRecommendation, setSelectedBoxRecommendation] = useState<keyof typeof PERFORMANCE_MATRIX_RECOMMENDATIONS | null>(null);

  const activeEmployeeIds = useMemo(() => {
    const savedState = localStorage.getItem('currentTableState');
    if (!savedState) return null;
    try {
      const parsed = JSON.parse(savedState);
      return Array.isArray(parsed.employeeIds) ? (parsed.employeeIds as string[]) : null;
    } catch {
      return null;
    }
  }, []);

  // Basis data analytics mengikuti context data aktif dari screener (jika ada)
  const baseEmployees = useMemo(() => {
    if (!activeEmployeeIds || activeEmployeeIds.length === 0) return allEmployees;
    return allEmployees.filter((e) => activeEmployeeIds.includes(e.id));
  }, [allEmployees, activeEmployeeIds]);

  // Get unique departments
  const departments = Array.from(new Set(baseEmployees.map((e) => e.department)));

  // Filter employees by department
  const filteredEmployees = useMemo(() => {
    if (selectedDepartment === 'all') return baseEmployees;
    return baseEmployees.filter((e) => e.department === selectedDepartment);
  }, [selectedDepartment, baseEmployees]);

  // Helper function to get metric value from employee
  const getMetricValue = (employee: any, metric: string): number => {
    switch (metric) {
      case 'performance':
        return employee.performanceRating;
      case 'potential':
        return employee.potentialRating;
      case 'engagement':
        return employee.engagementScore;
      case 'flight-risk':
        return employee.flightRisk === 'Low' ? 20 : employee.flightRisk === 'Medium' ? 50 : 75;
      case 'readiness':
        return employee.readinessLevel || 0;
      default:
        return 0;
    }
  };

  // Normalisasi metrik ke 0-100 agar threshold high/med/low konsisten pada data upload (skala 1-5 maupun 0-100)
  const normalizeMetricTo100 = (value: number, metric: string): number => {
    if (metric === 'performance' || metric === 'potential' || metric === 'readiness') {
      // Mayoritas data app menggunakan skala 1-5 untuk metrik ini
      if (value <= 5) return (value / 5) * 100;
      return value;
    }
    if (metric === 'engagement' || metric === 'flight-risk') {
      return value;
    }
    return value;
  };

  // Helper function to categorize metric value into High/Med/Low
  const categorizeMetric = (value: number, metric: string): 'high' | 'med' | 'low' => {
    const normalized = normalizeMetricTo100(value, metric);

    if (metric === 'flight-risk') {
      // Scale 0-100 (inverted: lower is better)
      if (normalized <= 30) return 'high'; // Low risk = High category
      if (normalized <= 60) return 'med';
      return 'low';
    } else {
      if (normalized >= 75) return 'high';
      if (normalized >= 50) return 'med';
      return 'low';
    }
  };

  // Helper function to get metric label
  const getMetricLabel = (metric: string): string => {
    switch (metric) {
      case 'performance':
        return 'Performance Rating';
      case 'potential':
        return 'Potential Rating';
      case 'engagement':
        return 'Engagement Score';
      case 'flight-risk':
        return 'Flight Risk (Inverted)';
      case 'readiness':
        return 'Readiness Level';
      default:
        return metric;
    }
  };

  // 9-Box Grid Distribution (Dynamic based on selected metrics)
  const nineBoxDistribution = useMemo(() => {
    const grid = {
      highHigh: 0,
      highMed: 0,
      highLow: 0,
      medHigh: 0,
      medMed: 0,
      medLow: 0,
      lowHigh: 0,
      lowMed: 0,
      lowLow: 0,
    };

    filteredEmployees.forEach((emp) => {
      const xValue = getMetricValue(emp, xAxisMetric);
      const yValue = getMetricValue(emp, yAxisMetric);
      
      const xCategory = categorizeMetric(xValue, xAxisMetric);
      const yCategory = categorizeMetric(yValue, yAxisMetric);
      
      const key = `${xCategory}${yCategory.charAt(0).toUpperCase()}${yCategory.slice(1)}` as keyof typeof grid;
      grid[key]++;
    });

    return grid;
  }, [filteredEmployees, xAxisMetric, yAxisMetric]);

  // Succession Planning Risk
  const successionRisk = useMemo(() => {
    const criticalRoles = filteredEmployees.filter((e) => e.criticalRole);
    const withoutSuccessor = criticalRoles.filter((e) => !e.successorIdentified);
    return {
      total: criticalRoles.length,
      atRisk: withoutSuccessor.length,
      percentage: criticalRoles.length > 0 ? Math.round((withoutSuccessor.length / criticalRoles.length) * 100) : 0,
    };
  }, [filteredEmployees]);

  // High Performers at Risk
  const highPerformersAtRisk = useMemo(() => {
    const highPerformers = filteredEmployees.filter(
      (e) => normalizeMetricTo100(e.performanceRating, 'performance') >= 80
    );
    const atRisk = highPerformers.filter((e) => e.flightRisk === 'High');
    return {
      total: highPerformers.length,
      atRisk: atRisk.length,
      percentage: highPerformers.length > 0 ? Math.round((atRisk.length / highPerformers.length) * 100) : 0,
    };
  }, [filteredEmployees]);

  // Promotion Pipeline
  const promotionPipeline = useMemo(() => {
    const readyNow = filteredEmployees.filter((e) => e.promotionReadiness === 'Ready Now').length;
    const ready1to2 = filteredEmployees.filter((e) => e.promotionReadiness === 'Ready in 1-2 years').length;
    const notReady = filteredEmployees.filter((e) => e.promotionReadiness === 'Not Ready').length;
    const total = filteredEmployees.length;

    return {
      readyNow,
      ready1to2,
      notReady,
      readyNowPct: total > 0 ? Math.round((readyNow / total) * 100) : 0,
      ready1to2Pct: total > 0 ? Math.round((ready1to2 / total) * 100) : 0,
      notReadyPct: total > 0 ? Math.round((notReady / total) * 100) : 0,
    };
  }, [filteredEmployees]);

  // Stuck in Role (>36 months)
  const stuckInRole = useMemo(() => {
    const stuck = filteredEmployees.filter((e) => e.timeInRole > 36);
    return {
      count: stuck.length,
      percentage: filteredEmployees.length > 0 ? Math.round((stuck.length / filteredEmployees.length) * 100) : 0,
    };
  }, [filteredEmployees]);

  // Department Health Scores
  const departmentHealth = useMemo(() => {
    const deptScores = departments.map((dept) => {
      const deptEmployees = baseEmployees.filter((e) => e.department === dept);
      if (deptEmployees.length === 0) {
        return {
          department: dept,
          healthScore: 0,
          avgPerf: '0.0',
          avgEng: 0,
          avgRisk: 0,
          successorCoverage: 0,
        };
      }
      const avgPerf = deptEmployees.reduce((sum, e) => sum + e.performanceRating, 0) / deptEmployees.length;
      const avgEng = deptEmployees.reduce((sum, e) => sum + e.engagementScore, 0) / deptEmployees.length;
      const avgRisk = deptEmployees.reduce((sum, e) => sum + (e.flightRisk === 'Low' ? 20 : e.flightRisk === 'Medium' ? 50 : 75), 0) / deptEmployees.length;
      const criticalRoles = deptEmployees.filter((e) => e.criticalRole);
      const successorCoverage = criticalRoles.length > 0 
        ? (criticalRoles.filter((e) => e.successorIdentified).length / criticalRoles.length) * 100 
        : 100;

      // Health Score: Performance (30%) + Engagement (30%) + Low Risk (20%) + Succession (20%)
      const healthScore = Math.round(
        (avgPerf / 5) * 30 +
        (avgEng / 100) * 30 +
        ((100 - avgRisk) / 100) * 20 +
        (successorCoverage / 100) * 20
      );

      return {
        department: dept,
        healthScore,
        avgPerf: avgPerf.toFixed(1),
        avgEng: Math.round(avgEng),
        avgRisk: Math.round(avgRisk),
        successorCoverage: Math.round(successorCoverage),
      };
    });

    return deptScores.sort((a, b) => b.healthScore - a.healthScore);
  }, [departments, baseEmployees]);

  // Certification Coverage
  const certificationCoverage = useMemo(() => {
    const withCerts = filteredEmployees.filter((e) => e.certifications.length > 0);
    return {
      certified: withCerts.length,
      percentage: filteredEmployees.length > 0 ? Math.round((withCerts.length / filteredEmployees.length) * 100) : 0,
    };
  }, [filteredEmployees]);

  // Salary insights
  const salaryInsights = useMemo(() => {
    const highPerformers = filteredEmployees.filter((e) => e.performanceRating >= 80);
    if (highPerformers.length === 0) return { avgSalary: 0, underpaidCount: 0 };

    const avgSalary = Math.round(highPerformers.reduce((sum, e) => sum + e.salary, 0) / highPerformers.length);
    const underpaid = highPerformers.filter((e) => e.salary < avgSalary * 0.9); // 10% below average

    return {
      avgSalary,
      underpaidCount: underpaid.length,
    };
  }, [filteredEmployees]);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-[#00875A]';
    if (score >= 60) return 'text-[#FF8918]';
    return 'text-[#DE350B]';
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return 'bg-[#F2F9F7] border-[#ACEECA]';
    if (score >= 60) return 'bg-[#FFF4E0] border-[#FFB063]';
    return 'bg-[#FDF5F3] border-[#F6A5A6]';
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F7F7F7' }}>
      {/* Sticky Header with Back Button */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#DEE2E6]" style={{ boxShadow: '2px 4px 20px 0px #00000012' }}>
        <div className="px-6 py-4 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="rounded-full flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" style={{ color: '#016699' }} />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="font-heading" style={{ color: '#495057' }}>Analytics Dashboard</h1>
            <p className="font-body" style={{ color: '#868E96' }}>Strategic insights and talent analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" style={{ color: '#868E96' }} />
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Critical Alerts Section */}
        <div className="mb-6">
          <h2 className="font-subheading mb-4 flex items-center gap-2" style={{ color: '#495057' }}>
            <AlertTriangle className="w-5 h-5 text-[#016699]" />
            Critical Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Succession Risk */}
            <div className="bg-white rounded-lg p-6" style={{ boxShadow: '2px 4px 20px 0px #00000012' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#FDF5F3] rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#DE350B]" />
                </div>
                <Badge className="bg-[#FDF5F3] text-[#DE350B] border border-[#F6A5A6]">Critical</Badge>
              </div>
              <div className="font-subtitle mb-2" style={{ color: '#868E96' }}>Succession Risk</div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#495057' }}>
                {successionRisk.atRisk}
                <span className="text-lg" style={{ color: '#868E96' }}>/{successionRisk.total}</span>
              </div>
              <div className="font-body text-[#DE350B] font-medium">
                {successionRisk.percentage}% critical roles without successor
              </div>
            </div>

            {/* High Performers at Risk */}
            <div className="bg-white rounded-lg p-6" style={{ boxShadow: '2px 4px 20px 0px #00000012' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#FFF4E0] rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#FF8918]" />
                </div>
                <Badge className="bg-[#FFF4E0] text-[#FF8918] border border-[#FFB063]">High</Badge>
              </div>
              <div className="font-subtitle mb-2" style={{ color: '#868E96' }}>Flight Risk - Top Talent</div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#495057' }}>
                {highPerformersAtRisk.atRisk}
                <span className="text-lg" style={{ color: '#868E96' }}>/{highPerformersAtRisk.total}</span>
              </div>
              <div className="font-body text-[#FF8918] font-medium">
                {highPerformersAtRisk.percentage}% high performers at risk
              </div>
            </div>

            {/* Stuck in Role */}
            <div className="bg-white rounded-lg p-6" style={{ boxShadow: '2px 4px 20px 0px #00000012' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#FFF4E0] rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#FF8918]" />
                </div>
                <Badge className="bg-[#FFF4E0] text-[#FF8918] border border-[#FFB063]">Medium</Badge>
              </div>
              <div className="font-subtitle mb-2" style={{ color: '#868E96' }}>Stuck in Role (&gt;36mo)</div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#495057' }}>
                {stuckInRole.count}
                <span className="text-lg" style={{ color: '#868E96' }}>/{filteredEmployees.length}</span>
              </div>
              <div className="font-body text-[#FF8918] font-medium">
                {stuckInRole.percentage}% need career development
              </div>
            </div>

            {/* Underpaid High Performers */}
            <div className="bg-white rounded-lg p-6" style={{ boxShadow: '2px 4px 20px 0px #00000012' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#E7F5FF] rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#016699]" />
                </div>
                <Badge className="bg-[#E7F5FF] text-[#016699] border border-[#A4C7FF]">Review</Badge>
              </div>
              <div className="font-subtitle mb-2" style={{ color: '#868E96' }}>Compensation Gap</div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#495057' }}>
                {salaryInsights.underpaidCount}
              </div>
              <div className="font-body text-[#016699] font-medium">
                High performers below market avg
              </div>
            </div>
          </div>
        </div>

        {/* 9-Box Grid & Promotion Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 9-Box Grid */}
          <div className="bg-white rounded-lg p-6" style={{ boxShadow: '2px 4px 20px 0px #00000012' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-title flex items-center gap-2" style={{ color: '#495057' }}>
                <Target className="w-5 h-5 text-[#016699]" />
                9-Box Talent Grid
              </h3>
              <div className="flex items-center gap-2">
                {/* Y-Axis Selector */}
                <div className="flex items-center gap-1">
                  <span className="font-body" style={{ color: '#868E96' }}>Y:</span>
                  <Select value={yAxisMetric} onValueChange={setYAxisMetric}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="potential">Potential</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="flight-risk">Flight Risk</SelectItem>
                      <SelectItem value="readiness">Readiness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* X-Axis Selector */}
                <div className="flex items-center gap-1">
                  <span className="font-body" style={{ color: '#868E96' }}>X:</span>
                  <Select value={xAxisMetric} onValueChange={setXAxisMetric}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="potential">Potential</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="flight-risk">Flight Risk</SelectItem>
                      <SelectItem value="readiness">Readiness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Grid Container */}
            <div className="flex gap-3">
              {/* Y-Axis Label */}
              <div className="flex items-center justify-center w-6">
                <div className="transform -rotate-90 whitespace-nowrap font-body font-semibold" style={{ color: '#495057' }}>
                  {getMetricLabel(yAxisMetric)} →
                </div>
              </div>

              {/* 9-Box Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {/* Row 1: High Y-Axis */}
                  <div
                    className="p-4 rounded-lg border-2 bg-[#EEF4FF] border-[#7D889A] hover:bg-[#E1E7EE] hover:shadow-lg cursor-pointer transition-all"
                    onClick={() => setSelectedBoxRecommendation('highLow')}
                  >
                    <div className="font-body mb-1" style={{ color: '#868E96' }}>High-Low</div>
                    <div className="text-2xl font-bold text-[#016699] mb-1">{nineBoxDistribution.highLow}</div>
                    <div className="font-body font-medium" style={{ color: '#7D889A' }}>{PERFORMANCE_MATRIX_RECOMMENDATIONS.highLow.title}</div>
                  </div>
                  <div
                    className="p-4 rounded-lg border-2 bg-[#E7F5FF] border-[#016699] hover:bg-[#D6E6FF] hover:shadow-lg cursor-pointer transition-all"
                    onClick={() => setSelectedBoxRecommendation('highMed')}
                  >
                    <div className="font-body mb-1" style={{ color: '#868E96' }}>High-Med</div>
                    <div className="text-2xl font-bold text-[#016699] mb-1">{nineBoxDistribution.highMed}</div>
                    <div className="font-body font-medium text-[#016699]">{PERFORMANCE_MATRIX_RECOMMENDATIONS.highMed.title}</div>
                  </div>
                  <div
                    className="p-4 rounded-lg border-2 bg-[#F2F9F7] border-[#00875A] hover:bg-[#E0EFEB] hover:shadow-lg cursor-pointer transition-all"
                    onClick={() => setSelectedBoxRecommendation('highHigh')}
                  >
                    <div className="font-body mb-1" style={{ color: '#868E96' }}>High-High</div>
                    <div className="text-2xl font-bold text-[#016699] mb-1">{nineBoxDistribution.highHigh}</div>
                    <div className="font-body font-medium text-[#00875A]">⭐ {PERFORMANCE_MATRIX_RECOMMENDATIONS.highHigh.title}</div>
                  </div>

                  {/* Row 2: Med Y-Axis */}
                  <div
                    className="p-4 rounded-lg border-2 bg-[#F8F9FA] border-[#CED4DA] hover:bg-[#E9ECEF] hover:shadow-lg cursor-pointer transition-all"
                    onClick={() => setSelectedBoxRecommendation('medLow')}
                  >
                    <div className="font-body mb-1" style={{ color: '#868E96' }}>Med-Low</div>
                    <div className="text-2xl font-bold text-[#016699] mb-1">{nineBoxDistribution.medLow}</div>
                    <div className="font-body font-medium" style={{ color: '#495057' }}>{PERFORMANCE_MATRIX_RECOMMENDATIONS.medLow.title}</div>
                  </div>
                  <div
                    className="p-4 rounded-lg border-2 bg-[#F8F9FA] border-[#DEE2E6] hover:bg-[#E9ECEF] hover:shadow-lg cursor-pointer transition-all"
                    onClick={() => setSelectedBoxRecommendation('medMed')}
                  >
                    <div className="font-body mb-1" style={{ color: '#868E96' }}>Med-Med</div>
                    <div className="text-2xl font-bold text-[#016699] mb-1">{nineBoxDistribution.medMed}</div>
                    <div className="font-body font-medium" style={{ color: '#495057' }}>{PERFORMANCE_MATRIX_RECOMMENDATIONS.medMed.title}</div>
                  </div>
                  <div
                    className="p-4 rounded-lg border-2 bg-[#E0FFFF] border-[#30E5FD] hover:bg-[#CCFBFF] hover:shadow-lg cursor-pointer transition-all"
                    onClick={() => setSelectedBoxRecommendation('medHigh')}
                  >
                    <div className="font-body mb-1" style={{ color: '#868E96' }}>Med-High</div>
                    <div className="text-2xl font-bold text-[#016699] mb-1">{nineBoxDistribution.medHigh}</div>
                    <div className="font-body font-medium" style={{ color: '#016699' }}>{PERFORMANCE_MATRIX_RECOMMENDATIONS.medHigh.title}</div>
                  </div>

                  {/* Row 3: Low Y-Axis */}
                  <div
                    className="p-4 rounded-lg border-2 bg-[#FDF5F3] border-[#F6A5A6] hover:bg-[#FADFD8] hover:shadow-lg cursor-pointer transition-all"
                    onClick={() => setSelectedBoxRecommendation('lowLow')}
                  >
                    <div className="font-body mb-1" style={{ color: '#868E96' }}>Low-Low</div>
                    <div className="text-2xl font-bold text-[#016699] mb-1">{nineBoxDistribution.lowLow}</div>
                    <div className="font-body font-medium text-[#DE350B]">{PERFORMANCE_MATRIX_RECOMMENDATIONS.lowLow.title}</div>
                  </div>
                  <div
                    className="p-4 rounded-lg border-2 bg-[#FFF2E4] border-[#FDA637] hover:bg-[#FFE3C5] hover:shadow-lg cursor-pointer transition-all"
                    onClick={() => setSelectedBoxRecommendation('lowMed')}
                  >
                    <div className="font-body mb-1" style={{ color: '#868E96' }}>Low-Med</div>
                    <div className="text-2xl font-bold text-[#016699] mb-1">{nineBoxDistribution.lowMed}</div>
                    <div className="font-body font-medium text-[#FD9F28]">{PERFORMANCE_MATRIX_RECOMMENDATIONS.lowMed.title}</div>
                  </div>
                  <div
                    className="p-4 rounded-lg border-2 bg-[#FFF4E0] border-[#FFB063] hover:bg-[#FFE6CB] hover:shadow-lg cursor-pointer transition-all"
                    onClick={() => setSelectedBoxRecommendation('lowHigh')}
                  >
                    <div className="font-body mb-1" style={{ color: '#868E96' }}>Low-High</div>
                    <div className="text-2xl font-bold text-[#016699] mb-1">{nineBoxDistribution.lowHigh}</div>
                    <div className="font-body font-medium text-[#FF8918]">{PERFORMANCE_MATRIX_RECOMMENDATIONS.lowHigh.title}</div>
                  </div>
                </div>

                {/* X-Axis Label */}
                <div className="flex items-center justify-between pt-4 border-t border-[#DEE2E6]">
                  <div className="font-body" style={{ color: '#868E96' }}>← Low {getMetricLabel(xAxisMetric)}</div>
                  <div className="font-body font-semibold" style={{ color: '#495057' }}>High {getMetricLabel(xAxisMetric)} →</div>
                </div>
              </div>
            </div>
          </div>

          {/* Promotion Pipeline */}
          <div className="bg-white rounded-lg p-6" style={{ boxShadow: '2px 4px 20px 0px #00000012' }}>
            <h3 className="font-title mb-4 flex items-center gap-2" style={{ color: '#495057' }}>
              <TrendingUp className="w-5 h-5 text-[#016699]" />
              Promotion Pipeline Health
            </h3>
            <div className="space-y-4">
              {/* Ready Now */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#00875A]" />
                    <span className="font-body font-medium" style={{ color: '#495057' }}>Ready Now</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#016699]">{promotionPipeline.readyNow}</span>
                    <span className="font-body ml-2" style={{ color: '#868E96' }}>({promotionPipeline.readyNowPct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-[#E9ECEF] rounded-full h-3">
                  <div
                    className="bg-[#00875A] h-3 rounded-full transition-all"
                    style={{ width: `${promotionPipeline.readyNowPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Ready in 1-2 years */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#016699]" />
                    <span className="font-body font-medium" style={{ color: '#495057' }}>Ready in 1-2 Years</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#016699]">{promotionPipeline.ready1to2}</span>
                    <span className="font-body ml-2" style={{ color: '#868E96' }}>({promotionPipeline.ready1to2Pct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-[#E9ECEF] rounded-full h-3">
                  <div
                    className="bg-[#016699] h-3 rounded-full transition-all"
                    style={{ width: `${promotionPipeline.ready1to2Pct}%` }}
                  ></div>
                </div>
              </div>

              {/* Not Ready */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5" style={{ color: '#868E96' }} />
                    <span className="font-body font-medium" style={{ color: '#495057' }}>Not Ready</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#016699]">{promotionPipeline.notReady}</span>
                    <span className="font-body ml-2" style={{ color: '#868E96' }}>({promotionPipeline.notReadyPct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-[#E9ECEF] rounded-full h-3">
                  <div
                    className="bg-[#ADB5BD] h-3 rounded-full transition-all"
                    style={{ width: `${promotionPipeline.notReadyPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Summary */}
              <div className="pt-4 border-t border-[#DEE2E6]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#00875A]">
                      {promotionPipeline.readyNow + promotionPipeline.ready1to2}
                    </div>
                    <div className="font-body mt-1" style={{ color: '#868E96' }}>Promotable Talent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#016699]">
                      {filteredEmployees.length > 0
                        ? Math.round(((promotionPipeline.readyNow + promotionPipeline.ready1to2) / filteredEmployees.length) * 100)
                        : 0}
                    </div>
                    <div className="font-body mt-1" style={{ color: '#868E96' }}>Pipeline Strength</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Health & Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Health Score */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6" style={{ boxShadow: '2px 4px 20px 0px #00000012' }}>
            <h3 className="font-title mb-4 flex items-center gap-2" style={{ color: '#495057' }}>
              <Award className="w-5 h-5 text-[#016699]" />
              Department Health Score
              {selectedDepartment !== 'all' && (
                <Badge className="ml-2 bg-[#016699] text-white">
                  {selectedDepartment} Only
                </Badge>
              )}
            </h3>
            <div className="space-y-3">
              {selectedDepartment === 'all' ? (
                // Show all departments ranked
                departmentHealth.map((dept, index) => (
                  <div
                    key={dept.department}
                    className={`p-4 rounded-lg border-2 transition-all ${getHealthBgColor(dept.healthScore)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {index === 0 ? (
                            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                              <span className="text-xs">🥇</span>
                            </div>
                          ) : index === 1 ? (
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs">🥈</span>
                            </div>
                          ) : index === 2 ? (
                            <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                              <span className="text-xs">🥉</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-[#E9ECEF] rounded-full flex items-center justify-center">
                              <span className="font-body" style={{ color: '#868E96' }}>#{index + 1}</span>
                            </div>
                          )}
                          <span className="font-bold" style={{ color: '#495057' }}>{dept.department}</span>
                        </div>
                      </div>
                      <div className={`text-3xl font-bold ${getHealthColor(dept.healthScore)}`}>
                        {dept.healthScore}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-xs">
                      <div>
                        <div className="font-body mb-1" style={{ color: '#868E96' }}>Performance</div>
                        <div className="font-bold text-[#016699]">{dept.avgPerf}/5</div>
                      </div>
                      <div>
                        <div className="font-body mb-1" style={{ color: '#868E96' }}>Engagement</div>
                        <div className="font-bold text-[#016699]">{dept.avgEng}%</div>
                      </div>
                      <div>
                        <div className="font-body mb-1" style={{ color: '#868E96' }}>Flight Risk</div>
                        <div className="font-bold text-[#016699]">{dept.avgRisk}%</div>
                      </div>
                      <div>
                        <div className="font-body mb-1" style={{ color: '#868E96' }}>Succession</div>
                        <div className="font-bold text-[#016699]">{dept.successorCoverage}%</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Show only selected department with its ranking
                (() => {
                  const selectedDeptData = departmentHealth.find(d => d.department === selectedDepartment);
                  const rankingIndex = departmentHealth.findIndex(d => d.department === selectedDepartment);
                  const totalDepts = departmentHealth.length;

                  if (!selectedDeptData) return null;

                  return (
                    <div className={`p-6 rounded-lg border-2 transition-all ${getHealthBgColor(selectedDeptData.healthScore)}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {rankingIndex === 0 ? (
                              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-sm">🥇</span>
                              </div>
                            ) : rankingIndex === 1 ? (
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-sm">🥈</span>
                              </div>
                            ) : rankingIndex === 2 ? (
                              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                                <span className="text-sm">🥉</span>
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-[#E9ECEF] rounded-full flex items-center justify-center">
                                <span className="font-body" style={{ color: '#868E96' }}>#{rankingIndex + 1}</span>
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-lg" style={{ color: '#495057' }}>{selectedDeptData.department}</div>
                              <div className="font-body" style={{ color: '#868E96' }}>
                                Ranked #{rankingIndex + 1} out of {totalDepts} departments
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`text-4xl font-bold ${getHealthColor(selectedDeptData.healthScore)}`}>
                          {selectedDeptData.healthScore}
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="bg-white/50 p-3 rounded-lg">
                          <div className="font-body mb-1" style={{ color: '#868E96' }}>Performance</div>
                          <div className="font-bold text-lg text-[#016699]">{selectedDeptData.avgPerf}/5</div>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg">
                          <div className="font-body mb-1" style={{ color: '#868E96' }}>Engagement</div>
                          <div className="font-bold text-lg text-[#016699]">{selectedDeptData.avgEng}%</div>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg">
                          <div className="font-body mb-1" style={{ color: '#868E96' }}>Flight Risk</div>
                          <div className="font-bold text-lg text-[#016699]">{selectedDeptData.avgRisk}%</div>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg">
                          <div className="font-body mb-1" style={{ color: '#868E96' }}>Succession</div>
                          <div className="font-bold text-lg text-[#016699]">{selectedDeptData.successorCoverage}%</div>
                        </div>
                      </div>

                      {/* Ranking comparison */}
                      <div className="mt-4 pt-4 border-t border-[#DEE2E6]">
                        <div className="font-body mb-2" style={{ color: '#868E96' }}>Position in Overall Ranking:</div>
                        <div className="flex items-center gap-2">
                          {departmentHealth.map((dept, idx) => (
                            <div
                              key={dept.department}
                              className={`flex-1 h-2 rounded-full transition-all ${
                                dept.department === selectedDepartment
                                  ? 'bg-[#016699] h-3'
                                  : 'bg-[#E9ECEF]'
                              }`}
                              title={`${dept.department}: ${dept.healthScore}`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-1 font-body" style={{ color: '#868E96' }}>
                          <span>Best</span>
                          <span>Worst</span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="space-y-4">
            {/* Certification Coverage */}
            <div className="bg-white rounded-lg p-6" style={{ boxShadow: '2px 4px 20px 0px #00000012' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#EEF4FF] rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#7D889A]" />
                </div>
              </div>
              <div className="font-body mb-2" style={{ color: '#868E96' }}>Certification Coverage</div>
              <div className="text-3xl font-bold text-[#016699] mb-2">
                {certificationCoverage.percentage}%
              </div>
              <div className="font-body mb-3" style={{ color: '#868E96' }}>
                {certificationCoverage.certified} of {filteredEmployees.length} employees
              </div>
              <div className="w-full bg-[#E9ECEF] rounded-full h-2">
                <div
                  className="bg-[#016699] h-2 rounded-full"
                  style={{ width: `${certificationCoverage.percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Avg Salary - High Performers */}
            <div className="bg-white rounded-lg p-6" style={{ boxShadow: '2px 4px 20px 0px #00000012' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#F2F9F7] rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#00875A]" />
                </div>
              </div>
              <div className="font-body mb-2" style={{ color: '#868E96' }}>Avg Salary (High Perf)</div>
              <div className="text-3xl font-bold text-[#016699] mb-2">
                ${(salaryInsights.avgSalary / 1000).toFixed(0)}K
              </div>
              <div className="font-body" style={{ color: '#868E96' }}>
                Top performers benchmark
              </div>
            </div>

            {/* Total Employees */}
            <div className="bg-white rounded-lg p-6" style={{ boxShadow: '2px 4px 20px 0px #00000012' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#E7F5FF] rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#016699]" />
                </div>
              </div>
              <div className="font-body mb-2" style={{ color: '#868E96' }}>Total Employees</div>
              <div className="text-3xl font-bold text-[#016699] mb-2">
                {filteredEmployees.length}
              </div>
              <div className="font-body" style={{ color: '#868E96' }}>
                {selectedDepartment === 'all' ? 'Across all departments' : `In ${selectedDepartment}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Modal */}
      {selectedBoxRecommendation && (
        <DialogPrimitive.Root open={true} onOpenChange={(open) => {
          console.log('Dialog onOpenChange called', open);
          if (!open) setSelectedBoxRecommendation(null);
        }}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
              className="fixed inset-0 bg-black/50 z-[9998]"
              style={{ zIndex: 9998 }}
            />
            <DialogPrimitive.Content
              className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[9999] bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              style={{ zIndex: 9999, boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.16)' }}
            >
              {console.log('Rendering modal for:', selectedBoxRecommendation)}

              <DialogPrimitive.Close
                className="absolute top-4 right-4 rounded-full p-2 hover:bg-[#E9ECEF] transition-colors"
                onClick={() => setSelectedBoxRecommendation(null)}
              >
                <X className="w-5 h-5" style={{ color: '#868E96' }} />
              </DialogPrimitive.Close>

              <div className="mb-6">
                <h2 className="font-subheading text-[#016699] mb-2">
                  {PERFORMANCE_MATRIX_RECOMMENDATIONS[selectedBoxRecommendation].title}
                </h2>
                <p className="font-body italic mb-1" style={{ color: '#868E96' }}>
                  {PERFORMANCE_MATRIX_RECOMMENDATIONS[selectedBoxRecommendation].subtitle}
                </p>
                <div className="inline-block px-3 py-1 bg-[#E7F5FF] rounded-full mt-2">
                  <p className="font-body font-medium text-[#016699]">
                    Fokus: {PERFORMANCE_MATRIX_RECOMMENDATIONS[selectedBoxRecommendation].focus}
                  </p>
                </div>
              </div>

              <div className="space-y-6 mt-6">
                {/* Recommendations List */}
                <div>
                  <h4 className="font-subheading mb-3" style={{ color: '#495057' }}>Rekomendasi:</h4>
                  <ul className="space-y-3">
                    {PERFORMANCE_MATRIX_RECOMMENDATIONS[selectedBoxRecommendation].recommendations.map((rec, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#016699] text-white flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="font-paragraph leading-relaxed flex-1" style={{ color: '#495057' }}>{rec}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Summary */}
                <div className="bg-[#F2F9F7] rounded-lg p-4 border-l-4 border-[#00875A]">
                  <h4 className="font-body font-bold mb-2" style={{ color: '#495057' }}>Aksi Utama HR/Manager:</h4>
                  <p className="font-paragraph italic leading-relaxed" style={{ color: '#495057' }}>
                    {PERFORMANCE_MATRIX_RECOMMENDATIONS[selectedBoxRecommendation].action}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end mt-6 pt-4 border-t border-[#DEE2E6]">
                <Button
                  onClick={() => setSelectedBoxRecommendation(null)}
                  className="rounded-full bg-[#016699] hover:bg-[#014d73] text-white px-6"
                >
                  Close
                </Button>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}
    </div>
  );
}