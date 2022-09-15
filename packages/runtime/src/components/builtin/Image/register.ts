import dynamic from 'next/dynamic'
import { forwardNextDynamicRef } from '../../../next'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Image')))),
    {
      type: MakeswiftComponentType.Image,
      label: 'Image',
      props: {
        id: Props.ElementID(),
        file: Props.Image(),
        altText: Props.TextInput({ label: 'Alt text' }),
        link: Props.Link({ label: 'On click' }),
        width: Props.Width(),
        margin: Props.Margin(),
        padding: Props.Padding(),
        border: Props.Border(),
        borderRadius: Props.BorderRadius(),
        boxShadow: Props.Shadows(),
        opacity: Props.ResponsiveOpacity(),
      },
    },
  )
}
