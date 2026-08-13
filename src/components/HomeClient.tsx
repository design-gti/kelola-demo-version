"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ActionIcon } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import TopHeading from "@/components/TopHeading";
import BannerInsight from "@/components/BannerInsight";
import DraggableCardWrapper from "@/components/DraggableCardWrapper";
import AspectScoreCard from "@/components/AspectScoreCard";
import EmployeeMapping, { type CellData } from "@/components/EmployeeMapping";
import LineChartCard from "@/components/LineChartCard";
import ProfileCompletion from "@/components/ProfileCompletion";
import ScaleWrapper from "@/components/ScaleWrapper";
import { useDashboardConfig, CardConfig } from "@/hooks/useDashboardConfig";
import { useCardDrag } from "@/hooks/useCardDrag";
import SettingsPanel from "@/components/SettingsPanel";
import RoleSwitcher from "@/components/RoleSwitcher";
import CommitteeReadinessCard from "@/components/cards/CommitteeReadinessCard";
import CriticalPositionRiskCard from "@/components/cards/CriticalPositionRiskCard";
import ProfileCompletenessTrackerCard from "@/components/cards/ProfileCompletenessTrackerCard";
import DataHealthIndicatorCard from "@/components/cards/DataHealthIndicatorCard";
import QuickProfileAccessCard from "@/components/cards/QuickProfileAccessCard";
import OverallScoreCard from "@/components/cards/OverallScoreCard";
import SyncStatusCard from "@/components/cards/SyncStatusCard";
import ActivityLogCard from "@/components/cards/ActivityLogCard";
import MonitoringIDPCard from "@/components/cards/MonitoringIDPCard";
import TeamSummaryCard from "@/components/cards/manager/TeamSummaryCard";
import EarlySignalRadarCard from "@/components/cards/manager/EarlySignalRadarCard";
import WorkloadMapCard from "@/components/cards/manager/WorkloadMapCard";
import PerformanceMomentumCard from "@/components/cards/manager/PerformanceMomentumCard";
import SupportNeedsCard from "@/components/cards/manager/SupportNeedsCard";
import ManagerHealthCard from "@/components/cards/manager/ManagerHealthCard";
import type { UserRole } from "@/lib/role";
import type { Candidate, SyncSystem, ActivityEntry } from "@/data/dummyData";
import type {
  ProfileCompletionSummary,
  SuccessionRiskSummary,
  EmployeeDevelopmentSummary,
  SuccessionRiskPosition,
} from "@/lib/data/types";
import { MANAGER_EXCLUDED_CARDS } from "@/lib/dashboardCardVisibility";

const performanceData = [3.5, 3.3, 3.2, 3.18, 3.18];
const engagementData  = [3.3, 3.1, 3.18, 3.0, 3.0];

interface HomeClientProps {
  role: UserRole;
  pool: Candidate[];
  completion: ProfileCompletionSummary;
  successionRiskSummary: SuccessionRiskSummary;
  needDevelopmentSummary: EmployeeDevelopmentSummary;
  syncSystems: SyncSystem[];
  defaultQuickAccess: Candidate[];
  managerAspects: { label: string; below: number; meet: number; exceed: number }[] | null;
  /** Always computed server-side (getTalentMappingCells for HR, managerMappingCells for a manager). */
  mappingCells: CellData[];
  criticalPositions: SuccessionRiskPosition[] | null;
  activityLog: ActivityEntry[] | null;
}

export default function HomeClient({
  role,
  pool,
  completion,
  successionRiskSummary,
  needDevelopmentSummary,
  syncSystems,
  defaultQuickAccess,
  managerAspects,
  mappingCells,
  criticalPositions,
  activityLog,
}: HomeClientProps) {
  const isManager = role === "manager";
  const [settingsOpen, setSettingsOpen] = useState(false);
  const storageKey = isManager ? "dashboard-card-config-manager-v1" : "dashboard-card-config-v5";
  const { cards: allCards, toggle, insertAt } = useDashboardConfig(storageKey, isManager);
  const cards = isManager
    ? allCards.filter(c => !MANAGER_EXCLUDED_CARDS.has(c.id))
    : allCards;

  // Kartu yang ikut dipindai saat menggeser: hanya yang duduk di dalam kolom.
  // Banner dan Profile Completion berdiri di luar kolom, jadi tidak bisa jadi
  // tujuan sisip.
  const scanCards = cards
    .filter(c => c.enabled && c.id !== "banner" && c.id !== "profile-completion")
    .map(c => ({ id: c.id, col: c.col as number }));

  const {
    dragId, ghostPos, ghostDims, insertInfo, mounted,
    onHandleMouseDown, registerCard, registerColumn, insertLineFor,
  } = useCardDrag({
    columnCount: 3,
    cards: scanCards,
    onDrop: (id, targetCol, insertBeforeId) => insertAt(id, targetCol as 0 | 1 | 2, insertBeforeId),
  });

  // ── Card renderer ──────────────────────────────────────────────────────────
  function renderCard(id: string) {
    switch (id) {
      case "banner":                 return <BannerInsight
        layers={isManager ? [
          { src: "/mbanner-layer-1.svg", depth: 8  },
          { src: "/mbanner-layer-2.svg", depth: 16 },
          { src: "/mbanner-layer-3.svg", depth: 26 },
        ] : undefined}
        hideSuccession={isManager}
        successionRisk={{ atRisk: successionRiskSummary.positionsAtRisk, total: successionRiskSummary.positionsTotal }}
        needDevelopment={{ count: needDevelopmentSummary.needingDevelopment.length, total: needDevelopmentSummary.total }}
      />;
      case "profile-completion":     return <ProfileCompletion completion={completion} />;
      case "performance-chart":      return <LineChartCard title={isManager ? "Team Avg. Performance Score" : "Avg. Performance Score"} value="3.18" chipColor="#016699" data={performanceData} areaColor="#016699" lineColor="#016699" hideDeptFilter={isManager} />;
      case "engagement-chart":       return <LineChartCard title={isManager ? "Team Avg. Engagement Score"  : "Avg. Engagement Score"}  value="3.18" chipColor="#fd9f28" data={engagementData}  areaColor="#fd9f28" lineColor="#fd9f28" hideDeptFilter={isManager} />;
      case "aspect-score":           return <AspectScoreCard title={isManager ? "Team Aspect Score Percentage" : "Percentage of Aspect Score"} hideDeptFilter={isManager} customAspects={managerAspects ?? undefined} />;
      case "employee-mapping":       return <EmployeeMapping title={isManager ? "Team Mapping" : "Employee Mapping"} cells={mappingCells} axisY={isManager ? "Competency" : undefined} />;
      case "committee-readiness":    return <CommitteeReadinessCard candidates={pool} />;
      case "critical-position-risk": return criticalPositions ? <CriticalPositionRiskCard positions={criticalPositions} /> : null;
      case "profile-completeness":   return <ProfileCompletenessTrackerCard title={isManager ? "Team Profile Completeness Tracker" : "Profile Completeness Tracker"} employees={pool} />;
      case "data-health-indicator":  return <DataHealthIndicatorCard employees={pool} syncSystems={syncSystems} />;
      case "quick-profile-access":   return <QuickProfileAccessCard employees={pool} defaultResults={defaultQuickAccess} />;
      case "overall-score":          return <OverallScoreCard candidates={pool} />;
      case "sync-status":            return <SyncStatusCard syncSystems={syncSystems} />;
      case "activity-log":           return activityLog ? <ActivityLogCard activityLog={activityLog} /> : null;
      case "monitoring-idp":         return <MonitoringIDPCard maxEntries={isManager ? 6 : undefined} />;
      case "team-summary":           return <TeamSummaryCard />;
      case "early-signal-radar":     return <EarlySignalRadarCard />;
      case "workload-map":           return <WorkloadMapCard />;
      case "performance-momentum":   return <PerformanceMomentumCard />;
      case "support-needs":          return <SupportNeedsCard />;
      case "manager-health":         return <ManagerHealthCard />;
      default: return null;
    }
  }


  // ── Layout ─────────────────────────────────────────────────────────────────
  const enabledCards          = cards.filter(c => c.enabled);
  const bannerEnabled         = enabledCards.find(c => c.id === "banner");
  const profileCompletionEnabled = enabledCards.find(c => c.id === "profile-completion");
  const otherCards            = enabledCards.filter(c => c.id !== "banner" && c.id !== "profile-completion");

  // Columns filtered by explicit col property (order preserved by array position)
  const col0 = otherCards.filter(c => c.col === 0);
  const col1 = otherCards.filter(c => c.col === 1);
  const col2 = otherCards.filter(c => c.col === 2);

  // ── Column renderer ────────────────────────────────────────────────────────
  function renderColumn(colCards: CardConfig[], colIdx: 0 | 1 | 2) {
    // Kartu terakhir di kolom — penanda "sisipkan di paling bawah".
    const lastId = dragId ? colCards.filter(c => c.id !== dragId).slice(-1)[0]?.id : undefined;

    return colCards.map(c => (
      <DraggableCardWrapper
        key={c.id}
        ref={registerCard(c.id)}
        id={c.id}
        isDragging={dragId === c.id}
        showInsertLine={insertLineFor(c.id, colIdx, lastId)}
        onHandleMouseDown={onHandleMouseDown}
      >
        {renderCard(c.id)}
      </DraggableCardWrapper>
    ));
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {mounted && dragId && ghostPos && ghostDims && createPortal(
        <div style={{
          position:        "fixed",
          left:            ghostPos.x,
          top:             ghostPos.y,
          width:           ghostDims.w,
          height:          ghostDims.h,
          overflow:        "hidden",
          borderRadius:    8 * ghostDims.scale,
          zIndex:          9999,
          pointerEvents:   "none",
          transform:       "rotate(1.5deg) scale(1.01)",
          transformOrigin: "top center",
          boxShadow:       "0 20px 52px rgba(0,0,0,0.2), 0 6px 16px rgba(0,0,0,0.1)",
          opacity:         0.93,
          willChange:      "transform",
        }}>
          <div style={{
            width:           ghostDims.w / ghostDims.scale,
            transform:       `scale(${ghostDims.scale})`,
            transformOrigin: "top left",
            pointerEvents:   "none",
          }}>
            {renderCard(dragId)}
          </div>
        </div>,
        document.body
      )}

      <ActionIcon
        onClick={() => setSettingsOpen(true)}
        variant="filled"
        color="primary"
        radius="xl"
        size={40}
        aria-label="Pengaturan dashboard"
        style={{
          position: "fixed", right: 24, top: 16, zIndex: 30,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <IconSettings size={20} stroke={2} />
      </ActionIcon>

      {/* Role switcher — bottom-left */}
      <RoleSwitcher initialRole={role} />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        cards={cards}
        onToggle={toggle}
        renderCard={renderCard}
      />

      <ScaleWrapper>
        <div className="bg-[#f8f9fa] min-h-screen">
          <div className="bg-[#f8f9fa] h-[54px] px-4">
            <TopHeading />
          </div>

          <div className="px-4 pb-8">
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

              {/* Left 2/3 */}
              <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
                {bannerEnabled && renderCard("banner")}
                {(col0.length > 0 || col1.length > 0) && (
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div ref={registerColumn(0)} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0, minHeight: 60 }}>
                      {renderColumn(col0, 0)}
                    </div>
                    <div ref={registerColumn(1)} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0, minHeight: 60 }}>
                      {renderColumn(col1, 1)}
                    </div>
                  </div>
                )}
              </div>

              {/* Right 1/3 */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
                {/* Pinned — tidak bisa di-drag */}
                {profileCompletionEnabled && <ProfileCompletion completion={completion} />}
                {/* Draggable col2 cards */}
                <div ref={registerColumn(2)} style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0, minHeight: 60 }}>
                  {renderColumn(col2, 2)}
                </div>
              </div>

            </div>
          </div>
        </div>
      </ScaleWrapper>
    </>
  );
}
