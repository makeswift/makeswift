import { useRef } from 'react'

import { useDocumentKey, useSelector, useStore } from '.'
import * as ReactPage from '../../state/react-page'
import { Props } from '../../prop-controllers'
import {
  BorderDescriptor,
  BorderPropControllerFormat,
  BorderRadiusDescriptor,
  BorderRadiusPropControllerFormat,
  BorderRadiusValue,
  BorderValue,
  Descriptor,
  MarginDescriptor,
  MarginPropControllerFormat,
  MarginValue,
  PaddingDescriptor,
  PaddingPropControllerFormat,
  PaddingValue,
  ResolveOptions,
  ResponsiveValue,
  ShadowsDescriptor,
  ShadowsPropControllerFormat,
  ShadowsValue,
  WidthPropControllerFormat,
  WidthDescriptor,
  WidthValue,
} from '../../prop-controllers/descriptors'
import {
  useBoxShadow,
  useResponsiveColor,
  useBorder as useBorderData,
} from '../../components/hooks'
import type { ColorValue } from '../../components/utils/types'
import {
  responsiveBorder,
  responsiveBorderRadius,
  responsiveMargin,
  responsivePadding,
  responsiveShadow,
  responsiveWidth,
} from '../../components/utils/responsive-style'
import {
  CheckboxControlType,
  ColorControlType,
  ComboboxControlType,
  ImageControlType,
  LinkControlType,
  ListControlType,
  NumberControlType,
  SelectControlType,
  ShapeControlType,
  SlotControl,
  SlotControlType,
  StyleControlType,
  TextAreaControlType,
  TextInputControlType,
  RichTextControl,
  RichTextControlType,
} from '../../controls'
import { useFormattedStyle } from './controls/style'
import { ControlValue } from './controls/control'
import { RenderHook } from './components'
import { useSlot } from './controls/slot'
import { useStyle } from './use-style'
import { useRichText } from './controls/rich-text'

export type ResponsiveColor = ResponsiveValue<ColorValue>

function useWidthStyle(value: WidthValue | undefined, descriptor: WidthDescriptor): string {
  return useStyle(responsiveWidth(value, descriptor.options.defaultValue))
}

export type ResolveWidthControlValue<T extends Descriptor> = T extends WidthDescriptor
  ? undefined extends ResolveOptions<T['options']>['format']
    ? WidthValue | undefined
    : ResolveOptions<T['options']>['format'] extends typeof WidthPropControllerFormat.ClassName
    ? string
    : ResolveOptions<
        T['options']
      >['format'] extends typeof WidthPropControllerFormat.ResponsiveValue
    ? WidthValue | undefined
    : never
  : never

function usePaddingStyle(value: PaddingValue | undefined): string {
  return useStyle(responsivePadding(value))
}

export type ResolvePaddingControlValue<T extends Descriptor> = T extends PaddingDescriptor
  ? undefined extends ResolveOptions<T['options']>['format']
    ? PaddingValue | undefined
    : ResolveOptions<T['options']>['format'] extends typeof PaddingPropControllerFormat.ClassName
    ? string
    : ResolveOptions<
        T['options']
      >['format'] extends typeof PaddingPropControllerFormat.ResponsiveValue
    ? PaddingValue | undefined
    : never
  : never

function useMarginStyle(value: MarginValue | undefined): string {
  return useStyle(responsiveMargin(value))
}

export type ResolveMarginControlValue<T extends Descriptor> = T extends MarginDescriptor
  ? undefined extends ResolveOptions<T['options']>['format']
    ? MarginValue | undefined
    : ResolveOptions<T['options']>['format'] extends typeof MarginPropControllerFormat.ClassName
    ? string
    : ResolveOptions<
        T['options']
      >['format'] extends typeof MarginPropControllerFormat.ResponsiveValue
    ? MarginValue | undefined
    : never
  : never

export function useBorderRadiusStyle(value: BorderRadiusValue | undefined): string {
  return useStyle(responsiveBorderRadius(value))
}

export function useShadowsStyle(
  value: ShadowsValue | undefined,
): string | ShadowsValue | undefined {
  const shadowValue = useBoxShadow(value)

  return useStyle(responsiveShadow(shadowValue ?? undefined))
}

export type ResolveBorderRadiusControlValue<T extends Descriptor> = T extends BorderRadiusDescriptor
  ? undefined extends ResolveOptions<T['options']>['format']
    ? BorderRadiusValue | undefined
    : ResolveOptions<
        T['options']
      >['format'] extends typeof BorderRadiusPropControllerFormat.ClassName
    ? string
    : ResolveOptions<
        T['options']
      >['format'] extends typeof BorderRadiusPropControllerFormat.ResponsiveValue
    ? BorderRadiusValue | undefined
    : never
  : never

export function useBorderStyle(value: BorderValue | undefined): string | BorderValue | undefined {
  const borderData = useBorderData(value)

  return useStyle(responsiveBorder(borderData ?? undefined))
}
export type ResolveShadowsControlValue<T extends Descriptor> = T extends ShadowsDescriptor
  ? undefined extends ResolveOptions<T['options']>['format']
    ? ShadowsValue | undefined
    : ResolveOptions<T['options']>['format'] extends typeof ShadowsPropControllerFormat.ClassName
    ? string
    : ResolveOptions<
        T['options']
      >['format'] extends typeof ShadowsPropControllerFormat.ResponsiveValue
    ? ShadowsValue | undefined
    : never
  : never

export type ResolveBorderControlValue<T extends Descriptor> = T extends BorderDescriptor
  ? undefined extends ResolveOptions<T['options']>['format']
    ? BorderValue | undefined
    : ResolveOptions<T['options']>['format'] extends typeof BorderPropControllerFormat.ClassName
    ? string
    : ResolveOptions<
        T['options']
      >['format'] extends typeof BorderPropControllerFormat.ResponsiveValue
    ? BorderValue | undefined
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
  const documentKey = useDocumentKey()

  const propControllers = useSelector(state => {
    if (documentKey == null) return null

    return ReactPage.getPropControllers(state, documentKey, element.key)
  })

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
          case LinkControlType:
            return (
              <ControlValue
                definition={descriptor}
                data={props[propName]}
                control={propControllers?.[propName]}
              >
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

          case RichTextControlType:
            const control = (propControllers?.[propName] ?? null) as RichTextControl | null

            return (
              <RenderHook
                key={descriptor.type}
                hook={useRichText}
                parameters={[props[propName], control]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case SlotControlType: {
            const control = (propControllers?.[propName] ?? null) as SlotControl | null

            return (
              <RenderHook
                key={descriptor.type}
                hook={useSlot}
                parameters={[props[propName], control]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )
          }

          case Props.Types.Width:
            switch (descriptor.options.format) {
              case WidthPropControllerFormat.ClassName:
                return (
                  <RenderHook
                    key={descriptor.type}
                    hook={useWidthStyle}
                    parameters={[props[propName], descriptor]}
                  >
                    {value => renderFn({ ...propsValue, [propName]: value })}
                  </RenderHook>
                )

              default:
                return renderFn({ ...propsValue, [propName]: props[propName] })
            }

          case Props.Types.Padding:
            switch (descriptor.options.format) {
              case PaddingPropControllerFormat.ClassName:
                return (
                  <RenderHook
                    key={descriptor.type}
                    hook={usePaddingStyle}
                    parameters={[props[propName]]}
                  >
                    {value => renderFn({ ...propsValue, [propName]: value })}
                  </RenderHook>
                )

              default:
                return renderFn({ ...propsValue, [propName]: props[propName] })
            }

          case Props.Types.Margin:
            switch (descriptor.options.format) {
              case MarginPropControllerFormat.ClassName:
                return (
                  <RenderHook
                    key={descriptor.type}
                    hook={useMarginStyle}
                    parameters={[props[propName]]}
                  >
                    {value => renderFn({ ...propsValue, [propName]: value })}
                  </RenderHook>
                )

              default:
                return renderFn({ ...propsValue, [propName]: props[propName] })
            }

          case Props.Types.BorderRadius:
            switch (descriptor.options.format) {
              case BorderRadiusPropControllerFormat.ClassName:
                return (
                  <RenderHook
                    key={descriptor.type}
                    hook={useBorderRadiusStyle}
                    parameters={[props[propName]]}
                  >
                    {value => renderFn({ ...propsValue, [propName]: value })}
                  </RenderHook>
                )

              default:
                return renderFn({ ...propsValue, [propName]: props[propName] })
            }

          case Props.Types.Shadows:
            switch (descriptor.options.format) {
              case ShadowsPropControllerFormat.ClassName:
                return (
                  <RenderHook
                    key={descriptor.type}
                    hook={useShadowsStyle}
                    parameters={[props[propName]]}
                  >
                    {value => renderFn({ ...propsValue, [propName]: value })}
                  </RenderHook>
                )

              default:
                return renderFn({ ...propsValue, [propName]: props[propName] })
            }

          case Props.Types.Border:
            switch (descriptor.options.format) {
              case BorderPropControllerFormat.ClassName:
                return (
                  <RenderHook
                    key={descriptor.type}
                    hook={useBorderStyle}
                    parameters={[props[propName]]}
                  >
                    {value => renderFn({ ...propsValue, [propName]: value })}
                  </RenderHook>
                )

              default:
                return renderFn({ ...propsValue, [propName]: props[propName] })
            }

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
