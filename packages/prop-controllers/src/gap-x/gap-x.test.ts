import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  GapXDescriptor,
  GapXPropControllerData,
  GapXPropControllerDataV0,
  GapXPropControllerDataV1,
  GapXPropControllerDataV1Type,
  createGapXPropControllerDataFromResponsiveGapData,
  getGapXPropControllerDataResponsiveGapData,
} from './gap-x'

describe('GapXPropController', () => {
  describe('getGapXPropControllerDataResponsiveGapData', () => {
    test('returns value for GapXPropControllerDataV1Type', () => {
      // Arrange
      const data: GapXPropControllerDataV1 = {
        [ControlDataTypeKey]: GapXPropControllerDataV1Type,
        value: [
          {
            deviceId: 'desktop',
            value: { value: 17, unit: 'px' },
          },
        ],
      }

      // Act
      const result = getGapXPropControllerDataResponsiveGapData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('returns value for GapXPropControllerDataV0 data', () => {
      // Arrange
      const data: GapXPropControllerDataV0 = [
        {
          deviceId: 'desktop',
          value: { value: 17, unit: 'px' },
        },
      ]

      // Act
      const result = getGapXPropControllerDataResponsiveGapData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('createGapXPropControllerDataFromResponsiveGapData', () => {
    test('returns GapXPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const definition: GapXDescriptor = {
        type: Types.GapX,
        version: 1,
        options: {},
      }

      // Act
      const result = createGapXPropControllerDataFromResponsiveGapData(
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
        [ControlDataTypeKey]: GapXPropControllerDataV1Type,
        value: [
          {
            deviceId: 'desktop',
            value: { value: 17, unit: 'px' },
          },
        ],
      })
    })

    test('returns ResponsiveGapXData value when definition version is not 1', () => {
      // Arrange
      const data: GapXPropControllerData = [
        {
          deviceId: 'desktop',
          value: { value: 17, unit: 'px' },
        },
      ]
      const definition: GapXDescriptor = {
        type: Types.GapX,
        options: {},
      }

      // Act
      const result = createGapXPropControllerDataFromResponsiveGapData(
        data,
        definition,
      )

      // Assert
      expect(result).toBe(data)
    })
  })
})
