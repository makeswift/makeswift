import { type SiteVersion, ReactRuntime } from '@makeswift/vite-rsc'

import { registerBoxComponent } from '@makeswift/runtime/react/builtins/box'
import { registerButtonComponent } from '@makeswift/runtime/react/builtins/button'
import { registerImageComponent } from '@makeswift/runtime/react/builtins/image'
import { registerSlotComponent } from '@makeswift/runtime/react/builtins/slot'
import { registerTextComponent } from '@makeswift/runtime/react/builtins/text'

import * as Components from './components'

export type RequestKey = {
  siteVersion: SiteVersion | null
  locale: string | undefined
}

export function createRuntime({
  requestKey,
  apiKey,
}: {
  requestKey?: RequestKey
  apiKey?: string
} = {}) {
  const runtime = new ReactRuntime({
    requestKey,
    apiKey,
    appOrigin: import.meta.env.VITE_MAKESWIFT_APP_ORIGIN,
    apiOrigin: import.meta.env.VITE_MAKESWIFT_API_ORIGIN,
  })

  registerBoxComponent(runtime)
  registerButtonComponent(runtime)
  registerImageComponent(runtime)
  registerSlotComponent(runtime)
  registerTextComponent(runtime)

  Components.registerClockComponent(runtime)
  Components.registerRscMarkdownComponent(runtime)

  return runtime
}
