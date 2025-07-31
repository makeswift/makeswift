import { NextRequest } from 'next/server'
import {
  MAKESWIFT_VERSION_DATA_COOKIE,
  PRERENDER_BYPASS_COOKIE,
  SearchParams,
} from '../api-handler/draft'

function getPreviewTokenParam(request: NextRequest): string | null {
  return request.nextUrl.searchParams.get(SearchParams.PreviewToken) ?? null
}

export function hasLegacyDraftModeCookies(request: NextRequest): boolean {
  return (
    request.cookies.has(PRERENDER_BYPASS_COOKIE) &&
    request.cookies.has(MAKESWIFT_VERSION_DATA_COOKIE)
  )
}

export function isDraftModeRequest(request: NextRequest): boolean {
  const hasToken = getPreviewTokenParam(request) != null
  if (hasToken) return true

  const hasDraftCookies =
    request.cookies.has(PRERENDER_BYPASS_COOKIE) &&
    request.cookies.has(MAKESWIFT_VERSION_DATA_COOKIE)

  if (hasDraftCookies) return true

  return false
}
