import { createReplacementContext, type CopyContext } from '../context'

import {
  copyColorDataV1,
  copyColorDataV2,
  toColorDataV1,
  toColorDataV2,
} from './color-data'

const inlineColor = {
  type: 'inline' as const,
  hue: 238,
  saturation: 87,
  lightness: 49,
  alpha: 0.5,
}

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
    expect(() => toColorDataV1(inlineColor)).toThrow(/Inline colors/)
  })

  describe('copy', () => {
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        swatchIds: {
          '[swatch-id-1]': '[swatch-id-replaced]',
          '[swatch-id-3]': null,
        },
      }),
      copyElement: (node) => node,
    }

    const v2Swatch = (swatchId: string) => ({
      type: 'swatch' as const,
      swatchId,
      alpha: 1,
    })

    test('copyColorDataV1 replaces `swatchId` found in replacement context', () => {
      expect(
        copyColorDataV1({ swatchId: '[swatch-id-1]', alpha: 1 }, context),
      ).toEqual({ swatchId: '[swatch-id-replaced]', alpha: 1 })
    })

    test('copyColorDataV1 does not replace `swatchId` not found in replacement context', () => {
      const color = { swatchId: '[swatch-id-2]', alpha: 1 }
      expect(copyColorDataV1(color, context)).toEqual(color)
    })

    test('copyColorDataV1 returns `undefined` when swatch is marked for removal', () => {
      expect(
        copyColorDataV1({ swatchId: '[swatch-id-3]', alpha: 1 }, context),
      ).toBeUndefined()
    })

    test('copyColorDataV2 replaces `swatchId` found in replacement context', () => {
      expect(copyColorDataV2(v2Swatch('[swatch-id-1]'), context)).toEqual(
        v2Swatch('[swatch-id-replaced]'),
      )
    })

    test('copyColorDataV2 does not replace `swatchId` not found in replacement context', () => {
      const color = v2Swatch('[swatch-id-2]')
      expect(copyColorDataV2(color, context)).toEqual(color)
    })

    test('copyColorDataV2 returns `undefined` when swatch is marked for removal', () => {
      expect(
        copyColorDataV2(v2Swatch('[swatch-id-3]'), context),
      ).toBeUndefined()
    })

    test('copyColorDataV2 returns inline colors as is', () => {
      expect(copyColorDataV2(inlineColor, context)).toEqual(inlineColor)
    })
  })
})
