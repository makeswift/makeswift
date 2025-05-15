import { MakeswiftProvider } from 'lib/makeswift/provider'
import type { Route } from './+types/home'
import { Page as MakeswiftPage } from '@makeswift/runtime/next'
import { client } from 'lib/makeswift/client'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Makeswift' }]
}

export async function loader({ params }: Route.LoaderArgs) {
  // DECOUPLE_TODO: path
  const snapshot = await client.getPageSnapshot('/', {
    // DECOUPLE_TODO: siteVersion
    siteVersion: 'Live',
    locale: params.lang,
  })

  return { snapshot }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const snapshot = loaderData.snapshot

  if (snapshot == null) {
    throw new Response('Not Found', { status: 404 })
  }

  return (
    // DECOUPLE_TODO: previewMode
    <MakeswiftProvider previewMode={false}>
      <MakeswiftPage snapshot={snapshot} />
    </MakeswiftProvider>
  )
}
