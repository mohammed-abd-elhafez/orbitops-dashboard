import { useRef, type KeyboardEvent } from 'react'

export interface TabDef<K extends string> {
  key: K
  label: string
  count: number
}

interface Props<K extends string> {
  tabs: readonly TabDef<K>[]
  value: K
  onChange: (key: K) => void
  label: string
  panelId: string
}

/** WAI-ARIA tabs: roving tabindex, Arrow/Home/End keys, automatic activation. */
export function StatusTabs<K extends string>({ tabs, value, onChange, label, panelId }: Props<K>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = tabs.length - 1
    const target =
      event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null
    if (target === null) return
    event.preventDefault()
    onChange(tabs[target].key)
    refs.current[target]?.focus()
  }

  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((tab, i) => {
        const selected = tab.key === value
        return (
          <button
            key={tab.key}
            ref={(el) => { refs.current[i] = el }}
            type="button"
            role="tab"
            id={`${panelId}-tab-${tab.key}`}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            className="tab"
            onClick={() => onChange(tab.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {tab.label}
            <span className="tab__count num">{tab.count}</span>
          </button>
        )
      })}
    </div>
  )
}
