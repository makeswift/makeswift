'use client'

import { Suspense, memo, useMemo } from 'react'

import { RuntimeProvider } from '../../runtimes/react'
import { Page as PageMeta } from '../../components/page'
import { MakeswiftHostApiClient } from '../../api/react'
import { MakeswiftPageSnapshot } from '../client'

export type PageProps = {
  snapshot: MakeswiftPageSnapshot
}

export const Page = memo(({ snapshot, ...props }: PageProps) => {
  if ('runtime' in props) {
    throw new Error(
      `The \`runtime\` prop is no longer supported in the \`@makeswift/runtime\` \`Page\` component as of \`0.15.0\`.
See our docs for more information on what's changed and instructions to migrate: https://docs.makeswift.com/migrations/0.15.0`,
    )
  }
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

  const localizedPage = snapshot.document.localizedPages.find(({ parentId }) => parentId == null)
  const rootElement = localizedPage
    ? { key: localizedPage.elementTreeId, data: localizedPage.data }
    : { key: snapshot.document.id, data: snapshot.document.data }

  const rootElements = new Map([[rootElement.key, rootElement.data]])

  return (
    <Suspense>
      <RuntimeProvider client={client} rootElements={rootElements} preview={snapshot.preview}>
        {/* We use a key here to reset the Snippets state in the PageMeta component */}
        <PageMeta
          key={snapshot.document.data.key}
          pageDocument={snapshot.document}
          documentKey={rootElement.key}
        />
      </RuntimeProvider>
    </Suspense>
  )
})
