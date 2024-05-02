import { CopyContext, MergeTranslatableDataContext } from '../state/react-page'
import { ControlDataTypeKey } from './control-data-type-key'
import {
  SlotControlDefinition,
  SlotControlDataV0,
  SlotControlDataV1,
  slotControlDataV1Type,
  copySlotControlData,
  createSlotControlDataFromSlotData,
  getSlotControlDataSlotData,
  getSlotControlElementChildren,
  getSlotControlGetElementPath,
  mergeSlotControlTranslatedData,
  SlotControlType,
} from './slot'
import { createReplacementContextHelper } from './utils'

describe('SlotControl', () => {
  describe('getSlotControlDataSlotData', () => {
    test('returns value for slotControlDataV1Type', () => {
      // Arrange
      const slotData = { elements: [], columns: [] }
      const data: SlotControlDataV1 = {
        [ControlDataTypeKey]: slotControlDataV1Type,
        value: slotData,
      }

      // Act
      const result = getSlotControlDataSlotData(data)

      // Assert
      expect(result).toBe(slotData)
    })

    test('returns value for SlotControlDataV0 data', () => {
      // Arrange
      const data = { elements: [], columns: [] }

      // Act
      const result = getSlotControlDataSlotData(data)

      // Assert
      expect(result).toBe(data)
    })
  })

  describe('createSlotControlDataFromSlotData', () => {
    test('returns SlotControlDataV1 when definition version is 1', () => {
      // Arrange
      const slotData = { elements: [], columns: [] }
      const definition: SlotControlDefinition = {
        type: SlotControlType,
        version: 1,
      }

      // Act
      const result = createSlotControlDataFromSlotData(slotData, definition)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: slotControlDataV1Type,
        value: slotData,
      })
    })

    test('returns slotData value when definition version is not 1', () => {
      // Arrange
      const slotData = { elements: [], columns: [] }
      const definition: SlotControlDefinition = {
        type: SlotControlType,
      }

      // Act
      const result = createSlotControlDataFromSlotData(slotData, definition)

      // Assert
      expect(result).toBe(slotData)
    })
  })

  describe('mergeSlotControlTranslatedData', () => {
    test('merges translated data for slotControlDataV1Type', () => {
      // Arrange
      const data: SlotControlDataV1 = {
        [ControlDataTypeKey]: slotControlDataV1Type,
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
        mergeTranslatedData: el => ({
          ...el,
          props: {
            text: 'translated text',
          },
        }),
      }

      // Act
      const result = mergeSlotControlTranslatedData(data, context)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: slotControlDataV1Type,
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

    test('merges translated data for SlotControlDataV0', () => {
      // Arrange
      const data: SlotControlDataV0 = {
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
        mergeTranslatedData: el => ({
          ...el,
          props: {
            text: 'translated text',
          },
        }),
      }

      // Act
      const result = mergeSlotControlTranslatedData(data, context)

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

  describe('getSlotControlElementChildren', () => {
    test('returns elements array from SlotControlDataV1', () => {
      // Arrange
      const elements = [
        { key: 'element1', type: 'element1', props: {} },
        { key: 'element2', type: 'element2', props: {} },
      ]
      const data: SlotControlDataV1 = {
        [ControlDataTypeKey]: slotControlDataV1Type,
        value: {
          elements,
          columns: [],
        },
      }

      // Act
      const result = getSlotControlElementChildren(data)

      // Assert
      expect(result).toEqual(elements)
    })

    test('returns elements array from SlotControlDataV0', () => {
      // Arrange
      const elements = [
        { key: 'element1', type: 'element1', props: {} },
        { key: 'element2', type: 'element2', props: {} },
      ]
      const data: SlotControlDataV0 = {
        elements,
        columns: [],
      }

      // Act
      const result = getSlotControlElementChildren(data)

      // Assert
      expect(result).toEqual(elements)
    })

    test('returns empty array when data is undefined', () => {
      // Act
      const result = getSlotControlElementChildren(undefined)

      // Assert
      expect(result).toEqual([])
    })
  })

  describe('copySlotControlData', () => {
    test('copies SlotControlDataV1 data', () => {
      // Arrange
      const data: SlotControlDataV1 = {
        [ControlDataTypeKey]: slotControlDataV1Type,
        value: {
          elements: [{ key: 'element1', type: 'element1', props: {} }],
          columns: [],
        },
      }
      const context: CopyContext = {
        replacementContext: createReplacementContextHelper(),
        copyElement: el => ({ ...el, key: 'copiedElement' }),
      }

      // Act
      const result = copySlotControlData(data, context)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: slotControlDataV1Type,
        value: {
          elements: [{ key: 'copiedElement', type: 'element1', props: {} }],
          columns: [],
        },
      })
    })

    test('copies SlotControlDataV0 data', () => {
      // Arrange
      const data: SlotControlDataV0 = {
        elements: [{ key: 'element1', type: 'element1', props: {} }],
        columns: [],
      }
      const context: CopyContext = {
        replacementContext: createReplacementContextHelper(),
        copyElement: el => ({ ...el, key: 'copiedElement' }),
      }

      // Act
      const result = copySlotControlData(data, context)

      // Assert
      expect(result).toEqual({
        elements: [{ key: 'copiedElement', type: 'element1', props: {} }],
        columns: [],
      })
    })
  })

  describe('getSlotControlGetElementPath', () => {
    test('returns correct path for slotControlDataV1Type when element exists', () => {
      // Arrange
      const data: SlotControlDataV1 = {
        [ControlDataTypeKey]: slotControlDataV1Type,
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
      const result = getSlotControlGetElementPath(data, elementKey)

      // Assert
      expect(result).toEqual(['value', 'elements', 1])
    })

    test('returns correct path for SlotControlDataV0 when element exists', () => {
      // Arrange
      const data: SlotControlDataV0 = {
        elements: [
          { key: 'element1', type: 'element1', props: {} },
          { key: 'element2', type: 'element2', props: {} },
        ],
        columns: [],
      }
      const elementKey = 'element1'

      // Act
      const result = getSlotControlGetElementPath(data, elementKey)

      // Assert
      expect(result).toEqual(['elements', 0])
    })

    test('returns null when element does not exist', () => {
      // Arrange
      const data: SlotControlDataV1 = {
        [ControlDataTypeKey]: slotControlDataV1Type,
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
      const result = getSlotControlGetElementPath(data, elementKey)

      // Assert
      expect(result).toBeNull()
    })
  })
})
