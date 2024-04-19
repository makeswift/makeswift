import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  CheckboxDescriptor,
  CheckboxPropControllerDataV1,
  CheckboxPropControllerDataV1Type,
  createCheckboxPropControllerDataFromBoolean,
  getCheckboxPropControllerDataBoolean,
} from './checkbox'

describe('CheckboxPropController', () => {
  describe('getCheckboxPropControllerDataBoolean', () => {
    test('returns value for CheckboxPropControllerDataV1Type', () => {
      // Arrange
      const data: CheckboxPropControllerDataV1 = {
        [ControlDataTypeKey]: CheckboxPropControllerDataV1Type,
        value: true,
      }

      // Act
      const result = getCheckboxPropControllerDataBoolean(data)

      // Assert
      expect(result).toBe(true)
    })

    test('returns value for CheckboxPropControllerDataV0 data', () => {
      // Arrange
      const data = true

      // Act
      const result = getCheckboxPropControllerDataBoolean(data)

      // Assert
      expect(result).toBe(true)
    })
  })

  describe('createCheckboxPropControllerDataFromBoolean', () => {
    test('returns CheckboxPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const value = true
      const definition: CheckboxDescriptor = {
        type: Types.Checkbox,
        version: 1,
        options: {
          label: '',
        },
      }

      // Act
      const result = createCheckboxPropControllerDataFromBoolean(
        value,
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: CheckboxPropControllerDataV1Type,
        value: true,
      })
    })

    test('returns CheckboxPropControllerDataV1 value when definition is undefined', () => {
      // Arrange
      const value = true

      // Act
      const result = createCheckboxPropControllerDataFromBoolean(value)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: CheckboxPropControllerDataV1Type,
        value: true,
      })
    })

    test('returns boolean value when definition version is not 1', () => {
      // Arrange
      const value = true
      const definition: CheckboxDescriptor = {
        type: Types.Checkbox,
        options: {
          label: '',
        },
      }

      // Act
      const result = createCheckboxPropControllerDataFromBoolean(
        value,
        definition,
      )

      // Assert
      expect(result).toBe(true)
    })
  })
})
