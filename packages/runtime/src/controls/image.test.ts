import { createReplacementContext, ImageControlData } from '@makeswift/controls'
import { copyImageData } from './image'

describe('image copy', () => {
  test('image is replaced by a one in replacement context', () => {
    // Arrange
    const data: ImageControlData = 'file-id'
    const expected = 'testing'

    // Act
    const result = copyImageData(data, {
      replacementContext: createReplacementContext({
        fileIds: {
          'file-id': 'testing',
        },
      }),
      copyElement: node => node,
    })

    // Assert
    expect(result).toEqual(expected)
  })
})
