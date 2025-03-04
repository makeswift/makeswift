import { NextRequest, NextResponse } from 'next/server'
import {
  unstable_createMakeswiftDraftRequest,
  unstable_fetchMakeswiftDraftProxyResponse,
} from '@makeswift/runtime/next/middleware'

import { getLocale, locales } from '@/localization'
import { MAKESWIFT_SITE_API_KEY } from './makeswift/env'

export async function middleware(request: NextRequest): Promise<NextResponse> {
  console.warn('MAKESWIFT MIDDLEWARE')

  const draftRequest = await unstable_createMakeswiftDraftRequest(
    // @ts-ignore Next version mismatch errors
    request,
    MAKESWIFT_SITE_API_KEY,
  )

  if (draftRequest != null) {
    console.warn('draft request cookies', draftRequest.cookies.toString())
    console.warn(
      `draft request headers ${draftRequest.nextUrl.toString()}`,
      new Map(draftRequest.headers),
    )
    const res = await unstable_fetchMakeswiftDraftProxyResponse(draftRequest)
    res.headers.delete('x-nextjs-cache')
    res.headers.delete('x-nextjs-prerender')
    res.headers.delete('x-powered-by')

    console.warn('proxy response headers', new Map(res.headers))
    // @ts-ignore Next version mismatch errors
    return res
  }

  console.warn('non-draft request headers', new Map(request.headers))
  console.warn('non-draft request cookies', request.cookies.toString())

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
