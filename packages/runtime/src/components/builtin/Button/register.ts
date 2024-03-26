import { Link } from '@makeswift/prop-controllers'
import { Props, ResponsiveValue } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { findBreakpointOverride } from '../../../state/modules/breakpoints'
import { MakeswiftComponentType } from '../constants'
import { ButtonVariant } from './contants'
import { lazy } from 'react'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    lazy(() => import('./Button')),
    {
      type: MakeswiftComponentType.Button,
      label: 'Button',
      props: {
        id: Props.ElementID(),
        children: Props.TextInput({ placeholder: 'Button text' }),
        link: Link({
          defaultValue: {
            type: 'OPEN_PAGE',
            payload: {
              pageId: null,
              openInNewTab: false,
            },
          },
        }),
        variant: Props.ResponsiveSelect({
          label: 'Style',
          labelOrientation: 'horizontal',
          options: [
            { value: 'flat', label: 'Flat' },
            { value: 'outline', label: 'Outline' },
            { value: 'shadow', label: 'Floating' },
            { value: 'clear', label: 'Clear' },
            { value: 'blocky', label: 'Blocky' },
            { value: 'bubbly', label: 'Bubbly' },
            { value: 'skewed', label: 'Skewed' },
          ],
          defaultValue: 'flat',
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
        color: Props.ResponsiveColor((props, device) => {
          const variant = props.variant as ResponsiveValue<ButtonVariant>
          const hidden =
            findBreakpointOverride<ButtonVariant>(runtime.getBreakpoints(), variant, device)
              ?.value === 'clear'

          return { placeholder: 'black', hidden }
        }),
        textColor: Props.ResponsiveColor({
          label: 'Text color',
          placeholder: 'white',
        }),
        textStyle: Props.TextStyle(),
        width: Props.Width(),
        margin: Props.Margin({ format: Props.Margin.Format.ClassName }),
      },
    },
  )
}
