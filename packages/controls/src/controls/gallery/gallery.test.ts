import { testDefinition, testResolveValue } from '../../testing/test-definition'

import { type ResolvedValueType, type ValueType } from '../associated-types'

import { unstable_Gallery, unstable_GalleryDefinition } from './gallery'

describe('unstable_Gallery', () => {
  describe('constructor', () => {
    test("definition's config type is derived from constructor's arguments", () => {
      unstable_Gallery({
        label: 'Product image',
        getOptions: () => ({
          options: [
            { id: 'a', src: '/a.jpg', label: 'A' },
            { id: 'b', src: '/b.jpg', label: 'B' },
          ],
        }),
      }).config satisfies {
        label?: string
        getOptions: () => { options: { id: string; src: string; label?: string }[] }
      }

      unstable_Gallery({
        label: 'Product image',
        getOptions: async () => ({
          options: [{ id: 'a', src: '/a.jpg' }],
        }),
      }).config satisfies {
        label?: string
        getOptions: () => Promise<{ options: { id: string; src: string }[] }>
      }
    })

    test('preserves extra option fields at the type level', () => {
      const def = unstable_Gallery({
        getOptions: () => ({
          options: [{ id: 'a', src: '/a.jpg', sku: 'SKU-A' }],
        }),
      })

      const value: { id: string; src: string; sku: string } | undefined = {
        id: 'a',
        src: '/a.jpg',
        sku: 'SKU-A',
      } as ValueType<typeof def>

      const resolved: { id: string; src: string; sku: string } | undefined = def
        .resolveValue({ id: 'a', src: '/a.jpg', sku: 'SKU-A' })
        .readStable() as ResolvedValueType<typeof def>

      expect(value).toMatchSnapshot()
      expect(resolved).toMatchSnapshot()
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

  describe('assignability', () => {
    function assignTest(_def: unstable_GalleryDefinition) {}
    const getOptions = () => ({
      options: [{ id: '1', src: '/1.jpg', label: 'One' }],
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
          { id: 'a', src: '/a.jpg', label: 'A' },
          { id: 'b', src: '/b.jpg', label: 'B' },
        ],
      }),
    }),
    [
      { id: 'a', src: '/a.jpg', label: 'A' },
      { id: 'b', src: '/b.jpg', label: 'B', sku: 'SKU-B' },
    ] as const,
  ],
])('unstable_Gallery', (def, values) => {
  const invalidValues = [null, 17, 'random', { swatchId: 42 }]
  testDefinition(def, values, invalidValues)
  testResolveValue(def, values)
})
