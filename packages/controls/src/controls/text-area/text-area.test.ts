import { testDefinition } from '../../testing/test-definition'

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

    const def = TextArea({ label: 'TextArea' })

    test('returns translated data when translated data is non-nullish', () => {
      const dataV0 = 'Finding Nemo'
      const dataV1 = {
        [ControlDataTypeKey]: 'text-area::v1' as const,
        value: 'Finding Nemo',
      }

      expect(
        def.mergeTranslatedData(dataV1, translationData, mergeContext),
      ).toBe(translationData)
      expect(
        def.mergeTranslatedData(dataV0, translationData, mergeContext),
      ).toBe(translationData)
    })

    test('returns data when translated data is nullish', () => {
      const dataV0 = 'Finding Nemo'
      const dataV1 = {
        [ControlDataTypeKey]: 'text-area::v1' as const,
        value: 'Finding Nemo',
      }

      expect(def.mergeTranslatedData(dataV1, undefined, mergeContext)).toBe(
        dataV1,
      )
      expect(def.mergeTranslatedData(dataV0, null, mergeContext)).toBe(dataV0)
    })
  })

  const invalidValues = [null, false, 5, []]

  testDefinition(
    TextArea({ defaultValue: 'Up', label: 'visible' }),
    ['Toy Story 3', "Monster's Inc."],
    invalidValues,
  )

  testDefinition(
    TextArea({ label: 'TextArea' }),
    ['WALL-E', 'Ratatouille', undefined],
    invalidValues,
  )
})
