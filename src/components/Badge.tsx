import { AlertTriangle, CheckCircle2, Clock, OctagonX, type LucideIcon } from 'lucide-react'
import { CUSTOMER_STATUS_LABELS } from '../data/customers'
import { STATUS_LABELS } from '../data/projects'
import type { CustomerStatus, HealthLevel, ProjectStatus } from '../data/types'

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps {
  tone: Tone
  icon: LucideIcon
  children: string
}

/** Status is always icon + text + colour, never colour alone. */
export function Badge({ tone, icon: Icon, children }: BadgeProps) {
  return (
    <span className={`badge badge--${tone}`}>
      <Icon size={14} aria-hidden="true" />
      {children}
    </span>
  )
}

const PROJECT_TONE: Record<ProjectStatus, { tone: Tone; icon: LucideIcon }> = {
  'on-track': { tone: 'success', icon: CheckCircle2 },
  'at-risk': { tone: 'warning', icon: AlertTriangle },
  blocked: { tone: 'danger', icon: OctagonX },
  completed: { tone: 'neutral', icon: CheckCircle2 },
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { tone, icon } = PROJECT_TONE[status]
  return <Badge tone={tone} icon={icon}>{STATUS_LABELS[status]}</Badge>
}

const CUSTOMER_TONE: Record<CustomerStatus, { tone: Tone; icon: LucideIcon }> = {
  active: { tone: 'success', icon: CheckCircle2 },
  trial: { tone: 'info', icon: Clock },
  'at-risk': { tone: 'warning', icon: AlertTriangle },
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const { tone, icon } = CUSTOMER_TONE[status]
  return <Badge tone={tone} icon={icon}>{CUSTOMER_STATUS_LABELS[status]}</Badge>
}

const HEALTH: Record<HealthLevel, { tone: Tone; icon: LucideIcon; label: string }> = {
  operational: { tone: 'success', icon: CheckCircle2, label: 'Operational' },
  degraded: { tone: 'warning', icon: AlertTriangle, label: 'Degraded' },
  incident: { tone: 'danger', icon: OctagonX, label: 'Incident' },
}

export function HealthBadge({ level }: { level: HealthLevel }) {
  const { tone, icon, label } = HEALTH[level]
  return <Badge tone={tone} icon={icon}>{label}</Badge>
}
