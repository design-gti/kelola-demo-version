# Kelola Design System

A design system reconstructed from the **Kelola** product codebase — a corporate
talent-management SaaS by **Talentlytica** (Gagasimaji). Kelola helps
organisations map competencies, run assessments, track performance, plan
careers, and develop their people. The product UI is in **Bahasa Indonesia**
with English UI labels.

> **Tagline:** *Platform talent management for corporate, base Software as a Service.*

This repository gives a design agent everything needed to build well-branded
Kelola interfaces, mocks, and assets: foundations (color, type, spacing,
shadows), brand assets (logos, illustrations), reusable React components, and
full-screen UI-kit recreations.

---

## Sources

Everything here was reconstructed from the product codebase. If you have access,
explore these to go deeper and improve fidelity:

- **GitHub — main app:** https://github.com/talentlytica/kelola-app
  - Stack: Laravel 12 + Inertia.js + React 18 + **Mantine UI** + Tailwind CSS + Vite + Storybook.
  - Theme source of truth: `resources/js/config/mantineTheme.ts` (color tuples, component defaults).
  - Typography utilities: `resources/css/font.css`. Global styles: `resources/css/app.css`.
  - Icons: `@tabler/icons-react` (primary) + `@fluentui/react-icons`.
  - Components live under `resources/js/Components/{Atom,Molecule,Organisme}` (atomic design).
  - Screens under `resources/js/Pages/**`; layout shell under `resources/js/Layouts`.

Related Talentlytica repos (not used here, for context): `internal-affairs`,
`redeem-voucher`, `T2`.

> **Font note / substitution:** The product licenses **Avenir** (Avenir / Avenir
> Next family) and serves **Open Sans** from Google Fonts. The real Avenir
> `.woff2` binaries from the repo are bundled in `assets/fonts/`. If you are
> rendering outside an environment that may carry the Avenir licence, the
> closest free substitute is **Nunito Sans** or **Mulish** (humanist geometric
> sans). Open Sans loads from Google Fonts directly. **Flag this if you swap.**

---

## Brand in one breath

Kelola feels **trustworthy, clean, and corporate-warm**. A confident **deep
blue** carries the brand (navigation, primary actions, data), an **energetic
orange** provides accent and emphasis, and everything sits on a near-white
`#F7F7F7` canvas with **very soft shadows** and **8px rounded cards**. The
signature flourish is an **asymmetric notched corner** (`8px 0 8px 0`) and a
**carved-notch active nav pill**. Type is geometric (Avenir) for UI and humanist
(Open Sans) for reading. Nothing shouts; hierarchy comes from weight and a
single blue→cyan gradient, not from loud color.

---

## CONTENT FUNDAMENTALS

How Kelola writes.

- **Language:** Primarily **Bahasa Indonesia** for product copy, messages, and
  empty/error states. **Navigation and feature labels are in English**
  (Home, Assignment, Development, Organization, Teams, Base Management, Role
  Access, Activity Log). Expect natural code-switching — an English noun inside
  an Indonesian sentence is normal.
- **Voice:** Professional, plain, and supportive — an HR platform talking to HR
  admins and employees. Not playful, not stiff. No slang, no exclamation
  overload.
- **Person:** Addresses the user directly but politely. Indonesian copy is
  neutral/formal ("Anda" register implied, often imperative: *"Muat ulang
  halaman untuk mencoba lagi."*). English is sentence-style.
- **Casing:** **Title Case** for menu items, buttons, page titles, table headers
  (e.g. *Group Report*, *Box Mapping*, *Role Access*). **Sentence case** for
  body copy, descriptions, helper text, and toasts. Buttons are sometimes
  UPPERCASE for the primary CTA (e.g. login `LOG IN`).
- **Buttons / actions:** Short verb-first labels — *Log in*, *Save*, *OK*,
  *Create Batch*, *Admin Settings*, *Back*. Pill-shaped.
- **Toasts & feedback:** Concise Indonesian confirmations — *"Log in berhasil"*
  (success), short error messages surfaced inline or as toast.
- **Empty / error states:** Title + helpful subtitle, Indonesian. Example:
  title *"Gagal memuat section ini"*, subtitle *"Terjadi kesalahan saat
  menampilkan data… Muat ulang halaman untuk mencoba lagi."* Never blame the user.
- **Domain vocabulary:** Talent-management terms used as proper features —
  *Assignment, Batch, Participant, Scenario, Development, IDP (Individual
  Development Plan), Monitoring, Box Mapping / Talent Mapping, Succession Risk,
  Need Development, Aspect, Criteria, Job & Position, Profile Data, iProfile,
  DISC, TMTR*. Treat these as named nouns (Title Case).
- **Numbers & data:** Honest data — the product deliberately distinguishes
  "0%" from "data unavailable" (never fakes a value). Mirror that restraint: no
  invented stats, no decorative metrics.
- **Emoji:** **Not used** in product UI. Do not add emoji.

---

## VISUAL FOUNDATIONS

The visual rules that make a screen read as "Kelola".

### Color
- **Primary = deep blue `#016699`** (Mantine `primary[5]`). Used for primary
  buttons, active nav, links, key data, headings on light. Its tints
  (`#E7F5FF` `primary-1`, `#2F95DE` `primary-4`) appear in soft surfaces and the
  brand gradient.
- **Secondary = orange `#FD9F28`** (`secondary[5]`). Accent only — structural
  highlights, selected/important markers, the loading bar (`#fd991a`), small
  emphasis. Never the dominant field color.
- **Neutrals** are the Mantine grey ramp (`#F8F9FA`→`#212529`); brand "black" is
  actually `#495057` (`neutral-7`), softening text. Borders are `#DEE2E6`.
- **Semantics:** error `#DE350B`, success `#00875A`, warning `#FF8918`, info
  `#00CAE3` — each a full 0–9 scale.
- **Canvas:** `#F7F7F7`, not pure white. Cards are white on top of it.
- **Vibe:** cool, professional, calm; orange keeps it human. No purple, no
  rainbow.

### Gradient
- **One brand gradient**, used sparingly: `linear-gradient(185.52deg,
  #2F95DE 1.4%, #016699 60.56%)` — a near-vertical blue→deeper-blue.
- Applied to: the **sidebar** background, dashboard **header banner**, beta tags,
  gradient-border "assistant" cards, and the iProfile feature shapes.
- Do **not** invent new gradients. Avoid the AI-slop violet/blue gradient.

### Typography
- **Avenir** (geometric sans) for everything structural: headings, titles,
  buttons, nav, input labels, badges. Weights used: 300→900.
- **Open Sans** (humanist sans) for reading: paragraphs, body, captions, table
  data, input values, helper/error text.
- Tight, defined scale (px, with explicit line-heights):
  Heading 20/800 · Subheading 16/700 · Title 14/700 · Subtitle 12/700 ·
  Paragraph 14/400 · Body 12/400 · Label 10/700 · Caption 10/400.
- The UI is **dense and small** by web standards (12–14px is the working range);
  weight, not size, carries hierarchy. Headings rarely exceed 20px in-app;
  marketing/hero contexts can go large with Avenir Black.

### Shape, radius & shadow
- **Corner radius:** 8px is the workhorse (cards, modals, accordions, inputs use
  4px, table cells 4px). Buttons & chips are fully **pill** (`999px`).
- **Signature asymmetric corner** `8px 0 8px 0` — beta tags, assistant title
  ribbon. A subtle brand tell.
- **Shadows are very soft and slightly offset**, never harsh:
  - Card: `2px 4px 20px 0 rgba(0,0,0,.07)` — the defining Kelola elevation.
  - Floating/info: `2px 2px 15px 0 rgba(0,0,0,.10)`.
  - Dropzone/popover: `0 0 24px 0 rgba(0,0,0,.16)`.
- **Cards** = white, `radius 8`, soft card shadow, usually **no border** (shadow
  does the lifting). Some structural cards use a **2px** neutral border instead.

### Backgrounds & texture
- App canvas carries faint **corner texture SVGs** (top-right + bottom-left) —
  decorative, low-contrast. The dashboard header repeats this in white over the
  blue gradient. Effect is subtle, not a loud pattern.
- No photographic backgrounds in-app; imagery is illustration or user avatars.

### Borders
- Default hairline `1px` `#DEE2E6`. Inputs use a thin neutral border on white.
- Emphasis/structure (org charts, avatars, selected boxes) step up to **2px**,
  often in `neutral-5`/`neutral-6` or `secondary-6` when highlighted.

### Motion
- Restrained. Standard ease, ~0.2s for hover/state, up to 0.7s for select
  recolors. **No bounces, no decorative looping.** The notable animation is the
  top **loading bar** (orange `#fd991a`, glowing). Respect reduced-motion.

### Interaction states
- **Hover (nav):** a left-anchored translucent white wash + the pill begins to
  carve in (`border-radius: 18px 0 0 18px`).
- **Active nav item:** background flips to the canvas color `#F7F7F7`, text→blue,
  and a **carved concave notch** is rendered top & bottom right via box-shadow
  pseudo-elements (the item appears cut into the sidebar). This is a defining
  detail — recreate it for sidebars.
- **Hover (card-action):** subtle left→right `#E7F5FF→#FFF` gradient wash.
- **Buttons:** filled primary darken on hover (Mantine `primary[6]`), pill shape
  holds; subtle/ghost variants for secondary actions.
- **Pills/badges:** brand pills sit on `primary-1` (`#E7F5FF`).

### Layout
- Persistent **left sidebar** (blue gradient) + top header (`56px`), main content
  on `#F7F7F7`. Sidebar shows logo on a white header strip, grouped nav, and a
  user dropdown pinned to the bottom.
- Generous whitespace inside the dense type; cards stack in a single scroll
  column or responsive grids. Login is a centered `400px` form.

---

## ICONOGRAPHY

- **Primary icon set: [Tabler Icons](https://tabler.io/icons)** via
  `@tabler/icons-react`. Outline style, **2px stroke**, rendered small —
  **16px** in navigation, 14px for chevrons/affordances. A thin, friendly,
  consistent line set.
- Secondary set in the codebase: **Fluent UI System Icons**
  (`@fluentui/react-icons`) for a few specialised spots.
- Icons are referenced by name through a wrapper (`<Icon name="IconHome" />`),
  so any Tabler glyph is fair game (IconHome, IconClipboardList, IconCertificate,
  IconBuilding, IconUsers, IconBox, IconSettings, IconChevronDown, …).
- **For mocks/HTML:** load Tabler from CDN —
  `<script src="https://unpkg.com/@tabler/icons@latest/icons-react/..."></script>`
  is heavy; prefer the **web-font / SVG sprite**:
  `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3/dist/tabler-icons.min.css">`
  then `<i class="ti ti-home"></i>`. This is the recommended substitution and is
  visually faithful (same source set). **Match stroke weight 2.**
- **Brand illustrations:** the product ships custom flat **"Team Type"** glyphs
  (Achieve, Strategic, Influence, Executing, …) and spot illustrations
  (work-in-progress, 404). Samples are in `assets/` (`team-type-*.svg`,
  `illustration-wip.svg`). Style: flat, brand-blue + orange, rounded, friendly.
- **Emoji / unicode as icons:** **never.** Use Tabler glyphs.

---

## Index / manifest

Root files and where to look:

| Path | What |
|---|---|
| `styles.css` | Global entry point — `@import`s all tokens. Link this. |
| `tokens/colors.css` | Color scales (primary/secondary/neutral/semantic) + surface/text aliases + gradients. |
| `tokens/typography.css` | Families, weights, role scale + `.font-*` helper classes. |
| `tokens/spacing.css` | Spacing scale, radii, shadows, layout & motion tokens. |
| `tokens/fonts.css` | `@font-face` (Avenir) + Open Sans import. |
| `assets/` | Logos (`logo-kelola-*`), `logo-talentlytica.png`, brand illustrations, Avenir `.woff2`, favicon. |
| `guidelines/` | Foundation specimen cards (Type, Colors, Spacing, Brand) shown in the Design System tab. |
| `components/` | Reusable React primitives (Button, Badge, Input, Card, …). Namespace `window.KelolaDesignSystem_59e7aa`. |
| `ui_kits/` | Full-screen click-through product recreations. |
| `SKILL.md` | Agent-Skill manifest for use in Claude Code. |

**Components** (React, namespace `window.KelolaDesignSystem_59e7aa`):
- `components/buttons/` — **Button**, **IconButton**
- `components/forms/` — **TextInput**, **Select**, **Checkbox**, **Switch**
- `components/feedback/` — **Badge** (incl. BETA notch), **Alert**
- `components/data-display/` — **Card**, **Avatar**, **Tabs**
- `components/navigation/` — **Sidebar** + **NavItem** (carved-notch active state)

**UI kits:**
- `ui_kits/kelola-app/` — the Kelola web app: Login → Dashboard → Employee List
  → 9-box Box Mapping, with the gradient sidebar shell. See its `README.md`.

**Starting points** (consuming-project picker): Button, TextInput, Badge, Card, NavItem.
