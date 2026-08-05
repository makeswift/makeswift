import { type Context } from 'hono'

import { getSiteVersion } from '@makeswift/hono-react/server'

import { ServerCSSCollector } from '@makeswift/runtime/react/server'

export const createRenderContext = async (
  c: Context,
  { request, locale }: { request: Request; locale: string | undefined },
) => ({
  request,
  runtime: c.var.makeswiftRuntime,
  client: c.var.makeswiftClient,
  cssCollector: new ServerCSSCollector(),
  siteVersion: await getSiteVersion(c),
  locale,
})
