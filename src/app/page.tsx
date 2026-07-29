import { candidates } from "@/data/dummyData";
import { managerTeam, managerAspects, managerMappingCells } from "@/data/managerTeamData";
import {
  getSuccessionRiskSummary,
  getEmployeesNeedingDevelopment,
  getProfileCompletion,
  getCriticalPositions,
  getActivityLog,
  getSyncSystems,
  getRecentlyViewed,
} from "@/lib/data";
import { getRole } from "@/lib/role";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const role = await getRole();
  const isManager = role === "manager";
  const pool = isManager ? managerTeam : candidates;

  const completion = getProfileCompletion(pool);
  const successionRiskSummary = getSuccessionRiskSummary();
  const needDevelopmentSummary = getEmployeesNeedingDevelopment(isManager ? managerTeam : undefined);
  const syncSystems = getSyncSystems();
  const defaultQuickAccess = isManager ? managerTeam.slice(0, 5) : getRecentlyViewed().slice(0, 5);

  // Manager-only card data — null for HR so it never crosses the boundary unnecessarily.
  const managerAspectsForRole = isManager ? managerAspects : null;
  const managerMappingCellsForRole = isManager ? managerMappingCells : null;

  // HR-only card data — only computed when the cards that need it would actually render
  // (mirrors MANAGER_EXCLUDED_CARDS), so a manager session never receives it as an unused prop.
  const criticalPositions = isManager ? null : getCriticalPositions();
  const activityLog = isManager ? null : getActivityLog();

  return (
    <HomeClient
      role={role}
      pool={pool}
      completion={completion}
      successionRiskSummary={successionRiskSummary}
      needDevelopmentSummary={needDevelopmentSummary}
      syncSystems={syncSystems}
      defaultQuickAccess={defaultQuickAccess}
      managerAspects={managerAspectsForRole}
      managerMappingCells={managerMappingCellsForRole}
      criticalPositions={criticalPositions}
      activityLog={activityLog}
    />
  );
}
