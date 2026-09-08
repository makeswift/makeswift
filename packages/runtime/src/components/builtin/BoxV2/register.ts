import {
  Backgrounds,
  Border,
  BorderRadius,
  Checkbox,
  ElementID,
  GapX,
  GapY,
  Grid,
  Margin,
  Padding,
  ResponsiveIconRadioGroup,
  ResponsiveNumber,
  ResponsiveSelect,
  Shadows,
  Width,
  type PropData,
} from '@makeswift/prop-controllers'
import { findBreakpointOverride, getBaseBreakpoint } from '@makeswift/controls'

import { type ReactRuntimeCore } from '../../../runtimes/react/react-runtime-core'
import { MakeswiftComponentType } from '../constants'
import {
  BoxAnimateIn,
  DEFAULT_BOX_ANIMATE_DELAY,
  DEFAULT_BOX_ANIMATE_DURATION,
  DEFAULT_ITEM_ANIMATE_DELAY,
  DEFAULT_ITEM_STAGGER_DURATION,
} from '../Box/constants'
import { lazy } from 'react'

export function registerComponent(runtime: ReactRuntimeCore) {
  function isHiddenBasedOnAnimationType(
    props: Record<string, unknown>,
    deviceId: string,
    property: 'boxAnimateType' | 'itemAnimateType',
  ): boolean {
    const animateIn = ResponsiveSelect.fromPropData<BoxAnimateIn>(
      props[property] as PropData<typeof ResponsiveSelect> | undefined,
    )
    return (
      (findBreakpointOverride<BoxAnimateIn>(runtime.getBreakpoints(), animateIn, deviceId)?.value ??
        'none') === 'none'
    )
  }
  const isHiddenBasedOnBoxAnimation = (props: Record<string, unknown>, deviceId: string) =>
    isHiddenBasedOnAnimationType(props, deviceId, 'boxAnimateType')
  const isHiddenBasedOnItemAnimation = (props: Record<string, unknown>, deviceId: string) =>
    isHiddenBasedOnAnimationType(props, deviceId, 'itemAnimateType')

  return runtime.registerComponent(
    lazy(() => import('./BoxV2')),
    {
      type: MakeswiftComponentType.BoxV2,
      label: 'Box V2',
      props: {
        id: ElementID(),
        backgrounds: Backgrounds(),
        width: Width({
          format: Width.Format.ClassName,
          defaultValue: { value: 100, unit: '%' },
        }),
        height: ResponsiveIconRadioGroup({
          label: 'Height',
          options: [
            { value: 'auto', label: 'Auto', icon: 'HeightAuto16' },
            { value: 'stretch', label: 'Stretch', icon: 'HeightMatch16' },
          ],
          defaultValue: 'auto',
        }),
        direction: ResponsiveSelect({
          label: 'Layout direction',
          variant: 'icon-radio-group',
          options: [
            { value: 'row', label: 'Horizontal', icon: 'ArrowLeftRight16' },
            { value: 'column', label: 'Vertical', icon: 'ArrowUpDown16' },
          ],
          defaultValue: 'row',
        }),
        alignItems: ResponsiveSelect({
          label: 'Align items',
          variant: 'alignment',
          options: [
            { value: 'top-left', label: 'Top left' },
            { value: 'top-center', label: 'Top center' },
            { value: 'top-right', label: 'Top right' },
            { value: 'center-left', label: 'Center left' },
            { value: 'center-center', label: 'Center' },
            { value: 'center-right', label: 'Center right' },
            { value: 'bottom-left', label: 'Bottom left' },
            { value: 'bottom-center', label: 'Bottom center' },
            { value: 'bottom-right', label: 'Bottom right' },
            { value: 'top-left-between', label: 'Top left (space between)' },
            { value: 'top-center-between', label: 'Top center (space between)' },
            { value: 'top-right-between', label: 'Top right (space between)' },
            { value: 'center-left-between', label: 'Center left (space between)' },
            { value: 'center-center-between', label: 'Center (space between)' },
            { value: 'center-right-between', label: 'Center right (space between)' },
            { value: 'bottom-left-between', label: 'Bottom left (space between)' },
            { value: 'bottom-center-between', label: 'Bottom center (space between)' },
            { value: 'bottom-right-between', label: 'Bottom right (space between)' },
          ],
          defaultValue: 'top-left',
        }),
        margin: Margin({ format: Margin.Format.ClassName }),
        padding: Padding({
          format: Padding.Format.ClassName,
          preset: [
            {
              deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
              value: {
                paddingTop: { value: 10, unit: 'px' },
                paddingRight: { value: 10, unit: 'px' },
                paddingBottom: { value: 10, unit: 'px' },
                paddingLeft: { value: 10, unit: 'px' },
              },
            },
          ],
        }),
        border: Border({ format: Border.Format.ClassName }),
        borderRadius: BorderRadius({ format: BorderRadius.Format.ClassName }),
        boxShadow: Shadows({ format: Shadows.Format.ClassName }),
        rowGap: GapY(),
        columnGap: GapX(),
        boxAnimateType: ResponsiveSelect({
          label: 'Animate box in',
          labelOrientation: 'vertical',
          options: [
            { value: 'none', label: 'None' },
            { value: 'fadeIn', label: 'Fade in' },
            { value: 'fadeRight', label: 'Fade right' },
            { value: 'fadeDown', label: 'Fade down' },
            { value: 'fadeLeft', label: 'Fade left' },
            { value: 'fadeUp', label: 'Fade up' },
            { value: 'blurIn', label: 'Blur in' },
            { value: 'scaleUp', label: 'Scale up' },
            { value: 'scaleDown', label: 'Scale down' },
          ],
          defaultValue: 'none',
        }),
        boxAnimateDuration: ResponsiveNumber((props, device) => ({
          label: 'Box duration',
          defaultValue: DEFAULT_BOX_ANIMATE_DURATION,
          min: 0.1,
          step: 0.05,
          suffix: 's',
          hidden: isHiddenBasedOnBoxAnimation(props, device),
        })),
        boxAnimateDelay: ResponsiveNumber((props, device) => ({
          label: 'Box delay',
          defaultValue: DEFAULT_BOX_ANIMATE_DELAY,
          min: 0,
          step: 0.05,
          suffix: 's',
          hidden: isHiddenBasedOnBoxAnimation(props, device),
        })),
        itemAnimateType: ResponsiveSelect({
          label: 'Animate items in',
          labelOrientation: 'vertical',
          options: [
            { value: 'none', label: 'None' },
            { value: 'fadeIn', label: 'Fade in' },
            { value: 'fadeRight', label: 'Fade right' },
            { value: 'fadeDown', label: 'Fade down' },
            { value: 'fadeLeft', label: 'Fade left' },
            { value: 'fadeUp', label: 'Fade up' },
            { value: 'blurIn', label: 'Blur in' },
            { value: 'scaleUp', label: 'Scale up' },
            { value: 'scaleDown', label: 'Scale down' },
          ],
          defaultValue: 'none',
        }),
        itemAnimateDuration: ResponsiveNumber((props, device) => ({
          label: 'Items duration',
          defaultValue: DEFAULT_BOX_ANIMATE_DURATION,
          min: 0.1,
          step: 0.05,
          suffix: 's',
          hidden: isHiddenBasedOnItemAnimation(props, device),
        })),
        itemAnimateDelay: ResponsiveNumber((props, device) => ({
          label: 'Items delay',
          defaultValue: DEFAULT_ITEM_ANIMATE_DELAY,
          min: 0,
          step: 0.05,
          suffix: 's',
          hidden: isHiddenBasedOnItemAnimation(props, device),
        })),
        itemStaggerDuration: ResponsiveNumber((props, device) => ({
          label: 'Stagger',
          min: 0,
          step: 0.05,
          suffix: 's',
          defaultValue: DEFAULT_ITEM_STAGGER_DURATION,
          hidden: isHiddenBasedOnItemAnimation(props, device),
        })),
        hidePlaceholder: Checkbox(props => ({
          label: 'Hide placeholder',
          hidden: props.children != null,
        })),
        children: Grid({ layout: 'flex' }),
      },
    },
  )
}
