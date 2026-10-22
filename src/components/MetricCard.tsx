import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type { Metric } from '../data/types'
import { Skeleton } from './States'

const ICONS = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus }

export function MetricCard({ metric }: { metric: Metric }) {
  const Icon = ICONS[metric.trend]
  const tone = metric.trend === 'flat' ? 'flat' : metric.favourable ? 'good' : 'bad'
  const spoken = metric.trend === 'flat' ? '' : metric.favourable ? 'Improving: ' : 'Needs attention: '
  return (
    <article className="card metric" aria-label={metric.label}>
      <h3 className="metric__label">{metric.label}</h3>
      <span className="metric__value">{metric.value}</span>
      <span className={`metric__delta metric__delta--${tone}`}>
        <Icon size={14} aria-hidden="true" />
        <span className="sr-only">{spoken}</span>
        {metric.delta}
      </span>
    </article>
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="card" aria-hidden="true">
      <Skeleton width="70%" />
      <Skeleton width="45%" height="2rem" style={{ margin: 'var(--space-3) 0' }} />
      <Skeleton width="60%" height="0.75rem" />
    </div>
  )
}
