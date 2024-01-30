import { memo, useMemo } from 'react'

import { RuntimeProvider, ReactRuntime } from '../runtimes/react'
import { Page as PageMeta } from '../components/page'
import { MakeswiftClient } from '../api/react'
import { MakeswiftPageSnapshot } from './client'

export type PageProps = {
  snapshot: MakeswiftPageSnapshot
  runtime?: ReactRuntime
}

export const Page = memo(({ snapshot, runtime }: PageProps) => {
  const client = useMemo(
    () =>
      new MakeswiftClient({
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
    <RuntimeProvider
      client={client}
      rootElements={rootElements}
      preview={snapshot.preview}
      runtime={runtime}
    >
      {/* We use a key here to reset the Snippets state in the PageMeta component */}
      <PageMeta key={snapshot.document.data.key} document={snapshot.document} />
    </RuntimeProvider>
  )
})

export type { MakeswiftPage, MakeswiftPageDocument, MakeswiftPageSnapshot, Sitemap } from './client'
export { Makeswift } from './client'
export type { MakeswiftPreviewData } from './preview-mode'
export { PreviewModeScript } from './preview-mode'
export { Document } from './document'
