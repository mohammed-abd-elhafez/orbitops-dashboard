import type { ReactNode } from 'react'
import type { AsyncState } from '../hooks/demo'
import { ErrorState } from './States'

interface AsyncRegionProps<T> {
  state: AsyncState<T>
  /** Short noun used for the screen-reader loading text and error copy, e.g. "revenue chart". */
  label: string
  skeleton: ReactNode
  empty: ReactNode
  children: (data: T) => ReactNode
}

/** One place that decides between loading / error / empty / ready for a data region. */
export function AsyncRegion<T>({ state, label, skeleton, empty, children }: AsyncRegionProps<T>) {
  if (state.status === 'loading') {
    return (
      <div aria-busy="true" role="status">
        <span className="sr-only">Loading {label}…</span>
        {skeleton}
      </div>
    )
  }
  if (state.status === 'error') {
    return <ErrorState title={`We couldn’t load the ${label}`} onRetry={state.retry} />
  }
  if (state.empty) return <>{empty}</>
  return <>{children(state.data)}</>
}
