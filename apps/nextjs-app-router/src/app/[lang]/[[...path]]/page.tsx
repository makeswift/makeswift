import { client } from '@/makeswift/client'
import '@/makeswift/components'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { notFound } from 'next/navigation'
import { Page as MakeswiftPage } from '@makeswift/runtime/next'

type ParsedUrlQuery = { lang: string; path?: string[] }

export async function generateStaticParams() {

  const pages = await client.getPages().toArray()

  return pages.flatMap((page) => [
    {
      params: {
        path: page.path.split('/').filter((segment) => segment !== ''),
        lang: page.locale,
      },
    },
    ...page.localizedVariants.map((variant) => ({
      params: {
        path: variant.path.split('/').filter((segment) => segment !== ''),
        lang: variant.locale,
      },
    })),
  ])
}

export default async function Page({ params }: { params: ParsedUrlQuery }) {
  const path = '/' + (params?.path ?? []).join('/')
  const snapshot = await client.getPageSnapshot(path, {
    siteVersion: getSiteVersion(),
    locale: params.lang,
  })

  if (snapshot == null) return notFound()

  return <MakeswiftPage snapshot={snapshot} />
}
