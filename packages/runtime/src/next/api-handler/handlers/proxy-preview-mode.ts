import { NextApiRequest, NextApiResponse } from 'next'
import { MakeswiftPreviewData, MakeswiftSiteVersion } from '../../preview-mode'
import { NextRequest, NextResponse } from 'next/server'
import { P, match } from 'ts-pattern'

type Context = { params: { [key: string]: string | string[] } }

type ProxyPreviewModeError = string

type ProxyResponse = { __brand: 'ProxyResponse' }

export type ProxyPreviewModeResponse = ProxyPreviewModeError | ProxyResponse

type ProxyPreviewModeHandlerArgs =
  | [request: NextRequest, context: Context, params: { apiKey: string }]
  | [
      req: NextApiRequest,
      res: NextApiResponse<ProxyPreviewModeResponse>,
      params: { apiKey: string },
    ]

const routeHandlerPattern = [P.instanceOf(Request), P.any, P.any] as const
const apiRoutePattern = [P.any, P.any, P.any] as const

function mapRequestHeadersToHeaders(requestHeaders: NextApiRequest['headers']): Headers {
  const headers = new Headers()

  Object.entries(requestHeaders).forEach(([key, value]) => {
    match(value)
      .with(P.array(P.string), value => value.map(val => headers.append(key, val)))
      .with(P.string, value => headers.set(key, value))
  })

  return headers
}

function mapRequestToProxyUrl(req: NextApiRequest): URL {
  const isForwardedProtoHttps = match(req.headers['x-forwarded-proto'])
    .with(P.string, x => x.split(','))
    .with(P.array(P.string), x => x)
    .otherwise(() => [])
    .includes('https')

  const isForwardedSSL = match(req.headers['x-forwarded-ssl'])
    .with('on', () => true)
    .otherwise(() => false)

  const proto = isForwardedProtoHttps || isForwardedSSL ? 'https' : 'http'

  return new URL(`${proto}://${req.headers.host}${req.url}`)
}

export default async function proxyPreviewMode(
  request: NextRequest,
  context: Context,
  { apiKey }: { apiKey: string },
): Promise<NextResponse<ProxyPreviewModeResponse>>
export default async function proxyPreviewMode(
  req: NextApiRequest,
  res: NextApiResponse<ProxyPreviewModeResponse>,
  { apiKey }: { apiKey: string },
): Promise<void>
export default async function proxyPreviewMode(
  ...args: ProxyPreviewModeHandlerArgs
): Promise<NextResponse<ProxyPreviewModeResponse> | void> {
  return match(args)
    .with(routeHandlerPattern, args => proxyPreviewModeRouteHandler(...args))
    .with(apiRoutePattern, args => proxyPreviewModeApiRouteHandler(...args))
    .exhaustive()
}

async function proxyPreviewModeRouteHandler(
  _request: NextRequest,
  _context: Context,
  {}: { apiKey: string },
): Promise<NextResponse<ProxyPreviewModeResponse>> {
  const message =
    'Cannot request preview endpoint from an API handler registered in `app`. Move your Makeswift API handler to the `pages/api` directory'
  console.error(message)
  return NextResponse.json(message, { status: 500 })
}

async function proxyPreviewModeApiRouteHandler(
  req: NextApiRequest,
  res: NextApiResponse<ProxyPreviewModeResponse>,
  { apiKey }: { apiKey: string },
): Promise<void> {
  if (req.query.secret !== apiKey) return res.status(401).send('Unauthorized')
  if (req.headers.host == null) return res.status(400).send('Bad Request')

  // TODO: This is a hack to get the locale from the request.
  // Next.js strips the locale from the req.url, and there's no official way to get the locale
  // from an API route: https://github.com/vercel/next.js/discussions/21798.
  // The current workaround is to get the locale from an internal object: RequestMeta,
  // https://github.com/vercel/next.js/blob/a0d1d728b9003f12c9df6c5e9a33bc4c33cef0ab/packages/next/src/server/request-meta.ts
  // One possible way to properly fix this is by updating how we do preview mode. For example,
  // by using partitioned cookies instead of a proxy.
  const NextRequestMetaSymbol = Reflect.ownKeys(req).find(
    key =>
      key.toString() === 'Symbol(NextRequestMeta)' ||
      key.toString() === 'Symbol(NextInternalRequestMeta)',
  ) as keyof NextApiRequest | undefined

  if (NextRequestMetaSymbol) {
    const nextRequestMeta = req[NextRequestMetaSymbol]
    const initUrl = nextRequestMeta?.__NEXT_INIT_URL ?? nextRequestMeta?.initURL
    const isLocaleStripped =
      nextRequestMeta?.__nextStrippedLocale ?? nextRequestMeta?.didStripLocale

    try {
      if (isLocaleStripped && initUrl) req.url = new URL(initUrl).pathname
    } catch {}
  }

  const proxyHeaders = mapRequestHeadersToHeaders(req.headers)
  const proxyUrl = mapRequestToProxyUrl(req)

  proxyUrl.searchParams.delete('x-makeswift-preview-mode')
  proxyHeaders.delete('x-makeswift-preview-mode')
  // The following headers are Next.js-specific and are removed to prevent Next.js from
  // short-circuiting requests, breaking routing.
  proxyHeaders.delete('x-invoke-path')
  proxyHeaders.delete('x-invoke-query')

  const previewData: MakeswiftPreviewData = {
    makeswift: true,
    // This will eventually be dynamic
    siteVersion: MakeswiftSiteVersion.Working,
  }

  const setCookie = res.setPreviewData(previewData).getHeader('set-cookie')
  res.removeHeader('set-cookie')

  if (!Array.isArray(setCookie)) return res.status(500).send('Internal Server Error')

  setCookie.forEach(cookie => proxyHeaders.append('cookie', cookie))

  const response = await fetch(proxyUrl, {
    headers: proxyHeaders,
  })

  response.headers.forEach((value, name) => {
    res.setHeader(name, value)
  })

  res.statusCode = response.status
  res.statusMessage = response.statusText

  // `fetch` automatically decompresses the response, but the response headers will keep the
  // `content-encoding` and `content-length` headers. This will cause decoding issues if the client
  // attempts to decompress the response again. To prevent this, we remove these headers.
  //
  // See https://github.com/nodejs/undici/issues/2514.
  if (res.hasHeader('content-encoding')) {
    res.removeHeader('content-encoding')
    res.removeHeader('content-length')
  }

  const arrayBuffer = await response.arrayBuffer()

  res.write(new Uint8Array(arrayBuffer))
  res.end()
}
