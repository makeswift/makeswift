'use client'

import { memo, useMemo } from 'react'
import {
  componentDocumentToRootEmbeddedDocument,
  MakeswiftComponentSnapshot,
} from '../../../client'
import { DocumentRoot } from './DocumentRoot'
import { useCacheData } from '../hooks/use-cache-data'
import { useRegisterDocument } from '../hooks/use-register-document'
import { ClientSuspense } from './ClientSuspense'

type Props = {
  snapshot: MakeswiftComponentSnapshot
  label: string
  type: string
  description?: string
}

export const MakeswiftComponent = memo(({ snapshot, label, type, description }: Props) => {
  useCacheData(snapshot.cacheData)

  const rootDocument = useMemo(
    () =>
      componentDocumentToRootEmbeddedDocument({
        document: snapshot.document,
        documentKey: snapshot.key,
        name: label,
        type,
        description,
        meta: snapshot.meta,
      }),
    [snapshot, label, type, description],
  )

  useRegisterDocument(rootDocument)

  return (
    <ClientSuspense>
      <DocumentRoot rootDocument={rootDocument} />
    </ClientSuspense>
  )
})
