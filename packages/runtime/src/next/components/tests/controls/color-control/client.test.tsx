/** @jest-environment jsdom */

import { Color, ColorData } from '@makeswift/controls'
import { testPageControlPropRendering } from '../page-control-prop-rendering'
import { http, HttpResponse } from 'msw'
import { server } from '../../../../../mocks/server'
import { swatchId, swatch, value, cacheData } from './fixtures'

const swatchesBaseUrl = `/api/makeswift/swatches`

describe.each([
  {
    version: 0,
    toData: (value: ColorData) => value,
  },
  {
    version: 1,
  },
])('color data v$version', ({ toData }) => {
  describe.each([
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
  ])(`with swatch $swatch`, ({ value, defaultValue, swatch }) => {
    test(`fetching swatch`, async () => {
      server.use(
        http.get(`${swatchesBaseUrl}/${swatchId}`, () =>
          HttpResponse.json(swatch ? { id: swatchId, ...swatch } : null),
        ),
      )

      await testPageControlPropRendering(Color({ defaultValue }), {
        toData,
        value,
        expectedRenders: swatch == null ? 1 : 2,
      })
    })

    test(`reading swatch from cache`, async () => {
      await testPageControlPropRendering(Color({ defaultValue }), {
        toData,
        value,
        cacheData: cacheData(swatch),
        expectedRenders: 1,
      })
    })
  })
})
