'use client'

import { memo, ReactNode, Suspense, useMemo } from 'react'
import { componentDocumentToRootEmbeddedDocument, MakeswiftComponentSnapshot } from '../client'
import { DocumentRoot } from '../../runtimes/react/components/DocumentRoot'
import { useSyncCacheData } from '../hooks/use-sync-cache-data'
import { useRegisterDocument } from '../../runtimes/react/hooks/use-register-document'

type Props = {
  snapshot: MakeswiftComponentSnapshot
  label: string
  type: string
  fallback?: ReactNode
}

export const MakeswiftComponent = memo(({ snapshot, label, type, fallback }: Props) => {
  useSyncCacheData(snapshot.cacheData)

  const rootDocument = useMemo(
    () =>
      componentDocumentToRootEmbeddedDocument({
        document: snapshot.document,
        name: label,
        type,
        hasFallback: fallback != null,
      }),
    [snapshot, label, type],
  )

  useRegisterDocument(rootDocument)

  return (
    <Suspense>
      <DocumentRoot rootDocument={rootDocument} fallback={fallback} />
    </Suspense>
  )
})
