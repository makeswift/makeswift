import { ImagesValue } from '../descriptors'
import { copy } from './images'
import { ReplacementContext } from '../../state/react-page'

describe('images copy', () => {
  test('images are replaced by ones in replacement context', () => {
    // Arrange
    const data: ImagesValue = [
      {
        key: '0ae80f8f-9d4a-43bc-ae7c-007164a19d22',
        props: {
          file: 'RmlsZTo5ZmU3ZGUzMi1jY2E0LTRkMjktOWVlMC1jNTI2NDYxY2I1YjM=',
        },
      },
      {
        key: '161674c3-8710-4fd6-90e6-6096c4e9bb88',
        props: {
          file: 'RmlsZTo5ZmU3ZGUzMi1jY2E0LTRkMjktOWVlMC1jNTI2NDYxY2I1YjM=',
        },
      },
    ]
    const expected = JSON.parse(
      JSON.stringify(data).replaceAll(
        'RmlsZTo5ZmU3ZGUzMi1jY2E0LTRkMjktOWVlMC1jNTI2NDYxY2I1YjM=',
        'testing',
      ),
    )

    const replacementContext = {
      elementHtmlIds: new Set(),
      elementKeys: new Map(),
      swatchIds: new Map(),
      fileIds: new Map([['RmlsZTo5ZmU3ZGUzMi1jY2E0LTRkMjktOWVlMC1jNTI2NDYxY2I1YjM=', 'testing']]),
      typographyIds: new Map(),
      tableIds: new Map(),
      tableColumnIds: new Map(),
      pageIds: new Map(),
      globalElementIds: new Map(),
      globalElementData: new Map(),
    }

    // Act
    const result = copy({ type: 'Images', options: {} }, data, {
      replacementContext: replacementContext as ReplacementContext,
    })

    // Assert
    expect(result).toMatchObject(expected)
  })
})
