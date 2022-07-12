import { useMemo, useRef } from 'react'

import { useStore } from '.'
import * as ReactPage from '../../state/react-page'
import { Props } from '../../prop-controllers'
import {
  Descriptor,
  Device,
  ResolveOptions,
  ResponsiveValue,
  WidthControlValueFormats,
  WidthDescriptor,
  WidthValue,
} from '../../prop-controllers/descriptors'
import { css } from '@emotion/css'
import { useResponsiveColor } from '../../components/hooks'
import type { ColorValue } from '../../components/utils/types'
import { responsiveWidth } from '../../components/utils/responsive-style'
import {
  CheckboxControlType,
  ColorControlType,
  ComboboxControlType,
  ImageControlType,
  ListControlType,
  NumberControlType,
  SelectControlType,
  ShapeControlType,
  StyleControlType,
  TextAreaControlType,
  TextInputControlType,
} from '../../controls'
import { useFormattedStyle } from './controls/style'
import { ControlValue } from './controls/control'
import { RenderHook } from './components'

export type ResponsiveColor = ResponsiveValue<ColorValue>

function useDeviceMode(): Device {
  return 'desktop'
}

function useWidth(
  value: WidthValue | undefined,
  descriptor: WidthDescriptor,
  props: Record<string, unknown>,
): string | WidthValue | undefined {
  const deviceMode = useDeviceMode()
  const options = useMemo(
    () =>
      typeof descriptor.options === 'function'
        ? descriptor.options(props, deviceMode)
        : descriptor.options,
    [props, deviceMode],
  )

  return useMemo(
    () =>
      options.format === WidthControlValueFormats.ClassName
        ? css(responsiveWidth(value, options.defaultValue))
        : value,
    [value, options.defaultValue, options.format],
  )
}

export type ResolveWidthControlValue<T extends Descriptor> = T extends WidthDescriptor
  ? undefined extends ResolveOptions<T['options']>['format']
    ? WidthValue | undefined
    : ResolveOptions<T['options']>['format'] extends typeof WidthControlValueFormats.ClassName
    ? string
    : ResolveOptions<T['options']>['format'] extends typeof WidthControlValueFormats.ResponsiveValue
    ? WidthValue | undefined
    : never
  : never

type PropsValueProps = {
  element: ReactPage.ElementData
  children(props: Record<string, unknown>): JSX.Element
}

export function PropsValue({ element, children }: PropsValueProps): JSX.Element {
  const store = useStore()
  const propControllerDescriptorsRef = useRef(
    ReactPage.getComponentPropControllerDescriptors(store.getState(), element.type) ?? {},
  )
  const props = element.props as Record<string, any>

  return Object.entries(propControllerDescriptorsRef.current).reduceRight(
    (renderFn, [propName, descriptor]) =>
      propsValue => {
        switch (descriptor.type) {
          case CheckboxControlType:
          case NumberControlType:
          case TextInputControlType:
          case TextAreaControlType:
          case SelectControlType:
          case ColorControlType:
          case ImageControlType:
          case ComboboxControlType:
          case ShapeControlType:
          case ListControlType:
            return (
              <ControlValue definition={descriptor} data={props[propName]}>
                {value => renderFn({ ...propsValue, [propName]: value })}
              </ControlValue>
            )

          case StyleControlType:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useFormattedStyle}
                parameters={[props[propName], descriptor]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case Props.Types.Width:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useWidth}
                parameters={[props[propName], descriptor, props]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case Props.Types.ResponsiveColor:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useResponsiveColor}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          default:
            return renderFn({ ...propsValue, [propName]: props[propName] })
        }
      },
    children,
  )({})
}
