/**
 * Employee list for the iProfile "Employee List" landing table.
 * DERIVED from the canonical dataset (public/data/participants.csv via the store /
 * `candidates`) so the list shows the same WC people as the rest of the demo, and
 * clicking a row opens /iprofile?id=<p-id> → the matching canonical profile.
 * email/level/joinDate are deterministic stand-ins (not part of the canonical CSV).
 */
import { candidates } from "@/data/dummyData";

export interface IProfileEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  level: string;
  joinDate: string; // DD/MM/YYYY
}

const slug = (name: string) =>
  name.toLowerCase().normalize("NFD").replace(/[^\w\s]/g, "").trim().replace(/\s+/g, ".");

function levelOf(position: string): string {
  const p = position.toLowerCase();
  if (p.includes("chief") || p.includes("ceo")) return "C-Level";
  if (p.startsWith("vp") || p.includes("head")) return "Head";
  if (p.includes("lead") || p.includes("manager") || p.includes("controller")) return "Manager";
  if (p.includes("senior")) return "Senior Officer";
  return "Officer";
}

export const iprofileEmployees: IProfileEmployee[] = candidates.map((c, i) => ({
  id: c.id,
  name: c.name,
  email: `${slug(c.name)}@talentlytica.com`,
  department: c.department,
  position: c.position,
  level: levelOf(c.position),
  // deterministic join date (DD/MM/YYYY), spread across recent years
  joinDate: `${String((i % 28) + 1).padStart(2, "0")}/${String((i % 12) + 1).padStart(2, "0")}/20${19 + (i % 6)}`,
}));
