import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const ROUTES = ['/', '/projects', '/customers', '/activity', '/settings']
const THEMES = ['light', 'dark'] as const

// Automated WCAG 2.x A/AA scan. It catches roughly a third of issues, so it
// complements (does not replace) the manual keyboard and screen-reader review.
for (const theme of THEMES) {
  for (const path of ROUTES) {
    test(`axe: ${path} (${theme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme })
      await page.goto(path)
      await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
    })
  }
}

test('axe: new project dialog with validation errors', async ({ page }) => {
  await page.goto('/projects')
  await page.getByRole('button', { name: 'New project' }).click()
  await page.getByRole('button', { name: 'Create project' }).click()
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
})

// Stand-in for a screen-reader outline: what assistive tech uses to jump around a page.
for (const path of ROUTES) {
  test(`structure: ${path} has one h1, no skipped heading levels, and named landmarks`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('[aria-busy="true"]')).toHaveCount(0)

    const levels = await page.evaluate(() =>
      [...document.querySelectorAll('h1, h2, h3, h4')]
        .filter((h) => (h as HTMLElement).offsetParent !== null || h.closest('.sr-only') || getComputedStyle(h).position === 'absolute')
        .map((h) => Number(h.tagName[1])),
    )
    expect(levels.filter((l) => l === 1)).toHaveLength(1)
    levels.forEach((level, i) => {
      if (i > 0) expect(level - levels[i - 1], `heading order on ${path}: ${levels.join(',')}`).toBeLessThanOrEqual(1)
    })

    await expect(page.getByRole('main')).toHaveCount(1)
    await expect(page.getByRole('banner')).toHaveCount(1)
    await expect(page.getByRole('navigation', { name: 'Primary' })).toHaveCount(1)
  })
}

test('keyboard: dialog traps focus and returns it to the trigger', async ({ page }) => {
  await page.goto('/projects')
  const trigger = page.getByRole('button', { name: 'New project' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'New project' })
  await expect(page.getByLabel('Project name')).toBeFocused()
  for (let i = 0; i < 10; i++) await page.keyboard.press('Tab')
  expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})
