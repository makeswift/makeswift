import { revalidatePath, revalidateTag } from 'next/cache'
import { P, match } from 'ts-pattern'

import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest } from 'next/server'
import { Makeswift as MakeswiftClient } from '../client'
import { MAKESWIFT_CACHE_TAG } from '../cache'

import { redirectDraftHandler } from './handlers/redirect-draft'
import { redirectPreviewHandler } from './handlers/redirect-preview'

import { MAKESWIFT_DRAFT_DATA_COOKIE, PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE } from './draft'

import {
  type ApiHandlerInternalConfig,
  type ApiHandlerUserConfig,
  createApiHandler,
} from '../../api-handler'

import { type ApiRequest, ApiResponse } from '../../api-handler/request-response'

/**
 * @deprecated This type is deprecated and will be removed in a future release.
 */
export type MakeswiftApiHandlerResponse = any

type Context = { params: { [key: string]: string | string[] } }
type ApiHandlerArgs = [NextRequest, Context] | [NextApiRequest, NextApiResponse]

type ApiHandlerConfig = Omit<ApiHandlerInternalConfig, 'client' | 'revalidationHandler'> & {
  req: ApiRequest
  route: string
  sendResponse: (res: ApiResponse) => Promise<Response | void>
  revalidationHandler: (path?: string) => Promise<void>
}

const appRouterArgsPattern = [P.instanceOf(Request), P.any] as const
const pagesRouterArgsPattern = [P.any, P.any] as const

function validateApiRoute(params: Partial<{ [key: string]: string | string[] }>): string {
  const { makeswift } = params

  if (!Array.isArray(makeswift)) {
    throw new Error(
      'The Makeswift Next.js API handler must be used in a dynamic catch-all route named `[...makeswift]`.\n' +
        `Received "${makeswift}" for the \`makeswift\` param instead.\n` +
        'Read more about dynamic catch-all routes here: https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes',
    )
  }

  return '/' + makeswift.join('/')
}

async function appRouterHandlerConfig({
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
    routeHandler: async (route: string): Promise<Response | void> => {
      if (route == '/draft') {
        return redirectDraftHandler(req, context, { apiKey })
      }
    },
    sendResponse: async (res: ApiResponse): Promise<Response | void> => res,
    revalidationHandler: async (path?: string): Promise<void> => {
      if (path != null) {
        revalidatePath(path)
      } else {
        revalidateTag(MAKESWIFT_CACHE_TAG)
      }
    },
  }
}

function apiRequestParams(request: NextApiRequest): Promise<NextApiRequest['query']> {
  // `NextApiRequest.query` prop became async in Next.js 15, but it's not reflected in the type definition;
  // force-casting it to a `Promise` manually
  return Promise.resolve(request.query)
}

function requestHeaders(headers: NextApiRequest['headers']): Headers {
  const result = new Headers()
  for (const [key, value] of Object.entries(headers)) {
    if (value != null) {
      if (Array.isArray(value)) {
        value.forEach(v => result.append(key, v))
      } else {
        result.append(key, value)
      }
    }
  }

  return result
}

async function pipeTo(stream: ReadableStream<Uint8Array>, res: NextApiResponse): Promise<void> {
  try {
    const reader = stream.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(value)
    }
  } catch (error) {
    res.destroy(error instanceof Error ? error : new Error(`${error}`))
  }
}

async function pagesRouterHandlerConfig({
  req,
  res,
  apiKey,
}: {
  req: NextApiRequest
  res: NextApiResponse
  apiKey: string
}): Promise<ApiHandlerConfig> {
  return {
    req: {
      headers: requestHeaders(req.headers),
      method: req.method ?? 'GET',
      url: req.url ?? '',
      json() {
        return req.body
      },
    },
    route: validateApiRoute(await apiRequestParams(req)),
    manifest: {
      previewMode: true,
    },
    draftCookieNames: [PRERENDER_BYPASS_COOKIE, PREVIEW_DATA_COOKIE],
    routeHandler: async (route: string): Promise<Response | void> => {
      if (route == '/preview') {
        return redirectPreviewHandler(req, res, { apiKey })
      }
    },
    sendResponse: async (apiResponse: ApiResponse): Promise<Response | void> => {
      apiResponse.headers.forEach((value, key) => res.setHeader(key, value))
      res.status(apiResponse.status)

      if (apiResponse.body) {
        await pipeTo(apiResponse.body, res)
      }

      res.end()
    },
    revalidationHandler: async (path?: string): Promise<void> => {
      if (path != null) {
        res.revalidate(path)
      } else {
        revalidateTag(MAKESWIFT_CACHE_TAG)
      }
    },
  }
}

export function MakeswiftApiHandler(
  apiKey: string,
  { apiOrigin, runtime, ...userConfig }: ApiHandlerUserConfig,
): (...args: ApiHandlerArgs) => Promise<Response | void> {
  const client = new MakeswiftClient(apiKey, { apiOrigin, runtime })

  return async function handler(...args: ApiHandlerArgs): Promise<Response | void> {
    const { req, route, sendResponse, ...handlerConfig } = await match(args)
      .with(appRouterArgsPattern, ([req, context]) =>
        appRouterHandlerConfig({ req, context, apiKey }),
      )
      .with(pagesRouterArgsPattern, ([req, res]) => pagesRouterHandlerConfig({ req, res, apiKey }))
      .exhaustive()

    const apiHandler = createApiHandler(apiKey, {
      ...userConfig,
      ...handlerConfig,
      runtime,
      client,
    })

    return sendResponse(await apiHandler(req, route))
  }
}
