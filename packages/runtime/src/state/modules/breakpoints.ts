import { type Breakpoint, type Breakpoints } from '@makeswift/controls'

import { type Action, type UnknownAction, ActionTypes, isKnownAction } from '../actions'

export {
  getBreakpoint,
  type Breakpoint,
  type BreakpointId,
  type Breakpoints,
} from '@makeswift/controls'

export type State = Breakpoints

export const DefaultBreakpointID = {
  Desktop: 'desktop',
  Tablet: 'tablet',
  Mobile: 'mobile',
} as const

type DefaultBreakpointID = (typeof DefaultBreakpointID)[keyof typeof DefaultBreakpointID]

// Desktop-first cascading breakpoints: base breakpoint (Desktop) has no maxWidth,
// smaller breakpoints use only maxWidth for proper CSS cascading without gaps.
// Desktop's minWidth is for display (">768px") and canvas width only, NOT used in media queries.
export const DEFAULT_BREAKPOINTS: Breakpoints = [
  {
    id: DefaultBreakpointID.Desktop,
    label: 'Desktop',
    // No maxWidth = base breakpoint, styles always apply
    // minWidth matches Tablet for display purposes only
    minWidth: 768,
  },
  {
    id: DefaultBreakpointID.Tablet,
    label: 'Tablet',
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

export function reducer(state: State = getInitialState(), action: Action | UnknownAction): State {
  if (!isKnownAction(action)) return state

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

  // Desktop-first cascading: base breakpoint has no maxWidth,
  // other breakpoints use only maxWidth for proper CSS cascading without gaps.
  // Note: minWidth on Desktop is for display/canvas purposes only - NOT used in media queries.
  const transformed = sorted.reduce(
    (prev, curr) => {
      const { width, viewport, id, label } = curr

      const breakpoint: Breakpoint = {
        id,
        ...(label && { label }),
        // Only maxWidth for cascading - no minWidth to avoid dead zones in media queries
        maxWidth: width,
        viewportWidth: viewport ?? width,
      }

      return [...prev, breakpoint]
    },
    [
      // Base breakpoint (Desktop) has no maxWidth - styles always apply.
      // minWidth is for display (">Npx") and builder canvas width only, NOT used in media queries.
      {
        id: DefaultBreakpointID.Desktop,
        label: 'Desktop',
        minWidth: sorted[0].width,
      },
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
