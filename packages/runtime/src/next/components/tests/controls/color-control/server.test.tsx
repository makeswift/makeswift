import { Color, ColorData } from '@makeswift/controls'
import { testPageControlPropRendering } from '../page-control-prop-rendering'
import { swatch, value, cacheData } from './fixtures'

describe.each([
  {
    version: 0,
    toData: (value: ColorData) => value,
  },
  {
    version: 1,
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
