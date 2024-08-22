/** @jest-environment jsdom */
import { Checkbox, Color, Image, List, Shape } from '@makeswift/controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'
import { APIResourceType } from '../../../../api'

const swatchId = '[swatch-test-id]'
const fileId = '[file-test-id]'

describe('Page', () => {
  test('Shape (heterogenous properties)', async () => {
    await testPageControlPropRendering(
      Shape({
        type: {
          checkbox: Checkbox({ defaultValue: true }),
          color: Color({ defaultValue: 'rgb(255,0,0)' }),
          image: Image({ format: Image.Format.WithDimensions }),
          image2: Image({ format: Image.Format.URL }),
          list: List({
            type: Checkbox({ defaultValue: true }),
          }),
          shape: Shape({
            type: {
              checkbox: Checkbox({ defaultValue: true }),
            },
          }),
        },
      }),
      {
        value: {
          checkbox: true,
          color: { swatchId, alpha: 0.5 },
          image: {
            type: 'makeswift-file',
            id: fileId,
          },
          image2: {
            type: 'external-file',
            url: 'https://example.com/external-jpg.jpg',
            width: 100,
            height: 100,
          },
          list: [true],
          shape: {
            checkbox: true,
          },
        },
        cacheData: {
          Swatch: [
            {
              id: swatchId,
              value: {
                __typename: APIResourceType.Swatch,
                id: swatchId,
                hue: 238,
                saturation: 87,
                lightness: 49,
              },
            },
          ],
          File: [
            {
              id: fileId,
              value: {
                __typename: APIResourceType.File,
                id: fileId,
                publicUrl: 'https://example.com/image.png',
                name: 'image',
                extension: 'png',
                dimensions: {
                  width: 100,
                  height: 100,
                },
              },
            },
          ],
        },
        expectedRenders: 1,
      },
    )
  })
})
