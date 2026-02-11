'server-only'

import {
  renderToReadableStream,
  createTemporaryReferenceSet,
  decodeReply,
  loadServerAction,
  decodeAction,
  decodeFormState,
} from '@vitejs/plugin-rsc/rsc'
import {
  createApiHandler,
  createPreviewMiddleware,
  getSiteVersion,
} from '@makeswift/hono-react/server'
import { RenderElementContext } from '@makeswift/runtime/rsc/server'
import { Hono, type Context } from 'hono'
import type { ReactFormState } from 'react-dom/client'
import { Root } from '../root.tsx'
import { parseRenderRequest } from './request.tsx'
import { runtime } from '../lib/makeswift/runtime'
import { client } from '../lib/makeswift/client.ts'

const app = new Hono()

app.use('/api/makeswift/*', (c, next) =>
  createApiHandler({
    runtime,
    appOrigin: import.meta.env.VITE_MAKESWIFT_APP_ORIGIN,
    apiOrigin: import.meta.env.VITE_MAKESWIFT_API_ORIGIN,
    apiKey: import.meta.env.VITE_MAKESWIFT_SITE_API_KEY,
  })(c, next),
)

app.use((c, next) =>
  createPreviewMiddleware({
    runtime,
    apiOrigin: import.meta.env.VITE_MAKESWIFT_API_ORIGIN,
    apiKey: import.meta.env.VITE_MAKESWIFT_SITE_API_KEY,
  })(c, next),
)

// V2 subtree replacement: render a single server element on demand.
// Called by RSCBuilderUpdater and RSCRefreshCoordinator on the client
// when an individual RSC element needs to be re-rendered.
app.post('/__rsc-element', async (c) => {
  const { elementData, documentContext } = await c.req.json()
  const siteVersion = await getSiteVersion(c)

  const rscStream = renderToReadableStream(
    <RenderElementContext
      runtime={runtime}
      client={client}
      siteVersion={siteVersion}
      documentKey={documentContext.key}
      locale={documentContext.locale}
      elementData={elementData}
    />,
  )

  return new Response(rscStream, {
    headers: {
      'content-type': 'text/x-component;charset=utf-8',
    },
  })
})

app.all('*', async (c) => {
  return handler(c)
})

export default app

export type RscPayload = {
  root: React.ReactNode
  returnValue?: { ok: boolean; data: unknown }
  formState?: ReactFormState
}

async function handler(c: Context): Promise<Response> {
  // differentiate RSC, SSR, action, etc.
  let request = c.req.raw
  const renderRequest = parseRenderRequest(request)
  request = renderRequest.request

  // handle server function request
  let returnValue: RscPayload['returnValue'] | undefined
  let formState: ReactFormState | undefined
  let temporaryReferences: unknown | undefined
  let actionStatus: number | undefined
  if (renderRequest.isAction === true) {
    if (renderRequest.actionId) {
      // action is called via `ReactClient.setServerCallback`.
      const contentType = request.headers.get('content-type')
      const body = contentType?.startsWith('multipart/form-data')
        ? await request.formData()
        : await request.text()
      temporaryReferences = createTemporaryReferenceSet()
      const args = await decodeReply(body, { temporaryReferences })
      const action = await loadServerAction(renderRequest.actionId)
      try {
        const data = await action.apply(null, args)
        returnValue = { ok: true, data }
      } catch (e) {
        returnValue = { ok: false, data: e }
        actionStatus = 500
      }
    } else {
      // otherwise server function is called via `<form action={...}>`
      // before hydration (e.g. when javascript is disabled).
      // aka progressive enhancement.
      const formData = await request.formData()
      const decodedAction = await decodeAction(formData)
      try {
        const result = await decodedAction()
        formState = await decodeFormState(result, formData)
      } catch (e) {
        // there's no single general obvious way to surface this error,
        // so explicitly return classic 500 response.
        return new Response('Internal Server Error: server action failed', {
          status: 500,
        })
      }
    }
  }

  const siteVersion = await getSiteVersion(c)

  const snapshot = await client.getComponentSnapshot('/', {
    siteVersion,
  })

  if (snapshot == null) {
    return new Response('Snapshot not found', { status: 404 })
  }

  // serialization from React VDOM tree to RSC stream.
  // we render RSC stream after handling server function request
  // so that new render reflects updated state from server function call
  // to achieve single round trip to mutate and fetch from server.
  const rscPayload: RscPayload = {
    root: <Root snapshot={snapshot} siteVersion={siteVersion} />,
    formState,
    returnValue,
  }
  const rscOptions = { temporaryReferences }
  const rscStream = renderToReadableStream<RscPayload>(rscPayload, rscOptions)

  // Respond RSC stream without HTML rendering as decided by `RenderRequest`
  if (renderRequest.isRsc) {
    return new Response(rscStream, {
      status: actionStatus,
      headers: {
        'content-type': 'text/x-component;charset=utf-8',
      },
    })
  }

  const { renderHTML } = await import.meta.viteRsc.loadModule<
    typeof import('./entry.ssr.tsx')
  >('ssr', 'index')
  return await renderHTML(rscStream, {
    request,
    formState,
    // allow quick simulation of javascript disabled browser
    debugNojs: renderRequest.url.searchParams.has('__nojs'),
  })
}

if (import.meta.hot) {
  import.meta.hot.accept()
}
