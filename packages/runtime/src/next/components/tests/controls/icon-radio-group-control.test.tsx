/** @jest-environment jsdom */
import { IconRadioGroup } from '@makeswift/controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'

describe('Page', () => {
  describe('IconRadioGroup control data', () => {
    test.each(['superscript', 'subscript', undefined] as const)(
      `resolves when value is %s`,
      async value => {
        await testPageControlPropRendering(
          IconRadioGroup({
            options: [
              {
                label: 'Subscript',
                value: 'subscript',
                icon: IconRadioGroup.Icon.Subscript,
              },
              {
                label: 'Superscript',
                value: 'superscript',
                icon: IconRadioGroup.Icon.Superscript,
              },
            ],
          }),
          { value },
        )
      },
    )
  })

  test(`resolves value when defaultValue is set`, async () => {
    await testPageControlPropRendering(
      IconRadioGroup({
        options: [
          {
            label: 'Subscript',
            value: 'subscript',
            icon: IconRadioGroup.Icon.Subscript,
          },
          {
            label: 'Superscript',
            value: 'superscript',
            icon: IconRadioGroup.Icon.Superscript,
          },
        ],
        defaultValue: 'superscript',
      }),
      { value: undefined },
    )
  })
})
