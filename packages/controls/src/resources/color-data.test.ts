import { toColorDataV1, toColorDataV2 } from './color-data'

describe('color data', () => {
  test('toColorDataV2 converts swatch color data', () => {
    expect(toColorDataV2({ swatchId: 'swatch-id-1', alpha: 1 })).toEqual({
      type: 'swatch',
      swatchId: 'swatch-id-1',
      alpha: 1,
    })
  })

  test('toColorDataV1 converts swatch colors', () => {
    expect(
      toColorDataV1({ type: 'swatch', swatchId: 'swatch-id-1', alpha: 1 }),
    ).toEqual({ swatchId: 'swatch-id-1', alpha: 1 })
  })

  test('toColorDataV1 throws for inline colors', () => {
    expect(() =>
      toColorDataV1({
        type: 'inline',
        hue: 238,
        saturation: 87,
        lightness: 49,
        alpha: 0.5,
      }),
    ).toThrow(/Inline colors/)
  })
})
