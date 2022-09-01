import dynamic from 'next/dynamic'
// @ts-expect-error: there are no types for 'corporate-ipsum'
import ipsum from 'corporate-ipsum'

import { forwardNextDynamicRef } from '../../../next'
import { Props } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'

export function registerComponent(runtime: ReactRuntime) {
  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Text')))),
    {
      type: './components/Text/index.js',
      label: 'Text',
      props: {
        id: Props.ElementID(),
        text: Props.RichText(() => ({
          preset: {
            document: {
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
                                  deviceId: 'desktop',
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
          preset: [{ deviceId: 'desktop', value: { value: 700, unit: 'px' } }],
          defaultValue: { value: 100, unit: '%' },
        }),
        margin: Props.Margin({
          preset: [
            {
              deviceId: 'desktop',
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
