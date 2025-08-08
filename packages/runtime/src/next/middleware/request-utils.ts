import { NextRequest } from 'next/server'
import {
  MAKESWIFT_SITE_VERSION_COOKIE,
  PRERENDER_BYPASS_COOKIE,
  SearchParams,
} from '../api-handler/draft'

function getPreviewTokenParam(request: NextRequest): string | null {
  return request.nextUrl.searchParams.get(SearchParams.PreviewToken) ?? null
}

export function hasDraftModeCookies(request: NextRequest): boolean {
  return (
    request.cookies.has(PRERENDER_BYPASS_COOKIE) &&
    request.cookies.has(MAKESWIFT_SITE_VERSION_COOKIE)
  )
}

export function isDraftModeRequest(request: NextRequest): boolean {
  const hasToken = getPreviewTokenParam(request) != null
  if (hasToken) return true

  return hasDraftModeCookies(request)
}
