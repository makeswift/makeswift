'use client'

import { memo, Suspense, useEffect, useMemo } from 'react'
import { componentDocumentToRootEmbeddedDocument, MakeswiftComponentSnapshot } from '../client'
import { DocumentRoot } from '../../runtimes/react/components/DocumentRoot'
import { useSyncCacheData } from '../hooks/use-sync-cache-data'
import { useDispatch } from '../../runtimes/react/hooks/use-dispatch'
import { registerDocumentsEffect } from '../../state/actions'

type Props = {
  snapshot: MakeswiftComponentSnapshot
  name: string
  type: string
}

export const Unstable_MakeswiftComponent = memo(({ snapshot, name, type }: Props) => {
  const dispatch = useDispatch()

  useSyncCacheData(snapshot.cacheData)

  const rootDocument = useMemo(
    () => componentDocumentToRootEmbeddedDocument({ document: snapshot.document, name, type }),
    [snapshot, name, type],
  )

  useEffect(() => dispatch(registerDocumentsEffect([rootDocument])), [rootDocument])

  return (
    <Suspense>
      <DocumentRoot rootDocument={rootDocument} />
    </Suspense>
  )
})
