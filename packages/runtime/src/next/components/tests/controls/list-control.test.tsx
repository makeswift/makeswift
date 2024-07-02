/** @jest-environment jsdom */

import { Color, ColorData } from '@makeswift/controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'
import { http, HttpResponse } from 'msw'
import { server } from '../../../../mocks/server'
import { APIResourceType } from '../../../../api'

const swatchesBaseUrl = `/api/makeswift/swatches`

describe('Page', () => {
  describe.each([
    // {
    //   version: 0,
    //   toData: (value: ColorData) => value,
    // },
    {
      version: 1,
      toData: (value: ColorData) => Color.toData(value, Color()),
    },
  ])('List control data v$version', ({ toData }) => {
    const swatchId = '[swatch-test-id]'

    describe.each([
      {
        value: {
          swatchId,
          alpha: 0.5,
        },
        swatch: {
          __typename: APIResourceType.Swatch,
          hue: 238,
          saturation: 87,
          lightness: 49,
        },
        defaultValue: 'rgb(255,0,0)',
      },
      // {
      //   value: {
      //     swatchId,
      //     alpha: 0.5,
      //   },
      //   swatch: null,
      //   defaultValue: 'rgb(255,0,0)',
      // },
    ])(
      `with value: $value, swatch: $swatch, default value: $defaultValue`,
      ({ value, defaultValue, swatch }) => {
        test(`fetching swatch`, async () => {
          server.use(
            http.get(`${swatchesBaseUrl}/${swatchId}`, () =>
              HttpResponse.json(swatch ? { id: swatchId, ...swatch } : null),
            ),
          )

          await testPageControlPropRendering(Color, Color({ defaultValue }), {
            toData,
            value,
            expectedRenders: swatch == null ? 1 : 2,
          })
        })

        test.skip(`reading swatch from cache`, async () => {
          await testPageControlPropRendering(Color, Color({ defaultValue }), {
            toData,
            value,
            cacheData: {
              Swatch: [
                { id: swatchId, value: swatch == null ? null : { id: swatchId, ...swatch } },
              ],
            },
            expectedRenders: 1,
          })
        })
      },
    )
  })
})
