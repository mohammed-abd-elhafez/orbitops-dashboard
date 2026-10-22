import { Menu, Moon, Orbit, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { DemoSwitch } from './DemoSwitch'
import { DRAWER_ID, MobileDrawer } from './MobileDrawer'
import { NavPanel } from './NavPanel'

function useIsDark() {
  const { preference } = useTheme()
  if (preference !== 'system') return preference === 'dark'
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const main = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const firstRender = useRef(true)
  const { preference, setPreference } = useTheme()
  const isDark = useIsDark()

  // After client-side navigation, move focus to <main> so keyboard and
  // screen-reader users land at the new page instead of the old link.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    main.current?.focus({ preventScroll: false })
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="shell">
      <a href="#main" className="skip-link">Skip to main content</a>

      <aside className="sidebar" aria-label="Sidebar">
        <NavPanel />
      </aside>

      <div>
        <header className="topbar">
          <button
            ref={menuButton}
            type="button"
            className="btn btn--icon topbar__menu"
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls={DRAWER_ID}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <Link to="/" className="topbar__brand">
            <Orbit size={20} aria-hidden="true" />
            OrbitOps
          </Link>
          <span className="topbar__spacer" />
          <DemoSwitch />
          <button
            type="button"
            className="btn btn--icon"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={() => setPreference(isDark ? 'light' : 'dark')}
            data-pref={preference}
          >
            {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
        </header>

        <main id="main" ref={main} className="main" tabIndex={-1}>
          <Outlet />
          <p className="disclaimer">
            OrbitOps is an independent fictional portfolio concept — not client work. All names, figures and events are invented.
          </p>
        </main>
      </div>

      {drawerOpen && <MobileDrawer onClose={() => setDrawerOpen(false)} />}
    </div>
  )
}
