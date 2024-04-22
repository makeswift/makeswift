import { ControlDataTypeKey, Types } from '../prop-controllers'
import { ResponsiveLengthData } from '../responsive-length'
import {
  WidthDescriptor,
  WidthPropControllerDataV0,
  WidthPropControllerDataV1,
  WidthPropControllerDataV1Type,
  createWidthPropControllerDataFromResponsiveLengthData,
  getWidthPropControllerDataResponsiveLengthData,
} from './width'

describe('WidthPropController', () => {
  describe('getWidthPropControllerDataResponsiveLengthData', () => {
    test('returns value for WidthPropControllerDataV1Type', () => {
      // Arrange
      const data: WidthPropControllerDataV1 = {
        [ControlDataTypeKey]: WidthPropControllerDataV1Type,
        value: [
          {
            deviceId: 'desktop',
            value: { value: 17, unit: 'px' },
          },
        ],
      }

      // Act
      const result = getWidthPropControllerDataResponsiveLengthData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('returns value for WidthPropControllerDataV0 data', () => {
      // Arrange
      const data: WidthPropControllerDataV0 = [
        {
          deviceId: 'desktop',
          value: { value: 17, unit: 'px' },
        },
      ]

      // Act
      const result = getWidthPropControllerDataResponsiveLengthData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('createWidthPropControllerDataFromResponsiveLengthData', () => {
    test('returns WidthPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const data: ResponsiveLengthData = [
        {
          deviceId: 'desktop',
          value: { value: 17, unit: 'px' },
        },
      ]
      const definition: WidthDescriptor = {
        type: Types.Width,
        version: 1,
        options: {},
      }

      // Act
      const result = createWidthPropControllerDataFromResponsiveLengthData(
        data,
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: WidthPropControllerDataV1Type,
        value: data,
      })
    })

    test('returns WidthPropControllerDataV1 value when definition is undefined', () => {
      // Arrange
      const data: ResponsiveLengthData = [
        {
          deviceId: 'desktop',
          value: { value: 17, unit: 'px' },
        },
      ]

      // Act
      const result = createWidthPropControllerDataFromResponsiveLengthData(data)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: WidthPropControllerDataV1Type,
        value: data,
      })
    })

    test('returns string value when definition version is not 1', () => {
      // Arrange
      const data: ResponsiveLengthData = [
        {
          deviceId: 'desktop',
          value: { value: 17, unit: 'px' },
        },
      ]
      const definition: WidthDescriptor = {
        type: Types.Width,
        options: {},
      }

      // Act
      const result = createWidthPropControllerDataFromResponsiveLengthData(
        data,
        definition,
      )

      // Assert
      expect(result).toBe(data)
    })
  })
})
