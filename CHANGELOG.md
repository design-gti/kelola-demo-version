# Changelog

## Agentic AI Assistant (CopilotKit)

An in-app AI assistant for the Kelola HR dashboard: answers questions over
real HR data, navigates users to (and highlights) the specific place that
answers live, walks new users through onboarding, and surfaces proactive
insights. See [docs/agentic-assistant.md](docs/agentic-assistant.md) for
full architecture notes and the non-obvious gotchas found while building
this — read that before extending any of the below.

### Added

- **Assistant chat UI** (`CopilotProvider.tsx`, `AssistantPanel.tsx`) — an
  overlay slide-over panel (not docked, to avoid shrinking the scaled
  dashboard canvas or letterboxing the `/tdp-view`/`/idp` iframes), with a
  floating launcher.
- **12 backend data tools** (`src/lib/agent/tools.ts`): succession risk,
  employees needing development, profile completion, employee personality
  (DISC), position holder lookup, IDP status, talent mapping 9-box, team
  overview, data quality alerts, ranked employees (7 score metrics),
  org hierarchy, and one employee's exact rank. Every tool goes through a
  mediation/banding layer (`src/lib/agent/mediation.ts`) — aggregates and
  rankings return bands and names, never raw scores in bulk.
- **7 navigation tools** (`src/lib/agent/navigation.ts`) with real,
  tested URL contracts: home, Vismap (tab/highlight/simulate), TDP,
  IDP, employee profile, Talent Mapping (box/highlight), Team Profile
  (team/tab/highlight).
- **Navigate-to-component highlighting** — a data-tool card's "go there"
  button doesn't just land on a tab, it highlights the specific
  employee/position/team row with a glowing outline (auto-fades after 3s).
  Extended from Vismap's existing mechanism to new equivalents in Talent
  Mapping (row-level, since the 9-box grid isn't reliably targetable), Team
  Profile, and IDP monitoring (deep-links to the specific overdue
  employee's row in `monitoring-admin.html`, auto-opening their IDP detail
  panel via the existing `openPanelById` mechanism instead of just landing
  on the page).
- **Chat crash recovery** (`ChatErrorBoundary.tsx`) — a render-time error
  inside the assistant chat (e.g. a malformed tool-result card) no longer
  takes down the whole dashboard; the panel shows a "Mulai percakapan baru"
  recovery button instead. Deliberately not exposed as a general-purpose
  "clear chat" button — see docs/agentic-assistant.md for why every OSS
  path to actually resetting chat history in this exact CopilotKit version
  is either type-stripped or Enterprise-licensed, and why remounting on
  crash is an acceptable last resort but remounting on demand is not (it
  duplicates the last exchange instead of clearing it).
- **Governed data foundation** (`src/lib/data/`) — real computed metrics
  (succession risk, profile completion, rankings, org hierarchy) replacing
  several previously-hardcoded dashboard numbers; a `getToday()` clock
  replacing two disagreeing hardcoded "today" constants; an explicit
  crosswalk reconciling the app's separate employee datasets instead of
  silently guessing matches.
- **Lightweight session model** (`src/lib/session`) — an HMAC-signed cookie
  naming the caller's role (hr/manager), issued server-side, so every agent
  tool trusts a signed value instead of the dashboard's spoofable
  client-side role toggle. Explicitly not real authentication — see docs.
- **Onboarding flow** (`useOnboarding`, `OnboardingGate`,
  `PageIntroBanner`) — first-touch role question, then a static,
  human-authored per-page introduction (deliberately not LLM-generated).
- **Proactive insights** (`useProactiveInsights`, `/api/insights`,
  `InsightToast`, `InsightsTab`) — triggers on page arrival and tab
  refocus, three-tier surfacing (badge → toast → ranked list), every
  insight required to carry real evidence or it isn't emitted.
- **Thumbs up/down feedback** on assistant answers, persisted through a new
  `/api/feedback` endpoint into the audit log, so a rating survives beyond
  the chat session instead of only updating local React state.
- **Real-question capture** — every question that reaches the assistant is
  logged (with the tool calls it triggered) via `logAgentEvent`, harvestable
  with `npm run eval:harvest` (`scripts/harvest-questions.mjs`) into
  frequency-ranked clusters and thumbs-up/down reports, as raw material for
  growing `scripts/eval/cases.ts`.
- **Rate limiting** (`src/lib/agent/rateLimiter.ts`) — two independent
  tiers, 20 requests/minute burst and 300/day, keyed by session.
- **Audit logging** (`src/lib/agent/auditLog.ts`) — structured
  `[agent-audit]` JSON lines for every question, tool call, and feedback
  event.
- **Eval harness** (`npm run eval:assistant`) — 17 cases asserting on the
  real tool-call trace and required substrings against the actual shipped
  instructions and tool definitions, never a copy that can drift.
  Includes negative cases asserting the assistant refuses out-of-scope
  questions (general knowledge, politics) with zero tool calls.
- `.env.example` documenting every required/optional secret and which LLM
  providers actually work with this exact `@copilotkit/runtime` version
  (Anthropic and OpenAI confirmed clean; Groq and Google Gemini ruled out
  due to protocol-level bugs in this package version; DeepSeek wired into
  the eval harness only, as a cheaper cost-comparison candidate).
- `docs/agentic-assistant.md` — engineering handoff doc.

### Fixed

- The assistant answering out-of-scope questions (e.g. general
  knowledge/politics) instead of refusing — root cause was a dead
  `CopilotChat` `instructions` prop in this package version silently
  dropping the system prompt, not a prompt-wording or LLM-choice issue.
  Fixed via a `fetch`-wrapping client (`src/lib/agent/llmClients.ts`) that
  injects the prompt directly into the outgoing LLM request. See
  docs/agentic-assistant.md §1.2–1.3 for the full trail.
- All 12 backend tools silently no-op-ing instead of running at all — the
  exact `@copilotkit/runtime` version pinned here ships a stubbed tool
  executor (`execute: () => Promise.resolve()`) that never calls the
  action's real handler. Fixed via `patches/@copilotkit+runtime+*.patch`
  (applied automatically by `patch-package`'s `postinstall` script) — see
  docs/agentic-assistant.md §1.1.
- Thumbs up/down doing nothing on click — `CopilotChat`'s own
  `onThumbsUp`/`onThumbsDown` only mutate local state; also uncovered and
  worked around a second dead API surface (`useCopilotChat()`'s
  `visibleMessages`, typed but `undefined` at runtime) mid-fix.
- A ~20+ second delay added to every `/api/copilotkit` request by
  CopilotKit Runtime's anonymous telemetry beacon — disabled via
  `COPILOTKIT_TELEMETRY_DISABLED=true` (must also be set on the deployment
  platform, not just `.env.local`).
- The "Powered by CopilotKit" footer (no supported prop disables it in this
  version — hidden via CSS) and the assistant chat's font not matching the
  rest of the dashboard (CopilotChat hardcodes its own font stack).
- Several data-correctness bugs found while building the data foundation:
  hardcoded succession-risk/development-needed counts on the home dashboard,
  a profile-completion percentage stuck at a hardcoded value on one branch,
  a CEO-successor contradiction between two components disagreeing on the
  same data, and `/iprofile`'s deep-link `?id=` param being silently
  ignored.
- `getRankedEmployees`/`getEmployeeRank` hallucinating an individual's rank
  from a previously-fetched list instead of calling the dedicated
  single-person tool; position/team name lookups failing on
  singular/plural or hyphen/space mismatches.
- The IDP-overdue insight card and `getIdpStatus`'s "Lihat Monitoring IDP"
  button doing nothing on click — both pointed at
  `/#dashboard-card-monitoring-idp`, a hash anchor with no scroll-to-hash
  implementation anywhere in the app (and a target card that's hidden by
  default for the Manager role). Fixed by pointing both at the real `/idp`
  route via the existing `idpUrl()` helper instead. While auditing this
  class of bug: `MonitoringIDPCard.tsx` was building its own IDP link as a
  raw template string instead of using `idpUrl()`, and `idpUrl()`'s own
  comment (and the `openIDP` tool description shown to the LLM) misnamed
  which static pages actually honor `id`/`name` — both corrected.
- `CommitteeReadinessCard` and `OverallScoreCard` always reading the full,
  unscoped `candidates` list directly from `@/data/dummyData`, so a Manager
  viewing Home saw committee-readiness and overall-score numbers for the
  whole company instead of their own team. Both now take `candidates` as a
  prop, fed from `HomeClient`'s already-role-scoped `pool`.
- 5 eval cases (`idp-status`, `talent-mapping`, `data-quality`,
  `profile-completion`, `development-needed`) that only asserted a tool was
  called, not that its result or the assistant's answer was actually
  correct — strengthened to assert real values against the current fixture
  data (e.g. exact overdue count, exact 9-box distribution).

### Changed

- Assistant response tone — now opens with a short narrative lead-in
  ("Berdasarkan data succession risk saat ini...") instead of stating facts
  with no lead-in, without increasing overall answer length.
- Data-tool cards now prefetch their navigation target as soon as they
  render, ahead of the click, to hide Next.js dev-mode's per-route
  cold-compile delay.
