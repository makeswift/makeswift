import { ImageControlData, copyImageData } from './image'
import { ReplacementContext } from '../state/react-page'

describe('image copy', () => {
  test('image is replaced by a one in replacement context', () => {
    // Arrange
    const data: ImageControlData = 'file-id'
    const expected = 'testing'

    const replacementContext = {
      elementHtmlIds: new Set(),
      elementKeys: new Map(),
      swatchIds: new Map(),
      fileIds: new Map([['file-id', 'testing']]),
      typographyIds: new Map(),
      tableIds: new Map(),
      tableColumnIds: new Map(),
      pageIds: new Map(),
      globalElementIds: new Map(),
      globalElementData: new Map(),
    }

    // Act
    const result = copyImageData(data, {
      replacementContext: replacementContext as ReplacementContext,
      copyElement: node => node,
    })

    // Assert
    expect(result).toEqual(expected)
  })
})
