import { Orbit } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navigation'

/** Shared by the desktop sidebar and the mobile drawer so the markup exists once. */
export function NavPanel({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="nav-panel">
      <div className="brand">
        <span className="brand__mark"><Orbit size={18} aria-hidden="true" /></span>
        OrbitOps
      </div>
      <nav aria-label="Primary">
        <ul className="nav-list">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} className="nav-link" onClick={onNavigate}>
                <Icon size={18} aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <p className="nav-panel__foot">Independent portfolio concept. Fictional product and data.</p>
    </div>
  )
}
