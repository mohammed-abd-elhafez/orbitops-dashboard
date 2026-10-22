import { Link } from 'react-router-dom'
import { ActivityList, ActivitySkeleton } from '../components/ActivityList'
import { AsyncRegion } from '../components/AsyncRegion'
import { DateRangeControl } from '../components/DateRangeControl'
import { MetricCard, MetricCardSkeleton } from '../components/MetricCard'
import { loadProjectHealth, ProjectHealthList, ProjectHealthSkeleton } from '../components/ProjectHealth'
import { RevenueChart } from '../components/RevenueChart'
import { EmptyState, SkeletonLines } from '../components/States'
import { ServiceList, ServicesSkeleton } from '../components/SystemHealthCard'
import { ACTIVITY, SYSTEM_SERVICES } from '../data/activity'
import { EMPTY_OVERVIEW, getOverview, RANGE_OPTIONS } from '../data/overview'
import type { RangeKey } from '../data/types'
import { useState } from 'react'
import { useDemoData } from '../hooks/demo'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function OverviewPage() {
  useDocumentTitle('Overview')
  const [range, setRange] = useState<RangeKey>('30d')
  const rangeInfo = RANGE_OPTIONS.find((r) => r.key === range)

  const overview = useDemoData({
    key: range,
    load: () => getOverview(range),
    empty: EMPTY_OVERVIEW,
    isEmpty: (d) => d.metrics.length === 0,
  })
  const projects = useDemoData({ key: 'health', load: loadProjectHealth, empty: [], isEmpty: (d) => d.length === 0 })
  const activity = useDemoData({ key: 'feed', load: () => ACTIVITY.slice(0, 5), empty: [], isEmpty: (d) => d.length === 0 })
  const services = useDemoData({ key: 'services', load: () => [...SYSTEM_SERVICES], empty: [], isEmpty: (d) => d.length === 0 })

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Overview</h1>
          <p className="page-head__sub">
            Showing <strong>{rangeInfo?.description}</strong>
          </p>
        </div>
        <DateRangeControl value={range} onChange={setRange} />
      </div>

      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">Key metrics</h2>
        <AsyncRegion
          state={overview}
          label="key metrics"
          skeleton={<div className="grid-metrics">{[0, 1, 2, 3].map((i) => <MetricCardSkeleton key={i} />)}</div>}
          empty={<div className="card"><EmptyState title="No metrics for this period">Metrics appear once your team has logged projects, revenue or support activity.</EmptyState></div>}
        >
          {(data) => (
            <div className="grid-metrics">
              {data.metrics.map((m) => <MetricCard key={m.id} metric={m} />)}
            </div>
          )}
        </AsyncRegion>
      </section>

      <div className="grid-main grid-main--two">
        <section className="card" aria-labelledby="revenue-heading">
          <div className="card__head">
            <h2 id="revenue-heading">Revenue trend</h2>
            <span className="card__sub">Monthly recurring revenue</span>
          </div>
          <div className="overview-card__region overview-card__region--revenue">
            <AsyncRegion
              state={overview}
              label="revenue chart"
              skeleton={<SkeletonLines count={6} />}
              empty={<EmptyState title="No revenue data yet">Connect billing or import invoices to see your recurring revenue trend.</EmptyState>}
            >
              {(data) => <RevenueChart points={data.revenue} />}
            </AsyncRegion>
          </div>
        </section>

        <section className="card" aria-labelledby="health-heading">
          <div className="card__head">
            <h2 id="health-heading">Project health</h2>
            <Link to="/projects">View all projects</Link>
          </div>
          <div className="overview-card__region overview-card__region--health">
            <AsyncRegion
              state={projects}
              label="project health"
              skeleton={<ProjectHealthSkeleton />}
              empty={<EmptyState title="No projects yet" action={<Link className="btn btn--primary" to="/projects">Create a project</Link>}>Projects you start will show their status and progress here.</EmptyState>}
            >
              {(list) => <ProjectHealthList projects={list} />}
            </AsyncRegion>
          </div>
        </section>
      </div>

      <div className="grid-main grid-main--two">
        <section className="card" aria-labelledby="feed-heading">
          <div className="card__head">
            <h2 id="feed-heading">Recent activity</h2>
            <Link to="/activity">View timeline</Link>
          </div>
          <div className="overview-card__region overview-card__region--activity">
            <AsyncRegion
              state={activity}
              label="recent activity"
              skeleton={<ActivitySkeleton rows={5} />}
              empty={<EmptyState title="Nothing has happened yet">Updates from projects, support and billing will appear here.</EmptyState>}
            >
              {(items) => <ActivityList items={items} showDate />}
            </AsyncRegion>
          </div>
        </section>

        <section className="card" aria-labelledby="system-heading">
          <div className="card__head">
            <h2 id="system-heading">System health</h2>
          </div>
          <div className="overview-card__region overview-card__region--services">
            <AsyncRegion
              state={services}
              label="system health"
              skeleton={<ServicesSkeleton />}
              empty={<EmptyState title="No services monitored">Add a service to start tracking its status.</EmptyState>}
            >
              {(list) => <ServiceList services={list} />}
            </AsyncRegion>
          </div>
        </section>
      </div>
    </div>
  )
}
