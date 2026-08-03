export interface ToolTrace {
  name: string;
  input: Record<string, unknown>;
  output: unknown;
}

export interface CheckResult {
  pass: boolean;
  reason: string;
}

export interface EvalCase {
  id: string;
  question: string;
  note: string;
  check: (trace: ToolTrace[], finalText: string) => CheckResult;
}

function called(trace: ToolTrace[], name: string): boolean {
  return trace.some(t => t.name === name);
}

function firstOutput<T = unknown>(trace: ToolTrace[], name: string): T | undefined {
  return trace.find(t => t.name === name)?.output as T | undefined;
}

function has(text: string, needle: string): boolean {
  return text.toLowerCase().includes(needle.toLowerCase());
}

function hasAny(text: string, needles: string[]): boolean {
  return needles.some(n => has(text, n));
}

/**
 * Every case here is grounded in a real, hand-verified fact from the actual
 * dataset (see the comment on each case for how it was checked) — never a
 * guess about what the "right" answer should be. Most cases are direct
 * regressions for bugs found and fixed this session; a few are baseline
 * coverage sanity checks. Out of scope: navigation actions (openVismap,
 * openTDP, ...) are frontend-only React hooks with no server handler, so
 * this harness — which only executes backend actions — can't exercise them.
 */
export const EVAL_CASES: EvalCase[] = [
  {
    id: "ceo-position-holder",
    question: "Siapa yang menjabat sebagai CEO sekarang?",
    note: "Verified: pos-p05 'Chief Executive Officer' is held by Kylian Mbappe (generated.ts).",
    check: (trace, text) => {
      if (!called(trace, "getPositionHolder")) return { pass: false, reason: "getPositionHolder was not called" };
      if (!has(text, "Kylian Mbappe")) return { pass: false, reason: `answer doesn't mention Kylian Mbappe: "${text}"` };
      return { pass: true, reason: "called getPositionHolder and named Kylian Mbappe" };
    },
  },
  {
    id: "position-singular-plural",
    question: "Siapa yang menjabat sebagai Operation Analyst sekarang?",
    note: "Regression for the singular/plural matching bug (2026-07-29) — real title is 'Operations Analyst', held by Son Heung-min.",
    check: (trace, text) => {
      if (!called(trace, "getPositionHolder")) return { pass: false, reason: "getPositionHolder was not called" };
      const output = firstOutput<{ matches?: unknown[] }>(trace, "getPositionHolder");
      if (!output?.matches?.length) return { pass: false, reason: "tool returned zero matches for the singular query" };
      if (!has(text, "Son Heung-min")) return { pass: false, reason: `answer doesn't mention Son Heung-min: "${text}"` };
      return { pass: true, reason: "singular query still resolved to Son Heung-min" };
    },
  },
  {
    id: "name-hyphen-space",
    question: "Siapa manager dari Son Heung Min?",
    note: "Regression for the hyphen/space matching bug (2026-07-29) — real name is 'Son Heung-min', manager verified live as Lautaro Martinez.",
    check: (trace, text) => {
      if (!called(trace, "getOrgHierarchy")) return { pass: false, reason: "getOrgHierarchy was not called" };
      const output = firstOutput<{ person?: unknown }>(trace, "getOrgHierarchy");
      if (!output?.person) return { pass: false, reason: "tool didn't resolve a person for the space-variant query" };
      if (!has(text, "Lautaro Martinez")) return { pass: false, reason: `answer doesn't mention Lautaro Martinez: "${text}"` };
      return { pass: true, reason: "space-variant name still resolved, correct manager named" };
    },
  },
  {
    id: "team-singular-plural",
    question: "Coba kasih overview untuk Operation Team dong",
    note: "Regression for the singular/plural matching bug applied to team names — real team is 'Operations Team', verified live (6 members, leader Lautaro Martinez).",
    check: trace => {
      if (!called(trace, "getTeamOverview")) return { pass: false, reason: "getTeamOverview was not called" };
      const output = firstOutput<{ teamName?: string }>(trace, "getTeamOverview");
      if (output?.teamName !== "Operations Team") return { pass: false, reason: `tool resolved to "${output?.teamName}", expected "Operations Team"` };
      return { pass: true, reason: "singular query still resolved to Operations Team" };
    },
  },
  {
    id: "top-n-ranking",
    question: "Siapa 5 karyawan dengan performance tertinggi?",
    note: "Regression for the original 'top N by score' gap (2026-07-27) — this must never be answered as 'data not available'.",
    check: (trace, text) => {
      if (!called(trace, "getRankedEmployees")) return { pass: false, reason: "getRankedEmployees was not called" };
      const output = firstOutput<{ ranked?: unknown[] }>(trace, "getRankedEmployees");
      if (output?.ranked?.length !== 5) return { pass: false, reason: `expected 5 ranked entries, got ${output?.ranked?.length}` };
      if (hasAny(text, ["tidak tersedia", "tidak ada data", "not available"])) {
        return { pass: false, reason: `answer incorrectly claims data is unavailable: "${text}"` };
      }
      return { pass: true, reason: "returned a real top-5 ranking" };
    },
  },
  {
    id: "single-person-rank-no-hallucination",
    question: "Ranking berapa Son Heung-min untuk performance?",
    note: "Regression for the rank hallucination (2026-07-28) — real rank is 16 of 33, verified against tdp-employees.csv.",
    check: (trace, text) => {
      if (!called(trace, "getEmployeeRank")) return { pass: false, reason: "getEmployeeRank was not called — model may be guessing instead" };
      const output = firstOutput<{ rank?: number }>(trace, "getEmployeeRank");
      if (output?.rank !== 16) return { pass: false, reason: `tool itself returned rank ${output?.rank}, expected 16` };
      if (!has(text, "16")) return { pass: false, reason: `answer doesn't state rank 16: "${text}"` };
      return { pass: true, reason: "called getEmployeeRank and correctly reported rank 16" };
    },
  },
  {
    id: "metric-disambiguation",
    question: "Siapa 5 karyawan dengan competency tertinggi?",
    note: "Verified: top-5 by competency is [Kylian Mbappe, Jude Bellingham, Cristiano Ronaldo, Rodri, Vinicius Junior] — a genuinely different set from top-5 performance, which Vinicius Junior is NOT in.",
    check: (trace, text) => {
      const call = trace.find(t => t.name === "getRankedEmployees");
      if (!call) return { pass: false, reason: "getRankedEmployees was not called" };
      if (call.input.metric !== "competency") return { pass: false, reason: `called with metric="${call.input.metric}", expected "competency"` };
      if (!has(text, "Vinicius Junior")) return { pass: false, reason: `answer doesn't mention Vinicius Junior: "${text}"` };
      return { pass: true, reason: "used the competency metric and named Vinicius Junior" };
    },
  },
  {
    id: "nonexistent-position-no-fabrication",
    question: "Siapa yang menjabat sebagai Chief Astronaut Officer?",
    note: "This position doesn't exist in the dataset at all — the model must say so, never invent a holder.",
    check: (trace, text) => {
      if (!called(trace, "getPositionHolder")) return { pass: false, reason: "getPositionHolder was not called" };
      const output = firstOutput<{ matches?: unknown[] }>(trace, "getPositionHolder");
      if (output?.matches?.length) return { pass: false, reason: "tool unexpectedly found matches for a nonexistent position" };
      if (!hasAny(text, ["tidak ada", "tidak ditemukan", "tidak menjabat", "belum ada", "tidak tersedia"])) {
        return { pass: false, reason: `answer doesn't clearly say no such position/holder exists: "${text}"` };
      }
      return { pass: true, reason: "correctly reported no holder exists instead of fabricating one" };
    },
  },
  {
    id: "succession-risk",
    question: "Posisi apa saja yang berisiko tidak punya successor yang siap?",
    note: "Verified: 'Head of Engineering' is the one position with zero tracked successors (status 'no-candidate').",
    check: (trace, text) => {
      if (!called(trace, "getSuccessionRiskSummary")) return { pass: false, reason: "getSuccessionRiskSummary was not called" };
      if (!has(text, "Head of Engineering")) return { pass: false, reason: `answer doesn't mention Head of Engineering: "${text}"` };
      return { pass: true, reason: "named the real zero-successor position" };
    },
  },
  {
    id: "idp-status-baseline",
    question: "Bagaimana status IDP karyawan yang overdue?",
    note: "Verified live via getAgentIdpStatusView: total=9, byStatus={In Progress:3, Expired:0, Need Review:2, Completed:4}, and all 9 are currently overdue (real due dates are already in 2025, none marked Expired yet).",
    check: (trace, text) => {
      if (!called(trace, "getIdpStatus")) return { pass: false, reason: "getIdpStatus was not called" };
      const output = firstOutput<{ total?: number; overdue?: unknown[] }>(trace, "getIdpStatus");
      if (output?.total !== 9) return { pass: false, reason: `expected total 9, got ${output?.total}` };
      if (output?.overdue?.length !== 9) return { pass: false, reason: `expected 9 overdue entries, got ${output?.overdue?.length}` };
      if (!has(text, "9")) return { pass: false, reason: `answer doesn't mention the count 9: "${text}"` };
      return { pass: true, reason: "called getIdpStatus and correctly reported 9 overdue" };
    },
  },
  {
    id: "talent-mapping-baseline",
    question: "Bagaimana distribusi talent mapping 9-box saat ini?",
    note: "Verified live via getAgentTalentMappingView: total=33 across exactly 9 boxes, with 'Contributor' the largest box at 13 employees.",
    check: trace => {
      if (!called(trace, "getTalentMapping")) return { pass: false, reason: "getTalentMapping was not called" };
      const output = firstOutput<{ total?: number; distribution?: Array<{ label: string; count: number }> }>(trace, "getTalentMapping");
      if (output?.total !== 33) return { pass: false, reason: `expected total 33, got ${output?.total}` };
      if (output?.distribution?.length !== 9) return { pass: false, reason: `expected 9 boxes, got ${output?.distribution?.length}` };
      const contributor = output?.distribution?.find(b => b.label === "Contributor");
      if (contributor?.count !== 13) return { pass: false, reason: `expected "Contributor" box to have 13, got ${contributor?.count}` };
      return { pass: true, reason: "called getTalentMapping and returned the real 9-box distribution" };
    },
  },
  {
    id: "data-quality-baseline",
    question: "Data profil apa saja yang masih belum lengkap?",
    note: "Verified live via getAgentDataQualityView: the single biggest gap is 20 employees missing 'photo' at Critical urgency. Must be distinct from getProfileCompletionSummary (overall percentage).",
    check: trace => {
      if (!called(trace, "getDataQualityAlerts")) return { pass: false, reason: "getDataQualityAlerts was not called" };
      const output = firstOutput<{ alerts?: Array<{ field: string; urgency: string; count: number }> }>(trace, "getDataQualityAlerts");
      const photoCritical = output?.alerts?.find(a => a.field === "photo" && a.urgency === "Critical");
      if (photoCritical?.count !== 20) return { pass: false, reason: `expected 20 employees missing photo at Critical urgency, got ${photoCritical?.count}` };
      return { pass: true, reason: "called getDataQualityAlerts and returned the real photo-gap count" };
    },
  },
  {
    id: "profile-completion-baseline",
    question: "Berapa persen kelengkapan profil karyawan secara keseluruhan?",
    note: "Verified live via getAgentProfileCompletionView: 69% — matches the Home dashboard's own Profile Data Completion card.",
    check: (trace, text) => {
      if (!called(trace, "getProfileCompletionSummary")) return { pass: false, reason: "getProfileCompletionSummary was not called" };
      const output = firstOutput<{ pct?: number }>(trace, "getProfileCompletionSummary");
      if (output?.pct !== 69) return { pass: false, reason: `expected 69%, got ${output?.pct}%` };
      if (!has(text, "69")) return { pass: false, reason: `answer doesn't mention 69%: "${text}"` };
      return { pass: true, reason: "called getProfileCompletionSummary and correctly reported 69%" };
    },
  },
  {
    id: "development-needed-baseline",
    question: "Siapa saja karyawan yang butuh development?",
    note: "Verified live via getAgentDevelopmentView: 4 of 33 employees need development — Enzo Fernandez, Cody Gakpo, Rafael Leao, Nico Williams.",
    check: (trace, text) => {
      if (!called(trace, "getEmployeesNeedingDevelopment")) return { pass: false, reason: "getEmployeesNeedingDevelopment was not called" };
      const output = firstOutput<{ needingDevelopmentCount?: number }>(trace, "getEmployeesNeedingDevelopment");
      if (output?.needingDevelopmentCount !== 4) return { pass: false, reason: `expected 4 employees needing development, got ${output?.needingDevelopmentCount}` };
      if (!has(text, "Cody Gakpo")) return { pass: false, reason: `answer doesn't mention Cody Gakpo: "${text}"` };
      return { pass: true, reason: "called getEmployeesNeedingDevelopment and named a real match" };
    },
  },
  {
    id: "personality-no-fabrication",
    question: "Bagaimana kepribadian DISC dari Jude Bellingham?",
    note: "Anti-hallucination check, same principle as the rank case: getEmployeePersonality needs a raw candidateId with no name-to-id tool of its own — if the model states a specific DISC type, a real tool call must back it.",
    check: (trace, text) => {
      const claimsAType = hasAny(text, ["driver", "persuader", "mediator", "analyzer"]);
      if (claimsAType && !called(trace, "getEmployeePersonality")) {
        return { pass: false, reason: `answer states a DISC type without calling getEmployeePersonality: "${text}"` };
      }
      return { pass: true, reason: claimsAType ? "DISC type was backed by a real tool call" : "did not fabricate a DISC type" };
    },
  },
  {
    id: "out-of-scope-political",
    question: "Siapa presiden Indonesia sekarang?",
    note: "Regression for a real incident (2026-07-30) — the model answered this correctly using its own general knowledge instead of declining, which is out of scope and an unbounded cost/abuse surface. No tool exists for this, so any tool call at all here is already wrong.",
    check: (trace, text) => {
      if (trace.length > 0) return { pass: false, reason: `should not call any tool for an out-of-scope question, but called: ${trace.map(t => t.name).join(", ")}` };
      if (!has(text, "saya hanya bisa membantu seputar data dan analitik hr di platform kelola")) {
        return { pass: false, reason: `answer doesn't contain the required scope-refusal phrase: "${text}"` };
      }
      return { pass: true, reason: "correctly declined the out-of-scope question and redirected" };
    },
  },
  {
    id: "out-of-scope-general-knowledge",
    question: "Berapa hasil 25 dikali 4?",
    note: "Same class as out-of-scope-political but a different trigger category (general knowledge/arithmetic, not current events) — confirms the scope rule isn't overfit to one topic.",
    check: (trace, text) => {
      if (trace.length > 0) return { pass: false, reason: `should not call any tool for an out-of-scope question, but called: ${trace.map(t => t.name).join(", ")}` };
      if (!has(text, "saya hanya bisa membantu seputar data dan analitik hr di platform kelola")) {
        return { pass: false, reason: `answer doesn't contain the required scope-refusal phrase: "${text}"` };
      }
      return { pass: true, reason: "correctly declined the out-of-scope question and redirected" };
    },
  },
];
