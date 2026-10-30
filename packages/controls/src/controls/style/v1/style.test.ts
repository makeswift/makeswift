import { noOpResourceResolver } from '../../../testing/mocks/resource-resolver'
import { noOpStylesheet } from '../../../testing/mocks/stylesheet'

import { ControlDataTypeKey } from '../../../common'
import { createReplacementContext, type CopyContext } from '../../../context'
import { Targets } from '../../../introspection'
import {
  deserializeRecord,
  type SerializedRecord,
} from '../../../serialization'
import { type ValueType } from '../../associated-types'

import { Style, StyleDefinition } from './style'

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
  border: [
    {
      deviceId: 'desktop',
      value: {
        borderTop: { width: 1, style: 'solid' as const, color: swatchColor },
        borderRight: null,
        borderBottom: {
          width: 2,
          style: 'dashed' as const,
          color: inlineColor,
        },
        borderLeft: null,
      },
    },
  ],
} satisfies ValueType<StyleDefinition>

const swatchOnlyValue = {
  border: [
    {
      deviceId: 'desktop',
      value: {
        borderTop: { width: 1, style: 'solid' as const, color: swatchColor },
        borderRight: null,
        borderBottom: null,
        borderLeft: null,
      },
    },
  ],
} satisfies ValueType<StyleDefinition>

const v0Data = {
  border: [
    {
      deviceId: 'desktop',
      value: {
        ...swatchOnlyValue.border[0].value,
        borderTop: {
          width: 1,
          style: 'solid' as const,
          color: { swatchId: '[swatch-id-1]', alpha: 1 },
        },
      },
    },
  ],
}

const v0DataWithoutBorders = {
  width: [{ deviceId: 'desktop', value: { value: 100, unit: '%' as const } }],
}

const v0Definition = StyleDefinition.deserialize(
  deserializeRecord({
    type: StyleDefinition.type,
    config: { properties: Style.All },
  } as any as SerializedRecord),
)

describe('Style', () => {
  describe('constructor', () => {
    test('returns correct definition', () => {
      expect(Style()).toMatchSnapshot('default')
      expect(
        Style({ properties: [Style.Border, Style.Margin] }),
      ).toMatchSnapshot('border and margin')

      expect(Style({ properties: Style.All })).toMatchSnapshot('all')
    })

    test('disallows extraneous properties', () => {
      Style({
        properties: [Style.Border],
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: StyleDefinition) {}
    assignTest(Style())
    assignTest(Style({ properties: [Style.Border] }))
    assignTest(Style({ properties: [Style.Border, Style.Padding] }))
    assignTest(Style({ properties: Style.All }))
  })

  describe('data', () => {
    const definition = Style({ properties: Style.All })
    const data = { [ControlDataTypeKey]: 'style::v1' as const, ...value }

    test('deserializes the definition version', () => {
      expect(v0Definition.version).toBeUndefined()
      expect(
        StyleDefinition.deserialize(
          deserializeRecord({
            type: StyleDefinition.type,
            config: { properties: Style.All },
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

    test('fromData leaves v0 data without borders as is', () => {
      expect(definition.fromData(v0DataWithoutBorders)).toStrictEqual(
        v0DataWithoutBorders,
      )
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

    test('unversioned definition writes v0 data without borders as is', () => {
      expect(v0Definition.toData(v0DataWithoutBorders)).toStrictEqual(
        v0DataWithoutBorders,
      )
    })

    test('unversioned definition throws for inline colors', () => {
      expect(() => v0Definition.toData(value)).toThrow(/Inline colors/)
    })

    test('copyData replaces swatches in v0 data', () => {
      const context: CopyContext = {
        replacementContext: createReplacementContext({
          swatchIds: { '[swatch-id-1]': '[swatch-id-replaced]' },
        }),
        copyElement: (node) => node,
      }

      expect(definition.copyData(v0Data, context)).toEqual({
        border: [
          {
            deviceId: 'desktop',
            value: {
              ...v0Data.border[0].value,
              borderTop: {
                ...v0Data.border[0].value.borderTop,
                color: { swatchId: '[swatch-id-replaced]', alpha: 1 },
              },
            },
          },
        ],
      })
    })

    test('copyData replaces swatches and leaves inline colors as is', () => {
      const context: CopyContext = {
        replacementContext: createReplacementContext({
          swatchIds: { '[swatch-id-1]': '[swatch-id-replaced]' },
        }),
        copyElement: (node) => node,
      }

      const copied = definition.copyData(data, context)

      expect(copied).toEqual({
        ...data,
        border: [
          {
            deviceId: 'desktop',
            value: {
              ...data.border[0].value,
              borderTop: {
                ...data.border[0].value.borderTop,
                color: { ...swatchColor, swatchId: '[swatch-id-replaced]' },
              },
            },
          },
        ],
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

    test('introspects v0 data without borders', () => {
      expect(
        definition.introspect(v0DataWithoutBorders, Targets.Swatch),
      ).toEqual([])
    })

    test('resolves inline border colors without a swatch', () => {
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
        expect.objectContaining({
          styleData: expect.objectContaining({
            border: [
              expect.objectContaining({
                value: expect.objectContaining({
                  borderBottom: {
                    width: 2,
                    style: 'dashed',
                    color: {
                      swatch: { hue: 240, saturation: 100, lightness: 50 },
                      alpha: 0.5,
                    },
                  },
                }),
              }),
            ],
          }),
        }),
        expect.any(Function),
      )
      expect(defineStyle.mock.calls[0][0]).toHaveProperty('styleData')
      expect(
        (defineStyle.mock.calls[0][0] as { styleData: object }).styleData,
      ).not.toHaveProperty([ControlDataTypeKey])
    })
  })
})
