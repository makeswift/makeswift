import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  DateDescriptor,
  DatePropControllerDataV1,
  DatePropControllerDataV1Type,
  createDatePropControllerDataFromString,
  getDatePropControllerDataString,
} from './date'

describe('DatePropController', () => {
  describe('getDatePropControllerDataString', () => {
    test('returns value for DatePropControllerDataV1Type', () => {
      // Arrange
      const date = new Date(Date.now()).toISOString()
      const data: DatePropControllerDataV1 = {
        [ControlDataTypeKey]: DatePropControllerDataV1Type,
        value: date,
      }

      // Act
      const result = getDatePropControllerDataString(data)

      // Assert
      expect(result).toBe(date)
    })

    test('returns value for DatePropControllerDataV0 data', () => {
      // Arrange
      const data = new Date(Date.now()).toISOString()

      // Act
      const result = getDatePropControllerDataString(data)

      // Assert
      expect(result).toBe(data)
    })
  })

  describe('createDatePropControllerDataFromString', () => {
    test('returns DatePropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const date = new Date(Date.now()).toISOString()
      const definition: DateDescriptor = {
        type: Types.Date,
        version: 1,
        options: {},
      }

      // Act
      const result = createDatePropControllerDataFromString(date, definition)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: DatePropControllerDataV1Type,
        value: date,
      })
    })

    test('returns DatePropControllerDataV1 value when definition is undefined', () => {
      // Arrange
      const date = new Date(Date.now()).toISOString()

      // Act
      const result = createDatePropControllerDataFromString(date)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: DatePropControllerDataV1Type,
        value: date,
      })
    })

    test('returns string value when definition version is not 1', () => {
      // Arrange
      const date = new Date(Date.now()).toISOString()
      const definition: DateDescriptor = {
        type: Types.Date,
        options: {},
      }

      // Act
      const result = createDatePropControllerDataFromString(date, definition)

      // Assert
      expect(result).toBe(date)
    })
  })
})
