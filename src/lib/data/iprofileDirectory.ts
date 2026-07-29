import { iprofileEmployees, type IProfileEmployee } from "@/data/iprofileEmployees";

/** Thin passthrough so no Client Component ever imports iprofileEmployees.ts directly. */
export function getIProfileEmployees(): IProfileEmployee[] {
  return iprofileEmployees;
}
