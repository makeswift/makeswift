import { LinkControlData, copyLinkData, createReplacementContext } from '@makeswift/controls'

describe('link', () => {
  test('page id is replaced by one in replacement context', () => {
    // Arrange
    const pageId = 'UGFnZTpmNTdmMjQ2MS0wMGY3LTQzZWUtYmIwOS03ODdiNTUyYzUyYWQ='
    const data: LinkControlData = {
      type: 'OPEN_PAGE',
      payload: {
        pageId,
        openInNewTab: false,
      },
    }

    const expected = JSON.parse(JSON.stringify(data).replace(pageId, 'testing'))

    // Act
    const result = copyLinkData(data, {
      replacementContext: createReplacementContext({
        pageIds: {
          [pageId]: 'testing',
        },
      }),
      copyElement: node => node,
    })

    // Assert
    expect(result).toMatchObject(expected)
  })
})
