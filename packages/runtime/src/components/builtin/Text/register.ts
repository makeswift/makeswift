import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { getBaseBreakpoint } from '../../../state/modules/breakpoints'
import { RichText } from '../../../controls/rich-text-v2/rich-text-v2'
import { forwardNextDynamicRef } from '../../../next/dynamic'
import dynamic from 'next/dynamic'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Text')))),
    {
      type: MakeswiftComponentType.Text,
      label: 'Text',
      props: {
        id: Props.ElementID(),
        text: RichText(),
        width: Props.Width({
          format: Props.Width.Format.ClassName,
          preset: [
            {
              deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
              value: { value: 700, unit: 'px' },
            },
          ],
          defaultValue: { value: 100, unit: '%' },
        }),
        margin: Props.Margin({
          format: Props.Margin.Format.ClassName,
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
