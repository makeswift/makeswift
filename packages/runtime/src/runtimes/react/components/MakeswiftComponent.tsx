'use client'

import { memo, useMemo } from 'react'

import {
  componentDocumentToRootEmbeddedDocument,
  MakeswiftComponentSnapshot,
} from '../../../client'
import { getRootElement } from '../../../state/read-only-state'

import { useCacheData } from '../hooks/use-cache-data'
import { useRegisterDocument } from '../hooks/use-register-document'
import { useBuiltinSuspense } from '../hooks/use-builtin-suspense'
import { useFrameworkContext } from './hooks/use-framework-context'
import { ActivityOrFallback } from './activity-with-fallback'

import { DocumentRoot } from './DocumentRoot'

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

  const builtinSuspense = useBuiltinSuspense(getRootElement(rootDocument).type)

  const siteId = 'siteId' in snapshot.document ? snapshot.document.siteId : null
  const { GoogleFont } = useFrameworkContext()

  return (
    <>
      <GoogleFont fonts={snapshot.fonts} siteId={siteId} />
      <ActivityOrFallback suspenseFallback={builtinSuspense}>
        <DocumentRoot rootDocument={rootDocument} />
      </ActivityOrFallback>
    </>
  )
})
