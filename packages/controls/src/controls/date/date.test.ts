import { testDefinition, testResolveValue } from '../../testing/test-definition'

import { Date, DateDefinition } from './date'

describe('Date', () => {
  describe('constructor', () => {
    test.each([
      '2024-01-01T00:00:00.000Z',
      '2024-06-15T12:30:00.000Z',
      undefined,
    ])(
      'call with default value `%s` returns versioned definition',
      (value) => {
        expect(
          Date({
            label: 'Event date',
            defaultValue: value,
          }),
        ).toMatchSnapshot()
      },
    )

    test('creates date with includeTime', () => {
      expect(
        Date({
          label: 'Starts at',
          defaultValue: '2024-06-15T12:30:00.000Z',
          includeTime: true,
        }),
      ).toMatchSnapshot()
    })

    test('disallows extraneous properties', () => {
      Date({
        label: undefined,
        defaultValue: undefined,
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: DateDefinition) {}

    assignTest(Date())
    assignTest(Date({ label: 'date' }))
    assignTest(Date({ defaultValue: '2024-01-01T00:00:00.000Z' }))
    assignTest(
      Date({ label: 'date', defaultValue: '2024-01-01T00:00:00.000Z' }),
    )
    assignTest(Date({ defaultValue: undefined }))
    assignTest(Date({ includeTime: true }))
    assignTest(Date({ description: 'when the event starts' }))
  })
})

describe.each([
  [
    Date({ defaultValue: '2024-01-01T00:00:00.000Z', label: 'Event date' }),
    ['2024-01-01T00:00:00.000Z', '2024-06-15T12:30:00.000Z'],
  ],
  [
    Date({ label: 'Starts at', includeTime: true }),
    ['2024-06-15T12:30:00.000Z', undefined],
  ],
])('Date', (def, values) => {
  const invalidValues = [null, 42, true, {}]
  testDefinition(def, values, invalidValues)
  testResolveValue(def, values)
})
