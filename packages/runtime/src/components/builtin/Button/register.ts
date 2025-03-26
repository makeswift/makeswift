import {
  ElementID,
  Link,
  Margin,
  ResponsiveColor,
  ResponsiveIconRadioGroup,
  ResponsiveSelect,
  TextInput,
  TextStyle,
  Width,
  type PropData,
} from '@makeswift/prop-controllers'
import { findBreakpointOverride } from '@makeswift/controls'

import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { ButtonVariant } from './contants'
import dynamic from 'next/dynamic'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    dynamic(() => import('./Button')),
    {
      type: MakeswiftComponentType.Button,
      label: 'Button',
      props: {
        id: ElementID(),
        children: TextInput({ placeholder: 'Button text' }),
        link: Link({
          defaultValue: {
            type: 'OPEN_PAGE',
            payload: {
              pageId: null,
              openInNewTab: false,
            },
          },
        }),
        variant: ResponsiveSelect({
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
        color: ResponsiveColor((props, device) => {
          const variant = ResponsiveSelect.fromPropData<ButtonVariant>(
            props.variant as PropData<typeof ResponsiveSelect> | undefined,
          )
          const hidden =
            findBreakpointOverride<ButtonVariant>(runtime.getBreakpoints(), variant, device)
              ?.value === 'clear'

          return { placeholder: 'black', hidden }
        }),
        textColor: ResponsiveColor({
          label: 'Text color',
          placeholder: 'white',
        }),
        textStyle: TextStyle(),
        width: Width(),
        margin: Margin({ format: Margin.Format.ClassName }),
      },
    },
  )
}
