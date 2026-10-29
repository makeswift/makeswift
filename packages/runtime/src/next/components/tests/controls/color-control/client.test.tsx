/** @jest-environment jsdom */

import { Color } from '@makeswift/controls'
import { testPageControlPropRendering } from '../page-control-prop-rendering'
import { http, HttpResponse } from 'msw'
import { server } from '../../../../../mocks/server'
import { swatchId, swatch, value, inlineValue, cacheData, toDataV0, toDataV1 } from './fixtures'

const swatchesBaseUrl = `/api/makeswift/swatches`

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

describe('inline color data', () => {
  test('renders without fetching a swatch', async () => {
    await testPageControlPropRendering(Color({ defaultValue: 'rgb(255,0,0)' }), {
      value: inlineValue,
      expectedRenders: 1,
    })
  })
})
