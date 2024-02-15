'use client'

import { memo, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'

import { RuntimeProvider, useSelector } from '../../runtimes/react'
import { Page as PageMeta } from '../../components/page'
import { MakeswiftHostApiClient } from '../../api/react'
import { MakeswiftPageSnapshot } from '../client'
import { useReactRuntime } from '../context/react-runtime'
import { getLocale } from '../../state/react-page'

export type PageProps = {
  snapshot: MakeswiftPageSnapshot
}

export const Page = memo(({ snapshot }: PageProps) => {
  const router = useRouter()
  const runtime = useReactRuntime()
  const locale = useSelector(state => getLocale(state))
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

  useEffect(() => {
    if (router.locale) {
      runtime.setLocale(router.locale)
    }
  }, [router.locale])

  useEffect(() => {
    const { pathname: currentPathname, query } = router
    const pathname = currentPathname.replace(/^\//, '/')

    router.replace({ pathname, query }, undefined, { locale })
  }, [locale])

  return (
    <RuntimeProvider client={client} rootElements={rootElements} preview={snapshot.preview}>
      {/* We use a key here to reset the Snippets state in the PageMeta component */}
      <PageMeta key={snapshot.document.data.key} document={snapshot.document} />
    </RuntimeProvider>
  )
})
