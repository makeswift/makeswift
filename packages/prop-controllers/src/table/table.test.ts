import { RemoveResourceTag, createReplacementContext } from '@makeswift/controls'
import { ControlDataTypeKey, Types } from '../prop-controllers'

import {
  TableDescriptor,
  TablePropControllerDataV0,
  TablePropControllerDataV1,
  TablePropControllerDataV1Type,
  copyTablePropControllerData,
  createTablePropControllerDataFromTableId,
  getTablePropControllerDataTableId,
  getTablePropControllerDataTableIds,
} from './table'

describe('TablePropController', () => {
  describe('getTablePropControllerDataTableId', () => {
    test('returns value for TablePropControllerDataV1Type', () => {
      // Arrange
      const tableId = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'
      const data: TablePropControllerDataV1 = {
        [ControlDataTypeKey]: TablePropControllerDataV1Type,
        value: tableId,
      }

      // Act
      const result = getTablePropControllerDataTableId(data)

      // Assert
      expect(result).toBe(tableId)
    })

    test('returns value for TablePropControllerDataV0 data', () => {
      // Arrange
      const data = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'

      // Act
      const result = getTablePropControllerDataTableId(data)

      // Assert
      expect(result).toBe(data)
    })
  })

  describe('createTablePropControllerDataFromTableId', () => {
    test('returns TablePropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const tableId = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'
      const definition: TableDescriptor = {
        type: Types.Table,
        version: 1,
        options: {},
      }

      // Act
      const result = createTablePropControllerDataFromTableId(
        tableId,
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: TablePropControllerDataV1Type,
        value: tableId,
      })
    })

    test('returns TablePropControllerDataV1 value when definition is undefined', () => {
      // Arrange
      const tableId = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'

      // Act
      const result = createTablePropControllerDataFromTableId(tableId)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: TablePropControllerDataV1Type,
        value: tableId,
      })
    })

    test('returns TableId value when definition version is not 1', () => {
      // Arrange
      const tableId = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'
      const definition: TableDescriptor = {
        type: Types.Table,
        options: {},
      }

      // Act
      const result = createTablePropControllerDataFromTableId(
        tableId,
        definition,
      )

      // Assert
      expect(result).toBe(tableId)
    })
  })

  describe('getTablePropControllerDataTableIds', () => {
    test('returns an empty array when value is undefined', () => {
      expect(getTablePropControllerDataTableIds(undefined)).toEqual([])
    })

    test('return the tableIds for v0 data type', () => {
      // Arrange
      const tableId = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'
      const data: TablePropControllerDataV0 = tableId

      expect(getTablePropControllerDataTableIds(data)).toEqual([tableId])
    })

    test('return the tableIds for v1 data type', () => {
      // Arrange
      const tableId = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'
      const data: TablePropControllerDataV1 = {
        [ControlDataTypeKey]: TablePropControllerDataV1Type,
        value: tableId,
      }

      expect(getTablePropControllerDataTableIds(data)).toEqual([tableId])
    })
  })

  describe('copyTablePropControllerData', () => {
    const tableId = 'VGFibGU6MTM5NDhlYzMtMjgwNS00Nzk0LTliNzctNDJkN2RhNmQxZWEy'

    describe('v0 data', () => {
      test('replaces table id', () => {
        // Arrange
        const data: TablePropControllerDataV0 = tableId
        const expected = JSON.parse(
          JSON.stringify(data).replaceAll(tableId, 'testing'),
        )

        // Act
        const result = copyTablePropControllerData(data, {
          replacementContext: createReplacementContext({
            tableIds: { [tableId]: 'testing' },
          }),
          copyElement: (node) => node,
        })

        // Assert
        expect(result).toEqual(expected)
      })

      test('removes table ID marked for removal', () => {
        // Arrange
        const data: TablePropControllerDataV0 = tableId

        // Act
        const result = copyTablePropControllerData(data, {
          replacementContext: createReplacementContext({
            tableIds: { [tableId]: RemoveResourceTag },
          }),
          copyElement: (node) => node,
        })

        // Assert
        expect(result).toEqual(undefined)
      })
    })

    describe('v1 data', () => {
      test('replaces the table id for v1 data', () => {
        // Arrange
        const data: TablePropControllerDataV1 = {
          [ControlDataTypeKey]: TablePropControllerDataV1Type,
          value: tableId,
        }
        const expected = JSON.parse(
          JSON.stringify(data).replaceAll(tableId, 'testing'),
        )

        // Act
        const result = copyTablePropControllerData(data, {
          replacementContext: createReplacementContext({
            tableIds: { [tableId]: 'testing' },
          }),
          copyElement: (node) => node,
        })

        // Assert
        expect(result).toEqual(expected)
      })

      test('removes table ID marked for removal', () => {
        // Arrange
        const data: TablePropControllerDataV1 = {
          [ControlDataTypeKey]: TablePropControllerDataV1Type,
          value: tableId,
        }

        // Act
        const result = copyTablePropControllerData(data, {
          replacementContext: createReplacementContext({
            tableIds: { [tableId]: RemoveResourceTag },
          }),
          copyElement: (node) => node,
        })

        // Assert
        expect(result).toEqual(undefined)
      })
    })
  })
})
