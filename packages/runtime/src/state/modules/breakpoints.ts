import { Viewport } from 'csstype'

import {
  findBreakpointOverride,
  type ResponsiveValue,
  type BreakpointId,
  type Breakpoint,
  type Breakpoints,
  type FallbackStrategy,
} from '@makeswift/controls'

import { Action, ActionTypes } from '../actions'

export {
  findBreakpointOverride,
  getBaseBreakpoint,
  type ResponsiveValue,
  type DeviceOverride,
  type Breakpoint,
  type BreakpointId,
  type Breakpoints,
  type FallbackStrategy,
} from '@makeswift/controls'

export type State = Breakpoints

export const DefaultBreakpointID = {
  Desktop: 'desktop',
  Tablet: 'tablet',
  Mobile: 'mobile',
} as const

type DefaultBreakpointID = (typeof DefaultBreakpointID)[keyof typeof DefaultBreakpointID]

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

export function getInitialState(breakpoints = DEFAULT_BREAKPOINTS): State {
  return breakpoints
}

export function reducer(state: State = getInitialState(), action: Action): State {
  switch (action.type) {
    case ActionTypes.SET_BREAKPOINTS: {
      const breakpoints = action.payload.breakpoints

      if (breakpoints.length === 0) throw new Error('Breakpoints cannot be empty.')

      return breakpoints
    }

    default:
      return state
  }
}

export type BreakpointsInput = Record<string, { width: number; label?: string; viewport?: number }>

export function parseBreakpointsInput(input: BreakpointsInput): Breakpoints {
  validateBreakpointsInput(input)

  const sorted = Object.entries(input)
    .map(([id, value]) => ({ ...value, id }))
    .sort((a, b) => b.width - a.width) // Sort by width in descending order

  const transformed = sorted.reduce(
    (prev, curr, index, array) => {
      const { width, viewport, id, label } = curr
      const next = array[index + 1]

      const breakpoint: Breakpoint = {
        id,
        ...(label && { label }),
        ...(next && { minWidth: next.width + 1 }),
        maxWidth: width,
        viewportWidth: viewport ?? width,
      }

      return [...prev, breakpoint]
    },
    [
      { id: DefaultBreakpointID.Desktop, label: 'Desktop', minWidth: sorted[0].width + 1 },
    ] as Breakpoints,
  )

  return transformed
}

function validateBreakpointsInput(input: BreakpointsInput) {
  if (DefaultBreakpointID.Desktop in input) {
    throw new Error(
      `Cannot change the base breakpoint. "${DefaultBreakpointID.Desktop}" is reserved as the base breakpoint.`,
    )
  }

  if (Object.keys(input).length === 0) {
    throw new Error(`Breakpoints cannot be empty. You must provide at least one breakpoint.`)
  }

  const sorted = Object.entries(input)
    .map(([id, value]) => ({ ...value, id }))
    .sort((a, b) => b.width - a.width) // Sort by width in descending order

  sorted.forEach(({ id, width, viewport }, index, array) => {
    // This is only valid for desktop-first. We need to check the inverse for mobile-first.
    if (viewport && viewport > width) {
      throw new Error(
        `Error on breakpoint "${id}". Viewport cannot be greater than its width.
        "${id}" has a viewport of ${viewport}px and a width of ${width}px.`,
      )
    }

    const next = array[index + 1]

    if (viewport && next && viewport < next.width) {
      throw new Error(
        `Error on breakpoint "${id}". Viewport cannot be smaller than the next breakpoint's width. 
        "${id}" has a viewport of ${viewport}px and the next breakpoint "${next.id}" has a width of ${next.width}px.`,
      )
    }

    if (next && width === next.width) {
      throw new Error(
        `Breakpoints cannot have the same width. "${id}" and "${next.id}" have the same width`,
      )
    }
  })
}

export const getBreakpoint = (state: State, breakpointId: Breakpoint['id']): Breakpoint => {
  const breakpoint = state.find(({ id }) => id === breakpointId)

  if (breakpoint == null) throw new Error(`Unrecognized breakpoint ID: "${breakpointId}".`)

  return breakpoint
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
  state: State,
  deviceId: string,
): Viewport<string | number> | null | undefined => {
  const device = getBreakpoint(state, deviceId)

  return (
    device && {
      width: device.viewportWidth != null ? device.viewportWidth : '100%',
      minWidth: device.minWidth,
    }
  )
}

export function findNextFallback<V>(
  breakpoints: Breakpoints,
  value: ResponsiveValue<V>,
  deviceId: BreakpointId,
  activeDeviceId: BreakpointId,
  fallbackStrategy?: FallbackStrategy<V>,
): Breakpoint | null {
  const deviceOverride = findBreakpointOverride(
    breakpoints,
    value.filter(v => v.deviceId !== activeDeviceId),
    deviceId,
    fallbackStrategy,
  )

  return (deviceOverride && getBreakpoint(breakpoints, deviceOverride.deviceId)) ?? null
}
