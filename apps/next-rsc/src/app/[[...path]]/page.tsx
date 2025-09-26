import { client } from '@/makeswift/client'
import '@/makeswift/components.server'
import { getSiteVersion } from '@makeswift/runtime/next/server'
import { notFound } from 'next/navigation'
import { RscPage } from '@makeswift/runtime/next/rsc/server'

type ParsedUrlQuery = Promise<{ path?: string[] }>

export default async function Page(props: { params: ParsedUrlQuery }) {
  const params = await props.params
  const path = '/' + (params?.path ?? []).join('/')
  const snapshot = await client.getPageSnapshot(path, {
    siteVersion: getSiteVersion(),
  })

  if (snapshot == null) return notFound()

  return <RscPage snapshot={snapshot} />
}
