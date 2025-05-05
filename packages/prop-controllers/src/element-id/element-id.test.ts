import { ControlDataTypeKey, CopyContext, Types } from '../prop-controllers'
import {
  createClearContext,
  createReplacementContext,
} from '@makeswift/controls'
import {
  ElementIDDescriptor,
  ElementIDPropControllerDataV0,
  ElementIDPropControllerDataV1,
  ElementIDPropControllerDataV1Type,
  copyElementIDPropControllerData,
  createElementIDPropControllerDataFromElementID,
  getElementIDPropControllerDataElementID,
} from './element-id'

describe('ElementIDPropController', () => {
  describe('getElementIDPropControllerDataElementID', () => {
    test('returns value for ElementIDPropControllerDataV1Type', () => {
      // Arrange
      const elementID = 'test-id'
      const data: ElementIDPropControllerDataV1 = {
        [ControlDataTypeKey]: ElementIDPropControllerDataV1Type,
        value: elementID,
      }

      // Act
      const result = getElementIDPropControllerDataElementID(data)

      // Assert
      expect(result).toBe(elementID)
    })

    test('returns value for ElementIDPropControllerDataV0 data', () => {
      // Arrange
      const data = 'test-id'

      // Act
      const result = getElementIDPropControllerDataElementID(data)

      // Assert
      expect(result).toBe(data)
    })
  })

  describe('createElementIDPropControllerDataFromElementID', () => {
    test('returns ElementIDPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const elementID = 'test-id'
      const definition: ElementIDDescriptor = {
        type: Types.ElementID,
        version: 1,
        options: {},
      }

      // Act
      const result = createElementIDPropControllerDataFromElementID(
        elementID,
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: ElementIDPropControllerDataV1Type,
        value: elementID,
      })
    })

    test('returns string value when definition version is not 1', () => {
      // Arrange
      const elementID = 'test-id'
      const definition: ElementIDDescriptor = {
        type: Types.ElementID,
        options: {},
      }

      // Act
      const result = createElementIDPropControllerDataFromElementID(
        elementID,
        definition,
      )

      // Assert
      expect(result).toBe(elementID)
    })
  })

  describe('copyElementIDPropControllerData', () => {
    test('returns undefined when elementHtmlIds contains the input data', () => {
      // Arrange
      const data: ElementIDPropControllerDataV1 = {
        [ControlDataTypeKey]: ElementIDPropControllerDataV1Type,
        value: 'test-id',
      }
      const context: CopyContext = {
        replacementContext: createReplacementContext({
          elementHtmlIds: ['test-id'],
        }),
        clearContext: createClearContext(),
        copyElement: (el) => el,
      }

      // Act
      const result = copyElementIDPropControllerData(data, context)

      // Assert
      expect(result).toBeUndefined()
    })

    test('returns a new ElementIDPropControllerDataV1 with the same value when elementHtmlIds does not contain the input data', () => {
      // Arrange
      const data: ElementIDPropControllerDataV1 = {
        [ControlDataTypeKey]: ElementIDPropControllerDataV1Type,
        value: 'test-id',
      }
      const context: CopyContext = {
        replacementContext: createReplacementContext(),
        clearContext: createClearContext(),
        copyElement: (el) => el,
      }

      // Act
      const result = copyElementIDPropControllerData(data, context)

      // Assert
      expect(result).toEqual(data)
    })

    test('returns undefined on ElementIDPropControllerDataV0 when elementHtmlIds contains the id', () => {
      // Arrange
      const data: ElementIDPropControllerDataV0 = 'test-id'
      const context: CopyContext = {
        replacementContext: createReplacementContext({
          elementHtmlIds: ['test-id'],
        }),
        clearContext: createClearContext(),
        copyElement: (el) => el,
      }

      // Act
      const result = copyElementIDPropControllerData(data, context)

      // Assert
      expect(result).toBeUndefined()
    })

    test('returns the ElementIDPropControllerDataV0 data when elementHtmlIds does not contain the id', () => {
      // Arrange
      const data: ElementIDPropControllerDataV0 = 'test-id'
      const context: CopyContext = {
        replacementContext: createReplacementContext(),
        clearContext: createClearContext(),
        copyElement: (el) => el,
      }

      // Act
      const result = copyElementIDPropControllerData(data, context)

      // Assert
      expect(result).toBe(data)
    })
  })
})
