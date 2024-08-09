import { TextArea } from './text-area'
import { testDefinition } from '../tests/test-definition'
import { noOpResourceResolver } from '../tests/mocks'
import { noOpEffector } from '../effector'
import { MergeTranslatableDataContext, TranslationDto } from '../context'
import { ControlDataTypeKey } from '../common'

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
  })

  describe('resolveValue', () => {
    test('resolves v0 data', () => {
      const data = 'Monsters, Inc.'
      expect(
        TextArea({ label: 'TextArea' })
          .resolveValue(data, noOpResourceResolver, noOpEffector)
          .readStableValue(),
      ).toBe('Monsters, Inc.')
    })

    test('resolves v1 data', () => {
      const data = {
        [ControlDataTypeKey]: 'text-area::v1' as const,
        value: 'Finding Dory',
      }
      expect(
        TextArea({ label: 'TextArea' })
          .resolveValue(data, noOpResourceResolver, noOpEffector)
          .readStableValue(),
      ).toBe('Finding Dory')
    })
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
