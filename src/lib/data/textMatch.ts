/**
 * Shared fuzzy matcher for user-typed queries against titles, person names,
 * and team names. A plain bidirectional substring check (the previous
 * approach, duplicated independently across positions.ts, metrics.ts,
 * orgHierarchy.ts, and mediation.ts) requires an exact contiguous match, so
 * it silently returns zero results for otherwise-obvious near-misses:
 * singular/plural ("Operation Analyst" vs "Operations Analyst") and
 * hyphen/space variants ("Son Heung Min" vs "Son Heung-min"). Both were
 * real queries that returned nothing before this existed.
 */

function normalizeWord(word: string): string {
  return word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/-/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map(normalizeWord);
}

export function acronym(text: string): string {
  return text.split(/\s+/).map(w => w[0] ?? "").join("").toUpperCase();
}

export function matchesFuzzy(candidate: string, query: string): boolean {
  const c = candidate.toLowerCase();
  const q = query.trim().toLowerCase();
  if (!q) return false;
  if (c.includes(q) || q.includes(c)) return true;
  if (acronym(candidate).toLowerCase() === q) return true;

  // Word-level fallback: tolerant of plural mismatches and hyphen/space
  // variants, since the substring check above requires an exact
  // contiguous run of characters.
  const candidateWords = tokenize(candidate);
  const queryWords = tokenize(q);
  return queryWords.length > 0 && queryWords.every(w => candidateWords.includes(w));
}
