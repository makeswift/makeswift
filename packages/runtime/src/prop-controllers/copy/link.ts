import { CopyContext } from '../../state/react-page'
import { LinkValue } from '../descriptors'

export function copy(value: LinkValue | undefined, context: CopyContext): LinkValue | undefined {
  if (value == null) return value

  switch (value.type) {
    case 'OPEN_PAGE': {
      const pageId = value.payload.pageId

      if (pageId == null) return value

      return {
        ...value,
        payload: {
          ...value.payload,
          pageId: context.replacementContext.pageIds.get(pageId) ?? pageId,
        },
      }
    }

    case 'SCROLL_TO_ELEMENT': {
      const elementIdConfig = value.payload.elementIdConfig

      if (elementIdConfig == null) return value

      return {
        ...value,
        payload: {
          ...value.payload,
          elementIdConfig: {
            ...elementIdConfig,
            elementKey:
              context.replacementContext.elementKeys.get(elementIdConfig.elementKey) ??
              elementIdConfig.elementKey,
          },
        },
      }
    }

    default:
      return value
  }
}
