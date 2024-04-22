import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  MarginDescriptor,
  MarginPropControllerDataV0,
  MarginPropControllerDataV1,
  MarginPropControllerDataV1Type,
  ResponsiveMarginData,
  createMarginPropControllerDataFromResponsiveMarginData,
  getMarginPropControllerDataResponsiveMarginData,
} from './margin'

describe('MarginPropController', () => {
  describe('getMarginPropControllerDataResponsiveMarginData', () => {
    test('returns value for MarginPropControllerDataV1Type', () => {
      // Arrange
      const data: MarginPropControllerDataV1 = {
        [ControlDataTypeKey]: MarginPropControllerDataV1Type,
        value: [
          {
            deviceId: 'desktop',
            value: {
              marginTop: 'auto',
              marginRight: null,
              marginBottom: null,
              marginLeft: null,
            },
          },
        ],
      }

      // Act
      const result = getMarginPropControllerDataResponsiveMarginData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('returns value for MarginPropControllerDataV0 data', () => {
      // Arrange
      const data: MarginPropControllerDataV0 = [
        {
          deviceId: 'desktop',
          value: {
            marginTop: 'auto',
            marginRight: null,
            marginBottom: null,
            marginLeft: null,
          },
        },
      ]

      // Act
      const result = getMarginPropControllerDataResponsiveMarginData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('createMarginPropControllerDataFromResponsiveMarginData', () => {
    test('returns MarginPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const data: ResponsiveMarginData = [
        {
          deviceId: 'desktop',
          value: {
            marginTop: 'auto',
            marginRight: null,
            marginBottom: null,
            marginLeft: null,
          },
        },
      ]
      const definition: MarginDescriptor = {
        type: Types.Margin,
        version: 1,
        options: {},
      }

      // Act
      const result = createMarginPropControllerDataFromResponsiveMarginData(
        data,
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: MarginPropControllerDataV1Type,
        value: data,
      })
    })

    test('returns MarginPropControllerDataV1 value when definition is undefined', () => {
      // Arrange
      const data: ResponsiveMarginData = [
        {
          deviceId: 'desktop',
          value: {
            marginTop: 'auto',
            marginRight: null,
            marginBottom: null,
            marginLeft: null,
          },
        },
      ]

      // Act
      const result =
        createMarginPropControllerDataFromResponsiveMarginData(data)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: MarginPropControllerDataV1Type,
        value: data,
      })
    })

    test('returns ResponsiveMarginData value when definition version is not 1', () => {
      // Arrange
      const data: ResponsiveMarginData = [
        {
          deviceId: 'desktop',
          value: {
            marginTop: 'auto',
            marginRight: null,
            marginBottom: null,
            marginLeft: null,
          },
        },
      ]
      const definition: MarginDescriptor = {
        type: Types.Margin,
        options: {},
      }

      // Act
      const result = createMarginPropControllerDataFromResponsiveMarginData(
        data,
        definition,
      )

      // Assert
      expect(result).toBe(data)
    })
  })
})
