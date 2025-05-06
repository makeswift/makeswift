import { noOpResourceResolver } from '../../testing/mocks/resource-resolver'
import { testDefinition } from '../../testing/test-definition'

import { ControlDataTypeKey } from '../../common'
import {
  createRemoveTag,
  createReplacementContext,
  type CopyContext,
} from '../../context'
import { Targets } from '../../introspection'
import { Swatch } from '../../resources'
import {
  type FetchableValue,
  type ResourceResolver,
} from '../../resources/resolver'

import { type ValueType } from '../associated-types'
import { ControlDefinition } from '../definition'

import { Color, ColorDefinition } from './color'

export const colorResolver: ResourceResolver = {
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

    test('returns `undefined` when swatch is marked for removal', () => {
      const context: CopyContext = {
        replacementContext: createReplacementContext({
          swatchIds: { '[swatch-id-3]': createRemoveTag() },
        }),
        copyElement: (node) => node,
      }

      // Act
      const result = definition.copyData(
        { swatchId: '[swatch-id-3]', alpha: 1 },
        context,
      )

      // Assert
      expect(result).toBeUndefined()
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

  describe('resolveValue', () => {
    test('resolves v0 data', () => {
      const data = {
        swatchId: '[swatch-id-1]',
        alpha: 0.5,
      }
      expect(
        Color({ label: 'Color' })
          .resolveValue(data, colorResolver)
          .readStable(),
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
          .resolveValue(data, colorResolver)
          .readStable(),
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
