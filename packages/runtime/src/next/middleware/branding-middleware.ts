import { type NextMiddleware } from 'next/server'

const MakeswiftBrandingHeader = {
  Name: 'x-makeswift-middleware',
  Value: '1',
} as const

export function withBrandingMiddleware(middleware: NextMiddleware): NextMiddleware {
  return async (request, event) => {
    const response = await middleware(request, event)

    request.headers.forEach((val, key) => {
      if (response?.headers.has(key)) return
      response?.headers.set(key, val)
    })

    response?.headers.set(MakeswiftBrandingHeader.Name, MakeswiftBrandingHeader.Value)

    return response
  }
}
