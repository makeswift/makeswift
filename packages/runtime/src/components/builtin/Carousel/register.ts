import dynamic from 'next/dynamic'
import uuid from 'uuid/v4'

import { forwardNextDynamicRef } from '../../../next'
import { Props, ResponsiveValue } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { findDeviceOverride } from '../../utils/devices'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Carousel')))),
    {
      type: './components/Carousel/index.js',
      label: 'Carousel',
      icon: 'Carousel40',
      props: {
        id: Props.ElementID(),
        images: Props.Images({
          preset: [
            { key: uuid(), props: {} },
            { key: uuid(), props: {} },
            { key: uuid(), props: {} },
          ],
        }),
        width: Props.Width({ defaultValue: { value: 400, unit: 'px' } }),
        margin: Props.Margin(),
        pageSize: Props.ResponsiveNumber(props => {
          const images = props.images as unknown[]
          const imagesLength = images?.length ?? 0

          return {
            label: 'Images shown',
            defaultValue: 1,
            min: 1,
            max: imagesLength,
            step: 1,
          }
        }),
        step: Props.ResponsiveNumber((props, device) => {
          const pageSize = props.pageSize as ResponsiveValue<number>
          const pageSizeValue = findDeviceOverride(pageSize, device)?.value ?? 1

          return {
            label: 'Step',
            defaultValue: 1,
            min: 1,
            max: pageSizeValue,
            step: 1,
          }
        }),
        slideAlignment: Props.ResponsiveIconRadioGroup({
          label: 'Alignment',
          options: [
            { label: 'Top', value: 'flex-start', icon: 'VerticalAlignStart16' },
            { label: 'Middle', value: 'center', icon: 'VerticalAlignMiddle16' },
            { label: 'Bottom', value: 'flex-end', icon: 'VerticalAlignEnd16' },
          ],
          defaultValue: 'center',
        }),
        gap: Props.GapX({
          label: 'Gap',
          step: 5,
          defaultValue: { value: 0, unit: 'px' },
        }),
        autoplay: Props.Checkbox({ label: 'Autoplay' }),
        delay: Props.Number(props => ({
          label: 'Delay',
          preset: 5,
          min: 1,
          step: 0.1,
          suffix: 'seconds',
          hidden: !props.autoplay,
        })),
        showArrows: Props.Checkbox({ preset: true, label: 'Show arrows' }),
        arrowPosition: Props.ResponsiveIconRadioGroup(props => ({
          label: 'Arrow position',
          options: [
            { label: 'Inside', value: 'inside', icon: 'ArrowInside16' },
            { label: 'Center', value: 'center', icon: 'ArrowCenter16' },
            { label: 'Outside', value: 'outside', icon: 'ArrowOutside16' },
          ],
          defaultValue: 'inside',
          hidden: props.showArrows === false,
        })),
        arrowColor: Props.ResponsiveColor(props => ({
          label: 'Arrow color',
          placeholder: 'black',
          hidden: props.showArrows === false,
        })),
        arrowBackground: Props.ResponsiveColor(props => ({
          label: 'Arrow background',
          placeholder: 'white',
          hidden: props.showArrows === false,
        })),
        showDots: Props.Checkbox({ preset: true, label: 'Show dots' }),
        dotColor: Props.ResponsiveColor(props => ({
          label: 'Dot color',
          placeholder: 'black',
          hidden: props.showDots === false,
        })),
        slideBorder: Props.Border(),
        slideBorderRadius: Props.BorderRadius(),
      },
    },
  )
}
