import { useEffect, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Safari (and Firefox on macOS) do not focus a button when it is clicked, so
 * document.activeElement is <body> when a dialog opens. Remember the last
 * activated control instead so focus can still be returned to it.
 */
let lastActivated: HTMLElement | null = null
if (typeof document !== 'undefined') {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('button, a[href]') : null
      if (target) lastActivated = target
    },
    true,
  )
}

/**
 * Keeps keyboard focus inside `ref` while `active`, closes on Escape, locks
 * background scroll, and returns focus to the previously focused element.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void) {
  useEffect(() => {
    const container = ref.current
    if (!active || !container) return

    const focused = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null
    const previous = focused ?? lastActivated
    const items = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
    const initial = container.querySelector<HTMLElement>('[data-autofocus]') ?? items()[0] ?? container
    initial.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const list = items()
      if (list.length === 0) {
        event.preventDefault()
        return
      }
      const first = list[0]
      const last = list[list.length - 1]
      const current = document.activeElement
      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (current === last || !container.contains(current))) {
        event.preventDefault()
        first.focus()
      }
    }

    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      previous?.focus()
    }
    // onClose is intentionally excluded: callers pass inline closures and the
    // trap must not re-run (and steal focus) on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ref])
}
