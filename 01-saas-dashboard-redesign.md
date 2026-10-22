# Claude Build Brief — OrbitOps SaaS Dashboard

## Role

You are a senior product designer and frontend engineer. Build a polished, production-quality portfolio project that demonstrates strong web design, responsive UX, accessibility, interaction design, and frontend implementation.

Do not present this as client work. The product is fictional and must be labeled as an independent portfolio concept in the README and case study.

## Project concept

Create **OrbitOps**, a fictional SaaS operations dashboard for small digital teams. The dashboard helps a team understand revenue, active projects, support workload, and recent operational activity.

The goal is not to build a real SaaS backend. The goal is to demonstrate how a complex product interface can be organized, designed, and implemented clearly.

## Primary objectives

1. Demonstrate professional product-dashboard information architecture.
2. Demonstrate responsive behavior from desktop to mobile.
3. Demonstrate loading, empty, success, warning, and error states.
4. Demonstrate accessible tables, filters, navigation, dialogs, and forms.
5. Demonstrate a reusable visual system with consistent spacing, type, color, radius, and elevation tokens.
6. Produce a portfolio-ready project with a short case study explaining the design decisions.

## Recommended stack

Use the existing project stack if one already exists. Otherwise use:

- React
- TypeScript
- Vite
- Tailwind CSS or a small maintainable CSS token system
- Local typed mock data only; no external API is required
- Lucide or another open-source icon library if needed
- Vitest and Testing Library for component behavior
- Playwright for a small responsive smoke-test suite

Do not add a backend, authentication service, database, paid dependency, or unnecessary framework unless there is a clear reason.

## Pages and routes

Implement these routes or equivalent view states:

- `/` — Overview dashboard
- `/projects` — Project list with filters and status tabs
- `/customers` — Customer table with search, sort, and pagination behavior
- `/activity` — Activity timeline with date grouping
- `/settings` — Profile, notification, and appearance settings

The sidebar should collapse on smaller screens. On mobile, use a clearly accessible menu button and a focus-managed navigation drawer.

## Core dashboard content

The overview should include:

- Four metric cards: Monthly recurring revenue, active projects, open support items, and customer satisfaction
- A revenue trend chart with an accessible text summary
- A project health section showing status, owner, due date, and progress
- A recent activity feed
- A small notification or system-health card
- A date-range control that visibly changes the mock dataset or summary state

Use realistic fictional data, not placeholder text such as “Lorem ipsum.”

## Required interaction states

Every major area must include deliberate states:

- Initial loading skeleton
- Successful loaded state
- Empty state with a useful next action
- Validation or warning state
- Recoverable error state with a retry action
- Disabled state where appropriate
- Mobile navigation open and closed states
- Modal or drawer open and closed states

The states may use local deterministic data and a short simulated delay. Do not make the UI dependent on network availability.

## Visual direction

Create a calm, premium B2B product interface:

- Strong typographic hierarchy
- Neutral background with one restrained accent color
- High-contrast text and controls
- Clear grouping without excessive borders
- Dense enough for a real dashboard but not visually crowded
- Consistent 8px spacing logic or an equivalent documented scale
- Light and dark themes only if both can be implemented cleanly

Avoid generic dashboard clichés, excessive gradients, visual noise, and decorative elements that reduce scanability.

## Accessibility requirements

Meet WCAG 2.2 AA-oriented expectations:

- Semantic landmarks and headings
- Visible keyboard focus
- Full keyboard access to menus, tabs, dialogs, filters, and tables
- Correct button/link semantics
- Accessible names for icon-only controls
- `aria-expanded`, `aria-controls`, and dialog labeling where relevant
- No color-only status communication
- Sufficient contrast for text, icons, borders, and focus indicators
- Respect `prefers-reduced-motion`
- Responsive zoom behavior up to 200%
- Chart information available as text or a data table

## Code-quality requirements

- Use typed domain models for dashboard data.
- Keep components small and named by responsibility.
- Separate mock data from UI components.
- Avoid duplicated markup for desktop and mobile when a responsive component is possible.
- Keep design tokens centralized.
- Add comments only where they explain a non-obvious decision.
- Do not hide errors with empty catch blocks.
- Do not use arbitrary timeouts to fake functionality except for clearly labeled demo loading states.

## Required deliverables

Produce all of the following:

1. A working responsive application.
2. A concise `README.md` containing:
   - Project purpose
   - Independent fictional-project disclaimer
   - Design decisions
   - Stack and setup commands
   - Accessibility notes
   - Testing commands
   - Known limitations
3. A case study page or Markdown case study containing:
   - Problem statement
   - Target users
   - Information architecture
   - Key design decisions
   - Responsive behavior
   - Accessibility work
   - What was intentionally not built
4. At least one unit/component test for navigation or filtering.
5. At least one end-to-end smoke test covering desktop and mobile navigation.
6. A final QA checklist with tested viewport sizes.

## Acceptance criteria

The project is complete only when:

- It runs from a clean install using documented commands.
- There are no console errors in normal flows.
- All routes render correctly on desktop and mobile.
- The sidebar and mobile drawer are keyboard usable.
- Filters and search visibly affect the mock data.
- Empty, loading, error, and success states are intentionally designed.
- The interface remains usable at narrow mobile widths.
- A screen-reader-oriented review finds meaningful headings, labels, and landmarks.
- The README clearly says this is an independent fictional concept, not client work.

## Working protocol

Before coding, inspect the repository and summarize the existing structure. Then propose a short implementation plan. Build in small verifiable steps, run the relevant tests, and fix issues instead of merely reporting them. Do not stop at a static screenshot: the final result must be interactive and responsive.

At the end, provide:

- Files changed
- Commands run
- Test results
- Accessibility checks performed
- Remaining limitations
- Suggested screenshots for the portfolio case study
