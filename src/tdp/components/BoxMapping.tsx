// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import React, { useState, useMemo } from 'react';
import { Employee } from '../data/mockEmployees';
import { loadEmployeeDraftEmployees } from '../data/employeeDraft';
import { Search, X, Target, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import * as DialogPrimitive from '@radix-ui/react-dialog';

// Variable options for axis selection
const VARIABLE_OPTIONS = [
  { value: 'performanceRating', label: 'Performance', max: 100 },
  { value: 'potentialRating', label: 'Potential', max: 100 },
  { value: 'engagementScore', label: 'Engagement', max: 100 },
  { value: 'readinessLevel', label: 'Readiness', max: 100 },
  { value: 'leadership', label: 'Leadership', max: 5 },
  { value: 'communication', label: 'Communication', max: 5 },
  { value: 'problemSolving', label: 'Problem Solving', max: 5 },
  { value: 'teamwork', label: 'Teamwork', max: 5 },
  { value: 'adaptability', label: 'Adaptability', max: 5 },
  { value: 'strategicThinking', label: 'Strategic Thinking', max: 5 },
  { value: 'innovation', label: 'Innovation', max: 5 },
  { value: 'analyticalSkills', label: 'Analytical Skills', max: 5 },
];

// Box recommendations data
const BOX_RECOMMENDATIONS = {
  'high-high': {
    title: 'Star Performers',
    subtitle: 'High X-Axis / High Y-Axis',
    interpretation: 'Top talent with exceptional performance across both dimensions. These are your organization\'s most valuable contributors.',
    profile: 'Consistently exceeds expectations, demonstrates strong capabilities, high engagement, and readiness for greater responsibilities.',
    intervention: 'Retention and Development',
    recommendations: [
      'Fast-track for senior leadership roles',
      'Provide stretch assignments and executive visibility',
      'Offer competitive compensation and retention packages',
      'Engage in succession planning discussions',
      'Create personalized development plans'
    ],
    managerAction: 'Schedule quarterly career development conversations. Ensure they feel challenged and valued.',
    risk: 'High flight risk if not properly engaged. Competitors may actively recruit.',
    nextReview: 'Quarterly performance and career progression review'
  },
  'high-med': {
    title: 'High Achievers',
    subtitle: 'High X-Axis / Medium Y-Axis',
    interpretation: 'Strong performers who excel in one dimension but have room for growth in another.',
    profile: 'Delivers consistent results with potential for further development in specific areas.',
    intervention: 'Targeted Development',
    recommendations: [
      'Identify specific development areas for the medium dimension',
      'Provide coaching and mentoring support',
      'Assign projects that build missing competencies',
      'Consider lateral moves for skill broadening',
      'Monitor progress with regular check-ins'
    ],
    managerAction: 'Create targeted development plan. Assign mentor or coach for specific skill gaps.',
    risk: 'May plateau without proper development support.',
    nextReview: 'Bi-annual development progress review'
  },
  'high-low': {
    title: 'Inconsistent Performers',
    subtitle: 'High X-Axis / Low Y-Axis',
    interpretation: 'Strong in one area but significantly underperforming in another. Requires immediate attention.',
    profile: 'Shows capability in certain aspects but lacks critical skills or engagement in others.',
    intervention: 'Performance Improvement',
    recommendations: [
      'Conduct root cause analysis for low performance area',
      'Create 90-day performance improvement plan',
      'Provide intensive coaching and support',
      'Address potential engagement or fit issues',
      'Consider role reassignment if skill mismatch'
    ],
    managerAction: 'Immediate one-on-one to understand blockers. Document improvement plan with clear metrics.',
    risk: 'High risk of continued underperformance. May need role change or exit.',
    nextReview: 'Monthly performance improvement check-ins'
  },
  'med-high': {
    title: 'Emerging Talent',
    subtitle: 'Medium X-Axis / High Y-Axis',
    interpretation: 'Shows strong potential in key areas with solid foundation for growth.',
    profile: 'Developing professionals with clear strengths and growth trajectory.',
    intervention: 'Growth and Development',
    recommendations: [
      'Accelerate development through challenging assignments',
      'Provide access to training and learning resources',
      'Pair with senior mentors for guidance',
      'Create clear career path with milestones',
      'Increase responsibility gradually'
    ],
    managerAction: 'Invest in development. Assign stretch projects with appropriate support.',
    risk: 'May be poached if not given growth opportunities.',
    nextReview: 'Quarterly development and progression review'
  },
  'med-med': {
    title: 'Solid Contributors',
    subtitle: 'Medium X-Axis / Medium Y-Axis',
    interpretation: 'Reliable performers who meet expectations consistently.',
    profile: 'Backbone of the organization. Dependable but may need motivation for next level.',
    intervention: 'Engagement and Recognition',
    recommendations: [
      'Recognize and appreciate consistent contributions',
      'Identify areas for skill enhancement',
      'Provide variety in work assignments',
      'Discuss career aspirations and interests',
      'Offer selective development opportunities'
    ],
    managerAction: 'Regular feedback and recognition. Explore career interests and provide relevant opportunities.',
    risk: 'Risk of disengagement if not recognized or developed.',
    nextReview: 'Annual performance and career discussion'
  },
  'med-low': {
    title: 'Underperformers',
    subtitle: 'Medium X-Axis / Low Y-Axis',
    interpretation: 'Below expectations in critical areas. Needs support and clear expectations.',
    profile: 'Struggling to meet standards despite some capabilities.',
    intervention: 'Performance Support',
    recommendations: [
      'Set clear performance expectations and goals',
      'Provide structured feedback and coaching',
      'Identify and remove performance blockers',
      'Consider training or skill development',
      'Monitor progress closely with action plan'
    ],
    managerAction: 'Document performance concerns. Create improvement plan with specific, measurable goals.',
    risk: 'Performance may not improve. Prepare for potential exit.',
    nextReview: 'Monthly performance monitoring'
  },
  'low-high': {
    title: 'High Potential Developers',
    subtitle: 'Low X-Axis / High Y-Axis',
    interpretation: 'Strong in certain areas but needs significant development in others.',
    profile: 'Shows promise but requires investment to reach full potential.',
    intervention: 'Intensive Development',
    recommendations: [
      'Assess if low performance is skill or engagement issue',
      'Provide comprehensive training programs',
      'Assign developmental role or projects',
      'Regular coaching and feedback sessions',
      'Set incremental improvement milestones'
    ],
    managerAction: 'Invest in development if engagement is high. Address root causes of low performance.',
    risk: 'May not reach potential without significant support.',
    nextReview: 'Quarterly capability assessment'
  },
  'low-med': {
    title: 'Struggling Performers',
    subtitle: 'Low X-Axis / Medium Y-Axis',
    interpretation: 'Underperforming across most dimensions. Requires urgent intervention.',
    profile: 'Not meeting role requirements. May be experiencing fit or capability issues.',
    intervention: 'Critical Performance Review',
    recommendations: [
      'Conduct thorough performance review',
      'Determine if role fit or capability issue',
      'Create formal performance improvement plan',
      'Consider role change or demotion',
      'Prepare for potential exit if no improvement'
    ],
    managerAction: 'Formal performance review with HR. Document all discussions and improvement plans.',
    risk: 'High likelihood of termination if performance doesn\'t improve.',
    nextReview: 'Bi-weekly performance check-ins'
  },
  'low-low': {
    title: 'Critical Concern',
    subtitle: 'Low X-Axis / Low Y-Axis',
    interpretation: 'Severely underperforming. Immediate action required.',
    profile: 'Not meeting minimum standards. Likely mismatched to role or organization.',
    intervention: 'Exit Planning',
    recommendations: [
      'Begin exit planning process',
      'Conduct final performance review with HR',
      'Document all performance issues',
      'Consider managed transition',
      'Learn from hiring and onboarding process'
    ],
    managerAction: 'Work with HR on exit strategy. Ensure proper documentation and process.',
    risk: 'Continued employment damages team morale and productivity.',
    nextReview: 'Immediate transition planning'
  }
};

export default function BoxMapping() {
  const [xAxis, setXAxis] = useState('performanceRating');
  const [yAxis, setYAxis] = useState('potentialRating');
  const [zAxis, setZAxis] = useState('engagementScore');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [hoveredEmployee, setHoveredEmployee] = useState<string | null>(null);
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  const allEmployees = useMemo(() => loadEmployeeDraftEmployees(), []);

  // Get unique departments and levels
  const departments = useMemo(() => {
    const depts = [...new Set(allEmployees.map(e => e.department))];
    return depts.filter(d => d !== 'No Data');
  }, [allEmployees]);

  const levels = useMemo(() => {
    const lvls = [...new Set(allEmployees.map(e => e.level))];
    return lvls.filter(l => l !== 'No Data');
  }, [allEmployees]);

  // Get active employees from table state
  const getActiveEmployeeIds = (): string[] | null => {
    const savedState = localStorage.getItem('currentTableState');
    if (!savedState) return null;

    try {
      const state = JSON.parse(savedState);
      return state.employeeIds || null;
    } catch {
      return null;
    }
  };

  // Filter employees - sync with table view
  const filteredEmployees = useMemo(() => {
    const activeEmployeeIds = getActiveEmployeeIds();

    // Start with employees from table state if available
    let baseEmployees = allEmployees;
    if (activeEmployeeIds && activeEmployeeIds.length > 0) {
      baseEmployees = allEmployees.filter(emp => activeEmployeeIds.includes(emp.id));
    }

    // Apply local filters
    return baseEmployees.filter(emp => {
      if (emp.name === 'No Data') return false;

      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
      const matchesLevel = levelFilter === 'all' || emp.level === levelFilter;

      return matchesSearch && matchesDept && matchesLevel;
    });
  }, [searchTerm, departmentFilter, levelFilter, allEmployees]);

  // Normalize value to 0-100 scale
  const normalizeValue = (value: any, variableKey: string): number => {
    if (value === null || value === undefined) return 0;

    const variable = VARIABLE_OPTIONS.find(v => v.value === variableKey);
    if (!variable) return 0;

    if (variable.max === 100) {
      return typeof value === 'number' ? value : 0;
    } else if (variable.max === 5) {
      return typeof value === 'number' ? (value / 5) * 100 : 0;
    }

    return 0;
  };

  // Categorize value into low/med/high
  const categorizeValue = (value: number): 'low' | 'med' | 'high' => {
    if (value <= 33) return 'low';
    if (value <= 66) return 'med';
    return 'high';
  };

  // Get box key for employee
  const getBoxKey = (emp: Employee): string => {
    const xValue = normalizeValue(emp[xAxis as keyof Employee], xAxis);
    const yValue = normalizeValue(emp[yAxis as keyof Employee], yAxis);

    const xCat = categorizeValue(xValue);
    const yCat = categorizeValue(yValue);

    return `${yCat}-${xCat}`;
  };

  // Calculate box distribution
  const boxDistribution = useMemo(() => {
    const dist: Record<string, number> = {
      'high-high': 0, 'high-med': 0, 'high-low': 0,
      'med-high': 0, 'med-med': 0, 'med-low': 0,
      'low-high': 0, 'low-med': 0, 'low-low': 0
    };

    filteredEmployees.forEach(emp => {
      const boxKey = getBoxKey(emp);
      if (dist[boxKey] !== undefined) {
        dist[boxKey]++;
      }
    });

    return dist;
  }, [filteredEmployees, xAxis, yAxis]);

  // Get label for axis
  const getAxisLabel = (axisKey: string): string => {
    const variable = VARIABLE_OPTIONS.find(v => v.value === axisKey);
    return variable?.label || axisKey;
  };

  // Get box label
  const getBoxLabel = (yLevel: string, xLevel: string): string => {
    const yLabel = yLevel.charAt(0).toUpperCase() + yLevel.slice(1);
    const xLabel = xLevel.charAt(0).toUpperCase() + xLevel.slice(1);
    return `${yLabel} ${getAxisLabel(yAxis)} / ${xLabel} ${getAxisLabel(xAxis)}`;
  };

  // Render a single box in the grid
  const renderBox = (boxKey: string) => {
    const [yLevel, xLevel] = boxKey.split('-');
    const count = boxDistribution[boxKey] || 0;
    const employeesInBox = filteredEmployees.filter(emp => getBoxKey(emp) === boxKey);

    return (
      <div
        key={boxKey}
        className="border-2 border-gray-300 bg-gray-50 rounded-lg relative cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all overflow-hidden"
        onClick={() => setSelectedBox(boxKey)}
        style={{ aspectRatio: '1/1' }}
      >
        {/* Box Header */}
        <div className="absolute top-0 left-0 right-0 p-3 bg-white/80 border-b border-gray-200 z-10">
          <div className="text-xs font-medium text-gray-600 mb-1 truncate">
            {getBoxLabel(yLevel, xLevel)}
          </div>
          <div className="text-sm font-bold text-[#016699]">
            {count} {count === 1 ? 'person' : 'people'}
          </div>
        </div>

        {/* Bubbles Container */}
        <div className="absolute inset-0 pt-20 pb-2 px-2">
          {employeesInBox.map(emp => {
            const xValue = normalizeValue(emp[xAxis as keyof Employee], xAxis);
            const yValue = normalizeValue(emp[yAxis as keyof Employee], yAxis);
            const zValue = normalizeValue(emp[zAxis as keyof Employee], zAxis);

            // Position within the box (0-100 within low/med/high range)
            let xPercent = 50;
            let yPercent = 50;

            if (xLevel === 'low') xPercent = (xValue / 33) * 100;
            else if (xLevel === 'med') xPercent = ((xValue - 34) / 32) * 100;
            else xPercent = ((xValue - 67) / 33) * 100;

            if (yLevel === 'low') yPercent = 100 - (yValue / 33) * 100;
            else if (yLevel === 'med') yPercent = 100 - ((yValue - 34) / 32) * 100;
            else yPercent = 100 - ((yValue - 67) / 33) * 100;

            // Bubble size (8-20px radius based on z value)
            const bubbleSize = 8 + (zValue / 100) * 12;

            return (
              <div
                key={emp.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${Math.max(10, Math.min(90, xPercent))}%`,
                  top: `${Math.max(10, Math.min(90, yPercent))}%`,
                }}
                onMouseEnter={() => setHoveredEmployee(emp.id)}
                onMouseLeave={() => setHoveredEmployee(null)}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="rounded-full bg-[#016699] opacity-80 hover:opacity-100 transition-all flex items-center justify-center text-white font-semibold shadow-md hover:shadow-lg cursor-pointer"
                  style={{
                    width: `${bubbleSize * 2}px`,
                    height: `${bubbleSize * 2}px`,
                    fontSize: `${Math.max(8, bubbleSize * 0.6)}px`,
                  }}
                >
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Tooltip */}
                {hoveredEmployee === emp.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl whitespace-nowrap z-50 pointer-events-none">
                    <div className="font-semibold mb-1">{emp.name}</div>
                    <div className="text-gray-300 mb-2">{emp.role}</div>
                    <div className="space-y-1 text-gray-200">
                      <div>{getAxisLabel(xAxis)}: {normalizeValue(emp[xAxis as keyof Employee], xAxis).toFixed(0)}</div>
                      <div>{getAxisLabel(yAxis)}: {normalizeValue(emp[yAxis as keyof Employee], yAxis).toFixed(0)}</div>
                      <div>{getAxisLabel(zAxis)}: {normalizeValue(emp[zAxis as keyof Employee], zAxis).toFixed(0)}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="max-w-[1800px] mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Box-Mapping Analysis</h1>
          <p className="text-gray-600">
            Visualize employee positioning across multiple dimensions. Select variables for each axis to explore different talent perspectives.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* X-Axis Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                X-Axis (Horizontal)
              </label>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VARIABLE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Y-Axis Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Y-Axis (Vertical)
              </label>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VARIABLE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Z-Axis (Bubble Size) Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bubble Size
              </label>
              <Select value={zAxis} onValueChange={setZAxis}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VARIABLE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search employees..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content - Grid and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 9-Box Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Y-Axis Label */}
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  <span className="text-sm font-semibold text-gray-700">
                    {getAxisLabel(yAxis)} →
                  </span>
                </div>

                {/* Main Grid Container */}
                <div className="flex-1">
                  {/* Grid - 3x3 with equal sizing */}
                  <div className="grid grid-cols-3 grid-rows-3 gap-3" style={{ aspectRatio: '1/1', width: '100%' }}>
                    {/* Render all 9 boxes in order: top row (high-Y) to bottom row (low-Y) */}
                    {['high-low', 'high-med', 'high-high', 'med-low', 'med-med', 'med-high', 'low-low', 'low-med', 'low-high'].map((boxKey) => renderBox(boxKey))}
                  </div>

                  {/* X-Axis Label */}
                  <div className="text-center text-sm font-semibold text-gray-700 mt-4">
                    ← {getAxisLabel(xAxis)} →
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Summary Panel */}
          <div className="space-y-4">
            {/* Summary Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-[#016699]" />
                    <span className="text-sm font-medium text-gray-700">Total Employees</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{filteredEmployees.length}</div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Selected Variables</div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>X: {getAxisLabel(xAxis)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 transform rotate-90" />
                      <span>Y: {getAxisLabel(yAxis)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>Size: {getAxisLabel(zAxis)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-sm font-medium text-gray-700 mb-3">Distribution</div>
                  <div className="space-y-2">
                    {Object.entries(boxDistribution).map(([key, count]) => {
                      if (count === 0) return null;
                      const [yLevel, xLevel] = key.split('-');
                      return (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600">{getBoxLabel(yLevel, xLevel)}</span>
                          <span className="font-semibold text-gray-900">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#016699] opacity-70"></div>
                  <span className="text-gray-700">Employee bubble</span>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  • Bubble size represents {getAxisLabel(zAxis)}<br />
                  • Hover to see details<br />
                  • Click box for recommendations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Box Recommendation Modal */}
      {selectedBox && (
        <DialogPrimitive.Root open={true} onOpenChange={(open) => {
          if (!open) setSelectedBox(null);
        }}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-[9998]" />
            <DialogPrimitive.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[9999] bg-white rounded-2xl p-8 shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <DialogPrimitive.Title className="text-2xl font-bold text-gray-900 mb-2">
                    {BOX_RECOMMENDATIONS[selectedBox as keyof typeof BOX_RECOMMENDATIONS]?.title}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-sm text-gray-600">
                    {BOX_RECOMMENDATIONS[selectedBox as keyof typeof BOX_RECOMMENDATIONS]?.subtitle}
                  </DialogPrimitive.Description>
                </div>
                <button
                  onClick={() => setSelectedBox(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Interpretation */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#016699]" />
                    Box Interpretation
                  </h3>
                  <p className="text-gray-700">
                    {BOX_RECOMMENDATIONS[selectedBox as keyof typeof BOX_RECOMMENDATIONS]?.interpretation}
                  </p>
                </div>

                {/* Profile */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Typical Employee Profile</h3>
                  <p className="text-sm text-gray-700">
                    {BOX_RECOMMENDATIONS[selectedBox as keyof typeof BOX_RECOMMENDATIONS]?.profile}
                  </p>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Recommended Interventions: {BOX_RECOMMENDATIONS[selectedBox as keyof typeof BOX_RECOMMENDATIONS]?.intervention}
                  </h3>
                  <ul className="space-y-2">
                    {BOX_RECOMMENDATIONS[selectedBox as keyof typeof BOX_RECOMMENDATIONS]?.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-[#016699] font-semibold">{idx + 1}.</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Manager Action */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Manager Action</h3>
                  <p className="text-sm text-gray-700">
                    {BOX_RECOMMENDATIONS[selectedBox as keyof typeof BOX_RECOMMENDATIONS]?.managerAction}
                  </p>
                </div>

                {/* Risk */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Risk to Monitor</h3>
                  <p className="text-sm text-gray-700">
                    {BOX_RECOMMENDATIONS[selectedBox as keyof typeof BOX_RECOMMENDATIONS]?.risk}
                  </p>
                </div>

                {/* Next Review */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Next Review Recommendation</h3>
                  <p className="text-sm text-gray-700">
                    {BOX_RECOMMENDATIONS[selectedBox as keyof typeof BOX_RECOMMENDATIONS]?.nextReview}
                  </p>
                </div>

                {/* Employees in this box */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Employees in this Box ({boxDistribution[selectedBox] || 0})
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {filteredEmployees
                      .filter(emp => getBoxKey(emp) === selectedBox)
                      .map(emp => (
                        <div key={emp.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="font-medium text-gray-900 text-sm">{emp.name}</div>
                          <div className="text-xs text-gray-600">{emp.role}</div>
                          <div className="text-xs text-gray-500 mt-1">{emp.department}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedBox(null)}
                  className="px-6 py-2 bg-[#016699] text-white rounded-lg hover:bg-[#014d73] transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      )}
    </div>
  );
}
