import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  FontDescriptor,
  FontPropControllerData,
  FontPropControllerDataV0,
  FontPropControllerDataV1,
  FontPropControllerDataV1Type,
  createFontPropControllerDataFromResponsiveFontData,
  getFontPropControllerDataResponsiveFontData,
} from './font'

describe('FontPropController', () => {
  describe('getFontPropControllerDataResponsiveFontData', () => {
    test('returns value for FontPropControllerDataV1Type', () => {
      // Arrange
      const data: FontPropControllerDataV1 = {
        [ControlDataTypeKey]: FontPropControllerDataV1Type,
        value: [
          {
            deviceId: 'desktop',
            value: 'Times New Roman',
          },
        ],
      }

      // Act
      const result = getFontPropControllerDataResponsiveFontData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('returns value for FontPropControllerDataV0 data', () => {
      // Arrange
      const data: FontPropControllerDataV0 = [
        {
          deviceId: 'desktop',
          value: 'Times New Roman',
        },
      ]

      // Act
      const result = getFontPropControllerDataResponsiveFontData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('createFontPropControllerDataFromResponsiveFontData', () => {
    test('returns FontPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const definition: FontDescriptor = {
        type: Types.Font,
        version: 1,
        options: {},
      }

      // Act
      const result = createFontPropControllerDataFromResponsiveFontData(
        [
          {
            deviceId: 'desktop',
            value: 'Times New Roman',
          },
        ],
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: FontPropControllerDataV1Type,
        value: [
          {
            deviceId: 'desktop',
            value: 'Times New Roman',
          },
        ],
      })
    })

    test('returns FontPropControllerDataV1 value when definition is undefined', () => {
      // Arrange
      const data = [
        {
          deviceId: 'desktop',
          value: 'Times New Roman',
        },
      ]

      // Act
      const result = createFontPropControllerDataFromResponsiveFontData(data)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: FontPropControllerDataV1Type,
        value: data,
      })
    })

    test('returns ResponsiveFontData value when definition version is not 1', () => {
      // Arrange
      const data: FontPropControllerData = [
        {
          deviceId: 'desktop',
          value: 'Times New Roman',
        },
      ]
      const definition: FontDescriptor = {
        type: Types.Font,
        options: {},
      }

      // Act
      const result = createFontPropControllerDataFromResponsiveFontData(
        data,
        definition,
      )

      // Assert
      expect(result).toBe(data)
    })
  })
})
