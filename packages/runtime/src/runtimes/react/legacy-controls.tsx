import { ReactNode } from 'react'
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

import {
  Types as PropControllerTypes,
  getShadowsPropControllerDataResponsiveShadowsData,
  ShadowsPropControllerData,
  Shadows,
  ResponsiveValue,
  BorderPropControllerFormat,
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
import { useLegacyControlledStyle } from './css-runtime/hooks/use-legacy-controlled-style'

export type ResponsiveColor = ResponsiveValue<ColorValue>

function useWidthStyle(
  elementKey: string,
  propName: string,
  data: WidthPropControllerData | undefined,
  descriptor: WidthDescriptor,
): { className: string; styleElement: ReactNode} {
  const value = getWidthPropControllerDataResponsiveLengthData(data)

  return useLegacyControlledStyle(
    useResponsiveWidth(value, descriptor.options.defaultValue),
    elementKey,
    propName
  )
}

function usePaddingStyle(
  elementKey: string,
  propName: string,
  data: PaddingPropControllerData | undefined
): { className: string; styleElement: ReactNode} {
  const value = getPaddingPropControllerDataResponsivePaddingData(data)

  return useLegacyControlledStyle(
    useResponsivePadding(value),
    elementKey,
    propName
  )
}

function useMarginStyle(
  elementKey: string,
  propName: string,
  data: MarginPropControllerData | undefined
): { className: string; styleElement: ReactNode} {
  const value = getMarginPropControllerDataResponsiveMarginData(data)

  return useLegacyControlledStyle(
    useResponsiveMargin(value),
    elementKey,
    propName
  )
}

function useBorderRadiusStyle(
  elementKey: string,
  propName: string,
  data: BorderRadiusPropControllerData | undefined
): { className: string; styleElement: ReactNode} {
  const value = getBorderRadiusPropControllerDataResponsiveBorderRadiusData(data)

  return useLegacyControlledStyle(
    useResponsiveBorderRadius(value),
    elementKey,
    propName
  )
}

function useShadowsStyle(
  elementKey: string,
  propName: string,
  data: ShadowsPropControllerData | undefined
): { className: string; styleElement: ReactNode} {
  return useLegacyControlledStyle(
    useResponsiveShadow(useBoxShadow(data) ?? undefined),
    elementKey,
    propName
  )
}

function useBorderStyle(
  elementKey: string,
  propName: string,
  data: BorderPropControllerData | undefined,
): { className: string; styleElement: ReactNode} {
  const value = getBorderPropControllerDataResponsiveBorderData(data)
  const borderData = useBorderData(value)

  return useLegacyControlledStyle(
    useResponsiveBorder(borderData ?? undefined),
    elementKey,
    propName
  )
}

export function resolveLegacyDescriptorProp(
  descriptor: LegacyDescriptor,
  propName: string,
  elementKey: string,
  propData: any,
  props: Record<string, any>,
  renderFn: (props: Record<string, unknown>) => ReactNode,
) {
  switch (descriptor.type) {
    case PropControllerTypes.Width:
      switch (descriptor.options.format) {
        case WidthPropControllerFormat.ClassName:
          return (
            <RenderHook
              key={descriptor.type}
              hook={useWidthStyle}
              parameters={[elementKey, propName, propData, descriptor]}
            >
              {({ className, styleElement }) => (
                <>
                  {styleElement}
                  {renderFn({ ...props, [propName]: className })}
                </>
              )}
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
            <RenderHook key={descriptor.type} hook={usePaddingStyle} parameters={[elementKey, propName, propData]}>
              {({ className, styleElement }) => (
                <>
                  {styleElement}
                  {renderFn({ ...props, [propName]: className })}
                </>
              )}
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
            <RenderHook key={descriptor.type} hook={useMarginStyle} parameters={[elementKey, propName, propData]}>
              {({ className, styleElement }) => (
                <>
                  {styleElement}
                  {renderFn({ ...props, [propName]: className })}
                </>
              )}
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
            <RenderHook key={descriptor.type} hook={useBorderRadiusStyle} parameters={[elementKey, propName, propData]}>
              {({ className, styleElement }) => (
                <>
                  {styleElement}
                  {renderFn({ ...props, [propName]: className })}
                </>
              )}
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
            <RenderHook key={descriptor.type} hook={useShadowsStyle} parameters={[elementKey, propName, propData]}>
              {({ className, styleElement }) => (
                <>
                  {styleElement}
                  {renderFn({ ...props, [propName]: className })}
                </>
              )}
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
            <RenderHook key={descriptor.type} hook={useBorderStyle} parameters={[elementKey, propName, propData]}>
              {({ className, styleElement }) => (
                <>
                  {styleElement}
                  {renderFn({ ...props, [propName]: className })}
                </>
              )}
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
