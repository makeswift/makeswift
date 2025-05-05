import {
  createClearContext,
  createReplacementContext,
} from '@makeswift/controls'
import { ControlDataTypeKey, CopyContext, Types } from '../prop-controllers'

import {
  ResponsiveBackgroundsData,
  BackgroundsDescriptor,
  BackgroundsPropControllerDataV2,
  BackgroundsPropControllerDataV2Type,
  copyBackgroundsPropControllerData,
  createBackgroundsPropControllerDataFromResponsiveBackgroundsData,
  getBackgroundsPropControllerDataResponsiveBackgroundsData,
  getBackgroundsPropControllerFileIds,
  BackgroundsPropControllerDataV1,
  getBackgroundsPropControllerSwatchIds,
} from './backgrounds'

describe('BackgroundsPropController', () => {
  describe('getBackgroundsPropControllerDataResponsiveBackgroundsData', () => {
    test('returns value for BackgroundsPropControllerDataV2Type', () => {
      // Arrange
      const backgrounds: ResponsiveBackgroundsData = [
        {
          deviceId: 'desktop',
          value: [
            {
              type: 'color',
              id: 'color-id',
              payload: null,
            },
          ],
        },
      ]
      const data: BackgroundsPropControllerDataV2 = {
        [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type,
        value: backgrounds,
      }

      // Act
      const result =
        getBackgroundsPropControllerDataResponsiveBackgroundsData(data)

      // Assert
      expect(result).toBe(backgrounds)
    })

    test('returns value for BackgroundsPropControllerDataV1 data', () => {
      // Arrange
      const backgrounds: ResponsiveBackgroundsData = [
        {
          deviceId: 'desktop',
          value: [
            {
              type: 'color',
              id: 'color-id',
              payload: null,
            },
          ],
        },
      ]

      // Act
      const result =
        getBackgroundsPropControllerDataResponsiveBackgroundsData(backgrounds)

      // Assert
      expect(result).toBe(backgrounds)
    })
  })

  describe('createBackgroundsPropControllerDataFromResponsiveBackgroundsData', () => {
    test('returns BackgroundsPropControllerDataV2 when definition version is 2', () => {
      // Arrange
      const backgrounds: ResponsiveBackgroundsData = [
        {
          deviceId: 'desktop',
          value: [
            {
              type: 'color',
              id: 'color-id',
              payload: null,
            },
          ],
        },
      ]
      const definition: BackgroundsDescriptor = {
        type: Types.Backgrounds,
        version: 2,
        options: {},
      }

      // Act
      const result =
        createBackgroundsPropControllerDataFromResponsiveBackgroundsData(
          backgrounds,
          definition,
        )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type,
        value: backgrounds,
      })
    })

    test('returns ResponsiveBackgroundsData when definition version is 1', () => {
      // Arrange
      const backgrounds: ResponsiveBackgroundsData = [
        {
          deviceId: 'desktop',
          value: [
            {
              type: 'color',
              id: 'color-id',
              payload: null,
            },
          ],
        },
      ]
      const definition: BackgroundsDescriptor = {
        type: Types.Backgrounds,
        version: 1,
        options: {},
      }

      // Act
      const result =
        createBackgroundsPropControllerDataFromResponsiveBackgroundsData(
          backgrounds,
          definition,
        )

      // Assert
      expect(result).toBe(backgrounds)
    })
  })

  describe('getBackgroundsPropControllerFileIds', () => {
    test('returns empty array for undefined data', () => {
      // Arrange
      const data = undefined

      // Act
      const result = getBackgroundsPropControllerFileIds(data)

      // Assert
      expect(result).toEqual([])
    })

    test('returns array with id for v1 data', () => {
      // Arrange
      const fileId = 'fileId'
      const data: ResponsiveBackgroundsData = [
        {
          deviceId: 'desktop',
          value: [
            {
              id: 'id',
              type: 'image-v1',
              payload: {
                version: 1,
                image: { id: fileId, type: 'makeswift-file', version: 1 },
                position: { x: 0, y: 0 },
              },
            },
          ],
        },
      ]

      // Act
      const result = getBackgroundsPropControllerFileIds(data)

      // Assert
      expect(result).toEqual([fileId])
    })

    test('returns array with id for v2 data', () => {
      // Arrange
      const fileId = 'fileId'
      const backgrounds: ResponsiveBackgroundsData = [
        {
          deviceId: 'desktop',
          value: [
            {
              id: 'id',
              type: 'image-v1',
              payload: {
                version: 1,
                image: { id: fileId, type: 'makeswift-file', version: 1 },
                position: { x: 0, y: 0 },
              },
            },
          ],
        },
      ]
      const data: BackgroundsPropControllerDataV2 = {
        [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type,
        value: backgrounds,
      }

      // Act
      const result = getBackgroundsPropControllerFileIds(data)

      // Assert
      expect(result).toEqual([fileId])
    })
  })

  describe('getBackgroundsPropControllerSwatchIds', () => {
    test('returns empty array for undefined data', () => {
      // Arrange
      const data = undefined

      // Act
      const result = getBackgroundsPropControllerSwatchIds(data)

      // Assert
      expect(result).toEqual([])
    })

    test('returns array with swatch id for v2 color background', () => {
      // Arrange
      const swatchId = 'swatchId'
      const data: BackgroundsPropControllerDataV2 = {
        [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type,
        value: [
          {
            deviceId: 'desktop',
            value: [
              {
                id: 'id',
                type: 'color',
                payload: { swatchId, alpha: 100 },
              },
            ],
          },
        ],
      }

      // Act
      const result = getBackgroundsPropControllerSwatchIds(data)

      // Assert
      expect(result).toEqual([swatchId])
    })

    test('returns array with swatch id for v1 color background', () => {
      // Arrange
      const swatchId = 'swatchId'
      const data: BackgroundsPropControllerDataV1 = [
        {
          deviceId: 'desktop',
          value: [
            {
              id: 'id',
              type: 'color',
              payload: { swatchId, alpha: 100 },
            },
          ],
        },
      ]

      // Act
      const result = getBackgroundsPropControllerSwatchIds(data)

      // Assert
      expect(result).toEqual([swatchId])
    })
  })

  describe('copyBackgroundsPropControllerData', () => {
    test('returns copied BackgroundsPropControllerDataV2 when data is BackgroundsPropControllerDataV2', () => {
      // Arrange
      const descriptor: BackgroundsDescriptor = {
        type: Types.Backgrounds,
        version: 2,
        options: {},
      }
      const fileId = 'fileId'
      const data: BackgroundsPropControllerDataV2 = {
        [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type,
        value: [
          {
            deviceId: 'desktop',
            value: [
              {
                id: 'id',
                type: 'image-v1',
                payload: {
                  version: 1,
                  image: { id: fileId, type: 'makeswift-file', version: 1 },
                  position: { x: 0, y: 0 },
                },
              },
            ],
          },
        ],
      }
      const copiedId = 'copiedId'
      const expected = JSON.parse(
        JSON.stringify(data).replaceAll(fileId, copiedId),
      )
      const context: CopyContext = {
        replacementContext: createReplacementContext({
          fileIds: { [fileId]: copiedId },
        }),
        clearContext: createClearContext({}),
        copyElement: (el) => el,
      }

      // Act
      const result = copyBackgroundsPropControllerData(
        descriptor,
        data,
        context,
      )

      // Assert
      expect(result).toEqual(expected)
    })

    test('returns copied ResponsiveBackgroundsDataV1 when data is ResponsiveBackgroundsDataV1', () => {
      // Arrange
      const descriptor: BackgroundsDescriptor = {
        type: Types.Backgrounds,
        version: 1,
        options: {},
      }
      const fileId = 'fileId'
      const data: BackgroundsPropControllerDataV1 = [
        {
          deviceId: 'desktop',
          value: [
            {
              id: 'id',
              type: 'image-v1',
              payload: {
                version: 1,
                image: { id: fileId, type: 'makeswift-file', version: 1 },
                position: { x: 0, y: 0 },
              },
            },
          ],
        },
      ]
      const copiedId = 'copiedId'
      const expected = JSON.parse(
        JSON.stringify(data).replaceAll(fileId, copiedId),
      )
      const context: CopyContext = {
        replacementContext: createReplacementContext({
          fileIds: { [fileId]: copiedId },
        }),
        clearContext: createClearContext({}),
        copyElement: (el) => el,
      }

      // Act
      const result = copyBackgroundsPropControllerData(
        descriptor,
        data,
        context,
      )

      // Assert
      expect(result).toEqual(expected)
    })
  })
})
