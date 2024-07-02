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
      toData: (value: boolean | undefined) => Checkbox().toData(value),
    },
  ])('Checkbox control data v$version', ({ toData }) => {
    test.each([true, false])(`when value is %s`, async value => {
      await testPageControlPropRendering(Checkbox(), { toData, value })
    })
  })
})
