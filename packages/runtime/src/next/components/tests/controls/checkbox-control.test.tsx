/** @jest-environment jsdom */
import { Checkbox } from '@makeswift/controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'

describe('Page', () => {
  describe.each([
    {
      version: 0,
      toData: (value: boolean | undefined) => value,
    },
    {
      version: 1,
    },
  ])('Checkbox control data v$version', ({ toData }) => {
    test.each([true, false, undefined])(`when value is %s`, async value => {
      await testPageControlPropRendering(Checkbox(), { toData, value })
    })
  })
})
