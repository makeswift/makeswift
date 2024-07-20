/** @jest-environment jsdom */
import { Style } from '../../../../controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'

describe('Page', () => {
  describe('Style', () => {
    test(`renders a style`, async () => {
      await testPageControlPropRendering(Style(), {
        value: {
          width: [{ deviceId: 'desktop', value: { value: 80, unit: '%' } }],
          margin: [{ deviceId: 'desktop', value: { marginTop: { value: 4, unit: 'px' } } }],
        },
        expectedRenders: 1,
      })
    })
  })
})
