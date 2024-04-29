import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  GapYDescriptor,
  GapYPropControllerData,
  GapYPropControllerDataV0,
  GapYPropControllerDataV1,
  GapYPropControllerDataV1Type,
  createGapYPropControllerDataFromResponsiveGapData,
  getGapYPropControllerDataResponsiveGapData,
} from './gap-y'

describe('GapYPropController', () => {
  describe('getGapYPropControllerDataResponsiveGapData', () => {
    test('returns value for GapYPropControllerDataV1Type', () => {
      // Arrange
      const data: GapYPropControllerDataV1 = {
        [ControlDataTypeKey]: GapYPropControllerDataV1Type,
        value: [
          {
            deviceId: 'desktop',
            value: { value: 17, unit: 'px' },
          },
        ],
      }

      // Act
      const result = getGapYPropControllerDataResponsiveGapData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('returns value for GapYPropControllerDataV0 data', () => {
      // Arrange
      const data: GapYPropControllerDataV0 = [
        {
          deviceId: 'desktop',
          value: { value: 17, unit: 'px' },
        },
      ]

      // Act
      const result = getGapYPropControllerDataResponsiveGapData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('createGapYPropControllerDataFromResponsiveGapData', () => {
    test('returns GapYPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const definition: GapYDescriptor = {
        type: Types.GapY,
        version: 1,
        options: {},
      }

      // Act
      const result = createGapYPropControllerDataFromResponsiveGapData(
        [
          {
            deviceId: 'desktop',
            value: { value: 17, unit: 'px' },
          },
        ],
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: GapYPropControllerDataV1Type,
        value: [
          {
            deviceId: 'desktop',
            value: { value: 17, unit: 'px' },
          },
        ],
      })
    })

    test('returns ResponsiveGapYData value when definition version is not 1', () => {
      // Arrange
      const data: GapYPropControllerData = [
        {
          deviceId: 'desktop',
          value: { value: 17, unit: 'px' },
        },
      ]
      const definition: GapYDescriptor = {
        type: Types.GapY,
        options: {},
      }

      // Act
      const result = createGapYPropControllerDataFromResponsiveGapData(
        data,
        definition,
      )

      // Assert
      expect(result).toBe(data)
    })
  })
})
