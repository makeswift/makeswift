import { Checkbox } from './checkbox'
import { testDefinition } from '../tests/control-definition'

import { type ValueType } from '../control-definition'

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
      expect(value).toBe(true)
    })
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
