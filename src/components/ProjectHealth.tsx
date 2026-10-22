import { PROJECTS } from '../data/projects'
import type { Project } from '../data/types'
import { formatDate } from '../lib/format'
import { isOverdue } from '../lib/queries'
import { ProjectStatusBadge } from './Badge'
import { Progress } from './Progress'
import { Skeleton } from './States'

const RISK_ORDER = { blocked: 0, 'at-risk': 1, 'on-track': 2, completed: 3 } as const

/** Projects most in need of attention first. */
export const loadProjectHealth = (): Project[] =>
  [...PROJECTS].sort((a, b) => RISK_ORDER[a.status] - RISK_ORDER[b.status] || a.dueDate.localeCompare(b.dueDate)).slice(0, 5)

export function ProjectHealthList({ projects }: { projects: readonly Project[] }) {
  return (
    <ul className="health-list">
      {projects.map((p) => (
        <li key={p.id}>
          <div>
            <span className="table__primary">{p.name}</span>
            <span className="table__secondary">
              {p.owner} · Due <span className={isOverdue(p) ? 'overdue' : undefined}>{formatDate(p.dueDate)}{isOverdue(p) ? ' (overdue)' : ''}</span>
            </span>
          </div>
          <ProjectStatusBadge status={p.status} />
          <Progress value={p.progress} label={p.name} />
        </li>
      ))}
    </ul>
  )
}

export function ProjectHealthSkeleton() {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <Skeleton width="60%" />
          <Skeleton width="40%" height="0.75rem" />
          <Skeleton height="0.5rem" />
        </div>
      ))}
    </div>
  )
}
