'use client'

import { Suspense, memo, useEffect, useMemo } from 'react'

import { useDispatch } from '../../runtimes/react/hooks/use-dispatch'
import { Page as PageComponent } from '../../components/page'
import {
  type MakeswiftPageSnapshot,
  type MakeswiftPageDocument,
  pageToRootDocument,
} from '../client'
import * as ReactPage from '../../state/react-page'
import { registerDocumentsEffect } from '../../state/actions'
import { useSyncCacheData } from '../hooks/use-sync-cache-data'

export type PageProps = {
  snapshot: MakeswiftPageSnapshot
}

function useRegisterPageDocument(pageDocument: MakeswiftPageDocument): ReactPage.Document {
  const dispatch = useDispatch()

  const rootDocument = useMemo(() => pageToRootDocument(pageDocument), [pageDocument])
  useEffect(() => dispatch(registerDocumentsEffect([rootDocument])), [rootDocument])
  return rootDocument
}

export const Page = memo(({ snapshot, ...props }: PageProps) => {
  if ('runtime' in props) {
    throw new Error(
      `The \`runtime\` prop is no longer supported in the \`@makeswift/runtime\` \`Page\` component as of \`0.15.0\`.
See our docs for more information on what's changed and instructions to migrate: https://docs.makeswift.com/migrations/0.15.0`,
    )
  }

  useSyncCacheData(snapshot.cacheData)

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
