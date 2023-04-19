import dynamic from 'next/dynamic'
// @ts-expect-error: there are no types for 'corporate-ipsum'
import ipsum from 'corporate-ipsum'

import { forwardNextDynamicRef } from '../../../next'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { MakeswiftComponentType } from '../constants'
import { getBaseBreakpoint } from '../../../state/modules/breakpoints'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Text')))),
    {
      type: MakeswiftComponentType.Text,
      label: 'Text',
      props: {
        id: Props.ElementID(),
        text: Props.RichText(() => ({
          preset: {
            document: {
              object: 'document',
              nodes: [
                {
                  object: 'block',
                  type: 'paragraph',
                  nodes: [
                    {
                      object: 'text',
                      text: ipsum(3),
                      marks: [
                        {
                          object: 'mark',
                          type: 'typography',
                          data: {
                            value: {
                              id: null,
                              style: [
                                {
                                  deviceId: 'mobile',
                                  value: { fontSize: { value: 16, unit: 'px' } },
                                },
                                {
                                  deviceId: getBaseBreakpoint(runtime.getBreakpoints()).id,
                                  value: {
                                    fontWeight: 400,
                                    fontSize: { value: 18, unit: 'px' },
                                    lineHeight: 1.5,
                                  },
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        })),
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
