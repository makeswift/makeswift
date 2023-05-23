import { StyleV2ControlData, StyleV2ControlDefinition } from '../../../controls'
import { useStyle } from '../use-style'
import {
  findBreakpointOverride,
  getBaseBreakpoint,
  getBreakpointMediaQuery,
} from '../../../state/modules/breakpoints'
import { useBreakpoints } from '..'
import { CSSObject } from '@emotion/css'

function useStyleControlCssObject(
  styleControlData: StyleV2ControlData,
  controlDefinition: StyleV2ControlDefinition,
): CSSObject {
  const breakpoints = useBreakpoints()

  return {
    ...controlDefinition.config.getStyle(
      findBreakpointOverride(breakpoints, styleControlData, getBaseBreakpoint(breakpoints).id)
        ?.value,
    ),
    ...breakpoints.reduce((styles, breakpoint) => {
      return {
        ...styles,
        [getBreakpointMediaQuery(breakpoint)]: controlDefinition.config.getStyle(
          findBreakpointOverride(breakpoints, styleControlData, breakpoint.id)?.value,
        ),
      }
    }, {}),
  }
}

export type StyleV2ControlFormattedValue = string

export function useFormattedStyleV2<T extends StyleV2ControlDefinition>(
  styleControlData: StyleV2ControlData,
  controlDefinition: T,
): StyleV2ControlFormattedValue {
  const styles = useStyleControlCssObject(styleControlData, controlDefinition)

  return useStyle(styles)
}
