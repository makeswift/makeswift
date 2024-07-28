import { Number } from './number'
import { testDefinition } from '../tests/test-definition'
import { noOpResourceResolver } from '../tests/mocks'
import { noOpEffector } from '../effector'
import { ControlDataTypeKey } from '../common'

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
  })

  describe('resolveValue', () => {
    test('resolves v0 data', () => {
      const data = 5
      expect(
        Number({ label: 'Number' })
          .resolveValue(data, noOpResourceResolver, noOpEffector)
          .readStableValue(),
      ).toBe(5)
    })

    test('resolves v1 data', () => {
      const data = {
        [ControlDataTypeKey]: 'number::v1' as const,
        value: 4,
      }
      expect(
        Number({ label: 'Number' })
          .resolveValue(data, noOpResourceResolver, noOpEffector)
          .readStableValue(),
      ).toBe(4)
    })
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
