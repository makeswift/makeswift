import type { AppLoadContext, EntryContext } from 'react-router'
import { ServerRouter } from 'react-router'

import { renderHtml } from '@makeswift/react-router/server'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  _loadContext: AppLoadContext
): Promise<Response> {
  return renderHtml(<ServerRouter context={reactRouterContext} url={request.url} />, {
    request,
    responseStatusCode,
    responseHeaders,
  })
}
