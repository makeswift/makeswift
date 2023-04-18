import { ResponsiveValue, DeviceOverride, Device as BreakpointId } from '../../prop-controllers'
import shallowMerge from '../../utils/shallowMerge'
import { Action, ActionTypes } from '../actions'

export type Breakpoint = {
  id: BreakpointId
  label?: string
  viewportWidth?: number
  minWidth?: number
  maxWidth?: number
}

export type Breakpoints = Breakpoint[]

export type State = Breakpoints

export const DefaultBreakpointID = {
  Desktop: 'desktop',
  Tablet: 'tablet',
  Mobile: 'mobile',
} as const

type DefaultBreakpointID = typeof DefaultBreakpointID[keyof typeof DefaultBreakpointID]

export const DEFAULT_BREAKPOINTS: Breakpoints = [
  {
    id: DefaultBreakpointID.Desktop,
    label: 'Desktop',
    minWidth: 769,
  },
  {
    id: DefaultBreakpointID.Tablet,
    label: 'Tablet',
    minWidth: 576,
    maxWidth: 768,
    viewportWidth: 760,
  },
  {
    id: DefaultBreakpointID.Mobile,
    label: 'Mobile',
    maxWidth: 575,
    viewportWidth: 390,
  },
]

export function getInitialState(): State {
  return DEFAULT_BREAKPOINTS
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.SET_BREAKPOINTS:
      return action.payload.breakpoints

    default:
      return state
  }
}

export const getBreakpoint = (state: State, breakpointId: Breakpoint['id']): Breakpoint => {
  const breakpoint = state.find(({ id }) => id === breakpointId)

  if (breakpoint == null) throw new Error(`Unrecognized breakpoint ID: "${breakpointId}".`)

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
    .slice(0, breakpoints.findIndex(d => d.id === deviceId) + 1)
    .reverse()
    .map(d => values.find(v => v.deviceId === d.id))
    .filter((override): override is DeviceOverride<S> => Boolean(override))

  return value != null || fallbacks.length > 0 ? strategy(value, fallbacks) : undefined
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

export type ExtractResponsiveValue<T> = T extends ResponsiveValue<infer V> ? V : never

export function join<V, A extends ReadonlyArray<ResponsiveValue<V> | null | undefined>, R>(
  breakpoints: Breakpoints,
  responsiveValues: A,
  joinFn: (values: { [I in keyof A]: ExtractResponsiveValue<A[I]> | undefined }) => R,
  strategy?: FallbackStrategy<V>,
): ResponsiveValue<R> {
  return breakpoints
    .map(({ id }) => id)
    .map(deviceId => {
      const value = joinFn(
        responsiveValues.map(responsiveValue => {
          const deviceValue =
            responsiveValue &&
            findBreakpointOverride(breakpoints, responsiveValue, deviceId, strategy)

          return deviceValue == null ? undefined : deviceValue.value
        }) as unknown as { [I in keyof A]: ExtractResponsiveValue<A[I] | undefined> },
      )

      if (value == null) return null

      return { deviceId, value }
    })
    .filter((override): override is DeviceOverride<R> => Boolean(override))
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
