import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/**
 * Demo state switch. There is no backend, so the header lets a reviewer force
 * every data region into loading / empty / error to inspect those designs.
 */
export type DemoMode = 'normal' | 'loading' | 'empty' | 'error'

export const DEMO_MODES: ReadonlyArray<{ value: DemoMode; label: string }> = [
  { value: 'normal', label: 'Loaded' },
  { value: 'loading', label: 'Loading' },
  { value: 'empty', label: 'Empty' },
  { value: 'error', label: 'Error' },
]

interface DemoContextValue {
  mode: DemoMode
  setMode: (mode: DemoMode) => void
  /** Simulated network latency in ms. Demo-only; tests set this to 0. */
  delayMs: number
}

const DemoContext = createContext<DemoContextValue | null>(null)

const isMode = (v: string | null): v is DemoMode => DEMO_MODES.some((m) => m.value === v)

function initialMode(): DemoMode {
  const fromUrl = new URLSearchParams(window.location.search).get('demo')
  return isMode(fromUrl) ? fromUrl : 'normal'
}

export function DemoProvider({ children, delayMs = 600, initial }: { children: ReactNode; delayMs?: number; initial?: DemoMode }) {
  const [mode, setModeState] = useState<DemoMode>(initial ?? initialMode)
  const setMode = useCallback((next: DemoMode) => setModeState(next), [])
  const value = useMemo(() => ({ mode, setMode, delayMs }), [mode, setMode, delayMs])
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used inside <DemoProvider>')
  return ctx
}

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; retry: () => void }
  | { status: 'ready'; data: T; empty: boolean }

interface Options<T> {
  load: () => T
  empty: T
  isEmpty: (data: T) => boolean
  /** Changing the key re-runs the simulated request (e.g. the date range). */
  key: string
}

/**
 * Resolves local data after a short simulated delay.
 * `error` mode fails the first attempt only, so Retry demonstrably recovers.
 */
export function useDemoData<T>({ load, empty, isEmpty, key }: Options<T>): AsyncState<T> {
  const { mode, delayMs } = useDemo()
  // Retries are tied to the mode they happened in, so switching mode replays Error from attempt 0.
  const [retries, setRetries] = useState<{ mode: DemoMode; count: number }>({ mode, count: 0 })
  const attempt = retries.mode === mode ? retries.count : 0
  const [settled, setSettled] = useState<string | null>(null)
  const runId = `${key}|${mode}|${attempt}`

  useEffect(() => {
    if (mode === 'loading') return
    const timer = window.setTimeout(() => setSettled(runId), delayMs)
    return () => window.clearTimeout(timer)
  }, [runId, mode, delayMs])

  const retry = useCallback(() => setRetries({ mode, count: attempt + 1 }), [mode, attempt])

  if (mode === 'loading' || settled !== runId) return { status: 'loading' }
  if (mode === 'error' && attempt === 0) return { status: 'error', retry }
  const data = mode === 'empty' ? empty : load()
  return { status: 'ready', data, empty: isEmpty(data) }
}
