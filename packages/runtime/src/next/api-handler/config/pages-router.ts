import { P } from 'ts-pattern'
import { NextApiRequest, NextApiResponse } from 'next'

import { type ApiResponse } from '../../../api-handler/request-response'
import { toApiRequest, pipeResponseTo } from '../../../api-handler/node-request-response'

import { pagesRouterRedirectPreviewHandler } from '../handlers/pages-router-redirect-preview'
import { PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE } from '../preview'

import { validateApiRoute, type ApiHandlerConfig } from './base'
import { MakeswiftClient } from '../../../client'

export type ApiHandlerArgs = [NextApiRequest, NextApiResponse]
export const argsPattern = [P.any, P.any] as const

export async function config({
  req,
  res,
  client,
}: {
  req: NextApiRequest
  res: NextApiResponse
  client: MakeswiftClient
}): Promise<ApiHandlerConfig> {
  return {
    req: toApiRequest(req),
    route: validateApiRoute(await apiRequestParams(req)),
    previewCookieNames: [PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE],

    sendResponse: (apiResponse: ApiResponse): Promise<Response | void> =>
      pipeResponseTo(apiResponse, res),

    revalidationHandler: async (path?: string): Promise<void> => {
      if (path != null) {
        res.revalidate(path)
      } else {
        // No-op, Pages Router does not support tag-based revalidation
      }
    },

    customRoutes: async (route: string) => {
      if (route === '/redirect-preview') {
        return { res: await pagesRouterRedirectPreviewHandler(req, res, client) }
      }

      return null
    },
  }
}

function apiRequestParams(request: NextApiRequest): Promise<NextApiRequest['query']> {
  // `NextApiRequest.query` prop became async in Next.js 15, but it's not reflected in the type definition;
  // force-casting it to a `Promise` manually
  return Promise.resolve(request.query)
}
