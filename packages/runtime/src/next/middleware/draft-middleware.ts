import { type NextMiddleware, NextResponse } from 'next/server'
import { createDraftRequest, getDraftSecret } from './request-utils'

export function withDraftMiddleware(
  { apiKey }: { apiKey: string },
  middleware: NextMiddleware,
): NextMiddleware {
  return async (request, event) => {
    const secret = getDraftSecret(request)

    if (secret == null) {
      return await middleware(request, event)
    }

    if (secret != null && secret !== apiKey) {
      return NextResponse.json(
        { message: 'Makeswift draft middleware: request draft secret is incorrect' },
        { status: 401 },
      )
    }

    const draftRequest = await createDraftRequest(request, secret)

    const response = await middleware(draftRequest, event)

    draftRequest.headers.forEach((val, key) => {
      if (response?.headers.has(key)) return
      response?.headers.set(key, val)
    })

    return response
  }
}
