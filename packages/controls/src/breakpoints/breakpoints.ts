import { type Viewport } from 'csstype'

import { coalesce } from '../lib/coalesce'
import { shallowMerge } from '../lib/shallow-merge'

import {
  type Data,
  type DeviceOverride,
  type ResponsiveValue,
} from '../common/types'

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

export const getBreakpoint = (
  breakpoints: Breakpoints,
  breakpointId: Breakpoint['id'],
): Breakpoint => {
  const breakpoint = breakpoints.find(({ id }) => id === breakpointId)

  if (breakpoint == null)
    throw new Error(`Unrecognized breakpoint ID: "${breakpointId}".`)

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

export function shallowMergeFallbacks<V extends Record<string, unknown>>(
  value: DeviceOverride<V> | undefined,
  fallbacks: ResponsiveValue<V>,
): DeviceOverride<V> | undefined {
  return [value, ...fallbacks]
    .filter((override): override is DeviceOverride<V> => Boolean(override))
    .reduce((a, b) => ({
      deviceId: a.deviceId || b.deviceId,
      value: shallowMerge(a.value, b.value),
    }))
}

function mergeOrCoalesce<A extends Data>(a: A, b: A): A {
  if (
    typeof a === 'object' &&
    a !== null &&
    !Array.isArray(a) &&
    typeof b === 'object' &&
    b !== null &&
    !Array.isArray(b)
  ) {
    return shallowMerge(a, b) as A
  }
  return coalesce(a, b)
}

export function mergeOrCoalesceFallbacks<V extends Data>(
  value: DeviceOverride<V> | undefined,
  fallbacks: ResponsiveValue<V>,
): DeviceOverride<V> | undefined {
  return [value, ...fallbacks]
    .filter((override): override is DeviceOverride<V> => Boolean(override))
    .reduce((a, b) => ({
      deviceId: a.deviceId || b.deviceId,
      value: mergeOrCoalesce(a.value, b.value),
    }))
}

export type ExtractResponsiveValue<T> =
  T extends ResponsiveValue<infer V> ? V : never

export function join<
  V,
  A extends ReadonlyArray<ResponsiveValue<V> | null | undefined>,
  R,
>(
  breakpoints: Breakpoints,
  responsiveValues: A,
  joinFn: (values: {
    [I in keyof A]: ExtractResponsiveValue<A[I]> | undefined
  }) => R,
  strategy?: FallbackStrategy<V>,
): ResponsiveValue<R> {
  return breakpoints
    .map(({ id }) => id)
    .map((deviceId) => {
      const value = joinFn(
        responsiveValues.map((responsiveValue) => {
          const deviceValue =
            responsiveValue &&
            findBreakpointOverride(
              breakpoints,
              responsiveValue,
              deviceId,
              strategy,
            )

          return deviceValue == null ? undefined : deviceValue.value
        }) as unknown as {
          [I in keyof A]: ExtractResponsiveValue<A[I] | undefined>
        },
      )

      if (value == null) return null

      return { deviceId, value }
    })
    .filter((override): override is NonNullable<typeof override> =>
      Boolean(override),
    )
}

export function mergeResponsiveValues<A>(
  breakpoints: Breakpoints,
  source: DeviceOverride<A>[],
  override: DeviceOverride<A>[],
): DeviceOverride<A>[] {
  const devices = [
    ...new Set(
      source
        .map(({ deviceId }) => deviceId)
        .concat(override.map(({ deviceId }) => deviceId)),
    ),
  ]

  return devices.map((deviceId) => ({
    deviceId,
    value: {
      ...(
        findBreakpointOverride(breakpoints, source, deviceId) || { value: {} }
      ).value,
      ...(
        findBreakpointOverride(breakpoints, override, deviceId, (v) => v) || {
          value: {},
        }
      ).value,
    },
  })) as DeviceOverride<A>[]
}

export function findNextFallback<V>(
  breakpoints: Breakpoints,
  value: ResponsiveValue<V>,
  deviceId: Breakpoint['id'],
  activeDeviceId: Breakpoint['id'],
  fallbackStrategy?: FallbackStrategy<V>,
): Breakpoint | null {
  const deviceOverride = findBreakpointOverride(
    breakpoints,
    value.filter((v) => v.deviceId !== activeDeviceId),
    deviceId,
    fallbackStrategy,
  )

  return deviceOverride != null
    ? getBreakpoint(breakpoints, deviceOverride.deviceId)
    : null
}

export const getBreakpointMediaQuery = (breakpoint: Breakpoint): string => {
  const parts = ['@media only screen']

  if (breakpoint.minWidth != null) {
    parts.push(`(min-width: ${breakpoint.minWidth}px)`)
  }

  if (breakpoint.maxWidth != null) {
    parts.push(`(max-width: ${breakpoint.maxWidth}px)`)
  }

  return parts.join(' and ')
}

export const getViewportStyle = (
  breakpoints: Breakpoints,
  deviceId: Breakpoint['id'],
): Viewport<string | number> => {
  const device = getBreakpoint(breakpoints, deviceId)

  return {
    width: device.viewportWidth != null ? device.viewportWidth : '100%',
    minWidth: device.minWidth,
  }
}
