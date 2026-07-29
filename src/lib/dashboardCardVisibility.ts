// Shared between the Server Component (page.tsx, to decide what to compute)
// and the Client Component (HomeClient.tsx, to filter the rendered card
// list) — kept in its own plain module so neither side needs to import
// the other's file just for this one constant.
export const MANAGER_EXCLUDED_CARDS = new Set([
  "committee-readiness",
  "critical-position-risk",
  "overall-score",
  "sync-status",
  "activity-log",
]);
