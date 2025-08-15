import { P } from 'ts-pattern'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

import { MAKESWIFT_CACHE_TAG } from '../../cache'
import { type ApiResponse } from '../../../api-handler/request-response'

import { appRouterRedirectPreviewHandler } from '../handlers/app-router-redirect-preview'

import { validateApiRoute, type ApiHandlerConfig } from './base'
import { MakeswiftClient } from '../../../client'
import { appRouterRedirectLiveHandler } from '../handlers/app-router-redirect-live'

type Context = { params: { [key: string]: string | string[] } }

export type ApiHandlerArgs = [NextRequest, Context]
export const argsPattern = [P.instanceOf(Request), P.any] as const

export async function config({
  req,
  context,
  client,
}: {
  req: NextRequest
  context: Context
  client: MakeswiftClient
}): Promise<ApiHandlerConfig> {
  return {
    req,
    route: validateApiRoute(await context.params),
    manifest: {},
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
        return { res: await appRouterRedirectPreviewHandler(req, context, client) }
      } else if (route === '/redirect-live') {
        return { res: await appRouterRedirectLiveHandler(req, context) }
      }

      return null
    },
  }
}
