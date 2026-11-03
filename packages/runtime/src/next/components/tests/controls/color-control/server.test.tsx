import { Color } from '@makeswift/controls'
import { testPageControlPropRendering } from '../page-control-prop-rendering'
import { swatch, value, inlineValue, cacheData, toDataV0, toDataV1 } from './fixtures'

describe.each([
  {
    version: 0,
    toData: toDataV0,
  },
  {
    version: 1,
    toData: toDataV1,
  },
  {
    version: 2,
  },
])('color data v$version', ({ toData }) => {
  test.each([
    {
      value,
      swatch,
      defaultValue: 'rgb(255,0,0)',
    },
    {
      value,
      swatch: null,
      defaultValue: 'rgb(255,0,0)',
    },
  ])(`reading swatch $swatch from cache`, async ({ value, defaultValue, swatch }) => {
    await testPageControlPropRendering(Color({ defaultValue }), {
      toData,
      value,
      cacheData: cacheData(swatch),
    })
  })
})

describe('inline color data', () => {
  test('renders without reading a swatch', async () => {
    await testPageControlPropRendering(Color({ defaultValue: 'rgb(255,0,0)' }), {
      value: inlineValue,
    })
  })
})
