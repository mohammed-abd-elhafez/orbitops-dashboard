import { AlertTriangle } from 'lucide-react'
import type { SystemService } from '../data/types'
import { HealthBadge } from './Badge'
import { SkeletonLines } from './States'

export function ServiceList({ services }: { services: readonly SystemService[] }) {
  const degraded = services.filter((s) => s.level !== 'operational')
  return (
    <>
      {degraded.length > 0 && (
        <div className="banner banner--warning" role="status" style={{ marginBottom: 'var(--space-3)' }}>
          <AlertTriangle size={18} aria-hidden="true" />
          <div className="banner__body">
            <p className="banner__title">
              {degraded.length === 1 ? '1 service needs attention' : `${degraded.length} services need attention`}
            </p>
            <p>{degraded.map((s) => `${s.name}: ${s.note}`).join('. ')}</p>
          </div>
        </div>
      )}
      <ul className="service-list">
        {services.map((s) => (
          <li key={s.id}>
            <div>
              <span className="table__primary">{s.name}</span>
              <span className="table__secondary">{s.note}</span>
            </div>
            <HealthBadge level={s.level} />
          </li>
        ))}
      </ul>
    </>
  )
}

export const ServicesSkeleton = () => <SkeletonLines count={3} />
