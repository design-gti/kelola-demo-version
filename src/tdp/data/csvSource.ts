// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
// Raw CSV text for TDP employees, injected at bootstrap (main.tsx) BEFORE the app
// module graph is dynamically imported — so tdpEmployees.ts can read it synchronously
// at module-eval time (preserving CSV_RAW_HEADERS + the column-defs derived from it).
export let rawCsv = '';
export function setRawCsv(text: string): void {
  rawCsv = text;
}
