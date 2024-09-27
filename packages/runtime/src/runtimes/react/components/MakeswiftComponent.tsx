'use client'

import { Element } from '@makeswift/controls'
import { Suspense, useMemo } from 'react'
import {
  CacheData,
  MakeswiftHostApiClient,
  SerializedLocalizedResourcesMap,
} from '../../../api/react'
import { RuntimeProvider } from './RuntimeProvider'
import { DocumentReference } from './DocumentReference'
import { createDocumentReference } from '../../../state/react-page'

export type MakeswiftComponentDocument = {
  id: string
  type: string
  key: string
  locale: string | null
  data: Element
}

export type MakeswiftComponentSnapshot = {
  document: MakeswiftComponentDocument
  apiOrigin: string
  cacheData: CacheData
  preview: boolean
  localizedResourcesMap: SerializedLocalizedResourcesMap
  locale: string | null
}

type Props = {
  snapshot: MakeswiftComponentSnapshot
}

export function Unstable_MakeswiftComponent({ snapshot }: Props): JSX.Element {
  const client = useMemo(
    () =>
      new MakeswiftHostApiClient({
        uri: new URL('graphql', snapshot.apiOrigin).href,
        cacheData: snapshot.cacheData,
        localizedResourcesMap: snapshot.localizedResourcesMap,
        locale: snapshot.locale ? new Intl.Locale(snapshot.locale) : undefined,
      }),
    [snapshot],
  )

  const { document } = snapshot
  const documentKey = document.id
  const rootElements = new Map([[documentKey, document.data]])
  const embeddedComponents = new Map([
    [
      documentKey,
      {
        documentKey: documentKey,
        key: document.key,
        type: document.type,
        locale: document.locale,
        rootElement: document.data,
      },
    ],
  ])

  return (
    <Suspense>
      <RuntimeProvider
        client={client}
        rootElements={rootElements}
        embeddedComponents={embeddedComponents}
        preview={snapshot.preview}
      >
        <DocumentReference documentReference={createDocumentReference(documentKey)} />
      </RuntimeProvider>
    </Suspense>
  )
}
