import { client } from '@/makeswift/client'
import '@/makeswift/components'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import ClientMakeswiftPage from './page.client'

type ParsedUrlQuery = { path?: string[] }

type SearchParams = { [key: string]: string | string[] | undefined }

export async function generateStaticParams() {
  const pages = await client.getPages()

  return pages.map((page) => ({
    path: page.path.split('/').filter((segment) => segment !== ''),
  }))
}

export default async function Page(props: {
  params: ParsedUrlQuery
  searchParams: SearchParams
}) {
  const { isEnabled: isDraftModeEnabled } = draftMode()
  const path = '/' + (props.params?.path ?? []).join('/')
  const siteVersion = isDraftModeEnabled
    ? props.searchParams['x-makeswift-site-version'] ?? 'Live'
    : 'Live'
  const snapshot = await client.getPageSnapshot(path, {
    siteVersion: siteVersion as 'Live' | 'Working',
  })

  if (snapshot == null) return notFound()

  return <ClientMakeswiftPage snapshot={snapshot} />
}
