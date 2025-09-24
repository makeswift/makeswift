import { type ReactRuntimeCore } from '../../../runtimes/react/react-runtime-core'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'
import { lazy } from 'react'
import { BorderRadius, ElementID, Margin, Video, Width } from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntimeCore) {
  return runtime.registerComponent(
    lazy(() => import('./Video')),
    {
      type: MakeswiftComponentType.Video,
      label: 'Video',
      icon: ComponentIcon.Video,
      props: {
        id: ElementID(),
        video: Video({ preset: { controls: true } }),
        width: Width({
          format: Width.Format.ClassName,
          defaultValue: { value: 560, unit: 'px' },
        }),
        margin: Margin({ format: Margin.Format.ClassName }),
        borderRadius: BorderRadius({ format: BorderRadius.Format.ClassName }),
      },
    },
  )
}
