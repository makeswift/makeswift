import { testDefinition } from '../../testing/test-definition'

import { Select } from './select'

const options = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
] as const

describe('Select', () => {
  describe('constructor', () => {
    test('returns correct definition', () => {
      const blockType = Select({
        label: 'Block type',
        labelOrientation: 'horizontal',
        options,
        defaultValue: 'p',
      })

      expect(blockType).toMatchSnapshot()
    })

    test('enforces item value type', () => {
      Select({
        label: 'Block type',
        options: [
          {
            // @ts-expect-error
            value: 42,
            label: 'Paragraph',
          },
        ],
      })
    })

    test('disallows extraneous properties', () => {
      Select({
        options,
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    // FIXME
    // function assignTest(_def: SelectDefinition) {}
    // assignTest(Select({ options }))
    // assignTest(Select({ label: 'Block type', options }))
    // assignTest(Select({ options, defaultValue: 'p' }))
    // assignTest(Select({ options, defaultValue: 'p' as string }))
    // assignTest(Select({ options, defaultValue: undefined }))
    // assignTest(Select({ label: 'Block type', options, defaultValue: undefined }))
    // assignTest(Select({ label: undefined, options, defaultValue: undefined }))
  })

  const invalidValues = [null, 17, 'random', { swatchId: 42 }]

  testDefinition(
    Select({
      label: 'Block type',
      labelOrientation: 'horizontal',
      options,
    }),
    ['p', 'h1'],
    invalidValues,
  )
})
