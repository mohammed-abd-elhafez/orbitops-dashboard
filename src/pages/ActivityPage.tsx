import { SearchX } from 'lucide-react'
import { useId, useState } from 'react'
import { ActivityList, ActivitySkeleton } from '../components/ActivityList'
import { AsyncRegion } from '../components/AsyncRegion'
import { EmptyState } from '../components/States'
import { ACTIVITY, ACTIVITY_KIND_LABELS } from '../data/activity'
import type { ActivityItem, ActivityKind } from '../data/types'
import { useDemoData } from '../hooks/demo'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { groupActivity } from '../lib/queries'

export function ActivityPage() {
  useDocumentTitle('Activity')
  const uid = useId()
  const [kind, setKind] = useState<ActivityKind | 'all'>('all')
  const state = useDemoData({ key: 'activity', load: () => [...ACTIVITY], empty: [] as ActivityItem[], isEmpty: (d) => d.length === 0 })

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Activity</h1>
          <p className="page-head__sub">Everything that changed across projects, support, billing and the team.</p>
        </div>
        <div className="field">
          <label className="field__label" htmlFor={`${uid}-kind`}>Show</label>
          <select id={`${uid}-kind`} className="select" value={kind} onChange={(e) => setKind(e.target.value as ActivityKind | 'all')}>
            <option value="all">All activity</option>
            {(Object.keys(ACTIVITY_KIND_LABELS) as ActivityKind[]).map((k) => (
              <option key={k} value={k}>{ACTIVITY_KIND_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="card" aria-label="Activity timeline">
        <AsyncRegion
          state={state}
          label="activity"
          skeleton={<ActivitySkeleton rows={6} />}
          empty={<EmptyState title="No activity yet">When your team updates a project or replies to a customer, it will show up here.</EmptyState>}
        >
          {(items) => {
            const groups = groupActivity(items, kind)
            if (groups.length === 0) {
              return (
                <EmptyState
                  icon={SearchX}
                  title="No activity of this type"
                  action={<button type="button" className="btn" onClick={() => setKind('all')}>Show all activity</button>}
                >
                  Nothing has been logged under {ACTIVITY_KIND_LABELS[kind as ActivityKind]} yet.
                </EmptyState>
              )
            }
            return groups.map((g) => (
              <section key={g.day} className="timeline-group" aria-labelledby={`${uid}-${g.day}`}>
                <h2 id={`${uid}-${g.day}`}>{g.heading}</h2>
                <ActivityList items={g.items} />
              </section>
            ))
          }}
        </AsyncRegion>
      </section>
    </div>
  )
}
