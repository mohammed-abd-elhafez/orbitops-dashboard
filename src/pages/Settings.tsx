import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { AsyncRegion } from '../components/AsyncRegion'
import { SkeletonLines } from '../components/States'
import { useDemoData } from '../hooks/demo'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePersistentState } from '../hooks/usePersistentState'
import { useTheme, type ThemePreference } from '../hooks/useTheme'

interface Preferences {
  name: string
  email: string
  notifyProjects: boolean
  notifySupport: boolean
  notifyBilling: boolean
}

const DEFAULTS: Preferences = {
  name: 'Maya Okafor',
  email: 'maya.okafor@orbitops.example',
  notifyProjects: true,
  notifySupport: true,
  notifyBilling: false,
}

function isPreferences(v: unknown): v is Preferences {
  if (typeof v !== 'object' || v === null) return false
  const p = v as Record<string, unknown>
  return (
    typeof p.name === 'string' && typeof p.email === 'string' &&
    typeof p.notifyProjects === 'boolean' && typeof p.notifySupport === 'boolean' && typeof p.notifyBilling === 'boolean'
  )
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateProfile(p: Pick<Preferences, 'name' | 'email'>): { name?: string; email?: string } {
  return {
    name: p.name.trim() === '' ? 'Enter your name.' : undefined,
    email: !EMAIL_PATTERN.test(p.email.trim()) ? 'Enter an email address like name@company.com.' : undefined,
  }
}

function Switch({ id, label, description, checked, onChange }: { id: string; label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="switch-row">
      <div>
        <p id={`${id}-label`} className="table__primary">{label}</p>
        <p id={`${id}-desc`} className="card__sub">{description}</p>
      </div>
      <button type="button" role="switch" id={id} className="switch" aria-checked={checked} aria-labelledby={`${id}-label`} aria-describedby={`${id}-desc`} onClick={() => onChange(!checked)} />
    </div>
  )
}

function SettingsForm({ saved, onSave }: { saved: Preferences; onSave: (p: Preferences) => void }) {
  const uid = useId()
  const { preference, setPreference } = useTheme()
  const [draft, setDraft] = useState<Preferences>(saved)
  const [submitted, setSubmitted] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  const dirty = (Object.keys(saved) as Array<keyof Preferences>).some((k) => saved[k] !== draft[k])
  const errors = submitted ? validateProfile(draft) : {}
  const allOff = !draft.notifyProjects && !draft.notifySupport && !draft.notifyBilling
  const update = (patch: Partial<Preferences>) => {
    setJustSaved(false)
    setDraft((d) => ({ ...d, ...patch }))
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    const found = validateProfile(draft)
    if (found.name || found.email) return
    onSave({ ...draft, name: draft.name.trim(), email: draft.email.trim() })
    setJustSaved(true)
    setSubmitted(false)
  }

  const err = (key: 'name' | 'email') => errors[key]
  const themes: ReadonlyArray<{ value: ThemePreference; label: string }> = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ]

  return (
    <form onSubmit={submit} noValidate className="stack">
      <div role="status" aria-live="polite">
        {justSaved && (
          <div className="banner banner--success">
            <CheckCircle2 size={18} aria-hidden="true" />
            <p className="banner__title">Settings saved.</p>
          </div>
        )}
      </div>

      <section className="card" aria-labelledby={`${uid}-profile`}>
        <div className="card__head"><h2 id={`${uid}-profile`}>Profile</h2></div>
        <div className="form-grid" style={{ maxWidth: '28rem' }}>
          <div className="field">
            <label className="field__label" htmlFor={`${uid}-name`}>Full name</label>
            <input id={`${uid}-name`} className="input" value={draft.name} autoComplete="name" onChange={(e) => update({ name: e.target.value })} aria-invalid={err('name') ? true : undefined} aria-describedby={err('name') ? `${uid}-name-err` : undefined} />
            {err('name') && <p id={`${uid}-name-err`} className="field__error"><AlertCircle size={14} aria-hidden="true" style={{ flex: 'none', marginTop: 2 }} />{err('name')}</p>}
          </div>
          <div className="field">
            <label className="field__label" htmlFor={`${uid}-email`}>Work email</label>
            <input id={`${uid}-email`} className="input" type="email" value={draft.email} autoComplete="email" onChange={(e) => update({ email: e.target.value })} aria-invalid={err('email') ? true : undefined} aria-describedby={err('email') ? `${uid}-email-err` : undefined} />
            {err('email') && <p id={`${uid}-email-err`} className="field__error"><AlertCircle size={14} aria-hidden="true" style={{ flex: 'none', marginTop: 2 }} />{err('email')}</p>}
          </div>
        </div>
      </section>

      <section className="card" aria-labelledby={`${uid}-notify`}>
        <div className="card__head"><h2 id={`${uid}-notify`}>Notifications</h2></div>
        <Switch id={`${uid}-n-projects`} label="Project updates" description="Status changes, blockers and milestones." checked={draft.notifyProjects} onChange={(v) => update({ notifyProjects: v })} />
        <Switch id={`${uid}-n-support`} label="Support escalations" description="Tickets that breach their response target." checked={draft.notifySupport} onChange={(v) => update({ notifySupport: v })} />
        <Switch id={`${uid}-n-billing`} label="Billing alerts" description="Failed payments and plan changes." checked={draft.notifyBilling} onChange={(v) => update({ notifyBilling: v })} />
        {allOff && (
          <div className="banner banner--warning" role="status" style={{ marginTop: 'var(--space-3)' }}>
            <AlertTriangle size={18} aria-hidden="true" />
            <p className="banner__body">All notifications are off. You won’t hear about blocked projects or failed payments.</p>
          </div>
        )}
      </section>

      <section className="card" aria-labelledby={`${uid}-appearance`}>
        <div className="card__head"><h2 id={`${uid}-appearance`}>Appearance</h2></div>
        <fieldset>
          <legend className="sr-only">Theme</legend>
          <div className="segmented">
            {themes.map((t) => (
              <label key={t.value} className="segmented__option">
                <input type="radio" name="theme" value={t.value} checked={preference === t.value} onChange={() => setPreference(t.value)} />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
          <p className="field__hint" style={{ marginTop: 'var(--space-2)' }}>Applies immediately. “System” follows your device setting.</p>
        </fieldset>
      </section>

      <div>
        <button type="submit" className="btn btn--primary" disabled={!dirty}>Save changes</button>
        {!dirty && !justSaved && <span className="card__sub" style={{ marginLeft: 'var(--space-3)' }}>No unsaved changes</span>}
      </div>
    </form>
  )
}

export function SettingsPage() {
  useDocumentTitle('Settings')
  const [saved, setSaved] = usePersistentState<Preferences>('orbitops-settings', DEFAULTS, isPreferences)
  const state = useDemoData({ key: 'settings', load: () => saved, empty: saved, isEmpty: () => false })

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p className="page-head__sub">Profile, notifications and appearance.</p>
        </div>
      </div>
      <AsyncRegion state={state} label="settings" skeleton={<div className="card"><SkeletonLines count={6} /></div>} empty={null}>
        {(prefs) => <SettingsForm saved={prefs} onSave={setSaved} />}
      </AsyncRegion>
    </div>
  )
}
