import { CSSObject } from '@emotion/css'
import {
  type ResponsiveValue,
  type ResolvedValueType,
  type DataType,
  type DeviceOverride,
} from '@makeswift/controls'

import { StyleV2Definition, StyleV2Control } from '../../../controls/style-v2/style-v2'

import { useStyle } from '../use-style'
import {
  findBreakpointOverride,
  getBaseBreakpoint,
  getBreakpointMediaQuery,
  mergeOrCoalesceFallbacks,
} from '../../../state/modules/breakpoints'

import { ControlValue } from './control'
import { RenderHook } from '../components'
import { useBreakpoints } from '../hooks/use-breakpoints'

function useStyleControlCssObject(
  styleControlData: ResponsiveValue<ResolvedValueType<StyleV2Definition>>,
  controlDefinition: StyleV2Definition,
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

export function useFormattedStyleV2(
  styleControlData: ResponsiveValue<ResolvedValueType<StyleV2Definition>>,
  controlDefinition: StyleV2Definition,
): ResolvedValueType<StyleV2Definition> {
  const styles = useStyleControlCssObject(styleControlData, controlDefinition)

  return useStyle(styles)
}

type ValueProps = {
  definition: StyleV2Definition
  data: DataType<StyleV2Definition> | undefined
  children(value: string): JSX.Element
  control?: StyleV2Control
}

export function StyleV2ControlValue({
  definition,
  data,
  children,
  control,
}: ValueProps): JSX.Element {
  return (data ?? []).reduceRight(
    (renderFn, { deviceId, value }: DeviceOverride<DataType<StyleV2Definition>>) =>
      responsiveValue => {
        return (
          <ControlValue
            definition={definition.config.type}
            data={value}
            control={control?.propControl}
          >
            {value =>
              renderFn([
                { deviceId, value: value as ResolvedValueType<typeof definition.config.type> },
                ...responsiveValue,
              ])
            }
          </ControlValue>
        )
      },
    (value: ResponsiveValue<ResolvedValueType<StyleV2Definition>>) => {
      return (
        <RenderHook
          key={definition.controlType}
          hook={useFormattedStyleV2}
          parameters={[value, definition]}
        >
          {value => children(value)}
        </RenderHook>
      )
    },
  )([])
}
