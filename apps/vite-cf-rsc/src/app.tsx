'server-only'

import { HTTPException } from 'hono/http-exception'
import { Hono, type Context } from 'hono'

import {
  createApiHandler,
  createPreviewMiddleware,
  getSiteVersion,
} from '@makeswift/hono-react/server'

import { RenderElementContext } from '@makeswift/runtime/rsc/server'

import { handleRenderRequest, renderRscElement } from './framework/rsc'
import { withMakeswift } from './lib/makeswift/middleware/with-makeswift'
import { type HonoEnv } from './lib/hono'
import { Root } from './root'

const app = new Hono<HonoEnv>()

app
  .use(withMakeswift())
  // FIXME: can we move this into the API handler?
  .use('/api/makeswift/rsc-element', (c) =>
    renderRscElement(c.req.raw, async (req) => {
      const { elementData, documentContext } = await req.json()
      const siteVersion = await getSiteVersion(c)

      return (
        <RenderElementContext
          runtime={c.var.makeswiftRuntime}
          client={c.var.makeswiftClient}
          siteVersion={siteVersion}
          documentKey={documentContext.key}
          locale={documentContext.locale}
          elementData={elementData}
        />
      )
    }),
  )
  .use('/api/makeswift/*', (c, next) =>
    createApiHandler({
      runtime: c.var.makeswiftRuntime,
      apiKey: import.meta.env.VITE_MAKESWIFT_SITE_API_KEY,
    })(c, next),
  )
  .use((c, next) =>
    createPreviewMiddleware({
      runtime: c.var.makeswiftRuntime,
      apiKey: import.meta.env.VITE_MAKESWIFT_SITE_API_KEY,
    })(c, next),
  )
  .all('*', async (c) =>
    handleRenderRequest(c.req.raw, async (req) => {
      const pathname = new URL(req.url).pathname
      const siteVersion = await getSiteVersion(c)
      const snapshot = await c.var.makeswiftClient.getComponentSnapshot(
        pathname,
        {
          siteVersion,
        },
      )

      if (snapshot == null) {
        throw new HTTPException(404, { message: 'Snapshot not found' })
      }

      return <Root /*snapshot={snapshot} siteVersion={siteVersion}*/ />
    }),
  )
  .onError((err, c) => {
    if (err instanceof HTTPException) return err.getResponse()

    // for any other unexpected errors, log and return a generic 500 response
    console.error(err)
    return c.text('Internal Server Error', 500)
  })

export default app
