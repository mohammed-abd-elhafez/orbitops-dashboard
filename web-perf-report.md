# OrbitOps Dashboard — Web Performance Audit

**Audit date:** 2026-10-22  
**Scope:** Local production build served with `vite preview`, all five application routes, desktop Chromium at 1280×800.  
**Method:** Production build inspection, Playwright browser measurements using the Performance API, network request inspection, source review, and the repository’s existing Chromium smoke/accessibility suite.

## Executive summary

OrbitOps is already lightweight for a React dashboard: the production build contains one 325 kB JavaScript asset (100.77 kB gzip), one 18.63 kB CSS asset (4.43 kB gzip), no image or web-font requests, no source maps, and no horizontal overflow across the tested breakpoints. The browser suite passes all 29 tests, including Axe scans for the five routes in light and dark themes.

The two main issues found in the baseline audit were fixed: production builds no longer wait through the 600 ms demo delay, and Overview card regions now reserve stable space while loading. After the fixes, Overview improved from **800 ms to 228 ms LCP** and from **0.069 to 0.003 CLS** in the same local browser measurement. Other routes measured LCP of 148–256 ms and CLS of 0–0.020.

The local TTFB numbers are not representative of production hosting because the app was served from loopback. Validate cache and compression headers on the deployed site before release.

## Core Web Vitals summary

| Route | TTFB | FCP | LCP | CLS | Rating / interpretation |
|---|---:|---:|---:|---:|---|
| `/` | 2–4 ms | 180 ms | 228 ms | 0.003 | Good; Overview shift resolved |
| `/projects` | 3 ms | 156 ms | 156 ms | 0.020 | Good |
| `/customers` | 2 ms | 192 ms | 192 ms | 0.000 | Good; one 71 ms long task |
| `/activity` | 7 ms | 256 ms | 256 ms | 0.000 | Good; one 73 ms long task |
| `/settings` | 4 ms | 148 ms | 148 ms | 0.015 | Good |

The audit did not measure INP because it did not include a long-running interaction trace. The browser run observed no long tasks over 62 ms and no route overflow at 320, 375, 640, 768, 1024, or 1440 px.

## Network and build findings

The initial document makes three first-party requests per route:

| Resource | Raw size | Gzip size from build | Notes |
|---|---:|---:|---|
| JavaScript | 325,290 bytes | 100.77 kB | Shared eager bundle for every route |
| CSS | 18,630 bytes | 4.43 kB | Small; no material render-blocking concern |
| HTML | 948 bytes | ~0.55 kB in local build summary | Minimal shell |

There are no image requests, font downloads, CSS `@import` chains, production source maps, or large static assets. The module script is deferred by module semantics, so no JavaScript `defer` change is needed.

The local Vite preview returned `Cache-Control: no-cache` for HTML, CSS, and JavaScript. That is acceptable for this local measurement server, but the deployed static host should serve hashed files under `dist/assets/` with a long-lived immutable cache policy and keep HTML revalidated. Confirm this with a production response-header check.

## Prioritized issues

### 1. Overview skeletons did not reserve the settled layout height — fixed

The baseline Overview page’s first two-column grid grew from approximately **327 px** while loading to **515 px** after data settled. This moved the following row and created the measured **0.069 CLS**. The implementation now matches the five settled project/activity rows and reserves minimum heights for the revenue, health, activity, and services regions. Post-fix CLS measured **0.003** on Overview.

The placeholder counts now match the settled data: Project health renders five skeleton rows and Recent activity renders five activity rows. The chart and card regions also have stable minimum-height contracts.

The implemented fix makes loading placeholders match the settled row count and reserves a minimum content height for each card:

```tsx
// ProjectHealthSkeleton: match loadProjectHealth().slice(0, 5)
{Array.from({ length: 5 }, (_, i) => (
  // existing skeleton row
))}

// ActivitySkeleton: match ACTIVITY.slice(0, 5)
<ActivitySkeleton rows={5} />
```

Region-specific card-body sizing is implemented through classes:

```css
.overview-region--revenue { min-height: 24rem; }
.overview-region--health { min-height: 32rem; }
.overview-region--activity { min-height: 24rem; }
.overview-region--services { min-height: 20rem; }
```

The goal is for skeleton and settled states to occupy the same space, which the post-fix CLS result confirms for this route.

### 2. Simulated 600 ms delay was on the normal path — fixed

`DemoProvider` still uses a 600 ms delay during development so loading states remain reviewable, but production builds now pass `delayMs={0}`. Explicit `?demo=loading` behavior remains available for the loading-state showcase.

The implemented fix keeps the delay only for development builds:

```tsx
<DemoProvider delayMs={import.meta.env.DEV ? 600 : 0}>
  <App />
</DemoProvider>
```

The deliberate loading experience remains available through the existing explicit demo controls rather than slowing the default route.

### 3. All routes are included in one eager JavaScript bundle — low/medium priority

Every route is imported eagerly in `src/App.tsx`, so `/settings` downloads the same 325 kB raw bundle as `/`. The bundle is acceptable for a small dashboard and the measured gzip size is reasonable, but route-level code splitting would reduce first-view JavaScript as the application grows.

**Recommended fix:** lazy-load page modules and add a route fallback:

```tsx
import { lazy, Suspense } from 'react'

const OverviewPage = lazy(() => import('./pages/Overview'))
const ProjectsPage = lazy(() => import('./pages/Projects'))
const CustomersPage = lazy(() => import('./pages/Customers'))
const ActivityPage = lazy(() => import('./pages/ActivityPage'))
const SettingsPage = lazy(() => import('./pages/Settings'))

// Wrap Routes with Suspense and a stable page-level fallback.
```

This is not urgent for the current asset size. Re-measure after adding more screens or dependencies; do not split solely to improve a currently good score.

### 4. Deployment compression and cache policy need production verification — low priority

The local preview response has `no-cache` headers and does not provide a production CDN signal. Hashed asset filenames make immutable caching safe, but the deployment workflow should be checked for Brotli/gzip compression and long-lived asset caching.

**Recommended target:** compressed delivery for JS/CSS and a long-lived immutable policy for `/assets/index-*.js` and `/assets/index-*.css`; HTML should remain revalidated. The exact header configuration depends on the static host.

## What is already good

- Production build succeeds and TypeScript type checking passes.
- `npm run lint` passes after correcting permissions introduced by the supplied archive’s Windows-style path metadata.
- All **29 Chromium end-to-end tests pass**, including route navigation, mobile drawer behavior, keyboard focus behavior, responsive overflow checks, loading/error/empty states, and Axe WCAG scans.
- No images or web fonts are loaded, so there are no image dimension, font-swap, or image compression issues in this build.
- CSS is only 18.44 kB raw and has no `@import` dependency chain.
- No production source maps are emitted.
- No desktop or mobile horizontal overflow was observed.

## Validation caveats

The repository’s unit-test command could not run in this sandbox because the installed dependency tree requires a newer Node runtime than the available `v22.13.0`. `jsdom@30.1.3` brings in `undici@8.12.3`, which fails during Vitest worker startup with `Cannot read properties of undefined (reading 'bind')`. This is a tooling/runtime compatibility issue, not a browser performance finding. Re-run `npm run test` under the project’s supported Node engine after pinning or upgrading the runtime.

The available browser MCP exposed navigation and page inspection but not the trace/insight APIs described in the performance skill. Measurements above therefore use Playwright and the browser Performance API rather than a Chrome DevTools trace. Production field data should still be collected after deployment, especially for LCP, INP, and TTFB.

## Recommended order of work

1. Remove or explicitly gate the default 600 ms demo delay.
2. Match skeleton row counts and reserve stable heights for Overview card regions; recheck CLS.
3. Verify production compression and cache headers on the deployed site.
4. Add route-level code splitting only if the dashboard or dependency set grows materially.
5. Align the local Node version with the dependency engine requirements so unit tests can run in CI.
