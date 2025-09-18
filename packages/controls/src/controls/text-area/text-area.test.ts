import { testDefinition, testResolveValue } from '../../testing/test-definition'
import { TestMergeTranslationsVisitor } from '../../testing/test-merge-translation-visitor'

import { ControlDataTypeKey } from '../../common'
import { MergeTranslatableDataContext, TranslationDto } from '../../context'

import { TextArea, TextAreaDefinition } from './text-area'

describe('TextArea', () => {
  describe('constructor', () => {
    test.each(['Toy Story', 'Cars', undefined])(
      'call with default value `%s` returns versioned definition',
      (value) => {
        expect(
          TextArea({
            label: 'TextArea',
            defaultValue: value,
          }),
        ).toMatchSnapshot()
      },
    )

    test('disallows extraneous properties', () => {
      TextArea({
        label: undefined,
        defaultValue: undefined,
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: TextAreaDefinition) {}
    assignTest(TextArea())
    assignTest(TextArea({ label: 'TextArea' }))
    assignTest(TextArea({ defaultValue: 'text' }))
    assignTest(TextArea({ defaultValue: 'text', rows: 3 }))
    assignTest(TextArea({ defaultValue: 'text' as string }))
    assignTest(TextArea({ defaultValue: undefined, rows: undefined }))
    assignTest(
      TextArea({ label: undefined, defaultValue: undefined, rows: undefined }),
    )
  })

  describe('getTranslatableData', () => {
    const def = TextArea({ label: 'TextArea' })
    test.each(['The Incredibles', def.toData('The Incredibles'), undefined])(
      'returns `%s` when data is `%s`',
      (data) => {
        const def = TextArea({ label: 'TextArea' })
        expect(def.getTranslatableData(data)).toBe(data)
      },
    )
  })

  describe('mergeTranslatedData', () => {
    const translationData: TranslationDto = {
      key: 'Le monde de nemo',
    }

    const mergeContext: MergeTranslatableDataContext = {
      translatedData: translationData,
      mergeTranslatedData: (el) => el,
    }

    const visitor = new TestMergeTranslationsVisitor(mergeContext)

    const def = TextArea({ label: 'TextArea' })

    test('returns translated data when translated data is non-nullish', () => {
      const dataV0 = 'Finding Nemo'
      const dataV1 = {
        [ControlDataTypeKey]: 'text-area::v1' as const,
        value: 'Finding Nemo',
      }

      expect(def.accept(visitor, dataV1, translationData)).toBe(translationData)
      expect(def.accept(visitor, dataV0, translationData)).toBe(translationData)
    })

    test('returns data when translated data is nullish', () => {
      const dataV0 = 'Finding Nemo'
      const dataV1 = {
        [ControlDataTypeKey]: 'text-area::v1' as const,
        value: 'Finding Nemo',
      }

      expect(def.accept(visitor, dataV1, undefined)).toBe(dataV1)
      expect(def.accept(visitor, dataV0, null)).toBe(dataV0)
    })
  })
})

describe.each([
  [
    TextArea({ defaultValue: 'Up', label: 'visible' }),
    ['Toy Story 3', "Monster's Inc."],
  ],
  [TextArea({ label: 'TextArea' }), ['WALL-E', 'Ratatouille', undefined]],
])('TextArea', (def, values) => {
  const invalidValues = [null, false, 5, []]
  testDefinition(def, values, invalidValues)
  testResolveValue(def, values)
})
