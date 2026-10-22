import { X } from 'lucide-react'
import { useId, useRef, type ReactNode } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap'

interface DialogProps {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

/** Modal dialog: labelled, focus-trapped, Esc and scrim close, focus restored on close. */
export function Dialog({ title, description, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()
  useFocusTrap(ref, true, onClose)

  return (
    <>
      <div className="scrim" onClick={onClose} aria-hidden="true" />
      <div className="dialog-wrap">
        <div
          ref={ref}
          className="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descId : undefined}
          tabIndex={-1}
        >
          <div className="dialog__head">
            <div>
              <h2 id={titleId}>{title}</h2>
              {description && <p id={descId} className="card__sub">{description}</p>}
            </div>
            <button type="button" className="btn btn--icon btn--sm" onClick={onClose} aria-label="Close dialog">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
