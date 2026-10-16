'use client'

import { memo, useMemo } from 'react'

import {
  componentDocumentToRootEmbeddedDocument,
  MakeswiftComponentSnapshot,
} from '../../../client'
import { type Data } from '../../../state/modules/read-only-documents'
import { getRootElement } from '../../../state/read-only-state'

import { useCacheData } from '../hooks/use-cache-data'
import { useRegisterDocument } from '../hooks/use-register-document'
import { useBuiltinSuspense } from '../hooks/use-builtin-suspense'
import { ActivityOrFallback } from './activity-with-fallback'

import { DocumentRoot } from './DocumentRoot'

type Props = {
  snapshot: MakeswiftComponentSnapshot
  label: string
  type: string
  description?: string
  /** For internal Makeswift builder use only */
  internal_MakeswiftBuilderData?: Data
}

export const MakeswiftComponent = memo(
  ({ snapshot, label, type, description, internal_MakeswiftBuilderData }: Props) => {
    useCacheData(snapshot.cacheData)

    const rootDocument = useMemo(
      () =>
        componentDocumentToRootEmbeddedDocument({
          document: snapshot.document,
          documentKey: snapshot.key,
          name: label,
          type,
          description,
          internal_MakeswiftBuilderData,
          meta: snapshot.meta,
        }),
      [snapshot, label, type, description, internal_MakeswiftBuilderData],
    )

    useRegisterDocument(rootDocument)

    const builtinSuspense = useBuiltinSuspense(getRootElement(rootDocument).type)

    return (
      <ActivityOrFallback suspenseFallback={builtinSuspense}>
        <DocumentRoot rootDocument={rootDocument} />
      </ActivityOrFallback>
    )
  },
)
