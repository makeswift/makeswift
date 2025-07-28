import { P } from 'ts-pattern'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

import { MAKESWIFT_CACHE_TAG } from '../../cache'
import { type ApiResponse } from '../../../api-handler/request-response'

import { redirectDraftHandler } from '../handlers/redirect-draft'
import { MAKESWIFT_DRAFT_DATA_COOKIE, PRERENDER_BYPASS_COOKIE } from '../draft'

import { validateApiRoute, type ApiHandlerConfig } from './base'

type Context = { params: { [key: string]: string | string[] } }

export type ApiHandlerArgs = [NextRequest, Context]
export const argsPattern = [P.instanceOf(Request), P.any] as const

export async function config({
  req,
  context,
  apiKey,
}: {
  req: NextRequest
  context: Context
  apiKey: string
}): Promise<ApiHandlerConfig> {
  return {
    req,
    route: validateApiRoute(await context.params),
    manifest: {
      draftMode: true,
    },
    draftCookieNames: [PRERENDER_BYPASS_COOKIE, MAKESWIFT_DRAFT_DATA_COOKIE],
    sendResponse: async (res: ApiResponse): Promise<Response | void> => res,
    revalidationHandler: async (path?: string): Promise<void> => {
      if (path != null) {
        revalidatePath(path)
      } else {
        revalidateTag(MAKESWIFT_CACHE_TAG)
      }
    },
    customRoutes: async (route: string) => {
      if (route === '/draft') {
        return { res: await redirectDraftHandler(req, context, { apiKey }) }
      }

      return null
    },
  }
}
