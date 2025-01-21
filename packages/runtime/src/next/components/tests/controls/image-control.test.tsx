/** @jest-environment jsdom */

import { Image } from '@makeswift/controls'
import { testPageControlPropRendering } from './page-control-prop-rendering'
import { http, HttpResponse } from 'msw'
import { server } from '../../../../mocks/server'
import { APIResourceType } from '../../../../api'

const imageId = 'image-test-id'

const filesBaseUrl = `/api/makeswift/files`

const fileResource = {
  __typename: APIResourceType.File,
  id: imageId,
  name: 'image',
  extension: 'jpg',
  publicUrl: 'https://example.com/image.jpg',
  dimensions: {
    width: 100,
    height: 100,
  },
}

describe('Page', () => {
  describe('Image control data v0', () => {
    describe.each([Image.Format.URL, Image.Format.WithDimensions, undefined])(
      `with format: %s`,
      format => {
        test(`fetching image`, async () => {
          server.use(http.get(`${filesBaseUrl}/${imageId}`, () => HttpResponse.json(fileResource)))
          await testPageControlPropRendering(Image({ format }), {
            value: {
              type: 'makeswift-file',
              id: imageId,
            },
            expectedRenders: 2,
            toData: val => ('id' in val ? val.id : 'undefined'),
          })
        })

        test(`reading file from cache`, async () => {
          server.use(http.get(`${filesBaseUrl}/${imageId}`, () => HttpResponse.json(fileResource)))
          await testPageControlPropRendering(Image({ format }), {
            value: {
              type: 'makeswift-file',
              id: imageId,
            },
            expectedRenders: 1,
            cacheData: {
              apiResources: {
                File: [{ id: imageId, value: fileResource }],
              },
            },
            toData: val => ('id' in val ? val.id : 'undefined'),
          })
        })
      },
    )
  })

  describe('ImageDefinition v1 reading v0 data', () => {
    describe.each([Image.Format.URL, Image.Format.WithDimensions, undefined])(
      `with format: %s`,
      format => {
        test(`fetching image`, async () => {
          server.use(http.get(`${filesBaseUrl}/${imageId}`, () => HttpResponse.json(fileResource)))
          await testPageControlPropRendering(Image({ format }), {
            value: {
              type: 'makeswift-file',
              id: imageId,
            },
            expectedRenders: 2,
          })
        })

        test(`reading file from cache`, async () => {
          server.use(http.get(`${filesBaseUrl}/${imageId}`, () => HttpResponse.json(fileResource)))
          await testPageControlPropRendering(Image({ format }), {
            value: {
              type: 'makeswift-file',
              id: imageId,
            },
            expectedRenders: 1,
            cacheData: {
              apiResources: {
                File: [{ id: imageId, value: fileResource }],
              },
            },
          })
        })
      },
    )
  })

  describe('Image control data v1', () => {
    describe.each([
      {
        value: {
          type: 'makeswift-file',
          id: imageId,
        } as const,
      },
    ])(`with value: $value`, ({ value }) => {
      describe.each([Image.Format.URL, Image.Format.WithDimensions, undefined])(
        `with format: %s`,
        format => {
          test(`fetching image`, async () => {
            server.use(
              http.get(`${filesBaseUrl}/${value.id}`, () => HttpResponse.json(fileResource)),
            )
            await testPageControlPropRendering(Image({ format }), {
              value,
              expectedRenders: 2,
            })
          })

          test(`reading file from cache`, async () => {
            server.use(
              http.get(`${filesBaseUrl}/${value.id}`, () => HttpResponse.json(fileResource)),
            )
            await testPageControlPropRendering(Image({ format }), {
              value,
              expectedRenders: 1,
              cacheData: {
                apiResources: {
                  File: [{ id: value.id, value: fileResource }],
                },
              },
            })
          })
        },
      )
    })
  })

  describe('Image control data v1 (external image)', () => {
    describe.each([
      {
        value: {
          type: 'external-file',
          url: 'https://example.com/image.jpg',
          width: 100,
          height: 100,
        } as const,
      },
    ])(`with value: $value`, ({ value }) => {
      describe.each([Image.Format.URL, Image.Format.WithDimensions, undefined])(
        `with format: %s`,
        format => {
          test(`rendering external image`, async () => {
            await testPageControlPropRendering(Image({ format }), {
              value,
              expectedRenders: 1,
            })
          })
        },
      )
    })
  })
})
