import { AlertTriangle, Inbox, RotateCw, type LucideIcon } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

export function Skeleton({ width = '100%', height = '1rem', style }: { width?: string; height?: string; style?: CSSProperties }) {
  return <span className="skeleton" style={{ width, height, ...style }} aria-hidden="true" />
}

export function SkeletonLines({ count = 4 }: { count?: number }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} width={i === count - 1 ? '60%' : '100%'} />
      ))}
    </div>
  )
}

interface EmptyStateProps {
  title: string
  children: ReactNode
  action?: ReactNode
  icon?: LucideIcon
}

export function EmptyState({ title, children, action, icon: Icon = Inbox }: EmptyStateProps) {
  return (
    <div className="state">
      <span className="state__icon"><Icon size={22} aria-hidden="true" /></span>
      <h3 className="state__title">{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  children?: ReactNode
  onRetry: () => void
}

export function ErrorState({ title = 'We couldn’t load this', children = 'The request didn’t complete. Your data is safe — try again.', onRetry }: ErrorStateProps) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__icon"><AlertTriangle size={22} aria-hidden="true" /></span>
      <h3 className="state__title">{title}</h3>
      <p>{children}</p>
      <button type="button" className="btn" onClick={onRetry}>
        <RotateCw size={16} aria-hidden="true" />
        Retry
      </button>
    </div>
  )
}
