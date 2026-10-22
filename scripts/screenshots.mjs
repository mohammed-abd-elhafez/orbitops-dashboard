// Generates the portfolio screenshots in docs/screenshots. Needs `npm run preview` running on :4173.
import { chromium } from '@playwright/test'

const BASE = 'http://localhost:4173'
const OUT = 'docs/screenshots'
const browser = await chromium.launch()

async function shot(name, { path = '/', viewport = { width: 1280, height: 900 }, scheme = 'light', forced = false, fullPage = true, before } = {}) {
  const context = await browser.newContext({ viewport, colorScheme: scheme, forcedColors: forced ? 'active' : 'none', deviceScaleFactor: 2 })
  const page = await context.newPage()
  await page.goto(BASE + path)
  await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]') || new URLSearchParams(location.search).get('demo') === 'loading')
  if (before) await before(page)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage })
  await context.close()
  console.log('saved', name)
}

await shot('01-overview-light')
await shot('02-overview-dark', { scheme: 'dark' })
await shot('03-mobile-drawer', { viewport: { width: 375, height: 812 }, fullPage: false, before: (p) => p.getByRole('button', { name: 'Open navigation menu' }).click() })
await shot('04-overview-loading', { path: '/?demo=loading' })
await shot('05-projects-blocked', { path: '/projects', before: (p) => p.getByRole('tab', { name: /Blocked/ }).click() })
await shot('06-new-project-errors', { path: '/projects', fullPage: false, before: async (p) => { await p.getByRole('button', { name: 'New project' }).click(); await p.getByRole('button', { name: 'Create project' }).click() } })
await shot('07-customers-sorted', { path: '/customers', before: (p) => p.getByRole('button', { name: /Sort by MRR/ }).click() })
await shot('08-error-retry', { path: '/customers?demo=error' })
await shot('09-chart-table', { path: '/', before: (p) => p.getByRole('button', { name: 'View as table' }).click() })
await shot('10-chart-tooltip', { path: '/', fullPage: false, before: async (p) => { await p.getByRole('img', { name: /Oct 13/ }).focus() } })
await shot('11-mobile-customers-cards', { path: '/customers', viewport: { width: 375, height: 812 } })
await shot('12-mobile-projects-dark', { path: '/projects', viewport: { width: 375, height: 812 }, scheme: 'dark' })
await shot('13-activity', { path: '/activity' })
await shot('14-settings-warning', { path: '/settings', before: async (p) => { for (const n of ['Project updates', 'Support escalations']) await p.getByRole('switch', { name: n }).click() } })
await shot('15-empty-projects', { path: '/projects?demo=empty', fullPage: false })
await shot('16-overview-forced-colors', { forced: true })
await browser.close()
