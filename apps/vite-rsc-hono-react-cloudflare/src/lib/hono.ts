import {
  Makeswift as MakeswiftClient,
  ReactRuntime as MakeswiftRuntime,
  type SiteVersion,
} from '@makeswift/hono-react'
import { type RootStyleProps } from '@makeswift/runtime/unstable-framework-support'

export type HonoEnv = {
  Variables: {
    makeswiftRuntime: MakeswiftRuntime
    makeswiftClient: MakeswiftClient
    siteVersion: SiteVersion | null
    rootStyleProps: RootStyleProps
  }
}
