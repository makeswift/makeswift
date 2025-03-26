import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'
import dynamic from 'next/dynamic'
import { ElementID, Margin, TextArea, Width } from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    dynamic(() => import('./Embed')),
    {
      type: MakeswiftComponentType.Embed,
      label: 'Embed',
      icon: ComponentIcon.Code,
      props: {
        id: ElementID(),
        html: TextArea({ label: 'Code', rows: 20 }),
        width: Width({ format: Width.Format.ClassName }),
        margin: Margin({ format: Margin.Format.ClassName }),
      },
    },
  )
}
