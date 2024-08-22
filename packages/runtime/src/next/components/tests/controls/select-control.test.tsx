/** @jest-environment jsdom */
import { Select } from '@makeswift/controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'

describe('Page', () => {
  describe('Select control data', () => {
    test.each(['one', 'two', 'three', undefined] as const)(
      `resolves when value is %s`,
      async value => {
        await testPageControlPropRendering(
          Select({
            options: [
              { label: 'One', value: 'one' },
              { label: 'Two', value: 'two' },
              { label: 'Three', value: 'three' },
            ],
          }),
          { value },
        )
      },
    )
  })

  test(`resolves value when defaultValue is set`, async () => {
    await testPageControlPropRendering(
      Select({
        options: [
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
          { label: 'Three', value: 'three' },
        ],
        defaultValue: 'two',
      }),
      { value: undefined },
    )
  })
})
