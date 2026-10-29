import { createReplacementContext } from '@makeswift/controls'
import { ControlDataTypeKey, CopyContext, Types } from '../prop-controllers'

import {
  ResponsiveBackgroundsData,
  BackgroundsDescriptor,
  BackgroundsPropControllerDataV2,
  BackgroundsPropControllerDataV2Type,
  BackgroundsPropControllerDataV3,
  BackgroundsPropControllerDataV3Type,
  backgroundsPropControllerDataSchema,
  copyBackgroundsPropControllerData,
  createBackgroundsPropControllerDataFromResponsiveBackgroundsData,
  getBackgroundsPropControllerDataResponsiveBackgroundsData,
  getBackgroundsPropControllerFileIds,
  BackgroundsPropControllerDataV1,
  getBackgroundsPropControllerSwatchIds,
} from './backgrounds'

const fileId = '[fileId]'

const backgroundsWith = <C>(
  color: (swatchId: string | null, alpha: number) => C,
) => [
  {
    deviceId: 'desktop',
    value: [
      {
        id: 'id',
        type: 'image-v1' as const,
        payload: {
          version: 1 as const,
          image: {
            id: fileId,
            type: 'makeswift-file' as const,
            version: 1 as const,
          },
          position: { x: 0, y: 0 },
        },
      },
      { id: '1', type: 'color' as const, payload: color('[swatch1]', 100) },
      {
        id: '2',
        type: 'gradient' as const,
        payload: {
          stops: [
            { id: 'stop1', location: 0, color: color('[swatch2]', 100) },
            { id: 'stop2', location: 100, color: color('[swatch3]', 100) },
          ],
        },
      },
      {
        id: '3',
        type: 'video' as const,
        payload: { maskColor: color('[swatch4]', 100) },
      },
      { id: '4', type: 'color' as const, payload: color(null, 0.5) },
      {
        id: '5',
        type: 'gradient' as const,
        payload: {
          stops: [{ id: 'stop1', location: 0, color: color(null, 0.6) }],
        },
      },
      {
        id: '6',
        type: 'video' as const,
        payload: { maskColor: color(null, 0.07) },
      },
    ],
  },
]

const backgrounds: BackgroundsPropControllerDataV1 = backgroundsWith(
  (swatchId, alpha) => ({ swatchId, alpha }),
)

const v1Data: BackgroundsPropControllerDataV1 = backgrounds
const v2Data: BackgroundsPropControllerDataV2 = {
  [ControlDataTypeKey]: BackgroundsPropControllerDataV2Type,
  value: backgrounds,
}

const inlineColor = {
  type: 'inline' as const,
  hue: 238,
  saturation: 87,
  lightness: 49,
  alpha: 0.5,
}

const backgroundsV2: ResponsiveBackgroundsData = backgroundsWith(
  (swatchId, alpha) => ({ type: 'swatch' as const, swatchId, alpha }),
)

const v3Data: BackgroundsPropControllerDataV3 = {
  [ControlDataTypeKey]: BackgroundsPropControllerDataV3Type,
  value: [
    {
      deviceId: 'desktop',
      value: [
        ...backgroundsV2[0].value,
        { id: '7', type: 'color', payload: inlineColor },
        {
          id: '8',
          type: 'gradient',
          payload: {
            stops: [{ id: 'stop1', location: 0, color: inlineColor }],
          },
        },
        { id: '9', type: 'video', payload: { maskColor: inlineColor } },
      ],
    },
  ],
}

describe('BackgroundsPropController', () => {
  describe('getBackgroundsPropControllerDataResponsiveBackgroundsData', () => {
    test('returns value for BackgroundsPropControllerDataV2Type', () => {
      // Arrange
      const backgrounds: BackgroundsPropControllerDataV1 = [
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
      expect(result).toEqual(backgrounds)
    })

    test.each([v1Data, v2Data])('reads v1 colors as swatch colors', (data) => {
      expect(
        getBackgroundsPropControllerDataResponsiveBackgroundsData(data),
      ).toEqual(backgroundsV2)
    })

    test('returns value for BackgroundsPropControllerDataV3Type', () => {
      // Act
      const result =
        getBackgroundsPropControllerDataResponsiveBackgroundsData(v3Data)

      // Assert
      expect(result).toBe(v3Data.value)
    })

    test('returns value for BackgroundsPropControllerDataV1 data', () => {
      // Arrange
      const backgrounds: BackgroundsPropControllerDataV1 = [
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
      expect(result).toEqual(backgrounds)
    })
  })

  describe('createBackgroundsPropControllerDataFromResponsiveBackgroundsData', () => {
    test('returns BackgroundsPropControllerDataV3 when definition version is 3', () => {
      // Arrange
      const definition: BackgroundsDescriptor = {
        type: Types.Backgrounds,
        version: 3,
        options: {},
      }

      // Act
      const result =
        createBackgroundsPropControllerDataFromResponsiveBackgroundsData(
          v3Data.value,
          definition,
        )

      // Assert
      expect(result).toEqual(v3Data)
    })

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
      expect(result).toEqual(backgrounds)
    })

    test('writes swatch colors as v2 data when definition version is 2', () => {
      expect(
        createBackgroundsPropControllerDataFromResponsiveBackgroundsData(
          backgroundsV2,
          { type: Types.Backgrounds, version: 2, options: {} },
        ),
      ).toEqual(v2Data)
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
      { version: 3, data: v3Data },
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
      { version: 3, data: v3Data },
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
      { version: 3 as const, data: v3Data },
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

  describe('backgroundsPropControllerDataSchema', () => {
    test('parses inline colors', () => {
      expect(backgroundsPropControllerDataSchema.safeParse(v3Data)).toEqual({
        success: true,
        data: v3Data,
      })
    })
  })
})
