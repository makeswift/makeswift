/** @jest-environment jsdom */
import { TextArea } from '@makeswift/controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'

describe('Page', () => {
  describe.each([
    {
      version: 0,
      toData: (value: string | undefined) => value,
    },
    {
      version: 1,
    },
  ])('TextArea control data v$version', ({ toData }) => {
    test.each(['The Prizoner of Azkaban', undefined])(`when value is %s`, async value => {
      await testPageControlPropRendering(TextArea(), { toData, value })
    })
  })

  test(`when defaultValue is set`, async () => {
    await testPageControlPropRendering(TextArea({ defaultValue: 'The Deathly Hallows' }), {
      value: undefined,
    })
  })
})
