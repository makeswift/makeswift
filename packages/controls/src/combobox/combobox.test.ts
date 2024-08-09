import { Combobox } from './combobox'
import { ResolvedValueType, type ValueType } from '../control-definition'
import { testDefinition } from '../tests/test-definition'
import { noOpResourceResolver } from '../tests/mocks'
import { noOpEffector } from '../effector'

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

    test('refines value type and resolved value based on options', () => {
      const comboDef = Combobox({
        label: 'Block type',
        labelOrientation: 'horizontal',
        getOptions: () => [
          { id: 'p', value: 'p', label: 'Paragraph' },
          { id: 'h1', value: 'h1', label: 'Heading 1' },
        ],
      })

      const value:
        | { id: string; value: 'p'; label: string }
        | { id: string; value: 'h1'; label: string } = {
        id: 'p',
        value: 'p',
        label: 'Paragraph',
      } as ValueType<typeof comboDef>

      const resolvedValue: 'p' | 'h1' | undefined = comboDef
        .resolveValue(
          { id: 'foo', value: 'p', label: 'label' },
          noOpResourceResolver,
          noOpEffector,
        )
        .readStableValue() as ResolvedValueType<typeof comboDef>

      expect(comboDef).toMatchSnapshot()
      expect(value).toMatchSnapshot()
      expect(resolvedValue).toMatchSnapshot()
    })
  })

  const invalidValues = [
    null,
    17,
    'random',
    { swatchId: 42 },
    // {id: 'p', value: 3, label: 'Paragraph'}
  ]

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

// const t = Combobox({
//   label: 'Block type',
//   getOptions: () => [
//     { id: 'p', value: 'p', label: 'Paragraph' },
//     { id: 'h1', value: 'h1', label: 'Heading 1' },
//   ],
// })

// t.safeParse({ id: 'p', value: 3, label: 'Paragraph' })
