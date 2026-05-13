import { useMemo } from 'react'
import { type DeviceOverride, findBreakpointOverride } from '@makeswift/controls'

import { useBreakpoints } from '../../runtimes/react/hooks/use-breakpoints'
import { useCurrentBreakpoint } from '../../runtimes/react/hooks/use-current-breakpoint'

export function useMediaQuery<S>(responsiveValue?: Array<DeviceOverride<S>>): S | undefined {
  const breakpoints = useBreakpoints()
  const breakpointId = useCurrentBreakpoint()
  return useMemo(
    () => findBreakpointOverride(breakpoints, responsiveValue, breakpointId)?.value,
    [breakpoints, breakpointId, responsiveValue],
  )
}
