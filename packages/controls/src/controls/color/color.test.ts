import { noOpResourceResolver } from '../../testing/mocks/resource-resolver'

import { ControlDataTypeKey } from '../../common'
import { createReplacementContext, type CopyContext } from '../../context'
import { Targets } from '../../introspection'
import { Swatch } from '../../resources'
import {
  type FetchableValue,
  type ResourceResolver,
} from '../../resources/resolver'
import { deserializeRecord, type SerializedRecord } from '../../serialization'

import { Color, ColorDefinition } from './color'

const colorResolver: ResourceResolver = {
  ...noOpResourceResolver,
  resolveSwatch(swatchId: string): FetchableValue<Swatch | null> {
    return {
      name: 'test-swatch',
      readStable: () => ({
        id: swatchId,
        hue: 0,
        saturation: 0,
        lightness: 0,
      }),
      subscribe: () => () => {},
      fetch: () => Promise.resolve(null),
    }
  },
}

const swatchValue = {
  type: 'swatch' as const,
  swatchId: '[swatch-id-1]',
  alpha: 0.5,
}
const inlineValue = {
  type: 'inline' as const,
  hue: 240,
  saturation: 100,
  lightness: 50,
  alpha: 0.5,
}

const v0Data = { swatchId: '[swatch-id-1]', alpha: 0.5 }
const v1Data = { [ControlDataTypeKey]: 'color::v1' as const, ...v0Data }
const v2SwatchData = {
  [ControlDataTypeKey]: 'color::v2' as const,
  ...swatchValue,
}
const v2InlineData = {
  [ControlDataTypeKey]: 'color::v2' as const,
  ...inlineValue,
}

const v0Definition = new ColorDefinition({}, undefined)
const v1Definition = new ColorDefinition({}, 1)

describe('Color', () => {
  describe('constructor', () => {
    test.each(['red', undefined])(
      'call with default value `%s` returns versioned definition',
      (value) => {
        expect(
          Color({
            label: 'color',
            defaultValue: value,
          }),
        ).toMatchSnapshot()
      },
    )

    test('disallows extraneous properties', () => {
      Color({
        label: 'background',
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: ColorDefinition) {}
    assignTest(Color({ label: 'background' }))
    assignTest(Color({ defaultValue: 'red' }))
    assignTest(Color({ defaultValue: { color: '#4f46e5', opacity: 0.25 } }))
    assignTest(Color({ label: 'background', labelOrientation: 'horizontal' }))
    assignTest(
      Color({
        label: 'background',
        labelOrientation: undefined,
        hideAlpha: true,
        defaultValue: '#fff' as string,
      }),
    )

    assignTest(
      Color({
        label: undefined,
        labelOrientation: undefined,
        hideAlpha: undefined,
        defaultValue: undefined,
      }),
    )
  })

  describe('deserialize', () => {
    const record = { type: ColorDefinition.type, config: { label: 'Color' } }

    test.each([undefined, 1, 2] as const)('preserves version %s', (version) => {
      const definition = ColorDefinition.deserialize(
        deserializeRecord({ ...record, version } as any as SerializedRecord),
      )

      expect(definition.version).toBe(version)
      expect(definition.config).toEqual(record.config)
    })

    test('rejects unknown versions', () => {
      expect(() =>
        ColorDefinition.deserialize(
          deserializeRecord({
            ...record,
            version: 3,
          } as any as SerializedRecord),
        ),
      ).toThrow()
    })
  })

  describe('safeParse', () => {
    test.each([undefined, v0Data, v1Data, v2SwatchData, v2InlineData])(
      'parses `%s`',
      (data) => {
        expect(Color().safeParse(data)).toEqual({ success: true, data })
      },
    )

    test.each([
      null,
      17,
      'text',
      { swatchId: 42 },
      { alpha: 1 },
      inlineValue,
      { [ControlDataTypeKey]: 'color::v2', ...v0Data },
      { [ControlDataTypeKey]: 'color::v2', type: 'inline', hue: 240, alpha: 1 },
    ])('refuses to parse `%s`', (data) => {
      expect(Color().safeParse(data)).toEqual({
        success: false,
        error: expect.any(String),
      })
    })
  })

  describe('fromData', () => {
    test.each([
      [v0Data, swatchValue],
      [v1Data, swatchValue],
      [v2SwatchData, swatchValue],
      [v2InlineData, inlineValue],
      [undefined, undefined],
    ])('`%s` returns `%s`', (data, value) => {
      expect(Color().fromData(data)).toEqual(value)
    })
  })

  describe('toData', () => {
    test.each([
      [swatchValue, v2SwatchData],
      [inlineValue, v2InlineData],
    ])('v2 definition writes `%s` as v2 data', (value, data) => {
      expect(Color().toData(value)).toEqual(data)
    })

    test('v1 definition writes v1 data', () => {
      expect(v1Definition.toData(swatchValue)).toEqual(v1Data)
    })

    test('unversioned definition writes v0 data', () => {
      expect(v0Definition.toData(swatchValue)).toEqual(v0Data)
    })

    test.each([
      ['v1', v1Definition],
      ['unversioned', v0Definition],
    ])('%s definition throws for inline values', (_, definition) => {
      expect(() => definition.toData(inlineValue)).toThrow(/Inline colors/)
    })
  })

  describe('copyData', () => {
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        swatchIds: {
          '[swatch-id-1]': '[swatch-id-replaced]',
          '[swatch-id-3]': null,
        },
      }),
      copyElement: (node) => node,
    }

    test.each([v0Data, v1Data, v2SwatchData])(
      'replaces `swatchId` found in replacement context in `%s`',
      (data) => {
        expect(Color().copyData(data, context)).toEqual({
          ...data,
          swatchId: '[swatch-id-replaced]',
        })
      },
    )

    test('does not replace `swatchId` not found in replacement context', () => {
      const data = { swatchId: '[swatch-id-2]', alpha: 1 }
      expect(Color().copyData(data, context)).toEqual(data)
    })

    test('returns `undefined` when swatch is marked for removal', () => {
      expect(
        Color().copyData({ swatchId: '[swatch-id-3]', alpha: 1 }, context),
      ).toBeUndefined()
    })

    test('returns inline data as is', () => {
      expect(Color().copyData(v2InlineData, context)).toEqual(v2InlineData)
    })

    test.each([null, undefined])('gracefully handles %s', (value) => {
      expect(Color().copyData(value as undefined, context)).toBe(value)
    })
  })

  describe('introspect swatch IDs', () => {
    test.each([v0Data, v1Data, v2SwatchData])(
      "returns `%s` data's `swatchId`",
      (data) => {
        expect(Color().introspect(data, Targets.Swatch)).toEqual([
          '[swatch-id-1]',
        ])
      },
    )

    test('returns no swatch IDs for inline data', () => {
      expect(Color().introspect(v2InlineData, Targets.Swatch)).toEqual([])
    })

    test.each([null, undefined])('gracefully handles %s', (value) => {
      expect(Color().introspect(value as undefined, Targets.Swatch)).toEqual([])
    })
  })

  describe('resolveValue', () => {
    test.each([v0Data, v1Data, v2SwatchData])('resolves `%s` data', (data) => {
      expect(
        Color({ label: 'Color' })
          .resolveValue(data, colorResolver)
          .readStable(),
      ).toBe('rgba(0, 0, 0, 0.5)')
    })

    test('resolves inline data, ignoring the default value', () => {
      expect(
        Color({ label: 'Color', defaultValue: 'red' })
          .resolveValue(v2InlineData, noOpResourceResolver)
          .readStable(),
      ).toBe('rgba(0, 0, 255, 0.5)')
    })

    test('resolves object defaultValue with opacity when no data', () => {
      expect(
        Color({
          label: 'Color',
          defaultValue: { color: '#4f46e5', opacity: 0.25 },
        })
          .resolveValue(undefined, noOpResourceResolver)
          .readStable(),
      ).toBe('rgba(79, 70, 229, 0.25)')
    })

    test('resolves string defaultValue when no data', () => {
      expect(
        Color({ label: 'Color', defaultValue: '#4f46e5' })
          .resolveValue(undefined, noOpResourceResolver)
          .readStable(),
      ).toBe('rgb(79, 70, 229)')
    })
  })

  describe('inline data', () => {
    test.each(['resolveValue', 'resolveSwatch'] as const)(
      '%s resolves without a swatch ID',
      (method) => {
        const resolveSwatch = jest.fn(noOpResourceResolver.resolveSwatch)
        Color()[method](v2InlineData, {
          ...noOpResourceResolver,
          resolveSwatch,
        })

        expect(resolveSwatch).toHaveBeenCalledWith(undefined)
      },
    )

    test('resolveSwatch resolves to `undefined`', () => {
      expect(
        Color().resolveSwatch(v2InlineData, noOpResourceResolver).readStable(),
      ).toBeUndefined()
    })
  })
})
