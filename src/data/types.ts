export type RangeKey = '7d' | '30d' | '90d'

export type Trend = 'up' | 'down' | 'flat'

export interface Metric {
  id: 'mrr' | 'projects' | 'support' | 'csat'
  label: string
  value: string
  /** Human-readable change, e.g. "+4.2% vs previous 30 days". */
  delta: string
  trend: Trend
  /** Whether the trend direction is good news for the team. */
  favourable: boolean
}

export interface RevenuePoint {
  label: string
  value: number
}

export interface OverviewData {
  rangeLabel: string
  metrics: Metric[]
  revenue: RevenuePoint[]
}

export type ProjectStatus = 'on-track' | 'at-risk' | 'blocked' | 'completed'

export interface Project {
  id: string
  name: string
  customer: string
  owner: string
  /** ISO date (yyyy-mm-dd). */
  dueDate: string
  progress: number
  status: ProjectStatus
}

const PROJECT_STATUSES: readonly string[] = ['on-track', 'at-risk', 'blocked', 'completed']

/** Runtime check for data read back from localStorage. */
export function isProjectList(value: unknown): value is Project[] {
  return (
    Array.isArray(value) &&
    value.every(
      (p) =>
        typeof p === 'object' && p !== null &&
        typeof p.id === 'string' && typeof p.name === 'string' && typeof p.customer === 'string' &&
        typeof p.owner === 'string' && typeof p.dueDate === 'string' && typeof p.progress === 'number' &&
        PROJECT_STATUSES.includes(p.status),
    )
  )
}

export type CustomerPlan = 'Starter' | 'Growth' | 'Scale'
export type CustomerStatus = 'active' | 'trial' | 'at-risk'

export interface Customer {
  id: string
  name: string
  contact: string
  plan: CustomerPlan
  mrr: number
  seats: number
  /** ISO date (yyyy-mm-dd). */
  renewal: string
  status: CustomerStatus
}

export type ActivityKind = 'project' | 'support' | 'billing' | 'team'

export interface ActivityItem {
  id: string
  actor: string
  action: string
  target: string
  /** ISO timestamp in UTC. */
  timestamp: string
  kind: ActivityKind
}

export type HealthLevel = 'operational' | 'degraded' | 'incident'

export interface SystemService {
  id: string
  name: string
  level: HealthLevel
  note: string
}
