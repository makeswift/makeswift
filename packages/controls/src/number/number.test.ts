import { Number } from './number'
import { testDefinition } from '../tests/test-definition'
import { noOpResourceResolver } from '../tests/mocks'

import { type ValueType, type ResolvedValueType } from '../control-definition'
import { noOpEffector } from '../effector'

describe('Number', () => {
  describe('constructor', () => {
    test.each([1, 2, undefined])(
      'call with default value `%s` returns versioned definition',
      (value) => {
        expect(
          Number({
            label: 'Number',
            defaultValue: value,
          }),
        ).toMatchSnapshot()
      },
    )

    test("definition's config type is derived from constructor's arguments", () => {
      // Assert
      Number({
        label: 'Number',
        labelOrientation: 'horizontal',
        defaultValue: 15,
        min: 10,
        max: 20,
        step: 2,
        suffix: 'px',
      }).config satisfies {
        label: string
        defaultValue: number
        labelOrientation: 'horizontal'
        min: number
        max: number
        step: number
        suffix: string
      }

      Number({
        label: 'Number',
        defaultValue: 5,
      }).config satisfies { label: string; defaultValue: number }

      Number({
        label: 'Number',
      }).config satisfies { label: string }
    })

    test("refines value type based on ctor's `defaultValue`", () => {
      // Arrange
      const definition = Number({
        label: 'Number',
        defaultValue: 6,
      })

      // Assert
      const value: number = 6 as ValueType<typeof definition>
      const resolvedValue: number = 6 as ResolvedValueType<typeof definition>

      expect(value).toBe(6)
      expect(resolvedValue).toBe(6)
    })
  })

  describe('resolveValue', () => {
    test.each([21, 22, undefined])(
      'correctly resolves valid value %s',
      (value) => {
        expect(
          Number({ label: 'Number' })
            .resolveValue(value, noOpResourceResolver, noOpEffector)
            .readStableValue(),
        ).toBe(value)

        const defaultValue = 42
        expect(
          Number({ defaultValue, label: 'Number' })
            .resolveValue(value, noOpResourceResolver, noOpEffector)
            .readStableValue(),
        ).toBe(value ?? defaultValue)
      },
    )
  })

  const invalidValues = [null, false, 'text']

  testDefinition(
    Number({ defaultValue: 17, label: 'visible' }),
    [21, 20],
    invalidValues,
  )

  testDefinition(
    Number({ label: 'Number' }),
    [50, 51, undefined],
    invalidValues,
  )
})
