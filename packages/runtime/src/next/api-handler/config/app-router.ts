import { P } from 'ts-pattern'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

import { type ApiResponse } from '../../../api-handler/request-response'

import { appRouterRedirectPreviewHandler } from '../handlers/app-router-redirect-preview'
import { MAKESWIFT_SITE_VERSION_COOKIE, PRERENDER_BYPASS_COOKIE } from '../preview'

import { validateApiRoute, type ApiHandlerConfig } from './base'
import { MakeswiftClient } from '../../../client'

type Params = { [key: string]: string | string[] }
type Context = { params: Promise<Params> }

export type ApiHandlerArgs = [NextRequest, Context]
export const argsPattern = [P.instanceOf(NextRequest), P.any] as const

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
    previewCookieNames: [PRERENDER_BYPASS_COOKIE, MAKESWIFT_SITE_VERSION_COOKIE],
    sendResponse: async (res: ApiResponse): Promise<Response | void> => res,
    revalidationHandler: async (path?: string, cacheTags?: string[]): Promise<void> => {
      if (path != null) {
        console.log({ location: 'revalidatePath', path })
        revalidatePath(path)
      } else {
        console.log({ location: 'revalidateTag', cacheTags })
        if (cacheTags) {
          for (const cacheTag of cacheTags) {
            revalidateTag(cacheTag)
          }
        }
      }
    },
    customRoutes: async (route: string) => {
      if (route === '/redirect-preview') {
        return { res: await appRouterRedirectPreviewHandler(req, context, client) }
      }

      return null
    },
  }
}
