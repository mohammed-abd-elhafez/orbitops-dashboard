import { REFERENCE_DATE } from '../data/reference'
import type { ActivityItem, ActivityKind, Customer, CustomerPlan, Project, ProjectStatus } from '../data/types'
import { formatDay } from './format'

const matches = (text: string, query: string) => text.toLowerCase().includes(query.trim().toLowerCase())

/* ---------- Projects ---------- */

export type ProjectStatusFilter = ProjectStatus | 'all'
export type ProjectSort = 'due' | 'progress' | 'name'

export interface ProjectQuery {
  status: ProjectStatusFilter
  search: string
  owner: string // '' = everyone
  sort: ProjectSort
}

export const DEFAULT_PROJECT_QUERY: ProjectQuery = { status: 'all', search: '', owner: '', sort: 'due' }

export function countByStatus(projects: readonly Project[]): Record<ProjectStatusFilter, number> {
  const counts: Record<ProjectStatusFilter, number> = { all: projects.length, 'on-track': 0, 'at-risk': 0, blocked: 0, completed: 0 }
  for (const p of projects) counts[p.status] += 1
  return counts
}

export function queryProjects(projects: readonly Project[], q: ProjectQuery): Project[] {
  const rows = projects.filter(
    (p) =>
      (q.status === 'all' || p.status === q.status) &&
      (q.owner === '' || p.owner === q.owner) &&
      (q.search.trim() === '' || matches(`${p.name} ${p.customer}`, q.search)),
  )
  const sorters: Record<ProjectSort, (a: Project, b: Project) => number> = {
    due: (a, b) => a.dueDate.localeCompare(b.dueDate),
    progress: (a, b) => b.progress - a.progress,
    name: (a, b) => a.name.localeCompare(b.name),
  }
  return [...rows].sort(sorters[q.sort])
}

/** A project is overdue when it is unfinished and past its due date. */
export const isOverdue = (p: Project) => p.status !== 'completed' && p.dueDate < REFERENCE_DATE

/* ---------- Customers ---------- */

export type CustomerSortKey = 'name' | 'plan' | 'mrr' | 'seats' | 'renewal'
export type SortDirection = 'asc' | 'desc'

export interface CustomerQuery {
  search: string
  plan: CustomerPlan | 'all'
  sortKey: CustomerSortKey
  direction: SortDirection
  page: number
  pageSize: number
}

export const DEFAULT_CUSTOMER_QUERY: CustomerQuery = {
  search: '',
  plan: 'all',
  sortKey: 'name',
  direction: 'asc',
  page: 1,
  pageSize: 8,
}

const PLAN_RANK: Record<CustomerPlan, number> = { Starter: 0, Growth: 1, Scale: 2 }

function compareCustomers(a: Customer, b: Customer, key: CustomerSortKey): number {
  switch (key) {
    case 'name':
      return a.name.localeCompare(b.name)
    case 'plan':
      return PLAN_RANK[a.plan] - PLAN_RANK[b.plan]
    case 'mrr':
      return a.mrr - b.mrr
    case 'seats':
      return a.seats - b.seats
    case 'renewal':
      return a.renewal.localeCompare(b.renewal)
  }
}

export interface CustomerPage {
  rows: Customer[]
  total: number
  page: number
  pageCount: number
}

export function queryCustomers(customers: readonly Customer[], q: CustomerQuery): CustomerPage {
  const filtered = customers.filter(
    (c) => (q.plan === 'all' || c.plan === q.plan) && (q.search.trim() === '' || matches(`${c.name} ${c.contact}`, q.search)),
  )
  const sign = q.direction === 'asc' ? 1 : -1
  const sorted = [...filtered].sort((a, b) => sign * compareCustomers(a, b, q.sortKey))
  const pageCount = Math.max(1, Math.ceil(sorted.length / q.pageSize))
  const page = Math.min(Math.max(1, q.page), pageCount)
  const start = (page - 1) * q.pageSize
  return { rows: sorted.slice(start, start + q.pageSize), total: sorted.length, page, pageCount }
}

/* ---------- Activity ---------- */

export interface ActivityGroup {
  day: string
  heading: string
  items: ActivityItem[]
}

export function groupActivity(items: readonly ActivityItem[], kind: ActivityKind | 'all'): ActivityGroup[] {
  const filtered = items
    .filter((i) => kind === 'all' || i.kind === kind)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
  const groups = new Map<string, ActivityItem[]>()
  for (const item of filtered) {
    const day = item.timestamp.slice(0, 10)
    groups.set(day, [...(groups.get(day) ?? []), item])
  }
  const yesterday = new Date(Date.parse(`${REFERENCE_DATE}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10)
  return [...groups.entries()].map(([day, list]) => {
    const prefix = day === REFERENCE_DATE ? 'Today · ' : day === yesterday ? 'Yesterday · ' : ''
    return { day, heading: `${prefix}${formatDay(list[0].timestamp)}`, items: list }
  })
}
