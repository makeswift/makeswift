import { NextRequest } from 'next/server'
import { MAKESWIFT_DRAFT_DATA_COOKIE, PRERENDER_BYPASS_COOKIE } from '../api-handler/draft'

const HeaderNames = {
  DraftMode: 'X-Makeswift-Draft-Mode',
  PreviewMode: 'X-Makeswift-Preview-Mode',
} as const

const SearchParams = {
  DraftMode: 'x-makeswift-draft-mode',
  PreviewMode: 'x-makeswift-preview-mode',
} as const

function getDraftModeSecret(request: NextRequest): string | null {
  return (
    request.nextUrl.searchParams.get(SearchParams.DraftMode) ??
    request.headers.get(HeaderNames.DraftMode) ??
    null
  )
}

export function isDraftModeRequest(request: NextRequest): boolean {
  const hasSecret = getDraftModeSecret(request) != null
  if (hasSecret) return true

  const hasDraftCookies =
    request.cookies.has(PRERENDER_BYPASS_COOKIE) && request.cookies.has(MAKESWIFT_DRAFT_DATA_COOKIE)

  if (hasDraftCookies) return true

  return false
}
