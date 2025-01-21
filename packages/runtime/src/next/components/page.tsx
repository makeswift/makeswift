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

export type PageProps = {
  snapshot: MakeswiftPageSnapshot
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

export const Page = memo(({ snapshot, ...props }: PageProps) => {
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
      />
    </Suspense>
  )
})
