import { lazy } from 'react'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
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
} from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    lazy(() => import('./Image')),
    {
      type: MakeswiftComponentType.Image,
      label: 'Image',
      props: {
        id: ElementID(),
        file: Image(),
        altText: Props.TextInput({ label: 'Alt text' }),
        link: Link({ label: 'On click' }),
        width: Width(),
        margin: Margin({ format: Margin.Format.ClassName }),
        padding: Padding({ format: Padding.Format.ClassName }),
        border: Border({ format: Border.Format.ClassName }),
        borderRadius: BorderRadius({ format: BorderRadius.Format.ClassName }),
        boxShadow: Shadows({ format: Shadows.Format.ClassName }),
        opacity: Props.ResponsiveOpacity(),
        priority: Checkbox({ label: 'Priority' }),
      },
    },
  )
}
