import { P } from 'ts-pattern'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

import { MAKESWIFT_CACHE_TAG } from '../../cache'
import { type ApiResponse } from '../../../api-handler/request-response'

import { appRouterRedirectPreviewHandler } from '../handlers/app-router-redirect-preview'
import { MAKESWIFT_SITE_VERSION_COOKIE, PRERENDER_BYPASS_COOKIE } from '../preview'

import { validateApiRoute, type ApiHandlerConfig } from './base'
import { MakeswiftClient } from '../../../client'

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
    previewCookieNames: [PRERENDER_BYPASS_COOKIE, MAKESWIFT_SITE_VERSION_COOKIE],
    sendResponse: async (res: ApiResponse): Promise<Response | void> => res,
    revalidationHandler: async (path?: string): Promise<void> => {
      console.log('[App router handler] called', path)
      if (path != null) {
        console.log('[App router handler] calling revalidate path', path)
        revalidatePath(path)
      } else {
        console.log('[App router handler] calling revalidate tag')
        revalidateTag(MAKESWIFT_CACHE_TAG)
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
