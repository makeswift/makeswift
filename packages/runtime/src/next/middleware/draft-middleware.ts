import { type NextMiddleware, NextResponse } from 'next/server'
import { createMakeswiftDraftRequest, getMakeswiftDraftSecret } from './request-utils'

export function withDraftMiddleware(
  { apiKey }: { apiKey: string },
  middleware: NextMiddleware,
): NextMiddleware {
  return async (request, event) => {
    const secret = getMakeswiftDraftSecret(request)

    if (secret == null) {
      return await middleware(request, event)
    }

    if (secret != null && secret !== apiKey) {
      return NextResponse.json(
        { message: "Makeswift draft middleware: request's secret is incorrect" },
        { status: 401 },
      )
    }

    const draftRequest = await createMakeswiftDraftRequest(request, secret)

    const response = await middleware(draftRequest, event)

    draftRequest.headers.forEach((val, key) => {
      if (response?.headers.has(key)) return
      response?.headers.set(key, val)
    })

    return response
  }
}
