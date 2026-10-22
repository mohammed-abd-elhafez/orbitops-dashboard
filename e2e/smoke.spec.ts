import { expect, test, type Page } from '@playwright/test'

const ROUTES = [
  { path: '/', heading: 'Overview' },
  { path: '/projects', heading: 'Projects' },
  { path: '/customers', heading: 'Customers' },
  { path: '/activity', heading: 'Activity' },
  { path: '/settings', heading: 'Settings' },
]

function trackConsoleErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))
  page.on('pageerror', (err) => errors.push(err.message))
  return errors
}

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('sidebar navigation reaches every route without console errors', async ({ page }) => {
    const errors = trackConsoleErrors(page)
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeHidden()

    const nav = page.getByRole('navigation', { name: 'Primary' })
    for (const { path, heading } of ROUTES) {
      await nav.getByRole('link', { name: heading, exact: true }).click()
      await expect(page).toHaveURL(path)
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
      await expect(nav.getByRole('link', { name: heading, exact: true })).toHaveAttribute('aria-current', 'page')
    }
    expect(errors).toEqual([])
  })

  test('date range visibly changes the dataset', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('+4.2% vs previous 30 days')).toBeVisible()
    await page.getByRole('radio', { name: '90 days' }).check({ force: true })
    await expect(page.getByText('+11.8% vs previous 90 days')).toBeVisible()
  })

  test('keyboard: skip link moves focus to main', async ({ page, browserName }) => {
    // Safari does not Tab to links unless a system setting is enabled, so this path can't be driven there.
    test.skip(browserName === 'webkit', 'Safari skips links when tabbing by default')
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#main')).toBeFocused()
  })
})

test.describe('mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('drawer opens, traps focus, navigates and closes', async ({ page }) => {
    const errors = trackConsoleErrors(page)
    await page.goto('/')

    const menu = page.getByRole('button', { name: 'Open navigation menu' })
    await expect(menu).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden()

    await menu.click()
    const drawer = page.getByRole('dialog', { name: 'Navigation menu' })
    await expect(drawer).toBeVisible()
    await expect(menu).toHaveAttribute('aria-expanded', 'true')
    await expect(drawer.getByRole('button', { name: 'Close navigation menu' })).toBeFocused()

    // Focus stays inside the drawer when tabbing past the last link.
    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab')
    expect(await drawer.evaluate((el) => el.contains(document.activeElement))).toBe(true)

    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()
    await expect(menu).toBeFocused()

    await menu.click()
    await page.getByRole('dialog', { name: 'Navigation menu' }).getByRole('link', { name: 'Customers' }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Customers' })).toBeVisible()
    await expect(drawer).toBeHidden()
    expect(errors).toEqual([])
  })

})

// 320 = smallest phone, 640 = a 1280px window at 200% zoom (WCAG 1.4.4 / 1.4.10 reflow).
for (const width of [320, 375, 640, 768, 1024, 1440]) {
  test(`no route scrolls horizontally at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const { path, heading } of ROUTES) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
      // Measure the loaded layout, not the skeletons.
      await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, `${path} overflows horizontally at ${width}px`).toBeLessThanOrEqual(0)
    }
  })
}

test.describe('states', () => {
  test('error state is recoverable via Retry', async ({ page }) => {
    await page.goto('/customers?demo=error')
    const alert = page.getByRole('alert')
    await expect(alert).toContainText('couldn’t load')
    await alert.getByRole('button', { name: 'Retry' }).click()
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('empty and loading demo states render', async ({ page }) => {
    await page.goto('/projects?demo=empty')
    await expect(page.getByText('No projects yet')).toBeVisible()
    await page.goto('/projects?demo=loading')
    await expect(page.getByRole('status').filter({ hasText: 'Loading projects' })).toBeVisible()
  })
})
