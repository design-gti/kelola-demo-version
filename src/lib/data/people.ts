import { candidates, recentlyViewed, type Candidate } from "@/data/dummyData";
import { matchesFuzzy } from "./textMatch";

export interface PeopleRepository {
  listAll(): Promise<Candidate[]>;
  getById(id: string): Promise<Candidate | null>;
  search(query: string): Promise<Candidate[]>;
}

/**
 * Today: a thin wrapper over the static `candidates` fixture. Callers
 * (metrics.ts, future agent tools) go through this repository rather than
 * importing src/data/dummyData.ts directly, so a later swap to a real
 * API/DB only requires changing this one file's implementation.
 */
export const peopleRepository: PeopleRepository = {
  async listAll() {
    return candidates;
  },
  async getById(id) {
    return candidates.find(c => c.id === id) ?? null;
  },
  async search(query) {
    return candidates.filter(c => matchesFuzzy(c.name, query) || matchesFuzzy(c.position, query));
  },
};

/** Resolves the fixed `recentlyViewed` id list (dummyData.ts) to full candidate records. */
export function getRecentlyViewed(): Candidate[] {
  return recentlyViewed
    .map(id => candidates.find(c => c.id === id))
    .filter((c): c is Candidate => !!c);
}
