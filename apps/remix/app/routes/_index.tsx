import { MakeswiftProvider } from 'lib/makeswift/provider'
import { Page as MakeswiftPage } from '@makeswift/runtime/next'
import { client } from 'lib/makeswift/client'
import { getSiteVersion, getPreviewMode, withMakeswift } from '@makeswift/runtime/remix'

import type { Route } from "./+types/_index";
import { MAKESWIFT_SITE_API_KEY } from 'lib/makeswift/env';


export const loader = withMakeswift(async ({ request, params }: Route.LoaderArgs) => {

  // DECOUPLE_TODO: path
  const snapshot = await client.getPageSnapshot('/', {
    siteVersion: getSiteVersion(request),
    locale: params.lang,
  })

  return {
    snapshot,
    previewMode: await getPreviewMode(request),
  }
}, { apiKey: MAKESWIFT_SITE_API_KEY })


export default function Home({ loaderData }: Route.ComponentProps) {
  const { snapshot, previewMode } = loaderData

  if (snapshot == null) {
    throw new Response('Not Found', { status: 404 })
  }

  return (
    <MakeswiftProvider previewMode={previewMode}>
      <MakeswiftPage snapshot={snapshot} />
    </MakeswiftProvider>
  )
}
