import { Route, Routes, Link } from 'react-router-dom'
import { EmptyState } from './components/States'
import { AppShell } from './layout/AppShell'
import { ActivityPage } from './pages/ActivityPage'
import { CustomersPage } from './pages/Customers'
import { OverviewPage } from './pages/Overview'
import { ProjectsPage } from './pages/Projects'
import { SettingsPage } from './pages/Settings'
import { useDocumentTitle } from './hooks/useDocumentTitle'

function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <div className="card">
      <h1 className="sr-only">Page not found</h1>
      <EmptyState title="Page not found" action={<Link className="btn btn--primary" to="/">Back to overview</Link>}>
        That page doesn’t exist in this demo.
      </EmptyState>
    </div>
  )
}

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<OverviewPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
