import { useSyncExternalStore } from 'use-sync-external-store/shim'
import { useCallback } from 'react'

import {
  type Breakpoints,
  type DeviceOverride,
  findBreakpointOverride,
  getBaseBreakpoint,
  getBreakpointMediaQuery,
} from '@makeswift/controls'

import { useBreakpoints } from '../../runtimes/react/hooks/use-breakpoints'

const getDeviceQueries = (breakpoints: Breakpoints) =>
  breakpoints.map(device => ({
    id: device.id,
    query: getBreakpointMediaQuery(device).replace('@media', ''),
  }))

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
    const deviceId: string = getDeviceQueries(breakpoints).reduce(
      (matchedDevice, deviceQueries) => {
        if (window.matchMedia(deviceQueries.query).matches) {
          return deviceQueries.id
        }
        return matchedDevice
      },
      baseBreakpointId,
    )
    return findBreakpointOverride(breakpoints, responsiveValue, deviceId)?.value
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
