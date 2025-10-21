import { NextRequest, NextResponse } from 'next/server'

import { getLocale, locales } from '@/localization'

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )
  if (pathnameHasLocale) return NextResponse.next()

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`

  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and paths to the makeswift api handlers
    '/((?!_next|api/makeswift).*)',
  ],
}
