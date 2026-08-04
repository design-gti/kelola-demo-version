# Agentic AI Assistant — Engineering Handoff

Context and tribal knowledge for the in-app AI assistant built on top of the
Kelola HR dashboard demo (branch `agentic-ai-copilotkit`). Written for
whoever picks this up next — read section 1 before touching any code here,
it will save you from re-discovering bugs that already cost real debugging
time once.

## 1. Start here: things that will bite you if you don't know them

These are ranked roughly by how much damage skipping them would cause.

### 1.1 `@copilotkit/runtime` is patched — and the patch is load-bearing

`patches/@copilotkit+runtime+1.63.3-canary.rc-1.patch` is applied
automatically by `patch-package` via the `postinstall` npm script. **Without
it, the assistant does not work at all**, for two reasons found by reading
the package's own bundled `dist/` output (not documented anywhere upstream):

1. The unpatched tool-call wiring is `execute: () => Promise.resolve()` —
   every backend tool call silently no-ops instead of calling the action's
   real handler. All 12 data tools (`getPositionHolder`,
   `getRankedEmployees`, etc.) would return nothing.
2. `BuiltInAgent`'s default `maxSteps` is too low for a normal
   question → tool call → follow-up-answer conversation. The patch raises
   it to 10.

If you ever bump this dependency, `npm install` will fail loudly if the
patch no longer applies cleanly — treat that failure as a prompt to check
whether upstream fixed either bug natively before you touch the patch file.

### 1.2 Several CopilotKit OSS surfaces are dead code in this exact version

Confirmed by direct inspection of the bundled `dist/` JS, not assumption:

- `CopilotChat`'s `instructions` prop (`AssistantPanel.tsx`) does nothing —
  the context field it sets is never read anywhere in the package.
- `CopilotRuntime`'s `middleware.onBeforeRequest` — merely *defining* a
  `middleware` object, regardless of the callback body, crashes the
  runtime's internal "runtime info" discovery request and takes down the
  whole `/api/copilotkit` endpoint. Do not reintroduce it; question capture
  in `route.ts` parses the raw request body instead.
- `useCopilotChat()`'s `visibleMessages` — typed, but `undefined` at actual
  runtime. Caused a live crash the first time thumbs-up was clicked
  (`Cannot read properties of undefined (reading 'findIndex')`).
  `AssistantPanel.tsx` tracks the last question via `onSubmitMessage` +
  a ref instead.
- `PoweredByTag`'s `removeBranding` prop — never wired to anything that
  sets it `true`. The "Powered by CopilotKit" footer is hidden via a CSS
  override (`globals.css`, `.kelola-assistant-chat .poweredBy`) since no
  supported prop turns it off in this version.

### 1.3 The system prompt is injected by wrapping `fetch`, not passed normally

`route.ts` registers no explicit `agents` map, so
`CopilotRuntime.handleServiceAdapter()` builds its default agent from
`serviceAdapter.getLanguageModel()` — **not** the adapter's own `.process()`
method (dead code on this path). `getLanguageModel()` builds a Vercel AI SDK
model via `@ai-sdk/openai`'s `createOpenAI()`, which — confirmed by
inspecting the raw outgoing HTTP body — calls OpenAI's **Responses API**
(`model/input/tools/tool_choice/stream` fields, no `messages` array).
Combined with 1.2's dead `instructions` prop, there was no supported way to
get `ASSISTANT_INSTRUCTIONS` (`src/lib/agent/instructions.ts`) to the model.

The fix, in `src/lib/agent/llmClients.ts`: wrap the SDK client's `fetch`
option — the one thing `getLanguageModel()` actually forwards into
`createOpenAI()`/`createAnthropic()` — and intercept the raw outgoing JSON
body to set `instructions` (OpenAI Responses API) or `system` (Anthropic)
directly. This is deliberately not a generic reusable pattern; it exists
only because the documented ways don't work in this package version.

### 1.4 CopilotKit's anonymous telemetry can add ~20+ seconds per request

Confirmed by direct before/after measurement: `/api/copilotkit` requests
took a consistent ~22.6s even when already compiled and warm, dropping to
~5.2s (genuine OpenAI network latency, not a bug) once telemetry was
disabled. Fix: `COPILOTKIT_TELEMETRY_DISABLED=true` is set in `.env.local`.

**This must also be set as an environment variable on whatever platform
this gets deployed to** (e.g. Vercel Project Settings) — `.env.local` never
ships. If chat responses regress to ~20+ seconds after a deploy, check this
first before assuming a code regression.

### 1.5 Turbopack dev-mode compiles each route on first visit — this is normal

Seen directly: a 35-line page (`/idp`) and a 42-line API route
(`/api/session`) each took 7-13 seconds to compile on a *fresh* dev server
restart — proving it's not about any specific route's code complexity, it's
Turbopack's on-demand-per-route compile cost for this project's dependency
graph (grew substantially when the CopilotKit + AI SDK stack landed in the
shared root layout). It gets much worse — 60+ seconds for one route — when
several not-yet-visited tabs are clicked in quick succession right after
starting the dev server, since the concurrent first-compiles contend for
the same compiler. **This is dev-only** — confirmed via `npm run build`:
compiles clean in ~20s, typechecks in ~15s, and all 16 routes serve
correctly under `next start`, with none of the per-route dev-mode compile
delay described above.

Separately (unrelated to the above, smaller, still worth doing): 8 orphaned
Figma-export files (~352KB, zero references anywhere) still sit in
`src/iprofile/imports/` — confirmed dead, never deleted. They do not
explain the compile-time issue above (verified: the slow routes don't even
import that directory), just dead weight.

## 2. Architecture

```
CopilotProvider.tsx (root layout, "use client", mounted once)
 ├─ NavigationActions()   — useFrontendTool: navigateHome, openVismap,
 │                          openTDP, openIDP, openEmployeeProfile,
 │                          openTalentMapping, openTeamProfile.
 │                          Frontend-only because only the browser has a
 │                          router/DOM. Descriptions repeat "only call this
 │                          if the user explicitly asks to navigate" — a
 │                          single system-prompt note wasn't reliable enough
 │                          to stop the model chaining navigation after a
 │                          data answer on its own.
 └─ DataToolCards()       — useRenderToolCall, same 12 tool names as the
                            backend (below). Supplies ONLY the card UI
                            (with a "go there →" button); execution happens
                            server-side. router.prefetch() fires as soon as
                            the card renders, ahead of the click, to hide
                            Next dev-mode's cold-route compile delay.

src/app/api/copilotkit/route.ts (server)
 ├─ session check (src/lib/session) — 401 if no signed cookie
 ├─ rate limit (src/lib/agent/rateLimiter.ts) — 429 if over burst/daily cap
 ├─ question capture (parses raw body, NOT middleware.onBeforeRequest — see 1.2)
 ├─ buildBackendActions() (src/lib/agent/tools.ts) — the 12 data tools,
 │  each calling into src/lib/agent/mediation.ts, never src/lib/data or
 │  src/data/* directly
 └─ CopilotRuntime + OpenAIAdapter/AnthropicAdapter, client built via
    llmClients.ts (see 1.3) — LLM_PROVIDER env var picks which
```

Data tools are registered **twice by design, not duplication-by-accident**:
once server-side (`tools.ts`, owns execution) and once client-side
(`CopilotProvider.tsx`'s `useRenderToolCall`, owns the card UI only, matched
by tool name). If you add a 13th data tool, both sides need an entry.

### Data governance model

- `src/lib/data/` — governed, computed, typed data (real numbers derived
  from fixtures, e.g. `getSuccessionRiskSummary()`), not raw
  `src/data/*` fixtures.
- `src/lib/agent/mediation.ts` — the shaping layer between `src/lib/data`
  and anything LLM-facing. Aggregates/rankings return **bands and names**,
  never raw scores in bulk (DISC always returns the dominant-type label +
  static guidance text, never raw axis numbers).
  **Role-based access restriction is intentionally disabled** — every
  session sees the full data pool regardless of role, per explicit product
  decision. What mediation.ts does is data *shaping*, not access *control*
  — don't assume it enforces per-role visibility if you extend it.
- `src/lib/session/index.ts` — an HMAC-signed cookie naming a role
  (`hr` | `manager`). **This is not real authentication** — no login, no
  password, no identity provider anywhere in this app. It exists so tools
  never trust a client-supplied role (the dashboard's own HR/Manager
  toggle is exactly as spoofable as editing localStorage). Swapping in real
  SSO later only means changing how the session payload is produced, not
  how tools consume it.

## 3. Feature inventory

**Backend data tools** (`src/lib/agent/tools.ts`, mirrored in
`instructions.ts`'s tool-selection guidance): `getSuccessionRiskSummary`,
`getEmployeesNeedingDevelopment`, `getProfileCompletionSummary`,
`getEmployeePersonality`, `getPositionHolder`, `getIdpStatus`,
`getTalentMapping`, `getTeamOverview`, `getDataQualityAlerts`,
`getRankedEmployees`, `getOrgHierarchy`, `getEmployeeRank`. The last two
exist specifically to stop the model from estimating an individual's rank
from a `getRankedEmployees` result it already saw for someone else —
`getEmployeeRank` must be called fresh per named person.

**Navigation tools + URL contracts** (`src/lib/agent/navigation.ts`, pure
URL builders, unit-tested independent of React/CopilotKit): `vismapUrl`
(`tab`, `highlight`, `simulateTargetPosition`), `tdpUrl` (`tab`, `from`),
`idpUrl` (`page`, `id`, `name` — weaker than the others, most static `/idp`
pages ignore forwarded params except create-idp ones), `employeeProfileUrl`
(`candidateId`, `from`), `talentMappingUrl` (`box`, `highlight`),
`teamProfileUrl` (`teamId`, `tab`, `highlight`).

**Highlight-to-component mechanism**: `?highlight=<name>` drives a glowing
outline on the matching element, auto-clearing after 3s
(`HIGHLIGHT_DURATION_MS`). Reused Vismap's pre-existing mechanism for
`getPositionHolder`/`getRankedEmployees`/`getSuccessionRiskSummary` cards;
built equivalent row-highlight mechanisms for Talent Mapping (table row —
the 9-box bubble grid isn't reliable for per-employee targeting) and Team
Profile (member row).

**Onboarding** (`src/hooks/useOnboarding.ts`,
`src/components/assistant/OnboardingGate.tsx` +
`onboardingContent.ts` + `PageIntroBanner.tsx`): first-touch role question,
then a static, human-authored per-page intro — deliberately not
LLM-generated, so first-touch copy stays reviewable and hallucination-free.

**Proactive insights** (`src/hooks/useProactiveInsights.ts`,
`src/app/api/insights`, `InsightToast.tsx`, `InsightsTab.tsx`): triggers on
page-arrival and tab refocus, never a blind interval. Every `Insight`
carries a mandatory `evidence` field — if a code path can't populate real
evidence, it must not emit the insight.

**Thumbs up/down feedback** (`src/app/api/feedback/route.ts`,
`AssistantPanel.tsx`): posts `{question, answer, rating}` to
`logAgentEvent`. Two ways to get a recap, same underlying data: (1)
`scripts/harvest-questions.mjs` parses `[agent-audit]` lines from captured
logs (`vercel logs --json <url>` or a redirected local dev log) and writes
`harvested-feedback.{json,csv}`, reporting thumbs-up (promote to
`scripts/eval/cases.ts` as-is) separately from thumbs-down (needs review);
(2) if `auditStore.ts`'s optional Redis sink is configured, `GET
/api/feedback/export` (an `hr` session only) returns the same recap as a
downloadable CSV directly — no CLI needed. Neither is automatic in the
sense of auto-promoting anything; a human still decides.

**Rate limiting** (`src/lib/agent/rateLimiter.ts`): two independent tiers,
burst (20 requests/minute) and daily (300/day), in-memory and keyed by the
session cookie value. Explicitly **not** a real global limit — Vercel runs
multiple concurrent function instances, so this is best-effort per
instance. Still not wired to the Redis store below — upgrade this before
the app handles real external traffic.

**Audit logging** (`src/lib/agent/auditLog.ts`, `src/lib/agent/auditStore.ts`):
every event is always logged via `console.info("[agent-audit]", ...)`,
which Vercel captures as Runtime Logs — a floor, not a durable trail on its
own (limited retention, ephemeral filesystem). When `UPSTASH_REDIS_REST_URL`
/`UPSTASH_REDIS_REST_TOKEN` (or Vercel's `KV_REST_API_*` equivalents) are
set, every event is *also* persisted to Redis via `next/server`'s `after()`
— fire-and-forget, so it never adds latency to the response the user is
waiting on. `after()` throws when called outside a real request (true for
`scripts/eval/assistant.eval.ts`, which calls `tools.ts` directly) —
`logAgentEvent` gates + swallows that, see its own comment and
`auditLog.test.ts`.

**Eval harness** (`npm run eval:assistant` →
`scripts/eval/{cases,runner,assistant.eval}.ts`, 17 cases as of this
writing): asserts on the tool-call trace (which tool, what args) and
required substrings, never exact LLM phrasing. Imports the real
`ASSISTANT_INSTRUCTIONS` and the real `buildBackendActions` definitions —
never a copy that can drift from what's actually shipped.

## 4. Known limitations / deliberately deferred

- No real SSO/RBAC — see 2's session-model note. Fine for internal
  testing; revisit before real end users.
- In-memory rate limit — still not durable across instances or restarts,
  and not yet reusing the audit log's Redis store; upgrade path noted
  above. The audit trail itself now has a durable option (see 3), but it's
  opt-in and unconfigured by default.
- 8 orphaned Figma-export files in `src/iprofile/imports/` (~352KB, zero
  references) — confirmed dead, not yet deleted.
- Eval test template for non-technical testers — proposed, never built.
- DeepSeek was researched as a cheaper cost-comparison LLM for the eval
  harness only (`DEEPSEEK_API_KEY`, confirmed OpenAI-Chat-Completions
  -compatible with reliable tool-calling) — **not** wired into
  `route.ts`/production. Only `anthropic` and `openai` are live
  `LLM_PROVIDER` choices.
- Groq and Google (Gemini) adapters were evaluated and ruled out for this
  package version specifically — see `route.ts`'s and `.env.example`'s
  comments for the exact protocol bugs found (tool-result handling for
  Groq; dropped tool-return content for Gemini causing every post-tool-call
  turn to error).

## 5. Environment & secrets

See `.env.example` for the full annotated list. Highlights:
`LLM_PROVIDER` (`anthropic` default, or `openai`) picks which adapter
`route.ts` builds and which API key is required; `SESSION_SECRET` signs
the session cookie (any long random string, e.g. `openssl rand -hex 32`);
`COPILOTKIT_TELEMETRY_DISABLED=true` — see 1.4, must be set on the
deployment platform too, not just `.env.local`; `UPSTASH_REDIS_REST_URL`/
`UPSTASH_REDIS_REST_TOKEN` (optional — free tier at upstash.com, or the
Vercel Marketplace "Upstash for Redis" integration, which sets these
automatically) enable the durable audit sink and `GET
/api/feedback/export` described in 3.

## 6. Running & verifying

```bash
npm run dev              # local dev server (Turbopack) — see 1.5 for its quirks
npm test                 # vitest unit tests
npm run eval:assistant   # LLM-in-the-loop eval harness (needs a real API key)
npm run eval:harvest     # parse a captured log file for real question/feedback patterns
```
