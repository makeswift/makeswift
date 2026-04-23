import { client } from '@/makeswift/client'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { notFound } from 'next/navigation'
import { RSCMakeswiftPage } from '@makeswift/runtime/rsc/server'

type ParsedUrlQuery = Promise<{ path?: string[] }>

export default async function Page(props: { params: ParsedUrlQuery }) {
  const params = await props.params
  const path = '/' + (params?.path ?? []).join('/')
  const snapshot = await client.getPageSnapshot(path, {
    siteVersion: getSiteVersion(),
  })

  if (snapshot == null) return notFound()

  return <RSCMakeswiftPage snapshot={snapshot} />
}
