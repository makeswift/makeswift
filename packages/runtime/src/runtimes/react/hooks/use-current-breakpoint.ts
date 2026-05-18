import { useSyncExternalStore } from 'react'

import { type BreakpointId } from '../../../state/modules/breakpoints'
import { getBaseBreakpoint, getClientBreakpoint } from '../../../state/read-only-state'

import { useStore } from './use-store'

export function useCurrentBreakpoint(): BreakpointId {
  const store = useStore()

  return useSyncExternalStore(
    store.subscribe,
    () => getClientBreakpoint(store.getState()),
    () => getBaseBreakpoint(store.getState()),
  )
}
