import { CopyContext, ReplacementContext } from '../../state/react-page'
import { ImagesValue } from '../descriptors'

export function copy(
  value: ImagesValue | undefined,
  context: CopyContext,
): ImagesValue | undefined {
  if (value == null) return value

  return value.map(copyImagesPanelItem)

  function copyImagesPanelItem(imagesPanelItem: any): any {
    const { file } = imagesPanelItem.props

    if (file == null) return imagesPanelItem

    return {
      ...imagesPanelItem,
      props: {
        ...imagesPanelItem.props,
        file: context.replacementContext.fileIds.get(file) ?? file,
      },
    }
  }
}

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest

  describe.concurrent('images copy', () => {
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
      const result = copy(data, {
        replacementContext: replacementContext as ReplacementContext,
        copyElement: node => node,
      })

      // Assert
      expect(result).toMatchObject(expected)
    })
  })
}
