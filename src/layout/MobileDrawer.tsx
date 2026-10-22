import { X } from 'lucide-react'
import { useRef } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { NavPanel } from './NavPanel'

export const DRAWER_ID = 'mobile-drawer'

export function MobileDrawer({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, true, onClose)

  return (
    <>
      <div className="scrim" onClick={onClose} aria-hidden="true" />
      <div ref={ref} id={DRAWER_ID} className="drawer" role="dialog" aria-modal="true" aria-label="Navigation menu" tabIndex={-1}>
        <button type="button" className="btn btn--icon btn--sm drawer__close" onClick={onClose} aria-label="Close navigation menu">
          <X size={18} aria-hidden="true" />
        </button>
        <NavPanel onNavigate={onClose} />
      </div>
    </>
  )
}
