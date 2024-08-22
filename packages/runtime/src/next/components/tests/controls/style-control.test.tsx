/** @jest-environment jsdom */
import { Style, TextInput } from '../../../../controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'
import { MakeswiftComponentType } from '../../../../components/builtin/constants'
import { ReactRuntime } from '../../../../react'

function Button({ className, title }: { className: string; title: string }) {
  return <button className={className}>{title}</button>
}

describe('Page', () => {
  describe('Style', () => {
    test(`renders a style`, async () => {
      await testPageControlPropRendering(Style(), {
        value: {
          width: [{ deviceId: 'desktop', value: { value: 80, unit: '%' } }],
          margin: [
            {
              deviceId: 'desktop',
              value: {
                marginTop: { value: 4, unit: 'px' },
                marginLeft: undefined,
                marginRight: undefined,
                marginBottom: undefined,
              },
            },
          ],
        },
        expectedRenders: 1,
        registerComponents: (runtime: ReactRuntime) => {
          runtime.registerComponent(Button, {
            type: MakeswiftComponentType.Button,
            label: 'Button',
            props: {
              className: Style(),
              title: TextInput({ defaultValue: 'Button' }),
            },
          })
        },
      })
    })
  })
})
