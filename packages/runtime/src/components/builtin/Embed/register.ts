import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'
import Embed from './'

import { ElementID, Margin, TextArea, Width } from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    Embed,
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
