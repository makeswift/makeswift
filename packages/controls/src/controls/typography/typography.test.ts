import { createReplacementContext } from '../../context'

import { DataType } from '../associated-types'

import {
  unstable_Typography,
  unstable_TypographyDefinition,
} from './typography'

describe('Typography', () => {
  describe('constructor', () => {
    test('returns correct definition', () => {
      expect(unstable_Typography()).toMatchSnapshot()
    })

    test('disallows extraneous properties', () => {
      // @ts-expect-error
      unstable_Typography({
        extra: 'extra',
      })
    })
  })

  describe('assignability', () => {
    function assignTest(_def: unstable_TypographyDefinition) {}
    assignTest(unstable_Typography())
  })

  describe('copyData', () => {
    test('returns `undefined` if typography ID is marked for removal', () => {
      const data: DataType<unstable_TypographyDefinition> = {
        id: 'typography-id',
        style: [
          {
            deviceId: 'desktop',
            value: {
              lineHeight: 1.5,
              color: { swatchId: 'swatch-id', alpha: 1 },
            },
          },
        ],
      }

      const typography = unstable_Typography()

      // Act
      const copy = typography.copyData(data, {
        replacementContext: createReplacementContext({
          typographyIds: { 'typography-id': null },
        }),
        copyElement: (el) => el,
      })

      // Assert
      expect(copy).toBeUndefined()
    })

    test('removes any swatch IDs marked for removal', () => {
      const data: DataType<unstable_TypographyDefinition> = {
        id: 'typography-id',
        style: [
          {
            deviceId: 'desktop',
            value: { color: { swatchId: 'swatch-id', alpha: 1 } },
          },
          {
            deviceId: 'tablet',
            value: { color: { swatchId: 'swatch-id-2', alpha: 1 } },
          },
          {
            deviceId: 'mobile',
            value: { color: { swatchId: 'swatch-id-3', alpha: 1 } },
          },
        ],
      }

      const typography = unstable_Typography()

      // Act
      const copy = typography.copyData(data, {
        replacementContext: createReplacementContext({
          swatchIds: {
            'swatch-id': null,
            'swatch-id-2': null,
          },
        }),
        copyElement: (el) => el,
      })

      // Assert
      expect(copy).toEqual({
        id: 'typography-id',
        style: [
          {
            deviceId: 'desktop',
            value: { color: { swatchId: null, alpha: 1 } },
          },
          {
            deviceId: 'tablet',
            value: { color: { swatchId: null, alpha: 1 } },
          },
          {
            deviceId: 'mobile',
            value: { color: { swatchId: 'swatch-id-3', alpha: 1 } },
          },
        ],
      })
    })
  })
})
