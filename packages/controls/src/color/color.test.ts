import { Color } from './color'
import { testDefinition } from '../tests/test-definition'

import { type CopyContext, createReplacementContext } from '../context'
import { type ValueType, ControlDefinition } from '../control-definition'
import { Targets } from '../introspect'
import { ControlDataTypeKey } from '../common'
import { noOpEffector } from '../effector'
import { noOpResourceResolver } from '../tests/mocks'
import { FetchableValue, ResourceResolver } from '../resource-resolver'
import { Swatch } from '../resources'

export const colorResolver: ResourceResolver = {
  ...noOpResourceResolver,
  resolveSwatch(swatchId: string): FetchableValue<Swatch | null> {
    return {
      readStableValue: () => ({
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

function testColorDefinition<Def extends ControlDefinition>(
  definition: Def,
  values: ValueType<Def>[],
  invalidValues: unknown[],
) {
  testDefinition(definition, values, invalidValues)

  describe('copyData', () => {
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        swatchIds: { '[swatch-id-1]': '[swatch-id-replaced]' },
      }),
      copyElement: (node) => node,
    }

    test('replaces `swatchId` found in replacement context', () => {
      // Act
      const result = definition.copyData(
        { swatchId: '[swatch-id-1]', alpha: 0.75 },
        context,
      )

      // Assert
      expect(result).toEqual({ swatchId: '[swatch-id-replaced]', alpha: 0.75 })
    })

    test('does not replace `swatchId` not found in replacement context', () => {
      // Act
      const result = definition.copyData(
        { swatchId: '[swatch-id-2]', alpha: 1 },
        context,
      )

      // Assert
      expect(result).toEqual({ swatchId: '[swatch-id-2]', alpha: 1 })
    })

    test.each([null, undefined])('gracefully handles %s', (value) => {
      expect(definition.copyData(value, context)).toBe(value)
    })
  })

  describe('introspect swatch IDs', () => {
    test("returns data's `swatchId`", () => {
      expect(
        definition.introspect({ swatchId: '[swatch-id-2]' }, Targets.Swatch),
      ).toEqual(['[swatch-id-2]'])
    })

    test.each([null, undefined])('gracefully handles %s', (value) => {
      expect(definition.introspect(value, Targets.Swatch)).toEqual([])
    })
  })
}

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
  })

  describe('resolveValue', () => {
    test('resolves v0 data', () => {
      const data = {
        swatchId: '[swatch-id-1]',
        alpha: 0.5,
      }
      expect(
        Color({ label: 'Color' })
          .resolveValue(data, colorResolver, noOpEffector)
          .readStableValue(),
      ).toBe('rgba(0, 0, 0, 0.5)')
    })

    test('resolves v1 data', () => {
      const data = {
        [ControlDataTypeKey]: 'color::v1' as const,
        swatchId: '[swatch-id-1]',
        alpha: 0.5,
      }
      expect(
        Color({ label: 'Color' })
          .resolveValue(data, colorResolver, noOpEffector)
          .readStableValue(),
      ).toBe('rgba(0, 0, 0, 0.5)')
    })
  })

  const invalidValues = [null, 17, 'text', { swatchId: 42 }, { alpha: 1 }]

  testColorDefinition(
    Color({ defaultValue: 'red', label: 'visible' }),
    [
      { swatchId: '[swatch-id-1]', alpha: 1 },
      { swatchId: '[swatch-id-2]', alpha: 0.5 },
    ],
    invalidValues,
  )
})
