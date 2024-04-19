import { ImageValue } from '../descriptors'
import { copy } from './image'
import { ReplacementContext } from '../../state/react-page'

describe('image copy', () => {
  test('image is replaced by a one in replacement context', () => {
    // Arrange
    const data: ImageValue = 'file-id'
    const expected = JSON.parse(JSON.stringify(data).replace('file-id', 'testing'))

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
    const result = copy({ type: 'Image', options: {} }, data, {
      replacementContext: replacementContext as ReplacementContext,
    })

    // Assert
    expect(result).toEqual(expected)
  })
})
