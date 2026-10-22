import type { ActivityItem, SystemService } from './types'

export const ACTIVITY: readonly ActivityItem[] = [
  { id: 'a-01', actor: 'Maya Okafor', action: 'completed milestone', target: 'Checkout payment methods', timestamp: '2026-10-22T10:42:00Z', kind: 'project' },
  { id: 'a-02', actor: 'Support bot', action: 'escalated ticket', target: '#4821 Brightline login timeout', timestamp: '2026-10-22T09:15:00Z', kind: 'support' },
  { id: 'a-03', actor: 'Billing', action: 'received payment from', target: 'Meridian Capital · $6,300', timestamp: '2026-10-22T08:03:00Z', kind: 'billing' },
  { id: 'a-04', actor: 'Daniel Reyes', action: 'marked at risk', target: 'Brightline onboarding flow', timestamp: '2026-10-21T16:30:00Z', kind: 'project' },
  { id: 'a-05', actor: 'Priya Nair', action: 'resolved ticket', target: '#4807 Export fails for large files', timestamp: '2026-10-21T14:12:00Z', kind: 'support' },
  { id: 'a-06', actor: 'Hana Sato', action: 'joined project', target: 'Saffron loyalty app', timestamp: '2026-10-21T11:48:00Z', kind: 'team' },
  { id: 'a-07', actor: 'Billing', action: 'flagged failed payment for', target: 'Skyline Realty · $380', timestamp: '2026-10-20T17:21:00Z', kind: 'billing' },
  { id: 'a-08', actor: 'Tomasz Wolski', action: 'blocked project', target: 'Tidewater CRM integration', timestamp: '2026-10-20T13:05:00Z', kind: 'project' },
  { id: 'a-09', actor: 'Maya Okafor', action: 'replied to ticket', target: '#4799 Invoice branding request', timestamp: '2026-10-20T09:40:00Z', kind: 'support' },
  { id: 'a-10', actor: 'Priya Nair', action: 'invited teammate', target: 'Leo Hartmann (Contractor)', timestamp: '2026-10-19T15:55:00Z', kind: 'team' },
  { id: 'a-11', actor: 'Billing', action: 'started trial for', target: 'Fernwood Stays · Growth plan', timestamp: '2026-10-19T10:10:00Z', kind: 'billing' },
  { id: 'a-12', actor: 'Daniel Reyes', action: 'shipped release', target: 'Harbor support portal v0.8', timestamp: '2026-10-18T16:02:00Z', kind: 'project' },
  { id: 'a-13', actor: 'Support bot', action: 'closed 6 stale tickets in', target: 'Backlog review', timestamp: '2026-10-17T08:30:00Z', kind: 'support' },
  { id: 'a-14', actor: 'Hana Sato', action: 'completed project', target: 'Quartz billing dashboard', timestamp: '2026-10-16T12:44:00Z', kind: 'project' },
  { id: 'a-15', actor: 'Tomasz Wolski', action: 'updated role of', target: 'Priya Nair → Delivery lead', timestamp: '2026-10-14T09:20:00Z', kind: 'team' },
  { id: 'a-16', actor: 'Billing', action: 'received payment from', target: 'Pioneer Energy · $5,480', timestamp: '2026-10-13T08:11:00Z', kind: 'billing' },
]

export const SYSTEM_SERVICES: readonly SystemService[] = [
  { id: 's-1', name: 'Client portal', level: 'operational', note: 'All checks passing' },
  { id: 's-2', name: 'Support inbox sync', level: 'degraded', note: 'Delayed by about 12 minutes' },
  { id: 's-3', name: 'Billing webhooks', level: 'operational', note: 'Last event 4 minutes ago' },
]

export const ACTIVITY_KIND_LABELS = { project: 'Projects', support: 'Support', billing: 'Billing', team: 'Team' } as const
