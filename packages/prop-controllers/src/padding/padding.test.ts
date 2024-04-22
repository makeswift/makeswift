import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  PaddingDescriptor,
  PaddingPropControllerDataV0,
  PaddingPropControllerDataV1,
  PaddingPropControllerDataV1Type,
  ResponsivePaddingData,
  createPaddingPropControllerDataFromResponsivePaddingData,
  getPaddingPropControllerDataResponsivePaddingData,
} from './padding'

describe('PaddingPropController', () => {
  describe('getPaddingPropControllerDataResponsivePaddingData', () => {
    test('returns value for PaddingPropControllerDataV1Type', () => {
      // Arrange
      const data: PaddingPropControllerDataV1 = {
        [ControlDataTypeKey]: PaddingPropControllerDataV1Type,
        value: [
          {
            deviceId: 'desktop',
            value: {
              paddingTop: { value: 17, unit: 'px' },
              paddingRight: null,
              paddingBottom: null,
              paddingLeft: null,
            },
          },
        ],
      }

      // Act
      const result = getPaddingPropControllerDataResponsivePaddingData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('returns value for PaddingPropControllerDataV0 data', () => {
      // Arrange
      const data: PaddingPropControllerDataV0 = [
        {
          deviceId: 'desktop',
          value: {
            paddingTop: { value: 17, unit: 'px' },
            paddingRight: null,
            paddingBottom: null,
            paddingLeft: null,
          },
        },
      ]

      // Act
      const result = getPaddingPropControllerDataResponsivePaddingData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('createPaddingPropControllerDataFromResponsivePaddingData', () => {
    test('returns PaddingPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const data: ResponsivePaddingData = [
        {
          deviceId: 'desktop',
          value: {
            paddingTop: { value: 17, unit: 'px' },
            paddingRight: null,
            paddingBottom: null,
            paddingLeft: null,
          },
        },
      ]
      const definition: PaddingDescriptor = {
        type: Types.Padding,
        version: 1,
        options: {},
      }

      // Act
      const result = createPaddingPropControllerDataFromResponsivePaddingData(
        data,
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: PaddingPropControllerDataV1Type,
        value: data,
      })
    })

    test('returns PaddingPropControllerDataV1 value when definition is undefined', () => {
      // Arrange
      const data: ResponsivePaddingData = [
        {
          deviceId: 'desktop',
          value: {
            paddingTop: { value: 17, unit: 'px' },
            paddingRight: null,
            paddingBottom: null,
            paddingLeft: null,
          },
        },
      ]

      // Act
      const result =
        createPaddingPropControllerDataFromResponsivePaddingData(data)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: PaddingPropControllerDataV1Type,
        value: data,
      })
    })

    test('returns ResponsivePaddingData value when definition version is not 1', () => {
      // Arrange
      const data: ResponsivePaddingData = [
        {
          deviceId: 'desktop',
          value: {
            paddingTop: { value: 17, unit: 'px' },
            paddingRight: null,
            paddingBottom: null,
            paddingLeft: null,
          },
        },
      ]
      const definition: PaddingDescriptor = {
        type: Types.Padding,
        options: {},
      }

      // Act
      const result = createPaddingPropControllerDataFromResponsivePaddingData(
        data,
        definition,
      )

      // Assert
      expect(result).toBe(data)
    })
  })
})
