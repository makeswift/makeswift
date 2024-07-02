import { Select } from './select'
import { type ValueType } from '../control-definition'

describe('Select', () => {
  describe('constructor', () => {
    test('value type', () => {
      const blockType = Select({
        label: 'Block type',
        labelOrientation: 'horizontal',
        options: [
          {
            value: 'p',
            label: 'Paragraph',
          },
          {
            value: 'h1',
            label: 'Heading 1',
          },
          {
            value: 'h2',
            label: 'Heading 2',
          },
          {
            value: 'h3',
            label: 'Heading 3',
          },
        ],
        defaultValue: 'p',
      })

      const value: 'p' | 'h1' | 'h2' | 'h3' = blockType.config
        .defaultValue as ValueType<typeof blockType>

      expect(value).toMatchSnapshot()
      expect(blockType).toMatchSnapshot()
    })
  })
})
