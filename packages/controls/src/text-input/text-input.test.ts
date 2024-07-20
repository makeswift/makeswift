import { TextInput } from './text-input'
import { testDefinition } from '../tests/test-definition'
import { noOpResourceResolver } from '../tests/mocks'

import { type ValueType, type ResolvedValueType } from '../control-definition'
import { noOpEffector } from '../effector'
import { MergeTranslatableDataContext, TranslationDto } from '../context'
import { ControlDataTypeKey } from '../common'

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

    test("refines types based on ctor's `defaultValue`", () => {
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
    test('resolves v0 data', () => {
      const data = 'cookie monster'
      expect(
        TextInput({ label: 'TextInput' })
          .resolveValue(data, noOpResourceResolver, noOpEffector)
          .readStableValue(),
      ).toBe('cookie monster')
    })

    test('resolves v1 data', () => {
      const data = {
        [ControlDataTypeKey]: 'text-input::v1' as const,
        value: 'elmo',
      }
      expect(
        TextInput({ label: 'TextInput' })
          .resolveValue(data, noOpResourceResolver, noOpEffector)
          .readStableValue(),
      ).toBe('elmo')
    })

    describe('resolves undefined data', () => {
      test('resolved undefined when no default value is provided', () => {
        expect(
          TextInput({ label: 'TextInput' })
            .resolveValue(undefined, noOpResourceResolver, noOpEffector)
            .readStableValue(),
        ).toBe(undefined)
      })

      test('resolves default value when default is provided', () => {
        expect(
          TextInput({ label: 'TextInput', defaultValue: 'elmo' })
            .resolveValue(undefined, noOpResourceResolver, noOpEffector)
            .readStableValue(),
        ).toBe('elmo')
      })
    })
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
      expect(def.mergeTranslatedData(dataV0, undefined, mergeContext)).toBe(
        dataV0,
      )
    })

    test('returns data when translated data is nullish', () => {
      const dataV1 = {
        [ControlDataTypeKey]: 'text-input::v1' as const,
        value: 'elmo',
      }
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
