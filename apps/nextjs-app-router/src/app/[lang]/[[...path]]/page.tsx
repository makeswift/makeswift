import { client } from '@/makeswift/client'
import '@/makeswift/components.server'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { notFound } from 'next/navigation'
import { RscPage } from '@makeswift/runtime/rsc'

type ParsedUrlQuery = Promise<{ lang: string; path?: string[] }>

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

export default async function Page(props: { params: ParsedUrlQuery }) {
  const params = await props.params
  const path = '/' + (params?.path ?? []).join('/')
  const snapshot = await client.getPageSnapshot(path, {
    siteVersion: getSiteVersion(),
    locale: params.lang,
  })

  if (snapshot == null) return notFound()

  return <RscPage snapshot={snapshot} />
}
