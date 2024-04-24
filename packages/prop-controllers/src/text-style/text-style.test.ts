import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  TextStyleDescriptor,
  TextStylePropControllerData,
  TextStylePropControllerDataV0,
  TextStylePropControllerDataV1,
  TextStylePropControllerDataV1Type,
  createTextStylePropControllerDataFromResponsiveTextStyleData,
  getTextStylePropControllerDataResponsiveTextStyleData,
} from './text-style'

describe('TextStylePropController', () => {
  describe('getTextStylePropControllerDataResponsiveTextStyleData', () => {
    test('returns value for TextStylePropControllerDataV1Type', () => {
      // Arrange
      const data: TextStylePropControllerDataV1 = {
        [ControlDataTypeKey]: TextStylePropControllerDataV1Type,
        value: [
          {
            deviceId: 'desktop',
            value: {
              fontFamily: 'Times New Roman',
              letterSpacing: null,
              fontSize: null,
              fontWeight: null,
              textTransform: [],
              fontStyle: [],
            },
          },
        ],
      }

      // Act
      const result = getTextStylePropControllerDataResponsiveTextStyleData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('returns value for TextStylePropControllerDataV0 data', () => {
      // Arrange
      const data: TextStylePropControllerDataV0 = [
        {
          deviceId: 'desktop',
          value: {
            fontFamily: 'Times New Roman',
            letterSpacing: null,
            fontSize: null,
            fontWeight: null,
            textTransform: [],
            fontStyle: [],
          },
        },
      ]

      // Act
      const result = getTextStylePropControllerDataResponsiveTextStyleData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('createTextStylePropControllerDataFromResponsiveTextStyleData', () => {
    test('returns TextStylePropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const definition: TextStyleDescriptor = {
        type: Types.TextStyle,
        version: 1,
        options: {},
      }

      // Act
      const result =
        createTextStylePropControllerDataFromResponsiveTextStyleData(
          [
            {
              deviceId: 'desktop',
              value: {
                fontFamily: 'Times New Roman',
                letterSpacing: null,
                fontSize: null,
                fontWeight: null,
                textTransform: [],
                fontStyle: [],
              },
            },
          ],
          definition,
        )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: TextStylePropControllerDataV1Type,
        value: [
          {
            deviceId: 'desktop',
            value: {
              fontFamily: 'Times New Roman',
              letterSpacing: null,
              fontSize: null,
              fontWeight: null,
              textTransform: [],
              fontStyle: [],
            },
          },
        ],
      })
    })

    test('returns ResponsiveTextStyleData value when definition version is not 1', () => {
      // Arrange
      const data: TextStylePropControllerData = [
        {
          deviceId: 'desktop',
          value: {
            fontFamily: 'Times New Roman',
            letterSpacing: null,
            fontSize: null,
            fontWeight: null,
            textTransform: [],
            fontStyle: [],
          },
        },
      ]
      const definition: TextStyleDescriptor = {
        type: Types.TextStyle,
        options: {},
      }

      // Act
      const result =
        createTextStylePropControllerDataFromResponsiveTextStyleData(
          data,
          definition,
        )

      // Assert
      expect(result).toBe(data)
    })
  })
})
