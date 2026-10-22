import type { Project } from './types'

export const PROJECTS: readonly Project[] = [
  { id: 'p-101', name: 'Northwind checkout rebuild', customer: 'Northwind Goods', owner: 'Maya Okafor', dueDate: '2026-11-06', progress: 72, status: 'on-track' },
  { id: 'p-102', name: 'Brightline onboarding flow', customer: 'Brightline Health', owner: 'Daniel Reyes', dueDate: '2026-10-28', progress: 58, status: 'at-risk' },
  { id: 'p-103', name: 'Atlas data migration', customer: 'Atlas Freight', owner: 'Priya Nair', dueDate: '2026-10-19', progress: 41, status: 'blocked' },
  { id: 'p-104', name: 'Juniper brand site refresh', customer: 'Juniper Studio', owner: 'Hana Sato', dueDate: '2026-12-03', progress: 24, status: 'on-track' },
  { id: 'p-105', name: 'Meridian analytics portal', customer: 'Meridian Capital', owner: 'Tomasz Wolski', dueDate: '2026-11-20', progress: 66, status: 'on-track' },
  { id: 'p-106', name: 'Lumen mobile web audit', customer: 'Lumen Retail', owner: 'Maya Okafor', dueDate: '2026-10-14', progress: 100, status: 'completed' },
  { id: 'p-107', name: 'Harbor support portal', customer: 'Harbor Logistics', owner: 'Daniel Reyes', dueDate: '2026-11-12', progress: 49, status: 'at-risk' },
  { id: 'p-108', name: 'Fernwood booking engine', customer: 'Fernwood Stays', owner: 'Priya Nair', dueDate: '2026-12-15', progress: 12, status: 'on-track' },
  { id: 'p-109', name: 'Quartz billing dashboard', customer: 'Quartz Software', owner: 'Hana Sato', dueDate: '2026-10-09', progress: 100, status: 'completed' },
  { id: 'p-110', name: 'Tidewater CRM integration', customer: 'Tidewater Marine', owner: 'Tomasz Wolski', dueDate: '2026-11-02', progress: 33, status: 'blocked' },
  { id: 'p-111', name: 'Orchard design system', customer: 'Orchard Foods', owner: 'Maya Okafor', dueDate: '2026-11-27', progress: 55, status: 'on-track' },
  { id: 'p-112', name: 'Saffron loyalty app', customer: 'Saffron Kitchens', owner: 'Hana Sato', dueDate: '2026-12-09', progress: 18, status: 'on-track' },
]

export const STATUS_LABELS = {
  'on-track': 'On track',
  'at-risk': 'At risk',
  blocked: 'Blocked',
  completed: 'Completed',
} as const
