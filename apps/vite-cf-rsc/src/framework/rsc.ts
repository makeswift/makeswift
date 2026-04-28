// import { type ReactFormState } from 'react-dom/server'
import { type ReactNode } from 'react'

import {
  renderToReadableStream,
  createTemporaryReferenceSet,
  decodeReply,
  loadServerAction,
  decodeAction,
  decodeFormState,
} from '@vitejs/plugin-rsc/rsc'

import { type RenderRequest, parseRenderRequest } from './request.tsx'

// The schema of payload which is serialized into RSC stream on rsc environment
// and deserialized on ssr/client environments.
export type RscPayload = {
  // this demo renders/serializes/deserializes entire root html element
  // but this mechanism can be changed to render/fetch different parts of components
  // based on your own route conventions.
  root: ReactNode
  // server action return value of non-progressive enhancement case
  returnValue?: { ok: boolean; data: unknown }
  // server action form state (e.g. useActionState) of progressive enhancement case
  formState?: any
}

export async function handleRenderRequest(
  request: Request,
  renderRoot: (req: Request) => Promise<ReactNode>,
): Promise<Response> {
  // classify the incoming request to differentiate RSC, SSR, action, etc.
  const renderRequest = parseRenderRequest(request)

  // handle server function request, if any
  const { options, status, ...payload } =
    await handleServerFuncRequest(renderRequest)

  // render the root React element
  const root = await renderRoot(renderRequest.request)

  // serialize React tree to RSC stream; the new render reflects updated
  // state from server function call
  const rscPayload: RscPayload = { root, ...payload }
  const rscStream = renderToReadableStream<RscPayload>(rscPayload, options)

  // respond with RSC stream if that's what was requested
  if (renderRequest.isRsc) {
    return new Response(rscStream, {
      status,
      headers: {
        'content-type': 'text/x-component;charset=utf-8',
      },
    })
  }

  // otherwise respond with (SSR-rendered) HTML + embedded RSC payload for browser hydration

  // The `viteRsc` plugin provides `loadModule` helper to allow loading SSR environment
  // entry module in RSC environment. This can be customized by implementing own runtime
  // communication, e.g. `@cloudflare/vite-plugin`'s service binding.
  const { renderHTML } = await import.meta.viteRsc.loadModule<
    typeof import('./entry.ssr.tsx')
  >('ssr', 'index')

  return await renderHTML(rscStream, {
    request,
    formState: rscPayload.formState,
    // allow quick simulation of javascript disabled browser
    debugNojs: renderRequest.url.searchParams.has('__nojs'),
  })
}

export async function renderRscElement(
  req: Request,
  renderElement: (req: Request) => Promise<ReactNode>,
): Promise<Response> {
  const rscStream = renderToReadableStream(renderElement(req))

  return new Response(rscStream, {
    headers: {
      'content-type': 'text/x-component;charset=utf-8',
    },
  })
}

async function handleServerFuncRequest({
  isAction,
  actionId,
  request,
}: RenderRequest): Promise<
  Partial<RscPayload> & {
    status?: number
    options?: { temporaryReferences: unknown }
  }
> {
  if (!isAction) return {}

  if (actionId) {
    // action is called via `ReactClient.setServerCallback`
    const contentType = request.headers.get('content-type')
    try {
      const body = contentType?.startsWith('multipart/form-data')
        ? await request.formData()
        : await request.text()

      const temporaryReferences = createTemporaryReferenceSet()
      const args = await decodeReply(body, { temporaryReferences })
      const action = await loadServerAction(actionId)

      const data = await action.apply(null, args)
      return {
        returnValue: { ok: true, data },
        options: { temporaryReferences },
      }
    } catch (e) {
      console.error('Server action failed', e)
      return { returnValue: { ok: false, data: e }, status: 500 }
    }
  }

  // otherwise server function is called via `<form action={...}>`
  // before hydration (e.g. when javascript is disabled).
  // aka progressive enhancement.
  const formData = await request.formData()
  const decodedAction = await decodeAction(formData)
  try {
    const result = await decodedAction()
    return { formState: await decodeFormState(result, formData) }
  } catch (e) {
    console.error('Form action failed', e)
    return { status: 500 }
  }
}
