import { testDefinition } from '../../testing/test-definition'

import { Combobox, ComboboxDefinition } from './combobox'

describe('Combobox', () => {
  describe('constructor', () => {
    test("definition's config type is derived from constructor's arguments", () => {
      // Assert
      Combobox({
        label: 'Nato',
        getOptions: () => [
          { id: 'a', value: 'a', label: 'alpha' },
          { id: 'b', value: 'b', label: 'beta' },
        ],
      }).config satisfies {
        label?: string
        getOptions: () => { id: string; value: 'a' | 'b'; label: string }[]
      }

      Combobox({
        label: 'Nato',
        getOptions: async () => [
          { id: 'a', value: 'a', label: 'alpha' },
          { id: 'b', value: 'b', label: 'beta' },
        ],
      }).config satisfies {
        label?: string
        getOptions: () => Promise<
          { id: string; value: 'a' | 'b'; label: string }[]
        >
      }
    })

    test('disallows extraneous properties', () => {
      Combobox({
        label: undefined,
        getOptions: () => [],
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: ComboboxDefinition) {}
    const getOptions = () => [
      {
        id: '1234567890',
        value: { latitude: 41.661129, longitude: -91.530167 },
        label: 'Iowa City',
      },
    ]

    assignTest(Combobox({ label: 'location', getOptions }))
    assignTest(Combobox({ label: undefined, getOptions }))
  })

  const invalidValues = [null, 17, 'random', { swatchId: 42 }]

  testDefinition(
    Combobox({
      label: 'Block type',
      getOptions: () => [
        { id: 'p', value: 'p', label: 'Paragraph' },
        { id: 'h1', value: 'h1', label: 'Heading 1' },
      ],
    }),
    [
      { id: 'p', value: 'p', label: 'Paragraph' },
      { id: 'h1', value: 'h1', label: 'Paragraph' },
    ],
    invalidValues,
  )
})
