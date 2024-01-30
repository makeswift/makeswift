import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { getBaseBreakpoint } from '../../../state/modules/breakpoints'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'
import { lazy } from 'react'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    lazy(() => import('./Countdown')),
    {
      type: MakeswiftComponentType.Countdown,
      label: 'Countdown',
      icon: ComponentIcon.Countdown,
      props: {
        id: Props.ElementID(),
        date: Props.Date(() => ({
          preset: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
        })),
        variant: Props.ResponsiveIconRadioGroup({
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
        shape: Props.ResponsiveIconRadioGroup({
          label: 'Shape',
          options: [
            { label: 'Pill', value: 'pill', icon: 'ButtonPill16' },
            { label: 'Rounded', value: 'rounded', icon: 'ButtonRounded16' },
            { label: 'Square', value: 'square', icon: 'ButtonSquare16' },
          ],
          defaultValue: 'rounded',
        }),
        size: Props.ResponsiveIconRadioGroup({
          label: 'Size',
          options: [
            { label: 'Small', value: 'small', icon: 'SizeSmall16' },
            { label: 'Medium', value: 'medium', icon: 'SizeMedium16' },
            { label: 'Large', value: 'large', icon: 'SizeLarge16' },
          ],
          defaultValue: 'medium',
        }),
        gap: Props.GapX({
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
        numberFont: Props.Font({ label: 'Number font' }),
        numberColor: Props.ResponsiveColor({
          label: 'Number color',
          placeholder: 'white',
        }),
        blockColor: Props.ResponsiveColor({
          label: 'Block color',
          placeholder: 'black',
        }),
        labelFont: Props.Font({ label: 'Label font' }),
        labelColor: Props.ResponsiveColor({
          label: 'Label color',
          placeholder: 'black',
        }),
        width: Props.Width({
          format: Props.Width.Format.ClassName,
          defaultValue: { value: 560, unit: 'px' },
        }),
        margin: Props.Margin({ format: Props.Margin.Format.ClassName }),
        daysLabel: Props.TextInput({ label: 'Days label', placeholder: 'Days' }),
        hoursLabel: Props.TextInput({ label: 'Hours label', placeholder: 'Hours' }),
        minutesLabel: Props.TextInput({
          label: 'Minutes label',
          placeholder: 'Minutes',
        }),
        secondsLabel: Props.TextInput({
          label: 'Seconds label',
          placeholder: 'Seconds',
        }),
      },
    },
  )
}
