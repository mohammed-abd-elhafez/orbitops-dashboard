# QA checklist

Date: 2026-10-22 · Browsers: Chromium and WebKit (Playwright), plus a desktop in-app browser for manual looks.
Not tested: Firefox (would not launch on the build machine), real devices, screen readers.

## Viewports

| Width | Method | Result |
| --- | --- | --- |
| 320 px | Playwright, Chromium and WebKit: every route, loaded state, no horizontal page scroll | Pass |
| 375 px | Playwright (both engines, all routes) + manual in-app browser + screenshots of cards, drawer and dark mode | Pass |
| 640 px (1280 @ 200% zoom equivalent) | Playwright, both engines: no horizontal page scroll | Pass |
| 768 px | Playwright, both engines: no horizontal page scroll | Pass |
| 1024 px | Playwright, both engines: no horizontal page scroll (sidebar breakpoint) | Pass |
| 1280 px | Playwright desktop flows + manual in-app browser + screenshots of every route | Pass |
| 1440 px | Playwright, both engines: no horizontal page scroll | Pass |

640px approximates reflow at 200% zoom by viewport width; real browser zoom was not exercised.

## Functional

- [x] All five routes render on desktop and mobile; unknown paths show a not-found state.
- [x] Sidebar marks the current page with `aria-current`.
- [x] Mobile drawer: opens, focus moves inside, Tab stays trapped, Esc closes, focus returns to the menu button (also in WebKit, where clicking a button does not focus it), choosing a link closes it.
- [x] New-project dialog: focus trap, Esc, focus returns to the trigger.
- [x] Date range changes metrics and the chart series.
- [x] Chart points show a tooltip on hover and keyboard focus; "View as table" shows the same data.
- [x] Projects: status tabs (arrow keys), search, owner filter, sort, clear filters, new project validation and creation, persistence across reload, Reset demo data.
- [x] Customers: search, plan filter, sortable columns with `aria-sort`, mobile "Sort by", pagination, disabled export when no results.
- [x] Activity: grouped by day, filter by type.
- [x] Settings: Save disabled until a change, email validation, success message, warning when all notifications are off, persistence, theme switch.
- [x] Corrupt `localStorage` data is ignored instead of crashing.
- [x] Demo states (selector or `?demo=`): loading skeletons, empty states with a next action, recoverable error (Retry succeeds).
- [x] No console errors during the desktop and mobile navigation flows.

## Accessibility

- [x] axe-core (WCAG 2.0 / 2.1 / 2.2 A + AA): no violations on all five routes in light and dark, and on the dialog's error state.
- [x] Per route: exactly one `h1`, no skipped heading levels, one `main`, one `banner`, a "Primary" navigation.
- [x] Skip link moves focus to `main` (skipped on WebKit: Safari does not Tab to links by default).
- [x] Contrast computed for text, status badges, control borders (≥ 3:1) and focus ring in both themes.
- [x] Status never conveyed by colour alone (icon + text).
- [x] `prefers-reduced-motion` disables animation.
- [x] Forced-colours emulation reviewed on Overview (found and fixed a solid-black chart fill).
- [ ] Forced-colours on the other pages: **not inspected**.
- [ ] Screen-reader pass (VoiceOver / NVDA): **not performed**.

## Visual review

Every route was inspected in screenshots (`docs/screenshots`). Issues found and fixed during review: squashed "View as table" button, vertical scrollbar on the tab strip, page overflowing sideways on mobile tables, low-contrast control borders, a stretched revenue card, and the forced-colours chart fill.

## Automated results (last run)

- `npm run lint`: clean
- `npm run typecheck` and `npm run build`: clean
- `npm test`: 30 passed
- `npm run test:e2e`: 40 passed, 1 skipped (Chromium and WebKit)
- Clean install (`npm ci` in a fresh copy without `node_modules`), then lint, typecheck, tests and build: all pass
