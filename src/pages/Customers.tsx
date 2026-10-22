import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, Search, SearchX } from 'lucide-react'
import { useId, useState } from 'react'
import { AsyncRegion } from '../components/AsyncRegion'
import { CustomerStatusBadge } from '../components/Badge'
import { EmptyState, SkeletonLines } from '../components/States'
import { CUSTOMERS, PLAN_OPTIONS } from '../data/customers'
import type { Customer, CustomerPlan } from '../data/types'
import { useDemoData } from '../hooks/demo'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatCurrency, formatDate } from '../lib/format'
import { DEFAULT_CUSTOMER_QUERY, queryCustomers, type CustomerQuery, type CustomerSortKey, type SortDirection } from '../lib/queries'

const COLUMNS: ReadonlyArray<{ key: CustomerSortKey; label: string; numeric?: boolean }> = [
  { key: 'name', label: 'Customer' },
  { key: 'plan', label: 'Plan' },
  { key: 'mrr', label: 'MRR', numeric: true },
  { key: 'seats', label: 'Seats', numeric: true },
  { key: 'renewal', label: 'Renewal' },
]

export function CustomersPage() {
  useDocumentTitle('Customers')
  const uid = useId()
  const [query, setQuery] = useState<CustomerQuery>(DEFAULT_CUSTOMER_QUERY)
  const state = useDemoData({ key: 'customers', load: () => [...CUSTOMERS], empty: [] as Customer[], isEmpty: (d) => d.length === 0 })

  // Any change to search/filter returns to page 1 so results are never stranded on an empty page.
  const patchFilters = (next: Partial<CustomerQuery>) => setQuery((q) => ({ ...q, ...next, page: 1 }))
  const sortBy = (key: CustomerSortKey) =>
    setQuery((q) => ({ ...q, sortKey: key, direction: q.sortKey === key && q.direction === 'asc' ? 'desc' : 'asc', page: 1 }))

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Customers</h1>
          <p className="page-head__sub">Accounts, plans and upcoming renewals.</p>
        </div>
      </div>

      <section className="card" aria-label="Customer list">
        <AsyncRegion
          state={state}
          label="customers"
          skeleton={<SkeletonLines count={8} />}
          empty={
            <>
              <div className="toolbar" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="btn" disabled aria-describedby={`${uid}-export-hint`}>
                  <Download size={16} aria-hidden="true" />
                  Export CSV
                </button>
              </div>
              <EmptyState title="No customers yet">Customers appear here once they sign up or you import an account list.</EmptyState>
              <p id={`${uid}-export-hint`} className="sr-only">Export is unavailable until there is at least one customer.</p>
            </>
          }
        >
          {(all) => {
            const result = queryCustomers(all, query)
            const start = result.total === 0 ? 0 : (result.page - 1) * query.pageSize + 1
            const end = start + result.rows.length - (result.total === 0 ? 0 : 1)
            const filtered = query.search !== '' || query.plan !== 'all'
            return (
              <>
                <div className="toolbar">
                  <div className="field search">
                    <label className="sr-only" htmlFor={`${uid}-search`}>Search customers</label>
                    <Search size={16} className="search__icon" aria-hidden="true" />
                    <input id={`${uid}-search`} className="input" type="search" placeholder="Search by name or contact" value={query.search} onChange={(e) => patchFilters({ search: e.target.value })} />
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor={`${uid}-plan`}>Plan</label>
                    <select id={`${uid}-plan`} className="select" value={query.plan} onChange={(e) => patchFilters({ plan: e.target.value as CustomerPlan | 'all' })}>
                      <option value="all">All plans</option>
                      {PLAN_OPTIONS.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="field mobile-only">
                    <label className="field__label" htmlFor={`${uid}-sort`}>Sort by</label>
                    <select
                      id={`${uid}-sort`}
                      className="select"
                      value={`${query.sortKey}:${query.direction}`}
                      onChange={(e) => {
                        const [sortKey, direction] = e.target.value.split(':') as [CustomerSortKey, SortDirection]
                        setQuery((q) => ({ ...q, sortKey, direction, page: 1 }))
                      }}
                    >
                      {COLUMNS.flatMap((c) => [
                        <option key={`${c.key}:asc`} value={`${c.key}:asc`}>{c.label} (low to high)</option>,
                        <option key={`${c.key}:desc`} value={`${c.key}:desc`}>{c.label} (high to low)</option>,
                      ])}
                    </select>
                  </div>
                  <button type="button" className="btn" disabled={result.total === 0}>
                    <Download size={16} aria-hidden="true" />
                    Export CSV
                  </button>
                </div>

                <p className="sr-only" role="status" aria-live="polite">
                  {result.total} {result.total === 1 ? 'customer' : 'customers'} found
                </p>

                {result.total === 0 ? (
                  <EmptyState
                    icon={SearchX}
                    title="No customers match your search"
                    action={filtered ? <button type="button" className="btn" onClick={() => setQuery(DEFAULT_CUSTOMER_QUERY)}>Clear search and filters</button> : undefined}
                  >
                    Check the spelling or try a different plan.
                  </EmptyState>
                ) : (
                  <>
                    <div className="table-wrap" role="region" aria-label="Customers table" tabIndex={0}>
                      <table className="table table--stack">
                        <thead>
                          <tr>
                            {COLUMNS.map((c) => {
                              const active = query.sortKey === c.key
                              const sortLabel = `Sort by ${c.label}${active ? (query.direction === 'asc' ? ', currently ascending' : ', currently descending') : ''}`
                              return (
                                <th key={c.key} scope="col" className={c.numeric ? 'num' : undefined} aria-sort={active ? (query.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                                  <button type="button" className="sort-button" data-active={active} onClick={() => sortBy(c.key)} aria-label={sortLabel}>
                                    {c.label}
                                    {active && (query.direction === 'asc' ? <ArrowUp size={14} aria-hidden="true" /> : <ArrowDown size={14} aria-hidden="true" />)}
                                  </button>
                                </th>
                              )
                            })}
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.rows.map((c) => (
                            <tr key={c.id}>
                              <th scope="row" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 'inherit', color: 'var(--text)' }}>
                                <span className="table__primary">{c.name}</span>
                                <span className="table__secondary">{c.contact}</span>
                              </th>
                              <td data-label="Plan">{c.plan}</td>
                              <td className="num" data-label="MRR">{formatCurrency(c.mrr)}</td>
                              <td className="num" data-label="Seats">{c.seats}</td>
                              <td data-label="Renewal"><time dateTime={c.renewal}>{formatDate(c.renewal)}</time></td>
                              <td data-label="Status"><CustomerStatusBadge status={c.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <nav className="pagination" aria-label="Customers pagination">
                      <span className="card__sub num">Showing {start}–{end} of {result.total}</span>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                        <button type="button" className="btn btn--sm" disabled={result.page <= 1} onClick={() => setQuery((q) => ({ ...q, page: result.page - 1 }))}>
                          <ChevronLeft size={16} aria-hidden="true" />
                          Previous
                        </button>
                        <span className="num" aria-current="page">Page {result.page} of {result.pageCount}</span>
                        <button type="button" className="btn btn--sm" disabled={result.page >= result.pageCount} onClick={() => setQuery((q) => ({ ...q, page: result.page + 1 }))}>
                          Next
                          <ChevronRight size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </nav>
                  </>
                )}
              </>
            )
          }}
        </AsyncRegion>
      </section>
    </div>
  )
}
