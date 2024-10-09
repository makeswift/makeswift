'use client'

import { memo, Suspense, useEffect, useMemo } from 'react'
import {
  componentDocumentToRootEmbeddedDocument,
  MakeswiftComponentDocument,
  MakeswiftComponentSnapshot,
} from '../client'
import * as ReactPage from '../../state/react-page'
import { DocumentRoot } from '../../runtimes/react/components/DocumentRoot'
import { useCacheData } from '../../runtimes/react/hooks/use-cache-data'
import { useDispatch } from '../../runtimes/react/hooks/use-dispatch'
import { registerDocumentsEffect } from '../../state/actions'

type Props = {
  snapshot: MakeswiftComponentSnapshot
}

function useRegisterEmbeddedDocument(document: MakeswiftComponentDocument): ReactPage.Document {
  const dispatch = useDispatch()

  const rootDocument = useMemo(() => componentDocumentToRootEmbeddedDocument(document), [document])
  useEffect(() => dispatch(registerDocumentsEffect([rootDocument])), [rootDocument])
  return rootDocument
}

export const Unstable_MakeswiftComponent = memo(({ snapshot }: Props) => {
  useCacheData(snapshot.cacheData)

  const rootDocument = useRegisterEmbeddedDocument(snapshot.document)

  return (
    <Suspense>
      <DocumentRoot rootDocument={rootDocument} />
    </Suspense>
  )
})
