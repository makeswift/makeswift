import { expectTypeOf } from 'expect-type'

import {
  type DataType,
  type ResolvedValueType,
  type ValueType,
} from '../associated-types'

import { unstable_Cascade } from './cascade'

describe('Cascade Types', () => {
  type Product = { id: string; name: string }
  type ImageOpt = { id: string; image: string; text?: string }

  const def = unstable_Cascade({
    label: 'Product image',
    stages: [
      {
        key: 'product',
        display: 'combobox',
        getOptions: (_query: string) =>
          [] as { id: string; value: Product; label: string }[],
      },
      {
        key: 'image',
        display: 'images',
        getOptions: async (_ctx) => ({
          options: [] as ImageOpt[],
        }),
      },
    ],
  })

  test('data preserves the full stored option per stage', () => {
    type Data = DataType<typeof def>
    expectTypeOf<Data>().toEqualTypeOf<{
      product?: { id: string; value: Product; label: string }
      image?: ImageOpt
    }>()
  })

  test('value equals data (identity)', () => {
    type Value = ValueType<typeof def>
    expectTypeOf<Value>().toEqualTypeOf<DataType<typeof def>>()
  })

  test('resolves to the last stage option object (the image)', () => {
    type Resolved = ResolvedValueType<typeof def>
    expectTypeOf<Resolved>().toEqualTypeOf<ImageOpt | undefined>()
  })

  test('image stage preserves extra option fields in Data/Resolved types', () => {
    // Regression: StoredStage must infer the image option structurally so extra
    // fields like `sku` survive (not collapse to bare ImageOption).
    type RichImageOpt = {
      id: string
      image: string
      text?: string
      sku: string
    }

    const richDef = unstable_Cascade({
      label: 'Product image',
      stages: [
        {
          key: 'product',
          display: 'combobox',
          getOptions: (_query: string) =>
            [] as { id: string; value: Product; label: string }[],
        },
        {
          key: 'image',
          display: 'images',
          getOptions: async (_ctx) => ({
            options: [] as RichImageOpt[],
          }),
        },
      ],
    })

    type RichData = DataType<typeof richDef>
    expectTypeOf<RichData>().toEqualTypeOf<{
      product?: { id: string; value: Product; label: string }
      image?: RichImageOpt
    }>()

    type RichResolved = ResolvedValueType<typeof richDef>
    expectTypeOf<RichResolved>().toEqualTypeOf<RichImageOpt | undefined>()
  })
})
