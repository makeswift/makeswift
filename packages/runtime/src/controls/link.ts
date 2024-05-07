import { LinkControlData } from '@makeswift/controls'

import { CopyContext } from '../state/react-page'

export function copyLinkData(
  value: LinkControlData | undefined,
  context: CopyContext,
): LinkControlData | undefined {
  if (value == null) return value

  if (value.type === 'OPEN_PAGE') {
    const pageId = value.payload.pageId

    if (pageId != null) {
      return {
        ...value,
        payload: {
          ...value.payload,
          pageId: context.replacementContext.pageIds.get(pageId) ?? pageId,
        },
      }
    }
  }

  return value
}
