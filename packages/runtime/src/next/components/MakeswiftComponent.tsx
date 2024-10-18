'use client'

import { memo, ReactNode, Suspense, useEffect, useMemo } from 'react'
import { componentDocumentToRootEmbeddedDocument, MakeswiftComponentSnapshot } from '../client'
import { DocumentRoot } from '../../runtimes/react/components/DocumentRoot'
import { useSyncCacheData } from '../hooks/use-sync-cache-data'
import { useDispatch } from '../../runtimes/react/hooks/use-dispatch'
import { registerDocumentsEffect } from '../../state/actions'

type Props = {
  snapshot: MakeswiftComponentSnapshot
  name: string
  type: string
  fallback?: ReactNode
}

export const MakeswiftComponent = memo(({ snapshot, name, type, fallback }: Props) => {
  const dispatch = useDispatch()

  useSyncCacheData(snapshot.cacheData)

  const rootDocument = useMemo(
    () =>
      componentDocumentToRootEmbeddedDocument({
        document: snapshot.document,
        name,
        type,
        hasFallback: fallback != null,
      }),
    [snapshot, name, type],
  )

  useEffect(() => dispatch(registerDocumentsEffect([rootDocument])), [rootDocument])

  return (
    <Suspense>
      <DocumentRoot rootDocument={rootDocument} fallback={fallback} />
    </Suspense>
  )
})
