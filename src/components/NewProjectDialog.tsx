import { AlertCircle, AlertTriangle } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { OWNERS, REFERENCE_DATE } from '../data/reference'
import type { Project } from '../data/types'
import { Dialog } from './Dialog'

interface Props {
  onCancel: () => void
  onCreate: (project: Project) => void
}

interface Errors {
  name?: string
  customer?: string
  dueDate?: string
}

const DAY = 86_400_000

export function validateNewProject(values: { name: string; customer: string; dueDate: string }): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 3) errors.name = 'Enter a project name of at least 3 characters.'
  if (values.customer.trim() === '') errors.customer = 'Enter the customer this project is for.'
  if (values.dueDate === '') errors.dueDate = 'Choose a due date.'
  else if (values.dueDate < REFERENCE_DATE) errors.dueDate = 'Due date can’t be in the past.'
  return errors
}

/** A due date within a week is allowed but flagged: a warning, not a blocking error. */
export function isTightDeadline(dueDate: string): boolean {
  if (dueDate === '' || dueDate < REFERENCE_DATE) return false
  return Date.parse(dueDate) - Date.parse(REFERENCE_DATE) < 7 * DAY
}

export function NewProjectDialog({ onCancel, onCreate }: Props) {
  const uid = useId()
  const [name, setName] = useState('')
  const [customer, setCustomer] = useState('')
  const [owner, setOwner] = useState<string>(OWNERS[0])
  const [dueDate, setDueDate] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const errors = submitted ? validateNewProject({ name, customer, dueDate }) : {}
  const errorCount = Object.keys(errors).length

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validateNewProject({ name, customer, dueDate })).length > 0) return
    onCreate({
      id: `p-${Date.now()}`,
      name: name.trim(),
      customer: customer.trim(),
      owner,
      dueDate,
      progress: 0,
      status: 'on-track',
    })
  }

  const field = (key: keyof Errors) => ({
    'aria-invalid': errors[key] ? (true as const) : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-error` : undefined,
  })

  const fieldError = (key: keyof Errors) =>
    errors[key] ? (
      <p id={`${uid}-${key}-error`} className="field__error">
        <AlertCircle size={14} aria-hidden="true" style={{ flex: 'none', marginTop: 2 }} />
        {errors[key]}
      </p>
    ) : null

  return (
    <Dialog title="New project" description="Projects start as “On track” with 0% progress." onClose={onCancel}>
      <form onSubmit={onSubmit} noValidate>
        <div className="form-grid">
          {errorCount > 0 && (
            <div className="banner banner--danger" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <p className="banner__title">Fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} to continue</p>
            </div>
          )}
          <div className="field">
            <label className="field__label" htmlFor={`${uid}-name`}>Project name</label>
            <input id={`${uid}-name`} className="input" value={name} onChange={(e) => setName(e.target.value)} data-autofocus autoComplete="off" {...field('name')} />
            {fieldError('name')}
          </div>
          <div className="field">
            <label className="field__label" htmlFor={`${uid}-customer`}>Customer</label>
            <input id={`${uid}-customer`} className="input" value={customer} onChange={(e) => setCustomer(e.target.value)} autoComplete="off" {...field('customer')} />
            {fieldError('customer')}
          </div>
          <div className="field">
            <label className="field__label" htmlFor={`${uid}-owner`}>Owner</label>
            <select id={`${uid}-owner`} className="select" value={owner} onChange={(e) => setOwner(e.target.value)}>
              {OWNERS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="field__label" htmlFor={`${uid}-dueDate`}>Due date</label>
            <input id={`${uid}-dueDate`} className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} {...field('dueDate')} />
            <p className="field__hint">Today in this demo is Oct 22, 2026.</p>
            {fieldError('dueDate')}
            {isTightDeadline(dueDate) && (
              <p className="banner banner--warning" role="status" style={{ padding: 'var(--space-2) var(--space-3)' }}>
                <AlertTriangle size={16} aria-hidden="true" style={{ flex: 'none' }} />
                <span className="banner__body">This is less than a week away. Check the team has capacity.</span>
              </p>
            )}
          </div>
        </div>
        <div className="dialog__foot">
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn--primary">Create project</button>
        </div>
      </form>
    </Dialog>
  )
}
