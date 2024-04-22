import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'
import { lazy } from 'react'
import { Margin, Width } from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    lazy(() => import('./Embed')),
    {
      type: MakeswiftComponentType.Embed,
      label: 'Embed',
      icon: ComponentIcon.Code,
      props: {
        id: Props.ElementID(),
        html: Props.TextArea({ label: 'Code', rows: 20 }),
        width: Width({ format: Width.Format.ClassName }),
        margin: Margin({ format: Margin.Format.ClassName }),
      },
    },
  )
}
