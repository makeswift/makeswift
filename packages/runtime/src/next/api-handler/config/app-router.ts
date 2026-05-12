import { P } from 'ts-pattern'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

import { MAKESWIFT_CACHE_TAG } from '../../cache'
import { type ApiResponse } from '../../../api-handler/request-response'

import { appRouterRedirectPreviewHandler } from '../handlers/app-router-redirect-preview'
import { MAKESWIFT_SITE_VERSION_COOKIE, PRERENDER_BYPASS_COOKIE } from '../preview'

import { validateApiRoute, type ApiHandlerConfig } from './base'
import { MakeswiftClient } from '../../../client'

type Params = { [key: string]: string | string[] }
type Context = { params: Promise<Params> }

// In older versions of Next (prior to 15.5.0), the inbound request is typed as
// a `NextRequest`, but requests received at runtime fail the `instanceof
// NextRequest` check. In newer versions of Next, requests are correctly typed
// as `NextRequest`. To maintain compatibility across all Next.js versions, we
// match against both.
export type ApiHandlerArgs = [NextRequest | Request, Context]
export const argsPattern = [
  P.union(P.instanceOf(Request), P.instanceOf(NextRequest)),
  P.any,
] as const

export async function config({
  req,
  context,
  client,
}: {
  req: NextRequest | Request
  context: Context
  client: MakeswiftClient
}): Promise<ApiHandlerConfig> {
  return {
    req,
    route: validateApiRoute(await context.params),
    previewCookieNames: [PRERENDER_BYPASS_COOKIE, MAKESWIFT_SITE_VERSION_COOKIE],
    sendResponse: async (res: ApiResponse): Promise<Response | void> => res,
    revalidationHandler: async (path?: string): Promise<void> => {
      if (path != null) {
        revalidatePath(path)
      } else {
        revalidateTag(MAKESWIFT_CACHE_TAG)
      }
    },
    customRoutes: async (route: string) => {
      if (route === '/redirect-preview') {
        // Convert any `Request` to `NextRequest` for consumption by the `appRouterRedirectPreviewHandler` call below
        const request = req instanceof NextRequest ? req : requestToNextRequest(req)
        return { res: await appRouterRedirectPreviewHandler(request, context, client) }
      }

      return null
    },
  }
}

const requestToNextRequest = (req: Request): NextRequest => {
  // Because we're supporting multiple versions of Next.js, we have to account for two issues here:
  //
  // 1. https://github.com/vercel/next.js/issues/52967 for Next prior to v13.4.17 (see
  //    https://github.com/vercel/next.js/commit/e1133cf0970e80d8f88e6c3516881780703eb7f5
  //    and https://github.com/vercel/next.js/commit/af97755e3c62a6b786b98b98ef8e91bf3d595957),
  //    which requires us to pass two arguments to the `NextRequest` constructor in order to
  //    fully copy the request
  //
  // 2. https://github.com/better-auth/better-auth/issues/8194#issuecomment-3975332346 for Next 16
  //    when running on Node.js 24+, which prevents us from simply passing the original request
  //    as the second argument to the `NextRequest` constructor, thus the manual copying of the
  //    relevant server-side properties

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'

  return new NextRequest(req.url, {
    method: req.method,
    headers: req.headers,
    signal: req.signal,
    ...(hasBody && { body: req.body, duplex: 'half' }),
  })
}
