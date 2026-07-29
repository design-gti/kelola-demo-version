import { activityLog, syncSystems, type ActivityEntry, type SyncSystem } from "@/data/dummyData";

/** Thin passthroughs so no Client Component ever imports dummyData.ts directly for these. */
export function getActivityLog(): ActivityEntry[] {
  return activityLog;
}

export function getSyncSystems(): SyncSystem[] {
  return syncSystems;
}
