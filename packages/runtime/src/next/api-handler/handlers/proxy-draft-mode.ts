import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'
import { cookies, draftMode } from 'next/headers'

import { MAKESWIFT_DRAFT_MODE_DATA_COOKIE, MakeswiftDraftData } from '../../draft-mode'
import { MakeswiftSiteVersion } from '../../preview-mode'

type Context = { params: { [key: string]: string | string[] } }

type ProxyDraftModeError = string

type ProxyResponse = { __brand: 'ProxyResponse' }

export type ProxyDraftModeResponse = ProxyDraftModeError | ProxyResponse

type ProxyDraftModeHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [req: NextApiRequest, res: NextApiResponse<ProxyDraftModeResponse>, params: { apiKey: string }]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

export default async function proxyDraftMode(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<ProxyDraftModeResponse>>
export default async function proxyDraftMode(
  req: NextApiRequest,
  res: NextApiResponse<ProxyDraftModeResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function proxyDraftMode(
  ...args: ProxyDraftModeHandlerArgs
): Promise<NextResponse<ProxyDraftModeResponse> | void> {
  return match(args)
    .with(routeHandlerPattern, args => proxyDraftModeRouteHandler(...args))
    .with(apiRoutePattern, args => proxyDraftModeApiRouteHandler(...args))
    .exhaustive()
}

async function proxyDraftModeRouteHandler(
  request: NextRequest,
  _context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<ProxyDraftModeResponse>> {
  const secret =
    request.nextUrl.searchParams.get('x-makeswift-draft-mode') ??
    request.headers.get('X-Makeswift-Draft-Mode')

  if (secret !== apiKey) return new NextResponse('Unauthorized', { status: 401 })

  const draftModeData: MakeswiftDraftData = {
    makeswift: true,
    siteVersion: MakeswiftSiteVersion.Working,
  }

  const draft = await draftMode()
  draft.enable()

  const forwardingHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host') 
  const forwardingProto = request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol

  const searchParams = new URLSearchParams(request.nextUrl.searchParams)
  searchParams.delete('x-makeswift-draft-mode')
  const headers = new Headers(request.headers)
  headers.delete('X-Makeswift-Draft-Mode')

  const proxyUrl = `${forwardingProto}//${forwardingHost}${request.nextUrl.pathname}?${searchParams}`
  const proxyRequest = new NextRequest(proxyUrl, { headers: headers })

  const draftModeCookie = (await cookies()).get('__prerender_bypass')
  if (draftModeCookie) {
    proxyRequest.cookies.set(draftModeCookie)
    proxyRequest.cookies.set(MAKESWIFT_DRAFT_MODE_DATA_COOKIE, JSON.stringify(draftModeData))
  }

  draft.disable()

  const proxyResponse = await fetch(proxyRequest)

  const response = new NextResponse<ProxyResponse>(proxyResponse.body, {
    headers: proxyResponse.headers,
    status: proxyResponse.status,
  })

  // `fetch` automatically decompresses the response, but the response headers will keep the
  // `content-encoding` and `content-length` headers. This will cause decoding issues if the client
  // attempts to decompress the response again. To prevent this, we remove these headers.
  //
  // See https://github.com/nodejs/undici/issues/2514.
  if (response.headers.has('content-encoding')) {
    response.headers.delete('content-encoding')
    response.headers.delete('content-length')
  }

  return response
}

async function proxyDraftModeApiRouteHandler(
  _req: NextApiRequest,
  res: NextApiResponse<ProxyDraftModeResponse>,
  {}: { apiKey: string },
): Promise<void> {
  const message =
    'Cannot request draft endpoint from an API handler registered in `pages`. Move your Makeswift API handler to the `app` directory'
  console.error(message)
  return res.status(500).send(message)
}
