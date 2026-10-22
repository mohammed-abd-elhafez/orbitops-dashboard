import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { DemoProvider } from './hooks/demo'
import { ThemeProvider } from './hooks/useTheme'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'

const demoDelayMs = import.meta.env.PROD ? 0 : 600

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root not found')

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <DemoProvider delayMs={demoDelayMs}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </DemoProvider>
    </ThemeProvider>
  </StrictMode>,
)
