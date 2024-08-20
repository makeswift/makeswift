import { testDefinition } from '../../testing/test-definition'

import { Number, NumberDefinition } from './number'

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

    test('disallows extraneous properties', () => {
      Number({
        label: undefined,
        defaultValue: undefined,
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: NumberDefinition) {}
    assignTest(Number())
    assignTest(Number({ label: 'number' }))
    assignTest(Number({ defaultValue: 17 }))
    assignTest(Number({ label: 'number', defaultValue: -1 }))
    assignTest(
      Number({ defaultValue: -1 as number, labelOrientation: 'horizontal' }),
    )

    assignTest(Number({ defaultValue: undefined, min: 0, max: 100 }))
    assignTest(Number({ label: undefined, defaultValue: undefined }))
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
