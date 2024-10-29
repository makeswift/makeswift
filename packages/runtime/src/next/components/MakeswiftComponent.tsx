'use client'

import { memo, ReactNode, Suspense, useMemo } from 'react'
import { componentDocumentToRootEmbeddedDocument, MakeswiftComponentSnapshot } from '../client'
import { DocumentRoot } from '../../runtimes/react/components/DocumentRoot'
import { useCacheData } from '../../runtimes/react/hooks/use-cache-data'
import { useRegisterDocument } from '../../runtimes/react/hooks/use-register-document'

type Props = {
  snapshot: MakeswiftComponentSnapshot
  name: string
  type: string
  fallback?: ReactNode
}

export const MakeswiftComponent = memo(({ snapshot, name, type, fallback }: Props) => {
  useCacheData(snapshot.cacheData)

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

  useRegisterDocument(rootDocument)

  return (
    <Suspense>
      <DocumentRoot rootDocument={rootDocument} fallback={fallback} />
    </Suspense>
  )
})
