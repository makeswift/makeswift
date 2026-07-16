import { expectTypeOf } from 'expect-type'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { unstable_Gallery } from './gallery'

describe('Gallery Types', () => {
  describe('infers types from control definition', () => {
    test('synchronous getOptions', () => {
      const def = unstable_Gallery({
        label: 'Product image',
        getOptions: () => ({
          options: [
            {
              id: 'a',
              thumbnailUrl: '/a.jpg',
              label: 'A',
              value: 'a' as const,
            },
            {
              id: 'b',
              thumbnailUrl: '/b.jpg',
              label: 'B',
              value: 'b' as const,
            },
          ],
        }),
      })

      // `label` is always passed in this test's options, so TS infers `Config['getOptions']`'s
      // return type with a required `label` — it's inferred bottom-up from the literal, not
      // from the nominal `GalleryOption<T>` type. `DataType`/`ValueType` resolve through that
      // nominal type instead, so they see `label` as optional regardless of what's passed here.
      type ConfigOptionItem = {
        id: string
        thumbnailUrl: string
        label: string
        value: 'a' | 'b'
      }
      type GalleryOptionItem = {
        id: string
        thumbnailUrl: string
        label?: string
        value: 'a' | 'b'
      }

      type Config = typeof def.config
      expectTypeOf<Config['getOptions']>().branded.toEqualTypeOf<
        () => { options: ConfigOptionItem[] }
      >()
      expectTypeOf<Config['label']>().toEqualTypeOf<string | undefined>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<GalleryOptionItem>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<GalleryOptionItem>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<'a' | 'b' | undefined>()
    })

    test('asynchronous getOptions', () => {
      const def = unstable_Gallery({
        label: 'Product image',
        getOptions: async () =>
          Promise.resolve({
            options: [
              {
                id: 'a',
                thumbnailUrl: '/a.jpg',
                label: 'A',
                value: 'a' as const,
              },
              {
                id: 'b',
                thumbnailUrl: '/b.jpg',
                label: 'B',
                value: 'b' as const,
              },
            ],
          }),
      })

      type ConfigOptionItem = {
        id: string
        thumbnailUrl: string
        label: string
        value: 'a' | 'b'
      }
      type GalleryOptionItem = {
        id: string
        thumbnailUrl: string
        label?: string
        value: 'a' | 'b'
      }

      type Config = typeof def.config
      expectTypeOf<Config['getOptions']>().branded.toEqualTypeOf<
        () => Promise<{ options: ConfigOptionItem[] }>
      >()
      expectTypeOf<Config['label']>().toEqualTypeOf<string | undefined>()

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<GalleryOptionItem>()

      type Value = ValueType<typeof def>
      expectTypeOf<Value>().toEqualTypeOf<GalleryOptionItem>()

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<'a' | 'b' | undefined>()
    })

    test('label is optional on each option, unlike Combobox', () => {
      const def = unstable_Gallery({
        getOptions: () => ({
          options: [{ id: 'a', thumbnailUrl: '/a.jpg', value: 'a' as const }],
        }),
      })

      type Data = DataType<typeof def>
      expectTypeOf<Data>().toEqualTypeOf<{
        id: string
        thumbnailUrl: string
        label?: string
        value: 'a'
      }>()
    })

    test('arbitrary object value type is inferred and resolved directly', () => {
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

      type Resolved = ResolvedValueType<typeof def>
      expectTypeOf<Resolved>().toEqualTypeOf<{ sku: string } | undefined>()
    })
  })
})
