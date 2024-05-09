import { LinkControlData, copyLinkData } from '@makeswift/controls'
import { ReplacementContext } from '../state/react-page'

describe('link', () => {
  test('page id is replaced by one in replacement context', () => {
    // Arrange
    const data: LinkControlData = {
      type: 'OPEN_PAGE',
      payload: {
        pageId: 'UGFnZTpmNTdmMjQ2MS0wMGY3LTQzZWUtYmIwOS03ODdiNTUyYzUyYWQ=',
        openInNewTab: false,
      },
    }
    const expected = JSON.parse(
      JSON.stringify(data).replace(
        'UGFnZTpmNTdmMjQ2MS0wMGY3LTQzZWUtYmIwOS03ODdiNTUyYzUyYWQ=',
        'testing',
      ),
    )

    const replacementContext = {
      elementHtmlIds: new Set(),
      elementKeys: new Map(),
      swatchIds: new Map(),
      pageIds: new Map([['UGFnZTpmNTdmMjQ2MS0wMGY3LTQzZWUtYmIwOS03ODdiNTUyYzUyYWQ=', 'testing']]),
      typographyIds: new Map(),
      tableIds: new Map(),
      tableColumnIds: new Map(),
      fileIds: new Map(),
      globalElementIds: new Map(),
      globalElementData: new Map(),
    }

    // Act
    const result = copyLinkData(data, {
      replacementContext: replacementContext as ReplacementContext,
      copyElement: node => node,
    })

    // Assert
    expect(result).toMatchObject(expected)
  })
})
