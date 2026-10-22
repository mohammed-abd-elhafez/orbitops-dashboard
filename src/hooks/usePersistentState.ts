import { useCallback, useState } from 'react'

/**
 * useState backed by localStorage. Storage can be blocked or full, so every
 * access is guarded and the in-memory value keeps working either way.
 */
export function usePersistentState<T>(key: string, initial: T, isValid: (value: unknown) => value is T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return initial
      const parsed: unknown = JSON.parse(raw)
      return isValid(parsed) ? parsed : initial
    } catch {
      return initial // unreadable or corrupt data: start fresh
    }
  })

  const set = useCallback(
    (update: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof update === 'function' ? (update as (p: T) => T)(prev) : update
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // Persistence is best-effort; the session still works without it.
        }
        return next
      })
    },
    [key],
  )

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore: see above
    }
    setValue(initial)
  }, [key, initial])

  return [value, set, reset] as const
}
