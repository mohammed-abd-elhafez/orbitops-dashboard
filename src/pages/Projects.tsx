import { CheckCircle2, Plus, Search, SearchX } from 'lucide-react'
import { useId, useState } from 'react'
import { ProjectStatusBadge } from '../components/Badge'
import { AsyncRegion } from '../components/AsyncRegion'
import { NewProjectDialog } from '../components/NewProjectDialog'
import { Progress } from '../components/Progress'
import { StatusTabs, type TabDef } from '../components/StatusTabs'
import { EmptyState, SkeletonLines } from '../components/States'
import { PROJECTS, STATUS_LABELS } from '../data/projects'
import { OWNERS } from '../data/reference'
import { isProjectList, type Project } from '../data/types'
import { useDemoData } from '../hooks/demo'
import { usePersistentState } from '../hooks/usePersistentState'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../lib/format'
import { countByStatus, DEFAULT_PROJECT_QUERY, isOverdue, queryProjects, type ProjectQuery, type ProjectSort, type ProjectStatusFilter } from '../lib/queries'

export function ProjectsPage() {
  useDocumentTitle('Projects')
  const uid = useId()
  const [query, setQuery] = useState<ProjectQuery>(DEFAULT_PROJECT_QUERY)
  const [created, setCreated, resetCreated] = usePersistentState<Project[]>('orbitops-projects', [], isProjectList)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const state = useDemoData({ key: 'projects', load: () => [...created, ...PROJECTS], empty: [] as Project[], isEmpty: (d) => d.length === 0 })
  const patch = (next: Partial<ProjectQuery>) => setQuery((q) => ({ ...q, ...next }))

  const newProjectButton = (
    <button type="button" className="btn btn--primary" onClick={() => setDialogOpen(true)}>
      <Plus size={16} aria-hidden="true" />
      New project
    </button>
  )

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Projects</h1>
          <p className="page-head__sub">Track delivery status, owners and deadlines.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {created.length > 0 && (
            <button type="button" className="btn" onClick={() => { resetCreated(); setNotice('Demo projects you created were removed.') }}>
              Reset demo data
            </button>
          )}
          {newProjectButton}
        </div>
      </div>

      <div role="status" aria-live="polite">
        {notice && (
          <div className="banner banner--success">
            <CheckCircle2 size={18} aria-hidden="true" />
            <p className="banner__title">{notice}</p>
          </div>
        )}
      </div>

      <section className="card" aria-label="Project list">
        <AsyncRegion
          state={state}
          label="projects"
          skeleton={<SkeletonLines count={7} />}
          empty={
            <EmptyState title="No projects yet" action={newProjectButton}>
              Create your first project to start tracking progress, owners and due dates.
            </EmptyState>
          }
        >
          {(all) => {
            const counts = countByStatus(all)
            const tabs: TabDef<ProjectStatusFilter>[] = [
              { key: 'all', label: 'All', count: counts.all },
              { key: 'on-track', label: 'On track', count: counts['on-track'] },
              { key: 'at-risk', label: 'At risk', count: counts['at-risk'] },
              { key: 'blocked', label: 'Blocked', count: counts.blocked },
              { key: 'completed', label: 'Completed', count: counts.completed },
            ]
            const rows = queryProjects(all, query)
            const filtered = query.search !== '' || query.owner !== '' || query.status !== 'all'
            const panelId = `${uid}-panel`
            return (
              <>
                <StatusTabs tabs={tabs} value={query.status} onChange={(status) => patch({ status })} label="Filter projects by status" panelId={panelId} />
                <div className="toolbar">
                  <div className="field search">
                    <label className="sr-only" htmlFor={`${uid}-search`}>Search projects</label>
                    <Search size={16} className="search__icon" aria-hidden="true" />
                    <input id={`${uid}-search`} className="input" type="search" placeholder="Search projects or customers" value={query.search} onChange={(e) => patch({ search: e.target.value })} />
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor={`${uid}-owner`}>Owner</label>
                    <select id={`${uid}-owner`} className="select" value={query.owner} onChange={(e) => patch({ owner: e.target.value })}>
                      <option value="">Everyone</option>
                      {OWNERS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor={`${uid}-sort`}>Sort by</label>
                    <select id={`${uid}-sort`} className="select" value={query.sort} onChange={(e) => patch({ sort: e.target.value as ProjectSort })}>
                      <option value="due">Due date</option>
                      <option value="progress">Progress</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                </div>

                <p className="sr-only" role="status" aria-live="polite">{rows.length} {rows.length === 1 ? 'project' : 'projects'} shown</p>

                <div id={panelId} role="tabpanel" aria-labelledby={`${panelId}-tab-${query.status}`}>
                  {rows.length === 0 ? (
                    <EmptyState
                      icon={SearchX}
                      title="No projects match these filters"
                      action={filtered ? <button type="button" className="btn" onClick={() => setQuery(DEFAULT_PROJECT_QUERY)}>Clear filters</button> : undefined}
                    >
                      Try a different search term, owner or status.
                    </EmptyState>
                  ) : (
                    <div className="table-wrap" role="region" aria-label="Projects table" tabIndex={0}>
                      <table className="table table--stack">
                        <thead>
                          <tr>
                            <th scope="col">Project</th>
                            <th scope="col">Owner</th>
                            <th scope="col">Due</th>
                            <th scope="col">Progress</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((p) => (
                            <tr key={p.id}>
                              <th scope="row" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 'inherit', color: 'var(--text)' }}>
                                <span className="table__primary">{p.name}</span>
                                <span className="table__secondary">{p.customer}</span>
                              </th>
                              <td data-label="Owner">{p.owner}</td>
                              <td className="num" data-label="Due">
                                <time dateTime={p.dueDate} className={isOverdue(p) ? 'overdue' : undefined}>{formatDate(p.dueDate)}</time>
                                {isOverdue(p) && <span className="table__secondary overdue">Overdue</span>}
                              </td>
                              <td data-label="Progress"><Progress value={p.progress} label={p.name} /></td>
                              <td data-label="Status"><ProjectStatusBadge status={p.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )
          }}
        </AsyncRegion>
      </section>

      {dialogOpen && (
        <NewProjectDialog
          onCancel={() => setDialogOpen(false)}
          onCreate={(project) => {
            setCreated((list) => [project, ...list])
            setDialogOpen(false)
            setQuery(DEFAULT_PROJECT_QUERY)
            setNotice(`“${project.name}” was created and is marked ${STATUS_LABELS[project.status]}.`)
          }}
        />
      )}
    </div>
  )
}
