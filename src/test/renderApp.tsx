import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../App'
import { DemoProvider, type DemoMode } from '../hooks/demo'
import { ThemeProvider } from '../hooks/useTheme'

/** Renders the whole app with zero simulated latency so tests stay fast. */
export function renderApp(route = '/', mode: DemoMode = 'normal') {
  return render(
    <ThemeProvider>
      <DemoProvider delayMs={0} initial={mode}>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </DemoProvider>
    </ThemeProvider>,
  )
}
