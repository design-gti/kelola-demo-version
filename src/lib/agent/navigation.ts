/**
 * Pure URL builders for every navigation action the assistant can take.
 * Kept separate from CopilotProvider.tsx so the URL contracts are testable
 * without React/CopilotKit — verified live against the real app in Phase 0:
 * /vismap's tab|highlight|simulate params, /talent-mapping's box param,
 * /team-profile's team|tab params, /tdp-view's tab|from params.
 */

export function vismapUrl(opts: {
  tab?: "succession-risk" | "need-develop";
  highlight?: string;
  simulateTargetPosition?: string;
} = {}): string {
  const params = new URLSearchParams();
  if (opts.tab) params.set("tab", opts.tab);
  if (opts.highlight) params.set("highlight", opts.highlight);
  if (opts.simulateTargetPosition) {
    params.set("simulate", "true");
    params.set("targetPosition", opts.simulateTargetPosition);
  }
  const qs = params.toString();
  return `/vismap${qs ? `?${qs}` : ""}`;
}

export function tdpUrl(opts: { tab?: "table" | "review"; from?: string } = {}): string {
  const params = new URLSearchParams();
  if (opts.tab) params.set("tab", opts.tab);
  if (opts.from) params.set("from", opts.from);
  const qs = params.toString();
  return `/tdp-view${qs ? `?${qs}` : ""}`;
}

/**
 * Weaker than the others — verified in Phase 0 that most /idp static pages
 * ignore forwarded params entirely; only the create-idp pages read
 * aspect/participants. `page` is the only param that reliably does anything.
 */
export function idpUrl(opts: { page?: string; id?: string; name?: string } = {}): string {
  const params = new URLSearchParams();
  if (opts.page) params.set("page", opts.page);
  if (opts.id) params.set("id", opts.id);
  if (opts.name) params.set("name", opts.name);
  const qs = params.toString();
  return `/idp${qs ? `?${qs}` : ""}`;
}

export function employeeProfileUrl(opts: { candidateId: string; from?: "tdp" | "vismap" }): string {
  const params = new URLSearchParams();
  params.set("id", opts.candidateId);
  if (opts.from) params.set("from", opts.from);
  return `/iprofile?${params.toString()}`;
}

export function talentMappingUrl(opts: { box?: number; highlight?: string } = {}): string {
  const params = new URLSearchParams();
  if (opts.box != null) params.set("box", String(opts.box));
  if (opts.highlight) params.set("highlight", opts.highlight);
  const qs = params.toString();
  return `/talent-mapping${qs ? `?${qs}` : ""}`;
}

export function teamProfileUrl(opts: { teamId?: string; tab?: "overview" | "interaction"; highlight?: string } = {}): string {
  const params = new URLSearchParams();
  if (opts.teamId) params.set("team", opts.teamId);
  if (opts.tab) params.set("tab", opts.tab);
  if (opts.highlight) params.set("highlight", opts.highlight);
  const qs = params.toString();
  return `/team-profile${qs ? `?${qs}` : ""}`;
}
