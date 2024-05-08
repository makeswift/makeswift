import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  TextInputDescriptor,
  TextInputPropControllerDataV1,
  TextInputPropControllerDataV1Type,
  createTextInputPropControllerDataFromString,
  getTextInputPropControllerDataString,
} from './text-input'

describe('TextInputPropController', () => {
  describe('getTextInputPropControllerDataString', () => {
    test('returns value for TextInputPropControllerDataV1Type', () => {
      // Arrange
      const text = 'test text'
      const data: TextInputPropControllerDataV1 = {
        [ControlDataTypeKey]: TextInputPropControllerDataV1Type,
        value: text,
      }

      // Act
      const result = getTextInputPropControllerDataString(data)

      // Assert
      expect(result).toBe(text)
    })

    test('returns value for TextInputPropControllerDataV0 data', () => {
      // Arrange
      const text = 'test text'

      // Act
      const result = getTextInputPropControllerDataString(text)

      // Assert
      expect(result).toBe(text)
    })
  })

  describe('createTextInputPropControllerDataFromString', () => {
    test('returns TextInputPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const text = 'test text'
      const definition: TextInputDescriptor = {
        type: Types.TextInput,
        version: 1,
        options: {},
      }

      // Act
      const result = createTextInputPropControllerDataFromString(
        text,
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: TextInputPropControllerDataV1Type,
        value: text,
      })
    })

    test('returns string value when definition version is not 1', () => {
      // Arrange
      const text = 'test text'
      const definition: TextInputDescriptor = {
        type: Types.TextInput,
        options: {},
      }

      // Act
      const result = createTextInputPropControllerDataFromString(
        text,
        definition,
      )

      // Assert
      expect(result).toBe(text)
    })
  })
})
