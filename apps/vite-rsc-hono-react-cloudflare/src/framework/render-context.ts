import { type Context } from 'hono'

import { getSiteVersion } from '@makeswift/hono-react/server'

import { type HonoEnv } from '../lib/hono'
import { rootStyleProps } from '../lib/makeswift/styles'

export const createRenderContext = async (
  c: Context<HonoEnv>,
  { request, locale }: { request: Request; locale: string | undefined },
) => {
  const runtime = c.var.makeswiftRuntime
  const siteVersion = await getSiteVersion(c)

  return {
    request,
    runtime,
    client: c.var.makeswiftClient,
    siteVersion,
    locale,
    rootStyleProps,
    store: runtime.getOrCreateStore({ siteVersion, locale }),
  }
}
