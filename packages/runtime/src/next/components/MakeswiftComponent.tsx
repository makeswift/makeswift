'use client'

import { memo, Suspense, useMemo } from 'react'
import { componentDocumentToRootEmbeddedDocument, MakeswiftComponentSnapshot } from '../../client'
import { DocumentRoot } from '../../runtimes/react/components/DocumentRoot'
import { useCacheData } from '../../runtimes/react/hooks/use-cache-data'
import { useRegisterDocument } from '../../runtimes/react/hooks/use-register-document'

type Props = {
  snapshot: MakeswiftComponentSnapshot
  label: string
  type: string
}

export const MakeswiftComponent = memo(({ snapshot, label, type }: Props) => {
  useCacheData(snapshot.cacheData)

  const rootDocument = useMemo(
    () =>
      componentDocumentToRootEmbeddedDocument({
        document: snapshot.document,
        documentKey: snapshot.key,
        name: label,
        type,
        meta: snapshot.meta,
      }),
    [snapshot, label, type],
  )

  useRegisterDocument(rootDocument)

  return (
    <Suspense>
      <DocumentRoot rootDocument={rootDocument} />
    </Suspense>
  )
})
