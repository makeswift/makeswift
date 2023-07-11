// @ts-expect-error: there are no types for 'corporate-ipsum'
import ipsum from 'corporate-ipsum'

import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { DefaultBreakpointID, getBaseBreakpoint } from '../../../state/modules/breakpoints'
import { RichText } from '../../../controls'
import { BlockType } from '../../../slate'
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
        text: RichText({
          unstable_defaultValue: [
            {
              type: BlockType.Default,
              children: [
                {
                  text: ipsum(3),
                  typography: {
                    style: [
                      {
                        deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
                        value: {
                          fontWeight: 400,
                          fontSize: { value: 18, unit: 'px' },
                          lineHeight: 1.5,
                        },
                      },
                      ...(runtime
                        .getBreakpoints()
                        .some(({ id }) => id === DefaultBreakpointID.Mobile)
                        ? [
                            {
                              deviceId: DefaultBreakpointID.Mobile,
                              value: { fontSize: { value: 16, unit: 'px' } },
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],
            },
          ],
        }),
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
