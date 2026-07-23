import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import OrgChartCard from "./OrgChartCard";
import { Employee } from "../data/orgChartData";
import { HeatmapRange, HeatmapConfig } from "./HeatmapSettings";
import { dataManager } from "../data/dataManager";

interface SuccessionChartProps {
  employee: Employee;
  allEmployees: Employee[];
  heatmapRanges: HeatmapRange[];
  readinessScoreRanges: HeatmapRange[];
  heatmapConfig: HeatmapConfig;
  visibleColumns: {
    gender: boolean;
    city: boolean;
    maritalStatus: boolean;
    performance: boolean;
    iq: boolean;
    capability: boolean;
    commitment: boolean;
    contribution: boolean;
  };
  onEmployeeClick: (employee: Employee) => void;
}

export default function SuccessionChart({
  employee,
  allEmployees,
  heatmapRanges,
  readinessScoreRanges,
  heatmapConfig,
  visibleColumns,
  onEmployeeClick
}: SuccessionChartProps) {
  const [zoom, setZoom] = useState(80);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Get manager (1 level up)
  const manager = allEmployees.find(emp => emp.id === employee.managerId);

  // Get successors â€” prefer CSV-based successorIds, fall back to direct reports
  // Use dataManager to get the latest additionalSuccessors data
  const currentEmployeeData = dataManager.getEmployees().find(e => e.id === employee.id);
  const additionalSuccessorIds = currentEmployeeData?.additionalSuccessors || [];

  const directReports = allEmployees.filter(emp => emp.managerId === employee.id);

  // CSV-based planned successors (from "Successor For Employee ID" column)
  const csvSuccessorIds = employee.successorIds || [];
  const csvSuccessors = allEmployees.filter(emp => csvSuccessorIds.includes(emp.id));

  // Manually added successors (de-duped against CSV successors)
  const additionalSuccessors = allEmployees.filter(emp =>
    additionalSuccessorIds.includes(emp.id) &&
    !directReports.find(dr => dr.id === emp.id) &&
    !csvSuccessorIds.includes(emp.id)
  );

  // If CSV has successor data, use it; otherwise fall back to direct reports
  const successors = csvSuccessorIds.length > 0
    ? [...csvSuccessors, ...additionalSuccessors]
    : [...directReports, ...additionalSuccessors];

  // Zoom functions
  const handleZoomIn = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newZoom = Math.min(zoom + 10, 200);
    const zoomRatio = newZoom / zoom;
    
    setPosition(prev => ({
      x: centerX - (centerX - prev.x) * zoomRatio,
      y: centerY - (centerY - prev.y) * zoomRatio
    }));
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newZoom = Math.max(zoom - 10, 25);
    const zoomRatio = newZoom / zoom;
    
    setPosition(prev => ({
      x: centerX - (centerX - prev.x) * zoomRatio,
      y: centerY - (centerY - prev.y) * zoomRatio
    }));
    setZoom(newZoom);
  };

  const handleResetView = () => {
    setZoom(80);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('[data-no-drag]')) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Mouse wheel handler for zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Determine zoom direction (negative deltaY means scroll up = zoom in)
    const delta = e.deltaY > 0 ? -10 : 10;
    const newZoom = Math.max(25, Math.min(200, zoom + delta));
    
    if (newZoom === zoom) return; // No change
    
    const zoomRatio = newZoom / zoom;
    
    // Zoom towards mouse position
    setPosition(prev => ({
      x: mouseX - (mouseX - prev.x) * zoomRatio,
      y: mouseY - (mouseY - prev.y) * zoomRatio
    }));
    setZoom(newZoom);
  };

  // Calculate promotion readiness percentage (same logic as org chart)
  const getPromotionReadinessPercentage = (emp: Employee): number => {
    // If readinessScore exists in data, use it
    if (emp.readinessScore !== undefined && emp.readinessScore !== null) {
      return emp.readinessScore;
    }
    
    // Fallback calculation based on competency score
    const currentScore = emp.competencyScore;
    if (currentScore >= 91) {
      return Math.round(currentScore * 0.92);
    } else if (currentScore >= 76) {
      return Math.round(currentScore * 0.88);
    } else if (currentScore >= 66) {
      return Math.round(currentScore * 0.80);
    } else {
      return Math.round(currentScore * 0.72);
    }
  };

  // Get tag color based on percentage range using readiness score heatmap config
  const getTagColor = (percentage: number): string => {
    const ranges = heatmapConfig.readinessScore;
    
    // Find which range the percentage falls into
    for (const range of ranges) {
      if (percentage >= range.min && percentage <= range.max) {
        return range.color;
      }
    }
    
    // Fallback: use first or last range
    if (percentage < ranges[0].min) {
      return ranges[0].color;
    }
    return ranges[ranges.length - 1].color;
  };

  // Center the chart on mount
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({ x: rect.width / 2, y: 50 });
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Zoom Controls */}
      <div className="absolute top-[80px] right-6 z-50 flex flex-col gap-2">
        <Button
          onClick={handleZoomIn}
          size="sm"
          className="bg-white hover:bg-gray-100 text-gray-700 shadow-md border w-9 h-9 p-0"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleZoomOut}
          size="sm"
          className="bg-white hover:bg-gray-100 text-gray-700 shadow-md border w-9 h-9 p-0"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleResetView}
          size="sm"
          className="bg-white hover:bg-gray-100 text-gray-700 shadow-md border w-9 h-9 p-0"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Chart Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden bg-gray-50 relative cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          className="absolute top-0 left-0"
        >
          <div className="flex flex-col items-center gap-8 py-8">
            {/* Manager Card */}
            {manager && (
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  {(() => {
                    const percentage = getPromotionReadinessPercentage(manager);
                    const tagColor = getTagColor(percentage);
                    const showTag = percentage > 0 && manager.managerId; // Don't show for CEO
                    
                    return showTag && (
                      <div 
                        className="mb-1 px-2 py-0.5 border rounded-full bg-white z-20 text-[8px] flex items-center gap-1 absolute -top-7 left-1/2 -translate-x-1/2"
                        style={{ borderColor: tagColor }}
                      >
                        {manager.activeIDP && (
                          <TrendingUp 
                            className="w-[10px] h-[10px]" 
                            style={{ color: tagColor }}
                            strokeWidth={2.5}
                          />
                        )}
                        <span 
                          className="font-['Open_Sans',_sans-serif] text-[8px] font-bold font-normal"
                          style={{ color: tagColor }}
                        >
                          {percentage}%
                        </span>
                      </div>
                    );
                  })()}
                  <OrgChartCard
                    name={manager.name}
                    position={manager.position}
                    jobTitle={manager.jobTitle}
                    competencyScore={manager.competencyScore}
                    successors={allEmployees.filter(e => e.managerId === manager.id).length}
                    imageUrl={manager.imageUrl}
                    showHeatmap={false}
                    heatmapStyle="gradient"
                    heatmapMode="performance"
                    visibleColumns={visibleColumns}
                    gender={manager.gender}
                    city={manager.city}
                    maritalStatus={manager.maritalStatus}
                    performance={manager.performance}
                    iq={manager.iq}
                    heatmapRanges={heatmapRanges}
                    readinessScore={manager.readinessScore}
                    employeeId={manager.id}
                    allEmployees={allEmployees}
                    readinessScoreRanges={readinessScoreRanges}
                    onClick={() => onEmployeeClick(manager)}
                  />
                </div>
                {/* Connector Line */}
                <div className="w-0.5 h-12 bg-gray-300" />
              </div>
            )}

            {/* Current Employee Card */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                {(() => {
                  const percentage = getPromotionReadinessPercentage(employee);
                  const tagColor = getTagColor(percentage);
                  const showTag = percentage > 0 && employee.managerId; // Don't show for CEO
                  
                  return showTag && (
                    <div 
                      className="mb-1 px-2 py-0.5 border rounded-full bg-white z-20 text-[8px] flex items-center gap-1 absolute -top-7 left-1/2 -translate-x-1/2"
                      style={{ borderColor: tagColor }}
                    >
                      {employee.activeIDP && (
                        <TrendingUp 
                          className="w-[10px] h-[10px]" 
                          style={{ color: tagColor }}
                          strokeWidth={2.5}
                        />
                      )}
                      <span 
                        className="font-['Open_Sans',_sans-serif] text-[8px] font-bold font-normal"
                        style={{ color: tagColor }}
                      >
                        {percentage}%
                      </span>
                    </div>
                  );
                })()}
                <div className="ring-4 ring-blue-400 rounded-lg">
                  <OrgChartCard
                    name={employee.name}
                    position={employee.position}
                    jobTitle={employee.jobTitle}
                    competencyScore={employee.competencyScore}
                    successors={successors.length}
                    imageUrl={employee.imageUrl}
                    showHeatmap={false}
                    heatmapStyle="gradient"
                    heatmapMode="performance"
                    visibleColumns={visibleColumns}
                    gender={employee.gender}
                    city={employee.city}
                    maritalStatus={employee.maritalStatus}
                    performance={employee.performance}
                    iq={employee.iq}
                    heatmapRanges={heatmapRanges}
                    readinessScore={employee.readinessScore}
                    employeeId={employee.id}
                    allEmployees={allEmployees}
                    readinessScoreRanges={readinessScoreRanges}
                    onClick={() => onEmployeeClick(employee)}
                  />
                </div>
              </div>
            </div>

            {/* Connector Line from employee to successors */}
            {successors.length > 0 && (
              <div className="w-0.5 h-12 bg-gray-300" />
            )}

            {/* Successors Row */}
            {successors.length > 0 && (
              <div className="relative">
                {/* Horizontal connector for multiple successors */}
                {successors.length > 1 && (
                  <svg 
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{ 
                      top: '-32px',
                      width: `${(successors.length - 1) * 133 + 109}px`,
                      height: '32px'
                    }}
                  >
                    {/* Horizontal line */}
                    <line
                      x1="54.5"
                      y1="0"
                      x2={`${(successors.length - 1) * 133 + 54.5}`}
                      y2="0"
                      stroke="#d1d5db"
                      strokeWidth="2"
                    />
                    {/* Vertical lines to each successor */}
                    {successors.map((_, index) => (
                      <line
                        key={index}
                        x1={`${54.5 + index * 133}`}
                        y1="0"
                        x2={`${54.5 + index * 133}`}
                        y2="32"
                        stroke="#d1d5db"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>
                )}

                <div className="flex items-start gap-6">
                  {successors.map((successor, index) => (
                    <div key={successor.id} className="flex flex-col items-center gap-2">
                      <div className="relative">
                        {(() => {
                          const percentage = getPromotionReadinessPercentage(successor);
                          const tagColor = getTagColor(percentage);
                          // Always show readiness tag for successors (both direct and manual)
                          const showTag = percentage > 0;
                          
                          return showTag && (
                            <div 
                              className="mb-1 px-2 py-0.5 border rounded-full bg-white z-20 text-[8px] flex items-center gap-1 absolute -top-7 left-1/2 -translate-x-1/2"
                              style={{ borderColor: tagColor }}
                            >
                              {successor.activeIDP && (
                                <TrendingUp 
                                  className="w-[10px] h-[10px]" 
                                  style={{ color: tagColor }}
                                  strokeWidth={2.5}
                                />
                              )}
                              <span 
                                className="font-['Open_Sans',_sans-serif] text-[8px] font-bold font-normal"
                                style={{ color: tagColor }}
                              >
                                {percentage}%
                              </span>
                            </div>
                          );
                        })()}
                        <OrgChartCard
                          name={successor.name}
                          position={successor.position}
                          jobTitle={successor.jobTitle}
                          competencyScore={successor.competencyScore}
                          successors={allEmployees.filter(e => e.managerId === successor.id).length}
                          imageUrl={successor.imageUrl}
                          showHeatmap={false}
                          heatmapStyle="gradient"
                          heatmapMode="performance"
                          visibleColumns={visibleColumns}
                          gender={successor.gender}
                          city={successor.city}
                          maritalStatus={successor.maritalStatus}
                          performance={successor.performance}
                          iq={successor.iq}
                          heatmapRanges={heatmapRanges}
                          readinessScore={successor.readinessScore}
                          employeeId={successor.id}
                          allEmployees={allEmployees}
                          readinessScoreRanges={readinessScoreRanges}
                          onClick={() => onEmployeeClick(successor)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

