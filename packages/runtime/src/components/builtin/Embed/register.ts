import dynamic from 'next/dynamic'

import { forwardNextDynamicRef } from '../../../next/dynamic'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Embed')))),
    {
      type: MakeswiftComponentType.Embed,
      label: 'Embed',
      icon: ComponentIcon.Code,
      props: {
        id: Props.ElementID(),
        html: Props.TextArea({ label: 'Code', rows: 20 }),
        width: Props.Width({ format: Props.Width.Format.ClassName }),
        margin: Props.Margin({ format: Props.Margin.Format.ClassName }),
      },
    },
  )
}
