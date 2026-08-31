# Changelog

## Vismap V3 — Panel Simulation berbasis langkah

Panel simulasi V3 berhenti menumpang `SimulationPanel` V1. Alasannya bukan gaya,
tapi model: V1 memodelkan satu swap sebagai sepasang id kursi lalu menukar field
personal di antaranya — cukup untuk "dua orang tukar kursi", tapi tidak bisa
mengungkapkan langkah yang MENGOSONGKAN kursi, dan tidak bisa menjawab "siapa
yang tergeser". Padahal itu inti panel V3: daftar langkah bernomor, masing-masing
dengan verdict dan daftar konsekuensinya sendiri.

Rinciannya di [docs/vismap-v3.md](docs/vismap-v3.md) — bagian "Model simulasi
V3" untuk aturan konsekuensinya, AC-5.7 dan AC-5.8 untuk acceptance criteria.

### Added

- **Model langkah simulasi** (`src/vismap/v3/simulation.ts`): `Exchange` (dua
  orang bertukar kursi) dan `Cut & Replace` (kandidat mengisi posisi target,
  posisi asalnya jadi kosong, orang yang tergeser keluar dari struktur).
  Penghuni tiap kursi dilacak eksplisit karena `id` menempel pada KURSI, bukan
  pada orang — tanpa itu, fakta berbasis orang seperti `isTalent` menjawab
  tentang orang yang salah begitu ada satu langkah.
- **Konsekuensi per langkah** dalam kalimat, dengan chip subjek (posisi atau
  orang), dari empat aturan: atasan yang kehilangan suksesor siap, talent yang
  tergeser keluar, posisi yang jadi kosong, dan kesiapan orang yang masuk di
  bawah ambang READY. Ambangnya diambil dari range tertinggi Setting Heatmap
  Condition, bukan angka sendiri, supaya artinya sama dengan heatmap kanvas.
- **Panel Simulation V3** (`src/vismap/v3/components/SimulationPanelV3.tsx`):
  langkah bernomor dengan chip verdict Good/At Risk, seksi Consequences yang
  bisa dilipat, tombol Set as Career/Succession Plan per langkah, plus Add
  Simulation Step dan Stop Simulation.
- **Aksi Cut & Replace** di submenu Simulation kini berfungsi (sebelumnya
  placeholder). Exchange dan Cut & Replace sama-sama membuka form langkah dengan
  posisi yang diklik sebagai target dan jenis aksinya terpilih.

### Changed

- Langkah dievaluasi **progresif**: tiap langkah dilihat pada keadaan saat ia
  dijalankan, jadi kotak langkah #2 menyebut orang yang baru duduk di sana
  karena langkah #1 — dan menghapus langkah #1 menghitung ulang seluruh langkah
  sesudahnya beserta konsekuensinya.
- Banner Simulation Mode: teksnya tidak lagi menyuruh "pilih employee di panel
  kiri" (alur V1), dan lebarnya disesuaikan dengan panel 420px milik V3 —
  sebelumnya `right: 300` mengasumsikan panel V1 dan tertutup panel baru.

### Not yet

- **Set as Career/Succession Plan** belum menyimpan apa pun. Bentuk datanya
  ("career plan" itu posisi target? suksesor? urutan langkah?) belum ada di
  store kanonik, jadi tombolnya mengatakan itu apa adanya alih-alih menulis
  tafsiran yang bisa salah.
- **Promote, Mutation, Change Job Criteria** masih placeholder.
- Sisi kanvas dari sketsanya belum dikerjakan: chip `< Previous` (jejak penghuni
  sebelumnya per kursi), pil readiness `?` untuk posisi kosong, dan frame
  putus-putus + pil `SIMULATION MODE` yang menggantikan banner amber sekarang.

## Vismap V3 — Overlay Indikator (arah desain)

V3 tidak lagi sekadar salinan V1: tab view diganti overlay indikator yang bisa
menyala bersamaan di atas SATU struktur organisasi, dan elemen employee
dipisahkan dari card job position sehingga masing-masing punya heatmap sendiri.
Arah desain, peta toggle → elemen, dan acceptance criteria-nya di
[docs/vismap-v3.md](docs/vismap-v3.md) §8.

### Added

- **Lima toggle overlay** (`src/vismap/v3/overlays.ts`) menggantikan tab Default/
  Succession Risk/Need Develop: Succession Risk (heatmap frame job position),
  Need Development (heatmap card employee), Critical Position (ikon alert di
  samping frame), Talent (ikon bintang di card employee), dan %Ready to Promote
  (pil persentase pada garis struktur).
- **Card position + card employee terpisah**
  (`src/vismap/v3/components/OrgChartCardV3.tsx`) — ditulis ulang, bukan lagi
  salinan kartu V1. Dua elemen, dua heatmap, plus chip Teams & Tenure di footer.
- **Menu aksi card position**
  (`src/vismap/v3/components/PositionActionMenu.tsx`) — Simulation, Succession,
  Development, iProfile; Simulation punya submenu Exchange, Cut & Replace,
  Promote, Mutation, dan Change Job Criteria.
- **Judul konteks panel kanan** — `contextLabel` pada `SuccessionPanel` dan
  `EmployeeDetailPanel`: V3 mengirim "Succession"/"Development" supaya user tahu
  panel yang terbuka berasal dari aksi apa. Prop OPSIONAL dan default mati, V1
  tidak mengirimnya sehingga render V1 identik — satu-satunya pengecualian atas
  aturan copy-on-demand, dicatat sebagai amandemen di docs/vismap-v3.md §3.
- **Focus suksesi** — aksi Succession menyalakan indikator SETEMPAT tanpa
  menyentuh toggle: frame posisi yang diklik memakai heatmap Succession Risk, dan
  para calon suksesornya menampilkan pil %Ready to Promote (succession readiness
  terhadap posisi itu). Menyalin perilaku V1 di mode
  Succession Risk saat satu posisi diklik. Selama focus, heatmap succession risk
  EKSKLUSIF milik posisi itu: card position lain padam meski toggle-nya menyala,
  dan kembali menyala begitu focus dilepas — begitu pula pil %Ready to Promote,
  yang selama focus hanya tampil pada calon suksesor posisi itu. Posisi toggle
  sendiri tidak pernah diubah, yang diatur hanya apa yang digambar. Focus berakhir
  saat panel ditutup, card lain dipilih, atau aksi lain dijalankan. Lihat
  docs/vismap-v3.md §8.6.
- **Turunan data** (`src/vismap/v3/employeeFacts.ts`) untuk tiga hal yang tidak
  ada di model Employee Vismap: Talent dari kuadran Star 9-box Talent Mapping
  (`nineBoxIndex`), Teams dari `department`, Tenure dari `joinDate` iProfile
  dihitung terhadap `getToday()` (bukan `new Date()`, supaya ikut terpaku saat
  demo dipin lewat `NEXT_PUBLIC_DEMO_TODAY`).
- **Panel Development V3** (`src/vismap/v3/components/DevelopmentPanelV3.tsx`) —
  aksi Development membuka panel milik V3 sendiri, bukan `EmployeeDetailPanel`
  V1: aspek yang skornya di bawah standar jabatan pembanding dikelompokkan per
  aspek, dan tiap Key Behaviour punya checkbox.
- **Key Behaviour tercentang terbawa ke form Create IDP** — tombol Create IDP
  mengelompokkan KB tercentang per aspek, lalu mengirimnya sebagai param
  `prefill` (base64 dari JSON `[{aspect, goals[]}]`) ke
  `/idp?page=create-idp-admin.html`. Form membuat SATU baris program per aspek
  (baris ke-2 dan seterusnya lewat `addProgram()`, jadi batas 5 baris milik form
  tetap berlaku) dengan Aspect terisi dan Development Goals berisi KB-nya, satu
  KB per baris teks. Param lama `aspect` & `participants` tidak berubah, jadi
  tautan Create IDP dari V1 dan dari monitoring tetap seperti sebelumnya.
  Participant diisi setelah satu macrotask karena sel Participant disuntikkan
  oleh MutationObserver — pada baris yang baru dibuat sel itu belum ada saat
  baris diisi.

### Changed

- **Badge Critical Position & Talent** — ikon jadi **filled** 17–18px di atas
  badge berwarna penuh (merah `#E03131` / teal `#0F9D8F`) dengan cincin putih,
  ditambah **tiga** gelombang radius `animate-ping` yang basisnya melebar keluar
  badge (`-inset` 4/8/12px, jeda 0 / 0,6 / 1,2s). Keduanya menandai satu-dua kartu
  di antara 112 dan kanvas sering dibaca pada zoom 35–45%, jadi sebaran gelombang
  yang luas itulah yang membuat indikator tetap ketemu dari jarak jauh.
  Komponennya `IndicatorBadge` di `OrgChartCardV3.tsx`; tanpa CSS baru karena
  `animate-ping` sudah ada di Tailwind v4.
- **Pil %Ready to Promote** — jadi tipe **filled** dengan teks selalu putih dan
  teks 14px (dari 8px). Latarnya digelapkan dulu sampai teks putih memenuhi
  kontras WCAG 4.5:1 (`pillFillColor`): hijau `#00875A` dan merah `#DE350B` lolos
  apa adanya, oranye `#FD9F28` (kontras 2.07) turun jadi `#A7691A` (kontras 4.50).
  Generik, bukan hardcode per warna, jadi tetap benar kalau range di Setting
  Heatmap Condition diubah.
- **`ReadinessPill` jadi elemen bersama** (`src/vismap/components/ReadinessPill.tsx`)
  — dipakai kanvas V3 (`size="md"`) dan panel Succession (`size="sm"`), termasuk
  pada baris successor yang belum di-expand yang sebelumnya hanya teks persentase.
  Panel memakainya lewat prop opt-in `filledReadinessPill`; V1 tidak mengirimnya
  sehingga chip outline dan teks persentase V1 tetap apa adanya.
- **Pembagian dua ukuran kesiapan dipertegas** (docs/vismap-v3.md §8.2): heatmap
  card employee khusus kesiapan terhadap posisi yang diisi sekarang, pil
  persentase khusus kesiapan terhadap standar posisi di atasnya. Karena itu mode
  focus tidak lagi memberi heatmap pada card employee suksesor.
- **`src/vismap/v3/VismapV3.tsx`** — toolbar memakai toggle overlay; tombol
  `+ Variable` menjadi `Filter Card Data (n)` dengan `n` = jumlah field aktif;
  panel samping tidak lagi ditentukan tab melainkan aksi yang dipilih; modal
  ringkasan Succession Risk / Need Develop kini ikut overlay. `OrgNode` ditulis
  ulang mengikuti model overlay, dan `getCurrentHeatmapRanges` yang jadi mati
  dihapus.

### Notes

- Hanya **Exchange** yang tersambung ke SimulationPanel V1. Cut & Replace,
  Promote, Mutation, dan Change Job Criteria masih placeholder yang memberi tahu
  apa adanya lewat toast — bukan aksi yang tampak berhasil padahal tidak
  mengubah apa pun.
- Chip Teams berisi satu department, bukan dua seperti mockup: store kanonik
  hanya memodelkan satu department per posisi.
- Tema tetap palet terang Kelola, bukan kanvas gelap pada mockup Whimsical, agar
  perbandingan V1 vs V3 apple-to-apple.
- V1 dan V2 tidak disentuh sama sekali pada perubahan ini.

## Vismap V3 (sandbox eksplorasi desain)

Opsi versi ketiga di halaman Visibility Map, disalin dari V1 pada titik awal
yang identik, sebagai ruang eksplorasi desain yang tidak boleh menyentuh V1.
PRD, keputusan arsitektur, dan acceptance criteria-nya di
[docs/vismap-v3.md](docs/vismap-v3.md) — baca dulu sebelum mengubah apa pun
di `src/vismap/v3/`.

### Added

- **`src/vismap/v3/VismapV3.tsx`** — salinan shell V1 (`src/vismap/App.tsx`):
  kanvas pan/zoom, top bar + tab filter, search, kontrol zoom, Simulate, dan
  susunan `OrgNode`. Switch versi dan render V2 dibuang dari salinan (V3 bukan
  host), begitu pula state khusus V2 (`v2Tab`, `v2Layers`).
- **`src/vismap/v3/components/OrgChartCardV3.tsx`** — salinan kartu org chart,
  supaya eksplorasi bentuk kartu tidak mengubah kartu V1.
- Tombol **V3** pada switch versi Vismap (kiri bawah kanvas).

### Changed

- **`src/vismap/App.tsx`** — tetap jadi host: union versinya jadi
  `'v1' | 'v2' | 'v3'`, merender `VismapV3` saat V3 dipilih, dan menyembunyikan
  top bar serta container kanvas V1 di mode V3 (V1 di-hide, bukan di-unmount,
  supaya state dan datanya utuh saat kembali). Masuk ke V3 juga mereset
  `showEmployeeDetail`/`comparisonData` milik V1, karena kedua halaman itu
  dirender di luar container kanvas sehingga `display:none` saja tidak cukup.
  Tidak ada handler atau cabang V1 lain yang diubah.

### Notes

- Isolasi V3 disengaja hanya sampai lapisan shell + kartu. Komponen lain
  (`EmployeeDetail`, `TableView`, `SimulationPanel`, `HeatmapSettings`, seluruh
  modal, dan `components/ui/*`) masih dipakai bersama V1. **Aturannya: begitu
  eksplorasi V3 perlu mengubah salah satunya, salin dulu ke
  `src/vismap/v3/components/` dengan sufiks `V3` dan ubah salinannya — jangan
  pernah mengedit aslinya.**
- Konsekuensi yang diterima sadar: di mode V3, pohon V1 tetap ter-mount di
  belakang (dua pohon kartu hidup sekaligus). Sama seperti perilaku V2 hari ini,
  dan tidak terasa pada skala data demo (112 karyawan).

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
- **Durable audit sink + feedback CSV export** (`src/lib/agent/auditStore.ts`,
  `GET /api/feedback/export`) — optional Upstash Redis persistence for every
  audit event, written via `next/server`'s `after()` so it never adds
  latency to the response the user is waiting on. Entirely opt-in (no env
  vars set = no behavior change, same console-only logging as before). Once
  configured, an `hr` session can hit `/api/feedback/export` for a
  ready-to-open CSV recap of every thumbs up/down, instead of manually
  pulling `vercel logs` and running `scripts/harvest-questions.mjs`.
  `scripts/harvest-questions.mjs` itself also gained a CSV writer
  (`harvested-feedback.csv`) alongside its existing JSON output, for the
  manual-export path.
- **`GET /api/questions/export`** — sibling to `/api/feedback/export`, but
  returns every question asked (from the same durable Redis sink), not just
  the ones that got a thumbs up/down. Same `hr`-only gating.
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
