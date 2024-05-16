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
import { ReactRuntime } from '../../../runtimes/react'
import { findBreakpointOverride, getBaseBreakpoint } from '../../../state/modules/breakpoints'
import { MakeswiftComponentType } from '../constants'
import {
  BoxAnimateIn,
  DEFAULT_BOX_ANIMATE_DELAY,
  DEFAULT_BOX_ANIMATE_DURATION,
  DEFAULT_ITEM_ANIMATE_DELAY,
  DEFAULT_ITEM_STAGGER_DURATION,
} from './constants'
import { lazy } from 'react'

export function registerComponent(runtime: ReactRuntime) {
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
    lazy(() => import('./Box')),
    {
      type: MakeswiftComponentType.Box,
      label: 'Box',
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
        verticalAlign: ResponsiveIconRadioGroup({
          label: 'Align items',
          options: [
            { value: 'flex-start', label: 'Top', icon: 'VerticalAlignStart16' },
            { value: 'center', label: 'Middle', icon: 'VerticalAlignMiddle16' },
            { value: 'flex-end', label: 'Bottom', icon: 'VerticalAlignEnd16' },
            {
              value: 'space-between',
              label: 'Space between',
              icon: 'VerticalAlignSpaceBetween16',
            },
          ],
          defaultValue: 'flex-start',
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
        rowGap: GapY(props => ({
          hidden: props.children == null,
        })),
        columnGap: GapX(props => ({
          hidden: props.children == null,
        })),
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
        children: Grid(),
      },
    },
  )
}
