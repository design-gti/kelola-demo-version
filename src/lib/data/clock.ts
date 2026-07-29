/**
 * Single source of truth for "today" across computed metrics — replaces the
 * disagreeing hardcoded TODAY constants that used to live independently in
 * CommitteeReadinessCard ("2026-06-25") and ProfileCompletion ("2026-07-02"),
 * both stale relative to the real date and disagreeing with each other.
 * NEXT_PUBLIC_DEMO_TODAY lets the whole app be pinned to a fixed demo date
 * when needed, without reintroducing scattered hardcoded constants.
 */
export function getToday(): Date {
  const pinned = process.env.NEXT_PUBLIC_DEMO_TODAY;
  return pinned ? new Date(pinned) : new Date();
}
