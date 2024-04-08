import { lazy } from 'react'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { Border, Link, Shadows, Checkbox } from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    lazy(() => import('./Image')),
    {
      type: MakeswiftComponentType.Image,
      label: 'Image',
      props: {
        id: Props.ElementID(),
        file: Props.Image(),
        altText: Props.TextInput({ label: 'Alt text' }),
        link: Link({ label: 'On click' }),
        width: Props.Width(),
        margin: Props.Margin({ format: Props.Margin.Format.ClassName }),
        padding: Props.Padding({ format: Props.Padding.Format.ClassName }),
        border: Border({ format: Border.Format.ClassName }),
        borderRadius: Props.BorderRadius({ format: Props.BorderRadius.Format.ClassName }),
        boxShadow: Shadows({ format: Shadows.Format.ClassName }),
        opacity: Props.ResponsiveOpacity(),
        priority: Checkbox({ label: 'Priority' }),
      },
    },
  )
}
