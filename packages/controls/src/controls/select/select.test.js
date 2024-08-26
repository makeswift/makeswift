import { SelectDefinition } from './select'

describe('Select', () => {
  describe('deserialize', () => {
    test('string values', () => {
      expect(
        SelectDefinition.deserialize({
          type: SelectDefinition.type,
          config: {
            label: 'Block type',
            labelOrientation: 'horizontal',
            options: [
              { value: 'p', label: 'Paragraph' },
              { value: 'h1', label: 'Heading 1' },
            ],
            defaultValue: 'p',
          },
        }),
      ).toMatchSnapshot()
    })

    test('correctly coerces numeric values to string', () => {
      expect(
        SelectDefinition.deserialize({
          type: SelectDefinition.type,
          config: {
            label: 'Text size',
            options: [
              { value: 8, label: 'sm' },
              { value: 12, label: 'md' },
              { value: 16, label: 'lg' },
            ],
            defaultValue: 12,
          },
        }),
      ).toMatchSnapshot()
    })
  })
})
