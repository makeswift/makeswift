/** @jest-environment jsdom */
import { Font } from '@makeswift/controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'

describe('Page', () => {
  describe('Font control data', () => {
    test.each([
      [undefined, undefined],
      [{ fontFamily: 'comic sans', fontStyle: 'normal', fontWeight: 400 }, undefined],
      [
        undefined,
        {
          variant: true,
        },
      ],
      [
        { fontFamily: 'comic sans', fontStyle: 'normal', fontWeight: 400 },
        {
          variant: true,
        },
      ],
      [
        undefined,
        {
          variant: false,
        },
      ],
      [
        { fontFamily: 'comic sans' },
        {
          variant: false,
        },
      ],
    ] as const)(`resolves to %j when config === %j`, async (value, config) => {
      await testPageControlPropRendering(Font(config), { value })
    })
  })

  describe('Font control data', () => {
    test.each([
      {
        defaultValue: { fontFamily: 'comic sans', fontStyle: 'normal', fontWeight: 400 },
      },
      {
        variant: true,
        defaultValue: { fontFamily: 'comic sans', fontStyle: 'normal', fontWeight: 400 },
      },
      {
        variant: false,
        defaultValue: { fontFamily: 'comic sans' },
      },
    ] as const)(`resolves to defaultValue when config is %j`, async config => {
      await testPageControlPropRendering(Font(config), { value: undefined })
    })
  })
})
