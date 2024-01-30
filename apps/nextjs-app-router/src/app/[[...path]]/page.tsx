import { client } from '@/makeswift/client'
import '@/makeswift/components'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import ClientMakeswiftPage from './page.client'

type ParsedUrlQuery = { path?: string[] }

export async function generateStaticParams() {
  const pages = await client.getPages()

  return pages.map((page) => ({
    path: page.path.split('/').filter((segment) => segment !== ''),
  }))
}

export default async function Page({ params }: { params: ParsedUrlQuery }) {
  // const { isEnabled: isDraftModeEnabled } = draftMode()
  const isDraftModeEnabled = true
  const path = '/' + (params?.path ?? []).join('/')
  const snapshot = await client.getPageSnapshot(path, {
    siteVersion: isDraftModeEnabled ? 'Working' : 'Live',
    // siteVersion: Makeswift.getSiteVersion(ctx.previewData),
  })

  if (snapshot == null) return notFound()

  return <ClientMakeswiftPage snapshot={snapshot} />
}
