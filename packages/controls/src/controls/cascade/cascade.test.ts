import { noOpResourceResolver } from '../../testing/mocks/resource-resolver'
import { noOpStylesheet } from '../../testing/mocks/stylesheet'

import { CascadeDefinition, unstable_Cascade } from './cascade'

type Product = { id: string; name: string }

function productImageDef() {
  return unstable_Cascade({
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
          options: [] as { id: string; image: string; text?: string }[],
        }),
      },
    ],
  })
}

const fullSelection = {
  product: { id: 'p1', value: { id: 'p1', name: 'Shirt' }, label: 'Shirt' },
  image: { id: 'i9', image: 'https://cdn/x.jpg', text: 'front' },
}

describe('Cascade', () => {
  describe('safeParse', () => {
    test('parses a full keyed selection', () => {
      const def = productImageDef()
      expect(def.safeParse(fullSelection)).toEqual({
        success: true,
        data: fullSelection,
      })
    })

    test('parses a partial selection (product only)', () => {
      const def = productImageDef()
      const partial = { product: fullSelection.product }
      expect(def.safeParse(partial)).toEqual({ success: true, data: partial })
    })

    test('parses undefined', () => {
      const def = productImageDef()
      expect(def.safeParse(undefined)).toEqual({
        success: true,
        data: undefined,
      })
    })

    test.each([null, 17, 'nope', { product: { id: 'p1' } }])(
      'refuses invalid input `%s`',
      (invalid) => {
        const def = productImageDef()
        expect(def.safeParse(invalid)).toEqual({
          success: false,
          error: expect.any(String),
        })
      },
    )
  })

  describe('fromData / toData', () => {
    test('round-trips identity', () => {
      const def = productImageDef()
      expect(def.toData(fullSelection)).toEqual(fullSelection)
      expect(def.fromData(fullSelection)).toEqual(fullSelection)
    })
  })

  describe('resolveValue', () => {
    test('resolves to the last stage selection (the full image option)', () => {
      const def = productImageDef()
      const resolved = def
        .resolveValue(fullSelection, noOpResourceResolver, noOpStylesheet)
        .readStable()
      expect(resolved).toEqual({
        id: 'i9',
        image: 'https://cdn/x.jpg',
        text: 'front',
      })
    })

    test('resolves to undefined when the last stage is unselected', () => {
      const def = productImageDef()
      const resolved = def
        .resolveValue(
          { product: fullSelection.product },
          noOpResourceResolver,
          noOpStylesheet,
        )
        .readStable()
      expect(resolved).toBeUndefined()
    })

    test('resolves undefined data to undefined', () => {
      const def = productImageDef()
      expect(
        def
          .resolveValue(undefined, noOpResourceResolver, noOpStylesheet)
          .readStable(),
      ).toBeUndefined()
    })

    // Regression: readStable feeds useSyncExternalStore, so it must be
    // referentially stable across calls for unchanged data or the consumer loops.
    test('readStable is referentially stable across calls (full selection)', () => {
      const def = productImageDef()
      const resolvable = def.resolveValue(
        fullSelection,
        noOpResourceResolver,
        noOpStylesheet,
      )
      expect(resolvable.readStable()).toBe(resolvable.readStable())
    })

    test('readStable is referentially stable with only the first stage selected (the loop trigger)', () => {
      const def = productImageDef()
      const resolvable = def.resolveValue(
        { product: fullSelection.product },
        noOpResourceResolver,
        noOpStylesheet,
      )
      // Both undefined (last stage unselected) — stable, no loop.
      expect(resolvable.readStable()).toBe(resolvable.readStable())
    })

    test('resolves a combobox terminal stage to its full option object (not the bare value)', () => {
      const def = unstable_Cascade({
        label: 'Category',
        stages: [
          {
            key: 'category',
            display: 'combobox',
            getOptions: (_query: string) =>
              [] as { id: string; value: Product; label: string }[],
          },
        ],
      })
      const selection = {
        category: {
          id: 'c1',
          value: { id: 'c1', name: 'Shoes' },
          label: 'Shoes',
        },
      }
      const resolved = def
        .resolveValue(selection, noOpResourceResolver, noOpStylesheet)
        .readStable()
      expect(resolved).toEqual({
        id: 'c1',
        value: { id: 'c1', name: 'Shoes' },
        label: 'Shoes',
      })
    })
  })

  describe('copyData', () => {
    test('is identity (no file-resource machinery)', () => {
      const def = productImageDef()
      const ctx = {} as any
      expect(def.copyData(fullSelection, ctx)).toEqual(fullSelection)
      expect(def.copyData(undefined, ctx)).toBeUndefined()
    })
  })
})

describe('Cascade deserialize', () => {
  test('round-trips type and stages from a v0 record', () => {
    const def = unstable_Cascade({
      label: 'Product image',
      stages: [
        {
          key: 'product',
          display: 'combobox',
          getOptions: (_q: string) =>
            [] as { id: string; value: Product; label: string }[],
        },
        {
          key: 'image',
          display: 'images',
          getOptions: async () => ({ options: [] as any[] }),
        },
      ],
    })

    const record = { type: CascadeDefinition.type, config: def.config }
    const roundTripped = CascadeDefinition.deserialize(record as any)

    expect(roundTripped).toBeInstanceOf(CascadeDefinition)
    expect(roundTripped.controlType).toBe('makeswift::controls::cascade')
    expect(roundTripped.config.stages).toHaveLength(2)
    expect(roundTripped.config.stages[1].key).toBe('image')
    expect(typeof roundTripped.config.stages[0].getOptions).toBe('function')
  })

  test('throws on a mismatched type', () => {
    expect(() =>
      CascadeDefinition.deserialize({
        type: 'makeswift::controls::combobox',
        config: {},
      } as any),
    ).toThrow(/expected type makeswift::controls::cascade/)
  })
})
