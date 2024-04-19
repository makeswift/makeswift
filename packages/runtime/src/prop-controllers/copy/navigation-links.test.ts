import { NavigationLinksValue } from '../descriptors'
import { copy } from './navigation-links'
import { ReplacementContext } from '../../state/react-page'

describe('navigation-links copy', () => {
  test('replace page id from replacement context', () => {
    // Arrange
    const data: NavigationLinksValue = [
      {
        id: 'e1cf2d04-012a-4481-832a-7b4dda62195e',
        type: 'button',
        payload: {
          link: {
            type: 'OPEN_PAGE',
            payload: {
              pageId: 'UGFnZTo2OGMzODZhNC1jYzRkLTQzMzUtYWZiMi05MDdhZGRkYzQ3YTM=',
              openInNewTab: true,
            },
          },
          label: 'Fellow Page',
        },
      },
    ]
    const expected = JSON.parse(
      JSON.stringify(data).replace(
        'UGFnZTo2OGMzODZhNC1jYzRkLTQzMzUtYWZiMi05MDdhZGRkYzQ3YTM=',
        'testing',
      ),
    )

    const replacementContext = {
      elementHtmlIds: new Set(),
      elementKeys: new Map(),
      swatchIds: new Map(),
      fileIds: new Map(),
      typographyIds: new Map(),
      tableIds: new Map(),
      tableColumnIds: new Map(),
      pageIds: new Map([['UGFnZTo2OGMzODZhNC1jYzRkLTQzMzUtYWZiMi05MDdhZGRkYzQ3YTM=', 'testing']]),
      globalElementIds: new Map(),
      globalElementData: new Map(),
    }

    // Act
    const result = copy(data, {
      replacementContext: replacementContext as ReplacementContext,
      copyElement: node => node,
    })

    // // Assert
    expect(result).toMatchObject(expected)
  })
})
