import { testDefinition } from '../../testing/test-definition'

import { createReplacementContext, type CopyContext } from '../../context'
import { Targets } from '../../introspection'

import { type ValueType } from '../associated-types'
import { ControlDefinition } from '../definition'

import { Color, ColorDefinition } from './color'

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
