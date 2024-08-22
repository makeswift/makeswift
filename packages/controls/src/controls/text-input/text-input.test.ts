import { testDefinition } from '../../testing/test-definition'

import { ControlDataTypeKey } from '../../common'
import { MergeTranslatableDataContext, TranslationDto } from '../../context'

import { TextInput, TextInputDefinition } from './text-input'

describe('TextInput', () => {
  describe('constructor', () => {
    test.each(['bert', 'ernie', undefined])(
      'call with default value `%s` returns versioned definition',
      (value) => {
        expect(
          TextInput({
            label: 'TextInput',
            defaultValue: value,
          }),
        ).toMatchSnapshot()
      },
    )

    test('disallows extraneous properties', () => {
      TextInput({
        label: undefined,
        defaultValue: undefined,
        // @ts-expect-error
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: TextInputDefinition) {}
    assignTest(TextInput())
    assignTest(TextInput({ label: 'TextInput' }))
    assignTest(TextInput({ defaultValue: 'text' }))
    assignTest(TextInput({ defaultValue: 'text' }))
    assignTest(TextInput({ defaultValue: 'text' as string }))
    assignTest(TextInput({ label: 'TextInput', defaultValue: undefined }))
    assignTest(TextInput({ label: undefined, defaultValue: undefined }))
  })

  describe('getTranslatableData', () => {
    test.each([
      'cookie monster',
      {
        [ControlDataTypeKey]: 'text-input::v1' as const,
        value: 'elmo',
      },
      undefined,
    ])('returns `%s` when data is `%s`', (data) => {
      const def = TextInput({ label: 'TextInput' })
      expect(def.getTranslatableData(data)).toBe(data)
    })
  })

  describe('mergeTranslatedData', () => {
    const translationData: TranslationDto = {
      key: 'monstre de biscuits',
    }

    const mergeContext: MergeTranslatableDataContext = {
      translatedData: translationData,
      mergeTranslatedData: (el) => el,
    }

    const def = TextInput({ label: 'TextInput' })

    test('returns translated data when translated data is non-nullish', () => {
      const dataV0 = 'cookie monster'
      expect(
        def.mergeTranslatedData(dataV0, translationData, mergeContext),
      ).toBe(translationData)

      const dataV1 = {
        [ControlDataTypeKey]: 'text-input::v1' as const,
        value: 'elmo',
      }
      expect(
        def.mergeTranslatedData(dataV1, translationData, mergeContext),
      ).toBe(translationData)
    })

    test('returns data when translated data is nullish', () => {
      const dataV0 = 'cookie monster'

      const dataV1 = {
        [ControlDataTypeKey]: 'text-input::v1' as const,
        value: 'elmo',
      }

      expect(def.mergeTranslatedData(dataV0, undefined, mergeContext)).toBe(
        dataV0,
      )

      expect(def.mergeTranslatedData(dataV1, undefined, mergeContext)).toBe(
        dataV1,
      )
    })
  })

  const invalidValues = [null, false, 5, []]

  testDefinition(
    TextInput({ defaultValue: 'elmo', label: 'visible' }),
    ['bert', 'ernie'],
    invalidValues,
  )

  testDefinition(
    TextInput({ label: 'TextInput' }),
    ['big bird', 'cookie monster', undefined],
    invalidValues,
  )
})
