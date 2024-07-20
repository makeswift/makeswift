import { TextInput } from './text-input'
import { testDefinition } from '../tests/test-definition'
import { noOpResourceResolver } from '../tests/mocks'

import { type ValueType, type ResolvedValueType } from '../control-definition'
import { noOpEffector } from '../effector'
import { MergeTranslatableDataContext, TranslationDto } from '../context'

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

    test("definition's config type is derived from constructor's arguments", () => {
      // Assert

      TextInput({
        label: 'TextInput',
        defaultValue: 'big bird',
      }).config satisfies { label: string; defaultValue: string }

      TextInput({
        label: 'TextInput',
      }).config satisfies { label: string }
    })

    test("refines value type based on ctor's `defaultValue`", () => {
      // Arrange
      const definition = TextInput({
        label: 'TextInput',
        defaultValue: 'elmo',
      })

      // Assert
      const value: string = 'elmo' as ValueType<typeof definition>
      const resolvedValue: string = 'elmo' as ResolvedValueType<
        typeof definition
      >

      expect(value).toBe('elmo')
      expect(resolvedValue).toBe('elmo')
    })
  })

  describe('resolveValue', () => {
    test.each(['cookie monster', 'zoe', undefined])(
      'correctly resolves valid value %s',
      (data) => {
        expect(
          TextInput({ label: 'TextInput' })
            .resolveValue(data, noOpResourceResolver, noOpEffector)
            .readStableValue(),
        ).toBe(data)

        const defaultValue = 'elmo'
        expect(
          TextInput({ defaultValue, label: 'TextInput' })
            .resolveValue(data, noOpResourceResolver, noOpEffector)
            .readStableValue(),
        ).toBe(data ?? defaultValue)
      },
    )
  })

  describe('getTranslatableData', () => {
    const def = TextInput({ label: 'TextInput' })
    test.each(['cookie monster', def.toData('cookie monster'), undefined])(
      'returns `%s` when data is `%s`',
      (data) => {
        const def = TextInput({ label: 'TextInput' })
        expect(def.getTranslatableData(data)).toBe(data)
      },
    )
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
      const data = 'cookie monster'
      expect(def.mergeTranslatedData(data, translationData, mergeContext)).toBe(
        translationData,
      )
    })

    test('returns data when translated data is nullish', () => {
      const data = 'cookie monster'
      expect(def.mergeTranslatedData(data, undefined, mergeContext)).toBe(data)
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
