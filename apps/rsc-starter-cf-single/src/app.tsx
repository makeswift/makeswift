'server-only'

import { HTTPException } from 'hono/http-exception'
import { Hono, type Context } from 'hono'

import {
  createApiHandler,
  createPreviewMiddleware,
  getSiteVersion,
} from '@makeswift/hono-react/server'

import {
  RenderElementPayload,
  ServerCSSCollector,
  MakeswiftRenderContext,
  ServerElement,
  RSCElementRenderer,
} from '@makeswift/runtime/react/server'

import { handleRenderRequest, renderRscElement } from './framework/rsc'
import { withMakeswift } from './lib/makeswift/middleware/with-makeswift'
import { type HonoEnv } from './lib/hono'
import { Root } from './root'

const app = new Hono<HonoEnv>()

app
  .use(withMakeswift())
  // FIXME: can we move this into the API handler, e.g. '/api/makeswift/rsc-element'?
  .use('/__rsc-element', (c) =>
    renderRscElement(c.req.raw, async (req) => {
      const {
        elementData,
        cacheData,
        documentContext: { key: documentKey, locale },
      } = RenderElementPayload.schema.parse(await req.json())

      console.log('@@ rendering server element', elementData)

      const context = await renderContext(c, { locale })

      return (
        <RSCElementRenderer context={context} cacheData={cacheData}>
          <ServerElement context={context} element={elementData} />
        </RSCElementRenderer>
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
      const locale = undefined
      // const snapshot = await c.var.makeswiftClient.getComponentSnapshot(
      //   pathname,
      //   {
      //     siteVersion,
      //   },
      // )

      // if (snapshot == null) {
      //   throw new HTTPException(404, {
      //     message: `Snapshot not found (${pathname})`,
      //   })
      // }
      return (
        <MakeswiftRenderContext context={await renderContext(c, { locale })}>
          <Root />
        </MakeswiftRenderContext>
      )
    }),
  )
  .onError((err, c) => {
    if (err instanceof HTTPException) return err.getResponse()

    // for any other unexpected errors, log and return a generic 500 response
    console.error(err)
    return c.text('Internal Server Error', 500)
  })

const renderContext = async (
  c: Context,
  { locale }: { locale: string | undefined },
) => ({
  request: c.req.raw,
  runtime: c.var.makeswiftRuntime,
  client: c.var.makeswiftClient,
  cssCollector: new ServerCSSCollector(),
  siteVersion: await getSiteVersion(c),
  locale,
})

export default app
