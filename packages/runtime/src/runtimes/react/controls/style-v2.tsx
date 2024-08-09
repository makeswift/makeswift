import { CSSObject } from '@emotion/css'
import {
  type ResponsiveValue,
  type ResolvedValueType,
  type DataType,
  type DeviceOverride,
} from '@makeswift/controls'

import {
  StyleV2Definition,
  StyleV2PropDefinition,
  StyleV2Control,
} from '../../../controls/style-v2'

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

function useStyleControlCssObject<Prop extends StyleV2PropDefinition>(
  styleControlData: ResponsiveValue<ResolvedValueType<Prop>>,
  controlDefinition: StyleV2Definition<Prop>,
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

export function useFormattedStyleV2<Prop extends StyleV2PropDefinition>(
  styleControlData: ResponsiveValue<ResolvedValueType<Prop>>,
  controlDefinition: StyleV2Definition<Prop>,
): ResolvedValueType<StyleV2Definition<Prop>> {
  const styles = useStyleControlCssObject(styleControlData, controlDefinition)

  return useStyle(styles)
}

type ValueProps<Prop extends StyleV2PropDefinition> = {
  definition: StyleV2Definition<Prop>
  data: DataType<StyleV2Definition<Prop>> | undefined
  children(value: string): JSX.Element
  control?: StyleV2Control
}

export function StyleV2ControlValue<Prop extends StyleV2PropDefinition>({
  definition,
  data,
  children,
  control,
}: ValueProps<Prop>): JSX.Element {
  return (data ?? []).reduceRight(
    (renderFn, { deviceId, value }: DeviceOverride<DataType<Prop>>) =>
      responsiveValue => {
        return (
          <ControlValue
            definition={definition.config.type}
            data={value}
            control={control?.propControl}
          >
            {value => renderFn([{ deviceId, value }, ...responsiveValue])}
          </ControlValue>
        )
      },
    (value: ResponsiveValue<ResolvedValueType<Prop>>) => {
      return (
        <RenderHook
          key={definition.controlType}
          hook={useFormattedStyleV2}
          parameters={[value, definition]}
        >
          {value => children(value as ResolvedValueType<StyleV2Definition<Prop>>)}
        </RenderHook>
      )
    },
  )([])
}
