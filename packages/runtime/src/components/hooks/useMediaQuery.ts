import { useCallback, useSyncExternalStore } from 'react'
import {
  type Breakpoints,
  type DeviceOverride,
  findBreakpointOverride,
  getBaseBreakpoint,
  getBreakpointMediaQuery,
} from '@makeswift/controls'

import { useBreakpoints } from '../../runtimes/react/hooks/use-breakpoints'

// Get device queries sorted by maxWidth ascending (smallest breakpoint last)
// so we can find the most specific (smallest) matching breakpoint
const getDeviceQueries = (breakpoints: Breakpoints) =>
  breakpoints
    .map(device => ({
      id: device.id,
      maxWidth: device.maxWidth,
      query: getBreakpointMediaQuery(device).replace('@media', ''),
    }))
    // Sort by maxWidth ascending: base (no maxWidth) first, then largest to smallest
    .sort((a, b) => {
      if (a.maxWidth == null) return -1
      if (b.maxWidth == null) return 1
      return b.maxWidth - a.maxWidth
    })

export function useMediaQuery<S>(responsiveValue?: Array<DeviceOverride<S>>): S | undefined {
  const breakpoints = useBreakpoints()
  const baseBreakpointId = getBaseBreakpoint(breakpoints).id
  const subscribe = useCallback(
    (notify: () => void) => {
      const cleanUpFns = getDeviceQueries(breakpoints).map(q => {
        const mediaQueryList = window.matchMedia(q.query)
        mediaQueryList.addEventListener('change', notify)
        return () => mediaQueryList.removeEventListener('change', notify)
      })
      return () => cleanUpFns.forEach(fn => fn())
    },
    [breakpoints],
  )
  const getServerSnapshot = () =>
    findBreakpointOverride(breakpoints, responsiveValue, baseBreakpointId)?.value

  function getSnapshot() {
    // With cascading max-width queries, multiple breakpoints can match.
    // We need to find the most specific (smallest maxWidth) matching breakpoint.
    // The queries are sorted from base (no maxWidth) to smallest maxWidth,
    // so we iterate and keep the last matching one (most specific).
    let matchedDeviceId = baseBreakpointId
    for (const deviceQuery of getDeviceQueries(breakpoints)) {
      if (window.matchMedia(deviceQuery.query).matches) {
        matchedDeviceId = deviceQuery.id
      }
    }
    return findBreakpointOverride(breakpoints, responsiveValue, matchedDeviceId)?.value
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
