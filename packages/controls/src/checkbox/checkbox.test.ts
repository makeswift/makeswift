import { Checkbox } from './checkbox'
import { testDefinition } from '../tests/test-definition'
import { noOpResourceResolver } from '../tests/mocks'
import { noOpEffector } from '../effector'
import { ControlDataTypeKey } from '../common'

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
  })

  describe('resolveValue', () => {
    test('resolves v0 data', () => {
      const data = true
      expect(
        Checkbox({ label: 'Checkbox' })
          .resolveValue(data, noOpResourceResolver, noOpEffector)
          .readStableValue(),
      ).toBe(true)
    })

    test('resolves v1 data', () => {
      const data = {
        [ControlDataTypeKey]: 'checkbox::v1' as const,
        value: false,
      }
      expect(
        Checkbox({ label: 'Checkbox' })
          .resolveValue(data, noOpResourceResolver, noOpEffector)
          .readStableValue(),
      ).toBe(false)
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
