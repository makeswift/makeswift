import dynamic from 'next/dynamic'
import { forwardNextDynamicRef } from '../../../next/dynamic'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Divider')))),
    {
      type: MakeswiftComponentType.Divider,
      label: 'Divider',
      icon: ComponentIcon.Divider,
      props: {
        id: Props.ElementID(),
        variant: Props.ResponsiveSelect({
          label: 'Style',
          labelOrientation: 'horizontal',
          options: [
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'blended', label: 'Blended' },
          ],
          defaultValue: 'solid',
        }),
        thickness: Props.ResponsiveLength({
          label: 'Height',
          defaultValue: { value: 1, unit: 'px' },
          options: [{ value: 'px', label: 'Pixels', icon: 'Px16' }],
        }),
        color: Props.ResponsiveColor({ placeholder: 'black' }),
        width: Props.Width({
          format: Props.Width.Format.ClassName,
          defaultValue: { value: 100, unit: '%' },
        }),
        margin: Props.Margin({ format: Props.Margin.Format.ClassName }),
      },
    },
  )
}
