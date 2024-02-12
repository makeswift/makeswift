import { client } from '@/makeswift/client'
import '@/makeswift/components'
import { notFound } from 'next/navigation'
import {
  Page as MakeswiftPage,
  MakeswiftSiteVersion,
  getDraftData,
} from '@makeswift/runtime/next'

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
  const path = '/' + (props.params?.path ?? []).join('/')

  const siteVersion =
    (await getDraftData())?.siteVersion ?? MakeswiftSiteVersion.Live

  const snapshot = await client.getPageSnapshot(path, {
    siteVersion,
  })

  if (snapshot == null) return notFound()

  return <MakeswiftPage snapshot={snapshot} />
}
