import { ControlDataTypeKey, Types } from '../prop-controllers'
import {
  VideoDescriptor,
  VideoPropControllerData,
  VideoPropControllerDataV0,
  VideoPropControllerDataV1,
  VideoPropControllerDataV1Type,
  createVideoPropControllerDataFromVideoData,
  getVideoPropControllerDataVideoData,
} from './video'

describe('VideoPropController', () => {
  describe('getVideoPropControllerDataVideoData', () => {
    test('returns value for VideoPropControllerDataV1Type', () => {
      // Arrange
      const data: VideoPropControllerDataV1 = {
        [ControlDataTypeKey]: VideoPropControllerDataV1Type,
        value: {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
      }

      // Act
      const result = getVideoPropControllerDataVideoData(data)

      // Assert
      expect(result).toEqual(data.value)
    })

    test('returns value for VideoPropControllerDataV0 data', () => {
      // Arrange
      const data: VideoPropControllerDataV0 = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }

      // Act
      const result = getVideoPropControllerDataVideoData(data)

      // Assert
      expect(result).toEqual(data)
    })
  })

  describe('createVideoPropControllerDataFromVideoData', () => {
    test('returns VideoPropControllerDataV1 when definition version is 1', () => {
      // Arrange
      const definition: VideoDescriptor = {
        type: Types.Video,
        version: 1,
        options: {},
      }

      // Act
      const result = createVideoPropControllerDataFromVideoData(
        { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        definition,
      )

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: VideoPropControllerDataV1Type,
        value: {
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
      })
    })

    test('returns VideoPropControllerDataV1 value when definition is undefined', () => {
      // Arrange
      const data = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }

      // Act
      const result = createVideoPropControllerDataFromVideoData(data)

      // Assert
      expect(result).toEqual({
        [ControlDataTypeKey]: VideoPropControllerDataV1Type,
        value: data,
      })
    })

    test('returns video data value when definition version is not 1', () => {
      // Arrange
      const data: VideoPropControllerData = {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }
      const definition: VideoDescriptor = {
        type: Types.Video,
        options: {},
      }

      // Act
      const result = createVideoPropControllerDataFromVideoData(
        data,
        definition,
      )

      // Assert
      expect(result).toBe(data)
    })
  })
})
