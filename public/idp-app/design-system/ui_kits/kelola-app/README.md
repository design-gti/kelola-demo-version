# Kelola Web App — UI Kit

A high-fidelity, interactive recreation of the **Kelola** talent-management web
app, reconstructed from `talentlytica/kelola-app` (Laravel + Inertia + React +
Mantine).

## Run it
Open `index.html`. The flow is clickable:

1. **Login** — Indonesian login card (centered, 400px) on the white-header shell.
2. **Dashboard** — gradient welcome banner, Company/Individual tabs, four stat
   cards, an "Aspect to Standard" bar chart, and a profile-completion donut.
3. **Employee List** — searchable table with avatars, DISC badges, score,
   completion bars, and status pills.
4. **Box Mapping** — the 9-box performance × potential talent grid (click a box).

The sidebar shows the signature **carved-notch active state** on the blue
gradient rail, a BETA tag on Development, and a user dropdown pinned to the
bottom. Other nav items show a friendly WIP placeholder (those screens aren't
part of this kit).

## Files
| File | Role |
|---|---|
| `index.html` | App harness — auth flow + sidebar routing. Loads everything. |
| `kit-ui.jsx` | Lean primitives (`KButton`, `KCard`, `KBadge`, `KAvatar`, `KTextInput`, `KCheckbox`, `KTabs`, `KIconButton`) that mirror the design-system components using the same `styles.css` tokens. |
| `shell.jsx` | `LoginScreen`, `Sidebar`, `Header`. |
| `screens.jsx` | `DashboardScreen`, `EmployeeListScreen`, `TalentMappingScreen`. |
| `data.js` | Fake HR data (Indonesian names, aspects, 9-box counts). |

## Why self-contained primitives?
The canonical components live in `/components` and ship via `_ds_bundle.js`.
This kit re-states lean equivalents inline (`kit-ui.jsx`) so it renders
identically **standalone, when downloaded, and in the Design System tab** — but
every value (color, radius, shadow, type) is pulled from the same
`styles.css` tokens, so it stays 1:1 with the real components. When building
inside the design-system runtime, prefer the real `window.KelolaDesignSystem_*`
components instead.

## Fidelity notes
- Charts are lightweight CSS/SVG stand-ins (the product uses Recharts/Mantine
  Charts). Shapes, colors, and the standard-marker idea are faithful; exact
  chart internals are simplified.
- Icons are Tabler (the product's set) via the webfont CDN.
- Copy is bilingual exactly as the product: Indonesian body, English nav labels.
