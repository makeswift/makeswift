import { client } from '@/makeswift/client'
import '@/makeswift/components'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import ClientMakeswiftPage from './page.client'
import { locales } from '@/localization'

type ParsedUrlQuery = { lang: string; path?: string[] }

type SearchParams = { [key: string]: string | string[] | undefined }

export async function generateStaticParams() {
  const pages = await client.getPages()

  return pages.flatMap((page) =>
    locales.map((locale) => ({
      path: page.path.split('/').filter((segment) => segment !== ''),
      lang: locale,
    })),
  )
}

export default async function Page(props: {
  params: ParsedUrlQuery
  searchParams: SearchParams
}) {
  const { isEnabled: isDraftModeEnabled } = draftMode()
  const locale = props.params.lang
  const path = '/' + (props.params?.path ?? []).join('/')
  const siteVersion = isDraftModeEnabled
    ? props.searchParams['x-makeswift-site-version'] ?? 'Live'
    : 'Live'
  const snapshot = await client.getPageSnapshot(path, {
    siteVersion: siteVersion as 'Live' | 'Working',
    locale,
  })

  if (snapshot == null) return notFound()

  return <ClientMakeswiftPage snapshot={snapshot} />
}
