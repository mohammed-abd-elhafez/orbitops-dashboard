import { DEMO_MODES, useDemo, type DemoMode } from '../hooks/demo'

/** Reviewer control: forces data regions into each designed state. */
export function DemoSwitch() {
  const { mode, setMode } = useDemo()
  return (
    <div className="demo-switch">
      <label className="demo-switch__label" htmlFor="demo-state">Demo state</label>
      <select id="demo-state" className="select" value={mode} onChange={(e) => setMode(e.target.value as DemoMode)}>
        {DEMO_MODES.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  )
}
