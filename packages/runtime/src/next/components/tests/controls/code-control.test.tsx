/** @jest-environment jsdom */
import { Code } from '@makeswift/controls'
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
  ])('Code control data v$version', ({ toData }) => {
    test.each(['console.log("hello")', '<div>hi</div>', undefined])(
      `when value is %s`,
      async value => {
        await testPageControlPropRendering(Code(), { toData, value })
      },
    )
  })

  test(`when defaultValue is set`, async () => {
    await testPageControlPropRendering(Code({ defaultValue: 'fallback' }), {
      value: undefined,
    })
  })
})
