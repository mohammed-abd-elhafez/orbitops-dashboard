import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderApp } from './test/renderApp'

describe('navigation', () => {
  it('renders landmarks and marks the current page', async () => {
    renderApp('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(within(nav).getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page')
  })

  it('navigates between routes', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.click(within(screen.getByRole('navigation', { name: 'Primary' })).getByRole('link', { name: 'Customers' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Customers' })).toBeInTheDocument()
  })

  it('opens and closes the mobile drawer, restoring focus', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const menu = screen.getByRole('button', { name: 'Open navigation menu' })
    expect(menu).toHaveAttribute('aria-expanded', 'false')

    await user.click(menu)
    const drawer = screen.getByRole('dialog', { name: 'Navigation menu' })
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    expect(within(drawer).getByRole('link', { name: 'Projects' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Navigation menu' })).not.toBeInTheDocument()
    expect(menu).toHaveFocus()
  })

  it('closes the drawer after choosing a link', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.click(screen.getByRole('button', { name: 'Open navigation menu' }))
    await user.click(within(screen.getByRole('dialog', { name: 'Navigation menu' })).getByRole('link', { name: 'Activity' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Activity' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Navigation menu' })).not.toBeInTheDocument()
  })
})

describe('projects filtering', () => {
  it('status tabs and search change the visible rows', async () => {
    const user = userEvent.setup()
    renderApp('/projects')
    const table = await screen.findByRole('table')
    expect(within(table).getAllByRole('row')).toHaveLength(13) // header + 12 projects

    await user.click(screen.getByRole('tab', { name: /^Blocked/ }))
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(3)

    await user.click(screen.getByRole('tab', { name: /^All/ }))
    await user.type(screen.getByRole('searchbox', { name: 'Search projects' }), 'zzz-nothing')
    expect(screen.getByText('No projects match these filters')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(within(await screen.findByRole('table')).getAllByRole('row')).toHaveLength(13)
  })

  it('supports arrow-key navigation between tabs', async () => {
    const user = userEvent.setup()
    renderApp('/projects')
    const all = await screen.findByRole('tab', { name: /^All/ })
    all.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: /^On track/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('validates the new project dialog and adds the project', async () => {
    const user = userEvent.setup()
    renderApp('/projects')
    await user.click(await screen.findByRole('button', { name: 'New project' }))
    const dialog = screen.getByRole('dialog', { name: 'New project' })

    await user.click(within(dialog).getByRole('button', { name: 'Create project' }))
    expect(within(dialog).getByRole('alert')).toHaveTextContent('Fix 3 fields')

    await user.type(within(dialog).getByLabelText('Project name'), 'Pilot dashboard')
    await user.type(within(dialog).getByLabelText('Customer'), 'Acme Co')
    await user.type(within(dialog).getByLabelText('Due date'), '2026-12-01')
    await user.click(within(dialog).getByRole('button', { name: 'Create project' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Pilot dashboard')).toBeInTheDocument()
  })
})

describe('customers', () => {
  it('searches, sorts and paginates', async () => {
    const user = userEvent.setup()
    renderApp('/customers')
    expect(await screen.findByText('Showing 1–8 of 24')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Showing 9–16 of 24')).toBeInTheDocument()

    await user.type(screen.getByRole('searchbox', { name: 'Search customers' }), 'atlas')
    expect(screen.getByText('Showing 1–1 of 1')).toBeInTheDocument()

    await user.clear(screen.getByRole('searchbox', { name: 'Search customers' }))
    await user.click(screen.getByRole('button', { name: /^Sort by MRR/ }))
    expect(screen.getByRole('columnheader', { name: /MRR/ })).toHaveAttribute('aria-sort', 'ascending')
  })
})

describe('overview date range', () => {
  it('changes the summary and chart data', async () => {
    const user = userEvent.setup()
    renderApp('/')
    expect(await screen.findByText('+4.2% vs previous 30 days')).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: '7 days' }))
    expect(await screen.findByText('+0.9% vs previous 7 days')).toBeInTheDocument()
    expect(screen.getByText(/from \$47,760 on Oct 16/)).toBeInTheDocument()
  })

  it('offers the chart data as a table', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.click(await screen.findByRole('button', { name: 'View as table' }))
    expect(screen.getByRole('table', { name: 'Monthly recurring revenue by date' })).toBeInTheDocument()
  })
})

describe('data states', () => {
  it('shows empty states with a next action', async () => {
    renderApp('/projects', 'empty')
    expect(await screen.findByText('No projects yet')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'New project' }).length).toBeGreaterThan(0)
  })

  it('shows a recoverable error that Retry fixes', async () => {
    const user = userEvent.setup()
    renderApp('/customers', 'error')
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('couldn’t load')
    await user.click(within(alert).getByRole('button', { name: 'Retry' }))
    expect(await screen.findByRole('table')).toBeInTheDocument()
  })

  it('shows an accessible loading state', async () => {
    renderApp('/customers', 'loading')
    expect(await screen.findByText('Loading customers…')).toBeInTheDocument()
  })
})

describe('settings', () => {
  it('disables Save until changed, validates email, then confirms', async () => {
    const user = userEvent.setup()
    renderApp('/settings')
    const save = await screen.findByRole('button', { name: 'Save changes' })
    expect(save).toBeDisabled()

    const email = screen.getByLabelText('Work email')
    await user.clear(email)
    await user.type(email, 'not-an-email')
    await user.click(save)
    expect(screen.getByText(/Enter an email address/)).toBeInTheDocument()
    expect(email).toHaveAttribute('aria-invalid', 'true')

    await user.clear(email)
    await user.type(email, 'maya@orbitops.example')
    await user.click(save)
    expect(screen.getByText('Settings saved.')).toBeInTheDocument()
  })

  it('warns when every notification is off', async () => {
    const user = userEvent.setup()
    renderApp('/settings')
    await user.click(await screen.findByRole('switch', { name: 'Project updates' }))
    await user.click(screen.getByRole('switch', { name: 'Support escalations' }))
    expect(screen.getByText(/All notifications are off/)).toBeInTheDocument()
  })
})

describe('persistence', () => {
  it('keeps a created project after a reload and can reset it', async () => {
    const user = userEvent.setup()
    const first = renderApp('/projects')
    await user.click(await screen.findByRole('button', { name: 'New project' }))
    const dialog = screen.getByRole('dialog', { name: 'New project' })
    await user.type(within(dialog).getByLabelText('Project name'), 'Persisted project')
    await user.type(within(dialog).getByLabelText('Customer'), 'Acme Co')
    await user.type(within(dialog).getByLabelText('Due date'), '2026-12-01')
    await user.click(within(dialog).getByRole('button', { name: 'Create project' }))
    first.unmount()

    renderApp('/projects')
    expect(await screen.findByText('Persisted project')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reset demo data' }))
    expect(screen.queryByText('Persisted project')).not.toBeInTheDocument()
  })

  it('ignores corrupt stored data instead of crashing', async () => {
    localStorage.setItem('orbitops-projects', '{not json')
    localStorage.setItem('orbitops-settings', JSON.stringify({ name: 5 }))
    renderApp('/projects')
    expect(await screen.findByRole('table')).toBeInTheDocument()
  })

  it('saves settings across reloads', async () => {
    const user = userEvent.setup()
    const first = renderApp('/settings')
    await user.click(await screen.findByRole('switch', { name: 'Billing alerts' }))
    await user.click(screen.getByRole('button', { name: 'Save changes' }))
    first.unmount()
    renderApp('/settings')
    expect(await screen.findByRole('switch', { name: 'Billing alerts' })).toHaveAttribute('aria-checked', 'true')
  })
})

describe('chart tooltip', () => {
  it('shows the value when a point receives keyboard focus', async () => {
    renderApp('/')
    const point = await screen.findByRole('img', { name: 'Oct 5: $47,300' })
    act(() => point.focus())
    expect(await screen.findByText('Oct 5 · $47,300')).toBeInTheDocument()
    act(() => point.blur())
    expect(screen.queryByText('Oct 5 · $47,300')).not.toBeInTheDocument()
  })
})
