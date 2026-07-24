// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { Employee, mockEmployees } from './mockEmployees';

// Always use fresh data from CSV — bypass localStorage cache.
// Mirrors the same approach used in TableScreener (loadEmployeeDraft).
export function loadEmployeeDraftEmployees(): Employee[] {
  return mockEmployees;
}
