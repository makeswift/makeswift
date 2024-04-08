import { describe, expect, test } from '@jest/globals'

import { ControlDataTypeKey, ReplacementContext } from '../prop-controllers'
import {
  BorderPropControllerDataV0,
  BorderPropControllerDataV1,
  BorderPropControllerDataV1Type,
  copyBorderPropControllerData,
  getBorderPropControllerDataResponsiveBorderData,
  getBorderPropControllerDataSwatchIds,
} from './border'
import { createReplacementContext } from '../utils/utils'

describe('BorderPropController', () => {
  describe('getBorderPropControllerDataResponsiveBorderData', () => {
    test('returns value for BorderPropControllerDataV1Type', () => {
      // Arrange
      const data: BorderPropControllerDataV1 = {
        [ControlDataTypeKey]: BorderPropControllerDataV1Type,
        value: [
          {
            deviceId: 'desktop',
            value: {
              borderTop: {
                width: 1,
                style: 'solid',
              },
              borderRight: null,
              borderBottom: null,
              borderLeft: null,
            },
          },
        ],
      }

      // Act
      const result = getBorderPropControllerDataResponsiveBorderData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('returns value for BorderPropControllerDataV0 data', () => {
      // Arrange
      const data: BorderPropControllerDataV0 = [
        {
          deviceId: 'desktop',
          value: {
            borderTop: {
              width: 1,
              style: 'solid',
            },
            borderRight: null,
            borderBottom: null,
            borderLeft: null,
          },
        },
      ]

      // Act
      const result = getBorderPropControllerDataResponsiveBorderData(data)

      // Assert
      expect(result).toEqual(data)
    })

    test('returns value for unknown data', () => {
      // Arrange
      const data = {
        test: 'unknown',
      }

      // Act
      // @ts-expect-error: invalid data
      const result = getBorderPropControllerDataResponsiveBorderData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('getBorderPropControllerDataSwatchIds', () => {
    test('returns an empty array when value is undefined', () => {
      expect(getBorderPropControllerDataSwatchIds(undefined)).toEqual([])
    })

    test('return the swatchIds for v0 data type', () => {
      // Arrange
      const swatchId1 = 'swatchId1'
      const swatchId2 = 'swatchId2'
      const data: BorderPropControllerDataV0 = [
        {
          value: {
            borderTop: {
              color: { alpha: 1, swatchId: swatchId1 },
              style: 'solid',
              width: 1,
            },
            borderLeft: {
              color: { alpha: 1, swatchId: swatchId2 },
              style: 'solid',
              width: 2,
            },
            borderRight: null,
            borderBottom: null,
          },
          deviceId: 'desktop',
        },
      ]

      expect(getBorderPropControllerDataSwatchIds(data)).toEqual([
        swatchId1,
        swatchId2,
      ])
    })

    test('return the swatchIds for v1 data type', () => {
      // Arrange
      const swatchId1 = 'swatchId1'
      const swatchId2 = 'swatchId2'
      const data: BorderPropControllerDataV1 = {
        [ControlDataTypeKey]: BorderPropControllerDataV1Type,
        value: [
          {
            value: {
              borderTop: {
                color: { alpha: 1, swatchId: swatchId1 },
                style: 'solid',
                width: 1,
              },
              borderLeft: {
                color: { alpha: 1, swatchId: swatchId2 },
                style: 'solid',
                width: 2,
              },
              borderRight: null,
              borderBottom: null,
            },
            deviceId: 'desktop',
          },
        ],
      }

      expect(getBorderPropControllerDataSwatchIds(data)).toEqual([
        swatchId1,
        swatchId2,
      ])
    })
  })

  describe('copyBorderPropControllerData', () => {
    test('replaces the swatch id for v0 data', () => {
      // Arrange
      const swatchId =
        'U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg=='

      const data: BorderPropControllerDataV0 = [
        {
          value: {
            borderTop: {
              color: { alpha: 1, swatchId },
              style: 'solid',
              width: 1,
            },
            borderLeft: {
              color: { alpha: 1, swatchId },
              style: 'solid',
              width: 1,
            },
            borderRight: null,
            borderBottom: null,
          },
          deviceId: 'desktop',
        },
      ]
      const expected = JSON.parse(
        JSON.stringify(data).replaceAll(swatchId, 'testing'),
      )
      const replacementContext = createReplacementContext({
        swatchIds: new Map([[swatchId, 'testing']]),
      })

      // Act
      const result = copyBorderPropControllerData(data, {
        replacementContext: replacementContext as ReplacementContext,
        copyElement: (node) => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })

    test('replaces the swatch id for v1 data', () => {
      // Arrange
      const swatchId =
        'U3dhdGNoOjgwMmNmZGMyLTc5ZDgtNDkyNy1hMDUwLWE1NmM1M2EzYzE0Mg=='

      const data: BorderPropControllerDataV1 = {
        [ControlDataTypeKey]: BorderPropControllerDataV1Type,
        value: [
          {
            value: {
              borderTop: {
                color: { alpha: 1, swatchId },
                style: 'solid',
                width: 1,
              },
              borderLeft: {
                color: { alpha: 1, swatchId },
                style: 'solid',
                width: 1,
              },
              borderRight: null,
              borderBottom: null,
            },
            deviceId: 'desktop',
          },
        ],
      }
      const expected = JSON.parse(
        JSON.stringify(data).replaceAll(swatchId, 'testing'),
      )
      const replacementContext = createReplacementContext({
        swatchIds: new Map([[swatchId, 'testing']]),
      })

      // Act
      const result = copyBorderPropControllerData(data, {
        replacementContext: replacementContext as ReplacementContext,
        copyElement: (node) => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })
  })
})
