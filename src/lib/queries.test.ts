import { describe, expect, it } from 'vitest'
import { CUSTOMERS } from '../data/customers'
import { ACTIVITY } from '../data/activity'
import { PROJECTS } from '../data/projects'
import { countByStatus, DEFAULT_CUSTOMER_QUERY, DEFAULT_PROJECT_QUERY, groupActivity, queryCustomers, queryProjects } from './queries'

describe('queryProjects', () => {
  it('filters by status', () => {
    const rows = queryProjects(PROJECTS, { ...DEFAULT_PROJECT_QUERY, status: 'blocked' })
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((p) => p.status === 'blocked')).toBe(true)
  })

  it('searches project and customer names case-insensitively', () => {
    const rows = queryProjects(PROJECTS, { ...DEFAULT_PROJECT_QUERY, search: 'BRIGHTLINE' })
    expect(rows.map((p) => p.id)).toEqual(['p-102'])
  })

  it('combines owner and status filters', () => {
    const rows = queryProjects(PROJECTS, { ...DEFAULT_PROJECT_QUERY, owner: 'Maya Okafor', status: 'completed' })
    expect(rows.map((p) => p.id)).toEqual(['p-106'])
  })

  it('does not mutate its input when sorting', () => {
    const before = PROJECTS.map((p) => p.id)
    queryProjects(PROJECTS, { ...DEFAULT_PROJECT_QUERY, sort: 'name' })
    expect(PROJECTS.map((p) => p.id)).toEqual(before)
  })

  it('counts every status', () => {
    const counts = countByStatus(PROJECTS)
    expect(counts.all).toBe(PROJECTS.length)
    expect(counts['on-track'] + counts['at-risk'] + counts.blocked + counts.completed).toBe(PROJECTS.length)
  })
})

describe('queryCustomers', () => {
  it('paginates and reports totals', () => {
    const first = queryCustomers(CUSTOMERS, DEFAULT_CUSTOMER_QUERY)
    expect(first.rows).toHaveLength(8)
    expect(first.total).toBe(CUSTOMERS.length)
    expect(first.pageCount).toBe(3)
  })

  it('clamps an out-of-range page', () => {
    expect(queryCustomers(CUSTOMERS, { ...DEFAULT_CUSTOMER_QUERY, page: 99 }).page).toBe(3)
  })

  it('sorts numerically and respects direction', () => {
    const desc = queryCustomers(CUSTOMERS, { ...DEFAULT_CUSTOMER_QUERY, sortKey: 'mrr', direction: 'desc' })
    expect(desc.rows[0].name).toBe('Meridian Capital')
  })

  it('returns an empty page for no matches', () => {
    const none = queryCustomers(CUSTOMERS, { ...DEFAULT_CUSTOMER_QUERY, search: 'zzzz' })
    expect(none.total).toBe(0)
    expect(none.rows).toEqual([])
    expect(none.pageCount).toBe(1)
  })
})

describe('groupActivity', () => {
  it('groups by day, newest first, with Today and Yesterday labels', () => {
    const groups = groupActivity(ACTIVITY, 'all')
    expect(groups[0].heading.startsWith('Today')).toBe(true)
    expect(groups[1].heading.startsWith('Yesterday')).toBe(true)
    expect(groups.map((g) => g.day)).toEqual([...groups.map((g) => g.day)].sort().reverse())
  })

  it('filters by kind', () => {
    const groups = groupActivity(ACTIVITY, 'billing')
    expect(groups.flatMap((g) => g.items).every((i) => i.kind === 'billing')).toBe(true)
  })
})
