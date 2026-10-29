import { APIResourceType, type Swatch } from '../../api'
import { colorToString } from './colorToString'
import { resolveColor } from './resolveColor'

const swatch: Swatch = {
  __typename: APIResourceType.Swatch,
  id: '[swatch-id]',
  hue: 238,
  saturation: 87,
  lightness: 49,
}

describe('resolveColor', () => {
  test('resolves a swatch color', () => {
    expect(
      resolveColor({ type: 'swatch', swatchId: swatch.id, alpha: 0.5 }, [null, swatch]),
    ).toEqual({
      swatch,
      alpha: 0.5,
    })
  })

  test('resolves a missing swatch to `undefined`', () => {
    expect(resolveColor({ type: 'swatch', swatchId: '[missing]', alpha: 0.5 }, [swatch])).toEqual({
      swatch: undefined,
      alpha: 0.5,
    })
  })

  test('resolves an inline color without swatches', () => {
    const color = resolveColor(
      { type: 'inline', hue: 238, saturation: 87, lightness: 49, alpha: 0.5 },
      [],
    )

    expect(color).toEqual({ swatch: { hue: 238, saturation: 87, lightness: 49 }, alpha: 0.5 })
    expect(colorToString(color)).toBe('hsla(238,87%,49%,0.5)')
  })
})
