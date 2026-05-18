import { updateClientBreakpoint } from '../actions/internal/read-only-actions'
import { Breakpoints, getDeviceQueries } from '../modules/breakpoints'

import { type State, type Dispatch } from '../unified-state'
import { getBreakpoints } from '../read-only-state'

export interface BreakpointWatch {
  startBreakpointWatch(): void
  stopBreakpointWatch(): void
}

export function breakpointWatchMixin({
  dispatch,
  getState,
  subscribe: storeSubscribe,
}: {
  dispatch: Dispatch
  getState: () => State
  subscribe: (listener: VoidFunction) => VoidFunction
}): BreakpointWatch {
  let mediaQueryUnsubscribes: VoidFunction[] = []
  let storeUnsubscribe: VoidFunction | null = null
  let watchedBreakpoints: Breakpoints = []

  // client-side breakpoint watch
  const startWatch = (breakpoints: Breakpoints) => {
    mediaQueryUnsubscribes.forEach(fn => fn())

    const updateState = () => dispatch(updateClientBreakpoint())

    mediaQueryUnsubscribes = getDeviceQueries(breakpoints).map(q => {
      const mediaQueryList = window.matchMedia(q.query)
      mediaQueryList.addEventListener('change', updateState)
      return () => mediaQueryList.removeEventListener('change', updateState)
    })

    watchedBreakpoints = breakpoints

    // reconcile the store with the current client breakpoint after subscribing;
    // this heals any stale breakpoint state from changes that happened
    // after the store was created or updated but before the listeners were attached
    updateState()
  }

  return {
    startBreakpointWatch: () => {
      if (storeUnsubscribe !== null) {
        console.warn('Unexpected `BreakpointWatch.startBreakpointWatch` call, already watching')
        return
      }

      startWatch(getBreakpoints(getState()))

      storeUnsubscribe = storeSubscribe(() => {
        const breakpoints = getBreakpoints(getState())
        if (breakpoints !== watchedBreakpoints) {
          startWatch(breakpoints)
        }
      })
    },

    stopBreakpointWatch: () => {
      mediaQueryUnsubscribes.forEach(fn => fn())
      mediaQueryUnsubscribes = []

      storeUnsubscribe?.()
      storeUnsubscribe = null
    },
  }
}
