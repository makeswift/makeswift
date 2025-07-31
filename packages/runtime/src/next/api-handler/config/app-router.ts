import { P } from 'ts-pattern'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

import { MAKESWIFT_CACHE_TAG } from '../../cache'
import { type ApiResponse } from '../../../api-handler/request-response'

import { appRouterRedirectDraftHandler } from '../handlers/app-router-redirect-draft'
import { MAKESWIFT_VERSION_DATA_COOKIE, PRERENDER_BYPASS_COOKIE } from '../draft'

import { validateApiRoute, type ApiHandlerConfig } from './base'
import { MakeswiftClient } from '../../../client'

type Context = { params: { [key: string]: string | string[] } }

export type ApiHandlerArgs = [NextRequest, Context]
export const argsPattern = [P.instanceOf(Request), P.any] as const

export async function config({
  req,
  context,
  apiKey: _apiKey,
  client,
}: {
  req: NextRequest
  context: Context
  apiKey: string
  client: MakeswiftClient
}): Promise<ApiHandlerConfig> {
  return {
    req,
    route: validateApiRoute(await context.params),
    manifest: {},
    draftCookieNames: [PRERENDER_BYPASS_COOKIE, MAKESWIFT_VERSION_DATA_COOKIE],
    sendResponse: async (res: ApiResponse): Promise<Response | void> => res,
    revalidationHandler: async (path?: string): Promise<void> => {
      if (path != null) {
        revalidatePath(path)
      } else {
        revalidateTag(MAKESWIFT_CACHE_TAG)
      }
    },
    customRoutes: async (route: string) => {
      if (route === '/redirect-draft') {
        return { res: await appRouterRedirectDraftHandler(req, context, client) }
      }

      return null
    },
  }
}
