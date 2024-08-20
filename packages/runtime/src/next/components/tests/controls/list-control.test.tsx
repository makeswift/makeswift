/** @jest-environment jsdom */
import { List, Checkbox, Color } from '@makeswift/controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'
import { http, HttpResponse } from 'msw'
import { server } from '../../../../mocks/server'
import { APIResourceType } from '../../../../api'

const swatchesBaseUrl = `/api/makeswift/swatches`
const swatchId = '[swatch-test-id]'

describe('Page', () => {
  describe('List of checkboxes', () => {
    test.each([{ value: [true, false, undefined] }])(`when value is $value`, async ({ value }) => {
      await testPageControlPropRendering(List({ type: Checkbox() }), {
        value,
        expectedRenders: 1,
      })
    })
  })

  describe('List of colors', () => {
    test.each([
      {
        value: [
          {
            swatchId,
            alpha: 0.5,
          },
        ],
        swatch: {
          __typename: APIResourceType.Swatch,
          hue: 238,
          saturation: 87,
          lightness: 49,
        },
        defaultValue: 'rgb(255,0,0)',
      },
    ])(`when value is %j`, async ({ value, swatch, defaultValue }) => {
      server.use(
        http.get(`${swatchesBaseUrl}/${swatchId}`, () =>
          HttpResponse.json(swatch ? { id: swatchId, ...swatch } : null),
        ),
      )

      await testPageControlPropRendering(List({ type: Color({ defaultValue }) }), {
        value,
        expectedRenders: 2,
      })
    })
  })
})
