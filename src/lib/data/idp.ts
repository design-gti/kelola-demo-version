import { readFile } from "node:fs/promises";
import path from "node:path";
import { getToday } from "./clock";

export type IdpStatus = "In Progress" | "Expired" | "Need Review" | "Completed";

export interface IdpEntry {
  id: number;
  name: string;
  position: string;
  status: IdpStatus;
  dueDate: string;
  aspect: string;
}

interface IdpProgram { statusLabel: string; period: string; aspectLabel: string }
interface IdpEmployee { id: number; name: string; role: string; idps: IdpProgram[] }

// "Jan 15 - Feb 28, 2025" / "Dec 5, 2024 - Mar 11, 2025" → ISO end date
function periodEnd(period: string): string {
  const end = (period || "").split(" - ")[1] ?? period;
  const d = new Date(end);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function statusOf(idps: IdpProgram[]): IdpStatus {
  const labels = idps.map(i => (i.statusLabel || "").toUpperCase());
  if (labels.includes("PENDING")) return "Need Review";
  if (labels.includes("IN PROGRESS")) return "In Progress";
  return "Completed";
}

function toEntries(employees: IdpEmployee[], today: Date): IdpEntry[] {
  return employees.map(e => {
    const active = e.idps.find(i => (i.statusLabel || "").toUpperCase() !== "DONE") ?? e.idps[0];
    const dueDate = active ? periodEnd(active.period) : "";
    let status = statusOf(e.idps);
    // A not-yet-Completed program whose period has already ended is Expired —
    // mirrors MonitoringIDPCard.tsx's own status upgrade (see module comment
    // below), not just an "overdue" tag layered on top of an unrelated status.
    if (status !== "Completed" && isOverdue(dueDate, today)) status = "Expired";
    return {
      id: e.id,
      name: e.name,
      position: e.role,
      status,
      dueDate,
      aspect: active?.aspectLabel ?? "",
    };
  });
}

/**
 * Server-side reader for the same public/data/idp-data.json that
 * MonitoringIDPCard.tsx fetches client-side — the single source both should
 * agree on. Regenerated at dev/build time by scripts/align-idp-data.mjs.
 */
export async function getIdpEntries(): Promise<IdpEntry[]> {
  const filePath = path.join(process.cwd(), "public/data/idp-data.json");
  const text = await readFile(filePath, "utf-8");
  const parsed: { employees: IdpEmployee[] } = JSON.parse(text);
  return toEntries(parsed.employees ?? [], getToday());
}

export function isOverdue(dateStr: string, today: Date): boolean {
  return !!dateStr && new Date(dateStr) < today;
}

export interface IdpStatusSummary {
  total: number;
  byStatus: Record<IdpStatus, number>;
  overdue: { id: number; name: string; position: string; aspect: string; dueDate: string }[];
  asOf: string;
}

export async function getIdpStatusSummary(): Promise<IdpStatusSummary> {
  const entries = await getIdpEntries();
  const today = getToday();
  const byStatus: Record<IdpStatus, number> = { "In Progress": 0, "Expired": 0, "Need Review": 0, "Completed": 0 };
  entries.forEach(e => { byStatus[e.status]++; });

  const overdue = entries
    .filter(e => e.status === "Expired")
    .map(e => ({ id: e.id, name: e.name, position: e.position, aspect: e.aspect, dueDate: e.dueDate }));

  return { total: entries.length, byStatus, overdue, asOf: today.toISOString() };
}
