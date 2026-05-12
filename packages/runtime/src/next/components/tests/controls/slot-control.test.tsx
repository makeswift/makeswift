/** @jest-environment jsdom */
import { useState } from 'react'
import { fireEvent, screen } from '@testing-library/react'

import { Slot, TextInput } from '../../../../controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'
import { MakeswiftComponentType } from '../../../../components/builtin/constants'
import { ReactRuntime } from '../../../../runtimes/react/react-runtime'

function Button({ title }: { title: string }) {
  const [count, setCount] = useState(0)
  return (
    <button data-click-count={count} onClick={() => setCount(count + 1)}>
      {title}
    </button>
  )
}

describe('Page', () => {
  describe('Slot', () => {
    describe('placeholder rendering', () => {
      test(`renders a placeholder when empty slot is not in the builder`, async () => {
        await testPageControlPropRendering(Slot(), {
          value: { elements: [], columns: [] },
          expectedRenders: 1,
          isInBuilder: false,
        })
      })

      test(`renders a placeholder when empty slot is in the builder`, async () => {
        await testPageControlPropRendering(Slot(), {
          value: { elements: [], columns: [] },
          expectedRenders: 1,
          isInBuilder: true,
        })
      })

      describe('builderOnly config', () => {
        test(`shows placeholder when builderOnly is false and not in builder`, async () => {
          await testPageControlPropRendering(
            Slot({ unstable_placeholder: { builderOnly: false } }),
            {
              value: { elements: [], columns: [] },
              expectedRenders: 1,
              isInBuilder: false,
            },
          )
        })

        test(`shows placeholder when builderOnly is false and in builder`, async () => {
          await testPageControlPropRendering(
            Slot({ unstable_placeholder: { builderOnly: false } }),
            {
              value: { elements: [], columns: [] },
              expectedRenders: 1,
              isInBuilder: true,
            },
          )
        })

        test(`hides placeholder when builderOnly is true and not in builder`, async () => {
          await testPageControlPropRendering(
            Slot({ unstable_placeholder: { builderOnly: true } }),
            {
              value: { elements: [], columns: [] },
              expectedRenders: 1,
              isInBuilder: false,
            },
          )
        })

        test(`shows placeholder when builderOnly is true and in builder`, async () => {
          await testPageControlPropRendering(
            Slot({ unstable_placeholder: { builderOnly: true } }),
            {
              value: { elements: [], columns: [] },
              expectedRenders: 1,
              isInBuilder: true,
            },
          )
        })
      })
    })

    test(`renders a slot with a clickable button`, async () => {
      await testPageControlPropRendering(Slot(), {
        value: {
          elements: [
            {
              type: MakeswiftComponentType.Button,
              key: '22222222-2222-2222-2222-222222222222',
              props: {
                title: 'Click me',
              },
            },
          ],
          columns: [],
        },
        expectedRenders: 1,
        registerComponents: (runtime: ReactRuntime) => {
          runtime.registerComponent(Button, {
            type: MakeswiftComponentType.Button,
            label: 'Button',
            props: {
              title: TextInput({ defaultValue: 'Button' }),
            },
          })
        },
        action: async () => {
          const button = await screen.findByText<HTMLButtonElement>('Click me')
          fireEvent.click(button)
        },
      })
    })
  })
})
