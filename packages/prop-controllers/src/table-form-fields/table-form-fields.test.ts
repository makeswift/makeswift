import {
  createClearContext,
  createReplacementContext,
} from '@makeswift/controls'
import { ControlDataTypeKey, CopyContext, Types } from '../prop-controllers'

import {
  TableFormFieldsDescriptor,
  TableFormFieldsPropControllerDataV0,
  TableFormFieldsPropControllerDataV1,
  TableFormFieldsPropControllerDataV1Type,
  copyTableFormFieldsPropControllerData,
  createTableFormFieldsPropControllerDataFromTableFormFieldsData,
  getTableFormFieldsPropControllerDataTableFormFieldsData,
} from './table-form-fields'

describe('TableFormFieldsPropController', () => {
  describe('getTableFormFieldsPropControllerDataTableFormFieldsData', () => {
    test('returns value for TableFormFieldsPropControllerDataV1Type', () => {
      // Arrange
      const tableFormFields = {
        fields: [{ id: '1', tableColumnId: 'tableColumnId' }],
        grid: [],
      }
      const data: TableFormFieldsPropControllerDataV1 = {
        [ControlDataTypeKey]: TableFormFieldsPropControllerDataV1Type,
        value: tableFormFields,
      }

      // Act
      const result =
        getTableFormFieldsPropControllerDataTableFormFieldsData(data)

      // Assert
      expect(result).toBe(tableFormFields)
    })

    test('returns value for TableFormFieldsPropControllerDataV0 data', () => {
      // Arrange
      const data = {
        fields: [{ id: '1', tableColumnId: 'tableColumnId' }],
        grid: [],
      }

      // Act
      const result =
        getTableFormFieldsPropControllerDataTableFormFieldsData(data)

      // Assert
      expect(result).toBe(data)
    })
  })

  describe('createTableFormFieldsPropControllerDataFromTableFormFieldsData', () => {
    test('returns TableFormFieldsPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const tableFormFields = {
        fields: [{ id: '1', tableColumnId: 'tableColumnId' }],
        grid: [],
      }
      const definition: TableFormFieldsDescriptor = {
        type: Types.TableFormFields,
        version: 1,
        options: {},
      }

      // Act
      const result =
        createTableFormFieldsPropControllerDataFromTableFormFieldsData(
          tableFormFields,
          definition,
        )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: TableFormFieldsPropControllerDataV1Type,
        value: tableFormFields,
      })
    })

    test('returns string value when definition version is not 1', () => {
      // Arrange
      const tableFormFields = {
        fields: [{ id: '1', tableColumnId: 'tableColumnId' }],
        grid: [],
      }
      const definition: TableFormFieldsDescriptor = {
        type: Types.TableFormFields,
        options: {},
      }

      // Act
      const result =
        createTableFormFieldsPropControllerDataFromTableFormFieldsData(
          tableFormFields,
          definition,
        )

      // Assert
      expect(result).toBe(tableFormFields)
    })
  })
})

describe('copyTableFormFieldsPropControllerData', () => {
  test('returns copied TableFormFieldsPropControllerDataV1 when data is TableFormFieldsPropControllerDataV1', () => {
    // Arrange
    const tableFormFields = {
      fields: [{ id: '1', tableColumnId: 'oldTableColumnId' }],
      grid: [],
    }
    const data: TableFormFieldsPropControllerDataV1 = {
      [ControlDataTypeKey]: TableFormFieldsPropControllerDataV1Type,
      value: tableFormFields,
    }
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        tableColumnIds: { oldTableColumnId: 'newTableColumnId' },
      }),
      clearContext: createClearContext(),
      copyElement: (el) => el,
    }
    const expected = JSON.parse(
      JSON.stringify(data).replaceAll('oldTableColumnId', 'newTableColumnId'),
    )

    // Act
    const result = copyTableFormFieldsPropControllerData(data, context)

    // Assert
    expect(result).toEqual(expected)
  })

  test('returns copied TableFormFieldsPropControllerDataV0 when data is TableFormFieldsPropControllerDataV0', () => {
    // Arrange
    const tableFormFields = {
      fields: [{ id: '1', tableColumnId: 'oldTableColumnId' }],
      grid: [],
    }
    const data: TableFormFieldsPropControllerDataV0 = tableFormFields
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        tableColumnIds: { oldTableColumnId: 'newTableColumnId' },
      }),
      clearContext: createClearContext(),
      copyElement: (el) => el,
    }
    const expected = JSON.parse(
      JSON.stringify(data).replaceAll('oldTableColumnId', 'newTableColumnId'),
    )

    // Act
    const result = copyTableFormFieldsPropControllerData(data, context)

    // Assert
    expect(result).toEqual(expected)
  })
})
