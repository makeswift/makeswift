import { ControlDataTypeKey, CopyContext, Types } from '../prop-controllers'
import { createReplacementContext } from '../utils/utils'
import {
  ImagesData,
  ImagesDataV0,
  ImagesDescriptor,
  ImagesPropControllerDataV2,
  ImagesPropControllerDataV2Type,
  copyImagesPropControllerData,
  createImagesPropControllerDataFromImagesData,
  getImagesPropControllerDataImagesData,
  getImagesPropControllerFileIds,
} from './images'

describe('ImagesPropController', () => {
  describe('getImagesPropControllerDataImagesData', () => {
    test('returns value for ImagesPropControllerDataV2Type', () => {
      // Arrange
      const images: ImagesData = [
        {
          key: 'key',
          version: 1,
          props: {
            file: {
              version: 1,
              type: 'makeswift-file',
              id: 'testId',
            },
          },
        },
      ]
      const data: ImagesPropControllerDataV2 = {
        [ControlDataTypeKey]: ImagesPropControllerDataV2Type,
        value: images,
      }

      // Act
      const result = getImagesPropControllerDataImagesData(data)

      // Assert
      expect(result).toBe(images)
    })

    test('returns value for ImagesPropControllerDataV1 data', () => {
      // Arrange
      const images: ImagesData = [
        {
          key: 'key',
          version: 1,
          props: {
            file: {
              version: 1,
              type: 'makeswift-file',
              id: 'testId',
            },
          },
        },
      ]

      // Act
      const result = getImagesPropControllerDataImagesData(images)

      // Assert
      expect(result).toBe(images)
    })

    test('returns value for ImagesPropControllerDataV0 data', () => {
      // Arrange
      const images: ImagesDataV0 = [
        {
          key: 'key',
          props: {
            file: 'testId',
          },
        },
      ]

      // Act
      const result = getImagesPropControllerDataImagesData(images)

      // Assert
      expect(result).toBe(images)
    })
  })

  describe('createImagesPropControllerDataFromImagesData', () => {
    test('returns ImagesPropControllerDataV2 when definition version is 2', () => {
      // Arrange
      const images: ImagesData = [
        {
          key: 'key',
          version: 1,
          props: {
            file: {
              version: 1,
              type: 'makeswift-file',
              id: 'testId',
            },
          },
        },
      ]
      const definition: ImagesDescriptor = {
        type: Types.Images,
        version: 2,
        options: {},
      }

      // Act
      const result = createImagesPropControllerDataFromImagesData(
        images,
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: ImagesPropControllerDataV2Type,
        value: images,
      })
    })

    test('returns ImagesData when definition version is not 2', () => {
      // Arrange
      const images: ImagesData = [
        {
          key: 'key',
          version: 1,
          props: {
            file: {
              version: 1,
              type: 'makeswift-file',
              id: 'testId',
            },
          },
        },
      ]
      const definition: ImagesDescriptor = {
        type: Types.Images,
        options: {},
      }

      // Act
      const result = createImagesPropControllerDataFromImagesData(
        images,
        definition,
      )

      // Assert
      expect(result).toBe(images)
    })
  })

  describe('getImagesPropControllerFileIds', () => {
    test('returns empty array for undefined data', () => {
      // Arrange
      const data = undefined

      // Act
      const result = getImagesPropControllerFileIds(data)

      // Assert
      expect(result).toEqual([])
    })

    test('returns array with id for ImagesDataV0 type', () => {
      // Arrange
      const images: ImagesDataV0 = [
        {
          key: 'key',
          props: {
            file: 'testId',
          },
        },
      ]

      // Act
      const result = getImagesPropControllerFileIds(images)

      // Assert
      expect(result).toEqual(['testId'])
    })

    test('returns array with id for v1 data makeswift-file', () => {
      // Arrange
      const data: ImagesData = [
        {
          key: 'key',
          version: 1,
          props: {
            file: {
              version: 1,
              type: 'makeswift-file',
              id: 'testId',
            },
          },
        },
      ]

      // Act
      const result = getImagesPropControllerFileIds(data)

      // Assert
      expect(result).toEqual(['testId'])
    })

    test('returns empty array for v1 data external-file type', () => {
      // Arrange
      const data: ImagesData = [
        {
          key: 'key',
          version: 1,
          props: {
            file: {
              version: 1,
              type: 'external-file',
              url: 'https://example.com/images.jpg',
            },
          },
        },
      ]

      // Act
      const result = getImagesPropControllerFileIds(data)

      // Assert
      expect(result).toEqual([])
    })

    test('returns array with id for v2 data makeswift-file', () => {
      // Arrange
      const data: ImagesPropControllerDataV2 = {
        [ControlDataTypeKey]: ImagesPropControllerDataV2Type,
        value: [
          {
            key: 'key',
            version: 1,
            props: {
              file: {
                version: 1,
                type: 'makeswift-file',
                id: 'testId',
              },
            },
          },
        ],
      }

      // Act
      const result = getImagesPropControllerFileIds(data)

      // Assert
      expect(result).toEqual(['testId'])
    })

    test('returns empty array for v2 data external-file type', () => {
      // Arrange
      const data: ImagesPropControllerDataV2 = {
        [ControlDataTypeKey]: ImagesPropControllerDataV2Type,
        value: [
          {
            key: 'key',
            version: 1,
            props: {
              file: {
                version: 1,
                type: 'external-file',
                url: 'https://example.com/images.jpg',
              },
            },
          },
        ],
      }

      // Act
      const result = getImagesPropControllerFileIds(data)

      // Assert
      expect(result).toEqual([])
    })
  })
})

describe('copyImagesPropControllerData', () => {
  test('returns undefined when data is undefined', () => {
    // Arrange
    const data = undefined
    const context: CopyContext = {
      replacementContext: createReplacementContext(),
      copyElement: (el) => el,
    }

    // Act
    const result = copyImagesPropControllerData(data, context)

    // Assert
    expect(result).toBeUndefined()
  })

  test('returns copied ImagesPropControllerDataV2 when data is ImagesPropControllerDataV2', () => {
    // Arrange
    const data: ImagesPropControllerDataV2 = {
      [ControlDataTypeKey]: ImagesPropControllerDataV2Type,
      value: [
        {
          key: 'key',
          version: 1,
          props: {
            file: {
              version: 1,
              type: 'makeswift-file',
              id: 'testId',
            },
          },
        },
      ],
    }
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        fileIds: new Map([['testId', 'copiedTestId']]),
      }),
      copyElement: (el) => el,
    }

    // Act
    const result = copyImagesPropControllerData(data, context)

    // Assert
    expect(result).toEqual({
      [ControlDataTypeKey]: ImagesPropControllerDataV2Type,
      value: [
        {
          key: 'key',
          version: 1,
          props: {
            file: {
              version: 1,
              type: 'makeswift-file',
              id: 'copiedTestId',
            },
          },
        },
      ],
    })
  })

  test('returns copied ImagesDataV1 when data is ImagesDataV1', () => {
    // Arrange
    const data: ImagesData = [
      {
        key: 'key',
        version: 1,
        props: {
          file: {
            version: 1,
            type: 'makeswift-file',
            id: 'testId',
          },
        },
      },
    ]
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        fileIds: new Map([['testId', 'copiedTestId']]),
      }),
      copyElement: (el) => el,
    }

    // Act
    const result = copyImagesPropControllerData(data, context)

    // Assert
    expect(result).toEqual([
      {
        key: 'key',
        version: 1,
        props: {
          file: {
            version: 1,
            type: 'makeswift-file',
            id: 'copiedTestId',
          },
        },
      },
    ])
  })

  test('returns copied ImagesDataV0 when data is ImagesDataV0', () => {
    // Arrange
    const data: ImagesDataV0 = [
      {
        key: 'key',
        props: {
          file: 'testId',
        },
      },
    ]
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        fileIds: new Map([['testId', 'copiedTestId']]),
      }),
      copyElement: (el) => el,
    }

    // Act
    const result = copyImagesPropControllerData(data, context)

    // Assert
    expect(result).toEqual([
      {
        key: 'key',
        props: {
          file: 'copiedTestId',
        },
      },
    ])
  })
})
