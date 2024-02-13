import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DRAFT_MODE_HEADER = 'X-Makeswift-Draft-Mode'
const DRAFT_MODE_SEARCH_PARAM = 'x-makeswift-draft-mode'

export async function withMakeswiftMiddleware(request: NextRequest) {
  // Verify that we have a secret from the original request. Otherwise, pass
  // through the request
  const secret =
    request.nextUrl.searchParams.get(DRAFT_MODE_SEARCH_PARAM) ??
    request.headers.get(DRAFT_MODE_HEADER)
  if (secret == null) return NextResponse.next()

  // Contact our API route with this secret. The response should contain a
  // "Set-Cookie" header with the draft mode token and our custom Makeswift
  // draft mode set.
  const getDraftModeRoute = new URL('/api/makeswift/get-draft-mode', request.url)
  getDraftModeRoute.searchParams.set('x-makeswift-draft-mode', secret)

  const draftModeResponse = await fetch(getDraftModeRoute)
  if (!draftModeResponse.ok) return new NextResponse('Failed to get draft data', { status: 500 })

  // Bug: For some reason, the way Next.js sets cookies on the response is using
  // a comma separated string, which is against spec and prevents the cookies
  // from being properly parsed. We resolve this by replacing any commas with a
  // semi-colon in the "Set-Cookie" result header we received. See
  // https://github.com/vercel/next.js/issues/54033
  const draftModeCookies = draftModeResponse.headers.get('Set-Cookie')?.replace(', ', '; ')
  if (draftModeCookies == null) return new NextResponse('Failed to get draft data', { status: 500 })

  // Now, we rewrite to the original page path. Remove the secret from the query
  // param/header from the original request and set the cookies as though they
  // were attached to the original request
  const rewriteRequestCookies = request.cookies.toString()

  const destination = new URL(request.url)
  destination.searchParams.delete(DRAFT_MODE_SEARCH_PARAM)

  const rewriteRequestHeaders = new Headers(request.headers)
  rewriteRequestHeaders.delete(DRAFT_MODE_HEADER)
  rewriteRequestHeaders.set('Cookie', `${rewriteRequestCookies}; ${draftModeCookies}`)

  const res = NextResponse.rewrite(destination, {
    request: {
      headers: rewriteRequestHeaders,
    },
  })

  return res
}
