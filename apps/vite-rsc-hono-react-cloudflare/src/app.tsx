'server-only'

import { HTTPException } from 'hono/http-exception'
import { Hono } from 'hono'

import {
  createApiHandler,
  createPreviewMiddleware,
} from '@makeswift/hono-react/server'

import {
  RenderElementPayload,
  MakeswiftRenderContext,
  ServerElement,
  RSCElementRenderer,
} from '@makeswift/runtime/react/server'

import { handleRenderRequest, renderRscElement } from './framework/rsc'
import { createRenderContext } from './framework/render-context'

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

      const context = await createRenderContext(c, { request: req, locale })

      return (
        <RSCElementRenderer context={context} cacheData={cacheData}>
          <ServerElement
            context={context}
            element={elementData}
            documentKey={documentKey}
          />
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
      return (
        <MakeswiftRenderContext
          context={await createRenderContext(c, { request: req, locale })}
        >
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

export default app
