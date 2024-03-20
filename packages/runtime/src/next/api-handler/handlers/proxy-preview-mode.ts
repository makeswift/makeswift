import { CookieSerializeOptions, serialize } from 'cookie'
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

const previewData: MakeswiftPreviewData = {
  makeswift: true,
  siteVersion: MakeswiftSiteVersion.Working,
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

  const {
    'X-Makeswift-Preview-Mode': xMakeswiftPreviewMode,
    'X-Invoke-Path': xInvokePath,
    'X-Invoke-Query': xInvokeQuery,
     ...headers
  } = req.headers

  const isForwardedProtoHttps = match(req.headers['X-Forwarded-Proto'])
    .with(P.string, x => x.split(','))
    .with(P.array(P.string), x => x)
    .otherwise(() => [])
    .includes('https')

  const isForwardedSSL = match(req.headers['X-Forwarded-SSL'])
    .with('on', () => true)
    .otherwise(() => false)

  const proto = isForwardedProtoHttps || isForwardedSSL ? 'https' : 'http'
  const url = new URL(`${proto}://${req.headers.host}${req.url}`)

  url.searchParams.delete('x-makeswift-preview-mode')

  const setCookie = res.setPreviewData(previewData).getHeader('Set-Cookie')

  if (!Array.isArray(setCookie)) return res.status(500).send('Internal Server Error')

  const additionalCookies = parse(setCookie)
    .map(cookie => serialize(cookie.name, cookie.value, cookie as CookieSerializeOptions))
    .join(';')

  const originalCookies = req.headers.cookie
  const cookie = originalCookies ? `${originalCookies}; ${additionalCookies}` : additionalCookies

  const response = await fetch(url, {
    headers: {
      ...headers as Record<string, string>,
      'Set-Cookie': cookie,
    },
    referrer: req.headers.referer,
  });

  res.removeHeader('Set-Cookie')

  response.headers.forEach((value, name) => {
    res.setHeader(name, value);
  })

  if (res.hasHeader('content-encoding')) {
    res.removeHeader('content-encoding')
    res.removeHeader('content-length')
  }

  res.write(response.body)
  res.end()
}
