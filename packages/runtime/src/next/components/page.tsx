'use client'

import { Suspense, memo, useMemo } from 'react'

import { useDispatch } from '../../runtimes/react/hooks/use-dispatch'
import { useUniversalDispatch } from '../../runtimes/react/hooks/use-universal-dispatch'
import { useCacheData } from '../../runtimes/react/hooks/use-cache-data'

import { Page as PageComponent } from '../../components/page'
import {
  type MakeswiftPageSnapshot,
  type MakeswiftPageDocument,
  pageToRootDocument,
} from '../client'
import * as ReactPage from '../../state/react-page'
import { registerDocumentsEffect } from '../../state/actions'
import { type PageMetadataSettings } from '../../components/page/page-seo-settings'

export type PageProps = {
  snapshot: MakeswiftPageSnapshot
  metadata?: boolean | PageMetadataSettings
}

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
export const Page = memo(({ snapshot, metadata = true, ...props }: PageProps) => {
  if ('runtime' in props) {
    throw new Error(
      `The \`runtime\` prop is no longer supported in the \`@makeswift/runtime\` \`Page\` component as of \`0.15.0\`.
See our docs for more information on what's changed and instructions to migrate: https://docs.makeswift.com/migrations/0.15.0`,
    )
  }

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
})
