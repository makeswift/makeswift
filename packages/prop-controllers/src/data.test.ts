import { getColorDataV2SwatchIds } from './data'

const inlineColor = {
  type: 'inline' as const,
  hue: 238,
  saturation: 87,
  lightness: 49,
  alpha: 0.5,
}

describe('color data', () => {
  test.each([
    [
      { type: 'swatch' as const, swatchId: 'swatch-id-1', alpha: 1 },
      ['swatch-id-1'],
    ],
    [{ type: 'swatch' as const, swatchId: null, alpha: 1 }, []],
    [inlineColor, []],
    [null, []],
    [undefined, []],
  ])('getColorDataV2SwatchIds(%s)', (color, expected) => {
    expect(getColorDataV2SwatchIds(color)).toEqual(expected)
  })
})
