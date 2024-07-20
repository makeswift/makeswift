import { TextArea } from './text-area'
import { testDefinition } from '../tests/test-definition'
import { noOpResourceResolver } from '../tests/mocks'

import { type ValueType, type ResolvedValueType } from '../control-definition'
import { noOpEffector } from '../effector'
import { MergeTranslatableDataContext, TranslationDto } from '../context'

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

    test("definition's config type is derived from constructor's arguments", () => {
      // Assert
      TextArea({
        label: 'TextArea',
        defaultValue: 'Soul',
        rows: 5,
      }).config satisfies { label: string; defaultValue: string; rows: number }

      TextArea({
        label: 'TextArea',
        defaultValue: 'Soul',
      }).config satisfies { label: string; defaultValue: string }

      TextArea({
        label: 'Inside Out',
      }).config satisfies { label: string }
    })

    test("refines value type based on ctor's `defaultValue`", () => {
      // Arrange
      const definition = TextArea({
        label: 'TextArea',
        defaultValue: "A Bug's Life",
      })

      // Assert
      const value: string = "A Bug's Life" as ValueType<typeof definition>
      const resolvedValue: string = "A Bug's Life" as ResolvedValueType<
        typeof definition
      >

      expect(value).toBe("A Bug's Life")
      expect(resolvedValue).toBe("A Bug's Life")
    })
  })

  describe('resolveValue', () => {
    test.each(['Finding Dory', 'Coco', undefined])(
      'correctly resolves valid value %s',
      (data) => {
        expect(
          TextArea({ label: 'TextArea' })
            .resolveValue(data, noOpResourceResolver, noOpEffector)
            .readStableValue(),
        ).toBe(data)

        const defaultValue = 'Toy Story 4'
        expect(
          TextArea({ defaultValue, label: 'TextArea' })
            .resolveValue(data, noOpResourceResolver, noOpEffector)
            .readStableValue(),
        ).toBe(data ?? defaultValue)
      },
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
      const data = 'Finding Nemo'
      expect(def.mergeTranslatedData(data, translationData, mergeContext)).toBe(
        translationData,
      )
    })

    test('returns data when translated data is nullish', () => {
      const data = 'Finding Nemo'
      expect(def.mergeTranslatedData(data, undefined, mergeContext)).toBe(data)
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
