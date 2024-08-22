/** @jest-environment jsdom */
import { useState, forwardRef } from 'react'
import { fireEvent, screen } from '@testing-library/react'

import { Slot, TextInput } from '../../../../controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'
import { MakeswiftComponentType } from '../../../../components/builtin/constants'
import { ReactRuntime } from '../../../../react'

const Button = forwardRef(function Button({ title }: { title: string }, _ref) {
  const [count, setCount] = useState(0)
  return (
    <button data-click-count={count} onClick={() => setCount(count + 1)}>
      {title}
    </button>
  )
})

describe('Page', () => {
  describe('Slot', () => {
    test(`renders a placeholder when empty`, async () => {
      await testPageControlPropRendering(Slot(), {
        value: { elements: [], columns: [] },
        expectedRenders: 1,
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
