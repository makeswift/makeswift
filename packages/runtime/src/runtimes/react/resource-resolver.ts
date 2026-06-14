import { type ResourceResolver } from '@makeswift/controls'

import { getElementId } from '../../state/read-only-state'
import { ApiResourcesClient } from '../../api/api-resources-client'
import { Store } from '../../state/store'

export const createResourceResolver = ({
  store,
  apiClient,
  documentKey,
  locale,
}: {
  store: Store
  apiClient: ApiResourcesClient
  documentKey: string | null
  locale: string | null
}): ResourceResolver => ({
  resolveSwatch: swatchId => apiClient.resolveSwatch(swatchId),
  resolveFile: fileId => apiClient.resolveFile(fileId),
  resolveTypography: typographyId => apiClient.resolveTypography(typographyId),
  resolvePagePathnameSlice: pageId => apiClient.resolvePagePathnameSlice({ pageId, locale }),
  resolveElementId: elementKey => {
    const read = () =>
      documentKey == null ? null : getElementId(store.getState(), documentKey, elementKey)

    let lastValue: string | null = null
    return {
      name: `element-id:${documentKey}:${elementKey}`,
      readStable: () => (lastValue = read()),
      subscribe: (onUpdate: () => void) =>
        store.subscribe(() => {
          if (read() !== lastValue) onUpdate()
        }),
    }
  },
})
