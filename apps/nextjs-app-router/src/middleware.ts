import { NextRequest, NextResponse } from 'next/server'
import { withMakeswiftMiddleware } from '@makeswift/runtime/next/middleware'
import { getLocale, locales } from '@/localization'
import { MAKESWIFT_SITE_API_KEY } from '@/makeswift/env'

function localizationMiddleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )
  if (pathnameHasLocale) return NextResponse.next()

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`

  return NextResponse.redirect(request.nextUrl)
}

export const middleware = withMakeswiftMiddleware(
  { apiKey: MAKESWIFT_SITE_API_KEY },
  // @ts-ignore Type mismatch on NextRequest due to conflicting React versions
  // in this app vs. runtime
  localizationMiddleware,
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
