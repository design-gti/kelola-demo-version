import { candidates } from "@/data/dummyData";
import { getParticipant } from "@/data/model/selectors";
import { matchesFuzzy } from "./textMatch";
import type { PersonRef } from "./types";

export interface OrgHierarchyResult {
  query: string;
  person: PersonRef | null;
  manager: PersonRef | null;
  directReports: PersonRef[];
}

/**
 * "Who is X's manager" / "who reports to X" — managerId already exists on
 * every canonical Participant (@/data/model/types), it just wasn't exposed
 * to the assistant. Matched by full/partial employee name.
 */
export function findOrgHierarchy(query: string): OrgHierarchyResult {
  const match = candidates.find(c => matchesFuzzy(c.name, query));
  if (!match) return { query, person: null, manager: null, directReports: [] };

  const participant = getParticipant(match.id);
  const managerId = participant?.managerId ?? null;
  const managerCandidate = managerId ? candidates.find(c => c.id === managerId) : undefined;
  const directReports = candidates.filter(c => getParticipant(c.id)?.managerId === match.id);

  return {
    query,
    person: { candidateId: match.id, name: match.name, position: match.position, department: match.department },
    manager: managerCandidate
      ? { candidateId: managerCandidate.id, name: managerCandidate.name, position: managerCandidate.position, department: managerCandidate.department }
      : null,
    directReports: directReports.map(c => ({ candidateId: c.id, name: c.name, position: c.position, department: c.department })),
  };
}
