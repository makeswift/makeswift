import { CopyContext, ReplacementContext } from '../../state/react-page'
import { copy as linkCopy } from './link'
import { NavigationLinksValue } from '../descriptors'

export function copy(value: NavigationLinksValue, context: CopyContext): NavigationLinksValue {
  if (value == null) return value

  return value.map(copyNavigationLinksPanelItem)

  function copyNavigationLinksPanelItem(item: any): any {
    switch (item.type) {
      case 'button':
      case 'dropdown': {
        const { color, link } = item.payload

        return {
          ...item,
          payload: {
            ...item.payload,
            link: link != null ? linkCopy(link, context) : undefined,
            color:
              color != null
                ? color.map((override: { value: { swatchId: string } }) => ({
                    ...override,
                    value: {
                      ...override.value,
                      swatchId:
                        context.replacementContext.swatchIds.get(override.value.swatchId) ??
                        override.value.swatchId,
                    },
                  }))
                : undefined,
          },
        }
      }

      default:
        return item
    }
  }
}

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest

  describe.concurrent('navigation-links copy', () => {
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
}
