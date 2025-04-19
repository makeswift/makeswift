import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'
import dynamic from 'next/dynamic'
import { BorderRadius, ElementID, Margin, Video, Width } from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    // @ts-expect-error: fix optional prop error
    dynamic(() => import('./Video')),
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
