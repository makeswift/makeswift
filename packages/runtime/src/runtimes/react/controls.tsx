import { useRef } from 'react'

import * as ReactPage from '../../state/react-page'

import {
  useBoxShadow,
  useBorder as useBorderData,
  useLinkPropControllerData,
  useCheckboxPropControllerData,
  useDatePropControllerData,
  useFontPropControllerData,
  useVideoPropControllerData,
  useTablePropControllerData,
} from '../../components/hooks'
import type { ColorValue } from '../../components/utils/types'
import {
  useResponsiveBorder,
  useResponsiveBorderRadius,
  useResponsiveMargin,
  useResponsivePadding,
  useResponsiveShadow,
  useResponsiveWidth,
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
  StyleControl,
  RichTextV2Control,
  RichTextV2ControlType,
  StyleV2ControlType,
  TypographyControlType,
} from '../../controls'
import { useFormattedStyle } from './controls/style'
import { ControlValue } from './controls/control'
import { RenderHook } from './components'
import { useSlot } from './controls/slot'
import { useStyle } from './use-style'
import { useRichText } from './controls/rich-text/rich-text'
import { useRichTextV2 } from './controls/rich-text-v2'
import { IconRadioGroupControlType } from '../../controls/icon-radio-group'
import { useStore } from './hooks/use-store'
import { useDocumentKey } from './hooks/use-document-key'
import { useSelector } from './hooks/use-selector'
import {
  Types as PropControllerTypes,
  getShadowsPropControllerDataResponsiveShadowsData,
  ShadowsPropControllerData,
  Shadows,
  ResponsiveValue,
  BorderPropControllerFormat,
  ResponsiveBorderData,
  BorderPropControllerData,
  getBorderPropControllerDataResponsiveBorderData,
  getBorderRadiusPropControllerDataResponsiveBorderRadiusData,
  BorderRadiusPropControllerData,
  BorderRadiusPropControllerFormat,
  MarginPropControllerFormat,
  MarginPropControllerData,
  getMarginPropControllerDataResponsiveMarginData,
  PaddingPropControllerData,
  getPaddingPropControllerDataResponsivePaddingData,
  PaddingPropControllerFormat,
  WidthPropControllerData,
  getWidthPropControllerDataResponsiveLengthData,
  WidthPropControllerFormat,
  WidthDescriptor,
} from '@makeswift/prop-controllers'
import { useResponsiveLengthPropControllerData } from '../../components/hooks/useResponsiveLengthPropControllerData'
import { useNumberPropControllerData } from '../../components/hooks/useNumberPropControllerData'
import { useResponsiveColorPropControllerData } from '../../components/hooks/useResponsiveColorPropControllerData'
import { useTextStylePropControllerData } from '../../components/hooks/useTextStylePropControllerData'
import { useNavigationLinksPropControllerData } from '../../components/hooks/useNavigationLinksPropControllerData'
import { useTextAreaPropControllerData } from '../../components/hooks/useTextAreaPropControllerData'
import { useGapXPropControllerData } from '../../components/hooks/useGapXPropControllerData'
import { useGapYPropControllerData } from '../../components/hooks/useGapYPropControllerData'
import { useElementIDPropControllerData } from '../../components/hooks/useElementIDPropControllerData'
import { useTableFormFieldsPropControllerData } from '../../components/hooks/useTableFormFieldsPropControllerData'

export type ResponsiveColor = ResponsiveValue<ColorValue>

function useWidthStyle(
  data: WidthPropControllerData | undefined,
  descriptor: WidthDescriptor,
): string {
  const value = getWidthPropControllerDataResponsiveLengthData(data)

  return useStyle(useResponsiveWidth(value, descriptor.options.defaultValue))
}

function usePaddingStyle(data: PaddingPropControllerData | undefined): string {
  const value = getPaddingPropControllerDataResponsivePaddingData(data)

  return useStyle(useResponsivePadding(value))
}

function useMarginStyle(data: MarginPropControllerData | undefined): string {
  const value = getMarginPropControllerDataResponsiveMarginData(data)

  return useStyle(useResponsiveMargin(value))
}

export function useBorderRadiusStyle(data: BorderRadiusPropControllerData | undefined): string {
  const value = getBorderRadiusPropControllerDataResponsiveBorderRadiusData(data)

  return useStyle(useResponsiveBorderRadius(value))
}

export function useShadowsStyle(data: ShadowsPropControllerData | undefined): string {
  return useStyle(useResponsiveShadow(useBoxShadow(data) ?? undefined))
}

export function useBorderStyle(
  data: BorderPropControllerData | undefined,
): string | ResponsiveBorderData | undefined {
  const value = getBorderPropControllerDataResponsiveBorderData(data)
  const borderData = useBorderData(value)

  return useStyle(useResponsiveBorder(borderData ?? undefined))
}

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
          case IconRadioGroupControlType:
          case ImageControlType:
          case ComboboxControlType:
          case ShapeControlType:
          case ListControlType:
          case LinkControlType:
          case StyleV2ControlType:
          case TypographyControlType:
            return (
              <ControlValue
                definition={descriptor}
                data={props[propName]}
                control={propControllers?.[propName]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </ControlValue>
            )

          case StyleControlType: {
            const control = (propControllers?.[propName] ?? null) as StyleControl | null

            return (
              <RenderHook
                key={descriptor.type}
                hook={useFormattedStyle}
                parameters={[props[propName], descriptor, control]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )
          }

          case RichTextControlType: {
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
          }

          case RichTextV2ControlType: {
            const control = (propControllers?.[propName] ?? null) as RichTextV2Control | null

            return (
              <RenderHook
                key={descriptor.type}
                hook={useRichTextV2}
                parameters={[props[propName], descriptor, control]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )
          }

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

          case PropControllerTypes.Width:
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

          case PropControllerTypes.Padding:
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

          case PropControllerTypes.Margin:
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

          case PropControllerTypes.BorderRadius:
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

          case PropControllerTypes.Number:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useNumberPropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.ResponsiveLength:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useResponsiveLengthPropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.Shadows:
            switch (descriptor.options.format) {
              case Shadows.Format.ClassName:
                return (
                  <RenderHook
                    key={descriptor.type}
                    hook={useShadowsStyle}
                    parameters={[props[propName]]}
                  >
                    {value => renderFn({ ...propsValue, [propName]: value })}
                  </RenderHook>
                )

              case Shadows.Format.ResponsiveValue:
              default:
                return renderFn({
                  ...propsValue,
                  [propName]: getShadowsPropControllerDataResponsiveShadowsData(props[propName]),
                })
            }

          case PropControllerTypes.Border:
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

          case PropControllerTypes.ResponsiveColor:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useResponsiveColorPropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.Link:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useLinkPropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.Checkbox:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useCheckboxPropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.Date:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useDatePropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.Font:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useFontPropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.Video:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useVideoPropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.Table:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useTablePropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.TextStyle:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useTextStylePropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.NavigationLinks:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useNavigationLinksPropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.TextArea:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useTextAreaPropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.GapX:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useGapXPropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.GapY:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useGapYPropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.ElementID:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useElementIDPropControllerData}
                parameters={[props[propName]]}
              >
                {value => renderFn({ ...propsValue, [propName]: value })}
              </RenderHook>
            )

          case PropControllerTypes.TableFormFields:
            return (
              <RenderHook
                key={descriptor.type}
                hook={useTableFormFieldsPropControllerData}
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
