import { NextMiddleware, NextRequest, NextResponse } from 'next/server'
import {
  unstable_createMakeswiftDraftRequest,
  unstable_fetchMakeswiftDraftProxyResponse,
} from '@makeswift/runtime/next/middleware'

import { MAKESWIFT_SITE_API_KEY } from './makeswift/env'

export const middleware: NextMiddleware = async (request: NextRequest) => {
  console.warn('MAKESWIFT MIDDLEWARE')
  const draftRequest = await unstable_createMakeswiftDraftRequest(
    request,
    MAKESWIFT_SITE_API_KEY,
  )

  if (draftRequest != null) {
    console.warn('draft request cookies', draftRequest.cookies.toString())
    console.warn('draft request headers', new Map(draftRequest.headers))
    const res = await unstable_fetchMakeswiftDraftProxyResponse(draftRequest)
    res.headers.delete('x-nextjs-cache')
    res.headers.delete('x-nextjs-prerender')
    res.headers.delete('x-powered-by')

    console.warn('proxy response headers', new Map(res.headers))
    return res
  }

  console.warn('non-draft request headers', new Map(request.headers))
  console.warn('non-draft request cookies', request.cookies.toString())

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and paths to the makeswift api handlers
    '/((?!_next|api/makeswift).*)',
  ],
}
