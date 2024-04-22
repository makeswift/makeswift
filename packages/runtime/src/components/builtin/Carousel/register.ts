import { v4 as uuid } from 'uuid'

import { ImagesValue, Props, ResponsiveNumberValue } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { findBreakpointOverride } from '../../../state/modules/breakpoints'
import { BorderRadius, Margin, Number, ResponsiveColor } from '@makeswift/prop-controllers'

import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'
import { lazy } from 'react'
import {
  Border,
  Checkbox,
  checkboxPropControllerDataSchema,
  getCheckboxPropControllerDataBoolean,
} from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    lazy(() => import('./Carousel')),
    {
      type: MakeswiftComponentType.Carousel,
      label: 'Carousel',
      icon: ComponentIcon.Carousel,
      props: {
        id: Props.ElementID(),
        images: Props.Images({
          preset: [
            { key: uuid(), props: {} },
            { key: uuid(), props: {} },
            { key: uuid(), props: {} },
          ],
        }),
        width: Props.Width({
          format: Props.Width.Format.ClassName,
          defaultValue: { value: 400, unit: 'px' },
        }),
        margin: Margin({ format: Margin.Format.ClassName }),
        pageSize: Props.ResponsiveNumber(props => {
          const images = props.images as ImagesValue | undefined
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
          const pageSize = props.pageSize as ResponsiveNumberValue | undefined
          const pageSizeValue =
            findBreakpointOverride(runtime.getBreakpoints(), pageSize, device)?.value ?? 1

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
        autoplay: Checkbox({ label: 'Autoplay' }),
        delay: Number(props => ({
          label: 'Delay',
          preset: 5,
          min: 1,
          step: 0.1,
          suffix: 'seconds',
          hidden: !getCheckboxPropControllerDataBoolean(
            checkboxPropControllerDataSchema.optional().catch(undefined).parse(props.autoplay),
          ),
        })),
        showArrows: Checkbox({ preset: true, label: 'Show arrows' }),
        arrowPosition: Props.ResponsiveIconRadioGroup(props => ({
          label: 'Arrow position',
          options: [
            { label: 'Inside', value: 'inside', icon: 'ArrowInside16' },
            { label: 'Center', value: 'center', icon: 'ArrowCenter16' },
            { label: 'Outside', value: 'outside', icon: 'ArrowOutside16' },
          ],
          defaultValue: 'inside',
          hidden:
            getCheckboxPropControllerDataBoolean(
              checkboxPropControllerDataSchema.optional().catch(undefined).parse(props.showArrows),
            ) === false,
        })),
        arrowColor: ResponsiveColor(props => ({
          label: 'Arrow color',
          placeholder: 'black',
          hidden:
            getCheckboxPropControllerDataBoolean(
              checkboxPropControllerDataSchema.optional().catch(undefined).parse(props.showArrows),
            ) === false,
        })),
        arrowBackground: ResponsiveColor(props => ({
          label: 'Arrow background',
          placeholder: 'white',
          hidden:
            getCheckboxPropControllerDataBoolean(
              checkboxPropControllerDataSchema.optional().catch(undefined).parse(props.showArrows),
            ) === false,
        })),
        showDots: Checkbox({ preset: true, label: 'Show dots' }),
        dotColor: ResponsiveColor(props => ({
          label: 'Dot color',
          placeholder: 'black',
          hidden:
            getCheckboxPropControllerDataBoolean(
              checkboxPropControllerDataSchema.optional().catch(undefined).parse(props.showDots),
            ) === false,
        })),
        slideBorder: Border({ format: Border.Format.ClassName }),
        slideBorderRadius: BorderRadius({ format: BorderRadius.Format.ClassName }),
      },
    },
  )
}
