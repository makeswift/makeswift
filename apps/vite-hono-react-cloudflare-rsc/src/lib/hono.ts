import {
  Makeswift as MakeswiftClient,
  ReactRuntime as MakeswiftRuntime,
  type SiteVersion,
} from '@makeswift/hono-react'

export type HonoEnv = {
  Variables: {
    makeswiftRuntime: MakeswiftRuntime
    makeswiftClient: MakeswiftClient
    siteVersion: SiteVersion | null
  }
}
