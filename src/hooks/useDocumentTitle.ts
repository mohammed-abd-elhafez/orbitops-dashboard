import { useEffect } from 'react'

/** Sets a per-page title (helps screen-reader users and browser history). */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · OrbitOps`
  }, [title])
}
