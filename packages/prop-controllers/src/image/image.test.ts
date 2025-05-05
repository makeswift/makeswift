import {
  createReplacementContext,
  createClearContext,
} from '@makeswift/controls'
import { ImageData, ImageDataV0, ImageDataV1 } from '../data'
import { ControlDataTypeKey, CopyContext, Types } from '../prop-controllers'
import {
  ImageDescriptor,
  ImagePropControllerDataV2,
  ImagePropControllerDataV2Type,
  copyImagePropControllerData,
  createImagePropControllerDataFromImageData,
  getImagePropControllerDataImageData,
  getImagePropControllerFileIds,
} from './image'

describe('ImagePropController', () => {
  describe('getImagePropControllerDataImageData', () => {
    test('returns value for ImagePropControllerDataV2Type', () => {
      // Arrange
      const image: ImageData = {
        version: 1,
        type: 'makeswift-file',
        id: 'testId',
      }
      const data: ImagePropControllerDataV2 = {
        [ControlDataTypeKey]: ImagePropControllerDataV2Type,
        value: image,
      }

      // Act
      const result = getImagePropControllerDataImageData(data)

      // Assert
      expect(result).toBe(image)
    })

    test('returns value for ImagePropControllerDataV1 data', () => {
      // Arrange
      const image: ImageData = {
        version: 1,
        type: 'makeswift-file',
        id: 'testId',
      }

      // Act
      const result = getImagePropControllerDataImageData(image)

      // Assert
      expect(result).toBe(image)
    })

    test('returns value for ImagePropControllerDataV0 data', () => {
      // Arrange
      const image: ImageData = 'testId'

      // Act
      const result = getImagePropControllerDataImageData(image)

      // Assert
      expect(result).toBe(image)
    })
  })

  describe('createImagePropControllerDataFromImageData', () => {
    test('returns ImagePropControllerDataV2 when definition version is 2', () => {
      // Arrange
      const image: ImageData = {
        version: 1,
        type: 'makeswift-file',
        id: 'testId',
      }
      const definition: ImageDescriptor = {
        type: Types.Image,
        version: 2,
        options: {},
      }

      // Act
      const result = createImagePropControllerDataFromImageData(
        image,
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: ImagePropControllerDataV2Type,
        value: image,
      })
    })

    test('returns ImageData when definition version is not 2', () => {
      // Arrange
      const image: ImageData = {
        version: 1,
        type: 'makeswift-file',
        id: 'testId',
      }
      const definition: ImageDescriptor = {
        type: Types.Image,
        options: {},
      }

      // Act
      const result = createImagePropControllerDataFromImageData(
        image,
        definition,
      )

      // Assert
      expect(result).toBe(image)
    })
  })

  describe('getImagePropControllerFileIds', () => {
    test('returns empty array for undefined data', () => {
      // Arrange
      const data = undefined

      // Act
      const result = getImagePropControllerFileIds(data)

      // Assert
      expect(result).toEqual([])
    })

    test('returns array with id for ImageDataV0 type', () => {
      // Arrange
      const data: ImageDataV0 = 'testId'

      // Act
      const result = getImagePropControllerFileIds(data)

      // Assert
      expect(result).toEqual(['testId'])
    })

    test('returns array with id for v1 data makeswift-file', () => {
      // Arrange
      const data: ImageData = {
        version: 1,
        type: 'makeswift-file',
        id: 'testId',
      }

      // Act
      const result = getImagePropControllerFileIds(data)

      // Assert
      expect(result).toEqual(['testId'])
    })

    test('returns empty array for v1 data external-file type', () => {
      // Arrange
      const data: ImageData = {
        version: 1,
        type: 'external-file',
        url: 'https://example.com/image.jpg',
      }

      // Act
      const result = getImagePropControllerFileIds(data)

      // Assert
      expect(result).toEqual([])
    })

    test('returns array with id for v2 data makeswift-file', () => {
      // Arrange
      const data: ImagePropControllerDataV2 = {
        [ControlDataTypeKey]: ImagePropControllerDataV2Type,
        value: {
          version: 1,
          type: 'makeswift-file',
          id: 'testId',
        },
      }

      // Act
      const result = getImagePropControllerFileIds(data)

      // Assert
      expect(result).toEqual(['testId'])
    })

    test('returns empty array for v2 data external-file type', () => {
      // Arrange
      const data: ImagePropControllerDataV2 = {
        [ControlDataTypeKey]: ImagePropControllerDataV2Type,
        value: {
          version: 1,
          type: 'external-file',
          url: 'https://example.com/image.jpg',
        },
      }

      // Act
      const result = getImagePropControllerFileIds(data)

      // Assert
      expect(result).toEqual([])
    })
  })
})

describe('copyImagePropControllerData', () => {
  test('returns undefined when data is undefined', () => {
    // Arrange
    const data = undefined
    const context: CopyContext = {
      replacementContext: createReplacementContext(),
      clearContext: createClearContext(),
      copyElement: (el) => el,
    }

    // Act
    const result = copyImagePropControllerData(data, context)

    // Assert
    expect(result).toBeUndefined()
  })

  test('returns copied ImagePropControllerDataV2 when data is ImagePropControllerDataV2', () => {
    // Arrange
    const data: ImagePropControllerDataV2 = {
      [ControlDataTypeKey]: ImagePropControllerDataV2Type,
      value: {
        version: 1,
        type: 'makeswift-file',
        id: 'testId',
      },
    }
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        fileIds: { testId: 'copiedTestId' },
      }),
      clearContext: createClearContext(),
      copyElement: (el) => el,
    }

    // Act
    const result = copyImagePropControllerData(data, context)

    // Assert
    expect(result).toEqual({
      [ControlDataTypeKey]: ImagePropControllerDataV2Type,
      value: {
        version: 1,
        type: 'makeswift-file',
        id: 'copiedTestId',
      },
    })
  })

  test('returns copied ImageDataV1 when data is ImageDataV1', () => {
    // Arrange
    const data: ImageDataV1 = {
      version: 1,
      type: 'makeswift-file',
      id: 'testId',
    }
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        fileIds: { testId: 'copiedTestId' },
      }),
      clearContext: createClearContext(),
      copyElement: (el) => el,
    }

    // Act
    const result = copyImagePropControllerData(data, context)

    // Assert
    expect(result).toEqual({
      version: 1,
      type: 'makeswift-file',
      id: 'copiedTestId',
    })
  })

  test('returns copied ImageDataV0 when data is ImageDataV0', () => {
    // Arrange
    const data: ImageDataV0 = 'testId'
    const context: CopyContext = {
      replacementContext: createReplacementContext({
        fileIds: { testId: 'copiedTestId' },
      }),
      clearContext: createClearContext(),
      copyElement: (el) => el,
    }

    // Act
    const result = copyImagePropControllerData(data, context)

    // Assert
    expect(result).toEqual('copiedTestId')
  })
})
