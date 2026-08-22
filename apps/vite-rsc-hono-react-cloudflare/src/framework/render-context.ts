import { type Context } from 'hono'

import { getSiteVersion } from '@makeswift/hono-react/server'

export const createRenderContext = async (
  c: Context,
  { request, locale }: { request: Request; locale: string | undefined },
) => ({
  request,
  runtime: c.var.makeswiftRuntime,
  client: c.var.makeswiftClient,
  siteVersion: await getSiteVersion(c),
  locale,
  rootStyleProps: c.var.rootStyleProps,
})
