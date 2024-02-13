import { NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { defaultLocale, locales } from '@/localization'

function getLocale(request: NextRequest) {
  const acceptLanguageHeader = request.headers.get('accept-language')
  let languages = new Negotiator({
    headers: { 'accept-language': acceptLanguageHeader ?? undefined },
  }).languages()

  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )
  if (pathnameHasLocale) return

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
