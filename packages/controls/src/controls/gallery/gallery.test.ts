import { testDefinition, testResolveValue } from '../../testing/test-definition'

import { type DeserializedRecord } from '../../serialization'

import { unstable_Gallery, unstable_GalleryDefinition } from './gallery'

describe('unstable_Gallery', () => {
  describe('constructor', () => {
    test("definition's config type is derived from constructor's arguments", () => {
      unstable_Gallery({
        label: 'Product image',
        getOptions: () => ({
          options: [
            { id: 'a', thumbnailUrl: '/a.jpg', label: 'A', value: '/a.jpg' },
            { id: 'b', thumbnailUrl: '/b.jpg', label: 'B', value: '/b.jpg' },
          ],
        }),
      }).config satisfies {
        label?: string
        getOptions: () => {
          options: {
            id: string
            thumbnailUrl: string
            label?: string
            value: string
          }[]
        }
      }

      unstable_Gallery({
        label: 'Product image',
        getOptions: async () => ({
          options: [{ id: 'a', thumbnailUrl: '/a.jpg', value: '/a.jpg' }],
        }),
      }).config satisfies {
        label?: string
        getOptions: () => Promise<{
          options: { id: string; thumbnailUrl: string; value: string }[]
        }>
      }
    })

    test('disallows extraneous config properties', () => {
      unstable_Gallery({
        label: undefined,
        getOptions: () => ({ options: [] }),
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('resolveValue', () => {
    test('resolves to just the option value, not the whole option', () => {
      const def = unstable_Gallery({
        label: 'Product image',
        getOptions: () => ({
          options: [
            { id: 'a', thumbnailUrl: '/a.jpg', label: 'A', value: '/a.jpg' },
          ],
        }),
      })

      const resolved = def
        .resolveValue({
          id: 'a',
          thumbnailUrl: '/a.jpg',
          label: 'A',
          value: '/a.jpg',
        })
        .readStable()

      expect(resolved).toBe('/a.jpg')
    })
  })

  describe('round-trip', () => {
    test('deserialize → resolveValue preserves an arbitrary value (e.g. a SKU) as just the value, not the whole option', () => {
      const def = unstable_Gallery({
        label: 'Product image',
        getOptions: () => ({
          options: [
            {
              id: 'a',
              thumbnailUrl: '/a.jpg',
              label: 'A',
              value: { sku: 'ABC123' },
            },
          ],
        }),
      })

      const deserializedDef = unstable_GalleryDefinition.deserialize({
        type: unstable_GalleryDefinition.type,
        config: def.config,
      } as unknown as DeserializedRecord)

      const selected = {
        id: 'a',
        thumbnailUrl: '/a.jpg',
        label: 'A',
        value: { sku: 'ABC123' },
      }
      const data = deserializedDef.toData(selected)
      const resolved = deserializedDef.resolveValue(data).readStable()

      expect(resolved).toEqual({ sku: 'ABC123' })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: unstable_GalleryDefinition) {}
    const getOptions = () => ({
      options: [{ id: '1', thumbnailUrl: '/1.jpg', label: 'One', value: '1' }],
    })

    assignTest(unstable_Gallery({ label: 'Image', getOptions }))
    assignTest(unstable_Gallery({ label: undefined, getOptions }))
  })
})

describe.each([
  [
    unstable_Gallery({
      label: 'Product image',
      getOptions: () => ({
        options: [
          { id: 'a', thumbnailUrl: '/a.jpg', label: 'A', value: '/a.jpg' },
          { id: 'b', thumbnailUrl: '/b.jpg', label: 'B', value: '/b.jpg' },
        ],
      }),
    }),
    [
      { id: 'a', thumbnailUrl: '/a.jpg', label: 'A', value: '/a.jpg' },
      { id: 'b', thumbnailUrl: '/b.jpg', label: 'B', value: '/b.jpg' },
    ] as const,
  ],
])('unstable_Gallery', (def, values) => {
  const invalidValues = [null, 17, 'random', { swatchId: 42 }]
  testDefinition(def, values, invalidValues)
  testResolveValue(def, values)
})
