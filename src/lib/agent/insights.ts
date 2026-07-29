export type InsightSeverity = "critical" | "warning" | "info";
export type InsightCategory = "idp-overdue" | "succession-risk" | "profile-completeness";

export interface InsightNavigationTarget {
  href: string;
  label: string;
}

export interface InsightEvidence {
  sourceIds: string[];
  computedAt: string;
  basis: string;
}

/**
 * `evidence` is intentionally non-optional: an insight-computation function
 * that can't populate real sourceIds/basis must not emit the insight at all
 * — this is what turns "never fabricate a proactive claim" into a type-level
 * invariant instead of a review checklist item.
 */
export interface Insight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  title: string;
  message: string;
  evidence: InsightEvidence;
  navigationTarget?: InsightNavigationTarget;
}
