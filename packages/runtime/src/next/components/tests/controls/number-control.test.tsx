/** @jest-environment jsdom */
import { Number } from '@makeswift/controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'

describe('Page', () => {
  describe.each([
    {
      version: 0,
      toData: (value: number | undefined) => value,
    },
    {
      version: 1,
    },
  ])('Number control data v$version', ({ toData }) => {
    test.each([42, undefined])(`when value is %s`, async value => {
      await testPageControlPropRendering(Number(), { toData, value })
    })
  })

  test(`when defaultValue is set`, async () => {
    await testPageControlPropRendering(Number({ defaultValue: 23 }), { value: undefined })
  })
})
