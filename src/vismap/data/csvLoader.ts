import { Employee } from './orgChartData';
import { generateDevelopmentData } from './developmentData';

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  while (i < line.length) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      current += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ',') {
      values.push(current);
      current = '';
      i++;
      continue;
    }
    current += ch;
    i++;
  }
  values.push(current);
  return values;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(h => h.trim());
  const expectedCols = headers.length;

  return lines.slice(1).map(line => {
    let values = parseCSVLine(line);
    // Handle doubly-escaped rows: some rows in the source CSV are wrapped
    // in outer quotes with all internal quotes escaped (e.g.
    // `"68,46,TRUE,Umi,""CSR Area, Kaltara"",..."`), which a strict CSV
    // parser collapses into a single field. Detect and unwrap.
    if (values.length < expectedCols / 2 && values.length >= 1) {
      values = parseCSVLine(values[0]);
    }

    return headers.reduce((obj, header, i) => {
      obj[header] = (values[i] ?? '').trim();
      return obj;
    }, {} as Record<string, string>);
  });
}

const CAP_COLS = [
  '[CAPABILITY] Analytical Thinking',
  '[CAPABILITY] Collaboration',
  '[CAPABILITY] Decision Making',
  '[CAPABILITY] Developing Others',
  '[CAPABILITY] Influencing',
  '[CAPABILITY] Integrity',
  '[CAPABILITY] Leadership',
  '[CAPABILITY] Planning',
  '[CAPABILITY] Relationship Building',
  '[CAPABILITY] Strategic Thinking',
];

const CAP_NAMES = [
  'Analytical Thinking', 'Collaboration', 'Decision Making', 'Developing Others',
  'Influencing', 'Integrity', 'Leadership', 'Planning', 'Relationship Building', 'Strategic Thinking',
];

export async function loadEmployeesFromCSV(path = '/data/TDP-Vismap-112-Merged.csv'): Promise<Employee[]> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Failed to load CSV: ${response.statusText}`);

  const rows = parseCSV(await response.text());

  // Assign synthetic IDs to rows missing an Employee ID so each renders as a
  // distinct card (otherwise they collide in the lookup Map below).
  let placeholderCounter = 0;
  rows.forEach(row => {
    if (!row['Employee ID']?.trim()) {
      placeholderCounter += 1;
      row['Employee ID'] = `__placeholder_${placeholderCounter}`;
    }
  });

  // Rank employees by Score descending (rank 1 = highest score)
  const sortedByScore = [...rows].sort(
    (a, b) => (parseFloat(b['Score']) || 0) - (parseFloat(a['Score']) || 0)
  );
  const rankMap = new Map<string, number>();
  sortedByScore.forEach((row, i) => rankMap.set(row['Employee ID'], i + 1));

  // Build successor map: targetId â†’ [successorId, successorId, ...]
  // "Successor For Employee ID" = the employee this person is a successor FOR
  const successorMap = new Map<string, string[]>();
  rows.forEach(row => {
    const successorForId = row['Successor For Employee ID']?.trim();
    const employeeId = row['Employee ID']?.trim();
    if (successorForId && employeeId) {
      if (!successorMap.has(successorForId)) successorMap.set(successorForId, []);
      successorMap.get(successorForId)!.push(employeeId);
    }
  });

  return rows.map(row => {
    const id = row['Employee ID'];
    const isPlaceholder = id.startsWith('__placeholder_');
    const numId = isPlaceholder ? 0 : parseInt(id);
    const score = parseFloat(row['Score']) || 0;
    const readiness = row['Readiness'] ? parseFloat(row['Readiness']) : undefined;

    const competencyDetails = CAP_COLS.map((col, i) => ({
      name: CAP_NAMES[i],
      score: parseInt(row[col]) || 0,
    }));
    const hasCapData = competencyDetails.some(d => d.score > 0);

    const managerId = row['Manager ID']?.trim() || undefined;

    // Get successors for this employee (employees who are successors FOR this person)
    const successorIds = successorMap.get(id) ?? [];

    const employee: Employee = {
      id,
      displayId: `EMP${String(numId).padStart(3, '0')}`,
      rank: rankMap.get(id) ?? 0,
      name: row['Name'],
      position: row['Position'],
      jobTitle: row['Department'],
      competencyScore: score,
      successors: successorIds.length,
      successorIds: successorIds.length > 0 ? successorIds : undefined,
      managerId,
      imageUrl: row['Photo URL'] || undefined,
      referenceId: row['Referance ID'] || undefined,
      performanceRating: 3,
      readinessScore: readiness,
      criticalPosition: row['Critical Position'] === 'Yes',
      gender: (row['Gender'] as Employee['gender']) || undefined,
      city: row['City'] || undefined,
      maritalStatus: (row['Marital Status'] as Employee['maritalStatus']) || undefined,
      performance: row['[Performance] Score'] ? parseFloat(row['[Performance] Score']) : undefined,
      iq: row['IQ'] ? parseInt(row['IQ']) : undefined,
      capabilityScore: row['Capability'] ? parseFloat(row['Capability']) : undefined,
      commitmentScore: row['Commitment'] ? parseFloat(row['Commitment']) : undefined,
      contributionScore: row['Contribution'] ? parseFloat(row['Contribution']) : undefined,
      competencyDetails: hasCapData ? competencyDetails : undefined,
    };

    // Generate IDP recommendations (use readiness score, fall back to competency score)
    const devData = generateDevelopmentData(id, readiness ?? score);
    if (!hasCapData) employee.competencyDetails = devData.competencyDetails;
    employee.idpRecommendations = devData.idpRecommendations;

    return employee;
  });
}

