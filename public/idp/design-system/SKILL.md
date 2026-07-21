---
name: kelola-design
description: Use this skill to generate well-branded interfaces and assets for Kelola (the Talentlytica talent-management SaaS), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Kelola is a corporate talent-management web app (Bahasa Indonesia UI with English
nav labels). The brand is a deep blue (#016699) primary with an orange (#FD9F28)
accent, Avenir for UI type and Open Sans for body, on a near-white #F7F7F7 canvas
with very soft card shadows, 8px radii, and a signature carved-notch sidebar.

Key files:
- `README.md` — full design guide: context, content tone, visual foundations, iconography, manifest.
- `styles.css` — link this; it `@import`s all tokens (`tokens/colors.css`, `typography.css`, `spacing.css`, `fonts.css`).
- `assets/` — Kelola logo mark, Talentlytica wordmark, Avenir webfonts, brand illustrations.
- `components/` — React primitives (Button, TextInput, Badge, Card, Tabs, Avatar, Sidebar/NavItem, …) with `.d.ts` + `.prompt.md`.
- `ui_kits/kelola-app/` — a full interactive recreation of the product (login, dashboard, employee table, 9-box mapping).
- `guidelines/` — foundation specimen cards (color/type/spacing/brand).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy
assets out and create static HTML files for the user to view, pulling colors,
type, and component patterns from this system. Icons are Tabler — load via
`https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3/dist/tabler-icons.min.css`
and use `<i class="ti ti-…">`. If working on production code, copy assets and read
the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they
want to build or design, ask some questions, and act as an expert designer who
outputs HTML artifacts _or_ production code, depending on the need.
