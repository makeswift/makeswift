import { lazy } from 'react'
import { type BasicReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import {
  Border,
  Link,
  Shadows,
  Checkbox,
  BorderRadius,
  Margin,
  Padding,
  Width,
  ElementID,
  Image,
  ResponsiveOpacity,
  TextInput,
} from '@makeswift/prop-controllers'

export function registerComponent(runtime: BasicReactRuntime) {
  return runtime.registerComponent(
    lazy(() => import('./Image')),
    {
      type: MakeswiftComponentType.Image,
      label: 'Image',
      props: {
        id: ElementID(),
        file: Image(),
        altText: TextInput({ label: 'Alt text' }),
        link: Link({ label: 'On click' }),
        width: Width(),
        margin: Margin({ format: Margin.Format.ClassName }),
        padding: Padding({ format: Padding.Format.ClassName }),
        border: Border({ format: Border.Format.ClassName }),
        borderRadius: BorderRadius({ format: BorderRadius.Format.ClassName }),
        boxShadow: Shadows({ format: Shadows.Format.ClassName }),
        opacity: ResponsiveOpacity(),
        priority: Checkbox({ label: 'Priority' }),
      },
    },
  )
}
