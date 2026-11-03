import { noOpResourceResolver } from '../../testing/mocks/resource-resolver'
import { noOpStylesheet } from '../../testing/mocks/stylesheet'

import { ControlDataTypeKey } from '../../common'
import { createReplacementContext, type CopyContext } from '../../context'
import { Targets } from '../../introspection'
import { deserializeRecord, type SerializedRecord } from '../../serialization'

import { DataType, type ValueType } from '../associated-types'

import {
  unstable_Typography,
  unstable_TypographyDefinition,
} from './typography'

const swatchColor = {
  type: 'swatch' as const,
  swatchId: '[swatch-id-1]',
  alpha: 1,
}
const inlineColor = {
  type: 'inline' as const,
  hue: 240,
  saturation: 100,
  lightness: 50,
  alpha: 0.5,
}

const value = {
  id: '[typography-id]',
  style: [
    { deviceId: 'desktop', value: { fontWeight: 400, color: swatchColor } },
    { deviceId: 'tablet', value: { color: inlineColor } },
    { deviceId: 'mobile', value: { color: null } },
  ],
} satisfies ValueType<unstable_TypographyDefinition>

const swatchOnlyValue = {
  id: '[typography-id]',
  style: [
    { deviceId: 'desktop', value: { fontWeight: 400, color: swatchColor } },
    { deviceId: 'mobile', value: { color: null } },
  ],
} satisfies ValueType<unstable_TypographyDefinition>

const v0Data = {
  id: '[typography-id]',
  style: [
    {
      deviceId: 'desktop',
      value: {
        fontWeight: 400,
        color: { swatchId: '[swatch-id-1]', alpha: 1 },
      },
    },
    { deviceId: 'mobile', value: { color: null } },
  ],
}

const v0Definition = unstable_TypographyDefinition.deserialize(
  deserializeRecord({
    type: unstable_TypographyDefinition.type,
  } as any as SerializedRecord),
)

describe('Typography', () => {
  describe('constructor', () => {
    test('returns correct definition', () => {
      expect(unstable_Typography()).toMatchSnapshot()
    })

    test('disallows extraneous properties', () => {
      // @ts-expect-error
      unstable_Typography({
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: unstable_TypographyDefinition) {}
    assignTest(unstable_Typography())
  })

  describe('copyData', () => {
    test('returns `undefined` for `id` if typography ID is marked for removal', () => {
      const data: DataType<unstable_TypographyDefinition> = {
        id: 'typography-id',
        style: [
          {
            deviceId: 'desktop',
            value: {
              lineHeight: 1.5,
              color: { swatchId: 'swatch-id', alpha: 1 },
            },
          },
        ],
      }

      const typography = unstable_Typography()

      // Act
      const copy = typography.copyData(data, {
        replacementContext: createReplacementContext({
          typographyIds: { 'typography-id': null },
        }),
        copyElement: (el) => el,
      })

      // Assert
      expect(copy).toEqual({ ...data, id: undefined })
    })

    test('removes any swatch IDs marked for removal', () => {
      const data: DataType<unstable_TypographyDefinition> = {
        id: 'typography-id',
        style: [
          {
            deviceId: 'desktop',
            value: { color: { swatchId: 'swatch-id', alpha: 1 } },
          },
          {
            deviceId: 'tablet',
            value: { color: { swatchId: 'swatch-id-2', alpha: 1 } },
          },
          {
            deviceId: 'mobile',
            value: { color: { swatchId: 'swatch-id-3', alpha: 1 } },
          },
        ],
      }

      const typography = unstable_Typography()

      // Act
      const copy = typography.copyData(data, {
        replacementContext: createReplacementContext({
          swatchIds: {
            'swatch-id': null,
            'swatch-id-2': null,
          },
        }),
        copyElement: (el) => el,
      })

      // Assert
      expect(copy).toEqual({
        id: 'typography-id',
        style: [
          {
            deviceId: 'desktop',
            value: { color: { swatchId: null, alpha: 1 } },
          },
          {
            deviceId: 'tablet',
            value: { color: { swatchId: null, alpha: 1 } },
          },
          {
            deviceId: 'mobile',
            value: { color: { swatchId: 'swatch-id-3', alpha: 1 } },
          },
        ],
      })
    })
  })

  describe('data', () => {
    const definition = unstable_Typography()
    const data = { [ControlDataTypeKey]: 'typography::v1' as const, ...value }

    const context: CopyContext = {
      replacementContext: createReplacementContext({
        swatchIds: { '[swatch-id-1]': '[swatch-id-replaced]' },
      }),
      copyElement: (node) => node,
    }

    test('deserializes the definition version', () => {
      expect(v0Definition.version).toBeUndefined()
      expect(
        unstable_TypographyDefinition.deserialize(
          deserializeRecord({
            type: unstable_TypographyDefinition.type,
            version: 1,
          } as any as SerializedRecord),
        ).version,
      ).toBe(1)
    })

    test('toData writes v1 data', () => {
      expect(definition.toData(value)).toEqual(data)
    })

    test.each([
      [data, value],
      [v0Data, swatchOnlyValue],
    ])('fromData reads `%s`', (input, expected) => {
      expect(definition.fromData(input)).toEqual(expected)
    })

    test.each([
      [data, value],
      [v0Data, swatchOnlyValue],
    ])('toValue reads `%s`', (input, expected) => {
      expect(definition.toValue(input)).toEqual(expected)
    })

    test.each([data, v0Data])('safeParse accepts `%s`', (input) => {
      expect(definition.safeParse(input)).toEqual({
        success: true,
        data: input,
      })
    })

    test('safeParse refuses inline colors in v0 data', () => {
      expect(definition.safeParse(value)).toEqual({
        success: false,
        error: expect.any(String),
      })
    })

    test('unversioned definition writes v0 data', () => {
      expect(v0Definition.toData(swatchOnlyValue)).toEqual(v0Data)
    })

    test('unversioned definition throws for inline colors', () => {
      expect(() => v0Definition.toData(value)).toThrow(/Inline colors/)
    })

    test('copyData replaces swatches in v0 data', () => {
      expect(definition.copyData(v0Data, context)).toEqual({
        ...v0Data,
        style: [
          {
            deviceId: 'desktop',
            value: {
              fontWeight: 400,
              color: { swatchId: '[swatch-id-replaced]', alpha: 1 },
            },
          },
          { deviceId: 'mobile', value: { color: null } },
        ],
      })
    })

    test('copyData replaces swatches and leaves inline colors as is', () => {
      expect(definition.copyData(data, context)).toEqual({
        ...data,
        style: [
          {
            deviceId: 'desktop',
            value: {
              fontWeight: 400,
              color: { ...swatchColor, swatchId: '[swatch-id-replaced]' },
            },
          },
          { deviceId: 'tablet', value: { color: inlineColor } },
          { deviceId: 'mobile', value: { color: null } },
        ],
      })
    })

    test('copyData clears swatch IDs marked for removal in v1 data', () => {
      const copied = definition.copyData(data, {
        replacementContext: createReplacementContext({
          swatchIds: { '[swatch-id-1]': null },
        }),
        copyElement: (node) => node,
      })

      expect(copied?.style[0]?.value.color).toEqual({
        ...swatchColor,
        swatchId: null,
      })
    })

    test.each([data, v0Data])(
      'introspects only swatch IDs in `%s`',
      (input) => {
        expect(definition.introspect(input, Targets.Swatch)).toEqual([
          '[swatch-id-1]',
        ])
      },
    )

    test('resolves inline colors without a swatch', () => {
      const defineStyle = jest.fn(noOpStylesheet.defineStyle)
      const resolveSwatch = jest.fn(noOpResourceResolver.resolveSwatch)

      definition
        .resolveValue(
          data,
          { ...noOpResourceResolver, resolveSwatch },
          { ...noOpStylesheet, defineStyle },
        )
        .readStable()

      expect(resolveSwatch).toHaveBeenCalledTimes(1)
      expect(resolveSwatch).toHaveBeenCalledWith('[swatch-id-1]')
      expect(defineStyle).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            deviceId: 'tablet',
            value: {
              color: {
                swatch: { hue: 240, saturation: 100, lightness: 50 },
                alpha: 0.5,
              },
            },
          },
        ]),
      )
    })
  })
})
