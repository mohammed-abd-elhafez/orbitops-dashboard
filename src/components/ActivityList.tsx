import { CircleDollarSign, FolderKanban, LifeBuoy, Users, type LucideIcon } from 'lucide-react'
import type { ActivityItem, ActivityKind } from '../data/types'
import { formatTime } from '../lib/format'
import { Skeleton } from './States'

const KIND_ICON: Record<ActivityKind, LucideIcon> = {
  project: FolderKanban,
  support: LifeBuoy,
  billing: CircleDollarSign,
  team: Users,
}

export function ActivityList({ items, showDate = false }: { items: readonly ActivityItem[]; showDate?: boolean }) {
  return (
    <ul className="feed">
      {items.map((item) => {
        const Icon = KIND_ICON[item.kind]
        return (
          <li key={item.id}>
            <span className="feed__icon"><Icon size={16} aria-hidden="true" /></span>
            <div>
              <p>
                <strong>{item.actor}</strong> {item.action} <strong>{item.target}</strong>
              </p>
              <time className="feed__time" dateTime={item.timestamp}>
                {showDate ? `${item.timestamp.slice(0, 10)} · ` : ''}{formatTime(item.timestamp)}
              </time>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function ActivitySkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }} aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Skeleton width="2rem" height="2rem" style={{ borderRadius: '50%', flex: 'none' }} />
          <div style={{ flex: 1, display: 'grid', gap: 'var(--space-2)' }}>
            <Skeleton width="85%" />
            <Skeleton width="30%" height="0.75rem" />
          </div>
        </div>
      ))}
    </div>
  )
}
