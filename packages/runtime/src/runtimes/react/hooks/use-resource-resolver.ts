import { useMemo } from 'react'
import { type ResourceResolver } from '@makeswift/controls'

import * as ReactPage from '../../../state/react-page'
import { useMakeswiftHostApiClient } from '../host-api-client'
import { useStore } from './use-store'
import { useDocumentContext } from './use-document-context'

export function useResourceResolver(): ResourceResolver {
  const store = useStore()
  const client = useMakeswiftHostApiClient()
  const { key: documentKey, locale } = useDocumentContext()

  return useMemo<ResourceResolver>(() => {
    return {
      resolveSwatch: swatchId => client.resolveSwatch(swatchId),
      resolveFile: fileId => client.resolveFile(fileId),
      resolveTypography: typographyId => client.resolveTypography(typographyId),
      resolvePagePathnameSlice: pageId => client.resolvePagePathnameSlice({ pageId, locale }),
      resolveElementId: elementKey => {
        const read = () =>
          documentKey == null
            ? null
            : ReactPage.getElementId(store.getState(), documentKey, elementKey)

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
    }
  }, [client, store, documentKey, locale])
}
