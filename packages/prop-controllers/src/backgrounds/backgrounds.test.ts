import { createReplacementContext } from '@makeswift/controls'
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

const fileId = '[fileId]'
const backgrounds: BackgroundsPropControllerDataV1 = [
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
      {
        id: '1',
        type: 'color',
        payload: { swatchId: '[swatch1]', alpha: 100 },
      },
      {
        id: '2',
        type: 'gradient',
        payload: {
          stops: [
            {
              id: 'stop1',
              location: 0,
              color: { swatchId: '[swatch2]', alpha: 100 },
            },
            {
              id: 'stop2',
              location: 100,
              color: { swatchId: '[swatch3]', alpha: 100 },
            },
          ],
        },
      },
      {
        id: '3',
        type: 'video',
        payload: { maskColor: { swatchId: '[swatch4]', alpha: 100 } },
      },
      {
        id: '4',
        type: 'color',
        payload: { swatchId: null, alpha: 0.5 },
      },
      {
        id: '5',
        type: 'gradient',
        payload: {
          stops: [
            {
              id: 'stop1',
              location: 0,
              color: { swatchId: null, alpha: 0.6 },
            },
          ],
        },
      },
      {
        id: '6',
        type: 'video',
        payload: { maskColor: { swatchId: null, alpha: 0.07 } },
      },
    ],
  },
]

const v1Data: BackgroundsPropControllerDataV1 = backgrounds
const v2Data: BackgroundsPropControllerDataV2 = {
  [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type,
  value: backgrounds,
}

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

    test.each([
      { version: 1, data: v1Data },
      { version: 2, data: v2Data },
    ])('returns array with id for v$version data', ({ data }) => {
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

    test.each([
      { version: 1, data: v1Data },
      { version: 2, data: v2Data },
    ])(
      'returns array with swatch ids for v$version color background',
      ({ data }) => {
        // Act
        const result = getBackgroundsPropControllerSwatchIds(data)

        // Assert
        expect(result).toEqual([
          '[swatch1]',
          '[swatch2]',
          '[swatch3]',
          '[swatch4]',
        ])
      },
    )
  })

  describe('copyBackgroundsPropControllerData', () => {
    test.each([
      { version: 1 as const, data: v1Data },
      { version: 2 as const, data: v2Data },
    ])('returns copied v$version when data', ({ data, version }) => {
      // Arrange
      const descriptor: BackgroundsDescriptor = {
        type: Types.Backgrounds,
        version,
        options: {},
      }

      const copiedFileId = '[newfileId]'
      const expected = JSON.parse(
        JSON.stringify(data)
          .replaceAll(fileId, copiedFileId)
          .replaceAll('[swatch1]', '[newSwatch1]')
          .replaceAll('[swatch2]', '[newSwatch2]')
          .replaceAll('[swatch3]', '[newSwatch3]')
          .replaceAll('[swatch4]', '[newSwatch4]'),
      )

      const context: CopyContext = {
        replacementContext: createReplacementContext({
          swatchIds: {
            '[swatch1]': '[newSwatch1]',
            '[swatch2]': '[newSwatch2]',
            '[swatch3]': '[newSwatch3]',
            '[swatch4]': '[newSwatch4]',
          },
          fileIds: { [fileId]: copiedFileId },
        }),
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
