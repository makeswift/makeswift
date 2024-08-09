/** @jest-environment jsdom */
import { unstable_IconRadioGroup, unstable_IconRadioGroupIcon } from '@makeswift/controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'

describe('Page', () => {
  describe('IconRadioGroup control data', () => {
    test.each(['superscript', 'subscript', undefined] as const)(
      `resolves when value is %s`,
      async value => {
        await testPageControlPropRendering(
          unstable_IconRadioGroup({
            options: [
              {
                label: 'Subscript',
                value: 'subscript',
                icon: unstable_IconRadioGroupIcon.Subscript,
              },
              {
                label: 'Superscript',
                value: 'superscript',
                icon: unstable_IconRadioGroupIcon.Superscript,
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
      unstable_IconRadioGroup({
        options: [
          {
            label: 'Subscript',
            value: 'subscript',
            icon: unstable_IconRadioGroupIcon.Subscript,
          },
          {
            label: 'Superscript',
            value: 'superscript',
            icon: unstable_IconRadioGroupIcon.Superscript,
          },
        ],
        defaultValue: 'superscript',
      }),
      { value: undefined },
    )
  })
})
