import { type ReactRuntimeCore } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { ComponentIcon } from '../../../state/modules/components-meta'
import { lazy } from 'react'
import {
  ElementID,
  Margin,
  ResponsiveColor,
  ResponsiveLength,
  ResponsiveSelect,
  Width,
} from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntimeCore) {
  return runtime.registerComponent(
    lazy(() => import('./Divider')),
    {
      type: MakeswiftComponentType.Divider,
      label: 'Divider',
      icon: ComponentIcon.Divider,
      props: {
        id: ElementID(),
        variant: ResponsiveSelect({
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
        thickness: ResponsiveLength({
          label: 'Height',
          defaultValue: { value: 1, unit: 'px' },
          options: [{ value: 'px', label: 'Pixels', icon: 'Px16' }],
        }),
        color: ResponsiveColor({ placeholder: 'black' }),
        width: Width({
          format: Width.Format.ClassName,
          defaultValue: { value: 100, unit: '%' },
        }),
        margin: Margin({ format: Margin.Format.ClassName }),
      },
    },
  )
}
