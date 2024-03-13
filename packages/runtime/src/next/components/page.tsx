'use client'

import { Suspense, memo, useMemo } from 'react'

import { RuntimeProvider } from '../../runtimes/react'
import { Page as PageMeta } from '../../components/page'
import { MakeswiftHostApiClient } from '../../api/react'
import { MakeswiftPageSnapshot } from '../client'

export type PageProps = {
  snapshot: MakeswiftPageSnapshot
}

export const Page = memo(({ snapshot }: PageProps) => {
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
  const rootElements = new Map([[snapshot.document.id, snapshot.document.data]])

  snapshot.document.localizedPages.forEach(localizedPage => {
    rootElements.set(localizedPage.elementTreeId, localizedPage.data)
  })

  return (
    <Suspense>
      <RuntimeProvider client={client} rootElements={rootElements} preview={snapshot.preview}>
        {/* We use a key here to reset the Snippets state in the PageMeta component */}
        <PageMeta key={snapshot.document.data.key} document={snapshot.document} />
      </RuntimeProvider>
    </Suspense>
  )
})
