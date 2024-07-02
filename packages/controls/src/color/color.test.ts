import { Color } from './color'
import { testDefinition } from '../tests/control-definition'

import { type CopyContext, createReplacementContext } from '../context'
import {
  type ValueType,
  type ResolvedValueType,
  ControlDefinition,
} from '../control-definition'

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

  describe('getSwatchIds', () => {
    test("returns data's `swatchId`", () => {
      expect(definition.getSwatchIds({ swatchId: '[swatch-id-2]' })).toEqual([
        '[swatch-id-2]',
      ])
    })

    test.each([null, undefined])('gracefully handles %s', (value) => {
      expect(definition.getSwatchIds(value)).toEqual([])
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

    test("definition's config type is derived from constructor's arguments", () => {
      // Assert
      Color({
        label: 'color',
        defaultValue: '#ff0000',
      }).config satisfies { label: string; defaultValue: string }

      Color({
        label: 'color',
        labelOrientation: 'horizontal',
      }).config satisfies { label: string; labelOrientation: string }
    })

    test("refines value type based on ctor's `defaultValue`", () => {
      // Arrange
      const definition = Color({
        label: 'color',
        defaultValue: 'blue',
      })

      // Assert
      const value: string = 'green' as ResolvedValueType<typeof definition>
      expect(value).toBe('green')
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
