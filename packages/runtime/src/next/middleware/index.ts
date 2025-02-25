import { NextResponse, type NextMiddleware } from 'next/server'
import { withDraftMiddleware } from './draft-middleware'
import { withBrandingMiddleware } from './branding-middleware'

type MiddlewareDecorator = (middleware: NextMiddleware) => NextMiddleware

function composeMiddlewares(
  baseMiddleware: NextMiddleware,
  firstMiddlewareDecorator: MiddlewareDecorator,
  ...otherMiddlewareWrappers: MiddlewareDecorator[]
) {
  const middlewares = otherMiddlewareWrappers.reduce(
    (accumulatedMiddlewares, nextMiddleware) => middleware =>
      accumulatedMiddlewares(nextMiddleware(middleware)),
    firstMiddlewareDecorator,
  )

  return middlewares(baseMiddleware)
}

const passThroughMiddleware: NextMiddleware = (_req, _event) => NextResponse.next()

export function withMakeswiftMiddleware(
  config: { apiKey: string },
  middleware: NextMiddleware = passThroughMiddleware,
): NextMiddleware {
  const draftDecorator = (middleware: NextMiddleware) => withDraftMiddleware(config, middleware)
  return composeMiddlewares(middleware, draftDecorator, withBrandingMiddleware)
}
