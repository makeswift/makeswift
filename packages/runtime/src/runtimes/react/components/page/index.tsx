import { Suspense, useMemo } from 'react'

import { useDispatch } from '../../hooks/use-dispatch'
import { useUniversalDispatch } from '../../hooks/use-universal-dispatch'
import { useCacheData } from '../../hooks/use-cache-data'

import {
  type MakeswiftPageSnapshot,
  type MakeswiftPageDocument,
  pageToRootDocument,
} from '../../../../client'

import * as ReactPage from '../../../../state/react-page'
import { registerDocumentsEffect } from '../../../../state/actions'

import { type PageMetadataSettings } from './page-seo-settings'
import { Page as PageComponent } from './Page'

export { type PageMetadataSettings } from './page-seo-settings'

function useRegisterPageDocument(pageDocument: MakeswiftPageDocument): ReactPage.Document {
  const dispatch = useDispatch()
  const rootDocuments: [ReactPage.Document] = useMemo(
    () => [pageToRootDocument(pageDocument)],
    [pageDocument],
  )

  useUniversalDispatch(dispatch, registerDocumentsEffect, [rootDocuments])

  return rootDocuments[0]
}

export const Page = ({
  snapshot,
  metadata,
}: {
  snapshot: MakeswiftPageSnapshot
  metadata: boolean | PageMetadataSettings
}) => {
  useCacheData(snapshot.cacheData)

  const rootDocument = useRegisterPageDocument(snapshot.document)

  return (
    <Suspense>
      {/* We use a key here to reset the Snippets state in the PageMeta component */}
      <PageComponent
        key={snapshot.document.data.key}
        page={snapshot.document}
        rootDocument={rootDocument}
        metadata={metadata}
      />
    </Suspense>
  )
}
