import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  TextAreaDescriptor,
  TextAreaPropControllerDataV1,
  TextAreaPropControllerDataV1Type,
  createTextAreaPropControllerDataFromString,
  getTextAreaPropControllerDataString,
} from './text-area'

describe('TextAreaPropController', () => {
  describe('getTextAreaPropControllerDataString', () => {
    test('returns value for TextAreaPropControllerDataV1Type', () => {
      // Arrange
      const text = 'test text'
      const data: TextAreaPropControllerDataV1 = {
        [ControlDataTypeKey]: TextAreaPropControllerDataV1Type,
        value: text,
      }

      // Act
      const result = getTextAreaPropControllerDataString(data)

      // Assert
      expect(result).toBe(text)
    })

    test('returns value for TextAreaPropControllerDataV0 data', () => {
      // Arrange
      const text = 'test text'

      // Act
      const result = getTextAreaPropControllerDataString(text)

      // Assert
      expect(result).toBe(text)
    })
  })

  describe('createTextAreaPropControllerDataFromString', () => {
    test('returns TextAreaPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const text = 'test text'
      const definition: TextAreaDescriptor = {
        type: Types.TextArea,
        version: 1,
        options: {},
      }

      // Act
      const result = createTextAreaPropControllerDataFromString(
        text,
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: TextAreaPropControllerDataV1Type,
        value: text,
      })
    })

    test('returns string value when definition version is not 1', () => {
      // Arrange
      const text = 'test text'
      const definition: TextAreaDescriptor = {
        type: Types.TextArea,
        options: {},
      }

      // Act
      const result = createTextAreaPropControllerDataFromString(
        text,
        definition,
      )

      // Assert
      expect(result).toBe(text)
    })
  })
})
