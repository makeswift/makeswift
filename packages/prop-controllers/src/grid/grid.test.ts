import {
  ControlDataTypeKey,
  CopyContext,
  MergeTranslatableDataContext,
  Types,
} from '../prop-controllers'
import { createReplacementContext } from '../utils/utils'
import {
  GridDescriptor,
  GridPropControllerDataV0,
  GridPropControllerDataV1,
  GridPropControllerDataV1Type,
  copyGridPropControllerData,
  createGridPropControllerDataFromGridData,
  getGridPropControllerDataGridData,
  getGridPropControllerElementChildren,
  getGridPropControllerGetElementPath,
  mergeGridPropControllerTranslatedData,
} from './grid'

describe('GridPropController', () => {
  describe('getGridPropControllerDataGridData', () => {
    test('returns value for GridPropControllerDataV1Type', () => {
      // Arrange
      const gridData = { elements: [], columns: [] }
      const data: GridPropControllerDataV1 = {
        [ControlDataTypeKey]: GridPropControllerDataV1Type,
        value: gridData,
      }

      // Act
      const result = getGridPropControllerDataGridData(data)

      // Assert
      expect(result).toBe(gridData)
    })

    test('returns value for GridPropControllerDataV0 data', () => {
      // Arrange
      const data = { elements: [], columns: [] }

      // Act
      const result = getGridPropControllerDataGridData(data)

      // Assert
      expect(result).toBe(data)
    })
  })

  describe('createGridPropControllerDataFromGridData', () => {
    test('returns GridPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const gridData = { elements: [], columns: [] }
      const definition: GridDescriptor = {
        type: Types.Grid,
        version: 1,
        options: {},
      }

      // Act
      const result = createGridPropControllerDataFromGridData(
        gridData,
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: GridPropControllerDataV1Type,
        value: gridData,
      })
    })

    test('returns gridData value when definition version is not 1', () => {
      // Arrange
      const gridData = { elements: [], columns: [] }
      const definition: GridDescriptor = {
        type: Types.Grid,
        options: {},
      }

      // Act
      const result = createGridPropControllerDataFromGridData(
        gridData,
        definition,
      )

      // Assert
      expect(result).toBe(gridData)
    })
  })

  describe('mergeGridPropControllerTranslatedData', () => {
    test('merges translated data for GridPropControllerDataV1Type', () => {
      // Arrange
      const data: GridPropControllerDataV1 = {
        [ControlDataTypeKey]: GridPropControllerDataV1Type,
        value: {
          elements: [
            {
              key: 'element1',
              type: 'element1',
              props: { text: 'text' },
            },
          ],
          columns: [],
        },
      }
      const context: MergeTranslatableDataContext = {
        translatedData: {},
        mergeTranslatedData: (el) => ({
          ...el,
          props: {
            text: 'translated text',
          },
        }),
      }

      // Act
      const result = mergeGridPropControllerTranslatedData(data, context)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: GridPropControllerDataV1Type,
        value: {
          elements: [
            {
              key: 'element1',
              type: 'element1',
              props: {
                text: 'translated text',
              },
            },
          ],
          columns: [],
        },
      })
    })

    test('merges translated data for GridPropControllerDataV0', () => {
      // Arrange
      const data: GridPropControllerDataV0 = {
        elements: [
          {
            key: 'element1',
            type: 'element1',
            props: { text: 'text' },
          },
        ],
        columns: [],
      }
      const context: MergeTranslatableDataContext = {
        translatedData: {},
        mergeTranslatedData: (el) => ({
          ...el,
          props: {
            text: 'translated text',
          },
        }),
      }

      // Act
      const result = mergeGridPropControllerTranslatedData(data, context)

      // Assert
      expect(result).toEqual({
        elements: [
          {
            key: 'element1',
            type: 'element1',
            props: {
              text: 'translated text',
            },
          },
        ],
        columns: [],
      })
    })
  })

  describe('getGridPropControllerElementChildren', () => {
    test('returns elements array from GridPropControllerDataV1', () => {
      // Arrange
      const elements = [
        { key: 'element1', type: 'element1', props: {} },
        { key: 'element2', type: 'element2', props: {} },
      ]
      const data: GridPropControllerDataV1 = {
        [ControlDataTypeKey]: GridPropControllerDataV1Type,
        value: {
          elements,
          columns: [],
        },
      }

      // Act
      const result = getGridPropControllerElementChildren(data)

      // Assert
      expect(result).toEqual(elements)
    })

    test('returns elements array from GridPropControllerDataV0', () => {
      // Arrange
      const elements = [
        { key: 'element1', type: 'element1', props: {} },
        { key: 'element2', type: 'element2', props: {} },
      ]
      const data: GridPropControllerDataV0 = {
        elements,
        columns: [],
      }

      // Act
      const result = getGridPropControllerElementChildren(data)

      // Assert
      expect(result).toEqual(elements)
    })

    test('returns empty array when data is undefined', () => {
      // Act
      const result = getGridPropControllerElementChildren(undefined)

      // Assert
      expect(result).toEqual([])
    })
  })

  describe('copyGridPropControllerData', () => {
    test('copies GridPropControllerDataV1 data', () => {
      // Arrange
      const data: GridPropControllerDataV1 = {
        [ControlDataTypeKey]: GridPropControllerDataV1Type,
        value: {
          elements: [{ key: 'element1', type: 'element1', props: {} }],
          columns: [],
        },
      }
      const context: CopyContext = {
        replacementContext: createReplacementContext(),
        copyElement: (el) => ({ ...el, key: 'copiedElement' }),
      }

      // Act
      const result = copyGridPropControllerData(data, context)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: GridPropControllerDataV1Type,
        value: {
          elements: [{ key: 'copiedElement', type: 'element1', props: {} }],
          columns: [],
        },
      })
    })

    test('copies GridPropControllerDataV0 data', () => {
      // Arrange
      const data: GridPropControllerDataV0 = {
        elements: [{ key: 'element1', type: 'element1', props: {} }],
        columns: [],
      }
      const context: CopyContext = {
        replacementContext: createReplacementContext(),
        copyElement: (el) => ({ ...el, key: 'copiedElement' }),
      }

      // Act
      const result = copyGridPropControllerData(data, context)

      // Assert
      expect(result).toEqual({
        elements: [{ key: 'copiedElement', type: 'element1', props: {} }],
        columns: [],
      })
    })
  })

  describe('getGridPropControllerGetElementPath', () => {
    test('returns correct path for GridPropControllerDataV1Type when element exists', () => {
      // Arrange
      const data: GridPropControllerDataV1 = {
        [ControlDataTypeKey]: GridPropControllerDataV1Type,
        value: {
          elements: [
            { key: 'element1', type: 'element1', props: {} },
            { key: 'element2', type: 'element2', props: {} },
          ],
          columns: [],
        },
      }
      const elementKey = 'element2'

      // Act
      const result = getGridPropControllerGetElementPath(data, elementKey)

      // Assert
      expect(result).toEqual(['value', 'elements', 1])
    })

    test('returns correct path for GridPropControllerDataV0 when element exists', () => {
      // Arrange
      const data: GridPropControllerDataV0 = {
        elements: [
          { key: 'element1', type: 'element1', props: {} },
          { key: 'element2', type: 'element2', props: {} },
        ],
        columns: [],
      }
      const elementKey = 'element1'

      // Act
      const result = getGridPropControllerGetElementPath(data, elementKey)

      // Assert
      expect(result).toEqual(['elements', 0])
    })

    test('returns null when element does not exist', () => {
      // Arrange
      const data: GridPropControllerDataV1 = {
        [ControlDataTypeKey]: GridPropControllerDataV1Type,
        value: {
          elements: [
            { key: 'element1', type: 'element1', props: {} },
            { key: 'element2', type: 'element2', props: {} },
          ],
          columns: [],
        },
      }
      const elementKey = 'nonExistentElement'

      // Act
      const result = getGridPropControllerGetElementPath(data, elementKey)

      // Assert
      expect(result).toBeNull()
    })
  })
})
