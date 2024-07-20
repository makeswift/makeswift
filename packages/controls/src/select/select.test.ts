import { Select } from './select'
import { ResolvedValueType, type ValueType } from '../control-definition'
import { testDefinition } from '../tests/test-definition'
import { noOpResourceResolver } from '../tests/mocks'
import { noOpEffector } from '../effector'

describe('Select', () => {
  describe('constructor', () => {
    test("definition's config type is derived from constructor's arguments", () => {
      // Assert
      Select({
        label: 'Nato',
        options: [
          { value: 'a', label: 'alpha' },
          { value: 'b', label: 'beta' },
        ],
      }).config satisfies {
        label?: string
        options: { value: 'a' | 'b'; label: string }[]
      }

      Select({
        label: 'Nato',
        options: [
          { value: 'a', label: 'alpha' },
          { value: 'b', label: 'beta' },
        ],
        defaultValue: 'a',
      }).config satisfies {
        label?: string
        options: { value: 'a' | 'b'; label: string }[]
        defaultValue: 'a'
      }
    })

    test('refines value type and resolved value based on options', () => {
      const blockType = Select({
        label: 'Block type',
        labelOrientation: 'horizontal',
        options: [
          { value: 'p', label: 'Paragraph' },
          { value: 'h1', label: 'Heading 1' },
        ],
        defaultValue: 'p',
      })

      const value: 'p' | 'h1' = blockType.config.defaultValue as ValueType<
        typeof blockType
      >

      const resolvedValue: 'p' | 'h1' = blockType
        .resolveValue('p', noOpResourceResolver, noOpEffector)
        .readStableValue() as ResolvedValueType<typeof blockType>

      expect(blockType).toMatchSnapshot()
      expect(value).toMatchSnapshot()
      expect(resolvedValue).toMatchSnapshot()
    })
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
