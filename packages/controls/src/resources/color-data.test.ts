import { toColorDataV2, toLegacyColorData } from './color-data'

describe('color data', () => {
  test('toColorDataV2 converts swatch color data', () => {
    expect(toColorDataV2({ swatchId: 'swatch-id-1', alpha: 1 })).toEqual({
      type: 'swatch',
      swatchId: 'swatch-id-1',
      alpha: 1,
    })
  })

  test('toColorData converts swatch colors', () => {
    expect(
      toLegacyColorData({ type: 'swatch', swatchId: 'swatch-id-1', alpha: 1 }),
    ).toEqual({ swatchId: 'swatch-id-1', alpha: 1 })
  })

  test('toColorData throws for inline colors', () => {
    expect(() =>
      toLegacyColorData({
        type: 'inline',
        hue: 238,
        saturation: 87,
        lightness: 49,
        alpha: 0.5,
      }),
    ).toThrow(/Inline colors/)
  })
})
