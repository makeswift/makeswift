import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { getBaseBreakpoint } from '../../../state/modules/breakpoints'
import { RichText } from '../../../controls/rich-text-v2/rich-text-v2'
import { lazy } from 'react'
import { ElementID, Margin, Width } from '@makeswift/prop-controllers'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    lazy(() => import('./Text')),
    {
      type: MakeswiftComponentType.Text,
      label: 'Text',
      props: {
        id: ElementID(),
        text: RichText(),
        width: Width({
          format: Width.Format.ClassName,
          preset: [
            {
              deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
              value: { value: 700, unit: 'px' },
            },
          ],
          defaultValue: { value: 100, unit: '%' },
        }),
        margin: Margin({
          format: Margin.Format.ClassName,
          preset: [
            {
              deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
              value: {
                marginTop: null,
                marginRight: 'auto',
                marginBottom: { value: 20, unit: 'px' },
                marginLeft: 'auto',
              },
            },
          ],
        }),
      },
    },
  )
}
