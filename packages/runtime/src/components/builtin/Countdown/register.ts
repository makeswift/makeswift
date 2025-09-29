import { ReactRuntime } from '../../../runtimes/react'
import { getBaseBreakpoint } from '@makeswift/controls'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'
import Countdown from './'

import {
  Date as DatePropController,
  ElementID,
  Font,
  GapX,
  Margin,
  ResponsiveColor,
  ResponsiveIconRadioGroup,
  TextInput,
  Width,
} from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    Countdown,
    {
      type: MakeswiftComponentType.Countdown,
      label: 'Countdown',
      icon: ComponentIcon.Countdown,
      props: {
        id: ElementID(),
        date: DatePropController(() => ({
          preset: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
        })),
        variant: ResponsiveIconRadioGroup({
          label: 'Style',
          options: [
            { label: 'Filled', value: 'filled', icon: 'CountdownSolid16' },
            {
              label: 'Filled split',
              value: 'filled-split',
              icon: 'CountdownSolidSplit16',
            },
            { label: 'Outline', value: 'outline', icon: 'CountdownOutline16' },
            {
              label: 'Outline split',
              value: 'outline-split',
              icon: 'CountdownOutlineSplit16',
            },
            { label: 'Clear', value: 'clear', icon: 'CountdownNaked16' },
          ],
          defaultValue: 'filled',
        }),
        shape: ResponsiveIconRadioGroup({
          label: 'Shape',
          options: [
            { label: 'Pill', value: 'pill', icon: 'ButtonPill16' },
            { label: 'Rounded', value: 'rounded', icon: 'ButtonRounded16' },
            { label: 'Square', value: 'square', icon: 'ButtonSquare16' },
          ],
          defaultValue: 'rounded',
        }),
        size: ResponsiveIconRadioGroup({
          label: 'Size',
          options: [
            { label: 'Small', value: 'small', icon: 'SizeSmall16' },
            { label: 'Medium', value: 'medium', icon: 'SizeMedium16' },
            { label: 'Large', value: 'large', icon: 'SizeLarge16' },
          ],
          defaultValue: 'medium',
        }),
        gap: GapX({
          preset: [
            {
              deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
              value: { value: 10, unit: 'px' },
            },
          ],
          label: 'Gap',
          step: 1,
          min: 0,
          max: 100,
          defaultValue: { value: 0, unit: 'px' },
        }),
        numberFont: Font({ label: 'Number font' }),
        numberColor: ResponsiveColor({
          label: 'Number color',
          placeholder: 'white',
        }),
        blockColor: ResponsiveColor({
          label: 'Block color',
          placeholder: 'black',
        }),
        labelFont: Font({ label: 'Label font' }),
        labelColor: ResponsiveColor({
          label: 'Label color',
          placeholder: 'black',
        }),
        width: Width({
          format: Width.Format.ClassName,
          defaultValue: { value: 560, unit: 'px' },
        }),
        margin: Margin({ format: Margin.Format.ClassName }),
        daysLabel: TextInput({ label: 'Days label', placeholder: 'Days' }),
        hoursLabel: TextInput({ label: 'Hours label', placeholder: 'Hours' }),
        minutesLabel: TextInput({
          label: 'Minutes label',
          placeholder: 'Minutes',
        }),
        secondsLabel: TextInput({
          label: 'Seconds label',
          placeholder: 'Seconds',
        }),
      },
    },
  )
}
