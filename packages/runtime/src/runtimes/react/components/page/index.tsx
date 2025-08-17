import { Suspense, useMemo, memo, type ComponentProps } from 'react'

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

/**
 * @param snapshot - The snapshot of the page to render, from
 * `client.getPageSnapshot()`.
 * @param metadata - Allows control over whether to use data from Makeswift for
 * rendering metadata tags in the `<head>` of the page. Pass `true` (default if
 * not provided) to render all metadata tags, or `false` to not render any. For
 * more granular control, pass an object with boolean values for specific
 * metadata fields. Valid fields include:
 *  - `title`
 *  - `description`
 *  - `keywords`
 *  - `socialImage`
 *  - `canonicalUrl`
 *  - `indexingBlocked`
 *  - `favicon`
 *
 * If a field is not provided, it will default to `false`.
 */
export const Page = memo(
  ({
    snapshot,
    metadata = true,
  }: {
    snapshot: MakeswiftPageSnapshot
    metadata?: boolean | PageMetadataSettings
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
  },
)

export type PageProps = ComponentProps<typeof Page>
