import { NextApiRequest } from 'next'
import { NextRequest } from 'next/server'

export function originalRequestProtocol(request: NextRequest): string | null {
  // The `x-forwarded-proto` header is not formally standardized, but many proxies
  // *append* the protocol used for the request to the existing value. As a result,
  // if the request passes through multiple proxies, the header may contain a
  // comma-separated list of protocols: https://code.djangoproject.com/ticket/33569
  const forwardedProto = request.headers.get('x-forwarded-proto')
  return forwardedProto != null ? forwardedProto.split(',')[0].trim() : null
}

export function appRouterGetRequestUrl(request: NextRequest) {
  const redirectProtocol =
    originalRequestProtocol(request) ?? request.nextUrl.protocol.replace(':', '')

  const redirectHost =
    request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? request.nextUrl.host

  const redirectUrl = new URL(
    `${redirectProtocol}://${redirectHost}${request.nextUrl.pathname}${request.nextUrl.search}`,
  )

  return redirectUrl
}

export function pagesRouterGetRequestPath(request: NextApiRequest): string | undefined {
  // Next.js automatically strips the locale prefix from rewritten request's URL, even when the
  // rewrite's `locale` option is set to `false`: https://github.com/vercel/next.js/discussions/21798.
  // At the same time, it also maps rewrite's URL segments (e.g. `:path`) to query parameters
  // on the rewritten request, so we use `query.path` to recover the original request path.
  return request.query.path as string | undefined
}
