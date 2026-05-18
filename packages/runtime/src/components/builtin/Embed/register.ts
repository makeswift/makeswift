import { type ReactRuntimeCore } from '../../../runtimes/react/react-runtime-core'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'
import { lazy } from 'react'
import { Code } from '@makeswift/controls'
import { ElementID, Margin, Width } from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntimeCore) {
  return runtime.registerComponent(
    lazy(() => import('./Embed')),
    {
      type: MakeswiftComponentType.Embed,
      label: 'Embed',
      icon: ComponentIcon.Code,
      props: {
        id: ElementID(),
        html: Code({ label: 'Code' }),
        width: Width({ format: Width.Format.ClassName }),
        margin: Margin({ format: Margin.Format.ClassName }),
      },
    },
  )
}
