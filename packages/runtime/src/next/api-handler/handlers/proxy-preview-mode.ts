import { CookieSerializeOptions, serialize } from 'cookie'
import { createProxyServer } from 'http-proxy'
import { NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'set-cookie-parser'
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
  const previewModeProxy = createProxyServer()

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

  previewModeProxy.once('proxyReq', proxyReq => {
    proxyReq.removeHeader('X-Makeswift-Preview-Mode')

    // The following headers are Next.js-specific and are removed to prevent Next.js from
    // short-circuiting requests, breaking routing.
    proxyReq.removeHeader('X-Invoke-Path')
    proxyReq.removeHeader('X-Invoke-Query')

    const url = new URL(proxyReq.path, 'http://n')

    url.searchParams.delete('x-makeswift-preview-mode')

    proxyReq.path = url.pathname + url.search
  })

  if (req.query.secret !== apiKey) return res.status(401).send('Unauthorized')

  const host = req.headers.host
  const originalCookies = req.headers.cookie

  if (host == null) return res.status(400).send('Bad Request')

  const forwardedProtoHeader = req.headers['x-forwarded-proto']

  let forwardedProto: string[] = []
  if (Array.isArray(forwardedProtoHeader)) {
    forwardedProto = forwardedProtoHeader
  } else if (typeof forwardedProtoHeader === 'string') {
    forwardedProto = forwardedProtoHeader.split(',')
  }

  const isForwardedProtoHttps = forwardedProto.includes('https')

  const forwardedSSL = req.headers['x-forwarded-ssl']
  const isForwardedSSL = typeof forwardedSSL === 'string' && forwardedSSL === 'on'

  const proto = isForwardedProtoHttps || isForwardedSSL ? 'https' : 'http'
  let target = `${proto}://${host}`

  // If the user generates a locally-trusted CA for their SSL cert, it's likely that Node.js won't
  // trust this CA unless they used the `NODE_EXTRA_CA_CERTS` option
  // (see https://stackoverflow.com/a/68135600). To provide a better developer experience, instead
  // of requiring the user to provide the CA to Node.js, we don't enforce SSL during local
  // development.
  const secure = process.env['NODE_ENV'] === 'production'

  const previewData: MakeswiftPreviewData = {
    makeswift: true,
    siteVersion: MakeswiftSiteVersion.Working,
  }
  const setCookie = res.setPreviewData(previewData).getHeader('Set-Cookie')
  res.removeHeader('Set-Cookie')

  if (!Array.isArray(setCookie)) return res.status(500).send('Internal Server Error')

  const additionalCookies = parse(setCookie)
    .map(cookie => serialize(cookie.name, cookie.value, cookie as CookieSerializeOptions))
    .join(';')

  const cookie = originalCookies ? `${originalCookies}; ${additionalCookies}` : additionalCookies

  return await new Promise<void>((resolve, reject) =>
    previewModeProxy.web(req, res, { target, headers: { cookie }, secure }, err => {
      if (err) reject(err)
      else resolve()
    }),
  )
}
