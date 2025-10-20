'use client'

import { memo, useMemo } from 'react'

import {
  componentDocumentToRootEmbeddedDocument,
  MakeswiftComponentSnapshot,
} from '../../../client'

import { useCacheData } from '../hooks/use-cache-data'
import { useRegisterDocument } from '../hooks/use-register-document'

import { DocumentRoot } from './DocumentRoot'
import { ActivityOrSuspense } from './activity-or-suspense'

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
    <ActivityOrSuspense>
      <DocumentRoot rootDocument={rootDocument} />
    </ActivityOrSuspense>
  )
})
