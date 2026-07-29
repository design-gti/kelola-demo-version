import { candidates } from "@/data/dummyData";
import { matchesFuzzy } from "./textMatch";
import type { PositionHolderResult } from "./types";

/**
 * "Who currently holds position X" — distinct from getCriticalPositions()
 * (metrics.ts), which tracks *future* successors for a small hand-curated
 * list of critical roles, never who's actually in the seat today. Matches
 * by full/partial title or acronym, so "CEO" finds "Chief Executive Officer".
 */
export function findPositionHolders(query: string): PositionHolderResult {
  const matches = candidates
    .filter(c => matchesFuzzy(c.position, query))
    .map(c => ({ candidateId: c.id, name: c.name, position: c.position, department: c.department }));
  return { query, matches };
}
