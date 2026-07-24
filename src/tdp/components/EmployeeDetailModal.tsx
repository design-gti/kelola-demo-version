// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { Employee } from '../data/mockEmployees';
import {
  Star,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  X,
  Clock,
  Users,
  Shield,
} from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeDetailModal({
  employee,
  isOpen,
  onClose,
}: EmployeeDetailModalProps) {
  const getFlightRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPromotionReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'Ready Now':
        return 'bg-green-100 text-green-800';
      case 'Ready in 1-2 years':
        return 'bg-blue-100 text-blue-800';
      case 'Not Ready':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[1240px] w-[1240px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{employee.name} - Employee Detail</DialogTitle>
          <DialogDescription>
            Complete profile information for {employee.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 w-[1200px]">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Employee Detail</h2>
            <p className="text-gray-600 mt-1">Complete profile information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Profile & Key Metrics */}
            <div className="lg:col-span-1 space-y-4">
              {/* Profile Card */}
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                  boxShadow:
                    '1px 1px 20px 0 rgba(0,0,0,0.1), 1px 1px 12px -4px rgba(0,0,0,0.05)',
                }}
              >
                <div className="relative">
                  {/* Large Profile Photo */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={employee.photo}
                      alt={employee.name}
                      onError={(e) => { e.currentTarget.src = '/avatars/male.jpg'; e.currentTarget.onerror = null; }}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    {/* Name, Role and Employee ID Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="mb-3">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 mb-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-xs text-white/90 font-mono font-medium">
                            ID: {employee.id}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-white mb-1">
                        {employee.name}
                      </h2>
                      <p className="text-white/90 text-base mb-3">{employee.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Performance */}
                <div
                  className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white"
                  style={{
                    boxShadow:
                      '1px 1px 10px 0 rgba(0,0,0,0.1), 1px 1px 6px -2px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
                      <Star className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-xs opacity-90 mb-1 tracking-wide">Performance</div>
                  <div className="text-3xl font-bold mb-2">
                    {employee.performanceRating}
                    <span className="text-lg opacity-75">%</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(employee.performanceRating / 20)
                            ? 'fill-white text-white'
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Potential */}
                <div
                  className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white"
                  style={{
                    boxShadow:
                      '1px 1px 10px 0 rgba(0,0,0,0.1), 1px 1px 6px -2px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
                      <Star className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-xs opacity-90 mb-1 tracking-wide">Potential</div>
                  <div className="text-3xl font-bold mb-2">
                    {employee.potentialRating}
                    <span className="text-lg opacity-75">%</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(employee.potentialRating / 20)
                            ? 'fill-white text-white'
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Engagement */}
                <div
                  className="bg-white rounded-2xl p-5"
                  style={{
                    boxShadow:
                      '1px 1px 10px 0 rgba(0,0,0,0.1), 1px 1px 6px -2px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-1 tracking-wide">Engagement</div>
                  <div className="text-3xl font-bold mb-1 text-[#016699]">
                    {employee.engagementScore}
                    <span className="text-lg text-gray-500">%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                      style={{ width: `${employee.engagementScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Risk */}
                <div
                  className="bg-white rounded-2xl p-5"
                  style={{
                    boxShadow:
                      '1px 1px 10px 0 rgba(0,0,0,0.1), 1px 1px 6px -2px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-1 tracking-wide">Flight Risk</div>
                  <div className="text-3xl font-bold mb-1 text-[#016699]">
                    {employee.flightRisk}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-4">
              {/* Career Information */}
              <div
                className="bg-white rounded-2xl p-6"
                style={{
                  boxShadow:
                    '1px 1px 10px 0 rgba(0,0,0,0.1), 1px 1px 6px -2px rgba(0,0,0,0.05)',
                }}
              >
                <h3 className="font-semibold text-gray-900 mb-5 text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#016699]" />
                  Career Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-[#016699]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 tracking-wide mb-1">Manager</div>
                        <div className="font-semibold text-[14px] font-bold text-[#016699]">
                          {employee.manager}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-[#016699]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 tracking-wide mb-1">Tenure</div>
                        <div className="font-semibold text-[14px] font-bold text-[#016699]">
                          {employee.yearsInCompany} yrs in company
                        </div>
                        <div className="text-sm text-gray-600">
                          {employee.yearsInRole} yrs in role
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-6 h-6 text-[#016699]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 tracking-wide mb-1">Salary</div>
                        <div className="font-semibold text-[14px] font-bold text-[#016699]">
                          Rp {employee.salary.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#016699]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 tracking-wide mb-1">
                          Last Promotion
                        </div>
                        <div className="font-semibold text-[14px] font-bold text-[#016699]">
                          {new Date(employee.lastPromotionDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education & Skills */}
              <div
                className="bg-white rounded-2xl p-6"
                style={{
                  boxShadow:
                    '1px 1px 10px 0 rgba(0,0,0,0.1), 1px 1px 6px -2px rgba(0,0,0,0.05)',
                }}
              >
                <h3 className="font-semibold text-gray-900 mb-5 text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#016699]" />
                  Education & Skills
                </h3>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-[#016699]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 tracking-wide mb-1">Education</div>
                      <div className="font-semibold text-[14px] font-bold text-[#016699]">
                        {employee.education}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-[#016699]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 tracking-wide mb-1">
                        Certifications
                      </div>
                      <div className="font-semibold text-[14px] text-[#016699] font-bold">
                        {employee.certifications.length > 0
                          ? employee.certifications.join(', ')
                          : 'None'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 tracking-wide mb-3">Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {employee.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full text-sm font-medium text-[#016699]"
                          style={{ boxShadow: '1px 1px 2px 0 rgba(0,0,0,0.05)' }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div
                className="bg-white rounded-2xl p-6"
                style={{
                  boxShadow:
                    '1px 1px 10px 0 rgba(0,0,0,0.1), 1px 1px 6px -2px rgba(0,0,0,0.05)',
                }}
              >
                <h3 className="font-semibold text-gray-900 mb-5 text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#016699]" />
                  Risk Assessment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="bg-white rounded-xl p-4"
                    style={{
                      boxShadow:
                        '1px 1px 6px 0 rgba(0,0,0,0.07), 1px 1px 4px -1px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="text-xs text-gray-500 tracking-wide mb-2">Flight Risk</div>
                    <Badge
                      className={`${getFlightRiskColor(employee.flightRisk)} text-sm font-semibold`}
                    >
                      {employee.flightRisk}
                    </Badge>
                  </div>

                  <div
                    className="bg-white rounded-xl p-4"
                    style={{
                      boxShadow:
                        '1px 1px 6px 0 rgba(0,0,0,0.07), 1px 1px 4px -1px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="text-xs text-gray-500 tracking-wide mb-2">
                      Promotion Readiness
                    </div>
                    <Badge
                      className={`${getPromotionReadinessColor(
                        employee.promotionReadiness
                      )} text-sm font-semibold`}
                    >
                      {employee.promotionReadiness}
                    </Badge>
                  </div>

                  <div
                    className="bg-white rounded-xl p-4"
                    style={{
                      boxShadow:
                        '1px 1px 6px 0 rgba(0,0,0,0.07), 1px 1px 4px -1px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="text-xs text-gray-500 tracking-wide mb-2">Critical Role</div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${employee.criticalRole ? 'text-orange-600' : 'text-gray-600'}`}>
                        {employee.criticalRole ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div
                    className="bg-white rounded-xl p-4"
                    style={{
                      boxShadow:
                        '1px 1px 6px 0 rgba(0,0,0,0.07), 1px 1px 4px -1px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div className="text-xs text-gray-500 tracking-wide mb-2">
                      Successor Identified
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${employee.successorIdentified ? 'text-green-600' : 'text-gray-600'}`}>
                        {employee.successorIdentified ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}