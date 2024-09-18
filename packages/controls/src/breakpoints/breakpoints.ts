import { type DeviceOverride, type ResponsiveValue } from '../common/types'

import { type Breakpoint, type Breakpoints } from './types'

// Sort breakpoints by minWidth in descending order
function sortBreakpoints(breakpoints: Breakpoints): Breakpoints {
  return breakpoints.sort((a, b) => (b?.minWidth ?? 0) - (a?.minWidth ?? 0))
}

export const getBaseBreakpoint = (breakpoints: Breakpoints): Breakpoint => {
  const breakpoint = sortBreakpoints(breakpoints)[0]

  if (breakpoint == null) throw new Error(`Cannot get base breakpoint.`)

  return breakpoint
}

export function findBreakpointOverride<S>(
  breakpoints: Breakpoints,
  values: ResponsiveValue<S> = [],
  deviceId: string,
  strategy: FallbackStrategy<S> = defaultStrategy,
): DeviceOverride<S> | undefined {
  const value = values.find(({ deviceId: d }) => d === deviceId)
  const fallbacks = breakpoints
    .slice(0, breakpoints.findIndex((d) => d.id === deviceId) + 1)
    .reverse()
    .map((d) => values.find((v) => v.deviceId === d.id))
    .filter((override): override is DeviceOverride<S> => Boolean(override))

  return value != null || fallbacks.length > 0
    ? strategy(value, fallbacks)
    : undefined
}

export type FallbackStrategy<V> = (
  arg0: DeviceOverride<V> | undefined,
  arg1: ResponsiveValue<V>,
) => DeviceOverride<V> | undefined

function defaultStrategy<V>(
  value: DeviceOverride<V> | undefined,
  fallbacks: ResponsiveValue<V>,
): DeviceOverride<V> | undefined {
  return value || fallbacks[0]
}
