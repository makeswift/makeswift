import { type SiteVersion, ReactRuntime } from '@makeswift/hono-react'

import * as Components from './components'

export type RequestKey = {
  siteVersion: SiteVersion | null
  locale: string | undefined
}

export function createRuntime(requestKey: RequestKey) {
  const runtime = new ReactRuntime({
    requestKey,
    appOrigin: import.meta.env.VITE_MAKESWIFT_APP_ORIGIN,
    apiOrigin: import.meta.env.VITE_MAKESWIFT_API_ORIGIN,
  })

  Components.registerClockComponent(runtime)
  Components.registerRscMarkdownComponent(runtime)

  return runtime
}
