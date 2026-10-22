# OrbitOps — SaaS operations dashboard

> **Independent portfolio concept.** OrbitOps is a fictional product I designed and built on my own to demonstrate product-dashboard design and frontend engineering. It is **not client work**, it does not represent a real company, and every name, figure and event in it is invented.

## Purpose

OrbitOps is an operations dashboard for small digital teams: revenue, active projects, support workload and recent activity in one place. There is no backend. The goal is to show how a dense product interface can be organised, designed and implemented clearly, with deliberate loading, empty, warning and error states and accessibility built in from the start.

Read the design write-up in [docs/case-study.md](docs/case-study.md). The tested-viewport checklist is in [docs/qa-checklist.md](docs/qa-checklist.md).

## Routes

| Route | What it shows |
| --- | --- |
| `/` | Overview: four metric cards, revenue trend, project health, recent activity, system health, date-range control |
| `/projects` | Status tabs with counts, search, owner filter, sorting, "New project" dialog with validation |
| `/customers` | Search, plan filter, sortable columns, pagination, disabled-export state |
| `/activity` | Timeline grouped by day, filter by type |
| `/settings` | Profile form with validation, notification switches, theme (system / light / dark) |

## Setup

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview    # serves the build on :4173
```

## Testing

```bash
npm run lint           # ESLint (typescript-eslint + react-hooks)
npm run typecheck
npm test               # Vitest + Testing Library (30 tests)
npx playwright install chromium webkit   # first run only
npm run test:e2e       # Playwright on Chromium and WebKit (41 tests, 1 WebKit skip)
npm run screenshots    # regenerates docs/screenshots (needs `npm run preview` running)
```

The e2e suite builds the app and serves it with `vite preview` automatically. It covers navigation, drawer and dialog keyboard behaviour, horizontal overflow at six widths, recoverable error / empty / loading states, axe-core scans, and a heading/landmark outline check per route. The a11y and screenshot checks run on Chromium; the smoke suite also runs on WebKit. Firefox is available with `PW_FIREFOX=1 npm run test:e2e`, but Playwright's Firefox would not launch on the machine this was built on, so it has not been run.

## Reviewing the designed states

Every data region goes through loading, empty, error and loaded. Use the **Demo state** selector in the header, or a query string:

- `/projects?demo=loading` — skeletons (held until you switch back)
- `/projects?demo=empty` — empty states with a next action
- `/customers?demo=error` — recoverable error; **Retry** succeeds (the error mode fails the first request only)

The short delay on each request is a clearly labelled demo latency (`delayMs` in `DemoProvider`), not real networking.

## Design decisions

- **Tokens first.** Colour, type, spacing (8px scale), radius and elevation live in `src/styles/tokens.css`. Light and dark are both defined there and follow the system setting unless overridden.
- **One accent colour** on a neutral surface; status colours are always paired with an icon and a text label, never colour alone.
- **One navigation component** (`NavPanel`) feeds both the desktop sidebar and the mobile drawer, so the markup is not duplicated.
- **Progressive tables.** On narrow screens project and customer rows restack into labelled cards; Customers adds a visible "Sort by" control because the column headers are hidden at that size.
- **Business logic is outside components.** Filtering, sorting, pagination and grouping are pure functions in `src/lib/queries.ts` with their own unit tests.
- **Mock data is typed and separate** (`src/data`), and "today" is pinned to Oct 22, 2026 so screenshots and tests are deterministic.
- **Data-region states are centralised** in `AsyncRegion` so every section handles loading, error, empty and ready the same way.

## Accessibility notes

- Landmarks: skip link, banner, `nav` ("Primary"), `main`; one `h1` per page with a logical heading order; per-route `document.title`.
- After client-side navigation, focus moves to `main`.
- The mobile drawer and the dialog are `role="dialog"` with `aria-modal`, a focus trap, Esc to close, scrim click to close and focus restored to the trigger. The menu button exposes `aria-expanded` and `aria-controls`.
- Status tabs follow the WAI-ARIA tabs pattern (roving tabindex, arrow keys, Home/End).
- Tables use real `th scope`, sortable headers carry `aria-sort`, and wide tables scroll in a focusable labelled region.
- The date range is a native radio group; switches use `role="switch"`.
- The revenue chart has a written text summary and a "View as table" toggle.
- Forms associate labels, errors (`aria-invalid` + `aria-describedby`) and a summary `role="alert"`.
- Result counts and success messages are announced via live regions.
- `prefers-reduced-motion` disables animation; layouts reflow without horizontal page scroll down to 320px (which also covers 200% zoom of a 1280px window).
- Measured contrast: body text 17.4:1 light / 15.0:1 dark; muted text ≥ 7.4:1; status text on tinted backgrounds ≥ 5.6:1; control borders and focus ring ≥ 3:1.
- Automated: axe-core (WCAG 2.0/2.1/2.2 A and AA tags) reports no violations on every route in both themes and on the dialog's error state.

## Known limitations

- **No screen-reader testing.** I have not run VoiceOver, NVDA or JAWS. Instead the suite checks the accessibility tree through axe-core, a per-route heading and landmark outline, and keyboard flows. A real assistive-technology pass would still be worthwhile.
- **Firefox unverified.** Chromium and WebKit are tested; Playwright's Firefox failed to launch on the build machine. Real devices were not tested either.
- **Forced colours** (Windows High Contrast) was checked in emulation on the Overview page only (screenshot `16`), where it surfaced and fixed a solid-black chart fill. Other pages have not been inspected in that mode.
- Created projects and saved settings persist in `localStorage` for the browser only; there is no backend, and "Reset demo data" clears created projects.
- Data is static and in English only; there is no i18n or real authentication or API.
- Browser zoom at 200% was approximated with a 640px viewport rather than real zoom.
- The app is not deployed anywhere.
- TypeScript is pinned to 6.x because typescript-eslint does not yet support 7.
