import { StyleV2Control, StyleV2ControlData, StyleV2ControlDefinition } from '../../../controls'
import { useStyle } from '../use-style'
import {
  findBreakpointOverride,
  getBaseBreakpoint,
  getBreakpointMediaQuery,
  mergeOrCoalesceFallbacks,
} from '../../../state/modules/breakpoints'
import { useBreakpoints } from '..'
import { CSSObject } from '@emotion/css'

import { ControlDefinitionValue, ControlValue } from './control'
import { RenderHook } from '../components'
import { DeviceOverride } from '../../../controls/types'

function useStyleControlCssObject(
  styleControlData: StyleV2ControlData,
  controlDefinition: StyleV2ControlDefinition,
): CSSObject {
  const breakpoints = useBreakpoints()

  return {
    ...controlDefinition.config.getStyle(
      findBreakpointOverride(
        breakpoints,
        styleControlData,
        getBaseBreakpoint(breakpoints).id,
        mergeOrCoalesceFallbacks,
      )?.value,
    ),
    ...breakpoints.reduce((styles, breakpoint) => {
      return {
        ...styles,
        [getBreakpointMediaQuery(breakpoint)]: controlDefinition.config.getStyle(
          findBreakpointOverride(
            breakpoints,
            styleControlData,
            breakpoint.id,
            mergeOrCoalesceFallbacks,
          )?.value,
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

type StyleV2ControlValueProps<T extends StyleV2ControlDefinition> = {
  definition: T
  data: StyleV2ControlData | undefined
  children(value: string): JSX.Element
  control?: StyleV2Control
}

export function StyleV2ControlValue<T extends StyleV2ControlDefinition>({
  definition,
  data,
  children,
  control,
}: StyleV2ControlValueProps<T>): JSX.Element {
  return (data ?? []).reduceRight(
    (renderFn, deviceOverrideData: DeviceOverride<any>) => responsiveValue => {
      return (
        <ControlValue
          definition={definition.config.type}
          data={deviceOverrideData.value}
          control={control?.control}
        >
          {value => renderFn([{ ...deviceOverrideData, value }, ...responsiveValue])}
        </ControlValue>
      )
    },
    (value: StyleV2ControlData) => {
      return (
        <RenderHook
          key={definition.type}
          hook={useFormattedStyleV2}
          parameters={[value, definition]}
        >
          {value => children(value as ControlDefinitionValue<T>)}
        </RenderHook>
      )
    },
  )([])
}
