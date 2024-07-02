import { Checkbox } from './checkbox'
import { testDefinition } from '../tests/test-definition'
import { noOpResourceResolver } from '../tests/mocks'

import { type ValueType, type ResolvedValueType } from '../control-definition'
import { noOpEffector } from '../effector'

describe('Checkbox', () => {
  describe('constructor', () => {
    test.each([true, false, undefined])(
      'call with default value `%s` returns versioned definition',
      (value) => {
        expect(
          Checkbox({
            label: 'visible',
            defaultValue: value,
          }),
        ).toMatchSnapshot()
      },
    )

    test("definition's config type is derived from constructor's arguments", () => {
      // Assert
      Checkbox({
        label: 'visible',
        defaultValue: false,
      }).config satisfies { label: string; defaultValue: boolean }

      Checkbox({
        label: 'visible',
      }).config satisfies { label: string }
    })

    test("refines value type based on ctor's `defaultValue`", () => {
      // Arrange
      const definition = Checkbox({
        label: 'visible',
        defaultValue: false,
      })

      // Assert
      const value: boolean = true as ValueType<typeof definition>
      const resolvedValue: boolean = true as ResolvedValueType<
        typeof definition
      >

      expect(value).toBe(true)
      expect(resolvedValue).toBe(true)
    })
  })

  describe('resolveValue', () => {
    test.each([true, false, undefined])(
      'correctly resolves valid value %s',
      (value) => {
        expect(
          Checkbox({ label: 'visible' })
            .resolveValue(value, noOpResourceResolver, noOpEffector)
            .readStableValue(),
        ).toBe(value)

        const defaultValue = true
        expect(
          Checkbox({ defaultValue, label: 'visible' })
            .resolveValue(value, noOpResourceResolver, noOpEffector)
            .readStableValue(),
        ).toBe(value ?? defaultValue)
      },
    )
  })

  const invalidValues = [null, 17, 'text']

  testDefinition(
    Checkbox({ defaultValue: false, label: 'visible' }),
    [true, false],
    invalidValues,
  )

  testDefinition(
    Checkbox({ label: 'disabled' }),
    [true, false, undefined],
    invalidValues,
  )
})
