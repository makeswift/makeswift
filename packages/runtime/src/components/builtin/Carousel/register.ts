import { ReactRuntime } from '../../../runtimes/react'
import { findBreakpointOverride } from '@makeswift/controls'
import {
  BorderRadius,
  ElementID,
  GapX,
  Images,
  ImagesPropControllerData,
  Margin,
  Number,
  ResponsiveColor,
  ResponsiveIconRadioGroup,
  ResponsiveNumber,
  Width,
  getImagesPropControllerDataImagesData,
  type PropData,
} from '@makeswift/prop-controllers'

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
    lazy(() => import('./Carousel').then(mod => ({ default: mod.Carousel }))),
    {
      type: MakeswiftComponentType.Carousel,
      label: 'Carousel',
      icon: ComponentIcon.Carousel,
      props: {
        id: ElementID(),
        images: Images({
          preset: [
            { key: 'image-1', props: {} },
            { key: 'image-2', props: {} },
            { key: 'image-3', props: {} },
          ],
        }),
        width: Width({
          format: Width.Format.ClassName,
          defaultValue: { value: 400, unit: 'px' },
        }),
        margin: Margin({ format: Margin.Format.ClassName }),
        pageSize: ResponsiveNumber(props => {
          const images = getImagesPropControllerDataImagesData(
            props.images as ImagesPropControllerData | undefined,
          )
          const imagesLength = images?.length ?? 0

          return {
            label: 'Images shown',
            defaultValue: 1,
            min: 1,
            max: imagesLength,
            step: 1,
          }
        }),
        step: ResponsiveNumber((props, device) => {
          const pageSize = ResponsiveNumber.fromPropData(
            props.pageSize as PropData<typeof ResponsiveNumber> | undefined,
          )
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
        slideAlignment: ResponsiveIconRadioGroup({
          label: 'Alignment',
          options: [
            { label: 'Top', value: 'flex-start', icon: 'VerticalAlignStart16' },
            { label: 'Middle', value: 'center', icon: 'VerticalAlignMiddle16' },
            { label: 'Bottom', value: 'flex-end', icon: 'VerticalAlignEnd16' },
          ],
          defaultValue: 'center',
        }),
        gap: GapX({
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
        arrowPosition: ResponsiveIconRadioGroup(props => ({
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
