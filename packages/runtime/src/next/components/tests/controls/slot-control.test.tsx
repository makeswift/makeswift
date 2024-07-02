/** @jest-environment jsdom */
import { Slot } from '../../../../controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'
import { MakeswiftComponentType } from '../../../../components/builtin/constants'

describe('Page', () => {
  describe('Slot', () => {
    test(`renders a placeholder when empty`, async () => {
      await testPageControlPropRendering(Slot(), {
        value: { elements: [], columns: [] },
        expectedRenders: 1,
      })
    })

    test(`renders a slot with a button`, async () => {
      await testPageControlPropRendering(Slot(), {
        value: {
          elements: [
            {
              type: MakeswiftComponentType.Button,
              key: '22222222-2222-2222-2222-222222222222',
              props: {},
            },
          ],
          columns: [],
        },
        expectedRenders: 1,
      })
    })
  })
})
