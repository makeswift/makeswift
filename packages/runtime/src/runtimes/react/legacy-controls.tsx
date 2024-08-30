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

import { RenderHook } from './components'
import { useStyle } from './use-style'

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
  GapX,
  ResponsiveNumber,
  ResponsiveIconRadioGroup,
  ResponsiveSelect,
  ResponsiveOpacity,
  getSocialLinksPropControllerDataSocialLinksData,
} from '@makeswift/prop-controllers'

import { LegacyDescriptor } from '../../prop-controllers/descriptors'
import { useResponsiveLengthPropControllerData } from '../../components/hooks/useResponsiveLengthPropControllerData'
import { useNumberPropControllerData } from '../../components/hooks/useNumberPropControllerData'
import { useResponsiveColorPropControllerData } from '../../components/hooks/useResponsiveColorPropControllerData'
import { useTextStylePropControllerData } from '../../components/hooks/useTextStylePropControllerData'
import { useNavigationLinksPropControllerData } from '../../components/hooks/useNavigationLinksPropControllerData'
import { useTextAreaPropControllerData } from '../../components/hooks/useTextAreaPropControllerData'
import { usePropValue } from '../../components/hooks/usePropValue'
import { useGapYPropControllerData } from '../../components/hooks/useGapYPropControllerData'
import { useElementIDPropControllerData } from '../../components/hooks/useElementIDPropControllerData'
import { useTableFormFieldsPropControllerData } from '../../components/hooks/useTableFormFieldsPropControllerData'
import { useGridPropControllerData } from '../../components/hooks/useGridPropControllerData'
import { useImagePropControllerData } from '../../components/hooks/useImagePropControllerData'
import { useImagesPropControllerData } from '../../components/hooks/useImagesPropControllerData'
import { useBackgroundsPropControllerData } from '../../components/hooks/useBackgroundsPropControllerData'
import { useTextInputPropControllerData } from '../../components/hooks/useTextInputPropControllerData'

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

function useBorderRadiusStyle(data: BorderRadiusPropControllerData | undefined): string {
  const value = getBorderRadiusPropControllerDataResponsiveBorderRadiusData(data)

  return useStyle(useResponsiveBorderRadius(value))
}

function useShadowsStyle(data: ShadowsPropControllerData | undefined): string {
  return useStyle(useResponsiveShadow(useBoxShadow(data) ?? undefined))
}

function useBorderStyle(
  data: BorderPropControllerData | undefined,
): string | ResponsiveBorderData | undefined {
  const value = getBorderPropControllerDataResponsiveBorderData(data)
  const borderData = useBorderData(value)

  return useStyle(useResponsiveBorder(borderData ?? undefined))
}

export function resolveLegacyDescriptorProp(
  descriptor: LegacyDescriptor,
  propName: string,
  propData: any,
  props: Record<string, any>,
  renderFn: (props: Record<string, unknown>) => JSX.Element,
) {
  switch (descriptor.type) {
    case PropControllerTypes.Width:
      switch (descriptor.options.format) {
        case WidthPropControllerFormat.ClassName:
          return (
            <RenderHook
              key={descriptor.type}
              hook={useWidthStyle}
              parameters={[propData, descriptor]}
            >
              {value => renderFn({ ...props, [propName]: value })}
            </RenderHook>
          )

        case WidthPropControllerFormat.ResponsiveValue:
        default:
          return renderFn({
            ...props,
            [propName]: getWidthPropControllerDataResponsiveLengthData(propData),
          })
      }

    case PropControllerTypes.Padding:
      switch (descriptor.options.format) {
        case PaddingPropControllerFormat.ClassName:
          return (
            <RenderHook key={descriptor.type} hook={usePaddingStyle} parameters={[propData]}>
              {value => renderFn({ ...props, [propName]: value })}
            </RenderHook>
          )

        case PaddingPropControllerFormat.ResponsiveValue:
        default:
          return renderFn({
            ...props,
            [propName]: getPaddingPropControllerDataResponsivePaddingData(propData),
          })
      }

    case PropControllerTypes.Margin:
      switch (descriptor.options.format) {
        case MarginPropControllerFormat.ClassName:
          return (
            <RenderHook key={descriptor.type} hook={useMarginStyle} parameters={[propData]}>
              {value => renderFn({ ...props, [propName]: value })}
            </RenderHook>
          )

        case MarginPropControllerFormat.ResponsiveValue:
        default:
          return renderFn({
            ...props,
            [propName]: getMarginPropControllerDataResponsiveMarginData(propData),
          })
      }

    case PropControllerTypes.BorderRadius:
      switch (descriptor.options.format) {
        case BorderRadiusPropControllerFormat.ClassName:
          return (
            <RenderHook key={descriptor.type} hook={useBorderRadiusStyle} parameters={[propData]}>
              {value => renderFn({ ...props, [propName]: value })}
            </RenderHook>
          )

        case BorderRadiusPropControllerFormat.ResponsiveValue:
        default:
          return renderFn({
            ...props,
            [propName]: getBorderRadiusPropControllerDataResponsiveBorderRadiusData(propData),
          })
      }

    case PropControllerTypes.Backgrounds:
      return (
        <RenderHook
          key={descriptor.type}
          hook={useBackgroundsPropControllerData}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.Image:
      return (
        <RenderHook key={descriptor.type} hook={useImagePropControllerData} parameters={[propData]}>
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.Images:
      return (
        <RenderHook
          key={descriptor.type}
          hook={useImagesPropControllerData}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.Number:
      return (
        <RenderHook
          key={descriptor.type}
          hook={useNumberPropControllerData}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.ResponsiveNumber:
      return (
        <RenderHook
          key={descriptor.type}
          hook={data => usePropValue(ResponsiveNumber, data)}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.ResponsiveIconRadioGroup:
      return (
        <RenderHook
          key={descriptor.type}
          hook={data => usePropValue(ResponsiveIconRadioGroup, data)}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.ResponsiveSelect:
      return (
        <RenderHook
          key={descriptor.type}
          hook={data => usePropValue(ResponsiveSelect, data)}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.ResponsiveOpacity:
      return (
        <RenderHook
          key={descriptor.type}
          hook={data => usePropValue(ResponsiveOpacity, data)}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.ResponsiveLength:
      return (
        <RenderHook
          key={descriptor.type}
          hook={useResponsiveLengthPropControllerData}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.Shadows:
      switch (descriptor.options.format) {
        case Shadows.Format.ClassName:
          return (
            <RenderHook key={descriptor.type} hook={useShadowsStyle} parameters={[propData]}>
              {value => renderFn({ ...props, [propName]: value })}
            </RenderHook>
          )

        case Shadows.Format.ResponsiveValue:
        default:
          return renderFn({
            ...props,
            [propName]: getShadowsPropControllerDataResponsiveShadowsData(propData),
          })
      }

    case PropControllerTypes.Border:
      switch (descriptor.options.format) {
        case BorderPropControllerFormat.ClassName:
          return (
            <RenderHook key={descriptor.type} hook={useBorderStyle} parameters={[propData]}>
              {value => renderFn({ ...props, [propName]: value })}
            </RenderHook>
          )

        case BorderPropControllerFormat.ResponsiveValue:
        default:
          return renderFn({
            ...props,
            [propName]: getBorderPropControllerDataResponsiveBorderData(propData),
          })
      }

    case PropControllerTypes.ResponsiveColor:
      return (
        <RenderHook
          key={descriptor.type}
          hook={useResponsiveColorPropControllerData}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.Link:
      return (
        <RenderHook key={descriptor.type} hook={useLinkPropControllerData} parameters={[propData]}>
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.Checkbox:
      return (
        <RenderHook
          key={descriptor.type}
          hook={useCheckboxPropControllerData}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.Date:
      return (
        <RenderHook key={descriptor.type} hook={useDatePropControllerData} parameters={[propData]}>
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.Font:
      return (
        <RenderHook key={descriptor.type} hook={useFontPropControllerData} parameters={[propData]}>
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.Video:
      return (
        <RenderHook key={descriptor.type} hook={useVideoPropControllerData} parameters={[propData]}>
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.Table:
      return (
        <RenderHook key={descriptor.type} hook={useTablePropControllerData} parameters={[propData]}>
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.TextStyle:
      return (
        <RenderHook
          key={descriptor.type}
          hook={useTextStylePropControllerData}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.NavigationLinks:
      return (
        <RenderHook
          key={descriptor.type}
          hook={useNavigationLinksPropControllerData}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.TextInput:
      return (
        <RenderHook
          key={descriptor.type}
          hook={useTextInputPropControllerData}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.TextArea:
      return (
        <RenderHook
          key={descriptor.type}
          hook={useTextAreaPropControllerData}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.GapX:
      return (
        <RenderHook
          key={descriptor.type}
          hook={data => usePropValue(GapX, data)}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.GapY:
      return (
        <RenderHook key={descriptor.type} hook={useGapYPropControllerData} parameters={[propData]}>
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.ElementID:
      return (
        <RenderHook
          key={descriptor.type}
          hook={useElementIDPropControllerData}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.TableFormFields:
      return (
        <RenderHook
          key={descriptor.type}
          hook={useTableFormFieldsPropControllerData}
          parameters={[propData]}
        >
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    case PropControllerTypes.SocialLinks:
      return renderFn({
        ...props,
        [propName]: getSocialLinksPropControllerDataSocialLinksData(propData),
      })

    case PropControllerTypes.Grid:
      return (
        <RenderHook key={descriptor.type} hook={useGridPropControllerData} parameters={[propData]}>
          {value => renderFn({ ...props, [propName]: value })}
        </RenderHook>
      )

    default:
      return renderFn({ ...props, [propName]: propData })
  }
}
