'use client'

import { Suspense, Fragment, memo, useMemo } from 'react'

import {
  componentDocumentToRootEmbeddedDocument,
  MakeswiftComponentSnapshot,
} from '../../../client'
import { getRootElement } from '../../../state/react-page'

import { useCacheData } from '../hooks/use-cache-data'
import { useRegisterDocument } from '../hooks/use-register-document'
import { useBuiltinSuspense } from '../hooks/use-builtin-suspense'

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
  const SuspenseOrFragment = builtinSuspense ? Suspense : Fragment

  return (
    <SuspenseOrFragment>
      <DocumentRoot rootDocument={rootDocument} />
    </SuspenseOrFragment>
  )
})
