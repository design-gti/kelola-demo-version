/**
 * The governed data-access surface. Anything reading HR data on behalf of a
 * user-facing feature (dashboard cards, and later the AI assistant's tools
 * and proactive-insights engine) should import from here — never reach
 * directly into src/data/* or src/vismap/data/* fixture files.
 *
 * Client Components must never import this barrel — not even for
 * `getToday`. Every module re-exported here (except clock.ts) transitively
 * imports a src/data/* fixture, so importing anything from "@/lib/data" in
 * a "use client" file bundles the fixture into the browser regardless of
 * which named export you actually use. Call these functions only from
 * Server Components/Route Handlers/Server Actions, then pass just the
 * result down as a prop. If a client-side file only needs `getToday`,
 * import "@/lib/data/clock" directly instead — it has no fixture import.
 *
 * idp.ts is deliberately NOT re-exported here: it uses node:fs and would
 * break any "use client" component that imports this barrel. Import it
 * directly from "@/lib/data/idp" only in server-only contexts.
 */
export * from "./types";
export * from "./clock";
export * from "./people";
export * from "./metrics";
export * from "./operations";
export * from "./iprofileDirectory";
export * from "./positions";
export * from "./orgHierarchy";
