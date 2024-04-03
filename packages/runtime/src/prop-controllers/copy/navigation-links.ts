import { CopyContext } from '../../state/react-page'
import { NavigationLinksValue } from '../descriptors'
import { copyLinkPropControllerData } from '@makeswift/prop-controllers'

export function copy(
  value: NavigationLinksValue | undefined,
  context: CopyContext,
): NavigationLinksValue | undefined {
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
            link: link != null ? copyLinkPropControllerData(link, context) : undefined,
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
