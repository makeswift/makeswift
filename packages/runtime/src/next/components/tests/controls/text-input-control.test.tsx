/** @jest-environment jsdom */
import { TextInput } from '@makeswift/controls'
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
  ])('TextInput control data v$version', ({ toData }) => {
    test.each(['The Blueprint', undefined])(`when value is %s`, async value => {
      await testPageControlPropRendering(TextInput(), { toData, value })
    })
  })

  test(`when defaultValue is set`, async () => {
    await testPageControlPropRendering(TextInput({ defaultValue: 'Magna Carta Holy Grail' }), {
      value: undefined,
    })
  })
})
