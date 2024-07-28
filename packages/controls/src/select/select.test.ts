import { Select } from './select'
import { testDefinition } from '../tests/test-definition'

describe('Select', () => {
  test('constructor', () => {
    const blockType = Select({
      label: 'Block type',
      labelOrientation: 'horizontal',
      options: [
        { value: 'p', label: 'Paragraph' },
        { value: 'h1', label: 'Heading 1' },
      ],
      defaultValue: 'p',
    })

    expect(blockType).toMatchSnapshot()
  })

  const invalidValues = [null, 17, 'random', { swatchId: 42 }]

  testDefinition(
    Select({
      label: 'Block type',
      labelOrientation: 'horizontal',
      options: [
        { value: 'p', label: 'Paragraph' },
        { value: 'h1', label: 'Heading 1' },
      ],
    }),
    ['p', 'h1'],
    invalidValues,
  )
})
